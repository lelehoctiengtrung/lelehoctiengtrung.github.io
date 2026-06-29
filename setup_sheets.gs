// ================================================================
// LÊ LÊ BOOKSTORE — Google Apps Script v4.0
// Multi-provider AI: Google AI Studio + Custom Endpoints
// Support: Web App JSON API (doPost/doGet) cho Tauri Desktop
// Auto rotation giữa tất cả providers khi bị rate limit
// ================================================================

// ================================================================
// ⚙️ CẤU HÌNH — SỬA TẠI ĐÂY
// ================================================================

// ── Google AI Studio Keys ────────────────────────────────────
// Lấy miễn phí tại: aistudio.google.com/app/apikey
var GEMINI_KEYS = [
  'AIzaSyDfwgKYCglZqtXrMVIXYJve2HXpA2Le8Ng',
  'AIzaSyAL_pzcIxE0bXlokGdEPf6rodq3u5q2YLE',
  'KEY_3_THAY_VAO_DAY',
  'KEY_4_THAY_VAO_DAY',
  'KEY_5_THAY_VAO_DAY',
  'KEY_6_THAY_VAO_DAY',
];
var GEMINI_MODEL = 'gemini-2.0-flash';

// ── Custom Endpoints (OpenAI-compatible) ────────────────────────
// Hỗ trợ nhiều endpoint cùng lúc — để trống '' nếu không dùng
var CUSTOM_ENDPOINTS = [
  {
    name:     '9router',
    endpoint: 'THAY_URL_9ROUTER',          // VD: https://9router.decolua.com/v1/chat/completions
    apiKey:   'THAY_APIKEY_9ROUTER',       // API key của 9router
    model:    'THAY_MODEL_9ROUTER',        // VD: gpt-4o-mini / gemini-pro / ...
  },
];

// ── Google Drive ───────────────────────────────────────────────
// ID folder gốc chứa tất cả sách & tài liệu (dự phòng)
var ROOT_FOLDER_ID = '1gP-4vafPZiuHXAz6Zup0vboUK9D1llfC';
// ID folder cho tài liệu chia sẻ
var DOCS_FOLDER_ID = '1XdzdpnxPyPHp2PnEyIOPUnSwlTcIeTeN';
// ID folder cho books review
var BOOKS_FOLDER_ID = '14hhgqz03Ftbzy7bw4d8mWLnuIF4sQgMG';

var MAIN_SPREADSHEET_ID = '1b6LNl7JHRiCsjK1w9VuD86GLqAfmSOtDUOm5whrGdH0';

function getDocsSpreadsheet() {
  try {
    return SpreadsheetApp.openById(MAIN_SPREADSHEET_ID);
  } catch (err) {
    Logger.log('Could not open Main Spreadsheet by ID: ' + err.message);
    return SpreadsheetApp.getActiveSpreadsheet();
  }
}

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

// ================================================================
// CONFIGURATION LOADER & ROTATION ENGINE
// ================================================================

function loadConfigFromSheet() {
  try {
    var ss = getDocsSpreadsheet();
    var sheet = ss.getSheetByName('config');
    if (!sheet) return;
    
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      var key = data[i][0];
      var val = data[i][1];
      if (!key) continue;
      
      var valStr = String(val).trim();
      if (key === 'GEMINI_KEYS') {
        if (valStr) {
          GEMINI_KEYS = valStr.split(',').map(function(k) { return k.trim(); });
        }
      } else if (key === 'GEMINI_MODEL') {
        if (valStr) GEMINI_MODEL = valStr;
      } else if (key === 'ROOT_FOLDER_ID') {
        if (valStr) ROOT_FOLDER_ID = valStr;
      } else if (key === 'DOCS_FOLDER_ID') {
        if (valStr) DOCS_FOLDER_ID = valStr;
      } else if (key === 'BOOKS_FOLDER_ID') {
        if (valStr) BOOKS_FOLDER_ID = valStr;
      } else if (key === 'CUSTOM_ENDPOINT_NAME') {
        CUSTOM_ENDPOINTS[0].name = valStr;
      } else if (key === 'CUSTOM_ENDPOINT_URL') {
        CUSTOM_ENDPOINTS[0].endpoint = valStr;
      } else if (key === 'CUSTOM_ENDPOINT_KEY') {
        CUSTOM_ENDPOINTS[0].apiKey = valStr;
      } else if (key === 'CUSTOM_ENDPOINT_MODEL') {
        CUSTOM_ENDPOINTS[0].model = valStr;
      }
    }
  } catch (e) {
    console.error('Lỗi loadConfigFromSheet: ' + e.message);
  }
}

// Xây dựng pool tất cả providers
function buildProviderPool() {
  // Nạp cấu hình từ sheet trước khi cào
  loadConfigFromSheet();
  
  var pool = [];

  // Thêm Gemini keys
  for (var i = 0; i < GEMINI_KEYS.length; i++) {
    var k = GEMINI_KEYS[i];
    if (k && k.indexOf('THAY') === -1 && k.length > 10) {
      pool.push({ type: 'gemini', key: k, name: 'Google AI #' + (i + 1) });
    }
  }

  // Thêm custom endpoints
  for (var j = 0; j < CUSTOM_ENDPOINTS.length; j++) {
    var ep = CUSTOM_ENDPOINTS[j];
    if (ep.endpoint && ep.apiKey &&
        ep.endpoint.indexOf('THAY') === -1 &&
        ep.apiKey.indexOf('THAY') === -1) {
      pool.push({
        type:     'custom',
        name:     ep.name,
        endpoint: ep.endpoint,
        apiKey:   ep.apiKey,
        model:    ep.model,
      });
    }
  }

  return pool;
}

function getConfigJson() {
  loadConfigFromSheet();
  return {
    gemini_keys: GEMINI_KEYS.join(', '),
    gemini_model: GEMINI_MODEL,
    root_folder_id: ROOT_FOLDER_ID,
    docs_folder_id: DOCS_FOLDER_ID,
    books_folder_id: BOOKS_FOLDER_ID,
    custom_name: CUSTOM_ENDPOINTS[0].name || '',
    custom_endpoint: CUSTOM_ENDPOINTS[0].endpoint || '',
    custom_key: CUSTOM_ENDPOINTS[0].apiKey || '',
    custom_model: CUSTOM_ENDPOINTS[0].model || ''
  };
}

function saveConfigFromUI(configData) {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('config');
  if (!sheet) {
    sheet = ss.insertSheet('config');
  }
  
  sheet.clear();
  sheet.appendRow(['Cấu hình', 'Giá trị']);
  
  var rows = [
    ['GEMINI_KEYS', configData.gemini_keys],
    ['GEMINI_MODEL', configData.gemini_model],
    ['ROOT_FOLDER_ID', configData.root_folder_id],
    ['DOCS_FOLDER_ID', configData.docs_folder_id],
    ['BOOKS_FOLDER_ID', configData.books_folder_id],
    ['CUSTOM_ENDPOINT_NAME', configData.custom_name],
    ['CUSTOM_ENDPOINT_URL', configData.custom_endpoint],
    ['CUSTOM_ENDPOINT_KEY', configData.custom_key],
    ['CUSTOM_ENDPOINT_MODEL', configData.custom_model]
  ];
  
  sheet.getRange(2, 1, rows.length, 2).setValues(rows);
  
  // Format đẹp cho tab config
  sheet.getRange('A1:B1').setFontWeight('bold').setBackground('#D4A843').setFontColor('#ffffff');
  sheet.setColumnWidth(1, 250);
  sheet.setColumnWidth(2, 500);
  
  // Cập nhật lại biến toàn cục ngay lập tức
  loadConfigFromSheet();
  return { success: true };
}

// Lấy/lưu index trong PropertiesService
function getCurrentKeyIndex() {
  var val = PropertiesService.getScriptProperties().getProperty('KEY_INDEX');
  return val ? parseInt(val) : 0;
}
function advanceKeyIndex(poolSize) {
  var next = (getCurrentKeyIndex() + 1) % poolSize;
  PropertiesService.getScriptProperties().setProperty('KEY_INDEX', String(next));
  return next;
}
function resetKeyIndex() {
  PropertiesService.getScriptProperties().setProperty('KEY_INDEX', '0');
  getDocsSpreadsheet().toast('Key index đã reset về 0!', 'Done', 3);
}

function openDashboardExternal() {
  var url = ScriptApp.getService().getUrl();
  if (!url) {
    SpreadsheetApp.getUi().alert('Vui lòng Deploy Apps Script dưới dạng Web App trước!\n(Góc trên bên phải -> Triển khai -> Triển khai mới -> Chọn loại: Ứng dụng web -> Bấm Triển khai)');
    return;
  }
  var html = HtmlService.createHtmlOutput('Đang mở Dashboard... <script>window.open("' + url + '", "_blank");google.script.host.close();</script>');
  SpreadsheetApp.getUi().showModalDialog(html, 'Mở Dashboard');
}

function openDashboardSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('DashboardUI')
      .setTitle('Lê Lê Bookstore Panel')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  SpreadsheetApp.getUi().showSidebar(html);
}

// ================================================================
// ── MENU ─────────────────────────────────────────────────────────
// ================================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🤖 Lê Lê AI')
    .addItem('🖥️ Mở Dashboard (Cửa sổ mới)',             'openDashboardExternal')
    .addItem('📖 Mở Dashboard (Thanh Sidebar)',           'openDashboardSidebar')
    .addSeparator()
    .addItem('📦 Fetch thông tin từ link Shopee',        'fetchSelectedRows')
    .addSeparator()
    .addItem('📁 Tạo thư mục Drive theo SKU',            'createSkuFolders')
    .addItem('🖼️ Sync ảnh Drive → Sheet',                   'syncDriveImages')
    .addSeparator()
    .addItem('📁 Tạo thư mục Drive theo ID tài liệu',      'createDocFolders')
    .addItem('🖼️ Sync Drive (PDF & Ảnh) → Sheet',           'syncDocsDrive')
    .addSeparator()
    .addItem('✍️ Viết review bằng AI',                    'generateAIReviews')
    .addItem('✍️ Viết bài giới thiệu tài liệu (AI)',      'generateAIDocPosts')
    .addItem('✍️ Tạo nhanh bài viết tài liệu mẫu (Pre-written)', 'createPrewrittenDocPosts')
    .addSeparator()
    .addItem('📥 Kéo sách vào books theo SKU',             'pullBySkuToBooks')
    .addItem('🗑️ Xoá sách khỏi books theo SKU',           'removeBySkuFromBooks')
    .addSeparator()
    .addItem('🔑 Kiểm tra API keys',                     'checkAllKeys')
    .addItem('🔄 Reset key index về 0',                  'resetKeyIndex')
    .addSeparator()
    .addItem('⚙️ Setup tất cả tabs (lần đầu)',           'setupAllSheets')
    .addToUi();
}

