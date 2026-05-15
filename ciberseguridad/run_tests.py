import os
import subprocess
import sys

def run_tests():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    niveles = ['nivel_basico', 'nivel_intermedio', 'nivel_avanzado']
    
    total_projects = 0
    passed_projects = 0

    for nivel in niveles:
        nivel_path = os.path.join(base_dir, nivel)
        if not os.path.exists(nivel_path):
            continue
            
        for proyecto in os.listdir(nivel_path):
            proyecto_path = os.path.join(nivel_path, proyecto)
            if not os.path.isdir(proyecto_path):
                continue
                
            test_dir = os.path.join(proyecto_path, 'tests')
            if os.path.exists(test_dir) and os.listdir(test_dir):
                print(f"\\n{'='*50}")
                print(f"Ejecutando pruebas para: {nivel}/{proyecto}")
                print(f"{'='*50}")
                
                # Ejecutar pytest en el directorio del proyecto
                # Usamos python -m pytest para asegurar que sys.path contenga el directorio actual
                result = subprocess.run(
                    [sys.executable, '-m', 'pytest', 'tests/'],
                    cwd=proyecto_path,
                    capture_output=True,
                    text=True
                )
                
                print(result.stdout)
                if result.returncode != 0:
                    print(result.stderr)
                    print(f"[FAIL] Falló: {proyecto}")
                else:
                    print(f"[OK] Éxito: {proyecto}")
                    passed_projects += 1
                total_projects += 1

    print(f"\\n{'='*50}")
    print(f"Resumen de pruebas: {passed_projects}/{total_projects} proyectos pasaron.")
    print(f"{'='*50}")
    
    if passed_projects < total_projects:
        sys.exit(1)
    else:
        sys.exit(0)

if __name__ == '__main__':
    run_tests()
