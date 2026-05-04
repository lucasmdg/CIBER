import unittest
from unittest.mock import patch, MagicMock
import sys
import os

# Mock de scapy para que los tests funcionen sin tenerlo instalado o sin privilegios
sys.modules['scapy'] = MagicMock()
sys.modules['scapy.all'] = MagicMock()

from src.sniffer import packet_callback

class TestSniffer(unittest.TestCase):

    @patch('builtins.print')
    def test_packet_callback_ip_tcp(self, mock_print):
        # Creamos un paquete mock que tenga capa IP y TCP
        mock_packet = MagicMock()
        
        # Simulamos packet.haslayer(IP) -> True
        # Y packet[IP].src, packet[IP].dst
        from scapy.all import IP, TCP
        
        mock_packet.haslayer.side_effect = lambda layer: layer in [IP, TCP]
        mock_packet[IP].src = "192.168.1.1"
        mock_packet[IP].dst = "8.8.8.8"
        
        packet_callback(mock_packet)
        
        # Verificamos que se imprimió la información correcta
        mock_print.assert_called_with("[+] TCP | Origen: 192.168.1.1 -> Destino: 8.8.8.8")

if __name__ == "__main__":
    unittest.main()
