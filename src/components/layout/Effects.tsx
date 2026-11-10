'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Small global behaviours that work by attribute, so server components can opt in:
 *  [data-reveal]   fade/slide in when scrolled into view (batched stagger)
 *  [data-spot]     pointer-following spotlight (sets --mx/--my)
 *  [data-magnetic] element drifts slightly towards the pointer
 *  [data-copy]     copies its value and shows a toast
 * Plus: loads decorative cloud textures after the page has loaded.
 * Nothing is hidden before hydration, so content never depends on JS.
 */
export function Effects({ copiedLabel }: { copiedLabel: string }) {
  const pathname = usePathname();

  // Reveal-on-scroll — re-armed on every route change.
  useEffect(() => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (reduce || !('IntersectionObserver' in window)) return;
    const vh = window.innerHeight;
    const io = new IntersectionObserver((entries) => {
      let batch = 0;
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.style.transitionDelay = `${Math.min(batch++ * 80, 480)}ms`;
        el.removeAttribute('data-pending');
        io.unobserve(el);
      }
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });
    for (const el of els) {
      if (el.getBoundingClientRect().top > vh * 0.95) {
        el.setAttribute('data-pending', '');
        io.observe(el);
      }
    }
    return () => io.disconnect();
  }, [pathname]);

  // Pointer spotlight + magnetic elements (event delegation, fine pointers only).
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let raf = 0;
    let last: PointerEvent | null = null;
    let magnet: HTMLElement | null = null;
    const frame = () => {
      raf = 0;
      if (!last) return;
      const target = last.target as Element | null;
      const spot = target?.closest?.<HTMLElement>('[data-spot]');
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty('--mx', `${last.clientX - r.left}px`);
        spot.style.setProperty('--my', `${last.clientY - r.top}px`);
      }
      const m = target?.closest?.<HTMLElement>('[data-magnetic]') ?? null;
      if (magnet && magnet !== m) { magnet.style.translate = ''; magnet.classList.remove('is-magnet'); }
      magnet = m;
      if (m) {
        const r = m.getBoundingClientRect();
        const dx = (last.clientX - (r.left + r.width / 2)) * 0.25;
        const dy = (last.clientY - (r.top + r.height / 2)) * 0.35;
        m.classList.add('is-magnet');
        m.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
      }
    };
    const onMove = (e: PointerEvent) => { last = e; if (!raf) raf = requestAnimationFrame(frame); };
    const onLeave = () => { if (magnet) { magnet.style.translate = ''; magnet.classList.remove('is-magnet'); magnet = null; } };
    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => { document.removeEventListener('pointermove', onMove); document.documentElement.removeEventListener('pointerleave', onLeave); cancelAnimationFrame(raf); };
  }, []);

  // Copy-to-clipboard with toast.
  useEffect(() => {
    const toast = document.querySelector<HTMLElement>('[data-toast]');
    let timer: ReturnType<typeof setTimeout>;
    const show = (msg: string) => {
      if (!toast) return;
      toast.textContent = msg;
      toast.classList.add('is-visible');
      clearTimeout(timer);
      timer = setTimeout(() => toast.classList.remove('is-visible'), 2600);
    };
    const onClick = async (e: MouseEvent) => {
      const btn = (e.target as Element).closest<HTMLElement>('[data-copy]');
      if (!btn) return;
      const value = btn.dataset.copy || '';
      try {
        await navigator.clipboard.writeText(value);
        show(`${copiedLabel}: ${value}`);
        btn.classList.add('is-copied');
        setTimeout(() => btn.classList.remove('is-copied'), 1800);
      } catch {
        show(btn.dataset.failed || value);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [copiedLabel]);

  // Decorative textures: after load so they never compete with text.
  useEffect(() => {
    const go = () => setTimeout(() => document.documentElement.classList.add('clouds-ready'), 60);
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
  }, []);

  return null;
}
