import { NextResponse } from 'next/server';
import { DISCORD_USER_ID } from '@/lib/config';

export const revalidate = 30;

type LanyardResponse = {
  success: boolean;
  data?: { discord_status?: string; activities?: { type: number; name: string }[] };
};

/**
 * Proxies Nexify's own Discord presence from Lanyard (server-side, cached 30 s),
 * so visitors' browsers never contact a third party. Only the status and the
 * name of a game being played are returned.
 */
export async function GET() {
  const id = (process.env.DISCORD_USER_ID || DISCORD_USER_ID).trim();
  if (!/^\d{15,22}$/.test(id)) return NextResponse.json({ enabled: false });
  try {
    const res = await fetch(`https://api.lanyard.rest/v1/users/${id}`, { next: { revalidate: 30 }, signal: AbortSignal.timeout(5000) });
    const json = (await res.json()) as LanyardResponse;
    if (!res.ok || !json.success || !json.data) return NextResponse.json({ enabled: false });
    const status = ['online', 'idle', 'dnd', 'offline'].includes(json.data.discord_status ?? '') ? json.data.discord_status : 'offline';
    const game = json.data.activities?.find((a) => a.type === 0)?.name ?? null;
    return NextResponse.json({ enabled: true, status, game }, { headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60' } });
  } catch {
    return NextResponse.json({ enabled: false });
  }
}
