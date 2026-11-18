import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { documentsCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/documents');
}

export async function POST(req: NextRequest) {
  return validated(req, documentsCreateSchema, (body) => proxyJson(req, '/documents', { method: 'POST', body }));
}
