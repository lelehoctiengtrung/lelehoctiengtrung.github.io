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
  "完": "wán", "新": "xīn", "旧": "jiù", "黑": "hēi", "红": "hóng", "白": "bái", "绿": "lǜ", "蓝": "lán", "黄": "huáng", "百": "bǎi", "千": "qiān",
  "晴": "qíng", "阴": "yīn", "雪": "xuě", "药": "yào", "病": "bìng", "笑": "xiào", "哭": "kū", "穿": "chuān", "洗": "xǐ", "给": "gěi", "找": "zhǎo"
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
    { hanzi: "睡觉", pinyin: "shuìjiào", tone_pair: "44", meaning: "Đi ngủ" }
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
    { hanzi: "词典", pinyin: "cídiǎn", tone_pair: "23", meaning: "Từ điển" }
  ],
  // HSK 3
  3: [
    { hanzi: "经常", pinyin: "jīngcháng", tone_pair: "12", meaning: "Thường xuyên" },
    { hanzi: "愿意", pinyin: "yuànyì", tone_pair: "44", meaning: "Bằng lòng" },
    { hanzi: "简单", pinyin: "jiǎndān", tone_pair: "31", meaning: "Đơn giản" },
    { hanzi: "影响", pinyin: "yǐngxiǎng", tone_pair: "23", meaning: "Ảnh hưởng (biến điệu 3-3)" },
    { hanzi: "办法", pinyin: "bànfǎ", tone_pair: "43", meaning: "Biện pháp, cách làm" },
    { hanzi: "历史", pinyin: "lìshǐ", tone_pair: "43", meaning: "Lịch sử" },
    { hanzi: "音乐", pinyin: "yīnyuè", tone_pair: "14", meaning: "Âm nhạc" },
    { hanzi: "干净", pinyin: "gānjìng", tone_pair: "14", meaning: "Sạch sẽ" },
    { hanzi: "突然", pinyin: "tūrán", tone_pair: "12", meaning: "Đột nhiên" },
    { hanzi: "努力", pinyin: "nǔlì", tone_pair: "34", meaning: "Cố gắng" },
    { hanzi: "发现", pinyin: "fāxiàn", tone_pair: "14", meaning: "Phát hiện" },
    { hanzi: "环境", pinyin: "huánjìng", tone_pair: "24", meaning: "Môi trường" }
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
    { hanzi: "鼓励", pinyin: "gǔlì", tone_pair: "34", meaning: "Cổ vũ" },
    { hanzi: "讨论", pinyin: "tǎolùn", tone_pair: "34", meaning: "Thảo luận" }
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
      const warnMsg = "Microphone không hỗ trợ trên trình duyệt này. Vui lòng sử dụng Google Chrome hoặc Safari.";
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
      if (e.error === 'not-allowed') {
        errorText = "Quyền truy cập micro bị từ chối. Vui lòng cấp quyền.";
      } else if (e.error === 'no-speech') {
        errorText = "Không nghe thấy tiếng nói. Hãy thử lại.";
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
      this.setStatusText("🎙️ Đang nghe... Hãy nói rõ ràng.");
      
      if (this.activeMode === "tp") {
        this.btnRecordTp.classList.add("recording");
        this.btnRecordTp.innerHTML = `<span class="mic-icon">🛑</span> Dừng & Chấm điểm`;
      } else if (this.activeMode === "hsk") {
        this.btnRecordHsk.classList.add("recording");
        this.btnRecordHsk.innerHTML = `<span class="mic-icon">🛑</span> Dừng & Chấm điểm`;
      } else if (this.activeMode === "open") {
        this.btnRecordOpen.classList.add("recording");
        this.btnRecordOpen.innerHTML = `<span class="mic-icon">🛑</span> Dừng ghi`;
      }
    } else {
      this.setStatusText("Sẵn sàng ghi âm");
      
      this.btnRecordTp.classList.remove("recording");
      this.btnRecordTp.innerHTML = `<span class="mic-icon">🎙️</span> Nhấn và nói`;
      
      this.btnRecordHsk.classList.remove("recording");
      this.btnRecordHsk.innerHTML = `<span class="mic-icon">🎙️</span> Nhấn và nói`;
      
      this.btnRecordOpen.classList.remove("recording");
      this.btnRecordOpen.innerHTML = `<span class="mic-icon">🎙️</span> Nhấn và nói`;
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
        this.tpAccuracyLabel.innerText = "Chưa thực hành";
      }

      this.nextTpWord(true); // load new word matching the pair
    }
  }

  // ── TARGET LOADS ──────────────────────────────────────────────────
  nextTpWord(keepSamePair = false) {
    if (this.tpResultBox) this.tpResultBox.classList.add("hidden");
    
    // Find matching word
    const exclude = keepSamePair ? null : this.activeTpWord?.hanzi;
    this.activeTpWord = getWordForTonePair(this.activeTonePair, exclude);
    
    this.tpWordHanzi.textContent = this.activeTpWord.hanzi;
    this.tpWordPinyin.textContent = this.activeTpWord.pinyin;
    this.tpWordMeaning.textContent = this.activeTpWord.meaning;
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
    this.hskWordMeaning.textContent = word.meaning;
    
    // Hide pinyin initially
    this.hskWordPinyin.textContent = "Nhấp để hiện pinyin";
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
    this.openOutputHanzi.textContent = "Nhấp micro & nói...";
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
        this.tpScoreBadge.textContent = "Phát âm chuẩn! 🌟";
        this.logTonePairResult(this.activeTonePair, true);
      } else if (incorrectCount === 1) {
        this.tpScoreBadge.className = "score-badge almost";
        this.tpScoreBadge.textContent = "Gần đúng! ⚡";
        this.logTonePairResult(this.activeTonePair, false);
      } else {
        this.tpScoreBadge.className = "score-badge wrong";
        this.tpScoreBadge.textContent = "Chưa chính xác ❌";
        this.logTonePairResult(this.activeTonePair, false);
      }

      this.setStatusText("Nhấn Từ Khác để tiếp tục.");

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
        this.hskScoreBadge.textContent = "Chuẩn xác! 🌟";
      } else {
        // Fallback checks for character overlaps
        let matchCharCount = 0;
        for (let char of this.activeHskWord.hanzi) {
          if (spokenText.includes(char)) matchCharCount++;
        }
        
        if (matchCharCount > 0 && matchCharCount === this.activeHskWord.hanzi.length) {
          this.hskScoreBadge.className = "score-badge almost";
          this.hskScoreBadge.textContent = "Gần đúng ⚡";
        } else {
          this.hskScoreBadge.className = "score-badge wrong";
          this.hskScoreBadge.textContent = "Sai từ ❌";
        }
      }
      this.setStatusText("Nhấn Từ Khác để luyện từ tiếp theo.");

    } else if (this.activeMode === "open") {
      this.openOutputHanzi.textContent = spokenText;
      const spokenPinyin = getPinyinForText(spokenText);
      this.openOutputPinyin.textContent = spokenPinyin || "Không nhận diện được Pinyin";
      this.setStatusText("Ghi âm nói tự do hoàn tất.");
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
