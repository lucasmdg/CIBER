import re
import json

def extract_projects(html_content):
    # Split into project cards
    cards = html_content.split('<div class="project-card')
    projects = []
    
    for card in cards[1:]:
        # Re-add the split delimiter part for easier regex
        card = '<div class="project-card' + card
        
        level_match = re.search(r'data-level="(.*?)"', card)
        title_match = re.search(r'<h3 class="project-title">(.*?)</h3>', card)
        desc_match = re.search(r'<p class="project-desc">(.*?)</p>', card)
        github_match = re.search(r'<a href="(https://github.com.*?)"', card)
        
        if title_match and desc_match:
            level = level_match.group(1).strip() if level_match else 'basico'
            title = title_match.group(1).strip()
            desc = desc_match.group(1).strip()
            github = github_match.group(1).strip() if github_match else '#'
            
            # Extract tags
            tags_block = re.search(r'<div class="project-tags">(.*?)</div>', card, re.DOTALL)
            tags = []
            if tags_block:
                tags_raw = re.findall(r'<span class="tag">(.*?)</span>', tags_block.group(1))
                tags = [t.strip() for t in tags_raw]
                
            projects.append({
                "title": title,
                "level": level,
                "description": desc,
                "github": github,
                "tags": tags
            })
            
    return projects

def main():
    old_html_path = r'c:\Users\Lucas\Desktop\CIBER\ciberseguridad\portfolio\index.html'
    with open(old_html_path, 'r', encoding='utf-8') as f:
        html = f.read()
        
    projects = extract_projects(html)
    
    # Generate TypeScript file content
    ts_content = "export type ProjectLevel = 'basico' | 'intermedio' | 'avanzado' | 'futuro';\n\n"
    ts_content += "export interface Project {\n"
    ts_content += "  title: string;\n"
    ts_content += "  level: ProjectLevel;\n"
    ts_content += "  description: string;\n"
    ts_content += "  github: string;\n"
    ts_content += "  tags: string[];\n"
    ts_content += "}\n\n"
    
    ts_content += "export const projectsData: Project[] = " + json.dumps(projects, indent=2, ensure_ascii=False) + ";\n"
    
    ts_path = r'c:\Users\Lucas\Desktop\CIBER\ciberseguridad\portfolio_v2\src\data\projects.ts'
    import os
    os.makedirs(os.path.dirname(ts_path), exist_ok=True)
    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write(ts_content)
        
    print(f"Extracted {len(projects)} projects and wrote to {ts_path}")

if __name__ == '__main__':
    main()
