'use client';

import { useRef, type PointerEvent, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, useMotionTemplate } from 'motion/react';

/** Holographic trading-card that tilts towards the pointer. */
export function PlayerCard({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 160, damping: 18 });
  const sy = useSpring(py, { stiffness: 160, damping: 18 });
  const rotateY = useTransform(sx, [0, 1], [-14, 14]);
  const rotateX = useTransform(sy, [0, 1], [12, -12]);
  const shineX = useTransform(sx, [0, 1], ['0%', '100%']);
  const shineY = useTransform(sy, [0, 1], ['0%', '100%']);
  const shine = useMotionTemplate`radial-gradient(420px circle at ${shineX} ${shineY}, rgba(255,255,255,.22), transparent 55%)`;
  const holo = useTransform(sx, [0, 1], ['0% 50%', '100% 50%']);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const onLeave = () => { px.set(0.5); py.set(0.5); };

  return (
    <div className="card-stage">
      <motion.div
        ref={ref}
        className="player-card"
        role="group"
        aria-label={label}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 1100 }}
      >
        <motion.div className="player-card__holo" style={{ backgroundPosition: holo }} aria-hidden />
        <motion.div className="player-card__shine" style={{ background: shine }} aria-hidden />
        <div className="player-card__body">{children}</div>
      </motion.div>
    </div>
  );
}
