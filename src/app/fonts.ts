import localFont from 'next/font/local';

// Self-hosted from npm (@fontsource-variable/*) — no requests to font services.
// next/font adds metric-matched fallbacks, so text doesn't shift while loading.
export const display = localFont({
  src: '../../node_modules/@fontsource-variable/unbounded/files/unbounded-latin-wght-normal.woff2',
  weight: '200 900', variable: '--font-display', display: 'swap',
});
export const body = localFont({
  src: '../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2',
  weight: '100 900', variable: '--font-body', display: 'swap',
});
export const mono = localFont({
  src: '../../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800', variable: '--font-mono', display: 'swap', preload: false,
});
