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
        # Fallback to GET
        new_tab_res = requests.get(f"{DEBUGGER_URL}/json/new?{SHOPEE_URL}")
        
    if new_tab_res.status_code != 200:
        print("Failed to open new tab via debugger API:", new_tab_res.text)
        return
        
    tab_data = new_tab_res.json()
    tab_id = tab_data.get("id")
    print(f"Opened tab ID: {tab_id}")
    
    # Wait for the page to load and JS to execute
    print("Waiting 10 seconds for Shopee page to render...")
    time.sleep(10)
    
    # Refresh tab list to find the websocket URL
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
    
    # Execute JS on the page to extract product details
    # We will get document.title and document.body.innerText
    js_code = """
    (function() {
        // Find product name. Shopee has h1, or span with class names
        let name = "";
        let h1s = document.getElementsByTagName("h1");
        for (let h1 of h1s) {
            if (h1.innerText && h1.innerText.trim()) {
                name = h1.innerText.trim();
                break;
            }
        }
        
        // Find description
        let desc = "";
        let descElems = document.querySelectorAll("p, span");
        // Look for description header or containers
        // Let's just return body innerText and let Python filter
        let bodyText = document.body.innerText;
        
        return {
            title: document.title,
            name: name,
            bodyLength: bodyText.length,
            bodyText: bodyText.substring(0, 5000)
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
        
        print("\n=== SCRAPED DATA ===")
        print("Title:", value.get("title"))
        print("Product Name:", value.get("name"))
        print("Body Text Length:", value.get("bodyLength"))
        
        body_text = value.get("bodyText", "")
        print("\n--- Body Text Preview ---")
        print(body_text[:2000])
        print("-------------------------\n")
        
        # Save to local text file
        with open("shopee_scraped_text.txt", "w", encoding="utf-8") as f:
            f.write(body_text)
            
    except Exception as e:
        print("Error communicating via CDP:", e)
        
    finally:
        # Close the tab so we don't pollute the user's browser
        print(f"Closing tab ID: {tab_id}...")
        close_res = requests.get(f"{DEBUGGER_URL}/json/close/{tab_id}")
        print("Close response:", close_res.status_code)

if __name__ == "__main__":
    main()
