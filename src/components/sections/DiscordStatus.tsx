'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { fmt } from '@/lib/i18n/fmt';
import { Icon } from '../ui/Icon';

type Status = { enabled: boolean; status?: 'online' | 'idle' | 'dnd' | 'offline'; game?: string | null };
type Labels = { label: string; online: string; idle: string; dnd: string; offline: string; playing: string };

/** Live Discord presence; renders nothing until a status is available. */
export function DiscordStatus({ t, handle }: { t: Labels; handle: string }) {
  const [s, setS] = useState<Status | null>(null);
  useEffect(() => {
    let alive = true;
    const load = () => fetch('/api/discord-status').then((r) => r.json()).then((j: Status) => { if (alive) setS(j); }).catch(() => {});
    load();
    const id = setInterval(load, 30_000);
    return () => { alive = false; clearInterval(id); };
  }, []);
  const show = s?.enabled && s.status;
  // Fixed-height slot so the heading never moves when the status arrives.
  return (
    <div className="dstatus-slot">
    <AnimatePresence>
      {show ? (
        <m.p className={`dstatus dstatus--${s.status}`} role="status" aria-label={t.label}
          initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <Icon name="discord" className="dstatus__icon" />
          <span className="dstatus__dot" aria-hidden />
          <span>{t[s.status!]}{s.game ? <> · <strong>{fmt(t.playing, { name: s.game })}</strong></> : null}</span>
          <span className="dstatus__handle">@{handle}</span>
        </m.p>
      ) : null}
    </AnimatePresence>
    </div>
  );
}
