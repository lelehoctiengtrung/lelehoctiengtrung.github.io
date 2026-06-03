import time
import json
import requests
import websocket

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
    
    js_code = """
    (function() {
        let imgs = Array.from(document.querySelectorAll('img')).map(img => {
            return {
                src: img.src,
                alt: img.alt,
                width: img.naturalWidth || img.width,
                height: img.naturalHeight || img.height
            };
        });
        
        // Also look for background images
        let divs = Array.from(document.querySelectorAll('div')).filter(d => {
            let bg = window.getComputedStyle(d).backgroundImage;
            return bg && bg !== 'none' && bg.startsWith('url');
        }).map(d => {
            let bg = window.getComputedStyle(d).backgroundImage;
            let match = bg.match(/url\\(["']?(.*?)["']?\\)/);
            return match ? match[1] : null;
        }).filter(Boolean);
        
        return {
            images: imgs,
            bgImages: divs
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
        
        print("\n=== IMAGES FOUND ===")
        images = value.get("images", [])
        bg_images = value.get("bgImages", [])
        
        print(f"Total img tags: {len(images)}")
        print(f"Total background images: {len(bg_images)}")
        
        shopee_cdn_images = []
        for img in images:
            src = img.get("src", "")
            if "down-vn.img.susercontent.com" in src or "cf.shopee.vn" in src:
                shopee_cdn_images.append(img)
                print(f"Img: {src} (alt={img.get('alt')}, size={img.get('width')}x{img.get('height')})")
                
        for bg in bg_images:
            if "down-vn.img.susercontent.com" in bg or "cf.shopee.vn" in bg:
                print(f"BG Image: {bg}")
                
        with open("shopee_images.json", "w", encoding="utf-8") as f:
            json.dump(value, f, indent=2, ensure_ascii=False)
            
    except Exception as e:
        print("Error communicating via CDP:", e)
        
    finally:
        print(f"Closing tab ID: {tab_id}...")
        close_res = requests.get(f"{DEBUGGER_URL}/json/close/{tab_id}")
        print("Close response:", close_res.status_code)

if __name__ == "__main__":
    main()
