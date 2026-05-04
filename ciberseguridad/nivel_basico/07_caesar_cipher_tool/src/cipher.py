def caesar_cipher(text, shift, decrypt=False):
    """
    Cifra o descifra un texto usando el algoritmo César.
    """
    result = ""
    # Si es descifrado, invertimos el desplazamiento
    if decrypt:
        shift = -shift
    
    for char in text:
        # Procesar mayúsculas
        if char.isupper():
            # (Posición actual - Inicio A + Desplazamiento) % 26 + Inicio A
            result += chr((ord(char) - 65 + shift) % 26 + 65)
        # Procesar minúsculas
        elif char.islower():
            # (Posición actual - Inicio a + Desplazamiento) % 26 + Inicio a
            result += chr((ord(char) - 97 + shift) % 26 + 97)
        # Mantener caracteres no alfabéticos
        else:
            result += char
            
    return result

if __name__ == "__main__":
    print("-" * 50)
    print("CAESAR CIPHER TOOL")
    print("-" * 50)
    
    mode = input("¿Cifrar o Descifrar? (c/d): ").lower().strip()
    message = input("Introduce el mensaje: ")
    try:
        s_value = int(input("Introduce el desplazamiento (ej: 3): "))
    except ValueError:
        print("Error: El desplazamiento debe ser un número entero.")
        exit()

    if mode == 'c':
        print(f"\nMensaje cifrado: {caesar_cipher(message, s_value)}")
    elif mode == 'd':
        print(f"\nMensaje descifrado: {caesar_cipher(message, s_value, decrypt=True)}")
    else:
        print("Opción no válida.")
