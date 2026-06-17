import os
import re
import requests
import json

workspace = "/Users/hanario/.gemini/antigravity/worktrees/Website lelehoctiengtrung/create-documentation-workflow"
docs_dir = os.path.join(workspace, "POSTS", "docs")
reviews_dir = os.path.join(workspace, "POSTS", "reviews")

WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5DcT6gcid2UpE3ZK9ImzVHQLI_hZ3HehbjbyoHtsX0QBoXfZz9_PVd9ySW03IGfp1Gw/exec"

def clean_bullets(text):
    # Splits by bullet points and joins them with " | "
    lines = text.strip().split("\n")
    cleaned = []
    for line in lines:
        line = line.strip()
        if line.startswith("-") or line.startswith("*"):
            cleaned.append(line.lstrip("-* ").strip())
        elif line:
            cleaned.append(line)
    return " | ".join(cleaned)

def parse_md_file(file_path, is_review=False):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    lines = content.split("\n")
    title = lines[0].lstrip("# ").strip()
    
    sku_match = re.search(r"\*\*SKU\*\*:\s*([^\n]+)", content, re.IGNORECASE)
    id_match = re.search(r"\*\*ID/SKU\*\*:\s*([^\n]+)", content, re.IGNORECASE)
    sku = (sku_match or id_match).group(1).strip() if (sku_match or id_match) else None
    
    who_match = re.search(r"\*\*Phù hợp với\*\*:\s*([^\n]+)", content, re.IGNORECASE)
    who_for = who_match.group(1).strip() if who_match else ""
    
    # Parse Pros
    pros = ""
    pros_match = re.search(r"## Điểm nổi bật \(Pros\):\n(.*?)(?=\n##|$)", content, re.DOTALL | re.IGNORECASE)
    if pros_match:
        pros = clean_bullets(pros_match.group(1))
    else:
        pros_match = re.search(r"## Điểm mạnh \(Pros\):\n(.*?)(?=\n##|$)", content, re.DOTALL | re.IGNORECASE)
        if pros_match:
            pros = clean_bullets(pros_match.group(1))
            
    # Parse Cons/Tips
    cons = ""
    cons_match = re.search(r"## Phương pháp học tập \(Tips\):\n(.*?)(?=\n##|$)", content, re.DOTALL | re.IGNORECASE)
    if cons_match:
        cons = clean_bullets(cons_match.group(1))
    else:
        cons_match = re.search(r"## Lưu ý tự học \(Cons\):\n(.*?)(?=\n##|$)", content, re.DOTALL | re.IGNORECASE)
        if cons_match:
            cons = clean_bullets(cons_match.group(1))

    # Parse body content
    body = ""
    # Content starts after "## Giới thiệu tài liệu:" or "## Đánh giá chi tiết:"
    intro_idx = content.find("## Giới thiệu tài liệu:")
    if intro_idx == -1:
        intro_idx = content.find("## Đánh giá chi tiết:")
        
    if intro_idx != -1:
        # End is marked by "## Đường dẫn tải tài liệu" or "## Điểm nổi bật" or "## Điểm mạnh"
        end_idx = content.find("## Đường dẫn tải tài liệu", intro_idx)
        if end_idx == -1:
            end_idx = content.find("## Điểm nổi bật", intro_idx)
        if end_idx == -1:
            end_idx = content.find("## Điểm mạnh", intro_idx)
        if end_idx == -1:
            end_idx = content.find("## Lưu ý tự học", intro_idx)
            
        if end_idx != -1:
            body_raw = content[intro_idx:end_idx]
            # Strip off the header "## Giới thiệu tài liệu:"
            body_lines = body_raw.strip().split("\n")[1:]
            body = "\n".join(body_lines).strip()
        else:
            body_lines = content[intro_idx:].strip().split("\n")[1:]
            body = "\n".join(body_lines).strip()
            
    # Escaping newline characters for JSON payload
    body = body.replace("\r", "").replace("\n", "\\n")
    
    return {
        "id": sku,
        "sku": sku,
        "title": title,
        "who_for": who_for,
        "content": body,
        "pros": pros,
        "cons": cons
    }

def sync_doc(doc_data):
    payload = {
        "action": "update_doc",
        "id": doc_data["id"],
        "title": doc_data["title"],
        "content": doc_data["content"],
        "pros": doc_data["pros"],
        "cons": doc_data["cons"],
        "who_for": doc_data["who_for"]
    }
    print(f"Syncing doc: {doc_data['id']} ({doc_data['title']})...")
    res = requests.post(WEB_APP_URL, json=payload, timeout=30)
    print(f"  Response: {res.text}")

def sync_book(book_data):
    # Bookstore sync uses update_book action
    # We must preserve the other columns in shop sheet, so we only send sku, title, review, pros, cons, who_for
    payload = {
        "action": "update_book",
        "sku": book_data["sku"],
        "title": book_data["title"],
        "review": book_data["content"].replace("\\n", "\n"), # Book reviews in sheet use raw newlines
        "pros": book_data["pros"],
        "cons": book_data["cons"],
        "who_for": book_data["who_for"]
    }
    print(f"Syncing book: {book_data['sku']} ({book_data['title']})...")
    res = requests.post(WEB_APP_URL, json=payload, timeout=30)
    print(f"  Response: {res.text}")

# 1. Sync docs
print("=== SYNCING DOCS ===")
for df in sorted(os.listdir(docs_dir)):
    if df.endswith(".md") and not df.startswith("."):
        doc_data = parse_md_file(os.path.join(docs_dir, df))
        if doc_data["id"]:
            sync_doc(doc_data)

# 2. Sync reviews
print("\n=== SYNCING BOOK REVIEWS ===")
for rf in sorted(os.listdir(reviews_dir)):
    if rf.endswith(".md") and not rf.startswith("."):
        book_data = parse_md_file(os.path.join(reviews_dir, rf), is_review=True)
        if book_data["sku"]:
            sync_book(book_data)

print("\n=== All sync completed ===")
