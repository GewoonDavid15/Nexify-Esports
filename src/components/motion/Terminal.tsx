'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/** Types the status lines one by one; full text is server-rendered for SEO/no-JS. */
export function Terminal({ title, rows }: { title: string; rows: { key: string; value: string; ok?: boolean }[] }) {
  const reduce = useReducedMotion();
  const total = rows.reduce((n, r) => n + r.value.length + 2, 0);
  const [shown, setShown] = useState(total);
  useEffect(() => {
    if (reduce) return;
    setShown(0);
    const id = setInterval(() => setShown((n) => (n >= total ? (clearInterval(id), n) : n + 1)), 28);
    return () => clearInterval(id);
  }, [reduce, total]);

  let budget = shown;
  return (
    <figure className="term" data-spot="">
      <figcaption className="term__bar"><span className="term__dots" aria-hidden><i /><i /><i /></span>{title}</figcaption>
      <dl className="term__body">
        {rows.map((r) => {
          const full = `"${r.value}"`;
          const part = full.slice(0, Math.max(0, Math.min(full.length, budget)));
          budget -= full.length;
          return (
            <div key={r.key}>
              <dt>{r.key}</dt>
              <dd className={r.ok ? 'term__ok' : undefined}>
                <span className="sr-only">{full}</span>
                <span aria-hidden>{part}</span>
              </dd>
            </div>
          );
        })}
      </dl>
      <span className="term__caret" aria-hidden />
    </figure>
  );
}
