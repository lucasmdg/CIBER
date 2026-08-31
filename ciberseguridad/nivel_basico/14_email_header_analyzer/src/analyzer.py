import re
from email import message_from_string
from email.message import Message

def parse_received_headers(msg: Message) -> list:
    """
    Parsea las cabeceras 'Received' para extraer la ruta de los servidores de correo (hops).
    """
    hops = []
    received_headers = msg.get_all('Received', [])
    for header in received_headers:
        # Intentar extraer IPs o nombres de host habituales en cabeceras 'Received'
        # Formato habitual: "from server (ip) by server (ip) with proto; date"
        ip_matches = re.findall(r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b', header)
        hops.append({
            "header": header.strip(),
            "detected_ips": list(set(ip_matches))
        })
    return hops

def extract_authentication_status(msg: Message) -> dict:
    """
    Busca cabeceras SPF, DKIM y DMARC en la cabecera 'Authentication-Results' o 'Received-SPF'.
    """
    auth_results = {
        "spf": "unknown",
        "dkim": "unknown",
        "dmarc": "unknown"
    }
    
    # Comprobar cabecera Received-SPF
    received_spf = msg.get('Received-SPF', '')
    if received_spf:
        if 'pass' in received_spf.lower():
            auth_results["spf"] = "pass"
        elif 'fail' in received_spf.lower():
            auth_results["spf"] = "fail"
            
    # Comprobar cabecera Authentication-Results
    auth_header = msg.get('Authentication-Results', '')
    if auth_header:
        # Analizar SPF en Authentication-Results
        spf_match = re.search(r'\bspf=([a-z]+)\b', auth_header.lower())
        if spf_match:
            auth_results["spf"] = spf_match.group(1)
            
        # Analizar DKIM en Authentication-Results
        dkim_match = re.search(r'\bdkim=([a-z]+)\b', auth_header.lower())
        if dkim_match:
            auth_results["dkim"] = dkim_match.group(1)
            
        # Analizar DMARC en Authentication-Results
        dmarc_match = re.search(r'\bdmarc=([a-z]+)\b', auth_header.lower())
        if dmarc_match:
            auth_results["dmarc"] = dmarc_match.group(1)
            
    return auth_results

def analyze_email_headers(eml_content: str) -> dict:
    """
    Analiza las cabeceras de un correo electrónico en formato texto (.eml).
    Busca anomalías de spoofing (suplantación) analizando las diferencias entre campos críticos.
    """
    msg = message_from_string(eml_content)
    
    from_header = msg.get('From', '')
    return_path = msg.get('Return-Path', '')
    reply_to = msg.get('Reply-To', '')
    subject = msg.get('Subject', '')
    message_id = msg.get('Message-ID', '')
    
    # Extraer direcciones de correo limpias
    from_email = re.findall(r'<([^>]+)>', from_header)
    from_email = from_email[0] if from_email else from_header.strip()
    
    return_email = re.findall(r'<([^>]+)>', return_path)
    return_email = return_email[0] if return_email else return_path.strip()
    
    reply_email = re.findall(r'<([^>]+)>', reply_to)
    reply_email = reply_email[0] if reply_email else reply_to.strip()
    
    anomalies = []
    threat_score = 0 # Escala de 0 a 10
    
    # 1. Comparar From y Return-Path
    if return_email and from_email:
        from_domain = from_email.split('@')[-1].lower() if '@' in from_email else ''
        return_domain = return_email.split('@')[-1].lower() if '@' in return_email else ''
        if from_domain != return_domain:
            anomalies.append(f"Discrepancia de dominio: 'From' indica '{from_domain}', pero 'Return-Path' es '{return_domain}'.")
            threat_score += 3
            
    # 2. Comparar From y Reply-To
    if reply_email and from_email:
        from_domain = from_email.split('@')[-1].lower() if '@' in from_email else ''
        reply_domain = reply_email.split('@')[-1].lower() if '@' in reply_email else ''
        if from_domain != reply_domain:
            anomalies.append(f"Discrepancia de dominio: Respuestas redirigidas a 'Reply-To' ({reply_domain}) que difiere de 'From' ({from_domain}).")
            threat_score += 2
            
    # 3. Comprobar autenticación
    auth_status = extract_authentication_status(msg)
    if auth_status["spf"] == "fail":
        anomalies.append("Fallo crítico en autenticación de remitente SPF.")
        threat_score += 3
    if auth_status["dkim"] == "fail":
        anomalies.append("Fallo crítico en firma criptográfica de correo DKIM.")
        threat_score += 2
    if auth_status["dmarc"] == "fail":
        anomalies.append("Fallo crítico en política de alineación DMARC.")
        threat_score += 3
        
    # 4. Falta de Message-ID estándar
    if not message_id:
        anomalies.append("Falta la cabecera Message-ID, inusual en clientes de correo legítimos.")
        threat_score += 2
        
    hops = parse_received_headers(msg)
    
    # Acotar threat_score máximo a 10
    threat_score = min(threat_score, 10)
    
    return {
        "from": from_email,
        "return_path": return_email,
        "reply_to": reply_email,
        "subject": subject,
        "message_id": message_id,
        "auth_results": auth_status,
        "anomalies": anomalies,
        "hops": hops,
        "threat_score": threat_score,
        "suspicious": threat_score >= 4
    }
