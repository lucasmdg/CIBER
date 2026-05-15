import re

with open('c:/Users/Lucas/Desktop/CIBER/ciberseguridad/portfolio/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Quitar emojis y usar _>
content = re.sub(r'<div class="project-icon">&#[0-9]+;</div>', '<div class="project-icon">_&gt;</div>', content)
content = re.sub(r'<div class="project-icon">&#[xX][0-9a-fA-F]+;</div>', '<div class="project-icon">_&gt;</div>', content)
# Algunos de los emojis en el archivo están directamente pegados o son entidades raras, pero los escribí como entidades numéricas (&#128274;).

about_old = """<div class="about-text">
                <h3>Cybersecurity Engineer</h3>
                <p>Apasionado por la ciberseguridad ofensiva y defensiva. Construyo herramientas desde cero en Python para entender como funcionan los ataques por dentro y como defenderse de ellos.</p>
                <p>Mi objetivo es dominar el ciclo completo: desde el reconocimiento inicial hasta la generacion de reportes profesionales de pentesting.</p>
            </div>"""
            
about_new = """<div class="about-text">
                <h3>Estudiante de Telecomunicaciones e Informática</h3>
                <p>Soy estudiante de un ciclo superior en Telecomunicaciones e Informática, con una clara orientación hacia el mundo de la ciberseguridad, un campo que no solo me interesa, sino que realmente me apasiona.</p>
                <p>Tengo una base sólida en Python y actualmente estoy ampliando mis conocimientos en Java y JavaScript. Además, cuento con nociones de C y C++. Más allá de lo técnico, soy alguien cercano, comunicativo y muy colaborativo.</p>
                <p>Mi objetivo es especializarme en ciberseguridad y formar parte de proyectos donde pueda aportar y seguir creciendo.</p>
            </div>"""

content = content.replace(about_old, about_new)

# Quitar los porcentajes de las skills
content = re.sub(r'<span>[0-9]+%</span>', '', content)

with open('c:/Users/Lucas/Desktop/CIBER/ciberseguridad/portfolio/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
