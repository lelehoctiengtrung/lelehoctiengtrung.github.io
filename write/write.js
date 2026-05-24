/* ============================================================
   write.js — Lê Lê Chinese Stroke Order & Writing practice
   Controller using Hanzi Writer library for animations
   and interactive drawing quizzes.
   ============================================================ */

// ── PINYIN CHARACTER DICTIONARY (Common characters) ────────────────
const PINYIN_DICT = {
  "一": "yī", "二": "èr", "三": "sān", "四": "sì", "五": "wǔ", "六": "liù", "七": "qī", "八": "bā", "九": "jiǔ", "十": "shí", "百": "bǎi", "千": "qiān",
  "我": "wǒ", "你": "nǐ", "他": "tā", "她": "tā", "它": "tā", "们": "men", "这": "zhè", "那": "nà", "哪": "nǎ", "谁": "shéi", "什": "shén", "么": "me",
  "的": "de", "得": "de", "地": "de", "了": "le", "过": "guò", "着": "zhe", "吧": "ba", "ma": "ma", "呢": "ne", "呀": "ya", "不": "bù", "很": "hěn", "太": "tài",
  "都": "dōu", "和": "hé", "在": "zài", "有": "yǒu", "没": "méi", "去": "qù", "来": "lái", "里": "lǐ", "外": "wài", "上": "shàng", "下": "xià", "左": "zuǒ", "右": "yòu",
  "是": "shì", "做": "zuò", "写": "xiě", "说": "shuō", "听": "tīng", "读": "dú", "看": "kàn", "见": "jiàn", "吃": "chī", "喝": "hē", "爱": "ài", "想": "xiǎng",
  "喜欢": "xǐhuan", "喜": "xǐ", "欢": "huān", "苹": "píng", "果": "guǒ", "谢": "xiè", "医": "yī", "生": "shēng", "汉": "hàn", "语": "yǔ", "星": "xīng", "期": "qī",
  "衣": "yī", "服": "fu", "学": "xué", "习": "xí", "老": "lǎo", "师": "shī", "朋": "péng", "友": "you", "睡": "shuì", "觉": "jiào", "电": "diàn", "脑": "nǎo",
  "影": "yǐng", "飞": "fēi", "机": "jī", "名": "míng", "字": "zi", "昨": "zuó", "天": "tiān", "今": "jīn", "明": "míng", "跑": "pǎo", "步": "bù", "唱": "chàng",
  "歌": "gē", "旅": "lǚ", "biến hóa": "yóu", "运": "yùn", "动": "dòng", "准": "zhǔn", "备": "bèi", "帮": "bāng", "助": "zhù", "介": "jiè", "绍": "shào", "告": "gào",
  "诉": "su", "身": "shēn", "体": "tǐ", "便": "pián", "宜": "yi", "时": "shí", "giai đoạn": "jiān", "词": "cí", "典": "diǎn", "经": "jīng", "常": "cháng", "愿": "yuàn",
  "意": "yì", "简": "jiǎn", "单": "dān", "响": "xiǎng", "办": "bàn", "法": "fǎ", "历": "lì", "史": "shǐ", "音": "yīn", "乐": "yuè", "干": "gān", "净": "jìng",
  "突": "tū", "然": "rán", "努": "nǔ", "力": "lì", "发": "fā", "现": "xiàn", "环": "huán", "境": "jìng", "关": "guān", "键": "jiàn", "骄": "jiāo", "傲": "ào",
  "调": "diào", "查": "chá", "拒": "jù", "绝": "jué", "甚": "shèn", "至": "zhì", "翻": "fān", "giải thích": "yì", "招": "zhāo", "聘": "pìn", "复": "fù", "杂": "zá",
  "解": "jiě", "释": "shì", "鼓": "gǔ", "励": "lì", "tảo": "tǎo", "论": "lùn", "家": "jiā", "人": "rén", "bà": "bà", "mā": "mā", "哥": "gē", "姐": "jiě",
  "đệ": "dì", "妹": "mèi", "māo": "māo", "gǒu": "gǒu", "yú": "yú", "mǐ": "mǐ", "fàn": "fàn", "miàn": "miàn", "茶": "chá", "水": "shuǐ", "bēi": "bēi", "lěng": "lěng",
  "热": "rè", "duō": "duō", "shao": "shǎo", "suì": "suì", "hào": "hào", "diǎn": "diǎn", "fēn": "fēn", "qián": "qián", "买": "mǎi", "kāi": "kāi", "坐": "zuò", "住": "zhù",
  "gāo": "gāo", "xìng": "xìng", "请": "qǐng", "喂": "wèi", "客": "kè", "气": "qì", "再": "zài", "北": "běi", "京": "jīng", "东": "dōng", "西": "xī",
  "号": "hào", "路": "lù", "车": "chē", "站": "zhàn", "票": "piào", "报": "bào", "纸": "zhǐ", "送": "sòng", "等": "děng", "错": "cuò", "懂": "dǒng",
  "完": "wán", "新": "xīn", "旧": "jiù", "黑": "hēi", "红": "hóng", "白": "bái", "lǜ": "lǜ", "蓝": "lán", "黄": "huáng", "百": "bǎi", "千": "qiān",
  "晴": "qíng", "阴": "yīn", "雪": "xuě", "药": "yào", "病": "bìng", "笑": "xiào", "哭": "kū", "穿": "chuān", "洗": "xǐ", "给": "gěi", "找": "zhǎo",
  // Write character maps
  "场": "chǎng", "饱": "bǎo", "板": "bǎn", "回": "huí", "答": "dá", "食": "shí", "堂": "táng",
  "银": "yín", "行": "háng", "其": "qí", "实": "shí", "决": "jué", "定": "dìng", "惯": "guàn",
  "戏": "xì", "同": "tóng", "火": "huǒ", "普": "pǔ", "通": "tōng", "每": "měi", "起": "qǐ",
  "床": "chuáng", "可": "kě", "能": "néng", "小": "xiǎo", "好": "hǎo", "以": "yǐ", "脸": "liǎn",
  "包": "bāo", "认": "rèn", "真": "zhēn", "半": "bàn", "汽": "qì", "问": "wèn", "题": "tí",
  "特": "tè", "别": "bié", "练": "liàn", "年": "nián"
};

