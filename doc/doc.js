/* ============================================================
   doc.js — Lê Lê Document Post Page
   Load document data từ Google Sheets theo ?id= param
   URL: /doc/doc.html?id=DOC-500
============================================================ */

// ── CONFIG ────────────────────────────────────────────────
const SHEET_ID   = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o';
const SHEET_NAME = 'docs';

// Columns in sheet 'docs' (Row 1 = keys, Row 2 = labels, Row 3+ = data)
const COL = {
  id:             0,
  title:          1,
  desc:           2,
  category:       3,
  icon:           4,
  icon_color:     5,
  pages:          6,
  level:          7,
  level_text:     8,
  drive_url:      9,
  content:        10,
  pros:           11,
  cons:           12,
  who_for:        13,
  preview_images: 14,
};

// ---- Fallback data for preview ----
const FALLBACK_DOCS = {
  'DOC-500': {
    id: 'DOC-500',
    title: '500 Từ Vựng Thông Dụng Nhất',
    desc: 'Danh sách 500 từ hay gặp nhất trong tiếng Trung hàng ngày, kèm pinyin và nghĩa tiếng Việt. Phù hợp cho người mới bắt đầu.',
    category: 'vocab',
    icon: '📝',
    icon_color: '#D4A843',
    pages: 'PDF · 12 trang',
    level: '2',
    level_text: 'Cơ bản · HSK 1–2',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE',
    content: 'Khi mới bắt đầu học tiếng Trung, điều khiến nhiều bạn nản nhất chính là việc ghi nhớ từ vựng. Bản thân Lê Lê khi xưa cũng từng loay hoay không biết nên học từ nào trước, từ nào sau.\n\nChính vì vậy, mình đã biên soạn tập tài liệu **500 Từ Vựng Thông Dụng Nhất** này. Đây là tập hợp những từ vựng có tần suất xuất hiện cao nhất trong đời sống thường nhật của người Trung Quốc. Thay vì học lan man những từ chuyên ngành phức tạp, học 500 từ cốt lõi này sẽ giúp bạn hiểu được đến 70% các đoạn hội thoại giao tiếp cơ bản hàng ngày.\n\nMỗi từ vựng đều được Lê Lê ghi rõ chữ Hán giản thể, phiên âm Pinyin chuẩn và nghĩa tiếng Việt dễ hiểu nhất. Hãy in tài liệu này ra hoặc lưu vào máy để học mỗi ngày 10 từ nhé, chỉ sau chưa đầy 2 tháng là vốn từ giao tiếp của bạn đã thay đổi rõ rệt rồi!',
    pros: 'Từ vựng thực tế, tần suất sử dụng cao | Pinyin và nghĩa dịch chuẩn xác | Trình bày thoáng, dễ nhìn',
    cons: 'Chưa có file audio đi kèm phát âm | Cần tự đặt câu để nhớ lâu hơn',
    who_for: 'Phù hợp cho các bạn mới bắt đầu học tiếng Trung (HSK 1-2) hoặc người đi làm muốn tích lũy vốn từ giao tiếp nhanh.',
    preview_images: '../book1.png,../book2.png'
  },
  'DOC-GRAMMAR': {
    id: 'DOC-GRAMMAR',
    title: 'Ngữ Pháp Tiếng Trung Cơ Bản',
    desc: 'Tổng hợp các cấu trúc ngữ pháp quan trọng nhất, ví dụ minh hoạ rõ ràng bằng tiếng Việt. Học xong nói câu đúng ngay.',
    category: 'grammar',
    icon: '📚',
    icon_color: '#C94535',
    pages: 'PDF · 28 trang',
    level: '3',
    level_text: 'Trung cấp · HSK 2–3',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE',
    content: 'Tiếng Trung có một câu nói rất hay: "Từ vựng là gạch, ngữ pháp là xi măng". Nếu không có xi măng kết dính, bạn sẽ không bao giờ xây dựng được một câu hoàn chỉnh, dù có sở hữu nhiều gạch đến đâu.\n\nTài liệu **Ngữ Pháp Tiếng Trung Cơ Bản** này chính là cuốn cẩm nang thu nhỏ giúp bạn tổng hợp 30 cấu trúc cốt lõi nhất. Từ cách dùng các giới từ cơ bản, bổ ngữ kết quả, bổ ngữ trạng thái, cho đến các câu so sánh hay câu chữ 把 đều được giải thích vô cùng tường tận.\n\nĐiểm đặc biệt của tài liệu này là Lê Lê luôn đưa ra các ví dụ song ngữ Trung - Việt, dịch nghĩa chi tiết và kèm chú thích về lỗi sai mà các bạn học viên Việt Nam hay mắc phải do ảnh hưởng của tư duy tiếng Việt. Học xong bộ này, đảm bảo bạn sẽ tự tin viết câu và nói câu chuẩn ngữ pháp bản xứ!',
    pros: 'Giải thích ngữ pháp rất dễ hiểu bằng tiếng Việt | Ví dụ song ngữ phong phú | Có phân biệt các từ dễ nhầm lẫn',
    cons: 'Tài liệu khá nhiều chữ | Cần kiên trì làm thêm bài tập bên ngoài để áp dụng',
    who_for: 'Dành cho các bạn đã có vốn từ vựng cơ bản và muốn học cách ghép câu chính xác (HSK 2-3).',
    preview_images: '../book3.png,../book5.png'
  },
  'DOC-HSK': {
    id: 'DOC-HSK',
    title: 'Đề Thi Thử HSK 1 & 2',
    desc: 'Bộ đề thi thử HSK cấp 1 và 2 với đáp án đầy đủ. Luyện xong tự tin thi thật! Lê Lê đã dùng đề này để ôn thi.',
    category: 'hsk',
    icon: '🎯',
    icon_color: '#3b7fd4',
    pages: 'PDF · 35 trang · Có đáp án',
    level: '2',
    level_text: 'Cơ bản · HSK 1–2',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE',
    content: 'Học mà không đi đôi với hành thì rất khó để biết thực lực của mình đến đâu. Kỳ thi HSK chính là thước đo chuẩn xác nhất cho quá trình học tiếng Trung của bạn.\n\nĐể giúp các bạn học viên cởi bỏ tâm lý lo lắng trước phòng thi, Lê Lê đã tổng hợp bộ **Đề Thi Thử HSK 1 & 2** này. Đây là các bộ đề được thiết kế theo đúng form đề thi thật chuẩn của Hán Khảo Quốc Tế (CTCSOL).\n\nBộ đề bao gồm cả phần Nghe (Tingli) và phần Đọc hiểu (Yuedu) với thời gian làm bài giống như đi thi thật. Đặc biệt, ở cuối tài liệu có phần Đáp án chi tiết và giải thích lý do tại sao chọn đáp án đó. Lê Lê khuyên các bạn hãy tự làm bài nghiêm túc, canh thời gian chuẩn rồi mới tra đáp án để đạt hiệu quả ôn thi tốt nhất nhé!',
    pros: 'Cấu trúc đề bám sát đề thi thật 100% | Có đáp án giải thích chi tiết | File nghe rõ ràng, tốc độ chuẩn',
    cons: 'Chỉ phù hợp để luyện đề trước thi | Lượng kiến thức HSK 1-2 khá đơn giản',
    who_for: 'Phù hợp cho các bạn đang chuẩn bị bước vào kỳ thi HSK 1 hoặc HSK 2 muốn thử sức và làm quen với áp lực phòng thi.',
    preview_images: '../book4.png,../book2.png'
  },
  'DOC-WRITING': {
    id: 'DOC-WRITING',
    title: 'Bảng Luyện Viết Hán Tự',
    desc: 'Tờ luyện viết nét chữ theo ô vuông chuẩn với 100 chữ Hán cơ bản nhất. In ra luyện mỗi ngày giúp nhớ chữ rất nhanh!',
    category: 'writing',
    icon: '✍️',
    icon_color: '#7c5cbf',
    pages: 'PDF · In được',
    level: '1',
    level_text: 'Người mới · 100 chữ',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE',
    content: 'Chữ Hán là chữ biểu ý, không phải chữ biểu âm như tiếng Việt. Đó chính là lý do viết chữ Hán luôn là "nỗi sợ hãi" lớn đối với nhiều bạn.\n\nTài liệu **Bảng Luyện Viết Hán Tự** này được thiết kế để giải quyết triệt để vấn đề này. Lê Lê đã thiết kế các ô vuông chuẩn (ô chữ Mễ 米) kèm theo hướng dẫn nét viết (quy tắc bút thuận) cho 100 chữ Hán thông dụng nhất.\n\nViệc luyện viết trong ô Mễ giúp nét chữ của bạn luôn cân đối, không bị lệch hoặc mất cân bằng. Bạn chỉ cần tải file PDF này về, in ra khổ giấy A4 là đã có ngay một cuốn vở tập viết xịn xò. Mỗi ngày dành 15-20 phút luyện viết vài trang, nét chữ của bạn sẽ nhanh chóng đẹp và ngay ngắn như người bản xứ!',
    pros: 'Thiết kế ô ly chuẩn, rõ nét | Có thứ tự nét vẽ rõ ràng cho từng chữ | File PDF in ấn cực kỳ dễ dàng',
    cons: 'Chỉ giới hạn trong 100 chữ cơ bản | Chất lượng in phụ thuộc vào máy in của bạn',
    who_for: 'Cực kỳ phù hợp cho người mới bắt đầu làm quen với chữ Hán, muốn luyện viết chữ đẹp và chuẩn ngay từ đầu.',
    preview_images: '../book4.png,../book1.png'
  },
  'DOC-CHUDE': {
    id: 'DOC-CHUDE',
    title: 'Từ Vựng Theo Chủ Đề',
    desc: 'Từ vựng được phân loại theo 15 chủ đề thực tế: gia đình, công việc, du lịch, ăn uống… Học nhanh, nhớ lâu!',
    category: 'vocab',
    icon: '🗂️',
    icon_color: '#2ea078',
    pages: 'PDF · 20 trang',
    level: '2',
    level_text: 'Sơ cấp · HSK 1–3',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE',
    content: 'Học từ vựng theo kiểu liệt kê bảng chữ cái rất dễ gây nhàm chán và khó nhớ. Một trong những phương pháp siêu đẳng giúp Lê Lê nhớ từ nhanh nhất chính là học theo cụm chủ đề.\n\nTài liệu **Từ Vựng Theo Chủ Đề** bao gồm từ vựng của 15 chủ đề phổ biến nhất trong cuộc sống: từ gia đình, bạn bè, ăn uống, mua sắm cho đến du lịch, công việc... Việc học các từ có liên quan đến nhau giúp não bộ liên kết thông tin tốt hơn và tăng khả năng phản xạ khi giao tiếp.\n\nMỗi từ đều đi kèm phiên âm chữ Hán và dịch nghĩa tiếng Việt. Tài liệu được thiết kế màu sắc rất dễ thương để kích thích thị giác, giúp bạn học say mê hơn và không bị mỏi mắt!',
    pros: 'Học từ vựng theo sơ đồ liên tưởng | Chủ đề cực kỳ thực tế và gần gũi | Trình bày sinh động, bắt mắt',
    cons: 'Lượng từ vựng lớn ở mỗi chủ đề | Cần kết hợp ôn tập thường xuyên',
    who_for: 'Dành cho các bạn trình độ sơ cấp đến trung cấp (HSK 1-3) muốn mở rộng nhanh vốn từ vựng thực tế để giao tiếp hàng ngày.',
    preview_images: '../book2.png,../book3.png'
  },
  'DOC-HSK3': {
    id: 'DOC-HSK3',
    title: 'Đề Thi Thử HSK 3',
    desc: '3 đề thi thử HSK 3 đầy đủ các phần nghe – đọc – viết với đáp án chi tiết. Thích hợp ôn luyện trước kỳ thi.',
    category: 'hsk',
    icon: '📋',
    icon_color: '#3b7fd4',
    pages: 'PDF · 42 trang · Có đáp án',
    level: '3',
    level_text: 'Trung cấp · HSK 3',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE',
    content: 'Khi lên đến HSK 3, kỳ thi đã tăng độ khó đáng kể vì xuất hiện thêm phần Viết (Xiezuo) - nơi bạn bắt đầu phải tự viết chữ Hán và sắp xếp câu hoàn chỉnh.\n\nTài liệu **Đề Thi Thử HSK 3** này gồm 3 bộ đề được Lê Lê tuyển chọn kỹ lưỡng, bám sát cấu trúc đề thi chính thức mới nhất. Mỗi đề thi đều có đủ 3 phần: Nghe, Đọc và Viết.\n\nĐặc biệt, ở phần Viết, tài liệu cung cấp hướng dẫn ghép câu chi tiết, phân tích cấu trúc ngữ pháp từng câu để bạn hiểu tại sao lại sắp xếp từ theo thứ tự đó. Kèm theo đó là đáp án chi tiết cho toàn bộ các đề. Hãy in ra làm bài nghiêm túc để tự tin 100% giật điểm cao HSK 3 nhé!',
    pros: 'Có phần hướng dẫn làm bài viết cực kỳ chi tiết | Trình bày chuyên nghiệp, rõ nét | Đáp án đầy đủ',
    cons: 'File PDF khá dài (42 trang) nên in ấn tốn kém hơn | Cần rèn luyện viết chữ Hán cứng cáp trước',
    who_for: 'Thích hợp cho các bạn chuẩn bị thi HSK 3 muốn làm quen cấu trúc đề thi và đặc biệt muốn đạt điểm tối đa phần viết câu.',
    preview_images: '../book5.png,../book4.png'
  }
};

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  let docId = new URLSearchParams(window.location.search).get('id');
  if (!docId) {
    // default to first doc for preview
    docId = 'DOC-500';
  }
  loadDoc(docId);
});

