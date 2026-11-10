import { NextResponse, type NextRequest } from 'next/server';
import { LANG_COOKIE, isLang } from '@/lib/config';

/** Same-site absolute paths only — rejects //evil.com and /\evil.com. */
const safeNext = (v: string | null) => (v && /^\/(?![/\\])[\w\-./?=&%#]*$/.test(v) ? v : '/');

export async function GET(req: NextRequest, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const res = new NextResponse(null, { status: 303, headers: { Location: safeNext(req.nextUrl.searchParams.get('next')), 'Cache-Control': 'no-store' } });
  if (isLang(code)) {
    res.cookies.set(LANG_COOKIE, code, { maxAge: 60 * 60 * 24 * 365, sameSite: 'lax', path: '/', secure: process.env.NODE_ENV === 'production' });
  }
  return res;
}
