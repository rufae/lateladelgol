// Lightweight confetti implementation using DOM elements — no external deps.
export function fireConfetti({ x = window.innerWidth / 2, y = window.innerHeight / 2, count = 24, spread = 120 } = {}) {
  try {
    const colors = ['#ff4d4f', '#ffb400', '#36d399', '#4f46e5', '#06b6d4', '#f97316'];
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '0';
    container.style.top = '0';
    container.style.width = '0';
    container.style.height = '0';
    container.style.pointerEvents = 'none';
    container.style.zIndex = 9999;
    document.body.appendChild(container);

    for (let i = 0; i < count; i++) {
      const el = document.createElement('div');
      const size = Math.floor(Math.random() * 10) + 6;
      el.style.position = 'fixed';
      el.style.left = `${x - size / 2}px`;
      el.style.top = `${y - size / 2}px`;
      el.style.width = `${size}px`;
      el.style.height = `${size * 0.6}px`;
      el.style.background = colors[Math.floor(Math.random() * colors.length)];
      el.style.opacity = '1';
      el.style.borderRadius = Math.random() > 0.5 ? '2px' : '50%';
      el.style.transform = `translate3d(0,0,0) rotate(${Math.random() * 360}deg)`;
      el.style.transition = `transform ${900 + Math.random() * 600}ms cubic-bezier(.2,.8,.2,1), opacity 600ms ease-out`;
      el.style.pointerEvents = 'none';

      container.appendChild(el);

      // compute random trajectory
      const angle = (Math.random() - 0.5) * (spread * (Math.PI / 180));
      const distance = 120 + Math.random() * 220;
      const dx = Math.cos(angle) * distance * (Math.random() * 1.2 + 0.2);
      const dy = Math.sin(angle) * distance * (Math.random() * 1.2 + 0.2) - (50 + Math.random() * 80);
      // schedule animation
      requestAnimationFrame(() => {
        el.style.transform = `translate3d(${dx}px, ${dy}px, 0) rotate(${(Math.random() * 720) - 360}deg) scale(${(Math.random() * 0.8) + 0.6})`;
        el.style.opacity = '0';
      });
    }

    // cleanup after animation
    setTimeout(() => {
      try { document.body.removeChild(container); } catch (e) { /* ignore */ }
    }, 1800);
  } catch (e) {
    // silent
    console.warn('confetti failed', e);
  }
}