// ── Load từ Google Sheets ─────────────────────────────────
function loadDoc(docId) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&headers=2`;
  const script = document.createElement('script');
  script.src = url + '&callback=onSheetData';
  window.onSheetData = (data) => parseAndRender(data, docId);
  script.onerror = () => {
    const fallback = FALLBACK_DOCS[docId.toUpperCase()];
    if (fallback) {
      renderDoc(fallback);
    } else {
      showError();
    }
  };
  document.head.appendChild(script);
}

// ── Parse GViz response ───────────────────────────────────
function parseAndRender(data, targetId) {
  try {
    const rows = data.table.rows;
    
    // Find row by ID (COL.id is index 0)
    const row = rows.find(r => {
      const cell = r.c[COL.id];
      return cell && String(cell.v).trim().toUpperCase() === targetId.trim().toUpperCase();
    });

    const fallback = FALLBACK_DOCS[targetId.toUpperCase()];

    if (!row) {
      if (fallback) {
        renderDoc(fallback);
      } else {
        showError();
      }
      return;
    }

    const get = (col, fallbackVal = '') => {
      const cell = row.c[col];
      const val = (cell && cell.v != null) ? String(cell.v).trim() : '';
      return val || fallbackVal;
    };

    renderDoc({
      id:             get(COL.id, fallback?.id),
      title:          get(COL.title, fallback?.title),
      desc:           get(COL.desc, fallback?.desc),
      category:       get(COL.category, fallback?.category),
      icon:           get(COL.icon, fallback?.icon),
      icon_color:     get(COL.icon_color, fallback?.icon_color),
      pages:          get(COL.pages, fallback?.pages),
      level:          get(COL.level, fallback?.level),
      level_text:     get(COL.level_text, fallback?.level_text),
      drive_url:      get(COL.drive_url, fallback?.drive_url),
      content:        get(COL.content, fallback?.content),
      pros:           get(COL.pros, fallback?.pros),
      cons:           get(COL.cons, fallback?.cons),
      who_for:        get(COL.who_for, fallback?.who_for),
      preview_images: get(COL.preview_images, fallback?.preview_images),
    });
  } catch (e) {
    console.error('Parse error docs:', e);
    showError();
  }
}

// ── Render page ───────────────────────────────────────────
function renderDoc(doc) {
  // SEO
  const pageTitle = `${doc.title} – Tài liệu Lê Lê học tiếng Trung`;
  document.title = pageTitle;
  setMeta('og-title', pageTitle);
  setMeta('og-desc',  doc.desc || '');
  
  // Parse preview images for og-image
  const previewUrls = doc.preview_images ? doc.preview_images.split(',').map(u => u.trim()).filter(Boolean) : [];
  if (previewUrls.length > 0) {
    setMeta('og-image', previewUrls[0]);
  }

  // Hero Info
  const iconBadge = document.getElementById('doc-icon-badge');
  iconBadge.textContent = doc.icon || '📝';
  iconBadge.style.setProperty('--c', doc.icon_color || '#D4A843');
  
  const catEl = document.getElementById('doc-category');
  catEl.textContent = getCategoryLabel(doc.category);
  catEl.className = `doc-category-badge ${doc.category || 'vocab'}`;
  
  document.getElementById('doc-pages-badge').textContent = doc.pages || 'PDF';
  document.getElementById('doc-title').textContent = doc.title;
  document.getElementById('doc-desc').textContent = doc.desc;
  
  // Level dots
  const levelNum = parseInt(doc.level) || 2;
  const levelTextEl = document.getElementById('doc-level-text');
  levelTextEl.textContent = doc.level_text || 'Cơ bản';
  
  const dotsContainer = document.getElementById('doc-difficulty');
  dotsContainer.innerHTML = '';
  for (let d = 1; d <= 5; d++) {
    const dot = document.createElement('span');
    dot.className = d <= levelNum ? 'level-dot' : 'level-dot empty';
    dotsContainer.appendChild(dot);
  }
  dotsContainer.appendChild(levelTextEl);

  // CTAs
  const dlBtn = document.getElementById('btn-download');
  const dlBtnBottom = document.getElementById('btn-download-bottom');
  dlBtn.href = doc.drive_url || '#';
  dlBtnBottom.href = doc.drive_url || '#';

  // Share action
  const shareBtn = document.getElementById('btn-share');
  shareBtn.dataset.title = doc.title;
  shareBtn.dataset.url = window.location.href;

  // Post body content
  const contentEl = document.getElementById('doc-content-body');
  contentEl.innerHTML = doc.content
    ? formatText(doc.content)
    : `<em style="opacity:.5">Bài giới thiệu chi tiết đang được cập nhật… 🌸</em>`;

  // Pros (Highlights)
  const prosList = document.getElementById('doc-pros');
  if (doc.pros) {
    prosList.innerHTML = doc.pros.split('|').filter(Boolean)
      .map(p => `<li>${p.trim()}</li>`).join('');
  } else {
    prosList.closest('.pros-box').style.display = 'none';
  }

  // Cons (Tips)
  const consList = document.getElementById('doc-cons');
  if (doc.cons) {
    consList.innerHTML = doc.cons.split('|').filter(Boolean)
      .map(c => `<li>${c.trim()}</li>`).join('');
  } else {
    consList.closest('.cons-box').style.display = 'none';
  }

  // Target audience
  const whoEl = document.getElementById('doc-who-for');
  if (doc.who_for) {
    whoEl.textContent = doc.who_for;
  } else {
    whoEl.closest('.doc-target').style.display = 'none';
  }

  // Preview Gallery
  renderPreviewGallery(doc.preview_images);

  // Setup click listeners
  setupInteractions();

  // Show
  document.getElementById('doc-loading').classList.add('hidden');
  document.getElementById('doc-main').classList.remove('hidden');
}

// ── Render Preview Gallery ──────────────────────────────────
function renderPreviewGallery(previewImagesStr) {
  const galleryEl = document.getElementById('doc-gallery');
  if (!galleryEl) return;

  if (!previewImagesStr || !previewImagesStr.trim()) {
    galleryEl.style.display = 'none';
    return;
  }

  const urls = previewImagesStr.split(',').map(u => u.trim()).filter(Boolean);
  if (!urls.length) { galleryEl.style.display = 'none'; return; }

  galleryEl.innerHTML = `
    <div class="section-pill"><span>📸</span> Trang xem trước</div>
    <div class="gallery-grid" id="gallery-grid">
      ${urls.map((url, i) => `
        <button class="gallery-thumb" onclick="openLightbox(${i})"
                aria-label="Xem trang ${i+1}">
          <img src="${url}" alt="Ảnh xem trước trang ${i+1}" loading="lazy" />
        </button>`).join('')}
    </div>
  `;

  // Store urls for lightbox
  window._galleryUrls = urls;
}

// ── Lightbox ──────────────────────────────────────────────
window.openLightbox = function(index) {
  const urls = window._galleryUrls || [];
  if (!urls.length) return;

  // Create lightbox markup dynamically if it doesn't exist
  let lb = document.getElementById('rv-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'rv-lightbox';
    lb.innerHTML = `
      <div class="lb-backdrop" onclick="closeLightbox()"></div>
      <div class="lb-content">
        <button class="lb-close" onclick="closeLightbox()" aria-label="Đóng">✕</button>
        <button class="lb-prev"  onclick="shiftLightbox(-1)" aria-label="Ảnh trước">‹</button>
        <img id="lb-img" src="" alt="Ảnh phóng to" />
        <button class="lb-next"  onclick="shiftLightbox(1)"  aria-label="Ảnh tiếp">›</button>
        <p class="lb-counter" id="lb-counter"></p>
      </div>`;
    document.body.appendChild(lb);
  }

  window._lbIndex = index;
  updateLightbox();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.updateLightbox = function() {
  const urls  = window._galleryUrls || [];
  const i     = window._lbIndex;
  document.getElementById('lb-img').src         = urls[i];
  document.getElementById('lb-counter').textContent = `${i + 1} / ${urls.length}`;
};

window.shiftLightbox = function(dir) {
  const urls = window._galleryUrls || [];
  window._lbIndex = (window._lbIndex + dir + urls.length) % urls.length;
  updateLightbox();
};

window.closeLightbox = function() {
  const lb = document.getElementById('rv-lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
};

// Keyboard nav for lightbox
document.addEventListener('keydown', e => {
  const lb = document.getElementById('rv-lightbox');
  if (lb && lb.classList.contains('open')) {
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   shiftLightbox(-1);
    if (e.key === 'ArrowRight')  shiftLightbox(1);
  }
});

// ── Setup Interactions ────────────────────────────────────
function setupInteractions() {
  const toast    = document.getElementById('share-toast');
  const toastMsg = document.getElementById('toast-msg');

  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // Share buttons action
  const shareBtn = document.getElementById('btn-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const title = shareBtn.dataset.title || 'Tài liệu tiếng Trung';
      const url   = shareBtn.dataset.url   || window.location.href;
      const text  = `📚 "${title}" — tài liệu học tiếng Trung miễn phí cực hay từ Lê Lê học tiếng Trung!`;

      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
          return;
        } catch (err) {
          if (err.name === 'AbortError') return;
        }
      }

      try {
        await navigator.clipboard.writeText(url);
        showToast('✅ Đã sao chép link chia sẻ bài viết!');
      } catch {
        window.prompt('Sao chép link này:', url);
      }
    });
  }

  // Ripples on download buttons
  document.querySelectorAll('.btn-download').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 1.5;
      ripple.style.cssText = `
        position:absolute; width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size/2}px;
        top:${e.clientY - rect.top - size/2}px;
        border-radius:50%; background:rgba(255,255,255,0.22);
        transform:scale(0); animation:ripple-docs 0.5s ease-out forwards;
        pointer-events:none; z-index:5;
      `;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inject keyframe style for ripple
  if (!document.getElementById('docs-ripple-style')) {
    const style = document.createElement('style');
    style.id = 'docs-ripple-style';
    style.textContent = `@keyframes ripple-docs { to { transform:scale(1); opacity:0; } }`;
    document.head.appendChild(style);
  }
}

// ── Helpers ───────────────────────────────────────────────
function getCategoryLabel(cat) {
  const map = {
    'vocab': 'Từ vựng',
    'grammar': 'Ngữ pháp',
    'hsk': 'Thi HSK',
    'writing': 'Luyện viết'
  };
  return map[cat] || 'Tài liệu';
}

function formatText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

function setMeta(id, content) {
  const el = document.getElementById(id);
  if (el) el.setAttribute('content', content);
}

function showError() {
  document.getElementById('doc-loading').classList.add('hidden');
  document.getElementById('doc-error').classList.remove('hidden');
}
