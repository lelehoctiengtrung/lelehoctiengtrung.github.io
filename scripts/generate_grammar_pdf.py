# -*- coding: utf-8 -*-
import subprocess
import os

scratch_dir = "scripts"
os.makedirs(scratch_dir, exist_ok=True)

html_content = """<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Ngữ Pháp Tiếng Trung Cơ Bản</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif+SC:wght@300;400;700;900&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    body {
      margin: 0;
      padding: 0;
      background: #f3f4f6;
      font-family: 'Inter', sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    
    /* Page frame */
    .page {
      width: 210mm;
      height: 297mm;
      box-sizing: border-box;
      padding: 15mm 15mm 15mm 15mm;
      position: relative;
      background: #ffffff;
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
      border-bottom: 0.5px solid rgba(212, 168, 67, 0.25);
      font-size: 9px;
      color: #7c7365;
      font-weight: 500;
      letter-spacing: 0.5px;
      z-index: 10;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .header-left .logo-text {
      color: #C94535;
      font-weight: 700;
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
      border-top: 0.5px solid rgba(212, 168, 67, 0.25);
      font-size: 8px;
      color: #9ca3af;
      z-index: 10;
    }
    
    /* Page 1: Cover Page (Website Dark Gold & Chinese Red Style) */
    .cover-page {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: center;
      text-align: center;
      padding: 42mm 20mm 32mm 20mm;
      height: 297mm;
      box-sizing: border-box;
      background-color: #161310; /* Website background color */
      color: #F5E8D0; /* Website cream text color */
      position: relative;
      page-break-after: always;
      border: 8px double #D4A843; /* double gold border */
      margin: 0;
      overflow: hidden;
    }
    
    /* Elegant corners */
    .cover-corner {
      position: absolute;
      width: 60px;
      height: 60px;
      z-index: 5;
      pointer-events: none;
    }
    .corner-tl { top: 15px; left: 15px; }
    .corner-tr { top: 15px; right: 15px; transform: scaleX(-1); }
    .corner-bl { bottom: 15px; left: 15px; transform: scaleY(-1); }
    .corner-br { bottom: 15px; right: 15px; transform: scale(-1); }
    
    /* Footer wave pattern chìm */
    .cover-wave-bg {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 85mm;
      pointer-events: none;
      z-index: 1;
    }
    
    /* Floating characters decoration in background */
    .cover-hanzi-bg {
      position: absolute;
      font-family: 'Noto Serif SC', serif;
      font-size: 90px;
      color: #D4A843;
      opacity: 0.045;
      user-select: none;
      font-weight: 700;
      z-index: 2;
    }
    .hz-bg-1 { top: 15%; left: 12%; transform: rotate(-12deg); }
    .hz-bg-2 { top: 22%; right: 14%; transform: rotate(18deg); }
    .hz-bg-3 { bottom: 28%; left: 18%; transform: rotate(8deg); }
    .hz-bg-4 { bottom: 22%; right: 12%; transform: rotate(-10deg); }
    
    .cover-decor {
      position: absolute;
      top: 2px; left: 2px; right: 2px; bottom: 2px;
      border: 1.5px solid #C94535; /* Inner Chinese Red border */
      pointer-events: none;
      z-index: 3;
    }
    .cover-top {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 15px;
      z-index: 10;
    }
    .cover-badge {
      background: rgba(212, 168, 67, 0.12);
      border: 1px solid #D4A843;
      color: #F0C866;
      padding: 6px 20px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 3px;
      text-transform: uppercase;
      display: flex;
      align-items: center;
    }
    .badge-dot {
      color: #D4A843;
      margin: 0 6px;
      font-size: 8px;
    }
    .cover-title {
      font-family: 'Noto Serif SC', serif;
      font-size: 46px;
      font-weight: 700;
      color: #ffffff;
      margin: 12px 0 2px 0;
      letter-spacing: 3px;
      line-height: 1.3;
      text-shadow: 0 4px 15px rgba(0,0,0,0.6);
    }
    .cover-title span {
      color: #D4A843;
    }
    .cover-title-zh {
      font-family: 'Noto Serif SC', serif;
      font-size: 24px;
      color: #C94535; /* Website Red */
      margin: 0;
      letter-spacing: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      text-indent: 10px;
    }
    .title-decor {
      color: #D4A843;
      font-size: 12px;
      margin: 0 10px;
      opacity: 0.8;
    }
    .cover-mid {
      z-index: 10;
      margin-top: -3mm;
    }
    .cover-seal {
      width: 120px;
      height: 120px;
      background: #C94535;
      border: 3px solid #D4A843;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      box-shadow: 0 8px 24px rgba(201, 69, 53, 0.4);
      margin: 0 auto;
      transform: rotate(-3deg); /* Hand-stamped feel */
    }
    .cover-seal::before {
      content: "";
      position: absolute;
      top: 4px; left: 4px; right: 4px; bottom: 4px;
      border: 1px solid rgba(212, 168, 67, 0.6);
    }
    .cover-seal span {
      font-family: 'Noto Serif SC', serif;
      font-size: 58px;
      font-weight: 900;
      color: #F5E8D0;
      line-height: 1;
      text-shadow: 2px 2px 0px rgba(0,0,0,0.15);
    }
    .cover-bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      z-index: 10;
    }
    .cover-desc {
      font-size: 13.5px;
      color: #F5E8D0;
      opacity: 0.85;
      max-width: 480px;
      line-height: 1.8;
    }
    .cover-author {
      font-size: 12.5px;
      color: #D4A843;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 12px;
      letter-spacing: 1px;
    }
    .cover-author::before, .cover-author::after {
      content: "";
      width: 25px;
      height: 1.5px;
      background: #C94535;
    }
    
    /* General Pages Structure */
    .page-title {
      font-family: 'Noto Serif SC', serif;
      font-size: 20px;
      color: #161310;
      border-bottom: 2.5px solid #C94535;
      padding-bottom: 8px;
      margin-top: 10mm;
      margin-bottom: 6mm;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
    }
    
    .intro-content {
      font-size: 13px;
      line-height: 1.8;
      color: #374151;
      text-align: justify;
      margin-bottom: 6mm;
    }
    .intro-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-bottom: 6mm;
    }
    .intro-box {
      border: 1px solid rgba(212, 168, 67, 0.2);
      background: #faf9f6;
      border-radius: 8px;
      padding: 15px;
    }
    .intro-box-title {
      font-weight: 700;
      font-size: 12px;
      color: #161310;
      margin-top: 0;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .intro-box-title.pros { color: #C94535; }
    .intro-box-title.tips { color: #D4A843; }
    .intro-box ul {
      margin: 0;
      padding-left: 18px;
      font-size: 11px;
      color: #4b5563;
      line-height: 1.6;
    }
    .intro-box li {
      margin-bottom: 8px;
    }
    
    .audience-banner {
      background: #faf9f6;
      border-left: 4px solid #C94535;
      padding: 12px 15px;
      border-radius: 0 8px 8px 0;
      font-size: 12px;
      color: #4b5563;
      line-height: 1.6;
    }
    .audience-banner strong {
      color: #C94535;
    }
    
    /* INFOGRAPHIC COMMON STYLES */
    .info-container {
      display: flex;
      flex-direction: column;
      gap: 20px;
      margin-top: 5mm;
    }
    .grammar-formula {
      background: #fdfbf7;
      border: 1px solid rgba(212, 168, 67, 0.3);
      border-radius: 8px;
      padding: 15px;
      font-size: 15px;
      font-weight: 600;
      color: #161310;
      text-align: center;
      box-shadow: 0 4px 10px rgba(0,0,0,0.02);
    }
    .formula-badge {
      display: inline-block;
      background: #C94535;
      color: white;
      font-size: 10px;
      padding: 3px 10px;
      border-radius: 4px;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    
    /* Step boxes S + T + P + V + O */
    .step-flow {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      margin: 25px 0;
      gap: 5px;
    }
    .step-box {
      flex: 1;
      border-radius: 6px;
      padding: 10px 5px;
      text-align: center;
      box-shadow: 0 4px 8px rgba(0,0,0,0.05);
      position: relative;
    }
    .step-box.subject { background: #fee2e2; border: 1.5px solid #ef4444; color: #991b1b; }
    .step-box.time { background: #fef3c7; border: 1.5px solid #f59e0b; color: #92400e; }
    .step-box.place { background: #dcfce7; border: 1.5px solid #10b981; color: #065f46; }
    .step-box.verb { background: #dbeafe; border: 1.5px solid #3b82f6; color: #1e40af; }
    .step-box.object { background: #f3e8ff; border: 1.5px solid #a855f7; color: #6b21a8; }
    
    .step-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .step-zh {
      font-family: 'Noto Serif SC', serif;
      font-size: 13px;
      font-weight: 700;
    }
    
    .arrow-svg {
      width: 16px;
      height: 16px;
      fill: #9ca3af;
    }
    
    /* Example Rows */
    .example-section {
      margin-top: 15px;
    }
    .example-title {
      font-size: 13px;
      font-weight: 700;
      color: #C94535;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .example-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .example-item {
      background: #fafafa;
      border-left: 3px solid #D4A843;
      padding: 10px 15px;
      border-radius: 0 6px 6px 0;
    }
    .ex-zh {
      font-family: 'Noto Serif SC', serif;
      font-size: 16px;
      font-weight: 700;
      color: #111827;
      letter-spacing: 0.5px;
    }
    .ex-py {
      font-size: 11px;
      color: #D4A843;
      font-weight: 600;
      margin: 2px 0;
    }
    .ex-vi {
      font-size: 12px;
      color: #4b5563;
    }
    
    /* Diagram De & Le */
    .split-diagram {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin: 15px 0;
    }
    .diagram-card {
      border: 1px solid rgba(0,0,0,0.08);
      background: #faf9f6;
      border-radius: 8px;
      padding: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.01);
    }
    .card-title {
      font-size: 13px;
      font-weight: 700;
      color: #111827;
      margin-top: 0;
      margin-bottom: 8px;
      border-bottom: 1px dashed rgba(212, 168, 67, 0.4);
      padding-bottom: 5px;
    }
    .card-formula {
      font-size: 12.5px;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 5px;
      padding: 8px;
      text-align: center;
      font-weight: 600;
      color: #C94535;
      margin-bottom: 10px;
    }
    .card-text {
      font-size: 11.5px;
      color: #4b5563;
      line-height: 1.5;
    }
    
    /* Comparison scales */
    .scale-container {
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 20px 0;
    }
    .scale-box {
      background: #faf9f6;
      border: 1.5px solid #D4A843;
      border-radius: 12px;
      padding: 15px 30px;
      box-shadow: 0 4px 10px rgba(212, 168, 67, 0.1);
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .scale-item {
      text-align: center;
    }
    .scale-char {
      font-family: 'Noto Serif SC', serif;
      font-size: 32px;
      font-weight: 700;
      color: #111827;
    }
    .scale-vs {
      font-size: 12px;
      font-weight: 700;
      color: #C94535;
      background: rgba(201, 69, 53, 0.1);
      padding: 4px 8px;
      border-radius: 4px;
    }
    
    /* Mindmap styles */
    .mindmap-root {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20px 0;
      position: relative;
    }
    .mindmap-node {
      background: #161310;
      color: #F5E8D0;
      border: 2px solid #D4A843;
      padding: 10px 20px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
      z-index: 5;
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }
    .mindmap-branches {
      display: flex;
      justify-content: space-between;
      width: 100%;
      margin-top: 25px;
      gap: 15px;
      position: relative;
    }
    .mindmap-branch-line {
      position: absolute;
      top: -25px;
      left: 50%;
      width: 2px;
      height: 25px;
      background: #D4A843;
      transform: translateX(-50%);
      z-index: 1;
    }
    .mindmap-branch-connectors {
      position: absolute;
      top: -25px;
      left: 15%;
      right: 15%;
      height: 2px;
      background: #D4A843;
      z-index: 1;
    }
    .mindmap-leaf {
      flex: 1;
      background: #faf9f6;
      border: 1px solid rgba(212, 168, 67, 0.3);
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      position: relative;
      z-index: 5;
      box-shadow: 0 2px 5px rgba(0,0,0,0.02);
    }
    .mindmap-leaf::before {
      content: "";
      position: absolute;
      top: -25px;
      left: 50%;
      width: 2px;
      height: 25px;
      background: #D4A843;
      transform: translateX(-50%);
    }
    .leaf-title {
      font-size: 12px;
      font-weight: 700;
      color: #C94535;
      margin-bottom: 5px;
    }
    .leaf-formula {
      font-size: 11px;
      font-weight: 600;
      background: white;
      border: 0.5px solid #e5e7eb;
      padding: 4px;
      border-radius: 4px;
      margin-bottom: 5px;
    }
    .leaf-example {
      font-size: 10.5px;
      color: #4b5563;
      font-style: italic;
    }
    
    /* Table styles for mistakes page */
    .mistake-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 10px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.02);
      border-radius: 8px;
      overflow: hidden;
    }
    .mistake-table th {
      background: #161310;
      color: #F5E8D0;
      font-size: 12px;
      font-weight: 700;
      padding: 12px;
      text-align: left;
    }
    .mistake-table td {
      padding: 12px;
      font-size: 11.5px;
      border-bottom: 1px solid #f3f4f6;
      vertical-align: top;
    }
    .mistake-table tr:hover {
      background: #fafafa;
    }
    .col-wrong {
      background: #fef2f2;
      color: #991b1b;
      font-weight: 600;
      border-left: 3px solid #ef4444;
    }
    .col-right {
      background: #f0fdf4;
      color: #166534;
      font-weight: 600;
      border-left: 3px solid #10b981;
    }
    .col-explain {
      color: #4b5563;
      line-height: 1.5;
    }
    .badge-wrong {
      background: #fee2e2;
      color: #ef4444;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
      margin-right: 5px;
    }
    .badge-right {
      background: #dcfce7;
      color: #10b981;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 9px;
      font-weight: 700;
      margin-right: 5px;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: COVER PAGE -->
  <div class="cover-page">
    <div class="cover-decor"></div>
    
    <!-- Fine corner decorations -->
    <svg class="cover-corner corner-tl" viewBox="0 0 100 100">
      <path d="M 0,0 L 40,0 L 40,4 L 4,4 L 4,40 L 0,40 Z" fill="#D4A843" />
      <path d="M 8,8 L 30,8 L 30,12 L 12,12 L 12,30 L 8,30 Z" fill="#C94535" />
      <circle cx="20" cy="20" r="3" fill="#D4A843" />
    </svg>
    <svg class="cover-corner corner-tr" viewBox="0 0 100 100">
      <path d="M 0,0 L 40,0 L 40,4 L 4,4 L 4,40 L 0,40 Z" fill="#D4A843" />
      <path d="M 8,8 L 30,8 L 30,12 L 12,12 L 12,30 L 8,30 Z" fill="#C94535" />
      <circle cx="20" cy="20" r="3" fill="#D4A843" />
    </svg>
    <svg class="cover-corner corner-bl" viewBox="0 0 100 100">
      <path d="M 0,0 L 40,0 L 40,4 L 4,4 L 4,40 L 0,40 Z" fill="#D4A843" />
      <path d="M 8,8 L 30,8 L 30,12 L 12,12 L 12,30 L 8,30 Z" fill="#C94535" />
      <circle cx="20" cy="20" r="3" fill="#D4A843" />
    </svg>
    <svg class="cover-corner corner-br" viewBox="0 0 100 100">
      <path d="M 0,0 L 40,0 L 40,4 L 4,4 L 4,40 L 0,40 Z" fill="#D4A843" />
      <path d="M 8,8 L 30,8 L 30,12 L 12,12 L 12,30 L 8,30 Z" fill="#C94535" />
      <circle cx="20" cy="20" r="3" fill="#D4A843" />
    </svg>
    
    <!-- Auspicious water waves chìm ở dưới -->
    <div class="cover-wave-bg">
      <svg viewBox="0 0 1440 320" width="100%" height="100%" preserveAspectRatio="none">
        <path fill="rgba(212, 168, 67, 0.04)" d="M0,96C120,101.3,240,112,360,112C480,112,600,101.3,720,80C840,58.7,960,26.7,1080,16C1200,5.3,1320,16,1380,21.3L1440,27L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,0,320Z"></path>
        <path fill="rgba(201, 69, 53, 0.025)" d="M0,192C120,181.3,240,160,360,170.7C480,181,600,224,720,240C840,256,960,245,1080,224C1200,203,1320,171,1380,154.7L1440,139L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,0,320Z"></path>
      </svg>
    </div>
    
    <div class="cover-hanzi-bg hz-bg-1">法</div>
    <div class="cover-hanzi-bg hz-bg-2">语</div>
    <div class="cover-hanzi-bg hz-bg-3">中</div>
    <div class="cover-hanzi-bg hz-bg-4">文</div>
    
    <div class="cover-top">
      <div class="cover-badge">
        <span class="badge-dot">✦</span> Tài liệu chia sẻ <span class="badge-dot">✦</span>
      </div>
      <h1 class="cover-title">Ngữ Pháp<br><span>Tiếng Trung Cơ Bản</span></h1>
      <h2 class="cover-title-zh" lang="zh"><span class="title-decor">✦</span> 实用汉语基础语法 <span class="title-decor">✦</span></h2>
    </div>
    
    <div class="cover-mid">
      <div class="cover-seal">
        <span>法</span>
      </div>
    </div>
    
    <div class="cover-bottom">
      <p class="cover-desc">Cẩm nang hệ thống hóa các cấu trúc ngữ pháp quan trọng nhất cho người mới bắt đầu. Thiết kế trực quan sinh động dưới dạng Infographics & Mindmaps giúp ghi nhớ sâu, ứng dụng nói câu chuẩn xác.</p>
      <div class="cover-author">Lê Lê học tiếng Trung</div>
    </div>
  </div>

  <!-- PAGE 2: INTRODUCTION PAGE -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Ngữ Pháp Tiếng Trung Cơ Bản</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🌸 Lời Mở Đầu & Hướng Dẫn</h2>
    
    <div class="intro-content">
      Chào các bạn! Lê Lê đây. Hôm nay mình chia sẻ cho các bạn cuốn sổ tay **Ngữ Pháp Tiếng Trung Cơ Bản**. Một trong những khó khăn lớn nhất của các bạn khi mới bắt đầu học tiếng Trung là làm sao nói được câu dài hoàn chỉnh mà không bị ngọng, nói "bồi", hay dịch word-by-word từ tiếng Việt sang.
      
      Hiểu được điều đó, mình đã dày công tổng hợp các cấu trúc cốt lõi nhất của tiếng Trung cơ bản (từ HSK 1 đến HSK 3) và chuyển hóa chúng thành các dạng **sơ đồ trực quan (infographics và mindmaps)**. Học ngữ pháp qua sơ đồ sẽ giúp não bộ liên kết thông tin hình ảnh tốt hơn gấp nhiều lần so với việc đọc các trang chữ dày đặc khô khan. 
      
      Mỗi chủ điểm ngữ pháp đều đi kèm công thức chuẩn, ví dụ thực tế được dịch nghĩa siêu dễ hiểu và phân tích sâu các lỗi sai mà các bạn rất dễ mắc phải. Mình hy vọng cuốn tài liệu này sẽ trở thành người bạn đồng hành hữu ích giúp các bạn tự tin làm chủ ngôn ngữ này!
    </div>
    
    <div class="intro-grid">
      <div class="intro-box">
        <h3 class="intro-box-title pros">✨ Cấu trúc Sổ tay (Pros)</h3>
        <ul>
          <li><strong>Trực quan sinh động</strong>: 100% kiến thức được trình bày dưới dạng infographic màu sắc và mindmap logic dễ hiểu.</li>
          <li><strong>Chủ điểm cốt lõi</strong>: Tập trung vào 7 cấu trúc ngữ pháp quan trọng nhất (Trật tự từ, Chữ 的/了/得, câu so sánh, câu chữ 把, liên từ).</li>
          <li><strong>Học đi đôi với hành</strong>: Kèm bảng phân tích các lỗi sai kinh điển giúp bạn "sửa lưng" ngay các lỗi nói bồi thường gặp.</li>
        </ul>
      </div>
      <div class="intro-box">
        <h3 class="intro-box-title tips">💡 Phương Pháp Học Tập (Tips)</h3>
        <ul>
          <li><strong>Tự đặt ví dụ</strong>: Học xong cấu trúc nào, hãy tự đặt ít nhất 3 ví dụ liên quan đến cuộc sống hàng ngày của bạn.</li>
          <li><strong>Viết tay mẫu câu</strong>: Tập chép tay cả câu chữ Hán và Pinyin ra vở. Việc viết tay giúp kích hoạt trí nhớ cơ bắp và nhớ chữ lâu hơn.</li>
          <li><strong>Nói to thành tiếng</strong>: Hãy đọc to các câu ví dụ trong tài liệu lên để luyện ngữ điệu và phát âm trôi chảy.</li>
        </ul>
      </div>
    </div>
    
    <div class="audience-banner">
      <strong>🎯 Hướng dẫn in ấn:</strong> Tài liệu được căn chỉnh chuẩn khổ giấy <strong>A4</strong>. Bạn nên chọn in màu và chọn tùy chọn <strong>Background graphics</strong> để các sơ đồ infographic và mindmap hiển thị màu sắc đẹp và sinh động nhất nhé!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 2 / 10</div>
    </div>
  </div>

  <!-- PAGE 3: WORD ORDER IN CHINESE -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Ngữ Pháp Tiếng Trung Cơ Bản</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">📌 Chủ điểm 1: Trật tự từ trong câu tiếng Trung</h2>
    
    <div class="info-container">
      <div class="grammar-formula">
        <span class="formula-badge">Cấu trúc cốt lõi</span><br>
        Chủ ngữ (Who) + Thời gian (When) + Địa điểm (Where) + Động từ (Action) + Tân ngữ (What)
      </div>
      
      <p class="intro-content" style="margin-bottom: 5px;">
        Khác với tiếng Việt khi từ chỉ thời gian và địa điểm có thể đứng cuối câu (Ví dụ: <i>"Tôi học tiếng Trung ở trường hôm nay."</i>), trong tiếng Trung, <strong>Thời gian</strong> và <strong>Địa điểm</strong> bắt buộc phải đứng trước <strong>Động từ</strong> hành động.
      </p>
      
      <!-- Flowchart SVG/CSS -->
      <div class="step-flow">
        <div class="step-box subject">
          <div class="step-label">Chủ ngữ</div>
          <div class="step-zh">我 (wǒ)</div>
          <div style="font-size:9px;">Tôi</div>
        </div>
        <svg class="arrow-svg" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="#9ca3af" stroke-width="2" fill="none"/></svg>
        <div class="step-box time">
          <div class="step-label">Thời gian</div>
          <div class="step-zh">今天 (jīntiān)</div>
          <div style="font-size:9px;">Hôm nay</div>
        </div>
        <svg class="arrow-svg" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="#9ca3af" stroke-width="2" fill="none"/></svg>
        <div class="step-box place">
          <div class="step-label">Địa điểm</div>
          <div class="step-zh">在学校 (zài xuéxiào)</div>
          <div style="font-size:9px;">Ở trường</div>
        </div>
        <svg class="arrow-svg" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="#9ca3af" stroke-width="2" fill="none"/></svg>
        <div class="step-box verb">
          <div class="step-label">Động từ</div>
          <div class="step-zh">学习 (xuéxí)</div>
          <div style="font-size:9px;">Học tập</div>
        </div>
        <svg class="arrow-svg" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" stroke="#9ca3af" stroke-width="2" fill="none"/></svg>
        <div class="step-box object">
          <div class="step-label">Tân ngữ</div>
          <div class="step-zh">汉语 (Hànyǔ)</div>
          <div style="font-size:9px;">Tiếng Trung</div>
        </div>
      </div>
      
      <div class="example-section">
        <div class="example-title">💡 Ví dụ thực tế:</div>
        <div class="example-list">
          <div class="example-item">
            <div class="ex-zh">爸爸晚上在家喝茶。</div>
            <div class="ex-py">Bàba wǎnshang zài jiā hē chá.</div>
            <div class="ex-vi">Bố uống trà ở nhà vào buổi tối. (Bố + buổi tối + ở nhà + uống + trà)</div>
          </div>
          <div class="example-item">
            <div class="ex-zh">我们明年去中国旅游。</div>
            <div class="ex-py">Wǒmen míngnián qù Zhōngguó lǚyóu.</div>
            <div class="ex-vi">Chúng tôi sẽ đi du lịch Trung Quốc vào sang năm. (Chúng tôi + sang năm + đi Trung Quốc + du lịch)</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 3 / 10</div>
    </div>
  </div>

  <!-- PAGE 4: PARTICLES DE -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Ngữ Pháp Tiếng Trung Cơ Bản</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">📌 Chủ điểm 2: Cách dùng trợ từ kết cấu "的" (de)</h2>
    
    <div class="info-container">
      <div class="grammar-formula">
        <span class="formula-badge">Công thức định ngữ</span><br>
        Định ngữ (Bổ nghĩa) + 的 + Trung tâm ngữ (Danh từ chính)
      </div>
      
      <p class="intro-content" style="margin-bottom: 5px;">
        Trợ từ <strong>的 (de)</strong> được dùng để kết nối thành phần bổ nghĩa (Định ngữ) với danh từ chính đứng sau (Trung tâm ngữ). Định ngữ có thể biểu thị tính chất, sở hữu, hoặc là một cụm chủ vị.
      </p>
      
      <div class="split-diagram">
        <div class="diagram-card">
          <h3 class="card-title">1. Biểu thị sở hữu hoặc tính chất</h3>
          <div class="card-formula">Danh từ / Tính từ + 的 + Danh từ chính</div>
          <div class="card-text">
            - <strong>我的电脑</strong> (wǒ de diànnǎo): Máy tính của tôi (Sở hữu).<br>
            - <strong>漂亮的花</strong> (piàoliang de huā): Bông hoa đẹp (Tính chất).
          </div>
        </div>
        <div class="diagram-card">
          <h3 class="card-title">2. Cụm chủ vị làm định ngữ</h3>
          <div class="card-formula">Chủ ngữ + Động từ + 的 + Danh từ chính</div>
          <div class="card-text">
            - <strong>妈妈买的苹果</strong> (māma mǎi de píngguǒ): Quả táo mẹ mua (Mẹ mua bổ nghĩa cho quả táo).<br>
            - <strong>我写的汉字</strong> (wǒ xiě de hànzì): Chữ Hán tôi viết.
          </div>
        </div>
      </div>
      
      <div class="example-section">
        <div class="example-title">💡 Ví dụ thực tế:</div>
        <div class="example-list">
          <div class="example-item">
            <div class="ex-zh">这是我昨天买的书。</div>
            <div class="ex-py">Zhè shì wǒ zuótiān mǎi de shū.</div>
            <div class="ex-vi">Đây là cuốn sách hôm qua tôi đã mua. (Đây + là + tôi hôm qua mua + 的 + sách)</div>
          </div>
          <div class="example-item">
            <div class="ex-zh">跑得很快的人是我的同学。</div>
            <div class="ex-py">Pǎo de hěn kuài de rén shì wǒ de tóngxué.</div>
            <div class="ex-vi">Người chạy rất nhanh là bạn học của tôi.</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 4 / 10</div>
    </div>
  </div>

  <!-- PAGE 5: PARTICLE LE -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Ngữ Pháp Tiếng Trung Cơ Bản</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">📌 Chủ điểm 3: Cách dùng trợ từ động thái "了" (le)</h2>
    
    <div class="info-container">
      <p class="intro-content" style="margin-bottom: 5px;">
        Chữ <strong>了 (le)</strong> có hai vai trò chính vô cùng quan trọng: làm trợ từ động thái (sau động từ) chỉ hành động đã xảy ra, hoặc làm trợ từ ngữ khí (cuối câu) chỉ sự thay đổi trạng thái mới.
      </p>
      
      <div class="split-diagram" style="margin-top: 10px;">
        <div class="diagram-card">
          <h3 class="card-title" style="color: #C94535;">1. 了 Động thái (Hành động hoàn thành)</h3>
          <div class="card-formula">Động từ + 了 (+ Tân ngữ)</div>
          <div class="card-text">
            Biểu thị hành động đã thực hiện hoặc hoàn thành.<br>
            - <strong>我买了一本书。</strong> (Wǒ mǎile yī běn shū): Tôi đã mua một cuốn sách.<br>
            - <strong>他吃了早饭。</strong> (Tā chīle zǎofàn): Anh ấy đã ăn bữa sáng.
          </div>
        </div>
        <div class="diagram-card">
          <h3 class="card-title" style="color: #D4A843;">2. 了 Ngữ khí (Thay đổi trạng thái)</h3>
          <div class="card-formula">Cụm từ + 了 (Đứng cuối câu)</div>
          <div class="card-text">
            Biểu thị trạng thái mới xuất hiện, sự việc đã thay đổi.<br>
            - <strong>下雨了。</strong> (Xià yǔ le): Trời mưa rồi (Trước đó không mưa).<br>
            - <strong>我不喝咖啡了。</strong> (Wǒ bù hē kāfēi le): Tôi không uống cà phê nữa (Trước đây có uống).
          </div>
        </div>
      </div>
      
      <!-- Time axis timeline SVG chìm -->
      <div style="background: #fdfbf7; border: 1px solid rgba(212, 168, 67, 0.2); border-radius: 8px; padding: 15px; text-align: center; margin: 15px 0;">
        <span style="font-size: 11px; font-weight: 700; color: #7c7365; text-transform: uppercase;">Trực quan hóa Dòng thời gian của 了</span>
        <svg viewBox="0 0 400 60" width="100%" height="50" style="margin-top: 10px;">
          <line x1="20" y1="30" x2="380" y2="30" stroke="#d4a843" stroke-width="2" />
          <polygon points="380,26 390,30 380,34" fill="#d4a843" />
          
          <circle cx="120" cy="30" r="6" fill="#C94535" />
          <text x="120" y="50" font-size="10" text-anchor="middle" font-weight="600" fill="#4b5563">Hành động xảy ra (Động từ + 了)</text>
          
          <circle cx="280" cy="30" r="6" fill="#D4A843" />
          <text x="280" y="50" font-size="10" text-anchor="middle" font-weight="600" fill="#4b5563">Trạng thái mới ra đời (Cuối câu + 了)</text>
        </svg>
      </div>
      
      <div class="example-section">
        <div class="example-title">💡 Ví dụ thực tế:</div>
        <div class="example-list">
          <div class="example-item">
            <div class="ex-zh">我已经买好机票了，下个月就出发。</div>
            <div class="ex-py">Wǒ yǐjīng mǎihǎo jīpiào le, xià gè yuè jiù chūfā.</div>
            <div class="ex-vi">Tôi đã mua xong vé máy bay rồi, tháng sau sẽ xuất phát. (Thay đổi trạng thái, chuẩn bị đi)</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 5 / 10</div>
    </div>
  </div>

  <!-- PAGE 6: COMPARISONS WITH BI -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Ngữ Pháp Tiếng Trung Cơ Bản</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">📌 Chủ điểm 4: Câu so sánh hơn với chữ "比" (bǐ)</h2>
    
    <div class="info-container">
      <div class="grammar-formula">
        <span class="formula-badge">Công thức so sánh hơn</span><br>
        A + 比 + B + Tính từ / Động từ trạng thái
      </div>
      
      <p class="intro-content" style="margin-bottom: 5px;">
        Trong tiếng Trung, để so sánh giữa hai đối tượng A và B, ta dùng cấu trúc chữ <strong>比 (bǐ)</strong>. Lưu ý đặc biệt: <strong>Không</strong> dùng các phó từ chỉ mức độ như <i>很 (rất), 非常 (vô cùng)</i> trước tính từ trong câu so sánh này.
      </p>
      
      <!-- Balance scale layout -->
      <div class="scale-container">
        <div class="scale-box">
          <div class="scale-item">
            <div class="scale-char">A</div>
            <div style="font-size:10px; color:#C94535; font-weight:600;">哥哥 (Anh trai)</div>
          </div>
          <div class="scale-vs">比 (bǐ)</div>
          <div class="scale-item">
            <div class="scale-char">B</div>
            <div style="font-size:10px; color:#D4A843; font-weight:600;">弟弟 (Em trai)</div>
          </div>
          <div style="font-size: 16px; font-weight: 700; color: #10b981; border-left: 2px solid #e5e7eb; padding-left: 15px;">
            高 (Cao)<br>
            <span style="font-size:9.5px; color:#4b5563; font-weight:normal;">Anh trai cao hơn em trai</span>
          </div>
        </div>
      </div>
      
      <div class="split-diagram">
        <div class="diagram-card">
          <h3 class="card-title" style="color: #ef4444;">❌ Lỗi sai phổ biến (Wrong)</h3>
          <div class="card-formula" style="background:#fef2f2; color:#ef4444; border-color:#fee2e2;">
            A + 比 + B + 很 + Tính từ
          </div>
          <div class="card-text">
            Ví dụ sai: <s>今天比昨天很冷。</s> (Sai vì dùng chữ "很").<br>
            Tiếng Trung quan niệm bản thân cấu trúc "比" đã mang ý nghĩa vượt trội, nên dùng thêm chữ "rất" là bị thừa ngữ nghĩa.
          </div>
        </div>
        <div class="diagram-card">
          <h3 class="card-title" style="color: #10b981;">✅ Cấu trúc đúng (Right)</h3>
          <div class="card-formula" style="background:#f0fdf4; color:#10b981; border-color:#dcfce7;">
            A + 比 + B + Tính từ + (得多 / 一点儿)
          </div>
          <div class="card-text">
            Ví dụ đúng:<br>
            - <strong>今天比昨天冷。</strong> (Hôm nay lạnh hơn hôm qua).<br>
            - <strong>今天比昨天冷得多。</strong> (Hôm nay lạnh hơn hôm qua rất nhiều).
          </div>
        </div>
      </div>
      
      <div class="example-section">
        <div class="example-title">💡 Ví dụ thực tế:</div>
        <div class="example-list">
          <div class="example-item">
            <div class="ex-zh">我的汉语比他好一点儿。</div>
            <div class="ex-py">Wǒ de Hànyǔ bǐ tā hǎo yīdiǎnr.</div>
            <div class="ex-vi">Tiếng Trung của tôi tốt hơn anh ấy một chút. (Tôi + 比 + anh ấy + tốt + một chút)</div>
          </div>
          <div class="example-item">
            <div class="ex-zh">今天坐地铁比坐公交车快得多。</div>
            <div class="ex-py">Jīntiān zuò dìtiě bǐ zuò gōngjiāochē kuài de duō.</div>
            <div class="ex-vi">Hôm nay đi tàu điện ngầm nhanh hơn đi xe buýt rất nhiều.</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 6 / 10</div>
    </div>
  </div>

  <!-- PAGE 7: BA SENTENCES -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Ngữ Pháp Tiếng Trung Cơ Bản</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">📌 Chủ điểm 5: Cấu trúc câu chữ "把" (bǎ)</h2>
    
    <div class="info-container">
      <div class="grammar-formula">
        <span class="formula-badge">Công thức câu chữ 把</span><br>
        Chủ ngữ + 把 + Tân ngữ + Động từ + Thành phần bổ trợ (了 / Bổ ngữ)
      </div>
      
      <p class="intro-content" style="margin-bottom: 5px;">
        Câu chữ <strong>把 (bǎ)</strong> được sử dụng để nhấn mạnh <strong>tác động</strong> của hành động làm thay đổi vị trí, trạng thái hoặc xử lý hoàn toàn một đối tượng xác định.
      </p>
      
      <!-- Flowchart SVG chìm -->
      <div style="background: #fdfbf7; border: 1px solid rgba(212, 168, 67, 0.2); border-radius: 8px; padding: 15px; margin: 15px 0;">
        <span style="font-size: 11px; font-weight: 700; color: #7c7365; text-transform: uppercase; display:block; text-align:center; margin-bottom:10px;">Sơ đồ tác động hành động của 把</span>
        <div style="display:flex; justify-content:space-around; align-items:center; font-size:11px;">
          <div style="text-align:center; background:#fee2e2; border:1px solid #f87171; padding:6px; border-radius:4px; width:80px;">
            <strong>Chủ ngữ</strong><br>我 (Tôi)
          </div>
          <span style="font-weight:bold; color:#C94535;">➔ 把 ➔</span>
          <div style="text-align:center; background:#fef3c7; border:1px solid #fbbf24; padding:6px; border-radius:4px; width:80px;">
            <strong>Tân ngữ</strong><br>作业 (Bài tập)
          </div>
          <span style="font-weight:bold; color:#C94535;">➔ Tác động ➔</span>
          <div style="text-align:center; background:#dbeafe; border:1px solid #60a5fa; padding:6px; border-radius:4px; width:100px;">
            <strong>Động từ + Kết quả</strong><br>写完了 (Viết xong)
          </div>
        </div>
      </div>
      
      <div class="split-diagram">
        <div class="diagram-card" style="grid-column: span 2;">
          <h3 class="card-title">Các điều kiện bắt buộc của câu chữ 把:</h3>
          <div class="card-text" style="font-size: 12px; line-height: 1.6;">
            1. <strong>Tân ngữ phải xác định</strong>: Người nghe và người nói đều phải biết đối tượng đó là gì (ví dụ: quả táo này, cuốn sách đó, không dùng tân ngữ chung chung).<br>
            2. <strong>Động từ phải mang tính tác động</strong>: Không dùng các từ chỉ trạng thái tinh thần, cảm xúc (như <i>喜欢 thích, 觉得 cảm thấy</i>).<br>
            3. <strong>Bắt buộc có thành phần bổ trợ ở cuối</strong>: Không được để động từ đứng đơn độc (phải có thêm <i>了, Bổ ngữ kết quả, hoặc lặp lại động từ</i>).
          </div>
        </div>
      </div>
      
      <div class="example-section">
        <div class="example-title">💡 Ví dụ thực tế:</div>
        <div class="example-list">
          <div class="example-item">
            <div class="ex-zh">请把门关上。</div>
            <div class="ex-py">Qǐng bǎ mén guānshang.</div>
            <div class="ex-vi">Làm ơn đóng cửa lại. (Xin vui lòng + 把 + cửa + đóng lại)</div>
          </div>
          <div class="example-item">
            <div class="ex-zh">弟弟把苹果吃光了。</div>
            <div class="ex-py">Dìdi bǎ píngguǒ chīguāng le.</div>
            <div class="ex-vi">Em trai đã ăn sạch táo rồi. (Em trai + 把 + quả táo + ăn hết sạch + rồi)</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 7 / 10</div>
    </div>
  </div>

  <!-- PAGE 8: PARTICLE DE (RESULT) -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Ngữ Pháp Tiếng Trung Cơ Bản</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">📌 Chủ điểm 6: Trợ từ kết cấu "得" (de) & Bổ ngữ trạng thái</h2>
    
    <div class="info-container">
      <div class="grammar-formula">
        <span class="formula-badge">Bổ ngữ trạng thái / khả năng</span><br>
        Động từ + 得 + Phó từ chỉ mức độ + Tính từ (Đánh giá kết quả)
      </div>
      
      <p class="intro-content" style="margin-bottom: 5px;">
        Trợ từ kết cấu <strong>得 (de)</strong> được dùng làm cầu nối giữa động từ hành động với bổ ngữ đứng sau để đánh giá, miêu tả về trạng thái, mức độ hoặc khả năng của hành động đó.
      </p>
      
      <div class="split-diagram">
        <div class="diagram-card">
          <h3 class="card-title">1. Đánh giá mức độ hành động</h3>
          <div class="card-formula">Động từ + 得 + 很 / 非常 + Tính từ</div>
          <div class="card-text">
            Miêu tả trạng thái đã xảy ra thực tế.<br>
            - <strong>跑得很快</strong> (pǎo de hěn kuài): Chạy rất nhanh.<br>
            - <strong>说得流利</strong> (shuō de liúlì): Nói rất lưu loát.
          </div>
        </div>
        <div class="diagram-card">
          <h3 class="card-title">2. Phủ định bổ ngữ trạng thái</h3>
          <div class="card-formula">Động từ + 得 + 不 + Tính từ</div>
          <div class="card-text">
            Phủ định trực tiếp vào tính từ chỉ trạng thái.<br>
            - <strong>跑得不快</strong> (pǎo de bù kuài): Chạy không nhanh.<br>
            - <strong>写得不好看</strong> (xiě de bù hǎokàn): Viết chữ không đẹp.
          </div>
        </div>
      </div>
      
      <div class="example-section">
        <div class="example-title">💡 Ví dụ thực tế:</div>
        <div class="example-list">
          <div class="example-item">
            <div class="ex-zh">妹妹唱歌唱得非常好听。</div>
            <div class="ex-py">Mèimei chànggē chàng de fēicháng hǎotīng.</div>
            <div class="ex-vi">Em gái hát rất hay. (Em gái + hát ca + hát + 得 + vô cùng hay) <br><small><i>Lưu ý: Nếu có tân ngữ (唱歌), ta phải lặp lại động từ (唱).</i></small></div>
          </div>
          <div class="example-item">
            <div class="ex-zh">昨晚我睡得很好。</div>
            <div class="ex-py">Zuówǎn wǒ shuì de hěn hǎo.</div>
            <div class="ex-vi">Tối qua tôi ngủ rất ngon. (Tối qua + tôi + ngủ + 得 + rất tốt)</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 8 / 10</div>
    </div>
  </div>

  <!-- PAGE 9: CONJUNCTIONS -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Ngữ Pháp Tiếng Trung Cơ Bản</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">📌 Chủ điểm 7: Các cặp liên từ phức thông dụng</h2>
    
    <div class="info-container">
      <p class="intro-content" style="margin-bottom: 5px;">
        Các cặp liên từ hô ứng giúp câu nói của bạn trở nên logic, lưu loát và tự nhiên hơn. Dưới đây là sơ đồ mindmap phân chia 3 loại liên từ quan trọng nhất.
      </p>
      
      <!-- CSS Mindmap -->
      <div class="mindmap-root">
        <div class="mindmap-node">LIÊN TỪ PHỨC</div>
        
        <div class="mindmap-branches">
          <div class="mindmap-branch-line"></div>
          <div class="mindmap-branch-connectors"></div>
          
          <!-- Branch 1 -->
          <div class="mindmap-leaf">
            <div class="leaf-title">1. Nhân Quả</div>
            <div class="leaf-formula">因为... 所以...<br>(yīnwèi... suǒyǐ...)</div>
            <div class="leaf-example">Bởi vì... nên...</div>
          </div>
          
          <!-- Branch 2 -->
          <div class="mindmap-leaf">
            <div class="leaf-title">2. Chuyển Ngoặt</div>
            <div class="leaf-formula">虽然... 但是...<br>(suīrán... dànshì...)</div>
            <div class="leaf-example">Tuy là... nhưng...</div>
          </div>
          
          <!-- Branch 3 -->
          <div class="mindmap-leaf">
            <div class="leaf-title">3. Tăng Tiến</div>
            <div class="leaf-formula">不但... 而且...<br>(bùdàn... érqiě...)</div>
            <div class="leaf-example">Không những... mà còn...</div>
          </div>
        </div>
      </div>
      
      <div class="example-section" style="margin-top: 10px;">
        <div class="example-title">💡 Ví dụ thực tế:</div>
        <div class="example-list">
          <div class="example-item">
            <div class="ex-zh">因为下雨， so we didn't go. ➔ 因为下大雨，所以我们没去。</div>
            <div class="ex-py">Yīnwèi xià dàyǔ, suǒyǐ wǒmen méi qù.</div>
            <div class="ex-vi">Vì trời mưa to nên chúng tôi không đi.</div>
          </div>
          <div class="example-item">
            <div class="ex-zh">虽然学习汉语很难，但是很有趣。</div>
            <div class="ex-py">Suīrán xuéxí Hànyǔ hěn nán, dànshì hěn yǒuqù.</div>
            <div class="ex-vi">Mặc dù học tiếng Trung rất khó, nhưng rất thú vị.</div>
          </div>
          <div class="example-item">
            <div class="ex-zh">她不但聪明，而且很漂亮。</div>
            <div class="ex-py">Tā bùdàn cōngming, érqiě hěn piàoliang.</div>
            <div class="ex-vi">Cô ấy không những thông minh mà còn rất xinh đẹp.</div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 9 / 10</div>
    </div>
  </div>

  <!-- PAGE 10: COMMON MISTAKES -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Ngữ Pháp Tiếng Trung Cơ Bản</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">⚠️ Tổng hợp: Các lỗi sai ngữ pháp kinh điển</h2>
    
    <div class="info-container" style="gap: 10px;">
      <p class="intro-content" style="margin-bottom: 5px;">
        Để giúp các bạn củng cố tư duy ngữ pháp chuẩn, Lê Lê đã tổng hợp 4 lỗi sai kinh điển mà các bạn cùng học thường mắc phải do thói quen dịch trực tiếp từ tiếng Việt. Hãy cùng xem và sửa ngay nhé!
      </p>
      
      <table class="mistake-table">
        <thead>
          <tr>
            <th width="30%">❌ Câu sai (Dịch bồi)</th>
            <th width="30%">✅ Câu đúng (Chuẩn)</th>
            <th width="40%">💡 Giải thích ngữ pháp</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="col-wrong">
              <span class="badge-wrong">Sai</span>
              我爱她很多。<br>
              <small>(Wǒ ài tā hěn duō)</small>
            </td>
            <td class="col-right">
              <span class="badge-right">Đúng</span>
              我很爱 ta。<br>
              <small>(Wǒ hěn ài tā)</small>
            </td>
            <td class="col-explain">
              Phó từ chỉ mức độ (很, 非常) bắt buộc đứng <strong>trước</strong> động từ trạng thái cảm xúc. Không đặt ở cuối câu.
            </td>
          </tr>
          <tr>
            <td class="col-wrong">
              <span class="badge-wrong">Sai</span>
              我学习汉语在学校。<br>
              <small>(Wǒ xuéxí zài xuéxiào)</small>
            </td>
            <td class="col-right">
              <span class="badge-right">Đúng</span>
              我在学校学习汉语。<br>
              <small>(Wǒ zài xuéxiào xuéxí)</small>
            </td>
            <td class="col-explain">
              Trạng từ chỉ địa điểm (在 + nơi chốn) bắt buộc đứng <strong>trước</strong> hành động.
            </td>
          </tr>
          <tr>
            <td class="col-wrong">
              <span class="badge-wrong">Sai</span>
              他比我很高。<br>
              <small>(Tā bǐ wǒ hěn gāo)</small>
            </td>
            <td class="col-right">
              <span class="badge-right">Đúng</span>
              他比我高。<br>
              <small>(Tā bǐ wǒ gāo)</small>
            </td>
            <td class="col-explain">
              Trong câu so sánh chữ 比, <strong>không</strong> dùng phó từ chỉ mức độ (很, 非常) trước tính từ.
            </td>
          </tr>
          <tr>
            <td class="col-wrong">
              <span class="badge-wrong">Sai</span>
              我去中国明年。<br>
              <small>(Wǒ qù Zhōngguó míngnián)</small>
            </td>
            <td class="col-right">
              <span class="badge-right">Đúng</span>
              我明年去中国。<br>
              <small>(Wǒ míngnián qù...)</small>
            </td>
            <td class="col-explain">
              Trạng từ chỉ thời gian (明年, 今天...) phải đứng <strong>trước</strong> động từ (sau hoặc trước Chủ ngữ đều được).
            </td>
          </tr>
        </tbody>
      </table>
      
      <div class="audience-banner" style="margin-top: 15px;">
        <strong>💪 Lời khuyên của Lê Lê:</strong> Mỗi lần định dịch một câu sang tiếng Trung, các bạn hãy dừng lại 2 giây để nhớ về <strong>luồng trật tự câu</strong> và kiểm tra xem có dùng nhầm phó từ hay không. Kiên trì luyện tập chép câu chuẩn, tư duy của bạn sẽ dần hình thành thói quen nói tự nhiên như người bản xứ!
      </div>
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 10 / 10</div>
    </div>
  </div>

</body>
</html>
"""

# Save to html file
html_file_path = os.path.join(scratch_dir, "generate_grammar_pdf.html")
with open(html_file_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"generate_grammar_pdf.html successfully created at: {html_file_path}")

# Print to PDF using Headless Chrome
print("Calling Headless Chrome to print to PDF...")
chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
output_pdf = "POSTS/docs/DOC-GRAMMAR.pdf"

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
    print(f"Successfully generated Grammar PDF: {output_pdf}")
except subprocess.CalledProcessError as e:
    print("Error calling Chrome to print PDF:")
    print(e.stderr)
    exit(1)
