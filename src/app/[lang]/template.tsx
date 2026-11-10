'use client';

import { m } from 'motion/react';
import { useEffect, type ReactNode } from 'react';

// The very first render (server HTML) must never be hidden: only client-side
// navigations get the enter transition.
let hydrated = false;

export default function Template({ children }: { children: ReactNode }) {
  const animateIn = hydrated;
  useEffect(() => { hydrated = true; }, []);
  // First load: a plain wrapper, so hydration never restyles the server HTML.
  if (!animateIn) return <div>{children}</div>;
  return (
    <m.div
      initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </m.div>
  );
}
