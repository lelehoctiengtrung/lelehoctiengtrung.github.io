# -*- coding: utf-8 -*-
import subprocess
import os
import shutil
import platform

scratch_dir = "scripts"
os.makedirs(scratch_dir, exist_ok=True)

html_content = """<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Hán Ngữ Cơ Sở 1 - Lê Lê học tiếng Trung</title>
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
      padding: 20mm 15mm 18mm 15mm;
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
    .cover-decor {
      position: absolute;
      top: 10px; left: 10px; right: 10px; bottom: 10px;
      border: 1px dashed rgba(212, 168, 67, 0.3);
      pointer-events: none;
      z-index: 3;
    }
    .cover-hanzi-decor {
      position: absolute;
      font-family: 'Noto Serif SC', serif;
      font-size: 110px;
      color: #D4A843;
      opacity: 0.05;
      font-weight: 900;
      z-index: 2;
    }
    .hz-1 { top: 12%; left: 15%; transform: rotate(-15deg); }
    .hz-2 { top: 18%; right: 15%; transform: rotate(10deg); }
    .hz-3 { bottom: 25%; left: 12%; transform: rotate(8deg); }
    .hz-4 { bottom: 20%; right: 18%; transform: rotate(-12deg); }
    
    .cover-top {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      z-index: 10;
    }
    .cover-badge {
      border: 1px solid #D4A843;
      color: #D4A843;
      padding: 4px 14px;
      border-radius: 999px;
      font-size: 10.5px;
      font-weight: 600;
      letter-spacing: 2px;
      text-transform: uppercase;
      background: rgba(212, 168, 67, 0.08);
    }
    .cover-title {
      font-family: 'Noto Serif SC', serif;
      font-size: 38px;
      font-weight: 900;
      color: #F5E8D0;
      margin: 15px 0 5px 0;
      letter-spacing: 1.5px;
      line-height: 1.25;
    }
    .cover-subtitle {
      font-size: 14.5px;
      letter-spacing: 3px;
      color: #D4A843;
      font-weight: 500;
      margin: 0;
    }
    .cover-divider {
      width: 60px;
      height: 2.5px;
      background: #C94535;
      margin: 25px auto 0 auto;
    }
    .cover-mid {
      z-index: 10;
      margin-top: -3mm;
    }
    .cover-seal {
      width: 125px;
      height: 125px;
      background: #C94535;
      border: 3px solid #D4A843;
      border-radius: 10px;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      box-shadow: 0 8px 24px rgba(201, 69, 53, 0.4);
      margin: 0 auto;
      transform: rotate(-3deg);
    }
    .cover-seal::before {
      content: "";
      position: absolute;
      top: 4px; left: 4px; right: 4px; bottom: 4px;
      border: 1px solid rgba(212, 168, 67, 0.6);
    }
    .cover-seal span {
      font-family: 'Noto Serif SC', serif;
      font-size: 60px;
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
      font-size: 13px;
      color: #F5E8D0;
      opacity: 0.85;
      max-width: 480px;
      line-height: 1.8;
    }
    .cover-author {
      font-size: 12px;
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
      font-size: 19px;
      color: #161310;
      border-bottom: 2.5px solid #C94535;
      padding-bottom: 8px;
      margin-top: 6mm;
      margin-bottom: 5mm;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
    }
    .page-title-zh {
      color: #7c7365;
      font-size: 13px;
      font-weight: 500;
      margin-left: auto;
    }
    
    .section-desc {
      font-size: 12.5px;
      line-height: 1.7;
      color: #4b5563;
      margin-top: 0;
      margin-bottom: 4mm;
    }
    
    /* Info Box */
    .info-box {
      border: 1px solid rgba(212, 168, 67, 0.22);
      background: #faf9f6;
      border-radius: 8px;
      padding: 15px;
      margin-bottom: 4mm;
    }
    .info-box-title {
      font-weight: 700;
      font-size: 12.5px;
      color: #161310;
      margin-top: 0;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .info-box-title.accent { color: #C94535; }
    .info-box-title.gold { color: #D4A843; }
    .info-box ul {
      margin: 0;
      padding-left: 18px;
      font-size: 11.5px;
      color: #4b5563;
      line-height: 1.7;
    }
    .info-box li {
      margin-bottom: 6px;
    }
    
    /* Tables */
    table.content-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 4mm;
      font-size: 11.5px;
    }
    table.content-table th {
      background: #161310;
      color: #F5E8D0;
      font-weight: 600;
      text-align: left;
      padding: 8px 10px;
      border: 1px solid #161310;
    }
    table.content-table td {
      padding: 8px 10px;
      border: 1px solid #e5e7eb;
      color: #374151;
      line-height: 1.5;
    }
    table.content-table tr:nth-child(even) {
      background: #fdfbf7;
    }
    .pinyin-cell {
      font-weight: 600;
      color: #C94535;
    }
    .zh-cell {
      font-family: 'Noto Serif SC', serif;
      font-size: 13.5px;
      font-weight: 700;
      color: #161310;
    }
    
    /* Pinyin Grid Layout */
    .pinyin-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 4mm;
    }
    .pinyin-card {
      background: #fdfbf7;
      border: 1px solid rgba(212, 168, 67, 0.15);
      border-radius: 6px;
      padding: 8px 12px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .pinyin-card-title {
      font-size: 14px;
      font-weight: 700;
      color: #C94535;
    }
    .pinyin-card-desc {
      font-size: 10px;
      color: #6b7280;
      line-height: 1.3;
    }
    .pinyin-card-ex {
      font-size: 11px;
      color: #161310;
      font-weight: 500;
      border-top: 1px dashed rgba(0,0,0,0.06);
      padding-top: 4px;
      margin-top: 2px;
    }
    
    /* Tone diagram */
    .tone-container {
      display: flex;
      justify-content: space-between;
      gap: 15px;
      margin-bottom: 5mm;
    }
    .tone-card {
      flex: 1;
      border: 1.5px solid #e5e7eb;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
      background: white;
      position: relative;
    }
    .tone-card.active-1 { border-color: #C94535; background: #fff5f5; }
    .tone-card.active-2 { border-color: #D4A843; background: #fffdf5; }
    .tone-card.active-3 { border-color: #319795; background: #f0fdfa; }
    .tone-card.active-4 { border-color: #4A90E2; background: #f0f7ff; }
    
    .tone-num {
      position: absolute;
      top: -10px;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 2px 8px;
      font-size: 9.5px;
      font-weight: 700;
      border-radius: 99px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    .tone-card.active-1 .tone-num { border: 1.5px solid #C94535; color: #C94535; }
    .tone-card.active-2 .tone-num { border: 1.5px solid #D4A843; color: #D4A843; }
    .tone-card.active-3 .tone-num { border: 1.5px solid #319795; color: #319795; }
    .tone-card.active-4 .tone-num { border: 1.5px solid #4A90E2; color: #4A90E2; }
    
    .tone-mark {
      font-size: 20px;
      font-weight: 700;
      margin-top: 5px;
      margin-bottom: 2px;
      color: #161310;
    }
    .tone-name {
      font-size: 11.5px;
      font-weight: 600;
      color: #374151;
      margin-bottom: 4px;
    }
    .tone-pitch {
      font-size: 9px;
      color: #6b7280;
    }
    
    /* Mễ Tự 格 */
    .mezi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 15px;
      margin-bottom: 5mm;
    }
    .mezi-box {
      border: 1px solid rgba(212, 168, 67, 0.25);
      border-radius: 6px;
      background: #faf9f6;
      padding: 10px;
      text-align: center;
    }
    .mezi-cell {
      width: 50px;
      height: 50px;
      border: 1px dashed rgba(201, 69, 53, 0.4);
      background: #ffffff;
      margin: 0 auto 8px auto;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .mezi-cell::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 1px;
      background: rgba(201, 69, 53, 0.15);
      top: 50%; left: 0;
    }
    .mezi-cell::after {
      content: "";
      position: absolute;
      height: 100%;
      width: 1px;
      background: rgba(201, 69, 53, 0.15);
      left: 50%; top: 0;
    }
    .mezi-diagonal-1 {
      position: absolute;
      width: 141%;
      height: 1px;
      background: rgba(201, 69, 53, 0.08);
      transform: rotate(45deg);
    }
    .mezi-diagonal-2 {
      position: absolute;
      width: 141%;
      height: 1px;
      background: rgba(201, 69, 53, 0.08);
      transform: rotate(-45deg);
    }
    .mezi-char-trace {
      font-family: 'Noto Serif SC', serif;
      font-size: 34px;
      color: rgba(201, 69, 53, 0.18); /* Trace gray-red color */
      z-index: 2;
    }
    .mezi-label-zh {
      font-family: 'Noto Serif SC', serif;
      font-weight: 700;
      font-size: 13px;
      color: #161310;
      margin-bottom: 2px;
    }
    .mezi-label-pinyin {
      font-weight: 600;
      font-size: 10.5px;
      color: #C94535;
      margin-bottom: 2px;
    }
    .mezi-label-vi {
      font-size: 10px;
      color: #6b7280;
    }
    
    /* Dialogue Box */
    .dialogue-box {
      border-left: 3.5px solid #C94535;
      background: #fdfbf7;
      padding: 12px 15px;
      margin-bottom: 4mm;
      border-radius: 0 8px 8px 0;
    }
    .dialogue-title {
      font-weight: 700;
      font-size: 11.5px;
      color: #7c7365;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
    }
    .dialogue-line {
      margin-bottom: 8px;
      font-size: 11.5px;
      line-height: 1.5;
    }
    .dialogue-line:last-child {
      margin-bottom: 0;
    }
    .speaker {
      font-weight: 700;
      color: #161310;
      margin-right: 5px;
    }
    .speaker-zh {
      font-family: 'Noto Serif SC', serif;
      font-size: 12.5px;
      font-weight: 700;
      color: #C94535;
    }
    .dialogue-zh {
      font-family: 'Noto Serif SC', serif;
      font-size: 13px;
      font-weight: 700;
      color: #161310;
    }
    
    /* Vocabulary list */
    .vocab-list {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 4mm;
    }
    .vocab-item {
      display: flex;
      align-items: center;
      background: #faf9f6;
      border-radius: 5px;
      padding: 6px 10px;
      border: 1px solid rgba(0,0,0,0.03);
    }
    .vocab-item-zh {
      font-family: 'Noto Serif SC', serif;
      font-size: 13.5px;
      font-weight: 700;
      color: #161310;
      width: 45px;
    }
    .vocab-item-py {
      font-weight: 600;
      color: #C94535;
      font-size: 10.5px;
      width: 70px;
    }
    .vocab-item-vi {
      font-size: 10.5px;
      color: #4b5563;
      flex: 1;
    }
  </style>
</head>
<body>

  <!-- PAGE 1: COVER PAGE -->
  <div class="cover-page">
    <div class="cover-decor"></div>
    <div class="cover-hanzi-decor hz-1">学</div>
    <div class="cover-hanzi-decor hz-2">文</div>
    <div class="cover-hanzi-decor hz-3">语</div>
    <div class="cover-hanzi-decor hz-4">书</div>
    
    <div class="cover-top">
      <div class="cover-badge">Lê Lê học tiếng Trung</div>
      <h1 class="cover-title">HÁN NGỮ CƠ SỞ 1</h1>
      <p class="cover-subtitle">汉语基础一</p>
      <div class="cover-divider"></div>
    </div>
    
    <div class="cover-mid">
      <div class="cover-seal">
        <span>乐</span>
      </div>
    </div>
    
    <div class="cover-bottom">
      <p class="cover-desc">
        Cẩm nang tự học tiếng Trung nhập môn toàn diện dành cho người mới bắt đầu từ con số 0. Tổng hợp hệ thống phát âm Pinyin, quy tắc viết chữ Hán cơ bản và 5 bài hội thoại giao tiếp thực tế cốt lõi nhất.
      </p>
      <div class="cover-author">Biên soạn: LÊ LÊ</div>
    </div>
  </div>

  <!-- PAGE 2: INTRODUCTION -->
  <div class="page">
    <div class="header">
      <div class="header-left"><span class="logo-text">乐乐学中文</span> · Hán Ngữ Cơ Sở 1</div>
      <div>Trang 2</div>
    </div>
    
    <h2 class="page-title">
      <span>Lời mở đầu & Lộ trình tự học</span>
      <span class="page-title-zh">前言 & 学习路径</span>
    </h2>
    
    <p class="section-desc">
      Chào các bạn! Lê Lê đây. Hôm nay mình chia sẻ cho các bạn cuốn sổ tay <strong>Hán Ngữ Cơ Sở 1</strong>. Đây là cuốn cẩm nang nhập môn cực kỳ đầy đủ mà mình đã tự tổng hợp lại từ những bài học vỡ lòng ngày đầu tiếp xúc với tiếng Trung. Mình hiểu rằng, khi tự học một ngôn ngữ mới hoàn toàn bằng chữ tượng hình, các bạn sẽ không tránh khỏi cảm giác bối rối: bắt đầu từ đâu? làm sao để phát âm đúng? viết thế nào cho đẹp?
    </p>
    <p class="section-desc">
      Cuốn tài liệu này chính là lời giải đáp toàn diện nhất! Nó được thiết kế với cấu trúc logic 3 phần rõ ràng: Hệ thống Pinyin chuẩn hóa, Các nét và quy tắc bút thuận nền tảng, cùng 5 Bài học giao tiếp căn bản nhất. Hy vọng cuốn tài liệu này sẽ là người bạn đồng hành tin cậy, tiếp thêm động lực cho các bạn trên con đường chinh phục tiếng Trung nhé! Cố lên nhé các bạn cùng học!
    </p>
    
    <div class="info-box">
      <div class="info-box-title accent">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 11.08 12 19 2 11.08"/><polyline points="22 4 12 12 2 4"/></svg>
        Lộ trình 5 bước chinh phục tiếng Trung cho người mới bắt đầu
      </div>
      <ul>
        <li><strong>Bước 1: Làm chủ Pinyin (Phiên âm)</strong> — Học kỹ bảng Thanh mẫu, Vận mẫu và luyện cơ miệng đúng khẩu hình. Đây là nền móng để nghe chuẩn, nói rõ.</li>
        <li><strong>Bước 2: Nắm vững quy tắc Bút thuận</strong> — Thuộc lòng 8 nét cơ bản và 7 quy tắc viết chữ Hán để viết nhanh, cân đối và không bao giờ quên nét.</li>
        <li><strong>Bước 3: Nhận diện Bộ thủ cốt lõi</strong> — Học trước các bộ thủ thông dụng nhất (như bộ Nhân, bộ Nữ, bộ Khẩu...). Bộ thủ chính là các mảnh ghép cấu tạo nên chữ Hán.</li>
        <li><strong>Bước 4: Tích lũy vốn từ & Mẫu câu qua ngữ cảnh</strong> — Đừng học từ vựng riêng lẻ, hãy học qua các đoạn hội thoại ngắn để nhớ cả phản xạ và từ vựng.</li>
        <li><strong>Bước 5: Luyện nghe nói chủ động hằng ngày</strong> — Tập đọc to các câu ví dụ, tự ghi âm giọng đọc của mình để đối chiếu phát âm với người bản xứ.</li>
      </ul>
    </div>
    
    <div class="info-box" style="border-color: rgba(201, 69, 53, 0.2); background: #fffafb;">
      <div class="info-box-title accent">
        📌 Cách sử dụng tài liệu hiệu quả
      </div>
      <p class="section-desc" style="font-size: 11px; margin-bottom: 0;">
        Các bạn hãy in tài liệu này ra khổ giấy A4, học lần lượt từng trang. Với phần Pinyin, hãy vừa đọc vừa nhìn khẩu hình. Với phần chữ Hán, hãy dùng ô ly Mễ Tự để tập viết đè lên nét mờ (trace) trước để quen tay, sau đó tự viết lại ở vở riêng. Cuối cùng, hãy học thuộc các bài hội thoại thực tế ở cuối tập tài liệu!
      </p>
    </div>
    
    <div class="footer">
      <div>© Lê Lê học tiếng Trung</div>
      <div>lelehoctiengtrung.com</div>
    </div>
  </div>

  <!-- PAGE 3: PINYIN INITIALS -->
  <div class="page">
    <div class="header">
      <div class="header-left"><span class="logo-text">乐乐学中文</span> · Hán Ngữ Cơ Sở 1</div>
      <div>Trang 3</div>
    </div>
    
    <h2 class="page-title">
      <span>Phát âm Pinyin: Thanh Mẫu (Phụ âm)</span>
      <span class="page-title-zh">声母表</span>
    </h2>
    
    <p class="section-desc">
      Hệ phiên âm Pinyin gồm 21 Thanh mẫu (phụ âm). Dưới đây là bảng tổng hợp chi tiết phân nhóm theo vị trí phát âm, kèm theo âm tương đương trong tiếng Việt để các bạn dễ hình dung và bắt chước:
    </p>
    
    <div class="pinyin-grid">
      <div class="pinyin-card">
        <span class="pinyin-card-title">b</span>
        <span class="pinyin-card-desc">Âm hai môi. Gần giống âm "p" của tiếng Việt (không bật hơi).</span>
        <span class="pinyin-card-ex">Ví dụ: 爸 bà (bố)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">p</span>
        <span class="pinyin-card-desc">Âm hai môi, bật hơi mạnh. Khẩu hình giống "b" nhưng đẩy hơi ra ngoài.</span>
        <span class="pinyin-card-ex">Ví dụ: 苹果 píngguǒ</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">m</span>
        <span class="pinyin-card-desc">Âm hai môi. Giống âm "m" trong tiếng Việt.</span>
        <span class="pinyin-card-ex">Ví dụ: 妈 mā (mẹ)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">f</span>
        <span class="pinyin-card-desc">Âm răng môi. Giống âm "ph" trong tiếng Việt.</span>
        <span class="pinyin-card-ex">Ví dụ: 发 fā (phát)</span>
      </div>
      
      <div class="pinyin-card">
        <span class="pinyin-card-title">d</span>
        <span class="pinyin-card-desc">Âm đầu lưỡi. Gần giống âm "t" của tiếng Việt (không bật hơi).</span>
        <span class="pinyin-card-ex">Ví dụ: 大 dà (lớn)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">t</span>
        <span class="pinyin-card-desc">Âm đầu lưỡi, bật hơi mạnh. Khẩu hình giống "d" nhưng đẩy hơi ra.</span>
        <span class="pinyin-card-ex">Ví dụ: 天 tiān (trời)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">n</span>
        <span class="pinyin-card-desc">Âm đầu lưỡi. Giống âm "n" trong tiếng Việt.</span>
        <span class="pinyin-card-ex">Ví dụ: 你 nǐ (bạn)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">l</span>
        <span class="pinyin-card-desc">Âm đầu lưỡi. Giống âm "l" trong tiếng Việt.</span>
        <span class="pinyin-card-ex">Ví dụ: 累 lèi (mệt)</span>
      </div>
      
      <div class="pinyin-card">
        <span class="pinyin-card-title">g</span>
        <span class="pinyin-card-desc">Âm cuống lưỡi. Gần giống âm "c/k" của tiếng Việt (không bật hơi).</span>
        <span class="pinyin-card-ex">Ví dụ: 哥 gē (anh trai)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">k</span>
        <span class="pinyin-card-desc">Âm cuống lưỡi, bật hơi mạnh. Hơi đẩy ra từ cuống họng sâu.</span>
        <span class="pinyin-card-ex">Ví dụ: 课 kè (bài học)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">h</span>
        <span class="pinyin-card-desc">Âm cuống lưỡi. Gần giống âm "h" nhưng nhẹ và sát cuống lưỡi hơn.</span>
        <span class="pinyin-card-ex">Ví dụ: 好 hǎo (tốt)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">j</span>
        <span class="pinyin-card-desc">Âm mặt lưỡi. Gần giống âm "ch" trong tiếng Việt (không bật hơi).</span>
        <span class="pinyin-card-ex">Ví dụ: 叫 jiào (gọi)</span>
      </div>
      
      <div class="pinyin-card">
        <span class="pinyin-card-title">q</span>
        <span class="pinyin-card-desc">Âm mặt lưỡi, bật hơi mạnh. Khẩu hình giống "j" nhưng bật hơi.</span>
        <span class="pinyin-card-ex">Ví dụ: 钱 qián (tiền)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">x</span>
        <span class="pinyin-card-desc">Âm mặt lưỡi. Gần giống âm "x" của tiếng Việt.</span>
        <span class="pinyin-card-ex">Ví dụ: 谢 xiè (cảm ơn)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">zh</span>
        <span class="pinyin-card-desc">Âm đầu lưỡi quặt (tròn môi). Gần giống "tr" (không bật hơi).</span>
        <span class="pinyin-card-ex">Ví dụ: 这 zhè (đây)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">ch</span>
        <span class="pinyin-card-desc">Âm quặt lưỡi, bật hơi mạnh. Khẩu hình giống "zh" nhưng bật hơi.</span>
        <span class="pinyin-card-ex">Ví dụ: 吃 chī (ăn)</span>
      </div>
      
      <div class="pinyin-card">
        <span class="pinyin-card-title">sh</span>
        <span class="pinyin-card-desc">Âm quặt lưỡi. Gần giống âm "s" (uốn lưỡi) của tiếng Việt.</span>
        <span class="pinyin-card-ex">Ví dụ: 是 shì (là)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">r</span>
        <span class="pinyin-card-desc">Âm quặt lưỡi. Gần giống âm "r" tiếng Việt nhưng không rung lưỡi.</span>
        <span class="pinyin-card-ex">Ví dụ: 人 rén (người)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">z</span>
        <span class="pinyin-card-desc">Âm đầu lưỡi trước. Gần giống âm "ch" kết hợp "x" (không bật hơi).</span>
        <span class="pinyin-card-ex">Ví dụ: 再 zài (lại)</span>
      </div>
      <div class="pinyin-card">
        <span class="pinyin-card-title">c</span>
        <span class="pinyin-card-desc">Âm đầu lưỡi trước, bật hơi mạnh. Đầu lưỡi chặn hơi rồi đẩy hơi ra.</span>
        <span class="pinyin-card-ex">Ví dụ: 菜 cài (món ăn)</span>
      </div>
    </div>
    
    <div class="info-box">
      <div class="info-box-title gold">
        💡 Lưu ý quan trọng về Âm bật hơi (Aspirated sounds)
      </div>
      <p class="section-desc" style="font-size: 11px; margin-bottom: 0;">
        Trong tiếng Trung, sự phân biệt giữa <strong>bật hơi</strong> và <strong>không bật hơi</strong> cực kỳ quan trọng. Các cặp âm đối lập như: <strong>b/p</strong>, <strong>d/t</strong>, <strong>g/k</strong>, <strong>j/q</strong>, <strong>zh/ch</strong>, <strong>z/c</strong>. Cách luyện tập: Hãy đặt một tờ giấy mỏng trước miệng. Khi đọc âm bật hơi (ví dụ "p", "t", "q"), luồng hơi thoát ra mạnh làm tờ giấy rung mạnh. Khi đọc âm không bật hơi (ví dụ "b", "d", "j"), tờ giấy hầu như không chuyển động.
      </p>
    </div>
    
    <div class="footer">
      <div>© Lê Lê học tiếng Trung</div>
      <div>lelehoctiengtrung.com</div>
    </div>
  </div>

  <!-- PAGE 4: PINYIN FINALS -->
  <div class="page">
    <div class="header">
      <div class="header-left"><span class="logo-text">乐乐学中文</span> · Hán Ngữ Cơ Sở 1</div>
      <div>Trang 4</div>
    </div>
    
    <h2 class="page-title">
      <span>Phát âm Pinyin: Vận Mẫu (Nguyên âm)</span>
      <span class="page-title-zh">韵母表</span>
    </h2>
    
    <p class="section-desc">
      Hệ thống Pinyin gồm 36 Vận mẫu (nguyên âm), gồm nguyên âm đơn, nguyên âm kép và nguyên âm mũi. Dưới đây là bảng tổng hợp các vận mẫu phổ biến nhất:
    </p>
    
    <table class="content-table">
      <thead>
        <tr>
          <th style="width: 20%">Vận mẫu</th>
          <th style="width: 35%">Cách phát âm tương đương</th>
          <th style="width: 45%">Ví dụ thực tế</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="pinyin-cell">a</td>
          <td>Giống âm "a" trong tiếng Việt.</td>
          <td><span class="zh-cell">爸爸</span> bàba (bố)</td>
        </tr>
        <tr>
          <td class="pinyin-cell">o</td>
          <td>Môi tròn. Gần giống âm "ô" hoặc "ua" nhẹ.</td>
          <td><span class="zh-cell">我</span> wǒ (tôi)</td>
        </tr>
        <tr>
          <td class="pinyin-cell">e</td>
          <td>Gần giống âm "ơ" hoặc "ưa" trong tiếng Việt.</td>
          <td><span class="zh-cell">哥哥</span> gēge (anh trai)</td>
        </tr>
        <tr>
          <td class="pinyin-cell">i</td>
          <td>Giống âm "i" tiếng Việt. (Đọc "ư" sau: zh, ch, sh, r, z, c, s).</td>
          <td><span class="zh-cell">你</span> nǐ (bạn) / <span class="zh-cell">吃</span> chī (ăn)</td>
        </tr>
        <tr>
          <td class="pinyin-cell">u</td>
          <td>Tròn môi. Giống âm "u" tiếng Việt.</td>
          <td><span class="zh-cell">不</span> bù (không)</td>
        </tr>
        <tr>
          <td class="pinyin-cell">ü</td>
          <td>Tròn môi. Giống âm "uy" tiếng Việt nhưng giữ nguyên môi tròn.</td>
          <td><span class="zh-cell">绿</span> lǜ (xanh lá)</td>
        </tr>
        <tr>
          <td class="pinyin-cell">ai</td>
          <td>Giống âm "ai" trong tiếng Việt.</td>
          <td><span class="zh-cell">买</span> mǎi (mua)</td>
        </tr>
        <tr>
          <td class="pinyin-cell">ei</td>
          <td>Giống âm "ây" trong tiếng Việt.</td>
          <td><span class="zh-cell">累</span> lèi (mệt)</td>
        </tr>
        <tr>
          <td class="pinyin-cell">ao</td>
          <td>Giống âm "ao" trong tiếng Việt.</td>
          <td><span class="zh-cell">好</span> hǎo (tốt)</td>
        </tr>
        <tr>
          <td class="pinyin-cell">ou</td>
          <td>Giống âm "âu" trong tiếng Việt.</td>
          <td><span class="zh-cell">走</span> zǒu (đi)</td>
        </tr>
        <tr>
          <td class="pinyin-cell">ia</td>
          <td>Gần giống âm "ia" hoặc "ya" trong tiếng Việt.</td>
          <td><span class="zh-cell">家</span> jiā (nhà)</td>
        </tr>
        <tr>
          <td class="pinyin-cell">ie</td>
          <td>Gần giống âm "iê" trong tiếng Việt.</td>
          <td><span class="zh-cell">谢谢</span> xièxie (cảm ơn)</td>
        </tr>
        <tr>
          <td class="pinyin-cell">an</td>
          <td>Giống âm "an" trong tiếng Việt.</td>
          <td><span class="zh-cell">钱</span> qián (tiền)</td>
        </tr>
        <tr>
          <td class="pinyin-cell">ang</td>
          <td>Giống âm "ang" trong tiếng Việt.</td>
          <td><span class="zh-cell">忙</span> máng (bận)</td>
        </tr>
      </tbody>
    </table>
    
    <div class="info-box">
      <div class="info-box-title gold">
        💡 Mẹo phát âm Vận mẫu đặc biệt "ü"
      </div>
      <p class="section-desc" style="font-size: 11px; margin-bottom: 0;">
        Vận mẫu <strong>ü</strong> (u có hai chấm trên đầu) là nguyên âm khó đối với nhiều bạn. Mẹo luyện: Hãy phát âm chữ <strong>"i"</strong> (kéo dài âm "iiii"). Trong khi giữ nguyên vị trí lưỡi và khoang miệng của âm "i", từ từ tròn môi lại thành khẩu hình của âm <strong>"u"</strong>. Âm phát ra chính xác là "ü"! Chú ý khi viết pinyin đi với j, q, x, y thì hai chấm trên đầu "ü" sẽ tự động được lược bỏ (ví dụ: q + ü -> qu).
      </p>
    </div>
    
    <div class="footer">
      <div>© Lê Lê học tiếng Trung</div>
      <div>lelehoctiengtrung.com</div>
    </div>
  </div>

  <!-- PAGE 5: TONES & TONE CHANGES -->
  <div class="page">
    <div class="header">
      <div class="header-left"><span class="logo-text">乐乐学中文</span> · Hán Ngữ Cơ Sở 1</div>
      <div>Trang 5</div>
    </div>
    
    <h2 class="page-title">
      <span>Thanh điệu & Các quy tắc biến điệu</span>
      <span class="page-title-zh">声调 & 变调</span>
    </h2>
    
    <p class="section-desc">
      Tiếng Trung có 4 thanh điệu chính và 1 thanh nhẹ (khinh thanh). Thanh điệu thay đổi sẽ làm nghĩa của từ thay đổi hoàn toàn:
    </p>
    
    <div class="tone-container">
      <div class="tone-card active-1">
        <div class="tone-num">Thanh 1</div>
        <div class="tone-mark">ā</div>
        <div class="tone-name">Thanh ngang</div>
        <div class="tone-pitch">Cao và bằng phẳng (5-5)</div>
      </div>
      <div class="tone-card active-2">
        <div class="tone-num">Thanh 2</div>
        <div class="tone-mark">á</div>
        <div class="tone-name">Thanh sắc</div>
        <div class="tone-pitch">Vuốt từ vừa lên cao (3-5)</div>
      </div>
      <div class="tone-card active-3">
        <div class="tone-num">Thanh 3</div>
        <div class="tone-mark">ǎ</div>
        <div class="tone-name">Thanh hỏi</div>
        <div class="tone-pitch">Xuống thấp rồi lên vừa (2-1-4)</div>
      </div>
      <div class="tone-card active-4">
        <div class="tone-num">Thanh 4</div>
        <div class="tone-mark">à</div>
        <div class="tone-name">Thanh huyền</div>
        <div class="tone-pitch">Đi nhanh từ cao xuống thấp (5-1)</div>
      </div>
    </div>
    
    <div class="info-box">
      <div class="info-box-title accent">
        ⚠️ Quy tắc biến điệu bắt buộc phải thuộc lòng
      </div>
      <ul>
        <li>
          <strong>Biến điệu của hai Thanh 3 đi liền nhau ( 3 + 3 -> 2 + 3 ):</strong><br>
          Khi hai âm tiết mang thanh 3 đi liền nhau, thanh 3 thứ nhất sẽ chuyển sang phát âm thành thanh 2.<br>
          <em>Ví dụ:</em> 你 nǐ + 好 hǎo -> đọc là <strong>Nǐ hǎo</strong> (chứ không đọc nỉ hảo).
        </li>
        <li>
          <strong>Biến điệu của phó từ "不" (bù - Không):</strong><br>
          Bình thường "不" mang thanh 4. Nhưng khi đứng trước một từ cũng mang thanh 4, nó sẽ chuyển sang đọc thành thanh 2 (bú).<br>
          <em>Ví dụ:</em> 不 bù + 是 shì -> đọc là <strong>bú shì</strong> / 不 bù + 对 duì -> đọc là <strong>bú duì</strong>.
        </li>
        <li>
          <strong>Biến điệu của từ chỉ số lượng "一" (yī - Số 1):</strong><br>
          Bình thường "一" đọc thanh 1 (yī).<br>
          - Khi đứng trước từ mang thanh 4, "一" chuyển sang đọc thanh 2 (yí). Ví dụ: 一样 yí yàng.<br>
          - Khi đứng trước từ mang thanh 1, 2, 3, "一" chuyển sang đọc thanh 4 (yì). Ví dụ: 一天 yì tiān, 一起 yì qǐ.
        </li>
      </ul>
    </div>
    
    <div class="footer">
      <div>© Lê Lê học tiếng Trung</div>
      <div>lelehoctiengtrung.com</div>
    </div>
  </div>

  <!-- PAGE 6: HANZI BASICS & STROKES -->
  <div class="page">
    <div class="header">
      <div class="header-left"><span class="logo-text">乐乐学中文</span> · Hán Ngữ Cơ Sở 1</div>
      <div>Trang 6</div>
    </div>
    
    <h2 class="page-title">
      <span>Nền tảng chữ Hán: Nét viết & Quy tắc bút thuận</span>
      <span class="page-title-zh">汉字笔画 & 笔顺规则</span>
    </h2>
    
    <p class="section-desc">
      Chữ Hán được cấu thành từ 8 nét cơ bản. Viết chữ Hán đúng thứ tự nét (bút thuận) sẽ giúp chữ cân đối, tròn trịa và dễ nhớ mặt chữ hơn:
    </p>
    
    <table class="content-table" style="margin-bottom: 5mm;">
      <thead>
        <tr>
          <th style="width: 15%">Tên nét</th>
          <th style="width: 15%; text-align: center;">Ký hiệu</th>
          <th style="width: 35%">Mô tả cách viết</th>
          <th style="width: 35%">Ví dụ chữ Hán</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Ngang (Héng)</td>
          <td style="text-align: center; font-size: 16px; font-weight: bold;">一</td>
          <td>Viết thẳng từ trái sang phải.</td>
          <td><span class="zh-cell">三</span> sān (số 3)</td>
        </tr>
        <tr>
          <td>Dọc (Shù)</td>
          <td style="text-align: center; font-size: 16px; font-weight: bold;">丨</td>
          <td>Viết thẳng từ trên xuống dưới.</td>
          <td><span class="zh-cell">十</span> shí (số 10)</td>
        </tr>
        <tr>
          <td>Phẩy (Piě)</td>
          <td style="text-align: center; font-size: 16px; font-weight: bold;">丿</td>
          <td>Cong nhẹ từ trên xuống dưới về bên trái.</td>
          <td><span class="zh-cell">八</span> bā (số 8)</td>
        </tr>
        <tr>
          <td>Mác (Nà)</td>
          <td style="text-align: center; font-size: 16px; font-weight: bold;">乀</td>
          <td>Cong nhẹ từ trên xuống dưới về bên phải.</td>
          <td><span class="zh-cell">人</span> rén (người)</td>
        </tr>
        <tr>
          <td>Chấm (Diǎn)</td>
          <td style="text-align: center; font-size: 16px; font-weight: bold;">丶</td>
          <td>Một điểm nhấn nhẹ từ trên xuống.</td>
          <td><span class="zh-cell">六</span> liù (số 6)</td>
        </tr>
        <tr>
          <td>Hất (Tí)</td>
          <td style="text-align: center; font-size: 16px; font-weight: bold;">_↗</td>
          <td>Nhấn bút từ dưới hất chéo lên bên phải.</td>
          <td><span class="zh-cell">我</span> wǒ (tôi)</td>
        </tr>
      </tbody>
    </table>
    
    <div class="info-box">
      <div class="info-box-title gold">
        ✍️ 7 Quy tắc bút thuận kinh điển (Stroke Order Rules)
      </div>
      <p class="section-desc" style="font-size: 11px; margin-bottom: 8px;">
        Khi viết bất kỳ chữ Hán nào, các bạn hãy tuân thủ tuyệt đối các nguyên tắc sắp xếp thứ tự nét sau:
      </p>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 10.5px; color: #4b5563; line-height: 1.5;">
        <div>1. <strong>Ngang trước dọc sau</strong> (Ví dụ chữ 十)</div>
        <div>2. <strong>Phẩy trước mác sau</strong> (Ví dụ chữ 人)</div>
        <div>3. <strong>Trên trước dưới sau</strong> (Ví dụ chữ 三)</div>
        <div>4. <strong>Trái trước phải sau</strong> (Ví dụ chữ 你)</div>
        <div>5. <strong>Ngoài trước trong sau</strong> (Ví dụ chữ 月)</div>
        <div>6. <strong>Vào trước đóng sau</strong> (Ví dụ chữ 国)</div>
        <div style="grid-column: span 2;">7. <strong>Giữa trước hai bên sau</strong> (Ví dụ chữ 小, 水)</div>
      </div>
    </div>
    
    <div class="footer">
      <div>© Lê Lê học tiếng Trung</div>
      <div>lelehoctiengtrung.com</div>
    </div>
  </div>

  <!-- PAGE 7: CORE RADICALS -->
  <div class="page">
    <div class="header">
      <div class="header-left"><span class="logo-text">乐乐学中文</span> · Hán Ngữ Cơ Sở 1</div>
      <div>Trang 7</div>
    </div>
    
    <h2 class="page-title">
      <span>12 Bộ thủ cốt lõi cho người mới bắt đầu</span>
      <span class="page-title-zh">十二核心部首</span>
    </h2>
    
    <p class="section-desc">
      Bộ thủ là các ký tự đại diện cho ý nghĩa chung của chữ Hán. Nhận biết bộ thủ giúp bạn đoán được nghĩa của chữ mới rất nhanh:
    </p>
    
    <table class="content-table" style="font-size: 11px;">
      <thead>
        <tr>
          <th style="width: 12%">Bộ thủ</th>
          <th style="width: 15%">Tên bộ thủ</th>
          <th style="width: 23%">Ý nghĩa biểu thị</th>
          <th style="width: 50%">Ví dụ chữ Hán có bộ này</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="zh-cell" style="color: #C94535; font-size: 15px;">人 (亻)</td>
          <td>Bộ Nhân</td>
          <td>Chỉ con người, hành vi</td>
          <td><span class="zh-cell">你</span> (bạn), <span class="zh-cell">他</span> (anh ấy), <span class="zh-cell">们</span> (các bạn)</td>
        </tr>
        <tr>
          <td class="zh-cell" style="color: #C94535; font-size: 15px;">女</td>
          <td>Bộ Nữ</td>
          <td>Chỉ phụ nữ, phái đẹp</td>
          <td><span class="zh-cell">妈</span> (mẹ), <span class="zh-cell">姐</span> (chị gái), <span class="zh-cell">好</span> (tốt đẹp)</td>
        </tr>
        <tr>
          <td class="zh-cell" style="color: #C94535; font-size: 15px;">口</td>
          <td>Bộ Khẩu</td>
          <td>Cái miệng, ăn, nói, hỏi</td>
          <td><span class="zh-cell">叫</span> (gọi), <span class="zh-cell">吃</span> (ăn), <span class="zh-cell">吗</span> (trợ từ hỏi)</td>
        </tr>
        <tr>
          <td class="zh-cell" style="color: #C94535; font-size: 15px;">氵</td>
          <td>Bộ Thủy</td>
          <td>Chỉ nước, chất lỏng</td>
          <td><span class="zh-cell">汉</span> (Hán), <span class="zh-cell">没</span> (không có), <span class="zh-cell">河</span> (sông)</td>
        </tr>
        <tr>
          <td class="zh-cell" style="color: #C94535; font-size: 15px;">木</td>
          <td>Bộ Mộc</td>
          <td>Cây cối, đồ bằng gỗ</td>
          <td><span class="zh-cell">林</span> (rừng), <span class="zh-cell">桌</span> (bàn), <span class="zh-cell">本</span> (sách, cuốn)</td>
        </tr>
        <tr>
          <td class="zh-cell" style="color: #C94535; font-size: 15px;">日</td>
          <td>Bộ Nhật</td>
          <td>Mặt trời, thời gian</td>
          <td><span class="zh-cell">明</span> (sáng), <span class="zh-cell">时</span> (thời gian), <span class="zh-cell">星</span> (ngôi sao)</td>
        </tr>
        <tr>
          <td class="zh-cell" style="color: #C94535; font-size: 15px;">讠</td>
          <td>Bộ Ngôn</td>
          <td>Ngôn từ, lời nói</td>
          <td><span class="zh-cell">语</span> (ngôn ngữ), <span class="zh-cell">说</span> (nói), <span class="zh-cell">谢</span> (cảm ơn)</td>
        </tr>
        <tr>
          <td class="zh-cell" style="color: #C94535; font-size: 15px;">饣</td>
          <td>Bộ Thực</td>
          <td>Thức ăn, việc ăn uống</td>
          <td><span class="zh-cell">饭</span> (cơm), <span class="zh-cell">饮</span> (uống), <span class="zh-cell">馆</span> (quán)</td>
        </tr>
      </tbody>
    </table>
    
    <div class="info-box">
      <div class="info-box-title gold">
        💡 Trực quan liên tưởng ghi nhớ Bộ thủ
      </div>
      <p class="section-desc" style="font-size: 11px; margin-bottom: 0;">
        Hãy học chữ Hán bằng phương pháp tượng hình liên tưởng. Ví dụ: Chữ <strong>好 (hǎo - Tốt, đẹp)</strong> được ghép từ bộ <strong>女 (Nữ - phụ nữ)</strong> đứng cạnh bộ <strong>子 (Tử - đứa con)</strong>. Người xưa quan niệm rằng người phụ nữ có cả con gái lẫn con trai (hoặc sinh được con) thì đó là điều may mắn, tốt đẹp nhất! Học chữ gắn liền với câu chuyện bộ thủ sẽ giúp bạn nhớ chữ rất lâu.
      </p>
    </div>
    
    <div class="footer">
      <div>© Lê Lê học tiếng Trung</div>
      <div>lelehoctiengtrung.com</div>
    </div>
  </div>

  <!-- PAGE 8: LESSON 1 -->
  <div class="page">
    <div class="header">
      <div class="header-left"><span class="logo-text">乐乐学中文</span> · Hán Ngữ Cơ Sở 1</div>
      <div>Trang 8</div>
    </div>
    
    <h2 class="page-title">
      <span>Bài 1: Chào hỏi & Giới thiệu bản thân</span>
      <span class="page-title-zh">第一课：问候 & 自我介绍</span>
    </h2>
    
    <div class="dialogue-box">
      <div class="dialogue-title">Hội thoại mẫu (会话)</div>
      <div class="dialogue-line">
        <span class="speaker">A:</span> <span class="dialogue-zh">你好！你叫什么名字？</span><br>
        <span class="pinyin-cell">Nǐ hǎo! Nǐ jiào shénme míngzì?</span><br>
        <span class="vocab-item-vi">Chào bạn! Bạn tên là gì?</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">B:</span> <span class="dialogue-zh">你好！我叫大卫。你呢?</span><br>
        <span class="pinyin-cell">Nǐ hǎo! Wò jiào Dàwèi. Nǐ ne?</span><br>
        <span class="vocab-item-vi">Chào bạn! Tôi tên là David. Còn bạn?</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">A:</span> <span class="dialogue-zh">我叫李华。我是学生，你是老师吗？</span><br>
        <span class="pinyin-cell">Wǒ jiào Lǐ Huá. Wǒ shì xuéshēng, nǐ shì lǎoshī ma?</span><br>
        <span class="vocab-item-vi">Tôi tên là Lý Hoa. Tôi là học sinh, bạn là giáo viên phải không?</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">B:</span> <span class="dialogue-zh">我不是老师，我也是学生。</span><br>
        <span class="pinyin-cell">Wǒ bú shì lǎoshī, wǒ yě shì xuéshēng.</span><br>
        <span class="vocab-item-vi">Tôi không phải là giáo viên, tôi cũng là học sinh.</span>
      </div>
    </div>
    
    <h3 style="font-size: 12.5px; color: #161310; margin-top: 10px; margin-bottom: 5px;">Từ vựng cốt lõi (生词)</h3>
    <div class="vocab-list">
      <div class="vocab-item">
        <span class="vocab-item-zh">你</span>
        <span class="vocab-item-py">nǐ</span>
        <span class="vocab-item-vi">bạn, anh, chị (ngôi thứ 2)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">好</span>
        <span class="vocab-item-py">hǎo</span>
        <span class="vocab-item-vi">tốt, đẹp, khoẻ, ngon</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">我</span>
        <span class="vocab-item-py">wǒ</span>
        <span class="vocab-item-vi">tôi, tớ, mình (ngôi thứ 1)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">叫</span>
        <span class="vocab-item-py">jiào</span>
        <span class="vocab-item-vi">gọi là, tên là</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">什么</span>
        <span class="vocab-item-py">shénme</span>
        <span class="vocab-item-vi">cái gì, gì (đại từ nghi vấn)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">名字</span>
        <span class="vocab-item-py">míngzì</span>
        <span class="vocab-item-vi">tên, danh xưng</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">是</span>
        <span class="vocab-item-py">shì</span>
        <span class="vocab-item-vi">là (động từ liên kết)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">学生</span>
        <span class="vocab-item-py">xuéshēng</span>
        <span class="vocab-item-vi">học sinh, sinh viên</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">老师</span>
        <span class="vocab-item-py">lǎoshī</span>
        <span class="vocab-item-vi">thầy giáo, cô giáo</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">也</span>
        <span class="vocab-item-py">yě</span>
        <span class="vocab-item-vi">cũng (phó từ)</span>
      </div>
    </div>
    
    <div class="info-box">
      <div class="info-box-title gold">
        📌 Ngữ pháp cơ bản: Trợ từ nghi vấn "吗" (ma) & Phó từ phủ định "不" (bù)
      </div>
      <p class="section-desc" style="font-size: 11px; margin-bottom: 0;">
        1. <strong>Cấu trúc câu hỏi Có/Không:</strong> Khẳng định + 吗?. Bạn chỉ cần thêm "吗" vào cuối câu trần thuật để biến nó thành câu hỏi. Ví dụ: 你是老师 (Bạn là giáo viên) -> 你est là giáo viên吗? (Bạn là giáo viên phải không?).<br>
        2. <strong>Cấu trúc phủ định với "不":</strong> Chủ ngữ + 不 + Động từ/Tính từ. Ví dụ: 我不是老师 (Tôi không phải là giáo viên). Chú ý khi đọc "不" đi với "是" (thanh 4) chuyển đọc thành "bú shì".
      </p>
    </div>
    
    <div class="footer">
      <div>© Lê Lê học tiếng Trung</div>
      <div>lelehoctiengtrung.com</div>
    </div>
  </div>

  <!-- PAGE 9: LESSON 2 -->
  <div class="page">
    <div class="header">
      <div class="header-left"><span class="logo-text">乐乐学中文</span> · Hán Ngữ Cơ Sở 1</div>
      <div>Trang 9</div>
    </div>
    
    <h2 class="page-title">
      <span>Bài 2: Hỏi thăm sức khỏe & Công việc</span>
      <span class="page-title-zh">第二课：身体 & 工作</span>
    </h2>
    
    <div class="dialogue-box">
      <div class="dialogue-title">Hội thoại mẫu (会话)</div>
      <div class="dialogue-line">
        <span class="speaker">A:</span> <span class="dialogue-zh">你好吗？ gần đây bận không?</span><br>
        <span class="pinyin-cell">Nǐ hǎo ma? Zuìjìn máng ma?</span><br>
        <span class="vocab-item-vi">Bạn khoẻ không? Gần đây bận không?</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">B:</span> <span class="dialogue-zh">我很忙，你 đây?</span><br>
        <span class="pinyin-cell">Wǒ hěn máng, nǐ ne?</span><br>
        <span class="vocab-item-vi">Tôi rất bận, còn bạn thì sao?</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">A:</span> <span class="dialogue-zh">我不太忙。你爸爸妈妈身体好吗？</span><br>
        <span class="pinyin-cell">Wǒ bú tài máng. Nǐ bàba māma shēntǐ hǎo ma?</span><br>
        <span class="vocab-item-vi">Tôi không bận lắm. Bố mẹ bạn sức khoẻ thế nào?</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">B:</span> <span class="dialogue-zh">他们身体都很好。谢谢！</span><br>
        <span class="pinyin-cell">Tāmen shēntǐ dōu hěn hǎo. Xièxie!</span><br>
        <span class="vocab-item-vi">Sức khoẻ của họ đều rất tốt. Cảm ơn bạn!</span>
      </div>
    </div>
    
    <h3 style="font-size: 12.5px; color: #161310; margin-top: 10px; margin-bottom: 5px;">Từ vựng cốt lõi (生词)</h3>
    <div class="vocab-list">
      <div class="vocab-item">
        <span class="vocab-item-zh">最近</span>
        <span class="vocab-item-py">zuìjìn</span>
        <span class="vocab-item-vi">gần đây (danh từ thời gian)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">忙</span>
        <span class="vocab-item-py">máng</span>
        <span class="vocab-item-vi">bận rộn (tính từ)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">很</span>
        <span class="vocab-item-py">hěn</span>
        <span class="vocab-item-vi">rất (phó từ chỉ mức độ)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">呢</span>
        <span class="vocab-item-py">ne</span>
        <span class="vocab-item-vi">thế sao, thế còn... (trợ từ ngữ khí)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">太</span>
        <span class="vocab-item-py">tài</span>
        <span class="vocab-item-vi">quá, lắm (ví dụ: Không bận lắm)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">爸爸</span>
        <span class="vocab-item-py">bàba</span>
        <span class="vocab-item-vi">bố, ba, cha</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">妈妈</span>
        <span class="vocab-item-py">māma</span>
        <span class="vocab-item-vi">mẹ, má, u</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">身体</span>
        <span class="vocab-item-py">shēntǐ</span>
        <span class="vocab-item-vi">thân thể, sức khoẻ</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">他们</span>
        <span class="vocab-item-py">tāmen</span>
        <span class="vocab-item-vi">họ, bọn họ</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">都</span>
        <span class="vocab-item-py">dōu</span>
        <span class="vocab-item-vi">đều (phó từ phạm vi)</span>
      </div>
    </div>
    
    <div class="info-box">
      <div class="info-box-title gold">
        📌 Ngữ pháp cơ bản: Cấu trúc vị ngữ tính từ & cách dùng "不太"
      </div>
      <p class="section-desc" style="font-size: 11px; margin-bottom: 0;">
        1. <strong>Câu vị ngữ tính từ:</strong> Chủ ngữ + Phó từ chỉ mức độ (như 很 hěn, 太 tài) + Tính từ. Trong tiếng Trung, khi vị ngữ là tính từ, ta không dùng động từ liên kết "是". Ví dụ: 我很忙 (Tôi rất bận - không nói 我是很忙).<br>
        2. <strong>Cấu trúc phủ định giảm nhẹ "不太" (bú tài):</strong> Không... lắm. Chủ ngữ + 不太 + Tính từ. Ví dụ: 我不太忙 (Tôi không bận lắm), 汉语不太难 (Tiếng Trung không khó lắm).
      </p>
    </div>
    
    <div class="footer">
      <div>© Lê Lê học tiếng Trung</div>
      <div>lelehoctiengtrung.com</div>
    </div>
  </div>

  <!-- PAGE 10: LESSON 3 -->
  <div class="page">
    <div class="header">
      <div class="header-left"><span class="logo-text">乐乐学中文</span> · Hán Ngữ Cơ Sở 1</div>
      <div>Trang 10</div>
    </div>
    
    <h2 class="page-title">
      <span>Bài 3: Con số, Mua sắm & Hỏi giá cả</span>
      <span class="page-title-zh">第三课：数字 & 购物</span>
    </h2>
    
    <div class="dialogue-box">
      <div class="dialogue-title">Hội thoại mẫu (会话)</div>
      <div class="dialogue-line">
        <span class="speaker">A:</span> <span class="dialogue-zh">你好！你要买什么？</span><br>
        <span class="pinyin-cell">Nǐ hǎo! Nǐ yào mǎi shénme?</span><br>
        <span class="vocab-item-vi">Chào bạn! Bạn cần mua gì?</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">B:</span> <span class="dialogue-zh">我想买苹果。苹果一斤多少钱？</span><br>
        <span class="pinyin-cell">Wǒ xiǎng mǎi píngguǒ. Píngguǒ yì jīn duōshǎo qián?</span><br>
        <span class="vocab-item-vi">Tôi muốn mua táo. Táo bao nhiêu tiền một cân?</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">A:</span> <span class="dialogue-zh">苹果一斤三块钱。你要买几斤？</span><br>
        <span class="pinyin-cell">Píngguǒ yì jīn sān kuài qián. Nǐ yào mǎi jǐ jīn?</span><br>
        <span class="vocab-item-vi">Táo một cân 3 tệ. Bạn cần mua mấy cân?</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">B:</span> <span class="dialogue-zh">我要买五斤。一共多少钱？</span><br>
        <span class="pinyin-cell">Wǒ yào mǎi wǔ jīn. Yígòng duōshǎo qián?</span><br>
        <span class="vocab-item-vi">Tôi cần mua 5 cân. Tổng cộng bao nhiêu tiền?</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">A:</span> <span class="dialogue-zh">一共十五块钱。</span><br>
        <span class="pinyin-cell">Yígòng shíwǔ kuài qián.</span><br>
        <span class="vocab-item-vi">Tổng cộng 15 tệ.</span>
      </div>
    </div>
    
    <h3 style="font-size: 12.5px; color: #161310; margin-top: 10px; margin-bottom: 5px;">Số đếm tiếng Trung cơ bản (数字)</h3>
    <table class="content-table" style="font-size: 11px; margin-bottom: 4mm;">
      <thead>
        <tr>
          <th>0 (零)</th>
          <th>1 (一)</th>
          <th>2 (二)</th>
          <th>3 (三)</th>
          <th>4 (四)</th>
          <th>5 (五)</th>
          <th>6 (六)</th>
          <th>7 (七)</th>
          <th>8 (八)</th>
          <th>9 (九)</th>
          <th>10 (十)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="font-weight: bold; color: #C94535;">
          <td>líng</td>
          <td>yī</td>
          <td>èr</td>
          <td>sān</td>
          <td>sì</td>
          <td>wǔ</td>
          <td>liù</td>
          <td>qī</td>
          <td>bā</td>
          <td>jiǔ</td>
          <td>shí</td>
        </tr>
      </tbody>
    </table>
    
    <div class="vocab-list">
      <div class="vocab-item">
        <span class="vocab-item-zh">买</span>
        <span class="vocab-item-py">mǎi</span>
        <span class="vocab-item-vi">mua (động từ)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">苹果</span>
        <span class="vocab-item-py">píngguǒ</span>
        <span class="vocab-item-vi">táo (quả táo)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">斤</span>
        <span class="vocab-item-py">jīn</span>
        <span class="vocab-item-vi">cân (1 cân Trung Quốc = 500g)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">多少</span>
        <span class="vocab-item-py">duōshǎo</span>
        <span class="vocab-item-vi">bao nhiêu (hỏi số lượng lớn >10)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">钱</span>
        <span class="vocab-item-py">qián</span>
        <span class="vocab-item-vi">tiền (ngân lượng)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">块</span>
        <span class="vocab-item-py">kuài</span>
        <span class="vocab-item-vi">tệ, đồng (đơn vị tiền tệ khẩu ngữ)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">几</span>
        <span class="vocab-item-py">jǐ</span>
        <span class="vocab-item-vi">mấy, vài (hỏi số lượng nhỏ &lt;10)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">一共</span>
        <span class="vocab-item-py">yígòng</span>
        <span class="vocab-item-vi">tổng cộng, tất cả</span>
      </div>
    </div>
    
    <div class="footer">
      <div>© Lê Lê học tiếng Trung</div>
      <div>lelehoctiengtrung.com</div>
    </div>
  </div>

  <!-- PAGE 11: LESSON 4 -->
  <div class="page">
    <div class="header">
      <div class="header-left"><span class="logo-text">乐乐学中文</span> · Hán Ngữ Cơ Sở 1</div>
      <div>Trang 11</div>
    </div>
    
    <h2 class="page-title">
      <span>Bài 4: Hỏi thời gian & Ngày tháng</span>
      <span class="page-title-zh">第四课：时间 & 日期</span>
    </h2>
    
    <div class="dialogue-box">
      <div class="dialogue-title">Hội thoại mẫu (会话)</div>
      <div class="dialogue-line">
        <span class="speaker">A:</span> <span class="dialogue-zh">请问，现在几点？</span><br>
        <span class="pinyin-cell">Qǐngwén, xiànzài jǐ diǎn?</span><br>
        <span class="vocab-item-vi">Xin hỏi, bây giờ là mấy giờ?</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">B:</span> <span class="dialogue-zh">现在差五分十点。</span><br>
        <span class="pinyin-cell">Xiànzài chà wǔ fēn shí diǎn.</span><br>
        <span class="vocab-item-vi">Bây giờ là 10 giờ kém 5 phút (kém 5 phút 10 giờ).</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">A:</span> <span class="dialogue-zh">今天星期几？</span><br>
        <span class="pinyin-cell">Jīntiān xīngqījǐ?</span><br>
        <span class="vocab-item-vi">Hôm nay là thứ mấy?</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">B:</span> <span class="dialogue-zh">今天星期三。</span><br>
        <span class="pinyin-cell">Jīntiān xīngqīsān.</span><br>
        <span class="vocab-item-vi">Hôm nay là thứ tư.</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">A:</span> <span class="dialogue-zh">今天几号？</span><br>
        <span class="pinyin-cell">Jīntiān jǐ hào?</span><br>
        <span class="vocab-item-vi">Hôm nay là ngày mùng mấy?</span>
      </div>
      <div class="dialogue-line">
        <span class="speaker">B:</span> <span class="dialogue-zh">今天十月二十号。</span><br>
        <span class="pinyin-cell">Jīntiān shíyuè èrshí hào.</span><br>
        <span class="vocab-item-vi">Hôm nay là ngày 20 tháng 10.</span>
      </div>
    </div>
    
    <h3 style="font-size: 12.5px; color: #161310; margin-top: 10px; margin-bottom: 5px;">Từ vựng cốt lõi (生词)</h3>
    <div class="vocab-list">
      <div class="vocab-item">
        <span class="vocab-item-zh">请问</span>
        <span class="vocab-item-py">qǐngwén</span>
        <span class="vocab-item-vi">xin hỏi, làm ơn cho hỏi</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">现在</span>
        <span class="vocab-item-py">xiànzài</span>
        <span class="vocab-item-vi">bây giờ, hiện tại</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">点</span>
        <span class="vocab-item-py">diǎn</span>
        <span class="vocab-item-vi">giờ (đơn vị chỉ thời gian)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">分</span>
        <span class="vocab-item-py">fēn</span>
        <span class="vocab-item-vi">phút (đơn vị chỉ thời gian)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">今天</span>
        <span class="vocab-item-py">jīntiān</span>
        <span class="vocab-item-vi">hôm nay</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">星期</span>
        <span class="vocab-item-py">xīngqī</span>
        <span class="vocab-item-vi">thứ, tuần lễ</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">月</span>
        <span class="vocab-item-py">yuè</span>
        <span class="vocab-item-vi">tháng (mặt trăng)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">号</span>
        <span class="vocab-item-py">hào</span>
        <span class="vocab-item-vi">ngày, số (dùng trong văn nói)</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">差</span>
        <span class="vocab-item-py">chà</span>
        <span class="vocab-item-vi">kém, thiếu hụt</span>
      </div>
      <div class="vocab-item">
        <span class="vocab-item-zh">半</span>
        <span class="vocab-item-py">bàn</span>
        <span class="vocab-item-vi">nửa, rưỡi (ví dụ: 10h30)</span>
      </div>
    </div>
    
    <div class="info-box">
      <div class="info-box-title gold">
        📌 Cách đọc ngày tháng: Tư duy từ LỚN đến BÉ
      </div>
      <p class="section-desc" style="font-size: 11px; margin-bottom: 0;">
        Trong tiếng Trung, quy tắc viết/đọc thời gian luôn đi từ đơn vị lớn nhất đến nhỏ nhất: <strong>Năm -> Tháng -> Ngày -> Thứ</strong>. Ví dụ: Thứ ba, ngày 20 tháng 10 năm 2026 sẽ được sắp xếp là: <strong>2026年 10月 20号 星期二</strong>. Chú ý thứ trong tiếng Trung được đánh số bắt đầu bằng 星期一 (Thứ Hai), cho đến 星期六 (Thứ Bảy) và Chủ Nhật là 星期日 hoặc 星期天 (Xīngqītiān).
      </p>
    </div>
    
    <div class="footer">
      <div>© Lê Lê học tiếng Trung</div>
      <div>lelehoctiengtrung.com</div>
    </div>
  </div>

  <!-- PAGE 12: CONCLUSION & MÕT TỰ HỌC -->
  <div class="page">
    <div class="header">
      <div class="header-left"><span class="logo-text">乐乐学中文</span> · Hán Ngữ Cơ Sở 1</div>
      <div>Trang 12</div>
    </div>
    
    <h2 class="page-title">
      <span>Tập viết chữ Hán cơ bản & Lời kết</span>
      <span class="page-title-zh">汉字练习 & 结语</span>
    </h2>
    
    <p class="section-desc">
      Dưới đây là một số chữ Hán nhập môn vô cùng thông dụng, các bạn hãy luyện tập tập tô theo các nét mờ nhạt chuẩn ô ly Mễ Tự (米字格) này nhé:
    </p>
    
    <div class="mezi-grid">
      <div class="mezi-box">
        <div class="mezi-cell">
          <div class="mezi-diagonal-1"></div>
          <div class="mezi-diagonal-2"></div>
          <div class="mezi-char-trace">你</div>
        </div>
        <div class="mezi-label-zh">你</div>
        <div class="mezi-label-pinyin">nǐ</div>
        <div class="mezi-label-vi">Bạn, anh, chị</div>
      </div>
      
      <div class="mezi-box">
        <div class="mezi-cell">
          <div class="mezi-diagonal-1"></div>
          <div class="mezi-diagonal-2"></div>
          <div class="mezi-char-trace">好</div>
        </div>
        <div class="mezi-label-zh">好</div>
        <div class="mezi-label-pinyin">hǎo</div>
        <div class="mezi-label-vi">Tốt, khoẻ, đẹp</div>
      </div>
      
      <div class="mezi-box">
        <div class="mezi-cell">
          <div class="mezi-diagonal-1"></div>
          <div class="mezi-diagonal-2"></div>
          <div class="mezi-char-trace">我</div>
        </div>
        <div class="mezi-label-zh">我</div>
        <div class="mezi-label-pinyin">wǒ</div>
        <div class="mezi-label-vi">Tôi, tớ, mình</div>
      </div>
      
      <div class="mezi-box">
        <div class="mezi-cell">
          <div class="mezi-diagonal-1"></div>
          <div class="mezi-diagonal-2"></div>
          <div class="mezi-char-trace">是</div>
        </div>
        <div class="mezi-label-zh">是</div>
        <div class="mezi-label-pinyin">shì</div>
        <div class="mezi-label-vi">Là, vâng, đúng</div>
      </div>
    </div>
    
    <div class="info-box">
      <div class="info-box-title gold">
        💡 4 Mẹo tự học tiếng Trung hiệu quả hàng ngày từ Lê Lê
      </div>
      <ul>
        <li><strong>Không sợ viết sai nét:</strong> Ban đầu ai cũng viết chữ hơi méo. Đừng nản nhé! Viết nhiều tay sẽ quen cơ, chữ sẽ tự động vuông vắn và tròn trịa hơn.</li>
        <li><strong>Luyện nói theo phương pháp shadowing:</strong> Hãy bật các video của Lê Lê, bắt chước và nhại giọng ngay lập tức theo ngữ điệu, pinyin của mình.</li>
        <li><strong>Kết bạn và giao tiếp:</strong> Đừng chỉ học lý thuyết suông. Hãy tìm những nhóm học tập hoặc ứng dụng trao đổi ngôn ngữ để nói chuyện thực tế nhé.</li>
        <li><strong>Kiên trì quan trọng hơn số lượng:</strong> Mỗi ngày chỉ cần dành 15-20 phút học tiếng Trung đều đặn, hiệu quả hơn hẳn việc học dồn 2 tiếng vào cuối tuần!</li>
      </ul>
    </div>
    
    <p class="section-desc" style="text-align: center; font-weight: 500; font-size: 11.5px; color: #7c7365; margin-top: 5mm;">
      Chúc các bạn cùng học học tập thật vui và đạt kết quả cao! 🌸 再见！
    </p>
    
    <div class="footer">
      <div>© Lê Lê học tiếng Trung</div>
      <div>lelehoctiengtrung.com</div>
    </div>
  </div>

</body>
</html>
"""

# Save to html file
html_file_path = os.path.join(scratch_dir, "generate_coso1_pdf.html")
with open(html_file_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"generate_coso1_pdf.html successfully created at: {html_file_path}")

# Print to PDF using Headless Chrome
print("Calling Headless Chrome to print to PDF...")
chrome_path = (
    shutil.which("google-chrome") or 
    shutil.which("google-chrome-stable") or 
    shutil.which("chromium-browser") or 
    shutil.which("chromium") or 
    shutil.which("chrome") or 
    ("/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" if platform.system() == "Darwin" else "/usr/bin/google-chrome")
)
output_pdf = "POSTS/docs/DOC-COSO1.pdf"
abs_pdf = os.path.abspath(output_pdf)
abs_html = os.path.abspath(html_file_path)

# Make sure folder exists
os.makedirs(os.path.dirname(output_pdf), exist_ok=True)

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--user-data-dir=/tmp/chrome-profile-coso1",
    "--print-to-pdf=" + abs_pdf,
    abs_html
]

try:
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    print(f"Successfully generated Basic Han 1 PDF: {output_pdf}")
except subprocess.CalledProcessError as e:
    print("Error calling Chrome to print PDF:")
    print(e.stderr)
    exit(1)
