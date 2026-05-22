// ===================================================
// shop.js — Fetch sách từ Google Sheets
// ===================================================

const SHEET_ID = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o';
const BOOKS_API = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=books`;

// ---- Helpers ----
function parseGSheetJSON(raw) {
  // GSheet API wraps JSON in /*O_o*/ google.visualization.Query.setResponse({...});
  const json = raw.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
  if (!json) return null;
  return JSON.parse(json[1]);
}

function colVal(row, i) {
  const c = row.c[i];
  return c && c.v !== null && c.v !== undefined ? String(c.v).trim() : '';
}

// Columns: A=title B=subtitle_zh C=desc D=tags E=price F=badge G=badge_type H=stars I=cover_url J=affiliate_url
function buildBookCard(row) {
  const title        = colVal(row, 0);
  const subtitleZh   = colVal(row, 1);
  const desc         = colVal(row, 2);
  const tags         = colVal(row, 3).split(',').map(t => t.trim()).filter(Boolean);
  const price        = colVal(row, 4);
  const badge        = colVal(row, 5);
  const badgeType    = colVal(row, 6) || 'hot';
  const stars        = parseInt(colVal(row, 7)) || 5;
  const coverUrl     = colVal(row, 8);
  const affiliateUrl = colVal(row, 9) || '#';

  if (!title) return '';

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

  return `
    <article class="book-card" aria-label="${title}">
      <div class="book-cover-wrap">
        ${coverHtml}
        ${badgeHtml}
      </div>
      <div class="book-info">
        <div class="book-stars" aria-label="${stars} sao">${starsHtml}</div>
        <h3 class="book-title">${title}</h3>
        ${subtitleZh ? `<p class="book-subtitle" lang="zh">${subtitleZh}</p>` : ''}
        <p class="book-desc">${desc}</p>
        ${tagsHtml ? `<div class="book-tags">${tagsHtml}</div>` : ''}
        <div class="book-footer">
          <div class="book-price-group">
            <span class="price-label">Tham khảo</span>
            <span class="price">${priceFormatted}</span>
          </div>
          <a href="${affiliateUrl}" class="btn-buy" target="_blank" rel="noopener sponsored" aria-label="Mua ${title}">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0"/></svg>
            Mua ngay
          </a>
        </div>
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

  showSkeletons(grid);

  try {
    const res  = await fetch(BOOKS_API);
    const raw  = await res.text();
    const data = parseGSheetJSON(raw);

    if (!data || !data.table || !data.table.rows.length) {
      // Sheet chưa có dữ liệu — giữ sách mẫu tĩnh
      grid.innerHTML = grid.dataset.staticFallback || '';
      return;
    }

    const cards = data.table.rows.map(buildBookCard).join('');
    grid.innerHTML = cards || '<p class="no-data">Chưa có sách nào. Sẽ cập nhật sớm!</p>';

    // Re-attach interactions
    attachInteractions();
  } catch (err) {
    console.error('Fetch books error:', err);
    showError(grid);
  }
}

// ---- Interactions (ripple + tilt) ----
function attachInteractions() {
  // Ripple
  document.querySelectorAll('.btn-buy').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect   = btn.getBoundingClientRect();
      const size   = Math.max(rect.width, rect.height) * 1.5;
      ripple.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        left:${e.clientX-rect.left-size/2}px;top:${e.clientY-rect.top-size/2}px;
        border-radius:50%;background:rgba(255,255,255,0.25);
        transform:scale(0);animation:ripple-shop .5s ease-out forwards;
        pointer-events:none;z-index:10;`;
      btn.style.position = 'relative';
      btn.style.overflow = 'hidden';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // 3D tilt
  const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!noMotion) {
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
