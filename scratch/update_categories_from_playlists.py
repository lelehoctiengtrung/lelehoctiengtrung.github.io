import urllib.request
import re
import json
import os

PLAYLISTS = {
    'PLvJ8vmRjcTPqLQQ9D52csDmKdedouCGDT': 'Lê Lê kể chữ',
    'PLvJ8vmRjcTPpXE4WXjeTJP9qRfO5aShvA': 'Song đấu từ vựng',
    'PLvJ8vmRjcTPquOuOG0C31MqR_js_4Onx9': 'Tiếng lóng',
    'PLvJ8vmRjcTPpk7FB72P-YrJedsq2MlZD9': 'Thành ngữ',
    'PLvJ8vmRjcTPrh8zWUkNdtouHwz0-CCW2k': 'Tiếng Trung thực chiến'
}

def get_playlist_videos(playlist_id):
    url = f"https://www.youtube.com/playlist?list={playlist_id}"
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            
        video_ids = []
        matches = re.findall(r'"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"', html)
        seen = set()
        for v_id in matches:
            if v_id not in seen:
                seen.add(v_id)
                video_ids.append(v_id)
        return video_ids
    except Exception as e:
        print(f"Error fetching playlist {playlist_id}: {e}")
        return []

def main():
    print("--- Fetching video mappings from YouTube Playlists ---")
    video_to_category = {}
    
    for pl_id, cat_name in PLAYLISTS.items():
        print(f"Fetching playlist '{cat_name}' ({pl_id})...")
        v_ids = get_playlist_videos(pl_id)
        print(f"Found {len(v_ids)} videos.")
        for v_id in v_ids:
            # If a video is in multiple playlists, let's keep the first one or warn
            if v_id in video_to_category:
                print(f"  Warning: Video {v_id} is in multiple playlists: '{video_to_category[v_id]}' and '{cat_name}'. Keeping '{video_to_category[v_id]}'.")
            else:
                video_to_category[v_id] = cat_name
                
    # Read media.js
    print("\nReading media.js...")
    with open("media.js", "r", encoding="utf-8") as f:
        content = f.read()
        
    # Find ALL_VIDEOS block
    start_pattern = "const ALL_VIDEOS = ["
    start_idx = content.find(start_pattern)
    if start_idx == -1:
        print("Error: Could not find ALL_VIDEOS in media.js")
        return
        
    end_idx = content.find("];", start_idx)
    if end_idx == -1:
        print("Error: Could not find end of ALL_VIDEOS in media.js")
        return
        
    videos_array_str = content[start_idx + len(start_pattern) : end_idx]
    
    # We want to parse each video block {...} and update category
    # Let's find each block
    obj_pattern = r"\{[^{}]*\}"
    objs = re.findall(obj_pattern, videos_array_str)
    
    updated_objs_count = 0
    updated_array_elements = []
    
    for o in objs:
        # Extract ID
        id_match = re.search(r'"id"\s*:\s*"([^"]+)"', o)
        if not id_match:
            updated_array_elements.append(o)
            continue
            
        v_id = id_match.group(1)
        
        # Check if we have playlist-based category for this video
        new_cat = video_to_category.get(v_id)
        
        if new_cat:
            # Find category in object string and replace it
            cat_match = re.search(r'"category"\s*:\s*"([^"]+)"', o)
            if cat_match:
                old_cat = cat_match.group(1)
                if old_cat != new_cat:
                    print(f"Updating video {v_id} category: '{old_cat}' -> '{new_cat}'")
                    updated_o = o.replace(f'"category": "{old_cat}"', f'"category": "{new_cat}"')
                    updated_array_elements.append(updated_o)
                    updated_objs_count += 1
                else:
                    updated_array_elements.append(o)
            else:
                # Add category if missing
                print(f"Adding category '{new_cat}' to video {v_id}")
                # Insert category before order
                updated_o = o.replace('"order"', f'"category": "{new_cat}",\n    "order"')
                updated_array_elements.append(updated_o)
                updated_objs_count += 1
        else:
            updated_array_elements.append(o)
            
    # Combine back
    # Let's rebuild the array string
    new_array_str = "[\n" + ",\n".join(updated_array_elements) + "\n"
    
    # Replace in content
    new_content = content[:start_idx + len(start_pattern)] + new_array_str + content[end_idx:]
    
    with open("media.js", "w", encoding="utf-8") as f:
        f.write(new_content)
        
    print(f"\nSuccessfully updated {updated_objs_count} video categories in media.js!")

if __name__ == "__main__":
    main()
