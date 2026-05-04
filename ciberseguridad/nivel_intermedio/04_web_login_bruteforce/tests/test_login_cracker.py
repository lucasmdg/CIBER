import unittest
from unittest.mock import patch, MagicMock
import os
from src.login_cracker import brute_force_login

class TestLoginCracker(unittest.TestCase):

    def setUp(self):
        self.wordlist = "test_passwords.txt"
        with open(self.wordlist, "w") as f:
            f.write("123456\npassword\nadmin123\n")

    def tearDown(self):
        if os.path.exists(self.wordlist):
            os.remove(self.wordlist)

    @patch('requests.Session.post')
    def test_login_success(self, mock_post):
        # Simulamos que la contraseña correcta es 'password'
        # Cuando se envía 'password', la respuesta contiene 'Welcome'
        def side_effect(url, data, timeout):
            response = MagicMock()
            if data['password'] == 'password':
                response.text = "<html><body>Welcome Admin!</body></html>"
            else:
                response.text = "<html><body>Login Failed</body></html>"
            return response

        mock_post.side_effect = side_effect

        result = brute_force_login("http://test.com", "admin", self.wordlist)
        self.assertEqual(result, "password")

    @patch('requests.Session.post')
    def test_login_failure(self, mock_post):
        # Simulamos que ninguna contraseña funciona
        mock_response = MagicMock()
        mock_response.text = "Invalid credentials"
        mock_post.return_value = mock_response

        result = brute_force_login("http://test.com", "admin", self.wordlist)
        self.assertIsNone(result)

if __name__ == "__main__":
    unittest.main()
