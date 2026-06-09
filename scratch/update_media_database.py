import re
import os
import json

new_videos = [
    {
        "id": "ym86dYdxUiM",
        "title_zh": "冷",
        "title_vi": "Lãnh - Mệnh lệnh băng giá của thiên nhiên",
        "youtube_url": "https://www.youtube.com/shorts/ym86dYdxUiM",
        "category": "Lê Lê kể chữ",
        "desc": "Giải nghĩa chữ Lãnh (冷) - hình ảnh mệnh lệnh băng giá của thiên nhiên."
    }
]

def main():
    media_path = "media.js"
    if not os.path.exists(media_path):
        print("media.js not found.")
        return
        
    with open(media_path, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Find ALL_VIDEOS bounds including the declaration and semicolon
    start_pattern = "const ALL_VIDEOS = "
    start_idx = content.find(start_pattern)
    if start_idx == -1:
        print("Error: Could not find ALL_VIDEOS starting index.")
        return
        
    # Find the end of array ];
    end_idx = content.find("];", start_idx)
    if end_idx == -1:
        print("Error: Could not find ALL_VIDEOS ending index.")
        return
    end_idx += 2 # include ];
    
    videos_array_str = content[start_idx + len(start_pattern) : end_idx - 2]
    
    # Parse existing objects
    obj_pattern = r"\{[^{}]*\}"
    objs = re.findall(obj_pattern, videos_array_str)
    
    existing_videos = []
    for o in objs:
        try:
            v_id = re.search(r'"id"\s*:\s*"([^"]+)"', o).group(1)
            
            # optional title_zh
            v_title_zh_m = re.search(r'"title_zh"\s*:\s*"([^"]+)"', o)
            v_title_zh = v_title_zh_m.group(1) if v_title_zh_m else ""
            
            # optional title_vi
            v_title_vi_m = re.search(r'"title_vi"\s*:\s*"([^"]+)"', o)
            v_title_vi = v_title_vi_m.group(1) if v_title_vi_m else ""
            
            # optional title (fallback if no title_zh or title_vi)
            v_title_m = re.search(r'"title"\s*:\s*"([^"]+)"', o)
            v_title = v_title_m.group(1) if v_title_m else ""
            
            v_youtube = re.search(r'"youtube_url"\s*:\s*"([^"]+)"', o).group(1)
            v_category = re.search(r'"category"\s*:\s*"([^"]+)"', o).group(1)
            
            v_desc_m = re.search(r'"desc"\s*:\s*"([^"]+)"', o)
            v_desc = v_desc_m.group(1) if v_desc_m else ""
            
            v_thumb_m = re.search(r'"thumbnail"\s*:\s*"([^"]+)"', o)
            v_thumb = v_thumb_m.group(1) if v_thumb_m else None
            
            video_obj = {
                "id": v_id,
                "youtube_url": v_youtube,
                "category": v_category,
                "desc": v_desc
            }
            if v_title_zh: video_obj["title_zh"] = v_title_zh
            if v_title_vi: video_obj["title_vi"] = v_title_vi
            if v_title: video_obj["title"] = v_title
            if v_thumb: video_obj["thumbnail"] = v_thumb
            
            existing_videos.append(video_obj)
        except Exception as e:
            print(f"Error parsing object: {e}\nObject content: {o}")
            
    print(f"Parsed {len(existing_videos)} existing videos.")
    
    # Filter out any new videos that are already in existing_videos (deduplicate)
    filtered_new_videos = [nv for nv in new_videos if not any(ev["id"] == nv["id"] for ev in existing_videos)]
    print(f"Adding {len(filtered_new_videos)} new videos (after deduplication).")
    
    # Re-group videos by category, keeping array order
    categories_order = ["Lê Lê kể chữ", "Song đấu từ vựng", "Thành ngữ", "Tiếng lóng", "Tiếng Trung thực chiến"]
    
    videos_by_cat = {cat: [] for cat in categories_order}
    
    # Distribute existing videos
    for v in existing_videos:
        cat = v["category"]
        if cat in videos_by_cat:
            videos_by_cat[cat].append(v)
        else:
            videos_by_cat[cat] = [v]
            
    # Append new videos to Lê Lê kể chữ
    for nv in filtered_new_videos:
        videos_by_cat["Lê Lê kể chữ"].append(nv)
        
    # Re-assign order numbers for each category
    all_reordered_videos = []
    for cat in categories_order:
        cat_vids = videos_by_cat[cat]
        total_in_cat = len(cat_vids)
        print(f"Category '{cat}': {total_in_cat} videos.")
        for idx, v in enumerate(cat_vids):
            v["order"] = total_in_cat - idx
            all_reordered_videos.append(v)
            
    # Let's reconstruct the JS array string
    js_array_elements = []
    for v in all_reordered_videos:
        lines = [
            f'    "id": "{v["id"]}"',
        ]
        if "title_zh" in v:
            lines.append(f'    "title_zh": "{v["title_zh"]}"')
        if "title_vi" in v:
            lines.append(f'    "title_vi": "{v["title_vi"]}"')
        if "title" in v:
            lines.append(f'    "title": "{v["title"]}"')
            
        lines.extend([
            f'    "youtube_url": "{v["youtube_url"]}"',
            f'    "category": "{v["category"]}"',
            f'    "desc": "{v["desc"]}"'
        ])
        
        if "thumbnail" in v:
            lines.append(f'    "thumbnail": "{v["thumbnail"]}"')
            
        lines.append(f'    "order": {v["order"]}')
        
        el = "  {\n" + ",\n".join(lines) + "\n  }"
        js_array_elements.append(el)
        
    # Format the entire const definition
    new_array_str = "[\n" + ",\n".join(js_array_elements) + "\n];"
    
    # Replace in content
    new_content = content[:start_idx + len(start_pattern)] + new_array_str + content[end_idx:]
    
    with open(media_path, "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print(f"Successfully updated media.js! Total videos in database: {len(all_reordered_videos)}")

if __name__ == "__main__":
    main()
