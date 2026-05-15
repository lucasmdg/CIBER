# Simulador de Servidor C2 (Comando y Control)

## Descripcion
Un C2 (Command & Control) es el corazon de cualquier operacion ofensiva avanzada. Es el servidor desde el que un atacante (o un equipo de Red Team) controla remotamente las maquinas comprometidas.

Este proyecto simula toda esa arquitectura de forma segura y local: un servidor que acepta registros de agentes, les envia tareas, y recibe los resultados.

## Arquitectura
- **C2Server**: El servidor central que gestiona agentes, tareas y resultados.
- **C2Agent**: Un cliente simulado que se registra, recoge tareas y las ejecuta.

## Conceptos clave
- **Polling**: El agente pregunta periodicamente "Tienes algo para mi?" al servidor.
- **Beaconing**: Intervalos regulares de comunicacion (en este simulador es inmediato).
- **Exfiltracion**: Enviar datos robados al servidor C2.

## Requisitos
- Python 3.x (sin dependencias externas)

## Uso
```bash
python src/c2_simulator.py
```
