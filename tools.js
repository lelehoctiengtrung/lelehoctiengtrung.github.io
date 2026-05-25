/* ============================================================
   tools.js — Lê Lê Chinese Learning Tools Hub Controller
   Generates live previews and builds print-ready A4 worksheets.
   ============================================================ */

import { PINYIN_DICT } from './write/write.js';

// ── COLOR CONFIGURATION ──────────────────────────────────────────────
const COLOR_MAP = {
  red: '#C94535',
  gold: '#D4A843',
  gray: '#555555'
};

// ── SVG GRID GENERATOR ───────────────────────────────────────────────
function drawGridCellSVG(gridType, colorHex, character = '', isTrace = false) {
  const lineStrokeDash = "3,3";
  const miziLineStrokeDash = "4,4";
  
  let diagonals = '';
  if (gridType === 'mizi') {
    diagonals = `
      <line x1="0" y1="0" x2="100" y2="100" stroke="${colorHex}" stroke-width="0.5" stroke-dasharray="${miziLineStrokeDash}" />
      <line x1="100" y1="0" x2="0" y2="100" stroke="${colorHex}" stroke-width="0.5" stroke-dasharray="${miziLineStrokeDash}" />
    `;
  }
  
  let charOverlay = '';
  if (character && isTrace) {
    charOverlay = `<div class="grid-char-trace">${character}</div>`;
  }

  return `
    <div class="grid-svg-wrapper">
      <svg viewBox="0 0 100 100">
        <!-- Outer border -->
        <rect x="0" y="0" width="100" height="100" fill="none" stroke="${colorHex}" stroke-width="1.5"/>
        <!-- Cross dashed lines (Tianzi Ge) -->
        <line x1="0" y1="50" x2="100" y2="50" stroke="${colorHex}" stroke-width="0.8" stroke-dasharray="${lineStrokeDash}"/>
        <line x1="50" y1="0" x2="50" y2="100" stroke="${colorHex}" stroke-width="0.8" stroke-dasharray="${lineStrokeDash}"/>
        ${diagonals}
      </svg>
      ${charOverlay}
    </div>
  `;
}

// ── LIVE PREVIEW BUILDER ─────────────────────────────────────────────
function updatePreview() {
  const textInput = document.getElementById('char-input').value;
  const styleElement = document.querySelector('input[name="sheet-style"]:checked');
  const style = styleElement ? styleElement.value : 'trace';
  const gridType = document.getElementById('grid-type').value;
  const gridColor = document.getElementById('grid-color').value;
  const title = document.getElementById('title-input').value;
  const subtitle = document.getElementById('subtitle-input').value;
  
  // Update Header & Footer
  document.getElementById('preview-sheet-title').textContent = title || 'PHIẾU TẬP VIẾT CHỮ HÁN';
  document.getElementById('preview-sheet-subtitle').textContent = subtitle || '';

  const gridBody = document.getElementById('preview-grid-body');
  if (!gridBody) return;
  gridBody.innerHTML = '';

  const colorHex = COLOR_MAP[gridColor] || '#C94535';

  if (style === 'blank') {
    // 5 Rows of blank grids for preview
    for (let r = 0; r < 5; r++) {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'sheet-row';
      
      const cellsDiv = document.createElement('div');
      cellsDiv.className = 'cells-row';
      
      for (let c = 0; c < 12; c++) {
        cellsDiv.innerHTML += drawGridCellSVG(gridType, colorHex);
      }
      rowDiv.appendChild(cellsDiv);
      gridBody.appendChild(rowDiv);
    }
  } else if (style === 'trace') {
    // Trace outline mode
    const cleanChars = textInput.replace(/[^\u4e00-\u9fa5]/g, '').split('');
    const charsToShow = cleanChars.slice(0, 5); // Limit preview

    if (charsToShow.length === 0) {
      gridBody.innerHTML = '<p class="placeholder-text">Nhập chữ Hán ở bên để xem trước mẫu phiếu vẽ.</p>';
      return;
    }

    charsToShow.forEach(char => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'sheet-row';

      const pinyinRow = document.createElement('div');
      pinyinRow.className = 'pinyin-row';
      const py = PINYIN_DICT[char] || '';
      pinyinRow.innerHTML = `<span class="pinyin-cell-text">${py}</span>`;
      rowDiv.appendChild(pinyinRow);

      const cellsDiv = document.createElement('div');
      cellsDiv.className = 'cells-row';
      
      for (let c = 0; c < 12; c++) {
        const isTrace = c < 3;
        cellsDiv.innerHTML += drawGridCellSVG(gridType, colorHex, char, isTrace);
      }
      rowDiv.appendChild(cellsDiv);
      gridBody.appendChild(rowDiv);
    });
    
    if (cleanChars.length > 5) {
      gridBody.innerHTML += `
        <p style="font-size: 0.65rem; color: #888; text-align: center; font-style: italic; margin-top: 5px;">
          ... và ${cleanChars.length - 5} chữ khác sẽ được tự động in trên các trang tiếp theo ...
        </p>
      `;
    }
  } else if (style === 'pinyin') {
    // Pinyin dictation sheets
    const words = textInput.split(/[\s,，.。!！?？;；]+/);
    const validWords = words.map(w => w.replace(/[^\u4e00-\u9fa5]/g, '')).filter(w => w.length > 0);
    const wordsToShow = validWords.slice(0, 5);

    if (wordsToShow.length === 0) {
      gridBody.innerHTML = '<p class="placeholder-text">Nhập từ vựng ở bên để tạo đề kiểm tra Pinyin.</p>';
      return;
    }

    wordsToShow.forEach(word => {
      const rowDiv = document.createElement('div');
      rowDiv.className = 'sheet-row';

      const pinyinRow = document.createElement('div');
      pinyinRow.className = 'pinyin-row';

      const cellsDiv = document.createElement('div');
      cellsDiv.className = 'cells-row';

      const chars = word.split('');
      chars.forEach(char => {
        const py = PINYIN_DICT[char] || '';
        pinyinRow.innerHTML += `<span class="pinyin-cell-text">${py}</span>`;
      });
      rowDiv.appendChild(pinyinRow);

      for (let c = 0; c < 12; c++) {
        cellsDiv.innerHTML += drawGridCellSVG(gridType, colorHex);
      }
      rowDiv.appendChild(cellsDiv);
      gridBody.appendChild(rowDiv);
    });

    if (validWords.length > 5) {
      gridBody.innerHTML += `
        <p style="font-size: 0.65rem; color: #888; text-align: center; font-style: italic; margin-top: 5px;">
          ... và ${validWords.length - 5} từ khác sẽ được tự động in trên các trang tiếp theo ...
        </p>
      `;
    }
  }
}

