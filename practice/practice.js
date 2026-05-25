/* ============================================================
   practice.js — Lê Lê Pronunciation Practice
   Manage Tone Pairs, HSK Vocab, and Open-Ended speaking
   100% Client-side speech recognition and evaluation
   ============================================================ */

// ── PINYIN CHARACTER DICTIONARY (Common characters) ────────────────
const PINYIN_DICT = {
  // Numbers
  "一": "yī", "二": "èr", "三": "sān", "四": "sì", "五": "wǔ", "六": "liù", "七": "qī", "八": "bā", "九": "jiǔ", "十": "shí", "百": "bǎi", "千": "qiān",
  // Pronouns & Common particles
  "我": "wǒ", "你": "nǐ", "他": "tā", "她": "tā", "它": "tā", "们": "men", "这": "zhè", "那": "nà", "哪": "nǎ", "谁": "shéi", "什": "shén", "么": "me",
  "的": "de", "得": "de", "地": "de", "了": "le", "过": "guò", "着": "zhe", "吧": "ba", "吗": "ma", "呢": "ne", "呀": "ya", "不": "bù", "很": "hěn", "太": "tài",
  "都": "dōu", "和": "hé", "在": "zài", "有": "yǒu", "没": "méi", "去": "qù", "来": "lái", "里": "lǐ", "外": "wài", "上": "shàng", "下": "xià", "左": "zuǒ", "右": "yòu",
  // Verbs & Nouns from HSK
  "是": "shì", "做": "zuò", "写": "xiě", "说": "shuō", "听": "tīng", "读": "dú", "看": "kàn", "见": "jiàn", "吃": "chī", "喝": "hē", "爱": "ài", "想": "xiǎng",
  "喜欢": "xǐhuan", "喜": "xǐ", "欢": "huān", "苹": "píng", "果": "guǒ", "谢": "xiè", "医": "yī", "生": "shēng", "汉": "hàn", "语": "yǔ", "星": "xīng", "期": "qī",
  "衣": "yī", "服": "fu", "学": "xué", "习": "xí", "老": "lǎo", "师": "shī", "朋": "péng", "友": "you", "睡": "shuì", "觉": "jiào", "电": "diàn", "脑": "nǎo",
  "影": "yǐng", "飞": "fēi", "机": "jī", "名": "míng", "字": "zi", "昨": "zuó", "天": "tiān", "今": "jīn", "明": "míng", "跑": "pǎo", "步": "bù", "唱": "chàng",
  "歌": "gē", "旅": "lǚ", "游": "yóu", "运": "yùn", "动": "dòng", "准": "zhǔn", "备": "bèi", "帮": "bāng", "助": "zhù", "介": "jiè", "绍": "shào", "告": "gào",
  "诉": "su", "身": "shēn", "体": "tǐ", "便": "pián", "宜": "yi", "时": "shí", "间": "jiān", "词": "cí", "典": "diǎn", "经": "jīng", "常": "cháng", "愿": "yuàn",
  "意": "yì", "简": "jiǎn", "单": "dān", "响": "xiǎng", "办": "bàn", "法": "fǎ", "历": "lì", "史": "shǐ", "音": "yīn", "乐": "yuè", "干": "gān", "净": "jìng",
  "突": "tū", "然": "rán", "努": "nǔ", "力": "lì", "发": "fā", "现": "xiàn", "环": "huán", "境": "jìng", "关": "guān", "键": "jiàn", "骄": "jiāo", "傲": "ào",
  "调": "diào", "查": "chá", "拒": "jù", "绝": "jué", "甚": "shèn", "至": "zhì", "翻": "fān", "译": "yì", "招": "zhāo", "聘": "pìn", "复": "fù", "杂": "zá",
  "解": "jiě", "释": "shì", "鼓": "gǔ", "励": "lì", "讨": "tǎo", "论": "lùn", "家": "jiā", "人": "rén", "爸": "bà", "妈": "mā", "哥": "gē", "姐": "jiě",
  "弟": "dì", "妹": "mèi", "猫": "māo", "狗": "gǒu", "鱼": "yú", "米": "mǐ", "饭": "fàn", "面": "miàn", "茶": "chá", "水": "shuǐ", "杯": "bēi", "冷": "lěng",
  "热": "rè", "多": "duō", "少": "shǎo", "岁": "suì", "号": "hào", "点": "diǎn", "分": "fēn", "钱": "qián", "买": "mǎi", "开": "kāi", "坐": "zuò", "住": "zhù",
  "高": "gāo", "兴": "xìng", "请": "qǐng", "喂": "wèi", "客": "kè", "气": "qì", "再": "zài", "北": "běi", "京": "jīng", "东": "dōng", "西": "xī",
  "号": "hào", "路": "lù", "车": "chē", "站": "zhàn", "票": "piào", "报": "bào", "纸": "zhǐ", "送": "sòng", "等": "děng", "错": "cuò", "懂": "dǒng",
  "完": "wán", "新": "xīn", "旧": "jiù", "黑": "hēi", "红": "hóng", "白": "bái", "lǜ": "lǜ", "蓝": "lán", "黄": "huáng", "百": "bǎi", "千": "qiān",
  "晴": "qíng", "阴": "yīn", "雪": "xuě", "药": "yào", "病": "bìng", "笑": "xiào", "哭": "kū", "穿": "chuān", "洗": "xǐ", "给": "gěi", "找": "zhǎo",
  // New tone pair vocabulary character mapping
  "场": "chǎng", "饱": "bǎo", "板": "bǎn", "回": "huí", "答": "dá", "食": "shí", "堂": "táng",
  "银": "yín", "行": "háng", "其": "qí", "实": "shí", "决": "jué", "定": "dìng", "惯": "guàn",
  "戏": "xì", "同": "tóng", "火": "huǒ", "普": "pǔ", "通": "tōng", "每": "měi", "起": "qǐ",
  "床": "chuáng", "可": "kě", "能": "néng", "小": "xiǎo", "好": "hǎo", "以": "yǐ", "脸": "liǎn",
  "包": "bāo", "认": "rèn", "真": "zhēn", "半": "bàn", "汽": "qì", "问": "wèn", "题": "tí",
  "特": "tè", "别": "bié", "练": "liàn", "年": "nián"
};

