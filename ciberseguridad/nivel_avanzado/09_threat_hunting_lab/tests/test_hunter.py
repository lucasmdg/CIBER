import unittest
from src.threat_hunter import ThreatHunter, LogEvent


class TestThreatHunter(unittest.TestCase):
    def setUp(self):
        self.hunter = ThreatHunter()

    def _add_brute_force_events(self, count=6):
        for i in range(count):
            self.hunter.ingest_events([LogEvent(
                f"2024-01-01 10:00:{i:02d}", "fw", "login_fail",
                {"source_ip": "10.10.10.10", "user": "admin"}
            )])

    def test_detectar_fuerza_bruta(self):
        self._add_brute_force_events(6)
        findings = self.hunter.hunt_brute_force(threshold=5)
        self.assertGreater(len(findings), 0)

    def test_sin_fuerza_bruta(self):
        self._add_brute_force_events(2)
        findings = self.hunter.hunt_brute_force(threshold=5)
        self.assertEqual(len(findings), 0)

    def test_movimiento_lateral(self):
        for dst in ["10.0.0.1", "10.0.0.2", "10.0.0.3", "10.0.0.4"]:
            self.hunter.ingest_events([LogEvent(
                "2024-01-01", "fw", "connection",
                {"source_ip": "192.168.1.50", "dest_ip": dst}
            )])
        findings = self.hunter.hunt_lateral_movement()
        self.assertGreater(len(findings), 0)

    def test_ioc_match(self):
        self.hunter.ingest_events([LogEvent(
            "2024-01-01", "proxy", "connection",
            {"dest": "evil-c2.com", "source_ip": "192.168.1.1"}
        )])
        hits = self.hunter.check_iocs()
        self.assertGreater(len(hits), 0)

    def test_full_hunt(self):
        self._add_brute_force_events(6)
        report = self.hunter.full_hunt()
        self.assertIn("total_findings", report)
        self.assertGreater(report["total_findings"], 0)

    def test_timeline(self):
        self.hunter.ingest_events([
            LogEvent("2024-01-01 10:00:00", "fw", "login", {"user": "admin"}),
            LogEvent("2024-01-01 09:00:00", "fw", "login", {"user": "root"})
        ])
        timeline = self.hunter.generate_timeline()
        self.assertEqual(len(timeline), 2)
        # Debe estar ordenado por tiempo
        self.assertLessEqual(timeline[0]["time"], timeline[1]["time"])


if __name__ == '__main__':
    unittest.main()