// ── FULL DICTIONARY DEFINITIONS ─────────────────────────────────────
const DICT_LOOKUP = {
  // HSK 1
  "医生": { py: "yīshēng", vi: "Bác sĩ" },
  "星期": { py: "xīngqī", vi: "Tuần" },
  "飞机": { py: "fēijī", vi: "Máy bay" },
  "今天": { py: "jīntiān", vi: "Hôm nay" },
  "苹果": { py: "píngguǒ", vi: "Quả táo" },
  "朋友": { py: "péngyou", vi: "Bạn bè" },
  "昨天": { py: "zuótiān", vi: "Hôm qua" },
  "明天": { py: "míngtiān", vi: "Ngày mai" },
  "名字": { py: "míngzi", vi: "Tên" },
  "学习": { py: "xuéxí", vi: "Học tập" },
  "老师": { py: "lǎoshī", vi: "Giáo viên" },
  "汉语": { py: "Hànyǔ", vi: "Tiếng Trung" },
  "电脑": { py: "diànnǎo", vi: "Máy tính" },
  "电影": { py: "diànyǐng", vi: "Phim" },
  "谢谢": { py: "xièxie", vi: "Cảm ơn" },
  "睡觉": { py: "shuìjiào", vi: "Đi ngủ" },
  "吃饱": { py: "chībǎo", vi: "Ăn no" },
  "北京": { py: "Běijīng", vi: "Bắc Kinh" },
  "每天": { py: "měitiān", vi: "Mỗi ngày" },
  "水果": { py: "shuǐguǒ", vi: "Hoa quả" },
  "很好": { py: "hěnhǎo", vi: "Rất tốt" },
  // HSK 2
  "唱歌": { py: "chànggē", vi: "Hát" },
  "跑步": { py: "pǎobù", vi: "Chạy bộ" },
  "旅游": { py: "lǚyóu", vi: "Đi du lịch" },
  "运动": { py: "yùndòng", vi: "Thể thao" },
  "准备": { py: "zhǔnbèi", vi: "Chuẩn bị" },
  "帮助": { py: "bāngzhù", vi: "Giúp đỡ" },
  "介绍": { py: "jièshào", vi: "Giới thiệu" },
  "欢迎": { py: "huānyíng", vi: "Hoan nghênh" },
  "告诉": { py: "gàosu", vi: "Cho biết" },
  "身体": { py: "shēntǐ", vi: "Sức khoẻ" },
  "便宜": { py: "piányi", vi: "Rẻ" },
  "时间": { py: "shíjiān", vi: "Thời gian" },
  "词典": { py: "cídiǎn", vi: "Từ điển" },
  "机场": { py: "jīchǎng", vi: "Sân bay" },
  "听懂": { py: "tīngdǒng", vi: "Nghe hiểu" },
  "回答": { py: "huídá", vi: "Trả lời" },
  "食堂": { py: "shítáng", vi: "Nhà ăn" },
  "银行": { py: "yínháng", vi: "Ngân hàng" },
  "火车": { py: "huǒchē", vi: "Tàu hoả" },
  "起床": { py: "qǐchuáng", vi: "Ngủ dậy" },
  "可能": { py: "kěnéng", vi: "Có thể" },
  "小时": { py: "xiǎoshí", vi: "Tiếng đồng hồ" },
  "可以": { py: "kěyǐ", vi: "Có thể" },
  "面包": { py: "miànbāo", vi: "Bánh mì" },
  "汽车": { py: "qìchē", vi: "Xe ô tô" },
  "问题": { py: "wèntí", vi: "Vấn đề" },
  "练习": { py: "liànxí", vi: "Luyện tập" },
  "去年": { py: "qùnián", vi: "Năm ngoái" },
  // HSK 3
  "经常": { py: "jīngcháng", vi: "Thường xuyên" },
  "愿意": { py: "yuànyì", vi: "Bằng lòng" },
  "简单": { py: "jiǎndān", vi: "Đơn giản" },
  "影响": { py: "yǐngxiǎng", vi: "Ảnh hưởng" },
  "办法": { py: "bànfǎ", vi: "Biện pháp" },
  "历史": { py: "lìshǐ", vi: "Lịch sử" },
  "音乐": { py: "yīnyuè", vi: "Âm nhạc" },
  "干净": { py: "gānjìng", vi: "Sạch sẽ" },
  "突然": { py: "tūrán", vi: "Đột nhiên" },
  "努力": { py: "nǔlì", vi: "Cố gắng" },
  "发现": { py: "fāxiàn", vi: "Phát hiện" },
  "环境": { py: "huánjìng", vi: "Môi trường" },
  "黑板": { py: "hēibǎn", vi: "Bảng đen" },
  "其实": { py: "qíshí", vi: "Thực ra" },
  "决定": { py: "juédìng", vi: "Quyết định" },
  "游戏": { py: "yóuxì", vi: "Trò chơi" },
  "同意": { py: "tóngyì", vi: "Đồng ý" },
  "了解": { py: "liǎojiě", vi: "Hiểu rõ" },
  "语法": { py: "yǔfǎ", vi: "Ngữ pháp" },
  "有点": { py: "yǒudiǎn", vi: "Có chút / Hơi" },
  "认真": { py: "rènzhēn", vi: "Nghiêm túc" },
  "半天": { py: "bàntiān", vi: "Nửa ngày" },
  "特别": { py: "tèbié", vi: "Đặc biệt" },
  // HSK 4
  "关键": { py: "guānjiàn", vi: "Mấu chốt" },
  "骄傲": { py: "jiāo'ào", vi: "Kiêu ngạo" },
  "调查": { py: "diàochá", vi: "Điều tra" },
  "拒绝": { py: "jùjué", vi: "Từ chối" },
  "biến hóa": { py: "biànhuà", vi: "Thay đổi" },
  "翻译": { py: "fānyì", vi: "Phiên dịch" },
  "复杂": { py: "fùzá", vi: "Phức tạp" },
  "习惯": { py: "xíguàn", vi: "Thói quen" },
  "解释": { py: "jiěshì", vi: "Giải thích" },
  "招聘": { py: "zhāopìn", vi: "Tuyển dụng" },
  // Characters
  "你": { py: "nǐ", vi: "Bạn, anh, chị" },
  "好": { py: "hǎo", vi: "Tốt, khoẻ, ngon" },
  "我": { py: "wǒ", vi: "Tôi, ta, tớ" }
};

