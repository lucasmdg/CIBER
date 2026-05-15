import unittest
from src.nids import NIDS, ThreatIntelligence, NetworkFlow


class TestNIDS(unittest.TestCase):
    def setUp(self):
        self.nids = NIDS()

    def test_trafico_normal(self):
        self.nids.process_packet("192.168.1.1", "10.0.0.1", 80, 512)
        self.assertEqual(len(self.nids.get_alerts()), 0)

    def test_detectar_port_scan(self):
        for port in range(1, 25):
            self.nids.process_packet("10.10.10.10", "192.168.1.1", port, 64)
        alerts = self.nids.get_alerts()
        self.assertGreater(len(alerts), 0)

    def test_ip_en_lista_negra(self):
        self.nids.block_ip("666.666.666.666")
        self.nids.process_packet("666.666.666.666", "192.168.1.1", 80, 100)
        alerts = self.nids.get_alerts("CRITICAL")
        self.assertGreater(len(alerts), 0)

    def test_reporte(self):
        self.nids.process_packet("1.1.1.1", "2.2.2.2", 80, 100)
        report = self.nids.get_report()
        self.assertEqual(report["total_packets"], 1)

    def test_exfiltracion_datos(self):
        # Simulamos una transferencia masiva
        self.nids.DATA_EXFIL_BYTES = 1000
        for _ in range(20):
            self.nids.process_packet("10.0.0.1", "evil.com", 443, 100)
        alerts = self.nids.get_alerts("CRITICAL")
        self.assertGreater(len(alerts), 0)


class TestThreatIntel(unittest.TestCase):
    def test_blacklist(self):
        ti = ThreatIntelligence()
        ti.add_blacklisted_ip("1.2.3.4")
        self.assertTrue(ti.is_blacklisted("1.2.3.4"))
        self.assertFalse(ti.is_blacklisted("5.6.7.8"))

    def test_cargar_firmas(self):
        ti = ThreatIntelligence()
        sigs = ti.load_signatures()
        self.assertGreater(len(sigs), 0)


class TestNetworkFlow(unittest.TestCase):
    def test_agregar_paquetes(self):
        flow = NetworkFlow("1.1.1.1", "2.2.2.2")
        flow.add_packet(100, 80)
        flow.add_packet(200, 443)
        self.assertEqual(flow.packets, 2)
        self.assertEqual(flow.bytes_transferred, 300)
        self.assertEqual(len(flow.ports_accessed), 2)


if __name__ == '__main__':
    unittest.main()