// ================================================================
// ── WEB APP ENDPOINTS FOR TAURI DASHBOARD ────────────────────────
// ================================================================
function doGet(e) {
  var action = e.parameter.action;
  
  if (action === 'get_data') {
    return ContentService.createTextOutput(JSON.stringify(getDataJson()))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  return HtmlService.createHtmlOutputFromFile('DashboardUI')
      .setTitle('Lê Lê Bookstore Dashboard')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function doPost(e) {
  var postData;
  try {
    postData = JSON.parse(e.postData.contents);
  } catch(err) {
    return ContentService.createTextOutput(JSON.stringify({ error: 'Cần payload JSON hợp lệ' }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  var action = postData.action;
  var responsePayload = { error: 'Unknown action' };
  
  try {
    if (action === 'update_book') {
      responsePayload = updateBookRow(postData);
    } else if (action === 'update_doc') {
      responsePayload = updateDocRow(postData);
    } else if (action === 'delete_doc') {
      responsePayload = deleteDocRow(postData);
    } else if (action === 'setup_media') {
      setupMediaSheet();
      syncYouTubeVideos();
      createAutoSyncTrigger();
      responsePayload = { success: true, message: 'Đã tạo và đồng bộ tab media thành công!' };
    } else if (action === 'generate_review') {
      responsePayload = generateReviewForSku(postData.sku);
    } else if (action === 'generate_doc_post') {
      responsePayload = generateDocPostForId(postData.id);
    } else if (action === 'upload_image') {
      responsePayload = uploadBase64Image(postData);
    } else if (action === 'submit_request') {
      responsePayload = submitReaderRequest(postData);
    }
  } catch(err) {
    responsePayload = { error: err.message };
  }
  
  return ContentService.createTextOutput(JSON.stringify(responsePayload))
    .setMimeType(ContentService.MimeType.JSON);
}

// --- Web App Helpers ---
function getDataJson() {
  var ss = getDocsSpreadsheet();
  
  var books = [];
  var bookSheet = ss.getSheetByName('books');
  if (bookSheet) {
    var lastRow = bookSheet.getLastRow();
    if (lastRow >= 3) {
      var headers = bookSheet.getRange(1, 1, 1, bookSheet.getLastColumn()).getValues()[0];
      var data = bookSheet.getRange(3, 1, lastRow - 2, bookSheet.getLastColumn()).getValues();
      books = data.map(function(row) {
        var obj = {};
        headers.forEach(function(h, idx) {
          obj[h] = row[idx];
        });
        return obj;
      });
    }
  }
  
  var docs = [];
  var docSheet = getDocsSpreadsheet().getSheetByName('docs');
  if (docSheet) {
    var lastRow = docSheet.getLastRow();
    if (lastRow >= 3) {
      var headers = docSheet.getRange(1, 1, 1, docSheet.getLastColumn()).getValues()[0];
      var data = docSheet.getRange(3, 1, lastRow - 2, docSheet.getLastColumn()).getValues();
      docs = data.map(function(row) {
        var obj = {};
        headers.forEach(function(h, idx) {
          obj[h] = row[idx];
        });
        return obj;
      });
    }
  }

  var affiliate = [];
  var affSheet = ss.getSheetByName('affiliate');
  if (affSheet) {
    var lastRow = affSheet.getLastRow();
    if (lastRow >= 3) {
      var headers = affSheet.getRange(1, 1, 1, affSheet.getLastColumn()).getValues()[0];
      var data = affSheet.getRange(3, 1, lastRow - 2, affSheet.getLastColumn()).getValues();
      affiliate = data.map(function(row) {
        var obj = {};
        headers.forEach(function(h, idx) {
          obj[h] = row[idx];
        });
        return obj;
      });
    }
  }

  var logs = [];
  var logSheet = ss.getSheetByName('log');
  if (logSheet) {
    var lastRow = logSheet.getLastRow();
    if (lastRow >= 2) {
      var data = logSheet.getRange(2, 1, lastRow - 1, 4).getValues();
      logs = data.map(function(row) {
        return {
          time: String(row[0]),
          type: String(row[1]),
          detail: String(row[2]),
          key_index: String(row[3])
        };
      });
      logs.reverse();
      if (logs.length > 100) {
        logs = logs.slice(0, 100);
      }
    }
  }
  
  var media = [];
  var mediaSheet = ss.getSheetByName('media');
  if (mediaSheet) {
    var lastRow = mediaSheet.getLastRow();
    if (lastRow >= 3) {
      var headers = mediaSheet.getRange(1, 1, 1, mediaSheet.getLastColumn()).getValues()[0];
      var data = mediaSheet.getRange(3, 1, lastRow - 2, mediaSheet.getLastColumn()).getValues();
      media = data.map(function(row) {
        var obj = {};
        headers.forEach(function(h, idx) {
          obj[h] = row[idx];
        });
        return obj;
      });
    }
  }
  
  return { books: books, docs: docs, affiliate: affiliate, logs: logs, media: media };
}

function updateBookRow(postData) {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('books');
  if (!sheet) return { error: 'Không tìm thấy tab books' };
  
  var sku = postData.sku;
  if (!sku) return { error: 'SKU là bắt buộc' };
  
  var lastRow = sheet.getLastRow();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  var rowIndex = -1;
  if (lastRow >= 3) {
    var skuValues = sheet.getRange(3, 1, lastRow - 2, 1).getValues();
    for (var i = 0; i < skuValues.length; i++) {
      if (String(skuValues[i][0]).trim() === sku) {
        rowIndex = i + 3;
        break;
      }
    }
  }
  
  if (rowIndex === -1) {
    sheet.appendRow([sku]);
    rowIndex = sheet.getLastRow();
    // Gán Thứ tự tự động
    var orderCol = headers.indexOf('order') + 1;
    if (orderCol > 0) sheet.getRange(rowIndex, orderCol).setValue(rowIndex - 2);
  }
  
  for (var key in postData) {
    if (key === 'action' || key === 'sku') continue;
    var colIndex = headers.indexOf(key);
    if (colIndex !== -1) {
      sheet.getRange(rowIndex, colIndex + 1).setValue(postData[key]);
    }
  }
  
  return { success: true, sku: sku, rowIndex: rowIndex };
}

function updateDocRow(postData) {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('docs');
  if (!sheet) return { error: 'Không tìm thấy tab docs' };
  
  var id = postData.id;
  if (!id) return { error: 'ID tài liệu là bắt buộc' };
  
  var lastRow = sheet.getLastRow();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  var rowIndex = -1;
  if (lastRow >= 3) {
    var idValues = sheet.getRange(3, 1, lastRow - 2, 1).getValues();
    for (var i = 0; i < idValues.length; i++) {
      if (String(idValues[i][0]).trim().toUpperCase() === id.trim().toUpperCase()) {
        rowIndex = i + 3;
        break;
      }
    }
  }
  
  // Tự động tìm hoặc tạo thư mục Drive cho tài liệu nếu chưa có
  var folderColIndex = headers.indexOf('folder_url');
  var existingFolderUrl = '';
  if (folderColIndex !== -1) {
    if (rowIndex !== -1) {
      existingFolderUrl = String(sheet.getRange(rowIndex, folderColIndex + 1).getValue()).trim();
    }
    if (!existingFolderUrl) {
      try {
        var rootId = DOCS_FOLDER_ID || ROOT_FOLDER_ID;
        var rootFolder = DriveApp.getFolderById(rootId);
        var docFolder;
        var folders = rootFolder.getFoldersByName(id);
        if (folders.hasNext()) {
          docFolder = folders.next();
        } else {
          docFolder = rootFolder.createFolder(id);
        }
        if (!docFolder.getFoldersByName('file').hasNext()) docFolder.createFolder('file');
        if (!docFolder.getFoldersByName('preview').hasNext()) docFolder.createFolder('preview');
        
        existingFolderUrl = docFolder.getUrl();
        postData.folder_url = existingFolderUrl;
      } catch(err) {
        Logger.log('Tự động tạo folder docs thất bại: ' + err.message);
      }
    }
  }
  
  if (rowIndex === -1) {
    sheet.appendRow([id]);
    rowIndex = sheet.getLastRow();
  }
  
  for (var key in postData) {
    if (key === 'action' || key === 'id') continue;
    var colIndex = headers.indexOf(key);
    if (colIndex !== -1) {
      sheet.getRange(rowIndex, colIndex + 1).setValue(postData[key]);
    }
  }
  
  return { success: true, id: id, rowIndex: rowIndex, folder_url: existingFolderUrl };
}

function deleteDocRow(postData) {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('docs');
  if (!sheet) return { error: 'Không tìm thấy tab docs' };
  
  var id = postData.id;
  if (!id) return { error: 'ID tài liệu là bắt buộc' };
  
  var lastRow = sheet.getLastRow();
  var deleted = false;
  if (lastRow >= 3) {
    var idValues = sheet.getRange(3, 1, lastRow - 2, 1).getValues();
    for (var i = idValues.length - 1; i >= 0; i--) {
      if (String(idValues[i][0]).trim().toUpperCase() === id.trim().toUpperCase()) {
        sheet.deleteRow(i + 3);
        deleted = true;
      }
    }
  }
  return { success: deleted, id: id };
}

function generateReviewForSku(sku) {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('books');
  if (!sheet) return { error: 'Không tìm thấy tab books' };
  
  var lastRow = sheet.getLastRow();
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var rowIndex = -1;
  
  if (lastRow >= 3) {
    var skuColValues = sheet.getRange(3, 1, lastRow - 2, 1).getValues();
    for (var i = 0; i < skuColValues.length; i++) {
      if (String(skuColValues[i][0]).trim() === sku) {
        rowIndex = i + 3;
        break;
      }
    }
  }
  
  if (rowIndex === -1) return { error: 'Không tìm thấy SKU này' };
  
  var titleCol = headers.indexOf('title') + 1;
  var descCol = headers.indexOf('desc') + 1;
  var tagsCol = headers.indexOf('tags') + 1;
  
  var title = String(sheet.getRange(rowIndex, titleCol).getValue()).trim();
  var desc = String(sheet.getRange(rowIndex, descCol).getValue()).trim();
  var tags = String(sheet.getRange(rowIndex, tagsCol).getValue()).trim();
  
  try {
    var prompt = "Bạn là Lê Lê (kênh Lê Lê học tiếng Trung), một người bạn đồng hành cùng học tiếng Trung với mọi người. Hãy viết review sách bằng tiếng Việt một cách chân thành, giọng điệu tự nhiên, thân thiện, dễ thương, xưng 'mình' hoặc 'Lê Lê' và gọi độc giả là 'các bạn' (không xưng cô/các em, không gọi học sinh).\n" +
                 "Hãy viết review cho cuốn sách sau:\n" +
                 "Tên sách: " + title + "\n" +
                 "Mô tả cơ bản: " + desc + "\n" +
                 "Tags: " + tags + "\n\n" +
                 "Hãy trả về JSON THUẦN (không markdown, không ```json):\n" +
                 "{\n" +
                 "  \"review\": \"Đoạn review chi tiết khoảng 150-250 từ. Chia sẻ trải nghiệm cùng học thực tế của Lê Lê với các bạn. Dùng **text** để in đậm. Xuống dòng bằng \\n\\n khi cần.\",\n" +
                 "  \"pros\": \"3-5 điểm mạnh nhất của sách, phân cách bằng dấu |. VD: Nội dung phong phú | Trình bày đẹp mắt\",\n" +
                 "  \"cons\": \"1-2 điểm hạn chế hoặc lưu ý khi học, phân cách bằng dấu |.\",\n" +
                 "  \"who_for\": \"Cuốn sách này phù hợp với ai.\"\n" +
                 "}";

    var parsed = callAIWithRotation(prompt);
    if (!parsed) throw new Error('Không nhận được kết quả từ AI');

    var reviewCol = headers.indexOf('review') + 1;
    var prosCol = headers.indexOf('pros') + 1;
    var consCol = headers.indexOf('cons') + 1;
    var whoForCol = headers.indexOf('who_for') + 1;

    sheet.getRange(rowIndex, reviewCol).setValue(parsed.review || '');
    sheet.getRange(rowIndex, prosCol).setValue(parsed.pros || '');
    sheet.getRange(rowIndex, consCol).setValue(parsed.cons || '');
    sheet.getRange(rowIndex, whoForCol).setValue(parsed.who_for || '');
    
    return { success: true, sku: sku, data: parsed };
  } catch(e) {
    return { error: e.message };
  }
}

function generateDocPostForId(id) {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('docs');
  if (!sheet) return { error: 'Không tìm thấy tab docs' };
  
  var lastRow = sheet.getLastRow();
  var rowIndex = -1;
  if (lastRow >= 3) {
    var idColValues = sheet.getRange(3, 1, lastRow - 2, 1).getValues();
    for (var i = 0; i < idColValues.length; i++) {
      if (String(idColValues[i][0]).trim().toUpperCase() === id.trim().toUpperCase()) {
        rowIndex = i + 3;
        break;
      }
    }
  }
  
  if (rowIndex === -1) return { error: 'Không tìm thấy tài liệu ID này' };
  
  var title = String(sheet.getRange(rowIndex, 2).getValue()).trim();
  var desc = String(sheet.getRange(rowIndex, 3).getValue()).trim();
  var category = String(sheet.getRange(rowIndex, 4).getValue()).trim();
  
  try {
    var prompt = "Bạn là Lê Lê (kênh Lê Lê học tiếng Trung), một người bạn đồng hành cùng học tiếng Trung với mọi người. Hãy viết bài giới thiệu chi tiết cho tài liệu học tiếng Trung này để các bạn cùng học đọc và tải tài liệu. Giọng văn xưng hô là 'mình' hoặc 'Lê Lê' và gọi người đọc là 'các bạn' (không xưng cô/các em, không gọi học sinh). Giọng văn phải dễ thương, gần gũi, chia sẻ kinh nghiệm học tập thân thiện như những người bạn học cùng nhau.\n" +
                 "Thông tin tài liệu:\n" +
                 "Tên tài liệu: " + title + "\n" +
                 "Mô tả: " + desc + "\n" +
                 "Nhóm: " + category + "\n\n" +
                 "Hãy trả về JSON THUẦN (không markdown, không ```json):\n" +
                 "{\n" +
                 "  \"content\": \"Đoạn bài viết giới thiệu chi tiết khoảng 150-300 từ. Chia sẻ kinh nghiệm cùng học. Dùng **text** để in đậm. Xuống dòng bằng \\n\\n khi cần.\",\n" +
                 "  \"pros\": \"3-5 điểm nổi bật nhất của tài liệu, phân cách bằng dấu |.\",\n" +
                 "  \"cons\": \"1-2 mẹo tự học hiệu quả nhất với tài liệu này, phân cách bằng dấu |.\",\n" +
                 "  \"who_for\": \"Đối tượng phù hợp nhất.\"\n" +
                 "}";

    var parsed = callAIWithRotation(prompt);
    if (!parsed) throw new Error('Không nhận được kết quả từ AI');

    sheet.getRange(rowIndex, 11).setValue(parsed.content || '');
    sheet.getRange(rowIndex, 12).setValue(parsed.pros || '');
    sheet.getRange(rowIndex, 13).setValue(parsed.cons || '');
    sheet.getRange(rowIndex, 14).setValue(parsed.who_for || '');
    
    return { success: true, id: id, data: parsed };
  } catch(e) {
    return { error: e.message };
  }
}

function uploadBase64Image(postData) {
  var sku = postData.sku || postData.id;
  var type = postData.type || 'shop'; // 'shop' hoặc 'review' hoặc 'preview'
  var fileName = postData.fileName || 'image.png';
  var base64Data = postData.base64Data;
  
  if (!sku || !base64Data) {
    return { error: 'Thiếu sku/id hoặc dữ liệu base64' };
  }
  
  var base64String = base64Data;
  if (base64Data.indexOf(';base64,') !== -1) {
    base64String = base64Data.split(';base64,')[1];
  }
  
  var decodedBytes = Utilities.base64Decode(base64String);
  var mimeType = postData.mimeType || 'image/png';
  var blob = Utilities.newBlob(decodedBytes, mimeType, fileName);
  
  var isDoc = sku.indexOf('DOC-') === 0;
  var rootId = isDoc ? (DOCS_FOLDER_ID || ROOT_FOLDER_ID) : (BOOKS_FOLDER_ID || ROOT_FOLDER_ID);
  var rootFolder = DriveApp.getFolderById(rootId);
  
  var skuFolder;
  var folders = rootFolder.getFoldersByName(sku);
  if (folders.hasNext()) {
    skuFolder = folders.next();
  } else {
    skuFolder = rootFolder.createFolder(sku);
  }
  
  var subfolder = skuFolder;
  if (type === 'shop' || type === 'review' || type === 'preview' || type === 'doc-preview') {
    var targetSubfolderName = 'shop';
    if (type === 'review') {
      targetSubfolderName = 'review';
    } else if (type === 'preview' || type === 'doc-preview') {
      targetSubfolderName = 'preview';
    }
    var subfolders = skuFolder.getFoldersByName(targetSubfolderName);
    if (subfolders.hasNext()) {
      subfolder = subfolders.next();
    } else {
      subfolder = skuFolder.createFolder(targetSubfolderName);
    }
  }
  
  var file = subfolder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  var fileId = file.getId();
  var imageUrl = 'https://lh3.googleusercontent.com/d/' + fileId;
  
  // Sync ngược vào sheet
  var ss = getDocsSpreadsheet();
  var isDoc = sku.indexOf('DOC-') === 0;
  
  if (isDoc) {
    var docSheet = ss.getSheetByName('docs');
    if (docSheet) {
      var lastRow = docSheet.getLastRow();
      var idColValues = docSheet.getRange(3, 1, lastRow - 2, 1).getValues();
      var rowIndex = -1;
      for (var i = 0; i < idColValues.length; i++) {
        if (String(idColValues[i][0]).trim().toUpperCase() === sku.trim().toUpperCase()) {
          rowIndex = i + 3;
          break;
        }
      }
      if (rowIndex !== -1) {
        var currentImages = String(docSheet.getRange(rowIndex, COL.preview_images + 1).getValue()).trim();
        var newImages = currentImages ? currentImages + ',' + imageUrl : imageUrl;
        docSheet.getRange(rowIndex, COL.preview_images + 1).setValue(newImages);
      }
    }
  } else {
    var bookSheet = ss.getSheetByName('books');
    if (bookSheet) {
      var lastRow = bookSheet.getLastRow();
      var skuColValues = bookSheet.getRange(3, 1, lastRow - 2, 1).getValues();
      var rowIndex = -1;
      for (var i = 0; i < skuColValues.length; i++) {
        if (String(skuColValues[i][0]).trim() === sku) {
          rowIndex = i + 3;
          break;
        }
      }
      if (rowIndex !== -1) {
        var headers = bookSheet.getRange(1, 1, 1, bookSheet.getLastColumn()).getValues()[0];
        
        if (type === 'shop') {
          var shopImagesCol = headers.indexOf('shop_images') + 1;
          var currentImages = String(bookSheet.getRange(rowIndex, shopImagesCol).getValue()).trim();
          var newImages = currentImages ? currentImages + ', ' + imageUrl : imageUrl;
          bookSheet.getRange(rowIndex, shopImagesCol).setValue(newImages);
          
          var coverCol = headers.indexOf('cover_url') + 1;
          var currentCover = String(bookSheet.getRange(rowIndex, coverCol).getValue()).trim();
          if (!currentCover) {
            bookSheet.getRange(rowIndex, coverCol).setValue(imageUrl);
          }
        } else if (type === 'review') {
          var reviewImagesCol = headers.indexOf('review_images') + 1;
          var currentImages = String(bookSheet.getRange(rowIndex, reviewImagesCol).getValue()).trim();
          var newImages = currentImages ? currentImages + ', ' + imageUrl : imageUrl;
          bookSheet.getRange(rowIndex, reviewImagesCol).setValue(newImages);
        }
      }
    }
  }
  
  return { success: true, url: imageUrl, fileId: fileId };
}

// ================================================================
// ── MAIN: Fetch & Parse ───────────────────────────────────────────
// ================================================================
function fetchSelectedRows() {
  var ss    = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('affiliate');
  if (!sheet) { SpreadsheetApp.getUi().alert('Không tìm thấy tab "affiliate". Chạy Setup trước!'); return; }

  var pool = buildProviderPool();
  if (pool.length === 0) {
    SpreadsheetApp.getUi().alert('Chưa điền API key hoặc cấu hình Custom Endpoint nào hoạt động!\nVui lòng sửa mảng GEMINI_KEYS trong script.');
    return;
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < 3) { SpreadsheetApp.getUi().alert('Chưa có dữ liệu. Điền link Shopee vào tab affiliate trước!'); return; }

  var data = sheet.getRange(3, 1, lastRow - 2, 15).getValues();
  var processed = 0, errors = 0, skipped = 0;

  var logSheet = getOrCreateLogSheet(ss);
  appendLog(logSheet, 'START', 'Bắt đầu fetch ' + data.length + ' rows, key index: ' + getCurrentKeyIndex());

  data.forEach(function(row, i) {
    var rowNum       = i + 3;
    var affiliateUrl = String(row[2]).trim();
    var existTitle   = String(row[5]).trim();
    var status       = String(row[14]).trim();

    if (!affiliateUrl || affiliateUrl.indexOf('THAY') !== -1 || affiliateUrl === 'undefined') { skipped++; return; }
    if (existTitle && status === 'Đã hoàn tất ✅') { skipped++; return; }
    if (status === 'Đang fetch...') { skipped++; return; }

    sheet.getRange(rowNum, 15).setValue('Đang fetch...').setFontColor('#f59e0b');
    SpreadsheetApp.flush();

    try {
      var html = fetchPage(affiliateUrl);
      if (!html) throw new Error('Không fetch được trang sản phẩm');

      var parsed = callGeminiWithRotation(html, affiliateUrl, rowNum, sheet);
      if (!parsed) throw new Error('Tài liệu phản hồi từ Gemini lỗi hoặc rỗng');

      sheet.getRange(rowNum, 6).setValue(parsed.title         || '');
      sheet.getRange(rowNum, 7).setValue(parsed.subtitle_zh   || '');
      sheet.getRange(rowNum, 8).setValue(parsed.desc          || '');
      sheet.getRange(rowNum, 9).setValue(parsed.tags          || '');
      sheet.getRange(rowNum, 10).setValue(parsed.price         || '0');
      sheet.getRange(rowNum, 11).setValue(parsed.stars        || '5');
      sheet.getRange(rowNum, 13).setValue(parsed.cover_prompt || '');
      sheet.getRange(rowNum, 14).setValue(parsed.cover_note   || '');
      sheet.getRange(rowNum, 15).setValue('Đã hoàn tất ✅').setFontColor('#22c55e');

      appendLog(logSheet, 'OK', 'Row ' + rowNum + ': ' + (parsed.title || '?') + ' | Key index: ' + getCurrentKeyIndex());
      processed++;
      Utilities.sleep(800);

    } catch(err) {
      sheet.getRange(rowNum, 15).setValue('Lỗi: ' + err.message).setFontColor('#ef4444');
      appendLog(logSheet, 'ERR', 'Row ' + rowNum + ': ' + err.message);
      errors++;
    }
    SpreadsheetApp.flush();
  });

  appendLog(logSheet, 'DONE', 'Xong! Processed:' + processed + ' Errors:' + errors + ' Skipped:' + skipped);
  SpreadsheetApp.getUi().alert(
    '✅ Hoàn tất!\n\n' +
    '• Đã xử lý: ' + processed + ' sách\n' +
    '• Lỗi: ' + errors + '\n' +
    '• Bỏ qua: ' + skipped
  );
}

// ================================================================
// ENGINE: Xoay vòng gọi API
// ================================================================
function callAIWithRotation(prompt) {
  var pool = buildProviderPool();
  if (pool.length === 0) {
    throw new Error('Chưa cấu hình API Key hoặc Custom Endpoint nào hoạt động!');
  }

  var startIndex = getCurrentKeyIndex();
  var lastError = null;

  for (var i = 0; i < pool.length; i++) {
    var index = (startIndex + i) % pool.length;
    var provider = pool[index];
    
    PropertiesService.getScriptProperties().setProperty('KEY_INDEX', String(index));
    
    try {
      var result = null;
      if (provider.type === 'gemini') {
        result = callGeminiAPIWithPrompt(prompt, provider.key);
      } else if (provider.type === 'custom') {
        result = callCustomAPIWithPrompt(prompt, provider);
      }
      
      if (result) {
        return result;
      }
    } catch(err) {
      lastError = err;
      Logger.log('Provider ' + provider.name + ' thất bại: ' + err.message);
      advanceKeyIndex(pool.length);
    }
  }

  throw new Error('Tất cả API keys/providers đều thất bại. Lỗi cuối cùng: ' + (lastError ? lastError.message : 'Unknown'));
}

function callGeminiWithRotation(html, sourceUrl, rowNum, sheet) {
  var prompt = buildPrompt(html, sourceUrl);
  return callAIWithRotation(prompt);
}

// ── Gọi Gemini API ───────────────────────────────────────────────
function callGeminiAPIWithPrompt(prompt, apiKey) {
  var apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' +
               GEMINI_MODEL + ':generateContent?key=' + apiKey;

  var res = UrlFetchApp.fetch(apiUrl, {
    method: 'post', contentType: 'application/json',
    payload: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1024 }
    }),
    muteHttpExceptions: true
  });

  var code = res.getResponseCode();
  var body = res.getContentText();

  if (code === 429) throw new Error('429: Rate limit');
  if (code !== 200) throw new Error('HTTP ' + code + ': ' + body.substring(0, 120));

  var json = JSON.parse(body);
  if (!json.candidates || !json.candidates[0]) {
    throw new Error('Gemini: không có kết quả');
  }

  return parseJsonResponse(json.candidates[0].content.parts[0].text);
}

// ── Gọi Custom Endpoint ──────────────────────────────────────────
function callCustomAPIWithPrompt(prompt, provider) {
  var res = UrlFetchApp.fetch(provider.endpoint, {
    method: 'post', contentType: 'application/json',
    headers: { 'Authorization': 'Bearer ' + provider.apiKey },
    payload: JSON.stringify({
      model: provider.model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 1024,
      stream: false,
    }),
    muteHttpExceptions: true
  });

  var code = res.getResponseCode();
  var body = res.getContentText();

  if (code === 429) throw new Error('429: rate limit');
  if (code !== 200) throw new Error('HTTP ' + code + ': ' + body.substring(0, 120));

  var json = JSON.parse(body);

  if (json.choices && json.choices[0] && json.choices[0].message) {
    return parseJsonResponse(json.choices[0].message.content);
  }
  return parseJsonResponse(json.candidates[0].content.parts[0].text);
}

function buildPrompt(html, sourceUrl) {
  return 'Bạn là assistant phân tích trang web bán sách thương mại điện tử Việt Nam (Shopee, Tiki, Lazada, Fahasa, TikTok Shop, v.v.).\n' +
    'Trích xuất thông tin sách và trả về JSON THUẦN (không có markdown, không có ```json):\n\n' +
    '{\n' +
    '  "title": "Tên sách tiếng Việt ngắn gọn",\n' +
    '  "subtitle_zh": "Tên Hán tự nếu có",\n' +
    '  "desc": "Mô tả nội dung sách 1-2 câu",\n' +
    '  "tags": "3-5 tags cách nhau dấu phẩy",\n' +
    '  "price": "Giá tiền số nguyên",\n' +
    '  "stars": "5",\n' +
    '  "cover_prompt": "Prompt tiếng Anh tạo ảnh bìa",\n' +
    '  "cover_note": "Ghi chú"\n' +
    '}\n\n' +
    'URL: ' + sourceUrl + '\nHTML:\n' + html;
}

function parseJsonResponse(text) {
  var cleaned = text.trim()
    .replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch(e) {
    var match = cleaned.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error('Không parse được JSON');
  }
}

function fetchPage(url) {
  try {
    var res = UrlFetchApp.fetch(url, {
      followRedirects: true,
      muteHttpExceptions: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120.0 Safari/537.36'
      }
    });
    if (res.getResponseCode() !== 200) return null;
    return res.getContentText('UTF-8').substring(0, 15000);
  } catch(e) {
    return null;
  }
}

function checkAllKeys() {
  var results = [];
  GEMINI_KEYS.forEach(function(key, i) {
    if (!key || key.indexOf('THAY') !== -1) {
      results.push('Key ' + (i+1) + ': ⬜ Chưa điền');
      return;
    }
    try {
      var apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/' + GEMINI_MODEL + ':generateContent?key=' + key;
      var res = UrlFetchApp.fetch(apiUrl, {
        method: 'post',
        contentType: 'application/json',
        payload: JSON.stringify({ contents: [{ parts: [{ text: 'Say OK.' }] }], generationConfig: { maxOutputTokens: 5 } }),
        muteHttpExceptions: true
      });
      var code = res.getResponseCode();
      if (code === 200) results.push('Key ' + (i+1) + ': ✅ Hoạt động');
      else             results.push('Key ' + (i+1) + ': ❌ HTTP ' + code);
    } catch(e) {
      results.push('Key ' + (i+1) + ': ❌ Lỗi: ' + e.message);
    }
  });
  SpreadsheetApp.getUi().alert('Kết quả kiểm tra Keys:\n\n' + results.join('\n'));
}

// ================================================================
// 📁 Drive Folders Creator
// ================================================================
function createSkuFolders() {
  var ui   = SpreadsheetApp.getUi();
  var ss   = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('books');
  if (!sheet) { ui.alert('Không tìm thấy tab books'); return; }
  
  var rootId = BOOKS_FOLDER_ID || ROOT_FOLDER_ID;
  var rootFolder = DriveApp.getFolderById(rootId);
  var lastRow = sheet.getLastRow();
  if (lastRow < 3) return;

  var range = sheet.getRange(3, 1, lastRow - 2, 22);
  var values = range.getValues();
  var count = 0;

  for (var i = 0; i < values.length; i++) {
    var rowNum = i + 3;
    var sku = String(values[i][0]).trim();
    if (!sku || sku === '' || sku.indexOf('←') !== -1) continue;

    var existingFolderUrl = String(values[i][21]).trim();
    var skuFolder;
    var folders = rootFolder.getFoldersByName(sku);
    if (folders.hasNext()) {
      skuFolder = folders.next();
    } else {
      skuFolder = rootFolder.createFolder(sku);
    }
    
    if (!skuFolder.getFoldersByName('shop').hasNext()) skuFolder.createFolder('shop');
    if (!skuFolder.getFoldersByName('review').hasNext()) skuFolder.createFolder('review');

    var folderUrl = skuFolder.getUrl();
    if (existingFolderUrl !== folderUrl) {
      sheet.getRange(rowNum, 22).setValue(folderUrl);
      count++;
    }
  }
  SpreadsheetApp.flush();
  ui.alert('Đã tạo/kiểm tra SKU Folders: ' + count);
}

// ================================================================
// 🖼️ Sync Drive Images
// ================================================================
function syncDriveImages() {
  var ui   = SpreadsheetApp.getUi();
  var ss   = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('books');
  if (!sheet) return;

  var rootId = BOOKS_FOLDER_ID || ROOT_FOLDER_ID;
  var rootFolder = DriveApp.getFolderById(rootId);
  var lastRow = sheet.getLastRow();
  if (lastRow < 3) return;

  var range = sheet.getRange(3, 1, lastRow - 2, 22);
  var values = range.getValues();
  var updatedCount = 0;

  for (var i = 0; i < values.length; i++) {
    var rowNum = i + 3;
    var sku = String(values[i][0]).trim();
    if (!sku || sku === '' || sku.indexOf('←') !== -1) continue;

    var folders = rootFolder.getFoldersByName(sku);
    if (!folders.hasNext()) continue;
    var skuFolder = folders.next();

    var shopUrls = [];
    var reviewUrls = [];

    // Shop
    var shopFolders = skuFolder.getFoldersByName('shop');
    if (shopFolders.hasNext()) {
      var files = shopFolders.next().getFiles();
      while (files.hasNext()) {
        var file = files.next();
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        shopUrls.push('https://lh3.googleusercontent.com/d/' + file.getId());
      }
    }

    // Review
    var reviewFolders = skuFolder.getFoldersByName('review');
    if (reviewFolders.hasNext()) {
      var files = reviewFolders.next().getFiles();
      while (files.hasNext()) {
        var file = files.next();
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        reviewUrls.push('https://lh3.googleusercontent.com/d/' + file.getId());
      }
    }

    var updated = false;

    var currentCover = String(values[i][10]).trim();
    if (!currentCover && shopUrls.length > 0) {
      sheet.getRange(rowNum, 11).setValue(shopUrls[0]);
      updated = true;
    }

    var currentShopImages = String(values[i][19]).trim();
    var newShopImages = shopUrls.join(', ');
    if (currentShopImages !== newShopImages) {
      sheet.getRange(rowNum, 20).setValue(newShopImages);
      updated = true;
    }

    var currentReviewImages = String(values[i][20]).trim();
    var newReviewImages = reviewUrls.join(', ');
    if (currentReviewImages !== newReviewImages) {
      sheet.getRange(rowNum, 21).setValue(newReviewImages);
      updated = true;
    }

    if (updated) updatedCount++;
  }
  SpreadsheetApp.flush();
  ui.alert('Đã đồng bộ ảnh cho ' + updatedCount + ' sách.');
}

// ================================================================
// 📁 Drive Document Folders Creator
// ================================================================
function createDocFolders() {
  var ui   = SpreadsheetApp.getUi();
  var ss   = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('docs');
  if (!sheet) { ui.alert('Không tìm thấy tab docs'); return; }
  
  var rootId = DOCS_FOLDER_ID || ROOT_FOLDER_ID;
  var rootFolder = DriveApp.getFolderById(rootId);
  var lastRow = sheet.getLastRow();
  if (lastRow < 3) return;

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var folderColIndex = headers.indexOf('folder_url');
  
  if (folderColIndex === -1) {
    ui.alert('Không tìm thấy cột folder_url. Vui lòng chạy setupDocsSheet hoặc setup lại tab docs.');
    return;
  }

  var range = sheet.getRange(3, 1, lastRow - 2, headers.length);
  var values = range.getValues();
  var count = 0;

  for (var i = 0; i < values.length; i++) {
    var rowNum = i + 3;
    var docId = String(values[i][0]).trim();
    if (!docId || docId === '') continue;

    var existingFolderUrl = String(values[i][folderColIndex]).trim();
    var docFolder;
    var folders = rootFolder.getFoldersByName(docId);
    if (folders.hasNext()) {
      docFolder = folders.next();
    } else {
      docFolder = rootFolder.createFolder(docId);
    }
    
    if (!docFolder.getFoldersByName('file').hasNext()) docFolder.createFolder('file');
    if (!docFolder.getFoldersByName('preview').hasNext()) docFolder.createFolder('preview');

    var folderUrl = docFolder.getUrl();
    if (existingFolderUrl !== folderUrl) {
      sheet.getRange(rowNum, folderColIndex + 1).setValue(folderUrl);
      count++;
    }
  }
  SpreadsheetApp.flush();
  ui.alert('Đã tạo/kiểm tra Document Folders: ' + count);
}

// ================================================================
// 🖼️ Sync Drive (PDF & Ảnh) → Sheet
// ================================================================
function syncDocsDrive() {
  var ui   = SpreadsheetApp.getUi();
  var ss   = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('docs');
  if (!sheet) return;

  var rootId = DOCS_FOLDER_ID || ROOT_FOLDER_ID;
  var rootFolder = DriveApp.getFolderById(rootId);
  var lastRow = sheet.getLastRow();
  if (lastRow < 3) return;

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var idColIndex = headers.indexOf('id');
  var driveUrlColIndex = headers.indexOf('drive_url');
  var previewImagesColIndex = headers.indexOf('preview_images');
  var folderColIndex = headers.indexOf('folder_url');
  
  if (idColIndex === -1 || driveUrlColIndex === -1 || previewImagesColIndex === -1 || folderColIndex === -1) {
    ui.alert('Thiếu các cột cần thiết trong tab docs (id, drive_url, preview_images, folder_url).');
    return;
  }

  var range = sheet.getRange(3, 1, lastRow - 2, headers.length);
  var values = range.getValues();
  var updatedCount = 0;

  for (var i = 0; i < values.length; i++) {
    var rowNum = i + 3;
    var docId = String(values[i][idColIndex]).trim();
    if (!docId || docId === '') continue;

    var folders = rootFolder.getFoldersByName(docId);
    if (!folders.hasNext()) continue;
    var docFolder = folders.next();

    var pdfUrl = '';
    var previewUrls = [];

    // 1. Tìm file PDF trong subfolder 'file', fallback tìm trực tiếp trong thư mục gốc của tài liệu
    var fileFolders = docFolder.getFoldersByName('file');
    var pdfFile = null;
    if (fileFolders.hasNext()) {
      var files = fileFolders.next().getFiles();
      while (files.hasNext()) {
        var f = files.next();
        if (f.getName().toLowerCase().endsWith('.pdf')) {
          pdfFile = f;
          break;
        }
      }
    }
    if (!pdfFile) {
      // Fallback
      var files = docFolder.getFiles();
      while (files.hasNext()) {
        var f = files.next();
        if (f.getName().toLowerCase().endsWith('.pdf')) {
          pdfFile = f;
          break;
        }
      }
    }
    if (pdfFile) {
      pdfFile.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
      pdfUrl = pdfFile.getUrl();
    }

    // 2. Tìm ảnh trong subfolder 'preview', fallback tìm trực tiếp trong thư mục gốc của tài liệu
    var previewFolders = docFolder.getFoldersByName('preview');
    if (previewFolders.hasNext()) {
      var files = previewFolders.next().getFiles();
      while (files.hasNext()) {
        var f = files.next();
        var name = f.getName().toLowerCase();
        if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.webp')) {
          f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          previewUrls.push('https://lh3.googleusercontent.com/d/' + f.getId());
        }
      }
    }
    if (previewUrls.length === 0) {
      // Fallback
      var files = docFolder.getFiles();
      while (files.hasNext()) {
        var f = files.next();
        var name = f.getName().toLowerCase();
        if (name.endsWith('.png') || name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('.webp')) {
          f.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
          previewUrls.push('https://lh3.googleusercontent.com/d/' + f.getId());
        }
      }
    }

    var updated = false;

    var currentDriveUrl = String(values[i][driveUrlColIndex]).trim();
    if (pdfUrl && currentDriveUrl !== pdfUrl) {
      sheet.getRange(rowNum, driveUrlColIndex + 1).setValue(pdfUrl);
      updated = true;
    }

    var currentPreviewImages = String(values[i][previewImagesColIndex]).trim();
    var newPreviewImages = previewUrls.join(',');
    if (newPreviewImages && currentPreviewImages !== newPreviewImages) {
      sheet.getRange(rowNum, previewImagesColIndex + 1).setValue(newPreviewImages);
      updated = true;
    }

    var currentFolderUrl = String(values[i][folderColIndex]).trim();
    var newFolderUrl = docFolder.getUrl();
    if (currentFolderUrl !== newFolderUrl) {
      sheet.getRange(rowNum, folderColIndex + 1).setValue(newFolderUrl);
      updated = true;
    }

    if (updated) updatedCount++;
  }
  SpreadsheetApp.flush();
  ui.alert('Đã đồng bộ PDF & ảnh cho ' + updatedCount + ' tài liệu.');
}

