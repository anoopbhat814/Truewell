import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { availabilitySlotsCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/availability');
}

export async function POST(req: NextRequest) {
  return validated(req, availabilitySlotsCreateSchema, (body) => proxyJson(req, '/availability', { method: 'POST', body }));
}
