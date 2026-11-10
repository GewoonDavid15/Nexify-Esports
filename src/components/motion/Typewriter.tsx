'use client';

import { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

/**
 * Types and deletes a list of words in a loop. The first word is
 * server-rendered in full, so the heading is complete without JS.
 */
export function Typewriter({ words }: { words: string[] }) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const [text, setText] = useState(words[0]);
  const [phase, setPhase] = useState<'hold' | 'delete' | 'type'>('hold');

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const word = words[i];
    let t: ReturnType<typeof setTimeout>;
    if (phase === 'hold') t = setTimeout(() => setPhase('delete'), 2200);
    else if (phase === 'delete') {
      if (text.length === 0) { setI((n) => (n + 1) % words.length); setPhase('type'); }
      else t = setTimeout(() => setText(word.slice(0, text.length - 1)), 32);
    } else {
      const next = words[i];
      if (text === next) setPhase('hold');
      else t = setTimeout(() => setText(next.slice(0, text.length + 1)), 58);
    }
    return () => clearTimeout(t);
  }, [phase, text, i, words, reduce]);

  return (
    <span className="tw">
      <span className="sr-only">{words.join(', ')}</span>
      <span className="tw__text" aria-hidden="true">{text}</span>
      <span className="tw__caret" aria-hidden="true" />
    </span>
  );
}
