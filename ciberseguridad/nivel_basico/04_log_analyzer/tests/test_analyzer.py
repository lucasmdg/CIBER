import unittest
import os
from src.analyzer import analyze_logs

class TestLogAnalyzer(unittest.TestCase):

    def setUp(self):
        self.test_log = "test_access.log"
        with open(self.test_log, "w") as f:
            f.write('192.168.1.1 - - [01/May/2026] "GET /home HTTP/1.1" 200 100\n')
            f.write('192.168.1.1 - - [01/May/2026] "GET /login HTTP/1.1" 200 100\n')
            f.write('10.0.0.5 - - [01/May/2026] "GET /admin HTTP/1.1" 403 50\n')
            f.write('10.0.0.5 - - [01/May/2026] "GET /secret HTTP/1.1" 404 50\n')
            # 12 fallos 404 para la misma IP
            for i in range(12):
                f.write(f'1.1.1.1 - - [01/May/2026] "GET /file{i} HTTP/1.1" 404 50\n')

    def tearDown(self):
        if os.path.exists(self.test_log):
            os.remove(self.test_log)

    def test_analysis(self):
        results = analyze_logs(self.test_log)
        self.assertIsNotNone(results)
        
        # Verificar conteo de IPs
        self.assertEqual(results['ip_counts']['192.168.1.1'], 2)
        self.assertEqual(results['ip_counts']['10.0.0.5'], 2)
        self.assertEqual(results['ip_counts']['1.1.1.1'], 12)
        
        # Verificar estados
        self.assertEqual(results['status_counts']['200'], 2)
        self.assertEqual(results['status_counts']['404'], 13)
        
        # Verificar IPs sospechosas
        self.assertIn('1.1.1.1', results['suspicious_ips'])
        self.assertNotIn('192.168.1.1', results['suspicious_ips'])

if __name__ == '__main__':
    unittest.main()
