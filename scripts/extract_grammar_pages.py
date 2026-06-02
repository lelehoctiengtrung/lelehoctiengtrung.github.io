# -*- coding: utf-8 -*-
import os
import subprocess

html_path = "scripts/generate_grammar_pdf.html"
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
page3_start = full_html.find("<!-- PAGE 3: WORD ORDER IN CHINESE -->")
page4_start = full_html.find("<!-- PAGE 4: PARTICLES DE -->")
page10_start = full_html.find("<!-- PAGE 10: COMMON MISTAKES -->")
page10_end = full_html.find("</body>")

# Extract cover page
cover_content = full_html[cover_start:intro_start]
cover_html_file = create_page_html(cover_content, "grammar_cover.html")

# Extract page 3
page3_content = full_html[page3_start:page4_start]
page3_html_file = create_page_html(page3_content, "grammar_page3.html")

# Extract page 10
page10_content = full_html[page10_start:page10_end]
page10_html_file = create_page_html(page10_content, "grammar_page10.html")

print("Created separate Grammar HTML files:")
print(f" - Cover: {cover_html_file}")
print(f" - Page 3: {page3_html_file}")
print(f" - Page 10: {page10_html_file}")

# Take screenshots using Chrome Headless
chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
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

take_screenshot(cover_html_file, os.path.join(output_dir, "DOC-GRAMMAR_cover_flat.png"))
take_screenshot(page3_html_file, os.path.join(output_dir, "DOC-GRAMMAR_page3_flat.png"))
take_screenshot(page10_html_file, os.path.join(output_dir, "DOC-GRAMMAR_page10_flat.png"))

print("All grammar screenshot previews generated!")
