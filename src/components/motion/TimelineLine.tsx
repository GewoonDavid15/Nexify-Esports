'use client';

import { useRef, type ReactNode } from 'react';
import { m, useScroll, useSpring, useReducedMotion } from 'motion/react';

/** Wraps the timeline; the glowing line grows with scroll progress. */
export function TimelineLine({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 55%'] });
  const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 24, restDelta: 0.001 });
  return (
    <div ref={ref} className="tl">
      <span className="tl__track" aria-hidden />
      <m.span className="tl__line" aria-hidden style={reduce ? { scaleY: 1 } : { scaleY }} />
      {children}
    </div>
  );
}
