/* ============================================================
   review.js — Lê Lê Book Review Page
   Load book data từ Google Sheets theo ?sku= param
   URL: /review/review.html?sku=SACH-001
============================================================ */

// ── CONFIG ────────────────────────────────────────────────
const SHEET_ID   = '1n62ZrrUJlnf8CDU2gSxW3jPCxdkwE1GFpBBDJQLEg0o';
const SHEET_NAME = 'books';

// Columns trong tab books (row 1 = keys, row 2 = labels, row 3+ = data)
const COL = {
  sku:            0,
  order:          1,
  title:          2,
  subtitle_zh:    3,
  desc:           4,
  tags:           5,
  price:          6,
  badge:          7,
  badge_type:     8,
  stars:          9,
  cover_url:      10,
  buy_shopee:     11,
  buy_fahasa:     12,
  buy_tiki:       13,
  buy_lazada:     14,
  review:         15,
  pros:           16,
  cons:           17,
  who_for:        18,
  shop_images:    19,
  review_images:  20,
  sku_folder_url: 21,
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
    cover_url: '../book1.png',
    buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY',
    buy_fahasa: 'https://www.fahasa.com/',
    buy_tiki: 'https://tiki.vn/',
    buy_lazada: 'https://www.lazada.vn/',
    review: 'Giáo trình Hán ngữ là bộ sách kinh điển mà hầu như bất kỳ ai bắt đầu học tiếng Trung cũng đều biết tới. Bản thân Lê Lê khi mới chập chững tự học cũng đã cày nát bộ này.\n\nĐiểm mình thích nhất ở bộ sách này là phần giải thích ngữ pháp rất dễ hiểu bằng tiếng Việt, hệ thống từ vựng đi từ dễ đến khó và có phiên âm Pinyin cực kỳ chuẩn xác. Cuốn sách giúp bạn xây dựng nền tảng phát âm và từ vựng cực kỳ vững chắc ngay từ những bài đầu tiên.\n\nTuy nhiên, sách cũng có điểm trừ nhỏ là phần hình ảnh minh họa không được bắt mắt lắm, chủ yếu là chữ. Để học tốt nhất, các bạn nên kết hợp nghe file âm thanh (audio) đi kèm để luyện phát âm chuẩn nhé!',
    pros: 'Ngữ pháp giải thích siêu chi tiết | Hệ thống bài tập phong phú | Phù hợp tự học tại nhà',
    cons: 'Hình ảnh minh họa hơi đơn giản | Không kèm CD vật lý (phải quét mã tải app)',
    who_for: 'Phù hợp cho các bạn tự học từ con số 0, hoặc chuẩn bị thi HSK 1-3.',
    review_images: '../book1.png',
    sku_folder_url: 'https://drive.google.com/drive/folders/1gP-4vafPZiuHXAz6Zup0vboUK9D1llfC'
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
    cover_url: '../book2.png',
    buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY',
    buy_fahasa: 'https://www.fahasa.com/',
    buy_tiki: 'https://tiki.vn/',
    buy_lazada: 'https://www.lazada.vn/',
    review: 'Nếu mục tiêu của bạn là chinh phục kỳ thi HSK từ cấp 1 đến cấp 6 thì cuốn 3000 Từ Vựng HSK này chính là trợ thủ đắc lực không thể thiếu. Cuốn sách hệ thống hóa từ vựng một cách khoa học theo từng cấp độ.\n\nMỗi từ vựng đều đi kèm phiên âm, dịch nghĩa chi tiết và đặc biệt là có ví dụ minh họa thực tế. Việc học từ vựng qua câu ví dụ giúp Lê Lê nhớ lâu hơn gấp 3 lần so với việc học vẹt từ đơn lẻ.\n\nLưu ý là lượng kiến thức trong sách rất lớn, các bạn nên chia nhỏ mục tiêu học mỗi ngày khoảng 10-15 từ, kết hợp làm Flashcard để ôn tập nhé!',
    pros: 'Đầy đủ từ vựng HSK 1-6 | Có câu ví dụ thực tế cho mỗi từ | Trình bày rõ ràng, dễ tra cứu',
    cons: 'Sách khá dày và nặng | Không có hình minh họa sinh động',
    who_for: 'Dành cho các bạn đang ôn luyện thi HSK từ cấp 1 đến cấp 6.',
    review_images: '../book2.png',
    sku_folder_url: 'https://drive.google.com/drive/folders/1gP-4vafPZiuHXAz6Zup0vboUK9D1llfC'
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
    cover_url: '../book3.png',
    buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY',
    buy_fahasa: 'https://www.fahasa.com/',
    buy_tiki: 'https://tiki.vn/',
    buy_lazada: 'https://www.lazada.vn/',
    review: 'Học tiếng Trung mà không nói được thì thật là đáng tiếc đúng không nào? Cuốn Hội Thoại Tiếng Trung Thực Dụng tập trung hoàn toàn vào việc giúp bạn giao tiếp tự nhiên trong cuộc sống hàng ngày.\n\nSách gồm nhiều chủ đề gần gũi như mua sắm, hỏi đường, đặt bàn ăn, đi du lịch... Lê Lê cực kỳ thích phần hội thoại mẫu vì ngôn từ rất hiện đại, giống hệt cách người bản xứ nói chuyện ngoài đời thường, không bị cứng nhắc như sách giáo khoa.\n\nCác bạn nên luyện tập bằng cách nói to theo file nghe mẫu để cải thiện ngữ điệu và phản xạ giao tiếp nhé!',
    pros: 'Chủ đề giao tiếp cực kỳ thực tế | Ngôn từ tự nhiên, hiện đại | Kèm file nghe giọng đọc chuẩn',
    cons: 'Hơi ít bài tập ngữ pháp chuyên sâu',
    who_for: 'Phù hợp cho các bạn muốn cải thiện kỹ năng giao tiếp phản xạ, nói tiếng Trung tự nhiên.',
    review_images: '../book3.png',
    sku_folder_url: 'https://drive.google.com/drive/folders/1gP-4vafPZiuHXAz6Zup0vboUK9D1llfC'
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
    cover_url: '../book4.png',
    buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY',
    buy_fahasa: 'https://www.fahasa.com/',
    buy_tiki: 'https://tiki.vn/',
    buy_lazada: 'https://www.lazada.vn/',
    review: 'Viết chữ Hán luôn là một thử thách lớn đối với người mới bắt đầu. Cuốn sách này sinh ra để giúp bạn vượt qua nỗi sợ đó một cách dễ dàng nhất.\n\nSách cung cấp hướng dẫn quy tắc bút thuận cực kỳ chi tiết cho từng chữ Hán cơ bản. Việc có sẵn các đường kẻ ô chữ Mễ giúp bạn căn chỉnh vị trí các nét vẽ một cách cân đối và đẹp mắt nhất. Lê Lê thích nhất là chất giấy dày dặn của cuốn này, viết bằng bút mực hay bút gel đều không bị thấm sang trang sau đâu nhé!\n\nLời khuyên từ Lê Lê là mỗi ngày bạn hãy dành khoảng 15-20 phút tập viết thong thả, đừng vội vã. Vừa viết vừa nhẩm nghĩa và cách đọc sẽ giúp bạn ghi nhớ mặt chữ lâu hơn đấy!',
    pros: 'Giấy dày dặn chất lượng cao | Hướng dẫn thứ tự nét cực kỳ rõ ràng | Có ô ly Mễ tự chuẩn',
    cons: 'Không kèm video hướng dẫn viết (phải tự quét QR Code xem thêm)',
    who_for: 'Thích hợp cho các bạn mới học muốn luyện viết chữ Hán cân đối và đẹp ngay từ đầu.',
    review_images: '../book4.png',
    sku_folder_url: 'https://drive.google.com/drive/folders/1gP-4vafPZiuHXAz6Zup0vboUK9D1llfC'
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
    cover_url: '../book5.png',
    buy_shopee: 'https://shope.ee/LINK_AFFILIATE_THAY_VAO_DAY',
    buy_fahasa: 'https://www.fahasa.com/',
    buy_tiki: 'https://tiki.vn/',
    buy_lazada: 'https://www.lazada.vn/',
    review: 'Ngữ pháp tiếng Trung thực ra không quá phức tạp nếu bạn biết cách tiếp cận bằng tư duy hình ảnh. Cuốn sách này thay thế những trang định nghĩa dài dòng bằng các sơ đồ tư duy (mindmap) vô cùng trực quan.\n\nMỗi cấu trúc ngữ pháp đều được phân tích theo công thức rõ ràng, có so sánh giữa các điểm ngữ pháp dễ nhầm lẫn và bài tập thực hành ứng dụng ngay lập tức. Lê Lê đã dùng cuốn này để hệ thống lại toàn bộ kiến thức trước kỳ thi HSK và thực sự thấy nó hiệu quả vô cùng.\n\nĐiểm cộng lớn là sách in màu toàn bộ, phân chia khu vực chú thích rất thông minh giúp mắt không bị mỏi khi học liên tục.',
    pros: 'Trình bày bằng sơ đồ tư duy trực quan | In màu toàn bộ sắc nét | Phân tích sâu các lỗi sai thường gặp',
    cons: 'Giá thành cao hơn một chút so với các sách đen trắng thông thường',
    who_for: 'Cực kỳ hữu ích cho những ai đang bị rối về ngữ pháp hoặc cần hệ thống hóa kiến thức nhanh chóng.',
    review_images: '../book5.png',
    sku_folder_url: 'https://drive.google.com/drive/folders/1gP-4vafPZiuHXAz6Zup0vboUK9D1llfC'
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
    cover_url: 'https://lh3.googleusercontent.com/d/1rPxtUMrULM4aSyqYOMNqIbQanEoMoc13',
    buy_shopee: 'https://s.shopee.vn/AUrLPSQfFo',
    buy_fahasa: '',
    buy_tiki: '',
    buy_lazada: '',
    review: 'Chào các bạn! Lê Lê đây. Hôm nay mình rất vui được đánh giá chi tiết một cuốn vở siêu hot mà mình đã trải nghiệm từ ngày đầu học chữ Hán: **Vở Luyện Viết Từ Vựng HSK 1** của NHT Books.\n\nĐối với người mới học, nhớ mặt chữ Hán luôn là trở ngại lớn vì hệ chữ tượng hình phức tạp, dễ quên nét. Cuốn vở này chính là chiếc phao cứu sinh toàn diện cho các bạn.\n\n### Điểm đặc biệt: Công nghệ bút bay mực tự động\nĐi kèm vở là **bút bay mực chuyên dụng** và 10 ngòi dự phòng. Khi viết lên vở, mực xanh hiển thị rõ nét nhưng sau 3-5 phút sẽ tự nhạt đi và biến mất hoàn toàn sau 10-15 phút, trả lại trang giấy trắng tinh để luyện tập hàng ngàn lần, tiết kiệm chi phí tối đa và giữ vở luôn sạch đẹp.\n\n### Lộ trình 5 phần khoa học từ gốc\nCuốn vở dày 66 trang in màu sắc nét trên chất giấy siêu dày chống thấm nhòe, lộ trình học gồm:\n1. **Phần 1 - Kiểm soát nét bút**: Luyện tay bằng các nét ma trận giúp cơ tay dẻo dai.\n2. **Phần 2 - 8 nét cơ bản**: Nền tảng cấu trúc viết chữ Hán.\n3. **Phần 3 - 7 quy tắc bút thuận**: Viết đúng thứ tự nét giúp chữ cân đối, viết nhanh hơn.\n4. **Phần 4 - 70 bộ thủ thông dụng**: Hiểu bản chất ghép chữ và đoán nghĩa từ mới.\n5. **Phần 5 - Luyện viết 150 từ vựng HSK 1**: Có hướng dẫn bút thuận, pinyin, âm Hán Việt và ô ly Mễ tự căn chỉnh chữ tròn trịa.\n\n### Bí quyết học tập hiệu quả\nMỗi ngày các bạn chỉ nên luyện 5-10 từ trong 15 phút, kết hợp đọc to pinyin và nghĩa khi viết để ghi nhớ sâu sắc hơn nhé!',
    pros: 'Tiết kiệm tối đa nhờ công nghệ bút bay mực viết lại nhiều lần | Cấu trúc bài bản từ nét vẽ cơ bản đến 70 bộ thủ | Ô ly Mễ tự và hướng dẫn bút thuận giúp viết chữ chuẩn đẹp',
    cons: 'Phải đậy nắp bút kỹ để tránh khô mực | Chỉ chứa 150 từ vựng HSK 1 cũ',
    who_for: 'Các bạn tự học tiếng Trung từ con số 0, muốn luyện nét chữ Hán chuẩn đẹp và ghi nhớ 150 từ vựng HSK 1 cốt lõi.',
    review_images: 'https://lh3.googleusercontent.com/d/1oxTHW-rkeuNxEiXqu7vSFQ3yLaBHerRZ,https://lh3.googleusercontent.com/d/1kWbo3uRHMPS_LWW3Ug5vitl0cOu0wMEl',
    sku_folder_url: ''
  }
};

