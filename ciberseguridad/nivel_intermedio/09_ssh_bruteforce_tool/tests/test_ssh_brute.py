"""
Tests para la herramienta de fuerza bruta SSH.

Usamos mocks para no necesitar un servidor SSH real.
"""
import unittest
from unittest.mock import patch, MagicMock
import tempfile
import os

from src.ssh_brute import ssh_connect, run_ssh_bruteforce


class TestSSHBrute(unittest.TestCase):

    def test_ssh_connect_sin_paramiko(self):
        """Si paramiko no esta disponible, retorna False siempre."""
        with patch('src.ssh_brute.PARAMIKO_AVAILABLE', False):
            resultado = ssh_connect('127.0.0.1', 22, 'root', 'password')
            self.assertFalse(resultado)

    def test_ssh_connect_auth_fallida(self):
        """Simula una autenticacion fallida."""
        with patch('src.ssh_brute.PARAMIKO_AVAILABLE', True):
            with patch('src.ssh_brute.paramiko') as mock_paramiko:
                import paramiko as real_paramiko
                mock_client = MagicMock()
                mock_client.connect.side_effect = real_paramiko.AuthenticationException("Auth failed")
                mock_paramiko.SSHClient.return_value = mock_client
                mock_paramiko.AutoAddPolicy.return_value = MagicMock()
                mock_paramiko.AuthenticationException = real_paramiko.AuthenticationException

                resultado = ssh_connect('127.0.0.1', 22, 'root', 'wrong')
                self.assertFalse(resultado)

    def test_run_bruteforce_archivo_no_existe(self):
        """Debe retornar None si el diccionario no existe."""
        resultado = run_ssh_bruteforce(
            '127.0.0.1', 22, 'root', 'archivo_que_no_existe.txt'
        )
        self.assertIsNone(resultado)

    def test_run_bruteforce_con_diccionario(self):
        """Prueba con un diccionario temporal (sin servidor real)."""
        # Creamos un archivo temporal con contrasenas
        with tempfile.NamedTemporaryFile(mode='w', suffix='.txt',
                                          delete=False, encoding='utf-8') as f:
            f.write("123456\nadmin\nroot\npassword\n")
            temp_path = f.name

        try:
            # Sin servidor real, no encontrara nada
            resultado = run_ssh_bruteforce(
                '127.0.0.1', 22, 'root', temp_path, threads=2
            )
            self.assertIsNone(resultado)
        finally:
            os.unlink(temp_path)


if __name__ == '__main__':
    unittest.main()
