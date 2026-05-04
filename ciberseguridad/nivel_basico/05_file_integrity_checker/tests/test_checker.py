import unittest
import os
import json
import shutil
from src.checker import create_baseline, calculate_hash

class TestFileIntegrityChecker(unittest.TestCase):

    def setUp(self):
        self.test_dir = "test_integrity_dir"
        self.baseline_file = "test_baseline.json"
        os.makedirs(self.test_dir, exist_ok=True)
        
        # Crear archivos de prueba
        with open(os.path.join(self.test_dir, "file1.txt"), "w") as f:
            f.write("contenido original")
        with open(os.path.join(self.test_dir, "file2.txt"), "w") as f:
            f.write("otro archivo")

    def tearDown(self):
        if os.path.exists(self.test_dir):
            shutil.rmtree(self.test_dir)
        if os.path.exists(self.baseline_file):
            os.remove(self.baseline_file)

    def test_integrity_flow(self):
        # 1. Crear baseline
        create_baseline(self.test_dir, self.baseline_file)
        self.assertTrue(os.path.exists(self.baseline_file))
        
        with open(self.baseline_file, 'r') as f:
            baseline = json.load(f)
        
        self.assertIn("file1.txt", baseline)
        self.assertIn("file2.txt", baseline)
        
        # 2. Modificar un archivo
        with open(os.path.join(self.test_dir, "file1.txt"), "w") as f:
            f.write("contenido modificado")
            
        # 3. Verificar que el hash cambió
        new_hash = calculate_hash(os.path.join(self.test_dir, "file1.txt"))
        self.assertNotEqual(new_hash, baseline["file1.txt"])

if __name__ == '__main__':
    unittest.main()
