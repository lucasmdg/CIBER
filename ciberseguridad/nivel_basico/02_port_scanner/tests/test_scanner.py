import unittest
from unittest.mock import patch, MagicMock
from src.scanner import scan_port

class TestPortScanner(unittest.TestCase):

    @patch('socket.socket')
    def test_scan_port_open(self, mock_socket):
        # Configuramos el mock para que connect_ex devuelva 0 (puerto abierto)
        mock_instance = mock_socket.return_value
        mock_instance.connect_ex.return_value = 0
        
        result = scan_port('127.0.0.1', 80)
        self.assertTrue(result)
        mock_instance.connect_ex.assert_called_with(('127.0.0.1', 80))

    @patch('socket.socket')
    def test_scan_port_closed(self, mock_socket):
        # Configuramos el mock para que connect_ex devuelva algo distinto de 0 (puerto cerrado)
        mock_instance = mock_socket.return_value
        mock_instance.connect_ex.return_value = 111 # Connection refused
        
        result = scan_port('127.0.0.1', 9999)
        self.assertFalse(result)

if __name__ == '__main__':
    unittest.main()
