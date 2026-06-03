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
        // Try various common Shopee price selectors
        let priceCandidates = [];
        
        // 1. Selector for current price
        let els = document.querySelectorAll('.pqTWDO, ._2v0gOP, [data-testid="price"], .G2C2Uw, .v-center');
        els.forEach(el => {
            if (el.textContent && el.textContent.includes('₫')) {
                priceCandidates.push(el.textContent.trim());
            }
        });
        
        // 2. Search all elements with ₫ symbol
        document.querySelectorAll('*').forEach(el => {
            if (el.children.length === 0 && el.textContent && el.textContent.includes('₫')) {
                priceCandidates.push(el.textContent.trim());
            }
        });
        
        // 3. Fallback: page title / meta tags
        let ogPrice = document.querySelector('meta[property="product:price:amount"]');
        let amount = ogPrice ? ogPrice.getAttribute('content') : null;
        
        return {
            candidates: priceCandidates,
            ogPrice: amount,
            title: document.title
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
        
        print("\n=== SCRAPED PRICE DATA ===")
        print(f"Page Title: {value.get('title')}")
        print(f"OG Meta Price Amount: {value.get('ogPrice')}")
        print("Candidates found on page:")
        for cand in set(value.get('candidates', [])):
            print(f" - {cand}")
            
    except Exception as e:
        print("Error communicating via CDP:", e)
        
    finally:
        print(f"Closing tab ID: {tab_id}...")
        close_res = requests.get(f"{DEBUGGER_URL}/json/close/{tab_id}")
        print("Close response:", close_res.status_code)

if __name__ == "__main__":
    main()
