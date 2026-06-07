# -*- coding: utf-8 -*-
import os
import subprocess

html_path = "scripts/generate_summer_pdf.html"
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
      border: none !important; /* Remove borders for flat preview extraction */
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
page3_start = full_html.find("<!-- PAGE 3: TABLE OF CONTENTS -->")
page4_start = full_html.find("<!-- PAGE 4: WEATHER & SKY VOCAB -->")
page7_start = full_html.find("<!-- PAGE 7: POEM \"BUGS BUGS FLY\" -->")
page8_start = full_html.find("<!-- PAGE 8: BEACH & SEA VOCAB -->")

# Extract cover page
cover_content = full_html[cover_start:intro_start]
cover_html_file = create_page_html(cover_content, "summer_cover.html")

# Extract page 3 (TOC)
page3_content = full_html[page3_start:page4_start]
page3_html_file = create_page_html(page3_content, "summer_page3.html")

# Extract page 7 (Poem)
page7_content = full_html[page7_start:page8_start]
page7_html_file = create_page_html(page7_content, "summer_page7.html")

print("Created separate HTML files:")
print(f" - Cover: {cover_html_file}")
print(f" - Page 3: {page3_html_file}")
print(f" - Page 7: {page7_html_file}")

# Take screenshots using Chrome Headless
chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
width, height = 1200, 1697

def take_screenshot(html_file, output_png):
    abs_html = os.path.abspath(html_file)
    abs_png = os.path.abspath(output_png)
    cmd = [
        chrome_path,
        "--headless",
        "--disable-gpu",
        "--no-sandbox",
        "--user-data-dir=/tmp/chrome-profile-summer-extract",
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

take_screenshot(cover_html_file, os.path.join(output_dir, "DOC-SUMMER_cover.png"))
take_screenshot(page3_html_file, os.path.join(output_dir, "DOC-SUMMER_page3.png"))
take_screenshot(page7_html_file, os.path.join(output_dir, "DOC-SUMMER_page7.png"))

print("All screenshots generated and saved to POSTS/images/")
