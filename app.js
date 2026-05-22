// Set current year in footer
const yearEl = document.getElementById('current-year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Ripple effect on link card click
document.querySelectorAll('.link-card').forEach(card => {
  card.addEventListener('click', function (e) {
    // Create ripple
    const ripple = document.createElement('span');
    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      left:${x}px; top:${y}px;
      border-radius:50%;
      background:rgba(212,168,67,0.15);
      transform:scale(0);
      animation:ripple-anim 0.55s ease-out forwards;
      pointer-events:none;
      z-index:10;
    `;
    card.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });
});

// Inject ripple keyframe once
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple-anim {
    to { transform: scale(1); opacity: 0; }
  }
`;
document.head.appendChild(style);

// Tilt effect on cards (subtle 3D on mouse move)
document.querySelectorAll('.link-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `translateY(-2px) scale(1.012) perspective(600px) rotateY(${xPct * 4}deg) rotateX(${-yPct * 3}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Respect reduced motion
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.link-card').forEach(card => {
    card.onmousemove = null;
  });
}