// ================================================================
// ✍️ Viết review bằng AI
// ================================================================
function generateAIReviews() {
  var ui   = SpreadsheetApp.getUi();
  var ss   = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('books');
  if (!sheet) return;

  var lastRow = sheet.getLastRow();
  if (lastRow < 3) return;

  var range = sheet.getRange(3, 1, lastRow - 2, 19);
  var values = range.getValues();
  var count = 0;
  var skipped = 0;
  var errors = 0;

  for (var i = 0; i < values.length; i++) {
    var rowNum = i + 3;
    var sku = String(values[i][0]).trim();
    if (!sku || sku === '' || sku.indexOf('←') !== -1) continue;

    var title = String(values[i][2]).trim();
    var desc = String(values[i][4]).trim();
    var tags = String(values[i][5]).trim();
    var existingReview = String(values[i][15]).trim();

    if (existingReview && existingReview !== '') {
      skipped++;
      continue;
    }

    if (!title) continue;

    sheet.getRange(rowNum, 16).setValue('Đang viết review bằng AI...').setFontColor('#f59e0b');
    SpreadsheetApp.flush();

    try {
      var prompt = "Bạn là Lê Lê (kênh Lê Lê học tiếng Trung), một người bạn đồng hành cùng học tiếng Trung với mọi người. Hãy viết review sách bằng tiếng Việt một cách chân thành, giọng điệu tự nhiên, thân thiện, dễ thương, xưng 'mình' hoặc 'Lê Lê' và gọi độc giả là 'các bạn' (không xưng cô/các em, không gọi học sinh).\n" +
                   "Hãy viết review cho cuốn sách sau:\n" +
                   "Tên sách: " + title + "\n" +
                   "Mô tả cơ bản: " + desc + "\n" +
                   "Tags: " + tags + "\n\n" +
                   "Hãy trả về JSON THUẦN (không markdown, không ```json):\n" +
                   "{\n" +
                   "  \"review\": \"Đoạn review chi tiết khoảng 150-250 từ. Chia sẻ trải nghiệm cùng học thực tế của Lê Lê với các bạn. Dùng **text** để in đậm. Xuống dòng bằng \\n\\n khi cần.\",\n" +
                   "  \"pros\": \"3-5 điểm mạnh nhất của sách, phân cách bằng dấu |. VD: Nội dung phong phú | Trình bày đẹp mắt\",\n" +
                   "  \"cons\": \"1-2 điểm hạn chế hoặc lưu ý khi học, phân cách bằng dấu |.\",\n" +
                   "  \"who_for\": \"Cuốn sách này phù hợp với ai.\"\n" +
                   "}";

      var parsed = callAIWithRotation(prompt);
      if (!parsed) throw new Error('AI Response empty');

      sheet.getRange(rowNum, 16).setValue(parsed.review || '').setFontColor('#1a1308');
      sheet.getRange(rowNum, 17).setValue(parsed.pros || '');
      sheet.getRange(rowNum, 18).setValue(parsed.cons || '');
      sheet.getRange(rowNum, 19).setValue(parsed.who_for || '');
      count++;
      Utilities.sleep(1000);
    } catch(e) {
      errors++;
      sheet.getRange(rowNum, 16).setValue('Lỗi: ' + e.message).setFontColor('#ef4444');
    }
    SpreadsheetApp.flush();
  }
  ui.alert('Đã viết mới ' + count + ' review.');
}

