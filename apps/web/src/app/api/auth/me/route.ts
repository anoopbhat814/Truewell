import { NextResponse } from 'next/server';
import { problem } from '@/lib/proxy';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = getSession();
  if (!session) return problem(401, 'unauthenticated', 'Sign in to continue');
  return NextResponse.json(session, { headers: { 'Cache-Control': 'no-store' } });
}
