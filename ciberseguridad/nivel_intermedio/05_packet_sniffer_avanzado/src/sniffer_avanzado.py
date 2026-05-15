import argparse
import sys
import logging
from datetime import datetime
from scapy.all import sniff, IP, TCP, UDP, ICMP, Raw
from scapy.layers.http import HTTPRequest, HTTPResponse

# Configuración de logs
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

class AdvancedSniffer:
    def __init__(self, interface=None, count=0, bpf_filter=None, output_file=None):
        self.interface = interface
        self.count = count
        self.bpf_filter = bpf_filter
        self.output_file = output_file
        self.packet_count = 0
        self.stats = {"TCP": 0, "UDP": 0, "ICMP": 0, "HTTP": 0, "Total": 0}

    def log_packet(self, message):
        print(message)
        if self.output_file:
            with open(self.output_file, "a", encoding="utf-8") as f:
                f.write(f"{datetime.now()} - {message}\n")

    def process_packet(self, packet):
        if not packet.haslayer(IP):
            return

        self.packet_count += 1
        self.stats["Total"] += 1
        
        ip_layer = packet[IP]
        src_ip = ip_layer.src
        dst_ip = ip_layer.dst
        proto = "OTHER"

        if packet.haslayer(TCP):
            proto = "TCP"
            self.stats["TCP"] += 1
            if packet.haslayer(HTTPRequest):
                proto = "HTTP REQ"
                self.stats["HTTP"] += 1
            elif packet.haslayer(HTTPResponse):
                proto = "HTTP RES"
                self.stats["HTTP"] += 1
        elif packet.haslayer(UDP):
            proto = "UDP"
            self.stats["UDP"] += 1
        elif packet.haslayer(ICMP):
            proto = "ICMP"
            self.stats["ICMP"] += 1

        info = f"[+] {proto} | {src_ip} -> {dst_ip}"
        
        # Análisis de Payload (Búsqueda de credenciales simples en texto plano)
        if packet.haslayer(Raw):
            payload = str(packet[Raw].load)
            keywords = ["user", "pass", "login", "password", "token"]
            if any(key in payload.lower() for key in keywords):
                info += f"\n    [!] POSIBLE CREDENCIAL: {payload[:100]}..."

        self.log_packet(info)

    def start(self):
        self.log_packet(f"[*] Iniciando Advanced Sniffer en {self.interface or 'interfaz por defecto'}...")
        if self.bpf_filter:
            self.log_packet(f"[*] Filtro BPF aplicado: {self.bpf_filter}")
        
        try:
            sniff(
                iface=self.interface,
                prn=self.process_packet,
                filter=self.bpf_filter,
                count=self.count,
                store=0
            )
        except Exception as e:
            logging.error(f"Error durante la captura: {e}")
        finally:
            self.show_stats()

    def show_stats(self):
        print("\n" + "="*30)
        print("ESTADÍSTICAS FINALES")
        print("="*30)
        for k, v in self.stats.items():
            print(f"{k}: {v}")
        print("="*30)

def main():
    parser = argparse.ArgumentParser(description="Advanced Packet Sniffer for Cybersecurity Portfolio")
    parser.add_argument("-i", "--interface", help="Interfaz de red a escuchar")
    parser.add_argument("-c", "--count", type=int, default=0, help="Número de paquetes a capturar (0 = infinito)")
    parser.add_argument("-f", "--filter", help="Filtro BPF (ej: 'tcp port 80')")
    parser.add_argument("-o", "--output", help="Archivo de log para guardar resultados")
    
    args = parser.parse_args()

    # Verificar privilegios
    if sys.platform != "win32" and not sys.getuid() == 0:
        print("Error: Este script requiere privilegios de root.")
        sys.exit(1)

    sniffer = AdvancedSniffer(
        interface=args.interface,
        count=args.count,
        bpf_filter=args.filter,
        output_file=args.output
    )
    
    try:
        sniffer.start()
    except KeyboardInterrupt:
        print("\n[*] Deteniendo sniffer...")
        sniffer.show_stats()
        sys.exit(0)

if __name__ == "__main__":
    main()
