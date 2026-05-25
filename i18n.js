// ===================================================
// i18n.js — Multi-language Support Engine
// ===================================================

const TRANSLATIONS = {
  vi: {
    // Navigation
    nav_home: "Trang chính",
    nav_bookstore: "Bookstore",
    nav_docs: "Tài liệu",
    nav_practice: "Phát âm",
    nav_write: "Tập viết",
    nav_tools: "Góc học liệu",

    // index.html (Homepage)
    home_title: "Lê Lê học tiếng Trung 🌸",
    profile_tagline: "Học tiếng Trung dễ dàng · vui vẻ · mỗi ngày 🌸",
    hero_badge: "🌸 HỌC TIẾNG TRUNG MIỄN PHÍ",
    hero_title: "Cùng Lê Lê Chinh Phục<br><span>Tiếng Trung</span>",
    hero_subtitle: "Khám phá các công cụ luyện phát âm AI, tập viết chữ Hán tương tác và tự tạo phiếu học tập PDF hoàn toàn miễn phí.",
    hero_cta_start: "Học Ngay Miễn Phí",
    hero_cta_tools: "Tạo Phiếu Viết PDF",
    hero_interactive_title: "Học viết cùng Lê Lê",
    hero_interactive_play: "Chạy nét",
    hero_interactive_clear: "Viết lại",
    showcase_title: "Công Cụ Học Tập Trực Tuyến",
    showcase_subtitle: "Được thiết kế nhằm tối ưu hóa trải nghiệm tự học tiếng Trung hiệu quả nhất",
    card_bookstore_label: "📚 Bookstore gợi ý",
    card_bookstore_sub: "Tổng hợp những cuốn sách học tiếng Trung Lê Lê khuyên dùng, có link mua uy tín và review chi tiết.",
    card_bookstore_action: "Khám phá Bookstore →",
    card_docs_label: "🎁 Tài Liệu Chia Sẻ",
    card_docs_sub: "Kho thư viện PDF từ vựng HSK, ngữ pháp chuẩn và phiếu luyện viết tải về hoàn toàn miễn phí.",
    card_docs_action: "Tải tài liệu ngay →",
    card_practice_label: "🎙️ Luyện Phát Âm",
    card_practice_sub: "Chấm điểm phát âm, thanh điệu và nhận diện giọng nói trực tiếp để cải thiện kỹ năng nói.",
    card_practice_action: "Luyện phát âm ngay →",
    card_write_label: "✍️ Tập Viết Hán Tự",
    card_write_sub: "Học viết chữ Hán có hướng dẫn thứ tự nét, hoạt ảnh stroke order và bảng vẽ tự tập viết thông minh.",
    card_write_action: "Tập viết online →",
    card_tools_label: "🛠️ Tạo Phiếu Luyện Viết PDF",
    card_tools_sub: "Tự thiết kế phiếu tập viết ô chữ Mễ tự, Điền tự theo ý muốn để in ra hoặc lưu PDF học tập.",
    card_tools_action: "Tạo phiếu học tập →",
    stats_free: "100% Miễn Phí",
    stats_free_sub: "Học liệu và công cụ",
    stats_hsk: "Chuẩn HSK 1–6",
    stats_hsk_sub: "Kho từ vựng & đề thi",
    stats_ai: "Công Nghệ AI",
    stats_ai_sub: "Phân tích giọng nói",
    bio_section_title: "Lê Lê học tiếng Trung là ai?",
    bio_text: "Chào bạn, mình là Lê Lê! Kênh của mình chia sẻ hành trình học tiếng Trung từ số 0, cùng những tài liệu hữu ích và kinh nghiệm tự học thực tế mà mình tích lũy được. Hy vọng các công cụ trực tuyến này sẽ giúp con đường chinh phục tiếng Trung của bạn trở nên dễ dàng và thú vị hơn!",
    social_heading: "Kết nối với mình qua các nền tảng",
    social_tiktok_desc: "Video ngắn học tiếng Trung vui vẻ mỗi ngày",
    social_youtube_desc: "Bài học chi tiết, hướng dẫn luyện nghe & viết",
    social_facebook_desc: "Chia sẻ tài liệu học, cập nhật mới nhất",
    footer_text: "Cùng nhau học tiếng Trung mỗi ngày ♥",

    // shop.html (Bookstore)
    shop_title: "Bookstore – Lê Lê học tiếng Trung",
    shop_hero_badge: "📚 Được Lê Lê chọn lọc",
    shop_hero_title: "Sách<br/><span>tiếng Trung</span>",
    shop_hero_sub: "Những cuốn sách mình đã dùng và thực sự thấy hiệu quả — chia sẻ thật lòng, không quảng cáo suông 🌸",
    shop_section_title: "Sách Lê Lê gợi ý",
    shop_section_desc: "Mua qua link của mình để ủng hộ kênh nhé 🙏",
    shop_btn_read_review: "Đọc review",
    shop_price_label: "Tham khảo",
    shop_updating_links: "Đang cập nhật link…",
    shop_footer_note: "Tất cả tài liệu đều miễn phí — chia sẻ thoải mái cho bạn bè cùng học nhé!",

    // docs.html (Shared PDF Documents)
    docs_title: "Tài liệu chia sẻ – Lê Lê học tiếng Trung",
    docs_hero_badge: "🎁 Hoàn toàn miễn phí",
    docs_hero_title: "Tài liệu<br/><span class=\"docs-gradient\">chia sẻ</span>",
    docs_hero_sub: "Lê Lê tự tổng hợp từ quá trình học của mình — tải về dùng ngay, không cần đăng ký gì hết! 💚",
    docs_loading: "Đang tải danh sách tài liệu…",
    docs_empty: "Chưa có tài liệu trong mục này.<br/>Lê Lê sẽ cập nhật sớm nhé!",
    docs_tab_all: "Tất cả",
    docs_tab_vocab: "Từ vựng",
    docs_tab_grammar: "Ngữ pháp",
    docs_tab_hsk: "Thi HSK",
    docs_tab_writing: "Luyện viết",
    docs_toast_copied: "Đã sao chép link!",

    // tools.html (Worksheet PDF Generator)
    tools_hero_badge: "🛠️ GÓC HỌC LIỆU",
    tools_title_tab: "Tạo Phiếu Luyện Viết PDF – Lê Lê học tiếng Trung",
    tools_main_title: "Tạo Phiếu Luyện Viết PDF",
    tools_subtitle: "Công cụ tự thiết kế và in phiếu luyện viết chữ Hán, điền chữ theo pinyin chuẩn định dạng A4",
    tools_config_heading: "Cấu Hình Phiếu Luyện Viết",
    tools_label_text_input: "Chữ Hán mẫu tự luyện:",
    tools_placeholder_text_input: "Nhập chữ Hán cần luyện tập viết vào đây...",
    tools_label_grid_type: "Kiểu ô ly giấy:",
    tools_label_grid_style: "Chế độ hiển thị:",
    tools_label_grid_color: "Màu sắc ô ly:",
    tools_label_page_subtitle: "Tiêu đề trang:",
    tools_placeholder_page_subtitle: "Ví dụ: Phiếu luyện viết số 1",
    tools_label_student_name: "Họ tên:",
    tools_label_date: "Ngày:",
    tools_label_class: "Lớp:",
    tools_presets_heading: "Chọn nhanh từ mẫu luyện tập theo cấp độ HSK:",
    tools_preview_heading: "Bản xem trước A4",
    tools_btn_print: "In phiếu / Tải PDF ngay",
    tools_col_name: "Họ tên:",
    tools_col_date: "Ngày:",
    tools_col_class: "Lớp:",
    tools_tianzi: "Ô Chữ Điền (田字格)",
    tools_mizi: "Ô Chữ Mễ (米字格)",
    tools_mode_trace: "Chữ mờ để tập tô nét",
    tools_mode_blank: "Ô ly trống tự luyện tập",
    tools_mode_dictation: "Đề kiểm tra viết Pinyin",
    tools_color_red: "Đỏ truyền thống",
    tools_color_gold: "Vàng kim hoàng gia",
    tools_color_gray: "Xám đen tối giản",
    tools_print_tip: "* Lưu ý: Chọn khổ giấy A4, tỉ lệ 100%, bật chế độ 'Đồ họa nền' (Background graphics) khi in hoặc xuất file PDF.",
    tools_default_title: "PHIẾU TẬP VIẾT CHỮ HÁN",
    tools_default_subtitle: "Lê Lê học tiếng Trung 🌸 Cùng nhau học tập mỗi ngày",
    tools_preview_empty_chars: "Nhập chữ Hán ở bên để xem trước mẫu phiếu vẽ.",
    tools_preview_empty_pinyin: "Nhập từ vựng ở bên để tạo đề kiểm tra Pinyin.",
    tools_alert_popup: "Vui lòng cho phép trình duyệt mở tab mới để in phiếu!",
    tools_alert_empty_trace: "Vui lòng nhập ít nhất 1 chữ Hán để tạo phiếu!",
    tools_alert_empty_pinyin: "Vui lòng nhập ít nhất 1 từ vựng Hán tự để tạo đề kiểm tra!",
    tools_preset_1: "Lời chào hỏi",
    tools_preset_2: "Chăm chỉ học tập",
    tools_preset_3: "Đếm số 1-10",
    tools_preset_4: "Gia đình",
    tools_preset_5: "Thứ trong tuần",

    // write/index.html (Hanzi Writing Practice)
    write_title: "Tập Viết Chữ Hán – Lê Lê học tiếng Trung",
    write_nav_title: "Tập Viết Chữ Hán",
    write_section_config: "Tìm kiếm & Cấu hình",
    write_placeholder_input: "Nhập chữ Hán...",
    write_btn_search: "Tìm kiếm",
    write_stroke_speed: "Tốc độ vẽ:",
    write_stroke_speed_slow: "Chậm",
    write_stroke_speed_normal: "Vừa",
    write_stroke_speed_fast: "Nhanh",
    write_panel_animation: "Hoạt ảnh nét vẽ",
    write_panel_practice: "Bảng tự luyện",
    write_btn_animate: "Bắt đầu nét vẽ",
    write_btn_loop: "Lặp lại",
    write_btn_toggle_outline: "Hiện nét",
    write_btn_toggle_outline_hide: "Ẩn nét",
    write_btn_clear_canvas: "Tự luyện",
    write_btn_clear_canvas_reset: "Xóa bảng vẽ",
    write_card_guide: "Hướng dẫn nét vẽ",
    write_status_loading: "Đang tải dữ liệu...",
    write_status_not_found: "Không tìm thấy dữ liệu cho ký tự này.",
    write_hero_title: "Tra Cứu & Tập Viết<br/><span class=\"accent-gradient\">Chữ Hán Tương Tác</span>",
    write_hero_subtitle: "Học cách viết đúng thứ tự nét (Stroke Order), xem hoạt ảnh hướng dẫn và tự tay vẽ từng nét chữ trực tiếp bằng chuột hoặc màn hình cảm ứng.",
    write_search_placeholder: "Nhập chữ Hán cần tra (ví dụ: 你, 谢谢, 学习)...",
    write_active_char: "Chữ đang viết:",
    write_canvas_animate: "Mẫu Nét Vẽ",
    write_canvas_quiz: "Khung Tập Viết",
    write_btn_view_animate: "📺 Xem nét vẽ",
    write_btn_pause: "⏸️ Tạm dừng",
    write_btn_restart: "🔄 Xem lại từ đầu",
    write_btn_quiz_start: "✍️ Bắt đầu viết",
    write_btn_quiz_hint: "💡 Hiện gợi ý",
    write_btn_quiz_clear: "🧹 Xóa nét vẽ",
    write_quiz_success: "Viết chữ hoàn thành xuất sắc!",
    write_quiz_status_idle: "Nhấp 'Bắt đầu viết' để tự vẽ.",
    write_diagrams_heading: "Sơ Đồ Từng Bước Viết (Stroke Order Steps)",
    write_diagrams_desc: "Thứ tự viết chi tiết của từng nét từ trái qua phải (nét màu đỏ thể hiện bước vẽ hiện tại, màu vàng thể hiện các nét đã hoàn thành trước đó):",
    write_diagrams_placeholder: "Nhập chữ Hán ở trên để xem sơ đồ nét vẽ.",
    write_hsk_heading: "Chữ Mẫu Luyện Tập Theo Cấp Độ HSK",
    write_hsk_desc: "Chọn nhanh các từ vựng thông dụng để xem thứ tự nét vẽ và luyện viết trực tiếp:",
    write_footer_note: "Ứng dụng hoạt ảnh nét vẽ & tương tác tập viết 100% chạy trên trình duyệt sử dụng thư viện Hanzi Writer.",

    // practice/index.html (Speech Practice)
    practice_title: "Luyện Phát Âm Tiếng Trung – Lê Lê học tiếng Trung",
    practice_nav_title: "Luyện Phát Âm",
    practice_search_placeholder: "Nhập từ cần luyện phát âm...",
    practice_section_practice: "Luyện Tập Phát Âm",
    practice_instructions: "Hướng dẫn: Click vào biểu tượng Micro, cấp quyền thu âm và đọc to từ hiển thị bên dưới. Hệ thống AI sẽ phân tích giọng nói của bạn.",
    practice_mic_idle: "Click Micro để nói",
    practice_mic_listening: "Đang nghe... Nói đi bạn!",
    practice_mic_processing: "Đang phân tích...",
    practice_result_score: "Điểm số:",
    practice_result_detected: "Nhận diện:",
    practice_tip_title: "💡 Mẹo phát âm:",
    practice_tips_content: "Lưu ý thanh điệu tiếng Trung! Thanh 1 (ngang dài), Thanh 2 (lên giọng), Thanh 3 (xuống lên), Thanh 4 (dứt khoát từ cao xuống).",
    practice_hero_badge: "🎙️ Trực tuyến & Miễn phí",
    practice_hero_title: "Luyện Phát Âm<br/><span class=\"accent-gradient\">Tiếng Trung AI</span>",
    practice_hero_subtitle: "Lắng nghe và chấm điểm giọng phát âm tiếng Trung của bạn tự động qua micro. Hãy nhấn nút và nói thử nhé! 💬",
    practice_tone_pairs_heading: "1. Luyện Cặp Thanh Điệu",
    practice_tone_pairs_desc: "Một từ ghép 2 âm tiết có 15 tổ hợp thanh điệu. Nhấp vào ô bất kỳ để luyện tập từ vựng tương ứng (màu xanh: tốt, màu đỏ: chưa đạt).",
    practice_tone_label: "Thanh điệu",
    practice_tone_1: "Thanh 1",
    practice_tone_2: "Thanh 2",
    practice_tone_3: "Thanh 3",
    practice_tone_4: "Thanh 4",
    practice_sandhi_note: "biến điệu",
    practice_lbl_selected_pair: "Đang chọn:",
    practice_lbl_accuracy: "Tỷ lệ chính xác:",
    practice_accuracy_none: "Chưa thực hành",
    practice_audio_tooltip: "Nghe phát âm mẫu",
    practice_status_ready: "Sẵn sàng luyện tập",
    practice_btn_speak: "Nhấn và nói",
    practice_btn_next: "Từ khác →",
    practice_lbl_you_said: "Bạn đã phát âm:",
    practice_badge_correct: "Đúng",
    practice_badge_wrong: "Chưa khớp",
    practice_hsk_heading: "2. Luyện Phát Âm Từ Vựng HSK",
    practice_hsk_desc: "Luyện nói từ vựng cấp độ thi HSK. Chọn cấp độ và luyện phát âm theo từng từ.",
    practice_hsk_level_label: "Cấp độ HSK:",
    practice_hsk_level_1: "HSK 1 (Cơ bản)",
    practice_hsk_level_2: "HSK 2 (Sơ cấp)",
    practice_hsk_level_3: "HSK 3 (Trung cấp)",
    practice_hsk_level_4: "HSK 4 (Tiền cao cấp)",
    practice_hsk_pinyin_hint: "Nhấp để hiện pinyin",
    practice_hsk_status_ready: "Nhấn micro để ghi âm từ này",
    practice_open_heading: "3. Luyện Nói Tự Do",
    practice_open_desc: "Nói một từ hoặc câu bất kỳ, hệ thống sẽ tự động ghi âm và chuyển chữ Hán thành Pinyin kèm theo dấu thanh điệu.",
    practice_open_len_label: "Độ dài dự kiến:",
    practice_open_len_1: "1 âm tiết (Từ đơn)",
    practice_open_len_2: "2 âm tiết (Từ ghép)",
    practice_open_len_3: "3 âm tiết",
    practice_open_len_4: "4 âm tiết / Thành ngữ",
    practice_open_len_free: "Tự do (Bất kỳ câu nào)",
    practice_open_status_ready: "Sẵn sàng lắng nghe giọng nói của bạn",
    practice_footer_note: "Ứng dụng luyện âm 100% chạy trên trình duyệt của bạn bằng công nghệ AI Web Speech.",
    practice_hero_badge: "🎙️ Trực tuyến & Miễn phí",
    practice_hero_title: "Luyện Phát Âm<br/><span class=\"accent-gradient\">Tiếng Trung AI</span>",
    practice_hero_subtitle: "Lắng nghe và chấm điểm giọng phát âm tiếng Trung của bạn tự động qua micro. Hãy nhấn nút và nói thử nhé! 💬",
    practice_tone_pairs_heading: "1. Luyện Cặp Thanh Điệu",
    practice_tone_pairs_desc: "Một từ ghép 2 âm tiết có 15 tổ hợp thanh điệu. Nhấp vào ô bất kỳ để luyện tập từ vựng tương ứng (màu xanh: tốt, màu đỏ: chưa đạt).",
    practice_tone_label: "Thanh điệu",
    practice_tone_1: "Thanh 1",
    practice_tone_2: "Thanh 2",
    practice_tone_3: "Thanh 3",
    practice_tone_4: "Thanh 4",
    practice_sandhi_note: "biến điệu",
    practice_lbl_selected_pair: "Đang chọn:",
    practice_lbl_accuracy: "Tỷ lệ chính xác:",
    practice_accuracy_none: "Chưa thực hành",
    practice_audio_tooltip: "Nghe phát âm mẫu",
    practice_status_ready: "Sẵn sàng luyện tập",
    practice_btn_speak: "Nhấn và nói",
    practice_btn_next: "Từ khác →",
    practice_lbl_you_said: "Bạn đã phát âm:",
    practice_badge_correct: "Đúng",
    practice_badge_wrong: "Chưa khớp",
    practice_hsk_heading: "2. Luyện Phát Âm Từ Vựng HSK",
    practice_hsk_desc: "Luyện nói từ vựng cấp độ thi HSK. Chọn cấp độ và luyện phát âm theo từng từ.",
    practice_hsk_level_label: "Cấp độ HSK:",
    practice_hsk_level_1: "HSK 1 (Cơ bản)",
    practice_hsk_level_2: "HSK 2 (Sơ cấp)",
    practice_hsk_level_3: "HSK 3 (Trung cấp)",
    practice_hsk_level_4: "HSK 4 (Tiền cao cấp)",
    practice_hsk_pinyin_hint: "Nhấp để hiện pinyin",
    practice_hsk_status_ready: "Nhấn micro để ghi âm từ này",
    practice_open_heading: "3. Luyện Nói Tự Do",
    practice_open_desc: "Nói một từ hoặc câu bất kỳ, hệ thống sẽ tự động ghi âm và chuyển chữ Hán thành Pinyin kèm theo dấu thanh điệu.",
    practice_open_len_label: "Độ dài dự kiến:",
    practice_open_len_1: "1 âm tiết (Từ đơn)",
    practice_open_len_2: "2 âm tiết (Từ ghép)",
    practice_open_len_3: "3 âm tiết",
    practice_open_len_4: "4 âm tiết / Thành ngữ",
    practice_open_len_free: "Tự do (Bất kỳ câu nào)",
    practice_open_status_ready: "Sẵn sàng lắng nghe giọng nói của bạn",
    practice_footer_note: "Ứng dụng luyện âm 100% chạy trên trình duyệt của bạn bằng công nghệ AI Web Speech.",

    // review/review.html (Book Review Page)
    review_title_tab: "Review sách – Lê Lê học tiếng Trung",
    review_loading: "Đang tải review…",
    review_error: "😢 Không tìm thấy sách này.",
    review_back_shop: "← Về Bookstore",
    review_badge_lele: "Lê Lê review",
    review_pros: "Điểm mạnh",
    review_cons: "Lưu ý",
    review_who: "Phù hợp với ai?",
    review_price_label: "Giá tham khảo",
    review_buy_at: "Sẵn sàng bắt đầu? Mua tại:",
    review_affiliate_note: "* Link affiliate — mình nhận hoa hồng nhỏ, không ảnh hưởng giá bạn mua nhé 🙏",
    review_updating: "Review đang được cập nhật… 🌸",
    review_photos: "Ảnh trong sách",
    gallery_thumb_label: "Xem ảnh",
    lightbox_close: "Đóng",
    lightbox_prev: "Ảnh trước",
    lightbox_next: "Ảnh tiếp",
    lightbox_img_alt: "Ảnh phóng to"
  },
  en: {
    // Navigation
    nav_home: "Home",
    nav_bookstore: "Bookstore",
    nav_docs: "Resources",
    nav_practice: "Pronunciation",
    nav_write: "Writing",
    nav_tools: "Tools Hub",

    // index.html (Homepage)
    home_title: "Le Le Learn Chinese 🌸",
    profile_tagline: "Learn Chinese easily · happily · every day 🌸",
    hero_badge: "🌸 LEARN CHINESE FOR FREE",
    hero_title: "Conquer Chinese<br><span>With Le Le</span>",
    hero_subtitle: "Explore AI-assisted pronunciation scoring, interactive stroke-order writing, and customized PDF worksheet creators entirely for free.",
    hero_cta_start: "Start Learning Free",
    hero_cta_tools: "Create PDF Worksheets",
    hero_interactive_title: "Learn Writing with Le Le",
    hero_interactive_play: "Play Stroke",
    hero_interactive_clear: "Clear Canvas",
    showcase_title: "Interactive Learning Tools",
    showcase_subtitle: "Designed to optimize your self-study journey for maximum efficiency",
    card_bookstore_label: "📚 Curated Bookstore",
    card_bookstore_sub: "A compiled list of Chinese learning books recommended by Le Le, with reviews and verified purchase links.",
    card_bookstore_action: "Explore Bookstore →",
    card_docs_label: "🎁 Shared PDF Library",
    card_docs_sub: "Download HSK vocabulary lists, standard grammar sheets, and handwriting files for free.",
    card_docs_action: "Get PDF Resources →",
    card_practice_label: "🎙️ AI Pronunciation",
    card_practice_sub: "Practice speaking with automated tone pairing analysis and speech recognition inside the browser.",
    card_practice_action: "Start Practice →",
    card_write_label: "✍️ Interactive Calligraphy",
    card_write_sub: "Learn Hanzi stroke order with calligraphic animations and a smart drawing board.",
    card_write_action: "Start Writing Online →",
    card_tools_label: "🛠️ PDF Worksheet Generator",
    card_tools_sub: "Design custom Tianzi Ge/Mizi Ge grids with tracing guides or Pinyin dictation headers to download.",
    card_tools_action: "Generate PDF Sheet →",
    stats_free: "100% Free",
    stats_free_sub: "No registration required",
    stats_hsk: "HSK Standard",
    stats_hsk_sub: "Levels 1 to 6 aligned",
    stats_ai: "AI Technology",
    stats_ai_sub: "Realtime speech analysis",
    bio_section_title: "Who is Le Le?",
    bio_text: "Hi there, I'm Le Le! This website shares my personal journey of learning Chinese from scratch, along with practical study resources and tips I gathered along the way. I hope these interactive web tools make your language path smoother and more joyful!",
    social_heading: "Connect with me on social platforms",
    social_tiktok_desc: "Short, fun daily Chinese learning videos",
    social_youtube_desc: "In-depth lessons, listening & writing guides",
    social_facebook_desc: "Free materials sharing & announcements",
    footer_text: "Let's learn Chinese together every day ♥",

    // shop.html (Bookstore)
    shop_title: "Bookstore – Le Le Learn Chinese",
    shop_hero_badge: "📚 Selected by Le Le",
    shop_hero_title: "Chinese<br/><span>Books</span>",
    shop_hero_sub: "Books that I have used and found highly effective — honest reviews, no sponsored ads 🌸",
    shop_section_title: "Books Recommended by Le Le",
    shop_section_desc: "Purchase through my links to support the channel 🙏",
    shop_btn_read_review: "Read review",
    shop_price_label: "Est. Price",
    shop_updating_links: "Updating links...",
    shop_footer_note: "All resources are free — feel free to share with friends!",

    // docs.html (Shared PDF Documents)
    docs_title: "Shared Resources – Le Le Learn Chinese",
    docs_hero_badge: "🎁 100% Free",
    docs_hero_title: "Shared<br/><span class=\"docs-gradient\">Resources</span>",
    docs_hero_sub: "Compiled by Le Le from her own studies — download and use immediately without registration! 💚",
    docs_loading: "Loading resources...",
    docs_empty: "No resources in this category yet.<br/>Le Le will update it soon!",
    docs_tab_all: "All",
    docs_tab_vocab: "Vocabulary",
    docs_tab_grammar: "Grammar",
    docs_tab_hsk: "HSK Exam",
    docs_tab_writing: "Writing",
    docs_toast_copied: "Link copied!",

    // tools.html (Worksheet PDF Generator)
    tools_hero_badge: "🛠️ TOOLS HUB",
    tools_title_tab: "PDF Worksheet Generator – Le Le Learn Chinese",
    tools_main_title: "PDF Worksheet Generator",
    tools_subtitle: "Design and print custom Hanzi tracing grids or Pinyin dictation sheets on standard A4 format",
    tools_config_heading: "Worksheet Configuration",
    tools_label_text_input: "Hanzi characters to practice:",
    tools_placeholder_text_input: "Enter Hanzi characters to practice here...",
    tools_label_grid_type: "Grid style:",
    tools_label_grid_style: "Display mode:",
    tools_label_grid_color: "Grid color:",
    tools_label_page_subtitle: "Worksheet title:",
    tools_placeholder_page_subtitle: "Example: Handwriting Practice #1",
    tools_label_student_name: "Name:",
    tools_label_date: "Date:",
    tools_label_class: "Class:",
    tools_presets_heading: "Quick select HSK word presets:",
    tools_preview_heading: "A4 Sheet Preview",
    tools_btn_print: "Print / Save PDF now",
    tools_col_name: "Name:",
    tools_col_date: "Date:",
    tools_col_class: "Class:",
    tools_tianzi: "Tianzi Ge (田)",
    tools_mizi: "Mizi Ge (米)",
    tools_mode_trace: "Trace guidelines",
    tools_mode_blank: "Blank practice grids",
    tools_mode_dictation: "Pinyin dictation sheet",
    tools_color_red: "Traditional Red",
    tools_color_gold: "Royal Gold",
    tools_color_gray: "Minimalist Gray",
    tools_print_tip: "* Note: Select A4 paper size, 100% scale, and enable 'Background graphics' when printing or saving as PDF.",
    tools_default_title: "CHINESE HANDWRITING WORKSHEET",
    tools_default_subtitle: "Le Le Learn Chinese 🌸 Let's study together every day",
    tools_preview_empty_chars: "Enter Hanzi on the left to preview the worksheet.",
    tools_preview_empty_pinyin: "Enter vocabulary on the left to preview the Pinyin dictation sheet.",
    tools_alert_popup: "Please allow popups in your browser to print the worksheet!",
    tools_alert_empty_trace: "Please enter at least 1 Hanzi character to generate a worksheet!",
    tools_alert_empty_pinyin: "Please enter at least 1 vocabulary word to generate a dictation sheet!",
    tools_preset_1: "Greetings",
    tools_preset_2: "Study hard",
    tools_preset_3: "Count 1-10",
    tools_preset_4: "Family",
    tools_preset_5: "Days of week",

    // write/index.html (Hanzi Writing Practice)
    write_title: "Hanzi Writing Practice – Le Le Learn Chinese",
    write_nav_title: "Hanzi Writing",
    write_section_config: "Search & Config",
    write_placeholder_input: "Enter Hanzi...",
    write_btn_search: "Search",
    write_stroke_speed: "Draw speed:",
    write_stroke_speed_slow: "Slow",
    write_stroke_speed_normal: "Normal",
    write_stroke_speed_fast: "Fast",
    write_panel_animation: "Stroke Animation",
    write_panel_practice: "Practice Board",
    write_btn_animate: "Animate Strokes",
    write_btn_loop: "Loop Animation",
    write_btn_toggle_outline: "Show outline",
    write_btn_toggle_outline_hide: "Hide outline",
    write_btn_clear_canvas: "Practice Drawing",
    write_btn_clear_canvas_reset: "Clear Canvas",
    write_card_guide: "Stroke Diagrams",
    write_status_loading: "Loading data...",
    write_status_not_found: "No data found for this character.",
    write_hero_title: "Look Up & Practice<br/><span class=\"accent-gradient\">Interactive Hanzi Writing</span>",
    write_hero_subtitle: "Learn standard stroke orders, watch guidance animations, and write characters yourself directly using a mouse or touchscreen.",
    write_search_placeholder: "Enter Chinese characters to look up (e.g. 你, 谢谢, 学习)...",
    write_active_char: "Active character:",
    write_canvas_animate: "Stroke Outline Guide",
    write_canvas_quiz: "Free Practice Board",
    write_btn_view_animate: "📺 Draw Stroke",
    write_btn_pause: "⏸️ Pause",
    write_btn_restart: "🔄 Restart",
    write_btn_quiz_start: "✍️ Start Quiz",
    write_btn_quiz_hint: "💡 Show Hint",
    write_btn_quiz_clear: "🧹 Clear Canvas",
    write_quiz_success: "Character written successfully!",
    write_quiz_status_idle: "Click 'Start Quiz' to write on your own.",
    write_diagrams_heading: "Stroke-by-Stroke Diagrams",
    write_diagrams_desc: "Detailed stroke order from left to right (red stroke shows current step, orange/yellow strokes show previously completed ones):",
    write_diagrams_placeholder: "Enter Hanzi above to view the stroke diagrams.",
    write_hsk_heading: "HSK Level Writing Presets",
    write_hsk_desc: "Select HSK vocabulary below to quickly check stroke order and practice writing:",
    write_footer_note: "Animated calligraphy and interactive quiz application running 100% client-side powered by Hanzi Writer.",

    // practice/index.html (Speech Practice)
    practice_title: "AI Pronunciation Trainer – Le Le Learn Chinese",
    practice_nav_title: "Pronunciation",
    practice_search_placeholder: "Enter word to practice...",
    practice_section_practice: "Speaking Practice",
    practice_instructions: "Instructions: Click the Microphone icon, allow recording permissions, and speak the character below out loud. The AI will evaluate your speech.",
    practice_mic_idle: "Click Mic to speak",
    practice_mic_listening: "Listening... Please speak!",
    practice_mic_processing: "Analyzing speech...",
    practice_result_score: "Score:",
    practice_result_detected: "Detected:",
    practice_tip_title: "💡 Speaking tip:",
    practice_tips_content: "Pay attention to Chinese tones! Tone 1 (high flat), Tone 2 (rising), Tone 3 (dipping), Tone 4 (falling).",
    practice_hero_badge: "🎙️ Online & Free",
    practice_hero_title: "AI Pronunciation<br/><span class=\"accent-gradient\">Tone Pair Trainer</span>",
    practice_hero_subtitle: "Record and score your Chinese speaking tones instantly in the browser. Allow micro permission and try saying it! 💬",
    practice_tone_pairs_heading: "1. Tone Pair Practice",
    practice_tone_pairs_desc: "A two-syllable word has 15 tone configurations. Click a grid cell to speak the corresponding tones (green: pass, red: retry).",
    practice_tone_label: "Tone Pair",
    practice_tone_1: "Tone 1",
    practice_tone_2: "Tone 2",
    practice_tone_3: "Tone 3",
    practice_tone_4: "Tone 4",
    practice_sandhi_note: "sandhi",
    practice_lbl_selected_pair: "Selected Pair:",
    practice_lbl_accuracy: "Accuracy Rate:",
    practice_accuracy_none: "Not practiced yet",
    practice_audio_tooltip: "Listen to native audio",
    practice_status_ready: "Ready for practice",
    practice_btn_speak: "Press & Speak",
    practice_btn_next: "Next word →",
    practice_lbl_you_said: "You pronounced:",
    practice_badge_correct: "Correct",
    practice_badge_wrong: "Unmatched",
    practice_hsk_heading: "2. HSK Vocabulary Practice",
    practice_hsk_desc: "Practice speaking words categorized by HSK levels. Select HSK level and speak word-by-word.",
    practice_hsk_level_label: "HSK Level:",
    practice_hsk_level_1: "HSK 1 (Basic)",
    practice_hsk_level_2: "HSK 2 (Elementary)",
    practice_hsk_level_3: "HSK 3 (Intermediate)",
    practice_hsk_level_4: "HSK 4 (Pre-Advanced)",
    practice_hsk_pinyin_hint: "Click to show pinyin",
    practice_hsk_status_ready: "Click mic to speak this word",
    practice_open_heading: "3. Open Speaking Sandbox",
    practice_open_desc: "Speak any word or phrase, and the AI will recognize and convert your speech to Hanzi & standard Pinyin with tone marks.",
    practice_open_len_label: "Expected Length:",
    practice_open_len_1: "1 Syllable (Single)",
    practice_open_len_2: "2 Syllables (Compound)",
    practice_open_len_3: "3 Syllables",
    practice_open_len_4: "4 Syllables / Idiom",
    practice_open_len_free: "Free speech (Any sentence)",
    practice_open_status_ready: "Ready to listen to your voice",
    practice_footer_note: "Speaking feedback application running 100% locally in your browser using Web Speech API.",
    practice_hero_badge: "🎙️ Online & Free",
    practice_hero_title: "AI Pronunciation<br/><span class=\"accent-gradient\">Tone Pair Trainer</span>",
    practice_hero_subtitle: "Record and score your Chinese speaking tones instantly in the browser. Allow micro permission and try saying it! 💬",
    practice_tone_pairs_heading: "1. Tone Pair Practice",
    practice_tone_pairs_desc: "A two-syllable word has 15 tone configurations. Click a grid cell to speak the corresponding tones (green: pass, red: retry).",
    practice_tone_label: "Tone Pair",
    practice_tone_1: "Tone 1",
    practice_tone_2: "Tone 2",
    practice_tone_3: "Tone 3",
    practice_tone_4: "Tone 4",
    practice_sandhi_note: "sandhi",
    practice_lbl_selected_pair: "Selected Pair:",
    practice_lbl_accuracy: "Accuracy Rate:",
    practice_accuracy_none: "Not practiced yet",
    practice_audio_tooltip: "Listen to native audio",
    practice_status_ready: "Ready for practice",
    practice_btn_speak: "Press & Speak",
    practice_btn_next: "Next word →",
    practice_lbl_you_said: "You pronounced:",
    practice_badge_correct: "Correct",
    practice_badge_wrong: "Unmatched",
    practice_hsk_heading: "2. HSK Vocabulary Practice",
    practice_hsk_desc: "Practice speaking words categorized by HSK levels. Select HSK level and speak word-by-word.",
    practice_hsk_level_label: "HSK Level:",
    practice_hsk_level_1: "HSK 1 (Basic)",
    practice_hsk_level_2: "HSK 2 (Elementary)",
    practice_hsk_level_3: "HSK 3 (Intermediate)",
    practice_hsk_level_4: "HSK 4 (Pre-Advanced)",
    practice_hsk_pinyin_hint: "Click to show pinyin",
    practice_hsk_status_ready: "Click mic to speak this word",
    practice_open_heading: "3. Open Speaking Sandbox",
    practice_open_desc: "Speak any word or phrase, and the AI will recognize and convert your speech to Hanzi & standard Pinyin with tone marks.",
    practice_open_len_label: "Expected Length:",
    practice_open_len_1: "1 Syllable (Single)",
    practice_open_len_2: "2 Syllables (Compound)",
    practice_open_len_3: "3 Syllables",
    practice_open_len_4: "4 Syllables / Idiom",
    practice_open_len_free: "Free speech (Any sentence)",
    practice_open_status_ready: "Ready to listen to your voice",
    practice_footer_note: "Speaking feedback application running 100% locally in your browser using Web Speech API.",

    // review/review.html (Book Review Page)
    review_title_tab: "Book Review – Le Le Learn Chinese",
    review_loading: "Loading review...",
    review_error: "😢 Book not found.",
    review_back_shop: "← Back to Bookstore",
    review_badge_lele: "Le Le's Review",
    review_pros: "Pros",
    review_cons: "Cons",
    review_who: "Who is it for?",
    review_price_label: "Est. Price",
    review_buy_at: "Ready to start? Buy at:",
    review_affiliate_note: "* Affiliate link — I earn a small commission, which does not affect the price you pay 🙏",
    review_updating: "Review content is being updated... 🌸",
    review_photos: "Photos inside the book",
    gallery_thumb_label: "View image",
    lightbox_close: "Close",
    lightbox_prev: "Previous image",
    lightbox_next: "Next image",
    lightbox_img_alt: "Zoomed image"
  },
  zh: {
    // Navigation
    nav_home: "首页",
    nav_bookstore: "书店",
    nav_docs: "共享资料",
    nav_practice: "发音练习",
    nav_write: "汉字书写",
    nav_tools: "学习工具",

    // index.html (Homepage)
    home_title: "乐乐学中文 🌸",
    profile_tagline: "轻松、快乐、每天学中文 🌸",
    hero_badge: "🌸 免费学中文",
    hero_title: "与乐乐一起<br><span>攻克中文</span>",
    hero_subtitle: "探索AI发音打分、互动式汉字笔顺书写、以及自定义PDF字帖生成器，完全免费。",
    hero_cta_start: "免费开始学习",
    hero_cta_tools: "生成PDF字帖",
    hero_interactive_title: "跟乐乐学写汉字",
    hero_interactive_play: "播放笔顺",
    hero_interactive_clear: "清除画板",
    showcase_title: "在线互动学习工具",
    showcase_subtitle: "专为提升中文自学效率而设计的互动工具",
    card_bookstore_label: "📚 乐乐推荐书店",
    card_bookstore_sub: "乐乐亲自挑选的中文学习书籍，包含详细评测与官方购买链接。",
    card_bookstore_action: "浏览推荐书店 →",
    card_docs_label: "🎁 共享PDF资料",
    card_docs_sub: "免费下载HSK词汇表、语法要点、以及手写练习PDF模板。",
    card_docs_action: "获取学习资料 →",
    card_practice_label: "🎙️ AI发音评测",
    card_practice_sub: "通过浏览器内置的语音识别和声调配对分析，进行口语发音矫正。",
    card_practice_action: "开始练习口语 →",
    card_write_label: "✍️ 汉字笔顺练习",
    card_write_sub: "带有笔顺动画演示的汉字书写工具，配有智能临摹手写板。",
    card_write_action: "在线练习书写 →",
    card_tools_label: "🛠️ PDF字帖生成器",
    card_tools_sub: "自定义生成田字格/米字格拼音拼写练习帖，直接打印或保存PDF。",
    card_tools_action: "制作PDF字帖 →",
    stats_free: "100% 免费",
    stats_free_sub: "无需注册即可使用",
    stats_hsk: "HSK 词汇标准",
    stats_hsk_sub: "覆盖 1 至 6 级",
    stats_ai: "AI 语音技术",
    stats_ai_sub: "实时发音识别打分",
    bio_section_title: "关于乐乐",
    bio_text: "大家好，我是乐乐！这个网站记录了我从零开始学习中文的历程，并分享了我积累的实用学习资源和自学心得。希望这些在线互动工具能让您的中文学习之旅变得更加轻松、有趣！",
    social_heading: "在社交平台上关注我",
    social_tiktok_desc: "每日更新趣味中文学习短视频",
    social_youtube_desc: "深度教程，听力与书写进阶指南",
    social_facebook_desc: "共享学习资料与最新动态发布",
    footer_text: "一起每天学中文 ♥",

    // shop.html (Bookstore)
    shop_title: "书店 – 乐乐学中文",
    shop_hero_badge: "📚 乐乐甄选",
    shop_hero_title: "中文<br/><span>书籍</span>",
    shop_hero_sub: "这些是我使用过且觉得非常有用的书籍 — 真实分享，绝无虚假广告 🌸",
    shop_section_title: "乐乐推荐书籍",
    shop_section_desc: "通过我的链接购买以支持频道，感谢大家 🙏",
    shop_btn_read_review: "阅读评测",
    shop_price_label: "参考价格",
    shop_updating_links: "正在更新链接...",
    shop_footer_note: "所有共享资料均免费 — 欢迎分享给朋友们一起学习！",

    // docs.html (Shared PDF Documents)
    docs_title: "共享资料 – 乐乐学中文",
    docs_hero_badge: "🎁 完全免费",
    docs_hero_title: "共享<br/><span class=\"docs-gradient\">学习资料</span>",
    docs_hero_sub: "乐乐在自学过程中整理的资料 — 随时下载使用，无需任何注册！ 💚",
    docs_loading: "正在加载资料列表...",
    docs_empty: "此分类下暂无资料。<br/>乐乐会尽快更新！",
    docs_tab_all: "全部",
    docs_tab_vocab: "词汇",
    docs_tab_grammar: "语法",
    docs_tab_hsk: "HSK 考试",
    docs_tab_writing: "书写",
    docs_toast_copied: "链接已复制！",

    // tools.html (Worksheet PDF Generator)
    tools_hero_badge: "🛠️ 学习工具",
    tools_title_tab: "PDF字帖生成器 – 乐乐学中文",
    tools_main_title: "PDF字帖生成器",
    tools_subtitle: "自定义设计并打印标准A4尺寸的汉字描红帖和拼音听写表",
    tools_config_heading: "字帖配置面板",
    tools_label_text_input: "练字汉字字样：",
    tools_placeholder_text_input: "在这里输入需要练习的汉字...",
    tools_label_grid_type: "字帖格子样式：",
    tools_label_grid_style: "字帖显示模式：",
    tools_label_grid_color: "字帖线条颜色：",
    tools_label_page_subtitle: "字帖副标题：",
    tools_placeholder_page_subtitle: "例如：汉字练习第一课",
    tools_label_student_name: "姓名：",
    tools_label_date: "日期：",
    tools_label_class: "班级：",
    tools_presets_heading: "快捷选择 HSK 级别词汇：",
    tools_preview_heading: "A4 页面预览",
    tools_btn_print: "立即打印 / 保存PDF",
    tools_col_name: "姓名：",
    tools_col_date: "日期：",
    tools_col_class: "班级：",
    tools_tianzi: "田字格",
    tools_mizi: "米字格",
    tools_mode_trace: "描红描影字",
    tools_mode_blank: "空白米田格",
    tools_mode_dictation: "看拼音写汉字",
    tools_color_red: "中国红",
    tools_color_gold: "古风金",
    tools_color_gray: "极简灰",
    tools_print_tip: "* 注意：打印或保存为PDF时，请选择A4纸张大小、100%缩放，并勾选“背景图形”。",
    tools_default_title: "汉字书写练习字帖",
    tools_default_subtitle: "乐乐学中文 🌸 每天一起学习进步",
    tools_preview_empty_chars: "在左侧输入汉字以预览字帖。",
    tools_preview_empty_pinyin: "在左侧输入词汇以预览拼音听写表。",
    tools_alert_popup: "请允许浏览器弹出窗口以打印字帖！",
    tools_alert_empty_trace: "请输入至少1个汉字以生成字帖！",
    tools_alert_empty_pinyin: "请输入至少1个汉字词汇以生成拼音听写表！",
    tools_preset_1: "问候语",
    tools_preset_2: "勤奋学习",
    tools_preset_3: "数字 1-10",
    tools_preset_4: "家庭成员",
    tools_preset_5: "星期/周",

    // write/index.html (Hanzi Writing Practice)
    write_title: "汉字笔顺描红 – 乐乐学中文",
    write_nav_title: "汉字书写",
    write_section_config: "搜索与配置",
    write_placeholder_input: "输入汉字...",
    write_btn_search: "搜索",
    write_stroke_speed: "动画速度：",
    write_stroke_speed_slow: "慢",
    write_stroke_speed_normal: "中",
    write_stroke_speed_fast: "快",
    write_panel_animation: "笔顺动画",
    write_panel_practice: "临摹画板",
    write_btn_animate: "播放笔顺",
    write_btn_loop: "循环播放",
    write_btn_toggle_outline: "显示底影",
    write_btn_toggle_outline_hide: "隐藏底影",
    write_btn_clear_canvas: "重新临摹",
    write_btn_clear_canvas_reset: "清除笔迹",
    write_card_guide: "分步笔画图",
    write_status_loading: "正在加载数据...",
    write_status_not_found: "未找到该汉字的数据。",
    write_hero_title: "查笔顺 & 智能<br/><span class=\"accent-gradient\">互动汉字临摹</span>",
    write_hero_subtitle: "学习标准汉字笔顺，查看动画演示，并在网页手写板上用鼠标或触摸屏直接临摹练习。",
    write_search_placeholder: "输入需要查询的汉字（例如：你、谢谢、学习）...",
    write_active_char: "正在书写：",
    write_canvas_animate: "笔顺动画演示",
    write_canvas_quiz: "自由临摹画板",
    write_btn_view_animate: "📺 演示笔画",
    write_btn_pause: "⏸️ 暂停",
    write_btn_restart: "🔄 重新播放",
    write_btn_quiz_start: "✍️ 开始临摹",
    write_btn_quiz_hint: "💡 提示一下",
    write_btn_quiz_clear: "🧹 清除笔迹",
    write_quiz_success: "汉字书写完成，非常棒！",
    write_quiz_status_idle: "点击“开始临摹”即可在画板上书写。",
    write_diagrams_heading: "分步笔顺分解图",
    write_diagrams_desc: "从左到右细分笔顺（红色代表当前笔画，黄色代表已完成的笔画）：",
    write_diagrams_placeholder: "在上方输入汉字以查看分步笔顺分解图。",
    write_hsk_heading: "HSK 级别字样预设",
    write_hsk_desc: "在下方快捷选择 HSK 级别词汇以查询笔顺并练习书写：",
    write_footer_note: "笔顺演示与智能手写临摹工具，100%浏览器端运行，基于 Hanzi Writer 库开发。",

    // practice/index.html (Speech Practice)
    practice_title: "AI发音评测 – 乐乐学中文",
    practice_nav_title: "发音练习",
    practice_search_placeholder: "输入需要练习发音的词汇...",
    practice_section_practice: "发音评测面板",
    practice_instructions: "使用说明：点击麦克风图标，允许麦克风权限并大声朗读下方的汉字。系统将实时评测您的发音。",
    practice_mic_idle: "点击麦克风开始说话",
    practice_mic_listening: "正在录音... 请朗读！",
    practice_mic_processing: "正在分析发音...",
    practice_result_score: "得分：",
    practice_result_detected: "识别内容：",
    practice_tip_title: "💡 发音小贴士：",
    practice_tips_content: "注意汉语声调！一声平，二声扬，三声拐弯，四声降。",
    practice_hero_badge: "🎙️ 网页端免注册",
    practice_hero_title: "AI 声调配对<br/><span class=\"accent-gradient\">口语发音打分</span>",
    practice_hero_subtitle: "通过浏览器内置麦克风录音并自动为您的中文发音进行声调打分。点击按钮大声说出来吧！💬",
    practice_tone_pairs_heading: "1. 词汇双声调练习",
    practice_tone_pairs_desc: "双音节词有15种声调组合。点击表格内任一单元格练习对应词汇（绿色：发音优秀，红色：继续努力）。",
    practice_tone_label: "声调组合",
    practice_tone_1: "一声",
    practice_tone_2: "二声",
    practice_tone_3: "三声",
    practice_tone_4: "四声",
    practice_sandhi_note: "变调",
    practice_lbl_selected_pair: "当前选择：",
    practice_lbl_accuracy: "正确比率：",
    practice_accuracy_none: "未练习",
    practice_audio_tooltip: "听示范发音",
    practice_status_ready: "已就绪，等待朗读",
    practice_btn_speak: "按下并说话",
    practice_btn_next: "换个词语 →",
    practice_lbl_you_said: "识别结果：",
    practice_badge_correct: "正确",
    practice_badge_wrong: "不匹配",
    practice_hsk_heading: "2. HSK 级别词汇发音",
    practice_hsk_desc: "按 HSK 考试级别进行朗读发音练习。选择级别并逐词跟读练习。",
    practice_hsk_level_label: "HSK级别：",
    practice_hsk_level_1: "HSK 1级 (基础)",
    practice_hsk_level_2: "HSK 2级 (初级)",
    practice_hsk_level_3: "HSK 3级 (中级)",
    practice_hsk_level_4: "HSK 4级 (中高级)",
    practice_hsk_pinyin_hint: "点击显示拼音",
    practice_hsk_status_ready: "点击麦克风朗读此词汇",
    practice_open_heading: "3. 自由发音沙盒",
    practice_open_desc: "说出任何中文词语或句子，AI将实时识别并转换为带声调的拼音和汉字。",
    practice_open_len_label: "字数限制：",
    practice_open_len_1: "单音节 (1字)",
    practice_open_len_2: "双音节 (2字)",
    practice_open_len_3: "3音节 (3字)",
    practice_open_len_4: "4音节 / 成语",
    practice_open_len_free: "自由发挥 (不限字数)",
    practice_open_status_ready: "已就绪，倾听您的声音",
    practice_footer_note: "智能发音口语训练器，100%本地端运行，基于浏览器内置 Web Speech API 运行。",

    // review/review.html (Book Review Page)
    review_title_tab: "书籍评测 – 乐乐学中文",
    review_loading: "正在加载评测内容...",
    review_error: "😢 未找到该书籍。",
    review_back_shop: "← 返回书店",
    review_badge_lele: "乐乐书评",
    review_pros: "优点/推荐点",
    review_cons: "使用注意",
    review_who: "适用对象",
    review_price_label: "参考价格",
    review_buy_at: "准备好开始了吗？购买渠道：",
    review_affiliate_note: "* 推广链接 — 我会获得微薄的佣金，但这不会影响您的购买价格 🙏",
    review_updating: "评测内容正在更新中... 🌸",
    review_photos: "内页插图",
    gallery_thumb_label: "查看图片",
    lightbox_close: "关闭",
    lightbox_prev: "上一张",
    lightbox_next: "下一张",
    lightbox_img_alt: "放大图片"
  }
};

