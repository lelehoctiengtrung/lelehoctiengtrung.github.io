import json
import re

with open("media.js", "r", encoding="utf-8") as f:
    media_content = f.read()

# Find ALL_VIDEOS block
start_pattern = "const ALL_VIDEOS = ["
start_idx = media_content.find(start_pattern)
end_idx = media_content.find("];", start_idx)
videos_array_str = media_content[start_idx + len(start_pattern) : end_idx]

obj_pattern = r"\{[^{}]*\}"
objs = re.findall(obj_pattern, videos_array_str)

media_videos = []
for idx, o in enumerate(objs):
    try:
        v_id = re.search(r'"id":\s*"([^"]+)"', o).group(1)
        v_category = re.search(r'"category":\s*"([^"]+)"', o).group(1)
        v_order = int(re.search(r'"order":\s*(\d+)', o).group(1))
        v_title_vi = re.search(r'"title_vi":\s*"([^"]+)"', o).group(1)
        media_videos.append({"id": v_id, "category": v_category, "order": v_order, "title": v_title_vi})
    except Exception as e:
        pass

with open("all_channel_videos.json", "r", encoding="utf-8") as f:
    channel_videos = json.load(f)

# Create a mapping of video_id -> chronological index (smaller index = newer)
chron_map = {v[0]: idx for idx, v in enumerate(channel_videos)}

# For each category, print the videos sorted by the current 'order' property and compare with their chronological index
categories = set(v["category"] for v in media_videos)
for cat in sorted(categories):
    cat_vids = [v for v in media_videos if v["category"] == cat]
    # Sort by current order descending (how they are displayed on the website)
    cat_vids.sort(key=lambda x: x["order"], reverse=True)
    
    print(f"=== Category: {cat} ===")
    print("Top 10 displayed on website:")
    for v in cat_vids[:10]:
        chron_idx = chron_map.get(v["id"], "NOT_IN_JSON")
        print(f"  Order: {v['order']} | ChronIdx: {chron_idx} | ID: {v['id']} | Title: {v['title']}")
    print("Bottom 5 displayed on website:")
    for v in cat_vids[-5:]:
        chron_idx = chron_map.get(v["id"], "NOT_IN_JSON")
        print(f"  Order: {v['order']} | ChronIdx: {chron_idx} | ID: {v['id']} | Title: {v['title']}")
    print("-" * 50)
