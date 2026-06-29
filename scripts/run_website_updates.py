#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
import subprocess
import glob

# Config
REPO_DIR = "/media/vpsg16gb/Workspace/lelehoctiengtrung/Website_lelehoctiengtrung"
YOUTUBE_FEED_URL = "https://www.youtube.com/feeds/videos.xml?channel_id=UCGQfqOTElLYJ1-1OEDQJ8Cw"

# Video IDs that should be excluded/deleted from the website
EXCLUDED_VIDEO_IDS = {"h7MSLsoYKEk"}

# Idiom Video IDs that are mapped in HAN_VIET_MAP but belong to 'Thành ngữ' tab
KNOWN_IDIOM_IDS = {
    "b48pSFI_LVE", "wZT3d09FXLs", "7yPK7c-s-yw", "ZHQ-mHHU78I",
    "B8LvifCK2BA", "q7kFBDCssU8", "4Vl8LpQQUSs"
}

# Hán-Việt and title translation map for character story videos
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
    "mP6brE6xiUc": ("气", "Khí - Từ dải mây trời đến năng lượng sống"),
    "b48pSFI_LVE": ("草船借箭", "Thuyền cỏ mượn tên - Mưu kế thiên tài"),
    "wZT3d09FXLs": ("程门立雪", "Trình môn lập tuyết - Tôn sư trọng đạo"),
    "7yPK7c-s-yw": ("滥竽充数", "Lạm vu sung số - Trà trộn lấy tiếng"),
    "ZHQ-mHHU78I": ("杞人忧天", "Kỷ nhân ưu thiên - Lo bò trắng răng"),
    "B8LvifCK2BA": ("刻舟求剑", "Khắc chu cầu kiếm - Cố chấp cứng nhắc"),
    "q7kFBDCssU8": ("叶公好龙", "Diệp Công hiếu long - Yêu thích giả tạo"),
    "4Vl8LpQQUSs": ("胸有成竹", "Hung hữu thành trúc - Tự tin nắm chắc")
}


def run_cmd(cmd):
    result = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    return result.returncode, result.stdout.strip(), result.stderr.strip()