class I18nManager {
  constructor() {
    this.currentLang = localStorage.getItem('lang') || 'vi';
    if (!['vi', 'en', 'zh'].includes(this.currentLang)) {
      this.currentLang = 'vi';
    }
    this.flagEmojis = { vi: '🇻🇳', en: '🇬🇧', zh: '🇨🇳' };
  }

  init() {
    this.applyLanguage(this.currentLang);
    this.injectLanguageSelector();
    
    // Watch for dynamic content changes if needed
    window.addEventListener('DOMContentLoaded', () => {
      this.translateDOM();
      this.injectLanguageSelector();
      this.setupSelectorListeners();
    });
  }

  // Get translated string
  t(key, fallback = '') {
    const dict = TRANSLATIONS[this.currentLang];
    return (dict && dict[key]) ? dict[key] : (TRANSLATIONS['vi'][key] || fallback || key);
  }

  // Set the language and save to local storage
  setLanguage(lang) {
    if (!['vi', 'en', 'zh'].includes(lang)) return;
    this.currentLang = lang;
    localStorage.setItem('lang', lang);
    this.applyLanguage(lang);
    this.translateDOM();
    
    // Dispatch global event for other scripts to respond
    window.dispatchEvent(new CustomEvent('langChanged', { detail: { lang } }));
  }

