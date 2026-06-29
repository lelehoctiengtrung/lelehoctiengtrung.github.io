// ===================================================
// shop.js — Fetch sách từ Google Sheets
// ===================================================

const SHEET_ID  = '1b6LNl7JHRiCsjK1w9VuD86GLqAfmSOtDUOm5whrGdH0';
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
  },
  'SACH-004': {
    sku: 'SACH-004',
    title: 'Tập Viết Chữ Hán Căn Bản',
    subtitle_zh: '汉字描红 · Quy tắc bút thuận',
    desc: 'Sách tập viết chữ Hán có hướng dẫn thứ tự nét vẽ chi tiết, đi kèm ô ly Mễ tự tiêu chuẩn giúp bạn luyện viết chữ Hán đẹp và chuẩn xác.',
    tags: 'Luyện viết, Chữ Hán, Tập viết',
    price: '65000',
    badge: 'Hot',
    badge_type: 'hot',
    stars: '5',
    cover_url: 'book4.png',
    buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY',
    buy_fahasa: 'https://www.fahasa.com/',
    buy_tiki: 'https://tiki.vn/',
    buy_lazada: 'https://www.lazada.vn/'
  },
  'SACH-005': {
    sku: 'SACH-005',
    title: 'Ngữ Pháp Tiếng Trung Dễ Hiểu',
    subtitle_zh: '汉语语法 · Tư duy sơ đồ',
    desc: 'Tổng hợp toàn bộ ngữ pháp tiếng Trung từ cơ bản đến nâng cao bằng sơ đồ tư duy trực quan, dễ nhớ, dễ áp dụng.',
    tags: 'Ngữ pháp, Sơ đồ tư duy, Dễ hiểu',
    price: '135000',
    badge: 'Khuyên dùng',
    badge_type: 'new',
    stars: '5',
    cover_url: 'book5.png',
    buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY',
    buy_fahasa: 'https://www.fahasa.com/',
    buy_tiki: 'https://tiki.vn/',
    buy_lazada: 'https://www.lazada.vn/'
  },
  'SPE-0001': {
    sku: 'SPE-0001',
    title: 'Sách Luyện Viết Từ Vựng Tiếng Trung HSK 1',
    subtitle_zh: 'HSK 1 词汇 ⭐️ Luyện Viết Chữ Hán',
    desc: 'Cuốn vở tập viết chữ Hán kết hợp bút bay mực thông minh giúp ghi nhớ 150 từ vựng HSK 1 cốt lõi, nắm vững 70 bộ thủ và quy tắc bút thuận. Viết xong mực tự biến mất để luyện tập lại nhiều lần! ✨',
    tags: 'Luyện viết, HSK 1, Bộ thủ',
    price: '95000',
    badge: 'Khuyên dùng',
    badge_type: 'new',
    stars: '5',
    cover_url: 'spe0001.png',
    buy_shopee: 'https://s.shopee.vn/AUrLPSQfFo',
    buy_fahasa: '',
    buy_tiki: '',
    buy_lazada: ''
  }
};

