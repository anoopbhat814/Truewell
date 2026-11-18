import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { labOrdersCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/lab-orders');
}

export async function POST(req: NextRequest) {
  return validated(req, labOrdersCreateSchema, (body) => proxyJson(req, '/lab-orders', { method: 'POST', body }));
}
