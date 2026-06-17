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

media_ids = []
for o in objs:
    try:
        v_id = re.search(r'"id":\s*"([^"]+)"', o).group(1)
        media_ids.append(v_id)
    except:
        pass

with open("all_channel_videos.json", "r", encoding="utf-8") as f:
    channel_videos = json.load(f)

json_ids = {v[0] for v in channel_videos}

missing = [vid for vid in media_ids if vid not in json_ids]
print(f"Total missing IDs: {len(missing)}")
for vid in missing:
    # Find title from media.js
    title = ""
    for o in objs:
        if vid in o:
            m = re.search(r'"title_vi":\s*"([^"]+)"', o)
            if m:
                title = m.group(1)
            break
    print(f"  ID: {vid} | Title: {title}")
