'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Icon } from '../ui/Icon';

type Texts = { eyebrow: string; title: string; text: string; home: string; contact: string };

/** The 404 page can't read route params, so it follows <html lang> (set by the layout). */
export function NotFoundBody({ texts }: { texts: Record<'en' | 'nl' | 'pt', Texts> }) {
  const [t, setT] = useState(texts.en);
  useEffect(() => {
    const l = document.documentElement.lang.slice(0, 2) as 'en' | 'nl' | 'pt';
    if (texts[l]) setT(texts[l]);
  }, [texts]);
  return (
    <section className="nf" aria-labelledby="nf-title">
      <div className="nf__art" aria-hidden><span className="nf__code">404</span></div>
      <p className="kicker">{t.eyebrow}</p>
      <h1 id="nf-title" className="phero__title nf__title">{t.title}</h1>
      <p className="phero__lead">{t.text}</p>
      <div className="actions actions--center">
        <Link className="btn btn--primary" href="/"><span>{t.home}</span><Icon name="arrow" className="btn__end" /></Link>
        <Link className="btn btn--ghost" href="/contact"><span>{t.contact}</span></Link>
      </div>
    </section>
  );
}
