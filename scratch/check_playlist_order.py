import urllib.request
import re

playlist_id = 'PLvJ8vmRjcTPqLQQ9D52csDmKdedouCGDT'
url = f"https://www.youtube.com/playlist?list={playlist_id}"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
)

try:
    with urllib.request.urlopen(req, timeout=10) as response:
        html = response.read().decode('utf-8')
        
    matches = re.findall(r'"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"', html)
    video_ids = []
    seen = set()
    for v_id in matches:
        if v_id not in seen:
            seen.add(v_id)
            video_ids.append(v_id)
            
    print(f"Playlist has {len(video_ids)} videos. Order in playlist:")
    for idx, v_id in enumerate(video_ids):
        print(f"{idx+1}: {v_id}")
except Exception as e:
    print(f"Error: {e}")