// ── LOCAL HSK WORD BANK ──────────────────────────────────────────
const HSK_VOCAB = {
  // HSK 1
  1: [
    { hanzi: "医生", pinyin: "yīshēng", tone_pair: "11", meaning: "Bác sĩ" },
    { hanzi: "星期", pinyin: "xīngqī", tone_pair: "11", meaning: "Tuần" },
    { hanzi: "飞机", pinyin: "fēijī", tone_pair: "11", meaning: "Máy bay" },
    { hanzi: "今天", pinyin: "jīntiān", tone_pair: "11", meaning: "Hôm nay" },
    { hanzi: "苹果", pinyin: "píngguǒ", tone_pair: "23", meaning: "Quả táo" },
    { hanzi: "朋友", pinyin: "péngyou", tone_pair: "23", meaning: "Bạn bè" },
    { hanzi: "昨天", pinyin: "zuótiān", tone_pair: "21", meaning: "Hôm qua" },
    { hanzi: "明天", pinyin: "míngtiān", tone_pair: "21", meaning: "Ngày mai" },
    { hanzi: "名字", pinyin: "míngzi", tone_pair: "24", meaning: "Tên" },
    { hanzi: "学习", pinyin: "xuéxí", tone_pair: "22", meaning: "Học tập" },
    { hanzi: "老师", pinyin: "lǎoshī", tone_pair: "31", meaning: "Giáo viên" },
    { hanzi: "汉语", pinyin: "Hànyǔ", tone_pair: "43", meaning: "Tiếng Trung" },
    { hanzi: "电脑", pinyin: "diànnǎo", tone_pair: "43", meaning: "Máy tính" },
    { hanzi: "电影", pinyin: "diànyǐng", tone_pair: "43", meaning: "Phim" },
    { hanzi: "谢谢", pinyin: "xièxie", tone_pair: "44", meaning: "Cảm ơn" },
    { hanzi: "睡觉", pinyin: "shuìjiào", tone_pair: "44", meaning: "Đi ngủ" },
    { hanzi: "吃饱", pinyin: "chībǎo", tone_pair: "13", meaning: "Ăn no" },
    { hanzi: "北京", pinyin: "Běijīng", tone_pair: "31", meaning: "Bắc Kinh" },
    { hanzi: "每天", pinyin: "měitiān", tone_pair: "31", meaning: "Mỗi ngày" },
    { hanzi: "水果", pinyin: "shuǐguǒ", tone_pair: "33", meaning: "Hoa quả" },
    { hanzi: "很好", pinyin: "hěnhǎo", tone_pair: "33", meaning: "Rất tốt" }
  ],
  // HSK 2
  2: [
    { hanzi: "唱歌", pinyin: "chànggē", tone_pair: "41", meaning: "Hát" },
    { hanzi: "跑步", pinyin: "pǎobù", tone_pair: "34", meaning: "Chạy bộ" },
    { hanzi: "旅游", pinyin: "lǚyóu", tone_pair: "32", meaning: "Đi du lịch" },
    { hanzi: "运动", pinyin: "yùndòng", tone_pair: "44", meaning: "Thể thao" },
    { hanzi: "准备", pinyin: "zhǔnbèi", tone_pair: "34", meaning: "Chuẩn bị" },
    { hanzi: "帮助", pinyin: "bāngzhù", tone_pair: "14", meaning: "Giúp đỡ" },
    { hanzi: "介绍", pinyin: "jièshào", tone_pair: "44", meaning: "Giới thiệu" },
    { hanzi: "欢迎", pinyin: "huānyíng", tone_pair: "12", meaning: "Hoan nghênh" },
    { hanzi: "告诉", pinyin: "gàosu", tone_pair: "44", meaning: "Cho biết" },
    { hanzi: "身体", pinyin: "shēntǐ", tone_pair: "13", meaning: "Sức khoẻ" },
    { hanzi: "便宜", pinyin: "piányi", tone_pair: "22", meaning: "Rẻ" },
    { hanzi: "时间", pinyin: "shíjiān", tone_pair: "21", meaning: "Thời gian" },
    { hanzi: "词典", pinyin: "cídiǎn", tone_pair: "23", meaning: "Từ điển" },
    { hanzi: "机场", pinyin: "jīchǎng", tone_pair: "13", meaning: "Sân bay" },
    { hanzi: "听懂", pinyin: "tīngdǒng", tone_pair: "13", meaning: "Nghe hiểu" },
    { hanzi: "回答", pinyin: "huídá", tone_pair: "22", meaning: "Trả lời" },
    { hanzi: "食堂", pinyin: "shítáng", tone_pair: "22", meaning: "Nhà ăn" },
    { hanzi: "银行", pinyin: "yínháng", tone_pair: "22", meaning: "Ngân hàng" },
    { hanzi: "火车", pinyin: "huǒchē", tone_pair: "31", meaning: "Tàu hoả" },
    { hanzi: "起床", pinyin: "qǐchuáng", tone_pair: "32", meaning: "Ngủ dậy" },
    { hanzi: "可能", pinyin: "kěnéng", tone_pair: "32", meaning: "Có thể" },
    { hanzi: "小时", pinyin: "xiǎoshí", tone_pair: "32", meaning: "Tiếng đồng hồ" },
    { hanzi: "可以", pinyin: "kěyǐ", tone_pair: "33", meaning: "Có thể" },
    { hanzi: "面包", pinyin: "miànbāo", tone_pair: "41", meaning: "Bánh mì" },
    { hanzi: "汽车", pinyin: "qìchē", tone_pair: "41", meaning: "Xe ô tô" },
    { hanzi: "问题", pinyin: "wèntí", tone_pair: "42", meaning: "Vấn đề" },
    { hanzi: "练习", pinyin: "liànxí", tone_pair: "42", meaning: "Luyện tập" },
    { hanzi: "去年", pinyin: "qùnián", tone_pair: "42", meaning: "Năm ngoái" }
  ],
  // HSK 3
  3: [
    { hanzi: "经常", pinyin: "jīngcháng", tone_pair: "12", meaning: "Thường xuyên" },
    { hanzi: "愿意", pinyin: "yuànyì", tone_pair: "44", meaning: "Bằng lòng" },
    { hanzi: "简单", pinyin: "jiǎndān", tone_pair: "31", meaning: "Đơn giản" },
    { hanzi: "影响", pinyin: "yǐngxiǎng", tone_pair: "23", meaning: "Ảnh hưởng" },
    { hanzi: "办法", pinyin: "bànfǎ", tone_pair: "43", meaning: "Biện pháp" },
    { hanzi: "历史", pinyin: "lìshǐ", tone_pair: "43", meaning: "Lịch sử" },
    { hanzi: "音乐", pinyin: "yīnyuè", tone_pair: "14", meaning: "Âm nhạc" },
    { hanzi: "干净", pinyin: "gānjìng", tone_pair: "14", meaning: "Sạch sẽ" },
    { hanzi: "突然", pinyin: "tūrán", tone_pair: "12", meaning: "Đột nhiên" },
    { hanzi: "努力", pinyin: "nǔlì", tone_pair: "34", meaning: "Cố gắng" },
    { hanzi: "发现", pinyin: "fāxiàn", tone_pair: "14", meaning: "Phát hiện" },
    { hanzi: "环境", pinyin: "huánjìng", tone_pair: "24", meaning: "Môi trường" },
    { hanzi: "黑板", pinyin: "hēibǎn", tone_pair: "13", meaning: "Bảng đen" },
    { hanzi: "其实", pinyin: "qíshí", tone_pair: "22", meaning: "Thực ra" },
    { hanzi: "决定", pinyin: "juédìng", tone_pair: "24", meaning: "Quyết định" },
    { hanzi: "游戏", pinyin: "yóuxì", tone_pair: "24", meaning: "Trò chơi" },
    { hanzi: "同意", pinyin: "tóngyì", tone_pair: "24", meaning: "Đồng ý" },
    { hanzi: "了解", pinyin: "liǎojiě", tone_pair: "33", meaning: "Hiểu rõ" },
    { hanzi: "语法", pinyin: "yǔfǎ", tone_pair: "33", meaning: "Ngữ pháp" },
    { hanzi: "有点", pinyin: "yǒudiǎn", tone_pair: "33", meaning: "Có chút / Hơi" },
    { hanzi: "认真", pinyin: "rènzhēn", tone_pair: "41", meaning: "Nghiêm túc" },
    { hanzi: "半天", pinyin: "bàntiān", tone_pair: "41", meaning: "Nửa ngày" },
    { hanzi: "特别", pinyin: "tèbié", tone_pair: "42", meaning: "Đặc biệt" }
  ],
  // HSK 4
  4: [
    { hanzi: "关键", pinyin: "guānjiàn", tone_pair: "14", meaning: "Mấu chốt" },
    { hanzi: "骄傲", pinyin: "jiāo'ào", tone_pair: "14", meaning: "Kiêu ngạo" },
    { hanzi: "调查", pinyin: "diàochá", tone_pair: "42", meaning: "Điều tra" },
    { hanzi: "拒绝", pinyin: "jùjué", tone_pair: "42", meaning: "Từ chối" },
    { hanzi: "甚至", pinyin: "shènzhì", tone_pair: "44", meaning: "Thậm chí" },
    { hanzi: "翻译", pinyin: "fānyì", tone_pair: "14", meaning: "Phiên dịch" },
    { hanzi: "招聘", pinyin: "zhāopìn", tone_pair: "14", meaning: "Tuyển dụng" },
    { hanzi: "复杂", pinyin: "fùzá", tone_pair: "42", meaning: "Phức tạp" },
    { hanzi: "解释", pinyin: "jiěshì", tone_pair: "34", meaning: "Giải thích" },
    { hanzi: "鼓励", "pinyin": "gǔlì", tone_pair: "34", meaning: "Cổ vũ" },
    { hanzi: "讨论", pinyin: "tǎolùn", tone_pair: "34", meaning: "Thảo luận" },
    { hanzi: "习惯", pinyin: "xíguàn", tone_pair: "24", meaning: "Thói quen" }
  ]
};

