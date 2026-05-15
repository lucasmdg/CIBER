import sys
import argparse
from scapy.all import sniff, ARP, getmacbyip, conf

class ARPMonitor:
    def __init__(self, interface=None):
        self.interface = interface or conf.iface
        self.ip_mac_map = {}

    def get_mac(self, ip):
        """Obtiene la dirección MAC de una IP."""
        mac = getmacbyip(ip)
        return mac

    def process_packet(self, packet):
        """Procesa paquetes ARP para detectar posibles ataques."""
        if packet.haslayer(ARP):
            # 2 es 'is-at' (ARP Response)
            if packet[ARP].op == 2:
                src_ip = packet[ARP].psrc
                src_mac = packet[ARP].hwsrc
                
                try:
                    # Obtenemos la MAC real (la que debería ser)
                    real_mac = self.get_mac(src_ip)
                    
                    if real_mac and real_mac != src_mac:
                        print(f"\n[!] ALERTA DE SEGURIDAD: POSIBLE ARP SPOOFING DETECTADO")
                        print(f"    IP: {src_ip}")
                        print(f"    MAC en paquete: {src_mac}")
                        print(f"    MAC real esperada: {real_mac}")
                        print("-" * 50)
                    else:
                        print(f"[*] ARP Response normal: {src_ip} is at {src_mac}")
                except Exception:
                    pass

    def start(self):
        print(f"[*] Iniciando monitoreo ARP en la interfaz: {self.interface}")
        print("[*] Presiona Ctrl+C para detener...")
        try:
            sniff(iface=self.interface, store=0, prn=self.process_packet, filter="arp")
        except Exception as e:
            print(f"Error: {e}")

def main():
    parser = argparse.ArgumentParser(description="ARP Spoofing Detector")
    parser.add_argument("-i", "--interface", help="Interfaz de red a monitorear")
    args = parser.parse_args()

    # Verificar privilegios
    if sys.platform != "win32" and not sys.getuid() == 0:
        print("Error: Este script requiere privilegios de root.")
        sys.exit(1)

    monitor = ARPMonitor(interface=args.interface)
    try:
        monitor.start()
    except KeyboardInterrupt:
        print("\n[*] Monitoreo finalizado.")
        sys.exit(0)

if __name__ == "__main__":
    main()
