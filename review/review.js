/* ============================================================
   review.js — Lê Lê Book Review Page
   Load book data từ Google Sheets theo ?sku= param
   URL: /review/review.html?sku=SACH-001
============================================================ */

// ── CONFIG ────────────────────────────────────────────────
const SHEET_ID   = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o';
const SHEET_NAME = 'books'; // Tab chứa dữ liệu sách
// ─────────────────────────────────────────────────────────

// Columns trong tab books (row 1 = keys, row 2 = labels, row 3+ = data)
// sku | order | title | subtitle_zh | desc | tags | price | badge | badge_type
// stars | cover_url | buy_shopee | buy_fahasa | buy_tiki | review | pros | cons | who_for
const COL = {
  sku:         0,
  order:       1,
  title:       2,
  subtitle_zh: 3,
  desc:        4,
  tags:        5,
  price:       6,
  badge:       7,
  badge_type:  8,
  stars:       9,
  cover_url:   10,
  buy_shopee:  11,
  buy_fahasa:  12,
  buy_tiki:    13,
  review:      14,
  pros:        15,
  cons:        16,
  who_for:     17,
};

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  const sku = new URLSearchParams(window.location.search).get('sku');
  if (!sku) { showError(); return; }
  loadBook(sku);
});

// ── Load từ Google Sheets ─────────────────────────────────
function loadBook(sku) {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&headers=2`;

  const script = document.createElement('script');
  script.src = url + '&callback=onSheetData';
  window.onSheetData = (data) => parseAndRender(data, sku);
  script.onerror = showError;
  document.head.appendChild(script);
}

// ── Parse GViz response ───────────────────────────────────
function parseAndRender(data, targetSku) {
  try {
    const rows = data.table.rows;
    // Bỏ qua 2 header rows → tìm row có sku khớp
    const row = rows.find(r => {
      const cell = r.c[COL.sku];
      return cell && String(cell.v).trim() === targetSku.trim();
    });

    if (!row) { showError(); return; }

    const get = (col) => {
      const cell = row.c[col];
      return (cell && cell.v != null) ? String(cell.v).trim() : '';
    };

    renderReview({
      sku:         get(COL.sku),
      title:       get(COL.title),
      subtitle_zh: get(COL.subtitle_zh),
      desc:        get(COL.desc),
      tags:        get(COL.tags),
      price:       get(COL.price),
      badge:       get(COL.badge),
      badge_type:  get(COL.badge_type),
      stars:       get(COL.stars),
      cover_url:   get(COL.cover_url),
      buy_shopee:  get(COL.buy_shopee),
      buy_fahasa:  get(COL.buy_fahasa),
      buy_tiki:    get(COL.buy_tiki),
      review:      get(COL.review),
      pros:        get(COL.pros),
      cons:        get(COL.cons),
      who_for:     get(COL.who_for),
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
  setMeta('og-title',  pageTitle);
  setMeta('og-desc',   book.desc || '');
  setMeta('og-image',  book.cover_url || '');

  // Cover
  const cover = document.getElementById('rv-cover');
  cover.src = book.cover_url || '../logo.png';
  cover.alt = `Bìa sách ${book.title}`;

  // Badge
  if (book.badge) {
    const badgeWrap = document.getElementById('rv-badge-wrap');
    const type = book.badge_type === 'new' ? 'badge-new' : 'badge-hot';
    badgeWrap.innerHTML = `<span class="badge ${type}">${book.badge}</span>`;
  }

  // Stars
  const starsNum = parseInt(book.stars) || 5;
  document.getElementById('rv-stars').innerHTML =
    '★'.repeat(starsNum) + '☆'.repeat(5 - starsNum);
  document.getElementById('rv-stars').setAttribute('aria-label', `${starsNum} sao`);

  // Title & subtitle
  document.getElementById('rv-title').textContent    = book.title;
  document.getElementById('rv-subtitle').textContent = book.subtitle_zh;
  if (!book.subtitle_zh) document.getElementById('rv-subtitle').style.display = 'none';

  // Tags
  const tagsEl = document.getElementById('rv-tags');
  if (book.tags) {
    tagsEl.innerHTML = book.tags.split(',')
      .map(t => `<span class="tag">${t.trim()}</span>`)
      .join('');
  }

  // Price
  const priceVal = parseInt(book.price);
  document.getElementById('rv-price').textContent = priceVal
    ? `~${priceVal.toLocaleString('vi-VN')}₫`
    : 'Liên hệ';

  // Buy buttons (hero + bottom CTA)
  const btns = buildBuyButtons(book);
  document.getElementById('rv-buy-group').innerHTML        = btns;
  document.getElementById('rv-buy-group-bottom').innerHTML = btns.replace(/btn-platform"/g, 'btn-platform btn-platform-lg"');

  // Review body
  const reviewEl = document.getElementById('rv-review-body');
  if (book.review) {
    reviewEl.innerHTML = formatReview(book.review);
  } else {
    reviewEl.innerHTML = `<em style="opacity:.5">Review đang được cập nhật… 🌸</em>`;
  }

  // Pros
  const prosList = document.getElementById('rv-pros');
  if (book.pros) {
    prosList.innerHTML = book.pros.split('|')
      .filter(Boolean)
      .map(p => `<li>${p.trim()}</li>`)
      .join('');
  } else {
    prosList.closest('.pros-box').style.display = 'none';
  }

  // Cons
  const consList = document.getElementById('rv-cons');
  if (book.cons) {
    consList.innerHTML = book.cons.split('|')
      .filter(Boolean)
      .map(c => `<li>${c.trim()}</li>`)
      .join('');
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

  // Show / hide
  document.getElementById('review-loading').classList.add('hidden');
  document.getElementById('review-main').classList.remove('hidden');
}

// ── Helpers ───────────────────────────────────────────────
function buildBuyButtons(book) {
  let html = '';
  if (book.buy_shopee) {
    html += `<a href="${book.buy_shopee}" class="btn-platform btn-shopee"
              target="_blank" rel="noopener sponsored"
              id="buy-shopee-${book.sku}">
              🛒 Shopee
            </a>`;
  }
  if (book.buy_fahasa) {
    html += `<a href="${book.buy_fahasa}" class="btn-platform btn-fahasa"
              target="_blank" rel="noopener sponsored"
              id="buy-fahasa-${book.sku}">
              📚 Fahasa
            </a>`;
  }
  if (book.buy_tiki) {
    html += `<a href="${book.buy_tiki}" class="btn-platform btn-tiki"
              target="_blank" rel="noopener sponsored"
              id="buy-tiki-${book.sku}">
              🛍️ Tiki
            </a>`;
  }
  if (!html) {
    html = `<span style="color:rgba(255,255,255,.4);font-size:.9rem">Link đang cập nhật…</span>`;
  }
  return html;
}

function formatReview(text) {
  // Bôi đậm text trong **...**
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
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
