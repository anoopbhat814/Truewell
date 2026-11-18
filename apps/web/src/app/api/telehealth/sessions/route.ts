import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { telehealthSessionsCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/telehealth/sessions');
}

export async function POST(req: NextRequest) {
  return validated(req, telehealthSessionsCreateSchema, (body) => proxyJson(req, '/telehealth/sessions', { method: 'POST', body }));
}
