import unittest
from src.privesc_checker import PrivEscChecker


class TestPrivEscChecker(unittest.TestCase):
    def setUp(self):
        self.checker = PrivEscChecker()

    def test_suid_dangerous(self):
        results = self.checker.check_suid_binaries(["/usr/bin/python3", "/usr/bin/vim"])
        self.assertEqual(len(results), 2)

    def test_suid_safe(self):
        results = self.checker.check_suid_binaries(["/usr/bin/passwd", "/usr/bin/sudo"])
        self.assertEqual(len(results), 0)

    def test_writable_files(self):
        files = [{"path": "/etc/sudoers", "writable": True}]
        results = self.checker.check_writable_files(files)
        self.assertEqual(len(results), 1)

    def test_cron_exploitable(self):
        cron = [{"job": "* * * * * root /tmp/x.sh", "script_writable": True}]
        results = self.checker.check_cron_jobs(cron)
        self.assertEqual(len(results), 1)

    def test_kernel_safe(self):
        result = self.checker.check_kernel_version("6.1.0")
        self.assertIsNone(result)

    def test_env_path(self):
        results = self.checker.check_env_path(["/usr/bin", "/tmp", "."])
        self.assertEqual(len(results), 2)

    def test_full_audit(self):
        report = self.checker.full_audit()
        self.assertIn("total_findings", report)
        self.assertGreater(report["total_findings"], 0)


if __name__ == '__main__':
    unittest.main()