// ---- Book Translations Mapping ----
const BOOK_TRANSLATIONS = {
  en: {
    'SACH-001': {
      title: 'Chinese Course (Hanyu Jiaocheng)',
      desc: 'Standard Chinese textbook, complete with Pinyin pronunciation and rich exercises. Le Le studied from this book from the start! ✨',
      tags: 'Beginner, HSK 1-3, Has Pinyin',
      review: 'Chinese Course is a classic series that almost everyone starting to learn Chinese knows about. Le Le herself studied and completed this series when first self-learning.\n\nWhat I like most about this series is the detailed grammar explanations, vocabulary starting from easy to difficult, and extremely accurate Pinyin. The book helps you build a solid foundation of pronunciation and vocabulary right from the first lessons.\n\nHowever, the book has a minor downside: the illustrations are not very eye-catching, mostly text. For best results, you should combine it with the accompanying audio files to practice standard pronunciation!',
      pros: 'Super detailed grammar explanations | Rich exercise system | Perfect for self-study at home',
      cons: 'Illustrations are a bit simple | No physical CD included (must scan QR code for app)',
      who_for: 'Suitable for those self-studying from scratch, or preparing for HSK 1-3.'
    },
    'SACH-002': {
      title: '3000 HSK Vocabulary',
      desc: 'Complete HSK 1–6 vocabulary by theme, with example sentences, pronunciation and translations. A must-have for HSK prep! 💪',
      tags: 'Exam Prep, HSK 1–6, Comprehensive',
      review: 'If your goal is to conquer the HSK exam from level 1 to 6, then this 3000 HSK Vocabulary book is an indispensable assistant. The book systematizes vocabulary scientifically by level.\n\nEach vocabulary word comes with pinyin, detailed translation and especially practical example sentences. Learning vocabulary through example sentences helped Le Le remember 3 times longer than learning isolated words by heart.\n\nNote that the amount of knowledge in the book is huge, so you should break down your daily target to about 10-15 words, combined with making Flashcards to review!',
      pros: 'Complete HSK 1-6 vocabulary | Practical example sentences for each word | Clear presentation, easy to look up',
      cons: 'Book is quite thick and heavy | No lively illustration images',
      who_for: 'For students preparing for the HSK exam from level 1 to 6.'
    },
    'SACH-003': {
      title: 'Practical Chinese Conversations',
      desc: 'Real-world daily communication scenarios. Speak immediately after learning, perfect for practicing speaking! 🗣️',
      tags: 'Communication, Practical, Audio CD',
      review: 'It is a pity to study Chinese and not be able to speak it, right? The Practical Chinese Conversations book focuses entirely on helping you communicate naturally in daily life.\n\nThe book consists of many close-to-life topics such as shopping, asking for directions, booking tables, traveling... Le Le really likes the sample dialogs because the vocabulary is very modern, exactly how native speakers talk in real life, not rigid like textbooks.\n\nYou should practice by speaking out loud along with the sample audio files to improve your intonation and speaking reflexes!',
      pros: 'Extremely practical communication topics | Natural, modern vocabulary | Includes high-quality native audio recordings',
      cons: 'Few in-depth grammar exercises',
      who_for: 'Suitable for those who want to improve conversational reflexes and speak Chinese naturally.'
    },
    'SACH-004': {
      title: 'Basic Chinese Character Writing',
      desc: 'Chinese writing book with detailed stroke order instructions and standard Mizi Ge grids to help you write characters beautifully.',
      tags: 'Writing, Chinese Characters, Practice',
      review: 'Writing Chinese characters is always a big challenge for beginners. This book was born to help you overcome that fear in the easiest way.\n\nThe book provides extremely detailed stroke order instructions for each basic Chinese character. Having the pre-drawn Mizi Ge grid helps you align the position of the strokes in the most balanced and beautiful way. Le Le likes the thick paper quality of this book the most; writing with ink or gel pens won\'t bleed through to the next page!\n\nAdvice from Le Le: spend about 15-20 minutes daily practicing writing slowly. Saying the meaning and pronunciation in your head while writing will help you remember the character shape much longer!',
      pros: 'High-quality thick paper | Extremely clear stroke order instructions | Standard Mizi Ge grid layout',
      cons: 'No accompanying writing videos (must scan QR code for extra content)',
      who_for: 'Suitable for beginners who want to practice writing Chinese characters in a balanced and beautiful way from the start.'
    },
    'SACH-005': {
      title: 'Easy-to-Understand Chinese Grammar',
      desc: 'Summarizes all Chinese grammar from basic to advanced using intuitive mind maps, easy to remember and apply.',
      tags: 'Grammar, Mind Maps, Easy',
      review: 'Chinese grammar is actually not too complicated if you know how to approach it using visual thinking. This book replaces long definitions with highly intuitive mind maps.\n\nEach grammar structure is analyzed with a clear formula, along with comparisons between easily confused grammar points and immediate practical application exercises. Le Le used this book to organize all knowledge before the HSK exam and found it incredibly effective.\n\nA big plus is that the book is fully printed in color, with smart layout zones that prevent eye strain when studying continuously.',
      pros: 'Presented with intuitive mind maps | Fully printed in sharp colors | Deep analysis of common mistakes',
      cons: 'Slightly higher price than ordinary black and white books',
      who_for: 'Extremely useful for those confused about grammar or needing to organize knowledge quickly.'
    },
    'SPE-0001': {
      title: 'HSK 1 Chinese Vocabulary Writing Book',
      desc: 'Smart Chinese vocabulary workbook combined with heat-erasable ink pen, helping you memorize 150 core HSK 1 words, 70 common radicals, and stroke order rules. Ink disappears automatically in minutes for repeated practice! ✨',
      tags: 'Writing, HSK 1, Radicals',
      review: 'Hi guys! Le Le here. Today I\'m very happy to share and review in detail a highly useful book that I personally experienced when first starting my Chinese self-learning journey: **HSK 1 Vocabulary Writing Book** by NHT Books.\n\nFor beginners, memorizing Chinese characters is always one of the biggest challenges because Chinese is a complex logographic writing system—forgetting characters right after writing them is completely normal. This workbook is designed as a comprehensive solution to overcome that fear.\n\n### The Highlight: Smart Heat-Erasable Pen\nThe most valuable and unique feature of this product is the accompanying **magic heat-erasable pen** (comes with 10 refills). When you write on the page, the ink automatically fades away and disappears completely in 3-5 minutes, leaving the page clean like new! This feature is revolutionary because it allows us to practice writing hundreds or thousands of times on the exact same workbook without buying new ones or wasting paper.\n\n### Scientific 5-Part Layout\nThe 66-page workbook is printed in sharp colors on premium thick paper that is smooth to write on and doesn\'t bleed through. The content is structured logically from easy to difficult:\n1. **Part 1 - Stroke Control Matrix**: Lays the foundation for wrist and finger movements.\n2. **Part 2 - Basic Strokes**: Teaches horizontal, vertical, left-falling, and right-falling strokes.\n3. **Part 3 - Stroke Order Rules**: Golden rules like \'horizontal before vertical\' to write characters faster and more balanced.\n4. **Part 4 - 70 Common Radicals**: The building blocks of Chinese characters to understand word composition.\n5. **Part 5 - 150 Core HSK 1 Words**: Practice writing key HSK 1 words with pinyin, Han-Viet transliteration, and Vietnamese meanings.\n\n### Study Tips\nThe faint Mizi Ge grid helps learners align character proportions perfectly. For self-studiers at home, it turns repetitive writing practice into an engaging daily activity.',
      pros: 'Comes with magic ink pen for infinite reuse | Detailed 70 radicals and stroke rules | Thick paper and sharp color print',
      cons: 'Must store magic pen carefully | Limited to 150 legacy HSK 1 words',
      who_for: 'Beginners self-studying Chinese from scratch who want to write beautiful characters and learn HSK 1 words.'
    }
  },
  zh: {
    'SACH-001': {
      title: '汉语教程',
      desc: '标准汉语教材，拼音标注齐全，练习丰富。乐乐从一开始就用这本书学习！✨',
      tags: '零基础, HSK 1-3, 附拼音',
      review: '《汉语教程》是一套经典的中文教材，几乎所有刚开始学中文的人都熟悉它。乐乐自己在刚开始自学的时候，也把这套书啃了个透。\n\n我最喜欢这套书的地方是它的语法解释非常详细，词汇由浅入深，拼音也非常准确。这本书能帮你在前几课就打下坚实的语音和词汇基础。\n\n不过，这本书也有个小缺点：插图比较简单，主要都是文字。为了达到最佳学习效果，大家应该结合配套的音频来练习标准发音！',
      pros: '语法解释超级详细 | 练习内容非常丰富 | 非常适合在家自学',
      cons: '插图设计较为单一 | 未附带实体CD（需要扫码下载App）',
      who_for: '适合从零开始自学的同学，或者准备参加 HSK 1-3 级考试的人。'
    },
    'SACH-002': {
      title: 'HSK 3000 词汇',
      desc: '按主题分类的 HSK 1–6 全套词汇，附带例句、发音 and 释义。HSK备考必备！💪',
      tags: '备考, HSK 1–6, 完整版',
      review: '如果您的目标是攻克 HSK 1 到 6 级考试，那么这本《3000 HSK 词汇》就是必不可少的得力助手。本书按级别科学地系统化了词汇。\n\n每个词汇都配有拼音、详细翻译，特别是实用的例句。通过例句学习词汇，帮乐乐记住了比单纯死记硬背单词长3倍的时间。\n\n注意，书中的知识量非常庞大，建议您将每日目标分解为10-15个单词，并结合制作闪卡（Flashcard）进行复习！',
      pros: '完整的 HSK 1-6 级词汇 | 每个词汇都有实用的例句 | 排版清晰，易于检索',
      cons: '书本较厚且重 | 缺乏生动的插图',
      who_for: '适合正在备考 HSK 1 至 6 级考试的同学。'
    },
    'SACH-003': {
      title: '实用汉语会话',
      desc: '真实日常交际场景。学完即用，非常适合练习口语！🗣️',
      tags: '口语交际, 实用, 附CD音频',
      review: '学中文却不会说，那真的很可惜对吧？这本《实用汉语会话》完全专注于帮助您在日常生活中自然地进行交流。\n\n书本包含许多贴近生活的主题，如购物、问路、订餐、旅游…… 乐乐非常喜欢书中的示范对话，因为用词非常现代，跟现实生活中中国人的说话方式一模一样，不像教科书那样生硬。\n\n大家应该跟着示范音频大声朗读，以改善语调和口语反应能力！',
      pros: '非常实用的交流主题 | 用词自然、现代 | 附带标准发音的录音文件',
      cons: '较少有深度的语法练习',
      who_for: '适合想要提高口语交际反应、自然说中文的同学。'
    },
    'SACH-004': {
      title: '基础汉字书写描红',
      desc: '带有详细笔顺指导的汉字字帖，配有标准米字格，助您写出漂亮规范的汉字。',
      tags: '书写练习, 汉字, 字帖',
      review: '写汉字对初学者来说一直是个巨大的挑战。这本书的诞生就是为了帮您以最简单的方式克服这个恐惧。\n\n本书为每个基础汉字提供了极其详细的笔顺规则指导。现成的米字格能帮您把笔画位置调整得最对称、最美观。乐乐最喜欢这本书厚实的纸张质量，用钢笔或中性笔书写完全不会渗透到背面！\n\n乐乐的建议是：每天花 15-20 分钟慢条斯理地练习写字，不要着急。边写边默念字义和读音，会帮您更快记住字形！',
      pros: '高品质厚纸张 | 极其清晰的笔顺指导 | 标准米字格排版',
      cons: '未附带教学视频（需要扫二维码查看更多）',
      who_for: '适合想要从一开始就把汉字写得规范、美观的初学者。'
    },
    'SACH-005': {
      title: '图解易懂汉语语法',
      desc: '通过直观的思维导图系统总结从初级到高级的汉语语法，易记易用。',
      tags: '语法, 思维导图, 易懂',
      review: '如果您知道如何用视觉思维去学习，汉语语法其实并不算太复杂。这本书用直观的思维导图（mindmap）代替了冗长的定义解释。\n\n每个语法结构都按清晰的公式进行剖析，并对容易混淆的语法点进行对比，还配有即学即练的实用练习。乐乐在 HSK 考试前用这本书系统复习了所有知识，发现它非常有效。\n\n另一个大加分项是全书全彩印刷，批注区域划分巧妙，连续学习时眼睛不易疲劳。',
      pros: '采用直观的思维导图呈现 | 全彩高清印刷 | 深度剖析常见错误',
      cons: '价格比普通的黑白书略高一点',
      who_for: '对于被语法搞得头疼或需要快速系统化知识的人来说非常有用。'
    },
    'SPE-0001': {
      title: 'HSK 1 汉字书写及词汇练习册（附自动消色笔）',
      desc: '智能汉字字帖结合温感消色笔，助您快速掌握150个HSK 1核心词汇、70个常用部首及汉字笔顺规则。书写后笔迹自动消失，可无限次重复练习！✨',
      tags: '字帖, HSK 1, 部首',
      review: '大家好！我是乐乐。今天非常高兴能跟大家详细评测一本我在刚开始自学中文时亲身体验过的神器——NHT Books出版的《HSK 1 汉字字帖》。\n\n对于初学者来说，记汉字是一大难关，因为汉字笔画复杂，容易写完就忘。这本练习册就是专门为解决大家的写字难题而设计的。\n\n### 最大亮点：神奇的自动消色笔\n字帖附赠**专用消色笔**及10支替换笔芯。在字帖上书写时呈深蓝色笔迹，3-5分钟后开始淡化，10-15分钟内会完全消失，让字帖恢复如新。这让我们可以重复书写成百上千次，极其省钱且环保，也避免了橡皮擦拭弄脏本子。\n\n### 科学的5部分渐进式排版\n全书共66页，全彩高清印刷，纸张厚实顺滑不透墨，内容由浅入深：\n1. **第一部分 - 控笔线条练习**：训练手腕力量，为写字打好基础。\n2. **第二部分 - 8个基本笔画**：汉字书写的骨架。\n3. **第三部分 - 笔顺规则**：掌握“先横后竖”等黄金法则，让写字更规范美观。\n4. **第四部分 - 70个常用部首**：汉字的灵魂，帮助理解字义。\n5. **第五部分 - 150个HSK 1词汇练习**：包含笔顺图解、拼音、越南语释义及标准米字格。\n\n### 学习建议\n建议每天花15分钟练习5-10个词汇，边写边大声读出拼音和释义，这样记忆效果能翻倍！',
      pros: '附赠消色笔可无限次重复练习 | 结构系统，从基本笔画到70个部首循序渐进 | 笔顺指导和米字格助您写出美观汉字',
      cons: '需妥善保管消色笔防止干墨 | 仅包含旧版 HSK 1 的 150 个词汇',
      who_for: '适合零基础中文自学者，想写出规范漂亮汉字并掌握 HSK 1 词汇的同学。'
    }
  }
};

