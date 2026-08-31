import math
import secrets
import string

COMMON_PASSWORDS = {
    "123456", "password", "123456789", "12345678", "12345", "qwerty",
    "password123", "admin", "admin123", "welcome", "letmein", "123123"
}

def calculate_entropy(password: str) -> float:
    """
    Calcula la entropía de la contraseña basada en el tamaño del conjunto de caracteres.
    Entropía = L * log2(R)
    """
    if not password:
        return 0.0
        
    length = len(password)
    pool_size = 0
    
    has_lower = any(c.islower() for c in password)
    has_upper = any(c.isupper() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in string.punctuation for c in password)
    
    if has_lower:
        pool_size += 26
    if has_upper:
        pool_size += 26
    if has_digit:
        pool_size += 10
    if has_special:
        pool_size += len(string.punctuation)
        
    # Si contiene caracteres no estándar
    other_chars = sum(1 for c in password if not (c.isalnum() or c in string.punctuation))
    if other_chars > 0:
        pool_size += 30
        
    if pool_size == 0:
        return 0.0
        
    entropy = length * math.log2(pool_size)
    return round(entropy, 2)

def audit_password(password: str) -> dict:
    """
    Audita una contraseña y devuelve un informe detallado de seguridad.
    """
    if not password:
        return {
            "score": 0,
            "status": "Muy Débil",
            "entropy": 0.0,
            "warnings": ["La contraseña está vacía."]
        }
        
    warnings = []
    
    # Comprobar si es muy común
    if password.lower() in COMMON_PASSWORDS:
        warnings.append("La contraseña es extremadamente común y fácil de adivinar.")
        
    # Longitud
    length = len(password)
    if length < 8:
        warnings.append("La contraseña tiene menos de 8 caracteres.")
    elif length < 12:
        warnings.append("Considera aumentar la longitud a al menos 12 caracteres.")
        
    # Tipos de caracteres
    has_lower = any(c.islower() for c in password)
    has_upper = any(c.isupper() for c in password)
    has_digit = any(c.isdigit() for c in password)
    has_special = any(c in string.punctuation for c in password)
    
    if not has_lower:
        warnings.append("No contiene letras minúsculas.")
    if not has_upper:
        warnings.append("No contiene letras mayúsculas.")
    if not has_digit:
        warnings.append("No contiene números.")
    if not has_special:
        warnings.append("No contiene caracteres especiales.")
        
    entropy = calculate_entropy(password)
    
    # Determinar nivel y score (0 a 4)
    score = 0
    if length >= 8:
        score += 1
    if has_lower and has_upper:
        score += 1
    if has_digit:
        score += 1
    if has_special and length >= 10:
        score += 1
        
    # Penalizar si es común
    if password.lower() in COMMON_PASSWORDS:
        score = min(score, 1)
        
    if entropy < 30:
        status = "Muy Débil"
    elif entropy < 50:
        status = "Débil"
    elif entropy < 80:
        status = "Segura"
    else:
        status = "Muy Segura"
        
    return {
        "score": score,
        "status": status,
        "entropy": entropy,
        "warnings": warnings
    }

def generate_secure_password(length: int = 16, use_upper: bool = True, use_digits: bool = True, use_special: bool = True) -> str:
    """
    Genera una contraseña criptográficamente segura usando el módulo secrets.
    """
    length = max(length, 4) # Asegurar mínimo funcional
    
    chars = list(string.ascii_lowercase)
    guaranteed = [secrets.choice(string.ascii_lowercase)]
    
    if use_upper:
        chars.extend(string.ascii_uppercase)
        guaranteed.append(secrets.choice(string.ascii_uppercase))
    if use_digits:
        chars.extend(string.digits)
        guaranteed.append(secrets.choice(string.digits))
    if use_special:
        chars.extend(string.punctuation)
        guaranteed.append(secrets.choice(string.punctuation))
        
    # Rellenar el resto de la longitud
    remaining = length - len(guaranteed)
    for _ in range(remaining):
        guaranteed.append(secrets.choice(chars))
        
    # Mezclar el resultado usando un generador seguro
    secrets.SystemRandom().shuffle(guaranteed)
    return "".join(guaranteed)
