// ===================================================
// app.js — Homepage Interactivity & Visual Effects
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
  initHeroWriter();
  initMobileMenu();
  initCardEffects();
});

// Robust character data loader for Vietnam networks (Multi-CDN queue with 3.5s timeout)
async function loadCharData(char) {
  if (!char) return null;
  const cdns = [
    `https://unpkg.com/hanzi-writer-data@2.0.1/${char}.json`,
    `https://fastly.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`,
    `https://gcore.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`,
    `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0/${char}.json`
  ];
  
  for (const url of cdns) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500);
      
      const response = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (response.ok) {
        return await response.json();
      }
    } catch (e) {
      console.warn(`Failed to fetch character data for "${char}" from ${url}:`, e);
    }
  }
  throw new Error(`Could not load character data for "${char}" from any CDN mirror.`);
}

// ---- Hero Calligraphy Tracing (HanziWriter) ----
let heroWriter = null;
function initHeroWriter() {
  const canvasContainer = document.getElementById('hero-writer-canvas');
  if (!canvasContainer) return;

  // Wait until HanziWriter is available via CDN
  if (typeof HanziWriter === 'undefined') {
    // Retry in 200ms
    setTimeout(initHeroWriter, 200);
    return;
  }

  const customLoader = (character, onComplete, onError) => {
    loadCharData(character)
      .then(data => onComplete(data))
      .catch(err => onError(err));
  };

  // Create HanziWriter for character '学' (Learn)
  heroWriter = HanziWriter.create('hero-writer-canvas', '学', {
    width: 140,
    height: 140,
    padding: 10,
    strokeColor: '#C94535', // Chinese Red
    outlineColor: '#eae4d8', // Light paper outline
    drawingColor: '#D4A843', // Classic Gold
    showOutline: true,
    showCharacter: true,
    strokeAnimationSpeed: 1.2,
    delayBetweenStrokes: 250,
    charDataLoader: customLoader
  });

  // Autoplay animation with a delay
  setTimeout(() => {
    if (heroWriter) heroWriter.animateCharacter();
  }, 1200);

  // Play animation trigger
  const playBtn = document.getElementById('hero-play-btn');
  if (playBtn) {
    playBtn.addEventListener('click', () => {
      if (heroWriter) {
        heroWriter.cancelAnimations();
        heroWriter.animateCharacter();
      }
    });
  }

  // Clear/Reset animation trigger
  const clearBtn = document.getElementById('hero-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (heroWriter) {
        heroWriter.cancelAnimations();
        heroWriter.showCharacter();
        heroWriter.animateCharacter();
      }
    });
  }
}

// ---- Mobile Menu Drawer ----
function initMobileMenu() {
  const menuBtn = document.getElementById('menu-toggle-btn');
  const mobileNav = document.getElementById('mobile-nav');

  if (menuBtn && mobileNav) {
    menuBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = mobileNav.classList.contains('open');
      if (isOpen) {
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileNav.classList.add('open');
        menuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileNav.classList.contains('open') && !mobileNav.contains(e.target) && e.target !== menuBtn) {
        mobileNav.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Prevent propagation on menu click
    mobileNav.addEventListener('click', (e) => {
      e.stopPropagation();
    });
  }
}

// ---- Showcase Cards Visual Effects (Tilt & Ripple) ----
function initCardEffects() {
  const cards = document.querySelectorAll('.showcase-card, .social-card');
  if (cards.length === 0) return;

  // 1. Ripple Effect on Click
  cards.forEach(card => {
    card.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      const rect = card.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 1.5;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px; height: ${size}px;
        left: ${x}px; top: ${y}px;
        border-radius: 50%;
        background: rgba(212, 168, 67, 0.15);
        transform: scale(0);
        animation: ripple-anim 0.55s ease-out forwards;
        pointer-events: none;
        z-index: 10;
      `;
      card.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    });
  });

  // Inject ripple keyframe once if not already present
  if (!document.getElementById('ripple-style-injected')) {
    const style = document.createElement('style');
    style.id = 'ripple-style-injected';
    style.textContent = `
      @keyframes ripple-anim {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  // 2. 3D Tilt Effect on Mouse Move
  cards.forEach(card => {
    // Only apply to showcase cards (larger targets)
    if (!card.classList.contains('showcase-card')) return;

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const xPct = (e.clientX - rect.left) / rect.width - 0.5;
      const yPct = (e.clientY - rect.top) / rect.height - 0.5;
      
      // Calculate rotation (limit max tilt angle to 3.5 degrees)
      card.style.transform = `translateY(-4px) scale(1.01) perspective(600px) rotateY(${xPct * 3.5}deg) rotateX(${-yPct * 3}deg)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  // Respect reduced motion setting
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    cards.forEach(card => {
      card.onmousemove = null;
    });
  }
}
