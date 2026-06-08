#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import subprocess
import sys

def main():
    src_dir = "/Users/hanario/.gemini/antigravity/worktrees/Website lelehoctiengtrung/create-documentation-workflow/"
    dest_dir = "/Users/hanario/Library/CloudStorage/GoogleDrive-aleron.dt@gmail.com/My Drive/40-Projects/lelehoctiengtrung/00_App/Website lelehoctiengtrung/"

    print("🔄 Bắt đầu chạy rsync backup Website lelehoctiengtrung lên GDrive...")
    
    if not os.path.exists(src_dir):
        print(f"❌ Lỗi: Thư mục nguồn không tồn tại: {src_dir}")
        sys.exit(1)
        
    os.makedirs(dest_dir, exist_ok=True)
    
    cmd = [
        "rsync", "-av", "--delete",
        "--exclude=.DS_Store",
        "--exclude=._*",
        "--exclude=node_modules/",
        "--exclude=dist/",
        "--exclude=build/",
        src_dir, dest_dir
    ]
    
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, check=True)
        print("✅ Backup hoàn tất thành công!")
        # Print a short summary of the transfer
        for line in result.stdout.splitlines():
            if "sent" in line or "total size" in line:
                print(f"  {line.strip()}")
    except subprocess.CalledProcessError as e:
        print("❌ Lỗi khi thực hiện rsync:")
        print(e.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()