// Map all HSK words for Tone Pair grid
const ALL_WORDS = [
  ...HSK_VOCAB[1],
  ...HSK_VOCAB[2],
  ...HSK_VOCAB[3],
  ...HSK_VOCAB[4]
];

// Helper to find a word by Tone Pair
function getWordForTonePair(pair, excludeWord = null) {
  let matches = ALL_WORDS.filter(w => w.tone_pair === pair);
  if (excludeWord) {
    matches = matches.filter(w => w.hanzi !== excludeWord);
  }
  if (matches.length === 0) {
    // Fallback if none found
    return ALL_WORDS.find(w => w.tone_pair === pair) || { hanzi: "学习", pinyin: "xuéxí", tone_pair: pair, meaning: "Học tập" };
  }
  return matches[Math.floor(Math.random() * matches.length)];
}

// Helper to convert arbitrary Hanzi into Pinyin from local database
function getPinyinForText(text) {
  if (!text) return "";
  let cleanText = text.replace(/[^\u4e00-\u9fa5]/g, ""); // Filter only Chinese chars
  return cleanText.split("").map(char => {
    return PINYIN_DICT[char] || char;
  }).join(" ");
}

// Pinyin vowel accents mapper for tone extraction
const PINYIN_TONE_RULES = {
  'ā': 1, 'á': 2, 'ǎ': 3, 'à': 4,
  'ē': 1, 'é': 2, 'ě': 3, 'è': 4,
  'ī': 1, 'í': 2, 'ǐ': 3, 'ì': 4,
  'ō': 1, 'ó': 2, 'ǒ': 3, 'ò': 4,
  'ū': 1, 'ú': 2, 'ǔ': 3, 'ù': 4,
  'ǖ': 1, 'ǘ': 2, 'ǚ': 3, 'ǜ': 4,
  'ü': 5, // Neutral tone characters (if accent is missing)
};

