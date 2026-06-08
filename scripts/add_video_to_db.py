#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import sys
import os
import json
import re

def main():
    if len(sys.argv) < 6:
        print("Usage: python3 add_video_to_db.py <video_id> <title_zh> <title_vi> <category> <desc> [thumbnail_path]")
        sys.exit(1)

    video_id = sys.argv[1].strip()
    title_zh = sys.argv[2].strip()
    title_vi = sys.argv[3].strip()
    category = sys.argv[4].strip()
    desc = sys.argv[5].strip()
    thumbnail = sys.argv[6].strip() if len(sys.argv) > 6 else None

    media_js_path = "media.js"
    media_html_path = "media.html"

    if not os.path.exists(media_js_path):
        print(f"Error: {media_js_path} not found.")
        sys.exit(1)

    # 1. Read media.js
    with open(media_js_path, "r", encoding="utf-8") as f:
        content = f.read()

    start_token = "const ALL_VIDEOS = "
    end_token = "const CATEGORIES = "

    start_idx = content.find(start_token)
    end_idx = content.find(end_token)

    if start_idx == -1 or end_idx == -1:
        print("Error: Could not parse ALL_VIDEOS in media.js")
        sys.exit(1)

    prefix = content[:start_idx + len(start_token)]
    suffix = content[end_idx:]

    array_text = content[start_idx + len(start_token):end_idx].strip()
    if array_text.endswith(";"):
        array_text = array_text[:-1]

    try:
        videos = json.loads(array_text)
    except Exception as e:
        print(f"Error parsing JSON in media.js: {e}")
        sys.exit(1)

    # Check for duplicate
    if any(v["id"] == video_id for v in videos):
        print(f"Warning: Video with ID {video_id} already exists in media.js. Skipping.")
        sys.exit(0)

    # Find current max order for this category
    cat_videos = [v for v in videos if v.get("category") == category]
    max_order = max([v.get("order", 0) for v in cat_videos]) if cat_videos else 0
    new_order = max_order + 1

    # Create new video object
    new_video = {
        "id": video_id,
        "title_zh": title_zh,
        "title_vi": title_vi,
        "youtube_url": f"https://www.youtube.com/shorts/{video_id}",
        "category": category,
        "desc": desc,
        "order": new_order
    }
    if thumbnail:
        new_video["thumbnail"] = thumbnail

    # Prepend new video to the list (so it shows at the top of the file array)
    videos.insert(0, new_video)

    # Serialize back
    formatted_array = json.dumps(videos, indent=2, ensure_ascii=False)
    new_content = prefix + formatted_array + ";\n\n" + suffix

    with open(media_js_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"Successfully added video {video_id} ('{title_zh}') to media.js with order {new_order}.")

    # 2. Bump cache version in media.html
    if os.path.exists(media_html_path):
        with open(media_html_path, "r", encoding="utf-8") as f:
            html = f.read()
        
        # Find media.js?v=X.Y.Z
        match = re.search(r'media\.js\?v=(\d+)\.(\d+)\.(\d+)', html)
        if match:
            major, minor, patch = map(int, match.groups())
            new_patch = patch + 1
            old_version = f"media.js?v={major}.{minor}.{patch}"
            new_version = f"media.js?v={major}.{minor}.{new_patch}"
            html = html.replace(old_version, new_version)
            with open(media_html_path, "w", encoding="utf-8") as f:
                f.write(html)
            print(f"Bumped cache version in media.html to {new_version}")

if __name__ == "__main__":
    main()
