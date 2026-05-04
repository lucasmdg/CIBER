import unittest
import os
import json
from src.vault_v2 import SecureVault

class TestSecureVault(unittest.TestCase):

    def setUp(self):
        self.test_file = "test_vault.json"
        self.vault = SecureVault(self.test_file)
        self.master_pwd = "password123"

    def tearDown(self):
        if os.path.exists(self.test_file):
            os.remove(self.test_file)

    def test_initialization_and_load(self):
        # 1. Inicializar
        self.vault.initialize(self.master_pwd)
        self.assertTrue(os.path.exists(self.test_file))
        
        # 2. Cargar con contraseña correcta
        data = self.vault.load(self.master_pwd)
        self.assertIsNotNone(data)
        self.assertEqual(len(data['entries']), 0)

    def test_add_and_retrieve(self):
        self.vault.initialize(self.master_pwd)
        data = self.vault.load(self.master_pwd)
        
        # Añadir entrada
        new_entry = {"service": "Google", "password": "abc", "category": "Web", "date": "now"}
        data['entries'].append(new_entry)
        self.vault.save(self.master_pwd, data)
        
        # Recargar y verificar
        reloaded_data = self.vault.load(self.master_pwd)
        self.assertEqual(len(reloaded_data['entries']), 1)
        self.assertEqual(reloaded_data['entries'][0]['service'], "Google")

    def test_wrong_password(self):
        self.vault.initialize(self.master_pwd)
        # Intentar cargar con contraseña errónea
        data = self.vault.load("wrong_pwd")
        self.assertIsNone(data)

if __name__ == "__main__":
    unittest.main()
