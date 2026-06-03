import os
import json
import requests

SPREADSHEET_ID = "1b6LNl7JHRiCsjK1w9VuD86GLqAfmSOtDUOm5whrGdH0"
CLASPRC_PATH = os.path.expanduser("~/.clasprc.json")

def get_access_token():
    if not os.path.exists(CLASPRC_PATH):
        raise FileNotFoundError("Could not find ~/.clasprc.json")
        
    with open(CLASPRC_PATH, "r") as f:
        creds = json.load(f)
        
    tokens = creds.get("tokens", {})
    default_tokens = tokens.get("default", {})
    access_token = default_tokens.get("access_token")
    refresh_token = default_tokens.get("refresh_token")
    client_id = default_tokens.get("client_id")
    client_secret = default_tokens.get("client_secret")
    
    # Try using the access token first
    print("Testing existing access token...")
    test_url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}?fields=properties"
    headers = {"Authorization": f"Bearer {access_token}"}
    res = requests.get(test_url, headers=headers)
    
    if res.status_code == 200:
        print("Existing access token is valid!")
        return access_token
        
    print("Access token expired or invalid, refreshing token...")
    # Refresh token
    token_url = "https://oauth2.googleapis.com/token"
    payload = {
        "client_id": client_id,
        "client_secret": client_secret,
        "refresh_token": refresh_token,
        "grant_type": "refresh_token"
    }
    
    res = requests.post(token_url, json=payload)
    if res.status_code == 200:
        new_tokens = res.json()
        new_access_token = new_tokens.get("access_token")
        print("Token refreshed successfully!")
        
        # Save refreshed token back to ~/.clasprc.json to avoid refreshing next time
        try:
            default_tokens["access_token"] = new_access_token
            creds["tokens"]["default"] = default_tokens
            with open(CLASPRC_PATH, "w") as fw:
                json.dump(creds, fw, indent=2)
        except Exception as e:
            print("Warning: Could not save refreshed token back to ~/.clasprc.json:", e)

            
        return new_access_token
    else:
        raise Exception(f"Failed to refresh token: {res.text}")

def read_sheet(sheet_name, cell_range):
    token = get_access_token()
    url = f"https://sheets.googleapis.com/v4/spreadsheets/{SPREADSHEET_ID}/values/{sheet_name}!{cell_range}"
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(url, headers=headers)
    if res.status_code == 200:
        return res.json().get("values", [])
    else:
        raise Exception(f"Failed to read sheet: {res.text}")

def main():
    try:
        # Read the 'affiliate' sheet rows
        print("Reading affiliate sheet...")
        rows = read_sheet("affiliate", "A3:O100")
        print(f"Successfully read {len(rows)} rows from affiliate sheet.")
        
        # Print all non-empty rows
        for i, row in enumerate(rows):
            if len(row) > 1:
                # Pad row to at least 15 elements
                padded_row = row + [""] * (15 - len(row))
                print(f"Row {i+3}: SKU={padded_row[1]}, Status={padded_row[14]}, Title={padded_row[5]}, Link={padded_row[2]}")
                
    except Exception as e:
        print("Error:", e)

if __name__ == "__main__":
    main()