  // Apply language state to document html node
  applyLanguage(lang) {
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : lang);
  }

  // Run DOM-wide translation
  translateDOM() {
    // Translate text nodes using data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        // Support html content if key has HTML tags, otherwise textContent
        if (translation.includes('<') && translation.includes('>')) {
          el.innerHTML = translation;
        } else {
          el.textContent = translation;
        }
      }
    });

    // Translate placeholder attributes using data-i18n-placeholder
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      const translation = this.t(key);
      if (translation) {
        el.setAttribute('placeholder', translation);
      }
    });

    // Translate title attributes using data-i18n-title
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      const translation = this.t(key);
      if (translation) {
        el.setAttribute('title', translation);
      }
    });

    // Translate aria-label attributes using data-i18n-aria-label
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria-label');
      const translation = this.t(key);
      if (translation) {
        el.setAttribute('aria-label', translation);
      }
    });

    // Handle title tags
    const titleEl = document.querySelector('title[data-i18n]');
    if (titleEl) {
      const key = titleEl.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        document.title = translation;
      }
    }
  }

  // Inject the glassmorphic selector dropdown into #lang-selector
  injectLanguageSelector() {
    const containers = document.querySelectorAll('#lang-selector');
    if (containers.length === 0) return;

    const currentLabels = { vi: 'VI', en: 'EN', zh: 'ZH' };

    containers.forEach(container => {
      // Avoid duplicate injections
      if (container.querySelector('.lang-dropdown-wrapper')) return;

      container.innerHTML = `
        <div class="lang-dropdown-wrapper">
          <button class="lang-dropdown-trigger" aria-haspopup="listbox" aria-expanded="false" id="lang-btn">
            <span class="lang-current-flag" style="font-size: 1.2rem; margin-right: 0.3rem; line-height: 1;">${this.flagEmojis[this.currentLang]}</span>
            <span class="lang-current-code">${currentLabels[this.currentLang]}</span>
            <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <ul class="lang-dropdown-menu" role="listbox" aria-labelledby="lang-btn">
            <li class="lang-dropdown-item ${this.currentLang === 'vi' ? 'active' : ''}" data-value="vi" role="option" aria-selected="${this.currentLang === 'vi'}">
              <span class="lang-flag" style="font-size: 1.1rem; margin-right: 0.4rem; line-height: 1;">🇻🇳</span> Tiếng Việt
            </li>
            <li class="lang-dropdown-item ${this.currentLang === 'en' ? 'active' : ''}" data-value="en" role="option" aria-selected="${this.currentLang === 'en'}">
              <span class="lang-flag" style="font-size: 1.1rem; margin-right: 0.4rem; line-height: 1;">🇬🇧</span> English
            </li>
            <li class="lang-dropdown-item ${this.currentLang === 'zh' ? 'active' : ''}" data-value="zh" role="option" aria-selected="${this.currentLang === 'zh'}">
              <span class="lang-flag" style="font-size: 1.1rem; margin-right: 0.4rem; line-height: 1;">🇨🇳</span> 中文
            </li>
          </ul>
        </div>
      `;
    });

    this.setupSelectorListeners();
  }

  // Attach dropdown trigger events and item select events
  setupSelectorListeners() {
    const wrappers = document.querySelectorAll('.lang-dropdown-wrapper');
    
    wrappers.forEach(wrapper => {
      const trigger = wrapper.querySelector('.lang-dropdown-trigger');
      const menu = wrapper.querySelector('.lang-dropdown-menu');
      const items = wrapper.querySelectorAll('.lang-dropdown-item');

      // Toggle dropdown
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const expanded = trigger.getAttribute('aria-expanded') === 'true';
        
        // Close others
        document.querySelectorAll('.lang-dropdown-trigger').forEach(btn => {
          btn.setAttribute('aria-expanded', 'false');
          btn.parentElement.classList.remove('open');
        });

        trigger.setAttribute('aria-expanded', !expanded);
        wrapper.classList.toggle('open', !expanded);
      });

      // Item selection
      items.forEach(item => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const val = item.getAttribute('data-value');
          this.setLanguage(val);

          // Update trigger label and flag
          const codeEl = trigger.querySelector('.lang-current-code');
          if (codeEl) codeEl.textContent = val.toUpperCase();
          const flagEl = trigger.querySelector('.lang-current-flag');
          if (flagEl) flagEl.textContent = this.flagEmojis[val];

          // Close menu
          trigger.setAttribute('aria-expanded', 'false');
          wrapper.classList.remove('open');

          // Highlight selection
          items.forEach(i => {
            i.classList.remove('active');
            i.setAttribute('aria-selected', 'false');
          });
          item.classList.add('active');
          item.setAttribute('aria-selected', 'true');
        });
      });
    });

    // Close on click outside
    document.addEventListener('click', () => {
      wrappers.forEach(w => {
        const trigger = w.querySelector('.lang-dropdown-trigger');
        if (trigger) {
          trigger.setAttribute('aria-expanded', 'false');
          w.classList.remove('open');
        }
      });
    });
  }
}

// Instantiate and expose globally
window.i18n = new I18nManager();
window.i18n.init();
