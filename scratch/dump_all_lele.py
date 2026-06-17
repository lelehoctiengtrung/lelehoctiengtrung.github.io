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
        v_title_vi = re.search(r'"title_vi":\s*"([^"]+)"', o).group(1)
        v_category = re.search(r'"category":\s*"([^"]+)"', o).group(1)
        v_order = int(re.search(r'"order":\s*(\d+)', o).group(1))
        parsed_videos.append({"array_index": idx, "id": v_id, "title": v_title_vi, "category": v_category, "order": v_order})
    except Exception as e:
        print(f"Error parsing index {idx}: {e}")

lele_videos = [v for v in parsed_videos if v["category"] == "Lê Lê kể chữ"]
print(f"Total Lê Lê kể chữ videos: {len(lele_videos)}")
print("First 15 in array:")
for v in lele_videos[:15]:
    print(f"  ArrayIdx: {v['array_index']} | Order: {v['order']} | ID: {v['id']} | Title: {v['title']}")

print("\nLast 15 in array:")
for v in lele_videos[-15:]:
    print(f"  ArrayIdx: {v['array_index']} | Order: {v['order']} | ID: {v['id']} | Title: {v['title']}")
