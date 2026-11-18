import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { appointmentsCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/appointments');
}

export async function POST(req: NextRequest) {
  return validated(req, appointmentsCreateSchema, (body) => proxyJson(req, '/appointments', { method: 'POST', body }));
}
