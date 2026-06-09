#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import sys
import json
import re
import argparse
import requests
import subprocess
import shutil

CONFIG_PATH = "/media/vpsg16gb/Workspace/lelehoctiengtrung/n8n_workflows/pipeline_config.json"
REPO_DIR = "/media/vpsg16gb/Workspace/lelehoctiengtrung/Website_lelehoctiengtrung"
WEB_APP_URL = "https://script.google.com/macros/s/AKfycby5DcT6gcid2UpE3ZK9ImzVHQLI_hZ3HehbjbyoHtsX0QBoXfZz9_PVd9ySW03IGfp1Gw/exec"

def load_config():
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            print(f"Error reading config: {e}", file=sys.stderr)
    return {}

def run_cmd(cmd):
    result = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    return result.returncode, result.stdout.strip(), result.stderr.strip()

def create_cover_image(title, category, icon_color, doc_id):
    try:
        from PIL import Image, ImageDraw, ImageFont
        
        # Dimensions: A4 ratio (800x1130)
        w, h = 800, 1130
        
        # Parse icon_color
        bg_color = (13, 31, 20)  # default dark green
        if icon_color and icon_color.startswith('#'):
            try:
                hex_val = icon_color.lstrip('#')
                bg_color = tuple(int(hex_val[i:i+2], 16) for i in (0, 2, 4))
            except Exception:
                pass
                
        img = Image.new("RGB", (w, h), bg_color)
        draw = ImageDraw.Draw(img)
        
        # Fonts
        font_bold_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf"
        font_reg_path = "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf"
        
        if not os.path.exists(font_bold_path):
            font_bold_path = "/System/Library/Fonts/Helvetica.ttc"
            font_reg_path = "/System/Library/Fonts/Helvetica.ttc"
            
        if not os.path.exists(font_bold_path):
            font_title = ImageFont.load_default()
            font_sub = ImageFont.load_default()
            font_footer = ImageFont.load_default()
        else:
            font_title = ImageFont.truetype(font_bold_path, 48)
            font_sub = ImageFont.truetype(font_reg_path, 22)
            font_footer = ImageFont.truetype(font_reg_path, 18)
            
        # Draw borders
        draw.rectangle([30, 30, w-30, h-30], outline=(255, 255, 255), width=3)
        draw.rectangle([38, 38, w-38, h-38], outline=(255, 255, 255), width=1)
        
        # Top Header
        header_text = "L Ê   L Ê   H Ọ C   T I Ế N G   T R U N G"
        draw.text((w/2, 100), header_text, fill=(255, 255, 255), font=font_sub, anchor="mm")
        
        # Divider line
        draw.line([200, 140, w-200, 140], fill=(255, 255, 255), width=1)
        
        # Category label
        cat_text = f"CHUYÊN ĐỀ: {category.upper()}"
        if category.lower() == 'vocab':
            cat_text = "CHUYÊN ĐỀ: TỪ VỰNG TIẾNG TRUNG"
        elif category.lower() == 'grammar':
            cat_text = "CHUYÊN ĐỀ: NGỮ PHÁP TIẾNG TRUNG"
        elif category.lower() == 'infographics':
            cat_text = "CHUYÊN ĐỀ: INFOGRAPHICS"
        elif category.lower() == 'pronunciation':
            cat_text = "CHUYÊN ĐỀ: PHÁT ÂM CHUẨN"
            
        draw.text((w/2, 220), cat_text, fill=(255, 255, 255), font=font_sub, anchor="mm")
        
        # Helper to wrap text
        def wrap_text(text, font, max_width):
            lines = []
            words = text.split()
            if not words:
                return lines
            current_line = words[0]
            for word in words[1:]:
                bbox = draw.textbbox((0, 0), current_line + " " + word, font=font)
                line_w = bbox[2] - bbox[0]
                if line_w <= max_width:
                    current_line += " " + word
                else:
                    lines.append(current_line)
                    current_line = word
            lines.append(current_line)
            return lines

        lines = wrap_text(title, font_title, 640)
        
        y_start = 450 - (len(lines) * 35)
        for i, line in enumerate(lines):
            draw.text((w/2, y_start + i * 70), line, fill=(255, 255, 255), font=font_title, anchor="mm")
            
        y_star = y_start + len(lines) * 70 + 40
        draw.text((w/2, y_star), "◆   ◆   ◆", fill=(255, 255, 255), font=font_sub, anchor="mm")
        
        # SKU ID badge
        draw.text((w/2, h - 200), f"MÃ SỐ: {doc_id}", fill=(255, 255, 255), font=font_sub, anchor="mm")
        
        # Footer
        footer_text = "Học tiếng Trung mỗi ngày cùng Lê Lê • lelehoctiengtrung.github.io"
        draw.text((w/2, h - 100), footer_text, fill=(255, 255, 255), font=font_footer, anchor="mm")
        
        dest_path = os.path.join(REPO_DIR, "POSTS", "images", f"{doc_id}_cover.png")
        os.makedirs(os.path.dirname(dest_path), exist_ok=True)
        img.save(dest_path, "PNG")
        print(f"🎨 Cover image generated: {dest_path}")
        return dest_path
    except Exception as e:
        print(f"Error generating cover image: {e}", file=sys.stderr)
        return None

