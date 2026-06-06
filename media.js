// ============================================================
// media.js — Video Lessons Page Logic
// Predefined local video database, inline player & pagination
// ============================================================

const SHEET_ID   = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o';
const SHEET_NAME = 'media';
const PAGE_SIZE = 8; // Số lượng video trên mỗi trang (2 hàng, mỗi hàng 4 video trên desktop)

// ---- Predefined Video Database (Offline & Instant Load) ----
const ALL_VIDEOS = [
  // 1. Lê Lê kể chữ
  {
    id: 'VID-001',
    title: '"Hảo" (好)',
    youtube_url: 'https://www.youtube.com/watch?v=Fj79PruA8j8',
    category: 'Lê Lê kể chữ',
    desc: 'Giải thích nguồn gốc thú vị của chữ Hảo - ghép từ bộ Nữ và bộ Tử.',
    order: 1
  },
  {
    id: 'VID-002',
    title: '"An" (安)',
    youtube_url: 'https://www.youtube.com/watch?v=Vz52s5wXhR4',
    category: 'Lê Lê kể chữ',
    desc: 'Người phụ nữ dưới mái nhà mang lại sự bình an, yên ổn.',
    order: 2
  },
  {
    id: 'VID-003',
    title: '"Nhân" (人)',
    youtube_url: 'https://www.youtube.com/watch?v=L9PmxmF5-D4',
    category: 'Lê Lê kể chữ',
    desc: 'Hình ảnh con người đang đứng và đi lại vững vàng.',
    order: 3
  },
  {
    id: 'VID-004',
    title: '"Tâm" (心)',
    youtube_url: 'https://www.youtube.com/watch?v=H2ZJ26gT7uE',
    category: 'Lê Lê kể chữ',
    desc: 'Hình tượng trái tim và tâm tư tình cảm của con người.',
    order: 4
  },
  {
    id: 'VID-005',
    title: '"Mộc" (木)',
    youtube_url: 'https://www.youtube.com/watch?v=d6y6wR43Xm8',
    category: 'Lê Lê kể chữ',
    desc: 'Hình ảnh cây xanh dang rộng cành lá biểu thị cho gỗ/cây.',
    order: 5
  },

  // 2. Tiếng lóng
  {
    id: 'VID-006',
    title: '"Luộc rau" (Luộc rau)',
    youtube_url: 'https://www.youtube.com/watch?v=kLQ1e0Jb-1M',
    category: 'Tiếng lóng',
    desc: 'Giải thích cụm từ lóng thông dụng trên mạng xã hội Trung Quốc.',
    order: 1
  },
  {
    id: 'VID-007',
    title: '"Thả thính" (撩妹)',
    youtube_url: 'https://www.youtube.com/watch?v=pM9mY3c7aM0',
    category: 'Tiếng lóng',
    desc: 'Cách nói ví von cực kỳ hài hước bằng tiếng Trung.',
    order: 2
  },
  {
    id: 'VID-008',
    title: '"Ăn dưa" (吃瓜)',
    youtube_url: 'https://www.youtube.com/watch?v=oXvXmCypNmg',
    category: 'Tiếng lóng',
    desc: 'Giải thích trào lưu ăn dưa, hóng hớt tin tức trên mạng.',
    order: 3
  },
  {
    id: 'VID-009',
    title: '"Nằm phẳng" (躺平)',
    youtube_url: 'https://www.youtube.com/watch?v=gUuVqN-Uj9k',
    category: 'Tiếng lóng',
    desc: 'Phong cách sống tối giản và từ bỏ áp lực của giới trẻ.',
    order: 4
  },
  {
    id: 'VID-010',
    title: '"Chua rồi" (酸 liao)',
    youtube_url: 'https://www.youtube.com/watch?v=T2aWbKjY1Qk',
    category: 'Tiếng lóng',
    desc: 'Cách nói thể hiện sự ghen tị một cách đáng yêu.',
    order: 5
  },

  // 3. Song đấu từ vựng
  {
    id: 'VID-011',
    title: '"二" vs "两"',
    youtube_url: 'https://www.youtube.com/watch?v=Xn5vOa08y5k',
    category: 'Song đấu từ vựng',
    desc: 'Khi nào dùng nhị, khi nào dùng lưỡng để đếm số lượng.',
    order: 1
  },
  {
    id: 'VID-012',
    title: '"一点儿" vs "有点儿"',
    youtube_url: 'https://www.youtube.com/watch?v=1H-cK5L3XwQ',
    category: 'Song đấu từ vựng',
    desc: 'Cách dùng hai cụm từ chỉ mức độ ít dễ nhầm lẫn.',
    order: 2
  },
  {
    id: 'VID-013',
    title: '"能" vs "会"',
    youtube_url: 'https://www.youtube.com/watch?v=Xg9H5l3K2yE',
    category: 'Song đấu từ vựng',
    desc: 'So sánh khả năng tự nhiên và khả năng học được.',
    order: 3
  },
  {
    id: 'VID-014',
    title: '"还是" vs "或者"',
    youtube_url: 'https://www.youtube.com/watch?v=J2L2xP5W4mE',
    category: 'Song đấu từ vựng',
    desc: 'Sự khác nhau giữa từ hay là trong câu hỏi và câu trần thuật.',
    order: 4
  },

  // 4. Tiếng Trung thực chiến
  {
    id: 'VID-015',
    title: '"Đi mua sắm" (买东西)',
    youtube_url: 'https://www.youtube.com/watch?v=A5K2l1X3yQw',
    category: 'Tiếng Trung thực chiến',
    desc: 'Những mẫu câu đàm thoại đàm phán trả giá thực tế.',
    order: 1
  },
  {
    id: 'VID-016',
    title: '"Gọi món ăn" (点菜)',
    youtube_url: 'https://www.youtube.com/watch?v=H3H5l2X9wEm',
    category: 'Tiếng Trung thực chiến',
    desc: 'Từ vựng và mẫu câu giao tiếp khi đi ăn tiệm thực tế.',
    order: 2
  },
  {
    id: 'VID-017',
    title: '"Hỏi chỉ đường" (问路)',
    youtube_url: 'https://www.youtube.com/watch?v=K8K2p1W4mQy',
    category: 'Tiếng Trung thực chiến',
    desc: 'Các hướng đi và cách hỏi đường thông dụng.',
    order: 3
  },
  {
    id: 'VID-018',
    title: '"Tại sân bay" (在机场)',
    youtube_url: 'https://www.youtube.com/watch?v=M3L9wP2X4mE',
    category: 'Tiếng Trung thực chiến',
    desc: 'Các thủ tục và mẫu câu cần thiết khi đi máy bay.',
    order: 4
  },

  // 5. Thành ngữ
  {
    id: 'VID-019',
    title: '"Mã đáo thành công" (马到成功)',
    youtube_url: 'https://www.youtube.com/watch?v=J1K9l3X4wEm',
    category: 'Thành ngữ',
    desc: 'Ý nghĩa và nguồn gốc của lời chúc thành công.',
    order: 1
  },
  {
    id: 'VID-020',
    title: '"Vạn sự như ý" (万事如意)',
    youtube_url: 'https://www.youtube.com/watch?v=K2H9wP4mQyE',
    category: 'Thành ngữ',
    desc: 'Thành ngữ chúc tết và chúc mừng năm mới quen thuộc.',
    order: 2
  },
  {
    id: 'VID-021',
    title: '"Một vốn bốn lời" (一本万利)',
    youtube_url: 'https://www.youtube.com/watch?v=N3L2k5P4wEm',
    category: 'Thành ngữ',
    desc: 'Giải thích thành ngữ trong kinh doanh buôn bán.',
    order: 3
  },
  {
    id: 'VID-022',
    title: '"Hữu duyên thiên lý" (有缘千里)',
    youtube_url: 'https://www.youtube.com/watch?v=O8K9wL3P2yE',
    category: 'Thành ngữ',
    desc: 'Duyên số gặp gỡ dù ở khoảng cách xa xôi.',
    order: 4
  }
];

