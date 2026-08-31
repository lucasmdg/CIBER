import os
from PIL import Image

def strip_image_metadata(image_path: str, output_path: str) -> bool:
    """
    Elimina todos los metadatos (EXIF, GPS, perfiles) de una imagen (JPEG, PNG).
    Esto se logra cargando los píxeles puros de la imagen original y guardándolos
    en una imagen nueva desde cero.
    """
    try:
        img = Image.open(image_path)
        
        # Guardar el formato original
        img_format = img.format if img.format else "JPEG"
        
        # Crear una copia de los datos de píxeles puros
        data = list(img.getdata())
        
        # Crear una nueva imagen limpia con el mismo modo y tamaño
        clean_img = Image.new(img.mode, img.size)
        clean_img.putdata(data)
        
        # Guardar sin metadatos
        clean_img.save(output_path, format=img_format)
        return True
    except Exception as e:
        print(f"Error al limpiar metadatos de la imagen: {e}")
        return False

def get_metadata_summary(image_path: str) -> dict:
    """
    Devuelve un resumen de los metadatos EXIF presentes en una imagen.
    """
    summary = {}
    try:
        img = Image.open(image_path)
        info = img._getexif()
        if info:
            for tag, value in info.items():
                summary[tag] = str(value)
    except Exception:
        # Si no tiene EXIF o no es compatible
        pass
    return summary
