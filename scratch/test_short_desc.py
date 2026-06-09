import urllib.request
import re
import html
import json

video_ids = [
    "6BZutg5fb8s", "zU7zXOXqcZE", "PGKzmpolLkE", "jus9TjzjgXs", 
    "7joBUVu_k4c", "GcFxUmA0POE", "wjnNJDtH1p0", "4lOk_iySKhA", "_Y4KtpD4w-w"
]

def clean_unicode_escapes(text):
    # Fix the double-encoded unicode issues
    try:
        # If it contains \u escapes
        text = text.encode('utf-8').decode('unicode-escape')
    except Exception:
        pass
    try:
        # If it's double-encoded utf-8
        text = text.encode('latin1').decode('utf-8')
    except Exception:
        pass
    return text

def fetch_video_details(vid):
    url = f"https://www.youtube.com/watch?v={vid}"
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            content = response.read().decode('utf-8', errors='ignore')
            
        # Get title
        title_match = re.search(r"<title>(.*?)</title>", content)
        title = title_match.group(1).replace(" - YouTube", "").strip() if title_match else ""
        title = html.unescape(title)
        
        # Search for "shortDescription"
        desc = ""
        match = re.search(r'"shortDescription"\s*:\s*"([^"]+)"', content)
        if match:
            raw_desc = match.group(1)
            desc = clean_unicode_escapes(raw_desc)
        
        return {
            "id": vid,
            "title": title,
            "desc": desc
        }
    except Exception as e:
        print(f"Error fetching {vid}: {e}")
        return None

def main():
    for vid in video_ids:
        details = fetch_video_details(vid)
        if details:
            print(f"--- ID: {vid} ---")
            print(f"Title: {details['title']}")
            print(f"Desc: {repr(details['desc'])}")
            print()

if __name__ == "__main__":
    main()
