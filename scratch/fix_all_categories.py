#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re
import os

# Manual rank mapping for newer videos not in all_channel_videos.json
MANUAL_RANKS = {
    # 8 new videos at the top
    "y_G-fvofAM4": -100,  # 雨
    "CvkdL2Rt6eI": -99,   # 同
    "ZJqOZvdVeWg": -98,   # 喝
    "Q3OvNSVJPg0": -97,   # 语
    "s7GQCeCQkD4": -96,   # 校
    "WVFZLgWtfRg": -95,   # 客
    "8fsY2N4lOks": -94,   # 钱
    "N_egVdqwUtc": -93,   # 从
    
    # 5 song-dau videos
    "RTzRx0KwNkM": -92,
    "Vwmq5rcGr5w": -91,
    "pKLR6T9kpkU": -90,
    "WDM3tD_h58Y": -89,
    "Wwlaa4hVBNs": -88,
    
    # Other new ones added in recent weeks
    "7yWzxg_n9DA": -80,  # 狗
    "dPC0nm5_PW4": -79,  # 得
    "0fcYChxFeic": -78,  # 很
    "TP6ObgHZwQc": -77,  # 觉
    "kBS0J5LkTbU": -76,  # 时
    "ym86dYdxUiM": -75,  # 冷
    "ZKFGnZu36C4": -74,  # 作
    
    # Slang updates
    "7_fGQYFzSSs": -73,
    "SLWQwn4LcQI": -72,
    "AfZW2Guw1X8": -71,
    "1kq16kDeasI": -70,
    "ppv34AVHcuI": -69,
}

# Hán-Việt and title translation map for character story videos that need cleaning
HAN_VIET_MAP = {
    "y_G-fvofAM4": ("雨", "Vũ - Những hạt mưa rơi dưới đám mây"),
    "CvkdL2Rt6eI": ("同", "Đồng - Mọi người cùng chung chí hướng dưới một mái nhà"),
    "ZJqOZvdVeWg": ("喝", "Hát - Mở miệng uống nước dưới ánh mặt trời"),
    "Q3OvNSVJPg0": ("语", "Ngữ - Dùng ngôn từ để nói lên tâm ý"),
    "s7GQCeCQkD4": ("校", "Hiệu - Ngôi trường gỗ nơi hội tụ tri thức"),
    "WVFZLgWtfRg": ("客", "Khách - Người phương xa đến dừng chân dưới mái nhà"),
    "8fsY2N4lOks": ("钱", "Tiền - Cuộc tranh giành của cải bằng hai thanh kiếm"),
    "N_egVdqwUtc": ("从", "Tòng - Người bước đi theo sau người khác"),
    "7yWzxg_n9DA": ("狗", "Cẩu - Cách nhớ chữ Con Chó qua câu chuyện bộ thủ"),
    "dPC0nm5_PW4": ("得", "Đắc - Bước đi từ lúc bình minh mới hé rạng, tay cầm thước đo"),
    "0fcYChxFeic": ("很", "Hận - Bước đi với ánh mắt quyết tâm"),
    "TP6ObgHZwQc": ("觉", "Giác - Học xong thấy ánh sáng tỉnh thức"),
    "kBS0J5LkTbU": ("时", "Thời - Mặt trời đo từng tấc thời gian"),
    "ym86dYdxUiM": ("冷", "Lãnh - Mệnh lệnh băng giá của thiên nhiên"),
    "9r6x0U0RNfc": ("钟", "Chung - Ý nghĩa chữ Chuông dễ nhớ vô cùng"),
    "2LFEepG_1Ys": ("岁", "Tuế - Giải mã chữ Tuổi qua câu chuyện cực hay"),
    "gAsw8SkAUkU": ("下", "Hạ - Rễ cây cắm sâu dưới mặt đất"),
    "jWbwcpqXsF4": ("果", "Quả - Nguồn gốc chữ Quả cực dễ nhớ"),
    "wSugdlXjcjw": ("椅", "Ỷ - Chiếc ghế gỗ có tựa lưng lạ"),
    "l4Rg9ukO8U4": ("话", "Thoại - Chiếc lưỡi uốn lượn tạo câu chuyện"),
    "9Qi9jyMoS0A": ("什", "Thập - Người thắc mắc đứng trước mười món lạ"),
    "-Lu6gR_ERx4": ("打", "Đả - Giải mã chữ Đả qua hình ảnh cực dễ nhớ"),
    "mP6brE6xiUc": ("气", "Khí - Từ dải mây trời đến năng lượng sống")
}

