import os
import sys
import re
import math
import json
import hashlib
import subprocess
import tempfile
import shutil
import struct
import base64
from datetime import datetime
from pathlib import Path

from flask import Flask, render_template, request, jsonify, send_file
import psutil

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB

KNOWN_BAD_HASHES = set()
BAD_HASHES_PATH = Path(__file__).parent / 'known_bad_hashes.txt'
if BAD_HASHES_PATH.exists():
    with open(BAD_HASHES_PATH) as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                KNOWN_BAD_HASHES.add(line.lower())

SUSPICIOUS_STRINGS = [
    (r'[A-Za-z0-9+/]{40,}={0,2}', 'Base64 blob (possible encoded payload)'),
    (r'PowerShell|powershell|pwsh', 'PowerShell command'),
    (r'(Get-Process|Invoke-|Start-Process|New-Object)', 'PowerShell cmdlet'),
    (r'CMD\.EXE|cmd\.exe|cmd /c', 'CMD invocation'),
    (r'(WScript\.|Shell\.|ActiveXObject)', 'Windows Script Host'),
    (r'(http|https|ftp)://\S+', 'URL string'),
    (r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', 'IP address'),
    (r'HK(?:CU|LM)\\[A-Za-z0-9_\\]+', 'Registry key'),
    (r'(eval|exec|base64_decode|gzinflate|str_rot13)', 'Suspicious PHP/JS function'),
    (r'(CreateRemoteThread|VirtualAlloc|WriteProcessMemory)', 'Win32 API (process injection)'),
    (r'(Add-Type|Reflection\.Assembly|Load\(|FromBase64String)', '.NET reflection / assembly load'),
    (r'(VBA|Auto_Open|Workbook_Open|Document_Open)', 'VBA macro indicator'),
    (r'(chmod|chown|/dev/|/etc/|/usr/bin/)', 'Linux system path'),
    (r'(yaml|cymru|ransom|locker|crypt|trojan|dropper)', 'Suspicious keyword'),
    (r'\b(?:[a-f0-9]{32}|[A-F0-9]{32})\b', 'MD5 hash string'),
]

SUSPICIOUS_EXTENSIONS = [
    '.exe', '.dll', '.scr', '.com', '.pif', '.bat', '.cmd', '.vbs',
    '.vbe', '.js', '.jse', '.wsf', '.wsh', '.ps1', '.psm1', '.psd1',
    '.msi', '.msp', '.mst', '.jar', '.hta', '.cpp', '.py', '.pl',
    '.rb', '.sh', '.bash', '.php', '.asp', '.aspx',
]

FILE_SIGNATURES = {
    b'\x25\x50\x44\x46': '.pdf',
    b'\x89\x50\x4E\x47': '.png',
    b'\xFF\xD8\xFF': '.jpg',
    b'\x47\x49\x46\x38': '.gif',
    b'\x42\x4D': '.bmp',
    b'\x50\x4B\x03\x04': ['.zip', '.docx', '.xlsx', '.pptx', '.jar', '.odt'],
    b'\x4D\x5A': ['.exe', '.dll', '.scr', '.com', '.pif'],
    b'\x7F\x45\x4C\x46': ['.elf', '.so', '.o'],
    b'\xCA\xFE\xBA\xBE': '.class',
    b'\x25\x21': '.bat',
    b'\x23\x21': '.sh',
    b'\xEF\xBB\xBF': '.txt',
    b'\x1F\x8B': '.gz',
    b'\x52\x61\x72\x21\x1A\x07': '.rar',
    b'\x49\x44\x33': '.mp3',
    b'\x66\x74\x79\x70': ['.mp4', '.mov'],
    b'\xD0\xCF\x11\xE0\xA1\xB1\x1A\xE1': ['.doc', '.xls', '.ppt', '.msg'],
}

MACRO_DETECTION_TERMS = [
    'Auto_Open', 'AutoOpen', 'Workbook_Open', 'Document_Open',
    'Auto_Close', 'Workbook_BeforeClose', 'Document_Close',
    'VBA', 'Module', 'ClassModule', 'Sub ', 'Function ',
    'Shell ', 'CreateObject', 'GetObject',
]

PLAINTEXT_EXTENSIONS = {'.txt', '.log', '.csv', '.json', '.xml', '.yml', '.yaml', '.md', '.ini', '.cfg', '.conf'}

# ── Helpers ───────────────────────────────────────────────

def entropy(data):
    if not data:
        return 0
    counts = [0] * 256
    for byte in data:
        counts[byte] += 1
    ent = 0
    for count in counts:
        if count == 0:
            continue
        p = count / len(data)
        ent -= p * math.log2(p)
    return round(ent, 2)

def file_signature_mismatch(filepath, original_name):
    with open(filepath, 'rb') as f:
        header = f.read(16)
    ext = Path(original_name).suffix.lower()
    for magic, expected_exts in FILE_SIGNATURES.items():
        if header.startswith(magic):
            if isinstance(expected_exts, list):
                if ext not in expected_exts:
                    return True, f"Signature {magic.hex()} matches {expected_exts} but file is {ext}"
            else:
                if ext != expected_exts:
                    return True, f"Signature {magic.hex()} indicates {expected_exts} but file is {ext}"
            return False, None
    if ext in SUSPICIOUS_EXTENSIONS:
        return False, None
    return False, None

def scan_suspicious_strings(data: bytes):
    try:
        text = data.decode('utf-8', errors='replace')
    except Exception:
        text = data.decode('latin-1', errors='replace')
    findings = []
    for pattern, desc in SUSPICIOUS_STRINGS:
        matches = re.findall(pattern, text, re.IGNORECASE)
        for m in matches[:5]:
            findings.append({'pattern': desc, 'match': m[:120]})
    return findings

def detect_macros(filepath, original_name):
    ext = Path(original_name).suffix.lower()
    if ext == '.docx':
        try:
            import docx
            doc = docx.Document(filepath)
            for para in doc.paragraphs:
                for term in MACRO_DETECTION_TERMS:
                    if term.lower() in para.text.lower():
                        return True, f"Macro-related text found: '{para.text[:100]}'"
            if doc.part.package.parts:
                for part in doc.part.package.parts:
                    if 'vba' in part.partname.lower() or 'macro' in part.partname.lower():
                        return True, f"VBA/Macro part found: {part.partname}"
        except Exception:
            pass
    if ext == '.xlsx':
        try:
            import openpyxl
            wb = openpyxl.load_workbook(filepath, keep_vba=True)
            if wb.vba_project:
                return True, "VBA project detected in workbook"
        except Exception:
            pass
    return False, None

def analyze_script(data: bytes, ext: str):
    findings = []
    try:
        text = data.decode('utf-8', errors='replace')
    except Exception:
        text = data.decode('latin-1', errors='replace')
    lines = text.split('\n')
    if ext in {'.ps1', '.psm1'}:
        patterns = [
            (r'-EncodedCommand\s', 'Encoded command execution'),
            (r'DownloadString|DownloadFile|WebClient', 'Network download'),
            (r'-WindowStyle\s+Hidden', 'Hidden window execution'),
            (r'Invoke-Mimikatz|Invoke-ReflectivePEInjection', 'Known attack tool'),
            (r'FromBase64String|\[System\.Convert\]', 'Base64 decode / reflection'),
            (r'Start-Process.+-\w+Verb\s+RunAs', 'Process elevation'),
        ]
        for pat, desc in patterns:
            if re.search(pat, text, re.IGNORECASE):
                findings.append(desc)
    elif ext in {'.bat', '.cmd'}:
        patterns = [
            (r'@echo off', 'Hides output'),
            (r'(reg\s+add|regedit)', 'Registry modification'),
            (r'(attrib\s+\+h|attrib\s+-h)', 'Hidden attribute toggle'),
            (r'(vssadmin|bcdedit|wmic)', 'System utility (potential defense evasion)'),
            (r'(powershell|mshta|rundll32)', 'Living-off-the-land binary usage'),
        ]
        for pat, desc in patterns:
            if re.search(pat, text, re.IGNORECASE):
                findings.append(desc)
    elif ext in {'.vbs', '.vbe'}:
        patterns = [
            (r'CreateObject\("WScript\.Shell"\)', 'WSH Shell creation'),
            (r'\.Run\s', 'Process execution'),
            (r'\.Exec\s', 'Process execution'),
            (r'FileSystemObject', 'File system access'),
        ]
        for pat, desc in patterns:
            if re.search(pat, text, re.IGNORECASE):
                findings.append(desc)
    elif ext in {'.js', '.jse'}:
        patterns = [
            (r'(WScript\.Shell|new ActiveXObject)', 'ActiveX / WScript usage'),
            (r'(eval\s*\()', 'Dynamic code evaluation'),
            (r'(unescape|decodeURIComponent)\s*\(', 'Obfuscation pattern'),
        ]
        for pat, desc in patterns:
            if re.search(pat, text, re.IGNORECASE):
                findings.append(desc)
    return findings

def risk_score(findings):
    if not findings:
        return 0
    score = 0
    for f in findings:
        risk = f.get('risk', 'clean')
        if risk == 'threat':
            score += 20
        elif risk == 'suspicious':
            score += 8
        elif risk == 'warning':
            score += 4
    return min(score, 100)

def risk_label(score):
    if score >= 70:
        return 'threat'
    elif score >= 30:
        return 'suspicious'
    elif score > 0:
        return 'warning'
    return 'clean'

# ── Routes ─────────────────────────────────────────────────

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/analyze-file', methods=['POST'])
def analyze_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400

    tmp = tempfile.NamedTemporaryFile(delete=False)
    try:
        file.save(tmp.name)
        tmp.close()
        original_name = file.filename
        findings = []
        ext = Path(original_name).suffix.lower()

        # Hash computation
        with open(tmp.name, 'rb') as f:
            data = f.read()
        md5_hash = hashlib.md5(data).hexdigest()
        sha256_hash = hashlib.sha256(data).hexdigest()

        # Known bad hash check
        if md5_hash in KNOWN_BAD_HASHES or sha256_hash in KNOWN_BAD_HASHES:
            findings.append({
                'type': 'Known Bad Hash',
                'detail': f'MD5: {md5_hash}\nSHA256: {sha256_hash}',
                'risk': 'threat',
                'action': 'check_vt'
            })

        # Signature mismatch
        mismatch, msg = file_signature_mismatch(tmp.name, original_name)
        if mismatch:
            findings.append({
                'type': 'Signature Mismatch',
                'detail': msg,
                'risk': 'threat',
                'action': 'delete'
            })

        # Entropy
        ent = entropy(data)
        if ent > 7.5:
            findings.append({
                'type': 'High Entropy',
                'detail': f'Entropy: {ent} (possible packed/encrypted)',
                'risk': 'suspicious',
                'action': 'check_vt'
            })
        elif ent > 6.5:
            findings.append({
                'type': 'Elevated Entropy',
                'detail': f'Entropy: {ent}',
                'risk': 'warning',
                'action': None
            })

        # Suspicious strings
        strings = scan_suspicious_strings(data)
        if strings:
            detail_lines = [f"{s['pattern']}: {s['match']}" for s in strings[:10]]
            findings.append({
                'type': 'Suspicious Strings',
                'detail': '\n'.join(detail_lines),
                'risk': 'suspicious' if len(strings) > 2 else 'warning',
                'action': 'delete'
            })

        # Macro detection
        has_macro, macro_detail = detect_macros(tmp.name, original_name)
        if has_macro:
            findings.append({
                'type': 'Macro Detected',
                'detail': macro_detail,
                'risk': 'suspicious',
                'action': 'delete'
            })

        # Script analysis
        if ext in {'.ps1', '.psm1', '.bat', '.cmd', '.vbs', '.vbe', '.js', '.jse'}:
            script_findings = analyze_script(data, ext)
            if script_findings:
                findings.append({
                    'type': f'Suspicious Script ({ext})',
                    'detail': '\n'.join(script_findings),
                    'risk': 'suspicious',
                    'action': 'delete'
                })

        overall_risk = risk_score(findings)
        overall_label = risk_label(overall_risk)

        return jsonify({
            'filename': original_name,
            'md5': md5_hash,
            'sha256': sha256_hash,
            'entropy': ent,
            'size': len(data),
            'findings': findings,
            'risk_score': overall_risk,
            'risk_label': overall_label,
        })
    finally:
        try:
            os.unlink(tmp.name)
        except Exception:
            pass

@app.route('/api/scan-system', methods=['POST'])
def scan_system():
    findings = []

    # ── Running processes ──
    suspicious_names = [
        'powershell.exe', 'cmd.exe', 'wscript.exe', 'cscript.exe', 'mshta.exe',
        'rundll32.exe', 'regsvr32.exe', 'taskkill.exe', 'vssadmin.exe',
    ]
    for proc in psutil.process_iter(['pid', 'name', 'exe', 'cmdline']):
        try:
            pinfo = proc.info
            name = (pinfo['name'] or '').lower()
            exe = pinfo['exe'] or ''
            pid = pinfo['pid']

            proc_path = Path(exe) if exe else None
            risk = None
            detail = None

            if name in {'wscript.exe', 'cscript.exe', 'mshta.exe', 'regsvr32.exe', 'rundll32.exe'}:
                if proc_path and not str(proc_path).startswith(str(Path(os.environ.get('SystemRoot', 'C:\\Windows')))):
                    risk = 'suspicious'
                    detail = f'Known LOLBIN running from non-system directory: {exe}'

            if proc_path and proc_path.suffix.lower() in {'.scr', '.pif'}:
                risk = 'suspicious'
                detail = f'Unusual executable type running: {exe}'

            if exe and not exe.lower().startswith(('c:\\windows', 'c:\\program files', '/usr', '/bin', '/sbin', '/opt')):
                if risk is None:
                    risk = 'warning'
                    detail = f'Process running from unusual path: {exe}'

            if risk:
                findings.append({
                    'type': f'Process: {name}',
                    'detail': detail or f'PID: {pid}',
                    'risk': risk,
                    'action': 'kill_process',
                    'pid': pid
                })
        except (psutil.NoSuchProcess, psutil.AccessDenied, OSError):
            pass

    # ── Startup entries (Windows registry) ──
    if sys.platform == 'win32':
        startup_paths = [
            r'HKCU\Software\Microsoft\Windows\CurrentVersion\Run',
            r'HKLM\Software\Microsoft\Windows\CurrentVersion\Run',
            r'HKCU\Software\Microsoft\Windows\CurrentVersion\RunOnce',
            r'HKLM\Software\Microsoft\Windows\CurrentVersion\RunOnce',
        ]
        for reg_path in startup_paths:
            try:
                result = subprocess.run(
                    ['reg', 'query', reg_path],
                    capture_output=True, text=True, timeout=5
                )
                if result.returncode == 0:
                    for line in result.stdout.split('\n'):
                        line = line.strip()
                        if line and not line.startswith(reg_path) and not line.startswith('HKEY'):
                            findings.append({
                                'type': 'Startup Entry',
                                'detail': f'{reg_path} → {line[:200]}',
                                'risk': 'suspicious',
                                'action': 'disable_startup',
                                'reg_path': reg_path,
                                'entry': line
                            })
            except Exception:
                pass

    # ── Persistence paths ──
    persistence_paths = []
    if sys.platform == 'win32':
        appdata = os.environ.get('APPDATA', '')
        temp = os.environ.get('TEMP', '')
        system32 = os.environ.get('SystemRoot', 'C:\\Windows') + '\\System32'
        persistence_paths = [
            (appdata, 'AppData'),
            (temp, 'Temp'),
            (system32, 'System32'),
            (os.path.join(appdata, 'Microsoft\\Windows\\Start Menu\\Programs\\Startup'), 'Startup'),
        ]
    else:
        persistence_paths = [
            ('/tmp', '/tmp'),
            ('/var/tmp', '/var/tmp'),
            (os.path.expanduser('~/.config'), '~/.config'),
            (os.path.expanduser('~/.local/share'), '~/.local/share'),
        ]

    for pdir, label in persistence_paths:
        if not pdir or not os.path.isdir(pdir):
            continue
        try:
            for entry in os.listdir(pdir):
                fpath = os.path.join(pdir, entry)
                if os.path.isfile(fpath):
                    ext = Path(entry).suffix.lower()
                    if ext in {'.exe', '.dll', '.scr', '.bat', '.cmd', '.vbs', '.ps1', '.js'}:
                        findings.append({
                            'type': 'Persistence Path',
                            'detail': f'{label}: {fpath}',
                            'risk': 'suspicious',
                            'action': 'delete'
                        })
        except PermissionError:
            pass

    # ── Network connections ──
    suspicious_ports = {22, 23, 25, 53, 110, 135, 137, 139, 143, 445, 1433, 3306, 3389, 4444, 5555, 6666, 6667, 6668, 6669, 7777, 8443, 31337, 44444}
    local_ranges = ['127.', '10.', '192.168.', '172.16.', '172.17.', '172.18.', '172.19.',
                    '172.20.', '172.21.', '172.22.', '172.23.', '172.24.', '172.25.',
                    '172.26.', '172.27.', '172.28.', '172.29.', '172.30.', '172.31.']
    for conn in psutil.net_connections():
        try:
            if conn.status == 'LISTEN' and conn.laddr:
                if conn.laddr.port in {80, 443, 8080}:
                    continue
                if conn.laddr.port in suspicious_ports:
                    findings.append({
                        'type': 'Listening Port',
                        'detail': f'Port {conn.laddr.port} is listening (PID: {conn.pid})',
                        'risk': 'suspicious',
                        'action': 'manual_review',
                    })
            if conn.raddr:
                raddr = conn.raddr
                if raddr.port in suspicious_ports:
                    is_local = any(raddr.ip.startswith(p) for p in local_ranges)
                    if not is_local and raddr.ip != '0.0.0.0':
                        findings.append({
                            'type': 'Suspicious Connection',
                            'detail': f'{raddr.ip}:{raddr.port} (PID: {conn.pid})',
                            'risk': 'suspicious',
                            'action': 'manual_review',
                        })
        except (psutil.NoSuchProcess, psutil.AccessDenied, OSError):
            pass

    # ── Recently modified files in sensitive dirs ──
    sensitive_dirs = []
    if sys.platform == 'win32':
        sensitive_dirs = [
            os.environ.get('APPDATA', ''),
            os.environ.get('TEMP', ''),
            os.environ.get('LOCALAPPDATA', ''),
        ]
    else:
        sensitive_dirs = ['/tmp', '/var/tmp', os.path.expanduser('~/.cache')]
    cutoff = datetime.now().timestamp() - 86400  # 24h
    for sdir in sensitive_dirs:
        if not sdir or not os.path.isdir(sdir):
            continue
        try:
            for entry in os.listdir(sdir):
                fpath = os.path.join(sdir, entry)
                try:
                    mtime = os.path.getmtime(fpath)
                    if mtime > cutoff and os.path.isfile(fpath):
                        ext = Path(entry).suffix.lower()
                        if ext in {'.exe', '.dll', '.scr', '.bat', '.ps1', '.vbs', '.js'}:
                            findings.append({
                                'type': 'Recent Suspicious File',
                                'detail': f'{fpath} (modified in last 24h)',
                                'risk': 'suspicious',
                                'action': 'delete'
                            })
                except OSError:
                    pass
        except PermissionError:
            pass

    overall_risk = risk_score(findings)
    overall_label = risk_label(overall_risk)

    return jsonify({
        'findings': findings,
        'risk_score': overall_risk,
        'risk_label': overall_label,
        'system': sys.platform,
    })

@app.route('/api/kill-process', methods=['POST'])
def kill_process():
    data = request.get_json()
    pid = data.get('pid')
    if not pid:
        return jsonify({'error': 'No PID provided'}), 400
    try:
        proc = psutil.Process(pid)
        proc.terminate()
        proc.wait(timeout=3)
        return jsonify({'success': True, 'message': f'Process {pid} terminated'})
    except psutil.NoSuchProcess:
        return jsonify({'error': 'Process not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/delete-file', methods=['POST'])
def delete_file():
    data = request.get_json()
    path = data.get('path')
    if not path:
        return jsonify({'error': 'No path provided'}), 400
    try:
        os.remove(path)
        return jsonify({'success': True, 'message': f'Deleted: {path}'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'mode': 'offline'})

if __name__ == '__main__':
    print("=" * 55)
    print("  SENTINEL — Local Malware Analyzer")
    print("  Running at http://localhost:5000")
    print("  All analysis is done offline. No data leaves your machine.")
    print("=" * 55)
    app.run(host='127.0.0.1', port=5000, debug=False)
