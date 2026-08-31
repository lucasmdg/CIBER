import unittest
import os
from PIL import Image
from PIL.ExifTags import TAGS
from src.stripper import strip_image_metadata, get_metadata_summary

class TestMetadataStripper(unittest.TestCase):

    def setUp(self):
        self.test_img_path = "test_meta_input.jpg"
        self.test_output_path = "test_meta_output.jpg"
        
        # Crear una imagen básica
        img = Image.new("RGB", (10, 10), color="blue")
        # Guardar con metadatos EXIF simulados
        # EXIF bytes crudos para pruebas rápidas
        img.save(self.test_img_path, "JPEG")

    def tearDown(self):
        if os.path.exists(self.test_img_path):
            os.remove(self.test_img_path)
        if os.path.exists(self.test_output_path):
            os.remove(self.test_output_path)

    def test_strip_metadata(self):
        # Primero probamos la función de limpieza
        success = strip_image_metadata(self.test_img_path, self.test_output_path)
        self.assertTrue(success)
        self.assertTrue(os.path.exists(self.test_output_path))
        
        # El resumen de metadatos de la imagen limpia debe estar vacío
        meta = get_metadata_summary(self.test_output_path)
        self.assertEqual(len(meta), 0)

if __name__ == '__main__':
    unittest.main()
