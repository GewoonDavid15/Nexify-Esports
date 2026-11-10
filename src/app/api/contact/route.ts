import { NextResponse, type NextRequest } from 'next/server';
import { processContact } from '@/lib/contact/process';
import { isLang } from '@/lib/config';

/** JSON endpoint (same logic as the form's server action). */
export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin');
  if (origin && new URL(origin).host !== (req.headers.get('x-forwarded-host') || req.headers.get('host'))) {
    return NextResponse.json({ ok: false, error: 'rejected' }, { status: 403 });
  }
  const text = await req.text();
  if (text.length > 20_000) return NextResponse.json({ ok: false, error: 'rejected' }, { status: 413 });
  let body: Record<string, unknown> = {};
  try { body = JSON.parse(text); } catch { return NextResponse.json({ ok: false, error: 'rejected' }, { status: 400 }); }
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'unknown';
  const result = await processContact(body, { ip, lang: isLang(body.lang) ? body.lang : 'en' });
  const { status, ...payload } = result;
  return NextResponse.json(payload, { status, headers: { 'Cache-Control': 'no-store' } });
}

export async function GET() {
  const { isConfigured } = await import('@/lib/contact/mailer');
  return NextResponse.json({ configured: isConfigured() }, { headers: { 'Cache-Control': 'no-store' } });
}
