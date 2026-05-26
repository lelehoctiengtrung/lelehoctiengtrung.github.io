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
const GEMINI_KEYS = [
  'AIzaSyDfwgKYCglZqtXrMVIXYJve2HXpA2Le8Ng',
  'AIzaSyAL_pzcIxE0bXlokGdEPf6rodq3u5q2YLE',
  'KEY_3_THAY_VAO_DAY',
  'KEY_4_THAY_VAO_DAY',
  'KEY_5_THAY_VAO_DAY',
  'KEY_6_THAY_VAO_DAY',
];
const GEMINI_MODEL = 'gemini-2.0-flash';

// ── Custom Endpoints (OpenAI-compatible) ────────────────────────
// Hỗ trợ nhiều endpoint cùng lúc — để trống '' nếu không dùng
const CUSTOM_ENDPOINTS = [
  {
    name:     '9router',
    endpoint: 'THAY_URL_9ROUTER',          // VD: https://9router.decolua.com/v1/chat/completions
    apiKey:   'THAY_APIKEY_9ROUTER',       // API key của 9router
    model:    'THAY_MODEL_9ROUTER',        // VD: gpt-4o-mini / gemini-pro / ...
  },
];

// ── Google Drive ───────────────────────────────────────────────
// ID folder gốc chứa tất cả sách & tài liệu
var ROOT_FOLDER_ID = '1gP-4vafPZiuHXAz6Zup0vboUK9D1llfC';

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
// ROTATION ENGINE — kết hợp Gemini Keys + Custom Endpoints
// ================================================================

// Xây dựng pool tất cả providers
function buildProviderPool() {
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
  SpreadsheetApp.getActiveSpreadsheet().toast('Key index đã reset về 0!', 'Done', 3);
}

// ================================================================
// ── MENU ─────────────────────────────────────────────────────────
// ================================================================
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🤖 Lê Lê AI')
    .addItem('📦 Fetch thông tin từ link Shopee',        'fetchSelectedRows')
    .addSeparator()
    .addItem('📁 Tạo thư mục Drive theo SKU',            'createSkuFolders')
    .addItem('🖼️ Sync ảnh Drive → Sheet',                   'syncDriveImages')
    .addSeparator()
    .addItem('✍️ Viết review bằng AI',                    'generateAIReviews')
    .addItem('✍️ Viết bài giới thiệu tài liệu (AI)',      'generateAIDocPosts')
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
  
  return ContentService.createTextOutput(JSON.stringify({ error: 'Action not found' }))
    .setMimeType(ContentService.MimeType.JSON);
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  
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
  var docSheet = ss.getSheetByName('docs');
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
  
  return { books: books, docs: docs };
}

function updateBookRow(postData) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
  
  return { success: true, id: id, rowIndex: rowIndex };
}

