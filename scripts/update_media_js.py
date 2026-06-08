# -*- coding: utf-8 -*-
import json
import re

def main():
    print("--- Updating media.js offline database ---")
    
    # 6 new videos to add (newest first, so we order them 1 to 6)
    new_videos = [
        {
            "id": "ZKFGnZu36C4",
            "title_zh": "作",
            "title_vi": "Tác - Người bắt tay sáng tạo cái mới",
            "youtube_url": "https://www.youtube.com/shorts/ZKFGnZu36C4",
            "category": "Lê Lê kể chữ",
            "desc": "Giải nghĩa chữ Tác (作) - hình ảnh người đứng bắt tay vào làm việc, sáng tạo cái mới.",
            "order": 1
        },
        {
            "id": "1zrczoa-3gc",
            "title_zh": "看 / 看见",
            "title_vi": "Khán & Khán kiến - Nhìn xem và nhìn thấy",
            "youtube_url": "https://www.youtube.com/shorts/1zrczoa-3gc",
            "category": "Lê Lê kể chữ",
            "desc": "Phân biệt chữ Khán (看 - che mắt nhìn xa) và Khán kiến (看见 - kết quả của việc nhìn thấy).",
            "order": 2
        },
        {
            "id": "ObBKQUg3Ma4",
            "title_zh": "忽然 / 突然",
            "title_vi": "Đột nhiên & Hốt nhiên - Sự khác biệt tinh tế",
            "youtube_url": "https://www.youtube.com/shorts/ObBKQUg3Ma4",
            "category": "Lê Lê kể chữ",
            "desc": "Phân biệt cách dùng của 突然 (tūrán - đột nhiên) và 忽然 (hūrán - hốt nhiên) trong giao tiếp.",
            "order": 3
        },
        {
            "id": "jkOIuGDpDns",
            "title_zh": "以后 / 后来",
            "title_vi": "Dĩ hậu & Hậu lai - Sau này và sau đó",
            "youtube_url": "https://www.youtube.com/shorts/jkOIuGDpDns",
            "category": "Lê Lê kể chữ",
            "desc": "Phân biệt từ chỉ thời gian 以后 (yǐhòu - sau này) và 后来 (hòulái - sau đó, hậu lai).",
            "order": 4
        },
        {
            "id": "U3dYr5EqQOA",
            "title_zh": "还是 / 或者",
            "title_vi": "Hoàn thị & Hoặc giả - Hoặc là và hay là",
            "youtube_url": "https://www.youtube.com/shorts/U3dYr5EqQOA",
            "category": "Lê Lê kể chữ",
            "desc": "Phân biệt cách dùng từ liên kết 还是 (háishi - hay là trong câu hỏi) và 或者 (huòzhě - hoặc là trong câu trần thuật).",
            "order": 5
        },
        {
            "id": "SG4XEMgsEbE",
            "title_zh": "怎么 / 怎么样",
            "title_vi": "Chẩm ma & Chẩm ma dạng - Như thế nào và ra sao",
            "youtube_url": "https://www.youtube.com/shorts/SG4XEMgsEbE",
            "category": "Lê Lê kể chữ",
            "desc": "Phân biệt cách dùng của phó từ 怎么 (zěnme - thế nào, làm sao) và 怎么样 (zěnmeyàng - ra sao, thế nào).",
            "order": 6
        }
    ]
    
    with open("media.js", "r", encoding="utf-8") as f:
        content = f.read()
        
    # Find ALL_VIDEOS block
    start_pattern = "const ALL_VIDEOS = "
    start_idx = content.find(start_pattern)
    if start_idx == -1:
        print("Error: Could not find ALL_VIDEOS in media.js")
        return
        
    end_idx = content.find("];", start_idx)
    if end_idx == -1:
        print("Error: Could not find end of ALL_VIDEOS in media.js")
        return
        
    videos_array_str = content[start_idx + len(start_pattern) : end_idx]
    
    # We can parse the array using json.loads by making it valid JSON
    # Or we can do a regex find/replace to increment order values
    # Let's do it clean: extract each object block { ... } and parse it
    obj_pattern = r"\{[^{}]*\}"
    objs = re.findall(obj_pattern, videos_array_str)
    
    parsed_videos = []
    for o in objs:
        # Normalize keys to be valid JSON
        # replace unquoted keys with quoted keys
        normalized = o
        for key in ["id", "title_zh", "title_vi", "youtube_url", "category", "desc", "thumbnail", "order"]:
            normalized = re.sub(rf'"{key}":', f'"{key}":', normalized) # already quoted usually
            normalized = re.sub(rf'\s+{key}:', f' "{key}":', normalized) # unquoted keys
            
        try:
            # Let's clean trailing commas or newlines if any
            # Python's json parser is strict
            # We can use eval if safe, but json is safer
            # Actually, since it's JS object literal, let's parse using a small eval-like method or safe string parsing
            # A simple regex extraction is safest:
            v_id = re.search(r'"id":\s*"([^"]+)"', normalized).group(1)
            v_title_zh = re.search(r'"title_zh":\s*"([^"]+)"', normalized)
            v_title_zh = v_title_zh.group(1) if v_title_zh else ""
            
            v_title_vi = re.search(r'"title_vi":\s*"([^"]+)"', normalized)
            v_title_vi = v_title_vi.group(1) if v_title_vi else ""
            
            v_youtube = re.search(r'"youtube_url":\s*"([^"]+)"', normalized).group(1)
            v_category = re.search(r'"category":\s*"([^"]+)"', normalized).group(1)
            
            v_desc = re.search(r'"desc":\s*"([^"]+)"', normalized)
            v_desc = v_desc.group(1) if v_desc else ""
            
            v_thumb = re.search(r'"thumbnail":\s*"([^"]+)"', normalized)
            v_thumb = v_thumb.group(1) if v_thumb else None
            
            # Skip if this video is already in new_videos to avoid duplicates
            if any(nv["id"] == v_id for nv in new_videos):
                continue
                
            v_order = int(re.search(r'"order":\s*(\d+)', normalized).group(1))
            video_obj = {
                "id": v_id,
                "title_zh": v_title_zh,
                "title_vi": v_title_vi,
                "youtube_url": v_youtube,
                "category": v_category,
                "desc": v_desc,
                "order": v_order + 6 # Shift existing orders by 6
            }
            if v_thumb:
                video_obj["thumbnail"] = v_thumb
                
            parsed_videos.append(video_obj)
        except Exception as e:
            print(f"Error parsing object {o[:50]}...: {e}")
            
    # Combine new videos with shifted existing videos
    all_updated_videos = new_videos + parsed_videos
    
    # Format the updated ALL_VIDEOS array back to JS format
    js_array_elements = []
    for v in all_updated_videos:
        v_thumb_val = v.get("thumbnail")
        thumb_line = f',\n    "thumbnail": "{v_thumb_val}"' if v_thumb_val else ""
        el = (
            f'  {{\n'
            f'    "id": "{v["id"]}",\n'
            f'    "title_zh": "{v["title_zh"]}",\n'
            f'    "title_vi": "{v["title_vi"]}",\n'
            f'    "youtube_url": "{v["youtube_url"]}",\n'
            f'    "category": "{v["category"]}",\n'
            f'    "desc": "{v["desc"]}"{thumb_line},\n'
            f'    "order": {v["order"]}\n'
            f'  }}'
        )
        js_array_elements.append(el)
        
    new_array_str = "[\n" + ",\n".join(js_array_elements) + "\n"
    
    # Replace in content
    new_content = content[:start_idx + len(start_pattern)] + new_array_str + content[end_idx:]
    
    with open("media.js", "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print(f"Successfully added 6 new videos to media.js. Total offline videos: {len(all_updated_videos)}")

if __name__ == "__main__":
    main()
