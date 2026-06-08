# -*- coding: utf-8 -*-
import json
import requests
import base64
import os

WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5DcT6gcid2UpE3ZK9ImzVHQLI_hZ3HehbjbyoHtsX0QBoXfZz9_PVd9ySW03IGfp1Gw/exec"
SKU = "DOC-COSO1"
PDF_PATH = "POSTS/docs/DOC-COSO1.pdf"

def main():
    print(f"--- Uploading PDF for {SKU} via Apps Script ---")
    if not os.path.exists(PDF_PATH):
        print(f"Error: PDF file not found at {PDF_PATH}")
        return
        
    with open(PDF_PATH, "rb") as f:
        pdf_bytes = f.read()
        base64_data = base64.b64encode(pdf_bytes).decode("utf-8")
        
    payload = {
        "action": "upload_image",
        "sku": SKU,
        "type": "file",  # This will go to default folder
        "fileName": "DOC-COSO1.pdf",
        "base64Data": base64_data
    }
    
    try:
        res = requests.post(WEB_APP_URL, json=payload, allow_redirects=True)
        if res.status_code == 200:
            result = res.json()
            if result.get("success"):
                url = result.get("url")
                print(f"Upload successful. Raw URL: {url}")
                
                # Extract file ID
                file_id = url.split("/d/")[-1]
                direct_url = f"https://drive.google.com/file/d/{file_id}/view?usp=sharing"
                download_url = f"https://drive.google.com/uc?export=download&id={file_id}"
                
                print(f"File ID: {file_id}")
                print(f"Direct View Link: {direct_url}")
                print(f"Direct Download Link: {download_url}")
                
                # Update drive_url in Google Sheets to direct download link
                print("\nUpdating drive_url in Google Sheets to direct download link...")
                update_payload = {
                    "action": "update_doc",
                    "id": SKU,
                    "drive_url": direct_url
                }
                update_res = requests.post(WEB_APP_URL, json=update_payload, allow_redirects=True)
                print(f"Sheets Update Response: {update_res.text}")
                
            else:
                print(f"Error from API: {result.get('error')}")
        else:
            print(f"HTTP Error {res.status_code}: {res.text}")
    except Exception as e:
        print(f"Exception during upload: {e}")

if __name__ == "__main__":
    main()
