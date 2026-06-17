import json

with open("all_channel_videos.json", "r", encoding="utf-8") as f:
    channel_videos = json.load(f)

# Find positions of relevant IDs
target_ids = [
    "7yWzxg_n9DA",  # 狗
    "dPC0nm5_PW4",  # 得
    "0fcYChxFeic",  # 很
    "TP6ObgHZwQc",  # 觉
    "kBS0J5LkTbU",  # 时
    "ym86dYdxUiM",  # 冷
    "ZKFGnZu36C4",  # Tác
    "ycoBAmSHaIk",  # Lão
    "GRCVyX1NVKc",  # Hán
]

for vid in target_ids:
    found = False
    for idx, (v_id, title) in enumerate(channel_videos):
        if v_id == vid:
            print(f"ID: {vid} | Channel JSON Index: {idx} | Title: {title}")
            found = True
            break
    if not found:
        print(f"ID: {vid} | NOT found in all_channel_videos.json")
