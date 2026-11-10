'use client';

import { useEffect, useState } from 'react';
import { m, useScroll, useSpring, AnimatePresence, useReducedMotion } from 'motion/react';
import { Icon } from '../ui/Icon';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 });
  return <m.div className="scroll-progress" style={{ scaleX }} aria-hidden />;
}

export function BackToTop({ label }: { label: string }) {
  const [show, setShow] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    const on = () => setShow(window.scrollY > window.innerHeight * 1.2);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <m.button
          type="button"
          className="to-top"
          aria-label={label}
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => {
            window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
            document.getElementById('main')?.focus({ preventScroll: true });
          }}
        >
          <Icon name="arrow" className="to-top__icon" />
        </m.button>
      )}
    </AnimatePresence>
  );
}
