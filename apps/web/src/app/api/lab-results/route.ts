import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { labResultsCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/lab-results');
}

export async function POST(req: NextRequest) {
  return validated(req, labResultsCreateSchema, (body) => proxyJson(req, '/lab-results', { method: 'POST', body }));
}
