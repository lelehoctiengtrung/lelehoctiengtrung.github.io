import json
import re

with open("media.js", "r", encoding="utf-8") as f:
    content = f.read()

# Find ALL_VIDEOS block
start_pattern = "const ALL_VIDEOS = ["
start_idx = content.find(start_pattern)
end_idx = content.find("];", start_idx)
videos_array_str = content[start_idx + len(start_pattern) : end_idx]

obj_pattern = r"\{[^{}]*\}"
objs = re.findall(obj_pattern, videos_array_str)

parsed_videos = []
for idx, o in enumerate(objs):
    try:
        v_id = re.search(r'"id":\s*"([^"]+)"', o).group(1)
        v_title_zh = re.search(r'"title_zh":\s*"([^"]*)"', o).group(1)
        v_title_vi = re.search(r'"title_vi":\s*"([^"]+)"', o).group(1)
        v_category = re.search(r'"category":\s*"([^"]+)"', o).group(1)
        v_order = int(re.search(r'"order":\s*(\d+)', o).group(1))
        parsed_videos.append({
            "id": v_id,
            "title_zh": v_title_zh,
            "title_vi": v_title_vi,
            "category": v_category,
            "order": v_order
        })
    except Exception as e:
        pass

lele_videos = [v for v in parsed_videos if v["category"] == "Lê Lê kể chữ"]

print("Suspicious titles in Lê Lê kể chữ:")
for v in lele_videos:
    title = v["title_vi"]
    # Suspicious if it doesn't start with a word and then a dash, or starts with lowercase
    # Example: "bước đi từ lúc..."
    if not re.match(r'^[A-ZĐĂÂÊÔƠƯÀ-Ỹ][a-zđăâêôơưà-ỹ]*\s*(-|—)\s*', title):
        print(f"ID: {v['id']} | ZH: {v['title_zh']} | VI: {v['title_vi']} | Order: {v['order']}")
