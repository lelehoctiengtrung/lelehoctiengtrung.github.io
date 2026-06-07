# -*- coding: utf-8 -*-
import subprocess
import os

scratch_dir = "scripts"
os.makedirs(scratch_dir, exist_ok=True)

html_content = """<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8"/>
  <title>Cẩm Nang Học Tiếng Trung Mùa Hè Cực Vui</title>
  <link href="https://fonts.googleapis.com" rel="preconnect"/>
  <link crossorigin="" href="https://fonts.gstatic.com" rel="preconnect"/>
  <link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@300..700&family=Comic+Neue:ital,wght@0,300;0,400;0,700;1,300;1,400;1,700&family=Inter:wght@400;500;600;700&family=Noto+Serif+SC:wght@300;400;700;900&display=swap" rel="stylesheet"/>
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
      padding: 24mm 15mm 20mm 15mm;
      position: relative;
      background: #FFFDF9; /* Warm child-friendly cream background */
      page-break-after: always;
      overflow: hidden;
      border: 8px solid #FFD269; /* Soft golden border */
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
      border-bottom: 3px dashed #733F2E;
      font-size: 12px;
      color: #733F2E;
      font-weight: 800;
      z-index: 10;
    }
    .header-left {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .header-left .logo-text {
      color: #FF7B90;
      font-family: 'Fredoka', sans-serif;
      font-size: 15px;
      font-weight: 800;
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
      border-top: 3px dashed #733F2E;
      font-size: 11px;
      font-weight: 800;
      color: #733F2E;
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
      background: linear-gradient(135deg, #FFF0F5, #E6F3FF, #EBF8F2, #FFFDF0); /* Pastel rainbow gradient */
      color: #733F2E;
      position: relative;
      page-break-after: always;
      border: 8px solid #FFD269;
      margin: 0;
      overflow: hidden;
    }
    .cover-decor {
      position: absolute;
      top: 5px; left: 5px; right: 5px; bottom: 5px;
      border: 3.5px dashed #FF7B90;
      pointer-events: none;
      z-index: 3;
    }
    
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
      margin-top: 5mm;
    }
    .cover-badge {
      border: 2.5px solid #733F2E;
      background: #FFF5F6;
      color: #FF5A79;
      padding: 6px 18px;
      border-radius: 999px;
      font-family: 'Fredoka', sans-serif;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 1px;
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
      font-size: 42px;
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
      font-family: 'Noto Serif SC', serif;
      font-size: 22px;
      color: #FF8A5B;
      margin-top: 12px;
      font-weight: 900;
      text-shadow: 1px 1px 0px #FFF;
      letter-spacing: 4px;
    }
    
    .cover-mid {
      z-index: 10;
      margin: 6mm 0;
    }
    .cover-stamp {
      width: 110px;
      height: 110px;
      background: #FF7B90;
      border: 4px solid #733F2E;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      position: relative;
      box-shadow: 4px 4px 0px #733F2E;
      transform: rotate(-5deg);
    }
    .cover-stamp::before {
      content: "";
      position: absolute;
      top: 3px; left: 3px; right: 3px; bottom: 3px;
      border: 2px dashed rgba(255,255,255,0.8);
      border-radius: 50%;
    }
    .cover-stamp .stamp-text {
      font-family: 'Fredoka', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #FFFDF9;
      line-height: 1;
    }
    .cover-stamp .stamp-zh {
      font-family: 'Noto Serif SC', serif;
      font-size: 24px;
      font-weight: 900;
      color: #FFFDF9;
      margin-top: 2px;
    }
    
    .cover-bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      z-index: 10;
    }
    .cover-desc {
      font-size: 15.5px;
      color: #5A453A;
      max-width: 540px;
      line-height: 1.6;
      font-weight: 700;
    }
    .cover-author {
      font-family: 'Fredoka', sans-serif;
      font-size: 15px;
      color: #733F2E;
      background: #FFFFFF;
      border: 2.5px solid #733F2E;
      padding: 6px 20px;
      border-radius: 99px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 3px 3px 0px rgba(115, 63, 46, 0.1);
      font-weight: 800;
    }
    
    /* General Pages Structure */
    .page-title {
      font-family: 'Fredoka', sans-serif;
      font-size: 26px;
      color: #733F2E;
      border-bottom: 3.5px dashed #FFD269;
      padding-bottom: 8px;
      margin-top: 6mm;
      margin-bottom: 8mm;
      font-weight: 800;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    /* Sticker style layout */
    .sticker-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-top: 5mm;
    }
    .sticker-card {
      background: #FFF;
      border: 3.5px solid #733F2E;
      border-radius: 24px;
      padding: 16px;
      position: relative;
      box-shadow: 5px 5px 0px rgba(115, 63, 46, 0.15);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    /* Colorful backgrounds */
    .sticker-card.pink { background: #FFF2F4; }
    .sticker-card.green { background: #EBF8F2; }
    .sticker-card.blue { background: #EBF5FB; }
    .sticker-card.yellow { background: #FFF9E6; }
    
    .sticker-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .sticker-char {
      font-family: 'Noto Serif SC', serif;
      font-size: 48px;
      font-weight: 900;
      color: #733F2E;
      line-height: 1;
    }
    .sticker-pinyin {
      font-family: 'Fredoka', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #C94535;
    }
    .sticker-vi {
      font-size: 16px;
      font-weight: 700;
      color: #5A453A;
      border-top: 2px dashed rgba(115, 63, 46, 0.2);
      padding-top: 6px;
      margin-top: 4px;
    }
    
    /* Bubbles & boxes */
    .kids-bubble {
      background: #FFFFFF;
      border: 2.5px solid #733F2E;
      border-radius: 16px;
      padding: 12px 16px;
      font-size: 14.5px;
      color: #733F2E;
      line-height: 1.6;
      box-shadow: 3px 3px 0px rgba(115, 63, 46, 0.1);
      margin-top: 6mm;
    }
    
    .intro-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 6mm;
    }
    .intro-card {
      background: #FFFDF9;
      border: 3.5px solid #733F2E;
      border-radius: 20px;
      padding: 22px;
      box-shadow: 5px 5px 0 rgba(115, 63, 46, 0.1);
    }
    .intro-card-title {
      font-family: 'Fredoka', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #733F2E;
      margin-top: 0;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .intro-card ul {
      margin: 0;
      padding-left: 20px;
      font-size: 14.5px;
      line-height: 1.8;
      color: #5A453A;
    }
    .intro-card li {
      margin-bottom: 8px;
    }
    
    .toc-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 5mm;
    }
    .toc-item {
      background: #FFFFFF;
      border: 2.5px solid #733F2E;
      border-radius: 14px;
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 15px;
      font-weight: 700;
      color: #733F2E;
      box-shadow: 2px 2px 0px rgba(115, 63, 46, 0.1);
    }
    .toc-item:nth-child(even) { background: #FFF9E6; }
    
    /* Poem grid layout */
    .poem-box {
      background: #FFF9E6;
      border: 3.5px solid #733F2E;
      border-radius: 24px;
      padding: 20px;
      text-align: center;
      box-shadow: 5px 5px 0px rgba(115, 63, 46, 0.15);
      margin-top: 4mm;
    }
    .poem-line {
      margin-bottom: 12px;
    }
    .poem-zh {
      font-family: 'Noto Serif SC', serif;
      font-size: 24px;
      font-weight: 900;
      color: #733F2E;
      letter-spacing: 2px;
    }
    .poem-py {
      font-family: 'Fredoka', sans-serif;
      font-size: 15px;
      font-weight: 700;
      color: #FF8A5B;
      margin: 2px 0;
    }
    .poem-vi {
      font-size: 14.5px;
      font-weight: 600;
      color: #6D5A50;
      font-style: italic;
    }
    
    /* 12-week roadmap layout */
    .week-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-top: 4mm;
    }
    .week-card {
      background: #FFFFFF;
      border: 3.5px solid #733F2E;
      border-radius: 22px;
      padding: 16px;
      box-shadow: 4px 4px 0px rgba(115, 63, 46, 0.15);
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .week-card.pink { background: #FFF2F4; }
    .week-card.blue { background: #EBF5FB; }
    .week-card.green { background: #EBF8F2; }
    .week-card.yellow { background: #FFF9E6; }
    
    .week-title {
      font-family: 'Fredoka', sans-serif;
      font-size: 18px;
      font-weight: 850;
      color: #733F2E;
      border-bottom: 2px dashed rgba(115, 63, 46, 0.3);
      padding-bottom: 6px;
      margin-top: 0;
      margin-bottom: 4px;
    }
    .week-theme {
      font-size: 15px;
      font-weight: 700;
      color: #C94535;
    }
    .week-vocab-list {
      font-size: 13.5px;
      color: #5A453A;
      line-height: 1.75;
      padding-left: 15px;
      margin: 0;
    }
    
    /* Activities layout */
    .activity-box {
      background: #FFFFFF;
      border: 3.5px solid #733F2E;
      border-radius: 24px;
      padding: 20px;
      box-shadow: 5px 5px 0px rgba(115, 63, 46, 0.15);
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-top: 4mm;
    }
    .activity-section-title {
      font-family: 'Fredoka', sans-serif;
      font-size: 18px;
      font-weight: 800;
      color: #733F2E;
      border-bottom: 2px dashed rgba(115, 63, 46, 0.2);
      padding-bottom: 6px;
      margin: 0;
    }
    .activity-text {
      font-size: 14.5px;
      line-height: 1.7;
      color: #5A453A;
      margin: 0;
    }
    
    /* FAQ Section */
    .faq-item {
      background: #FFFFFF;
      border: 3px solid #733F2E;
      border-radius: 18px;
      padding: 16px;
      box-shadow: 4px 4px 0px rgba(115, 63, 46, 0.1);
      margin-bottom: 5mm;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .faq-q {
      font-size: 16px;
      font-weight: 850;
      color: #C94535;
      margin: 0;
      display: flex;
      gap: 8px;
    }
    .faq-a {
      font-size: 14.5px;
      line-height: 1.7;
      color: #5A453A;
      margin: 0;
      border-top: 1.5px dashed rgba(115, 63, 46, 0.15);
      padding-top: 8px;
    }
    
    /* Checklist grid */
    .challenge-grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      margin-top: 4mm;
    }
    .challenge-day {
      background: #FFFFFF;
      border: 2.5px solid #733F2E;
      border-radius: 14px;
      height: 60px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: 'Fredoka', sans-serif;
      font-size: 14px;
      font-weight: 800;
      color: #733F2E;
      box-shadow: 2px 2px 0px rgba(115, 63, 46, 0.1);
      position: relative;
    }
    .challenge-day.checked {
      background: #EBF8F2;
    }
    .challenge-check {
      font-size: 16px;
      color: #2E7D32;
      margin-top: 2px;
    }
    
  </style>
</head>
<body>

  <!-- PAGE 1: COVER PAGE -->
  <div class="cover-page">
    <div class="cover-decor"></div>
    <div class="cover-hanzi-decor hz-1">夏</div>
    <div class="cover-hanzi-decor hz-2">天</div>
    <div class="cover-hanzi-decor hz-3">乐</div>
    <div class="cover-hanzi-decor hz-4">学</div>
    
    <div class="cover-top">
      <div class="cover-badge">☀️ Tài Liệu Chia Sẻ Miễn Phí ☀️</div>
      <div class="cover-main-title">
        <span class="title-small">CẨM NANG HỌC TIẾNG TRUNG</span><br/>
        <h1 class="title-large">MÙA HÈ CỰC VUI</h1>
      </div>
      <div class="cover-title-zh" lang="zh">夏天快乐学中文</div>
    </div>
    
    <div class="cover-mid">
      <div class="cover-stamp">
        <span class="stamp-text">SUMMER</span>
        <span class="stamp-zh">夏</span>
      </div>
    </div>
    
    <div class="cover-bottom">
      <p class="cover-desc">Học từ vựng thời tiết, bãi biển, các hoạt động ngoài trời kết hợp lộ trình 12 tuần chinh phục 300 từ vựng tiếng Trung cốt lõi nhất cho bé yêu!</p>
      <div class="cover-author">🌸 Lê Lê học tiếng Trung 🌸</div>
    </div>
  </div>

  <!-- PAGE 2: INTRODUCTION -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🌸 Lời Mở Đầu</h2>
    
    <p style="font-size:15px; line-height:1.75; color:#5A453A; text-align:justify; margin:0 0 15px 0;">
      Chào các bậc phụ huynh và các bé yêu! Lê Lê đây. Mùa hè đã chính thức gõ cửa rồi! Nếu hỏi các bé mùa nào vui nhất trong năm, câu trả lời chắc chắn sẽ là mùa hè – mùa của những que kem mát lạnh, những chuyến đi biển đầy cát trắng và những chuỗi ngày nghỉ dài tràn ngập tiếng cười.
    </p>
    <p style="font-size:15px; line-height:1.75; color:#5A453A; text-align:justify; margin:0 0 15px 0;">
      Đối với các gia đình Việt tự học tiếng Trung, mùa hè chính là **"kho báu thời gian"** vô giá. Khi không còn áp lực bài vở ở trường, các bé có thể tiếp cận tiếng Trung một cách vô cùng nhẹ nhàng, tự nhiên: đọc sách truyện, hát đồng dao, truy tìm côn trùng trong vườn và tích lũy từ vựng thông qua các trải nghiệm thực tế hằng ngày.
    </p>
    <p style="font-size:15px; line-height:1.75; color:#5A453A; text-align:justify; margin:0 0 15px 0;">
      Cuốn cẩm nang này được biên soạn đầy đủ từ A đến Z để giúp ba mẹ biến kỳ nghỉ hè của con thành một hành trình học tiếng Trung ngập tràn niềm vui. Chúng ta sẽ cùng nhau khám phá hơn 40 từ vựng sinh động nhất về mùa hè, học hát bài thơ côn trùng dễ thương, khám phá tiệm kem Gelato và thiết lập lộ trình 12 tuần học tập cụ thể. Chúc ba mẹ và bé có một mùa hè thật rực rỡ và bổ ích!
    </p>
    
    <div class="kids-bubble" style="margin-top: 15px; background: #FFF5F6; border-color: #FF7B90;">
      🎈 <strong>Lê Lê nhắn nhủ ba mẹ:</strong> "Đừng ép con phải ngồi vào bàn học hàng giờ liền trong mùa hè nhé! Hãy biến tiếng Trung thành một phần của các cuộc dạo chơi ngoài trời, những món ăn mát lạnh và những trò chơi tương tác. Chỉ cần 10-15 phút đều đặn mỗi ngày là con đã tiến bộ vượt bậc rồi!"
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 2 / 30</div>
    </div>
  </div>

  <!-- PAGE 3: TABLE OF CONTENTS -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">📚 Mục Lục Cẩm Nang</h2>
    
    <div class="toc-list">
      <div class="toc-item"><span>☀️ Chủ điểm 1: Từ vựng Thời tiết & Bầu trời mùa hè</span><span>Trang 4</span></div>
      <div class="toc-item"><span>🌱 Chủ điểm 2: Từ vựng Thực vật & Sân vườn</span><span>Trang 5</span></div>
      <div class="toc-item"><span>🐞 Chủ điểm 3: Từ vựng Côn trùng mùa hè</span><span>Trang 6</span></div>
      <div class="toc-item"><span>🐛 Chủ điểm 4: Bài thơ thiếu nhi "Trùng Trùng Phi"</span><span>Trang 7</span></div>
      <div class="toc-item"><span>🌊 Chủ điểm 5: Từ vựng Bãi biển & Biển cả</span><span>Trang 8</span></div>
      <div class="toc-item"><span>🩴 Chủ điểm 6: Từ vựng Đồ dùng đi biển</span><span>Trang 9</span></div>
      <div class="toc-item"><span>🍦 Chủ điểm 7: Khám phá vị kem Gelato tiếng Trung</span><span>Trang 10</span></div>
      <div class="toc-item"><span>🐉 Chủ điểm 8: Lễ hội mùa hè - Tết Đoan Ngọ</span><span>Trang 11</span></div>
      <div class="toc-item"><span>🌌 Chủ điểm 9: Lễ hội mùa hè - Lễ Thất Tịch</span><span>Trang 12</span></div>
      <div class="toc-item"><span>🗺️ Chủ điểm 10: 6 Hoạt động học tập ngoài trời vui nhộn</span><span>Trang 13-18</span></div>
      <div class="toc-item"><span>🗓️ Lộ trình 12 tuần chinh phục 300 từ vựng cho bé</span><span>Trang 19-24</span></div>
      <div class="toc-item"><span>📖 Hướng dẫn đọc sách & Tránh quên kiến thức</span><span>Trang 25</span></div>
      <div class="toc-item"><span>❓ Giải đáp thắc mắc (FAQ) cho phụ huynh</span><span>Trang 26-27</span></div>
      <div class="toc-item"><span>🎨 Tài nguyên in ấn (Printables) & Lời kết</span><span>Trang 28-30</span></div>
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 3 / 30</div>
    </div>
  </div>

  <!-- PAGE 4: WEATHER & SKY VOCAB -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">☀️ Từ Vựng 1: Thời Tiết & Bầu Trời Mùa Hè</h2>
    
    <div class="sticker-container">
      <div class="sticker-card yellow">
        <div class="sticker-header"><span class="sticker-char">夏天</span><span class="sticker-pinyin">xià tiān</span></div>
        <div class="sticker-vi">Mùa hè ☀️</div>
      </div>
      <div class="sticker-card yellow">
        <div class="sticker-header"><span class="sticker-char">太阳</span><span class="sticker-pinyin">tài yáng</span></div>
        <div class="sticker-vi">Mặt trời 🌞</div>
      </div>
      <div class="sticker-card yellow">
        <div class="sticker-header"><span class="sticker-char">阳光</span><span class="sticker-pinyin">yáng guāng</span></div>
        <div class="sticker-vi">Ánh nắng ✨</div>
      </div>
      <div class="sticker-card yellow">
        <div class="sticker-header"><span class="sticker-char">云</span><span class="sticker-pinyin">yún</span></div>
        <div class="sticker-vi">Đám mây ☁️</div>
      </div>
      <div class="sticker-card yellow">
        <div class="sticker-header"><span class="sticker-char">热</span><span class="sticker-pinyin">rè</span></div>
        <div class="sticker-vi">Nóng 🔥</div>
      </div>
      <div class="sticker-card yellow">
        <div class="sticker-header"><span class="sticker-char">炎热</span><span class="sticker-pinyin">yán rè</span></div>
        <div class="sticker-vi">Nóng nực 🥵</div>
      </div>
    </div>
    
    <div class="kids-bubble">
      💡 <strong>Lê Lê giải thích:</strong> Từ <strong>夏 (xià)</strong> có nghĩa là mùa hè, kết hợp với từ <strong>天 (tiān)</strong> nghĩa là ngày hoặc bầu trời để tạo thành cụm từ <strong>夏天 (xià tiān)</strong> chỉ thời điểm mùa hè tươi đẹp. Ngoài ra, để miêu tả cái nóng gay gắt hơn mức bình thường (热 - rè), người Trung Quốc dùng từ <strong>炎热 (yán rè)</strong> - chữ "Viêm" 炎 được ghép từ hai chữ "Hỏa" 火 chồng lên nhau, thể hiện sức nóng hừng hực như lửa đốt!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 4 / 30</div>
    </div>
  </div>

  <!-- PAGE 5: PLANTS & GARDEN VOCAB -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🌱 Từ Vựng 2: Thực Vật & Khu Vườn Mùa Hè</h2>
    
    <div class="sticker-container">
      <div class="sticker-card green">
        <div class="sticker-header"><span class="sticker-char">植物</span><span class="sticker-pinyin">zhí wù</span></div>
        <div class="sticker-vi">Thực vật 🌱</div>
      </div>
      <div class="sticker-card green">
        <div class="sticker-header"><span class="sticker-char">花</span><span class="sticker-pinyin">huā</span></div>
        <div class="sticker-vi">Bông hoa 🌸</div>
      </div>
      <div class="sticker-card green">
        <div class="sticker-header"><span class="sticker-char">树叶</span><span class="sticker-pinyin">shù yè</span></div>
        <div class="sticker-vi">Lá cây 🍃</div>
      </div>
      <div class="sticker-card green">
        <div class="sticker-header"><span class="sticker-char">草</span><span class="sticker-pinyin">cǎo</span></div>
        <div class="sticker-vi">Bãi cỏ 🍀</div>
      </div>
      <div class="sticker-card green">
        <div class="sticker-header"><span class="sticker-char">树木</span><span class="sticker-pinyin">shù mù</span></div>
        <div class="sticker-vi">Cây cối 🌳</div>
      </div>
      <div class="sticker-card green">
        <div class="sticker-header"><span class="sticker-char">泥土</span><span class="sticker-pinyin">ní tǔ</span></div>
        <div class="sticker-vi">Đất cát 🪵</div>
      </div>
    </div>
    
    <div class="kids-bubble">
      🍃 <strong>Lê Lê mách bé:</strong> Bé có biết chữ <strong>花 (huā)</strong> và chữ <strong>草 (cǎo)</strong> đều có điểm gì chung không? Chúng đều có bộ thủ <strong>艹 (Thảo)</strong> nằm ở phía trên cùng đấy! Bộ thủ này mô phỏng hình ảnh hai cọng cỏ nhỏ xinh mọc lên từ đất, biểu thị cho các loài cây cỏ, thảo mộc và bông hoa trong thế giới tự nhiên. Mỗi lần gặp chữ có bộ 艹 là bé biết ngay từ đó liên quan đến cây cối nhé!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 5 / 30</div>
    </div>
  </div>

  <!-- PAGE 6: BUGS & CREATURES VOCAB -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🐞 Từ Vựng 3: Côn Trùng Mùa Hè Dễ Thương</h2>
    
    <div class="sticker-container">
      <div class="sticker-card pink">
        <div class="sticker-header"><span class="sticker-char">瓢虫</span><span class="sticker-pinyin">piáo chóng</span></div>
        <div class="sticker-vi">Bọ rùa 🐞</div>
      </div>
      <div class="sticker-card pink">
        <div class="sticker-header"><span class="sticker-char">蜜蜂</span><span class="sticker-pinyin">mì fēng</span></div>
        <div class="sticker-vi">Con ong 🐝</div>
      </div>
      <div class="sticker-card pink">
        <div class="sticker-header"><span class="sticker-char">蝴蝶</span><span class="sticker-pinyin">hú dié</span></div>
        <div class="sticker-vi">Con bướm 🦋</div>
      </div>
      <div class="sticker-card pink">
        <div class="sticker-header"><span class="sticker-char">蚂蚁</span><span class="sticker-pinyin">mǎ yǐ</span></div>
        <div class="sticker-vi">Con kiến 🐜</div>
      </div>
      <div class="sticker-card pink">
        <div class="sticker-header"><span class="sticker-char">蜗牛</span><span class="sticker-pinyin">wō niú</span></div>
        <div class="sticker-vi">Ốc sên 🐌</div>
      </div>
      <div class="sticker-card pink">
        <div class="sticker-header"><span class="sticker-char">蚯蚓</span><span class="sticker-pinyin">qiū yǐn</span></div>
        <div class="sticker-vi">Giun đất 🪱</div>
      </div>
    </div>
    
    <div class="kids-bubble">
      🐛 <strong>Khám phá chữ Hán cùng Lê Lê:</strong> Bé hãy quan sát kỹ các chữ chỉ côn trùng như <strong>蜜蜂 (mìfēng)</strong>, <strong>蝴蝶 (húdié)</strong>, <strong>蚂蚁 (mǎyǐ)</strong>... Tất cả đều chứa bộ thủ <strong>虫 (Trùng)</strong>! Bộ 虫 mô phỏng hình dáng một chú sâu hoặc rắn nhỏ có đầu tròn và thân uốn lượn. Từ thời xa xưa, người Trung Quốc đã dùng bộ này để ghép nên tên của tất cả các sinh vật nhỏ bé hay côn trùng bò sát dưới đất.
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 6 / 30</div>
    </div>
  </div>

  <!-- PAGE 7: POEM "BUGS BUGS FLY" -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🐛 Bài Thơ Thiếu Nhi: 虫虫飞 (Trùng Trùng Phi)</h2>
    
    <div class="poem-box">
      <div class="poem-line">
        <div class="poem-zh">虫虫虫虫飞飞飞</div>
        <div class="poem-py">chóng chóng chóng chóng fēi fēi fēi</div>
        <div class="poem-vi">Những chú côn trùng nhỏ bay bay bay</div>
      </div>
      <div class="poem-line">
        <div class="poem-zh">飞到草地喝露水</div>
        <div class="poem-py">fēi dào cǎo dì hē lù shuǐ</div>
        <div class="poem-vi">Bay tới bãi cỏ uống sương đêm ngọt lành</div>
      </div>
      <div class="poem-line">
        <div class="poem-zh">虫虫虫虫飞飞飞</div>
        <div class="poem-py">chóng chóng chóng chóng fēi fēi fēi</div>
        <div class="poem-vi">Những chú côn trùng nhỏ bay bay bay</div>
      </div>
      <div class="poem-line">
        <div class="poem-zh">飞到花园踢踢腿</div>
        <div class="poem-py">fēi dào huā yuán tī tī tuǐ</div>
        <div class="poem-vi">Bay đến vườn hoa dang rộng chân đùa vui</div>
      </div>
      <div class="poem-line">
        <div class="poem-zh">飞到天空排排队</div>
        <div class="poem-py">fēi dào tiān kōng pái pái duì</div>
        <div class="poem-vi">Bay lên bầu trời xếp hàng thẳng tắp</div>
      </div>
      <div class="poem-line">
        <div class="poem-zh">飞到树杈睡一睡</div>
        <div class="poem-py">fēi dào shù chā shuì yī shuì</div>
        <div class="poem-vi">Bay lên cành cây khép mi ngủ say sưa</div>
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #EBF8F2; border-color: #2ECC71; color: #117864;">
      🎶 <strong>Hướng dẫn hát đồng dao:</strong> Bài thơ có nhịp điệu 3-5-3-5 vô cùng vui tươi và dễ nhớ. Ba mẹ hãy đọc chậm từng dòng trước, kèm các cử động tay chân mô phỏng động tác bay (飞), uống nước (喝水), đá chân (踢腿), xếp hàng (排队) và ngủ (睡). Bé sẽ hào hứng bắt chước và thuộc lòng bài thơ cực kỳ nhanh chóng!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 7 / 30</div>
    </div>
  </div>

  <!-- PAGE 8: BEACH & SEA VOCAB -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🌊 Từ Vựng 4: Bãi Biển & Biển Cả Mênh Mông</h2>
    
    <div class="sticker-container">
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">海水</span><span class="sticker-pinyin">hǎi shuǐ</span></div>
        <div class="sticker-vi">Nước biển 🌊</div>
      </div>
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">沙子</span><span class="sticker-pinyin">shā zi</span></div>
        <div class="sticker-vi">Cát 🏖️</div>
      </div>
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">贝壳</span><span class="sticker-pinyin">bèi ké</span></div>
        <div class="sticker-vi">Vỏ sò 🐚</div>
      </div>
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">海星</span><span class="sticker-pinyin">hǎi xīng</span></div>
        <div class="sticker-vi">Sao biển ⭐</div>
      </div>
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">鱼</span><span class="sticker-pinyin">yú</span></div>
        <div class="sticker-vi">Cá 🐟</div>
      </div>
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">螃蟹</span><span class="sticker-pinyin">páng xiè</span></div>
        <div class="sticker-vi">Con cua 🦀</div>
      </div>
    </div>
    
    <div class="kids-bubble">
      🐚 <strong>Góc chữ Hán kỳ diệu:</strong> Chữ <strong>沙 (shā)</strong> có nghĩa là cát. Bé có thấy bộ thủ <strong>氵 (Ba chấm thủy)</strong> nằm bên trái không? Nó tượng trưng cho giọt nước nước biển. Phía bên phải là chữ <strong>少 (shǎo)</strong> có nghĩa là ít hoặc nhỏ bé. Ghép lại, "những hạt đất nhỏ bé mịn màng bên bờ nước chính là Cát (沙)"! Thật dễ nhớ và logic đúng không nào?
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 8 / 30</div>
    </div>
  </div>

  <!-- PAGE 9: BEACH ITEMS VOCAB -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🩴 Từ Vựng 5: Đồ Dùng Đi Biển Tiện Ích</h2>
    
    <div class="sticker-container">
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">桶</span><span class="sticker-pinyin">tǒng</span></div>
        <div class="sticker-vi">Cái xô 🪣</div>
      </div>
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">皮球</span><span class="sticker-pinyin">pí qiú</span></div>
        <div class="sticker-vi">Bóng đi biển ⚽</div>
      </div>
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">拖鞋</span><span class="sticker-pinyin">tuō xié</span></div>
        <div class="sticker-vi">Dép lê 🩴</div>
      </div>
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">太阳镜</span><span class="sticker-pinyin">tài yáng jìng</span></div>
        <div class="sticker-vi">Kính râm 🕶️</div>
      </div>
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">防晒霜</span><span class="sticker-pinyin">fáng shài shuāng</span></div>
        <div class="sticker-vi">Kem chống nắng 🧴</div>
      </div>
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">帽子</span><span class="sticker-pinyin">mào zi</span></div>
        <div class="sticker-vi">Cái mũ 👒</div>
      </div>
    </div>
    
    <div class="kids-bubble">
      🏖️ <strong>Lê Lê đố bé:</strong> Khi chuẩn bị hành trang đi biển, ba mẹ hãy thử hỏi bé bằng tiếng Trung nhé: <strong>"我们要带什么去海边？" (Wǒmen yào dài shénme qù hǎibiān? - Chúng ta cần mang gì đi biển nhỉ?)</strong>. Bé hãy gọi tên các đồ dùng trên bàn bằng tiếng Trung nhé! Hãy lặp đi lặp lại trò chơi này mỗi lần chuẩn bị đồ đi bơi hay dạo phố để tạo phản xạ tự nhiên.
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 9 / 30</div>
    </div>
  </div>

  <!-- PAGE 10: GELATO ICE CREAM -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🍦 Học Tiếng Trung Qua Vị Kem Gelato</h2>
    
    <div class="sticker-container">
      <div class="sticker-card pink">
        <div class="sticker-header"><span class="sticker-char">巧克力</span><span class="sticker-pinyin">qiǎo kè lì</span></div>
        <div class="sticker-vi">Sô-cô-la 🍫</div>
      </div>
      <div class="sticker-card pink">
        <div class="sticker-header"><span class="sticker-char">草莓</span><span class="sticker-pinyin">cǎo méi</span></div>
        <div class="sticker-vi">Dâu tây 🍓</div>
      </div>
      <div class="sticker-card pink">
        <div class="sticker-header"><span class="sticker-char">香草</span><span class="sticker-pinyin">xiāng cǎo</span></div>
        <div class="sticker-vi">Vani 🍦</div>
      </div>
      <div class="sticker-card pink">
        <div class="sticker-header"><span class="sticker-char">抹茶</span><span class="sticker-pinyin">mǒ chá</span></div>
        <div class="sticker-vi">Trà xanh 🍵</div>
      </div>
      <div class="sticker-card pink">
        <div class="sticker-header"><span class="sticker-char">芒果</span><span class="sticker-pinyin">máng guǒ</span></div>
        <div class="sticker-vi">Xoài 🥭</div>
      </div>
      <div class="sticker-card pink">
        <div class="sticker-header"><span class="sticker-char">西瓜</span><span class="sticker-pinyin">xī guā</span></div>
        <div class="sticker-vi">Dưa hấu 🍉</div>
      </div>
    </div>
    
    <div class="kids-bubble">
      🍦 <strong>Giao tiếp thực tế cùng Lê Lê:</strong> Khi đưa bé đi ăn kem gelato mát lạnh ngày hè, ba mẹ hãy hỏi con: <strong>"你想吃什么口味的冰淇淋？" (Nǐ xiǎng chī shénme kǒuwèi de bīngqílín? - Con muốn ăn kem vị gì nào?)</strong>. Bé có thể tự tin trả lời: <strong>"我想吃草莓口味的！" (Wǒ xiǎng chī cǎoméi kǒuwèi de! - Con muốn ăn vị dâu tây ạ!)</strong>. Đây là cách kích hoạt ngôn ngữ qua ẩm thực vô cùng hiệu quả!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 10 / 30</div>
    </div>
  </div>

  <!-- PAGE 11: DRAGON BOAT FESTIVAL -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🐉 Lễ Hội Mùa Hè 1: Tết Đoan Ngọ (端午节)</h2>
    
    <p style="font-size:15px; line-height:1.75; color:#5A453A; text-align:justify; margin:0 0 15px 0;">
      Tết Đoan Ngọ hay còn gọi là **端午节 (Duān wǔ jié)**, diễn ra vào ngày 5 tháng 5 Âm lịch hằng năm (thường rơi vào tháng 6 Dương lịch). Đây là một lễ hội mùa hè vô cùng đặc sắc mang đậm dấu ấn văn hóa Á Đông. Lễ hội này được tổ chức để tưởng nhớ nhà thơ yêu nước nổi tiếng Khuất Nguyên thời cổ đại.
    </p>
    
    <div class="sticker-container" style="margin-bottom: 15px;">
      <div class="sticker-card green">
        <div class="sticker-header"><span class="sticker-char">端午节</span><span class="sticker-pinyin">Duān wǔ jié</span></div>
        <div class="sticker-vi">Tết Đoan Ngọ 🐉</div>
      </div>
      <div class="sticker-card green">
        <div class="sticker-header"><span class="sticker-char">粽子</span><span class="sticker-pinyin">zòng zi</span></div>
        <div class="sticker-vi">Bánh ú / bánh chưng 🍙</div>
      </div>
      <div class="sticker-card green">
        <div class="sticker-header"><span class="sticker-char">龙舟</span><span class="sticker-pinyin">lóng zhōu</span></div>
        <div class="sticker-vi">Thuyền rồng 🛶</div>
      </div>
      <div class="sticker-card green">
        <div class="sticker-header"><span class="sticker-char">赛龙舟</span><span class="sticker-pinyin">sài lóng zhōu</span></div>
        <div class="sticker-vi">Đua thuyền rồng 🏁</div>
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #FFF9E6; border-color: #FFB300;">
      🍙 <strong>Lê Lê kể chuyện văn hóa:</strong> Vào dịp Tết Đoan Ngọ, hoạt động hấp dẫn nhất là các cuộc thi đua thuyền rồng **赛龙舟 (sài lóngzhōu)** kịch tính trên sông nước. Đồng thời, mọi người cùng nhau thưởng thức món **粽子 (zòngzi)** – gạo nếp dẻo thơm được bọc nhân thịt, đậu xanh chưng cất rồi gói vuông vức bằng lá tre hoặc lá dong. Ba mẹ hãy cho con nếm thử món bánh này và kể con nghe câu chuyện thuyền rồng nhé!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 11 / 30</div>
    </div>
  </div>

  <!-- PAGE 12: QIXI FESTIVAL -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🌌 Lễ Hội Mùa Hè 2: Lễ Thất Tịch (七夕节)</h2>
    
    <p style="font-size:15px; line-height:1.75; color:#5A453A; text-align:justify; margin:0 0 15px 0;">
      Lễ Thất Tịch **七夕节 (Qī xī jié)** diễn ra vào ngày 7 tháng 7 Âm lịch hằng năm (thường rơi vào giữa hoặc cuối tháng 8 Dương lịch). Đây còn được xem là ngày lễ tình yêu truyền thống của người Trung Quốc. Đêm Thất Tịch trời mùa hè đầy sao lấp lánh, là thời điểm đẹp nhất để ngắm dải Ngân Hà.
    </p>
    
    <div class="sticker-container" style="margin-bottom: 15px;">
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">七夕节</span><span class="sticker-pinyin">Qī xī jié</span></div>
        <div class="sticker-vi">Lễ Thất Tịch 🌌</div>
      </div>
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">牛郎</span><span class="sticker-pinyin">niú láng</span></div>
        <div class="sticker-vi">Chàng Ngưu Lang 🐂</div>
      </div>
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">织女</span><span class="sticker-pinyin">zhī nǚ</span></div>
        <div class="sticker-vi">Nàng Chức Nữ 🧵</div>
      </div>
      <div class="sticker-card blue">
        <div class="sticker-header"><span class="sticker-char">喜鹊</span><span class="sticker-pinyin">xǐ què</span></div>
        <div class="sticker-vi">Chim hỷ thước 🐦</div>
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #FFF0F3; border-color: #FF7B90; color: #AD1457;">
      🌌 <strong>Truyền thuyết chòm sao mùa hè:</strong> Lễ Thất Tịch bắt nguồn từ câu chuyện tình yêu cảm động giữa chàng chăn bò Ngưu Lang **牛郎** và nàng tiên dệt vải Chức Nữ **织女**. Họ bị ngăn cách bởi dòng sông Ngân Hà rộng lớn, và chỉ được gặp nhau duy nhất một ngày trong năm nhờ chiếc cầu do hàng vạn con chim hỷ thước **喜鹊** bắc qua sông. Ba mẹ hãy cùng bé ngắm sao trời và kể câu chuyện cổ tích lãng mạn này nhé!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 12 / 30</div>
    </div>
  </div>

  <!-- PAGE 13: ACTIVITY 1: SCAVENGER HUNT -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🗺️ Hoạt Động 1: Bản Đồ Truy Tìm Kho Báu</h2>
    
    <div class="activity-box">
      <h3 class="activity-section-title">🏕️ Hướng dẫn cách chơi (How to play)</h3>
      <p class="activity-text">
        Scavenger Hunt (Truy tìm vật phẩm) là trò chơi vận động vô cùng kích thích sự tò mò của trẻ. Ba mẹ hãy ghi ra giấy danh sách từ khóa tiếng Trung của các đồ vật có sẵn trong khu vườn hoặc công viên, rồi yêu cầu bé đi tìm kiếm và thu thập chúng. Khi nhặt được một món đồ, bé phải đọc to từ vựng tiếng Trung tương ứng để ghi điểm!
      </p>
      
      <h3 class="activity-section-title">📋 Danh sách kho báu mẫu (Scavenger Checklist)</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size:14px; font-weight:700; color:#733F2E;">
        <div>⬜ 树叶 (shùyè): Chiếc lá cây 🍃</div>
        <div>⬜ 贝壳 (bèiké): Chiếc vỏ sò 🐚</div>
        <div>⬜ 花 (huā): Bông hoa nhỏ 🌸</div>
        <div>⬜ 石头 (shítou): Viên sỏi đá 🪨</div>
        <div>⬜ 泥土 (nítǔ): Một nhúm đất 🪱</div>
        <div>⬜ 蚂蚁 (mǎyǐ): Chú kiến nhỏ 🐜</div>
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #EBF5FB; border-color: #3498DB; color: #1B4F72;">
      🎯 <strong>Mẹo nhỏ từ Lê Lê:</strong> Ba mẹ có thể vẽ hình ảnh của các đồ vật này lên một tờ giấy cứng để bé cầm đi quanh vườn giống như một bản đồ kho báu thực thụ. Điều này giúp bé liên kết hình ảnh thực tế với mặt chữ Hán một cách sinh động, khắc sâu trí nhớ mà không cảm thấy gò bó.
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 13 / 30</div>
    </div>
  </div>

  <!-- PAGE 14: ACTIVITY 2: COLOR BY NUMBERS -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🎨 Hoạt Động 2: Tô Màu Theo Số Chữ Hán</h2>
    
    <div class="activity-box">
      <h3 class="activity-section-title">🖍️ Tập trung nhận diện mặt chữ số & màu sắc</h3>
      <p class="activity-text">
        Vào những buổi trưa hè nóng bức không thể ra ngoài chơi, tô màu theo số (Color by Numbers) là hoạt động trong nhà tuyệt vời giúp bé rèn luyện tính kiên nhẫn và ghi nhớ sâu mặt chữ Hán. Bé sẽ phải nhìn bảng mã màu được quy ước bằng chữ số chữ Hán và tô đúng màu sắc được yêu cầu lên bức tranh.
      </p>
      
      <h3 class="activity-section-title">🔑 Bảng quy ước màu sắc chữ Hán (Color Map)</h3>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; font-size:14.5px; font-weight:700; color:#733F2E;">
        <div style="background:#FFEbee; padding:6px; border-radius:8px;">一 (yī) = 红色 (hóngsè) - Màu đỏ 🔴</div>
        <div style="background:#FFF9E6; padding:6px; border-radius:8px;">二 (èr) = 黄色 (huángsè) - Màu vàng 🟡</div>
        <div style="background:#E3F2FD; padding:6px; border-radius:8px;">三 (sān) = 蓝色 (lánsè) - Màu xanh lam 🔵</div>
        <div style="background:#E8F5E9; padding:6px; border-radius:8px;">四 (sì) = 绿色 (lǜsè) - Màu xanh lá 🟢</div>
        <div style="background:#ECEFF1; padding:6px; border-radius:8px;">五 (wǔ) = 白色 (báisè) - Màu trắng ⚪</div>
        <div style="background:#CFD8DC; padding:6px; border-radius:8px;">六 (liù) = 黑色 (hēisè) - Màu đen ⚫</div>
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #FFF9E6; border-color: #FFB300;">
      💡 <strong>Lê Lê gợi ý hoạt động:</strong> Ba mẹ có thể tự vẽ các bức tranh vẽ ông mặt trời, đám mây hay chú cá dưới đại dương, đánh dấu các con số từ <strong>一</strong> đến <strong>六</strong> lên các mảng hình vẽ rồi cho bé tự tay chọn bút sáp và hoàn thiện tác phẩm của mình. Bé vừa thuộc số đếm, vừa thuộc tên gọi màu sắc chữ Hán!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 14 / 30</div>
    </div>
  </div>

  <!-- PAGE 15: ACTIVITY 3: BUG HUNT -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🐞 Hoạt Động 3: Đi Săn Côn Trùng & Dán Nhãn</h2>
    
    <div class="activity-box">
      <h3 class="activity-section-title">🔍 Quan sát thế giới tự nhiên bằng tiếng Trung</h3>
      <p class="activity-text">
        Mùa hè là mùa sinh sôi phát triển mạnh mẽ nhất của các loài côn trùng nhỏ trong vườn. Hãy trang bị cho bé một chiếc kính lúp nhỏ và một cuốn sổ tay thám hiểm. Mỗi lần bé tìm thấy một con ong, kiến hay ốc sên, hãy khuyến khích bé vẽ chú côn trùng đó vào sổ tay và ghi nhãn bằng chữ Hán kèm pinyin!
      </p>
      
      <h3 class="activity-section-title">✏️ Cách trình bày trang Nhật ký thám hiểm</h3>
      <div style="border: 2px dashed #733F2E; background: #FFFDF9; border-radius: 14px; padding: 12px; font-size:13.5px; color:#5A453A;">
        📌 <strong>Ngày:</strong> [Điền ngày hè tươi đẹp] | <strong>Địa điểm:</strong> Vườn nhà bé 🌱<br/>
        📸 <strong>Hình vẽ chú côn trùng bé quan sát được:</strong> [Bé tự vẽ chú bọ rùa tròn trịa 🐞]<br/>
        🏷️ <strong>Tên tiếng Trung:</strong> <span style="font-size:18px; font-weight:900; color:#C94535;">瓢虫</span> (piáochóng)<br/>
        📝 <strong>Bé học được gì:</strong> Chú bọ rùa có cái cánh màu đỏ đốm đen thật dễ thương!
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #FFF2F4; border-color: #FF7B90; color: #AD1457;">
      🐜 <strong>Mẹo nhỏ bổ ích:</strong> Hoạt động này vừa rèn luyện kỹ năng quan sát thực tế (khoa học tự nhiên), vừa giúp bé phát triển năng khiếu hội họa và ghi nhớ từ vựng tiếng Trung qua ngữ cảnh sống động nhất. Cuối hè, bé sẽ sở hữu một cuốn "Từ điển côn trùng" do chính mình thiết kế!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 15 / 30</div>
    </div>
  </div>

  <!-- PAGE 16: ACTIVITY 4: GELATO ROLE-PLAY -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🍦 Hoạt Động 4: Đóng Vai Tiệm Bán Kem Gelato</h2>
    
    <div class="activity-box">
      <h3 class="activity-section-title">🎭 Giao tiếp phản xạ qua trò chơi nhập vai (Role-play)</h3>
      <p class="activity-text">
        Ba mẹ hãy cùng con dựng một quầy bán kem giả lập bằng giấy carton hoặc các mô hình kem đồ chơi. Hãy chia vai: ba mẹ làm người bán kem (老板 - lǎobǎn hoặc 店员 - diànyuán) và bé làm khách mua kem (顾客 - gùkè), hoặc ngược lại. Sử dụng các đoạn hội thoại tiếng Trung đơn giản để gọi món và thanh toán.
      </p>
      
      <h3 class="activity-section-title">🗣️ Kịch bản hội thoại mẫu (Dialogue Script)</h3>
      <div style="font-size:14px; line-height:1.7; color:#5A453A; display:flex; flex-direction:column; gap:6px;">
        <div><strong>Người bán (A):</strong> 你好！你想吃什么口味的冰淇淋？<br/><span style="color:#777; font-style:italic;">(Nǐ hǎo! Nǐ xiǎng chī shénme kǒuwèi de bīngqílín? - Xin chào! Con muốn ăn kem vị gì nào?)</span></div>
        <div><strong>Khách hàng (B):</strong> 我要两个球，一个草莓口味，一个巧克力口味。<br/><span style="color:#777; font-style:italic;">(Wǒ yào liǎng ge qiú, yīge cǎoméi kǒuwèi, yīge qiǎokèlì kǒuwèi. - Con muốn lấy hai viên kem, một vị dâu tây và một vị sô-cô-la.)</span></div>
        <div><strong>Người bán (A):</strong> 好的，给你！一共十块钱。<br/><span style="color:#777; font-style:italic;">(Hǎo de, gěi nǐ! Yīgòng shí kuài qián. - Được rồi, của con đây! Tổng cộng 10 đồng nhé.)</span></div>
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #EBF8F2; border-color: #2ECC71; color: #117864;">
      💰 <strong>Bài học cuộc sống:</strong> Trò chơi này không chỉ dạy bé cách gọi tên các vị kem mà còn lồng ghép kỹ năng mua sắm cơ bản, cách dùng số đếm tiếng Trung để trả tiền và các câu chào hỏi lịch sự như <strong>谢谢 (Xièxie - Cảm ơn)</strong>, <strong>再见 (Zàijiàn - Tạm biệt)</strong>.
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 16 / 30</div>
    </div>
  </div>

  <!-- PAGE 17: ACTIVITY 5: PHOTO JOURNAL -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🏖️ Hoạt Động 5: Nhật Ký Ảnh Đi Biển Ghi Nhớ</h2>
    
    <div class="activity-box">
      <h3 class="activity-section-title">📸 Lưu giữ kỷ niệm hè kết hợp ghi nhãn từ vựng</h3>
      <p class="activity-text">
        Sau những chuyến du lịch biển mát mẻ, ba mẹ hãy rửa những bức ảnh chụp khoảnh khắc bé vui chơi trên cát, đi tắm biển hay nhặt vỏ sò. Dán ảnh vào một cuốn sổ nhật ký lớn và hướng dẫn bé viết các từ tiếng Trung tương ứng với những vật thể có mặt trong ảnh.
      </p>
      
      <h3 class="activity-section-title">🖼️ Thiết kế trang nhật ký hình ảnh mẫu (Journal Template)</h3>
      <div style="border: 2px dashed #733F2E; background: #FFFDF9; border-radius: 14px; padding: 12px; font-size:13.5px; color:#5A453A;">
        🏖️ <strong>Chuyến đi biển Nha Trang mùa hè năm 2026</strong><br/>
        🖼️ <strong>[Khung dán ảnh chụp bé đội mũ rơm cầm xô múc nước biển]</strong><br/>
        📍 <strong>Các từ khóa tiếng Trung trong ảnh bé phải tìm:</strong><br/>
        - 🌊 <strong>海水 (hǎishuǐ):</strong> Nước biển xanh mát<br/>
        - 🏖️ <strong>沙滩 (shātān):</strong> Bãi cát vàng mịn màng<br/>
        - 👒 <strong>帽子 (màozi):</strong> Chiếc mũ rơm che nắng của bé
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #EBF5FB; border-color: #3498DB; color: #1B4F72;">
      ✨ <strong>Gắn kết gia đình:</strong> Đây là hoạt động lưu niệm vô cùng ý nghĩa. Mỗi lần bé mở cuốn nhật ký ảnh ra ngắm nhìn lại những kỷ niệm đẹp đẽ hằng năm, bé sẽ tự động đọc lại các nhãn chữ Hán và khắc sâu từ vựng vào trí nhớ dài hạn một cách hết sức tự nhiên.
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 17 / 30</div>
    </div>
  </div>

  <!-- PAGE 18: ACTIVITY 6: CHARACTER OF THE DAY -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">📆 Hoạt Động 6: Mỗi Ngày Học Một Chữ Hán</h2>
    
    <div class="activity-box">
      <h3 class="activity-section-title">⏱️ Phương pháp tích tiểu thành đại (Micro-learning)</h3>
      <p class="activity-text">
        Học chữ Hán cần sự đều đặn hằng ngày. Thay vì bắt bé nhồi nhét quá nhiều từ vào cuối tuần, ba mẹ hãy áp dụng phương pháp "Mỗi ngày một chữ Hán". Hãy chuẩn bị các mảnh giấy flashcard bìa cứng lớn. Mỗi buổi sáng, ba mẹ viết một chữ Hán thật to, kèm pinyin và vẽ hình minh họa đáng yêu rồi dán lên cửa tủ lạnh hoặc bàn ăn của bé.
      </p>
      
      <h3 class="activity-section-title">📅 Lịch học mẫu 5 ngày trong tuần</h3>
      <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px; text-align:center;">
        <div style="background:#FFF2F4; border:2.2px solid #733F2E; border-radius:10px; padding:6px;"><strong>Thứ 2</strong><br/><span style="font-size:20px; font-weight:900;">日</span><br/><span style="font-size:10px; color:#555;">Mặt trời</span></div>
        <div style="background:#EBF8F2; border:2.2px solid #733F2E; border-radius:10px; padding:6px;"><strong>Thứ 3</strong><br/><span style="font-size:20px; font-weight:900;">月</span><br/><span style="font-size:10px; color:#555;">Mặt trăng</span></div>
        <div style="background:#EBF5FB; border:2.2px solid #733F2E; border-radius:10px; padding:6px;"><strong>Thứ 4</strong><br/><span style="font-size:20px; font-weight:900;">山</span><br/><span style="font-size:10px; color:#555;">Ngọn núi</span></div>
        <div style="background:#FFF9E6; border:2.2px solid #733F2E; border-radius:10px; padding:6px;"><strong>Thứ 5</strong><br/><span style="font-size:20px; font-weight:900;">水</span><br/><span style="font-size:10px; color:#555;">Nước</span></div>
        <div style="background:#F2EBD9; border:2.2px solid #733F2E; border-radius:10px; padding:6px;"><strong>Thứ 6</strong><br/><span style="font-size:20px; font-weight:900;">火</span><br/><span style="font-size:10px; color:#555;">Ngọn lửa</span></div>
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #FFF9E6; border-color: #FFB300;">
      🎯 <strong>Khen thưởng động viên:</strong> Suốt ngày hôm đó, mỗi lần đi qua chiếc tủ lạnh, ba mẹ hãy rủ bé chỉ tay vào chữ và đọc to phát âm. Cuối tuần, hãy tổ chức một mini-game ôn tập nhanh và thưởng cho bé một miếng dán sticker dễ thương để dán lên bảng thành tích nhé!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 18 / 30</div>
    </div>
  </div>

  <!-- PAGE 19: 12-WEEK ROADMAP: WEEK 1 & 2 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🗓️ Kế Hoạch 12 Tuần Hè: Tuần 1 & Tuần 2</h2>
    
    <p style="font-size:14.5px; line-height:1.7; color:#5A453A; margin:0 0 12px 0;">
      Học từ vựng theo chủ đề (Theme-based learning) là cách học khoa học giúp các bé liên kết từ vựng có liên quan với nhau dễ dàng hơn. Dưới đây là lộ trình học tập chi tiết trong 12 tuần nghỉ hè để bé tích lũy dần 300 từ vựng cốt lõi.
    </p>
    
    <div class="week-container">
      <div class="week-card pink">
        <h3 class="week-title">🗓️ Tuần 1</h3>
        <div class="week-theme">🐼 Chủ đề: Động Vật (Animals)</div>
        <ul class="week-vocab-list">
          <li>猫 (māo) - Con mèo 🐱</li>
          <li>狗 (gǒu) - Con chó 🐶</li>
          <li>鸟 (niǎo) - Con chim 🐦</li>
          <li>鱼 (yú) - Con cá 🐟</li>
          <li>熊猫 (xióngmāo) - Gấu trúc 🐼</li>
          <li>兔子 (tùzi) - Con thỏ 🐰</li>
        </ul>
      </div>
      
      <div class="week-card blue">
        <h3 class="week-title">🗓️ Tuần 2</h3>
        <div class="week-theme">🎨 Chủ đề: Màu Sắc (Colors)</div>
        <ul class="week-vocab-list">
          <li>红色 (hóngsè) - Màu đỏ 🔴</li>
          <li>黄色 (huángsè) - Màu vàng 🟡</li>
          <li>蓝色 (lánsè) - Màu xanh lam 🔵</li>
          <li>绿色 (lǜsè) - Màu xanh lá 🟢</li>
          <li>黑色 (hēisè) - Màu đen ⚫</li>
          <li>白色 (báisè) - Màu trắng ⚪</li>
        </ul>
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #FFF9E6; border-color: #FFB300;">
      💡 <strong>Lê Lê gợi ý thực hành:</strong> Ba mẹ có thể cho bé thực hành ghép từ của tuần 1 và tuần 2 lại để nói cả cụm từ ngắn: <strong>红色的猫 (hóngsè de māo - con mèo màu đỏ)</strong>, <strong>黄色的鱼 (huángsè de yú - con cá màu vàng)</strong>... Cách này giúp bé bước đầu nắm vững quy tắc bổ ngữ bổ nghĩa cho danh từ trong tiếng Trung.
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 19 / 30</div>
    </div>
  </div>

  <!-- PAGE 20: 12-WEEK ROADMAP: WEEK 3 & 4 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🗓️ Kế Hoạch 12 Tuần Hè: Tuần 3 & Tuần 4</h2>
    
    <div class="week-container">
      <div class="week-card green">
        <h3 class="week-title">🗓️ Tuần 3</h3>
        <div class="week-theme">🍎 Chủ đề: Thức Ăn (Food & Fruits)</div>
        <ul class="week-vocab-list">
          <li>苹果 (píngguǒ) - Quả táo 🍎</li>
          <li>香蕉 (xiāngjiāo) - Quả chuối 🍌</li>
          <li>西瓜 (xīguā) - Dưa hấu 🍉</li>
          <li>面包 (miànbāo) - Bánh mì 🍞</li>
          <li>牛奶 (niúnǎi) - Sữa bò 🥛</li>
          <li>水 (shuǐ) - Nước uống 💧</li>
        </ul>
      </div>
      
      <div class="week-card yellow">
        <h3 class="week-title">🗓️ Tuần 4</h3>
        <div class="week-theme">🏠 Chủ đề: Gia Đình (Family members)</div>
        <ul class="week-vocab-list">
          <li>爸爸 (bàba) - Bố, cha 👨</li>
          <li>妈妈 (māma) - Mẹ 👩</li>
          <li>爷爷 (yéye) - Ông nội 👴</li>
          <li>奶奶 (nǎinai) - Bà nội 👵</li>
          <li>哥哥 (gēge) - Anh trai 👦</li>
          <li>姐姐 (jiějie) - Chị gái 👧</li>
        </ul>
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #FFF2F4; border-color: #FF7B90; color: #AD1457;">
      🍉 <strong>Gắn kết gia đình hằng ngày:</strong> Trong bữa ăn gia đình hằng ngày, ba mẹ hãy hỏi con: <strong>"妈妈吃 cái gì?" (Māma chī...)</strong>, bé sẽ trả lời <strong>"妈妈吃苹果" (Māma chī píngguǒ - Mẹ ăn táo)</strong>. Hãy lồng ghép từ vựng của hai tuần này để tạo ra những cuộc hội thoại nhỏ siêu nhí nhố và vui nhộn.
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 20 / 30</div>
    </div>
  </div>

  <!-- PAGE 21: 12-WEEK ROADMAP: WEEK 5 & 6 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🗓️ Kế Hoạch 12 Tuần Hè: Tuần 5 & Tuần 6</h2>
    
    <div class="week-container">
      <div class="week-card pink">
        <h3 class="week-title">🗓️ Tuần 5</h3>
        <div class="week-theme">👁️ Chủ đề: Bộ Phận Cơ Thể (Body parts)</div>
        <ul class="week-vocab-list">
          <li>眼睛 (yǎnjing) - Đôi mắt 👁️</li>
          <li>耳朵 (ěrduo) - Cái tai 👂</li>
          <li>鼻子 (bízi) - Cái mũi 👃</li>
          <li>嘴巴 (zuǐba) - Cái miệng 👄</li>
          <li>手 (shǒu) - Bàn tay ✋</li>
          <li>脚 (jiǎo) - Bàn chân 👣</li>
        </ul>
      </div>
      
      <div class="week-card blue">
        <h3 class="week-title">🗓️ Tuần 6</h3>
        <div class="week-theme">🏃 Chủ đề: Hành Động (Actions)</div>
        <ul class="week-vocab-list">
          <li>看 (kàn) - Nhìn, xem 👀</li>
          <li>听 (tīng) - Nghe 👂</li>
          <li>吃 (chī) - Ăn 😋</li>
          <li>喝 (hē) - Uống 🥛</li>
          <li>跑 (pǎo) - Chạy 🏃</li>
          <li>跳 (tiào) - Nhảy 🦘</li>
        </ul>
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #EBF8F2; border-color: #2ECC71; color: #117864;">
      🏃 <strong>Trò chơi vận động "Lê Lê bảo...":</strong> Ba mẹ hãy chơi trò chơi Simon Says (Lê Lê bảo...) bằng tiếng Trung cùng con. Khi ba mẹ hô: <strong>"乐乐说：用手摸鼻子！" (Lèlè shuō: yòng shǒu mō bízi! - Lê Lê bảo: dùng tay sờ mũi!)</strong>, bé sẽ phải làm theo. Trò chơi phản xạ này vô cùng thu hút các bé vận động trong những ngày hè.
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 21 / 30</div>
    </div>
  </div>

  <!-- PAGE 22: 12-WEEK ROADMAP: WEEK 7 & 8 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🗓️ Kế Hoạch 12 Tuần Hè: Tuần 7 & Tuần 8</h2>
    
    <div class="week-container">
      <div class="week-card green">
        <h3 class="week-title">🗓️ Tuần 7</h3>
        <div class="week-theme">☁️ Chủ đề: Thời Tiết (Weather)</div>
        <ul class="week-vocab-list">
          <li>晴天 (qíngtiān) - Trời nắng ☀️</li>
          <li>阴天 (yīntiān) - Trời râm mát ☁️</li>
          <li>下雨 (xiàyǔ) - Trời mưa 🌧️</li>
          <li>刮风 (guāfēng) - Trời gió 💨</li>
          <li>下雪 (xiàxuě) - Trời tuyết ❄️</li>
          <li>热 (rè) - Nóng bức 🔥</li>
        </ul>
      </div>
      
      <div class="week-card yellow">
        <h3 class="week-title">🗓️ Tuần 8</h3>
        <div class="week-theme">🏫 Chủ đề: Địa Điểm (Places)</div>
        <ul class="week-vocab-list">
          <li>家 (jiā) - Nhà ở 🏠</li>
          <li>学校 (xuéxiào) - Trường học 🏫</li>
          <li>公园 (gōngyuán) - Công viên 🌳</li>
          <li>海边 (hǎibiān) - Bờ biển 🏖️</li>
          <li>商店 (shāngdiàn) - Cửa hàng 🏪</li>
          <li>动物园 (dòngwùyuán) - Vườn thú 🦁</li>
        </ul>
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #EBF5FB; border-color: #3498DB; color: #1B4F72;">
      🌦️ <strong>Quan sát thời tiết hằng ngày:</strong> Mỗi sáng thức dậy, ba mẹ hãy dắt bé ra cửa sổ, chỉ lên bầu trời và hỏi bé bằng tiếng Trung: <strong>"今天天气怎么样？" (Jīntiān tiānqì zěnmeyàng? - Thời tiết hôm nay thế nào nhỉ?)</strong>. Bé sẽ trả lời dựa theo thực tế: <strong>"今天是晴天！" (Jīntiān shì qíngtiān! - Hôm nay trời nắng ạ!)</strong>.
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 22 / 30</div>
    </div>
  </div>

  <!-- PAGE 23: 12-WEEK ROADMAP: WEEK 9 & 10 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🗓️ Kế Hoạch 12 Tuần Hè: Tuần 9 & Tuần 10</h2>
    
    <div class="week-container">
      <div class="week-card pink">
        <h3 class="week-title">🗓️ Tuần 9</h3>
        <div class="week-theme">🔢 Chủ đề: Số Đếm (Numbers)</div>
        <ul class="week-vocab-list">
          <li>一 (yī) - Số 1 ☝️</li>
          <li>二 (èr) - Số 2 ✌️</li>
          <li>三 (sān) - Số 3 🤟</li>
          <li>四 (sì) - Số 4 🖖</li>
          <li>五 (wù) - Số 5 🖐️</li>
          <li>十 (shí) - Số 10 👐</li>
        </ul>
      </div>
      
      <div class="week-card blue">
        <h3 class="week-title">🗓️ Tuần 10</h3>
        <div class="week-theme">🎒 Chủ đề: Đồ Vật (Common objects)</div>
        <ul class="week-vocab-list">
          <li>书 (shū) - Quyển sách 📚</li>
          <li>笔 (bǐ) - Cây bút viết ✏️</li>
          <li>书包 (shūbāo) - Cặp sách 🎒</li>
          <li>玩具 (wánjù) - Đồ chơi 🧸</li>
          <li>桌子 (zhuōzi) - Cái bàn 🪟</li>
          <li>椅子 (yǐzi) - Cái ghế 🪑</li>
        </ul>
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #FFF9E6; border-color: #FFB300;">
      🧸 <strong>Trò chơi đếm đồ chơi:</strong> Hãy tập trung toàn bộ đồ chơi yêu thích của bé ra sàn nhà, rồi chơi trò chơi phân loại và đếm số lượng: <strong>"这里有三个玩具" (Zhèlǐ yǒu sān ge wánjù - Ở đây có 3 món đồ chơi)</strong>. Vừa giúp con dọn dẹp phòng ngăn nắp, vừa ôn tập từ vựng cực kỳ vui!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 23 / 30</div>
    </div>
  </div>

  <!-- PAGE 24: 12-WEEK ROADMAP: WEEK 11 & 12 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🗓️ Kế Hoạch 12 Tuần Hè: Tuần 11 & Tuần 12</h2>
    
    <div class="week-container">
      <div class="week-card green">
        <h3 class="week-title">🗓️ Tuần 11</h3>
        <div class="week-theme">😊 Chủ đề: Trạng Thái & Cảm Xúc (Feelings)</div>
        <ul class="week-vocab-list">
          <li>高兴 (gāoxìng) - Vui vẻ, hạnh phúc 😊</li>
          <li>生气 (shēngqì) - Tức giận 😡</li>
          <li>累 (lèi) - Mệt mỏi 🥱</li>
          <li>饿 (è) - Đói bụng 🤤</li>
          <li>渴 (kě) - Khát nước 🥵</li>
          <li>喜欢 (xǐhuan) - Yêu thích ❤️</li>
        </ul>
      </div>
      
      <div class="week-card yellow">
        <h3 class="week-title">🗓️ Tuần 12</h3>
        <div class="week-theme">🗣️ Chủ đề: Giao Tiếp Hằng Ngày</div>
        <ul class="week-vocab-list">
          <li>你好 (nǐ hǎo) - Xin chào 👋</li>
          <li>谢谢 (xièxie) - Cảm ơn 🙏</li>
          <li>不客气 (bù kèqi) - Không có chi, đừng khách sáo 🤝</li>
          <li>对不起 (duìbuqǐ) - Xin lỗi 🙇</li>
          <li>没关系 (méi guānxi) - Không sao đâu ⭕</li>
          <li>再见 (zàijiàn) - Tạm biệt 👋</li>
        </ul>
      </div>
    </div>
    
    <div class="kids-bubble" style="background: #FFF2F4; border-color: #FF7B90; color: #AD1457;">
      🏅 <strong>Chúc mừng bé đã hoàn thành!</strong> Trải qua 12 tuần học tập nhẹ nhàng, bé yêu đã làm quen với 72 từ vựng cốt lõi phân bố khoa học theo các chủ đề gần gũi nhất. Ba mẹ hãy trao cho con một buổi lễ tốt nghiệp nhỏ, tặng bé một que kem ngon lành để ghi nhận sự kiên trì tuyệt vời nhé!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 24 / 30</div>
    </div>
  </div>

  <!-- PAGE 25: SUMMER READING GUIDE -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">📖 Hướng Dẫn Đọc Sách Hè Cho Bé</h2>
    
    <p style="font-size:15px; line-height:1.75; color:#5A453A; text-align:justify; margin:0 0 15px 0;">
      Đọc sách hằng ngày chính là "vũ khí bí mật" giúp trẻ duy trì khả năng ngôn ngữ và chống lại hiện tượng **"Trượt dốc mùa hè" (Summer Slide)** - tình trạng trẻ bị quên bớt từ vựng và phản xạ giao tiếp sau một kỳ nghỉ dài không sử dụng tiếng Trung.
    </p>
    
    <div class="activity-box" style="margin-top: 10px;">
      <h3 class="activity-section-title">📚 Các loại sách phù hợp cho mùa hè</h3>
      <ul style="margin: 0; padding-left: 20px; font-size:14px; line-height:1.7; color:#5A453A;">
        <li><strong>Truyện tranh ngắn (Beginner Picture Books)</strong>: Sách chỉ có từ 1 đến 3 từ mỗi trang, lặp đi lặp lại nhiều lần kèm hình minh họa cực lớn để bé dễ đoán nghĩa.</li>
        <li><strong>Truyện song ngữ dễ thương</strong>: Các câu chuyện ngụ ngôn quen thuộc được dịch nghĩa song ngữ Trung-Việt siêu dễ hiểu.</li>
        <li><strong>Sách chủ đề thiên nhiên</strong>: Các đầu sách tranh kể về bãi biển, cây cỏ, các chuyến cắm trại hay thế giới côn trùng sống động.</li>
      </ul>
    </div>
    
    <div class="kids-bubble" style="background: #EBF8F2; border-color: #2ECC71; color: #117864;">
      ⏱️ <strong>Thiết lập thói quen 10 phút hằng ngày:</strong> Ba mẹ không cần ép con đọc quá nhiều. Chỉ cần **10 phút mỗi ngày** trước khi đi ngủ hoặc ngay sau bữa sáng. Sau mỗi cuốn sách bé hoàn thành, hãy dán một ngôi sao sticker lên bảng thử thách. Tích lũy 10 ngôi sao sẽ đổi được một món quà nhỏ từ ba mẹ!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 25 / 30</div>
    </div>
  </div>

  <!-- PAGE 26: FAQ - PART 1 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">❓ Hỏi Đáp (FAQ) Cho Phụ Huynh - Phần 1</h2>
    
    <div class="faq-item">
      <h3 class="faq-q">❓ Q1: Làm thế nào để giữ động lực học tiếng Trung cho bé suốt mùa hè?</h3>
      <p class="faq-a">
        Chìa khóa nằm ở tính chất **vui nhộn và thực tế**. Đừng biến việc học tiếng Trung thành gánh nặng lý thuyết hay bài tập bắt buộc. Ba mẹ hãy kết hợp từ vựng vào các cuộc đi chơi ngoài trời, tập hát đồng dao, tô màu hoặc nấu ăn trong bếp. Chỉ cần con thấy tiếng Trung xuất hiện trong hoạt động vui chơi là con sẽ thích ngay!
      </p>
    </div>
    
    <div class="faq-item">
      <h3 class="faq-q">❓ Q2: Một mùa hè bé nên học bao nhiêu chữ Hán là phù hợp nhất?</h3>
      <p class="faq-a">
        Một mục tiêu thực tế và truyền cảm hứng là chinh phục **300 chữ Hán thông dụng** trong vòng 8-12 tuần nghỉ hè (khoảng 25 từ mỗi tuần). 300 từ này chiếm tới 60% tần suất xuất hiện trong các sách truyện thiếu nhi hằng ngày. Vượt qua cột mốc này, con có thể tự tin đọc các đầu sách truyện tranh cơ bản một cách độc lập!
      </p>
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 26 / 30</div>
    </div>
  </div>

  <!-- PAGE 27: FAQ - PART 2 -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">❓ Hỏi Đáp (FAQ) Cho Phụ Huynh - Phần 2</h2>
    
    <div class="faq-item">
      <h3 class="faq-q">❓ Q3: Ba mẹ không biết tiếng Trung thì làm sao đồng hành cùng con?</h3>
      <p class="faq-a">
        Ba mẹ hoàn toàn yên tâm nhé! Cuốn cẩm nang này đã ghi rất rõ phiên âm pinyin và nghĩa dịch Việt tương ứng. Hơn thế nữa, ba mẹ có thể truy cập website **lelehoctiengtrung.github.io** để mở các video bài học chạy thật của Lê Lê để con nghe cách phát âm giọng chuẩn, sau đó hai mẹ con cùng tập bắt chước theo. Hãy biến mình thành người bạn đồng hành "cùng học" với con!
      </p>
    </div>
    
    <div class="faq-item">
      <h3 class="faq-q">❓ Q4: Bé nên học chữ Hán Giản Thể hay Phồn Thể?</h3>
      <p class="faq-a">
        Đối với trẻ em và người mới bắt đầu học từ con số không, **chữ Giản Thể (Simplified Chinese)** là lựa chọn phổ biến và dễ tiếp cận nhất vì nét chữ tinh giản hơn, dễ viết và được sử dụng rộng rãi tại Trung Quốc đại lục, Singapore. Tuy nhiên, nếu gia đình muốn bé kết nối văn hóa truyền thống sâu sắc hơn, chữ Phồn Thể cũng rất tốt. Hãy chọn loại chữ phù hợp với mục tiêu lâu dài của gia đình mình nhé!
      </p>
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 27 / 30</div>
    </div>
  </div>

  <!-- PAGE 28: PRINTABLE RESOURCES -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🎨 Tổng Hợp Tài Nguyên Mùa Hè Cho Bé</h2>
    
    <p style="font-size:15px; line-height:1.75; color:#5A453A; text-align:justify; margin:0 0 15px 0;">
      Để tải trọn bộ tài liệu in ấn chất lượng cao gồm flashcard, bảng tô màu theo số, bài tập luyện viết chữ Hán và các truyện đọc tương tác, ba mẹ hãy tham khảo các liên kết chia sẻ miễn phí dưới đây từ hệ thống học tập của Lê Lê:
    </p>
    
    <div class="toc-list" style="margin-top: 10px;">
      <div class="toc-item"><span>☀️ Bảng từ vựng Mùa hè Montessori 3 phần</span><span>Tải miễn phí 📥</span></div>
      <div class="toc-item"><span>🍦 Tập tô màu chủ đề Kem Gelato ngọt ngào</span><span>Tải miễn phí 📥</span></div>
      <div class="toc-item"><span>🐛 Bảng chép bài thơ "Trùng Trùng Phi" có ô ly</span><span>Tải miễn phí 📥</span></div>
      <div class="toc-item"><span>📊 Lịch 30 ngày thử thách tự học có chữ ký Lê Lê</span><span>Tải miễn phí 📥</span></div>
      <div class="toc-item"><span>📚 Kho tàng sách đọc cấp độ aa đến C cho bé</span><span>Đọc online 📖</span></div>
    </div>
    
    <div class="kids-bubble" style="background: #FFF9E6; border-color: #FFB300;">
      📥 <strong>Cách nhận tài liệu:</strong> Ba mẹ vui lòng truy cập website chính thức tại địa chỉ **lelehoctiengtrung.github.io** và điều hướng đến mục **"Thư viện tài liệu chia sẻ"** để tải về và in màu khổ A4 cho bé luyện viết hằng ngày nhé!
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 28 / 30</div>
    </div>
  </div>

  <!-- PAGE 29: 30-DAY CHALLENGE -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🏆 Thử Thách 30 Ngày Kiên Trì Cùng Bé</h2>
    
    <p style="font-size:14.5px; line-height:1.7; color:#5A453A; margin:0 0 10px 0;">
      Sau khi bé hoàn thành 10-15 phút học tiếng Trung vui nhộn hằng ngày, ba mẹ hãy giúp con tích tích vào các ô vuông bên dưới bằng một chiếc nhãn dán sticker dễ thương để ghi nhận sự kiên trì tuyệt vời nhé!
    </p>
    
    <div class="challenge-grid">
      <div class="challenge-day checked">Ngày 1 <span class="challenge-check">✔️</span></div>
      <div class="challenge-day checked">Ngày 2 <span class="challenge-check">✔️</span></div>
      <div class="challenge-day">Ngày 3</div>
      <div class="challenge-day">Ngày 4</div>
      <div class="challenge-day">Ngày 5</div>
      <div class="challenge-day">Ngày 6</div>
      <div class="challenge-day">Ngày 7</div>
      <div class="challenge-day">Ngày 8</div>
      <div class="challenge-day">Ngày 9</div>
      <div class="challenge-day">Ngày 10</div>
      <div class="challenge-day">Ngày 11</div>
      <div class="challenge-day">Ngày 12</div>
      <div class="challenge-day">Ngày 13</div>
      <div class="challenge-day">Ngày 14</div>
      <div class="challenge-day">Ngày 15</div>
      <div class="challenge-day">Ngày 16</div>
      <div class="challenge-day">Ngày 17</div>
      <div class="challenge-day">Ngày 18</div>
      <div class="challenge-day">Ngày 19</div>
      <div class="challenge-day">Ngày 20</div>
      <div class="challenge-day">Ngày 21</div>
      <div class="challenge-day">Ngày 22</div>
      <div class="challenge-day">Ngày 23</div>
      <div class="challenge-day">Ngày 24</div>
      <div class="challenge-day">Ngày 25</div>
      <div class="challenge-day">Ngày 26</div>
      <div class="challenge-day">Ngày 27</div>
      <div class="challenge-day">Ngày 28</div>
      <div class="challenge-day">Ngày 29</div>
      <div class="challenge-day">Ngày 30</div>
    </div>
    
    <div class="kids-bubble" style="background: #FFF5F6; border-color: #FF7B90; color: #AD1457; margin-top: 15px;">
      ⭐ <strong>Lời hứa của con:</strong> "Con hứa sẽ luôn chăm chỉ, kiên trì học thêm nhiều từ vựng và chữ Hán dễ thương mỗi ngày để khám phá thế giới rộng lớn xung quanh!"
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 29 / 30</div>
    </div>
  </div>

  <!-- PAGE 30: CONCLUSION & COPYRIGHT -->
  <div class="page">
    <div class="header">
      <div class="header-left">
        <span class="logo-text">乐乐</span>
        <span>| Cẩm Nang Học Tiếng Trung Mùa Hè ☀️</span>
      </div>
      <div>Lê Lê học tiếng Trung 🌸</div>
    </div>
    
    <h2 class="page-title">🌸 Lời Kết & Thông Tin Tác Quyền</h2>
    
    <p style="font-size:15px; line-height:1.75; color:#5A453A; text-align:justify; margin:0 0 15px 0;">
      Hành trình học một ngôn ngữ mới cũng giống như việc gieo một hạt mầm nhỏ trong khu vườn. Mùa hè với ánh nắng ấm áp, những cơn mưa rào tưới tắm chính là môi trường lý tưởng nhất để hạt mầm ấy đâm chồi nảy lộc. Không áp lực, không vội vã, chỉ có sự tò mò và niềm đam mê khám phá tự nhiên.
    </p>
    <p style="font-size:15px; line-height:1.75; color:#5A453A; text-align:justify; margin:0 0 15px 0;">
      Lê Lê vô cùng trân trọng sự tin tưởng của các bậc phụ huynh và tình yêu học tập của các bé dành cho Hán ngữ. Mong rằng cuốn sổ tay cẩm nang này sẽ mang lại thật nhiều giá trị hữu ích và những khoảnh khắc gắn kết đầm ấm cho cả gia đình trong những ngày hè tươi đẹp này!
    </p>
    
    <div style="border: 2px dashed #733F2E; background: #FFFDF9; border-radius: 14px; padding: 15px; font-size:13px; color:#5A453A; margin-top: 15px;">
      🛡️ <strong>Thông tin Bản quyền & Điều khoản chia sẻ:</strong><br/>
      Tài liệu này được biên soạn, thiết kế bởi <strong>Lê Lê học tiếng Trung</strong> (lelehoctiengtrung.github.io).<br/>
      - Nghiêm cấm mọi hành vi sao chép, thương mại hóa hoặc bán lại tài liệu dưới mọi hình thức.<br/>
      - Khuyến khích ba mẹ chia sẻ miễn phí tài liệu này đến cộng đồng tự học tiếng Trung cho bé nhằm lan tỏa tri thức hữu ích.<br/>
      - Bản quyền hình ảnh minh họa thuộc về Lê Lê học tiếng Trung & các đối tác liên quan.
    </div>
    
    <div class="footer">
      <div>Tài liệu chia sẻ miễn phí tại lelehoctiengtrung.github.io</div>
      <div>Trang 30 / 30</div>
    </div>
  </div>

</body>
</html>
"""

# Save to html file
html_file_path = os.path.join(scratch_dir, "generate_summer_pdf.html")
with open(html_file_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"generate_summer_pdf.html successfully created at: {html_file_path}")

# Print to PDF using Headless Chrome
print("Calling Headless Chrome to print to PDF...")
chrome_path = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
output_pdf = "POSTS/docs/DOC-SUMMER.pdf"
abs_pdf = os.path.abspath(output_pdf)
abs_html = os.path.abspath(html_file_path)

# Make sure folder exists
os.makedirs(os.path.dirname(output_pdf), exist_ok=True)

cmd = [
    chrome_path,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--user-data-dir=/tmp/chrome-profile-summer",
    "--print-to-pdf=" + abs_pdf,
    abs_html
]

try:
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    print(f"Successfully generated Summer PDF: {output_pdf}")
except subprocess.CalledProcessError as e:
    print("Error calling Chrome to print PDF:")
    print(e.stderr)
    exit(1)
