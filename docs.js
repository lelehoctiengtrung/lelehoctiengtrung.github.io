// ============================================================
// docs.js — Tài liệu page
// Load danh sách tài liệu từ Google Sheets hoặc Fallback
// ============================================================

// ── CONFIG ────────────────────────────────────────────────
const SHEET_ID   = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o';
const SHEET_NAME = 'docs';

// Columns in sheet 'docs'
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

// ---- Fallback data for offline preview ----
const FALLBACK_DOCS = [
  {
    id: 'DOC-500',
    title: '500 Từ Vựng Thông Dụng Nhất',
    desc: 'Danh sách 500 từ hay gặp nhất trong tiếng Trung hàng ngày, kèm pinyin và nghĩa tiếng Việt. Phù hợp cho người mới bắt đầu.',
    category: 'vocab',
    icon: '📝',
    icon_color: '#D4A843',
    pages: 'PDF · 12 trang',
    level: '2',
    level_text: 'Cơ bản · HSK 1–2',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE'
  },
  {
    id: 'DOC-GRAMMAR',
    title: 'Ngữ Pháp Tiếng Trung Cơ Bản',
    desc: 'Tổng hợp các cấu trúc ngữ pháp quan trọng nhất, ví dụ minh hoạ rõ ràng bằng tiếng Việt. Học xong nói câu đúng ngay.',
    category: 'grammar',
    icon: '📚',
    icon_color: '#C94535',
    pages: 'PDF · 28 trang',
    level: '3',
    level_text: 'Trung cấp · HSK 2–3',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE'
  },
  {
    id: 'DOC-HSK',
    title: 'Đề Thi Thử HSK 1 & 2',
    desc: 'Bộ đề thi thử HSK cấp 1 và 2 với đáp án đầy đủ. Luyện xong tự tin thi thật! Lê Lê đã dùng đề này để ôn thi.',
    category: 'hsk',
    icon: '🎯',
    icon_color: '#3b7fd4',
    pages: 'PDF · 35 trang · Có đáp án',
    level: '2',
    level_text: 'Cơ bản · HSK 1–2',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE'
  },
  {
    id: 'DOC-WRITING',
    title: 'Bảng Luyện Viết Hán Tự',
    desc: 'Tờ luyện viết nét chữ theo ô vuông chuẩn với 100 chữ Hán cơ bản nhất. In ra luyện mỗi ngày giúp nhớ chữ rất nhanh!',
    category: 'writing',
    icon: '✍️',
    icon_color: '#7c5cbf',
    pages: 'PDF · In được',
    level: '1',
    level_text: 'Người mới · 100 chữ',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE'
  },
  {
    id: 'DOC-CHUDE',
    title: 'Từ Vựng Theo Chủ Đề',
    desc: 'Từ vựng được phân loại theo 15 chủ đề thực tế: gia đình, công việc, du lịch, ăn uống… Học nhanh, nhớ lâu!',
    category: 'vocab',
    icon: '🗂️',
    icon_color: '#2ea078',
    pages: 'PDF · 20 trang',
    level: '2',
    level_text: 'Sơ cấp · HSK 1–3',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE'
  },
  {
    id: 'DOC-HSK3',
    title: 'Đề Thi Thử HSK 3',
    desc: '3 đề thi thử HSK 3 đầy đủ các phần nghe – đọc – viết với đáp án chi tiết. Thích hợp ôn luyện trước kỳ thi.',
    category: 'hsk',
    icon: '📋',
    icon_color: '#3b7fd4',
    pages: 'PDF · 42 trang · Có đáp án',
    level: '3',
    level_text: 'Trung cấp · HSK 3',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE'
  }
];

// --- INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadDocs();
});

