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

// --- Book/Doc Translations Mapping ----
const DOC_TRANSLATIONS = {
  en: {
    'DOC-500': {
      title: '500 Most Common Words',
      desc: 'A list of the 500 most frequently used words in daily Chinese, with Pinyin and English/Vietnamese meanings. Ideal for beginners.',
      level_text: 'Basic · HSK 1-2',
      pages: 'PDF · 12 pages'
    },
    'DOC-GRAMMAR': {
      title: 'Basic Chinese Grammar',
      desc: 'A compilation of the most important grammar structures with clear explanations. Learn to speak correctly right away.',
      level_text: 'Intermediate · HSK 2-3',
      pages: 'PDF · 28 pages'
    },
    'DOC-HSK': {
      title: 'HSK 1 & 2 Mock Exams',
      desc: 'HSK Level 1 and 2 mock test bundle with complete answers. Practice and build confidence for the real exam!',
      level_text: 'Basic · HSK 1-2',
      pages: 'PDF · 35 pages · Answer Key'
    },
    'DOC-WRITING': {
      title: 'Character Practice Sheets',
      desc: 'Standard grid practice sheets with 100 of the most fundamental Chinese characters. Print out to write daily!',
      level_text: 'Beginner · 100 chars',
      pages: 'PDF · Printable'
    },
    'DOC-CHUDE': {
      title: 'Thematic Vocabulary Lists',
      desc: 'Vocabulary organized into 15 practical real-life themes: family, work, travel, dining... Learn fast, remember long!',
      level_text: 'Basic · HSK 1-3',
      pages: 'PDF · 20 pages'
    },
    'DOC-HSK3': {
      title: 'HSK 3 Mock Exams',
      desc: '3 complete HSK 3 mock exams covering listening, reading, and writing with detailed answer keys.',
      level_text: 'Intermediate · HSK 3',
      pages: 'PDF · 42 pages · Answer Key'
    }
  },
  zh: {
    'DOC-500': {
      title: '500个最常用词汇表',
      desc: '日常汉语中最常用的500个词汇列表，附带拼音与多语种释义。非常适合初学者。',
      level_text: '基础 · HSK 1–2',
      pages: 'PDF · 12 页'
    },
    'DOC-GRAMMAR': {
      title: '基础汉语语法汇总',
      desc: '系统整理最核心的中文语法结构，配有清晰的例句和解释，助您快速掌握。',
      level_text: '中级 · HSK 2–3',
      pages: 'PDF · 28 页'
    },
    'DOC-HSK': {
      title: 'HSK 1 & 2 模拟试题',
      desc: '包含完整答案的 HSK 1级和2级模拟套题，模拟真实考试场景，助您自信通关。',
      level_text: '基础 · HSK 1–2',
      pages: 'PDF · 35 页 · 附答案'
    },
    'DOC-WRITING': {
      title: '汉字书写田字格字帖',
      desc: '专为100个最基础汉字设计的田字格书写练习模板。可直接打印，每日练习！',
      level_text: '零基础 · 100 字',
      pages: 'PDF · 可打印'
    },
    'DOC-CHUDE': {
      title: '分类主题词汇表',
      desc: '涵盖家庭、工作、旅游、饮食等 15 个实用生活场景的分类词汇表。高效记忆！',
      level_text: '基础 · HSK 1–3',
      pages: 'PDF · 20 页'
    },
    'DOC-HSK3': {
      title: 'HSK 3 模拟试卷',
      desc: '3套完整的 HSK 3级模拟试卷，覆盖听力、阅读和书写，并附有详细答案解析。',
      level_text: '中级 · HSK 3',
      pages: 'PDF · 42 页 · 附答案'
    }
  }
};

// --- INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadDocs();
  
  window.addEventListener('langChanged', () => {
    loadDocs();
  });
});

