export type Theme = 'dark' | 'light';
export const THEME_KEY = 'nexify_theme';
const COLORS: Record<Theme, string> = { dark: '#0a0b10', light: '#f6f4fb' };

/** Inline <head> script: applies a stored choice before first paint (no flash). Dark is the default. */
export const themeBootScript = `try{var t=localStorage.getItem('${THEME_KEY}');if(t==='light'){document.documentElement.dataset.theme='light';document.querySelector('meta[name=theme-color]')?.setAttribute('content','${COLORS.light}')}}catch(e){}`;

export const currentTheme = (): Theme => (document.documentElement.dataset.theme === 'light' ? 'light' : 'dark');

export function setTheme(t: Theme) {
  const root = document.documentElement;
  if (t === 'light') root.dataset.theme = 'light'; else delete root.dataset.theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', COLORS[t]);
  try { localStorage.setItem(THEME_KEY, t); } catch { /* private mode */ }
  window.dispatchEvent(new CustomEvent('nexify:theme', { detail: t }));
}

export const toggleTheme = () => setTheme(currentTheme() === 'light' ? 'dark' : 'light');
