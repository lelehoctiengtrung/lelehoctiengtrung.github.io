import os
import requests

IMAGES_TO_DOWNLOAD = {
    "SPE-0001_cover.png": "https://down-vn.img.susercontent.com/file/vn-11134258-81ztc-momvh3od1gqq72",
    "SPE-0001_page1.png": "https://down-vn.img.susercontent.com/file/vn-11134208-7ras8-m16hez95n1iy28",
    "SPE-0001_page2.png": "https://down-vn.img.susercontent.com/file/vn-11134208-7ras8-m16hez95n1x77d"
}

def main():
    dest_dir = "POSTS/images"
    os.makedirs(dest_dir, exist_ok=True)
    
    for filename, url in IMAGES_TO_DOWNLOAD.items():
        dest_path = os.path.join(dest_dir, filename)
        print(f"Downloading {url} to {dest_path}...")
        try:
            res = requests.get(url, timeout=30)
            if res.status_code == 200:
                with open(dest_path, "wb") as f:
                    f.write(res.content)
                print(f"Successfully downloaded {filename}")
            else:
                print(f"Failed to download {filename}: HTTP {res.status_code}")
        except Exception as e:
            print(f"Error downloading {filename}: {e}")

if __name__ == "__main__":
    main()
