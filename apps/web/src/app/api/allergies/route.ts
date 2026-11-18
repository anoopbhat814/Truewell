import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { allergiesCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/allergies');
}

export async function POST(req: NextRequest) {
  return validated(req, allergiesCreateSchema, (body) => proxyJson(req, '/allergies', { method: 'POST', body }));
}
