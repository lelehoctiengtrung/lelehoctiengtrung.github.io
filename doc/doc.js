/* ============================================================
   doc.js — Lê Lê Document Post Page
   Load document data từ Google Sheets theo ?id= param
   URL: /doc/doc.html?id=DOC-500
============================================================ */

// ── CONFIG ────────────────────────────────────────────────
const SHEET_ID   = '1b6LNl7JHRiCsjK1w9VuD86GLqAfmSOtDUOm5whrGdH0';
const SHEET_NAME = 'docs';

// Columns in sheet 'docs' (Row 1 = keys, Row 2 = labels, Row 3+ = data)
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

// ---- Fallback data for preview ----
const FALLBACK_DOCS = {
  'DOC-500': {
    id: 'DOC-500',
    title: '500 Từ Vựng Thông Dụng Nhất',
    desc: 'Danh sách 500 từ hay gặp nhất trong tiếng Trung hàng ngày, kèm pinyin và nghĩa tiếng Việt. Phù hợp cho người mới bắt đầu.',
    category: 'vocab',
    icon: '📝',
    icon_color: '#D4A843',
    pages: 'PDF · 12 trang',
    level: '2',
    level_text: 'Cơ bản · HSK 1–2',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE',
    content: 'Khi mới bắt đầu học tiếng Trung, điều khiến nhiều bạn nản nhất chính là việc ghi nhớ từ vựng. Bản thân Lê Lê khi xưa cũng từng loay hoay không biết nên học từ nào trước, từ nào sau.\n\nChính vì vậy, mình đã biên soạn tập tài liệu **500 Từ Vựng Thông Dụng Nhất** này. Đây là tập hợp những từ vựng có tần suất xuất hiện cao nhất trong đời sống thường nhật của người Trung Quốc. Thay vì học lan man những từ chuyên ngành phức tạp, học 500 từ cốt lõi này sẽ giúp bạn hiểu được đến 70% các đoạn hội thoại giao tiếp cơ bản hàng ngày.\n\nMỗi từ vựng đều được Lê Lê ghi rõ chữ Hán giản thể, phiên âm Pinyin chuẩn và nghĩa tiếng Việt dễ hiểu nhất. Hãy in tài liệu này ra hoặc lưu vào máy để học mỗi ngày 10 từ nhé, chỉ sau chưa đầy 2 tháng là vốn từ giao tiếp của bạn đã thay đổi rõ rệt rồi!',
    pros: 'Từ vựng thực tế, tần suất sử dụng cao | Pinyin và nghĩa dịch chuẩn xác | Trình bày thoáng, dễ nhìn',
    cons: 'Chưa có file audio đi kèm phát âm | Cần tự đặt câu để nhớ lâu hơn',
    who_for: 'Phù hợp cho các bạn mới bắt đầu học tiếng Trung (HSK 1-2) hoặc người đi làm muốn tích lũy vốn từ giao tiếp nhanh.',
    preview_images: '../book1.png,../book2.png'
  },
  'DOC-GRAMMAR': {
    id: 'DOC-GRAMMAR',
    title: 'Ngữ Pháp Tiếng Trung Cơ Bản',
    desc: 'Tổng hợp các cấu trúc ngữ pháp quan trọng nhất, ví dụ minh hoạ rõ ràng bằng tiếng Việt. Học xong nói câu đúng ngay.',
    category: 'grammar',
    icon: '📚',
    icon_color: '#C94535',
    pages: 'PDF · 28 trang',
    level: '3',
    level_text: 'Trung cấp · HSK 2–3',
    drive_url: 'https://drive.google.com/LINK_GOOGLE_DRIVE',
    content: 'Tiếng Trung có một câu nói rất hay: "Từ vựng là gạch, ngữ pháp là xi măng". Nếu không có xi măng kết dính, bạn sẽ không bao giờ xây dựng được một câu hoàn chỉnh, dù có sở hữu nhiều gạch đến đâu.\n\nTài liệu **Ngữ Pháp Tiếng Trung Cơ Bản** này chính là cuốn cẩm nang thu nhỏ giúp bạn tổng hợp 30 cấu trúc cốt lõi nhất. Từ cách dùng các giới từ cơ bản, bổ ngữ kết quả, bổ ngữ trạng thái, cho đến các câu so sánh hay câu chữ 把 đều được giải thích vô cùng tường tận.\n\nĐiểm đặc biệt của tài liệu này là Lê Lê luôn đưa ra các ví dụ song ngữ Trung - Việt, dịch nghĩa chi tiết và kèm chú thích về lỗi sai mà các bạn học tiếng Trung tại Việt Nam hay mắc phải do ảnh hưởng của tư duy tiếng Việt. Học xong bộ này, đảm bảo bạn sẽ tự tin viết câu và nói câu chuẩn ngữ pháp bản xứ!',
    pros: 'Giải thích ngữ pháp rất dễ hiểu bằng tiếng Việt | Ví dụ song ngữ phong phú | Có phân biệt các từ dễ nhầm lẫn',
    cons: 'Tài liệu khá nhiều chữ | Cần kiên trì làm thêm bài tập bên ngoài để áp dụng',
    who_for: 'Dành cho các bạn đã có vốn từ vựng cơ bản và muốn học cách ghép câu chính xác (HSK 2-3).',
    preview_images: '../book3.png,../book5.png'
  },
  'DOC-RADICALS': {
    id: 'DOC-RADICALS',
    title: '30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé',
    desc: 'Tài liệu 30 bộ thủ tiếng Trung thông dụng nhất cho các bé, được thiết kế sinh động, nhiều màu sắc và hình minh họa siêu dễ thương!',
    category: 'vocab',
    icon: '🎨',
    icon_color: '#FF7B90',
    pages: 'PDF · 17 trang · Màu sắc',
    level: '1',
    level_text: 'Mầm non & Tiểu học',
    drive_url: 'https://drive.google.com/file/d/1KF_c7CHdSljkl8Rme-C5LZpI0h9XMRAE/view?usp=sharing',
    content: 'Chào các phụ huynh và các bé! Lê Lê đây. Bộ thủ giống như những mảnh ghép logo kỳ diệu, khi ghép chúng lại với nhau sẽ tạo nên các chữ Hán vô cùng sinh động. Nhằm giúp các bé tiếp cận chữ Hán một cách tự nhiên nhất, mình đã thiết kế bộ tài liệu **30 Bộ Thủ Tiếng Trung Thần Kỳ Cho Bé** này.\n\nĐược biên soạn theo phong cách trực quan sinh động với hình minh họa ngộ nghĩnh, màu sắc pastel tươi sáng, các câu đố nhỏ và bài hát/lời gợi ý cực kỳ dễ thương, tài liệu này sẽ biến việc học chữ Hán thành một trò chơi khám phá đầy hấp dẫn. Các con sẽ học được cách liên tưởng bộ thủ với hình dáng thực tế, ví dụ bộ Thủy (nước) giống như 3 giọt nước nhỏ, bộ Mộc (cây) giống như một cái cây xanh tươi... Hãy tải về và in màu để cùng bé luyện tập hàng ngày nhé!',
    pros: 'Thiết kế sinh động, nhiều màu sắc thu hút trẻ nhỏ | Hình minh họa dễ thương, giúp bé ghi nhớ bằng phương pháp liên tưởng hình ảnh | Lời gợi ý (Say to kids) siêu gần gũi và dễ hiểu',
    cons: 'Cần in màu để đạt hiệu quả thị giác tốt nhất | Chưa có file nghe giọng phát âm trực tiếp',
    who_for: 'Dành cho các bé mầm non, học sinh tiểu học mới bắt đầu làm quen với tiếng Trung, hoặc các bậc phụ huynh/giáo viên muốn tìm tài liệu trực quan dạy cho bé.',
    preview_images: '../POSTS/images/DOC-RADICALS_cover_flat.png,../POSTS/images/DOC-RADICALS_page3_flat.png'
  },
  'DOC-STREETFOOD': {
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
    content: 'Khám phá văn hóa ẩm thực đường phố Trung Hoa qua bộ ảnh Infographics sinh động! Từ bánh bao chiên, 章鱼烧 (bánh bạch tuộc) cho đến các món tráng miệng hấp dẫn khác.\n\nMỗi bức ảnh đều được thiết kế trực quan, dễ hiểu, đi kèm phiên âm chuẩn và mẫu câu giao tiếp thông dụng giúp bạn tự tin gọi món khi đi du lịch hoặc ăn uống tại các quán ăn Trung Quốc.',
    pros: 'Hình ảnh minh họa món ăn trực quan sinh động | Từ vựng thực tế và mẫu câu giao tiếp gọi món đi kèm | Định dạng 9:16 tối ưu hiển thị trên điện thoại',
    cons: 'Mới chỉ có 10 món ăn phổ biến, chưa bao quát toàn bộ ẩm thực | Cần tự luyện phát âm để giao tiếp mượt mà hơn',
    who_for: 'Dành cho tất cả các bạn yêu thích ẩm thực, đang học tiếng Trung giao tiếp cơ bản hoặc chuẩn bị đi du lịch Trung Quốc.',
    preview_images: '../POSTS/images/street_food_吉拿棒.png,../POSTS/images/street_food_土耳其烤肉.png,../POSTS/images/street_food_塔可饼.png,../POSTS/images/street_food_意式冰淇淋.png,../POSTS/images/street_food_泰式炒金边粉.png,../POSTS/images/street_food_炸鱼薯条.png,../POSTS/images/street_food_热狗.png,../POSTS/images/street_food_章鱼烧.png,../POSTS/images/street_food_越南夹肉面包.png,../POSTS/images/street_food_辣炒年糕.png'
  },
  'DOC-WORDORDERS': {
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
    content: 'Trật tự từ trong câu (Word Orders) luôn là một trong những chủ đề ngữ pháp gây nhầm lẫn nhất cho người học tiếng Trung tại Việt Nam do sự tương đồng và khác biệt tinh tế giữa hai ngôn ngữ.\n\nBộ ảnh Infographics này tổng hợp các cặp từ dễ gây nhầm lẫn như: 故事 (câu chuyện) vs 事故 (sự cố), 牛奶 (sữa bò) vs 奶牛 (bò sữa), 蜜蜂 (con ong) vs 蜂蜜 (mật ong)... qua hình ảnh so sánh trực quan, dễ nhớ, giúp bạn nắm vững bản chất và tránh các lỗi sai kinh điển khi nói và viết!',
    pros: 'Hình ảnh thiết kế đẹp mắt, so sánh trực quan các cặp từ đảo ngược | Giúp ghi nhớ từ vựng sâu hơn qua việc liên tưởng hình ảnh | Tránh các lỗi sai ngữ pháp và ngữ nghĩa phổ biến',
    cons: 'Tài liệu tập trung vào các cặp từ cụ thể, chưa đi sâu vào ngữ pháp toàn diện | Cần luyện tập đặt câu thực tế',
    who_for: 'Dành cho các bạn đang học tiếng Trung ở mọi trình độ, đặc biệt là những ai hay bị nhầm lẫn trật tự từ hoặc muốn cải thiện tư duy diễn đạt tự nhiên.',
    preview_images: '../POSTS/images/word_order_国外_外国.png,../POSTS/images/word_order_带领_领带.png,../POSTS/images/word_order_报警_警报.png,../POSTS/images/word_order_故事_事故.png,../POSTS/images/word_order_牙刷_刷牙.png,../POSTS/images/word_order_牛奶_奶牛.png,../POSTS/images/word_order_现实_实现.png,../POSTS/images/word_order_盘算_算盘.png,../POSTS/images/word_order_蜜蜂_蜂蜜.png,../POSTS/images/word_order_语法_法语.png,../POSTS/images/word_order_马上_上马.png'
  },
  'DOC-SUMMER': {
    id: 'DOC-SUMMER',
    title: 'Học Tiếng Trung Mùa Hè Cực Vui',
    desc: 'Cẩm nang học tiếng Trung chủ đề mùa hè đầy đủ nhất cho bé: từ vựng thời tiết, bãi biển, các hoạt động trò chơi, bài thơ thiếu nhi và lộ trình 12 tuần cụ thể.',
    category: 'vocab',
    icon: '☀️',
    icon_color: '#FF8A5B',
    pages: 'PDF · 30 trang · Màu sắc',
    level: '1',
    level_text: 'Mầm non & Tiểu học',
    drive_url: '../POSTS/docs/DOC-SUMMER.pdf',
    content: 'Chào mừng các bé và phụ huynh đến với **Cẩm Nang Học Tiếng Trung Mùa Hè Cực Vui**! Mùa hè là khoảng thời gian lý tưởng để con học ngôn ngữ mà không gặp áp lực bài vở ở trường.\n\nTài liệu này biên soạn đầy đủ mọi thứ ba mẹ cần: các từ vựng thời tiết và bãi biển quen thuộc hằng ngày, bài thơ thiếu nhi "Trùng Trùng Phi" nhịp điệu sinh động, hoạt động bán kem Gelato nhập vai lý thú và lộ trình 12 tuần cụ thể để con làm quen với 72 từ vựng cốt lõi. Tài liệu được thiết kế theo phong cách ngộ nghĩnh, sticker viền đậm dễ thương kích thích thị giác của trẻ.\n\nBa mẹ hãy in màu khổ giấy A4 để con chơi các trò chơi Scavenger Hunt ngoài trời, tô màu theo chữ số Hán và đánh dấu hành trình 30 ngày kiên trì tự học nhé!',
    pros: 'Thiết kế sticker viền đậm ngộ nghĩnh, màu sắc pastel thu hút trẻ em | Nội dung dịch nghĩa Việt-Trung chuẩn kèm pinyin | Lộ trình 12 tuần thiết lập thói quen học tập nhẹ nhàng hằng ngày',
    cons: 'Để đạt hiệu quả tốt nhất cần in màu trên giấy dày | Cần ba mẹ đồng hành chỉ dẫn các hoạt động ngoài trời',
    who_for: 'Dành cho các bé từ 3-10 tuổi (mầm non & tiểu học) mới làm quen với chữ Hán, hoặc ba mẹ/giáo viên muốn tìm tài liệu trực quan, chơi mà học.',
    preview_images: '../POSTS/images/DOC-SUMMER_cover.png,../POSTS/images/DOC-SUMMER_page3.png,../POSTS/images/DOC-SUMMER_page7.png'
  },
  'DOC-COSO1': {
    id: 'DOC-COSO1',
    title: 'Hán Ngữ Cơ Sở 1',
    desc: 'Cẩm nang tự học tiếng Trung nhập môn từ con số 0: tổng hợp phát âm Pinyin, quy tắc viết chữ Hán và các mẫu câu giao tiếp cơ bản nhất.',
    category: 'vocab',
    icon: '📖',
    icon_color: '#4ECCA3',
    pages: 'PDF · 20 trang · Tổng hợp',
    level: '2',
    level_text: 'Nhập môn · HSK 1',
    drive_url: 'https://drive.google.com/file/d/1Lhsm9Te8njkIGDMFzajOlAgriAFXUm0G/view?usp=sharing',
    content: 'Tự học tiếng Trung từ con số 0 có khó không? Đó là câu hỏi mà Lê Lê nhận được nhiều nhất từ các bạn mới bắt đầu. Sự thật là, nếu có một lộ trình khoa học và một cuốn tài liệu hướng dẫn chi tiết ngay từ những bước đi đầu tiên, bạn hoàn toàn có thể tự làm chủ ngôn ngữ này!\n\nTập tài liệu **Hán Ngữ Cơ Sở 1** này được biên soạn để trở thành người bạn đồng hành tin cậy cho bạn. Nội dung tập trung hoàn toàn vào nền tảng cơ bản nhất:\n- **Phần 1 - Pinyin phát âm**: Hướng dẫn chi tiết cách đọc các nguyên âm (vận mẫu), phụ âm (thanh mẫu) và 4 thanh điệu chính kèm theo quy tắc biến điệu quan trọng.\n- **Phần 2 - Bút thuận & Luyện viết**: Tổng hợp các nét vẽ cơ bản nhất của chữ Hán, thứ tự viết các nét và hệ thống ô ly Mễ Tự (米字格) chuẩn kèm chữ mẫu mờ để bạn có thể in ra luyện viết tay ngay lập tức.\n- **Phần 3 - Giao tiếp nhập môn**: Cung cấp các từ vựng và câu nói thông dụng nhất cho việc chào hỏi, giới thiệu bản thân, cảm ơn, xin lỗi...\n\nCuốn sách được trình bày trực quan, ngắn gọn, lược bỏ những lý thuyết rườm rà để bạn học nhanh nhất, nhớ lâu nhất và có thể ứng dụng giao tiếp ngay lập tức.',
    pros: 'Trình bày cực kỳ trực quan, khoa học, dễ học cho người tự học từ con số 0 | Đầy đủ kiến thức nhập môn từ phát âm Pinyin, bút thuận chữ Hán đến giao tiếp cơ bản | Có ô ly Mễ Tự (米字格) chuẩn kèm chữ mẫu nét mờ để luyện viết tay dễ dàng',
    cons: 'Tài liệu tập trung vào nhập môn cơ bản, chưa đi sâu vào các cấu trúc phức tạp | Cần kết hợp xem thêm video hướng dẫn phát âm để sửa giọng chuẩn nhất',
    who_for: 'Dành cho các bạn mới bắt đầu học tiếng Trung từ con số 0, muốn xây dựng nền tảng vững chắc về phát âm, viết chữ Hán và các mẫu câu giao tiếp cơ bản.',
    preview_images: '../POSTS/images/DOC-COSO1_cover_flat.png,../POSTS/images/DOC-COSO1_page3_flat.png,../POSTS/images/DOC-COSO1_page8_flat.png'
  }
};

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  let docId = new URLSearchParams(window.location.search).get('id');
  if (!docId) {
    // default to first doc for preview
    docId = 'DOC-500';
  }
  loadDoc(docId);
});

