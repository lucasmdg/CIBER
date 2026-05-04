import unittest
import os
import hashlib
from src.cracker import crack_hash

class TestHashCracker(unittest.TestCase):

    def setUp(self):
        # Creamos un pequeño diccionario temporal para las pruebas
        self.wordlist = "test_wordlist.txt"
        with open(self.wordlist, "w") as f:
            f.write("password\n123456\nadmin\nsecret\n")

    def tearDown(self):
        # Eliminamos el diccionario temporal
        if os.path.exists(self.wordlist):
            os.remove(self.wordlist)

    def test_crack_md5_success(self):
        # Hash MD5 de 'admin'
        target = hashlib.md5("admin".encode()).hexdigest()
        result = crack_hash(target, self.wordlist, 'md5')
        self.assertEqual(result, "admin")

    def test_crack_sha256_success(self):
        # Hash SHA256 de 'secret'
        target = hashlib.sha256("secret".encode()).hexdigest()
        result = crack_hash(target, self.wordlist, 'sha256')
        self.assertEqual(result, "secret")

    def test_crack_failure(self):
        # Hash de algo que no está en el diccionario
        target = hashlib.md5("notfound".encode()).hexdigest()
        result = crack_hash(target, self.wordlist, 'md5')
        self.assertIsNone(result)

if __name__ == '__main__':
    unittest.main()