// Helper to extract tones from a pinyin word (returns string like "14")
function getTonePairFromPinyin(pinyinStr) {
  let syllables = pinyinStr.toLowerCase().split(/\s+/).filter(Boolean);
  let tones = "";
  syllables.forEach(s => {
    let tone = 5; // Default neutral tone
    for (let char of s) {
      if (PINYIN_TONE_RULES[char] !== undefined) {
        tone = PINYIN_TONE_RULES[char];
        break;
      }
    }
    tones += tone;
  });
  return tones;
}

// ── DOM CLASS INITIALIZATION ──────────────────────────────────────────
class MandarinPractice {
  constructor() {
    this.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    this.recognition = null;
    this.activeMode = null; // "tp", "hsk", "open"
    this.isRecording = false;

    // Data Store
    this.activeTonePair = "32"; // Default pair ǎ á
    this.activeTpWord = null;
    this.activeHskWord = null;
    this.hskLevel = 1;
    this.openSyllableCount = "2";

    // Bind DOM
    this.initDOM();
    this.initSpeechEngine();
    this.loadAccuracyStats();
    
    // Initial renders
    this.selectTonePairCell(this.activeTonePair);
    this.nextHskWord();
    this.clearOpenEnded();

    // Attach Listeners
    this.attachEvents();

    // Listen for language change to update display values
    window.addEventListener('langChanged', () => {
      if (this.activeTpWord) {
        this.tpWordMeaning.textContent = this.translateMeaning(this.activeTpWord.hanzi, this.activeTpWord.meaning);
      }
      if (this.activeHskWord) {
        this.hskWordMeaning.textContent = this.translateMeaning(this.activeHskWord.hanzi, this.activeHskWord.meaning);
        if (this.hskWordPinyin.classList.contains("blurred")) {
          this.hskWordPinyin.textContent = window.i18n ? window.i18n.t('practice_hsk_pinyin_hint') : "Nhấp để hiện pinyin";
        }
      }
      this.selectTonePairCell(this.activeTonePair);
      this.clearOpenEnded();
    });
  }

  // Translate HSK and Tone Pair meanings based on language setting
  translateMeaning(word, defaultVi) {
    if (!window.i18n) return defaultVi;
    const lang = window.i18n.currentLang;
    if (lang === 'vi') return defaultVi;
    
    const translations = {
      en: {
        "医生": "Doctor", "星期": "Week", "飞机": "Airplane", "今天": "Today", "苹果": "Apple",
        "朋友": "Friend", "昨天": "Yesterday", "明天": "Tomorrow", "名字": "Name", "学习": "Study",
        "老师": "Teacher", "汉语": "Chinese", "电脑": "Computer", "电影": "Movie", "谢谢": "Thank you",
        "睡觉": "Sleep", "吃饱": "Eat full", "北京": "Beijing", "每天": "Every day", "水果": "Fruit",
        "很好": "Very good", "唱歌": "Sing", "跑步": "Run", "旅游": "Travel", "运动": "Sports",
        "准备": "Prepare", "帮助": "Help", "介": "Introduce", "介绍": "Introduce", "欢迎": "Welcome",
        "告诉": "Tell", "身体": "Health/Body", "便宜": "Cheap", "时间": "Time", "词典": "Dictionary",
        "机场": "Airport", "听懂": "Understand", "回答": "Answer", "食堂": "Cafeteria", "银行": "Bank",
        "火车": "Train", "起床": "Get up", "可能": "Possible", "小时": "Hour", "可以": "Can/May",
        "面包": "Bread", "汽车": "Car", "问题": "Problem/Question", "练习": "Practice", "去年": "Last year",
        "经常": "Often", "愿意": "Willing", "简单": "Simple", "影响": "Influence", "办法": "Method",
        "历史": "History", "音乐": "Music", "干净": "Clean", "突然": "Suddenly", "努力": "Hardworking",
        "发现": "Discover", "环境": "Environment", "黑板": "Blackboard", "其实": "Actually", "决定": "Decide",
        "游戏": "Game", "同意": "Agree", "了解": "Understand", "语法": "Grammar", "有点": "Slightly",
        "认真": "Earnest", "半天": "Half a day", "特别": "Special", "关键": "Key point", "骄傲": "Proud",
        "调查": "Survey", "拒绝": "Refuse", "甚至": "Even/So far", "变化": "Change", "翻译": "Translate",
        "复杂": "Complex", "习惯": "Habit", "解释": "Explain", "招聘": "Recruit", "你": "You",
        "好": "Good", "我": "I/Me", "加载": "Loading", "起": "Get up", "床": "Bed", "饱": "Full", "食堂": "Cafeteria",
        "银行": "Bank", "可能": "Possible", "面包": "Bread", "汽车": "Car", "问题": "Question", "去年": "Last year",
        "讨论": "Discuss", "鼓励": "Encourage"
      },
      zh: {
        "医生": "医生", "星期": "星期", "飞机": "飞机", "今天": "今天", "苹果": "苹果",
        "朋友": "朋友", "昨天": "昨天", "明天": "明天", "名字": "名字", "学习": "学习",
        "老师": "老师", "汉语": "汉语", "电脑": "电脑", "电影": "电影", "谢谢": "谢谢",
        "睡觉": "睡觉", "吃饱": "吃饱", "北京": "北京", "每天": "每天", "水果": "水果",
        "很好": "很好", "唱歌": "唱歌", "跑步": "跑步", "旅游": "旅游", "运动": "运动",
        "准备": "准备", "帮助": "帮助", "介": "介绍", "介绍": "介绍", "欢迎": "欢迎",
        "告诉": "告诉", "身体": "身体", "便宜": "便宜", "时间": "时间", "词典": "词典",
        "机场": "机场", "听懂": "听懂", "回答": "回答", "食堂": "食堂", "银行": "银行",
        "火车": "火车", "起床": "起床", "可能": "可能", "小时": "小时", "可以": "可以",
        "面包": "面包", "汽车": "汽车", "问题": "问题", "练习": "练习", "去年": "去年",
        "经常": "经常", "愿意": "愿意", "简单": "简单", "影响": "影响", "办法": "办法",
        "历史": "历史", "音乐": "音乐", "干净": "干净", "突然": "突然", "努力": "努力",
        "发现": "发现", "环境": "环境", "黑板": "黑板", "其实": "其实", "决定": "决定",
        "游戏": "游戏", "同意": "同意", "了解": "了解", "语法": "语法", "有点": "有点",
        "认真": "认真", "半天": "半天", "特别": "特别", "关键": "关键", "骄傲": "骄傲",
        "调查": "调查", "拒绝": "拒绝", "甚至": "甚至", "变化": "变化", "翻译": "翻译",
        "复杂": "复杂", "习惯": "习惯", "解释": "解释", "招聘": "招聘", "你": "你",
        "好": "好", "我": "我", "加载": "加载", "起": "起", "床": "床", "饱": "饱", "食堂": "食堂",
        "银行": "银行", "可能": "可能", "面包": "面包", "汽车": "汽车", "问题": "问题", "去年": "去年",
        "讨论": "讨论", "鼓励": "鼓励"
      }
    };
    return (translations[lang] && translations[lang][word]) ? translations[lang][word] : defaultVi;
  }

