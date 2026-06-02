# -*- coding: utf-8 -*-
import os
import subprocess

html_path = "generate_pdf.html"
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
intro_start = full_html.find("<!-- PAGE 2: INTRODUCTION PAGE -->")
page3_start = full_html.find("<!-- PAGE 3 -->")
page4_start = full_html.find("<!-- PAGE 4 -->")

# Extract cover page
cover_content = full_html[cover_start:intro_start]
cover_html_file = create_page_html(cover_content, "cover.html")

# Extract intro page
intro_content = full_html[intro_start:page3_start]
intro_html_file = create_page_html(intro_content, "intro.html")

# Extract page 3
page3_content = full_html[page3_start:page4_start]
page3_html_file = create_page_html(page3_content, "page3.html")

print("Created separate HTML files:")
print(f" - Cover: {cover_html_file}")
print(f" - Intro: {intro_html_file}")
print(f" - Page 3: {page3_html_file}")

# Take screenshots using Chrome Headless
chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"

# To get high resolution, we will render at a larger window-size and set device scale factor
# A4 aspect ratio is 1:1.4142. If width = 1200, height = 1697.
width, height = 1200, 1697

def take_screenshot(html_file, output_png):
    cmd = [
        chrome_path,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--hide-scrollbars",
        f"--window-size={width},{height}",
        f"--screenshot={output_png}",
        html_file
    ]
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print(f"Successfully generated screenshot: {output_png}")
    except subprocess.CalledProcessError as e:
        print(f"Error rendering {html_file}:")
        print(e.stderr)

output_dir = "POSTS/images"
os.makedirs(output_dir, exist_ok=True)

take_screenshot(cover_html_file, os.path.join(output_dir, "DOC-500_cover.png"))
take_screenshot(intro_html_file, os.path.join(output_dir, "DOC-500_intro.png"))
take_screenshot(page3_html_file, os.path.join(output_dir, "DOC-500_page3.png"))

print("All screenshots generated and saved to POSTS/images/")
