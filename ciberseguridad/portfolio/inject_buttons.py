import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

button_html = '''<div class="project-links">
                    <a href="#" class="btn-elegant">Demo</a>
                    <a href="#" class="btn-elegant btn-github">GitHub</a>
                </div>'''

# Insert the button_html right before the closing </div> of each project-card
# We can find <div class="project-tags">.*?</div> and add the buttons after it.
new_html = re.sub(r'(<div class="project-tags">.*?</div>)', r'\g<1>\n                ' + button_html, html, flags=re.DOTALL)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)

print('Updated index.html')