  initDOM() {
    // Tone Pairs DOM
    this.tpSelectedLabel = document.getElementById("lbl-selected-pair");
    this.tpAccuracyLabel = document.getElementById("lbl-pair-accuracy");
    this.tpWordHanzi     = document.getElementById("tp-word-hanzi");
    this.tpWordPinyin    = document.getElementById("tp-word-pinyin");
    this.tpWordMeaning   = document.getElementById("tp-word-meaning");
    this.btnPlayTp       = document.getElementById("btn-play-tp");
    this.btnRecordTp     = document.getElementById("btn-record-tp");
    this.btnNextTp       = document.getElementById("btn-next-tp");
    this.tpRecordStatus  = document.getElementById("tp-record-status");
    this.tpResultBox     = document.getElementById("tp-result-box");
    this.tpUserSpeech    = document.getElementById("tp-user-speech");
    this.tpScoreBadge    = document.getElementById("tp-score-badge");

    // HSK DOM
    this.hskLevelSelect  = document.getElementById("hsk-level-select");
    this.hskWordHanzi    = document.getElementById("hsk-word-hanzi");
    this.hskWordPinyin   = document.getElementById("hsk-word-pinyin");
    this.hskWordMeaning  = document.getElementById("hsk-word-meaning");
    this.btnPlayHsk      = document.getElementById("btn-play-hsk");
    this.btnRecordHsk    = document.getElementById("btn-record-hsk");
    this.btnNextHsk      = document.getElementById("btn-next-hsk");
    this.hskRecordStatus = document.getElementById("hsk-record-status");
    this.hskResultBox    = document.getElementById("hsk-result-box");
    this.hskUserSpeech   = document.getElementById("hsk-user-speech");
    this.hskScoreBadge   = document.getElementById("hsk-score-badge");

    // Open Ended DOM
    this.syllableCountSelect = document.getElementById("syllable-count-select");
    this.openOutputPinyin    = document.getElementById("open-output-pinyin");
    this.openOutputHanzi     = document.getElementById("open-output-hanzi");
    this.btnRecordOpen       = document.getElementById("btn-record-open");
    this.openRecordStatus    = document.getElementById("open-record-status");

    // Generic Toast
    this.toast    = document.getElementById("practice-toast");
    this.toastMsg = document.getElementById("toast-msg");
  }

  showToast(msg) {
    if (!this.toast || !this.toastMsg) return;
    this.toastMsg.textContent = msg;
    this.toast.classList.add("show");
    setTimeout(() => this.toast.classList.remove("show"), 2800);
  }

  initSpeechEngine() {
    if (!this.SpeechRecognition) {
      console.warn("Trình duyệt không hỗ trợ Web Speech Recognition API.");
      let warnMsg = "Microphone không hỗ trợ trên trình duyệt này. Vui lòng sử dụng Google Chrome hoặc Safari.";
      if (window.i18n && window.i18n.currentLang === 'en') {
        warnMsg = "Microphone not supported in this browser. Please use Google Chrome or Safari.";
      } else if (window.i18n && window.i18n.currentLang === 'zh') {
        warnMsg = "此浏览器不支持麦克风。请使用 Google Chrome 或 Safari 浏览器。";
      }
      this.tpRecordStatus.innerText = warnMsg;
      this.hskRecordStatus.innerText = warnMsg;
      this.openRecordStatus.innerText = warnMsg;
      return;
    }

    this.recognition = new this.SpeechRecognition();
    this.recognition.lang = 'zh-CN'; // Listen in Mandarin
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    // Speech Handlers
    this.recognition.onstart = () => {
      this.isRecording = true;
      this.updateMicUI();
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      this.updateMicUI();
    };

    this.recognition.onerror = (e) => {
      console.error("Speech Recognition Error:", e);
      this.isRecording = false;
      this.updateMicUI();
      
      let errorText = "Lỗi micro. Hãy thử lại.";
      if (window.i18n && window.i18n.currentLang === 'en') {
        errorText = "Microphone error. Please try again.";
        if (e.error === 'not-allowed') errorText = "Microphone permission denied. Please grant access.";
        else if (e.error === 'no-speech') errorText = "No speech detected. Please try again.";
      } else if (window.i18n && window.i18n.currentLang === 'zh') {
        errorText = "麦克风错误。请重试。";
        if (e.error === 'not-allowed') errorText = "麦克风权限被拒绝。请开启麦克风权限。";
        else if (e.error === 'no-speech') errorText = "未检测到说话声。请重试。";
      } else {
        if (e.error === 'not-allowed') errorText = "Quyền truy cập micro bị từ chối. Vui lòng cấp quyền.";
        else if (e.error === 'no-speech') errorText = "Không nghe thấy tiếng nói. Hãy thử lại.";
      }
      
      this.setStatusText(errorText);
    };

    this.recognition.onresult = (event) => {
      const resultText = event.results[0][0].transcript;
      this.evaluateSpeechResult(resultText);
    };
  }

