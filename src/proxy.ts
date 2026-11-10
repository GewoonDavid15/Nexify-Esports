import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LANG, LANG_COOKIE, LANG_HEADER, PATH_HEADER, isLang } from '@/lib/config';

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Runs before every page: picks the language (?lang= > cookie > English),
 * exposes it + the path to server components via request headers, and sets a
 * per-request nonce Content-Security-Policy.
 */
export function proxy(request: NextRequest) {
  const qLang = request.nextUrl.searchParams.get('lang');
  const cookieLang = request.cookies.get(LANG_COOKIE)?.value;
  const lang = isLang(qLang) ? qLang : isLang(cookieLang) ? cookieLang : DEFAULT_LANG;

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const isDev = process.env.NODE_ENV === 'development';
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${isDev ? " 'unsafe-eval'" : ''}`,
    `style-src 'self' 'nonce-${nonce}'`,
    // Motion animates via inline style attributes.
    "style-src-attr 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    `connect-src 'self'${isDev ? ' ws:' : ''}`,
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
  ].join('; ');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(LANG_HEADER, lang);
  requestHeaders.set(PATH_HEADER, request.nextUrl.pathname);
  requestHeaders.set('x-nonce', nonce);
  requestHeaders.set('Content-Security-Policy', csp);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set('Content-Security-Policy', csp);
  response.headers.set('Vary', 'Cookie');
  if (isLang(qLang)) {
    response.cookies.set(LANG_COOKIE, qLang, { maxAge: ONE_YEAR, sameSite: 'lax', path: '/', secure: !isDev });
  }
  return response;
}

// Prefetches are matched too: they must render in the visitor's language.
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon|img/|cv/|og-image|robots.txt|sitemap.xml).*)'],
};
