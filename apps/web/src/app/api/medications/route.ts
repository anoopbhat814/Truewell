import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { medicationsCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/medications');
}

export async function POST(req: NextRequest) {
  return validated(req, medicationsCreateSchema, (body) => proxyJson(req, '/medications', { method: 'POST', body }));
}