def create_mockup_image(doc_id):
    try:
        from PIL import Image, ImageFilter, ImageDraw
        
        bg_path = os.path.join(REPO_DIR, "scripts", "oak_desk_background.png")
        cover_path = os.path.join(REPO_DIR, "POSTS", "images", f"{doc_id}_cover.png")
        dest_path = os.path.join(REPO_DIR, "POSTS", "images", f"{doc_id}_mockup.png")
        
        if not os.path.exists(cover_path):
            print(f"Warning: Cover image {cover_path} not found. Cannot create mockup.")
            return None
            
        if not os.path.exists(bg_path):
            print(f"Warning: Background {bg_path} not found. Copying cover as mockup fallback.")
            shutil.copy2(cover_path, dest_path)
            return dest_path
            
        def create_drop_shadow(image_size, offset=(10, 15), blur_radius=20, opacity=120):
            w, h = image_size
            shadow_w = w + blur_radius * 2 + abs(offset[0])
            shadow_h = h + blur_radius * 2 + abs(offset[1])
            shadow = Image.new("RGBA", (shadow_w, shadow_h), (0, 0, 0, 0))
            draw = ImageDraw.Draw(shadow)
            x0 = blur_radius + (offset[0] if offset[0] > 0 else 0)
            y0 = blur_radius + (offset[1] if offset[1] > 0 else 0)
            x1 = x0 + w
            y1 = y0 + h
            draw.rectangle([x0, y0, x1, y1], fill=(0, 0, 0, opacity))
            shadow = shadow.filter(ImageFilter.GaussianBlur(blur_radius))
            return shadow, (x0 - blur_radius, y0 - blur_radius)

        def paste_with_shadow_and_rotate(bg, fg, position, angle=0):
            border_width = 8
            fg_w, fg_h = fg.size
            fg_with_border = Image.new("RGB", (fg_w + border_width * 2, fg_h + border_width * 2), (255, 255, 255))
            fg_with_border.paste(fg, (border_width, border_width))
            
            shadow, shadow_offset = create_drop_shadow(fg_with_border.size, offset=(8, 12), blur_radius=15, opacity=100)
            
            fg_w, fg_h = fg_with_border.size
            shadow_w, shadow_h = shadow.size
            combined = Image.new("RGBA", (shadow_w, shadow_h), (0, 0, 0, 0))
            combined.paste(shadow, (0, 0))
            combined.paste(fg_with_border.convert("RGBA"), (abs(shadow_offset[0]), abs(shadow_offset[1])))
            
            if angle != 0:
                combined = combined.rotate(angle, resample=Image.BICUBIC, expand=True)
                
            bg_w, bg_h = bg.size
            comb_w, comb_h = combined.size
            paste_x = position[0] - comb_w // 2
            paste_y = position[1] - comb_h // 2
            bg.paste(combined, (paste_x, paste_y), combined)
            return bg

        bg = Image.open(bg_path).copy()
        cover = Image.open(cover_path)
        
        # A4 aspect ratio, resize to 410x580
        cover_resized = cover.resize((410, 580), Image.Resampling.LANCZOS)
        
        # Left-Center (x=450, y=512), rotate 2 degrees for organic look
        mockup = paste_with_shadow_and_rotate(bg, cover_resized, (450, 512), angle=2)
        mockup.save(dest_path, "PNG")
        print(f"📸 Mockup image generated: {dest_path}")
        return dest_path
    except Exception as e:
        print(f"Error generating mockup image: {e}", file=sys.stderr)
        return None

