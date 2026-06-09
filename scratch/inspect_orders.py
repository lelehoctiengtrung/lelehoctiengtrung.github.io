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
for o in objs:
    try:
        v_id = re.search(r'"id":\s*"([^"]+)"', o).group(1)
        v_title_vi = re.search(r'"title_vi":\s*"([^"]+)"', o).group(1)
        v_category = re.search(r'"category":\s*"([^"]+)"', o).group(1)
        v_order = int(re.search(r'"order":\s*(\d+)', o).group(1))
        parsed_videos.append({"id": v_id, "title": v_title_vi, "category": v_category, "order": v_order})
    except Exception as e:
        pass

# Group by category and print sorted by order desc
categories = set(v["category"] for v in parsed_videos)
for cat in sorted(categories):
    cat_vids = [v for v in parsed_videos if v["category"] == cat]
    cat_vids.sort(key=lambda x: x["order"], reverse=True)
    print(f"=== Category: {cat} (Total: {len(cat_vids)}) ===")
    for v in cat_vids[:10]:
        print(f"  Order: {v['order']} | ID: {v['id']} | Title: {v['title']}")
    print("  ...")
    for v in cat_vids[-5:]:
        print(f"  Order: {v['order']} | ID: {v['id']} | Title: {v['title']}")
    print("-" * 50)
