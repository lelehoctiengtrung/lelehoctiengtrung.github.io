// ==========================================================================
// Lê Lê Bookstore Dashboard — main.js
// Quản lý Tauri Dashboard, CRUD Forms, AI Triggers và Canvas Image Editor
// ==========================================================================

import './style.css';

// ──────────────── TRẠNG THÁI HỆ THỐNG ────────────────
let state = {
  activeTab: 'dashboard',    // 'dashboard' | 'config'
  activeSubtab: 'books',     // 'books' | 'reviews' | 'documents' | 'images'
  
  // Data Cache
  books: [],
  docs: [],
  
  // Selected Items for Editor
  selectedBookSku: null,
  selectedDocId: null,
  
  // Canvas Image Editor state
  imageState: {
    originalImage: null,
    rotation: 0,       // 0, 90, 180, 270
    flipH: false,
    brightness: 100,   // %
    contrast: 100,     // %
    saturation: 100,   // %
    grayscale: 0,      // %
    sepia: 0,          // %
  }
};

// ──────────────── ON LOAD ────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Load Config từ LocalStorage
  loadConfig();
  
  // Đăng ký sự kiện chuyển Tab chính
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const tabName = btn.getAttribute('data-tab');
      switchTab(tabName);
    });
  });
  
  // Đăng ký sự kiện chuyển Sub-tab sidebar
  document.querySelectorAll('.side-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const subtabName = btn.closest('.side-tab').getAttribute('data-subtab');
      switchSubtab(subtabName);
    });
  });

  // Đăng ký Form Config
  document.getElementById('form-config').addEventListener('submit', handleConfigSave);
  document.getElementById('btn-test-connection').addEventListener('click', testConnection);
  
  // Đăng ký các nút đồng bộ
  document.getElementById('btn-sync-now').addEventListener('click', () => syncData(true));
  
  // Đăng ký Form Editor Sách
  document.getElementById('form-book-editor').addEventListener('submit', handleBookSave);
  document.getElementById('btn-new-book').addEventListener('click', clearBookForm);
  
  // Đăng ký Form Editor Review Sách
  document.getElementById('form-review-editor').addEventListener('submit', handleReviewSave);
  document.getElementById('btn-ai-write-review').addEventListener('click', triggerAIReview);
  
  // Đăng ký Form Editor Tài liệu
  document.getElementById('form-doc-editor').addEventListener('submit', handleDocSave);
  document.getElementById('btn-new-doc').addEventListener('click', clearDocForm);
  document.getElementById('btn-ai-write-doc').addEventListener('click', triggerAIDocPost);
  
  // Đăng ký bộ lọc tìm kiếm
  document.getElementById('search-books').addEventListener('input', filterBooksList);
  document.getElementById('search-reviews').addEventListener('input', filterReviewsList);
  document.getElementById('search-docs').addEventListener('input', filterDocsList);

  // Khởi động Canvas Image Editor
  initImageEditor();
  
  // Tự động sync dữ liệu nếu đã có cấu hình URL
  const config = getConfig();
  if (config.url) {
    syncData(false);
  } else {
    // Chuyển sang Tab Config nếu chưa có URL cấu hình
    switchTab('config');
    showToast('Vui lòng cài đặt URL Apps Script Web App để bắt đầu!', 'error');
  }
});

// ──────────────── QUẢN LÝ TABS / VIEW NAVIGATION ────────────────
function switchTab(tabName) {
  state.activeTab = tabName;
  
  // Update class active nút bấm
  document.querySelectorAll('.nav-tab').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-tab') === tabName);
  });
  
  // Switch panels
  document.getElementById('panel-config').classList.toggle('hidden', tabName !== 'config');
  document.getElementById('panel-dashboard').classList.toggle('hidden', tabName !== 'dashboard');
}

function switchSubtab(subtabName) {
  state.activeSubtab = subtabName;
  
  // Update class active sidebar
  document.querySelectorAll('.side-tab').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-subtab') === subtabName);
  });
  
  // Switch workspace subtabs
  document.getElementById('subtab-books').classList.toggle('hidden', subtabName !== 'books');
  document.getElementById('subtab-reviews').classList.toggle('hidden', subtabName !== 'reviews');
  document.getElementById('subtab-documents').classList.toggle('hidden', subtabName !== 'documents');
  document.getElementById('subtab-images').classList.toggle('hidden', subtabName !== 'images');
  
  // Refresh canvas size and crop box if switched to Image Editor
  if (subtabName === 'images' && state.imageState.originalImage) {
    setTimeout(renderCanvas, 100);
  }
}

// ──────────────── QUẢN LÝ CẤU HÌNH (LOCAL STORAGE) ────────────────
function getConfig() {
  return {
    url: localStorage.getItem('lele_web_app_url') || '',
    sheetId: localStorage.getItem('lele_sheet_id') || '',
    folderId: localStorage.getItem('lele_root_folder_id') || ''
  };
}

function loadConfig() {
  const config = getConfig();
  document.getElementById('cfg-web-app-url').value = config.url;
  document.getElementById('cfg-sheet-id').value = config.sheetId;
  document.getElementById('cfg-root-folder-id').value = config.folderId;
}

function handleConfigSave(e) {
  e.preventDefault();
  const url = document.getElementById('cfg-web-app-url').value.trim();
  const sheetId = document.getElementById('cfg-sheet-id').value.trim();
  const folderId = document.getElementById('cfg-root-folder-id').value.trim();
  
  localStorage.setItem('lele_web_app_url', url);
  localStorage.setItem('lele_sheet_id', sheetId);
  localStorage.setItem('lele_root_folder_id', folderId);
  
  showToast('Đã lưu cấu hình kết nối!', 'success');
  switchTab('dashboard');
  syncData(true);
}

