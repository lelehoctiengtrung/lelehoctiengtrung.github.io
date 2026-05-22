/* ============================================================
   review.js — Lê Lê Book Review Page
   Load book data từ Google Sheets theo ?sku= param
   URL: /review/review.html?sku=SACH-001
============================================================ */

// ── CONFIG ────────────────────────────────────────────────
const SHEET_ID   = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o';
const SHEET_NAME = 'books';

// Columns trong tab books (row 1 = keys, row 2 = labels, row 3+ = data)
const COL = {
  sku:            0,
  order:          1,
  title:          2,
  subtitle_zh:    3,
  desc:           4,
  tags:           5,
  price:          6,
  badge:          7,
  badge_type:     8,
  stars:          9,
  cover_url:      10,
  buy_shopee:     11,
  buy_fahasa:     12,
  buy_tiki:       13,
  buy_lazada:     14,
  review:         15,
  pros:           16,
  cons:           17,
  who_for:        18,
  shop_images:    19,
  review_images:  20,
  sku_folder_url: 21,
};

// ---- Fallback data for preview ----
const FALLBACK_BOOKS = {
  'SACH-001': {
    sku: 'SACH-001',
    title: 'Giáo Trình Hán Ngữ',
    subtitle_zh: '标准汉语 · Bài 1–30',
    desc: 'Giáo trình chuẩn Trung Quốc, từ vựng có phiên âm pinyin đầy đủ, bài tập đa dạng. Lê Lê học từ cuốn này từ đầu! ✨',
    tags: 'Người mới, HSK 1–3, Có pinyin',
    price: '89000',
    badge: 'Bán chạy',
    badge_type: 'hot',
    stars: '5',
    cover_url: '../book1.png',
    buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY',
    buy_fahasa: 'https://www.fahasa.com/',
    buy_tiki: 'https://tiki.vn/',
    buy_lazada: 'https://www.lazada.vn/',
    review: 'Giáo trình Hán ngữ là bộ sách kinh điển mà hầu như bất kỳ ai bắt đầu học tiếng Trung cũng đều biết tới. Bản thân Lê Lê khi mới chập chững tự học cũng đã cày nát bộ này.\n\nĐiểm mình thích nhất ở bộ sách này là phần giải thích ngữ pháp rất dễ hiểu bằng tiếng Việt, hệ thống từ vựng đi từ dễ đến khó và có phiên âm Pinyin cực kỳ chuẩn xác. Cuốn sách giúp bạn xây dựng nền tảng phát âm và từ vựng cực kỳ vững chắc ngay từ những bài đầu tiên.\n\nTuy nhiên, sách cũng có điểm trừ nhỏ là phần hình ảnh minh họa không được bắt mắt lắm, chủ yếu là chữ. Để học tốt nhất, các bạn nên kết hợp nghe file âm thanh (audio) đi kèm để luyện phát âm chuẩn nhé!',
    pros: 'Ngữ pháp giải thích siêu chi tiết | Hệ thống bài tập phong phú | Phù hợp tự học tại nhà',
    cons: 'Hình ảnh minh họa hơi đơn giản | Không kèm CD vật lý (phải quét mã tải app)',
    who_for: 'Phù hợp cho các bạn tự học từ con số 0, hoặc chuẩn bị thi HSK 1-3.',
    review_images: '../book1.png',
    sku_folder_url: 'https://drive.google.com/drive/folders/1gP-4vafPZiuHXAz6Zup0vboUK9D1llfC'
  },
  'SACH-002': {
    sku: 'SACH-002',
    title: '3000 Từ Vựng HSK',
    subtitle_zh: 'HSK词汇 · 6 Cấp độ',
    desc: 'Toàn bộ từ vựng HSK 1–6 theo chủ đề, có ví dụ câu, phiên âm và nghĩa tiếng Việt. Học thi HSK không thể thiếu! 💪',
    tags: 'Luyện thi, HSK 1–6, Đầy đủ',
    price: '145000',
    badge: 'Mới nhất',
    badge_type: 'new',
    stars: '5',
    cover_url: '../book2.png',
    buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY',
    buy_fahasa: 'https://www.fahasa.com/',
    buy_tiki: 'https://tiki.vn/',
    buy_lazada: 'https://www.lazada.vn/',
    review: 'Nếu mục tiêu của bạn là chinh phục kỳ thi HSK từ cấp 1 đến cấp 6 thì cuốn 3000 Từ Vựng HSK này chính là trợ thủ đắc lực không thể thiếu. Cuốn sách hệ thống hóa từ vựng một cách khoa học theo từng cấp độ.\n\nMỗi từ vựng đều đi kèm phiên âm, dịch nghĩa chi tiết và đặc biệt là có ví dụ minh họa thực tế. Việc học từ vựng qua câu ví dụ giúp Lê Lê nhớ lâu hơn gấp 3 lần so với việc học vẹt từ đơn lẻ.\n\nLưu ý là lượng kiến thức trong sách rất lớn, các bạn nên chia nhỏ mục tiêu học mỗi ngày khoảng 10-15 từ, kết hợp làm Flashcard để ôn tập nhé!',
    pros: 'Đầy đủ từ vựng HSK 1-6 | Có câu ví dụ thực tế cho mỗi từ | Trình bày rõ ràng, dễ tra cứu',
    cons: 'Sách khá dày và nặng | Không có hình minh họa sinh động',
    who_for: 'Dành cho các bạn đang ôn luyện thi HSK từ cấp 1 đến cấp 6.',
    review_images: '../book2.png',
    sku_folder_url: 'https://drive.google.com/drive/folders/1gP-4vafPZiuHXAz6Zup0vboUK9D1llfC'
  },
  'SACH-003': {
    sku: 'SACH-003',
    title: 'Hội Thoại Tiếng Trung Thực Dụng',
    subtitle_zh: '实用汉语会话',
    desc: 'Các tình huống giao tiếp thực tế hàng ngày. Học xong là nói được ngay, rất phù hợp để luyện speaking! 🗣️',
    tags: 'Giao tiếp, Thực dụng, Audio CD',
    price: '115000',
    badge: '',
    badge_type: '',
    stars: '4',
    cover_url: '../book3.png',
    buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY',
    buy_fahasa: 'https://www.fahasa.com/',
    buy_tiki: 'https://tiki.vn/',
    buy_lazada: 'https://www.lazada.vn/',
    review: 'Học tiếng Trung mà không nói được thì thật là đáng tiếc đúng không nào? Cuốn Hội Thoại Tiếng Trung Thực Dụng tập trung hoàn toàn vào việc giúp bạn giao tiếp tự nhiên trong cuộc sống hàng ngày.\n\nSách gồm nhiều chủ đề gần gũi như mua sắm, hỏi đường, đặt bàn ăn, đi du lịch... Lê Lê cực kỳ thích phần hội thoại mẫu vì ngôn từ rất hiện đại, giống hệt cách người bản xứ nói chuyện ngoài đời thường, không bị cứng nhắc như sách giáo khoa.\n\nCác bạn nên luyện tập bằng cách nói to theo file nghe mẫu để cải thiện ngữ điệu và phản xạ giao tiếp nhé!',
    pros: 'Chủ đề giao tiếp cực kỳ thực tế | Ngôn từ tự nhiên, hiện đại | Kèm file nghe giọng đọc chuẩn',
    cons: 'Hơi ít bài tập ngữ pháp chuyên sâu',
    who_for: 'Phù hợp cho các bạn muốn cải thiện kỹ năng giao tiếp phản xạ, nói tiếng Trung tự nhiên.',
    review_images: '../book3.png',
    sku_folder_url: 'https://drive.google.com/drive/folders/1gP-4vafPZiuHXAz6Zup0vboUK9D1llfC'
  }
};

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  let sku = new URLSearchParams(window.location.search).get('sku');
  if (!sku) {
    // Default to SACH-001 so the page can be previewed directly
    sku = 'SACH-001';
  }
  loadBook(sku);
});