// ── HSK PRESET SELECTION DATABASE ────────────────────────────────────
const HSK_PRESETS = {
  1: [
    { hz: "你", py: "nǐ", vi: "Bạn, anh, chị" },
    { hz: "好", py: "hǎo", vi: "Tốt, khoẻ, ngon" },
    { hz: "谢谢", py: "xièxie", vi: "Cảm ơn" },
    { hz: "我", py: "wǒ", vi: "Tôi, ta, tớ" },
    { hz: "医生", py: "yīshēng", vi: "Bác sĩ" },
    { hz: "飞机", py: "fēijī", vi: "Máy bay" },
    { hz: "苹果", py: "píngguǒ", vi: "Quả táo" },
    { hz: "老师", py: "lǎoshī", vi: "Giáo viên" },
    { hz: "星期", py: "xīngqī", vi: "Tuần" },
    { hz: "汉语", py: "Hànyǔ", vi: "Tiếng Trung" }
  ],
  2: [
    { hz: "唱歌", py: "chànggē", vi: "Hát" },
    { hz: "跑步", py: "pǎobù", vi: "Chạy bộ" },
    { hz: "旅游", py: "lǚyóu", vi: "Đi du lịch" },
    { hz: "准备", py: "zhǔnbèi", vi: "Chuẩn bị" },
    { hz: "身体", py: "shēntǐ", vi: "Sức khoẻ" },
    { hz: "时间", py: "shíjiān", vi: "Thời gian" },
    { hz: "便宜", py: "piányi", vi: "Rẻ" },
    { hz: "欢迎", py: "huānyíng", vi: "Hoan nghênh" },
    { hz: "起床", py: "qǐchuáng", vi: "Ngủ dậy" },
    { hz: "可以", py: "kěyǐ", vi: "Có thể" }
  ],
  3: [
    { hz: "简单", py: "jiǎndān", vi: "Đơn giản" },
    { hz: "音乐", py: "yīnyuè", vi: "Âm nhạc" },
    { hz: "突然", py: "tūrán", vi: "Đột nhiên" },
    { hz: "努力", py: "nǔlì", vi: "Cố gắng" },
    { hz: "干净", py: "gānjìng", vi: "Sạch sẽ" },
    { hz: "经常", py: "jīngcháng", vi: "Thường xuyên" },
    { hz: "环境", py: "huánjìng", vi: "Môi trường" },
    { hz: "同意", py: "tóngyì", vi: "Đồng ý" },
    { hz: "了解", py: "liǎojiě", vi: "Hiểu rõ" },
    { hz: "游戏", py: "yóuxì", vi: "Trò chơi" }
  ],
  4: [
    { hz: "关键", py: "guānjiàn", vi: "Mấu chốt" },
    { hz: "骄傲", py: "jiāo'ào", vi: "Kiêu ngạo" },
    { hz: "调查", py: "diàochá", vi: "Điều tra" },
    { hz: "拒绝", py: "jùjué", vi: "Từ chối" },
    { hz: "biến hóa", py: "biànhuà", vi: "Thay đổi" },
    { hz: "翻译", py: "fānyì", vi: "Phiên dịch" },
    { hz: "复杂", py: "fùzá", vi: "Phức tạp" },
    { hz: "习惯", py: "xíguàn", vi: "Thói quen" },
    { hz: "解释", py: "jiěshì", vi: "Giải thích" },
    { hz: "招聘", py: "zhāopìn", vi: "Tuyển dụng" }
  ]
};

