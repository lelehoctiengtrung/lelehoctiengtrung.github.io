// ============================================================
// docs.js — Tài liệu page
// Load danh sách tài liệu từ Google Sheets hoặc Fallback
// ============================================================

// ── CONFIG ────────────────────────────────────────────────
const SHEET_ID   = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o';
const SHEET_NAME = 'docs';
const WEB_APP_URL = ''; // Dán URL Web App của Google Apps Script tại đây để nhận yêu cầu từ bạn đọc

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
    id: 'DOC-RADICALS',
    title: '30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé',
    desc: 'Tài liệu 30 bộ thủ tiếng Trung thông dụng nhất cho các bé, được thiết kế sinh động, nhiều màu sắc và hình minh họa siêu dễ thương!',
    category: 'vocab',
    icon: '🎨',
    icon_color: '#FF7B90',
    pages: 'PDF · 17 trang · Màu sắc',
    level: '1',
    level_text: 'Mầm non & Tiểu học',
    drive_url: 'https://drive.google.com/file/d/1KF_c7CHdSljkl8Rme-C5LZpI0h9XMRAE/view?usp=sharing'
  },
  {
    id: 'DOC-STREETFOOD',
    title: 'Street Food Tiếng Trung Cực Dễ',
    desc: 'Tổng hợp tên gọi các món ăn đường phố Trung Hoa và mẫu câu giao tiếp tự tin khi đi ăn quán lề đường.',
    category: 'infographics',
    icon: '🍜',
    icon_color: '#E58F65',
    pages: 'Bộ ảnh · 10 ảnh',
    level: '2',
    level_text: 'Giao tiếp cơ bản',
    drive_url: 'https://drive.google.com/file/d/1KF_c7CHdSljkl8Rme-C5LZpI0h9XMRAE/view?usp=sharing',
    preview_images: 'POSTS/images/street_food_辣炒年糕.png,POSTS/images/street_food_越南夹肉面包.png,POSTS/images/street_food_热狗.png,POSTS/images/street_food_炸鱼薯条.png,POSTS/images/street_food_土耳其烤肉.png,POSTS/images/street_food_吉拿棒.png,POSTS/images/street_food_塔可饼.png,POSTS/images/street_food_章鱼烧.png,POSTS/images/street_food_泰式炒金边粉.png,POSTS/images/street_food_意式冰淇淋.png'
  },
  {
    id: 'DOC-WORDORDERS',
    title: 'Trật tự từ',
    desc: 'Bí kíp sắp xếp thứ tự từ trong câu tiếng Trung chuẩn xác, không bị lỗi dịch ngược hay nói bồi.',
    category: 'infographics',
    icon: '🔤',
    icon_color: '#4A90E2',
    pages: 'Bộ ảnh · 11 ảnh',
    level: '3',
    level_text: 'Trung cấp · HSK 2-3',
    drive_url: 'https://drive.google.com/file/d/1KF_c7CHdSljkl8Rme-C5LZpI0h9XMRAE/view?usp=sharing',
    preview_images: 'POSTS/images/word_order_国外_外国.png,POSTS/images/word_order_牙刷_刷牙.png,POSTS/images/word_order_带领_领带.png,POSTS/images/word_order_盘算_算盘.png,POSTS/images/word_order_报警_警报.png,POSTS/images/word_order_马上_上马.png,POSTS/images/word_order_语法_法语.png,POSTS/images/word_order_蜜蜂_蜂蜜.png,POSTS/images/word_order_现实_实现.png,POSTS/images/word_order_牛奶_奶牛.png,POSTS/images/word_order_故事_事故.png'
  },
  {
    id: 'DOC-SUMMER',
    title: 'Học Tiếng Trung Mùa Hè Cực Vui',
    desc: 'Cẩm nang học tiếng Trung chủ đề mùa hè đầy đủ nhất cho bé: từ vựng thời tiết, bãi biển, các hoạt động trò chơi, bài thơ thiếu nhi và lộ trình 12 tuần cụ thể.',
    category: 'vocab',
    icon: '☀️',
    icon_color: '#FF8A5B',
    pages: 'PDF · 30 trang · Màu sắc',
    level: '1',
    level_text: 'Mầm non & Tiểu học',
    drive_url: 'POSTS/docs/DOC-SUMMER.pdf'
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
    'DOC-RADICALS': {
      title: '30 Magical Chinese Radicals for Kids',
      desc: 'The 30 most common Chinese radicals for kids, designed with colorful, cartoonish graphics and visual mnemonics!',
      level_text: 'Preschool & Primary',
      pages: 'PDF · 17 pages · Colored'
    },
    'DOC-STREETFOOD': {
      title: 'Easy Chinese Street Food Guide',
      desc: 'A collection of Chinese street food names and practical speaking phrases for dining out confidently.',
      level_text: 'Basic Speaking',
      pages: 'Images · 10 sheets'
    },
    'DOC-WORDORDERS': {
      title: 'Chinese Word Order Handbook',
      desc: 'Master correct sentence structure and word order in Chinese to avoid common translation errors.',
      level_text: 'Intermediate · HSK 2-3',
      pages: 'Images · 11 sheets'
    },
    'DOC-SUMMER': {
      title: 'Fun Summer Chinese Guide',
      desc: 'The complete summer Chinese learning guide for kids: weather, beach vocabulary, activities, kids poems, and a 12-week vocabulary roadmap.',
      level_text: 'Preschool & Primary',
      pages: 'PDF · 30 pages · Colored'
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
    'DOC-RADICALS': {
      title: '儿童趣味部首三十',
      desc: '专为儿童设计的30个最常用汉语部首，配备生动有趣的彩色插图和象形联想！',
      level_text: '幼儿与小学阶段',
      pages: 'PDF · 17 页 · 彩色版'
    },
    'DOC-STREETFOOD': {
      title: '趣味汉语街头美食指南',
      desc: '整理了中国街头常见美食名称与实用就餐交际口语，让您轻松点餐。',
      level_text: '基础口语',
      pages: '图集 · 10 张'
    },
    'DOC-WORDORDERS': {
      title: '汉语语序与句型手册',
      desc: '系统梳理汉语常用句型的语序规则，助您告别越式外语翻译腔。',
      level_text: '中级 · HSK 2–3',
      pages: '图集 · 11 张'
    },
    'DOC-SUMMER': {
      title: '快乐暑期汉语手册',
      desc: '专为儿童设计的暑期汉语学习指南：包含天气与海滩词汇、趣味互动游戏、经典童谣及12周词汇学习计划。',
      level_text: '幼儿与小学阶段',
      pages: 'PDF · 30 页 · 彩色版'
    }
  }
};

