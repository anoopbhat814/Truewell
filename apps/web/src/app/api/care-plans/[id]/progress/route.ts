import { NextRequest } from 'next/server';
import { proxyJson } from '@/lib/proxy';

type Ctx = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Ctx) {
  return proxyJson(req, `/care-plans/${encodeURIComponent(params.id)}/progress`, { method: 'GET' });
}
