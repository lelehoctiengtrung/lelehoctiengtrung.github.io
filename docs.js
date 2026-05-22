// ===========================
// docs.js — Tài liệu page
// ===========================

// --- Filter tabs ---
const tabs      = document.querySelectorAll('.filter-tab');
const cards     = document.querySelectorAll('.doc-big-card');
const emptyState = document.getElementById('empty-state');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const filter = tab.dataset.filter;

    // Update active tab
    tabs.forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
    tab.classList.add('active');
    tab.setAttribute('aria-selected', 'true');

    // Show/hide cards
    let visible = 0;
    cards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      if (match) {
        card.removeAttribute('hidden');
        card.style.animation = 'none';
        requestAnimationFrame(() => {
          card.style.animation = 'fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both';
        });
        visible++;
      } else {
        card.setAttribute('hidden', '');
      }
    });

    // Empty state
    if (emptyState) emptyState.hidden = visible > 0;
  });
});

// --- Share buttons (Web Share API + clipboard fallback) ---
const toast    = document.getElementById('share-toast');
const toastMsg = document.getElementById('toast-msg');

function showToast(msg) {
  toastMsg.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2800);
}

document.querySelectorAll('.btn-share-big').forEach(btn => {
  btn.addEventListener('click', async () => {
    const title = btn.dataset.title || 'Tài liệu tiếng Trung';
    const url   = btn.dataset.url   || window.location.href;
    const text  = `📚 "${title}" — tài liệu miễn phí từ Lê Lê học tiếng Trung`;

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
      showToast('✅ Đã sao chép link tài liệu!');
    } catch {
      window.prompt('Sao chép link này:', url);
    }
  });
});

// --- Ripple on download buttons ---
document.querySelectorAll('.btn-download-big').forEach(btn => {
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

// Inject keyframe
const style = document.createElement('style');
style.textContent = `@keyframes ripple-docs { to { transform:scale(1); opacity:0; } }`;
document.head.appendChild(style);

// --- Respect reduced motion ---
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.doc-big-card').forEach(c => c.style.animation = 'none');
}
