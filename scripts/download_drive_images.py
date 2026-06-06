# -*- coding: utf-8 -*-
import urllib.request
import os
import ssl

# Disable SSL verification warnings if necessary
ssl._create_default_https_context = ssl._create_unverified_context

files = {
    "1kZsUSSXMh99R0D0t7tuu6dVzG8VDnvKn": "POSTS/images/DOC-RADICALS_cover_flat.png",
    "1rGDCK_kqlHzvb1Ur495PR1WddX8ZnsvR": "POSTS/images/DOC-RADICALS_page3_flat.png",
    "1E-CL1WJyB2sfwQEQOWShLKbfQVZy8UO6": "POSTS/images/DOC-RADICALS_page7_flat.png"
}

def main():
    os.makedirs("POSTS/images", exist_ok=True)
    
    for file_id, dest in files.items():
        # Google Drive direct download URL
        url = f"https://drive.google.com/uc?export=download&id={file_id}"
        print(f"Downloading {url} to {dest}...")
        
        try:
            req = urllib.request.Request(
                url, 
                headers={'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}
            )
            with urllib.request.urlopen(req) as response:
                content = response.read()
                # Check if we got an HTML response (which indicates a Google Drive error or virus warning page)
                if b"<!DOCTYPE html>" in content[:200] or b"<html" in content[:200]:
                    print(f"  ⚠️ Warning: Received HTML instead of image binary. The file might require authorization or have a virus warning.")
                    # Let's save it anyway for inspection or try another method
                with open(dest, 'wb') as out_file:
                    out_file.write(content)
            print(f"  ✅ Saved: {dest} ({len(content)} bytes)")
        except Exception as e:
            print(f"  ❌ Error downloading {file_id}: {e}")

if __name__ == "__main__":
    main()
