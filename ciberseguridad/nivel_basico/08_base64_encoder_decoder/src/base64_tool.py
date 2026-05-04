import base64
import sys

def encode_b64(text):
    """
    Convierte texto plano a Base64.
    """
    # Convertimos el texto a bytes usando UTF-8
    text_bytes = text.encode('utf-8')
    # Codificamos a Base64
    b64_bytes = base64.b64encode(text_bytes)
    # Convertimos de nuevo a string para mostrarlo
    return b64_bytes.decode('utf-8')

def decode_b64(b64_text):
    """
    Convierte Base64 a texto plano.
    """
    try:
        # Convertimos el string Base64 a bytes
        b64_bytes = b64_text.encode('utf-8')
        # Decodificamos
        decoded_bytes = base64.b64decode(b64_bytes)
        # Convertimos a string UTF-8
        return decoded_bytes.decode('utf-8')
    except Exception as e:
        return f"Error al decodificar: {e}"

if __name__ == "__main__":
    print("-" * 50)
    print("BASE64 ENCODER/DECODER")
    print("-" * 50)

    mode = input("¿(E)ncodificar o (D)ecodificar?: ").lower().strip()
    data = input("Introduce los datos: ")

    if mode == 'e':
        print(f"\nResultado (Base64): {encode_b64(data)}")
    elif mode == 'd':
        print(f"\nResultado (Texto): {decode_b64(data)}")
    else:
        print("Opción no válida.")
