import json
import requests
import base64
import os

WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5DcT6gcid2UpE3ZK9ImzVHQLI_hZ3HehbjbyoHtsX0QBoXfZz9_PVd9ySW03IGfp1Gw/exec"

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
    sku = "SPE-0001"
    
    # 1. Upload the original images and get direct GDrive URLs
    cover_url = upload_image(sku, "POSTS/images/SPE-0001_cover.png", "shop")
    page1_url = upload_image(sku, "POSTS/images/SPE-0001_page1.png", "review")
    page2_url = upload_image(sku, "POSTS/images/SPE-0001_page2.png", "review")
    
    if not (cover_url and page1_url and page2_url):
        print("Error: One or more image uploads failed. Aborting Sheets update.")
        return
        
    review_images_str = f"{page1_url},{page2_url}"
    
    # 2. Sync everything to Google Sheets with the public Drive URLs
    payload = {
        "action": "update_book",
        "sku": sku,
        "title": "Sách Luyện Viết Từ Vựng Tiếng Trung HSK 1",
        "subtitle_zh": "HSK 1 词汇 ⭐️ Luyện Viết Chữ Hán",
        "desc": "Cuốn vở tập viết chữ Hán kết hợp bút bay mực thông minh giúp ghi nhớ 150 từ vựng HSK 1 cốt lõi, nắm vững 70 bộ thủ và quy tắc bút thuận. Viết xong mực tự biến mất để luyện tập lại nhiều lần! ✨",
        "tags": "Luyện viết, HSK 1, Bộ thủ",
        "price": "95000",
        "badge": "Khuyên dùng",
        "badge_type": "new",
        "stars": "5",
        "cover_url": cover_url,
        "buy_shopee": "https://s.shopee.vn/AUrLPSQfFo",
        "buy_fahasa": "",
        "buy_tiki": "",
        "buy_lazada": "",
        "review": "Chào các bạn! Lê Lê đây. Hôm nay mình rất vui được đánh giá chi tiết một cuốn vở siêu hot mà mình đã trải nghiệm từ ngày đầu học chữ Hán: **Vở Luyện Viết Từ Vựng HSK 1** của NHT Books.\n\nĐối với người mới học, nhớ mặt chữ Hán luôn là trở ngại lớn vì hệ chữ tượng hình phức tạp, dễ quên nét. Cuốn vở này chính là chiếc phao cứu sinh toàn diện cho các bạn.\n\n### Điểm đặc biệt: Công nghệ bút bay mực tự động\nĐi kèm vở là **bút bay mực chuyên dụng** và 10 ngòi dự phòng. Khi viết lên vở, mực xanh hiển thị rõ nét nhưng sau 3-5 phút sẽ tự nhạt đi và biến mất hoàn toàn sau 10-15 phút, trả lại trang giấy trắng tinh để luyện tập hàng ngàn lần, tiết kiệm chi phí tối đa và giữ vở luôn sạch đẹp.\n\n### Lộ trình 5 phần khoa học từ gốc\nCuốn vở dày 66 trang in màu sắc nét trên chất giấy siêu dày chống thấm nhòe, lộ trình học gồm:\n1. **Phần 1 - Kiểm soát nét bút**: Luyện tay bằng các nét ma trận giúp cơ tay dẻo dai.\n2. **Phần 2 - 8 nét cơ bản**: Nền tảng cấu trúc viết chữ Hán.\n3. **Phần 3 - 7 quy tắc bút thuận**: Viết đúng thứ tự nét giúp chữ cân đối, viết nhanh hơn.\n4. **Phần 4 - 70 bộ thủ thông dụng**: Hiểu bản chất ghép chữ và đoán nghĩa từ mới.\n5. **Phần 5 - Luyện viết 150 từ vựng HSK 1**: Có hướng dẫn bút thuận, pinyin, âm Hán Việt và ô ly Mễ tự căn chỉnh chữ tròn trịa.\n\n### Bí quyết học tập hiệu quả\nMỗi ngày các bạn chỉ nên luyện 5-10 từ trong 15 phút, kết hợp đọc to pinyin và nghĩa khi viết để ghi nhớ sâu sắc hơn nhé!",
        "pros": "Tiết kiệm tối đa nhờ công nghệ bút bay mực viết lại nhiều lần | Cấu trúc bài bản từ nét vẽ cơ bản đến 70 bộ thủ | Ô ly Mễ tự và hướng dẫn bút thuận giúp viết chữ chuẩn đẹp",
        "cons": "Phải đậy nắp bút kỹ để tránh khô mực | Chỉ chứa 150 từ vựng HSK 1 cũ",
        "who_for": "Các bạn tự học tiếng Trung từ con số 0, muốn luyện nét chữ Hán chuẩn đẹp và ghi nhớ 150 từ vựng HSK 1 cốt lõi.",
        "shop_images": cover_url,
        "review_images": review_images_str,
        "sku_folder_url": f"https://drive.google.com/drive/folders/{result_sku_folder_id(sku)}" # Dynamically look up or update later if needed
    }
    
    # We need to get the folder URL or we can set it to a default
    # Let's see if we can get folder url, if not we leave it empty or fallback
    payload["sku_folder_url"] = "https://drive.google.com/drive/folders/1gP-4vafPZiuHXAz6Zup0vboUK9D1llfC" # fallback to reviews folder
    
    print("\nSending POST request to Apps Script Web App to sync Sheet...")
    try:
        res = requests.post(WEB_APP_URL, json=payload, allow_redirects=True)
        print(f"Status Code: {res.status_code}")
        print("Response Text:")
        print(res.text)
        print("\n--- DONE! Google Sheets has been updated with public Google Drive URLs. ---")
        print(f"Cover URL: {cover_url}")
        print(f"Review Images: {review_images_str}")
    except Exception as e:
        print(f"Error calling Apps Script: {e}")

def result_sku_folder_id(sku):
    # Dummy placeholder, we can just hardcode or lookup
    return ""

if __name__ == "__main__":
    main()
