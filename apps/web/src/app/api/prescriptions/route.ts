import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { prescriptionsCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/prescriptions');
}

export async function POST(req: NextRequest) {
  return validated(req, prescriptionsCreateSchema, (body) => proxyJson(req, '/prescriptions', { method: 'POST', body }));
}