def call_llm(prompt, config, json_mode=False):
    use_nine_router = config.get("use_nine_router", False)
    if use_nine_router:
        url = config.get("nine_router_endpoint", "http://127.0.0.1:20128/v1") + "/chat/completions"
        headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + config.get("nine_router_key", "")
        }
        body = {
            "model": config.get("nine_router_model", "coding"),
            "messages": [{"role": "user", "content": prompt}],
            "stream": False
        }
        if json_mode:
            body["response_format"] = {"type": "json_object"}
            
        res = requests.post(url, headers=headers, json=body, timeout=90)
        res_data = res.json()
        content = res_data["choices"][0]["message"]["content"]
        return content
    else:
        # Gemini direct
        api_key = config.get("gemini_api_key", "")
        url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={api_key}"
        headers = {"Content-Type": "application/json"}
        
        body = {
            "contents": [{"parts": [{"text": prompt}]}]
        }
        if json_mode:
            body["generationConfig"] = {"responseMimeType": "application/json"}
            
        res = requests.post(url, headers=headers, json=body, timeout=90)
        res_data = res.json()
        content = res_data["candidates"][0]["content"]["parts"][0]["text"]
        return content

def clean_json_response(content):
    # Remove markdown code block wrapping if LLM returned it
    content = content.strip()
    if content.startswith("```json"):
        content = content[7:]
    elif content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    return content.strip()

def generate_draft(input_args, config):
    prompt = f"""
Bạn là trợ lý AI biên soạn tài liệu học tiếng Trung cho kênh "Lê Lê học tiếng Trung".
Dựa vào ý tưởng, từ khóa hoặc link sau đây: "{input_args}"

Hãy đề xuất các thông tin sơ bộ của tài liệu học (ở định dạng JSON):
1. "title": Tiêu đề cuốn tài liệu bằng tiếng Việt (VD: "500 Từ Vựng Thông Dụng Nhất", "Ngữ Pháp Cơ Bản", "Ẩm thực đường phố Trung Hoa")
2. "desc": Mô tả ngắn gọn (dưới 150 ký tự) giới thiệu tài liệu.
3. "category": Nhóm tài liệu, chọn 1 trong các nhóm sau: "vocab" (từ vựng), "grammar" (ngữ pháp), "infographics" (ảnh/đồ họa), "pronunciation" (phát âm).
4. "id": Mã ID viết hoa, bắt đầu bằng "DOC-", kết hợp từ viết tắt của tiêu đề (VD: "DOC-STREETFOOD", "DOC-GRAMMAR", "DOC-VOCAB-HSK4"). Hãy tạo mã duy nhất và ngắn gọn dựa trên tiêu đề.

Yêu cầu trả về JSON thuần túy, không nằm trong tag markdown.
"""
    response_text = call_llm(prompt, config, json_mode=True)
    cleaned = clean_json_response(response_text)
    return json.loads(cleaned)

