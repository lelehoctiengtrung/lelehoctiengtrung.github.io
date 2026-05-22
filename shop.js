// ===================================================
// shop.js — Fetch sách từ Google Sheets
// ===================================================

const SHEET_ID  = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o';
const BOOKS_API = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=books&headers=2`;

// Columns (row 1 = keys, row 2 = labels, row 3+ = data)
// sku | order | title | subtitle_zh | desc | tags | price | badge | badge_type
// stars | cover_url | buy_shopee | buy_fahasa | buy_tiki | buy_lazada | review | pros | cons | who_for
const C = {
  sku: 0, order: 1, title: 2, subtitle_zh: 3, desc: 4,
  tags: 5, price: 6, badge: 7, badge_type: 8, stars: 9,
  cover_url: 10, buy_shopee: 11, buy_fahasa: 12, buy_tiki: 13, buy_lazada: 14,
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
    cover_url: 'book1.png',
    buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY',
    buy_fahasa: 'https://www.fahasa.com/',
    buy_tiki: 'https://tiki.vn/',
    buy_lazada: 'https://www.lazada.vn/'
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
    cover_url: 'book2.png',
    buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY',
    buy_fahasa: 'https://www.fahasa.com/',
    buy_tiki: 'https://tiki.vn/',
    buy_lazada: 'https://www.lazada.vn/'
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
    cover_url: 'book3.png',
    buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY',
    buy_fahasa: 'https://www.fahasa.com/',
    buy_tiki: 'https://tiki.vn/',
    buy_lazada: 'https://www.lazada.vn/'
  }
};

// ---- Helpers ----
function colVal(row, i, fallbackVal = '') {
  const c = row.c[i];
  const val = c && c.v !== null && c.v !== undefined ? String(c.v).trim() : '';
  return val || fallbackVal;
}

// ---- Build card ----
function buildBookCard(row) {
  const sku = colVal(row, C.sku);
  const fallback = FALLBACK_BOOKS[sku];

  const title      = colVal(row, C.title, fallback?.title);
  const subtitleZh = colVal(row, C.subtitle_zh, fallback?.subtitle_zh);
  const desc       = colVal(row, C.desc, fallback?.desc);
  const tags       = colVal(row, C.tags, fallback?.tags).split(',').map(t => t.trim()).filter(Boolean);
  const price      = colVal(row, C.price, fallback?.price);
  const badge      = colVal(row, C.badge, fallback?.badge);
  const badgeType  = colVal(row, C.badge_type, fallback?.badge_type) || 'hot';
  const stars      = parseInt(colVal(row, C.stars, fallback?.stars)) || 5;
  const coverUrl   = colVal(row, C.cover_url, fallback?.cover_url);
  const shopee     = colVal(row, C.buy_shopee, fallback?.buy_shopee);
  const fahasa     = colVal(row, C.buy_fahasa, fallback?.buy_fahasa);
  const tiki       = colVal(row, C.buy_tiki, fallback?.buy_tiki);
  const lazada     = colVal(row, C.buy_lazada, fallback?.buy_lazada);

  if (!title) return '';

  const reviewUrl = sku
    ? `review/review.html?sku=${encodeURIComponent(sku)}`
    : '#';

  const starsHtml = '★'.repeat(stars) + '☆'.repeat(5 - stars);
  const badgeHtml = badge
    ? `<div class="book-badge-wrap"><span class="badge badge-${badgeType}">${badge}</span></div>`
    : '';
  const tagsHtml = tags.map(t => `<span class="tag">${t}</span>`).join('');

  const priceNum = parseFloat(price);
  const priceFormatted = priceNum
    ? `~${priceNum.toLocaleString('vi-VN')}₫`
    : 'Liên hệ';

  const coverHtml = coverUrl
    ? `<img src="${coverUrl}" alt="Bìa sách ${title}" class="book-cover" loading="lazy" />`
    : `<div class="book-cover-placeholder" aria-hidden="true">📚</div>`;

  // Nút mua — 4 platform (ẩn nếu không có link)
  const platforms = [
    { key: shopee,  cls: 'btn-p-shopee',  label: '🛒 <span>Shopee</span>' },
    { key: fahasa,  cls: 'btn-p-fahasa',  label: '📚 <span>Fahasa</span>' },
    { key: tiki,    cls: 'btn-p-tiki',    label: '🛍️ <span>Tiki</span>'   },
    { key: lazada,  cls: 'btn-p-lazada',  label: '🟠 <span>Lazada</span>' },
  ];

  const platformBtns = platforms
    .filter(p => p.key)
    .map(p => `
      <a href="${p.key}" class="btn-platform-sm ${p.cls}"
         target="_blank" rel="noopener sponsored"
         aria-label="Mua ${title} tại ${p.label.replace(/\W/g,'')}">
        ${p.label}
      </a>`)
    .join('');

  const buySection = platformBtns
    ? `<div class="book-platforms">${platformBtns}</div>`
    : `<span class="no-link-note">Đang cập nhật link…</span>`;

  return `
    <article class="book-card" aria-label="${title}">
      <a href="${reviewUrl}" class="card-cover-link" tabindex="-1" aria-hidden="true">
        <div class="book-cover-wrap">
          ${coverHtml}
          ${badgeHtml}
          <div class="cover-overlay">
            <span class="cover-overlay-text">Xem review →</span>
          </div>
        </div>
      </a>
      <div class="book-info">
        <div class="book-stars" aria-label="${stars} sao">${starsHtml}</div>
        <h3 class="book-title">
          <a href="${reviewUrl}" class="title-link">${title}</a>
        </h3>
        ${subtitleZh ? `<p class="book-subtitle" lang="zh">${subtitleZh}</p>` : ''}
        <p class="book-desc">${desc}</p>
        ${tagsHtml ? `<div class="book-tags">${tagsHtml}</div>` : ''}
        <div class="book-footer">
          <div class="book-price-group">
            <span class="price-label">Tham khảo</span>
            <span class="price">${priceFormatted}</span>
          </div>
          <a href="${reviewUrl}" class="btn-review" aria-label="Xem review ${title}">
            Đọc review
            <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" width="14" height="14">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"/>
            </svg>
          </a>
        </div>
        ${buySection}
      </div>
    </article>`;
}

// ---- Skeleton loader ----
function showSkeletons(container, count = 3) {
  container.innerHTML = Array(count).fill(`
    <div class="book-card skeleton-card" aria-hidden="true">
      <div class="skeleton-cover"></div>
      <div class="book-info">
        <div class="skeleton-line short"></div>
        <div class="skeleton-line"></div>
        <div class="skeleton-line medium"></div>
        <div class="skeleton-line long"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>`).join('');
}

// ---- Error state ----
function showError(container) {
  container.innerHTML = `
    <div class="fetch-error">
      <span>😔</span>
      <p>Không tải được dữ liệu. Vui lòng thử lại sau!</p>
      <button onclick="loadBooks()" class="retry-btn">Thử lại</button>
    </div>`;
}

// ---- Main fetch ----
async function loadBooks() {
  const grid = document.getElementById('books-grid');
  if (!grid) return;

  // Save static HTML as fallback before showing skeletons
  if (!grid.dataset.staticFallback) {
    grid.dataset.staticFallback = grid.innerHTML;
  }

  showSkeletons(grid);

  try {
    const res  = await fetch(BOOKS_API);
    const raw  = await res.text();

    // GSheet wraps JSON — parse response
    const match = raw.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if (!match) throw new Error('Invalid response');
    const data = JSON.parse(match[1]);

    if (!data?.table?.rows?.length) {
      grid.innerHTML = grid.dataset.staticFallback || '<p class="no-data">Chưa có sách nào. Sẽ cập nhật sớm! 🌸</p>';
      return;
    }

    const cards = data.table.rows.map(buildBookCard).filter(Boolean).join('');
    grid.innerHTML = cards || grid.dataset.staticFallback || '<p class="no-data">Chưa có sách nào. Sẽ cập nhật sớm! 🌸</p>';

    attachInteractions();
  } catch (err) {
    console.error('Fetch books error:', err);
    // Fallback: giữ HTML tĩnh nếu có
    const fallback = grid.dataset.staticFallback;
    if (fallback) { grid.innerHTML = fallback; attachInteractions(); }
    else showError(grid);
  }
}

// ---- Interactions ----
function attachInteractions() {
  // Ripple trên tất cả nút
  document.querySelectorAll('.btn-buy, .btn-review, .btn-platform-sm').forEach(btn => {
    if (btn._ripple) return;
    btn._ripple = true;
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 1.5;
      ripple.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;
        border-radius:50%;background:rgba(255,255,255,0.22);
        transform:scale(0);animation:ripple-shop .5s ease-out forwards;
        pointer-events:none;z-index:10;`;
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // 3D tilt
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.book-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        card.style.transform = `translateY(-4px) perspective(800px) rotateY(${x*5}deg) rotateX(${-y*4}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }
}

// Inject keyframe once
const s = document.createElement('style');
s.textContent = `@keyframes ripple-shop { to { transform:scale(1);opacity:0; } }`;
document.head.appendChild(s);

// ---- Boot ----
document.addEventListener('DOMContentLoaded', loadBooks);
