import unittest, os, tempfile
from src.ransomware_sim import RansomwareSimulator


class TestRansomwareSim(unittest.TestCase):
    def setUp(self):
        self.sim = RansomwareSimulator()

    def tearDown(self):
        self.sim.cleanup()

    def test_crear_archivos_muestra(self):
        files = os.listdir(self.sim.target_dir)
        self.assertGreater(len(files), 0)

    def test_cifrar_archivo(self):
        files = os.listdir(self.sim.target_dir)
        filepath = os.path.join(self.sim.target_dir, files[0])
        result = self.sim.encrypt_file(filepath)
        self.assertTrue(result)
        self.assertFalse(os.path.exists(filepath))
        self.assertTrue(os.path.exists(filepath + ".locked"))

    def test_descifrar_archivo(self):
        files = os.listdir(self.sim.target_dir)
        filepath = os.path.join(self.sim.target_dir, files[0])

        # Leemos contenido original
        with open(filepath, 'r') as f:
            original = f.read()

        # Ciframos y desciframos
        self.sim.encrypt_file(filepath)
        self.sim.decrypt_file(filepath + ".locked")

        # Verificamos que se recupero correctamente
        with open(filepath, 'r') as f:
            recovered = f.read()
        self.assertEqual(original, recovered)

    def test_ataque_y_recuperacion(self):
        result = self.sim.simulate_attack()
        self.assertGreater(result["files_encrypted"], 0)

        recovered = self.sim.simulate_recovery()
        self.assertEqual(recovered, result["files_encrypted"])

    def test_clave_incorrecta_falla(self):
        files = os.listdir(self.sim.target_dir)
        filepath = os.path.join(self.sim.target_dir, files[0])
        self.sim.encrypt_file(filepath)

        from cryptography.hazmat.primitives.ciphers.aead import AESGCM
        wrong_key = AESGCM.generate_key(bit_length=256)
        result = self.sim.decrypt_file(filepath + ".locked", key=wrong_key)
        self.assertFalse(result)


if __name__ == '__main__':
    unittest.main()