// ================================================================
// ✍️ Viết bài viết giới thiệu tài liệu (AI)
// ================================================================
function generateAIDocPosts() {
  var ss    = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('docs');
  if (!sheet) { SpreadsheetApp.getUi().alert('Không tìm thấy tab "docs". Chạy Setup trước!'); return; }

  var lastRow = sheet.getLastRow();
  if (lastRow < 3) { SpreadsheetApp.getUi().alert('Chưa có dữ liệu trong tab docs!'); return; }

  var data = sheet.getRange(3, 1, lastRow - 2, 15).getValues();
  var count = 0;
  var skipped = 0;
  var errors = 0;

  for (var i = 0; i < data.length; i++) {
    var rowNum = i + 3;
    var id = String(data[i][0]).trim();
    if (!id || id === '') continue;

    var title = String(data[i][1]).trim();
    var desc = String(data[i][2]).trim();
    var category = String(data[i][3]).trim();
    var content = String(data[i][10]).trim();

    if (content && content !== '') {
      skipped++;
      continue;
    }

    sheet.getRange(rowNum, 11).setValue('Đang viết bài viết bằng AI...').setFontColor('#f59e0b');
    SpreadsheetApp.flush();

    try {
      var prompt = "Bạn là Lê Lê (kênh Lê Lê học tiếng Trung), một người bạn đồng hành cùng học tiếng Trung với mọi người. Hãy viết bài giới thiệu chi tiết cho tài liệu học tiếng Trung này để các bạn cùng học đọc và tải tài liệu. Giọng văn xưng hô là 'mình' hoặc 'Lê Lê' và gọi người đọc là 'các bạn' (không xưng cô/các em, không gọi học sinh). Giọng văn phải dễ thương, gần gũi, chia sẻ kinh nghiệm học tập thân thiện như những người bạn học cùng nhau.\n" +
                   "Thông tin tài liệu:\n" +
                   "Tên tài liệu: " + title + "\n" +
                   "Mô tả: " + desc + "\n" +
                   "Nhóm (vocab/grammar/hsk/writing): " + category + "\n\n" +
                   "Hãy trả về JSON THUẦN (không markdown, không ```json):\n" +
                   "{\n" +
                   "  \"content\": \"Đoạn bài viết giới thiệu chi tiết khoảng 150-300 từ. Chia sẻ kinh nghiệm tại sao tài liệu này quan trọng, các bạn nên học như thế nào. Dùng **text** để in đậm. Xuống dòng bằng \\n\\n khi cần.\",\n" +
                   "  \"pros\": \"3-5 điểm nổi bật nhất của tài liệu, phân cách bằng dấu |. VD: Thiết kế đẹp mắt | Rất dễ hiểu | Có pinyin đầy đủ\",\n" +
                   "  \"cons\": \"1-2 mẹo tự học hiệu quả nhất với tài liệu này, phân cách bằng dấu |. VD: Nên in ra giấy để học | Học kèm file phát âm\",\n" +
                   "  \"who_for\": \"Đối tượng phù hợp nhất. VD: Dành cho các bạn mới bắt đầu học tiếng Trung hoặc ôn thi HSK 1-2.\"\n" +
                   "}";

      var parsed = callAIWithRotation(prompt);
      if (!parsed) throw new Error('Không nhận được kết quả từ AI');

      sheet.getRange(rowNum, 11).setValue(parsed.content || '').setFontColor('#1a1308'); // Cột K
      sheet.getRange(rowNum, 12).setValue(parsed.pros || '');   // Cột L
      sheet.getRange(rowNum, 13).setValue(parsed.cons || '');   // Cột M
      sheet.getRange(rowNum, 14).setValue(parsed.who_for || '');// Cột N
      
      count++;
      Utilities.sleep(1000);
    } catch(e) {
      errors++;
      sheet.getRange(rowNum, 11).setValue('Lỗi: ' + e.message).setFontColor('#ef4444');
    }
    SpreadsheetApp.flush();
  }

  SpreadsheetApp.getUi().alert('✅ Hoàn tất viết bài bằng AI!\n\n' +
           '• Đã viết mới: ' + count + ' tài liệu\n' +
           '• Bỏ qua: ' + skipped + '\n' +
           '• Lỗi: ' + errors);
}

