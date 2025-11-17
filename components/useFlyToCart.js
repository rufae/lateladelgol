"use client";

import { useCallback } from 'react';

// Lightweight DOM-based "fly to cart" animation.
// Usage: const fly = useFlyToCart(); fly(imageSrc, startElement);
export default function useFlyToCart() {
  const trigger = useCallback((imageSrc, startElement) => {
    if (!imageSrc) return;
    try {
      const cartBtn = document.getElementById('nav-cart-button');
      if (!cartBtn) return;

      const startRect = startElement?.getBoundingClientRect?.() || { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 80, height: 80 };
      const endRect = cartBtn.getBoundingClientRect();

      const img = document.createElement('img');
      img.src = imageSrc;
      img.style.position = 'fixed';
      img.style.left = `${startRect.left + (startRect.width / 2) - 30}px`;
      img.style.top = `${startRect.top + (startRect.height / 2) - 30}px`;
      img.style.width = '60px';
      img.style.height = '60px';
      img.style.borderRadius = '8px';
      img.style.objectFit = 'cover';
      img.style.zIndex = 9999;
      img.style.transition = 'transform 650ms cubic-bezier(.2,.8,.2,1), opacity 650ms';
      img.style.boxShadow = '0 10px 30px rgba(0,0,0,0.25)';
      img.style.pointerEvents = 'none';
      img.style.opacity = '1';

      document.body.appendChild(img);

      // Force layout
      img.getBoundingClientRect();

      const destX = endRect.left + endRect.width / 2;
      const destY = endRect.top + endRect.height / 2;
      const deltaX = destX - (startRect.left + startRect.width / 2);
      const deltaY = destY - (startRect.top + startRect.height / 2);

      img.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(0.2)`;
      img.style.opacity = '0';

      img.addEventListener('transitionend', () => {
        try { document.body.removeChild(img); } catch (e) {}
      }, { once: true });
    } catch (e) {
      // ignore
      console.warn('Fly to cart failed', e);
    }
  }, []);

  return trigger;
}
