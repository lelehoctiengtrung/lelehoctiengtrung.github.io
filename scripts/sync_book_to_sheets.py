import json
import requests

WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5DcT6gcid2UpE3ZK9ImzVHQLI_hZ3HehbjbyoHtsX0QBoXfZz9_PVd9ySW03IGfp1Gw/exec"

def main():
    payload = {
        "action": "update_book",
        "sku": "SPE-0001",
        "title": "Sách Luyện Viết Từ Vựng Tiếng Trung HSK 1",
        "subtitle_zh": "HSK 1 词汇 ⭐️ Luyện Viết Chữ Hán",
        "desc": "Cuốn vở tập viết chữ Hán kết hợp bút bay mực thông minh giúp ghi nhớ 150 từ vựng HSK 1 cốt lõi, nắm vững 70 bộ thủ và quy tắc bút thuận. Viết xong mực tự biến mất để luyện tập lại nhiều lần! ✨",
        "tags": "Luyện viết, HSK 1, Bộ thủ",
        "price": "95000",
        "badge": "Khuyên dùng",
        "badge_type": "new",
        "stars": "5",
        "cover_url": "../spe0001.png",
        "buy_shopee": "https://s.shopee.vn/AUrLPSQfFo",
        "buy_fahasa": "",
        "buy_tiki": "",
        "buy_lazada": "",
        "review": "Chào các bạn! Lê Lê đây. Hôm nay mình muốn chia sẻ với các bạn một cuốn sách luyện chữ Hán cực kỳ thông minh mà mình đã từng trải nghiệm khi bắt đầu học tiếng Trung: **Luyện Viết Từ Vựng HSK 1** của nhà NHT Books.\n\nĐiểm làm mình thích nhất ở cuốn vở này là nó được bán kèm **bút bay mực**. Các bạn viết xong chỉ khoảng 3-5 phút là nét mực tự bay đi mất tiêu, trang giấy lại trắng tinh như mới! Nhờ vậy, chúng mình có thể luyện tập viết đi viết lại hàng trăm lần mà không sợ tốn giấy hay bôi xóa lem nhem.\n\nSách in màu rõ nét, giấy rất dày dặn viết êm tay. Nội dung được chia làm 5 phần cực kỳ khoa học: từ luyện nét cơ bản, quy tắc bút thuận, 70 bộ thủ thông dụng cho tới luyện viết 150 từ vựng HSK 1 cốt lõi nhất. Thiết kế ô ly Mễ tự mờ giúp các bạn căn nét chữ vuông vắn, tròn trịa dễ dàng.\n\nTuy nhiên, các bạn cần chú ý bảo quản bút bay mực cẩn thận, tránh để mực tiếp xúc với nhiệt độ cao vì sẽ bay màu nhanh hơn. Hãy in thêm các tài liệu từ vựng bên mình để có thêm từ học song song nhé!",
        "pros": "Kèm bút bay mực viết lại nhiều lần | Hướng dẫn 70 bộ thủ & quy tắc nét vẽ chi tiết | Chất giấy dày in màu sắc nét",
        "cons": "Phải bảo quản ngòi bút bay mực kỹ | Chỉ giới hạn 150 từ HSK 1 cũ",
        "who_for": "Người mới bắt đầu tự học tiếng Trung từ số 0, muốn luyện chữ Hán đẹp và học nhanh từ vựng HSK 1.",
        "shop_images": "",
        "review_images": "../POSTS/images/SPE-0001_page1.png,../POSTS/images/SPE-0001_page2.png",
        "sku_folder_url": ""
    }
    
    print("Sending POST request to Apps Script Web App...")
    try:
        # We need to follow redirects (allow_redirects=True)
        res = requests.post(WEB_APP_URL, json=payload, allow_redirects=True)
        print(f"Status Code: {res.status_code}")
        print("Response Text:")
        print(res.text)
    except Exception as e:
        print(f"Error calling Apps Script: {e}")

if __name__ == "__main__":
    main()
