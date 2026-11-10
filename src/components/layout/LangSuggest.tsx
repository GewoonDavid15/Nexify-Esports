'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, m } from 'motion/react';
import { LANG_COOKIE } from '@/lib/config';
import { stripLang } from '@/lib/path';

type Texts = { text: string; yes: string; no: string };

/**
 * If no language was ever chosen and the browser prefers Dutch/Portuguese while
 * the page is in another language, offer to switch — never switches by itself.
 * "No thanks" stores the current language in the same functional cookie.
 */
export function LangSuggest({ current, texts }: { current: string; texts: Record<string, Texts> }) {
  const [suggest, setSuggest] = useState<string | null>(null);
  const pathname = stripLang(usePathname());
  useEffect(() => {
    if (document.cookie.split('; ').some((c) => c.startsWith(`${LANG_COOKIE}=`))) return;
    const pref = (navigator.languages?.[0] || navigator.language || '').slice(0, 2).toLowerCase();
    if (pref !== current && texts[pref]) setSuggest(pref);
  }, [current, texts]);
  const dismiss = () => {
    document.cookie = `${LANG_COOKIE}=${current}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax${location.protocol === 'https:' ? '; secure' : ''}`;
    setSuggest(null);
  };
  const t = suggest ? texts[suggest] : null;
  return (
    <AnimatePresence>
      {t && suggest ? (
        <m.div className="lsug" role="region" aria-label={t.text} lang={suggest}
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0, transition: { delay: 1 } }} exit={{ opacity: 0, y: 30 }}>
          <p>{t.text}</p>
          <div className="lsug__actions">
            <a className="btn btn--primary btn--sm" href={`/lang/${suggest}?next=${encodeURIComponent(pathname)}`}>{t.yes}</a>
            <button type="button" className="btn btn--ghost btn--sm" onClick={dismiss}>{t.no}</button>
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
