'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView, useReducedMotion } from 'motion/react';

/** Counts up to a numeric value like "7" or "1,500+" when scrolled into view. */
export function Counter({ value, className }: { value: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' });
  const reduce = useReducedMotion();
  const m = value.match(/^(\D*)(\d[\d.,]*)(\D*)$/);
  const digits = m ? Number(m[2].replace(/[.,]/g, '')) : NaN;
  const isYear = digits >= 1900 && digits <= 2100;
  const countable = m && !Number.isNaN(digits) && !isYear;
  const sep = m && /[.,]/.test(m[2]) ? m[2].match(/[.,]/)![0] : '';
  const [text, setText] = useState(value);
  const [armed, setArmed] = useState(false);

  // Below the fold: start from 0 so the count is visible when it scrolls in.
  useEffect(() => {
    if (!countable || reduce || !ref.current) return;
    if (ref.current.getBoundingClientRect().top > window.innerHeight) { setText(`${m![1]}0${m![3]}`); setArmed(true); }
  }, [countable, reduce]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!armed || !inView || !m) return;
    const controls = animate(0, digits, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        const n = Math.round(v).toString();
        const withSep = sep ? n.replace(/\B(?=(\d{3})+(?!\d))/g, sep) : n;
        setText(`${m[1]}${withSep}${m[3]}`);
      },
      onComplete: () => setText(value),
    });
    return () => controls.stop();
  }, [armed, inView]); // eslint-disable-line react-hooks/exhaustive-deps

  return <span ref={ref} className={className}>{text}</span>;
}
