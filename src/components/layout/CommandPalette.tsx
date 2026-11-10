'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { AnimatePresence, m } from 'motion/react';
import { Icon, type IconName } from '../ui/Icon';
import { stripLang } from '@/lib/path';

export interface PaletteItem { id: string; label: string; group: string; icon: IconName; href?: string; external?: boolean; copy?: string; download?: string; keywords?: string }

/** Ctrl/⌘+K (or "/") command palette: jump to pages, download the CV, copy Discord, switch language. */
export function CommandPalette({ items, labels }: { items: PaletteItem[]; labels: { search: string; placeholder: string; empty: string; close: string; copied: string } }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const router = useRouter();
  const pathname = stripLang(usePathname());

  const results = useMemo(() => {
    const n = q.trim().toLowerCase();
    return n ? items.filter((i) => `${i.label} ${i.keywords ?? ''} ${i.group}`.toLowerCase().includes(n)) : items;
  }, [q, items]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement)?.tagName) || (e.target as HTMLElement)?.isContentEditable;
      if ((e.key === 'k' && (e.metaKey || e.ctrlKey)) || (e.key === '/' && !typing && !open)) { e.preventDefault(); setOpen((o) => !o); }
    };
    const onOpen = () => setOpen(true);
    document.addEventListener('keydown', onKey);
    window.addEventListener('nexify:search', onOpen);
    return () => { document.removeEventListener('keydown', onKey); window.removeEventListener('nexify:search', onOpen); };
  }, [open]);

  useEffect(() => {
    if (open) { lastFocus.current = document.activeElement as HTMLElement; setQ(''); setActive(0); setTimeout(() => inputRef.current?.focus(), 10); document.body.classList.add('menu-open'); }
    else { document.body.classList.remove('menu-open'); lastFocus.current?.focus?.(); }
  }, [open]);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { setActive(0); }, [q]);

  const run = async (i: PaletteItem) => {
    if (i.copy) { try { await navigator.clipboard.writeText(i.copy); } catch { /* ignore */ } const t = document.querySelector<HTMLElement>('[data-toast]'); if (t) { t.textContent = `${labels.copied}: ${i.copy}`; t.classList.add('is-visible'); setTimeout(() => t.classList.remove('is-visible'), 2400); } setOpen(false); return; }
    if (!i.href) return;
    setOpen(false);
    if (i.external || i.download || i.href.startsWith('/lang/') || i.href.startsWith('mailto:')) {
      const a = document.createElement('a');
      a.href = i.href.startsWith('/lang/') ? `${i.href}?next=${encodeURIComponent(pathname)}` : i.href;
      if (i.external) { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
      if (i.download) a.download = i.download;
      document.body.appendChild(a); a.click(); a.remove();
    } else router.push(i.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter' && results[active]) { e.preventDefault(); run(results[active]); }
  };

  let lastGroup = '';
  return (
    <AnimatePresence>
      {open ? (
        <m.div className="cmdk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <m.div className="cmdk__panel" role="dialog" aria-modal="true" aria-label={labels.search}
            initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -8, scale: 0.98 }} transition={{ duration: 0.2 }}>
            <div className="cmdk__bar">
              <Icon name="search" />
              <input ref={inputRef} autoFocus className="cmdk__input" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={onKeyDown}
                placeholder={labels.placeholder} aria-label={labels.search} role="combobox" aria-expanded="true" aria-controls="cmdk-list"
                aria-activedescendant={results[active] ? `cmdk-${results[active].id}` : undefined} autoComplete="off" spellCheck={false} />
              <button type="button" className="cmdk__esc" onClick={() => setOpen(false)} aria-label={labels.close}>Esc</button>
            </div>
            <ul className="cmdk__list" id="cmdk-list" role="listbox" aria-label={labels.search}>
              {results.length === 0 ? <li className="cmdk__empty">{labels.empty}</li> : results.map((i, idx) => {
                const head = i.group !== lastGroup ? (lastGroup = i.group) : null;
                return (
                  <li key={i.id} role="presentation">
                    {head ? <p className="cmdk__group" aria-hidden>{head}</p> : null}
                    <div id={`cmdk-${i.id}`} role="option" aria-selected={idx === active} className={`cmdk__item${idx === active ? ' is-active' : ''}`}
                      onMouseMove={() => setActive(idx)} onClick={() => run(i)}>
                      <span className="cmdk__icon" aria-hidden><Icon name={i.icon} /></span>
                      <span>{i.label}</span>
                      <Icon name={i.external ? 'external' : i.copy ? 'copy' : 'arrow'} className="cmdk__go" />
                    </div>
                  </li>
                );
              })}
            </ul>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}

/** Header button that opens the palette. */
export function SearchButton({ label }: { label: string }) {
  return (
    <button type="button" className="search-btn" onClick={() => window.dispatchEvent(new Event('nexify:search'))} aria-label={`${label} ⌘K`} aria-keyshortcuts="Control+K Meta+K">
      <Icon name="search" /><kbd aria-hidden>⌘K</kbd>
    </button>
  );
}