// Global loaded book data for language toggles
window.currentBookData = null;

// ── INIT ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  let sku = new URLSearchParams(window.location.search).get('sku');
  if (!sku) {
    // Default to SACH-001 so the page can be previewed directly
    sku = 'SACH-001';
  }
  loadBook(sku);
});

// Watch language change event to trigger re-render
window.addEventListener('langChanged', () => {
  if (window.currentBookData) {
    renderReview(window.currentBookData);
  }
});

// ── Load từ Google Sheets ─────────────────────────────────
async function loadBook(sku) {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(SHEET_NAME)}&headers=2`;
    const res = await fetch(url);
    const raw = await res.text();

    const match = raw.match(/google\.visualization\.Query\.setResponse\(([\s\S]*?)\);/);
    if (!match) throw new Error('Invalid response');
    const data = JSON.parse(match[1]);

    parseAndRender(data, sku);
  } catch (err) {
    console.warn('Google Sheets loading failed. Using fallback book review.', err);
    const fallback = FALLBACK_BOOKS[sku];
    if (fallback) {
      renderReview(fallback);
    } else {
      showError();
    }
  }
}

// ── Parse GViz response ───────────────────────────────────
function parseAndRender(data, targetSku) {
  try {
    const rows = data.table.rows;
    const row  = rows.find(r => {
      const cell = r.c[COL.sku];
      return cell && String(cell.v).trim() === targetSku.trim();
    });

    const fallback = FALLBACK_BOOKS[targetSku];

    if (!row) {
      if (fallback) {
        renderReview(fallback);
      } else {
        showError();
      }
      return;
    }

    const get = (col, fallbackVal = '') => {
      const cell = row.c[col];
      const val = (cell && cell.v != null) ? String(cell.v).trim() : '';
      return val || fallbackVal;
    };

    renderReview({
      sku:            get(COL.sku, fallback?.sku),
      title:          get(COL.title, fallback?.title),
      subtitle_zh:    get(COL.subtitle_zh, fallback?.subtitle_zh),
      desc:           get(COL.desc, fallback?.desc),
      tags:           get(COL.tags, fallback?.tags),
      price:          get(COL.price, fallback?.price),
      badge:          get(COL.badge, fallback?.badge),
      badge_type:     get(COL.badge_type, fallback?.badge_type),
      stars:          get(COL.stars, fallback?.stars),
      cover_url:      get(COL.cover_url, fallback?.cover_url),
      buy_shopee:     get(COL.buy_shopee),
      buy_fahasa:     get(COL.buy_fahasa),
      buy_tiki:       get(COL.buy_tiki),
      buy_lazada:     get(COL.buy_lazada),
      review:         get(COL.review, fallback?.review),
      pros:           get(COL.pros, fallback?.pros),
      cons:           get(COL.cons, fallback?.cons),
      who_for:        get(COL.who_for, fallback?.who_for),
      shop_images:    get(COL.shop_images, fallback?.shop_images),
      review_images:  get(COL.review_images, fallback?.review_images),
      sku_folder_url: get(COL.sku_folder_url, fallback?.sku_folder_url),
    });
  } catch (e) {
    console.error('Parse error:', e);
    showError();
  }
}

// ── Render page ───────────────────────────────────────────
function renderReview(book) {
  window.currentBookData = book;
  const lang = window.i18n ? window.i18n.currentLang : 'vi';

  // Localize content fields if active language is not vi
  const displayBook = { ...book };
  if (lang !== 'vi' && BOOK_TRANSLATIONS[lang] && BOOK_TRANSLATIONS[lang][displayBook.sku]) {
    const tBook = BOOK_TRANSLATIONS[lang][displayBook.sku];
    displayBook.title = tBook.title || displayBook.title;
    displayBook.desc = tBook.desc || displayBook.desc;
    displayBook.tags = tBook.tags || displayBook.tags;
    displayBook.review = tBook.review || displayBook.review;
    displayBook.pros = tBook.pros || displayBook.pros;
    displayBook.cons = tBook.cons || displayBook.cons;
    displayBook.who_for = tBook.who_for || displayBook.who_for;
  }

  // SEO
  const pageTitle = lang === 'vi'
    ? `Review: ${displayBook.title} – Lê Lê học tiếng Trung`
    : (lang === 'en'
        ? `Review: ${displayBook.title} – Le Le Learn Chinese`
        : `评测: ${displayBook.title} – 乐乐学中文`);
  document.title = pageTitle;
  setMeta('og-title', pageTitle);
  setMeta('og-desc',  displayBook.desc || '');
  setMeta('og-image', displayBook.cover_url || '');

  // Cover
  const cover = document.getElementById('rv-cover');
  cover.src = displayBook.cover_url || '../logo.png';
  cover.alt = lang === 'vi'
    ? `Bìa sách ${displayBook.title}`
    : (lang === 'en' ? `Book cover ${displayBook.title}` : `${displayBook.title} 封面`);

  // Badge
  const badgeWrap = document.getElementById('rv-badge-wrap');
  if (displayBook.badge) {
    let badgeLabel = displayBook.badge;
    if (badgeLabel.toLowerCase() === 'bán chạy' || badgeLabel.toLowerCase() === 'hot') {
      badgeLabel = window.i18n ? window.i18n.t('badge_hot', 'Bán chạy') : badgeLabel;
    } else if (badgeLabel.toLowerCase() === 'mới nhất' || badgeLabel.toLowerCase() === 'new') {
      badgeLabel = window.i18n ? window.i18n.t('badge_new', 'Mới nhất') : badgeLabel;
    } else if (badgeLabel.toLowerCase() === 'khuyên dùng' || badgeLabel.toLowerCase() === 'recommend') {
      badgeLabel = window.i18n ? window.i18n.t('badge_recommended', 'Khuyên dùng') : badgeLabel;
    }
    const type = displayBook.badge_type === 'new' ? 'badge-new' : 'badge-hot';
    badgeWrap.innerHTML = `<span class="badge ${type}">${badgeLabel}</span>`;
    badgeWrap.style.display = '';
  } else {
    badgeWrap.innerHTML = '';
    badgeWrap.style.display = 'none';
  }

  // Stars
  const starsNum = parseInt(displayBook.stars) || 5;
  const starsEl  = document.getElementById('rv-stars');
  starsEl.innerHTML  = '★'.repeat(starsNum) + '☆'.repeat(5 - starsNum);
  starsEl.setAttribute('aria-label', lang === 'vi'
    ? `${starsNum} sao`
    : (lang === 'en' ? `${starsNum} stars` : `${starsNum} 颗星`));

  // Title & subtitle
  document.getElementById('rv-title').textContent    = displayBook.title;
  document.getElementById('rv-subtitle').textContent = displayBook.subtitle_zh;
  if (!displayBook.subtitle_zh) {
    document.getElementById('rv-subtitle').style.display = 'none';
  } else {
    document.getElementById('rv-subtitle').style.display = '';
  }

  // Tags
  const tagsEl = document.getElementById('rv-tags');
  if (displayBook.tags) {
    const tags = displayBook.tags.split(',').map(t => t.trim()).filter(Boolean);
    const translatedTags = tags.map(tag => {
      if (!window.i18n) return tag;
      const tagLower = tag.toLowerCase();
      if (tagLower === 'người mới' || tagLower === 'beginner') return window.i18n.t('tag_beginner', 'Beginner');
      if (tagLower === 'có pinyin' || tagLower === 'has pinyin') return window.i18n.t('tag_pinyin', 'Has Pinyin');
      if (tagLower === 'luyện thi' || tagLower === 'exam prep') return window.i18n.t('tag_exam', 'Exam Prep');
      if (tagLower === 'đầy đủ' || tagLower === 'comprehensive') return window.i18n.t('tag_complete', 'Complete');
      if (tagLower === 'giao tiếp' || tagLower === 'spoken') return window.i18n.t('tag_comms', 'Spoken');
      if (tagLower === 'thực dụng' || tagLower === 'practical') return window.i18n.t('tag_practical', 'Practical');
      if (tagLower === 'luyện viết' || tagLower === 'writing') return window.i18n.t('tag_writing', 'Writing');
      if (tagLower === 'chữ hán' || tagLower === 'hanzi') return window.i18n.t('tag_hanzi', 'Hanzi');
      if (tagLower === 'ngữ pháp' || tagLower === 'grammar') return window.i18n.t('tag_grammar', 'Grammar');
      return tag;
    });
    tagsEl.innerHTML = translatedTags.map(t => `<span class="tag">${t}</span>`).join('');
    tagsEl.style.display = '';
  } else {
    tagsEl.innerHTML = '';
    tagsEl.style.display = 'none';
  }

  // Price
  const priceVal = parseInt(displayBook.price);
  document.getElementById('rv-price').textContent = priceVal
    ? (lang === 'vi'
        ? `~${priceVal.toLocaleString('vi-VN')}₫`
        : `~$${(priceVal / 25000).toFixed(1)}`)
    : (window.i18n ? window.i18n.t('shop_updating_links', 'Contact') : 'Liên hệ');

  // Buy buttons
  const btns = buildBuyButtons(displayBook);
  const buyGroup = document.getElementById('rv-buy-group');
  const buyGroupBottom = document.getElementById('rv-buy-group-bottom');
  const ctaSection = document.querySelector('.cta-section');
  const affiliateNote = document.querySelector('.affiliate-note');

  if (btns) {
    if (buyGroup) {
      buyGroup.innerHTML = btns;
      buyGroup.style.display = '';
    }
    if (buyGroupBottom) {
      buyGroupBottom.innerHTML = btns.replace(/btn-platform"/g, 'btn-platform btn-platform-lg"');
    }
    if (ctaSection) ctaSection.style.display = '';
    if (affiliateNote) affiliateNote.style.display = '';
  } else {
    if (buyGroup) {
      buyGroup.innerHTML = '';
      buyGroup.style.display = 'none';
    }
    if (buyGroupBottom) {
      buyGroupBottom.innerHTML = '';
    }
    if (ctaSection) ctaSection.style.display = 'none';
    if (affiliateNote) affiliateNote.style.display = 'none';
  }

  // Review body
  const reviewEl = document.getElementById('rv-review-body');
  reviewEl.innerHTML = displayBook.review
    ? formatReview(displayBook.review)
    : `<em style="opacity:.5" data-i18n="review_updating">Review đang được cập nhật… 🌸</em>`;

  // Review image gallery (ảnh từ Drive folder review/)
  renderReviewGallery(displayBook.review_images);

  // Pros
  const prosList = document.getElementById('rv-pros');
  const prosBox = prosList.closest('.pros-box');
  if (displayBook.pros) {
    prosBox.style.display = '';
    prosList.innerHTML = displayBook.pros.split('|').filter(Boolean)
      .map(p => `<li>${p.trim()}</li>`).join('');
  } else {
    prosBox.style.display = 'none';
  }

  // Cons
  const consList = document.getElementById('rv-cons');
  const consBox = consList.closest('.cons-box');
  if (displayBook.cons) {
    consBox.style.display = '';
    consList.innerHTML = displayBook.cons.split('|').filter(Boolean)
      .map(c => `<li>${c.trim()}</li>`).join('');
  } else {
    consBox.style.display = 'none';
  }

  // Who for
  const whoEl = document.getElementById('rv-who');
  const whoSection = whoEl.closest('.who-section');
  if (displayBook.who_for) {
    whoSection.style.display = '';
    whoEl.textContent = displayBook.who_for;
  } else {
    whoSection.style.display = 'none';
  }

  // Show
  document.getElementById('review-loading').classList.add('hidden');
  document.getElementById('review-main').classList.remove('hidden');

  // Run DOM-wide translation to sync static keys
  if (window.i18n) {
    window.i18n.translateDOM();
  }
}

// ── Review Image Gallery ──────────────────────────────────
function renderReviewGallery(reviewImagesStr) {
  const galleryEl = document.getElementById('rv-gallery');
  if (!galleryEl) return;

  if (!reviewImagesStr || !reviewImagesStr.trim()) {
    galleryEl.style.display = 'none';
    return;
  }

  const urls = reviewImagesStr.split(',').map(u => u.trim()).filter(Boolean);
  if (!urls.length) { galleryEl.style.display = 'none'; return; }

  const lang = window.i18n ? window.i18n.currentLang : 'vi';
  const viewImageLabel = lang === 'vi' ? 'Xem ảnh' : (lang === 'en' ? 'View image' : '查看图片');

  galleryEl.style.display = '';
  galleryEl.innerHTML = `
    <div class="section-pill"><span>📸</span> <span style="display:inline" data-i18n="review_photos">Ảnh trong sách</span></div>
    <div class="gallery-grid" id="gallery-grid">
      ${urls.map((url, i) => `
        <button class="gallery-thumb" onclick="openLightbox(${i})"
                aria-label="${viewImageLabel} ${i+1}">
          <img src="${url}" alt="Ảnh sách trang ${i+1}" loading="lazy" />
        </button>`).join('')}
    </div>
  `;

  // Store urls for lightbox
  window._galleryUrls = urls;
}

// ── Lightbox ──────────────────────────────────────────────
function openLightbox(index) {
  const urls = window._galleryUrls || [];
  if (!urls.length) return;

  // Get translations for aria labels
  const lang = window.i18n ? window.i18n.currentLang : 'vi';
  const closeLabel = lang === 'vi' ? 'Đóng' : (lang === 'en' ? 'Close' : '关闭');
  const prevLabel = lang === 'vi' ? 'Ảnh trước' : (lang === 'en' ? 'Previous image' : '上一张');
  const nextLabel = lang === 'vi' ? 'Ảnh tiếp' : (lang === 'en' ? 'Next image' : '下一张');
  const zoomLabel = lang === 'vi' ? 'Ảnh phóng to' : (lang === 'en' ? 'Zoomed image' : '放大图片');

  // Tạo lightbox nếu chưa có
  let lb = document.getElementById('rv-lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'rv-lightbox';
    lb.innerHTML = `
      <div class="lb-backdrop" onclick="closeLightbox()"></div>
      <div class="lb-content">
        <button class="lb-close" onclick="closeLightbox()" aria-label="${closeLabel}">✕</button>
        <button class="lb-prev"  onclick="shiftLightbox(-1)" aria-label="${prevLabel}">‹</button>
        <img id="lb-img" src="" alt="${zoomLabel}" />
        <button class="lb-next"  onclick="shiftLightbox(1)"  aria-label="${nextLabel}">›</button>
        <p class="lb-counter" id="lb-counter"></p>
      </div>`;
    document.body.appendChild(lb);
  } else {
    // Update static attributes in case language changed
    lb.querySelector('.lb-close').setAttribute('aria-label', closeLabel);
    lb.querySelector('.lb-prev').setAttribute('aria-label', prevLabel);
    lb.querySelector('.lb-next').setAttribute('aria-label', nextLabel);
    lb.querySelector('#lb-img').setAttribute('alt', zoomLabel);
  }

  window._lbIndex = index;
  updateLightbox();
  lb.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function updateLightbox() {
  const urls  = window._galleryUrls || [];
  const i     = window._lbIndex;
  document.getElementById('lb-img').src         = urls[i];
  document.getElementById('lb-counter').textContent = `${i + 1} / ${urls.length}`;
}

function shiftLightbox(dir) {
  const urls = window._galleryUrls || [];
  window._lbIndex = (window._lbIndex + dir + urls.length) % urls.length;
  updateLightbox();
}

function closeLightbox() {
  const lb = document.getElementById('rv-lightbox');
  if (lb) lb.classList.remove('open');
  document.body.style.overflow = '';
}

// Keyboard nav
document.addEventListener('keydown', e => {
  if (e.key === 'Escape')      closeLightbox();
  if (e.key === 'ArrowLeft')   shiftLightbox(-1);
  if (e.key === 'ArrowRight')  shiftLightbox(1);
});

// ── Helpers ───────────────────────────────────────────────
function isValidLink(url) {
  if (!url) return false;
  const u = url.trim();
  if (u === '' || u === '#' || u.includes('LINK_AFFILIATE') || u.includes('THAY_VAO_DAY') || u.includes('LINK_GOOGLE_DRIVE') || u.includes('undefined')) {
    return false;
  }
  return u.startsWith('http://') || u.startsWith('https://');
}

function buildBuyButtons(book) {
  const platforms = [
    { url: book.buy_shopee, cls: 'btn-shopee', label: '🛒 Shopee', id: 'shopee' },
    { url: book.buy_fahasa, cls: 'btn-fahasa', label: '📚 Fahasa', id: 'fahasa' },
    { url: book.buy_tiki,   cls: 'btn-tiki',   label: '🛍️ Tiki',   id: 'tiki'   },
    { url: book.buy_lazada, cls: 'btn-lazada', label: '🟠 Lazada', id: 'lazada' },
  ];
  const html = platforms.filter(p => isValidLink(p.url)).map(p =>
    `<a href="${p.url}" class="btn-platform ${p.cls}"
        target="_blank" rel="noopener sponsored"
        id="buy-${p.id}-${book.sku}">${p.label}</a>`
  ).join('');
  return html;
}

function formatReview(text) {
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
  document.getElementById('review-loading').classList.add('hidden');
  document.getElementById('review-error').classList.remove('hidden');
}