async function testConnection() {
  const urlInput = document.getElementById('cfg-web-app-url').value.trim();
  if (!urlInput) {
    showToast('Vui lòng nhập Web App URL trước!', 'error');
    return;
  }
  
  const statusBox = document.getElementById('config-status-box');
  const statusText = statusBox.querySelector('.status-text');
  
  statusBox.className = 'status-box checking';
  statusText.innerText = 'Đang kiểm tra kết nối tới Apps Script...';
  statusBox.classList.remove('hidden');
  
  try {
    const testUrl = `${urlInput}?action=get_data`;
    // Thêm timeout 12s để phòng trường hợp Script bị treo
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);
    
    const response = await fetch(testUrl, { 
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}`);
    }
    
    const data = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    
    statusBox.className = 'status-box success';
    statusText.innerText = 'Kết nối thành công! Đã lấy được dữ liệu từ Google Sheets.';
    showToast('Kiểm tra kết nối thành công!', 'success');
  } catch(err) {
    statusBox.className = 'status-box error';
    statusText.innerText = `Lỗi kết nối: ${err.message}. Hãy kiểm tra xem bạn đã Deploy Web App dạng "Anyone" chưa.`;
    showToast('Lỗi kết nối API!', 'error');
  }
}

// ──────────────── ĐỒNG BỘ DỮ LIỆU (GET DATA FROM SHEET) ────────────────
async function syncData(manual = false) {
  const config = getConfig();
  if (!config.url) return;
  
  showLoading('Đang tải dữ liệu từ Google Sheets...');
  
  // Spin icon
  const spinIcon = document.querySelector('#btn-sync-now .icon-spin');
  if (spinIcon) spinIcon.classList.remove('hidden');
  
  try {
    const syncUrl = `${config.url}?action=get_data`;
    const response = await fetch(syncUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const resData = await response.json();
    
    // Save to Cache
    state.books = resData.books || [];
    state.docs = resData.docs || [];
    
    // Lưu backup cache vào LocalStorage
    localStorage.setItem('lele_cached_books', JSON.stringify(state.books));
    localStorage.setItem('lele_cached_docs', JSON.stringify(state.docs));
    
    // Cập nhật giao diện lists
    renderBooksList(state.books);
    renderReviewsList(state.books);
    renderDocsList(state.docs);
    
    // Cập nhật dropdowns ở Image Editor
    updateEditorSkuDropdown();
    
    // Cập nhật thời gian đồng bộ
    const now = new Date();
    document.getElementById('lbl-last-sync').innerText = now.toLocaleTimeString();
    
    if (manual) showToast('Đồng bộ dữ liệu hoàn tất!', 'success');
  } catch(err) {
    console.error('Lỗi đồng bộ:', err);
    showToast(`Đồng bộ thất bại: ${err.message}. Đang dùng dữ liệu cache cũ.`, 'error');
    
    // Load cache fallback từ LocalStorage nếu có
    const cachedBooks = localStorage.getItem('lele_cached_books');
    const cachedDocs = localStorage.getItem('lele_cached_docs');
    
    if (cachedBooks) {
      state.books = JSON.parse(cachedBooks);
      renderBooksList(state.books);
      renderReviewsList(state.books);
    }
    if (cachedDocs) {
      state.docs = JSON.parse(cachedDocs);
      renderDocsList(state.docs);
    }
    
    updateEditorSkuDropdown();
  } finally {
    hideLoading();
    if (spinIcon) spinIcon.classList.add('hidden');
  }
}

// ──────────────── FORM EDIT: SÁCH & CỬA HÀNG ────────────────
function renderBooksList(booksData) {
  const listEl = document.getElementById('list-books');
  listEl.innerHTML = '';
  
  if (booksData.length === 0) {
    listEl.innerHTML = '<li class="loading-item">Không có sách nào.</li>';
    return;
  }
  
  booksData.forEach(bk => {
    const li = document.createElement('li');
    li.setAttribute('data-sku', bk.sku);
    li.className = state.selectedBookSku === bk.sku ? 'active' : '';
    
    li.innerHTML = `
      <div class="item-name">${bk.title || 'Sách chưa đặt tên'}</div>
      <div class="item-meta">
        <span class="item-meta-left">${bk.sku}</span>
        <span class="item-meta-right">${bk.price ? Number(bk.price).toLocaleString() + 'đ' : '0đ'}</span>
      </div>
    `;
    
    li.addEventListener('click', () => selectBook(bk.sku));
    listEl.appendChild(li);
  });
}

function selectBook(sku) {
  state.selectedBookSku = sku;
  
  // Highlight active item trong list
  document.querySelectorAll('#list-books li').forEach(li => {
    li.classList.toggle('active', li.getAttribute('data-sku') === sku);
  });
  
  const book = state.books.find(b => b.sku === sku);
  if (!book) return;
  
  // Điền vào form editor sách
  document.getElementById('bk-sku').value = book.sku || '';
  document.getElementById('bk-sku').readOnly = true; // Không cho sửa SKU chính của dòng
  document.getElementById('bk-title').value = book.title || '';
  document.getElementById('bk-subtitle_zh').value = book.subtitle_zh || '';
  document.getElementById('bk-desc').value = book.desc || '';
  document.getElementById('bk-tags').value = book.tags || '';
  document.getElementById('bk-price').value = book.price || '';
  document.getElementById('bk-stars').value = book.stars || '5';
  document.getElementById('bk-affiliate_url').value = book.affiliate_url || '';
  document.getElementById('bk-cover_url').value = book.cover_url || '';
  document.getElementById('bk-shop_images').value = book.shop_images || '';
  
  // Điền vào form review
  selectReview(sku);
}

function clearBookForm() {
  state.selectedBookSku = null;
  document.querySelectorAll('#list-books li').forEach(li => li.classList.remove('active'));
  
  const form = document.getElementById('form-book-editor');
  form.reset();
  document.getElementById('bk-sku').readOnly = false;
  document.getElementById('bk-sku').focus();
}

async function handleBookSave(e) {
  e.preventDefault();
  const config = getConfig();
  if (!config.url) {
    showToast('Cần cấu hình Web App URL trước!', 'error');
    return;
  }
  
  const sku = document.getElementById('bk-sku').value.trim();
  const title = document.getElementById('bk-title').value.trim();
  const subtitle_zh = document.getElementById('bk-subtitle_zh').value.trim();
  const desc = document.getElementById('bk-desc').value.trim();
  const tags = document.getElementById('bk-tags').value.trim();
  const price = Number(document.getElementById('bk-price').value);
  const stars = Number(document.getElementById('bk-stars').value);
  const affiliate_url = document.getElementById('bk-affiliate_url').value.trim();
  const cover_url = document.getElementById('bk-cover_url').value.trim();
  const shop_images = document.getElementById('bk-shop_images').value.trim();
  
  showLoading('Đang lưu thông tin sách lên Google Sheets...');
  
  try {
    const payload = {
      action: 'update_book',
      sku, title, subtitle_zh, desc, tags, price, stars, affiliate_url, cover_url, shop_images
    };
    
    const response = await fetch(config.url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    
    if (result.error) throw new Error(result.error);
    
    showToast('Đã cập nhật sách thành công!', 'success');
    // Refresh dữ liệu
    await syncData(false);
    selectBook(sku);
  } catch(err) {
    showToast(`Không lưu được: ${err.message}`, 'error');
  } finally {
    hideLoading();
  }
}

// ──────────────── FORM EDIT: REVIEW BÀI VIẾT (AI) ────────────────
function renderReviewsList(booksData) {
  const listEl = document.getElementById('list-reviews');
  listEl.innerHTML = '';
  
  if (booksData.length === 0) {
    listEl.innerHTML = '<li class="loading-item">Không có sách nào.</li>';
    return;
  }
  
  booksData.forEach(bk => {
    const li = document.createElement('li');
    li.setAttribute('data-sku', bk.sku);
    li.className = state.selectedBookSku === bk.sku ? 'active' : '';
    
    const hasReview = bk.review && bk.review.trim().length > 10;
    
    li.innerHTML = `
      <div class="item-name">${bk.title || 'Sách chưa đặt tên'}</div>
      <div class="item-meta">
        <span class="item-meta-left">${bk.sku}</span>
        <span class="item-meta-right" style="color: ${hasReview ? 'var(--clr-green)' : 'var(--clr-cream-muted)'}">
          ${hasReview ? 'Đã viết review ✅' : 'Chưa viết review 📝'}
        </span>
      </div>
    `;
    
    li.addEventListener('click', () => {
      state.selectedBookSku = bk.sku;
      // Đồng bộ highlight cả tab kia
      selectBook(bk.sku);
      selectReview(bk.sku);
    });
    listEl.appendChild(li);
  });
}

function selectReview(sku) {
  // Highlight trong list reviews
  document.querySelectorAll('#list-reviews li').forEach(li => {
    li.classList.toggle('active', li.getAttribute('data-sku') === sku);
  });
  
  const book = state.books.find(b => b.sku === sku);
  if (!book) return;
  
  document.getElementById('rv-sku').value = book.sku || '';
  document.getElementById('rv-title-display').value = `${book.title} (${book.sku})`;
  document.getElementById('rv-content').value = book.review || '';
  document.getElementById('rv-pros').value = book.pros || '';
  document.getElementById('rv-cons').value = book.cons || '';
  document.getElementById('rv-who_for').value = book.who_for || '';
  document.getElementById('rv-review_images').value = book.review_images || '';
}

async function handleReviewSave(e) {
  e.preventDefault();
  const config = getConfig();
  if (!config.url) {
    showToast('Cần cấu hình Web App URL trước!', 'error');
    return;
  }
  
  const sku = document.getElementById('rv-sku').value.trim();
  if (!sku) {
    showToast('Vui lòng chọn một cuốn sách để lưu review!', 'error');
    return;
  }
  
  const review = document.getElementById('rv-content').value.trim();
  const pros = document.getElementById('rv-pros').value.trim();
  const cons = document.getElementById('rv-cons').value.trim();
  const who_for = document.getElementById('rv-who_for').value.trim();
  const review_images = document.getElementById('rv-review_images').value.trim();
  
  showLoading('Đang lưu bài review lên Google Sheets...');
  
  try {
    const payload = {
      action: 'update_book',
      sku, review, pros, cons, who_for, review_images
    };
    
    const response = await fetch(config.url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    
    showToast('Đã cập nhật bài review thành công!', 'success');
    await syncData(false);
    selectBook(sku);
  } catch(err) {
    showToast(`Không lưu được: ${err.message}`, 'error');
  } finally {
    hideLoading();
  }
}

async function triggerAIReview() {
  const config = getConfig();
  const sku = document.getElementById('rv-sku').value.trim();
  if (!sku) {
    showToast('Hãy chọn cuốn sách cần viết review!', 'error');
    return;
  }
  
  showLoading('Lê Lê AI đang suy nghĩ và viết bài review (mất khoảng 10-20 giây)...');
  
  try {
    const response = await fetch(config.url, {
      method: 'POST',
      body: JSON.stringify({ action: 'generate_review', sku }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    
    const aiData = result.data;
    
    // Tự điền nội dung AI trả về vào Form
    document.getElementById('rv-content').value = aiData.review || '';
    document.getElementById('rv-pros').value = aiData.pros || '';
    document.getElementById('rv-cons').value = aiData.cons || '';
    document.getElementById('rv-who_for').value = aiData.who_for || '';
    
    showToast('Lê Lê AI đã viết bài review thành công!', 'success');
    
    // Tự động cập nhật sheet với thông tin review mới
    await syncData(false);
    selectBook(sku);
  } catch(err) {
    showToast(`Lỗi viết review AI: ${err.message}`, 'error');
  } finally {
    hideLoading();
  }
}

// ──────────────── FORM EDIT: TÀI LIỆU CHIA SẺ ────────────────
function renderDocsList(docsData) {
  const listEl = document.getElementById('list-docs');
  listEl.innerHTML = '';
  
  if (docsData.length === 0) {
    listEl.innerHTML = '<li class="loading-item">Không có tài liệu nào.</li>';
    return;
  }
  
  docsData.forEach(dc => {
    const li = document.createElement('li');
    li.setAttribute('data-id', dc.id);
    li.className = state.selectedDocId === dc.id ? 'active' : '';
    
    li.innerHTML = `
      <div class="item-name">${dc.icon || '📄'} ${dc.title || 'Tài liệu chưa đặt tên'}</div>
      <div class="item-meta">
        <span class="item-meta-left">${dc.id}</span>
        <span class="item-meta-right">${dc.category || 'other'}</span>
      </div>
    `;
    
    li.addEventListener('click', () => selectDoc(dc.id));
    listEl.appendChild(li);
  });
}

function selectDoc(id) {
  state.selectedDocId = id;
  
  document.querySelectorAll('#list-docs li').forEach(li => {
    li.classList.toggle('active', li.getAttribute('data-id') === id);
  });
  
  const doc = state.docs.find(d => d.id === id);
  if (!doc) return;
  
  document.getElementById('dc-id').value = doc.id || '';
  document.getElementById('dc-id').readOnly = true;
  document.getElementById('dc-title').value = doc.title || '';
  document.getElementById('dc-desc').value = doc.desc || '';
  document.getElementById('dc-category').value = doc.category || 'vocab';
  document.getElementById('dc-pages').value = doc.pages || '';
  document.getElementById('dc-level').value = doc.level || '2';
  document.getElementById('dc-level_text').value = doc.level_text || '';
  document.getElementById('dc-icon').value = doc.icon || '📝';
  document.getElementById('dc-icon_color').value = doc.icon_color || '#4ecba0';
  document.getElementById('dc-drive_url').value = doc.drive_url || '';
  document.getElementById('dc-content').value = doc.content || '';
  document.getElementById('dc-pros').value = doc.pros || '';
  document.getElementById('dc-cons').value = doc.cons || '';
  document.getElementById('dc-who_for').value = doc.who_for || '';
  document.getElementById('dc-preview_images').value = doc.preview_images || '';
  
  const folderUrl = doc.folder_url || '';
  document.getElementById('dc-folder_url').value = folderUrl;
  const openBtn = document.getElementById('btn-open-dc-folder');
  if (folderUrl) {
    openBtn.href = folderUrl;
    openBtn.classList.remove('disabled');
    openBtn.style.pointerEvents = 'auto';
    openBtn.style.opacity = '1';
  } else {
    openBtn.href = '#';
    openBtn.classList.add('disabled');
    openBtn.style.pointerEvents = 'none';
    openBtn.style.opacity = '0.5';
  }
}

function clearDocForm() {
  state.selectedDocId = null;
  document.querySelectorAll('#list-docs li').forEach(li => li.classList.remove('active'));
  
  const form = document.getElementById('form-doc-editor');
  form.reset();
  document.getElementById('dc-id').readOnly = false;
  document.getElementById('dc-id').focus();
  
  document.getElementById('dc-folder_url').value = '';
  const openBtn = document.getElementById('btn-open-dc-folder');
  openBtn.href = '#';
  openBtn.classList.add('disabled');
  openBtn.style.pointerEvents = 'none';
  openBtn.style.opacity = '0.5';
}

async function handleDocSave(e) {
  e.preventDefault();
  const config = getConfig();
  if (!config.url) {
    showToast('Cần cấu hình Web App URL trước!', 'error');
    return;
  }
  
  const id = document.getElementById('dc-id').value.trim();
  const title = document.getElementById('dc-title').value.trim();
  const desc = document.getElementById('dc-desc').value.trim();
  const category = document.getElementById('dc-category').value.trim();
  const pages = document.getElementById('dc-pages').value.trim();
  const level = Number(document.getElementById('dc-level').value);
  const level_text = document.getElementById('dc-level_text').value.trim();
  const icon = document.getElementById('dc-icon').value.trim();
  const icon_color = document.getElementById('dc-icon_color').value.trim();
  const drive_url = document.getElementById('dc-drive_url').value.trim();
  const content = document.getElementById('dc-content').value.trim();
  const pros = document.getElementById('dc-pros').value.trim();
  const cons = document.getElementById('dc-cons').value.trim();
  const who_for = document.getElementById('dc-who_for').value.trim();
  const preview_images = document.getElementById('dc-preview_images').value.trim();
  const folder_url = document.getElementById('dc-folder_url').value.trim();
  
  showLoading('Đang lưu thông tin tài liệu lên Google Sheets...');
  
  try {
    const payload = {
      action: 'update_doc',
      id, title, desc, category, pages, level, level_text, icon, icon_color, drive_url, content, pros, cons, who_for, preview_images, folder_url
    };
    
    const response = await fetch(config.url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    
    showToast('Đã lưu tài liệu thành công!', 'success');
    await syncData(false);
    selectDoc(id);
  } catch(err) {
    showToast(`Không lưu được: ${err.message}`, 'error');
  } finally {
    hideLoading();
  }
}

async function triggerAIDocPost() {
  const config = getConfig();
  const id = document.getElementById('dc-id').value.trim();
  if (!id) {
    showToast('Hãy chọn tài liệu cần tạo bài viết giới thiệu!', 'error');
    return;
  }
  
  showLoading('Lê Lê AI đang biên tập bài viết giới thiệu tài liệu (mất 10-20 giây)...');
  
  try {
    const response = await fetch(config.url, {
      method: 'POST',
      body: JSON.stringify({ action: 'generate_doc_post', id }),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    
    const aiData = result.data;
    
    // Tự điền nội dung AI trả về
    document.getElementById('dc-content').value = aiData.content || '';
    document.getElementById('dc-pros').value = aiData.pros || '';
    document.getElementById('dc-cons').value = aiData.cons || '';
    document.getElementById('dc-who_for').value = aiData.who_for || '';
    
    showToast('Lê Lê AI đã viết bài giới thiệu tài liệu thành công!', 'success');
    
    await syncData(false);
    selectDoc(id);
  } catch(err) {
    showToast(`Lỗi viết AI: ${err.message}`, 'error');
  } finally {
    hideLoading();
  }
}

// ──────────────── BỘ LỌC TÌM KIẾM CHO DANH SÁCH ────────────────
function filterBooksList(e) {
  const val = e.target.value.toLowerCase().trim();
  const filtered = state.books.filter(b => 
    (b.title || '').toLowerCase().includes(val) || 
    (b.sku || '').toLowerCase().includes(val)
  );
  renderBooksList(filtered);
}

function filterReviewsList(e) {
  const val = e.target.value.toLowerCase().trim();
  const filtered = state.books.filter(b => 
    (b.title || '').toLowerCase().includes(val) || 
    (b.sku || '').toLowerCase().includes(val)
  );
  renderReviewsList(filtered);
}

function filterDocsList(e) {
  const val = e.target.value.toLowerCase().trim();
  const filtered = state.docs.filter(d => 
    (d.title || '').toLowerCase().includes(val) || 
    (d.id || '').toLowerCase().includes(val)
  );
  renderDocsList(filtered);
}

// ──────────────── INTERACTIVE IMAGE WORKSPACE (CANVAS EDITOR) ────────────────
function initImageEditor() {
  const dropZone = document.getElementById('drop-zone');
  const fileInput = document.getElementById('file-input');
  
  // Click dropzone mở tệp
  dropZone.addEventListener('click', () => fileInput.click());
  
  // Drag & drop events
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.add('dragover');
    }, false);
  });
  
  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropZone.classList.remove('dragover');
    }, false);
  });
  
  dropZone.addEventListener('drop', (e) => {
    const dt = e.dataTransfer;
    const files = dt.files;
    if (files.length > 0) {
      loadImageFile(files[0]);
    }
  });
  
  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      loadImageFile(e.target.files[0]);
    }
  });
  
  // Aspect ratio lock checkbox
  document.getElementById('chk-aspect-lock').addEventListener('change', (e) => {
    const isLocked = e.target.checked;
    const hInput = document.getElementById('img-height');
    
    if (isLocked) {
      hInput.classList.add('readonly-input');
      hInput.readOnly = true;
    } else {
      hInput.classList.remove('readonly-input');
      hInput.readOnly = false;
    }
    
    if (state.imageState.originalImage) {
      initCropBox();
      updateOutputDimensions();
    }
  });
  
  // Resize width input listener
  document.getElementById('img-width').addEventListener('input', () => {
    if (state.imageState.originalImage) {
      updateOutputDimensions();
    }
  });
  
  // Reset Crop button
  document.getElementById('btn-reset-crop').addEventListener('click', () => {
    if (state.imageState.originalImage) initCropBox();
  });
  
  // Quick actions
  document.getElementById('btn-rotate-90').addEventListener('click', () => {
    if (!state.imageState.originalImage) return;
    state.imageState.rotation = (state.imageState.rotation + 90) % 360;
    renderCanvas();
  });
  
  document.getElementById('btn-flip-h').addEventListener('click', () => {
    if (!state.imageState.originalImage) return;
    state.imageState.flipH = !state.imageState.flipH;
    renderCanvas();
  });
  
  // Sliders listeners
  const sldBrightness = document.getElementById('sld-brightness');
  const sldContrast = document.getElementById('sld-contrast');
  const sldSaturation = document.getElementById('sld-saturation');
  
  sldBrightness.addEventListener('input', (e) => {
    state.imageState.brightness = e.target.value;
    document.getElementById('val-brightness').innerText = `${e.target.value}%`;
    renderCanvas();
  });
  sldContrast.addEventListener('input', (e) => {
    state.imageState.contrast = e.target.value;
    document.getElementById('val-contrast').innerText = `${e.target.value}%`;
    renderCanvas();
  });
  sldSaturation.addEventListener('input', (e) => {
    state.imageState.saturation = e.target.value;
    document.getElementById('val-saturation').innerText = `${e.target.value}%`;
    renderCanvas();
  });
  
  // Presets
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const preset = btn.getAttribute('data-preset');
      
      document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      resetSlidersToNormal();
      
      if (preset === 'grayscale') {
        state.imageState.grayscale = 100;
        state.imageState.contrast = 115;
      } else if (preset === 'warm') {
        state.imageState.sepia = 22;
        state.imageState.saturation = 110;
        state.imageState.brightness = 102;
      } else if (preset === 'cool') {
        state.imageState.saturation = 88;
        state.imageState.contrast = 98;
      }
      
      // Update UI sliders values
      document.getElementById('sld-brightness').value = state.imageState.brightness;
      document.getElementById('val-brightness').innerText = `${state.imageState.brightness}%`;
      
      document.getElementById('sld-contrast').value = state.imageState.contrast;
      document.getElementById('val-contrast').innerText = `${state.imageState.contrast}%`;
      
      document.getElementById('sld-saturation').value = state.imageState.saturation;
      document.getElementById('val-saturation').innerText = `${state.imageState.saturation}%`;
      
      renderCanvas();
    });
  });
  
  // Destination Dropdown Target switch
  document.getElementById('img-upload-target').addEventListener('change', () => {
    updateEditorSkuDropdown();
  });
  
  // Upload button
  document.getElementById('btn-upload-drive').addEventListener('click', uploadEditedImageToDrive);
  
  // CROP BOX DRAG & TOUCH LISTENERS
  setupCropBoxDrag();
}

function resetSlidersToNormal() {
  state.imageState.brightness = 100;
  state.imageState.contrast = 100;
  state.imageState.saturation = 100;
  state.imageState.grayscale = 0;
  state.imageState.sepia = 0;
}

function loadImageFile(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      state.imageState.originalImage = img;
      
      // Reset State
      state.imageState.rotation = 0;
      state.imageState.flipH = false;
      resetSlidersToNormal();
      
      // Reset sliders UI
      document.getElementById('sld-brightness').value = 100;
      document.getElementById('val-brightness').innerText = '100%';
      document.getElementById('sld-contrast').value = 100;
      document.getElementById('val-contrast').innerText = '100%';
      document.getElementById('sld-saturation').value = 100;
      document.getElementById('val-saturation').innerText = '100%';
      document.querySelectorAll('.preset-btn').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-preset') === 'normal');
      });
      
      // Show Canvas
      document.getElementById('drop-zone').classList.add('hidden');
      document.getElementById('canvas-container').classList.remove('hidden');
      document.getElementById('btn-upload-drive').disabled = false;
      
      renderCanvas();
      updateOutputDimensions();
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function getFilterString() {
  const s = state.imageState;
  return `brightness(${s.brightness}%) contrast(${s.contrast}%) saturate(${s.saturation}%) grayscale(${s.grayscale}%) sepia(${s.sepia}%)`;
}

function renderCanvas() {
  const img = state.imageState.originalImage;
  if (!img) return;
  
  const canvas = document.getElementById('editor-canvas');
  const ctx = canvas.getContext('2d');
  
  ctx.filter = 'none';
  
  const isRotated = (state.imageState.rotation % 180 !== 0);
  const w = isRotated ? img.height : img.width;
  const h = isRotated ? img.width : img.height;
  
  canvas.width = w;
  canvas.height = h;
  
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((state.imageState.rotation * Math.PI) / 180);
  
  if (state.imageState.flipH) {
    ctx.scale(-1, 1);
  }
  
  ctx.filter = getFilterString();
  ctx.drawImage(img, -img.width / 2, -img.height / 2);
  ctx.restore();
  
  // Set position for crop box container overlay
  initCropBox();
}

function initCropBox() {
  const canvas = document.getElementById('editor-canvas');
  const cropBox = document.getElementById('crop-box');
  const container = document.getElementById('canvas-container');
  
  if (!canvas.clientWidth) {
    setTimeout(initCropBox, 50);
    return;
  }
  
  container.style.width = `${canvas.clientWidth}px`;
  container.style.height = `${canvas.clientHeight}px`;
  
  const aspectLocked = document.getElementById('chk-aspect-lock').checked;
  let boxW, boxH;
  
  if (aspectLocked) {
    if (canvas.clientHeight > canvas.clientWidth * 1.5) {
      boxW = canvas.clientWidth * 0.8;
      boxH = boxW * 1.5;
    } else {
      boxH = canvas.clientHeight * 0.8;
      boxW = boxH / 1.5;
    }
  } else {
    boxW = canvas.clientWidth * 0.8;
    boxH = canvas.clientHeight * 0.8;
  }
  
  const boxL = (canvas.clientWidth - boxW) / 2;
  const boxT = (canvas.clientHeight - boxH) / 2;
  
  cropBox.style.width = `${boxW}px`;
  cropBox.style.height = `${boxH}px`;
  cropBox.style.left = `${boxL}px`;
  cropBox.style.top = `${boxT}px`;
  cropBox.classList.remove('hidden');
}

function updateOutputDimensions() {
  const widthInput = document.getElementById('img-width');
  const heightInput = document.getElementById('img-height');
  const aspectLocked = document.getElementById('chk-aspect-lock').checked;
  const cropBox = document.getElementById('crop-box');
  
  const w = parseInt(widthInput.value) || 600;
  
  if (aspectLocked) {
    heightInput.value = Math.round(w * 1.5);
  } else {
    if (cropBox && cropBox.offsetWidth) {
      const ratio = cropBox.offsetHeight / cropBox.offsetWidth;
      heightInput.value = Math.round(w * ratio);
    } else {
      heightInput.value = w;
    }
  }
}

function updateEditorSkuDropdown() {
  const targetType = document.getElementById('img-upload-target').value;
  const skuSelect = document.getElementById('img-upload-sku');
  skuSelect.innerHTML = '';
  
  if (targetType.startsWith('book-')) {
    // Điền SKUs của sách
    if (state.books.length === 0) {
      skuSelect.innerHTML = '<option value="">(Không có sách)</option>';
      return;
    }
    state.books.forEach(b => {
      const opt = document.createElement('option');
      opt.value = b.sku;
      opt.innerText = `${b.sku} - ${b.title || ''}`;
      // Tự chọn active item hiện tại nếu có
      if (b.sku === state.selectedBookSku) opt.selected = true;
      skuSelect.appendChild(opt);
    });
  } else {
    // Điền IDs tài liệu
    if (state.docs.length === 0) {
      skuSelect.innerHTML = '<option value="">(Không có tài liệu)</option>';
      return;
    }
    state.docs.forEach(d => {
      const opt = document.createElement('option');
      opt.value = d.id;
      opt.innerText = `${d.id} - ${d.title || ''}`;
      if (d.id === state.selectedDocId) opt.selected = true;
      skuSelect.appendChild(opt);
    });
  }
}

// ──────────────── CROP BOX MOUSE/TOUCH DRAGGING ────────────────
function setupCropBoxDrag() {
  const cropBox = document.getElementById('crop-box');
  const container = document.getElementById('canvas-container');
  
  let isDragging = false;
  let isResizing = false;
  let activeHandle = null;
  
  let startX, startY;
  let startLeft, startTop, startWidth, startHeight;
  
  function onStart(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    if (e.target.classList.contains('crop-handle')) {
      isResizing = true;
      activeHandle = e.target;
    } else {
      isDragging = true;
    }
    
    startX = clientX;
    startY = clientY;
    
    const rect = cropBox.getBoundingClientRect();
    const parentRect = container.getBoundingClientRect();
    
    startLeft = rect.left - parentRect.left;
    startTop = rect.top - parentRect.top;
    startWidth = rect.width;
    startHeight = rect.height;
    
    // Ngăn chặn cuộn trang trên mobile khi drag
    if (e.cancelable) e.preventDefault();
  }
  
  function onMove(e) {
    if (!isDragging && !isResizing) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    const dx = clientX - startX;
    const dy = clientY - startY;
    
    const parentRect = container.getBoundingClientRect();
    const pW = parentRect.width;
    const pH = parentRect.height;
    
    if (isDragging) {
      let newLeft = startLeft + dx;
      let newTop = startTop + dy;
      
      if (newLeft < 0) newLeft = 0;
      if (newTop < 0) newTop = 0;
      if (newLeft + startWidth > pW) newLeft = pW - startWidth;
      if (newTop + startHeight > pH) newTop = pH - startHeight;
      
      cropBox.style.left = `${newLeft}px`;
      cropBox.style.top = `${newTop}px`;
    } else if (isResizing) {
      let newW = startWidth;
      let newH = startHeight;
      let newLeft = startLeft;
      let newTop = startTop;
      
      const aspectLocked = document.getElementById('chk-aspect-lock').checked;
      
      if (activeHandle.classList.contains('handle-se')) {
        newW = startWidth + dx;
        if (aspectLocked) newH = newW * 1.5;
        else newH = startHeight + dy;
      } else if (activeHandle.classList.contains('handle-sw')) {
        newW = startWidth - dx;
        newLeft = startLeft + dx;
        if (aspectLocked) newH = newW * 1.5;
        else newH = startHeight + dy;
      } else if (activeHandle.classList.contains('handle-ne')) {
        newW = startWidth + dx;
        if (aspectLocked) {
          newH = newW * 1.5;
          newTop = startTop - (newH - startHeight);
        } else {
          newH = startHeight - dy;
          newTop = startTop + dy;
        }
      } else if (activeHandle.classList.contains('handle-nw')) {
        newW = startWidth - dx;
        newLeft = startLeft + dx;
        if (aspectLocked) {
          newH = newW * 1.5;
          newTop = startTop - (newH - startHeight);
        } else {
          newH = startHeight - dy;
          newTop = startTop + dy;
        }
      }
      
      // Min Constraints
      const minS = 40;
      if (newW < minS) {
        newW = minS;
        if (aspectLocked) newH = minS * 1.5;
      }
      
      // Boundary constraints
      if (newLeft < 0) {
        newLeft = 0;
        newW = startWidth + startLeft;
        if (aspectLocked) newH = newW * 1.5;
      }
      if (newTop < 0) {
        newTop = 0;
        newH = startHeight + startTop;
        if (aspectLocked) newW = newH / 1.5;
      }
      if (newLeft + newW > pW) {
        newW = pW - newLeft;
        if (aspectLocked) newH = newW * 1.5;
      }
      if (newTop + newH > pH) {
        newH = pH - newTop;
        if (aspectLocked) newW = newH / 1.5;
      }
      
      cropBox.style.width = `${newW}px`;
      cropBox.style.height = `${newH}px`;
      cropBox.style.left = `${newLeft}px`;
      cropBox.style.top = `${newTop}px`;
      
      updateOutputDimensions();
    }
  }
  
  function onEnd() {
    isDragging = false;
    isResizing = false;
    activeHandle = null;
  }
  
  // Mouse
  cropBox.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);
  
  // Touch (Mobile)
  cropBox.addEventListener('touchstart', onStart, { passive: false });
  window.addEventListener('touchmove', onMove, { passive: false });
  window.addEventListener('touchend', onEnd);
}

// ──────────────── UPLOAD CROPPED FILTERED IMAGE TO DRIVE ────────────────
async function uploadEditedImageToDrive() {
  const config = getConfig();
  if (!config.url) {
    showToast('Cần cấu hình Web App URL trước!', 'error');
    return;
  }
  
  const uploadTarget = document.getElementById('img-upload-target').value; // 'book-shop' | 'book-review' | 'doc-preview'
  const targetSku = document.getElementById('img-upload-sku').value;
  
  if (!targetSku) {
    showToast('Hãy chọn SKU hoặc ID mục tiêu!', 'error');
    return;
  }
  
  showLoading('Đang xử lý ảnh, cắt cúp và tải lên Google Drive (mất 5-15 giây)...');
  
  try {
    const canvas = document.getElementById('editor-canvas');
    const cropBox = document.getElementById('crop-box');
    const widthInput = document.getElementById('img-width');
    const heightInput = document.getElementById('img-height');
    
    const targetW = parseInt(widthInput.value) || 600;
    const targetH = parseInt(heightInput.value) || 900;
    
    // Tạo offscreen canvas
    const offscreen = document.createElement('canvas');
    offscreen.width = targetW;
    offscreen.height = targetH;
    const oCtx = offscreen.getContext('2d');
    
    // Tỉ lệ quy đổi từ màn hình hiển thị element sang toạ độ thật của Canvas
    const scaleX = canvas.width / canvas.clientWidth;
    const scaleY = canvas.height / canvas.clientHeight;
    
    const cropX = parseFloat(cropBox.style.left) * scaleX;
    const cropY = parseFloat(cropBox.style.top) * scaleY;
    const cropW = parseFloat(cropBox.style.width) * scaleX;
    const cropH = parseFloat(cropBox.style.height) * scaleY;
    
    // Vẽ phần đã cắt cúp từ Canvas chính (đã được áp bộ lọc) sang offscreen canvas
    oCtx.drawImage(canvas, cropX, cropY, cropW, cropH, 0, 0, targetW, targetH);
    
    // Xuất ra Base64
    const base64Data = offscreen.toDataURL('image/png');
    
    // Xác định subfolder type
    let subfolderType = 'shop';
    if (uploadTarget === 'book-review') subfolderType = 'review';
    if (uploadTarget === 'doc-preview') subfolderType = 'preview';
    
    const payload = {
      action: 'upload_image',
      sku: targetSku,
      type: subfolderType,
      fileName: `${targetSku}_${Date.now()}.png`,
      base64Data: base64Data
    };
    
    const response = await fetch(config.url, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    
    showToast('Tải ảnh lên Drive thành công và đã tự động sync vào Google Sheet!', 'success');
    
    const viewUrl = result.url; // Đường link ảnh trực tiếp
    
    // Tự động điền link ảnh vào đúng form đang mở nếu trùng SKU/ID
    if (uploadTarget === 'book-shop' && state.selectedBookSku === targetSku) {
      const shopImgInput = document.getElementById('bk-shop_images');
      const val = shopImgInput.value.trim();
      shopImgInput.value = val ? `${val}, ${viewUrl}` : viewUrl;
      
      const coverInput = document.getElementById('bk-cover_url');
      if (!coverInput.value.trim()) coverInput.value = viewUrl;
    } else if (uploadTarget === 'book-review' && state.selectedBookSku === targetSku) {
      const reviewImgInput = document.getElementById('rv-review_images');
      const val = reviewImgInput.value.trim();
      reviewImgInput.value = val ? `${val}, ${viewUrl}` : viewUrl;
    } else if (uploadTarget === 'doc-preview' && state.selectedDocId === targetSku) {
      const docPreviewInput = document.getElementById('dc-preview_images');
      const val = docPreviewInput.value.trim();
      docPreviewInput.value = val ? `${val}, ${viewUrl}` : viewUrl;
    }
    
    // Đồng bộ lại dữ liệu Sheets về local
    await syncData(false);
    
    // Reset Image Editor Dropzone để làm cái khác
    document.getElementById('canvas-container').classList.add('hidden');
    document.getElementById('drop-zone').classList.remove('hidden');
    document.getElementById('btn-upload-drive').disabled = true;
    state.imageState.originalImage = null;
    
  } catch(err) {
    showToast(`Lỗi tải ảnh: ${err.message}`, 'error');
  } finally {
    hideLoading();
  }
}

// ──────────────── TOAST & LOADING NOTIFICATIONS ────────────────
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  
  toast.className = `toast ${type}`;
  toastMessage.innerText = message;
  
  toast.classList.add('show');
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

function showLoading(message) {
  const overlay = document.getElementById('global-loading');
  document.getElementById('loading-message').innerText = message;
  overlay.classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('global-loading').classList.add('hidden');
}
