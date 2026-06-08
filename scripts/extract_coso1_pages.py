# -*- coding: utf-8 -*-
import os
import subprocess
import shutil
import platform

html_path = "scripts/generate_coso1_pdf.html"
scratch_dir = "scripts"
os.makedirs(scratch_dir, exist_ok=True)

with open(html_path, "r", encoding="utf-8") as f:
    full_html = f.read()

# Extract head content (including stylesheets)
head_start = full_html.find("<head>")
head_end = full_html.find("</head>") + 7
head_content = full_html[head_start:head_end]

# Modify style in head to remove margins and ensure correct background for capturing
style_override = """
  <style>
    body {
      margin: 0 !important;
      padding: 0 !important;
      background: white !important;
    }
    .cover-page, .page {
      margin: 0 !important;
      box-shadow: none !important;
      page-break-after: avoid !important;
    }
  </style>
"""
head_content = head_content.replace("</head>", style_override + "</head>")

def create_page_html(content, filename):
    page_html = f"""<!DOCTYPE html>
<html lang="vi">
{head_content}
<body>
{content}
</body>
</html>"""
    out_path = os.path.join(scratch_dir, filename)
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(page_html)
    return out_path

# Find page boundaries
cover_start = full_html.find("<!-- PAGE 1: COVER PAGE -->")
intro_start = full_html.find("<!-- PAGE 2: INTRODUCTION -->")
page3_start = full_html.find("<!-- PAGE 3: PINYIN INITIALS -->")
page4_start = full_html.find("<!-- PAGE 4: PINYIN FINALS -->")
page8_start = full_html.find("<!-- PAGE 8: LESSON 1 -->")
page9_start = full_html.find("<!-- PAGE 9: LESSON 2 -->")

# Extract cover page
cover_content = full_html[cover_start:intro_start]
cover_html_file = create_page_html(cover_content, "coso1_cover.html")

# Extract page 3
page3_content = full_html[page3_start:page4_start]
page3_html_file = create_page_html(page3_content, "coso1_page3.html")

# Extract page 8
page8_content = full_html[page8_start:page9_start]
page8_html_file = create_page_html(page8_content, "coso1_page8.html")

print("Created separate HTML files:")
print(f" - Cover: {cover_html_file}")
print(f" - Page 3: {page3_html_file}")
print(f" - Page 8: {page8_html_file}")

# Take screenshots using Chrome Headless
chrome_path = (
    shutil.which("google-chrome") or 
    shutil.which("google-chrome-stable") or 
    shutil.which("chromium-browser") or 
    shutil.which("chromium") or 
    shutil.which("chrome") or 
    ("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" if platform.system() == "Darwin" else "/usr/bin/google-chrome")
)
width, height = 1200, 1697

def take_screenshot(html_file, output_png):
    abs_html = os.path.abspath(html_file)
    abs_png = os.path.abspath(output_png)
    cmd = [
        chrome_path,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--user-data-dir=/tmp/chrome-profile-coso1-extract",
        "--hide-scrollbars",
        f"--window-size={width},{height}",
        f"--screenshot={abs_png}",
        abs_html
    ]
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=15)
        print(f"Successfully generated screenshot: {output_png}")
    except subprocess.TimeoutExpired:
        if os.path.exists(output_png) and os.path.getsize(output_png) > 0:
            print(f"Screenshot generated via timeout: {output_png}")
        else:
            print(f"Timeout expired and screenshot not found for: {html_file}")
    except subprocess.CalledProcessError as e:
        print(f"Error rendering {html_file}: {e}")

output_dir = "POSTS/images"
os.makedirs(output_dir, exist_ok=True)

take_screenshot(cover_html_file, os.path.join(output_dir, "DOC-COSO1_cover_flat.png"))
take_screenshot(page3_html_file, os.path.join(output_dir, "DOC-COSO1_page3_flat.png"))
take_screenshot(page8_html_file, os.path.join(output_dir, "DOC-COSO1_page8_flat.png"))

print("All Hán Ngữ Cơ Sở 1 flat screenshot previews generated!")
