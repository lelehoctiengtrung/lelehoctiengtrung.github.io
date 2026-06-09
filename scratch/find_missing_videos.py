import sys
import os
import json

# Add Shared folder to path
sys.path.append("/Users/hanario/Documents/YTF-Productions/Lê Lê học tiếng Trung/MacOs lelehoctiengtrung/Shared")
from gdrive_utils import get_sheets_service

SPREADSHEET_ID = "1b6LNl7JHRiCsjK1w9VuD86GLqAfmSOtDUOm5whrGdH0"
SHEETS = ["hanzidegushi", "dialogue", "idiom", "slang", "vs_series"]

# Read existing videos from media.js to avoid adding duplicates
def get_existing_youtube_ids():
    media_js_path = "/Users/hanario/.gemini/antigravity/worktrees/Website lelehoctiengtrung/create-documentation-workflow/media.js"
    ids = set()
    if os.path.exists(media_js_path):
        with open(media_js_path, "r", encoding="utf-8") as f:
            content = f.read()
            # simple regex to extract "id": "xxxx"
            import re
            found = re.findall(r'"id":\s*"([^"]+)"', content)
            ids.update(found)
    return ids

def main():
    existing_ids = get_existing_youtube_ids()
    print(f"Loaded {len(existing_ids)} existing video IDs from media.js.")
    
    client = get_sheets_service()
    doc = client.open_by_key(SPREADSHEET_ID)
    
    missing_videos = []
    
    for sheet_name in SHEETS:
        print(f"Scanning sheet '{sheet_name}'...")
        try:
            sheet = doc.worksheet(sheet_name)
            rows = sheet.get_all_values()
            if not rows:
                continue
                
            headers = [h.strip().lower() for h in rows[0]]
            
            def get_idx(name):
                try:
                    return headers.index(name.lower())
                except ValueError:
                    return -1
            
            char_idx = get_idx("Character")
            idea_idx = get_idx("Idea")
            status_idx = get_idx("Status")
            yt_idx = get_idx("Youtube")
            
            if char_idx == -1 or status_idx == -1 or yt_idx == -1:
                print(f"Skipping '{sheet_name}': Missing columns.")
                continue
                
            for i, row in enumerate(rows[1:], start=2):
                if len(row) <= max(char_idx, status_idx, yt_idx):
                    continue
                    
                status = row[status_idx].strip()
                yt_url = row[yt_idx].strip()
                char = row[char_idx].strip()
                idea = row[idea_idx].strip() if idea_idx != -1 and len(row) > idea_idx else ""
                
                if status == "Published" and yt_url.startswith("http"):
                    # Extract YouTube ID
                    import re
                    # handle watch?v= or shorts/ or youtu.be
                    vid = ""
                    if "shorts/" in yt_url:
                        vid = yt_url.split("shorts/")[1].split("?")[0].split("&")[0].strip()
                    elif "v=" in yt_url:
                        vid = yt_url.split("v=")[1].split("?")[0].split("&")[0].strip()
                    elif "youtu.be/" in yt_url:
                        vid = yt_url.split("youtu.be/")[1].split("?")[0].split("&")[0].strip()
                    else:
                        # try getting last 11 chars
                        vid = yt_url.strip()[-11:]
                        
                    if len(vid) == 11:
                        if vid not in existing_ids:
                            missing_videos.append({
                                "id": vid,
                                "character": char,
                                "idea": idea,
                                "youtube_url": yt_url,
                                "sheet_category": sheet_name
                            })
        except Exception as e:
            print(f"Error scanning '{sheet_name}': {e}")
            
    print(f"\nFound {len(missing_videos)} published videos missing from media.js:")
    for v in missing_videos:
        print(f"Sheet: {v['sheet_category']} | Char: {v['character']} | ID: {v['id']} | URL: {v['youtube_url']}")
        
    # Write to a json file for easier parsing
    with open("missing_videos.json", "w", encoding="utf-8") as f:
        json.dump(missing_videos, f, ensure_ascii=False, indent=4)
    print("\nSaved missing videos list to missing_videos.json")

if __name__ == "__main__":
    main()
