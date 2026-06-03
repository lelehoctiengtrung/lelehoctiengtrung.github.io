import time
import json
import requests
import websocket
import os

DEBUGGER_URL = "http://localhost:9222"
SHOPEE_URL = "https://shopee.vn/opaanlp/227817473/29713649734"

def send_cdp_command(ws_url, method, params={}):
    ws = websocket.create_connection(ws_url, suppress_origin=True)
    try:
        req = {
            "id": 1,
            "method": method,
            "params": params
        }
        ws.send(json.dumps(req))
        res = ws.recv()
        return json.loads(res)
    finally:
        ws.close()

def main():
    print(f"Opening new tab with URL: {SHOPEE_URL}...")
    new_tab_res = requests.put(f"{DEBUGGER_URL}/json/new?{SHOPEE_URL}")
    if new_tab_res.status_code != 200:
        new_tab_res = requests.get(f"{DEBUGGER_URL}/json/new?{SHOPEE_URL}")
        
    if new_tab_res.status_code != 200:
        print("Failed to open new tab via debugger API:", new_tab_res.text)
        return
        
    tab_data = new_tab_res.json()
    tab_id = tab_data.get("id")
    print(f"Opened tab ID: {tab_id}")
    
    print("Waiting 10 seconds for Shopee page to render...")
    time.sleep(10)
    
    tabs = requests.get(f"{DEBUGGER_URL}/json/list").json()
    ws_url = None
    for tab in tabs:
        if tab.get("id") == tab_id:
            ws_url = tab.get("webSocketDebuggerUrl")
            break
            
    if not ws_url:
        print(f"Could not find websocket URL for tab ID: {tab_id}")
        return
        
    print(f"Connecting to CDP websocket: {ws_url}")
    
    # We want to extract:
    # 1. Main image container images
    # 2. Thumbnail images
    # 3. Product description images
    js_code = """
    (function() {
        // Collect all images in the document
        let imgs = Array.from(document.querySelectorAll('img')).map(img => {
            return {
                src: img.src,
                alt: img.alt,
                width: img.naturalWidth || img.width,
                height: img.naturalHeight || img.height,
                outerHTML: img.outerHTML
            };
        });
        
        // Collect background images
        let bgImgs = [];
        document.querySelectorAll('*').forEach(el => {
            let bg = window.getComputedStyle(el).backgroundImage;
            if (bg && bg !== 'none' && bg.startsWith('url')) {
                let match = bg.match(/url\\(["']?(.*?)["']?\\)/);
                if (match) {
                    bgImgs.push(match[1]);
                }
            }
        });
        
        return {
            images: imgs,
            bgImages: bgImgs
        };
    })()
    """
    
    try:
        response = send_cdp_command(ws_url, "Runtime.evaluate", {
            "expression": js_code,
            "returnByValue": True
        })
        
        result = response.get("result", {}).get("result", {})
        value = result.get("value", {})
        
        images = value.get("images", [])
        bg_images = value.get("bgImages", [])
        
        print(f"Found {len(images)} img elements and {len(bg_images)} bg images.")
        
        # Download all unique Shopee CDN images
        shopee_urls = set()
        for img in images:
            src = img.get("src", "")
            if "down-vn.img.susercontent.com/file/" in src or "cf.shopee.vn/file/" in src:
                # Remove suffix like _tn or size specifications to get the original image
                base_url = src.split("_")[0]
                shopee_urls.add(base_url)
                
        for bg in bg_images:
            if "down-vn.img.susercontent.com/file/" in bg or "cf.shopee.vn/file/" in bg:
                base_url = bg.split("_")[0]
                shopee_urls.add(base_url)
                
        print(f"Found {len(shopee_urls)} unique Shopee CDN image base URLs.")
        
        os.makedirs("temp_shopee_images", exist_ok=True)
        
        for idx, url in enumerate(sorted(shopee_urls)):
            # Try to download
            print(f"Downloading image {idx+1}: {url}...")
            try:
                res = requests.get(url, timeout=15)
                if res.status_code == 200:
                    ext = "png"
                    if "image/jpeg" in res.headers.get("Content-Type", ""):
                        ext = "jpg"
                    elif "image/webp" in res.headers.get("Content-Type", ""):
                        ext = "webp"
                    
                    filename = f"temp_shopee_images/img_{idx+1}.{ext}"
                    with open(filename, "wb") as f:
                        f.write(res.content)
                    print(f"Saved {filename} (Size: {len(res.content)} bytes)")
                else:
                    print(f"Failed to download {url}: HTTP {res.status_code}")
            except Exception as e:
                print(f"Error downloading {url}: {e}")
                
    except Exception as e:
        print("Error communicating via CDP:", e)
        
    finally:
        print(f"Closing tab ID: {tab_id}...")
        close_res = requests.get(f"{DEBUGGER_URL}/json/close/{tab_id}")
        print("Close response:", close_res.status_code)

if __name__ == "__main__":
    main()
