import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Remove Navbar
html = re.sub(r'<!-- NAVBAR -->.*?</nav>', '', html, flags=re.DOTALL)

# 2. Add particles-canvas before hero
html = html.replace('<section class="hero" id="hero">', '<canvas id="particles-canvas" style="position:absolute; top:0; left:0; width:100%; height:100vh; z-index:0; pointer-events:none;"></canvas>\n    <section class="hero" id="hero">')

# 3. Update Hero
html = html.replace('<span>CYBERSECURITY ENGINEER</span>', '<span>MIS PROYECTOS</span>')
html = re.sub(r'<p class="hero-subtitle">.*?</p>', '<p class="hero-subtitle">1º de Telecomunicaciones Ciclo Superior</p>', html, flags=re.DOTALL)

# 4. Fix Links and add LinkedIn
old_links = r'<div class="project-links">\s*<a href="#" class="btn-elegant">Demo</a>\s*<a href="#" class="btn-elegant btn-github">GitHub</a>\s*</div>'
new_links = '''<div class="project-links">
                    <a href="https://github.com/lucasmdg" target="_blank" class="btn-elegant btn-github">GitHub</a>
                    <a href="https://linkedin.com/in/lucasmdg" target="_blank" class="btn-elegant btn-linkedin">LinkedIn</a>
                </div>'''
html = re.sub(old_links, new_links, html, flags=re.DOTALL)

# 5. Add Cover Image to cards
card_pattern = r'(<div class="project-card[^>]*>)'
html = re.sub(card_pattern, r'\g<1>\n                <div class="project-cover-container"><img src="img/statue.png" class="project-cover" alt="Project Cover"></div>', html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