def main():
    print("=== Starting Website Updates Script ===")
    if os.path.exists(REPO_DIR):
        os.chdir(REPO_DIR)
    else:
        print(f"Info: REPO_DIR '{REPO_DIR}' not found. Using current working directory.")
    
    # 1. Git pull
    code, out, err = run_cmd("git pull")
    if code != 0:
        print(f"Git pull error: {err}")
        # Proceed anyway in case there are no conflicts
    
    changes = []
    updated = False
    
    # 2. Fetch & Update YouTube Videos
    try:
        req = urllib.request.Request(
            YOUTUBE_FEED_URL,
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            xml_data = response.read()
            
        root = ET.fromstring(xml_data)
        # XML Namespaces
        ns = {
            'atom': 'http://www.w3.org/2005/Atom',
            'yt': 'http://www.youtube.com/xml/schemas/2015'
        }
        
        entries = root.findall('atom:entry', ns)
        fetched_videos = []
        for entry in entries:
            video_id_el = entry.find('yt:videoId', ns)
            title_el = entry.find('atom:title', ns)
            if video_id_el is not None and title_el is not None:
                video_id = video_id_el.text.strip()
                title = title_el.text.strip()
                # Clean title (remove hashtags)
                clean_title = re.sub(r'#\w+', '', title).strip()
                clean_title = re.sub(r'\s+', ' ', clean_title)
                
                fetched_videos.append({
                    'id': video_id,
                    'title': clean_title
                })
        
        # Load media.js
        media_js_path = "media.js"
        media_html_path = "media.html"
        
        with open(media_js_path, "r", encoding="utf-8") as f:
            media_content = f.read()
            
        start_token = "const ALL_VIDEOS = "
        end_token = "const CATEGORIES = "
        
        start_idx = media_content.find(start_token)
        end_idx = media_content.find(end_token)
        
        if start_idx != -1 and end_idx != -1:
            prefix = media_content[:start_idx + len(start_token)]
            suffix = media_content[end_idx:]
            
            array_text = media_content[start_idx + len(start_token):end_idx].strip()
            if array_text.endswith(";"):
                array_text = array_text[:-1]
                
            videos = json.loads(array_text)
            existing_ids = {v["id"] for v in videos}
            
            new_videos_added = []
            
            # Process in reverse (oldest first) to maintain order
            for video in reversed(fetched_videos):
                v_id = video['id']
                if v_id in EXCLUDED_VIDEO_IDS:
                    continue
                if v_id in existing_ids:
                    continue
                    
                title = video['title']
                
                # Category logic
                lower_title = title.lower()
                
                # 1. Tiếng Trung thực chiến (Situational conversations)
                if lower_title.startswith('giao tiếp') or 'ngữ cảnh:' in lower_title or 'thực chiến' in lower_title or 'hội thoại' in lower_title:
                    category = "Tiếng Trung thực chiến"
                # 2. Song đấu từ vựng (Comparisons)
                elif ' vs ' in lower_title or ' & ' in lower_title or 'phân biệt' in lower_title or 'song đấu' in lower_title or v_id == "sPFjgmSqyGg":
                    category = "Song đấu từ vựng"
                # 3. Thành ngữ (Idioms)
                elif (
                    'thành ngữ' in lower_title or 'idiom' in lower_title or 'thần thoại' in lower_title or 'cổ tích' in lower_title or
                    v_id in KNOWN_IDIOM_IDS or
                    any(k in lower_title for k in [
                        'thành trúc', 'hiếu long', 'cầu kiếm', 'đạo linh', 'mâu thuẫn', 'chi oa',
                        'vi mã', 'di sơn', 'hổ uy', 'vị nhân', 'điểm mắt', 'bổ lao', 'đàn cầm',
                        'trầm chu', 'mạc tượng', 'đãi thỏ', 'thiêm túc', 'thất mã', 'lộng phủ',
                        'trợ trưởng', 'xà ảnh', 'tùy tục', 'lập tuyết'
                    ])
                ):
                    category = "Thành ngữ"
                # 4. Lê Lê kể chữ (Etymology)
                elif (
                    "chữ" in lower_title or 
                    "kể chữ" in lower_title or 
                    "nhớ chữ" in lower_title or 
                    "nguồn gốc" in lower_title or 
                    "giải mã chữ" in lower_title or
                    (v_id in HAN_VIET_MAP and v_id not in KNOWN_IDIOM_IDS)
                ):
                    category = "Lê Lê kể chữ"
                # 5. Tiếng lóng (Slangs)
                else:
                    category = "Tiếng lóng"

                # Parse title_zh and title_vi
                title_zh = ""
                title_vi = title
                
                if v_id in HAN_VIET_MAP:
                    title_zh, title_vi = HAN_VIET_MAP[v_id]
                elif category == "Lê Lê kể chữ":
                    # Try to extract title_zh
                    zh_chars = re.findall(r'[\u4e00-\u9fff]', title)
                    if zh_chars:
                        title_zh = zh_chars[0]
                    
                    # Split safely (avoiding parenthesis content splitting)
                    temp_title = title
                    parentheses = re.findall(r'\([^)]+\)', title)
                    for idx, p in enumerate(parentheses):
                        temp_title = temp_title.replace(p, f"__PAR_{idx}__")
                    
                    parts = [p.strip() for p in temp_title.split('-', 1)]
                    if len(parts) >= 2:
                        vi_part = parts[1]
                        for idx, p in enumerate(parentheses):
                            vi_part = vi_part.replace(f"__PAR_{idx}__", p)
                        title_vi = vi_part
                        
                    # Clean prefix words
                    title_vi = re.sub(r'^(?:Giải mã chữ|Chữ|Cách nhớ chữ|Mẹo nhớ chữ|Ý nghĩa chữ|Nguồn gốc chữ|Ý nghĩa sâu sắc của chữ|Câu chuyện chữ)\s+[\u4e00-\u9fffA-ZĐa-zđÀ-Ỹà-ỹ\s()]{1,20}(?:trong tiếng Trung)?\s*[\:\-–—]?\s*', '', title_vi, flags=re.IGNORECASE).strip()
                    if title_vi:
                        title_vi = title_vi[0].upper() + title_vi[1:]
                        
                    # Check if title_vi starts with a Hán-Việt name
                    if not re.match(r'^[A-ZĐĂÂÊÔƠƯÀ-Ỹ].*?\s*(-|—)\s*', title_vi):
                        # Try to extract from original title
                        pattern = r'\b([A-ZĐÁ-Ỹ]{2,})\b\s*' + re.escape(title_zh) if title_zh else r'\b([A-ZĐÁ-Ỹ]{2,})\b'
                        m = re.search(pattern, title)
                        if m and len(m.groups()) >= 1:
                            hv = m.group(1).capitalize()
                            title_vi = f"{hv} - {title_vi}"
                else:
                    # Try splitting by dash, colon, or vertical bar
                    parts = [p.strip() for p in re.split(r'\s*[\-–—:|]\s*', title, 1)]
                    if len(parts) >= 2:
                        title_zh = parts[0]
                        title_vi = parts[1]

                    
                # Find current max order for this category
                cat_videos = [v for v in videos if v.get("category") == category]
                max_order = max([v.get("order", 0) for v in cat_videos]) if cat_videos else 0
                new_order = max_order + 1
                
                new_video = {
                    "id": v_id,
                    "title_zh": title_zh,
                    "title_vi": title_vi,
                    "youtube_url": f"https://www.youtube.com/shorts/{v_id}",
                    "category": category,
                    "desc": f"Giải nghĩa và hướng dẫn sử dụng từ vựng '{title_zh or title_vi}' trong giao tiếp thực tế.",
                    "order": new_order
                }
                
                videos.insert(0, new_video)
                existing_ids.add(v_id)
                new_videos_added.append(v_id)
                changes.append(f"Added YouTube video {v_id} ({title_zh or title_vi})")
                
            if new_videos_added:
                # Serialize back
                formatted_array = json.dumps(videos, indent=2, ensure_ascii=False)
                new_media_content = prefix + formatted_array + ";\n\n" + suffix
                with open(media_js_path, "w", encoding="utf-8") as f:
                    f.write(new_media_content)
                
                # Bump cache version in media.html
                if os.path.exists(media_html_path):
                    with open(media_html_path, "r", encoding="utf-8") as f:
                        html = f.read()
                    match = re.search(r'media\.js\?v=(\d+)\.(\d+)\.(\d+)', html)
                    if match:
                        major, minor, patch = map(int, match.groups())
                        new_patch = patch + 1
                        old_version = f"media.js?v={major}.{minor}.{patch}"
                        new_version = f"media.js?v={major}.{minor}.{new_patch}"
                        html = html.replace(old_version, new_version)
                        with open(media_html_path, "w", encoding="utf-8") as f:
                            f.write(html)
                        changes.append(f"Bumped media.html cache version to {new_version}")
                updated = True
                
    except Exception as e:
        print(f"Error fetching YouTube feed: {e}")

    # 3. Update Infographics (DOC-STREETFOOD & DOC-WORDORDERS)
    try:
        images_dir = "POSTS/images"
        
        # Scan street food images
        street_food_pattern = os.path.join(images_dir, "street_food_*.png")
        street_food_files = sorted([os.path.basename(f) for f in glob.glob(street_food_pattern)])
        
        # Scan word order images
        word_order_pattern = os.path.join(images_dir, "word_order_*.png")
        word_order_files = sorted([os.path.basename(f) for f in glob.glob(word_order_pattern)])
        
        doc_js_path = "doc/doc.js"
        doc_html_path = "doc/doc.html"
        
        if os.path.exists(doc_js_path):
            with open(doc_js_path, "r", encoding="utf-8") as f:
                doc_js_content = f.read()
                
            orig_content = doc_js_content
            
            # Update DOC-STREETFOOD
            if street_food_files:
                sf_paths = ",".join([f"../POSTS/images/{f}" for f in street_food_files])
                sf_pattern = r"('DOC-STREETFOOD':\s*\{[\s\S]*?preview_images:\s*')([^']*)(')"
                doc_js_content = re.sub(sf_pattern, rf"\g<1>{sf_paths}\g<3>", doc_js_content)
                
            # Update DOC-WORDORDERS
            if word_order_files:
                wo_paths = ",".join([f"../POSTS/images/{f}" for f in word_order_files])
                wo_pattern = r"('DOC-WORDORDERS':\s*\{[\s\S]*?preview_images:\s*')([^']*)(')"
                doc_js_content = re.sub(wo_pattern, rf"\g<1>{wo_paths}\g<3>", doc_js_content)
                
            if doc_js_content != orig_content:
                with open(doc_js_path, "w", encoding="utf-8") as f:
                    f.write(doc_js_content)
                changes.append("Updated preview images for infographics in doc/doc.js")
                
                # Bump cache version in doc/doc.html
                if os.path.exists(doc_html_path):
                    with open(doc_html_path, "r", encoding="utf-8") as f:
                        html = f.read()
                    match = re.search(r'doc\.js\?v=(\d+)\.(\d+)\.(\d+)', html)
                    if match:
                        major, minor, patch = map(int, match.groups())
                        new_patch = patch + 1
                        old_version = f"doc.js?v={major}.{minor}.{patch}"
                        new_version = f"doc.js?v={major}.{minor}.{new_patch}"
                        html = html.replace(old_version, new_version)
                        with open(doc_html_path, "w", encoding="utf-8") as f:
                            f.write(html)
                        changes.append(f"Bumped doc/doc.html cache version to {new_version}")
                updated = True
                
    except Exception as e:
        print(f"Error updating infographics: {e}")
        
    # 4. Deploy via Git
    if updated:
        run_cmd("git config user.name 'n8n-server-auto'")
        run_cmd("git config user.email 'auto-update@lelehoctiengtrung.github.io'")
        run_cmd("git add media.js media.html doc/doc.js doc/doc.html")
        code, out, err = run_cmd("git commit -m 'auto(website): update youtube videos and infographics'")
        if code == 0:
            code_push, out_push, err_push = run_cmd("git push origin main")
            if code_push == 0:
                print("Successfully committed and pushed changes to GitHub Pages.")
            else:
                print(f"Git push error: {err_push}")
                changes.append(f"Git push error: {err_push}")
        else:
            print(f"Git commit error: {err}")
            
    # Output JSON for n8n
    result = {
        "updated": updated,
        "changes": changes
    }
    print("")
    print(json.dumps(result))

if __name__ == "__main__":
    main()
