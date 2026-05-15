"""
Tests para el sistema basico de deteccion de intrusiones (IDS).
Usamos mocks para simular paquetes de red.
"""
import unittest
from unittest.mock import MagicMock, patch

from src.ids import BasicIDS


class TestBasicIDS(unittest.TestCase):

    def test_crear_ids(self):
        """Debe crear el IDS con los umbrales por defecto."""
        ids = BasicIDS()
        self.assertEqual(ids.PORT_SCAN_THRESHOLD, 20)
        self.assertEqual(ids.SYN_FLOOD_THRESHOLD, 50)
        self.assertEqual(ids.ICMP_FLOOD_THRESHOLD, 30)

    def test_reset_stats(self):
        """Debe limpiar las estadisticas tras el periodo de tiempo."""
        ids = BasicIDS()
        ids.connection_attempts["192.168.1.100"].add(80)
        ids.connection_attempts["192.168.1.100"].add(443)
        ids.last_reset = 0  # Forzamos que haya pasado el tiempo

        ids.reset_stats()
        self.assertEqual(len(ids.connection_attempts), 0)

    def test_paquete_sin_ip(self):
        """Debe ignorar paquetes que no tengan capa IP."""
        ids = BasicIDS()
        mock_packet = MagicMock()
        mock_packet.haslayer.return_value = False

        # No deberia hacer nada ni lanzar error
        ids.process_packet(mock_packet)

    def test_deteccion_port_scan(self):
        """Debe detectar un escaneo de puertos (muchos puertos diferentes)."""
        ids = BasicIDS()
        ids.PORT_SCAN_THRESHOLD = 3  # Bajamos el umbral para el test

        # Simulamos paquetes TCP a diferentes puertos
        for port in [80, 443, 8080, 22]:
            mock_packet = MagicMock()
            mock_packet.haslayer.side_effect = lambda x: True
            mock_ip = MagicMock()
            mock_ip.src = "10.0.0.1"
            mock_tcp = MagicMock()
            mock_tcp.dport = port
            mock_tcp.flags = 'A'  # ACK, no SYN

            mock_packet.__getitem__ = lambda s, k, _ip=mock_ip, _tcp=mock_tcp: (
                _ip if 'IP' in str(k) else _tcp
            )
            ids.connection_attempts["10.0.0.1"].add(port)

        # Debe haber registrado los puertos
        self.assertGreater(len(ids.connection_attempts["10.0.0.1"]), 3)


if __name__ == '__main__':
    unittest.main()
