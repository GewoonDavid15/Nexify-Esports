'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, m } from 'motion/react';
import { fmt } from '@/lib/i18n/fmt';
import { Icon } from '../ui/Icon';

export type Status = { enabled: boolean; status?: 'online' | 'idle' | 'dnd' | 'offline'; game?: string | null; details?: string | null; state?: string | null };
type Labels = { label: string; online: string; idle: string; dnd: string; offline: string; playing: string };

// One shared poll for every status widget on the page.
let cache: Status | null = null;
const subs = new Set<(s: Status) => void>();
let timer: ReturnType<typeof setInterval> | null = null;
const load = () => fetch('/api/discord-status').then((r) => r.json()).then((j: Status) => { cache = j; subs.forEach((f) => f(j)); }).catch(() => {});

export function useDiscordStatus() {
  const [s, setS] = useState<Status | null>(cache);
  useEffect(() => {
    subs.add(setS);
    if (!timer) { load(); timer = setInterval(load, 30_000); }
    return () => { subs.delete(setS); if (!subs.size && timer) { clearInterval(timer); timer = null; } };
  }, []);
  return s;
}

/** Live Discord presence; renders nothing until a status is available. */
export function DiscordStatus({ t, handle }: { t: Labels; handle: string }) {
  const s = useDiscordStatus();
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

/** Bigger "Now playing" card; only visible while a game is running. */
export function NowPlaying({ t }: { t: { title: string; text: string } }) {
  const s = useDiscordStatus();
  const game = s?.enabled && s.game ? s : null;
  return (
    <AnimatePresence>
      {game ? (
        <m.div className="nowplay" role="status" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
          <span className="nowplay__icon" aria-hidden><Icon name="gamepad" /></span>
          <div>
            <p className="nowplay__k"><i aria-hidden />{t.title} · {t.text}</p>
            <p className="nowplay__game">{game.game}</p>
            {game.details || game.state ? <p className="nowplay__detail">{[game.details, game.state].filter(Boolean).join(' · ')}</p> : null}
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
