import os
import re
from bs4 import BeautifulSoup

def main():
    file_path = "/Users/hanario/.gemini/antigravity/brain/7333c671-7bce-417f-bd42-11db42e4ead4/.system_generated/steps/4234/content.md"
    with open(file_path, "r", encoding="utf-8") as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, "html.parser")
    
    # Let's find the main article container.
    # From tag inspector, we saw:
    # <div class="elementor elementor-68 elementor-location-single post-90671 ...">
    # Let's search for this container or the "main" tag.
    main_container = soup.find("main")
    if not main_container:
        main_container = soup.find("div", class_="content-area")
    if not main_container:
        main_container = soup
        
    # We want to find the post content. Typically it is in a div with class containing 'post-' or 'entry-content' or 'elementor-location-single'
    content_div = main_container.find("div", class_="elementor-location-single")
    if not content_div:
        content_div = main_container.find("div", class_="entry-content")
    if not content_div:
        content_div = main_container
        
    # Strip scripts, styles, header, footer, ads, social shares
    for s in content_div(["script", "style", "iframe", "ins"]):
        s.decompose()
        
    # Now let's extract headings, paragraphs, lists, tables
    markdown_lines = []
    
    # Let's iterate through elementor widgets or just child tags
    # Let's extract heading texts and paragraph texts in order.
    # To preserve order, we can traverse the tree and process blocks
    for element in content_div.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'table', 'img']):
        tag = element.name
        
        # Check if the element is inside a footer or header that we want to avoid
        parent_footer = element.find_parent("footer")
        parent_header = element.find_parent("header")
        if parent_footer or parent_header:
            continue
            
        if tag.startswith('h'):
            level = int(tag[1])
            text = element.get_text().strip()
            if text:
                markdown_lines.append(f"\n\n{'#' * level} {text}\n")
        elif tag == 'p':
            text = element.get_text().strip()
            # Avoid sharing buttons text or utility texts
            if text and not text.startswith("Share this:") and not text.startswith("Spread the love"):
                markdown_lines.append(f"\n{text}\n")
        elif tag in ['ul', 'ol']:
            list_items = []
            for li in element.find_all('li', recursive=False):
                text = li.get_text().strip()
                if text:
                    prefix = "-" if tag == 'ul' else "1."
                    list_items.append(f"{prefix} {text}")
            if list_items:
                markdown_lines.append("\n" + "\n".join(list_items) + "\n")
        elif tag == 'table':
            table_str = []
            rows = element.find_all('tr')
            for r in rows:
                cols = r.find_all(['td', 'th'])
                col_texts = [c.get_text().strip() for c in cols]
                table_str.append(" | ".join(col_texts))
            if table_str:
                markdown_lines.append("\n" + "\n".join(table_str) + "\n")
        elif tag == 'img':
            src = element.get('src')
            alt = element.get('alt', 'image')
            if src:
                markdown_lines.append(f"\n![{alt}]({src})\n")
                
    markdown_content = "".join(markdown_lines)
    # Post-process spacing
    markdown_content = re.sub(r'\n{3,}', '\n\n', markdown_content)
    
    out_path = "/Users/hanario/.gemini/antigravity/worktrees/Website lelehoctiengtrung/create-documentation-workflow/scratch/extracted_markdown.md"
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(markdown_content)
        
    print(f"Extracted {len(markdown_content)} characters to {out_path}")

if __name__ == "__main__":
    main()
