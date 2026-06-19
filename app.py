import os, sys, re, math, json, hashlib, subprocess, tempfile, struct
from datetime import datetime
from pathlib import Path
from flask import Flask, render_template, request, jsonify
import psutil

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024

KNOWN_BAD_HASHES = set()
bh_path = Path(__file__).parent / 'known_bad_hashes.txt'
if bh_path.exists():
    with open(bh_path) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                KNOWN_BAD_HASHES.add(line.lower())

SUSPICIOUS_STRINGS = [
    (r'[A-Za-z0-9+/]{40,}={0,2}', 'base64-blob'),
    (r'PowerShell|powershell|pwsh', 'powershell-ref'),
    (r'(Invoke-|Start-Process|New-Object)', 'powershell-cmdlet'),
    (r'cmd\.exe|cmd /c', 'cmd-invoke'),
    (r'(WScript\.|Shell\.|ActiveXObject)', 'wsh-usage'),
    (r'https?://\S+', 'url-string'),
    (r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', 'ip-address'),
    (r'HK[UC][LM]\\[A-Za-z0-9_\\]+', 'registry-key'),
    (r'(CreateRemoteThread|VirtualAllocEx|WriteProcessMemory)', 'win32-injection'),
    (r'(Reflection\.Assembly|FromBase64String)', 'dotnet-reflection'),
    (r'(VBA|Auto_Open|Workbook_Open|Document_Open)', 'vba-macro'),
    (r'(chmod|chown|/etc/|/usr/bin/)', 'nix-system-path'),
    (r'(ransom|locker|crypt|cryptolocker|trojan|dropper)', 'malware-keyword'),
    (r'(Add-Type|Load\(|System\.Runtime\.InteropServices)', 'dotnet-interop'),
    (r'(cmd\.exe\s+/c\s+(curl|wget|bitsadmin))', 'lolbin-download'),
]

SUSPICIOUS_EXTS = {'.exe','.dll','.scr','.com','.bat','.cmd','.vbs','.vbe','.js','.ps1','.psm1','.msi','.hta','.jar'}

FILE_SIGS = {
    b'\x25\x50\x44\x46': '.pdf',
    b'\x89\x50\x4E\x47': '.png',
    b'\xFF\xD8\xFF': ['.jpg','.jpeg'],
    b'\x47\x49\x46\x38': '.gif',
    b'\x42\x4D': '.bmp',
    b'\x50\x4B\x03\x04': ['.zip','.docx','.xlsx','.pptx','.jar','.odt'],
    b'\x4D\x5A': ['.exe','.dll','.scr','.com','.pif','.sys'],
    b'\x7F\x45\x4C\x46': ['.elf','.so'],
    b'\xCA\xFE\xBA\xBE': '.class',
    b'\x1F\x8B': '.gz',
    b'\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1': ['.doc','.xls','.ppt'],
}

def entropy(data):
    if not data: return 0
    c = [0]*256
    for b in data: c[b] += 1
    e = 0.0
    for n in c:
        if n:
            p = n/len(data)
            e -= p * math.log2(p)
    return round(e, 2)

def check_sig_mismatch(path, orig_name):
    with open(path, 'rb') as f:
        hdr = f.read(16)
    ext = Path(orig_name).suffix.lower()
    for magic, expected in FILE_SIGS.items():
        if hdr.startswith(magic):
            if isinstance(expected, list):
                if ext not in expected:
                    return True, ext, expected
            else:
                if ext != expected:
                    return True, ext, expected
            return False, None, None
    return False, None, None

def find_suspicious_strings(data):
    try: text = data.decode('utf-8', errors='replace')
    except: text = data.decode('latin-1', errors='replace')
    results = []
    for pat, label in SUSPICIOUS_STRINGS:
        for m in re.findall(pat, text, re.IGNORECASE)[:3]:
            results.append((label, m[:80]))
    return results

def analyze_script_content(data, ext):
    try: text = data.decode('utf-8', errors='replace')
    except: text = data.decode('latin-1', errors='replace')
    hits = []
    if ext in ('.ps1','.psm1'):
        checks = [
            (r'-EncodedCommand', 'encoded-command'),
            (r'DownloadString|DownloadFile|WebClient', 'network-download'),
            (r'-WindowStyle\s+Hidden', 'hidden-exec'),
            (r'Invoke-Mimikatz|Invoke-ReflectivePEInjection', 'known-attack-tool'),
            (r'FromBase64String|System\.Convert', 'base64-reflection'),
            (r'Start-Process.*RunAs', 'process-elevation'),
        ]
    elif ext in ('.bat','.cmd'):
        checks = [
            (r'reg\s+add|regedit', 'registry-mod'),
            (r'vssadmin|bcdedit', 'defense-evasion'),
            (r'(powershell|mshta|rundll32)', 'lolbin-usage'),
            (r'attrib\s+\+h', 'hide-file'),
        ]
    elif ext in ('.vbs','.vbe'):
        checks = [
            (r'CreateObject\("WScript\.Shell"\)', 'wsh-shell'),
            (r'\.Run\s|\.Exec\s', 'proc-exec'),
            (r'FileSystemObject', 'fs-access'),
        ]
    elif ext in ('.js','.jse','.hta'):
        checks = [
            (r'(WScript\.Shell|ActiveXObject)', 'activex-usage'),
            (r'eval\s*\(', 'eval-usage'),
            (r'(unescape|decodeURIComponent)\s*\(', 'obfuscation'),
        ]
    else:
        return hits
    for pat, label in checks:
        if re.search(pat, text, re.IGNORECASE):
            hits.append(label)
    return hits

def calc_risk(findings):
    if not findings: return 0
    s = 0
    for f in findings:
        r = f.get('risk','')
        s += 25 if r == 'threat' else 10 if r == 'suspicious' else 4 if r == 'warning' else 0
    return min(s, 100)

def risk_label(s):
    if s >= 70: return 'threat'
    if s >= 35: return 'suspicious'
    if s > 0: return 'warning'
    return 'clean'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze-file', methods=['POST'])
def analyze_file():
    if 'file' not in request.files:
        return jsonify({'error': 'no-file'}), 400
    f = request.files['file']
    if f.filename == '':
        return jsonify({'error': 'no-file-selected'}), 400

    tmp = tempfile.NamedTemporaryFile(delete=False)
    try:
        f.save(tmp.name)
        tmp.close()
        name = f.filename
        ext = Path(name).suffix.lower()
        with open(tmp.name, 'rb') as fh:
            data = fh.read()

        md5 = hashlib.md5(data).hexdigest()
        sha = hashlib.sha256(data).hexdigest()

        findings = []

        if md5 in KNOWN_BAD_HASHES or sha in KNOWN_BAD_HASHES:
            findings.append({'type':'known-bad-hash','detail':f'MD5={md5} SHA256={sha}','risk':'threat','action':'vt'})

        mismatch, fext, reals = check_sig_mismatch(tmp.name, name)
        if mismatch:
            if isinstance(reals, list):
                findings.append({'type':'signature-mismatch','detail':f'ext={fext} actual={reals}','risk':'threat','action':'info'})
            else:
                findings.append({'type':'signature-mismatch','detail':f'ext={fext} actual={reals}','risk':'threat','action':'info'})

        ent = entropy(data)
        if ent > 7.5:
            findings.append({'type':'high-entropy','detail':f'entropy={ent}','risk':'suspicious','action':'vt'})
        elif ent > 6.5:
            findings.append({'type':'elevated-entropy','detail':f'entropy={ent}','risk':'warning','action':'info'})

        strings = find_suspicious_strings(data)
        if strings:
            lines = [f'{l}:{m}' for l,m in strings[:8]]
            findings.append({'type':'suspicious-strings','detail':'\n'.join(lines),'risk':'warning' if len(strings)<3 else 'suspicious','action':'info'})

        if ext in ('.docx','.xlsx'):
            macro_detected = False
            macro_msg = ''
            try:
                if ext == '.docx':
                    import docx
                    doc = docx.Document(tmp.name)
                    for para in doc.paragraphs:
                        for term in ['Auto_Open','Workbook_Open','Document_Open','VBA','CreateObject']:
                            if term.lower() in para.text.lower():
                                macro_detected = True
                                macro_msg = f'macro-text:{para.text[:80]}'
                                break
                        if macro_detected: break
                elif ext == '.xlsx':
                    import openpyxl
                    wb = openpyxl.load_workbook(tmp.name, keep_vba=True)
                    if wb.vba_project:
                        macro_detected = True
                        macro_msg = 'vba-project-detected'
            except: pass
            if macro_detected:
                findings.append({'type':'macro-detected','detail':macro_msg,'risk':'suspicious','action':'info'})

        if ext in ('.ps1','.psm1','.bat','.cmd','.vbs','.vbe','.js','.jse','.hta'):
            script_hits = analyze_script_content(data, ext)
            if script_hits:
                findings.append({'type':'suspicious-script','detail':'\n'.join(script_hits),'risk':'suspicious','action':'info'})

        score = calc_risk(findings)
        return jsonify({
            'filename': name, 'md5': md5, 'sha256': sha,
            'entropy': ent, 'size': len(data),
            'findings': findings,
            'risk_score': score, 'risk_label': risk_label(score),
        })
    finally:
        try: os.unlink(tmp.name)
        except: pass

@app.route('/api/scan-system', methods=['POST'])
def scan_system():
    findings = []
    win = sys.platform == 'win32'

    # processes
    lolbins = {'powershell.exe','cmd.exe','wscript.exe','cscript.exe','mshta.exe','rundll32.exe','regsvr32.exe'}
    system_roots = ['c:\\windows','c:\\program files','/usr','/bin','/sbin','/opt','/system']
    for proc in psutil.process_iter(['pid','name','exe']):
        try:
            pinfo = proc.info
            name = (pinfo['name'] or '').lower()
            exe = (pinfo['exe'] or '').lower()
            pid = pinfo['pid']
            flagged = False

            if name in lolbins and exe:
                if not any(exe.startswith(r) for r in system_roots):
                    findings.append({'type':'unusual-lolbin','detail':f'{name} pid={pid} path={exe}','risk':'suspicious','action':'kill','pid':pid})
                    flagged = True

            if not flagged and name and exe:
                if not any(exe.startswith(r) for r in system_roots):
                    if Path(pinfo['exe']).suffix.lower() in ('.scr','.pif'):
                        findings.append({'type':'unusual-process','detail':f'{name} pid={pid} path={exe}','risk':'suspicious','action':'kill','pid':pid})
        except (psutil.NoSuchProcess, psutil.AccessDenied): pass

    # startup entries
    if win:
        startup_keys = [
            r'HKCU\Software\Microsoft\Windows\CurrentVersion\Run',
            r'HKLM\Software\Microsoft\Windows\CurrentVersion\Run',
        ]
        for sk in startup_keys:
            try:
                r = subprocess.run(['reg','query',sk], capture_output=True, text=True, timeout=5)
                if r.returncode == 0:
                    for line in r.stdout.split('\n'):
                        line = line.strip()
                        if line and not line.startswith('HKEY') and not line.startswith(' ') and not line.startswith('(val'):
                            findings.append({'type':'startup-entry','detail':f'{sk} -> {line}','risk':'warning','action':'disable_startup','reg_path':sk,'entry':line})
            except: pass

    # persistence check (limited scope, no System32)
    if win:
        appd = os.environ.get('APPDATA','')
        paths = [
            (appd, 'AppData'),
            (os.path.join(appd, 'Microsoft\\Windows\\Start Menu\\Programs\\Startup'), 'StartupFolder'),
        ]
    else:
        paths = [('/tmp','/tmp'), ('/var/tmp','/var/tmp'), (os.path.expanduser('~/.config'),'config')]
    for pdir, label in paths:
        if not pdir or not os.path.isdir(pdir): continue
        try:
            for entry in os.listdir(pdir)[:100]:
                fp = os.path.join(pdir, entry)
                if os.path.isfile(fp) and Path(entry).suffix.lower() in SUSPICIOUS_EXTS:
                    findings.append({'type':'persistence-path','detail':f'{label}:{fp}','risk':'suspicious','action':'delete'})
        except: pass

    # network
    suspicious_ports = {22,23,25,53,110,135,137,139,143,445,1433,3306,3389,4444,5555,6666,6667,8443,31337}
    try:
        for conn in psutil.net_connections():
            try:
                if conn.status == 'LISTEN' and conn.laddr and conn.laddr.port in suspicious_ports:
                    findings.append({'type':'suspicious-port','detail':f'port={conn.laddr.port} listening pid={conn.pid}','risk':'warning','action':'info'})
                if conn.raddr and conn.raddr.port in suspicious_ports and not conn.raddr.ip.startswith(('127.','10.','192.168.','172.')):
                    findings.append({'type':'suspicious-connection','detail':f'remote={conn.raddr.ip}:{conn.raddr.port} pid={conn.pid}','risk':'suspicious','action':'info'})
            except: pass
    except: pass

    # recent files in temp
    if win:
        tdirs = [os.environ.get('TEMP',''), os.environ.get('LOCALAPPDATA','')]
    else:
        tdirs = ['/tmp','/var/tmp']
    cutoff = datetime.now().timestamp() - 86400
    for tdir in tdirs:
        if not tdir or not os.path.isdir(tdir): continue
        try:
            for entry in os.listdir(tdir)[:200]:
                fp = os.path.join(tdir, entry)
                try:
                    if os.path.isfile(fp) and os.path.getmtime(fp) > cutoff:
                        if Path(entry).suffix.lower() in SUSPICIOUS_EXTS:
                            findings.append({'type':'recent-suspicious-file','detail':f'{fp} modified-24h','risk':'suspicious','action':'delete'})
                except: pass
        except: pass

    score = calc_risk(findings)
    return jsonify({'findings':findings,'risk_score':score,'risk_label':risk_label(score),'system':sys.platform})

@app.route('/api/kill-process', methods=['POST'])
def kill_process():
    pid = request.get_json().get('pid')
    if not pid: return jsonify({'error':'no-pid'}),400
    try:
        p = psutil.Process(pid)
        p.terminate(); p.wait(timeout=3)
        return jsonify({'success':True,'message':f'terminated pid {pid}'})
    except psutil.NoSuchProcess: return jsonify({'error':'not-found'}),404
    except Exception as e: return jsonify({'error':str(e)}),500

@app.route('/api/delete-file', methods=['POST'])
def delete_file():
    path = request.get_json().get('path')
    if not path: return jsonify({'error':'no-path'}),400
    try:
        p = request.get_json().get('path','')
        if not p: return jsonify({'error':'no-path'}),400
        os.remove(p)
        return jsonify({'success':True,'message':f'deleted {p}'})
    except Exception as e: return jsonify({'error':str(e)}),500

@app.route('/api/disable-startup', methods=['POST'])
def disable_startup():
    data = request.get_json()
    reg_path = data.get('reg_path','')
    entry_name = data.get('entry','').split('    ')[0].strip() if data.get('entry') else ''
    if not reg_path or not entry_name: return jsonify({'error':'invalid'}),400
    try:
        subprocess.run(['reg','delete',reg_path,'/v',entry_name,'/f'], capture_output=True, timeout=5)
        return jsonify({'success':True,'message':f'disabled startup: {entry_name}'})
    except Exception as e: return jsonify({'error':str(e)}),500

@app.route('/api/health')
def health():
    return jsonify({'status':'ok','mode':'offline'})

if __name__ == '__main__':
    print('='*50)
    print('  SENTINEL - Local Malware Analyzer')
    print('  http://localhost:5000')
    print('  Offline mode - no data leaves your machine')
    print('='*50)
    app.run(host='127.0.0.1', port=5000, debug=False)