// ── CORE APP CONTROLLER CLASS ────────────────────────────────────────
class StrokePracticeApp {
  constructor() {
    this.writer = null;
    this.activePhrase = "你";
    this.charList = ["你"];
    this.activeCharIndex = 0;
    
    // Quiz/Anim settings
    this.isQuizActive = false;
    this.animationSpeed = 1.0;
    this.hskActiveLevel = 1;

    // Bind DOM
    this.initDOM();
    this.attachEvents();

    // Initial renders
    this.renderHskPresets(1);
    this.loadPhrase("你");
  }

  initDOM() {
    this.searchForm     = document.getElementById("search-form");
    this.searchInput    = document.getElementById("search-input");
    this.btnSearch      = document.getElementById("btn-search");
    
    // Navigation
    this.charNavBox     = document.getElementById("character-nav");
    this.charNavInfo    = document.getElementById("char-nav-info");
    this.btnPrevChar    = document.getElementById("btn-prev-char");
    this.btnNextChar    = document.getElementById("btn-next-char");

    // Board
    this.targetContainer = document.getElementById("character-target");
    this.loadingSpinner  = document.getElementById("loading-spinner");
    this.successBadge    = document.getElementById("success-badge");

    // Active Word Details elements
    this.infoWordHz      = document.getElementById("info-word-hz");
    this.infoWordPy      = document.getElementById("info-word-py");
    this.infoWordVi      = document.getElementById("info-word-vi");
    this.infoCharHz      = document.getElementById("info-char-hz");
    this.infoCharPy      = document.getElementById("info-char-py");

    // Controls
    this.btnAnimate     = document.getElementById("btn-animate");
    this.btnPause       = document.getElementById("btn-pause");
    this.btnResetAnim   = document.getElementById("btn-reset-anim");
    this.speedSlider    = document.getElementById("speed-slider");
    this.speedValLabel  = document.getElementById("speed-val");

    // Quiz
    this.btnQuiz        = document.getElementById("btn-quiz");
    this.btnQuizHint    = document.getElementById("btn-quiz-hint");
    this.btnQuizReset   = document.getElementById("btn-quiz-reset");
    this.quizStatusBox  = document.getElementById("quiz-status");

    // Steps
    this.stepsContainer = document.getElementById("stroke-steps");

    // Preset Lists
    this.presetWordsList = document.getElementById("preset-words-list");

    // Toast
    this.toast    = document.getElementById("write-toast");
    this.toastMsg = document.getElementById("toast-msg");
  }

