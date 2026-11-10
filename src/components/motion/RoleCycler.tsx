'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

/** Cycles through roles; the first role is server-rendered. */
export function RoleCycler({ roles, label }: { roles: string[]; label: string }) {
  const [i, setI] = useState(0);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce || roles.length < 2) return;
    const id = setInterval(() => setI((n) => (n + 1) % roles.length), 3000);
    return () => clearInterval(id);
  }, [reduce, roles.length]);

  return (
    <p className="roles">
      <span className="sr-only">{label}: {roles.join(', ')}</span>
      <span className="roles__prefix" aria-hidden="true">&gt;_</span>
      <span className="roles__window" aria-hidden="true">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={i}
            className="roles__item"
            initial={{ y: '110%', opacity: 0, filter: 'blur(6px)' }}
            animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
            exit={{ y: '-110%', opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
          >
            {roles[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </p>
  );
}
