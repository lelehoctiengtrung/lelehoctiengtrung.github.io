import json

with open('media.js', 'r', encoding='utf-8') as f:
    text = f.read()

start = text.find('const ALL_VIDEOS =') + len('const ALL_VIDEOS =')
end = text.find('const CATEGORIES =')
js_arr = text[start:end].strip()
if js_arr.endswith(';'): js_arr = js_arr[:-1]
videos = json.loads(js_arr)

with open('scratch/all_videos_list.txt', 'w', encoding='utf-8') as f:
    f.write(f"Total videos: {len(videos)}\n\n")
    for cat in sorted(set(v['category'] for v in videos)):
        cat_vids = [v for v in videos if v['category'] == cat]
        f.write(f"=== CATEGORY: {cat} ({len(cat_vids)} videos) ===\n")
        for idx, v in enumerate(cat_vids, 1):
            f.write(f"{idx:02d}. ID: {v['id']} | Title_ZH: {v.get('title_zh', '')} | Title_VI: {v.get('title_vi', '')} | Order: {v.get('order')}\n")
        f.write("\n")

print("Wrote list of all videos to scratch/all_videos_list.txt")
