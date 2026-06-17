import urllib.request
import json
import re

SHEET_ID = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o'

def fetch_sheet_rows(sheet_name):
    url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json&sheet={sheet_name}&headers=2"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as res:
        raw = res.read().decode('utf-8')
    match = re.search(r'google\.visualization\.Query\.setResponse\(([\s\S]*?)\);', raw)
    if not match:
        raise ValueError(f"Could not parse sheet response for {sheet_name}")
    data = json.loads(match.group(1))
    return data['table']['rows']

print("=== Google Sheets - docs ===")
try:
    rows = fetch_sheet_rows('docs')
    for idx, r in enumerate(rows):
        cells = r['c']
        # Print basic info
        title = cells[1]['v'] if len(cells) > 1 and cells[1] else "None"
        doc_id = cells[0]['v'] if len(cells) > 0 and cells[0] else f"ROW-{idx}"
        drive_url = cells[9]['v'] if len(cells) > 9 and cells[9] else "None"
        print(f"Row {idx+1} | ID: {doc_id} | Title: {title} | Drive URL: {drive_url}")
except Exception as e:
    print(f"Error fetching 'docs': {e}")

print("\n=== Google Sheets - media ===")
try:
    rows = fetch_sheet_rows('media')
    for idx, r in enumerate(rows):
        cells = r['c']
        title = cells[1]['v'] if len(cells) > 1 and cells[1] else "None"
        v_id = cells[0]['v'] if len(cells) > 0 and cells[0] else f"ROW-{idx}"
        category = cells[3]['v'] if len(cells) > 3 and cells[3] else "None"
        print(f"Row {idx+1} | ID/VideoID: {v_id} | Title: {title} | Category: {category}")
except Exception as e:
    print(f"Error fetching 'media': {e}")

print("\n=== Google Sheets - shop ===")
try:
    rows = fetch_sheet_rows('shop')
    for idx, r in enumerate(rows):
        cells = r['c']
        sku = cells[0]['v'] if len(cells) > 0 and cells[0] else f"ROW-{idx}"
        title = cells[1]['v'] if len(cells) > 1 and cells[1] else "None"
        print(f"Row {idx+1} | SKU: {sku} | Title: {title}")
except Exception as e:
    print(f"Error fetching 'shop': {e}")