// --- INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadDocs();
  setupRequestForm();
  
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
  if (t.includes('BỘ THỦ') || t.includes('RADICAL') || t.includes('THỦ')) return 'DOC-RADICALS';
  if (t.includes('STREET FOOD') || t.includes('ẨM THỰC') || t.includes('FOOD')) return 'DOC-STREETFOOD';
  if (t.includes('WORD ORDER') || t.includes('TRẬT TỰ') || t.includes('CÂU')) return 'DOC-WORDORDERS';
  if (t.includes('MÙA HÈ') || t.includes('SUMMER')) return 'DOC-SUMMER';
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

    // Merge infographics fallback docs if they are not in the sheet response (also merge DOC-SUMMER)
    FALLBACK_DOCS.forEach(fd => {
      if (fd.category === 'infographics' || fd.id === 'DOC-SUMMER') {
        if (!docs.some(d => d.id.toUpperCase() === fd.id.toUpperCase())) {
          let title = fd.title;
          let desc = fd.desc;
          let pages = fd.pages;
          let level_text = fd.level_text;
          const lang = window.i18n ? window.i18n.currentLang : 'vi';
          if (lang !== 'vi' && DOC_TRANSLATIONS[lang] && DOC_TRANSLATIONS[lang][fd.id]) {
            const tDoc = DOC_TRANSLATIONS[lang][fd.id];
            title = tDoc.title || title;
            desc = tDoc.desc || desc;
            pages = tDoc.pages || pages;
            level_text = tDoc.level_text || level_text;
          }
          docs.push({
            id: fd.id,
            title: title,
            desc: desc,
            category: fd.category,
            icon: fd.icon,
            icon_color: fd.icon_color,
            pages: pages,
            level: fd.level,
            level_text: level_text,
            drive_url: fd.drive_url,
            preview_images: fd.preview_images
          });
        }
      }
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
  
  const lang = window.i18n ? window.i18n.currentLang : 'vi';
  const detailBtnText = {
    vi: 'Xem chi tiết & tải về',
    en: 'Details & Download',
    zh: '查看详情并下载'
  }[lang] || 'Xem chi tiết & tải về';

  docs.forEach(doc => {
    const card = document.createElement('div');
    card.dataset.category = doc.category;
    card.id = `doc-${doc.id.toLowerCase()}`;

    card.className = 'doc-big-card';
    const levelNum = parseInt(doc.level) || 2;
    let dotsHtml = '';
    for (let d = 1; d <= 5; d++) {
      dotsHtml += `<span class="level-dot${d <= levelNum ? '' : ' empty'}"></span>`;
    }

    const cardBtnText = doc.category === 'infographics'
      ? ({ vi: 'Xem bộ ảnh', en: 'View Images', zh: '查看图集' }[lang] || 'Xem bộ ảnh')
      : detailBtnText;

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
          ${cardBtnText}
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
      const cards = document.querySelectorAll('.doc-big-card, .doc-image-card');

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
    document.querySelectorAll('.doc-big-card, .doc-image-card').forEach(c => c.style.animation = 'none');
  }
}

// ── Helpers ───────────────────────────────────────────────
function getCategoryLabel(cat) {
  const lang = window.i18n ? window.i18n.currentLang : 'vi';
  const viMap = { 'vocab': 'Từ vựng', 'grammar': 'Ngữ pháp', 'hsk': 'Thi HSK', 'writing': 'Luyện viết', 'infographics': 'Infographics' };
  const enMap = { 'vocab': 'Vocab', 'grammar': 'Grammar', 'hsk': 'HSK Exam', 'writing': 'Handwriting', 'infographics': 'Infographics' };
  const zhMap = { 'vocab': '词汇', 'grammar': '语法', 'hsk': 'HSK考试', 'writing': '字帖', 'infographics': '信息图' };
  
  const maps = { vi: viMap, en: enMap, zh: zhMap };
  const activeMap = maps[lang] || viMap;
  return activeMap[cat] || cat;
}

function setupRequestForm() {
  const form = document.getElementById('doc-request-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const docInput = document.getElementById('req-doc-name');
    const emailInput = document.getElementById('req-doc-email');
    const submitBtn = document.getElementById('btn-request-submit');
    const statusMsg = document.getElementById('request-status-msg');

    if (!docInput || !submitBtn || !statusMsg) return;

    // Reset status message
    statusMsg.className = 'request-message';
    statusMsg.style.display = 'none';
    statusMsg.textContent = '';

    const docName = docInput.value.trim();
    const email = emailInput ? emailInput.value.trim() : '';

    if (!docName) {
      const errorMsg = window.i18n ? window.i18n.t('docs_request_empty_fields', 'Vui lòng nhập tên tài liệu.') : 'Vui lòng nhập tên tài liệu.';
      showStatus(errorMsg, 'error');
      return;
    }

    if (email && !validateEmail(email)) {
      const errorMsg = window.i18n ? window.i18n.t('docs_request_invalid_email', 'Vui lòng nhập email hợp lệ.') : 'Vui lòng nhập email hợp lệ.';
      showStatus(errorMsg, 'error');
      return;
    }

    // Disable inputs
    submitBtn.disabled = true;
    docInput.disabled = true;
    if (emailInput) emailInput.disabled = true;

    // Get Web App URL
    const targetUrl = WEB_APP_URL || localStorage.getItem('lele_web_app_url');
    if (!targetUrl) {
      console.warn('Google Apps Script Web App URL is not configured.');
      const errorMsg = window.i18n ? window.i18n.t('docs_request_error', 'Gửi yêu cầu thất bại. Vui lòng thử lại sau nhé!') : 'Gửi yêu cầu thất bại. Vui lòng thử lại sau nhé!';
      showStatus(errorMsg, 'error');
      enableInputs();
      return;
    }

    try {
      await fetch(targetUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'submit_request',
          request_doc: docName,
          email: email
        })
      });

      const successMsg = window.i18n ? window.i18n.t('docs_request_success', 'Đã ghi nhận yêu cầu của bạn! Cảm ơn bạn nhé 🥰') : 'Đã ghi nhận yêu cầu của bạn! Cảm ơn bạn nhé 🥰';
      showStatus(successMsg, 'success');
      form.reset();
    } catch (err) {
      console.error('Request form submission failed:', err);
      const errorMsg = window.i18n ? window.i18n.t('docs_request_error', 'Gửi yêu cầu thất bại. Vui lòng thử lại sau nhé!') : 'Gửi yêu cầu thất bại. Vui lòng thử lại sau nhé!';
      showStatus(errorMsg, 'error');
    } finally {
      enableInputs();
    }

    function showStatus(text, type) {
      statusMsg.textContent = text;
      statusMsg.className = `request-message ${type}`;
      statusMsg.style.display = 'block';
    }

    function enableInputs() {
      submitBtn.disabled = false;
      docInput.disabled = false;
      if (emailInput) emailInput.disabled = false;
    }
  });
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// ── Lightbox for Image-only Document Grid ─────────────────
let activeGalleryUrls = [];
let activeGalleryIndex = 0;