// ── Load từ Google Sheets ─────────────────────────────────
function loadBook(sku) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&headers=2`;
  const script = document.createElement('script');
  script.src = url + '&callback=onSheetData';
  window.onSheetData = (data) => parseAndRender(data, sku);
  script.onerror = () => {
    const fallback = FALLBACK_BOOKS[sku];
    if (fallback) {
      renderReview(fallback);
    } else {
      showError();
    }
  };
  document.head.appendChild(script);
}

// ── Parse GViz response ───────────────────────────────────
function parseAndRender(data, targetSku) {
  try {
    const rows = data.table.rows;
    const row  = rows.find(r => {
      const cell = r.c[COL.sku];
      return cell && String(cell.v).trim() === targetSku.trim();
    });

    const fallback = FALLBACK_BOOKS[targetSku];

    if (!row) {
      if (fallback) {
        renderReview(fallback);
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

    renderReview({
      sku:            get(COL.sku, fallback?.sku),
      title:          get(COL.title, fallback?.title),
      subtitle_zh:    get(COL.subtitle_zh, fallback?.subtitle_zh),
      desc:           get(COL.desc, fallback?.desc),
      tags:           get(COL.tags, fallback?.tags),
      price:          get(COL.price, fallback?.price),
      badge:          get(COL.badge, fallback?.badge),
      badge_type:     get(COL.badge_type, fallback?.badge_type),
      stars:          get(COL.stars, fallback?.stars),
      cover_url:      get(COL.cover_url, fallback?.cover_url),
      buy_shopee:     get(COL.buy_shopee, fallback?.buy_shopee),
      buy_fahasa:     get(COL.buy_fahasa, fallback?.buy_fahasa),
      buy_tiki:       get(COL.buy_tiki, fallback?.buy_tiki),
      buy_lazada:     get(COL.buy_lazada, fallback?.buy_lazada),
      review:         get(COL.review, fallback?.review),
      pros:           get(COL.pros, fallback?.pros),
      cons:           get(COL.cons, fallback?.cons),
      who_for:        get(COL.who_for, fallback?.who_for),
      shop_images:    get(COL.shop_images, fallback?.shop_images),
      review_images:  get(COL.review_images, fallback?.review_images),
      sku_folder_url: get(COL.sku_folder_url, fallback?.sku_folder_url),
    });
  } catch (e) {
    console.error('Parse error:', e);
    showError();
  }
}

// ── Render page ───────────────────────────────────────────
function renderReview(book) {
  // SEO
  const pageTitle = `Review: ${book.title} – Lê Lê học tiếng Trung`;
  document.title = pageTitle;
  setMeta('og-title', pageTitle);
  setMeta('og-desc',  book.desc || '');
  setMeta('og-image', book.cover_url || '');

  // Cover
  const cover = document.getElementById('rv-cover');
  cover.src = book.cover_url || '../logo.png';
  cover.alt = `Bìa sách ${book.title}`;

  // Badge
  if (book.badge) {
    const type = book.badge_type === 'new' ? 'badge-new' : 'badge-hot';
    document.getElementById('rv-badge-wrap').innerHTML =
      `<span class="badge ${type}">${book.badge}</span>`;
  }

  // Stars
  const starsNum = parseInt(book.stars) || 5;
  const starsEl  = document.getElementById('rv-stars');
  starsEl.innerHTML  = '★'.repeat(starsNum) + '☆'.repeat(5 - starsNum);
  starsEl.setAttribute('aria-label', `${starsNum} sao`);

  // Title & subtitle
  document.getElementById('rv-title').textContent    = book.title;
  document.getElementById('rv-subtitle').textContent = book.subtitle_zh;
  if (!book.subtitle_zh) document.getElementById('rv-subtitle').style.display = 'none';

  // Tags
  if (book.tags) {
    document.getElementById('rv-tags').innerHTML = book.tags
      .split(',').map(t => `<span class="tag">${t.trim()}</span>`).join('');
  }

  // Price
  const priceVal = parseInt(book.price);
  document.getElementById('rv-price').textContent = priceVal
    ? `~${priceVal.toLocaleString('vi-VN')}₫` : 'Liên hệ';

  // Buy buttons
  const btns = buildBuyButtons(book);
  document.getElementById('rv-buy-group').innerHTML        = btns;
  document.getElementById('rv-buy-group-bottom').innerHTML =
    btns.replace(/btn-platform"/g, 'btn-platform btn-platform-lg"');

  // Review body
  const reviewEl = document.getElementById('rv-review-body');
  reviewEl.innerHTML = book.review
    ? formatReview(book.review)
    : `<em style="opacity:.5">Review đang được cập nhật… 🌸</em>`;

  // Review image gallery (ảnh từ Drive folder review/)
  renderReviewGallery(book.review_images);

  // Pros
  const prosList = document.getElementById('rv-pros');
  if (book.pros) {
    prosList.innerHTML = book.pros.split('|').filter(Boolean)
      .map(p => `<li>${p.trim()}</li>`).join('');
  } else {
    prosList.closest('.pros-box').style.display = 'none';
  }

  // Cons
  const consList = document.getElementById('rv-cons');
  if (book.cons) {
    consList.innerHTML = book.cons.split('|').filter(Boolean)
      .map(c => `<li>${c.trim()}</li>`).join('');
  } else {
    consList.closest('.cons-box').style.display = 'none';
  }

  // Who for
  const whoEl = document.getElementById('rv-who');
  if (book.who_for) {
    whoEl.textContent = book.who_for;
  } else {
    whoEl.closest('.who-section').style.display = 'none';
  }

  // Show
  document.getElementById('review-loading').classList.add('hidden');
  document.getElementById('review-main').classList.remove('hidden');
}

// ── Review Image Gallery ──────────────────────────────────
function renderReviewGallery(reviewImagesStr) {
  const galleryEl = document.getElementById('rv-gallery');
  if (!galleryEl) return;

  if (!reviewImagesStr || !reviewImagesStr.trim()) {
    galleryEl.style.display = 'none';
    return;
  }

  const urls = reviewImagesStr.split(',').map(u => u.trim()).filter(Boolean);
  if (!urls.length) { galleryEl.style.display = 'none'; return; }

  galleryEl.innerHTML = `
    <div class="section-pill"><span>📸</span> Ảnh trong sách</div>
    <div class="gallery-grid" id="gallery-grid">
      ${urls.map((url, i) => `
        <button class="gallery-thumb" onclick="openLightbox(${i})"
                aria-label="Xem ảnh ${i+1}">
          <img src="${url}" alt="Ảnh sách trang ${i+1}" loading="lazy" />
        </button>`).join('')}
    </div>
  `;

  // Store urls for lightbox
  window._galleryUrls = urls;
}

// ── Lightbox ──────────────────────────────────────────────
function openLightbox(index) {
  const urls = window._galleryUrls || [];
  if (!urls.length) return;

  // Tạo lightbox nếu chưa có
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
}

function updateLightbox() {
  const urls  = window._galleryUrls || [];
  const i     = window._lbIndex;
  document.getElementById('lb-img').src         = urls[i];
  document.getElementById('lb-counter').textContent = `${i + 1} / ${urls.length}`;
}

function shiftLightbox(dir) {
  const urls = window._galleryUrls || [];
  window._lbIndex = (window._lbIndex + dir + urls.length) % urls.length;
  updateLightbox();
}

function closeLightbox() {
  const lb = document.getElementById('rv-lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

// Keyboard nav
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   shiftLightbox(-1);
  if (e.key === 'ArrowRight')  shiftLightbox(1);
});

// ── Helpers ───────────────────────────────────────────────
function buildBuyButtons(book) {
  const platforms = [
    { url: book.buy_shopee, cls: 'btn-shopee', label: '🛒 Shopee', id: 'shopee' },
    { url: book.buy_fahasa, cls: 'btn-fahasa', label: '📚 Fahasa', id: 'fahasa' },
    { url: book.buy_tiki,   cls: 'btn-tiki',   label: '🛍️ Tiki',   id: 'tiki'   },
    { url: book.buy_lazada, cls: 'btn-lazada', label: '🟠 Lazada', id: 'lazada' },
  ];
  const html = platforms.filter(p => p.url).map(p =>
    `<a href="${p.url}" class="btn-platform ${p.cls}"
        target="_blank" rel="noopener sponsored"
        id="buy-${p.id}-${book.sku}">${p.label}</a>`
  ).join('');
  return html || `<span style="color:rgba(255,255,255,.4);font-size:.9rem">Link đang cập nhật…</span>`;
}

function formatReview(text) {
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
  document.getElementById('review-loading').classList.add('hidden');
  document.getElementById('review-error').classList.remove('hidden');
}
