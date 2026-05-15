"""
Simulador de Servidor C2 (Comando y Control)

Explicacion humana:
    Un servidor C2 es el "cerebro" de un ataque. Es la maquina desde la
    que el atacante controla todos los equipos que ha comprometido (llamados
    "agentes" o "zombies"). Desde aqui puede enviar ordenes como:
    "dame la lista de archivos", "ejecuta este comando", "envia datos".

    Este simulador crea un servidor HTTP basico que acepta conexiones de
    agentes (simulados) y les envia tareas. Todo en un entorno controlado.

    En la vida real, los C2 usan canales cifrados, DNS tunneling, o incluso
    redes sociales para comunicarse. Aqui lo simplificamos para entenderlo.
"""

import http.server
import json
import threading
import time
from datetime import datetime


class C2Server:
    """Servidor de Comando y Control simulado."""

    def __init__(self, host="127.0.0.1", port=8443):
        self.host = host
        self.port = port
        self.agents = {}
        self.pending_tasks = {}
        self.results = {}
        self.server = None

    def register_agent(self, agent_id, agent_info):
        """Registra un nuevo agente (maquina comprometida)."""
        self.agents[agent_id] = {
            "info": agent_info,
            "first_seen": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "last_seen": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "status": "active"
        }
        self.pending_tasks[agent_id] = []
        return True

    def add_task(self, agent_id, task):
        """Encola una tarea para un agente especifico."""
        if agent_id not in self.agents:
            return False
        self.pending_tasks[agent_id].append({
            "task": task,
            "created": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            "status": "pending"
        })
        return True

    def get_tasks(self, agent_id):
        """El agente pide sus tareas pendientes (polling)."""
        if agent_id not in self.pending_tasks:
            return []
        tasks = self.pending_tasks[agent_id]
        self.pending_tasks[agent_id] = []
        # Actualizamos el ultimo contacto
        if agent_id in self.agents:
            self.agents[agent_id]["last_seen"] = (
                datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            )
        return tasks

    def submit_result(self, agent_id, result):
        """El agente envia los resultados de una tarea completada."""
        if agent_id not in self.results:
            self.results[agent_id] = []
        self.results[agent_id].append({
            "result": result,
            "received": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        })
        return True

    def list_agents(self):
        """Devuelve la lista de agentes registrados."""
        return self.agents

    def get_results(self, agent_id):
        """Devuelve los resultados recibidos de un agente."""
        return self.results.get(agent_id, [])


class C2Agent:
    """Agente simulado que se conecta al C2."""

    def __init__(self, agent_id, c2_server):
        self.agent_id = agent_id
        self.c2 = c2_server
        self.running = False

    def register(self):
        """Se registra en el servidor C2."""
        info = {"os": "SimulatedOS", "arch": "x64"}
        return self.c2.register_agent(self.agent_id, info)

    def check_in(self):
        """Hace check-in para recoger tareas pendientes."""
        tasks = self.c2.get_tasks(self.agent_id)
        results = []
        for task_info in tasks:
            result = self.execute_task(task_info["task"])
            results.append(result)
            self.c2.submit_result(self.agent_id, result)
        return results

    def execute_task(self, task):
        """Ejecuta una tarea (simulada, no ejecuta nada real)."""
        if task == "whoami":
            return "usuario_simulado"
        elif task == "sysinfo":
            return "OS: SimulatedOS | Arch: x64 | RAM: 8GB"
        elif task == "ls":
            return "archivo1.txt  archivo2.py  carpeta/"
        else:
            return f"Tarea '{task}' ejecutada (simulada)"


if __name__ == "__main__":
    print("=== Simulador C2 (Modo local) ===\n")

    # Creamos el servidor
    server = C2Server()

    # Simulamos un agente que se conecta
    agent = C2Agent("AGENT-001", server)
    agent.register()
    print("[+] Agente registrado")

    # Enviamos tareas al agente
    server.add_task("AGENT-001", "whoami")
    server.add_task("AGENT-001", "sysinfo")
    server.add_task("AGENT-001", "ls")
    print("[+] 3 tareas encoladas")

    # El agente recoge y ejecuta las tareas
    results = agent.check_in()
    print(f"[+] Resultados recibidos: {results}")

    # Mostramos el estado
    agents = server.list_agents()
    print(f"\n[*] Agentes activos: {len(agents)}")
    for aid, info in agents.items():
        print(f"    {aid}: {info['status']} (visto: {info['last_seen']})")