def clean_and_format_title(v):
    # Remove hashtags and branding from title_vi
    title_vi = v.get("title_vi", "")
    title_vi = re.sub(r'#\w+', '', title_vi).strip()
    title_vi = re.sub(r'\s+', ' ', title_vi)
    title_vi = re.split(r'\s*\|\s*(?:Học tiếng Trung|Lê Lê)', title_vi, flags=re.IGNORECASE)[0].strip()
    v["title_vi"] = title_vi
    
    # Try to extract title_zh if empty
    if not v.get("title_zh"):
        zh_chars = re.findall(r'[\u4e00-\u9fff]', title_vi)
        if zh_chars:
            v["title_zh"] = zh_chars[0]
            
    v_id = v["id"]
    if v_id in HAN_VIET_MAP:
        v["title_zh"], v["title_vi"] = HAN_VIET_MAP[v_id]

def main():
    media_js_path = "media.js"
    with open(media_js_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    start_token = "const ALL_VIDEOS = "
    end_token = "const CATEGORIES = "
    
    start_idx = content.find(start_token)
    end_idx = content.find(end_token)
    
    if start_idx == -1 or end_idx == -1:
        print("Error: Could not find ALL_VIDEOS in media.js")
        return
        
    prefix = content[:start_idx + len(start_token)]
    suffix = content[end_idx:]
    
    array_text = content[start_idx + len(start_token):end_idx].strip()
    if array_text.endswith(";"):
        array_text = array_text[:-1]
        
    videos = json.loads(array_text)
    
    # Load all channel videos for ranking
    with open("all_channel_videos.json", "r", encoding="utf-8") as f:
        channel_videos = json.load(f)
        
    chron_map = {v[0]: idx for idx, v in enumerate(channel_videos)}
    
    # 1. Update categories
    for idx, v in enumerate(videos):
        # Attach original physical index as stable fallback sorting key
        v["orig_idx"] = idx
        
        title_lower = v.get("title_vi", "").lower()
        title_zh = v.get("title_zh", "")
        
        # Categorize
        if 'slang' in title_lower or 'tiếng lóng' in title_lower or 'lóng' in title_lower or 'bá đạo' in title_lower:
            v["category"] = "Tiếng lóng"
        elif 'vs' in title_lower or 'phân biệt' in title_lower or 'song đấu' in title_lower:
            v["category"] = "Song đấu từ vựng"
        elif 'thành ngữ' in title_lower or 'idiom' in title_lower:
            v["category"] = "Thành ngữ"
        elif (
            "chữ" in title_lower or 
            "kể chữ" in title_lower or 
            "nhớ chữ" in title_lower or 
            "nguồn gốc chữ" in title_lower or 
            "giải mã chữ" in title_lower or
            v["id"] in HAN_VIET_MAP or
            v.get("category") == "Lê Lê kể chữ"
        ):
            # Check exceptions first
            if v.get("category") not in ["Song đấu từ vựng", "Thành ngữ"]:
                v["category"] = "Lê Lê kể chữ"
        else:
            # Default to Tiếng Trung thực chiến
            v["category"] = "Tiếng Trung thực chiến"
            
        # Format and clean title
        clean_and_format_title(v)
        
    # Group videos by category
    categories_order = ["Lê Lê kể chữ", "Song đấu từ vựng", "Thành ngữ", "Tiếng lóng", "Tiếng Trung thực chiến"]
    videos_by_cat = {cat: [] for cat in categories_order}
    
    for v in videos:
        cat = v["category"]
        if cat in videos_by_cat:
            videos_by_cat[cat].append(v)
        else:
            videos_by_cat[cat] = [v]
            
    # 2. Sort within each category chronologically (newest first)
    all_reordered = []
    for cat in categories_order:
        cat_vids = videos_by_cat[cat]
        
        # Sorting key: MANUAL_RANKS value (negative, lowest first), then chron_map (lowest first), then orig_idx (lowest first)
        def get_sort_key(video):
            v_id = video["id"]
            if v_id in MANUAL_RANKS:
                return (MANUAL_RANKS[v_id], video["orig_idx"])
            elif v_id in chron_map:
                return (chron_map[v_id], video["orig_idx"])
            else:
                return (video["orig_idx"] + 1000, video["orig_idx"])
                
        cat_vids.sort(key=get_sort_key)
        
        # Re-assign order numbers (newest gets highest number, down to 1)
        total_in_cat = len(cat_vids)
        for idx, v in enumerate(cat_vids):
            v["order"] = total_in_cat - idx
            # Clean temporary keys
            if "orig_idx" in v:
                del v["orig_idx"]
            all_reordered.append(v)
            
    # 3. Format ALL_VIDEOS back
    formatted_array = json.dumps(all_reordered, indent=2, ensure_ascii=False)
    new_content = prefix + formatted_array + ";\n\n" + suffix
    
    with open(media_js_path, "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print("Successfully corrected categories, formatted titles, and strictly reordered all videos in media.js!")

if __name__ == "__main__":
    main()
