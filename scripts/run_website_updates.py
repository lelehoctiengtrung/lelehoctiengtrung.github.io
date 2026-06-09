#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import json
import re
import urllib.request
import xml.etree.ElementTree as ET
import subprocess
import glob

# Config
REPO_DIR = "/media/vpsg16gb/Workspace/lelehoctiengtrung/Website_lelehoctiengtrung"
YOUTUBE_FEED_URL = "https://www.youtube.com/feeds/videos.xml?channel_id=UCGQfqOTElLYJ1-1OEDQJ8Cw"

def run_cmd(cmd):
    result = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    return result.returncode, result.stdout.strip(), result.stderr.strip()

def main():
    print("=== Starting Website Updates Script ===")
    os.chdir(REPO_DIR)
    
    # 1. Git pull
    code, out, err = run_cmd("git pull")
    if code != 0:
        print(f"Git pull error: {err}")
        # Proceed anyway in case there are no conflicts
    
    changes = []
    updated = False
    
    # 2. Fetch & Update YouTube Videos
    try:
        req = urllib.request.Request(
            YOUTUBE_FEED_URL,
            headers={'User-Agent': 'Mozilla/5.0'}
        )
        with urllib.request.urlopen(req, timeout=30) as response:
            xml_data = response.read()
            
        root = ET.fromstring(xml_data)
        # XML Namespaces
        ns = {
            'atom': 'http://www.w3.org/2005/Atom',
            'yt': 'http://www.youtube.com/xml/schemas/2015'
        }
        
        entries = root.findall('atom:entry', ns)
        fetched_videos = []
        for entry in entries:
            video_id_el = entry.find('yt:videoId', ns)
            title_el = entry.find('atom:title', ns)
            if video_id_el is not None and title_el is not None:
                video_id = video_id_el.text.strip()
                title = title_el.text.strip()
                # Clean title (remove hashtags)
                clean_title = re.sub(r'#\w+', '', title).strip()
                clean_title = re.sub(r'\s+', ' ', clean_title)
                
                fetched_videos.append({
                    'id': video_id,
                    'title': clean_title
                })
        
        # Load media.js
        media_js_path = "media.js"
        media_html_path = "media.html"
        
        with open(media_js_path, "r", encoding="utf-8") as f:
            media_content = f.read()
            
        start_token = "const ALL_VIDEOS = "
        end_token = "const CATEGORIES = "
        
        start_idx = media_content.find(start_token)
        end_idx = media_content.find(end_token)
        
        if start_idx != -1 and end_idx != -1:
            prefix = media_content[:start_idx + len(start_token)]
            suffix = media_content[end_idx:]
            
            array_text = media_content[start_idx + len(start_token):end_idx].strip()
            if array_text.endswith(";"):
                array_text = array_text[:-1]
                
            videos = json.loads(array_text)
            existing_ids = {v["id"] for v in videos}
            
            new_videos_added = []
            
            # Process in reverse (oldest first) to maintain order
            for video in reversed(fetched_videos):
                v_id = video['id']
                if v_id in existing_ids:
                    continue
                    
                title = video['title']
                
                # Parse title_zh and title_vi
                title_zh = ""
                title_vi = title
                
                # Try pattern: Câu chuyện chữ [zh] - [vi]
                char_match = re.search(r'Câu chuyện chữ\s+([^\s\-]+)\s*[\-\:]\s*(.*)', title, re.IGNORECASE)
                if char_match:
                    title_zh = char_match.group(1).strip()
                    title_vi = char_match.group(2).strip()
                else:
                    # Try splitting by dash
                    parts = [p.strip() for p in title.split('-', 1)]
                    if len(parts) >= 2:
                        title_zh = parts[0]
                        title_vi = parts[1]
                
                # Category logic
                lower_title = title.lower()
                category = "Tiếng Trung thực chiến"
                if 'kể chữ' in lower_title or 'câu chuyện chữ' in lower_title or 'bộ thủ' in lower_title:
                    category = "Lê Lê kể chữ"
                elif 'slang' in lower_title or 'tiếng lóng' in lower_title or 'lóng' in lower_title:
                    category = "Tiếng lóng"
                elif 'vs' in lower_title or 'phân biệt' in lower_title or 'song đấu' in lower_title:
                    category = "Song đấu từ vựng"
                elif 'thành ngữ' in lower_title or 'idiom' in lower_title:
                    category = "Thành ngữ"
                    
                # Find current max order for this category
                cat_videos = [v for v in videos if v.get("category") == category]
                max_order = max([v.get("order", 0) for v in cat_videos]) if cat_videos else 0
                new_order = max_order + 1
                
                new_video = {
                    "id": v_id,
                    "title_zh": title_zh,
                    "title_vi": title_vi,
                    "youtube_url": f"https://www.youtube.com/shorts/{v_id}",
                    "category": category,
                    "desc": f"Giải nghĩa và hướng dẫn sử dụng từ vựng '{title_zh or title_vi}' trong giao tiếp thực tế.",
                    "order": new_order
                }
                
                videos.insert(0, new_video)
                existing_ids.add(v_id)
                new_videos_added.append(v_id)
                changes.append(f"Added YouTube video {v_id} ({title_zh or title_vi})")
                
            if new_videos_added:
                # Serialize back
                formatted_array = json.dumps(videos, indent=2, ensure_ascii=False)
                new_media_content = prefix + formatted_array + ";\n\n" + suffix
                with open(media_js_path, "w", encoding="utf-8") as f:
                    f.write(new_media_content)
                
                # Bump cache version in media.html
                if os.path.exists(media_html_path):
                    with open(media_html_path, "r", encoding="utf-8") as f:
                        html = f.read()
                    match = re.search(r'media\.js\?v=(\d+)\.(\d+)\.(\d+)', html)
                    if match:
                        major, minor, patch = map(int, match.groups())
                        new_patch = patch + 1
                        old_version = f"media.js?v={major}.{minor}.{patch}"
                        new_version = f"media.js?v={major}.{minor}.{new_patch}"
                        html = html.replace(old_version, new_version)
                        with open(media_html_path, "w", encoding="utf-8") as f:
                            f.write(html)
                        changes.append(f"Bumped media.html cache version to {new_version}")
                updated = True
                
    except Exception as e:
        print(f"Error fetching YouTube feed: {e}")

    # 3. Update Infographics (DOC-STREETFOOD & DOC-WORDORDERS)
    try:
        images_dir = "POSTS/images"
        
        # Scan street food images
        street_food_pattern = os.path.join(images_dir, "street_food_*.png")
        street_food_files = sorted([os.path.basename(f) for f in glob.glob(street_food_pattern)])
        
        # Scan word order images
        word_order_pattern = os.path.join(images_dir, "word_order_*.png")
        word_order_files = sorted([os.path.basename(f) for f in glob.glob(word_order_pattern)])
        
        doc_js_path = "doc/doc.js"
        doc_html_path = "doc/doc.html"
        
        if os.path.exists(doc_js_path):
            with open(doc_js_path, "r", encoding="utf-8") as f:
                doc_js_content = f.read()
                
            orig_content = doc_js_content
            
            # Update DOC-STREETFOOD
            if street_food_files:
                sf_paths = ",".join([f"../POSTS/images/{f}" for f in street_food_files])
                sf_pattern = r"('DOC-STREETFOOD':\s*\{[\s\S]*?preview_images:\s*')([^']*)(')"
                doc_js_content = re.sub(sf_pattern, rf"\g<1>{sf_paths}\g<3>", doc_js_content)
                
            # Update DOC-WORDORDERS
            if word_order_files:
                wo_paths = ",".join([f"../POSTS/images/{f}" for f in word_order_files])
                wo_pattern = r"('DOC-WORDORDERS':\s*\{[\s\S]*?preview_images:\s*')([^']*)(')"
                doc_js_content = re.sub(wo_pattern, rf"\g<1>{wo_paths}\g<3>", doc_js_content)
                
            if doc_js_content != orig_content:
                with open(doc_js_path, "w", encoding="utf-8") as f:
                    f.write(doc_js_content)
                changes.append("Updated preview images for infographics in doc/doc.js")
                
                # Bump cache version in doc/doc.html
                if os.path.exists(doc_html_path):
                    with open(doc_html_path, "r", encoding="utf-8") as f:
                        html = f.read()
                    match = re.search(r'doc\.js\?v=(\d+)\.(\d+)\.(\d+)', html)
                    if match:
                        major, minor, patch = map(int, match.groups())
                        new_patch = patch + 1
                        old_version = f"doc.js?v={major}.{minor}.{patch}"
                        new_version = f"doc.js?v={major}.{minor}.{new_patch}"
                        html = html.replace(old_version, new_version)
                        with open(doc_html_path, "w", encoding="utf-8") as f:
                            f.write(html)
                        changes.append(f"Bumped doc/doc.html cache version to {new_version}")
                updated = True
                
    except Exception as e:
        print(f"Error updating infographics: {e}")
        
    # 4. Deploy via Git
    if updated:
        run_cmd("git config user.name 'n8n-server-auto'")
        run_cmd("git config user.email 'auto-update@lelehoctiengtrung.github.io'")
        run_cmd("git add media.js media.html doc/doc.js doc/doc.html")
        code, out, err = run_cmd("git commit -m 'auto(website): update youtube videos and infographics'")
        if code == 0:
            code_push, out_push, err_push = run_cmd("git push origin main")
            if code_push == 0:
                print("Successfully committed and pushed changes to GitHub Pages.")
            else:
                print(f"Git push error: {err_push}")
                changes.append(f"Git push error: {err_push}")
        else:
            print(f"Git commit error: {err}")
            
    # Output JSON for n8n
    result = {
        "updated": updated,
        "changes": changes
    }
    print("")
    print(json.dumps(result))

if __name__ == "__main__":
    main()
