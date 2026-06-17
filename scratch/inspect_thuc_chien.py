import re

media_js_path = "media.js"

with open(media_js_path, "r", encoding="utf-8") as f:
    content = f.read()

# Extract the ALL_VIDEOS array
match = re.search(r"const ALL_VIDEOS = \[(.*?)\];", content, re.DOTALL)
if not match:
    print("Could not find ALL_VIDEOS array in media.js")
    exit(1)

array_str = "[" + match.group(1) + "]"
array_str_clean = re.sub(r"//.*", "", array_str)
objs = re.findall(r"\{[^{}]*\}", array_str_clean)
videos = []
for o in objs:
    try:
        v_id = re.search(r'"id":\s*"([^"]+)"', o).group(1)
        v_title_vi = re.search(r'"title_vi":\s*"([^"]+)"', o).group(1)
        v_category = re.search(r'"category":\s*"([^"]+)"', o).group(1)
        v_order = int(re.search(r'"order":\s*(\d+)', o).group(1))
        youtube_url = re.search(r'"youtube_url":\s*"([^"]+)"', o).group(1)
        
        videos.append({
            "id": v_id,
            "title_vi": v_title_vi,
            "category": v_category,
            "order": v_order,
            "youtube_url": youtube_url
        })
    except Exception as e:
        pass

thuc_chien_videos = [v for v in videos if v["category"] == "Tiếng Trung thực chiến"]
print(f"Total 'Tiếng Trung thực chiến' videos: {len(thuc_chien_videos)}")

# Print the top 30 and bottom 30 videos
print("\n--- FIRST 30 VIDEOS IN 'Tiếng Trung thực chiến' ---")
for idx, v in enumerate(thuc_chien_videos[:30], 1):
    print(f"{idx:02d}. Order: {v['order']} | ID: {v['id']} | Title: {v['title_vi']}")

print("\n--- LAST 30 VIDEOS IN 'Tiếng Trung thực chiến' ---")
for idx, v in enumerate(thuc_chien_videos[-30:], 1):
    print(f"{idx:02d}. Order: {v['order']} | ID: {v['id']} | Title: {v['title_vi']}")
