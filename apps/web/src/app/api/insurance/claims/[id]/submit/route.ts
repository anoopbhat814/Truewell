import { NextRequest } from 'next/server';
import { proxyJson } from '@/lib/proxy';

type Ctx = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Ctx) {
  return proxyJson(req, `/insurance/claims/${encodeURIComponent(params.id)}/submit`, { method: 'POST' });
}
