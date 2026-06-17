import urllib.request
import json
import re

SHEET_ID = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o'
SHEET_NAME = 'docs'

print("=== CHECKING GOOGLE SHEET FOR PLACEHOLDERS/BROKEN PATHS ===")

url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json&sheet={SHEET_NAME}&headers=2"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as res:
    raw = res.read().decode('utf-8')

match = re.search(r'google\.visualization\.Query\.setResponse\(([\s\S]*?)\);', raw)
if match:
    data = json.loads(match.group(1))
    cols = [col.get('label') for col in data['table']['cols']]
    
    # Map column labels to indices
    col_map = {}
    for idx, col in enumerate(data['table']['cols']):
        label = (col.get('label') or '').lower()
        if 'id' in label: col_map['id'] = idx
        elif 'title' in label: col_map['title'] = idx
        elif 'content' in label: col_map['content'] = idx
        elif 'preview_images' in label: col_map['preview_images'] = idx
        
    print(f"Mapped columns: {col_map}")
    
    for r_idx, r in enumerate(data['table']['rows']):
        cells = r['c']
        def get_val(col_key):
            idx = col_map.get(col_key)
            if idx is not None and idx < len(cells) and cells[idx]:
                return str(cells[idx]['v']).strip()
            return ""
            
        doc_id = get_val('id')
        title = get_val('title')
        content = get_val('content')
        preview_images = get_val('preview_images')
        
        print(f"\nDocument ID: {doc_id} | Title: {title}")
        
        # Check content
        if "placeholder_image" in content:
            print("  [WARNING] content contains 'placeholder_image'")
        if "/images/docs/" in content:
            print("  [WARNING] content contains '/images/docs/' absolute-style paths")
        if "../POSTS/" in content:
            print("  [WARNING] content contains '../POSTS/'")
        if "{" in content or "}" in content:
            braces = re.findall(r"\{.*?\}", content)
            if braces:
                print(f"  [WARNING] content contains curly braces: {braces}")
                
        # Check preview_images
        print(f"  preview_images: {preview_images}")
        if "../POSTS/" in preview_images:
            print("  [WARNING] preview_images contains '../POSTS/'")
else:
    print("Could not load sheet data.")
