import unittest
from src.base64_tool import encode_b64, decode_b64

class TestBase64Tool(unittest.TestCase):

    def test_encode(self):
        self.assertEqual(encode_b64("Hello World"), "SGVsbG8gV29ybGQ=")
        self.assertEqual(encode_b64("Python"), "UHl0aG9u")

    def test_decode(self):
        self.assertEqual(decode_b64("SGVsbG8gV29ybGQ="), "Hello World")
        self.assertEqual(decode_b64("UHl0aG9u"), "Python")

    def test_consistency(self):
        original = "Ciberseguridad 2026"
        encoded = encode_b64(original)
        decoded = decode_b64(encoded)
        self.assertEqual(original, decoded)

    def test_invalid_decode(self):
        # Un input que no es base64 válido
        result = decode_b64("!!!EstoNoEsBase64!!!")
        self.assertTrue(result.startswith("Error"))

if __name__ == "__main__":
    unittest.main()
