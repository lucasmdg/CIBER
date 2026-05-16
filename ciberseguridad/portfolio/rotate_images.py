import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

images = ['img/hero_bg.png', 'img/section_bg.png', 'img/statue.png', 'img/statues_bg.png']
idx = 0

def replace_img(match):
    global idx
    img = images[idx % len(images)]
    idx += 1
    return f'<img src="{img}" class="project-cover"'

new_html = re.sub(r'<img src=".*?" class="project-cover"', replace_img, html)

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(new_html)
