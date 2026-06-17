import os
import re

def check_file_exists(rel_path):
    # Normalize paths relative to workspace root
    # e.g., "../book1.png" -> "book1.png"
    # "POSTS/images/DOC-500_cover.png" -> "POSTS/images/DOC-500_cover.png"
    clean_path = rel_path.strip().replace("../", "")
    exists = os.path.exists(clean_path)
    return exists, clean_path

print("=== Checking docs.js references ===")
with open("docs.js", "r", encoding="utf-8") as f:
    docs_js = f.read()

# Find all preview_images strings
preview_images_list = re.findall(r"preview_images:\s*'([^']*)'", docs_js)
for pi_str in preview_images_list:
    if not pi_str:
        continue
    imgs = pi_str.split(",")
    for img in imgs:
        exists, full_path = check_file_exists(img)
        if not exists:
            print(f"  [MISSING] doc image: {img} (Resolved: {full_path})")
        else:
            print(f"  [OK] doc image: {img}")

print("\n=== Checking review.js references ===")
with open("review/review.js", "r", encoding="utf-8") as f:
    review_js = f.read()

# Find cover_url and review_images
cover_urls = re.findall(r"cover_url:\s*'([^']*)'", review_js)
review_imgs = re.findall(r"review_images:\s*'([^']*)'", review_js)

for url in cover_urls:
    if not url.startswith("http"):
        exists, full_path = check_file_exists(url)
        if not exists:
            print(f"  [MISSING] review cover: {url} (Resolved: {full_path})")
        else:
            print(f"  [OK] review cover: {url}")

for rimgs in review_imgs:
    if not rimgs:
        continue
    for img in rimgs.split(","):
        if not img.startswith("http"):
            exists, full_path = check_file_exists(img)
            if not exists:
                print(f"  [MISSING] review image: {img} (Resolved: {full_path})")
            else:
                print(f"  [OK] review image: {img}")
