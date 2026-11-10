'use client';

import { motion } from 'motion/react';
import { useEffect, type ReactNode } from 'react';

// The very first render (server HTML) must never be hidden: only client-side
// navigations get the enter transition.
let hydrated = false;

export default function Template({ children }: { children: ReactNode }) {
  const animateIn = hydrated;
  useEffect(() => { hydrated = true; }, []);
  return (
    <motion.div
      initial={animateIn ? { opacity: 0, y: 18, filter: 'blur(6px)' } : false}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
