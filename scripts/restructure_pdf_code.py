# -*- coding: utf-8 -*-
import re
import os
from bs4 import BeautifulSoup

def restructure():
    file_path = "scripts/generate_radicals_pdf.py"
    if not os.path.exists(file_path):
        print(f"Error: {file_path} not found")
        return
        
    with open(file_path, "r", encoding="utf-8") as f:
        code_content = f.read()
        
    # Extract html_content string
    pattern = r'html_content\s*=\s*"""(.*?)"""'
    match = re.search(pattern, code_content, re.DOTALL)
    if not match:
        print("Error: html_content string not found in generate_radicals_pdf.py")
        return
        
    html_str = match.group(1)
    
    # Parse HTML using BeautifulSoup
    soup = BeautifulSoup(html_str, "html.parser")
    
    # 1. Update the CSS Stylesheet
    style_tag = soup.find("style")
    if style_tag:
        style_content = style_tag.string
        
        # We will append or replace style definitions
        new_styles = """
    /* Child-friendly bold outline style updates */
    body {
      background: #fdf6ec;
      font-family: 'Comic Neue', 'Fredoka', sans-serif;
    }
    .page {
      width: 210mm;
      height: 297mm;
      box-sizing: border-box;
      padding: 24mm 15mm 20mm 15mm;
      position: relative;
      background: #FFFDF9; /* Warm child-friendly cream background */
      page-break-after: always;
      overflow: hidden;
      border: 8px solid #FFD269; /* Soft golden border */
    }
    
    /* running header & footer border */
    .header {
      border-bottom: 3px dashed #733F2E;
      color: #733F2E;
      font-size: 12px;
      font-weight: 800;
    }
    .footer {
      border-top: 3px dashed #733F2E;
      color: #733F2E;
      font-size: 11px;
      font-weight: 800;
    }
    
    .page-title {
      font-size: 26px;
      color: #733F2E;
      border-bottom: 3.5px dashed #FFD269;
      padding-bottom: 8px;
      margin-top: 6mm;
      margin-bottom: 8mm;
      font-weight: 800;
    }
    
    /* RADICAL LIST LAYOUT (2 radicals per page) */
    .radicals-container {
      display: flex;
      flex-direction: column;
      gap: 12mm;
      margin-top: 4mm;
    }
    
    .radical-row {
      background: #FFF;
      border: 3.5px solid #733F2E !important; /* Thick child-friendly dark outlines */
      border-radius: 24px;
      padding: 20px;
      display: grid;
      grid-template-columns: 104px 1fr;
      gap: 20px;
      position: relative;
      box-shadow: 6px 6px 0px rgba(115, 63, 46, 0.15) !important; /* Offset playful shadow */
      transition: all 0.2s;
    }
    
    /* Colorful backgrounds instead of borders for rows */
    .radical-row:nth-child(4n+1) { background: #FFF2F4; } /* Soft pastel pink */
    .radical-row:nth-child(4n+2) { background: #EBF8F2; } /* Soft pastel green */
    .radical-row:nth-child(4n+3) { background: #EBF5FB; } /* Soft pastel blue */
    .radical-row:nth-child(4n+4) { background: #FFF9E6; } /* Soft pastel yellow */
    
    .radical-left {
      gap: 10px;
    }
    
    /* Traditional Chinese square grid - larger & bolder */
    .hanzi-grid {
      width: 94px;
      height: 94px;
      border: 3px solid #733F2E;
      background-color: #FFFDF6;
      border-radius: 12px;
    }
    .hanzi-grid::before {
      border-left: 1.5px dashed rgba(115, 63, 46, 0.3);
      border-top: 1.5px dashed rgba(115, 63, 46, 0.3);
    }
    .hanzi-grid::after {
      background: 
        linear-gradient(45deg, transparent 49%, rgba(115, 63, 46, 0.2) 49%, rgba(115, 63, 46, 0.2) 51%, transparent 51%),
        linear-gradient(-45deg, transparent 49%, rgba(115, 63, 46, 0.2) 49%, rgba(115, 63, 46, 0.2) 51%, transparent 51%);
    }
    
    .radical-char {
      font-size: 68px;
      color: #733F2E;
    }
    .radical-pinyin {
      font-size: 18px;
      font-weight: 800;
      color: #C94535;
    }
    
    .radical-right {
      gap: 8px;
    }
    .radical-header {
      border-bottom: 2px dashed rgba(115, 63, 46, 0.2);
      padding-bottom: 6px;
    }
    .radical-index {
      font-size: 18px;
      background: #FFD269;
      color: #733F2E;
      border: 2px solid #733F2E;
      width: 28px;
      height: 28px;
    }
    .radical-name {
      font-size: 21px;
      font-weight: 900;
      color: #733F2E;
    }
    
    .stroke-badge {
      font-size: 13px;
      background: #FFF !important;
      color: #733F2E !important;
      border: 2px solid #733F2E;
      padding: 3px 12px;
      border-radius: 99px;
    }
    
    .radical-desc {
      font-size: 15.5px;
      line-height: 1.65;
      color: #5A453A;
      font-weight: 500;
    }
    
    .kids-bubble {
      background: #FFFFFF !important;
      border: 2.5px solid #733F2E !important;
      border-radius: 16px;
      padding: 12px 16px;
      font-size: 15px;
      color: #733F2E !important;
      line-height: 1.6;
      box-shadow: 3px 3px 0px rgba(115, 63, 46, 0.1);
    }
    
    .kids-words-box {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-top: 4px;
    }
    .kid-word-item {
      background: #FFFFFF;
      border: 2.2px solid #733F2E;
      border-radius: 14px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      box-shadow: 2px 2px 0px rgba(115, 63, 46, 0.1);
    }
    .kid-word-item .k-zh {
      font-size: 24px;
      font-weight: 900;
      color: #733F2E;
    }
    .kid-word-item .k-py {
      font-size: 14px;
      font-weight: 800;
      color: #FF8A5B;
    }
    .kid-word-item .k-vi {
      font-size: 13px;
      color: #6D5A50;
      font-weight: 600;
      text-align: center;
    }
    
    /* Make SVG drawings outlined sticker style */
    .radical-visual-box {
      width: 58px;
      height: 58px;
      border: 2.5px solid #733F2E !important;
      border-radius: 14px;
      background: #FFFFFF;
      box-shadow: 3px 3px 0px rgba(115, 63, 46, 0.1);
    }
    .radical-visual-box svg {
      width: 48px;
      height: 48px;
    }
    .radical-visual-box svg path,
    .radical-visual-box svg rect,
    .radical-visual-box svg circle,
    .radical-visual-box svg ellipse,
    .radical-visual-box svg polygon {
      stroke: #733F2E !important;
      stroke-width: 2.2px !important;
    }
    
    /* Intro Page updates */
    .kids-avatar-box {
      background: #FFF0F3;
      border: 3px solid #733F2E;
      border-radius: 20px;
      padding: 18px;
      box-shadow: 4px 4px 0 rgba(115, 63, 46, 0.1);
    }
    .kids-avatar {
      border: 3px solid #733F2E;
      box-shadow: 3px 3px 0 rgba(115, 63, 46, 0.1);
    }
    .kids-avatar-text {
      font-size: 15px;
      color: #5A453A;
      font-weight: 600;
    }
    .intro-grid {
      gap: 20px;
    }
    .intro-card {
      background: #FFFDF9;
      border: 3.5px solid #733F2E !important;
      border-radius: 20px;
      padding: 22px;
      box-shadow: 5px 5px 0 rgba(115, 63, 46, 0.1) !important;
    }
    .intro-card-title {
      font-size: 18px;
      font-weight: 800;
      color: #733F2E !important;
    }
    .intro-card ul {
      font-size: 14.5px;
      line-height: 1.75;
      color: #5A453A;
    }
    
    /* Kid-friendly Infographic styled Cover */
    .cover-page {
      background: linear-gradient(135deg, #FFF0F5, #E6F3FF, #EBF8F2, #FFFDF0); /* Pastel rainbow */
      border: 8px solid #FFD269;
    }
    .cover-decor {
      border: 3.5px dashed #FF7B90;
    }
    .cover-top {
      margin-top: 5mm;
    }
    .cover-badge {
      border: 2.5px solid #733F2E;
      background: #FFF5F6;
      color: #FF5A79;
      font-size: 14px;
      font-weight: 800;
      box-shadow: 3px 3px 0 rgba(115, 63, 46, 0.1);
    }
    .cover-main-title {
      margin-top: 15px;
    }
    .title-small {
      font-family: 'Fredoka', sans-serif;
      font-size: 24px;
      font-weight: 800;
      color: #FFFFFF;
      background: #FF7B90;
      padding: 6px 24px;
      border-radius: 50px;
      display: inline-block;
      border: 3px solid #733F2E;
      box-shadow: 0 6px 12px rgba(115, 63, 46, 0.15);
      text-shadow:
        -1.5px -1.5px 0 #733F2E,
         1.5px -1.5px 0 #733F2E,
        -1.5px  1.5px 0 #733F2E,
         1.5px  1.5px 0 #733F2E;
    }
    .title-large {
      font-family: 'Fredoka', sans-serif;
      font-size: 44px;
      font-weight: 900;
      color: #FFFFFF;
      margin: 15px 0 0 0;
      line-height: 1.25;
      text-shadow:
        -3px -3px 0 #733F2E,
         3px -3px 0 #733F2E,
        -3px  3px 0 #733F2E,
         3px  3px 0 #733F2E,
         0px  6px 10px rgba(115, 63, 46, 0.25);
    }
    .cover-title-zh {
      font-size: 22px;
      color: #FF8A5B;
      margin-top: 12px;
      font-weight: 900;
      text-shadow: 1px 1px 0px #FFF;
    }
    .cover-characters {
      margin: 8mm 0 4mm 0;
    }
    .cover-stamp {
      border: 4px solid #733F2E;
      background: #FF7B90;
      box-shadow: 4px 4px 0px #733F2E;
    }
    .cover-desc {
      font-size: 15.5px;
      color: #5A453A;
      font-weight: 700;
      max-width: 540px;
    }
    .cover-author {
      border: 2.5px solid #733F2E;
      font-size: 15px;
      color: #733F2E;
      background: #FFFFFF;
      font-weight: 800;
      box-shadow: 3px 3px 0px rgba(115, 63, 46, 0.1);
    }
        """
        # Append our new child-friendly styles override
        style_tag.string = style_content + new_styles
        print("CSS styles updated successfully.")
        
    # 2. Extract cover and intro page
    cover_page_div = soup.find("div", class_="cover-page")
    if cover_page_div:
        # Update cover HTML with the new infographic headers
        cover_top_div = cover_page_div.find("div", class_="cover-top")
        if cover_top_div:
            # Let's replace the cover-top HTML
            cover_top_div.clear()
            
            badge = soup.new_tag("div", attrs={"class": "cover-badge"})
            badge.string = "Tài liệu tặng bé 🧸"
            cover_top_div.append(badge)
            
            main_title = soup.new_tag("div", attrs={"class": "cover-main-title"})
            
            title_small = soup.new_tag("div", attrs={"class": "title-small"})
            title_small.string = "Khám Phá Thế Giới Chữ Hán"
            main_title.append(title_small)
            
            title_large = soup.new_tag("h1", attrs={"class": "title-large"})
            title_large.string = "30 Bộ Thủ Quan Trọng Nhất Cho Bé"
            main_title.append(title_large)
            
            cover_top_div.append(main_title)
            
            title_zh = soup.new_tag("h2", attrs={"class": "cover-title-zh", "lang": "zh"})
            title_zh.string = "儿童趣味部首三十"
            cover_top_div.append(title_zh)
            print("Cover HTML structures updated.")
            
    # 3. Extract all radical-row elements
    radical_rows = soup.find_all("div", class_="radical-row")
    print(f"Found {len(radical_rows)} radical rows.")
    
    # 4. We will rebuild the body contents:
    # First, let's keep Cover page (page 1) and Intro page (page 2)
    # We will remove all other pages starting from Page 3
    body = soup.find("body")
    
    # Let's save Cover and Intro
    cover_html = str(soup.find("div", class_="cover-page"))
    
    # Intro page is the first <div class="page">
    pages = soup.find_all("div", class_="page")
    intro_html = str(pages[0]) if pages else ""
    
    # We will build the new pages
    new_pages = []
    
    # Group radicals by 2
    chunk_size = 2
    groups = [radical_rows[i:i + chunk_size] for i in range(0, len(radical_rows), chunk_size)]
    
    total_pages = len(groups) + 2 # 15 pages + 1 cover + 1 intro = 17 pages total
    
    for idx, group in enumerate(groups):
        page_num = idx + 3
        group_num = idx + 1
        
        # Build the page header
        page_div_str = f"""
  <!-- PAGE {page_num}: RADICALS {idx*2+1}-{min((idx+1)*2, 30)} -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm {group_num}</h2>
    
    <div class="radicals-container">
"""
        # Append each radical row in the group
        for row in group:
            page_div_str += str(row) + "\n"
            
        # Append the page footer
        page_div_str += f"""
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
      <div>Trang {page_num} / {total_pages}</div>
    </div>
  </div>
"""
        new_pages.append(page_div_str)
        
    # Reassemble body HTML
    # We need to replace the body contents
    # Intro page has its footer showing "Trang 2 / 12", we should update it to "Trang 2 / 17"
    intro_soup = BeautifulSoup(intro_html, "html.parser")
    intro_footer = intro_soup.find("div", class_="footer")
    if intro_footer:
        # Replace the page number and link in footer
        divs = intro_footer.find_all("div")
        if len(divs) >= 2:
            divs[0].string = "Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS"
            divs[1].string = f"Trang 2 / {total_pages}"
    intro_html_updated = str(intro_soup)
    
    new_body_content = "\n" + cover_html + "\n" + intro_html_updated + "\n" + "\n".join(new_pages) + "\n"
    
    # Replace body content in soup
    body.clear()
    body.append(BeautifulSoup(new_body_content, "html.parser"))
    
    # Serialize the soup back to string
    restructured_html = str(soup)
    
    # Write back to generate_radicals_pdf.py
    # We replace the match block
    new_code_content = code_content.replace(match.group(0), f'html_content = """{restructured_html}"""')
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_code_content)
        
    print(f"Successfully restructured {file_path} into 17 pages (2 radicals per page)!")

if __name__ == "__main__":
    restructure()
