import unittest
from src.red_team_sim import RedTeamExercise, Target, Phase


class TestRedTeamExercise(unittest.TestCase):
    def setUp(self):
        self.exercise = RedTeamExercise("Test Op", "10.0.0.0/24")

    def test_recon_pasivo(self):
        findings = self.exercise.recon_passive()
        self.assertIn("dns_records", findings)

    def test_recon_activo(self):
        targets = self.exercise.recon_active()
        self.assertGreater(len(targets), 0)

    def test_escaneo_vulns(self):
        vulns = self.exercise.scan_vulnerabilities()
        self.assertGreater(len(vulns), 0)

    def test_explotacion(self):
        self.exercise.recon_active()
        result = self.exercise.exploit_target("10.0.0.1", "Test vuln")
        self.assertTrue(result["success"])

    def test_escalada(self):
        self.exercise.recon_active()
        self.exercise.exploit_target("10.0.0.1", "Test")
        result = self.exercise.escalate_privileges("10.0.0.1")
        self.assertTrue(result["success"])
        self.assertEqual(result["access_level"], "root")

    def test_pivoting(self):
        self.exercise.recon_active()
        self.exercise.exploit_target("10.0.0.1", "Test")
        result = self.exercise.pivot_to_target("10.0.0.1", "10.0.0.10")
        self.assertTrue(result["success"])

    def test_exfiltracion(self):
        loot = self.exercise.exfiltrate_data("10.0.0.1", "creds")
        self.assertEqual(loot["type"], "creds")

    def test_reporte(self):
        self.exercise.recon_active()
        self.exercise.exploit_target("10.0.0.1", "Test")
        report = self.exercise.generate_report()
        self.assertIn("summary", report)
        self.assertEqual(report["summary"]["compromised"], 1)

    def test_ejercicio_completo(self):
        report = self.exercise.run_full_exercise()
        self.assertGreater(report["summary"]["compromised"], 0)
        self.assertGreater(report["summary"]["data_exfiltrated"], 0)


if __name__ == '__main__':
    unittest.main()