  updateMicUI() {
    // Reset recording status strings
    if (this.isRecording) {
      let listeningMsg = "🎙️ Đang nghe... Hãy nói rõ ràng.";
      let stopLabel = `🛑 Dừng & Chấm điểm`;
      let stopRecLabel = `🛑 Dừng ghi`;
      if (window.i18n && window.i18n.currentLang === 'en') {
        listeningMsg = "🎙️ Listening... Speak clearly.";
        stopLabel = `🛑 Stop & Score`;
        stopRecLabel = `🛑 Stop`;
      } else if (window.i18n && window.i18n.currentLang === 'zh') {
        listeningMsg = "🎙️ 正在录音... 请清晰朗读。";
        stopLabel = `🛑 停止并打分`;
        stopRecLabel = `🛑 停止`;
      }
      this.setStatusText(listeningMsg);
      
      if (this.activeMode === "tp") {
        this.btnRecordTp.classList.add("recording");
        this.btnRecordTp.innerHTML = `<span class="mic-icon">🛑</span> ${stopLabel}`;
      } else if (this.activeMode === "hsk") {
        this.btnRecordHsk.classList.add("recording");
        this.btnRecordHsk.innerHTML = `<span class="mic-icon">🛑</span> ${stopLabel}`;
      } else if (this.activeMode === "open") {
        this.btnRecordOpen.classList.add("recording");
        this.btnRecordOpen.innerHTML = `<span class="mic-icon">🛑</span> ${stopRecLabel}`;
      }
    } else {
      let readyMsg = "Sẵn sàng ghi âm";
      if (window.i18n && window.i18n.currentLang === 'en') readyMsg = "Ready to record";
      else if (window.i18n && window.i18n.currentLang === 'zh') readyMsg = "已就绪";
      this.setStatusText(readyMsg);
      
      const speakLabel = window.i18n ? window.i18n.t('practice_btn_speak') : `Nhấn và nói`;
      this.btnRecordTp.classList.remove("recording");
      this.btnRecordTp.innerHTML = `<span class="mic-icon">🎙️</span> ${speakLabel}`;
      
      this.btnRecordHsk.classList.remove("recording");
      this.btnRecordHsk.innerHTML = `<span class="mic-icon">🎙️</span> ${speakLabel}`;
      
      this.btnRecordOpen.classList.remove("recording");
      this.btnRecordOpen.innerHTML = `<span class="mic-icon">🎙️</span> ${speakLabel}`;
    }
  }

  setStatusText(text) {
    if (this.activeMode === "tp") this.tpRecordStatus.innerText = text;
    if (this.activeMode === "hsk") this.hskRecordStatus.innerText = text;
    if (this.activeMode === "open") this.openRecordStatus.innerText = text;
  }

  toggleRecording(mode) {
    if (!this.recognition) {
      this.showToast("Trình duyệt của bạn không hỗ trợ Microphone AI.");
      return;
    }

    if (this.isRecording) {
      this.recognition.stop();
    } else {
      this.activeMode = mode;
      this.recognition.start();
    }
  }

  // ── SOUND SPEAKER PLAYBACK ──────────────────────────────────────────
  playModelVoice(text) {
    if (!('speechSynthesis' in window)) {
      this.showToast("Trình duyệt không hỗ trợ loa phát âm.");
      return;
    }

    // Cancel active voices
    window.speechSynthesis.cancel();

    let utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'zh-CN';
    
    // Choose Chinese voice
    let voices = window.speechSynthesis.getVoices();
    let preferredVoice = voices.find(v => v.lang.includes('zh-CN') && v.name.includes('Google'));
    if (!preferredVoice) {
      preferredVoice = voices.find(v => v.lang.includes('zh') || v.lang.includes('CN'));
    }
    if (preferredVoice) utterance.voice = preferredVoice;

    // Detect speed
    utterance.rate = 0.85; // slightly slower for learners
    window.speechSynthesis.speak(utterance);
  }

  // ── ACCURACY STATS PERSISTENCE ──────────────────────────────────────
  loadAccuracyStats() {
    this.stats = JSON.parse(localStorage.getItem("lele_tone_stats")) || {};
    // Render stats to grid
    Object.keys(this.stats).forEach(pair => {
      this.updateCellBg(pair);
    });
  }

  saveStats() {
    localStorage.setItem("lele_tone_stats", JSON.stringify(this.stats));
  }

  updateCellBg(pair) {
    const cell = document.getElementById(`cell-${pair}`);
    if (!cell) return;
    const stat = this.stats[pair];
    if (!stat) return;

    const total = stat.correct + stat.wrong;
    if (total === 0) return;

    const ratio = stat.correct / total;
    // Gradient Red (0%) to Green (100%)
    // Red: HSL 0, Green: HSL 150
    const hue = Math.round(ratio * 150);
    cell.style.backgroundColor = `hsla(${hue}, 60%, 40%, 0.35)`;
    cell.style.color = '#fff';
    cell.style.border = `1px solid hsla(${hue}, 60%, 50%, 0.5)`;
  }