function createPrewrittenDocPosts() {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('docs');
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Không tìm thấy tab "docs". Hãy chạy Setup trước!');
    return;
  }
  
  var lastRow = sheet.getLastRow();
  if (lastRow < 3) {
    SpreadsheetApp.getUi().alert('Chưa có dữ liệu hàng trong tab docs!');
    return;
  }
  
  var data = sheet.getRange(3, 1, lastRow - 2, 1).getValues();
  
  // Định nghĩa sẵn các bài viết giới thiệu chất lượng cao cho 6 tài liệu mặc định
  var posts = {
    'DOC-500': {
      content: 'Chào các bạn! Lê Lê đây. Hôm nay mình chia sẻ cho các bạn tập tài liệu **500 Từ Vựng Thông Dụng Nhất** trong giao tiếp hàng ngày. Đây là những từ vựng "xương sống" mà mình đã dày công tổng hợp, lọc ra từ các cuộc hội thoại thực tế của người bản xứ và các đề thi HSK đời đầu. Mỗi từ đều có kèm phiên âm pinyin chuẩn xác và định nghĩa tiếng Việt siêu dễ hiểu, gần gũi. Học xong 500 từ này là các bạn đã có thể tự tin nghe hiểu và nói chuyện cơ bản với bạn bè người Trung Quốc rồi đó! Hãy kiên trì học mỗi ngày 10-15 từ nhé, chỉ sau 1 tháng là các bạn sẽ thấy sự khác biệt vượt bậc ngay.',
      pros: 'Tổng hợp từ vựng tần suất cao nhất | Có Pinyin chuẩn và dịch nghĩa dễ hiểu | Giao diện PDF tối giản, dễ in ấn học tập',
      cons: 'Mỗi ngày chỉ nên học tối đa 15 từ kèm đặt câu | Ghi âm lại giọng đọc của mình để đối chiếu',
      who_for: 'Dành cho người mới bắt đầu học tiếng Trung hoặc các bạn đang ôn tập HSK 1-2 cần củng cố vốn từ vựng nền tảng.'
    },
    'DOC-GRAMMAR': {
      content: 'Để nói được một câu tiếng Trung hoàn chỉnh và chuẩn ngữ pháp mà không bị ngập ngừng, chúng ta không thể thiếu nền tảng cấu trúc ngữ pháp. Cuốn **Ngữ Pháp Tiếng Trung Cơ Bản** này chính là "bảo bối" giúp các bạn hệ thống hoá toàn bộ các cấu trúc cơ bản từ câu đơn, câu phức, cách dùng các phó từ phổ biến cho đến các trợ từ động thái. Lê Lê đã viết kèm theo rất nhiều ví dụ sinh động, dịch nghĩa chi tiết để các bạn học đến đâu hiểu ngay đến đó. Tài liệu này sẽ giúp các bạn sửa ngay các lỗi dịch word-by-word từ tiếng Việt sang tiếng Trung thường gặp!',
      pros: 'Giải thích cấu trúc rõ ràng, dễ hiểu | Nhiều ví dụ thực tế đi kèm | Phân tích các lỗi sai ngữ pháp kinh diễn',
      cons: 'Học xong cấu trúc nào hãy tự đặt ít nhất 3 ví dụ | Tập viết tay các mẫu câu để nhớ lâu hơn',
      who_for: 'Các bạn muốn củng cố tư duy ngữ pháp chuẩn, khắc phục lỗi nói tiếng Trung bồi, chuẩn bị ôn thi HSK 2-3.'
    }
  };
  
  var updatedCount = 0;
  for (var i = 0; i < data.length; i++) {
    var id = String(data[i][0]).trim();
    if (posts[id]) {
      var rowNum = i + 3;
      sheet.getRange(rowNum, 11).setValue(posts[id].content).setFontColor('#1a1308');
      sheet.getRange(rowNum, 12).setValue(posts[id].pros);
      sheet.getRange(rowNum, 13).setValue(posts[id].cons);
      sheet.getRange(rowNum, 14).setValue(posts[id].who_for);
      updatedCount++;
    }
  }
  
  SpreadsheetApp.flush();
  SpreadsheetApp.getUi().alert('✅ Đã cập nhật thành công bài viết giới thiệu chất lượng cao cho ' + updatedCount + ' tài liệu chia sẻ!');
}

