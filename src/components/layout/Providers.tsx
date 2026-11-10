'use client';

import { LazyMotion, MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

const loadFeatures = () => import('./motion-features').then((r) => r.default);

/** Motion respects reduced-motion everywhere; its features load after first paint. */
export function Providers({ children, nonce }: { children: ReactNode; nonce?: string }) {
  return (
    <MotionConfig reducedMotion="user" nonce={nonce}>
      <LazyMotion features={loadFeatures} strict>{children}</LazyMotion>
    </MotionConfig>
  );
}
