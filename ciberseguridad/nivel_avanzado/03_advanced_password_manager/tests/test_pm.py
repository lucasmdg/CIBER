import unittest, os, tempfile
from src.password_manager import PasswordManager, PasswordGenerator, SecureVault


class TestPasswordGenerator(unittest.TestCase):
    def test_generar_contrasena(self):
        pwd = PasswordGenerator.generate(20)
        self.assertEqual(len(pwd), 20)

    def test_fortaleza_debil(self):
        result = PasswordGenerator.check_strength("abc")
        self.assertIn(result["level"], ["Muy debil", "Debil"])

    def test_fortaleza_fuerte(self):
        result = PasswordGenerator.check_strength("M1Cl@ve$egura!2024")
        self.assertIn(result["level"], ["Fuerte", "Muy fuerte"])


class TestSecureVault(unittest.TestCase):
    def test_cifrar_descifrar(self):
        vault = SecureVault()
        data = [{"service": "test", "password": "123"}]
        master = "TestMaster!1"
        encrypted = vault.encrypt_vault(data, master)
        decrypted = vault.decrypt_vault(encrypted, master)
        self.assertEqual(data, decrypted)

    def test_contrasena_incorrecta(self):
        vault = SecureVault()
        data = [{"service": "test"}]
        encrypted = vault.encrypt_vault(data, "correcta")
        decrypted = vault.decrypt_vault(encrypted, "incorrecta")
        self.assertIsNone(decrypted)


class TestPasswordManager(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.NamedTemporaryFile(suffix='.enc', delete=False)
        self.tmp.close()
        self.pm = PasswordManager(self.tmp.name)
        self.master = "Test!Master#1"

    def tearDown(self):
        if os.path.exists(self.tmp.name):
            os.unlink(self.tmp.name)

    def test_inicializar_y_desbloquear(self):
        self.pm.initialize(self.master)
        self.assertTrue(self.pm.unlock(self.master))

    def test_agregar_y_buscar(self):
        self.pm.initialize(self.master)
        self.pm.add_entry("GitHub", "user", "pass123", master_password=self.master)
        results = self.pm.search("github")
        self.assertEqual(len(results), 1)

    def test_auditar_contrasenas_debiles(self):
        self.pm.initialize(self.master)
        self.pm.add_entry("Test", "user", "123", master_password=self.master)
        debiles = self.pm.audit()
        self.assertGreater(len(debiles), 0)


if __name__ == '__main__':
    unittest.main()
