'use client';

import { useEffect, useState } from 'react';
import { currentTheme, toggleTheme, type Theme } from '@/lib/client/theme';
import { Icon } from '../ui/Icon';

/** Header switch between the dark (default) and light theme. */
export function ThemeToggle({ labels }: { labels: { toLight: string; toDark: string } }) {
  const [theme, setT] = useState<Theme>('dark');
  useEffect(() => {
    setT(currentTheme());
    const on = (e: Event) => setT((e as CustomEvent<Theme>).detail);
    window.addEventListener('nexify:theme', on);
    return () => window.removeEventListener('nexify:theme', on);
  }, []);
  const label = theme === 'light' ? labels.toDark : labels.toLight;
  return (
    <button type="button" className="theme-btn" onClick={toggleTheme} aria-label={label} title={label}>
      <Icon name={theme === 'light' ? 'moon' : 'sun'} />
    </button>
  );
}