  showToast(msg) {
    if (!this.toast || !this.toastMsg) return;
    this.toastMsg.textContent = msg;
    this.toast.classList.add("show");
    setTimeout(() => this.toast.classList.remove("show"), 2800);
  }

  // ── CHARACTER LOADING ──────────────────────────────────────────────
  async loadCharacter(char) {
    if (!char) return;
    
    // Cancel active quiz states
    this.isQuizActive = false;
    this.successBadge.classList.add("hidden");
    this.targetContainer.innerHTML = ""; // Clear canvas
    this.loadingSpinner.classList.remove("hidden");
    this.updateQuizUI();

    // Update current drawing character info details in the banner
    if (this.infoCharHz && this.infoCharPy) {
      this.infoCharHz.textContent = char;
      const pinyin = PINYIN_DICT[char] || char;
      this.infoCharPy.textContent = `(${pinyin})`;
    }

    try {
      // Initialize Hanzi Writer instance
      this.writer = HanziWriter.create("character-target", char, {
        width: 300,
        height: 300,
        padding: 15,
        showOutline: true,
        strokeColor: "#D4AF37",      // Gold for model strokes
        outlineColor: "rgba(255, 255, 255, 0.15)",     // Soft outline visible on dark background
        drawingColor: "#C0392B",     // Red for active drawing
        highlightColor: "#D4AF37",   // Gold for highlight hint
        drawingWidth: 16,
        drawingPadding: 20
      });

      // Fetch character details & render steps
      await this.renderStrokeSteps(char);

      this.loadingSpinner.classList.add("hidden");
      this.showToast(`Đã tải chữ "${char}" thành công!`);

      // Start quiz or animate initially
      this.writer.animateCharacter();
    } catch (error) {
      console.error("HanziWriter load error:", error);
      this.loadingSpinner.classList.add("hidden");
      this.showToast("Không tìm thấy dữ liệu nét vẽ cho ký tự này!");
      this.targetContainer.innerHTML = `<div style="color:#d4af37; font-size:4rem; font-family:'Noto Serif SC', serif;">${char}</div>`;
      this.stepsContainer.innerHTML = `<p class="placeholder-text">Không có sơ đồ nét vẽ cho chữ "${char}".</p>`;
    }
  }

