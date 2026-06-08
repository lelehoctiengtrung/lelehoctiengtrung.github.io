#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import json
import shutil
import argparse
import glob
import base64
import requests

# Standard paths
DEFAULT_CONFIG_PATH = os.path.join(os.path.dirname(__file__), "gdrive_config.json")
DEFAULT_CLOUD_STORAGE = "/Users/hanario/Library/CloudStorage"
GDRIECE_SUBPATH = "My Drive/40-Projects/lelehoctiengtrung/Affiliates/Docs"
WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5DcT6gcid2UpE3ZK9ImzVHQLI_hZ3HehbjbyoHtsX0QBoXfZz9_PVd9ySW03IGfp1Gw/exec"

def upload_via_apps_script(sku, file_path, file_type):
    if not os.path.exists(file_path):
        print(f"  ❌ Không tìm thấy tệp: {file_path}")
        return False
        
    print(f"  📤 Đang tải lên GDrive qua Apps Script: {os.path.basename(file_path)} ({file_type})...")
    
    ext = os.path.splitext(file_path)[1].lower()
    mime_type = "application/octet-stream"
    if ext == ".pdf":
        mime_type = "application/pdf"
    elif ext == ".md":
        mime_type = "text/markdown"
    elif ext in [".png", ".jpg", ".jpeg", ".webp"]:
        mime_type = f"image/{ext[1:]}"
        if ext == ".jpg":
            mime_type = "image/jpeg"
            
    with open(file_path, "rb") as f:
        file_bytes = f.read()
        base64_data = base64.b64encode(file_bytes).decode("utf-8")
        
    payload = {
        "action": "upload_image",
        "sku": sku,
        "type": file_type,
        "fileName": os.path.basename(file_path),
        "base64Data": base64_data,
        "mimeType": mime_type
    }
    
    try:
        res = requests.post(WEB_APP_URL, json=payload, allow_redirects=True)
        if res.status_code == 200:
            result = res.json()
            if result.get("success"):
                print(f"  ✅ Đã tải lên thành công: {result.get('url')}")
                return True
            else:
                print(f"  ❌ Lỗi từ Apps Script: {result.get('error')}")
        else:
            print(f"  ❌ Lỗi HTTP {res.status_code}: {res.text}")
    except Exception as e:
        print(f"  ❌ Lỗi kết nối khi tải lên: {e}")
        
    return False

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
    if not sys.stdin.isatty():
        print("ℹ️ Môi trường không tương tác (non-interactive). Bỏ qua bước nhập đường dẫn.")
        return None

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
    Syncs PDF (for docs), Markdown, and mockup images for a specific SKU.
    """
    is_review = sku.startswith("SPE-") or sku.startswith("SACH-")
    print(f"\n📦 Bắt đầu đồng bộ cho SKU: {sku} ({'Review' if is_review else 'Doc'})")
    
    if dest_root_dir is None:
        # Upload mode via Apps Script (for Linux VPS / headless)
        print("  ⚠️ Không có thư mục Google Drive cục bộ. Chuyển sang chế độ tải lên trực tiếp qua Apps Script...")
        
        # 1. Upload PDF (only for Docs)
        if not is_review:
            pdf_filename = f"{sku}.pdf"
            src_pdf_path = os.path.join(src_docs_dir, pdf_filename)
            if os.path.exists(src_pdf_path):
                upload_via_apps_script(sku, src_pdf_path, 'root')
            else:
                print(f"  ❌ Không tìm thấy tệp PDF nguồn: {src_pdf_path}")
                return False
                
        # 2. Upload markdown article
        md_filename = f"{sku}.md"
        if is_review:
            src_reviews_dir = os.path.join(os.path.dirname(src_docs_dir), "reviews")
            src_md_path = os.path.join(src_reviews_dir, md_filename)
        else:
            src_md_path = os.path.join(src_docs_dir, md_filename)
            
        if os.path.exists(src_md_path):
            upload_via_apps_script(sku, src_md_path, 'root')
        else:
            print(f"  ⚠️ Cảnh báo: Không tìm thấy bài viết nguồn: {src_md_path}")
            
        # 3. Upload images
        image_pattern = os.path.join(src_images_dir, f"{sku}*")
        matching_images = glob.glob(image_pattern)
        if matching_images:
            for img_path in matching_images:
                img_name = os.path.basename(img_path)
                img_type = 'preview'
                if is_review:
                    if '_cover' in img_name.lower():
                        img_type = 'shop'
                    else:
                        img_type = 'review'
                upload_via_apps_script(sku, img_path, img_type)
        else:
            print(f"  ⚠️ Cảnh báo: Không tìm thấy hình ảnh minh họa cho {sku} tại {src_images_dir}")
            
        return True
        
    # Local Folder Copy Mode (for Mac / Windows with GDrive Client)
    # Destination folder for this SKU
    if is_review:
        # dest_root_dir is Affiliates/Docs. Parent is Affiliates.
        affiliates_dir = os.path.dirname(dest_root_dir)
        dest_sku_dir = os.path.join(affiliates_dir, "Reviews", sku)
    else:
        dest_sku_dir = os.path.join(dest_root_dir, sku)
        
    os.makedirs(dest_sku_dir, exist_ok=True)
    
    # 1. Find and copy PDF (only for Docs)
    if not is_review:
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
            
    # 2. Copy markdown article reference
    md_filename = f"{sku}.md"
    if is_review:
        src_reviews_dir = os.path.join(os.path.dirname(src_docs_dir), "reviews")
        src_md_path = os.path.join(src_reviews_dir, md_filename)
    else:
        src_md_path = os.path.join(src_docs_dir, md_filename)
        
    if os.path.exists(src_md_path):
        dest_md_path = os.path.join(dest_sku_dir, md_filename)
        shutil.copy2(src_md_path, dest_md_path)
        print(f"  ✅ Đã copy bài viết giới thiệu: {md_filename}")
    else:
        print(f"  ⚠️ Cảnh báo: Không tìm thấy bài viết nguồn: {src_md_path}")
        
    # 3. Find and copy mockup/preview images
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
        
    return True

def main():
    parser = argparse.ArgumentParser(description="Đồng bộ hóa tài liệu PDF, Markdown và Mockup lên thư mục Google Drive cục bộ hoặc tải trực tiếp qua Apps Script API.")
    parser.add_argument("--sku", type=str, help="SKU của tài liệu cần đồng bộ (Ví dụ: DOC-500, SPE-0001). Nếu để trống sẽ đồng bộ tất cả.")
    parser.add_argument("--config", type=str, default=DEFAULT_CONFIG_PATH, help="Đường dẫn đến file cấu hình JSON.")
    parser.add_argument("--api", action="store_true", help="Bắt buộc sử dụng Apps Script Web App để upload trực tiếp, không dùng thư mục cục bộ.")
    args = parser.parse_args()

    project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    src_docs_dir = os.path.join(project_root, "POSTS", "docs")
    src_images_dir = os.path.join(project_root, "POSTS", "images")

    # Resolve GDrive destination path
    dest_root_dir = None
    if not args.api:
        dest_root_dir = get_gdrive_path(args.config)
        if dest_root_dir:
            print(f"📂 Thư mục đích GDrive cục bộ: {dest_root_dir}")
        else:
            print("⚠️ Không tìm thấy Google Drive cục bộ. Chuyển sang chế độ tải trực tiếp qua Apps Script Web App.")
    else:
        print("🌐 Đã bật cờ --api. Sẽ tải trực tiếp qua Apps Script Web App.")

    # Determine SKUs to process
    skus_to_process = []
    if args.sku:
        skus_to_process = [args.sku.upper()]
    else:
        # Auto-detect docs from POSTS/docs/*.pdf
        pdf_pattern = os.path.join(src_docs_dir, "*.pdf")
        pdf_files = glob.glob(pdf_pattern)
        skus_to_process = [os.path.splitext(os.path.basename(f))[0] for f in pdf_files]
        
        # Auto-detect reviews from POSTS/reviews/*.md
        src_reviews_dir = os.path.join(project_root, "POSTS", "reviews")
        md_pattern = os.path.join(src_reviews_dir, "*.md")
        md_files = glob.glob(md_pattern)
        skus_to_process.extend([os.path.splitext(os.path.basename(f))[0] for f in md_files])
        
        # Deduplicate and sort
        skus_to_process = list(set(skus_to_process))
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
