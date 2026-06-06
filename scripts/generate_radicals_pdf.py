# -*- coding: utf-8 -*-
import subprocess
import os

scratch_dir = "scripts"
os.makedirs(scratch_dir, exist_ok=True)

html_content = """<!DOCTYPE html>

<html lang="vi">
<head>
<meta charset="utf-8"/>
<title>30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</title>
<link href="https://fonts.googleapis.com" rel="preconnect"/>
<link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&amp;family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&amp;family=Inter:wght@400;500;600;700&amp;family=Noto+Serif+SC:wght@300;400;700;900&amp;display=swap" rel="stylesheet"/>
<style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 0;
      background: #fdf6ec;
      font-family: 'Comic Neue', 'Inter', sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    /* Page frame */
    .page {
      width: 210mm;
      height: 297mm;
      box-sizing: border-box;
      padding: 20mm 15mm 15mm 15mm;
      position: relative;
      background: #FFFDF9; /* Warm child-friendly cream background */
      page-break-after: always;
      overflow: hidden;
    }
    
    /* Running header & footer */
    .header {
      position: absolute;
      top: 8mm;
      left: 15mm;
      right: 15mm;
      height: 8mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px dashed rgba(255, 123, 144, 0.3);
      font-size: 11px;
      color: #927568;
      font-weight: 700;
      letter-spacing: 0.5px;
      z-index: 10;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .header-left .logo-text {
      color: #FF7B90; /* Peach Pink */
      font-family: 'Fredoka', sans-serif;
      font-size: 15px;
      font-weight: 700;
    }
    .header-icon {
      font-size: 13px;
    }
    .footer {
      position: absolute;
      bottom: 8mm;
      left: 15mm;
      right: 15mm;
      height: 8mm;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-top: 2px dashed rgba(255, 123, 144, 0.3);
      font-size: 10px;
      font-weight: 700;
      color: #a78b7e;
      z-index: 10;
    }
    
    /* Page 1: Cover Page (Child-friendly colorful design) */
    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      padding: 24mm 15mm 20mm 15mm;
      height: 297mm;
      box-sizing: border-box;
      background: linear-gradient(135deg, #FFF3E0, #E8F5E9, #E3F2FD, #FFF0F3); /* Pastel rainbow gradient */
      color: #705345;
      position: relative;
      page-break-after: always;
      border: 8px solid #FFD269; /* Soft golden border */
      margin: 0;
      overflow: hidden;
    }
    
    /* Playful double dashed inner border */
    .cover-decor {
      position: absolute;
      top: 5px; left: 5px; right: 5px; bottom: 5px;
      border: 3px dashed #FF7B90; /* Peach pink inner border */
      pointer-events: none;
      z-index: 3;
    }
    
    /* Colorful circles background */
    .cover-shape {
      position: absolute;
      border-radius: 50%;
      opacity: 0.15;
      pointer-events: none;
      z-index: 1;
    }
    .shape-1 { width: 300px; height: 300px; background: #FF7B90; top: -100px; left: -100px; }
    .shape-2 { width: 250px; height: 250px; background: #6EC6FF; bottom: -80px; right: -80px; }
    .shape-3 { width: 150px; height: 150px; background: #6DD6A7; top: 30%; right: -50px; }
    .shape-4 { width: 120px; height: 120px; background: #FFD269; bottom: 30%; left: -40px; }
    
    /* Floating Hanzi characters decorations */
    .cover-hanzi-decor {
      position: absolute;
      font-family: 'Noto Serif SC', serif;
      font-size: 80px;
      color: #FF7B90;
      opacity: 0.08;
      font-weight: 900;
      z-index: 2;
      user-select: none;
    }
    .hz-1 { top: 12%; right: 18%; transform: rotate(15deg); }
    .hz-2 { top: 40%; left: 10%; transform: rotate(-20deg); }
    .hz-3 { bottom: 35%; right: 12%; transform: rotate(10deg); }
    .hz-4 { bottom: 15%; left: 16%; transform: rotate(-15deg); }
    
    .cover-top {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      z-index: 10;
    }
    .cover-badge {
      background: #FFEbee;
      border: 2px solid #FF7B90;
      color: #E91E63;
      padding: 6px 18px;
      border-radius: 999px;
      font-family: 'Fredoka', sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      box-shadow: 0 4px 10px rgba(255, 123, 144, 0.2);
    }
    .cover-title {
      font-family: 'Fredoka', sans-serif;
      font-size: 44px;
      font-weight: 700;
      margin: 10px 0 5px 0;
      line-height: 1.3;
      text-shadow: 2px 2px 0px #FFF, 4px 4px 10px rgba(0,0,0,0.05);
    }
    .cover-title span {
      display: inline-block;
    }
    .cover-title-sub {
      display: inline-block;
      background: #FFFDF9;
      color: #FF5A79;
      padding: 6px 22px;
      border-radius: 50px;
      font-size: 25px;
      margin-top: 10px;
      border: 3px solid #FFD269;
      box-shadow: 0 6px 16px rgba(255, 90, 121, 0.12);
      font-weight: 800;
    }
    .cover-title-zh {
      font-family: 'Noto Serif SC', serif;
      font-size: 23px;
      color: #FF8A5B;
      margin: 12px 0 0 0;
      letter-spacing: 8px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      text-indent: 8px;
    }
    
    /* Cute Cartoon Characters Container */
    .cover-characters {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 30px;
      margin: 5mm 0 2mm 0;
      z-index: 10;
    }
    .character-panda, .character-chick {
      filter: drop-shadow(0 8px 16px rgba(0,0,0,0.06));
    }
    
    /* Floating clouds */
    .cloud {
      position: absolute;
      pointer-events: none;
      z-index: 2;
      filter: drop-shadow(0 4px 8px rgba(0,0,0,0.04));
      opacity: 0.9;
    }
    .cloud-1 {
      top: 14%;
      left: 6%;
    }
    .cloud-2 {
      top: 24%;
      right: 5%;
    }
    
    .cover-mid {
      z-index: 10;
      display: flex;
      align-items: center;
      gap: 30px;
      margin: 3mm 0;
    }
    
    /* Cute rounded child stamp */
    .cover-stamp {
      width: 100px;
      height: 100px;
      background: #FF7B90;
      border: 4px solid #FFFDF9;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      box-shadow: 0 8px 24px rgba(255, 123, 144, 0.3);
      transform: rotate(-5deg);
    }
    .cover-stamp::before {
      content: "";
      position: absolute;
      top: 3px; left: 3px; right: 3px; bottom: 3px;
      border: 2px dashed rgba(255,255,255,0.8);
      border-radius: 50%;
    }
    .cover-stamp::after {
      content: "";
      position: absolute;
      bottom: 8px;
      width: 28px;
      height: 20px;
      background: rgba(255, 255, 255, 0.25);
      border-radius: 50% 50% 40% 40%;
    }
    .cover-stamp .stamp-text {
      font-family: 'Fredoka', sans-serif;
      font-size: 20px;
      font-weight: 700;
      color: #FFFDF9;
      line-height: 1;
      z-index: 5;
    }
    .cover-stamp .stamp-zh {
      font-family: 'Noto Serif SC', serif;
      font-size: 26px;
      font-weight: 900;
      color: #FFFDF9;
      margin-top: 2px;
      z-index: 5;
    }
    .cover-bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      z-index: 10;
    }
    .cover-desc {
      font-size: 15px;
      color: #8C6A5A;
      max-width: 520px;
      line-height: 1.6;
      font-weight: 700;
    }
    .cover-author {
      font-family: 'Fredoka', sans-serif;
      font-size: 15px;
      color: #FF7B90;
      font-weight: 700;
      background: #FFF;
      border: 2px solid #FFD269;
      padding: 6px 20px;
      border-radius: 99px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.02);
    }
    
    /* General Pages Structure */
    .page-title {
      font-family: 'Fredoka', sans-serif;
      font-size: 24px;
      color: #C94535;
      border-bottom: 3px dashed #FFD269;
      padding-bottom: 6px;
      margin-top: 5mm;
      margin-bottom: 6mm;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
    }
    .page-title-icon {
      font-size: 26px;
    }
    
    /* Introduction Page Styles */
    .intro-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 18px;
      margin-top: 6mm;
    }
    .intro-card {
      background: #FFFBF5;
      border: 3px solid #FFF3E0;
      border-radius: 16px;
      padding: 20px;
      box-shadow: 0 4px 15px rgba(255, 123, 144, 0.03);
      position: relative;
    }
    .intro-card.pink {
      border-color: #FFEAEF;
      background: #FFFDFE;
    }
    .intro-card-title {
      font-family: 'Fredoka', sans-serif;
      font-size: 16px;
      font-weight: 700;
      margin-top: 0;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .intro-card-title.pink { color: #FF7B90; }
    .intro-card-title.orange { color: #FF8A5B; }
    
    .intro-card ul {
      margin: 0;
      padding-left: 18px;
      font-size: 13.5px;
      color: #6D5A50;
      line-height: 1.7;
    }
    .intro-card li {
      margin-bottom: 10px;
    }
    .kids-avatar-box {
      display: flex;
      align-items: center;
      gap: 15px;
      background: #FFF0F3;
      border: 2px solid #FFE1E6;
      border-radius: 16px;
      padding: 15px;
      margin-bottom: 6mm;
    }
    .kids-avatar {
      width: 60px;
      height: 60px;
      background: #FF7B90;
      border-radius: 50%;
      border: 3px solid #FFF;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 32px;
      box-shadow: 0 4px 10px rgba(255, 123, 144, 0.2);
    }
    .kids-avatar-text {
      font-size: 13.5px;
      line-height: 1.6;
      color: #6D5A50;
      flex: 1;
    }
    
    /* RADICAL LIST LAYOUT (3 radicals per page) */
    .radicals-container {
      display: flex;
      flex-direction: column;
      gap: 10mm;
      margin-top: 2mm;
    }
    .radical-row {
      background: #FFF;
      border: 3px solid #FFF3E0;
      border-radius: 20px;
      padding: 16px;
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 18px;
      position: relative;
      box-shadow: 0 6px 15px rgba(142, 100, 80, 0.04);
      transition: all 0.2s;
    }
    
    /* Colorful borders for rows */
    .radical-row:nth-child(3n+1) { border-color: #FFE6EB; } /* Pink */
    .radical-row:nth-child(3n+2) { border-color: #E8F5E9; } /* Green */
    .radical-row:nth-child(3n+3) { border-color: #E3F2FD; } /* Blue */
    
    /* Left column: giant Hanzi character & stroke grid */
    .radical-left {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    
    /* Traditional Chinese square grid */
    .hanzi-grid {
      width: 76px;
      height: 76px;
      border: 2px solid #FFD269;
      background-color: #FFFDF6;
      position: relative;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    /* Dashed line inside grid */
    .hanzi-grid::before {
      content: "";
      position: absolute;
      top: 0; bottom: 0; left: 0; right: 0;
      border-left: 1px dashed rgba(255, 210, 105, 0.6);
      border-top: 1px dashed rgba(255, 210, 105, 0.6);
      pointer-events: none;
    }
    .hanzi-grid::after {
      content: "";
      position: absolute;
      top: 0; bottom: 0; left: 0; right: 0;
      background: 
        linear-gradient(45deg, transparent 49.5%, rgba(255, 210, 105, 0.3) 49.5%, rgba(255, 210, 105, 0.3) 50.5%, transparent 50.5%),
        linear-gradient(-45deg, transparent 49.5%, rgba(255, 210, 105, 0.3) 49.5%, rgba(255, 210, 105, 0.3) 50.5%, transparent 50.5%);
      pointer-events: none;
    }
    
    .radical-char {
      font-family: 'Noto Serif SC', serif;
      font-size: 54px;
      font-weight: 700;
      color: #111;
      z-index: 5;
      line-height: 1;
    }
    .radical-pinyin {
      font-family: 'Fredoka', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #C94535;
      line-height: 1;
      margin-top: 2px;
    }
    
    /* Right column: Details, explanation, visual SVG and examples */
    .radical-right {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .radical-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px dashed rgba(142, 100, 80, 0.1);
      padding-bottom: 4px;
    }
    .radical-title-box {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .radical-index {
      font-family: 'Fredoka', sans-serif;
      font-size: 16px;
      font-weight: 700;
      background: #FFD269;
      color: #705345;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .radical-name {
      font-size: 17px;
      font-weight: 700;
      color: #705345;
    }
    .stroke-badge {
      font-family: 'Fredoka', sans-serif;
      font-size: 11px;
      font-weight: 700;
      background: #E8F5E9;
      color: #2E7D32;
      padding: 2px 10px;
      border-radius: 99px;
      display: flex;
      align-items: center;
      gap: 3px;
    }
    .radical-row:nth-child(3n+1) .stroke-badge { background: #FCE4EC; color: #C2185B; }
    .radical-row:nth-child(3n+2) .stroke-badge { background: #E8F5E9; color: #2E7D32; }
    .radical-row:nth-child(3n+3) .stroke-badge { background: #E3F2FD; color: #1565C0; }
    
    /* Layout with explanation on left and visual SVG on right */
    .radical-body-grid {
      display: grid;
      grid-template-columns: 1fr 90px;
      gap: 12px;
      align-items: center;
    }
    .radical-desc {
      font-size: 13px;
      line-height: 1.55;
      color: #6D5A50;
    }
    
    /* Visual representation box */
    .radical-visual-box {
      width: 90px;
      height: 80px;
      background: #FFFDF9;
      border-radius: 12px;
      border: 2px dashed rgba(255, 123, 144, 0.4);
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: inset 0 2px 6px rgba(0,0,0,0.02);
    }
    .radical-row:nth-child(3n+1) .radical-visual-box { border-color: rgba(255, 123, 144, 0.5); }
    .radical-row:nth-child(3n+2) .radical-visual-box { border-color: rgba(109, 214, 167, 0.5); }
    .radical-row:nth-child(3n+3) .radical-visual-box { border-color: rgba(110, 198, 255, 0.5); }
    
    /* Bubble box for Say to kids (Mẹo nhỏ) */
    .kids-bubble {
      background: #FFF8E1;
      border-radius: 12px;
      padding: 8px 12px;
      font-size: 12.5px;
      color: #8D6E63;
      line-height: 1.5;
      margin-top: 2px;
      position: relative;
      border-left: 4px solid #FFB300;
    }
    .radical-row:nth-child(3n+1) .kids-bubble { background: #FFF0F3; border-left-color: #FF7B90; color: #AD1457; }
    .radical-row:nth-child(3n+2) .kids-bubble { background: #E8F8F5; border-left-color: #2ECC71; color: #117864; }
    .radical-row:nth-child(3n+3) .kids-bubble { background: #EBF5FB; border-left-color: #3498DB; color: #1B4F72; }
    
    /* Words block */
    .kids-words-box {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 5px;
    }
    .kid-word-item {
      background: #FAF9F6;
      border: 1px solid #EEE;
      border-radius: 8px;
      padding: 4px 8px;
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12.5px;
    }
    .k-zh {
      font-family: 'Noto Serif SC', serif;
      font-size: 14.5px;
      font-weight: 700;
      color: #333;
    }
    .k-py {
      font-family: 'Fredoka', sans-serif;
      font-size: 11px;
      font-weight: 600;
      color: #FF8A5B;
    }
    .k-vi {
      color: #777;
    }
  
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
        </style>
</head>
<body>
<div class="cover-page">
<div class="cover-decor"></div>
<!-- Fine corner circle decorations -->
<div class="cover-shape shape-1"></div>
<div class="cover-shape shape-2"></div>
<div class="cover-shape shape-3"></div>
<div class="cover-shape shape-4"></div>
<!-- Floating clouds -->
<div class="cloud cloud-1">
<svg height="50" viewbox="0 0 60 40" width="80">
<path d="M10,30 C5,20 15,10 25,12 C30,5 45,5 50,15 C58,15 58,25 50,30 Z" fill="#FFFFFF"></path>
</svg>
</div>
<div class="cloud cloud-2">
<svg height="38" viewbox="0 0 60 40" width="60">
<path d="M10,30 C5,20 15,10 25,12 C30,5 45,5 50,15 C58,15 58,25 50,30 Z" fill="#FFFFFF"></path>
</svg>
</div>
<div class="cover-hanzi-decor hz-1">水</div>
<div class="cover-hanzi-decor hz-2">木</div>
<div class="cover-hanzi-decor hz-3">口</div>
<div class="cover-hanzi-decor hz-4">草</div>
<div class="cover-top"><div class="cover-badge">Tài liệu tặng bé 🧸</div><div class="cover-main-title"><div class="title-small">Khám Phá Thế Giới Chữ Hán</div><h1 class="title-large">30 Bộ Thủ Quan Trọng Nhất Cho Bé</h1></div><h2 class="cover-title-zh" lang="zh">儿童趣味部首三十</h2></div>
<div class="cover-characters">
<div class="character-panda">
<svg height="140" viewbox="0 0 100 100" width="140">
<circle cx="25" cy="25" fill="#2D2D2D" r="14"></circle>
<circle cx="75" cy="25" fill="#2D2D2D" r="14"></circle>
<circle cx="25" cy="25" fill="#FF8A9F" opacity="0.6" r="8"></circle>
<circle cx="75" cy="25" fill="#FF8A9F" opacity="0.6" r="8"></circle>
<circle cx="50" cy="55" fill="#FFFFFF" r="38" stroke="#2D2D2D" stroke-width="3"></circle>
<ellipse cx="36" cy="52" fill="#2D2D2D" rx="11" ry="14" transform="rotate(-10 36 52)"></ellipse>
<ellipse cx="64" cy="52" fill="#2D2D2D" rx="11" ry="14" transform="rotate(10 64 52)"></ellipse>
<circle cx="37" cy="50" fill="#FFFFFF" r="4"></circle>
<circle cx="63" cy="50" fill="#FFFFFF" r="4"></circle>
<circle cx="38" cy="49" fill="#2D2D2D" r="1.5"></circle>
<circle cx="62" cy="49" fill="#2D2D2D" r="1.5"></circle>
<circle cx="22" cy="65" fill="#FF8A9F" opacity="0.8" r="6"></circle>
<circle cx="78" cy="65" fill="#FF8A9F" opacity="0.8" r="6"></circle>
<polygon fill="#2D2D2D" points="46,59 54,59 50,63"></polygon>
<path d="M46,65 Q50,69 54,65" fill="none" stroke="#2D2D2D" stroke-linecap="round" stroke-width="2.5"></path>
</svg>
</div>
<div class="character-chick">
<svg height="130" viewbox="0 0 100 100" width="130">
<circle cx="50" cy="55" fill="#FFEB3B" r="36" stroke="#F57F17" stroke-width="3"></circle>
<circle cx="36" cy="48" fill="#2D2D2D" r="5"></circle>
<circle cx="64" cy="48" fill="#2D2D2D" r="5"></circle>
<circle cx="38" cy="46" fill="#FFFFFF" r="1.5"></circle>
<circle cx="66" cy="46" fill="#FFFFFF" r="1.5"></circle>
<polygon fill="#FF9800" points="45,54 55,54 50,62" stroke="#F57F17" stroke-width="1.5"></polygon>
<circle cx="24" cy="58" fill="#FF8A9F" opacity="0.8" r="5"></circle>
<circle cx="76" cy="58" fill="#FF8A9F" opacity="0.8" r="5"></circle>
<path d="M12,52 Q4,55 12,65" fill="none" stroke="#F57F17" stroke-linecap="round" stroke-width="3"></path>
<path d="M88,52 Q96,55 88,65" fill="none" stroke="#F57F17" stroke-linecap="round" stroke-width="3"></path>
<path d="M50,19 Q46,12 50,8 Q54,12 50,19" fill="#FFEB3B" stroke="#F57F17" stroke-width="2"></path>
</svg>
</div>
</div>
<div class="cover-mid">
<div class="cover-stamp">
<span class="stamp-text">Lê Lê</span>
<span class="stamp-zh">乐</span>
</div>
</div>
<div class="cover-bottom">
<p class="cover-desc">Cẩm nang bộ thủ trực quan bằng sơ đồ hình vẽ ngộ nghĩnh. Dành cho các bé mầm non, tiểu học dễ dàng làm quen chữ Hán qua phương pháp liên tưởng hình ảnh sinh động!</p>
<div class="cover-author">🌸 Lê Lê học tiếng Trung 🌸</div>
</div>
</div>
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🎈</span> Lời Ngỏ &amp; Hướng Dẫn Dành Cho Ba Mẹ</h2>
<div class="kids-avatar-box">
<div class="kids-avatar">🐣</div>
<div class="kids-avatar-text">
<strong>Chào ba mẹ và các bé! Lê Lê đây.</strong> Học chữ tượng hình đối với trẻ nhỏ giống như việc nhìn ngắm những bức tranh nghệ thuật đầy màu sắc. Bản chất chữ Hán được ghép từ các bộ thủ - giống như những mảnh ghép lego. Thay vì bắt con học thuộc lòng nét vẽ khô khan, ba mẹ hãy cùng bé biến việc học thành cuộc phiêu lưu hình ảnh thần kỳ với 30 bộ thủ quen thuộc nhất này nhé!
      </div>
</div>
<div class="intro-grid">
<div class="intro-card pink">
<h3 class="intro-card-title pink">🌟 Bí Quyết Dạy Bé Vui Vẻ</h3>
<ul>
<li><strong>Học qua hình ảnh trước</strong>: Hãy cho bé ngắm nhìn hình minh họa SVG dễ thương bên cạnh bộ thủ để kích thích bán cầu não phải liên tưởng.</li>
<li><strong>Đọc to câu nói mẫu</strong>: Phần bong bóng thoại <em>"Lê Lê mách bé..."</em> được viết với giọng nói ngây thơ để ba mẹ kể cho bé nghe như truyện cổ tích.</li>
<li><strong>Tập tô vẽ vui nhộn</strong>: Khuyến khích bé dùng bút màu khác nhau tô đè lên chữ nét mờ trong ô ly Mễ Tự lớn.</li>
</ul>
</div>
<div class="intro-card">
<h3 class="intro-card-title orange">💡 Hướng Dẫn In Ấn Mỹ Thuật</h3>
<ul>
<li><strong>Nên in màu A4</strong>: Cuốn sách sử dụng bảng màu Pastel dịu mát và hình vẽ sắc nét. Việc in màu sẽ kích thích sự tò mò học tập của bé tốt hơn nhiều.</li>
<li><strong>Sử dụng giấy dày</strong>: Chọn giấy in loại dày (100gsm - 120gsm) để bé thoải mái tô vẽ, dùng bút dạ hoặc bút màu sáp mà không sợ thấm nhòe sang trang sau.</li>
<li><strong>Góc học tập rực rỡ</strong>: Ba mẹ có thể đóng ghim gáy sách hoặc cắt rời từng thẻ bộ thủ để làm Flashcard trò chơi cùng bé!</li>
</ul>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 2 / 17</div>
</div>
</div>
<!-- PAGE 3: RADICALS 1-2 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 1</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #4AA0E6;">氵</span>
</div>
<span class="radical-pinyin">shuǐ</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">1</span>
<span class="radical-name">氵 Bộ Thủy (Nước)</span>
</div>
<span class="stroke-badge">⭐ 3 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ thủ này tượng trưng cho nước, chất lỏng hoặc sự ẩm ướt. Khi nhìn thấy 3 giọt nước ở bên trái một chữ, chữ đó gần như chắc chắn liên quan tới nước đó bé ơi!</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#4AA0E6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" opacity="0.15"></path>
<path d="M12 3v12a3 3 0 0 0 6 0" opacity="0.2"></path>
<path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" fill="#E3F2FD"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            💧 <strong>Lê Lê mách bé:</strong> "Bé ơi, nhìn kìa! Ba giọt nước nhỏ xinh xếp hàng rơi lách tách trên lá non. Nhớ nhé, chữ nào có ba giọt nước này là mát lạnh lắm luôn!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">河</span> <span class="k-py">hé</span> <span class="k-vi">sông 🏞️</span></div>
<div class="kid-word-item"><span class="k-zh">海</span> <span class="k-py">hǎi</span> <span class="k-vi">biển 🌊</span></div>
<div class="kid-word-item"><span class="k-zh">泡</span> <span class="k-py">pào</span> <span class="k-vi">bong bóng 🫧</span></div>
<div class="kid-word-item"><span class="k-zh">泳</span> <span class="k-py">yǒng</span> <span class="k-vi">bơi 🏊</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #4CAF50;">木</span>
</div>
<span class="radical-pinyin">mù</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">2</span>
<span class="radical-name">木 Bộ Mộc (Cây / Gỗ)</span>
</div>
<span class="stroke-badge">⭐ 4 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ thủ này tượng trưng cho cây cối, rừng rậm hoặc những đồ vật làm bằng gỗ xung quanh chúng ta như bàn học, ghế ngồi, cánh cửa...</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#4CAF50" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M12 22V2M12 7l-5 5M12 7l5 5M7 12h10" opacity="0.1"></path>
<path d="M12 2v20M17 12H7M12 12l-6 8M12 12l6 8" stroke-width="2.5"></path>
<path d="M12 2L6 9h12z" fill="#E8F5E9"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            🌳 <strong>Lê Lê mách bé:</strong> "Chữ 木 trông giống hệt một cái cây thông xanh tươi có ngọn thẳng đứng hướng lên trời, hai cành lá dang rộng xum xuê và rễ bám sâu dưới đất đó!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">树</span> <span class="k-py">shù</span> <span class="k-vi">cây xanh 🌳</span></div>
<div class="kid-word-item"><span class="k-zh">林</span> <span class="k-py">lín</span> <span class="k-vi">rừng nhỏ 🌲</span></div>
<div class="kid-word-item"><span class="k-zh">桌</span> <span class="k-py">zhuō</span> <span class="k-vi">cái bàn 🪵</span></div>
<div class="kid-word-item"><span class="k-zh">果</span> <span class="k-py">guǒ</span> <span class="k-vi">trái cây 🍎</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 3 / 17</div>
</div>
</div>
<!-- PAGE 4: RADICALS 3-4 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 2</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #FF8A5B;">口</span>
</div>
<span class="radical-pinyin">kǒu</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">3</span>
<span class="radical-name">口 Bộ Khẩu (Miệng)</span>
</div>
<span class="stroke-badge">⭐ 3 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ thủ này có hình vuông, tượng trưng cho cái miệng. Các chữ liên quan đến ăn uống, nói cười, ca hát hoặc kêu gọi đều sẽ có bộ khẩu.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#FF8A5B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewbox="0 0 24 24" width="46">
<rect fill="#FFE0B2" height="14" rx="2" width="14" x="5" y="5"></rect>
<path d="M9 12s1.5 1.5 3 1.5 3-1.5 3-1.5" stroke="#E64A19"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            👄 <strong>Lê Lê mách bé:</strong> "Một ô vuông nhỏ nhắn xinh xắn y như khuôn miệng há rộng đón chiếc kẹo mút. Bé nói 'Chíp chíp', bé hát líu lo, bé ăn bánh... tất cả đều cần dùng miệng nha!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">吃</span> <span class="k-py">chī</span> <span class="k-vi">ăn ngon 😋</span></div>
<div class="kid-word-item"><span class="k-zh">喝</span> <span class="k-py">hē</span> <span class="k-vi">uống nước 🥤</span></div>
<div class="kid-word-item"><span class="k-zh">唱</span> <span class="k-py">chàng</span> <span class="k-vi">hát ca 🎤</span></div>
<div class="kid-word-item"><span class="k-zh">问</span> <span class="k-py">wèn</span> <span class="k-vi">hỏi han 🙋</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #FF4081;">女</span>
</div>
<span class="radical-pinyin">nǚ</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">4</span>
<span class="radical-name">女 Bộ Nữ (Phụ nữ / Bé gái)</span>
</div>
<span class="stroke-badge">⭐ 3 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ thủ này đại diện cho phái nữ, phụ nữ hoặc bé gái. Nó hay xuất hiện trong các danh từ gọi thành viên nữ trong gia đình như mẹ, chị, em gái.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#FF4081" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<circle cx="12" cy="7" fill="#FCE4EC" r="4"></circle>
<path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"></path>
<path d="M12 11v4" stroke-dasharray="2 2"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            👩 <strong>Lê Lê mách bé:</strong> "Bé có thấy dáng một người phụ nữ đang uyển chuyển múa lượn không? Chữ này đại diện cho Mẹ yêu 妈, cho chị gái 姐 và em gái đáng yêu 妹 của bé đó!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">妈</span> <span class="k-py">mā</span> <span class="k-vi">mẹ yêu 👩‍🍼</span></div>
<div class="kid-word-item"><span class="k-zh">姐</span> <span class="k-py">jiě</span> <span class="k-vi">chị gái 👩</span></div>
<div class="kid-word-item"><span class="k-zh">妹</span> <span class="k-py">mèi</span> <span class="k-vi">em gái 👧</span></div>
<div class="kid-word-item"><span class="k-zh">好</span> <span class="k-py">hǎo</span> <span class="k-vi">tốt/ngoan 👍</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 4 / 17</div>
</div>
</div>
<!-- PAGE 5: RADICALS 5-6 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 3</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #FFA000;">日</span>
</div>
<span class="radical-pinyin">rì</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">5</span>
<span class="radical-name">日 Bộ Nhật (Mặt trời / Ngày)</span>
</div>
<span class="stroke-badge">⭐ 4 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ thủ này tượng trưng cho mặt trời, ánh sáng hoặc thời gian ngày tháng. Hầu hết các từ chỉ thời gian hay thời tiết nắng ấm đều có ông mặt trời.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#FFA000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<circle cx="12" cy="12" fill="#FFF9C4" r="5"></circle>
<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            ☀️ <strong>Lê Lê mách bé:</strong> "Ông mặt trời ngày xưa là một hình tròn có một dấu chấm đỏ ở giữa. Giờ ông ấy biến thành hình chữ nhật thon thả có tia nắng ấm chia đôi ấm áp này nè!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">明</span> <span class="k-py">míng</span> <span class="k-vi">sáng sủa 🔆</span></div>
<div class="kid-word-item"><span class="k-zh">早</span> <span class="k-py">zǎo</span> <span class="k-vi">buổi sáng 🌅</span></div>
<div class="kid-word-item"><span class="k-zh">星</span> <span class="k-py">xīng</span> <span class="k-vi">ngôi sao ⭐</span></div>
<div class="kid-word-item"><span class="k-zh">昨</span> <span class="k-py">zuó</span> <span class="k-vi">hôm qua 📅</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #3F51B5;">亻</span>
</div>
<span class="radical-pinyin">rén</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">6</span>
<span class="radical-name">亻 Bộ Nhân (Người)</span>
</div>
<span class="stroke-badge">⭐ 2 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ nhân đứng (亻) biểu thị hình ảnh con người hoặc các hoạt động, danh xưng của con người. Các đại từ nhân xưng như bạn, họ đều có bộ thủ này.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#3F51B5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" opacity="0.1"></path>
<circle cx="9" cy="7" opacity="0.1" r="4"></circle>
<path d="M12 4l-4 6m4-6v16" stroke-width="2.5"></path>
<path d="M12 10l5 10" stroke-width="2.5"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            🚶‍♂️ <strong>Lê Lê mách bé:</strong> "Một nét phẩy nghiêng và một nét thẳng đứng đứng cạnh nhau giống hệt một em bé đang nghiêng người tiến về phía trước chạy nhảy chơi đùa đó!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">你</span> <span class="k-py">nǐ</span> <span class="k-vi">bạn/bé 🧑</span></div>
<div class="kid-word-item"><span class="k-zh">他</span> <span class="k-py">tā</span> <span class="k-vi">anh ấy 👦</span></div>
<div class="kid-word-item"><span class="k-zh">住</span> <span class="k-py">zhù</span> <span class="k-vi">sinh sống 🏠</span></div>
<div class="kid-word-item"><span class="k-zh">做</span> <span class="k-py">zuò</span> <span class="k-vi">làm việc 🔨</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 5 / 17</div>
</div>
</div>
<!-- PAGE 6: RADICALS 7-8 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 4</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #FF5722;">扌</span>
</div>
<span class="radical-pinyin">shǒu</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">7</span>
<span class="radical-name">扌 Bộ Thủ (Tay)</span>
</div>
<span class="stroke-badge">⭐ 3 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ gẩy tay (扌) biểu thị các hành động thực hiện bằng đôi tay như đánh bóng, cầm lấy, đẩy, kéo, vỗ vai, ôm ấp bạn bè.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#FF5722" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v5" fill="#FFE0B2"></path>
<path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"></path>
<path d="M10 10V5a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v6"></path>
<path d="M6 13V9a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v9a6 6 0 0 0 6 6h4a6 6 0 0 0 6-6V11"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            👋 <strong>Lê Lê mách bé:</strong> "Cánh tay thon thon với bàn tay xòe ra xoa đầu bé. Mỗi lần bé chơi trò ném bóng 打 hoặc giơ tay chào ai đó, bộ thủ này sẽ hiện ra trợ giúp bé đó!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">打</span> <span class="k-py">dǎ</span> <span class="k-vi">đánh/chơi 🎾</span></div>
<div class="kid-word-item"><span class="k-zh">拿</span> <span class="k-py">ná</span> <span class="k-vi">cầm lấy 🫴</span></div>
<div class="kid-word-item"><span class="k-zh">找</span> <span class="k-py">zhǎo</span> <span class="k-vi">tìm kiếm 🔍</span></div>
<div class="kid-word-item"><span class="k-zh">抱</span> <span class="k-py">bào</span> <span class="k-vi">ôm ấp 🤗</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #9C27B0;">忄</span>
</div>
<span class="radical-pinyin">xīn</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">8</span>
<span class="radical-name">忄 Bộ Tâm (Tâm trạng / Cảm xúc)</span>
</div>
<span class="stroke-badge">⭐ 3 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ tâm đứng (忄) là dạng thu nhỏ của quả tim, liên quan đến suy nghĩ, tình cảm, nỗi sợ hoặc trạng thái bận rộn trong tâm trí.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#9C27B0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="#F3E5F5"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            ❤️ <strong>Lê Lê mách bé:</strong> "Một nét vạch dài ở giữa như chiếc cầu nối hai giọt nước cảm xúc. Khi bé thấy sợ hãi 怕 hay bận rộn chạy nhảy 忙, tim bé sẽ đập thình thịch và bộ này xuất hiện."
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">怕</span> <span class="k-py">pà</span> <span class="k-vi">sợ hãi 😨</span></div>
<div class="kid-word-item"><span class="k-zh">忙</span> <span class="k-py">máng</span> <span class="k-vi">bận rộn 🏃</span></div>
<div class="kid-word-item"><span class="k-zh">情</span> <span class="k-py">qíng</span> <span class="k-vi">tình cảm 💞</span></div>
<div class="kid-word-item"><span class="k-zh">忆</span> <span class="k-py">yì</span> <span class="k-vi">kỷ niệm 💭</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 6 / 17</div>
</div>
</div>
<!-- PAGE 7: RADICALS 9-10 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 5</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #E64A19;">灬</span>
</div>
<span class="radical-pinyin">huǒ</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">9</span>
<span class="radical-name">灬 Bộ Hỏa (Lửa / Nhiệt độ)</span>
</div>
<span class="stroke-badge">⭐ 4 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ hỏa nằm (灬) gồm 4 chấm dưới chân chữ, tượng trưng cho những ngọn lửa bùng cháy, nhiệt độ nóng ấm hoặc hoạt động nấu ăn, chiên xào.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#E64A19" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2z" fill="#FFCCBC"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            🔥 <strong>Lê Lê mách bé:</strong> "Bốn đốm lửa nhỏ nhảy múa tanh tách dưới đáy nồi súp đang sôi sùng sục. Bé sờ bát canh nóng 热 hay ngửi mùi thịt nướng 烤 thơm phức là nhờ bốn đốm lửa này đó!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">热</span> <span class="k-py">rè</span> <span class="k-vi">nóng nực 🥵</span></div>
<div class="kid-word-item"><span class="k-zh">烤</span> <span class="k-py">kǎo</span> <span class="k-vi">nướng thịt 🍖</span></div>
<div class="kid-word-item"><span class="k-zh">煮</span> <span class="k-py">zhǔ</span> <span class="k-vi">luộc/nấu 🍲</span></div>
<div class="kid-word-item"><span class="k-zh">烧</span> <span class="k-py">shāo</span> <span class="k-vi">đốt/thiêu 🔥</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #4CAF50;">艹</span>
</div>
<span class="radical-pinyin">cǎo</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">10</span>
<span class="radical-name">艹 Bộ Thảo (Cỏ / Thực vật)</span>
</div>
<span class="stroke-badge">⭐ 3 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ thảo (艹) nằm trên đỉnh chữ giống như hai mầm cây non nhỏ xinh đang vươn lên. Chữ chứa bộ này đều chỉ hoa cỏ, trà xanh, thuốc hay trái cây.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#4CAF50" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M12 2v20" opacity="0.1"></path>
<path d="M2 12s5-3 10-3 10 3 10 3" stroke-width="1.5"></path>
<path d="M7 6c0 3 2 6 5 6s5-3 5-6"></path>
<circle cx="12" cy="18" fill="#A5D6A7" r="3"></circle>
</svg>
</div>
</div>
<div class="kids-bubble">
            🌱 <strong>Lê Lê mách bé:</strong> "Bé ơi, xem chiếc mũ lá mầm nhỏ xinh đội trên đầu các loài hoa xinh đẹp 花, ngọn cỏ non 草 hay quả táo 苹果 ngọt giòn kìa. Đáng yêu quá phải không!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">花</span> <span class="k-py">huā</span> <span class="k-vi">bông hoa 🌸</span></div>
<div class="kid-word-item"><span class="k-zh">草</span> <span class="k-py">cǎo</span> <span class="k-vi">ngọn cỏ 🌱</span></div>
<div class="kid-word-item"><span class="k-zh">茶</span> <span class="k-py">chá</span> <span class="k-vi">trà ngon 🍵</span></div>
<div class="kid-word-item"><span class="k-zh">菜</span> <span class="k-py">cài</span> <span class="k-vi">rau củ 🥦</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 7 / 17</div>
</div>
</div>
<!-- PAGE 8: RADICALS 11-12 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 6</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #00BCD4;">冫</span>
</div>
<span class="radical-pinyin">bīng</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">11</span>
<span class="radical-name">冫 Bộ Băng (Băng giá / Lạnh lẽo)</span>
</div>
<span class="stroke-badge">⭐ 2 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ băng (冫) gồm 2 nét phẩy bên trái đại diện cho đá lạnh hoặc nhiệt độ thấp buốt giá. Nó ít hơn bộ nước (氵) một chấm nhé.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#00BCD4" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" opacity="0.1"></path>
<rect fill="#E0F7FA" height="12" rx="2" width="12" x="6" y="6"></rect>
</svg>
</div>
</div>
<div class="kids-bubble">
            ❄️ <strong>Lê Lê mách bé:</strong> "Bé ơi phân biệt nha: Water (nước) có 3 chấm lỏng chảy, còn Ice (băng đá) thì đông cứng lại nên rụng mất một giọt, chỉ còn lại 2 giọt đóng băng thui!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">冷</span> <span class="k-py">lěng</span> <span class="k-vi">lạnh buốt 🥶</span></div>
<div class="kid-word-item"><span class="k-zh">冰</span> <span class="k-py">bīng</span> <span class="k-vi">đá lạnh 🧊</span></div>
<div class="kid-word-item"><span class="k-zh">冻</span> <span class="k-py">dòng</span> <span class="k-vi">đông cứng ❄️</span></div>
<div class="kid-word-item"><span class="k-zh">凉</span> <span class="k-py">liáng</span> <span class="k-vi">mát mẻ 🍃</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #673AB7;">讠</span>
</div>
<span class="radical-pinyin">yán</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">12</span>
<span class="radical-name">讠 Bộ Ngôn (Ngôn ngữ / Lời nói)</span>
</div>
<span class="stroke-badge">⭐ 2 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ ngôn (讠) biểu thị các từ chỉ lời nói, đối thoại, đọc sách, ngoại ngữ, ngôn từ hoặc hành động giao tiếp trao đổi.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#673AB7" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#EDE7F6"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            💬 <strong>Lê Lê mách bé:</strong> "Một dấu chấm nhỏ bên trên và nét móc cong phía dưới giống như chiếc loa phát thanh phát ra sóng âm thanh khi bé tập nói 说 hay nói lời cảm ơn 谢 ai đó."
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">说</span> <span class="k-py">shuō</span> <span class="k-vi">nói chuyện 💬</span></div>
<div class="kid-word-item"><span class="k-zh">请</span> <span class="k-py">qǐng</span> <span class="k-vi">mời/xin 🤝</span></div>
<div class="kid-word-item"><span class="k-zh">谢</span> <span class="k-py">xiè</span> <span class="k-vi">cảm ơn 🙏</span></div>
<div class="kid-word-item"><span class="k-zh">读</span> <span class="k-py">dú</span> <span class="k-vi">đọc sách 📖</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 8 / 17</div>
</div>
</div>
<!-- PAGE 9: RADICALS 13-14 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 7</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #795548;">犭</span>
</div>
<span class="radical-pinyin">quǎn</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">13</span>
<span class="radical-name">犭 Bộ Khuyển (Chó / Động vật)</span>
</div>
<span class="stroke-badge">⭐ 3 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ khuyển đứng (犭) là hình ảnh cách điệu của con chó đứng canh gác. Bộ này dùng cho các từ chỉ thú bốn chân có vú như chó, mèo, heo, sư tử,...</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#795548" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<circle cx="12" cy="5" fill="#D7CCC8" r="3"></circle>
<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4z" opacity="0.1"></path>
<path d="M12 8v14M9 15l-3 7M15 15l3 7" stroke-width="2"></path>
<path d="M6 8h12"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            🐾 <strong>Lê Lê mách bé:</strong> "Bé có thấy nét ngoắc giống như chú cún nhỏ đang vẫy chiếc đuôi mừng chủ không? Hầu hết các con thú bốn chân đáng yêu đều có chiếc đuôi xinh này đứng canh đó!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">狗</span> <span class="k-py">gǒu</span> <span class="k-vi">chú chó 🐶</span></div>
<div class="kid-word-item"><span class="k-zh">猫</span> <span class="k-py">māo</span> <span class="k-vi">chú mèo 🐱</span></div>
<div class="kid-word-item"><span class="k-zh">猪</span> <span class="k-py">zhū</span> <span class="k-vi">con heo 🐷</span></div>
<div class="kid-word-item"><span class="k-zh">狮</span> <span class="k-py">shī</span> <span class="k-vi">sư tử 🦁</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #90A4AE;">月</span>
</div>
<span class="radical-pinyin">yuè</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">14</span>
<span class="radical-name">月 Bộ Nguyệt (Trăng / Cơ thể)</span>
</div>
<span class="stroke-badge">⭐ 4 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ nguyệt (月) có hai nghĩa: vừa là mặt trăng tỏa sáng vừa là phần da thịt cơ thể (biến thể từ chữ 肉). Hầu hết các bộ phận cơ thể đều dùng bộ này.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#90A4AE" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M12 3a9 9 0 0 0 9 9 9 9 0 1 1-9-9Z" fill="#ECEFF1"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            🌙 <strong>Lê Lê mách bé:</strong> "Ông trăng lưỡi liềm treo lơ lửng trên trời đêm có hai đám mây che ngang. Khi đứng một mình là Mặt Trăng, khi đi ghép chữ nó chỉ các bộ phận cơ thể như khuôn mặt 脸 hay đôi chân 脚."
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">脸</span> <span class="k-py">liǎn</span> <span class="k-vi">khuôn mặt 😊</span></div>
<div class="kid-word-item"><span class="k-zh">脚</span> <span class="k-py">jiǎo</span> <span class="k-vi">bàn chân 👣</span></div>
<div class="kid-word-item"><span class="k-zh">胖</span> <span class="k-py">pàng</span> <span class="k-vi">mũm mĩm 🧸</span></div>
<div class="kid-word-item"><span class="k-zh">脖</span> <span class="k-py">bó</span> <span class="k-vi">cái cổ 🦒</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 9 / 17</div>
</div>
</div>
<!-- PAGE 10: RADICALS 15-16 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 8</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #FF9800;">饣</span>
</div>
<span class="radical-pinyin">shí</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">15</span>
<span class="radical-name">饣 Bộ Thực (Thức ăn / Ăn uống)</span>
</div>
<span class="stroke-badge">⭐ 3 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ thực đứng (饣) biểu thị thức ăn, các món bánh, bữa cơm gia đình hoặc cảm xúc đói bụng, no nê sau khi ăn uống xong.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#FF9800" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<circle cx="12" cy="12" opacity="0.1" r="9"></circle>
<path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" opacity="0.05"></path>
<path d="M6 8h12M12 3v10M12 13l-4 8M12 13l4 8" opacity="0.15"></path>
<path d="M3 3h18v18H3z" opacity="0.05"></path>
<path d="M12 2a3 3 0 0 0-3 3v11l3 4 3-4V5a3 3 0 0 0-3-3z" fill="#FFE0B2"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            🍚 <strong>Lê Lê mách bé:</strong> "Một giỏ đồ ăn đầy ắp thơm lừng bày trên đĩa ăn. Mỗi khi bé cảm thấy đói bụng 饿 hay muốn ăn một bát cơm trắng 饭 ấm áp, hãy nhớ tới chiếc giỏ ngon lành này nhé!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">饭</span> <span class="k-py">fàn</span> <span class="k-vi">bữa cơm 🍚</span></div>
<div class="kid-word-item"><span class="k-zh">饿</span> <span class="k-py">è</span> <span class="k-vi">đói bụng 🤤</span></div>
<div class="kid-word-item"><span class="k-zh">饱</span> <span class="k-py">bǎo</span> <span class="k-vi">no nê 🤰</span></div>
<div class="kid-word-item"><span class="k-zh">饼</span> <span class="k-py">bǐng</span> <span class="k-vi">bánh ngọt 🍪</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #64B5F6;">雨</span>
</div>
<span class="radical-pinyin">yǔ</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">16</span>
<span class="radical-name">雨 Bộ Vũ (Mưa / Thời tiết)</span>
</div>
<span class="stroke-badge">⭐ 8 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ vũ (雨) nằm trên đỉnh chữ giống như đám mây xám tích nước, đại diện cho các hiện tượng thời tiết như mưa rơi, tuyết trắng, sấm chớp.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#64B5F6" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25" fill="#E3F2FD"></path>
<line x1="8" x2="8" y1="20" y2="22"></line>
<line x1="12" x2="12" y1="20" y2="22"></line>
<line x1="16" x2="16" y1="20" y2="22"></line>
</svg>
</div>
</div>
<div class="kids-bubble">
            🌧️ <strong>Lê Lê mách bé:</strong> "Nhìn kìa! Có bốn giọt nước nhỏ xinh rơi xuống từ mái nhà. Ông trời đang làm mưa, làm tuyết 雪 rơi phủ trắng xóa các cành cây kìa bé ơi!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">雪</span> <span class="k-py">xuě</span> <span class="k-vi">tuyết trắng ❄️</span></div>
<div class="kid-word-item"><span class="k-zh">雷</span> <span class="k-py">léi</span> <span class="k-vi">sấm sét ⚡</span></div>
<div class="kid-word-item"><span class="k-zh">雾</span> <span class="k-py">wù</span> <span class="k-vi">sương mù 🌫️</span></div>
<div class="kid-word-item"><span class="k-zh">露</span> <span class="k-py">lù</span> <span class="k-vi">giọt sương 💧</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 10 / 17</div>
</div>
</div>
<!-- PAGE 11: RADICALS 17-18 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 9</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #4CAF50;">⻊</span>
</div>
<span class="radical-pinyin">zú</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">17</span>
<span class="radical-name">⻊Bộ Túc (Chân / Chạy nhảy)</span>
</div>
<span class="stroke-badge">⭐ 7 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ túc đứng (⻊) biểu thị bàn chân, cẳng chân hoặc các động tác đòi hỏi vận động chân như chạy, nhảy cao, đá bóng, giẫm lên đất.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#4CAF50" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M3 22V2h18v20z" opacity="0.02"></path>
<path d="M5 3h10a4 4 0 0 1 4 4v0a4 4 0 0 1-4 4H5z" fill="#E8F5E9"></path>
<path d="M5 11v8a3 3 0 0 0 3 3h4"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            👟 <strong>Lê Lê mách bé:</strong> "Một cái đùi khỏe khoắn nối với bàn chân đang mang giày thể thao. Cùng Lê Lê nhảy lò cò 跳 hay chạy bộ 跑 thi xem ai nhanh nhất nào!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">跑</span> <span class="k-py">pǎo</span> <span class="k-vi">chạy nhanh 🏃‍♂️</span></div>
<div class="kid-word-item"><span class="k-zh">跳</span> <span class="k-py">tiào</span> <span class="k-vi">nhảy dây 🦘</span></div>
<div class="kid-word-item"><span class="k-zh">踢</span> <span class="k-py">tī</span> <span class="k-vi">đá bóng ⚽</span></div>
<div class="kid-word-item"><span class="k-zh">路</span> <span class="k-py">lù</span> <span class="k-vi">con đường 🛣️</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #9C27B0;">衤</span>
</div>
<span class="radical-pinyin">yī</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">18</span>
<span class="radical-name">衤 Bộ Y (Quần áo / Vải vóc)</span>
</div>
<span class="stroke-badge">⭐ 5 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ y (衤) gồm 5 nét ở bên trái chỉ vải vóc, quần áo hoặc chăn gối giường nệm. Bé mặc áo hay đắp chăn ấm đều có bộ này.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#9C27B0" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M20.38 3.46L16 2.14a1 1 0 0 0-1 .14L12 5l-3-2.72a1 1 0 0 0-1-.14L3.62 3.46a1 1 0 0 0-.62.92v6a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-6a1 1 0 0 0-.62-.92z" fill="#F3E5F5"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            👕 <strong>Lê Lê mách bé:</strong> "Đây là một chiếc áo khoác phao ấm áp có cổ áo bẻ nghiêng. Khi đi ngủ nhớ đắp chăn/mền 被 ấm áp và mặc quần dài 裤 bảo vệ sức khỏe nhé!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">裤</span> <span class="k-py">kù</span> <span class="k-vi">cái quần 👖</span></div>
<div class="kid-word-item"><span class="k-zh">裙</span> <span class="k-py">qún</span> <span class="k-vi">váy xòe 👗</span></div>
<div class="kid-word-item"><span class="k-zh">袜</span> <span class="k-py">wà</span> <span class="k-vi">đôi tất 🧦</span></div>
<div class="kid-word-item"><span class="k-zh">被</span> <span class="k-py">bèi</span> <span class="k-vi">cái chăn 🛌</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 11 / 17</div>
</div>
</div>
<!-- PAGE 12: RADICALS 19-20 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 10</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #FF5252;">心</span>
</div>
<span class="radical-pinyin">xīn</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">19</span>
<span class="radical-name">心 Bộ Tâm (Trái tim / Suy tư)</span>
</div>
<span class="stroke-badge">⭐ 4 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ tâm nằm (心) thường nằm ở dưới đáy chữ giống như bệ đỡ nâng niu mọi suy nghĩ, nhớ nhung hay cảm xúc lắng đọng từ con tim.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#FF5252" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#FFEBEE"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            ❤️ <strong>Lê Lê mách bé:</strong> "Một thung lũng nhỏ có 3 giọt tình thương lấp lánh đọng lại. Bé nói 'Con nhớ ba mẹ' 想, con suy nghĩ chăm chú 思 đều là hành động ấm áp xuất phát từ tim nha!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">想</span> <span class="k-py">xiǎng</span> <span class="k-vi">nhớ/muốn 💭</span></div>
<div class="kid-word-item"><span class="k-zh">忘</span> <span class="k-py">wàng</span> <span class="k-vi">quên mất 🙉</span></div>
<div class="kid-word-item"><span class="k-zh">思</span> <span class="k-py">sī</span> <span class="k-vi">suy nghĩ 🤔</span></div>
<div class="kid-word-item"><span class="k-zh">急</span> <span class="k-py">jí</span> <span class="k-vi">vội vã ⏰</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #795548;">土</span>
</div>
<span class="radical-pinyin">tǔ</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">20</span>
<span class="radical-name">土 Bộ Thổ (Đất / Sân bãi)</span>
</div>
<span class="stroke-badge">⭐ 3 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ thổ (土) chỉ mặt đất, bùn đất cát đá hoặc các địa điểm vui chơi, lâu đài cát bé xây dựng trên mặt đất.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#795548" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M12 22V2M12 7l-5 5M12 7l5 5M7 12h10" opacity="0.1"></path>
<path d="M12 4v18M4 11h16M2 22h20" stroke-width="2.5"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            🌱 <strong>Lê Lê mách bé:</strong> "Một thân cây nhỏ xinh nhú lên khỏi lớp đất mẹ ấm áp nâng đỡ bên dưới. Các địa điểm như sân bóng 场 hay đất đai 地 đều cần đất thổ đó!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">地</span> <span class="k-py">dì</span> <span class="k-vi">mặt đất 🌎</span></div>
<div class="kid-word-item"><span class="k-zh">场</span> <span class="k-py">chǎng</span> <span class="k-vi">sân bãi 🏟️</span></div>
<div class="kid-word-item"><span class="k-zh">块</span> <span class="k-py">kuài</span> <span class="k-vi">cục/miếng 🧱</span></div>
<div class="kid-word-item"><span class="k-zh">坡</span> <span class="k-py">pō</span> <span class="k-vi">con dốc 📈</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 12 / 17</div>
</div>
</div>
<!-- PAGE 13: RADICALS 21-22 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 11</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #E91E63;">鸟</span>
</div>
<span class="radical-pinyin">niǎo</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">21</span>
<span class="radical-name">鸟 Bộ Điểu (Con chim)</span>
</div>
<span class="stroke-badge">⭐ 5 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ điểu (鸟) biểu thị hình ảnh một con chim có đầy đủ mắt, mỏ và lông cánh. Tất cả các loài chim hót hay gia cầm đều có chữ này.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#E91E63" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 5 5h5l3 3V10a8 8 0 0 0-8-8z" fill="#FCE4EC"></path>
<circle cx="12" cy="7" fill="#C2185B" r="1.5"></circle>
</svg>
</div>
</div>
<div class="kids-bubble">
            🐦 <strong>Lê Lê mách bé:</strong> "Nhìn chiếc mỏ sắc nhọn, chiếc đầu tròn trịa có con mắt thông minh và chiếc lông đuôi dài vểnh ra. Chú gà 鸡 hay vịt 鸭 lạch bạch đều là họ nhà chim đó!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">鸡</span> <span class="k-py">jī</span> <span class="k-vi">con gà 🐔</span></div>
<div class="kid-word-item"><span class="k-zh">鸭</span> <span class="k-py">yā</span> <span class="k-vi">con vịt 🦆</span></div>
<div class="kid-word-item"><span class="k-zh">鹅</span> <span class="k-py">é</span> <span class="k-vi">con ngỗng 🦢</span></div>
<div class="kid-word-item"><span class="k-zh">鸽</span> <span class="k-py">gē</span> <span class="k-vi">bồ câu 🐦</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #3F51B5;">目</span>
</div>
<span class="radical-pinyin">mù</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">22</span>
<span class="radical-name">目 Bộ Mục (Mắt / Tầm nhìn)</span>
</div>
<span class="stroke-badge">⭐ 5 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ mục (目) là hình vẽ cách điệu của con mắt nằm dọc có các tròng mắt bên trong, dùng cho các chữ liên quan đến nhìn ngắm hoặc ngủ.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#3F51B5" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" fill="#E8EAF6"></path>
<circle cx="12" cy="12" fill="#3F51B5" r="3"></circle>
</svg>
</div>
</div>
<div class="kids-bubble">
            👁️ <strong>Lê Lê mách bé:</strong> "Bé ơi nhắm mắt lại để đi ngủ 睡 nào, rồi mở mắt to ra để nhìn ngắm 看 thế giới tươi đẹp xung quanh cùng Lê Lê nhé!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">看</span> <span class="k-py">kàn</span> <span class="k-vi">nhìn xem 👀</span></div>
<div class="kid-word-item"><span class="k-zh">眼</span> <span class="k-py">yǎn</span> <span class="k-vi">con mắt 👁️</span></div>
<div class="kid-word-item"><span class="k-zh">睡</span> <span class="k-py">shuì</span> <span class="k-vi">ngủ ngon 😴</span></div>
<div class="kid-word-item"><span class="k-zh">盯</span> <span class="k-py">dīng</span> <span class="k-vi">nhìn chằm chằm 🤨</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 13 / 17</div>
</div>
</div>
<!-- PAGE 14: RADICALS 23-24 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 12</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #8BC34A;">虫</span>
</div>
<span class="radical-pinyin">chóng</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">23</span>
<span class="radical-name">虫 Bộ Trùng (Côn trùng / Sâu bọ)</span>
</div>
<span class="stroke-badge">⭐ 6 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ trùng (虫) đại diện cho các loài côn trùng, sâu bọ bé nhỏ hoặc các loài sinh vật thân mềm sống trong đất cát ngoài vườn.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#8BC34A" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M12 2a5 5 0 0 0-5 5v3a5 5 0 0 0 5 5h5l3 3V10a8 8 0 0 0-8-8z" opacity="0.05"></path>
<path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-13-7-13S5 10.7 5 15a7 7 0 0 0 7 7z" opacity="0.05"></path>
<circle cx="12" cy="12" fill="#DCEDC8" r="6"></circle>
<path d="M8 8l2 2m4-2l-2 2m-4 6l8-4" stroke-width="2"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            🐛 <strong>Lê Lê mách bé:</strong> "Một cái đầu to tròn với cái đuôi sâu uốn éo bò lổm ngổm. Những chú kiến chăm chỉ 蚂蚁 hay chú bướm xinh đẹp 蝴蝶 đều mang bộ này bên mình đó!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">蚂</span> <span class="k-py">mǎ</span> <span class="k-vi">con kiến 🐜</span></div>
<div class="kid-word-item"><span class="k-zh">蚁</span> <span class="k-py">yǐ</span> <span class="k-vi">con kiến 🐜</span></div>
<div class="kid-word-item"><span class="k-zh">蝴</span> <span class="k-py">hú</span> <span class="k-vi">bươm bướm 🦋</span></div>
<div class="kid-word-item"><span class="k-zh">蝶</span> <span class="k-py">dié</span> <span class="k-vi">bươm bướm 🦋</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #607D8B;">钅</span>
</div>
<span class="radical-pinyin">jīn</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">24</span>
<span class="radical-name">钅 Bộ Kim (Kim loại / Vàng)</span>
</div>
<span class="stroke-badge">⭐ 5 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ kim đứng (钅) chỉ vàng bạc, sắt thép, kim loại cứng rắn hoặc các vật dụng làm bằng sắt như cây đinh, kim khâu hay tiền xu.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#607D8B" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<rect fill="#CFD8DC" height="14" rx="2" width="20" x="2" y="7"></rect>
<path d="M6 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            🪙 <strong>Lê Lê mách bé:</strong> "Lấp lánh như vàng miếng hay đồng tiền xu 钱 tròn trịa kêu keng keng. Chữ nào chứa bộ này đều rất cứng cáp hoặc quý giá đó nha!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">钱</span> <span class="k-py">qián</span> <span class="k-vi">tiền xu 🪙</span></div>
<div class="kid-word-item"><span class="k-zh">铁</span> <span class="k-py">tiě</span> <span class="k-vi">sắt cứng 🗜️</span></div>
<div class="kid-word-item"><span class="k-zh">针</span> <span class="k-py">zhēn</span> <span class="k-vi">cái kim 🪡</span></div>
<div class="kid-word-item"><span class="k-zh">钟</span> <span class="k-py">zhōng</span> <span class="k-vi">đồng hồ 🕰️</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 14 / 17</div>
</div>
</div>
<!-- PAGE 15: RADICALS 25-26 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 13</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #8D6E63;">石</span>
</div>
<span class="radical-pinyin">shí</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">25</span>
<span class="radical-name">石 Bộ Thạch (Đá / Hard objects)</span>
</div>
<span class="stroke-badge">⭐ 5 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ thạch (石) tượng trưng cho hòn đá dưới chân núi, cát sỏi hoặc những vật dụng được nung từ đất đá cứng như chiếc bát sứ.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#8D6E63" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewbox="0 0 24 24" width="46">
<path d="M20 20L4 4" opacity="0.05"></path>
<path d="M12 2L2 7l10 5 10-5-10-5z" fill="#D7CCC8"></path>
<path d="M2 17l10 5 10-5"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            🪨 <strong>Lê Lê mách bé:</strong> "Một cái vách đá lớn nghiêng nghiêng nâng đỡ một hòn đá vuông vức bên dưới. Đất đá cứng cáp có thể làm ra gạch xây nhà 砖 hay chiếc bát ăn cơm 碗 xinh đẹp."
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">碗</span> <span class="k-py">wǎn</span> <span class="k-vi">cái bát 🥣</span></div>
<div class="kid-word-item"><span class="k-zh">硬</span> <span class="k-py">yìng</span> <span class="k-vi">cứng cáp 💪</span></div>
<div class="kid-word-item"><span class="k-zh">破</span> <span class="k-py">pò</span> <span class="k-vi">vỡ/hỏng 💥</span></div>
<div class="kid-word-item"><span class="k-zh">砖</span> <span class="k-py">zhuān</span> <span class="k-vi">viên gạch 🧱</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #FF5722;">辶</span>
</div>
<span class="radical-pinyin">chuò</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">26</span>
<span class="radical-name">辶 Bộ Sước (Bước đi / Chạy trốn)</span>
</div>
<span class="stroke-badge">⭐ 3 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ sước (辶) ôm dưới đáy chữ chỉ hành động bước đi, di chuyển, vận chuyển hoặc chạy trốn đuổi bắt nhau.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#FF5722" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<circle cx="12" cy="12" opacity="0.05" r="9"></circle>
<path d="M13 5l7 7-7 7M5 5l7 7-7 7" stroke-width="2.5"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            🏃‍♂️ <strong>Lê Lê mách bé:</strong> "Một vệt trượt dài ngộ nghĩnh dưới chân. Khi ai đó giao quà 送, đi vào nhà 进, hay đang chơi đuổi bắt 追 thì chiếc xe trượt này sẽ xuất hiện giúp bé di chuyển!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">进</span> <span class="k-py">jìn</span> <span class="k-vi">đi vào 🚪</span></div>
<div class="kid-word-item"><span class="k-zh">送</span> <span class="k-py">sòng</span> <span class="k-vi">tặng quà 🎁</span></div>
<div class="kid-word-item"><span class="k-zh">过</span> <span class="k-py">guò</span> <span class="k-vi">đi qua 🚶</span></div>
<div class="kid-word-item"><span class="k-zh">追</span> <span class="k-py">zhuī</span> <span class="k-vi">đuổi theo 🏃</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 15 / 17</div>
</div>
</div>
<!-- PAGE 16: RADICALS 27-28 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 14</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #FFB300;">米</span>
</div>
<span class="radical-pinyin">mǐ</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">27</span>
<span class="radical-name">米 Bộ Mễ (Gạo / Lúa)</span>
</div>
<span class="stroke-badge">⭐ 6 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ mễ (米) tượng trưng cho bông lúa nhiều hạt chín vàng hoặc các hạt gạo, hạt ngũ cốc nhỏ xíu mà bé ăn mỗi ngày.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#FFB300" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M12 2v20M2 12h20M12 12L5 5M12 12l7-7M12 12l-7 7M12 12l7 7" stroke-width="2"></path>
<circle cx="12" cy="12" fill="#FFF9C4" r="3"></circle>
</svg>
</div>
</div>
<div class="kids-bubble">
            🌾 <strong>Lê Lê mách bé:</strong> "Một chữ thập lớn tung bay bốn hạt thóc nhỏ rực rỡ xung quanh. Những món ngọt bé thích như kẹo đường 糖 hay bánh ngọt 糕 đều làm từ gạo hạt mễ đó!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">糖</span> <span class="k-py">táng</span> <span class="k-vi">kẹo ngọt 🍬</span></div>
<div class="kid-word-item"><span class="k-zh">糕</span> <span class="k-py">gāo</span> <span class="k-vi">bánh ngọt 🍰</span></div>
<div class="kid-word-item"><span class="k-zh">粉</span> <span class="k-py">fěn</span> <span class="k-vi">bột mì 🧁</span></div>
<div class="kid-word-item"><span class="k-zh">粽</span> <span class="k-py">zòng</span> <span class="k-vi">bánh ú/chưng 🍙</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #FF5722;">纟</span>
</div>
<span class="radical-pinyin">sī</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">28</span>
<span class="radical-name">纟 Bộ Mịch (Sợi tơ / Sợi chỉ)</span>
</div>
<span class="stroke-badge">⭐ 3 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ mịch (纟) chỉ các sợi tơ tằm mềm mại, cuộn len hoặc sợi chỉ khâu. Ngày xưa lụa tơ tằm được nhuộm rất nhiều màu sắc, nên chữ chỉ màu sắc hay có bộ này.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#FF5722" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M12 2A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2z" opacity="0.05"></path>
<path d="M12 2a10 10 0 0 0-10 10h20A10 10 0 0 0 12 2z" opacity="0.05"></path>
<path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" fill="#FFCCBC"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            🧶 <strong>Lê Lê mách bé:</strong> "Một chú sâu nhỏ tơ đang nhả ra những sợi chỉ mảnh mai. Chiếc áo màu đỏ 红 bé mặc hay sợi dây thừng 绳 màu xanh lá 绿 đều đan từ sợi tơ này đó!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">红</span> <span class="k-py">hóng</span> <span class="k-vi">màu đỏ 🔴</span></div>
<div class="kid-word-item"><span class="k-zh">绿</span> <span class="k-py">lǜ</span> <span class="k-vi">xanh lá 🟢</span></div>
<div class="kid-word-item"><span class="k-zh">线</span> <span class="k-py">xiàn</span> <span class="k-vi">sợi chỉ 🧵</span></div>
<div class="kid-word-item"><span class="k-zh">绳</span> <span class="k-py">shéng</span> <span class="k-vi">dây thừng 🪢</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 16 / 17</div>
</div>
</div>
<!-- PAGE 17: RADICALS 29-30 -->
<div class="page">
<div class="header">
<div class="header-left">
<span class="logo-text">乐乐</span>
<span>| 30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé</span>
</div>
<div>Lê Lê học tiếng Trung 🌸</div>
</div>
<h2 class="page-title"><span class="page-title-icon">🌈</span> Thẻ Bộ Thủ Thần Kỳ · Nhóm 15</h2>
<div class="radicals-container">
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #795548;">门</span>
</div>
<span class="radical-pinyin">mén</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">29</span>
<span class="radical-name">门 Bộ Môn (Cánh cửa)</span>
</div>
<span class="stroke-badge">⭐ 3 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ môn (门) ôm bao quanh bên ngoài giống như một chiếc khung cửa phòng khách, chỉ những gì liên quan tới đóng, mở, hỏi han hoặc che giấu.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#795548" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" viewbox="0 0 24 24" width="46">
<path d="M3 3h18v18H3z" opacity="0.05"></path>
<rect fill="#D7CCC8" height="18" rx="2" width="18" x="3" y="3"></rect>
<line x1="12" x2="12" y1="3" y2="21"></line>
</svg>
</div>
</div>
<div class="kids-bubble">
            🚪 <strong>Lê Lê mách bé:</strong> "Chiếc khung cửa gỗ bảo vệ ngôi nhà bé yêu. Khi bé đóng cửa lại 闭 hay bé gõ cửa để hỏi thăm 问 ai đó, bé đều cần mở chiếc cửa này ra nhé!"
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">问</span> <span class="k-py">wèn</span> <span class="k-vi">hỏi thăm 🙋‍♀️</span></div>
<div class="kid-word-item"><span class="k-zh">闭</span> <span class="k-py">bì</span> <span class="k-vi">đóng cửa 🔒</span></div>
<div class="kid-word-item"><span class="k-zh">闻</span> <span class="k-py">wén</span> <span class="k-vi">ngửi thấy 👃</span></div>
<div class="kid-word-item"><span class="k-zh">闷</span> <span class="k-py">mèn</span> <span class="k-vi">bí bách 🥵</span></div>
</div>
</div>
</div>
<div class="radical-row">
<div class="radical-left">
<div class="hanzi-grid">
<span class="radical-char" style="color: #FFA000;">宀</span>
</div>
<span class="radical-pinyin">mián</span>
</div>
<div class="radical-right">
<div class="radical-header">
<div class="radical-title-box">
<span class="radical-index">30</span>
<span class="radical-name">宀 Bộ Miên (Mái nhà / Shelter)</span>
</div>
<span class="stroke-badge">⭐ 3 nét</span>
</div>
<div class="radical-body-grid">
<span class="radical-desc">Bộ miên (宀) che phủ ở trên đầu chữ y hệt như một mái nhà che chở nắng mưa, biểu thị ý nghĩa gia đình, phòng ốc hoặc sự bình an.</span>
<div class="radical-visual-box">
<svg fill="none" height="46" stroke="#FFA000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewbox="0 0 24 24" width="46">
<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="#FFF9C4"></path>
</svg>
</div>
</div>
<div class="kids-bubble">
            🏠 <strong>Lê Lê mách bé:</strong> "Một mái nhà ngói đỏ ấm áp có cột thu lôi bên trên. Bên dưới mái nhà là Gia đình 家 yêu thương và sự bình an 安, nơi bé được che chở mỗi ngày."
          </div>
<div class="kids-words-box">
<div class="kid-word-item"><span class="k-zh">家</span> <span class="k-py">jiā</span> <span class="k-vi">nhà yêu thương 🏡</span></div>
<div class="kid-word-item"><span class="k-zh">室</span> <span class="k-py">shì</span> <span class="k-vi">căn phòng 🛋️</span></div>
<div class="kid-word-item"><span class="k-zh">安</span> <span class="k-py">ān</span> <span class="k-vi">bình an 🍀</span></div>
<div class="kid-word-item"><span class="k-zh">宝</span> <span class="k-py">bǎo</span> <span class="k-vi">bảo bối 💎</span></div>
</div>
</div>
</div>
</div>
<div class="footer">
<div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io/doc/?id=DOC-RADICALS</div>
<div>Trang 17 / 17</div>
</div>
</div>
</body>
</html>
"""

# Save to html file
html_file_path = os.path.join(scratch_dir, "generate_radicals_pdf.html")
with open(html_file_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"generate_radicals_pdf.html successfully created at: {html_file_path}")

# Print to PDF using Headless Chrome
print("Calling Headless Chrome to print to PDF...")
chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
output_pdf = "POSTS/docs/DOC-RADICALS.pdf"

# Make sure folder exists
os.makedirs(os.path.dirname(output_pdf), exist_ok=True)

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--print-to-pdf=" + output_pdf,
    html_file_path
]

try:
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    print(f"Successfully generated Radicals PDF: {output_pdf}")
except subprocess.CalledProcessError as e:
    print("Error calling Chrome to print PDF:")
    print(e.stderr)
    exit(1)