function openImageLightbox(index, urls) {
  activeGalleryUrls = urls;
  activeGalleryIndex = index;
  
  let lb = document.getElementById('docs-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'docs-lightbox';
    lb.style.cssText = `
      position: fixed; inset: 0; z-index: 9999;
      display: none; align-items: center; justify-content: center;
      opacity: 0; transition: opacity 0.3s ease;
    `;
    lb.innerHTML = `
      <div class="lb-backdrop" onclick="closeImageLightbox()" style="position: absolute; inset: 0; background: rgba(10,8,7,0.92); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);"></div>
      <div class="lb-content" style="position: relative; z-index: 2; width: 90%; max-width: 580px; max-height: 85vh; display: flex; flex-direction: column; align-items: center; gap: 1rem;">
        <button class="lb-close" onclick="closeImageLightbox()" aria-label="Đóng" style="position: absolute; top: -2.8rem; right: 0; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.15); color: #fff; font-size: 1.1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">✕</button>
        <button class="lb-prev" onclick="shiftImageLightbox(-1)" aria-label="Ảnh trước" style="position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; font-size: 1.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; left: -3.8rem; user-select: none;">‹</button>
        <img id="docs-lb-img" src="" alt="Ảnh phóng to" style="max-width: 100%; max-height: 72vh; object-fit: contain; border-radius: 12px; box-shadow: 0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1);" />
        <button class="lb-next" onclick="shiftImageLightbox(1)" aria-label="Ảnh tiếp" style="position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%; background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.12); color: #fff; font-size: 1.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; right: -3.8rem; user-select: none;">›</button>
        <p class="lb-counter" id="docs-lb-counter" style="font-size: 0.78rem; color: var(--clr-cream-muted); letter-spacing: 0.05em; margin: 0;"></p>
      </div>
    `;
    document.body.appendChild(lb);
    
    const style = document.createElement('style');
    style.textContent = `
      #docs-lightbox .lb-close:hover { background: #C94535; border-color: #C94535; transform: scale(1.1) rotate(90deg); }
      #docs-lightbox .lb-prev:hover, #docs-lightbox .lb-next:hover { background: rgba(78,203,160,0.2); border-color: #4ecba0; color: #4ecba0; }
      #docs-lightbox .lb-prev:active { transform: translateY(-50%) translateX(-3px); }
      #docs-lightbox .lb-next:active { transform: translateY(-50%) translateX(3px); }
      @media (max-width: 900px) {
        #docs-lightbox .lb-prev { left: 0.5rem; z-index: 10; }
        #docs-lightbox .lb-next { right: 0.5rem; z-index: 10; }
        #docs-lightbox .lb-content { width: 95%; }
      }
    `;
    document.head.appendChild(style);
  }

  updateImageLightbox();
  lb.style.display = 'flex';
  setTimeout(() => {
    lb.style.opacity = '1';
  }, 10);
  document.body.style.overflow = 'hidden';
}

window.closeImageLightbox = function() {
  const lb = document.getElementById('docs-lightbox');
  if (lb) {
    lb.style.opacity = '0';
    setTimeout(() => {
      lb.style.display = 'none';
    }, 300);
  }
  document.body.style.overflow = '';
};

window.shiftImageLightbox = function(dir) {
  if (!activeGalleryUrls.length) return;
  activeGalleryIndex = (activeGalleryIndex + dir + activeGalleryUrls.length) % activeGalleryUrls.length;
  updateImageLightbox();
};

window.updateImageLightbox = function() {
  const urls = activeGalleryUrls;
  const i = activeGalleryIndex;
  const img = document.getElementById('docs-lb-img');
  if (img) img.src = urls[i];
  const counter = document.getElementById('docs-lb-counter');
  if (counter) counter.textContent = `${i + 1} / ${urls.length}`;
};

document.addEventListener('keydown', e => {
  const lb = document.getElementById('docs-lightbox');
  if (lb && lb.style.display === 'flex') {
    if (e.key === 'Escape') closeImageLightbox();
    if (e.key === 'ArrowLeft') shiftImageLightbox(-1);
    if (e.key === 'ArrowRight') shiftImageLightbox(1);
  }
});