// ---- Book Translations Mapping ----
const BOOK_TRANSLATIONS = {
  en: {
    'SACH-001': {
      title: 'Chinese Course (Hanyu Jiaocheng)',
      desc: 'Standard Chinese textbook, complete with Pinyin pronunciation and rich exercises. Le Le studied from this book from the start! ✨',
      tags: 'Beginner, HSK 1-3, Has Pinyin'
    },
    'SACH-002': {
      title: '3000 HSK Vocabulary',
      desc: 'Complete HSK 1-6 vocabulary by theme, with example sentences, pronunciation and translations. A must-have for HSK prep! 💪',
      tags: 'Exam Prep, HSK 1-6, Comprehensive'
    },
    'SACH-003': {
      title: 'Practical Chinese Conversations',
      desc: 'Real-world daily communication scenarios. Speak immediately after learning, perfect for practicing speaking! 🗣️',
      tags: 'Communication, Practical, Audio CD'
    },
    'SACH-004': {
      title: 'Basic Chinese Character Writing',
      desc: 'Chinese writing book with detailed stroke order instructions and standard Mizi Ge grids to help you write characters beautifully.',
      tags: 'Writing, Chinese Characters, Practice'
    },
    'SACH-005': {
      title: 'Easy-to-Understand Chinese Grammar',
      desc: 'Summarizes all Chinese grammar from basic to advanced using intuitive mind maps, easy to remember and apply.',
      tags: 'Grammar, Mind Maps, Easy'
    },
    'SPE-0001': {
      title: 'HSK 1 Chinese Vocabulary Writing Book',
      desc: 'Smart Chinese vocabulary workbook combined with heat-erasable ink pen, helping you memorize 150 core HSK 1 words, 70 common radicals, and stroke order rules. Ink disappears automatically in minutes for repeated practice! ✨',
      tags: 'Writing, HSK 1, Radicals'
    }
  },
  zh: {
    'SACH-001': {
      title: '汉语教程',
      desc: '标准汉语教材，拼音标注齐全，练习丰富。乐乐从一开始就用这本书学习！✨',
      tags: '零基础, HSK 1-3, 附拼音'
    },
    'SACH-002': {
      title: 'HSK 3000 词汇',
      desc: '按主题分类的 HSK 1-6 全套词汇，附带例句、发音和释义。HSK备考必备！💪',
      tags: '备考, HSK 1-6, 完整版'
    },
    'SACH-003': {
      title: '实用汉语会话',
      desc: '真实日常交际场景。学完即用，非常适合练习口语！🗣️',
      tags: '口语交际, 实用, 附CD音频'
    },
    'SACH-004': {
      title: '基础汉字书写描红',
      desc: '带有详细笔顺指导的汉字字帖，配有标准米字格，助您写出漂亮规范的汉字。',
      tags: '书写练习, 汉字, 字帖'
    },
    'SACH-005': {
      title: '图解易懂汉语语法',
      desc: '通过直观的思维导图系统总结从初级到高级的汉语语法，易记易用。',
      tags: '语法, 思维导图, 易懂'
    }
  }
};

// ---- Helpers ----
function colVal(row, i, fallbackVal = '') {
  const c = row.c[i];
  const val = c && c.v !== null && c.v !== undefined ? String(c.v).trim() : '';
  return val || fallbackVal;
}

function isValidLink(url) {
  if (!url) return false;
  const u = url.trim();
  if (u === '' || u === '#' || u.includes('LINK_AFFILIATE') || u.includes('THAY_VAO_DAY') || u.includes('LINK_GOOGLE_DRIVE') || u.includes('undefined')) {
    return false;
  }
  return u.startsWith('http://') || u.startsWith('https://');
}

