import urllib.request
import json
import re

url = "https://docs.google.com/spreadsheets/d/1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o/gviz/tq?tqx=out:json&sheet=media&headers=2"
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})

print("Fetching sheet data...")
try:
    with urllib.request.urlopen(req, timeout=10) as response:
        raw = response.read().decode('utf-8')
        match = re.search(r'google\.visualization\.Query\.setResponse\(([\s\S]*?)\);', raw)
        if match:
            data = json.loads(match.group(1))
            rows = data['table']['rows']
            print(f"Successfully fetched sheet data. Total rows: {len(rows)}")
            for idx, r in enumerate(rows[:10]):
                cells = [c['v'] if c and 'v' in c else '' for c in r['c']]
                print(f"Row {idx+1}: {cells}")
        else:
            print("Failed to match setResponse")
except Exception as e:
    print(f"Error: {e}")
