import urllib.request
import re
import json

def get_playlist_videos(playlist_id):
    url = f"https://www.youtube.com/playlist?list={playlist_id}"
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    )
    try:
        with urllib.request.urlopen(req) as response:
            html = response.read().decode('utf-8')
            
        # Find ytInitialData
        match = re.search(r'var ytInitialData = ({.*?});', html)
        if not match:
            match = re.search(r'window\["ytInitialData"\] = ({.*?});', html)
            
        if not match:
            print(f"Could not find ytInitialData for playlist {playlist_id}")
            return []
            
        # Parse video IDs using regex
        video_ids = []
        # Find all occurrences of "videoId":"[11 chars]"
        matches = re.findall(r'"videoId"\s*:\s*"([a-zA-Z0-9_-]{11})"', html)
        # De-duplicate while preserving order
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
    # Test with Song đấu từ vựng playlist
    playlist_id = "PLvJ8vmRjcTPpXE4WXjeTJP9qRfO5aShvA"
    video_ids = get_playlist_videos(playlist_id)
    print(f"Found {len(video_ids)} videos in playlist {playlist_id}:")
    print(video_ids)

if __name__ == "__main__":
    main()
