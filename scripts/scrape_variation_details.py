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
    print(f"Opening tab with URL: {SHOPEE_URL}...")
    new_tab_res = requests.put(f"{DEBUGGER_URL}/json/new?{SHOPEE_URL}")
    if new_tab_res.status_code != 200:
        new_tab_res = requests.get(f"{DEBUGGER_URL}/json/new?{SHOPEE_URL}")
        
    tab_data = new_tab_res.json()
    tab_id = tab_data.get("id")
    
    print("Waiting 10 seconds...")
    time.sleep(10)
    
    tabs = requests.get(f"{DEBUGGER_URL}/json/list").json()
    ws_url = None
    for tab in tabs:
        if tab.get("id") == tab_id:
            ws_url = tab.get("webSocketDebuggerUrl")
            break
            
    if not ws_url:
        print("No ws url")
        return
        
    js_code = """
    (function() {
        // Find the variation buttons in the page
        let variations = [];
        let buttons = Array.from(document.querySelectorAll('button.product-variation'));
        if (buttons.length === 0) {
            // Shopee HTML classes might be minified, search by structure
            buttons = Array.from(document.querySelectorAll('button')).filter(btn => {
                let text = btn.textContent.trim();
                return text && (text.includes('HSK') || text.includes('Vở') || text.includes('Combo') || text.includes('Trọn bộ'));
            });
        }
        
        return buttons.map(btn => btn.textContent.trim());
    })()
    """
    
    try:
        response = send_cdp_command(ws_url, "Runtime.evaluate", {
            "expression": js_code,
            "returnByValue": True
        })
        
        result = response.get("result", {}).get("result", {})
        variations = result.get("value", [])
        
        print("\n=== VARIATIONS FOUND ===")
        for idx, var in enumerate(variations):
            print(f"{idx+1}. {var}")
            
        # Let's write a loop to click each variation and get the selected price
        js_click_code_template = """
        (function() {
            let buttons = Array.from(document.querySelectorAll('button.product-variation'));
            if (buttons.length === 0) {
                buttons = Array.from(document.querySelectorAll('button')).filter(btn => {
                    let text = btn.textContent.trim();
                    return text && (text.includes('HSK') || text.includes('Vở') || text.includes('Combo') || text.includes('Trọn bộ'));
                });
            }
            
            if (buttons[%d]) {
                buttons[%d].click();
                return true;
            }
            return false;
        })()
        """
        
        js_get_price_code = """
        (function() {
            // Find current price display element
            let priceEl = document.querySelector('.pqTWDO, .G2C2Uw');
            if (!priceEl) {
                // search elements containing ₫
                let els = Array.from(document.querySelectorAll('*')).filter(el => {
                    return el.children.length === 0 && el.textContent.includes('₫') && el.textContent.trim().length < 20;
                });
                if (els.length > 0) {
                    // Find the largest text size or specific styles
                    return els.map(e => e.textContent.trim());
                }
            }
            return priceEl ? priceEl.textContent.trim() : null;
        })()
        """
        
        for idx in range(len(variations)):
            var_name = variations[idx]
            # Click
            send_cdp_command(ws_url, "Runtime.evaluate", {
                "expression": js_click_code_template % (idx, idx),
                "returnByValue": True
            })
            time.sleep(1.5) # Wait for price to update
            
            # Get Price
            res_price = send_cdp_command(ws_url, "Runtime.evaluate", {
                "expression": js_get_price_code,
                "returnByValue": True
            })
            price_val = res_price.get("result", {}).get("result", {}).get("value")
            print(f"Variation: {var_name} -> Price: {price_val}")
            
    except Exception as e:
        print("Error:", e)
    finally:
        requests.get(f"{DEBUGGER_URL}/json/close/{tab_id}")

if __name__ == "__main__":
    main()
