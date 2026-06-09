import json

new_videos = [
    {
        "id": "h7MSLsoYKEk",
        "title_zh": "预订餐桌",
        "title_vi": "Giao tiếp Đặt bàn ở nhà hàng",
        "youtube_url": "https://www.youtube.com/shorts/h7MSLsoYKEk",
        "category": "Tiếng Trung thực chiến",
        "desc": "Đoạn hội thoại thực tế gọi điện thoại đặt bàn trước cho 4 người vào tối nay."
    },
    {
        "id": "jG5u_xrsIQE",
        "title_zh": "买单",
        "title_vi": "Giao tiếp Thanh toán tiền ăn",
        "youtube_url": "https://www.youtube.com/shorts/jG5u_xrsIQE",
        "category": "Tiếng Trung thực chiến",
        "desc": "Đoạn hội thoại thực tế thanh toán hóa đơn bằng WeChat sau khi ăn xong tại nhà hàng."
    },
    {
        "id": "CyVJhwGebXY",
        "title_zh": "学会转念",
        "title_vi": "Giao tiếp Học cách chuyển niệm",
        "youtube_url": "https://www.youtube.com/shorts/CyVJhwGebXY",
        "category": "Tiếng Trung thực chiến",
        "desc": "Học cách động viên bạn bè bằng cách xoay chuyển góc nhìn lạc quan khi gặp thất bại."
    },
    {
        "id": "toswvKnlQGo",
        "title_zh": "买电影票",
        "title_vi": "Giao tiếp Mua vé xem phim",
        "youtube_url": "https://www.youtube.com/shorts/toswvKnlQGo",
        "category": "Tiếng Trung thực chiến",
        "desc": "Đoạn hội thoại mua vé xem phim suất tối và chọn vị trí ghế xem đẹp nhất."
    },
    {
        "id": "q90BrVJxBGg",
        "title_zh": "拔苗助长",
        "title_vi": "Bạt miêu trợ trưởng - Nóng vội hỏng việc",
        "youtube_url": "https://www.youtube.com/shorts/q90BrVJxBGg",
        "category": "Thành ngữ",
        "desc": "Thành ngữ phê phán việc nóng vội, đốt cháy giai đoạn dẫn đến hỏng việc."
    },
    {
        "id": "fFQ7FpDxfaI",
        "title_zh": "杯弓蛇影",
        "title_vi": "Bôi cung xà ảnh - Tự mình dọa mình",
        "youtube_url": "https://www.youtube.com/shorts/fFQ7FpDxfaI",
        "category": "Thành ngữ",
        "desc": "Bài học phê phán những người đa nghi, lo sợ vô căn cứ tự mình hại mình."
    },
    {
        "id": "ppv34AVHcuI",
        "title_zh": "秒杀",
        "title_vi": "Miểu sát - Săn sale chớp nhoáng",
        "youtube_url": "https://www.youtube.com/shorts/ppv34AVHcuI",
        "category": "Tiếng lóng",
        "desc": "Giải mã từ lóng chỉ việc săn sale chớp nhoáng (flash sale) trong thương mại điện tử."
    },
    {
        "id": "1kq16kDeasI",
        "title_zh": "尬聊",
        "title_vi": "Gượng nói - Nói chuyện nhạt nhẽo",
        "youtube_url": "https://www.youtube.com/shorts/1kq16kDeasI",
        "category": "Tiếng lóng",
        "desc": "Từ lóng miêu tả những cuộc nói chuyện gượng ép, thiếu chủ đề chung."
    },
    {
        "id": "AfZW2Guw1X8",
        "title_zh": "逆袭",
        "title_vi": "Nghịch kích - Lội ngược dòng",
        "youtube_url": "https://www.youtube.com/shorts/AfZW2Guw1X8",
        "category": "Tiếng lóng",
        "desc": "Từ lóng mô tả việc bứt phá vươn lên thành công từ vị thế yếu thế."
    },
    {
        "id": "SLWQwn4LcQI",
        "title_zh": "YYDS",
        "title_vi": "Mãi đỉnh - Vị thần vĩnh cửu",
        "youtube_url": "https://www.youtube.com/shorts/SLWQwn4LcQI",
        "category": "Tiếng lóng",
        "desc": "Giải mã từ viết tắt bính âm của 'Mãi mãi là vị thần', tương đương G.O.A.T."
    },
    {
        "id": "7_fGQYFzSSs",
        "title_zh": "打工人",
        "title_vi": "Đả công nhân - Người làm công ăn lương",
        "youtube_url": "https://www.youtube.com/shorts/7_fGQYFzSSs",
        "category": "Tiếng lóng",
        "desc": "Từ lóng tự trào đầy tinh thần lạc quan, kiên trì của người đi làm thuê."
    }
]

media_path = "media.js"

with open(media_path, "r", encoding="utf-8") as f:
    js_content = f.read()

# Hardcoded current max orders based on media.js contents
category_orders = {
    'Lê Lê kể chữ': 55,
    'Tiếng lóng': 13,
    'Song đấu từ vựng': 5,
    'Tiếng Trung thực chiến': 12,
    'Thành ngữ': 18
}

# Build the new video objects strings
new_objects_strings = []
for v in new_videos:
    cat = v["category"]
    category_orders[cat] = category_orders.get(cat, 0) + 1
    v["order"] = category_orders[cat]
    
    obj_str = (
        "  {\n"
        f'    "id": "{v["id"]}",\n'
        f'    "title_zh": "{v["title_zh"]}",\n'
        f'    "title_vi": "{v["title_vi"]}",\n'
        f'    "youtube_url": "{v["youtube_url"]}",\n'
        f'    "category": "{v["category"]}",\n'
        f'    "desc": "{v["desc"]}",\n'
        f'    "order": {v["order"]}\n'
        "  }"
    )
    new_objects_strings.append(obj_str)

# Exact target search string at the end of the array
target_str = (
    '    "category": "Thành ngữ",\n'
    '    "desc": "Câu chuyện thành ngữ \'Xả thân cứu người\', quên đi lợi ích bản thân.",\n'
    '    "order": 18\n'
    '  }\n'
    '];'
)

replacement_str = (
    '    "category": "Thành ngữ",\n'
    '    "desc": "Câu chuyện thành ngữ \'Xả thân cứu người\', quên đi lợi ích bản thân.",\n'
    '    "order": 18\n'
    '  },\n'
    + ",\n".join(new_objects_strings) + "\n];"
)

if target_str in js_content:
    updated_content = js_content.replace(target_str, replacement_str)
    with open(media_path, "w", encoding="utf-8") as f:
        f.write(updated_content)
    print(f"Successfully added {len(new_videos)} new videos to media.js!")
else:
    # Try with single quotes
    target_str_alt = target_str.replace('"', "'")
    if target_str_alt in js_content:
        updated_content = js_content.replace(target_str_alt, replacement_str.replace('"', "'"))
        with open(media_path, "w", encoding="utf-8") as f:
            f.write(updated_content)
        print(f"Successfully added {len(new_videos)} new videos to media.js! (using alt format)")
    else:
        print("Error: Could not locate target string at the end of the array.")