// --- Fetch from Google Sheets ─────────────────────────────
function loadDocs() {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&headers=2`;
  const script = document.createElement('script');
  script.src = url + '&callback=onSheetData';
  window.onSheetData = (data) => parseAndRenderDocs(data);
  script.onerror = () => {
    console.warn('Google Sheets loading failed. Using fallback docs.');
    renderDocsList(FALLBACK_DOCS);
  };
  document.head.appendChild(script);
}

// --- Parse GViz response ──────────────────────────────────
function parseAndRenderDocs(data) {
  try {
    const rows = data.table.rows;
    if (!rows || rows.length === 0) {
      renderDocsList(FALLBACK_DOCS);
      return;
    }

    const docs = rows.map(r => {
      const get = (col, fallbackVal = '') => {
        const cell = r.c[col];
        const val = (cell && cell.v != null) ? String(cell.v).trim() : '';
        return val || fallbackVal;
      };

      // Match fallback default properties for details if some columns are empty
      const id = get(COL.id);
      const fallbackItem = FALLBACK_DOCS.find(f => f.id.toUpperCase() === id.toUpperCase());

      return {
        id:             id,
        title:          get(COL.title, fallbackItem?.title),
        desc:           get(COL.desc, fallbackItem?.desc),
        category:       get(COL.category, fallbackItem?.category || 'vocab'),
        icon:           get(COL.icon, fallbackItem?.icon || '📝'),
        icon_color:     get(COL.icon_color, fallbackItem?.icon_color || '#D4A843'),
        pages:          get(COL.pages, fallbackItem?.pages || 'PDF'),
        level:          get(COL.level, fallbackItem?.level || '2'),
        level_text:     get(COL.level_text, fallbackItem?.level_text || 'Cơ bản'),
        drive_url:      get(COL.drive_url, fallbackItem?.drive_url || '#')
      };
    });

    renderDocsList(docs);
  } catch (e) {
    console.error('Parse error docs:', e);
    renderDocsList(FALLBACK_DOCS);
  }
}

// --- Render list to HTML ──────────────────────────────────
function renderDocsList(docs) {
  const grid = document.getElementById('docs-grid');
  const loading = document.getElementById('docs-loading');
  
  if (!grid) return;

  grid.innerHTML = '';
  
  docs.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'doc-big-card';
    card.dataset.category = doc.category;
    card.id = `doc-${doc.id.toLowerCase()}`;

    // Level dots markup
    const levelNum = parseInt(doc.level) || 2;
    let dotsHtml = '';
    for (let d = 1; d <= 5; d++) {
      dotsHtml += `<span class="level-dot${d <= levelNum ? '' : ' empty'}"></span>`;
    }

    card.innerHTML = `
      <div class="doc-big-top">
        <div class="doc-big-icon" style="--c:${doc.icon_color}">${doc.icon}</div>
        <div class="doc-big-meta">
          <span class="doc-cat-tag ${doc.category}">${getCategoryLabel(doc.category)}</span>
          <span class="doc-size">${doc.pages}</span>
        </div>
      </div>
      <h3 class="doc-big-title">${doc.title}</h3>
      <p class="doc-big-desc">${doc.desc}</p>
      <div class="doc-big-level">
        ${dotsHtml}
        <span class="level-text">${doc.level_text}</span>
      </div>
      <div class="doc-big-actions">
        <a href="doc/doc.html?id=${doc.id}" class="btn-download-big" id="dl-${doc.id.toLowerCase()}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
          Xem chi tiết & tải về
        </a>
        <button class="btn-share-big" data-title="${doc.title}" data-url="${window.location.origin}/doc/doc.html?id=${doc.id}" id="share-${doc.id.toLowerCase()}" aria-label="Chia sẻ tài liệu">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Setup filters & actions
  setupFilters();
  setupActions();

  // Show grid
  if (loading) loading.classList.add('hidden');
  grid.classList.remove('hidden');
}

// --- Setup category filters ---
function setupFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const emptyState = document.getElementById('empty-state');

  tabs.forEach(tab => {
    // Remove previous listeners (since setupFilters might be rerun)
    const newTab = tab.cloneNode(true);
    tab.parentNode.replaceChild(newTab, tab);
  });

  const refreshedTabs = document.querySelectorAll('.filter-tab');
  refreshedTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;
      const cards = document.querySelectorAll('.doc-big-card');

      refreshedTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      let visible = 0;
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) {
          card.removeAttribute('hidden');
          card.style.animation = 'none';
          requestAnimationFrame(() => {
            card.style.animation = 'fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both';
          });
          visible++;
        } else {
          card.setAttribute('hidden', '');
        }
      });

      if (emptyState) emptyState.hidden = visible > 0;
    });
  });
}

// --- Setup sharing and ripple effects ---
function setupActions() {
  const toast    = document.getElementById('share-toast');
  const toastMsg = document.getElementById('toast-msg');

  function showToast(msg) {
    if (!toast || !toastMsg) return;
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // Share buttons
  document.querySelectorAll('.btn-share-big').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      const title = btn.dataset.title || 'Tài liệu tiếng Trung';
      const url   = btn.dataset.url   || window.location.href;
      const text  = `📚 "${title}" — bài giới thiệu & tải tài liệu học tiếng Trung miễn phí từ Lê Lê học tiếng Trung!`;

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
        showToast('✅ Đã sao chép link tài liệu!');
      } catch {
        window.prompt('Sao chép link này:', url);
      }
    });
  });

  // Ripple effect on buttons
  document.querySelectorAll('.btn-download-big').forEach(btn => {
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

  // Inject keyframe if not exists
  if (!document.getElementById('docs-ripple-style')) {
    const style = document.createElement('style');
    style.id = 'docs-ripple-style';
    style.textContent = `@keyframes ripple-docs { to { transform:scale(1); opacity:0; } }`;
    document.head.appendChild(style);
  }

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.doc-big-card').forEach(c => c.style.animation = 'none');
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
