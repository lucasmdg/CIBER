from PIL import Image

def message_to_bin(message: str) -> str:
    """Convierte una cadena de texto a su representación en binario."""
    # Añadimos un carácter nulo al final como delimitador
    return ''.join(f"{ord(char):08b}" for char in message) + '00000000'

def bin_to_message(binary_data: str) -> str:
    """Convierte una cadena binaria de vuelta a texto hasta encontrar el delimitador nulo."""
    all_bytes = [binary_data[i:i+8] for i in range(0, len(binary_data), 8)]
    decoded_chars = []
    for byte in all_bytes:
        if len(byte) < 8:
            break
        char_code = int(byte, 2)
        if char_code == 0:
            break
        decoded_chars.append(chr(char_code))
    return "".join(decoded_chars)

def hide_message(image_path: str, secret_message: str, output_path: str) -> bool:
    """
    Oculta un mensaje secreto en una imagen PNG utilizando la técnica LSB.
    """
    try:
        img = Image.open(image_path)
        img = img.convert("RGB")
        pixels = list(img.getdata())
        width, height = img.size
        
        binary_message = message_to_bin(secret_message)
        message_len = len(binary_message)
        
        if message_len > len(pixels) * 3:
            raise ValueError("El mensaje es demasiado largo para esta imagen.")
            
        new_pixels = []
        data_index = 0
        
        for pixel in pixels:
            r, g, b = pixel
            
            if data_index < message_len:
                r = (r & ~1) | int(binary_message[data_index])
                data_index += 1
            if data_index < message_len:
                g = (g & ~1) | int(binary_message[data_index])
                data_index += 1
            if data_index < message_len:
                b = (b & ~1) | int(binary_message[data_index])
                data_index += 1
                
            new_pixels.append((r, g, b))
            
        new_img = Image.new("RGB", (width, height))
        new_img.putdata(new_pixels)
        new_img.save(output_path, "PNG")
        return True
    except Exception as e:
        print(f"Error al ocultar mensaje: {e}")
        return False

def reveal_message(image_path: str) -> str:
    """
    Extrae y decodifica un mensaje secreto oculto en una imagen usando LSB.
    """
    try:
        img = Image.open(image_path)
        img = img.convert("RGB")
        pixels = list(img.getdata())
        
        binary_data = ""
        for pixel in pixels:
            r, g, b = pixel
            binary_data += str(r & 1)
            binary_data += str(g & 1)
            binary_data += str(b & 1)
            
            # Si ya leímos un byte completo de ceros (delimitador nulo '\0')
            # podemos comprobar periódicamente si hemos terminado para optimizar.
            if len(binary_data) >= 8 and len(binary_data) % 8 == 0:
                # Comprobar el último byte leído
                last_byte = binary_data[-8:]
                if last_byte == "00000000":
                    break
                    
        return bin_to_message(binary_data)
    except Exception as e:
        print(f"Error al revelar mensaje: {e}")
        return ""