def generate_full(doc_id, title, category, input_args, config):
    prompt = f"""
Bạn là Lê Lê - giáo viên dạy tiếng Trung thân thiện và nhiều năng lượng của kênh "Lê Lê học tiếng Trung".
Hãy viết bài giới thiệu chi tiết cho tài liệu mới này:
- SKU/ID: {doc_id}
- Tiêu đề: {title}
- Nhóm: {category}
- Ý tưởng gốc: {input_args}

Nhiệm vụ của bạn là trả về một đối tượng JSON chứa các trường sau (viết bằng tiếng Việt):
1. "content": Nội dung chi tiết bài giới thiệu dưới dạng Markdown. Hãy viết bài viết theo giọng điệu thân thiện của Lê Lê (ví dụ: "Chào các bạn! Lê Lê đây..."). Trong bài viết phải có:
   - Phần giới thiệu tài liệu sinh động và hấp dẫn.
   - Hướng dẫn cấu trúc tài liệu.
   - Phần "Ảnh minh họa bên trong tài liệu" (sử dụng placeholder hình ảnh giống DOC-500).
   - Link download (chừa chỗ cho drive_url).
2. "pros": Liệt kê các điểm nổi bật của tài liệu (ngăn cách bằng dấu gạch đứng "|", ví dụ: "Tổng hợp từ thực tế | Thiết kế sinh động | Dễ in ấn").
3. "cons": Các điểm lưu ý hoặc hạn chế của tài liệu (ngăn cách bằng dấu gạch đứng "|").
4. "who_for": Mô tả đối tượng phù hợp nhất với tài liệu này.
5. "level": Cấp độ khó từ 1 đến 5 (dưới dạng chuỗi số, ví dụ: "2" hoặc "3").
6. "level_text": Mô tả cấp độ (ví dụ: "Cơ bản · HSK 1-2" hoặc "Trung cấp · HSK 2-3").
7. "pages": Số trang dự kiến hoặc mô tả định dạng (ví dụ: "PDF · 12 trang" hoặc "Bộ ảnh · 10 ảnh" nếu nhóm là infographics).
8. "icon": Một emoji phù hợp (ví dụ: "🍜", "🔤", "📝").
9. "icon_color": Một mã màu hex phù hợp với icon (ví dụ: "#E58F65", "#4A90E2").

Yêu cầu trả về JSON thuần túy, không nằm trong tag markdown.
"""
    response_text = call_llm(prompt, config, json_mode=True)
    cleaned = clean_json_response(response_text)
    return json.loads(cleaned)