// ── Load từ Google Sheets ─────────────────────────────────
async function loadDoc(docId) {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&headers=2`;
    const res = await fetch(url);
    const raw = await res.text();

    const match = raw.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if (!match) throw new Error('Invalid response');
    const data = JSON.parse(match[1]);

    parseAndRender(data, docId);
  } catch (err) {
    console.warn('Google Sheets loading failed. Using fallback doc.', err);
    const fallback = FALLBACK_DOCS[docId.toUpperCase()];
    if (fallback) {
      renderDoc(fallback);
    } else {
      showError();
    }
  }
}

// --- Helpers for column parsing & ID inference ------------
function inferId(title, index) {
  if (!title) return `DOC-ROW-${index}`;
  const t = title.toUpperCase();
  if (t.includes('500')) return 'DOC-500';
  if (t.includes('NGỮ PHÁP') || t.includes('GRAMMAR')) return 'DOC-GRAMMAR';
  if (t.includes('BỘ THỦ') || t.includes('RADICAL') || t.includes('THỦ')) return 'DOC-RADICALS';
  if (t.includes('MÙA HÈ') || t.includes('SUMMER')) return 'DOC-SUMMER';
  if (t.includes('CƠ SỞ 1') || t.includes('HÁN NGỮ 1') || t.includes('BASIC CHINESE 1')) return 'DOC-COSO1';
  return `DOC-ROW-${index}`;
}

// ── Parse GViz response ───────────────────────────────────
function parseAndRender(data, targetId) {
  try {
    const rows = data.table.rows;
    if (!rows || rows.length === 0) {
      throw new Error('No rows found');
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
    colMap.content = -1;
    colMap.pros = -1;
    colMap.cons = -1;
    colMap.who_for = -1;
    colMap.preview_images = -1;

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
      else if (label.includes('content') || label.includes('bài viết')) colMap.content = index;
      else if (label.includes('pros') || label.includes('điểm nổi bật')) colMap.pros = index;
      else if (label.includes('cons') || label.includes('mẹo tự học')) colMap.cons = index;
      else if (label.includes('who_for') || label.includes('phù hợp')) colMap.who_for = index;
      else if (label.includes('preview_images') || label.includes('link ảnh')) colMap.preview_images = index;
      else if (label.includes('id') || label.includes('id tài liệu')) colMap.id = index;
    });

    const getVal = (r, colIdx, fallbackVal = '') => {
      if (colIdx === undefined || colIdx < 0 || !r.c) return fallbackVal;
      const cell = r.c[colIdx];
      const val = (cell && cell.v != null) ? String(cell.v).trim() : '';
      return val || fallbackVal;
    };

    // Find row by comparing id or inferred id
    let matchedRow = null;
    let matchedIndex = -1;

    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      const titleVal = getVal(r, colMap.title);
      let idVal = '';
      if (colMap.id !== -1) {
        idVal = getVal(r, colMap.id);
      }
      if (!idVal) {
        idVal = inferId(titleVal, i);
      }
      if (idVal.toUpperCase() === targetId.toUpperCase()) {
        matchedRow = r;
        matchedIndex = i;
        break;
      }
    }

    const fallback = FALLBACK_DOCS[targetId.toUpperCase()];

    if (!matchedRow) {
      if (fallback) {
        renderDoc(fallback);
      } else {
        showError();
      }
      return;
    }

    const get = (col, fallbackVal = '') => {
      return getVal(matchedRow, col, fallbackVal);
    };

    renderDoc({
      id:             (colMap.id !== -1 ? get(colMap.id) : '') || fallback?.id || targetId,
      title:          get(colMap.title, fallback?.title),
      desc:           get(colMap.desc, fallback?.desc),
      category:       get(colMap.category, fallback?.category),
      icon:           get(colMap.icon, fallback?.icon),
      icon_color:     get(colMap.icon_color, fallback?.icon_color),
      pages:          get(colMap.pages, fallback?.pages),
      level:          get(colMap.level, fallback?.level),
      level_text:     get(colMap.level_text, fallback?.level_text),
      drive_url:      get(colMap.drive_url, fallback?.drive_url),
      content:        get(colMap.content, fallback?.content),
      pros:           get(colMap.pros, fallback?.pros),
      cons:           get(colMap.cons, fallback?.cons),
      who_for:        get(colMap.who_for, fallback?.who_for),
      preview_images: get(colMap.preview_images, fallback?.preview_images),
    });
  } catch (e) {
    console.error('Parse error doc details:', e);
    showError();
  }
}

// ── Render page ───────────────────────────────────────────
function renderDoc(doc) {
  // SEO
  const pageTitle = `${doc.title} – Tài liệu Lê Lê học tiếng Trung`;
  document.title = pageTitle;
  setMeta('og-title', pageTitle);
  setMeta('og-desc',  doc.desc || '');
  
  // Parse preview images for og-image
  const previewUrls = doc.preview_images ? doc.preview_images.split(',').map(u => u.trim()).filter(Boolean) : [];
  if (previewUrls.length > 0) {
    setMeta('og-image', previewUrls[0]);
  }

  // Hero Info
  const iconBadge = document.getElementById('doc-icon-badge');
  iconBadge.textContent = doc.icon || '📝';
  iconBadge.style.setProperty('--c', doc.icon_color || '#D4A843');
  
  const catEl = document.getElementById('doc-category');
  catEl.textContent = getCategoryLabel(doc.category);
  catEl.className = `doc-category-badge ${doc.category || 'vocab'}`;
  
  document.getElementById('doc-pages-badge').textContent = doc.pages || 'PDF';
  document.getElementById('doc-title').textContent = doc.title;
  document.getElementById('doc-desc').textContent = doc.desc;
  
  // Level dots
  const levelNum = parseInt(doc.level) || 2;
  const levelTextEl = document.getElementById('doc-level-text');
  levelTextEl.textContent = doc.level_text || 'Cơ bản';
  
  const dotsContainer = document.getElementById('doc-difficulty');
  dotsContainer.innerHTML = '';
  for (let d = 1; d <= 5; d++) {
    const dot = document.createElement('span');
    dot.className = d <= levelNum ? 'level-dot' : 'level-dot empty';
    dotsContainer.appendChild(dot);
  }
  dotsContainer.appendChild(levelTextEl);

  // CTAs
  const dlBtn = document.getElementById('btn-download');
  const dlBtnBottom = document.getElementById('btn-download-bottom');
  dlBtn.href = doc.drive_url || '#';
  dlBtnBottom.href = doc.drive_url || '#';

  const lang = window.i18n ? window.i18n.currentLang : 'vi';
  const ctaNote = document.querySelector('.cta-note');
  
  if (doc.category === 'infographics') {
    dlBtn.style.display = 'none';
    if (dlBtnBottom) {
      const bCta = dlBtnBottom.closest('.doc-bottom-cta');
      if (bCta) bCta.style.display = 'none';
    }
    if (ctaNote) {
      ctaNote.textContent = {
        vi: 'Học trực quan qua hình ảnh, chia sẻ cho bạn bè cùng học nhé! 💚',
        en: 'Visual learning via images, share it with your friends! 💚',
        zh: '通过图表直观学习，分享给朋友一起学吧！💚'
      }[lang] || 'Học trực quan qua hình ảnh, chia sẻ cho bạn bè cùng học nhé! 💚';
    }
  } else {
    dlBtn.style.display = '';
    if (dlBtnBottom) {
      const bCta = dlBtnBottom.closest('.doc-bottom-cta');
      if (bCta) bCta.style.display = '';
    }
    
    const dlText = {
      vi: 'Tải PDF ngay',
      en: 'Download PDF',
      zh: '下载PDF'
    }[lang] || 'Tải PDF ngay';
    
    const dlSpan = dlBtn.querySelector('span');
    if (dlSpan) dlSpan.textContent = dlText;
    const dlBottomSpan = dlBtnBottom.querySelector('span');
    if (dlBottomSpan) dlBottomSpan.textContent = dlText;

    if (ctaNote) {
      ctaNote.textContent = {
        vi: 'Tải về trực tiếp từ Google Drive, học được trên điện thoại & máy tính.',
        en: 'Download directly from Google Drive, learn on phones & computers.',
        zh: '从 Google Drive 直接下载，可在手机和电脑上学习。'
      }[lang] || 'Tải về trực tiếp từ Google Drive, học được trên điện thoại & máy tính.';
    }
  }

  // Content grid class for infographics layout
  const contentGrid = document.querySelector('.doc-content-grid');
  if (contentGrid) {
    // Remove any previous doc-id classes
    contentGrid.className = contentGrid.className.split(' ').filter(c => !c.startsWith('doc-id-')).join(' ');

    if (doc.category === 'infographics') {
      contentGrid.classList.add('is-infographics');
      contentGrid.classList.add(`doc-id-${doc.id.toLowerCase()}`);
    } else {
      contentGrid.classList.remove('is-infographics');
    }
  }

  // Share action
  const shareBtn = document.getElementById('btn-share');
  shareBtn.dataset.title = doc.title;
  shareBtn.dataset.url = window.location.href;

  // Post body content
  const contentEl = document.getElementById('doc-content-body');
  contentEl.innerHTML = doc.content
    ? formatText(doc.content)
    : `<em style="opacity:.5">Bài giới thiệu chi tiết đang được cập nhật… 🌸</em>`;

  // Pros (Highlights)
  const prosList = document.getElementById('doc-pros');
  if (doc.pros) {
    prosList.innerHTML = doc.pros.split('|').filter(Boolean)
      .map(p => `<li>${p.trim()}</li>`).join('');
  } else {
    prosList.closest('.pros-box').style.display = 'none';
  }

  // Cons (Tips)
  const consList = document.getElementById('doc-cons');
  if (doc.cons) {
    consList.innerHTML = doc.cons.split('|').filter(Boolean)
      .map(c => `<li>${c.trim()}</li>`).join('');
  } else {
    consList.closest('.cons-box').style.display = 'none';
  }

  // Target audience
  const whoEl = document.getElementById('doc-who-for');
  if (doc.who_for) {
    whoEl.textContent = doc.who_for;
  } else {
    whoEl.closest('.doc-target').style.display = 'none';
  }

  // Preview Gallery
  renderPreviewGallery(doc.preview_images, doc.category === 'infographics');

  // Render cross-sell recommendation
  renderRecommendation(doc);

  // Setup click listeners
  setupInteractions();

  // Show
  document.getElementById('doc-loading').classList.add('hidden');
  document.getElementById('doc-main').classList.remove('hidden');
}

// ── Render Preview Gallery ──────────────────────────────────
function renderPreviewGallery(previewImagesStr, isInfographics) {
  const galleryEl = document.getElementById('doc-gallery');
  if (!galleryEl) return;

  if (!previewImagesStr || !previewImagesStr.trim()) {
    galleryEl.style.display = 'none';
    return;
  }

  const urls = previewImagesStr.split(',').map(u => u.trim()).filter(Boolean);
  if (!urls.length) { galleryEl.style.display = 'none'; return; }

  const lang = window.i18n ? window.i18n.currentLang : 'vi';
  const titleText = isInfographics
    ? ({ vi: 'Bộ ảnh Infographics', en: 'Infographics Gallery', zh: '信息图集' }[lang] || 'Bộ ảnh Infographics')
    : ({ vi: 'Trang xem trước', en: 'Preview Pages', zh: '预览页面' }[lang] || 'Trang xem trước');

  galleryEl.innerHTML = `
    <div class="section-pill"><span>📸</span> ${titleText}</div>
    <div class="gallery-grid" id="gallery-grid">
      ${urls.map((url, i) => `
        <button class="gallery-thumb" onclick="openLightbox(${i})"
                aria-label="Xem trang ${i+1}">
          <img src="${url}" alt="Ảnh xem trước trang ${i+1}" loading="lazy" />
        </button>`).join('')}
    </div>
  `;

  // Store urls for lightbox
  window._galleryUrls = urls;
}

// ── Lightbox ──────────────────────────────────────────────
window.openLightbox = function(index) {
  const urls = window._galleryUrls || [];
  if (!urls.length) return;

  // Create lightbox markup dynamically if it doesn't exist
  let lb = document.getElementById('rv-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'rv-lightbox';
    lb.innerHTML = `
      <div class="lb-backdrop" onclick="closeLightbox()"></div>
      <div class="lb-content">
        <button class="lb-close" onclick="closeLightbox()" aria-label="Đóng">✕</button>
        <button class="lb-prev"  onclick="shiftLightbox(-1)" aria-label="Ảnh trước">‹</button>
        <img id="lb-img" src="" alt="Ảnh phóng to" />
        <button class="lb-next"  onclick="shiftLightbox(1)"  aria-label="Ảnh tiếp">›</button>
        <p class="lb-counter" id="lb-counter"></p>
      </div>`;
    document.body.appendChild(lb);
  }

  window._lbIndex = index;
  updateLightbox();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
};

window.updateLightbox = function() {
  const urls  = window._galleryUrls || [];
  const i     = window._lbIndex;
  document.getElementById('lb-img').src         = urls[i];
  document.getElementById('lb-counter').textContent = `${i + 1} / ${urls.length}`;
};

window.shiftLightbox = function(dir) {
  const urls = window._galleryUrls || [];
  window._lbIndex = (window._lbIndex + dir + urls.length) % urls.length;
  updateLightbox();
};

window.closeLightbox = function() {
  const lb = document.getElementById('rv-lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
};

// Keyboard nav for lightbox
document.addEventListener('keydown', e => {
  const lb = document.getElementById('rv-lightbox');
  if (lb && lb.classList.contains('open')) {
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   shiftLightbox(-1);
    if (e.key === 'ArrowRight')  shiftLightbox(1);
  }
});

// ── Setup Interactions ────────────────────────────────────
function setupInteractions() {
  const toast    = document.getElementById('share-toast');
  const toastMsg = document.getElementById('toast-msg');

  function showToast(msg) {
    toastMsg.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2800);
  }

  // Share buttons action
  const shareBtn = document.getElementById('btn-share');
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const title = shareBtn.dataset.title || 'Tài liệu tiếng Trung';
      const url   = shareBtn.dataset.url   || window.location.href;
      const text  = `📚 "${title}" — tài liệu học tiếng Trung miễn phí cực hay từ Lê Lê học tiếng Trung!`;

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
        showToast('✅ Đã sao chép link chia sẻ bài viết!');
      } catch {
        window.prompt('Sao chép link này:', url);
      }
    });
  }

  // Ripples on download buttons
  document.querySelectorAll('.btn-download').forEach(btn => {
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

  // Inject keyframe style for ripple
  if (!document.getElementById('docs-ripple-style')) {
    const style = document.createElement('style');
    style.id = 'docs-ripple-style';
    style.textContent = `@keyframes ripple-docs { to { transform:scale(1); opacity:0; } }`;
    document.head.appendChild(style);
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

function formatText(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br>');
}

function setMeta(id, content) {
  const el = document.getElementById(id);
  if (el) el.setAttribute('content', content);
}

function showError() {
  document.getElementById('doc-loading').classList.add('hidden');
  document.getElementById('doc-error').classList.remove('hidden');
}

// Watch language change event to trigger re-render
window.addEventListener('langChanged', () => {
  let docId = new URLSearchParams(window.location.search).get('id');
  if (!docId) {
    docId = 'DOC-500';
  }
  loadDoc(docId);
});

// Map Document ID to Recommended Book SKU
const DOC_BOOK_MAP = {
  'DOC-500': 'SPE-0001',
  'DOC-GRAMMAR': 'SACH-005',
  'DOC-RADICALS': 'SACH-004',
  'DOC-STREETFOOD': 'SACH-003',
  'DOC-WORDORDERS': 'SACH-005',
};

// Render cross-sell book recommendation
async function renderRecommendation(doc) {
  const section = document.getElementById('doc-recommendation-section');
  if (!section) return;

  const sku = DOC_BOOK_MAP[doc.id];
  if (!sku) {
    section.classList.add('hidden');
    return;
  }

  const booksUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=books&headers=2`;
  
  // Local fallbacks matching shop.js
  const FALLBACK_BOOKS = {
    'SACH-001': { title: 'Giáo Trình Hán Ngữ', desc: 'Standard Chinese textbook, complete with Pinyin and exercises.', cover_url: '../book1.png', buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY', tags: 'Người mới, HSK 1–3' },
    'SACH-002': { title: '3000 Từ Vựng HSK', desc: 'Toàn bộ từ vựng HSK 1–6 theo chủ đề, có câu ví dụ thực tế.', cover_url: '../book2.png', buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY', tags: 'Luyện thi, HSK 1–6' },
    'SACH-003': { title: 'Hội Thoại Tiếng Trung Thực Dụng', desc: 'Các tình huống giao tiếp thực tế hàng ngày, nói được ngay.', cover_url: '../book3.png', buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY', tags: 'Giao tiếp, Thực dụng' },
    'SACH-004': { title: 'Tập Viết Chữ Hán Căn Bản', desc: 'Sách tập viết chữ Hán có ô ly Mễ tự tiêu chuẩn giúp viết chữ chuẩn đẹp.', cover_url: '../book4.png', buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY', tags: 'Luyện viết, Chữ Hán' },
    'SACH-005': { title: 'Ngữ Pháp Tiếng Trung Dễ Hiểu', desc: 'Tổng hợp ngữ pháp từ cơ bản đến nâng cao bằng sơ đồ tư duy trực quan.', cover_url: '../book5.png', buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY', tags: 'Ngữ pháp, Sơ đồ tư duy' },
    'SPE-0001': { title: 'Vở Tập Viết HSK 1 Thông Minh (Tự Bay Mực)', desc: 'Ghi nhớ 150 từ vựng cốt lõi. Bút thông minh tự bay mực sau 10 phút để viết lại!', cover_url: '../spe0001.png', buy_shopee: 'https://s.shopee.vn/AUrLPSQfFo', tags: 'Luyện viết, HSK 1, Bộ thủ' }
  };

  let book = FALLBACK_BOOKS[sku];

  try {
    const res = await fetch(booksUrl);
    const text = await res.text();
    const match = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if (match) {
      const data = JSON.parse(match[1]);
      const rows = data?.table?.rows;
      if (rows) {
        const skuColIndex = 0; // sku is col 0
        const row = rows.find(r => {
          const cell = r.c[skuColIndex];
          return cell && String(cell.v).trim() === sku;
        });
        if (row) {
          const colVal = (r, idx, fallback) => {
            const c = r.c[idx];
            const val = c && c.v !== null && c.v !== undefined ? String(c.v).trim() : '';
            return val || fallback;
          };
          book = {
            title: colVal(row, 2, book.title),
            desc: colVal(row, 4, book.desc),
            cover_url: colVal(row, 10, book.cover_url),
            buy_shopee: colVal(row, 11, book.buy_shopee),
            tags: colVal(row, 5, book.tags)
          };
        }
      }
    }
  } catch (e) {
    console.warn("Failed to fetch live book, using fallback:", e);
  }

  if (!book) return;

  const tagsHtml = book.tags ? book.tags.split(',').map(t => `<span class="rec-book-tag">${t.trim()}</span>`).join('') : '';
  const reviewUrl = `../review/review.html?sku=${encodeURIComponent(sku)}`;
  
  const lang = window.i18n ? window.i18n.currentLang : 'vi';
  const isVi = lang === 'vi';
  const recHeading = isVi ? "Lê Lê khuyên dùng kèm tài liệu này" : "Recommended for this document";
  const readReviewTxt = isVi ? "Xem Review Chi Tiết" : "Read Review";
  const buyTxt = isVi ? "Mua Tại Shopee" : "Buy on Shopee";

  let coverSrc = book.cover_url;
  if (coverSrc && !coverSrc.startsWith('http') && !coverSrc.startsWith('..')) {
    coverSrc = `../${coverSrc}`;
  }

  // Check if Shopee URL is placeholder
  const isRealShopee = book.buy_shopee && 
    !book.buy_shopee.includes('LINK_AFFILIATE') && 
    !book.buy_shopee.includes('THAY_VAO_DAY');

  section.innerHTML = `
    <div class="rec-title-wrap">
      <span class="rec-badge">💡 Recommendation</span>
      <h3 class="rec-heading" id="doc-rec-heading">${recHeading}</h3>
    </div>
    <div class="rec-book-card">
      <img src="${coverSrc}" alt="${book.title}" class="rec-book-cover" />
      <div class="rec-book-info">
        <h4 class="rec-book-title">${book.title}</h4>
        <p class="rec-book-desc">${book.desc}</p>
        <div class="rec-book-meta">${tagsHtml}</div>
        <div class="rec-book-actions">
          <a href="${reviewUrl}" class="btn-rec-review">${readReviewTxt} →</a>
          ${isRealShopee ? `<a href="${book.buy_shopee}" class="btn-rec-buy" target="_blank" rel="noopener sponsored">🛒 ${buyTxt}</a>` : ''}
        </div>
      </div>
    </div>
  `;
  section.classList.remove('hidden');
}