// ---- Build card ----
function buildBookCard(row) {
  const sku = colVal(row, C.sku);
  const fallback = FALLBACK_BOOKS[sku];

  let title      = colVal(row, C.title, fallback?.title);
  const subtitleZh = colVal(row, C.subtitle_zh, fallback?.subtitle_zh);
  let desc       = colVal(row, C.desc, fallback?.desc);
  let tagsRaw    = colVal(row, C.tags, fallback?.tags);
  const price      = colVal(row, C.price, fallback?.price);
  let badge      = colVal(row, C.badge, fallback?.badge);
  const badgeType  = colVal(row, C.badge_type, fallback?.badge_type) || 'hot';
  const stars      = parseInt(colVal(row, C.stars, fallback?.stars)) || 5;
  const coverUrl   = colVal(row, C.cover_url, fallback?.cover_url);
  const shopee     = colVal(row, C.buy_shopee);
  const fahasa     = colVal(row, C.buy_fahasa);
  const tiki       = colVal(row, C.buy_tiki);
  const lazada     = colVal(row, C.buy_lazada);

  if (!title) return '';

  // Localize content fields if active language is not vi
  const lang = window.i18n ? window.i18n.currentLang : 'vi';
  if (lang !== 'vi' && BOOK_TRANSLATIONS[lang] && BOOK_TRANSLATIONS[lang][sku]) {
    const tBook = BOOK_TRANSLATIONS[lang][sku];
    title = tBook.title || title;
    desc = tBook.desc || desc;
    tagsRaw = tBook.tags || tagsRaw;
  }

  // Localize badge if active
  if (badge) {
    if (badge.toLowerCase() === 'bán chạy' || badge.toLowerCase() === 'hot') {
      badge = window.i18n ? window.i18n.t('badge_hot', 'Bán chạy') : badge;
    } else if (badge.toLowerCase() === 'mới nhất' || badge.toLowerCase() === 'new') {
      badge = window.i18n ? window.i18n.t('badge_new', 'Mới nhất') : badge;
    } else if (badge.toLowerCase() === 'khuyên dùng' || badge.toLowerCase() === 'recommend') {
      badge = window.i18n ? window.i18n.t('badge_recommended', 'Khuyên dùng') : badge;
    }
  }

  const tags = tagsRaw.split(',').map(t => t.trim()).filter(Boolean);

  const reviewUrl = sku
    ? `review/review.html?sku=${encodeURIComponent(sku)}`
    : '#';

  const starsHtml = '★'.repeat(stars) + '☆'.repeat(5 - stars);
  const badgeHtml = badge
    ? `<div class="book-badge-wrap"><span class="badge badge-${badgeType}">${badge}</span></div>`
    : '';

  // Translate tags dynamically if they are standard ones
  const translatedTags = tags.map(tag => {
    if (!window.i18n) return tag;
    const tagLower = tag.toLowerCase();
    if (tagLower === 'người mới') return window.i18n.t('tag_beginner', 'Beginner');
    if (tagLower === 'có pinyin') return window.i18n.t('tag_pinyin', 'Has Pinyin');
    if (tagLower === 'luyện thi') return window.i18n.t('tag_exam', 'Exam Prep');
    if (tagLower === 'đầy đủ') return window.i18n.t('tag_complete', 'Complete');
    if (tagLower === 'giao tiếp') return window.i18n.t('tag_comms', 'Spoken');
    if (tagLower === 'thực dụng') return window.i18n.t('tag_practical', 'Practical');
    if (tagLower === 'luyện viết') return window.i18n.t('tag_writing', 'Writing');
    if (tagLower === 'chữ hán') return window.i18n.t('tag_hanzi', 'Hanzi');
    if (tagLower === 'ngữ pháp') return window.i18n.t('tag_grammar', 'Grammar');
    return tag;
  });
  const tagsHtml = translatedTags.map(t => `<span class="tag">${t}</span>`).join('');

  const priceNum = parseFloat(price);
  
  // Format price label
  const priceFormatted = priceNum
    ? (lang === 'vi' 
        ? `~${priceNum.toLocaleString('vi-VN')}₫` 
        : `~$${(priceNum / 25000).toFixed(1)}`) // Rough conversion for non-Vietnamese
    : (window.i18n ? window.i18n.t('shop_updating_links', 'Contact') : 'Liên hệ');

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
    .filter(p => isValidLink(p.key))
    .map(p => `
      <a href="${p.key}" class="btn-platform-sm ${p.cls}"
         target="_blank" rel="noopener sponsored"
         aria-label="Buy ${title}">
        ${p.label}
      </a>`)
    .join('');

  const buySection = platformBtns
    ? `<div class="book-platforms">${platformBtns}</div>`
    : '';

  const readReviewTxt = window.i18n ? window.i18n.t('shop_btn_read_review', 'Đọc review') : 'Đọc review';
  const priceLabelTxt = window.i18n ? window.i18n.t('shop_price_label', 'Tham khảo') : 'Tham khảo';

  return `
    <article class="book-card" aria-label="${title}">
      <a href="${reviewUrl}" class="card-cover-link" tabindex="-1" aria-hidden="true">
        <div class="book-cover-wrap">
          ${coverHtml}
          ${badgeHtml}
          <div class="cover-overlay">
            <span class="cover-overlay-text">${readReviewTxt} →</span>
          </div>
        </div>
      </a>
      <div class="book-info">
        <div class="book-stars" aria-label="${stars} stars">${starsHtml}</div>
        <h3 class="book-title">
          <a href="${reviewUrl}" class="title-link">${title}</a>
        </h3>
        ${subtitleZh ? `<p class="book-subtitle" lang="zh">${subtitleZh}</p>` : ''}
        <p class="book-desc">${desc}</p>
        ${tagsHtml ? `<div class="book-tags">${tagsHtml}</div>` : ''}
        <div class="book-footer">
          <div class="book-price-group">
            <span class="price-label">${priceLabelTxt}</span>
            <span class="price">${priceFormatted}</span>
          </div>
          <a href="${reviewUrl}" class="btn-review" aria-label="Review ${title}">
            ${readReviewTxt}
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
document.addEventListener('DOMContentLoaded', () => {
  loadBooks();
  
  window.addEventListener('langChanged', () => {
    loadBooks();
  });
});
