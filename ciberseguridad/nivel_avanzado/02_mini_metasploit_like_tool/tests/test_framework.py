import unittest
from src.exploit_framework import ExploitFramework, FTPAnonExploit, Exploit


class TestExploitFramework(unittest.TestCase):
    def setUp(self):
        self.fw = ExploitFramework()

    def test_listar_exploits(self):
        exploits = self.fw.list_exploits()
        self.assertGreater(len(exploits), 0)

    def test_usar_exploit(self):
        exp = self.fw.use_exploit("ftp/anon_login")
        self.assertIsNotNone(exp)

    def test_exploit_no_existe(self):
        exp = self.fw.use_exploit("no/existe")
        self.assertIsNone(exp)

    def test_ejecutar_exploit(self):
        result = self.fw.run_exploit("ftp/anon_login", {"RHOST": "10.0.0.1"})
        self.assertTrue(result["success"])

    def test_exploit_sin_opciones(self):
        exp = FTPAnonExploit()
        result = exp.run()
        self.assertFalse(result["success"])

    def test_historial(self):
        self.fw.run_exploit("ftp/anon_login", {"RHOST": "10.0.0.1"})
        history = self.fw.get_history()
        self.assertEqual(len(history), 1)

    def test_http_exploit_requiere_puerto(self):
        result = self.fw.run_exploit("http/header_disclosure", {"RHOST": "10.0.0.1"})
        self.assertFalse(result["success"])  # Falta RPORT


if __name__ == '__main__':
    unittest.main()