function generateReviewForSku(sku) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
    var prompt = "Bạn là cô giáo Lê Lê (kênh Lê Lê học tiếng Trung), viết review sách có tâm bằng tiếng Việt, giọng điệu tự nhiên, thân thiện, dễ thương.\n" +
                 "Hãy viết review cho cuốn sách sau:\n" +
                 "Tên sách: " + title + "\n" +
                 "Mô tả cơ bản: " + desc + "\n" +
                 "Tags: " + tags + "\n\n" +
                 "Hãy trả về JSON THUẦN (không markdown, không ```json):\n" +
                 "{\n" +
                 "  \"review\": \"Đoạn review chi tiết khoảng 150-250 từ. Chia sẻ trải nghiệm học thực tế của Lê Lê. Dùng **text** để in đậm. Xuống dòng bằng \\n\\n khi cần.\",\n" +
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
    var prompt = "Bạn là cô giáo Lê Lê (kênh Lê Lê học tiếng Trung). Hãy viết bài giới thiệu chi tiết cho tài liệu học tiếng Trung này để học sinh đọc và tải tài liệu. Giọng văn phải dễ thương, gần gũi, truyền cảm hứng tự học.\n" +
                 "Thông tin tài liệu:\n" +
                 "Tên tài liệu: " + title + "\n" +
                 "Mô tả: " + desc + "\n" +
                 "Nhóm: " + category + "\n\n" +
                 "Hãy trả về JSON THUẦN (không markdown, không ```json):\n" +
                 "{\n" +
                 "  \"content\": \"Đoạn bài viết giới thiệu chi tiết khoảng 150-300 từ. Chia sẻ kinh nghiệm học. Dùng **text** để in đậm. Xuống dòng bằng \\n\\n khi cần.\",\n" +
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
  var blob = Utilities.newBlob(decodedBytes, 'image/png', fileName);
  
  var rootId = ROOT_FOLDER_ID;
  var rootFolder = DriveApp.getFolderById(rootId);
  
  var skuFolder;
  var folders = rootFolder.getFoldersByName(sku);
  if (folders.hasNext()) {
    skuFolder = folders.next();
  } else {
    skuFolder = rootFolder.createFolder(sku);
  }
  
  var targetSubfolderName = (type === 'review') ? 'review' : 'shop';
  var subfolder;
  var subfolders = skuFolder.getFoldersByName(targetSubfolderName);
  if (subfolders.hasNext()) {
    subfolder = subfolders.next();
  } else {
    subfolder = skuFolder.createFolder(targetSubfolderName);
  }
  
  var file = subfolder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  var fileId = file.getId();
  var imageUrl = 'https://lh3.googleusercontent.com/d/' + fileId;
  
  // Sync ngược vào sheet
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
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
      if (!html) throw new Error('Không fetch được trang Shopee');

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
  return 'Bạn là assistant phân tích trang web bán sách Shopee Việt Nam.\n' +
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
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('books');
  if (!sheet) { ui.alert('Không tìm thấy tab books'); return; }
  
  var rootId = ROOT_FOLDER_ID;
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
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('books');
  if (!sheet) return;

  var rootId = ROOT_FOLDER_ID;
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
// ✍️ Viết review bằng AI
// ================================================================
function generateAIReviews() {
  var ui   = SpreadsheetApp.getUi();
  var ss   = SpreadsheetApp.getActiveSpreadsheet();
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
      var prompt = "Bạn là cô giáo Lê Lê (kênh Lê Lê học tiếng Trung), viết review sách có tâm bằng tiếng Việt, giọng điệu tự nhiên, thân thiện, dễ thương.\n" +
                   "Hãy viết review cho cuốn sách sau:\n" +
                   "Tên sách: " + title + "\n" +
                   "Mô tả cơ bản: " + desc + "\n" +
                   "Tags: " + tags + "\n\n" +
                   "Hãy trả về JSON THUẦN (không markdown, không ```json):\n" +
                   "{\n" +
                   "  \"review\": \"Đoạn review chi tiết khoảng 150-250 từ. Chia sẻ trải nghiệm học thực tế của Lê Lê. Dùng **text** để in đậm. Xuống dòng bằng \\n\\n khi cần.\",\n" +
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
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
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
      var prompt = "Bạn là cô giáo Lê Lê (kênh Lê Lê học tiếng Trung). Hãy viết bài giới thiệu chi tiết cho tài liệu học tiếng Trung này để học sinh đọc và tải tài liệu. Giọng văn phải dễ thương, gần gũi, truyền cảm hứng tự học.\n" +
                   "Thông tin tài liệu:\n" +
                   "Tên tài liệu: " + title + "\n" +
                   "Mô tả: " + desc + "\n" +
                   "Nhóm (vocab/grammar/hsk/writing): " + category + "\n\n" +
                   "Hãy trả về JSON THUẦN (không markdown, không ```json):\n" +
                   "{\n" +
                   "  \"content\": \"Đoạn bài viết giới thiệu chi tiết khoảng 150-300 từ. Chia sẻ kinh nghiệm tại sao tài liệu này quan trọng, học sinh nên học như thế nào. Dùng **text** để in đậm. Xuống dòng bằng \\n\\n khi cần.\",\n" +
                   "  \"pros\": \"3-5 điểm nổi bật nhất của tài liệu, phân cách bằng dấu |. VD: Thiết kế đẹp mắt | Rất dễ hiểu | Có pinyin đầy đủ\",\n" +
                   "  \"cons\": \"1-2 mẹo tự học hiệu quả nhất với tài liệu này, phân cách bằng dấu |. VD: Nên in ra giấy để học | Học kèm file phát âm\",\n" +
                   "  \"who_for\": \"Đối tượng phù hợp nhất. VD: Dành cho người mới bắt đầu học tiếng Trung hoặc ôn thi HSK 1-2.\"\n" +
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

// ── Kéo sách theo SKU ──────────────────────────────────────────
function pullBySkuToBooks() {
  var ss        = SpreadsheetApp.getActiveSpreadsheet();
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

  var ss        = SpreadsheetApp.getActiveSpreadsheet();
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

// ── SETUP ALL ─────────────────────────────────────────────────────
function setupAllSheets() {
  setupAffiliateSheet();
  setupBooksSheet();
  setupDocsSheet();
  setupRequestsSheet();
  setupGuideSheet();
}

function setupAffiliateSheet() {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('docs');
  if (sheet) sheet.clear(); else sheet = ss.insertSheet('docs');
  
  var h = ['id','title','desc','category','icon','icon_color','pages','level','level_text','drive_url','content','pros','cons','who_for','preview_images'];
  var l = ['⭐ ID tài liệu','Tên tài liệu','Mô tả ngắn','Nhóm','Icon','Màu','Thông tin (Trang)','Độ khó (1-5)','Text độ khó','Link Drive','Bài viết (AI)','Điểm nổi bật','Mẹo tự học','Phù hợp với ai','Link ảnh preview'];
  
  sheet.getRange(1,1,1,h.length).setValues([h]);
  sheet.getRange(2,1,1,l.length).setValues([l]);
  sheet.getRange(2,1,1,l.length).setBackground('#0d1f14').setFontColor('#4ecba0').setFontWeight('bold');
  
  var docs = [
    ['DOC-500','500 Từ Vựng Thông Dụng Nhất','Danh sách 500 từ hay gặp nhất trong tiếng Trung hàng ngày, kèm pinyin và nghĩa tiếng Việt. Phù hợp cho người mới bắt đầu.','vocab','📝','#D4A843','PDF · 12 trang','2','Cơ bản · HSK 1–2','https://drive.google.com/LINK_GOOGLE_DRIVE','','','','',''],
    ['DOC-GRAMMAR','Ngữ Pháp Tiếng Trung Cơ Bản','Tổng hợp các cấu trúc ngữ pháp quan trọng nhất, ví dụ minh hoạ rõ ràng bằng tiếng Việt. Học xong nói câu đúng ngay.','grammar','📚','#C94535','PDF · 28 trang','3','Trung cấp · HSK 2–3','https://drive.google.com/LINK_GOOGLE_DRIVE','','','','',''],
    ['DOC-HSK','Đề Thi Thử HSK 1 & 2','Bộ đề thi thử HSK cấp 1 và 2 với đáp án đầy đủ. Luyện xong tự tin thi thật! Lê Lê đã dùng đề này để ôn thi.','hsk','🎯','#3b7fd4','PDF · 35 trang · Có đáp án','2','Cơ bản · HSK 1–2','https://drive.google.com/LINK_GOOGLE_DRIVE','','','','',''],
    ['DOC-WRITING','Bảng Luyện Viết Hán Tự','Tờ luyện viết nét chữ theo ô vuông chuẩn với 100 chữ Hán cơ bản nhất. In ra luyện mỗi ngày giúp nhớ chữ rất nhanh!','writing','✍️','#7c5cbf','PDF · In được','1','Người mới · 100 chữ','https://drive.google.com/LINK_GOOGLE_DRIVE','','','','',''],
    ['DOC-CHUDE','Từ Vựng Theo Chủ Đề','Từ vựng được phân loại theo 15 chủ đề thực tế: gia đình, công việc, du lịch, ăn uống… Học nhanh, nhớ lâu!','vocab','🗂️','#2ea078','PDF · 20 trang','2','Sơ cấp · HSK 1–3','https://drive.google.com/LINK_GOOGLE_DRIVE','','','','',''],
    ['DOC-HSK3','Đề Thi Thử HSK 3','3 đề thi thử HSK 3 đầy đủ các phần nghe – đọc – viết với đáp án chi tiết. Thích hợp ôn luyện trước kỳ thi.','hsk','📋','#3b7fd4','PDF · 42 trang · Có đáp án','3','Trung cấp · HSK 3','https://drive.google.com/LINK_GOOGLE_DRIVE','','','','','']
  ];
  sheet.getRange(3,1,docs.length,h.length).setValues(docs);
  sheet.setFrozenRows(2);
}

function setupGuideSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
  var ss = SpreadsheetApp.getActiveSpreadsheet();
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
