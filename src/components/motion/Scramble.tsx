'use client';

import { useEffect, useState, type ElementType } from 'react';
import { useReducedMotion } from 'motion/react';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/';

/**
 * Text that "decodes" into place. The final text is server-rendered, so it is
 * readable without JS and never hidden; the scramble only plays after mount.
 */
export function Scramble({ text, as: Tag = 'span', className, delay = 0, duration = 900 }: {
  text: string; as?: ElementType; className?: string; delay?: number; duration?: number;
}) {
  const [out, setOut] = useState(text);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) { setOut(text); return; }
    let raf = 0;
    const start = performance.now() + delay;
    const chars = [...text];
    const tick = (now: number) => {
      const t = Math.max(0, now - start) / duration;
      const settled = Math.floor(t * chars.length);
      setOut(chars.map((c, i) => (i < settled || c === ' ' ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join(''));
      if (t < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, duration, reduce]);

  return (
    <Tag className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{out}</span>
    </Tag>
  );
}
