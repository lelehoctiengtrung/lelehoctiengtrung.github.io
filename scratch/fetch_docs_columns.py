import urllib.request
import json
import re

SHEET_ID = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o'
SHEET_NAME = 'docs'

url = f"https://docs.google.com/spreadsheets/d/{SHEET_ID}/gviz/tq?tqx=out:json&sheet={SHEET_NAME}&headers=2"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
with urllib.request.urlopen(req) as res:
    raw = res.read().decode('utf-8')

match = re.search(r'google\.visualization\.Query\.setResponse\(([\s\S]*?)\);', raw)
if match:
    data = json.loads(match.group(1))
    cols = [col.get('label') for col in data['table']['cols']]
    print("Columns:", cols)
    print("-" * 80)
    for idx, r in enumerate(data['table']['rows']):
        cells = r['c']
        row_data = {}
        for c_idx, cell in enumerate(cells):
            col_name = cols[c_idx] if c_idx < len(cols) else f"Col-{c_idx}"
            row_data[col_name] = cell['v'] if cell else None
        print(f"\nRow {idx+1}:")
        for k, v in row_data.items():
            # truncate long content for readability
            v_str = str(v)
            if len(v_str) > 120:
                v_str = v_str[:120] + "... [TRUNCATED]"
            print(f"  {k}: {v_str}")
else:
    print("Could not match response.")
