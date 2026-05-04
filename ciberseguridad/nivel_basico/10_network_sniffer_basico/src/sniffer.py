try:
    from scapy.all import sniff, IP, TCP, UDP, ICMP
except ImportError:
    print("Error: La librería 'scapy' no está instalada.")
    print("Instálala con: pip install scapy")
    exit()

def packet_callback(packet):
    """
    Se ejecuta para cada paquete capturado.
    """
    if packet.haslayer(IP):
        ip_src = packet[IP].src
        ip_dst = packet[IP].dst
        proto = "OTRO"
        
        if packet.haslayer(TCP):
            proto = "TCP"
        elif packet.haslayer(UDP):
            proto = "UDP"
        elif packet.haslayer(ICMP):
            proto = "ICMP"
            
        print(f"[+] {proto} | Origen: {ip_src} -> Destino: {ip_dst}")

def start_sniffing(interface=None, count=10):
    print("-" * 50)
    print(f"Iniciando captura de {count} paquetes...")
    if interface:
        print(f"Interfaz: {interface}")
    print("-" * 50)
    
    # Iniciamos el sniffer
    sniff(iface=interface, prn=packet_callback, count=count)
    
    print("-" * 50)
    print("Captura finalizada.")

if __name__ == "__main__":
    print("NETWORK SNIFFER BÁSICO")
    print("Asegúrate de ejecutar como Administrador/Root.")
    
    try:
        p_count = int(input("Número de paquetes a capturar (ej: 10): ") or 10)
        start_sniffing(count=p_count)
    except KeyboardInterrupt:
        print("\nCaptura interrumpida.")
    except Exception as e:
        print(f"Error: {e}")
