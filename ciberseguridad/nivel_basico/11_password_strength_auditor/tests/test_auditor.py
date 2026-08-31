import unittest
from src.auditor import calculate_entropy, audit_password, generate_secure_password

class TestPasswordAuditor(unittest.TestCase):

    def test_calculate_entropy_empty(self):
        self.assertEqual(calculate_entropy(""), 0.0)

    def test_calculate_entropy_simple(self):
        entropy = calculate_entropy("abc")
        # abc es longitud 3, con letras minúsculas (pool = 26)
        # 3 * log2(26) = 3 * 4.7004 = 14.1
        self.assertAlmostEqual(entropy, 14.1, places=1)

    def test_audit_password_common(self):
        report = audit_password("123456")
        self.assertIn("La contraseña es extremadamente común", report["warnings"][0])
        self.assertLessEqual(report["score"], 1)

    def test_audit_password_strong(self):
        report = audit_password("P@ssw0rdSecur3!_2026")
        self.assertEqual(report["status"], "Muy Segura")
        self.assertEqual(report["score"], 4)
        self.assertEqual(len(report["warnings"]), 0)

    def test_generate_secure_password(self):
        pw = generate_secure_password(12, use_upper=True, use_digits=True, use_special=True)
        self.assertEqual(len(pw), 12)
        self.assertTrue(any(c.islower() for c in pw))
        self.assertTrue(any(c.isupper() for c in pw))
        self.assertTrue(any(c.isdigit() for c in pw))
        self.assertTrue(any(c in "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~" for c in pw))

if __name__ == '__main__':
    unittest.main()
