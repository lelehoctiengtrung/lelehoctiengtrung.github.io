#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import json
import shutil
import argparse
import glob

# Standard paths
DEFAULT_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "gdrive_config.json")
DEFAULT_CLOUD_STORAGE = "/Users/hanario/Library/CloudStorage"
GDRIECE_SUBPATH = "My Drive/40-Projects/lelehoctiengtrung/Affiliates/Docs"

def get_gdrive_path(config_path):
    """
    Reads the GDrive local path from config or attempts to auto-discover it.
    """
    # 1. Try reading from config file
    if os.path.exists(config_path):
        try:
            with open(config_path, "r", encoding="utf-8") as f:
                config = json.load(f)
                path = config.get("gdrive_local_path")
                if path and os.path.exists(path):
                    return path
        except Exception as e:
            print(f"⚠️ Cảnh báo: Lỗi khi đọc file cấu hình {config_path}: {e}")

    # 2. Auto-discovery on Mac CloudStorage
    print("🔍 Đang tìm kiếm thư mục Google Drive cục bộ...")
    if os.path.exists(DEFAULT_CLOUD_STORAGE):
        # List directories in CloudStorage to find GoogleDrive-accounts
        subdirs = os.listdir(DEFAULT_CLOUD_STORAGE)
        gdrive_dirs = [d for d in subdirs if d.startswith("GoogleDrive-")]
        for gd in gdrive_dirs:
            candidate_path = os.path.join(DEFAULT_CLOUD_STORAGE, gd, GDRIECE_SUBPATH)
            if os.path.exists(candidate_path):
                print(f"✨ Phát hiện thư mục GDrive: {candidate_path}")
                # Save to config file
                try:
                    with open(config_path, "w", encoding="utf-8") as f:
                        json.dump({"gdrive_local_path": candidate_path}, f, indent=2, ensure_ascii=False)
                    print(f"💾 Đã lưu cấu hình vào {config_path}")
                except Exception as e:
                    print(f"⚠️ Không thể lưu cấu hình: {e}")
                return candidate_path

    # 3. Fallback: Prompt user if running interactively
    print("❌ Không tìm thấy thư mục Google Drive tự động.")
    try:
        user_path = input("Vui lòng nhập đường dẫn thư mục Google Drive cục bộ của bạn: ").strip()
        if user_path and os.path.exists(user_path):
            try:
                with open(config_path, "w", encoding="utf-8") as f:
                    json.dump({"gdrive_local_path": user_path}, f, indent=2, ensure_ascii=False)
                print(f"💾 Đã lưu cấu hình vào {config_path}")
            except Exception as e:
                print(f"⚠️ Không thể lưu cấu hình: {e}")
            return user_path
    except (KeyboardInterrupt, EOFError):
        pass

    return None

def sync_sku(sku, src_docs_dir, src_images_dir, dest_root_dir):
    """
    Syncs PDF and mockup images for a specific SKU.
    """
    print(f"\n📦 Bắt đầu đồng bộ cho SKU: {sku}")
    
    # Destination folder for this SKU
    dest_sku_dir = os.path.join(dest_root_dir, sku)
    os.makedirs(dest_sku_dir, exist_ok=True)
    
    # 1. Find and copy PDF
    pdf_filename = f"{sku}.pdf"
    src_pdf_path = os.path.join(src_docs_dir, pdf_filename)
    if os.path.exists(src_pdf_path):
        dest_pdf_path = os.path.join(dest_sku_dir, pdf_filename)
        shutil.copy2(src_pdf_path, dest_pdf_path)
        size_mb = os.path.getsize(dest_pdf_path) / (1024 * 1024)
        print(f"  ✅ Đã copy PDF: {pdf_filename} ({size_mb:.2f} MB)")
    else:
        print(f"  ❌ Không tìm thấy tệp PDF nguồn: {src_pdf_path}")
        return False
        
    # 2. Find and copy mockup/preview images
    # We search for any images starting with {sku} in the images folder
    image_pattern = os.path.join(src_images_dir, f"{sku}*")
    matching_images = glob.glob(image_pattern)
    
    if matching_images:
        copied_images_count = 0
        for img_path in matching_images:
            img_name = os.path.basename(img_path)
            dest_img_path = os.path.join(dest_sku_dir, img_name)
            shutil.copy2(img_path, dest_img_path)
            copied_images_count += 1
        print(f"  ✅ Đã copy {copied_images_count} hình ảnh minh họa / mockup sang GDrive.")
    else:
        print(f"  ⚠️ Cảnh báo: Không tìm thấy hình ảnh minh họa cho {sku} tại {src_images_dir}")
        
    # 3. Print markdown article reference
    md_filename = f"{sku}.md"
    src_md_path = os.path.join(src_docs_dir, md_filename)
    if os.path.exists(src_md_path):
        print(f"  ℹ️ Đã tìm thấy bài viết giới thiệu: {md_filename}")
        
    return True

def main():
    parser = argparse.ArgumentParser(description="Đồng bộ hóa tài liệu PDF và Mockup lên thư mục Google Drive cục bộ.")
    parser.add_argument("--sku", type=str, help="SKU của tài liệu cần đồng bộ (Ví dụ: DOC-500, DOC-GRAMMAR). Nếu để trống sẽ đồng bộ tất cả.")
    parser.add_argument("--config", type=str, default=DEFAULT_CONFIG_PATH, help="Đường dẫn đến file cấu hình JSON.")
    args = parser.parse_args()

    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    src_docs_dir = os.path.join(project_root, "POSTS", "docs")
    src_images_dir = os.path.join(project_root, "POSTS", "images")

    # Resolve GDrive destination path
    dest_root_dir = get_gdrive_path(args.config)
    if not dest_root_dir:
        print("❌ Lỗi: Không xác định được thư mục đích Google Drive. Vui lòng kiểm tra lại cấu hình.")
        sys.exit(1)
        
    print(f"📂 Thư mục đích GDrive: {dest_root_dir}")

    # Determine SKUs to process
    skus_to_process = []
    if args.sku:
        skus_to_process = [args.sku.upper()]
    else:
        # Auto-detect from POSTS/docs/*.pdf
        pdf_pattern = os.path.join(src_docs_dir, "*.pdf")
        pdf_files = glob.glob(pdf_pattern)
        skus_to_process = [os.path.splitext(os.path.basename(f))[0] for f in pdf_files]
        skus_to_process.sort()

    if not skus_to_process:
        print("ℹ️ Không tìm thấy tài liệu nào cần đồng bộ.")
        sys.exit(0)

    success_count = 0
    for sku in skus_to_process:
        if sync_sku(sku, src_docs_dir, src_images_dir, dest_root_dir):
            success_count += 1

    print(f"\n✨ Đồng bộ hoàn tất! Thành công: {success_count}/{len(skus_to_process)} tài liệu.")

if __name__ == "__main__":
    main()
