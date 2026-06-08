# -*- coding: utf-8 -*-
import json
import requests
import base64
import os

WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5DcT6gcid2UpE3ZK9ImzVHQLI_hZ3HehbjbyoHtsX0QBoXfZz9_PVd9ySW03IGfp1Gw/exec"
SKU = "DOC-COSO1"

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
    
    # Content of the post
    doc_content = (
        "Chào các bạn! Lê Lê đây. Hôm nay mình chia sẻ cho các bạn cuốn cẩm nang **Hán Ngữ Cơ Sở 1**. "
        "Đây là cuốn tài liệu \"vỡ lòng\" do mình đúc kết và tổng hợp lại từ những ngày đầu tiên tiếp xúc với tiếng Trung, "
        "được biên soạn vô cùng chi tiết và trực quan để giúp các bạn vượt qua nỗi sợ ban đầu khi đối mặt với một ngôn ngữ tượng hình hoàn toàn mới.\\n\\n"
        "Trong cuốn tài liệu này, các kiến thức nhập môn được phân chia thành 3 phần cực kỳ khoa học:\\n"
        "1. **Hệ thống phát âm Pinyin chuẩn hóa**: Chi tiết 21 Thanh mẫu, 36 Vận mẫu có âm tương đương tiếng Việt gần gũi, kết hợp 4 Thanh điệu chính và các quy tắc biến điệu bắt buộc phải thuộc lòng (như biến điệu của hai thanh 3, biến điệu của \"Bất\" và \"Nhất\").\\n"
        "2. **Quy tắc viết chữ Hán cơ bản**: Hướng dẫn cách viết 8 nét cơ bản, 7 quy tắc bút thuận kinh điển kèm ô ly Mễ Tự (米字格) và chữ mẫu nét mờ để các bạn tập tô vẽ, định hình tay viết chuẩn cân đối.\\n"
        "3. **5 bài học giao tiếp thực tế**: Tổng hợp từ vựng, mẫu câu ngữ pháp và đoạn hội thoại ngắn theo các chủ đề gần gũi nhất (Chào hỏi & giới thiệu, Hỏi thăm sức khỏe, Công việc & gia đình, Mua sắm & hỏi giá cả, Hỏi thời gian & ngày tháng).\\n\\n"
        "Học xong tập cẩm nang này, các bạn sẽ tự tin nắm vững 100% nền tảng ngữ âm, quy tắc viết chữ Hán và có phản xạ giao tiếp cơ bản hằng ngày. Hãy kiên trì học tập mỗi ngày một chút nhé! Cố lên nhé các bạn cùng học!"
    )
    
    # 1. Initialize sheet row & clear existing preview images to prevent duplicates
    print("\n1. Initializing document row in Google Sheets...")
    payload = {
        "action": "update_doc",
        "id": SKU,
        "title": "Hán Ngữ Cơ Sở 1",
        "desc": "Cẩm nang tự học tiếng Trung nhập môn từ con số 0: tổng hợp phát âm Pinyin, quy tắc viết chữ Hán và các mẫu câu giao tiếp cơ bản nhất.",
        "category": "vocab",
        "icon": "📖",
        "icon_color": "#4ECCA3",
        "pages": "PDF · 20 trang · Tổng hợp",
        "level": "2",
        "level_text": "Nhập môn · HSK 1",
        "content": doc_content,
        "pros": "Trình bày cực kỳ trực quan, khoa học, dễ học cho người tự học từ con số 0 | Đầy đủ kiến thức nhập môn từ phát âm Pinyin, bút thuận chữ Hán đến giao tiếp cơ bản | Có ô ly Mễ Tự (米字格) chuẩn kèm chữ mẫu nét mờ để luyện viết tay dễ dàng",
        "cons": "Tài liệu tập trung vào nhập môn cơ bản, chưa đi sâu vào các cấu trúc phức tạp | Cần kết hợp xem thêm video hướng dẫn phát âm để sửa giọng chuẩn nhất",
        "who_for": "Dành cho các bạn mới bắt đầu học tiếng Trung từ con số 0, muốn xây dựng nền tảng vững chắc về phát âm, viết chữ Hán và các mẫu câu giao tiếp cơ bản.",
        "preview_images": "",  # Clear column first
        "drive_url": "https://drive.google.com/drive/u/0/folders/1XdzdpnxPyPHp2PnEyIOPUnSwlTcIeTeN" # Default parent
    }
    
    folder_url = ""
    try:
        res = requests.post(WEB_APP_URL, json=payload, allow_redirects=True)
        if res.status_code == 200:
            result = res.json()
            if result.get("success"):
                folder_url = result.get("folder_url")
                print(f"Success! Registered row in Sheets. Folder GDrive URL: {folder_url}")
            else:
                print(f"Error from API: {result.get('error')}")
        else:
            print(f"HTTP Error {res.status_code}: {res.text}")
    except Exception as e:
        print(f"Exception during row init: {e}")
        
    # 2. Upload the three flat images in sequence (they will automatically append in Sheets)
    print("\n2. Uploading preview images to Google Drive...")
    img1 = upload_image(SKU, "POSTS/images/DOC-COSO1_cover_flat.png", "preview")
    img2 = upload_image(SKU, "POSTS/images/DOC-COSO1_page3_flat.png", "preview")
    img3 = upload_image(SKU, "POSTS/images/DOC-COSO1_page8_flat.png", "preview")
    
    # 3. Finalize: Set the drive_url to the document folder so readers can download
    if folder_url:
        print("\n3. Finalizing Google Sheets with Drive folder URL...")
        payload = {
            "action": "update_doc",
            "id": SKU,
            "drive_url": folder_url
        }
        try:
            res = requests.post(WEB_APP_URL, json=payload, allow_redirects=True)
            if res.status_code == 200:
                result = res.json()
                if result.get("success"):
                    print("Success! Finalized drive_url in Sheets.")
                else:
                    print(f"Error from API: {result.get('error')}")
            else:
                print(f"HTTP Error {res.status_code}: {res.text}")
        except Exception as e:
            print(f"Exception during finalization: {e}")
            
    print("\n--- Synchronization complete! ---")

if __name__ == "__main__":
    main()
