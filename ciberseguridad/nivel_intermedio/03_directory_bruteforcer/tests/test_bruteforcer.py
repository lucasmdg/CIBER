import unittest
from unittest.mock import patch, MagicMock
from src.bruteforcer import check_path

class TestBruteforcer(unittest.TestCase):

    @patch('requests.get')
    @patch('builtins.print')
    def test_check_path_found(self, mock_print, mock_get):
        # Simulamos un 200 OK
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_get.return_value = mock_response
        
        check_path("http://test.com", "admin")
        
        # Debe imprimir que encontró el directorio
        mock_print.assert_called_with("[+] 200 | /admin")

    @patch('requests.get')
    @patch('builtins.print')
    def test_check_path_not_found(self, mock_print, mock_get):
        # Simulamos un 404
        mock_response = MagicMock()
        mock_response.status_code = 404
        mock_get.return_value = mock_response
        
        check_path("http://test.com", "nonexistent")
        
        # No debe imprimir nada para un 404
        mock_print.assert_not_called()

    @patch('requests.get')
    @patch('builtins.print')
    def test_check_path_redirect(self, mock_print, mock_get):
        # Simulamos un 301
        mock_response = MagicMock()
        mock_response.status_code = 301
        mock_response.headers = {'Location': 'http://test.com/login/'}
        mock_get.return_value = mock_response
        
        check_path("http://test.com", "login")
        
        mock_print.assert_called_with("[+] 301 | /login -> http://test.com/login/")

if __name__ == "__main__":
    unittest.main()
