import time
import sys

class ExploitModule:
    def __init__(self, name, description, default_port):
        self.name = name
        self.description = description
        self.default_port = default_port
        self.options = {
            "RHOST": "127.0.0.1",
            "RPORT": default_port,
            "PAYLOAD": "generic/shell_reverse_tcp"
        }

    def run(self):
        print(f"\n[*] Ejecutando exploit: {self.name}")
        print(f"[*] Destino: {self.options['RHOST']}:{self.options['RPORT']}")
        print(f"[*] Payload: {self.options['PAYLOAD']}")
        time.sleep(1)
        print("[*] Conectando y enviando negociación inicial...")
        time.sleep(1)
        print("[*] Inyectando shellcode y payload en memoria remota...")
        time.sleep(1)
        print("[+] ¡Exploit completado con éxito!")
        print(f"[+] Sesión de shell reversa abierta con {self.options['RHOST']}:4444")
        print(" nexus_shell> whoami")
        print(" system")
        print(" nexus_shell> exit")

class NexusFramework:
    def __init__(self):
        self.exploits = {
            "exploit/windows/smb/ms17_010_eternalblue": ExploitModule(
                "MS17-010 EternalBlue SMB", 
                "Aprovecha vulnerabilidad SMBv1 en Windows para ejecución de código.", 
                "445"
            ),
            "exploit/linux/http/apache_activemq_rce": ExploitModule(
                "Apache ActiveMQ RCE Exploit", 
                "Aprovecha la vulnerabilidad RCE en el protocolo OpenWire de ActiveMQ.", 
                "8161"
            )
        }
        self.active_module = None

    def cli(self):
        print("=" * 60)
        print("  NEXUS EXPLOITATION FRAMEWORK CONSOLE v1.0.4")
        print("=" * 60)
        print("Escribe 'help' para ver los comandos disponibles.\n")

        while True:
            prompt = "nexus > " if not self.active_module else f"nexus ({self.active_module}) > "
            try:
                cmd_line = input(prompt).strip()
            except (KeyboardInterrupt, EOFError):
                print("\n[-] Saliendo del framework.")
                break

            if not cmd_line:
                continue

            parts = cmd_line.split()
            cmd = parts[0].lower()

            if cmd == "exit":
                break
            elif cmd == "help":
                print("\nComandos disponibles:")
                print("  show exploits  - Muestra la lista de exploits disponibles")
                print("  use <exploit>  - Selecciona un exploit para su configuración")
                print("  set <var> <val>- Configura variables de exploit (RHOST, RPORT, PAYLOAD)")
                print("  options        - Muestra las opciones y variables actuales")
                print("  run            - Lanza el exploit actual")
                print("  back           - Quita el exploit seleccionado")
                print("  exit           - Sale del programa\n")
            elif cmd == "show" and len(parts) > 1 and parts[1] == "exploits":
                print("\nExploits Disponibles:")
                for name, mod in self.exploits.items():
                    print(f"  * {name} - {mod.description}")
                print()
            elif cmd == "use" and len(parts) > 1:
                module_name = parts[1]
                if module_name in self.exploits:
                    self.active_module = module_name
                    print(f"[+] Usando módulo: {module_name}")
                else:
                    print(f"[-] Error: El módulo '{module_name}' no existe.")
            elif cmd == "set" and len(parts) > 2:
                if not self.active_module:
                    print("[-] Error: No se ha seleccionado ningún exploit. Usa 'use <exploit>'.")
                    continue
                var_name = parts[1].upper()
                var_val = parts[2]
                mod = self.exploits[self.active_module]
                if var_name in mod.options:
                    mod.options[var_name] = var_val
                    print(f"[+] {var_name} => {var_val}")
                else:
                    print(f"[-] Variable '{var_name}' inválida.")
            elif cmd == "options":
                if not self.active_module:
                    print("[-] Error: Seleccione un exploit primero con 'use'.")
                    continue
                mod = self.exploits[self.active_module]
                print(f"\nOpciones para {self.active_module}:")
                for k, v in mod.options.items():
                    print(f"  {k} : {v}")
                print()
            elif cmd == "run":
                if not self.active_module:
                    print("[-] Error: Seleccione un exploit primero.")
                    continue
                self.exploits[self.active_module].run()
            elif cmd == "back":
                self.active_module = None
            else:
                print(f"[-] Comando no reconocido: '{cmd}'. Escribe 'help'.")

if __name__ == "__main__":
    NexusFramework().cli()
