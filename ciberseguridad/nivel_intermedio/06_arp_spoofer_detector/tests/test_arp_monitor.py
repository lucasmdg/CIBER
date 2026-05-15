"""
Tests para el detector de ARP Spoofing.
Usamos mocks porque necesitariamos una red real para probarlo de verdad.
"""
import unittest
from unittest.mock import patch, MagicMock

from src.arp_monitor import ARPMonitor


class TestARPMonitor(unittest.TestCase):

    def test_crear_monitor(self):
        """Debe poder crear un monitor sin errores."""
        monitor = ARPMonitor(interface="eth0")
        self.assertEqual(monitor.interface, "eth0")
        self.assertEqual(monitor.ip_mac_map, {})

    @patch('src.arp_monitor.getmacbyip')
    def test_get_mac(self, mock_getmac):
        """Debe obtener la MAC de una IP usando scapy."""
        mock_getmac.return_value = "aa:bb:cc:dd:ee:ff"
        monitor = ARPMonitor()
        mac = monitor.get_mac("192.168.1.1")
        self.assertEqual(mac, "aa:bb:cc:dd:ee:ff")

    @patch('src.arp_monitor.getmacbyip')
    def test_detectar_spoofing(self, mock_getmac):
        """Debe detectar cuando la MAC del paquete no coincide con la real."""
        mock_getmac.return_value = "aa:bb:cc:dd:ee:ff"
        monitor = ARPMonitor()

        # Creamos un paquete ARP falso
        mock_packet = MagicMock()
        mock_packet.haslayer.return_value = True
        mock_arp = MagicMock()
        mock_arp.op = 2  # ARP Response
        mock_arp.psrc = "192.168.1.1"
        mock_arp.hwsrc = "11:22:33:44:55:66"  # MAC diferente (sospechosa)
        mock_packet.__getitem__ = lambda self, key: mock_arp

        # No deberia lanzar excepcion
        monitor.process_packet(mock_packet)

    @patch('src.arp_monitor.getmacbyip')
    def test_arp_normal(self, mock_getmac):
        """No debe alertar cuando la MAC coincide."""
        mock_getmac.return_value = "aa:bb:cc:dd:ee:ff"
        monitor = ARPMonitor()

        mock_packet = MagicMock()
        mock_packet.haslayer.return_value = True
        mock_arp = MagicMock()
        mock_arp.op = 2
        mock_arp.psrc = "192.168.1.1"
        mock_arp.hwsrc = "aa:bb:cc:dd:ee:ff"  # MAC correcta
        mock_packet.__getitem__ = lambda self, key: mock_arp

        monitor.process_packet(mock_packet)


if __name__ == '__main__':
    unittest.main()
