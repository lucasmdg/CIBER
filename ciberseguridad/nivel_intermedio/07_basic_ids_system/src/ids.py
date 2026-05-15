import sys
import time
from collections import defaultdict
from scapy.all import sniff, IP, TCP, ICMP

class BasicIDS:
    def __init__(self, interface=None):
        self.interface = interface
        # Umbrales para alertas
        self.PORT_SCAN_THRESHOLD = 20  # Puertos diferentes en 10 segundos
        self.SYN_FLOOD_THRESHOLD = 50  # Paquetes SYN por segundo
        self.ICMP_FLOOD_THRESHOLD = 30 # Pings por segundo
        
        # Almacenamiento temporal de actividad
        self.connection_attempts = defaultdict(set) # IP: {puertos}
        self.syn_counts = defaultdict(int)           # IP: count
        self.icmp_counts = defaultdict(int)          # IP: count
        
        self.last_reset = time.time()

    def reset_stats(self):
        """Reinicia las estadísticas cada 10 segundos para evaluar tasas."""
        if time.time() - self.last_reset > 10:
            self.connection_attempts.clear()
            self.syn_counts.clear()
            self.icmp_counts.clear()
            self.last_reset = time.time()

    def process_packet(self, packet):
        if not packet.haslayer(IP):
            return

        self.reset_stats()
        src_ip = packet[IP].src

        # 1. Detección de Port Scanning
        if packet.haslayer(TCP):
            dst_port = packet[TCP].dport
            self.connection_attempts[src_ip].add(dst_port)
            
            if len(self.connection_attempts[src_ip]) > self.PORT_SCAN_THRESHOLD:
                print(f"[!] ALERTA IDS: Posible Port Scan desde {src_ip} ({len(self.connection_attempts[src_ip])} puertos detectados)")
            
            # 2. Detección de SYN Flood
            if packet[TCP].flags == 'S': # SYN flag set
                self.syn_counts[src_ip] += 1
                if self.syn_counts[src_ip] > self.SYN_FLOOD_THRESHOLD:
                    print(f"[!] ALERTA IDS: Posible SYN Flood desde {src_ip}")

        # 3. Detección de ICMP Flood (Ping Flood)
        if packet.haslayer(ICMP):
            if packet[ICMP].type == 8: # Echo Request
                self.icmp_counts[src_ip] += 1
                if self.icmp_counts[src_ip] > self.ICMP_FLOOD_THRESHOLD:
                    print(f"[!] ALERTA IDS: Posible ICMP Flood desde {src_ip}")

    def start(self):
        print(f"[*] Iniciando Basic IDS en {self.interface or 'todas las interfaces'}...")
        print("[*] Monitoreando Port Scanning, SYN Flood e ICMP Flood...")
        try:
            sniff(iface=self.interface, prn=self.process_packet, store=0)
        except Exception as e:
            print(f"Error: {e}")

def main():
    # Verificar privilegios
    if sys.platform != "win32" and not sys.getuid() == 0:
        print("Error: Este script requiere privilegios de root.")
        sys.exit(1)

    ids = BasicIDS()
    try:
        ids.start()
    except KeyboardInterrupt:
        print("\n[*] IDS detenido.")
        sys.exit(0)

if __name__ == "__main__":
    main()
