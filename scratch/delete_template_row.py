import requests

WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5DcT6gcid2UpE3ZK9ImzVHQLI_hZ3HehbjbyoHtsX0QBoXfZz9_PVd9ySW03IGfp1Gw/exec"

def delete_row(doc_id):
    payload = {
        "action": "delete_doc",
        "id": doc_id
    }
    print(f"Deleting row with ID: '{doc_id}'...")
    res = requests.post(WEB_APP_URL, json=payload, timeout=30)
    print(f"Response: {res.text}")

if __name__ == "__main__":
    delete_row("{{ .query.id }}")
