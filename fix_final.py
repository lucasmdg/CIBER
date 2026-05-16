import re
import os

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Define project mapping for links
# Basic
basic_mapping = {
    "Password Locker": "01_password_locker",
    "Port Scanner": "02_port_scanner",
    "Hash Cracker": "03_hash_cracker_simple",
    "Log Analyzer": "04_log_analyzer",
    "File Integrity Checker": "05_file_integrity_checker",
    "Keylogger Demo": "06_basic_keylogger_demo",
    "Caesar Cipher Tool": "07_caesar_cipher_tool",
    "Base64 Encoder/Decoder": "08_base64_encoder_decoder",
    "Vulnerability Scanner": "09_simple_vulnerability_scanner",
    "Network Sniffer": "10_network_sniffer_basico"
}
# Intermediate
intermediate_mapping = {
    "Password Locker v2": "01_advanced_password_locker",
    "Multithreaded Port Scanner": "02_multithreaded_scanner",
    "Directory Bruteforcer": "03_directory_bruteforcer",
    "Web Login Bruteforce": "04_login_bruteforcer",
    "Packet Sniffer Avanzado": "05_advanced_sniffer",
    "ARP Spoofer Detector": "06_arp_spoofer_detector",
    "Basic IDS System": "07_basic_ids_system",
    "Web Vulnerability Scanner": "08_web_scanner",
    "SSH Bruteforce Tool": "09_ssh_bruteforcer",
    "Log Monitoring System": "10_log_monitor"
}
# Advanced
advanced_mapping = {
    "Custom C2 Simulator": "01_c2_simulator",
    "Mini Metasploit Framework": "02_mini_metasploit",
    "Advanced Password Manager": "03_advanced_password_manager",
    "Network IDS (NIDS)": "04_nids_system",
    "Web Pentesting Framework": "05_pentest_framework",
    "Privilege Escalation Lab": "06_privesc_lab",
    "Malware Analysis Lab": "07_malware_analysis_lab",
    "Ransomware Simulator": "08_ransomware_sim",
    "Threat Hunting Lab": "09_threat_hunting",
    "Red Team Lab Simulation": "10_red_team_simulation"
}

def get_github_link(title, level):
    base = "https://github.com/lucasmdg/CIBER/tree/main/ciberseguridad/"
    if level == "basico":
        folder = basic_mapping.get(title)
        return base + "nivel_basico/" + folder if folder else "https://github.com/lucasmdg/CIBER"
    elif level == "intermedio":
        folder = intermediate_mapping.get(title)
        return base + "nivel_intermedio/" + folder if folder else "https://github.com/lucasmdg/CIBER"
    elif level == "avanzado":
        folder = advanced_mapping.get(title)
        return base + "nivel_avanzado/" + folder if folder else "https://github.com/lucasmdg/CIBER"
    return "https://github.com/lucasmdg/CIBER"

def get_cover_image(level):
    if level == "basico": return "img/hero_bg.png"
    if level == "intermedio": return "img/section_bg.png"
    if level == "avanzado": return "img/statue.png"
    return "img/statues_bg.png"

# We will reconstruct the whole projects-grid to be sure it's perfect
# Find the start and end of projects-grid
grid_match = re.search(r'<div class="projects-grid" id="projects-grid">.*?</div>\s*</section>', html, flags=re.DOTALL)
if not grid_match:
    print("Could not find projects-grid")
    exit()

# Extract all project cards
cards = re.findall(r'<div class="project-card level-(.*?) fade-in" data-level=".*?">.*?</div>\s*</div>', html, flags=re.DOTALL)
# Wait, the findall is a bit complex due to nested divs. Let's use a more robust split/regex.

# Alternative: split by project-card
parts = re.split(r'(<div class="project-card level-.*? fade-in" data-level=".*?">)', html)
new_html_parts = []
new_html_parts.append(parts[0])

for i in range(1, len(parts), 2):
    header = parts[i]
    content = parts[i+1]
    
    # Extract level and title
    level_match = re.search(r'data-level="(.*?)"', header)
    level = level_match.group(1) if level_match else "basico"
    
    title_match = re.search(r'<h3 class="project-title">(.*?)</h3>', content)
    title = title_match.group(1) if title_match else ""
    
    # Clean old cover and links
    content = re.sub(r'<div class="project-cover-container">.*?</div>', '', content, flags=re.DOTALL)
    content = re.sub(r'<div class="project-links">.*?</div>', '', content, flags=re.DOTALL)
    
    # Construct new parts
    github_link = get_github_link(title, level)
    cover_img = get_cover_image(level)
    
    cover_html = f'\n                <div class="project-cover-container"><img src="{cover_img}" class="project-cover" alt="Project Cover"></div>'
    links_html = f'''
                <div class="project-links">
                    <a href="{github_link}" target="_blank" class="btn-elegant btn-github">GitHub</a>
                    <a href="https://linkedin.com/in/lucasmdg" target="_blank" class="btn-elegant btn-linkedin">LinkedIn</a>
                </div>'''
    
    # Find the closing tag of the project-card
    # We assume the content ends with </div> which is the card's end.
    # But wait, content might have multiple </div>. We need the LAST one in the card block.
    # This is tricky without a real parser. Let's try to match the tags part and insert after.
    
    content = re.sub(r'(<div class="project-tags">.*?</div>)', r'\g<1>' + links_html, content, flags=re.DOTALL)
    
    new_card_content = header + cover_html + content
    new_html_parts.append(new_card_content)

new_html = "".join(new_html_parts)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print("HTML fixed successfully")