// --- Fetch from Google Sheets ─────────────────────────────
async function loadDocs() {
  const grid = document.getElementById('docs-grid');
  if (!grid) return;

  // Save static HTML as fallback if any
  if (!grid.dataset.staticFallback) {
    grid.dataset.staticFallback = grid.innerHTML;
  }

  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&headers=2`;
    const res = await fetch(url);
    const raw = await res.text();

    const match = raw.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if (!match) throw new Error('Invalid response');
    const data = JSON.parse(match[1]);

    parseAndRenderDocs(data);
  } catch (err) {
    console.warn('Google Sheets loading failed. Using fallback docs.', err);
    renderDocsList(FALLBACK_DOCS);
  }
}

// --- Helpers for column parsing & ID inference ------------
function inferId(title, index) {
  if (!title) return `DOC-ROW-${index}`;
  const t = title.toUpperCase();
  if (t.includes('500')) return 'DOC-500';
  if (t.includes('NGỮ PHÁP') || t.includes('GRAMMAR')) return 'DOC-GRAMMAR';
  if (t.includes('HSK 3') || t.includes('HSK3')) return 'DOC-HSK3';
  if (t.includes('ĐỀ THI') || t.includes('HSK') || t.includes('MOCK')) return 'DOC-HSK';
  if (t.includes('LUYỆN VIẾT') || t.includes('WRITING') || t.includes('CHỮ HÁN')) return 'DOC-WRITING';
  if (t.includes('CHỦ ĐỀ') || t.includes('THEME')) return 'DOC-CHUDE';
  return `DOC-ROW-${index}`;
}

// --- Parse GViz response ──────────────────────────────────
function parseAndRenderDocs(data) {
  try {
    const rows = data.table.rows;
    if (!rows || rows.length === 0) {
      renderDocsList(FALLBACK_DOCS);
      return;
    }

    const cols = data.table.cols || [];
    const colMap = {};
    // Set default column indices for 9-column format
    colMap.title = 0;
    colMap.desc = 1;
    colMap.category = 2;
    colMap.icon = 3;
    colMap.icon_color = 4;
    colMap.pages = 5;
    colMap.level = 6;
    colMap.level_text = 7;
    colMap.drive_url = 8;
    colMap.id = -1;

    cols.forEach((col, index) => {
      const label = (col.label || '').toLowerCase();
      if (label.includes('title')) colMap.title = index;
      else if (label.includes('desc')) colMap.desc = index;
      else if (label.includes('category') || label.includes('nhóm')) colMap.category = index;
      else if (label.includes('icon_color') || label.includes('màu')) colMap.icon_color = index;
      else if (label.includes('icon')) colMap.icon = index;
      else if (label.includes('pages') || label.includes('trang') || label.includes('thông tin')) colMap.pages = index;
      else if (label.includes('level_text')) colMap.level_text = index;
      else if (label.includes('level') || label.includes('độ khó')) colMap.level = index;
      else if (label.includes('drive_url') || label.includes('link drive')) colMap.drive_url = index;
      else if (label.includes('id') || label.includes('id tài liệu')) colMap.id = index;
    });

    const docs = rows.map((r, rowIndex) => {
      const get = (colIdx, fallbackVal = '') => {
        if (colIdx === undefined || colIdx < 0 || !r.c) return fallbackVal;
        const cell = r.c[colIdx];
        const val = (cell && cell.v != null) ? String(cell.v).trim() : '';
        return val || fallbackVal;
      };

      let title = get(colMap.title);
      if (!title) return null; // Skip empty rows

      let id = '';
      if (colMap.id !== -1) {
        id = get(colMap.id);
      }
      if (!id) {
        id = inferId(title, rowIndex);
      }

      const fallbackItem = FALLBACK_DOCS.find(f => f.id.toUpperCase() === id.toUpperCase());

      let desc = get(colMap.desc, fallbackItem?.desc);
      let pages = get(colMap.pages, fallbackItem?.pages || 'PDF');
      let level_text = get(colMap.level_text, fallbackItem?.level_text || 'Cơ bản');
      const category = get(colMap.category, fallbackItem?.category || 'vocab');
      const icon = get(colMap.icon, fallbackItem?.icon || '📝');
      const icon_color = get(colMap.icon_color, fallbackItem?.icon_color || '#D4A843');
      const level = get(colMap.level, fallbackItem?.level || '2');
      const drive_url = get(colMap.drive_url, fallbackItem?.drive_url || '#');

      // Localize metadata fields if active language is not vi
      const lang = window.i18n ? window.i18n.currentLang : 'vi';
      if (lang !== 'vi' && DOC_TRANSLATIONS[lang] && DOC_TRANSLATIONS[lang][id]) {
        const tDoc = DOC_TRANSLATIONS[lang][id];
        title = tDoc.title || title;
        desc = tDoc.desc || desc;
        pages = tDoc.pages || pages;
        level_text = tDoc.level_text || level_text;
      }

      return { id, title, desc, category, icon, icon_color, pages, level, level_text, drive_url };
    }).filter(Boolean);

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
  
  const lang = window.i18n ? window.i18n.currentLang : 'vi';
  const detailBtnText = {
    vi: 'Xem chi tiết & tải về',
    en: 'Details & Download',
    zh: '查看详情并下载'
  }[lang] || 'Xem chi tiết & tải về';

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
          ${detailBtnText}
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
        const toastMsgText = window.i18n ? window.i18n.t('docs_toast_copied', 'Đã sao chép link!') : 'Đã sao chép link!';
        showToast(`✅ ${toastMsgText}`);
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
  const lang = window.i18n ? window.i18n.currentLang : 'vi';
  const viMap = { 'vocab': 'Từ vựng', 'grammar': 'Ngữ pháp', 'hsk': 'Thi HSK', 'writing': 'Luyện viết' };
  const enMap = { 'vocab': 'Vocab', 'grammar': 'Grammar', 'hsk': 'HSK Exam', 'writing': 'Handwriting' };
  const zhMap = { 'vocab': '词汇', 'grammar': '语法', 'hsk': 'HSK考试', 'writing': '字帖' };
  
  const maps = { vi: viMap, en: enMap, zh: zhMap };
  const activeMap = maps[lang] || viMap;
  return activeMap[cat] || cat;
}
