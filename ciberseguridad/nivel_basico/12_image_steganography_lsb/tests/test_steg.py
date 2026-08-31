import unittest
import os
from PIL import Image
from src.steg import hide_message, reveal_message, message_to_bin, bin_to_message

class TestImageSteganography(unittest.TestCase):

    def setUp(self):
        self.test_img_path = "test_input.png"
        self.test_output_path = "test_output.png"
        
        # Crear una pequeña imagen de prueba (8x8 píxeles rojos)
        img = Image.new("RGB", (8, 8), color="red")
        img.save(self.test_img_path, "PNG")

    def tearDown(self):
        if os.path.exists(self.test_img_path):
            os.remove(self.test_img_path)
        if os.path.exists(self.test_output_path):
            os.remove(self.test_output_path)

    def test_bin_conversion(self):
        msg = "Hello"
        binary = message_to_bin(msg)
        decoded = bin_to_message(binary)
        self.assertEqual(decoded, msg)

    def test_hide_and_reveal(self):
        secret = "Secret 123"
        success = hide_message(self.test_img_path, secret, self.test_output_path)
        self.assertTrue(success)
        self.assertTrue(os.path.exists(self.test_output_path))
        
        revealed = reveal_message(self.test_output_path)
        self.assertEqual(revealed, secret)

if __name__ == '__main__':
    unittest.main()
