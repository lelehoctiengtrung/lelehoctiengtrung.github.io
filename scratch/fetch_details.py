import urllib.request
import re
import html
import json

video_ids = [
    "ym86dYdxUiM"
]

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
        
        # Get description from meta tag
        desc_match = re.search(r'<meta name="description" content="([^"]+)"', content)
        desc = html.unescape(desc_match.group(1)) if desc_match else ""
        
        # Try to extract more details from ytInitialData if needed
        # (Usually meta description is sufficient for a brief summary)
        
        return {
            "id": vid,
            "title": title,
            "desc": desc
        }
    except Exception as e:
        print(f"Error fetching {vid}: {e}")
        return None

def main():
    results = []
    for vid in video_ids:
        print(f"Fetching {vid}...")
        details = fetch_video_details(vid)
        if details:
            print(f"  Title: {details['title']}")
            print(f"  Desc: {details['desc'][:100]}...")
            results.append(details)
            
    with open("scratch/fetched_details.json", "w", encoding="utf-8") as f:
        json.dump(results, f, ensure_ascii=False, indent=4)
    print("Done. Saved to scratch/fetched_details.json")

if __name__ == "__main__":
    main()
