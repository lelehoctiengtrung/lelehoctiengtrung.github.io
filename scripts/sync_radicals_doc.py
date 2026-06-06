# -*- coding: utf-8 -*-
import json
import requests
import base64
import os
import subprocess

WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5DcT6gcid2UpE3ZK9ImzVHQLI_hZ3HehbjbyoHtsX0QBoXfZz9_PVd9ySW03IGfp1Gw/exec"
SKU = "DOC-RADICALS"

def upload_image(sku, file_path, img_type):
    print(f"Uploading {file_path} as type '{img_type}'...")
    if not os.path.exists(file_path):
        print(f"Error: File not found at {file_path}")
        return None
        
    with open(file_path, "rb") as f:
        img_bytes = f.read()
        base64_data = base64.b64encode(img_bytes).decode("utf-8")
        
    payload = {
        "action": "upload_image",
        "sku": sku,
        "type": img_type,
        "fileName": os.path.basename(file_path),
        "base64Data": base64_data
    }
    
    try:
        res = requests.post(WEB_APP_URL, json=payload, allow_redirects=True)
        if res.status_code == 200:
            result = res.json()
            if result.get("success"):
                url = result.get("url")
                print(f"Success! Direct GDrive URL: {url}")
                return url
            else:
                print(f"Error from API: {result.get('error')}")
        else:
            print(f"HTTP Error {res.status_code}: {res.text}")
    except Exception as e:
        print(f"Exception during upload: {e}")
        
    return None

def main():
    print(f"--- Synchronizing {SKU} to Google Sheets & GDrive ---")
    
    # 1. Upload the preview page images (Cover and Page 3)
    cover_url = upload_image(SKU, "POSTS/images/DOC-RADICALS_cover_flat.png", "preview")
    page3_url = upload_image(SKU, "POSTS/images/DOC-RADICALS_page3_flat.png", "preview")
    
    preview_images_str = ""
    if cover_url and page3_url:
        preview_images_str = f"{cover_url},{page3_url}"
        print(f"Uploaded preview images string: {preview_images_str}")
    else:
        print("Warning: One or more image uploads failed. We will not overwrite preview_images column.")

    # 2. Sync document metadata to Google Sheets (action: update_doc)
    doc_content = (
        "Chào các phụ huynh và các bé! Lê Lê đây. Bộ thủ giống như những mảnh ghép logo kỳ diệu, "
        "khi ghép chúng lại với nhau sẽ tạo nên các chữ Hán vô cùng sinh động. Nhằm giúp các bé "
        "tiếp cận chữ Hán một cách tự nhiên nhất, mình đã thiết kế bộ tài liệu **30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé** này.\\n\\n"
        "Được biên soạn theo phong cách trực quan sinh động với hình minh họa ngộ nghĩnh, màu sắc pastel tươi sáng, "
        "các câu đố nhỏ và bài hát/lời gợi ý cực kỳ dễ thương, tài liệu này sẽ biến việc học chữ Hán thành một trò chơi "
        "khám phá đầy hấp dẫn. Các con sẽ học được cách liên tưởng bộ thủ với hình dáng thực tế, ví dụ bộ Thủy (nước) "
        "giống như 3 giọt nước nhỏ, bộ Mộc (cây) giống như một cái cây xanh tươi... Hãy tải về và in màu để cùng bé "
        "luyện tập hàng ngày nhé!"
    )
    
    payload = {
        "action": "update_doc",
        "id": SKU,
        "title": "30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé",
        "desc": "Tài liệu 30 bộ thủ tiếng Trung thông dụng nhất cho các bé, được thiết kế sinh động, nhiều màu sắc và hình minh họa siêu dễ thương!",
        "category": "vocab",
        "icon": "🎨",
        "icon_color": "#FF7B90",
        "pages": "PDF · 17 trang · Màu sắc",
        "level": "1",
        "level_text": "Mầm non & Tiểu học",
        "content": doc_content,
        "pros": "Thiết kế sinh động, nhiều màu sắc thu hút trẻ nhỏ | Hình minh họa dễ thương, giúp bé ghi nhớ bằng phương pháp liên tưởng hình ảnh | Lời gợi ý (Say to kids) siêu gần gũi và dễ hiểu",
        "cons": "Cần in màu để đạt hiệu quả thị giác tốt nhất | Chưa có file nghe giọng phát âm trực tiếp",
        "who_for": "Dành cho các bé mầm non, học sinh tiểu học mới bắt đầu làm quen với tiếng Trung, hoặc các bậc phụ huynh/giáo viên muốn tìm tài liệu trực quan dạy cho bé.",
        "drive_url": "https://drive.google.com/file/d/1KF_c7CHdSljkl8Rme-C5LZpI0h9XMRAE/view?usp=sharing"
    }
    
    if preview_images_str:
        payload["preview_images"] = preview_images_str

    print("\nSending POST request to Apps Script Web App to sync doc metadata...")
    try:
        res = requests.post(WEB_APP_URL, json=payload, allow_redirects=True)
        print(f"Status Code: {res.status_code}")
        print("Response Text:")
        print(res.text)
    except Exception as e:
        print(f"Error calling Apps Script: {e}")

    # 3. Sync to local Google Drive
    print("\nRunning local Google Drive synchronization script...")
    cmd = ["python3", "scripts/sync_to_gdrive.py", "--sku", SKU]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print("Error executing local GDrive sync:")
        print(e.stderr)

if __name__ == "__main__":
    main()
