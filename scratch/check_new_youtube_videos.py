import urllib.request
import re
import os

PLAYLISTS = {
    'PLvJ8vmRjcTPqLQQ9D52csDmKdedouCGDT': 'Lê Lê kể chữ',
    'PLvJ8vmRjcTPpXE4WXjeTJP9qRfO5aShvA': 'Song đấu từ vựng',
    'PLvJ8vmRjcTPquOuOG0C31MqR_js_4Onx9': 'Tiếng lóng',
    'PLvJ8vmRjcTPpk7FB72P-YrJedsq2MlZD9': 'Thành ngữ',
    'PLvJ8vmRjcTPrh8zWUkNdtouHwz0-CCW2k': 'Tiếng Trung thực chiến'
}

def get_existing_video_ids():
    media_js_path = "media.js"
    if not os.path.exists(media_js_path):
        print("media.js not found in current directory.")
        return set()
    with open(media_js_path, "r", encoding="utf-8") as f:
        content = f.read()
    # Find all "id": "xxxxx"
    ids = set(re.findall(r'"id"\s*:\s*"([a-zA-Z0-9_-]{11})"', content))
    return ids

def get_playlist_videos(playlist_id):
    url = f"https://www.youtube.com/playlist?list={playlist_id}"
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
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
    existing_ids = get_existing_video_ids()
    print(f"Loaded {len(existing_ids)} existing videos from media.js.")
    
    all_playlist_videos = {}
    for pl_id, cat in PLAYLISTS.items():
        print(f"Fetching playlist '{cat}'...")
        v_ids = get_playlist_videos(pl_id)
        print(f"  Found {len(v_ids)} videos.")
        for v_id in v_ids:
            if v_id not in all_playlist_videos:
                all_playlist_videos[v_id] = cat
                
    missing = []
    for v_id, cat in all_playlist_videos.items():
        if v_id not in existing_ids:
            missing.append((v_id, cat))
            
    print(f"\nFound {len(missing)} videos in playlists that are missing from media.js:")
    for v_id, cat in missing:
        print(f"ID: {v_id} | Category: {cat}")
        
if __name__ == "__main__":
    main()
