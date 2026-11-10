'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { stripLang } from '@/lib/path';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, m, LayoutGroup } from 'motion/react';
import { LogoMark } from '../ui/Logo';
import { Icon } from '../ui/Icon';
import type { Lang } from '@/lib/config';
import { SearchButton } from './CommandPalette';

export interface NavItem { href: string; label: string }
export interface LangItem { code: Lang; short: string; name: string; locale: string }

function LangSwitch({ langs, current, pathname, label, currentLabel, id }: {
  langs: LangItem[]; current: Lang; pathname: string; label: string; currentLabel: string; id: string;
}) {
  return (
    <div className="lang" role="group" aria-labelledby={id}>
      <span id={id} className="sr-only">{label}</span>
      {langs.map((l) => (
        <a
          key={l.code}
          className="lang__link"
          href={`/lang/${l.code}?next=${encodeURIComponent(pathname)}`}
          hrefLang={l.locale}
          lang={l.locale}
          aria-current={l.code === current ? 'true' : undefined}
          data-lang={l.code}
        >
          {l.code === current && <m.span layoutId={`${id}-pill`} className="lang__pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
          <span aria-hidden="true" className="lang__txt">{l.short}</span>
          <span className="sr-only">{l.name}{l.code === current ? ` (${currentLabel})` : ''}</span>
        </a>
      ))}
    </div>
  );
}

export function Header({ nav, langs, lang, labels }: {
  nav: NavItem[];
  langs: LangItem[];
  lang: Lang;
  labels: { home: string; mainNav: string; menuOpen: string; menuClose: string; language: string; languageCurrent: string; hireMe: string; search: string };
}) {
  const pathname = stripLang(usePathname());
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>('a, button');
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus(); }
      if (e.key === 'Tab' && panelRef.current) {
        const f = [toggleRef.current, ...Array.from(panelRef.current.querySelectorAll<HTMLElement>('a[href], button'))].filter(Boolean) as HTMLElement[];
        const i = f.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href);

  return (
    <header className={`hdr${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="hdr__bar">
        <Link className="brand" href="/" aria-label={`Nexify — ${labels.home}`}>
          <LogoMark />
          <span className="brand__name">Nexify</span>
        </Link>
        <LayoutGroup id="desktop-nav">
          <nav className="hdr__nav" aria-label={labels.mainNav}>
            <ul>
              {nav.map((item) => (
                <li key={item.href}>
                  <Link className="hdr__link" href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}>
                    {isActive(item.href) && <m.span layoutId="nav-pill" className="hdr__pill" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    <span className="hdr__txt">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </LayoutGroup>
        <SearchButton label={labels.search} />
        <div className="hdr__actions">
          <LangSwitch langs={langs} current={lang} pathname={pathname} label={labels.language} currentLabel={labels.languageCurrent} id="lang-desktop" />
          <Link className="btn btn--primary btn--sm" href="/contact" data-magnetic="" aria-current={pathname === '/contact' ? 'page' : undefined}>
            <span>{labels.hireMe}</span><Icon name="arrow" className="btn__end" />
          </Link>
        </div>
        <button
          ref={toggleRef}
          type="button"
          className="hdr__toggle"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="hdr__burger" aria-hidden><i /><i /></span>
          <span className="sr-only">{open ? labels.menuClose : labels.menuOpen}</span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <m.div
            id="mobile-menu"
            ref={panelRef}
            className="mmenu"
            initial={{ clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
            animate={{ clipPath: 'circle(150% at calc(100% - 44px) 36px)' }}
            exit={{ clipPath: 'circle(0% at calc(100% - 44px) 36px)' }}
            transition={{ duration: 0.55, ease: [0.7, 0, 0.2, 1] }}
          >
            <nav aria-label={labels.mainNav}>
              <ul className="mmenu__list">
                {nav.map((item, i) => (
                  <m.li
                    key={item.href}
                    initial={{ opacity: 0, y: 28 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 12 }}
                    transition={{ delay: 0.12 + i * 0.045, type: 'spring', stiffness: 260, damping: 24 }}
                  >
                    <Link className="mmenu__link" href={item.href} aria-current={isActive(item.href) ? 'page' : undefined}>
                      <span className="mmenu__num" aria-hidden>{String(i + 1).padStart(2, '0')}</span>
                      <span>{item.label}</span>
                    </Link>
                  </m.li>
                ))}
              </ul>
            </nav>
            <m.div className="mmenu__foot" initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.45 } }} exit={{ opacity: 0 }}>
              <LangSwitch langs={langs} current={lang} pathname={pathname} label={labels.language} currentLabel={labels.languageCurrent} id="lang-mobile" />
              <Link className="btn btn--primary" href="/contact"><span>{labels.hireMe}</span><Icon name="arrow" className="btn__end" /></Link>
            </m.div>
          </m.div>
        )}
      </AnimatePresence>
    </header>
  );
}
