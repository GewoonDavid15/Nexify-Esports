'use client';

import { MotionConfig } from 'motion/react';
import type { ReactNode } from 'react';

/** Motion respects the visitor's reduced-motion setting everywhere. */
export function Providers({ children, nonce }: { children: ReactNode; nonce?: string }) {
  return <MotionConfig reducedMotion="user" nonce={nonce}>{children}</MotionConfig>;
}