// ── Kéo sách theo SKU ──────────────────────────────────────────
function pullBySkuToBooks() {
  var ss        = getDocsSpreadsheet();
  var affSheet  = ss.getSheetByName('affiliate');
  var bookSheet = ss.getSheetByName('books');
  if (!affSheet || !bookSheet) return;

  var affLast = affSheet.getLastRow();
  if (affLast < 3) return;
  var affData = affSheet.getRange(3, 1, affLast - 2, 15).getValues();

  var affMap = {}; 
  affData.forEach(function(row) {
    var sku = String(row[1]).trim();
    if (sku) affMap[sku] = row;
  });

  var bookLast = bookSheet.getLastRow();
  if (bookLast < 3) return;

  var bookData = bookSheet.getRange(3, 1, bookLast - 2, 11).getValues();
  var pulled = 0;

  bookData.forEach(function(row, i) {
    var bookRow = i + 3;
    var sku     = String(row[0]).trim();  
    var title   = String(row[2]).trim();  

    if (!sku || sku === '' || sku.indexOf('←') !== -1) return;
    if (title && title !== '') return;

    var affRow = affMap[sku];
    if (!affRow) return;

    var status = String(affRow[14]).trim();
    if (status !== 'Đã hoàn tất ✅') return;

    var newRow = [
      sku,
      bookRow - 2,
      affRow[5],
      affRow[6],
      affRow[7],
      affRow[8],
      affRow[9],
      affRow[3],
      affRow[4],
      affRow[10],
      affRow[11],
      affRow[2],
    ];
    bookSheet.getRange(bookRow, 1, 1, 12).setValues([newRow]);
    pulled++;
  });
  SpreadsheetApp.getUi().alert('Đã kéo ' + pulled + ' sách vào books.');
}

function removeBySkuFromBooks() {
  var ui = SpreadsheetApp.getUi();
  var resp = ui.prompt('Xoá sách', 'Nhập SKU cần xoá:', ui.ButtonSet.OK_CANCEL);
  if (resp.getSelectedButton() !== ui.Button.OK) return;

  var inputSkus = resp.getResponseText().split(',').map(function(s){ return s.trim(); }).filter(Boolean);
  if (!inputSkus.length) return;

  var ss        = getDocsSpreadsheet();
  var bookSheet = ss.getSheetByName('books');
  var bookLast  = bookSheet.getLastRow();
  if (bookLast < 3) return;

  var removed = [];
  for (var r = bookLast; r >= 3; r--) {
    var sku = String(bookSheet.getRange(r, 1).getValue()).trim();
    if (inputSkus.indexOf(sku) !== -1) {
      bookSheet.deleteRow(r);
      removed.push(sku);
    }
  }
  ui.alert('Đã xoá: ' + removed.join(', '));
}

function getOrCreateLogSheet(ss) {
  var sheet = ss.getSheetByName('log');
  if (!sheet) {
    sheet = ss.insertSheet('log');
    sheet.getRange(1,1,1,4).setValues([['Thời gian','Loại','Chi tiết','Key index']]);
    sheet.setColumnWidth(3,500);
  }
  return sheet;
}
function appendLog(sheet, type, detail) {
  sheet.appendRow([new Date().toLocaleString('vi-VN'), type, detail, getCurrentKeyIndex()+1]);
}

function setupAllSheets() {
  setupAffiliateSheet();
  setupBooksSheet();
  setupDocsSheet();
  setupRequestsSheet();
  setupMediaSheet();
  syncYouTubeVideos();
  createAutoSyncTrigger();
  setupGuideSheet();
  setupConfigSheet();
}

