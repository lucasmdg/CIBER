# 🚀 Integración DevSecOps y CI/CD

El repositorio de SentinelX cuenta con tuberías de automatización avanzadas en **GitHub Actions** orientadas a garantizar la calidad del código y la seguridad de la cadena de suministro de dependencias (software supply chain security).

---

## 🛠️ Workflows de GitHub Actions Configurados

Los flujos de trabajo se encuentran localizados en la ruta `.github/workflows/`:

### 1. Integración Continua (`ci.yml`)
- **Frecuencia**: Se ejecuta en cada `push` o `pull-request` dirigido a la rama principal (`main`).
- **Tareas**:
  - Configura el entorno de ejecución Node.js (Node 20).
  - Instala dependencias bloqueando alteraciones en el package-lock (`npm ci`).
  - Ejecuta validación estricta de tipos de TypeScript (`npm run typecheck`).
  - Ejecuta el análisis estático de bugs y formato (`npm run lint`).
  - Lanza la suite de pruebas unitarias y de integración (`npm run test`).

### 2. Detección de Fugas de Secretos (`gitleaks.yml`)
- **Herramienta**: **Gitleaks** (ejecutado de forma nativa a través de una Action oficial).
- **Alcance**: Analiza el historial completo de commits en búsqueda de secretos expuestos accidentalmente (claves de AWS, tokens de NextAuth, contraseñas de bases de datos, claves SSH).
- **Hardening**: Si se detecta un secreto sospechoso, el workflow bloquea inmediatamente la integración en la rama principal.

### 3. Análisis de Dependencias Vulnerables (`dependabot.yml`)
- **Herramienta**: GitHub **Dependabot**.
- **Alcance**: Monitorea de forma diaria el archivo `package.json`. Si alguna de nuestras librerías sufre de alguna vulnerabilidad de seguridad divulgada en la base de datos de GitHub Advisories, Dependabot genera de forma automática un Pull Request de actualización con la solución de parche recomendada.
- **Automatización**: Se incluye un workflow de auto-merge (`dependabot-auto-merge.yml`) que aprueba y fusiona automáticamente parches menores y parches de seguridad si la suite de tests (`ci.yml`) se ejecuta con éxito.

---

## 🛡️ Hooks de Commit (Husky + Commitlint)

Para forzar la higiene del código local antes de que este llegue a GitHub, configuramos hooks locales en el subdirectorio `.husky/`:
- **Commit Linting (`commit-msg`)**: Evalúa el mensaje del commit del desarrollador garantizando que cumpla con el estándar de commits convencionales (ej. `feat: ...`, `fix: ...`, `docs: ...`).
- **Pre-commit Checks (`pre-commit`)**: Lanza automáticamente Prettier y ESLint sobre los archivos modificados antes de confirmar el commit, asegurando que no se suban archivos con errores sintácticos o de formato.