const CATEGORIES = ['Lê Lê kể chữ', 'Tiếng lóng', 'Song đấu từ vựng', 'Tiếng Trung thực chiến', 'Thành ngữ'];
const thumbCache = {}; // Cache loaded thumbnails

let currentCategory = CATEGORIES[0];
let currentPage = 1;
let activePlayingCard = null; // Store currently playing inline card

// --- Init ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupTabs();
  renderGrid();
  loadVideosFromSheet(); // Sync from Sheet in background

  window.addEventListener('langChanged', () => {
    setupTabs();
    renderGrid();
  });
});

// --- Fetch from Google Sheets dynamically ──────────────────
async function loadVideosFromSheet() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&headers=2`;
    const res = await fetch(url);
    const raw = await res.text();

    const match = raw.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if (!match) throw new Error('Invalid response format');
    const data = JSON.parse(match[1]);

    const rows = data.table.rows;
    if (!rows || rows.length === 0) return;

    const cols = data.table.cols || [];
    const colMap = { id: 0, title: 1, youtube_url: 2, category: 3, desc: 4, order: 5 };

    cols.forEach((col, index) => {
      const label = (col.label || '').toLowerCase();
      if (label.includes('id')) colMap.id = index;
      else if (label.includes('title') || label.includes('tiêu đề')) colMap.title = index;
      else if (label.includes('youtube') || label.includes('đường dẫn')) colMap.youtube_url = index;
      else if (label.includes('category') || label.includes('chủ đề')) colMap.category = index;
      else if (label.includes('desc') || label.includes('mô tả')) colMap.desc = index;
      else if (label.includes('order') || label.includes('thứ tự')) colMap.order = index;
    });

    const sheetVideos = rows.map((r, rowIndex) => {
      const getVal = (colIdx, fallbackVal = '') => {
        if (colIdx === undefined || colIdx < 0 || !r.c) return fallbackVal;
        const cell = r.c[colIdx];
        const val = (cell && cell.v != null) ? String(cell.v).trim() : '';
        return val || fallbackVal;
      };

      const title = getVal(colMap.title);
      if (!title) return null;

      const id = getVal(colMap.id, `VID-ROW-${rowIndex}`);
      const youtube_url = getVal(colMap.youtube_url);
      const category = getVal(colMap.category, 'Tiếng Trung thực chiến');
      const desc = getVal(colMap.desc);
      const order = parseInt(getVal(colMap.order, String(rowIndex))) || rowIndex;

      return { id, title, youtube_url, category, desc, order };
    }).filter(Boolean);

    if (sheetVideos.length > 0) {
      ALL_VIDEOS.length = 0;
      ALL_VIDEOS.push(...sheetVideos);
      
      const categoriesPresent = [...new Set(ALL_VIDEOS.map(v => v.category))];
      if (!categoriesPresent.includes(currentCategory) && categoriesPresent.length > 0) {
        currentCategory = categoriesPresent[0];
      }
      
      setupTabs();
      renderGrid();
    }
  } catch (err) {
    console.warn('Could not sync latest videos from Google Sheets, using offline video database.', err);
  }
}

// --- Helper to extract YouTube ID ────────────────────────
function getYouTubeId(url) {
  if (!url) return '';
  url = url.trim();
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return match[2];
  }
  const shortsReg = /\/shorts\/([a-zA-Z0-9_-]{11})/;
  const shortsMatch = url.match(shortsReg);
  if (shortsMatch && shortsMatch[1]) {
    return shortsMatch[1];
  }
  if (url.length === 11) {
    return url;
  }
  return '';
}

// --- High-resolution Thumbnail Loader Script ──────────────
function getYouTubeThumbnail(videoId) {
  if (thumbCache[videoId]) {
    return Promise.resolve(thumbCache[videoId]);
  }
  return new Promise((resolve) => {
    const maxres = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    const hq = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    const img = new Image();
    img.onload = () => {
      // YouTube returns a 120x90 image if maxresdefault doesn't exist
      if (img.width === 120 && img.height === 90) {
        thumbCache[videoId] = hq;
        resolve(hq);
      } else {
        thumbCache[videoId] = maxres;
        resolve(maxres);
      }
    };
    img.onerror = () => {
      thumbCache[videoId] = hq;
      resolve(hq);
    };
    img.src = maxres;
  });
}

// --- Setup category tabs ──────────────────────────
function setupTabs() {
  const tabsContainer = document.getElementById('media-tabs');
  const loading = document.getElementById('media-loading');
  if (loading) loading.classList.add('hidden');
  if (!tabsContainer) return;

  tabsContainer.innerHTML = '';

  CATEGORIES.forEach(cat => {
    const count = ALL_VIDEOS.filter(v => v.category === cat).length;
    const tab = document.createElement('button');
    tab.className = `filter-tab ${currentCategory === cat ? 'active' : ''}`;
    tab.dataset.filter = cat;
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', currentCategory === cat ? 'true' : 'false');
    tab.innerHTML = `${cat} <span class="tab-count">${count}</span>`;
    
    tab.addEventListener('click', () => {
      if (currentCategory === cat) return;
      currentCategory = cat;
      currentPage = 1;
      
      // Update tab UI state
      tabsContainer.querySelectorAll('.filter-tab').forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      renderGrid();
    });

    tabsContainer.appendChild(tab);
  });
}

// --- Render Video Grid & Pagination ───────────────────────
async function renderGrid() {
  const grid = document.getElementById('media-grid');
  const emptyState = document.getElementById('media-empty');
  if (!grid) return;

  grid.innerHTML = '';
  activePlayingCard = null; // Reset playing card state

  const filtered = ALL_VIDEOS.filter(v => v.category === currentCategory);

  if (filtered.length === 0) {
    grid.classList.add('hidden');
    renderPagination(0);
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');
  grid.classList.remove('hidden');

  // Sort by order ascending
  filtered.sort((a, b) => a.order - b.order);

  // Pagination bounds
  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / PAGE_SIZE);
  if (currentPage < 1) currentPage = 1;
  if (currentPage > totalPages) currentPage = totalPages;

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalItems);
  const pageItems = filtered.slice(startIndex, endIndex);

  // Render cards
  for (const video of pageItems) {
    const youtubeId = getYouTubeId(video.youtube_url);
    const card = document.createElement('div');
    card.className = 'video-card';
    card.id = `video-card-${video.id}`;

    const thumbWrapId = `thumb-wrap-${video.id}`;
    card.innerHTML = `
      <div class="video-thumb-wrap" id="${thumbWrapId}">
        <div style="position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; background: #0d0d11;">
          <div class="spinner" style="width: 24px; height: 24px; border-width: 2px;"></div>
        </div>
      </div>
      <div class="video-info">
        <h3 class="video-card-title">${video.title}</h3>
      </div>
    `;

    grid.appendChild(card);

    // Asynchronously fetch high-res thumbnail
    getYouTubeThumbnail(youtubeId).then(thumbUrl => {
      const thumbWrap = document.getElementById(thumbWrapId);
      if (!thumbWrap) return;

      thumbWrap.innerHTML = `
        <img src="${thumbUrl}" alt="${video.title}" loading="lazy" />
        <div class="video-play-overlay">
          <div class="play-btn-circle" aria-label="Phát video">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      `;

      // Inline playing trigger
      thumbWrap.addEventListener('click', (e) => {
        e.stopPropagation();
        playVideoInline(video, youtubeId, card, thumbWrap);
      });
    });
  }

  renderPagination(totalPages);
}

// --- Play video inline in-place ───────────────────────────
function playVideoInline(video, youtubeId, card, thumbWrap) {
  if (activePlayingCard && activePlayingCard !== card) {
    restoreCardToThumbnail(activePlayingCard);
  }

  activePlayingCard = card;
  card.classList.add('is-playing');

  thumbWrap.innerHTML = `
    <iframe src="https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0" 
      frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
      allowfullscreen>
    </iframe>
  `;
}

// --- Restore previously playing card back to static thumbnail ────
function restoreCardToThumbnail(card) {
  if (!card) return;
  card.classList.remove('is-playing');

  const videoId = card.id.replace('video-card-', '');
  const video = ALL_VIDEOS.find(v => v.id === videoId);
  if (!video) return;

  const youtubeId = getYouTubeId(video.youtube_url);
  const thumbWrapId = `thumb-wrap-${video.id}`;
  const thumbWrap = document.getElementById(thumbWrapId);
  if (!thumbWrap) return;

  const cachedThumb = thumbCache[youtubeId] || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

  thumbWrap.innerHTML = `
    <img src="${cachedThumb}" alt="${video.title}" loading="lazy" />
    <div class="video-play-overlay">
      <div class="play-btn-circle" aria-label="Phát video">
        <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
      </div>
    </div>
  `;

  // Re-attach play inline click handler
  thumbWrap.addEventListener('click', (e) => {
    e.stopPropagation();
    playVideoInline(video, youtubeId, card, thumbWrap);
  });
}

// --- Render pagination buttons ────────────────────────────
function renderPagination(totalPages) {
  const pagination = document.getElementById('media-pagination');
  if (!pagination) return;

  if (totalPages <= 1) {
    pagination.classList.add('hidden');
    return;
  }

  pagination.classList.remove('hidden');
  pagination.innerHTML = '';

  // Prev Button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn page-btn-text';
  prevBtn.disabled = currentPage === 1;
  prevBtn.innerHTML = '←';
  prevBtn.addEventListener('click', () => {
    currentPage--;
    renderGrid();
    scrollToTop();
  });
  pagination.appendChild(prevBtn);

  // Page Numbers
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${currentPage === i ? 'active' : ''}`;
    pageBtn.textContent = i;
    pageBtn.addEventListener('click', () => {
      currentPage = i;
      renderGrid();
      scrollToTop();
    });
    pagination.appendChild(pageBtn);
  }

  // Next Button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn page-btn-text';
  nextBtn.disabled = currentPage === totalPages;
  nextBtn.innerHTML = '→';
  nextBtn.addEventListener('click', () => {
    currentPage++;
    renderGrid();
    scrollToTop();
  });
  pagination.appendChild(nextBtn);
}

// --- Scroll mượt về vị trí menu tabs khi chuyển trang ──────
function scrollToTop() {
  const tabs = document.getElementById('media-tabs');
  if (tabs) {
    tabs.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