function setupMediaSheet() {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('media');
  if (sheet) sheet.clear(); else sheet = ss.insertSheet('media');
  
  var h = ['id', 'title', 'youtube_url', 'category', 'desc', 'order'];
  var l = ['⭐ ID video', 'Tiêu đề video', 'Đường dẫn YouTube', 'Chủ đề / Tab', 'Mô tả ngắn', 'Thứ tự hiển thị'];
  
  sheet.getRange(1, 1, 1, h.length).setValues([h]);
  sheet.getRange(2, 1, 1, l.length).setValues([l]);
  sheet.getRange(2, 1, 1, l.length).setBackground('#FF7B90').setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(2);
}

function createAutoSyncTrigger() {
  var triggers = ScriptApp.getProjectTriggers();
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === 'syncYouTubeVideos') {
      return;
    }
  }
  ScriptApp.newTrigger('syncYouTubeVideos')
    .timeBased()
    .everyHours(6)
    .create();
}

function syncYouTubeVideos() {
  var EXCLUDED_VIDEO_IDS = ['h7MSLsoYKEk'];
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('media');
  if (!sheet) {
    setupMediaSheet();
    sheet = ss.getSheetByName('media');
  }
  
  var lastRow = sheet.getLastRow();
  var existingIds = {};
  if (lastRow >= 3) {
    var data = sheet.getRange(3, 1, lastRow - 2, 1).getValues();
    data.forEach(function(row) {
      existingIds[row[0]] = true;
    });
  }
  
  var newRows = [];
  var fetchedVideos = [];
  var usedAdvancedService = false;
  
  // Try using Advanced YouTube Service to get ALL videos from specific playlists
  try {
    if (typeof YouTube !== 'undefined') {
      var playlists = [
        { id: 'PLvJ8vmRjcTPqLQQ9D52csDmKdedouCGDT', category: 'Lê Lê kể chữ' },
        { id: 'PLvJ8vmRjcTPpXE4WXjeTJP9qRfO5aShvA', category: 'Song đấu từ vựng' },
        { id: 'PLvJ8vmRjcTPquOuOG0C31MqR_js_4Onx9', category: 'Tiếng lóng' },
        { id: 'PLvJ8vmRjcTPpk7FB72P-YrJedsq2MlZD9', category: 'Thành ngữ' },
        { id: 'PLvJ8vmRjcTPrh8zWUkNdtouHwz0-CCW2k', category: 'Tiếng Trung thực chiến' }
      ];
      
      var seenInThisRun = {};
      
      playlists.forEach(function(pl) {
        var nextPageToken = '';
        do {
          var playlistResponse = YouTube.PlaylistItems.list('snippet', {
            playlistId: pl.id,
            maxResults: 50,
            pageToken: nextPageToken
          });
          
          if (playlistResponse && playlistResponse.items) {
            playlistResponse.items.forEach(function(item) {
              var snippet = item.snippet;
              var videoId = snippet.resourceId.videoId;
              if (seenInThisRun[videoId]) return;
              seenInThisRun[videoId] = true;
              
              var title = snippet.title || '';
              var desc = snippet.description || '';
              fetchedVideos.push({
                id: videoId,
                title: title,
                desc: desc,
                category: pl.category
              });
            });
          }
          nextPageToken = playlistResponse.nextPageToken;
        } while (nextPageToken);
      });
      
      usedAdvancedService = true;
      Logger.log('Successfully fetched ' + fetchedVideos.length + ' videos from playlists using YouTube Service.');
    }
  } catch (err) {
    Logger.log('YouTube Advanced Service failed or not enabled: ' + err.toString());
  }
  
  // Fallback to XML Feed (latest 15 videos) if Advanced Service failed or is disabled
  if (!usedAdvancedService) {
    try {
      var url = 'https://www.youtube.com/feeds/videos.xml?channel_id=UCGQfqOTElLYJ1-1OEDQJ8Cw';
      var response = UrlFetchApp.fetch(url);
      var xml = response.getContentText();
      var document = XmlService.parse(xml);
      var root = document.getRootElement();
      
      var atom = XmlService.getNamespace('http://www.w3.org/2005/Atom');
      var yt = XmlService.getNamespace('http://www.youtube.com/xml/schemas/2015');
      var media = XmlService.getNamespace('http://search.yahoo.com/mrss/');
      
      var entries = root.getChildren('entry', atom);
      
      for (var i = entries.length - 1; i >= 0; i--) {
        var entry = entries[i];
        var videoId = entry.getChildText('videoId', yt);
        if (!videoId) continue;
        
        var title = entry.getChildText('title', atom) || '';
        var mediaGroup = entry.getChild('group', media);
        var desc = '';
        if (mediaGroup) {
          desc = mediaGroup.getChildText('description', media) || '';
        }
        
        fetchedVideos.push({
          id: videoId,
          title: title,
          desc: desc
        });
      }
      Logger.log('Successfully fetched ' + fetchedVideos.length + ' videos using XML feed.');
    } catch (err) {
      Logger.log('XML feed fetch failed: ' + err.toString());
      return; // Stop if both failed
    }
  }
  
  // Process the fetched videos (reverse order to append oldest first)
  if (usedAdvancedService) {
    fetchedVideos.reverse();
  }
  
  fetchedVideos.forEach(function(video) {
    var videoId = video.id;
    if (EXCLUDED_VIDEO_IDS.indexOf(videoId) !== -1) return;
    if (existingIds[videoId]) return;
    
    var title = video.title;
    var youtubeUrl = 'https://www.youtube.com/watch?v=' + videoId;
    var desc = video.desc || '';
    
    var category = video.category || 'Tiếng Trung thực chiến';
    var cleanTitle = title;
    
    cleanTitle = cleanTitle.replace(/#\w+/g, '').trim();
    cleanTitle = cleanTitle.replace(/\s+/g, ' ');
    
    if (!video.category) {
      var lowerTitle = title.toLowerCase();
      
      // 1. Song đấu từ vựng (Comparisons)
      if (lowerTitle.indexOf(' vs ') !== -1 || lowerTitle.indexOf(' & ') !== -1 || lowerTitle.indexOf('phân biệt') !== -1 || lowerTitle.indexOf('song đấu') !== -1 || videoId === 'sPFjgmSqyGg') {
        category = 'Song đấu từ vựng';
      }
      // 2. Tiếng Trung thực chiến (Situational conversations)
      else if (lowerTitle.indexOf('giao tiếp') === 0 || lowerTitle.indexOf('ngữ cảnh:') !== -1 || lowerTitle.indexOf('thực chiến') !== -1) {
        category = 'Tiếng Trung thực chiến';
      }
      // 3. Thành ngữ (Idioms)
      else if (
        lowerTitle.indexOf('thành ngữ') !== -1 || lowerTitle.indexOf('idiom') !== -1 || lowerTitle.indexOf('thần thoại') !== -1 || lowerTitle.indexOf('cổ tích') !== -1 ||
        ['thành trúc', 'hiếu long', 'cầu kiếm', 'đạo linh', 'mâu thuẫn', 'chi oa',
         'vi mã', 'di sơn', 'hổ uy', 'vị nhân', 'điểm mắt', 'bổ lao', 'đàn cầm',
         'trầm chu', 'mạc tượng', 'đãi thỏ', 'thiêm túc', 'thất mã', 'lộng phủ',
         'trợ trưởng', 'xà ảnh', 'tùy tục'].some(function(k) { return lowerTitle.indexOf(k) !== -1; })
      ) {
        category = 'Thành ngữ';
      }
      // 4. Lê Lê kể chữ (Etymology)
      else if (
        lowerTitle.indexOf('chữ') !== -1 || lowerTitle.indexOf('kể chữ') !== -1 || lowerTitle.indexOf('nhớ chữ') !== -1 || lowerTitle.indexOf('nguồn gốc') !== -1 || lowerTitle.indexOf('giải mã chữ') !== -1
      ) {
        category = 'Lê Lê kể chữ';
      }
      // 5. Tiếng lóng (Slangs)
      else {
        category = 'Tiếng lóng';
      }
    }
    
    var charMatch = cleanTitle.match(/Câu chuyện chữ\s+([^\s\-]+)\s*[\-\:]\s*(.*)/i);
    if (charMatch) {
      cleanTitle = charMatch[1];
    }
    
    newRows.push([videoId, cleanTitle, youtubeUrl, category, desc.slice(0, 150), '1']);
  });
  
  if (newRows.length > 0) {
    sheet.getRange(sheet.getLastRow() + 1, 1, newRows.length, 6).setValues(newRows);
    Logger.log('Inserted ' + newRows.length + ' new videos into the sheet.');
  }
}


function setupConfigSheet() {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('config');
  if (!sheet) {
    sheet = ss.insertSheet('config');
    sheet.appendRow(['Cấu hình', 'Giá trị']);
    var rows = [
      ['GEMINI_KEYS', GEMINI_KEYS.join(', ')],
      ['GEMINI_MODEL', GEMINI_MODEL],
      ['ROOT_FOLDER_ID', ROOT_FOLDER_ID],
      ['DOCS_FOLDER_ID', DOCS_FOLDER_ID],
      ['BOOKS_FOLDER_ID', BOOKS_FOLDER_ID],
      ['CUSTOM_ENDPOINT_NAME', CUSTOM_ENDPOINTS[0].name || ''],
      ['CUSTOM_ENDPOINT_URL', CUSTOM_ENDPOINTS[0].endpoint || ''],
      ['CUSTOM_ENDPOINT_KEY', CUSTOM_ENDPOINTS[0].apiKey || ''],
      ['CUSTOM_ENDPOINT_MODEL', CUSTOM_ENDPOINTS[0].model || '']
    ];
    sheet.getRange(2, 1, rows.length, 2).setValues(rows);
    
    // Format đẹp
    sheet.getRange('A1:B1').setFontWeight('bold').setBackground('#D4A843').setFontColor('#ffffff');
    sheet.setColumnWidth(1, 250);
    sheet.setColumnWidth(2, 500);
  }
}

function setupAffiliateSheet() {
  var ss    = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('affiliate');
  if (sheet) sheet.clear(); else sheet = ss.insertSheet('affiliate', 0);

  var keys   = ['stt','sku','affiliate_url','badge','badge_type','title','subtitle_zh','desc','tags','price','stars','cover_url','cover_prompt','cover_note','status'];
  var labels = ['STT','SKU','🔗 Link Shopee','Badge','badge_type','Tên sách (AI)','Hán tự (AI)','Mô tả (AI)','Tags (AI)','Giá (AI)','Sao','🖼️ Ảnh Drive','✨ Prompt AI','📸 Ghi chú ảnh','Trạng thái'];

  sheet.getRange(1,1,1,keys.length).setValues([keys]);
  sheet.getRange(2,1,1,labels.length).setValues([labels]);
  sheet.getRange(2,1,1,labels.length).setBackground('#1a1308').setFontColor('#D4A843').setFontWeight('bold');
  sheet.setFrozenRows(2); sheet.setFrozenColumns(3);
}

function setupBooksSheet() {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('books');
  if (sheet) sheet.clear(); else sheet = ss.insertSheet('books');

  var h = ['sku','order','title','subtitle_zh','desc','tags','price','badge','badge_type','stars','cover_url','buy_shopee','buy_fahasa','buy_tiki','buy_lazada','review','pros','cons','who_for','shop_images','review_images','sku_folder_url'];
  var l = ['⭐ SKU','Thứ tự','Tên sách','Hán tự','Mô tả','Tags','Giá','Badge','badge_type','Sao','Link ảnh bìa','🛒 Link Shopee','📚 Link Fahasa','🛍️ Link Tiki','🟠 Link Lazada','📝 Review','✅ Điểm mạnh','⚠️ Lưu ý','🎯 Phù hợp với ai','🖼️ Ảnh Shop','🖼️ Ảnh Review','📁 Link Folder'];

  sheet.getRange(1,1,1,h.length).setValues([h]);
  sheet.getRange(2,1,1,l.length).setValues([l]);
  sheet.getRange(2,1,1,l.length).setBackground('#2d2510').setFontColor('#D4A843').setFontWeight('bold');
  sheet.setFrozenRows(2); sheet.setFrozenColumns(2);
}

function setupDocsSheet() {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('docs');
  if (sheet) sheet.clear(); else sheet = ss.insertSheet('docs');
  
  var h = ['id','title','desc','category','icon','icon_color','pages','level','level_text','drive_url','content','pros','cons','who_for','preview_images','folder_url'];
  var l = ['⭐ ID tài liệu','Tên tài liệu','Mô tả ngắn','Nhóm','Icon','Màu','Thông tin (Trang)','Độ khó (1-5)','Text độ khó','Link Drive','Bài viết (AI)','Điểm nổi bật','Mẹo tự học','Phù hợp với ai','Link ảnh preview','📁 Link Folder'];
  
  sheet.getRange(1,1,1,h.length).setValues([h]);
  sheet.getRange(2,1,1,l.length).setValues([l]);
  sheet.getRange(2,1,1,l.length).setBackground('#0d1f14').setFontColor('#4ecba0').setFontWeight('bold');
  
  var docs = [
    ['DOC-500','500 Từ Vựng Thông Dụng Nhất','Danh sách 500 từ hay gặp nhất trong tiếng Trung hàng ngày, kèm pinyin và nghĩa tiếng Việt. Phù hợp cho người mới bắt đầu.','vocab','📝','#D4A843','PDF · 12 trang','2','Cơ bản · HSK 1–2','https://drive.google.com/LINK_GOOGLE_DRIVE','','','','','',''],
    ['DOC-GRAMMAR','Ngữ Pháp Tiếng Trung Cơ Bản','Tổng hợp các cấu trúc ngữ pháp quan trọng nhất, ví dụ minh hoạ rõ ràng bằng tiếng Việt. Học xong nói câu đúng ngay.','grammar','📚','#C94535','PDF · 28 trang','3','Trung cấp · HSK 2–3','https://drive.google.com/LINK_GOOGLE_DRIVE','','','','','',''],
    ['DOC-STREETFOOD','Ẩm thực đường phố Trung Hoa','','infographics','🍜','#E58F65','','','','','','','','','POSTS/images/thuc_chien_cover_16_9.png',''],
    ['DOC-WORDORDERS','Trật tự từ','','infographics','🔤','#4A90E2','','','','','','','','','POSTS/images/vs_vocabulary_cover_16_9.png','']
  ];
  sheet.getRange(3,1,docs.length,h.length).setValues(docs);
  sheet.setFrozenRows(2);
}

function setupGuideSheet() {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('huongdansudung');
  if (sheet) sheet.clear(); else sheet = ss.insertSheet('huongdansudung');
  var rows = [
    ['HUONG DAN SU DUNG v4.1 — Drive Folders, AI Reviews & Reader Requests','',''],
    ['Cách tích hợp Web App Google Apps Script','',''],
    ['1. Deploy Apps Script này dưới dạng Web App:','',''],
    ['   - Góc trên bên phải → Deploy → New deployment','',''],
    ['   - Select type → Web App','',''],
    ['   - Execute as: Me','',''],
    ['   - Who has access: Anyone (quan trọng để client gọi được mà không vướng auth)','',''],
    ['2. Copy URL Web App nhận được và dán vào:','',''],
    ['   - Tab Config trong Tauri Desktop App (để sync dữ liệu sách/tài liệu)','',''],
    ['   - Biến WEB_APP_URL ở đầu file docs.js trong source code website (để nhận yêu cầu tài liệu từ bạn đọc)','',''],
    ['3. Tạo/Cập nhật các tabs trong Spreadsheet:','',''],
    ['   - Chạy chức năng "Setup tất cả tabs" từ menu "🤖 Lê Lê AI" để cập nhật các tab books, docs, affiliate, requests.','','']
  ];
  sheet.getRange(1,1,rows.length,3).setValues(rows);
  sheet.setColumnWidth(1,280); sheet.setColumnWidth(2,400);
}

function setupRequestsSheet() {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('requests');
  if (sheet) sheet.clear(); else sheet = ss.insertSheet('requests');
  
  var h = ['timestamp', 'request_doc', 'email', 'status'];
  var l = ['Thời gian', 'Tài liệu yêu cầu', 'Email', 'Trạng thái'];
  
  sheet.getRange(1, 1, 1, h.length).setValues([h]);
  sheet.getRange(2, 1, 1, l.length).setValues([l]);
  sheet.getRange(2, 1, 1, l.length).setBackground('#1b2a4a').setFontColor('#e2e8f0').setFontWeight('bold');
  sheet.setFrozenRows(2);
}

function submitReaderRequest(postData) {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('requests');
  if (!sheet) {
    setupRequestsSheet();
    sheet = ss.getSheetByName('requests');
  }
  
  var requestDoc = postData.request_doc || '';
  var email = postData.email || '';
  
  if (!requestDoc) {
    return { error: 'Tên tài liệu yêu cầu là bắt buộc' };
  }
  
  var timestamp = new Date();
  sheet.appendRow([timestamp, requestDoc, email, 'Chờ xử lý']);
  
  return { success: true };
}

// ================================================================
// ── DASHBOARD RPC HELPERS (ĐƯỢC GỌI TỪ UI) ────────────────────────
// ================================================================

function addAffiliateRow(sku, url) {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('affiliate');
  if (!sheet) return { error: 'Không tìm thấy tab affiliate' };
  
  var lastRow = sheet.getLastRow();
  var stt = lastRow - 1;
  if (stt < 1) stt = 1;
  
  sheet.appendRow([stt, sku, url, '🎁 Hộp Quà', 'default', '', '', '', '', '0', '5', '', '', '', 'Chờ fetch ⏳']);
  
  var newRowIndex = sheet.getLastRow();
  sheet.getRange(newRowIndex, 15).setFontColor('#f59e0b');
  
  return { success: true };
}

function runCrawlerFromUI() {
  try {
    fetchSelectedRows();
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

// ================================================================
// ── DASHBOARD RPC HELPERS (ĐƯỢC GỌI TỪ UI) ────────────────────────
// ================================================================

function runPullToBooksFromUI() {
  try {
    pullBySkuToBooks();
    return { success: true };
  } catch (err) {
    return { error: err.message };
  }
}

function clearLogsFromUI() {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('log');
  if (sheet) {
    sheet.clear();
    sheet.getRange(1,1,1,4).setValues([['Thời gian','Loại','Chi tiết','Key index']]);
    sheet.setColumnWidth(3,500);
    return { success: true };
  }
  return { error: 'Không tìm thấy tab log' };
}

function deleteBookBySku(sku) {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('books');
  if (!sheet) return { error: 'Không tìm thấy tab books' };
  
  var lastRow = sheet.getLastRow();
  for (var r = lastRow; r >= 3; r--) {
    var s = String(sheet.getRange(r, 1).getValue()).trim();
    if (s === sku) {
      sheet.deleteRow(r);
      return { success: true };
    }
  }
  return { error: 'Không tìm thấy sách với SKU ' + sku };
}

function deleteDocById(id) {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('docs');
  if (!sheet) return { error: 'Không tìm thấy tab docs' };
  
  var lastRow = sheet.getLastRow();
  for (var r = lastRow; r >= 3; r--) {
    var s = String(sheet.getRange(r, 1).getValue()).trim().toUpperCase();
    if (s === id.trim().toUpperCase()) {
      sheet.deleteRow(r);
      return { success: true };
    }
  }
  return { error: 'Không tìm thấy tài liệu với ID ' + id };
}

/**
 * Quét toàn bộ bảng tính 'books' để kiểm tra các link affiliate hỏng hoặc link nháp
 * Tô đỏ các ô chứa link nháp, tô vàng các ô Shopee đang bị để trống.
 */
function checkAffiliateLinks() {
  var ss = getDocsSpreadsheet();
  var sheet = ss.getSheetByName('books');
  if (!sheet) {
    SpreadsheetApp.getUi().alert('Lỗi: Không tìm thấy tab "books"');
    return;
  }

  var lastRow = sheet.getLastRow();
  if (lastRow < 3) {
    SpreadsheetApp.getUi().alert('Không có dữ liệu sách để quét.');
    return;
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  
  var colsToCheck = {
    buy_shopee: headers.indexOf('buy_shopee') + 1,
    buy_fahasa: headers.indexOf('buy_fahasa') + 1,
    buy_tiki: headers.indexOf('buy_tiki') + 1,
    buy_lazada: headers.indexOf('buy_lazada') + 1
  };

  var badCount = 0;

  for (var r = 3; r <= lastRow; r++) {
    for (var key in colsToCheck) {
      var colIdx = colsToCheck[key];
      if (colIdx <= 0) continue; // Cột không tồn tại

      var range = sheet.getRange(r, colIdx);
      var url = String(range.getValue()).trim();
      
      // Reset background màu về mặc định
      range.setBackground(null);

      if (url === "") {
        // Nếu trống cột Shopee (nền tảng chính) thì cảnh báo vàng
        if (key === 'buy_shopee') {
          range.setBackground('#fff2cc'); // Vàng nhạt
          badCount++;
        }
        continue;
      }

      var isPlaceholder = url.includes('LINK_AFFILIATE') || 
                          url.includes('THAY_VAO_DAY') || 
                          url.includes('undefined') ||
                          url === '#';
                          
      var isValidFormat = url.startsWith('http://') || url.startsWith('https://');

      if (isPlaceholder || !isValidFormat) {
        range.setBackground('#f4cccc'); // Đỏ nhạt
        badCount++;
      }
    }
  }

  var ui = SpreadsheetApp.getUi();
  if (badCount > 0) {
    ui.alert('Kết quả quét link Affiliate:\n- Phát hiện ' + badCount + ' ô chứa link lỗi hoặc link nháp (đã tô đỏ/vàng).\n- Vui lòng cập nhật các ô này để người dùng web click mua hàng được nhé!');
  } else {
    ui.alert('Kết quả quét link Affiliate:\n- Tất cả các link kiểm tra đều hợp lệ! Tuyệt vời! ✨');
  }
}

