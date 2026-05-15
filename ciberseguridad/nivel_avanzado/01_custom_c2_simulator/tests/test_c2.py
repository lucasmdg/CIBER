import unittest
from src.c2_simulator import C2Server, C2Agent


class TestC2Server(unittest.TestCase):
    def setUp(self):
        self.server = C2Server()

    def test_registrar_agente(self):
        result = self.server.register_agent("A1", {"os": "test"})
        self.assertTrue(result)
        self.assertIn("A1", self.server.agents)

    def test_encolar_tarea(self):
        self.server.register_agent("A1", {})
        result = self.server.add_task("A1", "whoami")
        self.assertTrue(result)

    def test_tarea_agente_no_existe(self):
        result = self.server.add_task("NOEXISTE", "whoami")
        self.assertFalse(result)

    def test_obtener_tareas(self):
        self.server.register_agent("A1", {})
        self.server.add_task("A1", "sysinfo")
        tasks = self.server.get_tasks("A1")
        self.assertEqual(len(tasks), 1)
        # Despues de obtenerlas, la cola debe estar vacia
        tasks2 = self.server.get_tasks("A1")
        self.assertEqual(len(tasks2), 0)

    def test_enviar_resultado(self):
        self.server.register_agent("A1", {})
        self.server.submit_result("A1", "dato_exfiltrado")
        results = self.server.get_results("A1")
        self.assertEqual(len(results), 1)


class TestC2Agent(unittest.TestCase):
    def test_flujo_completo(self):
        server = C2Server()
        agent = C2Agent("AGENT-TEST", server)
        agent.register()
        server.add_task("AGENT-TEST", "whoami")
        results = agent.check_in()
        self.assertEqual(results, ["usuario_simulado"])


if __name__ == '__main__':
    unittest.main()
