import os
import re

workspace = "/Users/hanario/.gemini/antigravity/worktrees/Website lelehoctiengtrung/create-documentation-workflow"
docs_dir = os.path.join(workspace, "POSTS", "docs")
reviews_dir = os.path.join(workspace, "POSTS", "reviews")

print("=== CHECKING POSTS FOR PROBLEMS ===")

def check_file(rel_path, source_file):
    clean_path = rel_path.strip()
    if clean_path.startswith("../"):
        resolved_path = os.path.normpath(os.path.join(workspace, "POSTS", clean_path.replace("../", "")))
    elif clean_path.startswith("POSTS/"):
        resolved_path = os.path.normpath(os.path.join(workspace, clean_path))
    else:
        resolved_path = os.path.normpath(os.path.join(workspace, clean_path))
        
    exists = os.path.exists(resolved_path)
    if not exists:
        print(f"  [MISSING FILE] '{rel_path}' referenced in '{os.path.basename(source_file)}'")
        print(f"                 Resolved path: {resolved_path}")
    return exists

# 1. Scan POSTS/docs
doc_files = [f for f in os.listdir(docs_dir) if f.endswith(".md") and not f.startswith(".")]
for df in sorted(doc_files):
    full_path = os.path.join(docs_dir, df)
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    printed_header = False
    def log_issue(msg):
        global printed_header
        # We can just check/set it via a list or dict to avoid scope issues in nested functions
        pass

    issues = []
    # Check SKU
    sku_match = re.search(r"\*\*SKU\*\*:\s*([^\n]+)", content, re.IGNORECASE)
    id_match = re.search(r"\*\*ID/SKU\*\*:\s*([^\n]+)", content, re.IGNORECASE)
    if not (sku_match or id_match):
        issues.append("[WARNING] No **SKU** or **ID/SKU** found!")
        
    # Check all image references
    img_refs = re.findall(r"!\[[^\]]*\]\(([^)]+)\)", content)
    for img in img_refs:
        if not img.startswith("http"):
            exists = os.path.exists(os.path.normpath(os.path.join(docs_dir, img))) if img.startswith("../") else False
            # Let's use the robust check_file function
            if not img.startswith("http"):
                clean_path = img.strip()
                if clean_path.startswith("../"):
                    resolved_path = os.path.normpath(os.path.join(workspace, "POSTS", clean_path.replace("../", "")))
                elif clean_path.startswith("POSTS/"):
                    resolved_path = os.path.normpath(os.path.join(workspace, clean_path))
                else:
                    resolved_path = os.path.normpath(os.path.join(workspace, clean_path))
                if not os.path.exists(resolved_path):
                    issues.append(f"[MISSING IMAGE] {img} (Resolved: {resolved_path})")
                
    # Check all link references
    link_refs = re.findall(r"\[[^\]]*\]\(([^)]+)\)", content)
    for link in link_refs:
        if not link.startswith("http") and not link.startswith("#"):
            clean_path = link.strip()
            if clean_path.startswith("../"):
                resolved_path = os.path.normpath(os.path.join(workspace, "POSTS", clean_path.replace("../", "")))
            elif clean_path.startswith("POSTS/"):
                resolved_path = os.path.normpath(os.path.join(workspace, clean_path))
            else:
                resolved_path = os.path.normpath(os.path.join(workspace, clean_path))
            if not os.path.exists(resolved_path):
                issues.append(f"[MISSING LINK] {link} (Resolved: {resolved_path})")

    if issues:
        print(f"\n[DOC] {df}:")
        for iss in issues:
            print(f"  {iss}")

# 2. Scan POSTS/reviews
review_files = [f for f in os.listdir(reviews_dir) if f.endswith(".md") and not f.startswith(".")]
for rf in sorted(review_files):
    full_path = os.path.join(reviews_dir, rf)
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    issues = []
    # Check SKU
    sku_match = re.search(r"\*\*SKU\*\*:\s*([^\n]+)", content, re.IGNORECASE)
    if not sku_match:
        issues.append("[WARNING] No **SKU** found!")
        
    # Check images
    img_refs = re.findall(r"!\[[^\]]*\]\(([^)]+)\)", content)
    for img in img_refs:
        if not img.startswith("http"):
            clean_path = img.strip()
            if clean_path.startswith("../"):
                resolved_path = os.path.normpath(os.path.join(workspace, "POSTS", clean_path.replace("../", "")))
            elif clean_path.startswith("POSTS/"):
                resolved_path = os.path.normpath(os.path.join(workspace, clean_path))
            else:
                resolved_path = os.path.normpath(os.path.join(workspace, clean_path))
            if not os.path.exists(resolved_path):
                issues.append(f"[MISSING IMAGE] {img} (Resolved: {resolved_path})")
                
    # Check links
    link_refs = re.findall(r"\[[^\]]*\]\(([^)]+)\)", content)
    for link in link_refs:
        if not link.startswith("http") and not link.startswith("#"):
            clean_path = link.strip()
            if clean_path.startswith("../"):
                resolved_path = os.path.normpath(os.path.join(workspace, "POSTS", clean_path.replace("../", "")))
            elif clean_path.startswith("POSTS/"):
                resolved_path = os.path.normpath(os.path.join(workspace, clean_path))
            else:
                resolved_path = os.path.normpath(os.path.join(workspace, clean_path))
            if not os.path.exists(resolved_path):
                issues.append(f"[MISSING LINK] {link} (Resolved: {resolved_path})")

    if issues:
        print(f"\n[REVIEW] {rf}:")
        for iss in issues:
            print(f"  {iss}")

print("\n=== Check completed ===")
