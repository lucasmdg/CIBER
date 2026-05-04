import unittest
from unittest.mock import patch, MagicMock
from src.fast_scanner import scan_port, open_ports

class TestFastScanner(unittest.TestCase):

    def setUp(self):
        # Limpiamos la lista de puertos abiertos antes de cada test
        open_ports.clear()

    @patch('socket.socket')
    def test_scan_port_success(self, mock_socket):
        # Simulamos puerto abierto
        mock_instance = mock_socket.return_value
        mock_instance.connect_ex.return_value = 0
        
        scan_port("127.0.0.1", 443)
        self.assertIn(443, open_ports)

    @patch('socket.socket')
    def test_scan_port_closed(self, mock_socket):
        # Simulamos puerto cerrado
        mock_instance = mock_socket.return_value
        mock_instance.connect_ex.return_value = 1
        
        scan_port("127.0.0.1", 9999)
        self.assertNotIn(9999, open_ports)

if __name__ == "__main__":
    unittest.main()
