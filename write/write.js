/* ============================================================
   write.js — Lê Lê Chinese Stroke Order & Writing practice
   Controller using Hanzi Writer library for animations
   and interactive drawing quizzes.
   ============================================================ */

// ── HSK PRESET VOCABULARY DATABASE ───────────────────────────────────
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
    this.loadCharacter("你");
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

    try {
      // Initialize Hanzi Writer instance
      this.writer = HanziWriter.create("character-target", char, {
        width: 300,
        height: 300,
        padding: 15,
        showOutline: true,
        strokeColor: "#D4AF37",      // Gold for model strokes
        outlineColor: "#222222",     // Dark background outline
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

    // Use HanziWriter utility to get sizing scale transform
    const transformData = HanziWriter.getScalingTransform(70, 70, 5); // 70x70 size, 5px padding
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
