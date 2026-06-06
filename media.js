// ============================================================
// media.js — Video Lessons Page Logic
// Predefined local video database, inline player & pagination
// ============================================================

const SHEET_ID   = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o';
const SHEET_NAME = 'media';
const PAGE_SIZE = 8; // Số lượng video trên mỗi trang (2 hàng, mỗi hàng 4 video trên desktop)

// ---- Predefined Video Database (Offline & Instant Load) ----
const ALL_VIDEOS = [
  // ============================================================
  // 1. Lê Lê kể chữ
  // ============================================================
  {
    id: 'ycoBAmSHaIk',
    title_zh: '老',
    title_vi: 'Lão - Người già chống gậy bước đi',
    youtube_url: 'https://www.youtube.com/shorts/ycoBAmSHaIk',
    category: 'Lê Lê kể chữ',
    desc: 'Giải thích nguồn gốc chữ Lão hình ảnh người già chống gậy.',
    order: 1
  },
  {
    id: 'GRCVyX1NVKc',
    title_zh: '汉',
    title_vi: 'Hán - Đôi tay xây nghiệp bên dòng Hán',
    youtube_url: 'https://www.youtube.com/shorts/GRCVyX1NVKc',
    category: 'Lê Lê kể chữ',
    desc: 'Ý nghĩa chữ Hán từ đôi tay đắp đê sông Hán.',
    order: 2
  },
  {
    id: 'DrGtgLX5B38',
    title_zh: '尖',
    title_vi: 'Tiêm - Đầu nhỏ thân to tạo mũi nhọn',
    youtube_url: 'https://www.youtube.com/shorts/DrGtgLX5B38',
    category: 'Lê Lê kể chữ',
    desc: 'Chữ Tiêm ghép từ chữ Tiểu (nhỏ) và Đại (to).',
    order: 3
  },
  {
    id: 'yPB0kkFBfDA',
    title_zh: '喜',
    title_vi: 'Hỷ - Kẻ sĩ mở miệng ca hát mừng hỷ',
    youtube_url: 'https://www.youtube.com/shorts/yPB0kkFBfDA',
    category: 'Lê Lê kể chữ',
    desc: 'Chữ Hỷ tượng trưng cho niềm vui và may mắn.',
    order: 4
  },
  {
    id: 'LRSlWafLcdc',
    title_zh: '名',
    title_vi: 'Danh - Gọi tên nhau trong đêm tối',
    youtube_url: 'https://www.youtube.com/shorts/LRSlWafLcdc',
    category: 'Lê Lê kể chữ',
    desc: 'Chữ Danh ghép từ chữ Tịch (tối) và Khẩu (miệng).',
    order: 5
  },
  {
    id: 'gcdxpViyblE',
    title_zh: '衣',
    title_vi: 'Y - Chiếc áo dài cổ xòe rộng tà',
    youtube_url: 'https://www.youtube.com/shorts/gcdxpViyblE',
    category: 'Lê Lê kể chữ',
    desc: 'Nguồn gốc tượng hình của chữ Y (trang phục).',
    order: 6
  },
  {
    id: 'q_9fy1F5vbE',
    title_zh: '家',
    title_vi: 'Gia - Nuôi lợn dưới mái nhà ấm no',
    youtube_url: 'https://www.youtube.com/shorts/q_9fy1F5vbE',
    category: 'Lê Lê kể chữ',
    desc: 'Chữ Gia gồm bộ Miên (mái nhà) và chữ Thỉ (con heo).',
    order: 7
  },
  {
    id: 'jMB51QqslDU',
    title_zh: '女',
    title_vi: 'Nữ - Người phụ nữ quỳ gối cung kính',
    youtube_url: 'https://www.youtube.com/shorts/jMB51QqslDU',
    category: 'Lê Lê kể chữ',
    desc: 'Hình ảnh tượng hình chữ Nữ thời cổ đại.',
    order: 8
  },
  {
    id: 'OqhxB504-u8',
    title_zh: '休',
    title_vi: 'Hưu - Người mệt mỏi tựa gốc cây nghỉ mát',
    youtube_url: 'https://www.youtube.com/shorts/OqhxB504-u8',
    category: 'Lê Lê kể chữ',
    desc: 'Chữ Hưu ghép từ chữ Nhân (người) và Mộc (cây).',
    order: 9
  },
  {
    id: 'tSqPD1uCg2Y',
    title_zh: '水',
    title_vi: 'Thủy - Dòng sông chảy xiết tung bọt trắng',
    youtube_url: 'https://www.youtube.com/shorts/tSqPD1uCg2Y',
    category: 'Lê Lê kể chữ',
    desc: 'Hình tượng dòng chảy nước tự nhiên của chữ Thủy.',
    order: 10
  },
  {
    id: 's1WhwmGbo_s',
    title_zh: '不',
    title_vi: 'Bất - Rễ cây bị nhổ không thể mọc',
    youtube_url: 'https://www.youtube.com/shorts/s1WhwmGbo_s',
    category: 'Lê Lê kể chữ',
    desc: 'Nguồn gốc hình tượng chữ Bất thời cổ đại.',
    order: 11
  },
  {
    id: '5i27wCursTA',
    title_zh: '东',
    title_vi: 'Đông - Mặt trời mọc sau bao tải hàng',
    youtube_url: 'https://www.youtube.com/shorts/5i27wCursTA',
    category: 'Lê Lê kể chữ',
    desc: 'Giải nghĩa chữ Đông tượng trưng cho hướng mặt trời mọc.',
    order: 12
  },
  {
    id: 'Mx6Svocgil4',
    title_zh: '车',
    title_vi: 'Xa - Chiếc xe cổ nhìn từ trên cao',
    youtube_url: 'https://www.youtube.com/shorts/Mx6Svocgil4',
    category: 'Lê Lê kể chữ',
    desc: 'Hình dáng chiếc xe ngựa cổ nhìn từ trên xuống.',
    order: 13
  },
  {
    id: 'DBvjz-UjKcs',
    title_zh: '对',
    title_vi: 'Đối - Dùng tay đo đạc chuẩn xác',
    youtube_url: 'https://www.youtube.com/shorts/DBvjz-UjKcs',
    category: 'Lê Lê kể chữ',
    desc: 'Nguồn gốc chữ Đối trong tiếng Trung.',
    order: 14
  },
  {
    id: 'lg4m_lqlQac',
    title_zh: '机',
    title_vi: 'Cơ - Cỗ máy gỗ vận hành thời cơ',
    youtube_url: 'https://www.youtube.com/shorts/lg4m_lqlQac',
    category: 'Lê Lê kể chữ',
    desc: 'Giải nghĩa chữ Cơ ghép từ bộ Mộc và chữ Kỷ.',
    order: 15
  },
  {
    id: 'yVobRj4s42M',
    title_zh: '会',
    title_vi: 'Hội - Mọi người tụ họp bàn luận kiến thức',
    youtube_url: 'https://www.youtube.com/shorts/yVobRj4s42M',
    category: 'Lê Lê kể chữ',
    desc: 'Nguồn gốc cấu tạo chữ Hội thời cổ đại.',
    order: 16
  },
  {
    id: 'sK3g_j5PN3A',
    title_zh: '服',
    title_vi: 'Phục - Đôi tay khoác áo cho người quỳ',
    youtube_url: 'https://www.youtube.com/shorts/sK3g_j5PN3A',
    category: 'Lê Lê kể chữ',
    desc: 'Hình tượng mặc phục trang cung kính thời cổ.',
    order: 17
  },
  {
    id: 'GTXKMZugW-M',
    title_zh: '谁',
    title_vi: 'Thùy - Cất tiếng hỏi tên chú chim nhỏ',
    youtube_url: 'https://www.youtube.com/shorts/GTXKMZugW-M',
    category: 'Lê Lê kể chữ',
    desc: 'Giải thích nguồn gốc chữ Thùy dùng để hỏi.',
    order: 18
  },
  {
    id: 'EXHGG43gVlk',
    title_zh: '馆',
    title_vi: 'Quán - Nơi quan dừng chân ăn uống',
    youtube_url: 'https://www.youtube.com/shorts/EXHGG43gVlk',
    category: 'Lê Lê kể chữ',
    desc: 'Giải nghĩa chữ Quán (nơi ăn ở, hội quán).',
    order: 19
  },
  {
    id: 'cJ7U9Olpx7U',
    title_zh: '晶',
    title_vi: 'Tinh - Ba mặt trời cùng tỏa sáng lấp lánh',
    youtube_url: 'https://www.youtube.com/shorts/cJ7U9Olpx7U',
    category: 'Lê Lê kể chữ',
    desc: 'Giải nghĩa chữ Tinh gồm ba chữ Nhật xếp lại.',
    order: 20
  },

  // ============================================================
  // 2. Tiếng lóng (Slang)
  // ============================================================
  {
    id: 'K-vukz9rtow',
    title_zh: '破防',
    title_vi: 'Phá phòng - Phá vỡ phòng ngự tâm lý',
    youtube_url: 'https://www.youtube.com/shorts/K-vukz9rtow',
    category: 'Tiếng lóng',
    desc: 'Từ lóng chỉ trạng thái tâm lý bị tổn thương, sụp đổ.',
    order: 1
  },
  {
    id: 'IpskgDTghTI',
    title_zh: '社牛',
    title_vi: 'Xã ngưu - Hội chứng tự tin giao tiếp',
    youtube_url: 'https://www.youtube.com/shorts/IpskgDTghTI',
    category: 'Tiếng lóng',
    desc: 'Từ lóng khen người cực kỳ tự tin, hoạt bát chốn đông người.',
    order: 2
  },

  // ============================================================
  // 3. Song đấu từ vựng
  // ============================================================
  {
    id: 'Xn5vOa08y5k',
    title_zh: '二 vs 两',
    title_vi: 'Phân biệt Nhị và Lưỡng khi đếm số',
    youtube_url: 'https://www.youtube.com/shorts/Xn5vOa08y5k',
    category: 'Song đấu từ vựng',
    desc: 'Mẹo phân biệt cách dùng Nhị và Lưỡng cực nhanh.',
    order: 1
  },
  {
    id: '1H-cK5L3XwQ',
    title_zh: '一点儿 vs 有点儿',
    title_vi: 'Phân biệt cách nói Một chút',
    youtube_url: 'https://www.youtube.com/shorts/1H-cK5L3XwQ',
    category: 'Song đấu từ vựng',
    desc: 'Phân biệt ngữ pháp chỉ mức độ ít dễ nhầm lẫn.',
    order: 2
  },

  // ============================================================
  // 4. Tiếng Trung thực chiến
  // ============================================================
  {
    id: 'IppkMx_ep6g',
    title_zh: '健身房登记',
    title_vi: 'Giao tiếp Đăng ký tập gym',
    youtube_url: 'https://www.youtube.com/shorts/IppkMx_ep6g',
    category: 'Tiếng Trung thực chiến',
    desc: 'Mẫu câu đàm thoại đăng ký tại phòng gym.',
    order: 1
  },
  {
    id: '2QZ4Sw0hrUI',
    title_zh: '兑换外币',
    title_vi: 'Giao tiếp Đổi tiền ngoại tệ',
    youtube_url: 'https://www.youtube.com/shorts/2QZ4Sw0hrUI',
    category: 'Tiếng Trung thực chiến',
    desc: 'Hội thoại giao tiếp thực tế khi đổi tiền.',
    order: 2
  },
  {
    id: 'Kp1j5TqeI38',
    title_zh: '请假',
    title_vi: 'Giao tiếp Xin nghỉ phép',
    youtube_url: 'https://www.youtube.com/shorts/Kp1j5TqeI38',
    category: 'Tiếng Trung thực chiến',
    desc: 'Mẫu câu xin nghỉ phép văn phòng lịch sự.',
    order: 3
  },
  {
    id: 'hizk3Fro9JQ',
    title_zh: '退货退款',
    title_vi: 'Giao tiếp Trả hàng hoàn tiền',
    youtube_url: 'https://www.youtube.com/shorts/hizk3Fro9JQ',
    category: 'Tiếng Trung thực chiến',
    desc: 'Mẫu câu khiếu nại trả hàng mua sắm.',
    order: 4
  },
  {
    id: 'ys2Qxpz9cPM',
    title_zh: 'Nhờ chụp ảnh',
    title_vi: 'Giao tiếp Nhờ chụp ảnh giúp',
    youtube_url: 'https://www.youtube.com/shorts/ys2Qxpz9cPM',
    category: 'Tiếng Trung thực chiến',
    desc: 'Hội thoại nhờ vả chụp ảnh khi đi du lịch.',
    order: 5
  },
  {
    id: 'Pkj1cLfuhGg',
    title_zh: 'Đón taxi',
    title_vi: 'Giao tiếp Đón taxi trên đường',
    youtube_url: 'https://www.youtube.com/shorts/Pkj1cLfuhGg',
    category: 'Tiếng Trung thực chiến',
    desc: 'Hội thoại giao tiếp đón xe taxi phổ thông.',
    order: 6
  },
  {
    id: 'dxyWVUi7YdQ',
    title_zh: 'Gặp bạn cũ',
    title_vi: 'Giao tiếp Gặp gỡ bạn cũ lâu năm',
    youtube_url: 'https://www.youtube.com/shorts/dxyWVUi7YdQ',
    category: 'Tiếng Trung thực chiến',
    desc: 'Hội thoại xã giao khi vô tình gặp lại bạn cũ.',
    order: 7
  },
  {
    id: 'aUMowaLuS3Y',
    title_zh: 'Hỏi thăm sức khỏe',
    title_vi: 'Giao tiếp Hỏi thăm sức khỏe xã giao',
    youtube_url: 'https://www.youtube.com/shorts/aUMowaLuS3Y',
    category: 'Tiếng Trung thực chiến',
    desc: 'Cách hỏi thăm sức khỏe thông thường và lịch sự.',
    order: 8
  },
  {
    id: 'S4v2kkTVGHk',
    title_zh: 'Đặt phòng khách sạn',
    title_vi: 'Giao tiếp Đặt phòng khách sạn trực tiếp',
    youtube_url: 'https://www.youtube.com/shorts/S4v2kkTVGHk',
    category: 'Tiếng Trung thực chiến',
    desc: 'Mẫu câu hội thoại nhận phòng và đặt phòng.',
    order: 9
  },

  // ============================================================
  // 5. Thành ngữ
  // ============================================================
  {
    id: 'BxC4vGPwt6s',
    title_zh: '胸有成竹',
    title_vi: 'Hung hữu thành trúc - Trong lòng đã có tre',
    youtube_url: 'https://www.youtube.com/shorts/BxC4vGPwt6s',
    category: 'Thành ngữ',
    desc: 'Thành ngữ ví von việc đã có kế hoạch sẵn sàng và tự tin.',
    order: 1
  },
  {
    id: 'lwiZmQ04gWI',
    title_zh: '叶公好龙',
    title_vi: 'Diệp Công hiếu long - Yêu thích giả tạo',
    youtube_url: 'https://www.youtube.com/shorts/lwiZmQ04gWI',
    category: 'Thành ngữ',
    desc: 'Câu chuyện châm biếm người ngoài miệng thì thích nhưng thực tế lại sợ.',
    order: 2
  },
  {
    id: 'E9XS8J52fjo',
    title_zh: '刻舟求剑',
    title_vi: 'Khắc chu cầu kiếm - Khắc thuyền tìm kiếm',
    youtube_url: 'https://www.youtube.com/shorts/E9XS8J52fjo',
    category: 'Thành ngữ',
    desc: 'Bài học phê phán những người ngoan cố, cứng nhắc không biết biến đổi.',
    order: 3
  },
  {
    id: 'ebPSABEdUMI',
    title_zh: '掩耳盗铃',
    title_vi: 'Yểm nhĩ đạo linh - Bịt tai trộm chuông',
    youtube_url: 'https://www.youtube.com/shorts/ebPSABEdUMI',
    category: 'Thành ngữ',
    desc: 'Chỉ hành vi tự lừa mình dối người, trốn tránh thực tại.',
    order: 4
  },
  {
    id: 'A0VwRz8IGno',
    title_zh: '自相矛盾',
    title_vi: 'Tự tương mâu thuẫn - Tự mâu thuẫn',
    youtube_url: 'https://www.youtube.com/shorts/A0VwRz8IGno',
    category: 'Thành ngữ',
    desc: 'Chỉ lời nói hoặc hành động trước sau không nhất quán.',
    order: 5
  },
  {
    id: 'Xxzo0rprdQc',
    title_zh: '井底之蛙',
    title_vi: 'Tỉnh để chi oa - Con ếch ngồi đáy giếng',
    youtube_url: 'https://www.youtube.com/shorts/Xxzo0rprdQc',
    category: 'Thành ngữ',
    desc: 'Chỉ những người tầm nhìn hạn hẹp nhưng lại tự phụ.',
    order: 6
  },
  {
    id: 'eDap3fEhWrA',
    title_zh: '指鹿为马',
    title_vi: 'Chỉ lộc vi mã - Chỉ hươu bảo ngựa',
    youtube_url: 'https://www.youtube.com/shorts/eDap3fEhWrA',
    category: 'Thành ngữ',
    desc: 'Chỉ hành vi đổi trắng thay đen, uy quyền ép bức người khác.',
    order: 7
  },
  {
    id: '55PH0e1jm2w',
    title_zh: '愚公移山',
    title_vi: 'Ngu Công di sơn - Ngu Công dời núi',
    youtube_url: 'https://www.youtube.com/shorts/55PH0e1jm2w',
    category: 'Thành ngữ',
    desc: 'Biểu trưng cho ý chí kiên trì, bền bỉ vượt qua khó khăn.',
    order: 8
  },
  {
    id: '2JoOBSlNib4',
    title_zh: '狐假虎威',
    title_vi: 'Hồ giả hổ uy - Cáo mượn oai hùm',
    youtube_url: 'https://www.youtube.com/shorts/2JoOBSlNib4',
    category: 'Thành ngữ',
    desc: 'Chỉ kẻ dựa hơi người có quyền thế để bắt nạt kẻ yếu.',
    order: 9
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

// --- Category Normalizer to map sheet values to exact tabs ─
function normalizeCategory(cat) {
  if (!cat) return 'Tiếng Trung thực chiến';
  const c = cat.toLowerCase();
  if (c.includes('kể chữ') || c.includes('câu chuyện chữ') || c.includes('bộ thủ')) {
    return 'Lê Lê kể chữ';
  }
  if (c.includes('slang') || c.includes('tiếng lóng') || c.includes('lóng')) {
    return 'Tiếng lóng';
  }
  if (c.includes('vs') || c.includes('phân biệt') || c.includes('song đấu')) {
    return 'Song đấu từ vựng';
  }
  if (c.includes('thực chiến') || c.includes('giao tiếp') || c.includes('thực tế')) {
    return 'Tiếng Trung thực chiến';
  }
  if (c.includes('thành ngữ') || c.includes('idiom')) {
    return 'Thành ngữ';
  }
  return 'Tiếng Trung thực chiến';
}

// --- Title Parser to split Chinese (top) and Vietnamese (bottom) ───
function parseTitle(rawTitle) {
  if (!rawTitle) return { zh: '', vi: '' };

  let title = rawTitle;

  // Extract Chinese characters (excluding standard punctuation and Latin alphabet)
  const zhMatch = title.match(/[\u4e00-\u9fa5]+/g);
  let zh = '';
  if (zhMatch) {
    zh = zhMatch.join(' ');
  }

  // Strip hashtags
  title = title.replace(/#\w+/g, '');

  // Remove parentheses characters but keep contents
  title = title.replace(/[\(\)\[\]\{\}（）]/g, '');

  // Remove common prefixes
  title = title.replace(/(Câu chuyện chữ|Hội thoại|Giải nghĩa|Giới thiệu câu chuyện|Học chữ Hán qua chữ|Ngữ cảnh)\s*[\-\:]\s*/gi, '');

  // Remove extracted Chinese characters from Vietnamese title
  if (zhMatch) {
    zhMatch.forEach(c => {
      title = title.replace(new RegExp(c, 'g'), '');
    });
  }

  // Remove quotes
  title = title.replace(/[\"\'“”‘’«»]/g, '');

  // Clean up dashes, colons, and spaces
  title = title.replace(/\s*[\-\:]\s*$/, ''); // trailing dashes
  title = title.replace(/^\s*[\-\:]\s*/, ''); // leading dashes
  title = title.replace(/\s+/g, ' ').trim();

  // Capitalize first letter
  if (title) {
    title = title.charAt(0).toUpperCase() + title.slice(1);
  }

  // Edge cases adjustment
  if (rawTitle.includes('二') && rawTitle.includes('两')) {
    zh = '二 vs 两';
    title = 'Phân biệt Nhị và Lưỡng khi đếm số';
  }
  if (rawTitle.includes('一点儿') && rawTitle.includes('有点儿')) {
    zh = '一点儿 vs 有点儿';
    title = 'Phân biệt cách nói Một chút';
  }

  return { zh, vi: title };
}

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
      const rawCategory = getVal(colMap.category, 'Tiếng Trung thực chiến');
      const category = normalizeCategory(rawCategory);
      const desc = getVal(colMap.desc);
      const order = parseInt(getVal(colMap.order, String(rowIndex))) || rowIndex;

      return { id, title, youtube_url, category, desc, order };
    }).filter(Boolean);

    if (sheetVideos.length > 0) {
      // Merge sheet videos with the predefined local database by youtube_url
      sheetVideos.forEach(sv => {
        const svId = getYouTubeId(sv.youtube_url);
        if (!svId) return;
        const idx = ALL_VIDEOS.findIndex(v => getYouTubeId(v.youtube_url) === svId);
        if (idx !== -1) {
          // Update keeping the local details if sheet has placeholders
          ALL_VIDEOS[idx] = { ...ALL_VIDEOS[idx], ...sv };
        } else {
          ALL_VIDEOS.push(sv);
        }
      });
      
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
    // Draw hqdefault immediately to avoid empty/spinner state
    const cachedThumb = thumbCache[youtubeId] || `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;

    let zh = video.title_zh || '';
    let vi = video.title_vi || '';
    if (!zh && video.title) {
      const parsed = parseTitle(video.title);
      zh = parsed.zh;
      vi = parsed.vi;
    }

    card.innerHTML = `
      <div class="video-thumb-wrap" id="${thumbWrapId}">
        <img src="${cachedThumb}" alt="${zh}" loading="lazy" />
        <div class="video-play-overlay">
          <div class="play-btn-circle" aria-label="Phát video">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      <div class="video-info">
        <h3 class="video-card-title-zh">${zh}</h3>
        <p class="video-card-title-vi">${vi}</p>
      </div>
    `;

    grid.appendChild(card);

    const thumbWrap = document.getElementById(thumbWrapId);
    if (thumbWrap) {
      // Inline playing trigger
      thumbWrap.addEventListener('click', (e) => {
        e.stopPropagation();
        playVideoInline(video, youtubeId, card, thumbWrap);
      });
    }

    // Asynchronously check and upgrade to maxresdefault if available
    upgradeToMaxResThumbnail(youtubeId, thumbWrapId);
  }

  renderPagination(totalPages);
}

// --- Asynchronously upgrade thumbnail to maxresdefault if available ───
function upgradeToMaxResThumbnail(videoId, wrapId) {
  if (!videoId) return;
  if (thumbCache[videoId]) return; // already upgraded/checked
  
  const maxres = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  const img = new Image();
  img.onload = () => {
    if (img.width !== 120 || img.height !== 90) {
      const wrap = document.getElementById(wrapId);
      if (wrap) {
        const imgEl = wrap.querySelector('img');
        if (imgEl) {
          imgEl.src = maxres;
          thumbCache[videoId] = maxres;
        }
      }
    }
  };
  img.src = maxres;
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

  let zh = video.title_zh || '';
  if (!zh && video.title) {
    const parsed = parseTitle(video.title);
    zh = parsed.zh;
  }

  thumbWrap.innerHTML = `
    <img src="${cachedThumb}" alt="${zh}" loading="lazy" />
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