  // ── CELL GRID SELECTION ───────────────────────────────────────────
  selectTonePairCell(pair) {
    if (this.activeTonePair) {
      const prev = document.getElementById(`cell-${this.activeTonePair}`);
      if (prev) prev.classList.remove("active-cell");
    }

    const curr = document.getElementById(`cell-${pair}`);
    if (curr) {
      curr.classList.add("active-cell");
      this.activeTonePair = pair;
      this.tpSelectedLabel.innerText = `${pair[0]}-${pair[1]} (${curr.innerText})`;
      
      // Load current accuracy ratio label
      const stat = this.stats[pair];
      if (stat) {
        const total = stat.correct + stat.wrong;
        this.tpAccuracyLabel.innerText = `${Math.round(100 * stat.correct / total)}% (${stat.correct}/${total})`;
      } else {
        this.tpAccuracyLabel.innerText = window.i18n ? window.i18n.t('practice_accuracy_none') : "Chưa thực hành";
      }

      this.nextTpWord(true); // load new word matching the pair
    }
  }

  // ── TARGET LOADS ──────────────────────────────────────────────────
  nextTpWord(keepSamePair = false) {
    if (this.tpResultBox) this.tpResultBox.classList.add("hidden");
    
    // Find matching word
    const exclude = keepSamePair ? null : this.activeTpWord?.hanzi;
    
    // Check how many words match this pair in ALL_WORDS
    const allMatches = ALL_WORDS.filter(w => w.tone_pair === this.activeTonePair);
    if (!keepSamePair && allMatches.length <= 1 && allMatches.length > 0) {
      let alertMsg = "Chỉ có 1 từ mẫu cho cặp thanh điệu này!";
      if (window.i18n && window.i18n.currentLang === 'en') alertMsg = "Only 1 sample word for this tone pair!";
      else if (window.i18n && window.i18n.currentLang === 'zh') alertMsg = "该声调组合仅有1个示例词！";
      this.showToast(alertMsg);
    }
    
    this.activeTpWord = getWordForTonePair(this.activeTonePair, exclude);
    
    this.tpWordHanzi.textContent = this.activeTpWord.hanzi;
    this.tpWordPinyin.textContent = this.activeTpWord.pinyin;
    this.tpWordMeaning.textContent = this.translateMeaning(this.activeTpWord.hanzi, this.activeTpWord.meaning);
  }

  nextHskWord() {
    if (this.hskResultBox) this.hskResultBox.classList.add("hidden");

    const words = HSK_VOCAB[this.hskLevel];
    let word = words[Math.floor(Math.random() * words.length)];
    if (this.activeHskWord && words.length > 1) {
      while (word.hanzi === this.activeHskWord.hanzi) {
        word = words[Math.floor(Math.random() * words.length)];
      }
    }

    this.activeHskWord = word;
    this.hskWordHanzi.textContent = word.hanzi;
    this.hskWordMeaning.textContent = this.translateMeaning(word.hanzi, word.meaning);
    
    // Hide pinyin initially
    this.hskWordPinyin.textContent = window.i18n ? window.i18n.t('practice_hsk_pinyin_hint') : "Nhấp để hiện pinyin";
    this.hskWordPinyin.classList.add("blurred");
  }

  showHskPinyin() {
    if (this.hskWordPinyin.classList.contains("blurred")) {
      this.hskWordPinyin.textContent = this.activeHskWord.pinyin;
      this.hskWordPinyin.classList.remove("blurred");
    }
  }

  clearOpenEnded() {
    this.openOutputPinyin.textContent = "--";
    let idleMsg = "Nhấp micro & nói...";
    if (window.i18n && window.i18n.currentLang === 'en') idleMsg = "Click mic & speak...";
    else if (window.i18n && window.i18n.currentLang === 'zh') idleMsg = "点击麦克风开始说话...";
    this.openOutputHanzi.textContent = idleMsg;
  }

