import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { pharmaciesCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/pharmacies');
}

export async function POST(req: NextRequest) {
  return validated(req, pharmaciesCreateSchema, (body) => proxyJson(req, '/pharmacies', { method: 'POST', body }));
}
