import unittest
from src.cipher import caesar_cipher

class TestCaesarCipher(unittest.TestCase):

    def test_encryption_basic(self):
        # ABC con shift 3 -> DEF
        self.assertEqual(caesar_cipher("ABC", 3), "DEF")
        self.assertEqual(caesar_cipher("abc", 3), "def")

    def test_decryption_basic(self):
        # DEF con shift 3 (descifrando) -> ABC
        self.assertEqual(caesar_cipher("DEF", 3, decrypt=True), "ABC")
        self.assertEqual(caesar_cipher("def", 3, decrypt=True), "abc")

    def test_wrap_around(self):
        # Z con shift 1 -> A
        self.assertEqual(caesar_cipher("XYZ", 3), "ABC")

    def test_non_alpha(self):
        # Espacios y números se mantienen
        self.assertEqual(caesar_cipher("Hello 123!", 3), "Khoor 123!")

    def test_consistency(self):
        # Cifrar y luego descifrar debe devolver el original
        original = "Cyber Security 2026"
        encrypted = caesar_cipher(original, 7)
        decrypted = caesar_cipher(encrypted, 7, decrypt=True)
        self.assertEqual(original, decrypted)

if __name__ == "__main__":
    unittest.main()