  // ── PRONUNCIATION EVALUATION ──────────────────────────────────────
  evaluateSpeechResult(spokenText) {
    if (!spokenText) return;

    if (this.activeMode === "tp") {
      this.tpResultBox.classList.remove("hidden");
      this.tpUserSpeech.textContent = spokenText;
      
      // Match text characters
      const isWordMatch = (spokenText === this.activeTpWord.hanzi);
      
      // Map spoken text to pinyin and extract tones
      const spokenPinyin = getPinyinForText(spokenText);
      const spokenTones = getTonePairFromPinyin(spokenPinyin);
      
      const targetTones = this.activeTonePair;
      let incorrectCount = 0;
      
      // Check tone count matching
      for (let i = 0; i < Math.min(targetTones.length, spokenTones.length); i++) {
        if (targetTones[i] !== spokenTones[i]) {
          incorrectCount++;
        }
      }
      
      // Add text length check differences as penalty
      incorrectCount += Math.abs(targetTones.length - spokenTones.length);

      // Display tone representation
      const toneFormatted = spokenTones.split("").join("-");
      this.tpUserSpeech.innerHTML = `${spokenText} <span class="badge-gold">(${toneFormatted})</span>`;

      // Scoring & Stats Update
      if (incorrectCount === 0) {
        this.tpScoreBadge.className = "score-badge correct";
        let badgeText = "Phát âm chuẩn! 🌟";
        if (window.i18n && window.i18n.currentLang === 'en') badgeText = "Perfect! 🌟";
        else if (window.i18n && window.i18n.currentLang === 'zh') badgeText = "发音标准！🌟";
        this.tpScoreBadge.textContent = badgeText;
        this.logTonePairResult(this.activeTonePair, true);
      } else if (incorrectCount === 1) {
        this.tpScoreBadge.className = "score-badge almost";
        let badgeText = "Gần đúng! ⚡";
        if (window.i18n && window.i18n.currentLang === 'en') badgeText = "Close enough! ⚡";
        else if (window.i18n && window.i18n.currentLang === 'zh') badgeText = "接近正确！⚡";
        this.tpScoreBadge.textContent = badgeText;
        this.logTonePairResult(this.activeTonePair, false);
      } else {
        this.tpScoreBadge.className = "score-badge wrong";
        let badgeText = "Chưa chính xác ❌";
        if (window.i18n && window.i18n.currentLang === 'en') badgeText = "Incorrect ❌";
        else if (window.i18n && window.i18n.currentLang === 'zh') badgeText = "不准确 ❌";
        this.tpScoreBadge.textContent = badgeText;
        this.logTonePairResult(this.activeTonePair, false);
      }

      let statusMsg = "Nhấn Từ Khác để tiếp tục.";
      if (window.i18n && window.i18n.currentLang === 'en') statusMsg = "Click Next Word to continue.";
      else if (window.i18n && window.i18n.currentLang === 'zh') statusMsg = "点击换个词语继续。";
      this.setStatusText(statusMsg);

    } else if (this.activeMode === "hsk") {
      this.hskResultBox.classList.remove("hidden");
      this.hskUserSpeech.textContent = spokenText;
      
      // Auto unblur target pinyin
      this.showHskPinyin();

      const isMatch = (spokenText.trim() === this.activeHskWord.hanzi.trim());
      const spokenPinyin = getPinyinForText(spokenText);

      this.hskUserSpeech.innerHTML = `${spokenText} <span class="badge-gold">(${spokenPinyin})</span>`;

      if (isMatch) {
        this.hskScoreBadge.className = "score-badge correct";
        let badgeText = "Chuẩn xác! 🌟";
        if (window.i18n && window.i18n.currentLang === 'en') badgeText = "Correct! 🌟";
        else if (window.i18n && window.i18n.currentLang === 'zh') badgeText = "准确！🌟";
        this.hskScoreBadge.textContent = badgeText;
      } else {
        // Fallback checks for character overlaps
        let matchCharCount = 0;
        for (let char of this.activeHskWord.hanzi) {
          if (spokenText.includes(char)) matchCharCount++;
        }
        
        if (matchCharCount > 0 && matchCharCount === this.activeHskWord.hanzi.length) {
          this.hskScoreBadge.className = "score-badge almost";
          let badgeText = "Gần đúng ⚡";
          if (window.i18n && window.i18n.currentLang === 'en') badgeText = "Almost ⚡";
          else if (window.i18n && window.i18n.currentLang === 'zh') badgeText = "接近 ⚡";
          this.hskScoreBadge.textContent = badgeText;
        } else {
          this.hskScoreBadge.className = "score-badge wrong";
          let badgeText = "Sai từ ❌";
          if (window.i18n && window.i18n.currentLang === 'en') badgeText = "Wrong Word ❌";
          else if (window.i18n && window.i18n.currentLang === 'zh') badgeText = "发音错误 ❌";
          this.hskScoreBadge.textContent = badgeText;
        }
      }
      let statusMsg = "Nhấn Từ Khác để luyện từ tiếp theo.";
      if (window.i18n && window.i18n.currentLang === 'en') statusMsg = "Click Next Word to continue HSK practice.";
      else if (window.i18n && window.i18n.currentLang === 'zh') statusMsg = "点击换个词语进行下一个词练习。";
      this.setStatusText(statusMsg);

    } else if (this.activeMode === "open") {
      this.openOutputHanzi.textContent = spokenText;
      const spokenPinyin = getPinyinForText(spokenText);
      let errorPinyin = "Không nhận diện được Pinyin";
      if (window.i18n && window.i18n.currentLang === 'en') errorPinyin = "Could not recognize Pinyin";
      else if (window.i18n && window.i18n.currentLang === 'zh') errorPinyin = "未识别到拼音";
      this.openOutputPinyin.textContent = spokenPinyin || errorPinyin;
      
      let statusMsg = "Ghi âm nói tự do hoàn tất.";
      if (window.i18n && window.i18n.currentLang === 'en') statusMsg = "Free speaking analysis completed.";
      else if (window.i18n && window.i18n.currentLang === 'zh') statusMsg = "自由朗读分析完成。";
      this.setStatusText(statusMsg);
    }
  }

  logTonePairResult(pair, isCorrect) {
    if (!this.stats[pair]) {
      this.stats[pair] = { correct: 0, wrong: 0 };
    }

    if (isCorrect) {
      this.stats[pair].correct++;
    } else {
      this.stats[pair].wrong++;
    }

    this.saveStats();
    this.updateCellBg(pair);
    
    // Update active label ratio
    const stat = this.stats[pair];
    const total = stat.correct + stat.wrong;
    this.tpAccuracyLabel.innerText = `${Math.round(100 * stat.correct / total)}% (${stat.correct}/${total})`;
  }

  // ── ATTACH LISTENERS ──────────────────────────────────────────────
  attachEvents() {
    // Cells grid click
    document.querySelectorAll(".tonepair-cell").forEach(cell => {
      cell.addEventListener("click", () => {
        const pair = cell.dataset.pair;
        this.selectTonepairCell(pair);
      });
    });

    // Speak buttons
    this.btnPlayTp.addEventListener("click", () => {
      if (this.activeTpWord) this.playModelVoice(this.activeTpWord.hanzi);
    });

    this.btnPlayHsk.addEventListener("click", () => {
      if (this.activeHskWord) this.playModelVoice(this.activeHskWord.hanzi);
    });

    // Record toggle buttons
    this.btnRecordTp.addEventListener("click", () => this.toggleRecording("tp"));
    this.btnRecordHsk.addEventListener("click", () => this.toggleRecording("hsk"));
    this.btnRecordOpen.addEventListener("click", () => this.toggleRecording("open"));

    // Next buttons
    this.btnNextTp.addEventListener("click", () => this.nextTpWord());
    this.btnNextHsk.addEventListener("click", () => this.nextHskWord());

    // Settings Dropdowns
    this.hskLevelSelect.addEventListener("change", (e) => {
      this.hskLevel = parseInt(e.target.value) || 1;
      this.nextHskWord();
    });

    this.syllableCountSelect.addEventListener("change", (e) => {
      this.openSyllableCount = e.target.value;
      this.clearOpenEnded();
    });

    // HSK Pinyin reveal click
    this.hskWordPinyin.addEventListener("click", () => this.showHskPinyin());
  }

  selectTonepairCell(pair) {
    this.selectTonePairCell(pair);
  }
}

// Instantiate on load
document.addEventListener("DOMContentLoaded", () => {
  window.appPractice = new MandarinPractice();
});
