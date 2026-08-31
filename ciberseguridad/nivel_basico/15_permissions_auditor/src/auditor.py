import os
import stat

SENSITIVE_FILES = {
    ".env", "id_rsa", "id_dsa", "passwd", "shadow", "secret.key", "database.db", "vault.json"
}

def audit_file_permissions(file_path: str) -> list:
    """
    Audita los permisos de un archivo o directorio específico.
    Identifica SUID, SGID, world-writable, world-readable sin justificar y
    ficheros sensibles con permisos excesivos.
    """
    issues = []
    try:
        # Obtener los metadatos de permisos
        st = os.stat(file_path)
        mode = st.st_mode
        is_dir = stat.S_ISDIR(mode)
        
        # 1. Comprobar bits SUID / SGID (solo aplica a UNIX, pero Python puede leerlos)
        if mode & stat.S_ISUID:
            issues.append("Bit SUID activo (el archivo se ejecuta con privilegios del propietario).")
        if mode & stat.S_ISGID:
            issues.append("Bit SGID activo (el archivo se ejecuta con privilegios del grupo).")
            
        # 2. Comprobar si cualquiera puede escribir en él (World-writable)
        # stat.S_IWOTH es 0o002 (escritura para otros)
        if mode & stat.S_IWOTH:
            if is_dir:
                # Si es directorio world-writable, comprobar si le falta el Sticky Bit (stat.S_ISVTX = 0o1000)
                if not (mode & stat.S_ISVTX):
                    issues.append("Directorio escribible por todos (world-writable) sin el sticky bit activo (riesgo de borrado de archivos ajenos).")
            else:
                issues.append("Archivo escribible por todos (world-writable).")
                
        # 3. Comprobar ficheros sensibles
        filename = os.path.basename(file_path).lower()
        if filename in SENSITIVE_FILES:
            # Comprobar si es legible por cualquiera (stat.S_IROTH = 0o004)
            if mode & stat.S_IROTH:
                issues.append(f"Archivo sensible legible por cualquiera (world-readable).")
            # Comprobar si es legible por el grupo (stat.S_IRGRP = 0o040)
            if mode & stat.S_IRGRP:
                issues.append(f"Archivo sensible legible por el grupo (group-readable).")
                
    except Exception as e:
        # Si ocurre un error (por ejemplo, permiso denegado para leer metadatos)
        pass
        
    return issues

def scan_directory(root_path: str) -> dict:
    """
    Escanea recursivamente un directorio para auditar permisos de todos sus ficheros.
    """
    results = {}
    if not os.path.exists(root_path):
        return results
        
    for root, dirs, files in os.walk(root_path):
        # Auditar directorios
        for d in dirs:
            dir_path = os.path.join(root, d)
            dir_issues = audit_file_permissions(dir_path)
            if dir_issues:
                results[dir_path] = dir_issues
                
        # Auditar archivos
        for f in files:
            file_path = os.path.join(root, f)
            file_issues = audit_file_permissions(file_path)
            if file_issues:
                results[file_path] = file_issues
                
    return results
