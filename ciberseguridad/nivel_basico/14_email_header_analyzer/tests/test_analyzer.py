import unittest
from src.analyzer import analyze_email_headers

class TestEmailHeaderAnalyzer(unittest.TestCase):

    def test_analyze_clean_email(self):
        eml_content = """From: Support <support@legit.com>
Return-Path: <support@legit.com>
Subject: Welcome back
Message-ID: <12345@legit.com>
Authentication-Results: mx.google.com; spf=pass dkim=pass dmarc=pass

This is a safe email body.
"""
        report = analyze_email_headers(eml_content)
        self.assertEqual(report["from"], "support@legit.com")
        self.assertEqual(report["threat_score"], 0)
        self.assertFalse(report["suspicious"])
        self.assertEqual(len(report["anomalies"]), 0)

    def test_analyze_spoofed_return_path(self):
        eml_content = """From: Bank Admin <admin@mybank.com>
Return-Path: <scammer@phishinghub.net>
Subject: Security Alert
Message-ID: <abc@mybank.com>

Please log in.
"""
        report = analyze_email_headers(eml_content)
        self.assertEqual(report["from"], "admin@mybank.com")
        self.assertEqual(report["return_path"], "scammer@phishinghub.net")
        self.assertTrue(report["threat_score"] >= 3)
        self.assertTrue(any("Discrepancia de dominio" in a for a in report["anomalies"]))

    def test_analyze_auth_fail(self):
        eml_content = """From: Services <info@netflix.com>
Return-Path: <info@netflix.com>
Subject: Update Billing
Message-ID: <netflix-billing-123@netflix.com>
Authentication-Results: mx.google.com; spf=fail dkim=fail dmarc=fail

Please update billing.
"""
        report = analyze_email_headers(eml_content)
        self.assertTrue(report["suspicious"])
        self.assertTrue(report["threat_score"] >= 5)
        self.assertTrue(any("Fallo crítico en autenticación" in a for a in report["anomalies"]))

if __name__ == '__main__':
    unittest.main()