  // ── STATIC STEP SVGS GENERATION ────────────────────────────────────
  async renderStrokeSteps(char) {
    this.stepsContainer.innerHTML = ""; // Clear previous steps

    // Load raw SVG stroke data from HanziWriter CDN
    const charData = await HanziWriter.loadCharacterData(char);
    if (!charData || !charData.strokes) {
      this.stepsContainer.innerHTML = `<p class="placeholder-text">Không tìm thấy sơ đồ nét vẽ cho chữ "${char}".</p>`;
      return;
    }

    const strokes = charData.strokes;
    const totalStrokes = strokes.length;

    // Use HanziWriter utility to get scaling transform
    const transformData = HanziWriter.getScalingTransform(1024, 1024, 120); // Scale to 1024x1024 viewBox with 120px padding
    const transformStr = transformData.transform;

    for (let i = 0; i < totalStrokes; i++) {
      const stepBox = document.createElement("div");
      stepBox.className = "stroke-step-box";
      
      // Step number circle
      const badge = document.createElement("div");
      badge.className = "step-number-badge";
      badge.textContent = i + 1;
      stepBox.appendChild(badge);

      // Create SVG
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      svg.setAttribute("viewBox", "0 0 1024 1024");
      svg.setAttribute("width", "70");
      svg.setAttribute("height", "70");

      // Draw dashed worksheet grid inside step box
      const gridPaths = [
        "M 0 512 L 1024 512",
        "M 512 0 L 512 1024",
        "M 0 0 L 1024 1024",
        "M 1024 0 L 0 1024"
      ];
      gridPaths.forEach((d) => {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "path");
        line.setAttribute("d", d);
        line.setAttribute("stroke", "rgba(212, 175, 55, 0.08)");
        line.setAttribute("stroke-width", "8");
        line.setAttribute("stroke-dasharray", "20,20");
        svg.appendChild(line);
      });

      // Group for transformed strokes
      const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
      g.setAttribute("transform", transformStr);

      // Render all strokes in this step
      strokes.forEach((strokePath, sIdx) => {
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", strokePath);

        if (sIdx < i) {
          // Completed strokes: Gold, slightly faded
          path.setAttribute("fill", "#D4AF37");
          path.setAttribute("opacity", "0.65");
        } else if (sIdx === i) {
          // Current active stroke: Highlighted in Red
          path.setAttribute("fill", "#C0392B");
          path.setAttribute("opacity", "1.0");
        } else {
          // Future strokes: Dark outline background
          path.setAttribute("fill", "rgba(255, 255, 255, 0.05)");
          path.setAttribute("stroke", "rgba(255, 255, 255, 0.15)");
          path.setAttribute("stroke-width", "5");
        }
        g.appendChild(path);
      });

      svg.appendChild(g);
      stepBox.appendChild(svg);
      this.stepsContainer.appendChild(stepBox);
    }
  }

  // ── MULTI-CHARACTER PHRASE ENGINE ─────────────────────────────────
  loadPhrase(phrase) {
    if (!phrase) return;
    
    // Clean string to include only Chinese characters
    const cleanPhrase = phrase.replace(/[^\u4e00-\u9fa5]/g, "");
    if (cleanPhrase.length === 0) {
      this.showToast("Vui lòng nhập ký tự chữ Hán hợp lệ!");
      return;
    }

    this.activePhrase = cleanPhrase;
    this.charList = cleanPhrase.split("");
    this.activeCharIndex = 0;

    // Look up dictionary definition info
    const definition = DICT_LOOKUP[cleanPhrase];
    if (definition) {
      this.infoWordHz.textContent = cleanPhrase;
      this.infoWordPy.textContent = `(${definition.py})`;
      this.infoWordVi.textContent = definition.vi;
    } else {
      // Fallback translation character by character
      const pyTranslated = cleanPhrase.split("").map(c => PINYIN_DICT[c] || c).join(" ");
      this.infoWordHz.textContent = cleanPhrase;
      this.infoWordPy.textContent = `(${pyTranslated})`;
      this.infoWordVi.textContent = "Từ tự tra cứu";
    }

    this.updateCharNavigation();
    this.loadCharacter(this.charList[0]);
  }

  updateCharNavigation() {
    if (this.charList.length <= 1) {
      this.charNavBox.classList.add("hidden");
    } else {
      this.charNavBox.classList.remove("hidden");
      this.charNavInfo.textContent = `Ký tự ${this.activeCharIndex + 1} / ${this.charList.length} ("${this.charList[this.activeCharIndex]}")`;
    }
  }

  prevChar() {
    if (this.activeCharIndex > 0) {
      this.activeCharIndex--;
      this.updateCharNavigation();
      this.loadCharacter(this.charList[this.activeCharIndex]);
    }
  }

  nextChar() {
    if (this.activeCharIndex < this.charList.length - 1) {
      this.activeCharIndex++;
      this.updateCharNavigation();
      this.loadCharacter(this.charList[this.activeCharIndex]);
    }
  }

  // ── ANIMATION TRIGGERS ─────────────────────────────────────────────
  animate() {
    if (this.writer) {
      this.isQuizActive = false;
      this.successBadge.classList.add("hidden");
      this.updateQuizUI();
      this.writer.cancelQuiz();
      
      // Update speed slider setting
      this.writer.updateColor("strokeColor", "#D4AF37");
      this.writer.animateCharacter({
        onComplete: () => {
          this.showToast("Hoạt ảnh hoàn tất.");
        }
      });
    }
  }

  pause() {
    if (this.writer) {
      this.writer.pauseAnimation();
      this.showToast("Đã tạm dừng.");
    }
  }

  resetAnimation() {
    if (this.writer) {
      this.isQuizActive = false;
      this.successBadge.classList.add("hidden");
      this.updateQuizUI();
      this.writer.cancelQuiz();
      
      this.writer.showCharacter();
      setTimeout(() => this.writer.animateCharacter(), 200);
    }
  }

  updateSpeed(val) {
    this.animationSpeed = parseFloat(val);
    this.speedValLabel.textContent = `${this.animationSpeed.toFixed(1)}x`;
    if (this.writer) {
      this.writer.options.strokeAnimationSpeed = this.animationSpeed;
    }
  }

  // ── WRITING QUIZ MODE ──────────────────────────────────────────────
  startQuiz() {
    if (!this.writer) return;

    this.isQuizActive = true;
    this.successBadge.classList.add("hidden");
    this.updateQuizUI();

    // Start Interactive Hanzi Writer quiz
    this.writer.quiz({
      onMistake: (strokeData) => {
        const remaining = strokeData.totalStrokes - strokeData.strokeNum;
        this.quizStatusBox.className = "quiz-status-box error";
        this.quizStatusBox.innerHTML = `❌ Sai thứ tự! Lỗi thứ ${strokeData.mistakesOnStroke}. Còn lại ${remaining} nét.`;
      },
      onCorrectStroke: (strokeData) => {
        const progress = strokeData.strokeNum + 1;
        this.quizStatusBox.className = "quiz-status-box success";
        this.quizStatusBox.innerHTML = `✓ Đúng nét! Tiến trình: ${progress}/${strokeData.totalStrokes}`;
      },
      onComplete: (strokeData) => {
        this.isQuizActive = false;
        this.quizStatusBox.className = "quiz-status-box success";
        this.quizStatusBox.innerHTML = `🌟 Hoàn thành xuất sắc!`;
        this.successBadge.classList.remove("hidden");
        this.updateQuizUI();
        
        // Auto-navigate to next character if practicing a multi-character word
        if (this.activeCharIndex < this.charList.length - 1) {
          setTimeout(() => {
            this.showToast("Chuẩn bị chuyển sang chữ tiếp theo...");
            setTimeout(() => this.nextChar(), 1500);
          }, 1200);
        }
      }
    });
  }

  updateQuizUI() {
    if (this.isQuizActive) {
      this.btnQuiz.classList.add("recording");
      this.btnQuiz.innerHTML = `✍️ Đang luyện viết...`;
      this.quizStatusBox.className = "quiz-status-box success";
      this.quizStatusBox.innerHTML = `Hãy vẽ nét đầu tiên lên khung lưới.`;
    } else {
      this.btnQuiz.classList.remove("recording");
      this.btnQuiz.innerHTML = `✍️ Bắt đầu viết`;
    }
  }

  showQuizHint() {
    if (this.writer && this.isQuizActive) {
      this.writer.quiz.showHint();
    }
  }

  resetQuiz() {
    if (this.writer) {
      this.successBadge.classList.add("hidden");
      this.isQuizActive = false;
      this.updateQuizUI();
      this.writer.cancelQuiz();
      this.writer.showCharacter();
      this.quizStatusBox.className = "quiz-status-box";
      this.quizStatusBox.innerHTML = `Đã xóa nét vẽ. Nhấp "Bắt đầu viết" để thử lại.`;
    }
  }

  // ── HSK PRESETS RENDER ─────────────────────────────────────────────
  renderHskPresets(level) {
    this.presetWordsList.innerHTML = "";
    const list = HSK_PRESETS[level] || [];
    
    list.forEach((item) => {
      const chip = document.createElement("div");
      chip.className = "word-chip";
      chip.setAttribute("data-word", item.hz);
      
      chip.innerHTML = `
        <span class="word-hz" lang="zh">${item.hz}</span>
        <span class="word-py">${item.py}</span>
        <span class="word-vi">${item.vi}</span>
      `;
      
      chip.addEventListener("click", () => {
        this.loadPhrase(item.hz);
        window.scrollTo({ top: this.searchForm.offsetTop - 30, behavior: "smooth" });
      });

      this.presetWordsList.appendChild(chip);
    });
  }

  // ── EVENT BINDINGS ─────────────────────────────────────────────────
  attachEvents() {
    // Search form submission
    this.searchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = this.searchInput.value.trim();
      if (val) {
        this.loadPhrase(val);
      }
    });

    // Phrase character navigator buttons
    this.btnPrevChar.addEventListener("click", () => this.prevChar());
    this.btnNextChar.addEventListener("click", () => this.nextChar());

    // Animation control actions
    this.btnAnimate.addEventListener("click", () => this.animate());
    this.btnPause.addEventListener("click", () => this.pause());
    this.btnResetAnim.addEventListener("click", () => this.resetAnimation());

    // Speed range slider adjustments
    this.speedSlider.addEventListener("input", (e) => {
      this.updateSpeed(e.target.value);
    });

    // Quiz action triggers
    this.btnQuiz.addEventListener("click", () => this.startQuiz());
    this.btnQuizHint.addEventListener("click", () => this.showQuizHint());
    this.btnQuizReset.addEventListener("click", () => this.resetQuiz());

    // HSK Presets tab switching selectors
    document.querySelectorAll(".hsk-tab-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document.querySelectorAll(".hsk-tab-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        
        const lvl = parseInt(btn.dataset.level) || 1;
        this.renderHskPresets(lvl);
      });
    });
  }
}

// Instantiate App on load
document.addEventListener("DOMContentLoaded", () => {
  window.writeApp = new StrokePracticeApp();
});
