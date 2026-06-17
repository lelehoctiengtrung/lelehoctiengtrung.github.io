import os
import re

workspace = "/Users/hanario/.gemini/antigravity/worktrees/Website lelehoctiengtrung/create-documentation-workflow"
docs_dir = os.path.join(workspace, "POSTS", "docs")
reviews_dir = os.path.join(workspace, "POSTS", "reviews")

print("=== SEARCHING FOR PLACEHOLDERS IN POSTS ===")

placeholder_patterns = [
    r"placeholder",
    r"via\.placeholder",
    r"placehold\.co",
    r"\{\{.*?\}\}",
    r"\{https?://.*?\}",
    r"LINK_GOOGLE_DRIVE",
    r"LINK_DRIVE"
]

def check_content(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    filename = os.path.basename(file_path)
    found = False
    for pat in placeholder_patterns:
        matches = re.findall(pat, content, re.IGNORECASE)
        if matches:
            print(f"\nFile: {filename} matches pattern '{pat}' ({len(matches)} times):")
            found = True
            # Print lines containing matches
            for line_no, line in enumerate(content.split("\n"), 1):
                if re.search(pat, line, re.IGNORECASE):
                    print(f"  Line {line_no}: {line.strip()}")
    return found

# Scan docs
for df in sorted(os.listdir(docs_dir)):
    if df.endswith(".md") and not df.startswith("."):
        check_content(os.path.join(docs_dir, df))

# Scan reviews
for rf in sorted(os.listdir(reviews_dir)):
    if rf.endswith(".md") and not rf.startswith("."):
        check_content(os.path.join(reviews_dir, rf))

print("\n=== Scan completed ===")
