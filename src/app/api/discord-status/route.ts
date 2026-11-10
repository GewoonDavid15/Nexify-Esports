import { NextResponse } from 'next/server';
import { DISCORD_USER_ID } from '@/lib/config';

export const revalidate = 30;

type LanyardResponse = {
  success: boolean;
  data?: { discord_status?: string; activities?: { type: number; name: string; details?: string; state?: string }[] };
};

/**
 * Proxies Nexify's own Discord presence from Lanyard (server-side, cached 30 s),
 * so visitors' browsers never contact a third party. Only the status and the
 * game being played (name, plus Discord's detail/state lines) are returned.
 */
export async function GET() {
  const id = (process.env.DISCORD_USER_ID || DISCORD_USER_ID).trim();
  if (!/^\d{15,22}$/.test(id)) return NextResponse.json({ enabled: false });
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${id}`, { next: { revalidate: 30 }, signal: AbortSignal.timeout(5000) });
    const json = (await res.json()) as LanyardResponse;
    if (!res.ok || !json.success || !json.data) return NextResponse.json({ enabled: false });
    const status = ['online', 'idle', 'dnd', 'offline'].includes(json.data.discord_status ?? '') ? json.data.discord_status : 'offline';
    const act = json.data.activities?.find((a) => a.type === 0);
    const clip = (v?: string) => (v ? v.slice(0, 80) : null);
    return NextResponse.json({ enabled: true, status, game: clip(act?.name), details: clip(act?.details), state: clip(act?.state) }, { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } });
  } catch {
    return NextResponse.json({ enabled: false });
  }
}