// ── PRINT DOCUMENT GENERATOR ─────────────────────────────────────────
function printWorksheet() {
  const textInput = document.getElementById('char-input').value;
  const styleElement = document.querySelector('input[name="sheet-style"]:checked');
  const style = styleElement ? styleElement.value : 'trace';
  const gridType = document.getElementById('grid-type').value;
  const gridColor = document.getElementById('grid-color').value;
  const title = document.getElementById('title-input').value || 'PHIẾU TẬP VIẾT CHỮ HÁN';
  const subtitle = document.getElementById('subtitle-input').value || '';
  
  const colorHex = COLOR_MAP[gridColor] || '#C94535';

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert("Vui lòng cho phép trình duyệt mở tab mới để in phiếu!");
    return;
  }

  let rowsHtml = '';

  if (style === 'blank') {
    // 12 rows fills A4 perfectly
    for (let r = 0; r < 12; r++) {
      let cellsHtml = '';
      for (let c = 0; c < 12; c++) {
        cellsHtml += drawGridCellSVG(gridType, colorHex);
      }
      rowsHtml += `
        <div class="sheet-row">
          <div class="cells-row">${cellsHtml}</div>
        </div>
      `;
    }
  } else if (style === 'trace') {
    const cleanChars = textInput.replace(/[^\u4e00-\u9fa5]/g, '').split('');
    if (cleanChars.length === 0) {
      alert("Vui lòng nhập ít nhất 1 chữ Hán để tạo phiếu!");
      printWindow.close();
      return;
    }

    cleanChars.forEach(char => {
      const py = PINYIN_DICT[char] || '';
      let cellsHtml = '';
      for (let c = 0; c < 12; c++) {
        const isTrace = c < 3;
        cellsHtml += drawGridCellSVG(gridType, colorHex, char, isTrace);
      }
      rowsHtml += `
        <div class="sheet-row">
          <div class="pinyin-row"><span class="pinyin-cell-text">${py}</span></div>
          <div class="cells-row">${cellsHtml}</div>
        </div>
      `;
    });
  } else if (style === 'pinyin') {
    const words = textInput.split(/[\s,，.。!！?？;；]+/);
    const validWords = words.map(w => w.replace(/[^\u4e00-\u9fa5]/g, '')).filter(w => w.length > 0);
    if (validWords.length === 0) {
      alert("Vui lòng nhập ít nhất 1 từ vựng Hán tự để tạo đề kiểm tra!");
      printWindow.close();
      return;
    }

    validWords.forEach(word => {
      const chars = word.split('');
      let pinyinCellsHtml = '';
      chars.forEach(char => {
        const py = PINYIN_DICT[char] || '';
        pinyinCellsHtml += `<span class="pinyin-cell-text">${py}</span>`;
      });

      let cellsHtml = '';
      for (let c = 0; c < 12; c++) {
        cellsHtml += drawGridCellSVG(gridType, colorHex);
      }

      rowsHtml += `
        <div class="sheet-row">
          <div class="pinyin-row">${pinyinCellsHtml}</div>
          <div class="cells-row">${cellsHtml}</div>
        </div>
      `;
    });
  }

  // Draw full document markup and styles
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>${title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Serif+SC:wght@400;700&display=swap" rel="stylesheet">
        <style>
          @page {
            size: A4;
            margin: 15mm;
          }
          body {
            font-family: 'Inter', sans-serif;
            color: #222;
            background: #fff;
            margin: 0;
            padding: 0;
            line-height: 1.4;
          }
          .sheet-container {
            display: flex;
            flex-direction: column;
            min-height: 100%;
          }
          .sheet-header {
            border-bottom: 2px solid #222;
            padding-bottom: 10px;
            margin-bottom: 25px;
          }
          .sheet-header h1 {
            font-family: 'Noto Serif SC', serif;
            font-size: 1.6rem;
            font-weight: 700;
            text-align: center;
            margin: 0 0 10px 0;
            letter-spacing: 1px;
            color: #000;
          }
          .sheet-info-fields {
            display: flex;
            justify-content: space-between;
            font-size: 0.85rem;
            font-weight: 600;
            color: #444;
          }
          .sheet-grid-body {
            display: flex;
            flex-direction: column;
            gap: 16px;
            flex: 1;
          }
          .sheet-row {
            display: flex;
            flex-direction: column;
            gap: 4px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
          .pinyin-row {
            display: flex;
            gap: 6px;
            font-size: 0.9rem;
            font-weight: 600;
            color: #111;
            height: 18px;
            align-items: center;
            padding-left: 2px;
          }
          .pinyin-cell-text {
            width: 48px;
            text-align: center;
            flex-shrink: 0;
          }
          .cells-row {
            display: flex;
            gap: 6px;
          }
          .grid-svg-wrapper {
            width: 48px;
            height: 48px;
            position: relative;
            flex-shrink: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .grid-svg-wrapper svg {
            width: 100%;
            height: 100%;
            display: block;
          }
          .grid-char-trace {
            position: absolute;
            font-family: 'Noto Serif SC', serif;
            font-size: 32px;
            font-weight: 400;
            color: rgba(0,0,0,0.18) !important;
            pointer-events: none;
            user-select: none;
          }
          .sheet-footer {
            text-align: center;
            font-size: 0.75rem;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 10px;
            margin-top: 30px;
            page-break-inside: avoid;
            break-inside: avoid;
          }
        </style>
      </head>
      <body>
        <div class="sheet-container">
          <div class="sheet-header">
            <h1>${title}</h1>
            <div class="sheet-info-fields">
              <span>Họ và tên: ........................................................................</span>
              <span>Ngày: ...../...../20...</span>
            </div>
          </div>
          
          <div class="sheet-grid-body">
            ${rowsHtml}
          </div>
          
          <div class="sheet-footer">
            ${subtitle}
          </div>
        </div>
        <script>
          window.focus();
          setTimeout(function() {
            window.print();
          }, 800);
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// ── EVENT BINDINGS ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Initial render
  updatePreview();

  // Listeners for configuration updates
  const formInputs = [
    'char-input', 'grid-type', 'grid-color', 'title-input', 'subtitle-input'
  ];
  formInputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', updatePreview);
    }
  });

  // Radio listener
  document.querySelectorAll('input[name="sheet-style"]').forEach(radio => {
    radio.addEventListener('change', updatePreview);
  });

  // Print button
  const printBtn = document.getElementById('btn-print');
  if (printBtn) {
    printBtn.addEventListener('click', printWorksheet);
  }

  // Presets buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.text;
      const input = document.getElementById('char-input');
      if (input) {
        input.value = text;
        updatePreview();
      }
    });
  });
});
