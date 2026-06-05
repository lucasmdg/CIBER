import time
import random

templates = {
    "1": {
        "name": "Office365 Password Reset",
        "subject": "⚠️ ALERTA: Restablecer su contraseña de Office 365 de inmediato",
        "body": """
        ======================================================================
        MICROSOFT SECURITY TEAM - OFFICE 365
        ======================================================================
        Estimado usuario,
        
        Hemos detectado intentos inusuales de inicio de sesión en su cuenta corporativa
        desde una dirección IP ubicada en el extranjero. 
        
        Por favor, confirme su identidad ingresando al siguiente enlace de verificación:
        http://login.microsoft.secureserver-update.com/verify?email={email}
        
        Si no verifica su cuenta en las próximas 24 horas, será suspendida temporalmente.
        ======================================================================
        """
    },
    "2": {
        "name": "Google Security Alert",
        "subject": "Alerta de Seguridad Crítica: Acceso no autorizado bloqueado",
        "body": """
        ======================================================================
        GOOGLE ACCOUNT SAFETY
        ======================================================================
        Alguien acaba de intentar ingresar a tu cuenta de Gmail usando tu contraseña
        correcta desde un dispositivo no reconocido en San Petersburgo, Rusia.
        
        IP de origen: 195.42.110.15
        
        Si no fuiste tú, por favor protege tu cuenta ahora mismo accediendo a:
        https://accounts.google.security-checkup.net/secure?user={email}
        ======================================================================
        """
    }
}

def simulate_campaign(target_emails, template_id):
    if template_id not in templates:
        print("[-] ID de plantilla inválido.")
        return

    temp = templates[template_id]
    print("=" * 60)
    print(f"  PHISH-SHIELD Ethical Simulation: {temp['name']}")
    print("=" * 60)
    print(f"[*] Asunto: {temp['subject']}")
    print(f"[*] Enviando a {len(target_emails)} objetivos...")
    
    sent = 0
    opened = 0
    clicked = 0
    captured = 0

    for email in target_emails:
        time.sleep(1)
        print(f"\n[+] Correo de suplantación enviado a: {email}")
        sent += 1

        # Simulación de respuesta del usuario basada en estadísticas reales de phishing
        time.sleep(0.5)
        # 75% abre el correo
        if random.random() < 0.75:
            print(f"    - [OK] El usuario abrió el correo.")
            opened += 1
            
            # 50% hace clic en el enlace
            if random.random() < 0.50:
                print(f"    - [!] Clic en enlace detectado para {email}")
                clicked += 1
                
                # 30% entrega credenciales
                if random.random() < 0.30:
                    captured += 1
                    sim_pass = f"Pass{random.randint(100, 999)}!"
                    print(f"    - [☠️ CAPTURA] ¡Credenciales capturadas! User: {email} | Pass: '{sim_pass}'")

    print("\n" + "=" * 50)
    print("  RESULTADOS DE LA CAMPAÑA DE AUDITORÍA")
    print("=" * 50)
    print(f"  Correos Enviados:  {sent}")
    print(f"  Correos Abiertos:  {opened} ({round(opened/sent*100, 1)}%)")
    print(f"  Clics en Enlace:   {clicked} ({round(clicked/sent*100, 1)}%)")
    print(f"  Datos Comprometidos: {captured} ({round(captured/sent*100, 1)}%)")
    print("=" * 50)
    print("[INFO] Resultados guardados en auditoria_phishing.json (Simulado)")

if __name__ == "__main__":
    targets = ["gerente@empresa.com", "finanzas@empresa.com", "recursos_humanos@empresa.com", "auxiliar@empresa.com"]
    print("Seleccione una plantilla:")
    print("  1 - Office365 Password Reset")
    print("  2 - Google Security Alert")
    opt = input("ID > ").strip()
    if opt in ["1", "2"]:
        simulate_campaign(targets, opt)
    else:
        print("[-] Selección inválida.")