def main():
    parser = argparse.ArgumentParser(description="AI Docs Generator for Website & Google Sheets")
    parser.add_argument("--draft", action="store_true", help="Generate draft info only")
    parser.add_argument("--input", type=str, required=True, help="Input prompt, URL, or keywords")
    parser.add_argument("--id", type=str, help="Document ID for full generation")
    parser.add_argument("--title", type=str, help="Document Title for full generation")
    parser.add_argument("--category", type=str, help="Document Category for full generation")
    args = parser.parse_args()

    config = load_config()
    
    if args.draft:
        try:
            draft = generate_draft(args.input, config)
            draft["public_url"] = config.get("public_url", "http://100.92.167.111.nip.io:5678")
            print(json.dumps(draft, ensure_ascii=False))
        except Exception as e:
            print(json.dumps({"error": f"Failed to generate draft: {str(e)}"}), file=sys.stderr)
            sys.exit(1)
    else:
        # Full generation
        doc_id = args.id
        title = args.title
        category = args.category
        
        if not doc_id or not title or not category:
            print("Error: --id, --title, and --category are required for full generation", file=sys.stderr)
            sys.exit(1)
            
        try:
            print("🤖 Calling LLM to generate document details...")
            full_data = generate_full(doc_id, title, category, args.input, config)
            
            icon_color = full_data.get("icon_color", "#4ecba0")
            
            # Generate cover and mockup images
            print("🎨 Generating cover and mockup images...")
            create_cover_image(title, category, icon_color, doc_id)
            create_mockup_image(doc_id)
            
            # Sync to Google Sheets via Web App API
            print("📊 Syncing to Google Sheets docs tab...")
            payload = {
                "action": "update_doc",
                "id": doc_id,
                "title": title,
                "desc": full_data.get("desc", f"Tài liệu {title}"),
                "category": category,
                "icon": full_data.get("icon", "📝"),
                "icon_color": icon_color,
                "pages": full_data.get("pages", "PDF"),
                "level": full_data.get("level", "1"),
                "level_text": full_data.get("level_text", "Cơ bản"),
                "content": full_data.get("content", ""),
                "pros": full_data.get("pros", ""),
                "cons": full_data.get("cons", ""),
                "who_for": full_data.get("who_for", ""),
                "preview_images": f"../POSTS/images/{doc_id}_cover.png,../POSTS/images/{doc_id}_mockup.png"
            }
            
            res = requests.post(WEB_APP_URL, json=payload, timeout=30)
            res_data = res.json()
            
            if "error" in res_data:
                raise Exception(f"Google Sheets Web App Error: {res_data['error']}")
                
            folder_url = res_data.get("folder_url", "https://drive.google.com/")
            print(f"📁 Google Drive folder created: {folder_url}")
            
            # Sync drive_url to Google Sheet (using the returned folder_url)
            print("🔗 Syncing drive_url to Google Sheets docs tab...")
            payload_update = {
                "action": "update_doc",
                "id": doc_id,
                "drive_url": folder_url
            }
            requests.post(WEB_APP_URL, json=payload_update, timeout=30)
            
            # Write markdown file
            os.chdir(REPO_DIR)
            md_dir = "POSTS/docs"
            os.makedirs(md_dir, exist_ok=True)
            md_path = os.path.join(md_dir, f"{doc_id}.md")
            
            # Format markdown body
            raw_content = full_data.get("content", "")
            # Replace placeholder drive URL with actual folder URL
            raw_content = re.sub(
                r'\[Tải xuống PDF [^\]]+\]\([^\)]+\)',
                f'[Tải xuống PDF {title}]({folder_url})',
                raw_content
            )
            raw_content = re.sub(
                r'👉 \*\*\[Tải xuống PDF [^\]]+\]\([^\)]+\)\*\*',
                f'👉 **[Tải xuống PDF {title}]({folder_url})**',
                raw_content
            )
            raw_content = raw_content.replace("{{drive_url}}", folder_url)
            raw_content = raw_content.replace("drive_url", folder_url)
            
            md_body = f"""# {title}
**ID/SKU**: {doc_id}
**Phù hợp với**: {full_data.get("who_for", "")}

![Mockup {title}](../images/{doc_id}_mockup.png)

## Giới thiệu tài liệu:
{raw_content}

## Đường dẫn tải tài liệu (Google Drive):
👉 **[Tải xuống PDF {title}]({folder_url})**

## Điểm nổi bật (Pros):
"""
            for pro in full_data.get("pros", "").split("|"):
                pro_s = pro.strip()
                if pro_s:
                    md_body += f"- {pro_s}\n"
                    
            md_body += "\n## Phương pháp học tập (Tips):\n"
            for con in full_data.get("cons", "").split("|"):
                con_s = con.strip()
                if con_s:
                    md_body += f"- {con_s}\n"
            
            with open(md_path, "w", encoding="utf-8") as f:
                f.write(md_body)
            print(f"📝 Markdown file written to {md_path}")
            
            # Commit and push to GitHub Pages
            run_cmd("git config user.name 'n8n-server-auto'")
            run_cmd("git config user.email 'auto-update@lelehoctiengtrung.github.io'")
            
            img_cover_rel = f"POSTS/images/{doc_id}_cover.png"
            img_mockup_rel = f"POSTS/images/{doc_id}_mockup.png"
            run_cmd(f"git add {md_path} {img_cover_rel} {img_mockup_rel}")
            
            code, out, err = run_cmd(f"git commit -m 'feat(docs): auto-generate {doc_id}'")
            if code == 0:
                code_push, out_push, err_push = run_cmd("git push origin main")
                if code_push == 0:
                    print("🚀 Successfully committed and pushed doc and images to GitHub Pages.")
                else:
                    print(f"Git push warning: {err_push}", file=sys.stderr)
            else:
                print(f"Git commit warning: {err}", file=sys.stderr)
                
            # Output result
            print(json.dumps({
                "status": "success",
                "id": doc_id,
                "title": title,
                "folder_url": folder_url,
                "website_url": f"https://lelehoctiengtrung.github.io/doc/doc.html?id={doc_id}"
            }, ensure_ascii=False))
            
        except Exception as e:
            print(json.dumps({"error": f"Failed to generate full doc: {str(e)}"}), file=sys.stderr)
            sys.exit(1)

if __name__ == "__main__":
    main()
