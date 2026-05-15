"""
Tests para el sistema de monitorizacion de logs.
"""
import unittest
import tempfile
import os

from src.log_monitor import LogMonitor, DetectionRule, AlertLevel, analyze_log_file


class TestDetectionRule(unittest.TestCase):

    def test_regla_detecta_patron(self):
        """Una regla con threshold=1 debe dispararse a la primera coincidencia."""
        regla = DetectionRule(
            name="Test", pattern=r"failed password",
            alert_level=AlertLevel.WARNING, threshold=1
        )
        resultado = regla.check("May 10 10:00:00 server sshd: Failed password for root")
        self.assertTrue(resultado)

    def test_regla_no_detecta_patron(self):
        """Si la linea no coincide, no debe dispararse."""
        regla = DetectionRule(
            name="Test", pattern=r"failed password",
            alert_level=AlertLevel.WARNING, threshold=1
        )
        resultado = regla.check("May 10 10:00:00 server: User logged in successfully")
        self.assertFalse(resultado)

    def test_regla_con_threshold(self):
        """Una regla con threshold=3 solo se dispara tras 3 coincidencias."""
        regla = DetectionRule(
            name="Test", pattern=r"error",
            alert_level=AlertLevel.WARNING, threshold=3, window_seconds=60
        )
        self.assertFalse(regla.check("error 1"))
        self.assertFalse(regla.check("error 2"))
        self.assertTrue(regla.check("error 3"))


class TestLogMonitor(unittest.TestCase):

    def test_procesar_linea_sospechosa(self):
        """El monitor debe generar alertas para lineas sospechosas."""
        monitor = LogMonitor()
        monitor.load_default_rules()

        alertas = monitor.process_line("Failed password for root from 10.0.0.1")
        # Deberia haber al menos alguna alerta (puede no llegar al threshold)
        # Pero la regla de login fallido con threshold=5 no salta a la primera
        # Probemos con inyeccion SQL que tiene threshold=1
        alertas = monitor.process_line("SELECT * FROM users WHERE id=1 UNION SELECT * FROM passwords")
        self.assertTrue(len(alertas) > 0)

    def test_resumen(self):
        """El resumen debe contar correctamente las alertas."""
        monitor = LogMonitor()
        monitor.load_default_rules()

        # Generamos una alerta critica
        monitor.process_line("intento de acceder a /etc/passwd detectado")

        resumen = monitor.get_summary()
        self.assertGreaterEqual(resumen['total_alertas'], 1)
        self.assertGreaterEqual(resumen['criticas'], 1)

    def test_analizar_archivo_completo(self):
        """Debe poder analizar un archivo de log de principio a fin."""
        # Creamos un log falso con actividad sospechosa
        with tempfile.NamedTemporaryFile(mode='w', suffix='.log',
                                          delete=False, encoding='utf-8') as f:
            f.write("2024-01-01 Normal startup\n")
            f.write("2024-01-01 User login successful\n")
            f.write("2024-01-01 SELECT * FROM users UNION SELECT * FROM admin\n")
            f.write("2024-01-01 Acceso a /etc/shadow detectado\n")
            temp_path = f.name

        try:
            resumen = analyze_log_file(temp_path)
            self.assertGreaterEqual(resumen['total_alertas'], 1)
        finally:
            os.unlink(temp_path)


if __name__ == '__main__':
    unittest.main()
