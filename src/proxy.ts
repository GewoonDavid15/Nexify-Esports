import { NextResponse, type NextRequest } from 'next/server';
import { DEFAULT_LANG, LANG_COOKIE, LANG_HEADER, isLang } from '@/lib/config';

const ONE_YEAR = 60 * 60 * 24 * 365;

/**
 * Pages are statically generated per language under /{lang}/…; visitors keep
 * clean URLs. This picks the language (?lang= > cookie > English) and rewrites
 * internally. Direct /{lang}/… URLs redirect to the clean URL.
 */
const INTERNAL = 'x-nexify-rewritten';

export function proxy(request: NextRequest) {
  const url = request.nextUrl;
  // Some hosts resolve the rewrite as a second request: let it through untouched.
  if (request.headers.get(INTERNAL) === '1') return NextResponse.next();
  const prefixed = url.pathname.match(/^\/(en|nl|pt)(\/.*)?$/);
  if (prefixed) {
    const target = url.clone();
    target.pathname = prefixed[2] || '/';
    target.searchParams.set('lang', prefixed[1]);
    return NextResponse.redirect(target, 308);
  }

  const qLang = url.searchParams.get('lang');
  const cookieLang = request.cookies.get(LANG_COOKIE)?.value;
  const lang = isLang(qLang) ? qLang : isLang(cookieLang) ? cookieLang : DEFAULT_LANG;

  const headers = new Headers(request.headers);
  headers.set(LANG_HEADER, lang);
  headers.set(INTERNAL, '1');
  // Clone nextUrl (not new URL()) so the rewrite always stays internal.
  const rewrite = url.clone();
  rewrite.pathname = `/${lang}${url.pathname === '/' ? '' : url.pathname}`;
  const response = NextResponse.rewrite(rewrite, { request: { headers } });
  response.headers.set('Vary', 'Cookie');
  if (isLang(qLang)) {
    response.cookies.set(LANG_COOKIE, qLang, { maxAge: ONE_YEAR, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' });
  }
  return response;
}

export const config = {
  matcher: ['/((?!api/|lang/|_next/|favicon|img/|cv/|media-kit/|og-image|robots.txt|sitemap.xml|.*\\.[a-z0-9]+$).*)'],
};
