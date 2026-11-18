import { NextRequest } from 'next/server';
import { proxyJson } from '@/lib/proxy';

type Ctx = { params: { id: string } };

export async function POST(req: NextRequest, { params }: Ctx) {
  return proxyJson(req, `/prescriptions/${encodeURIComponent(params.id)}/cancel`, { method: 'POST' });
}
