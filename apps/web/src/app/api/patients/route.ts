import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { patientsCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/patients');
}

export async function POST(req: NextRequest) {
  return validated(req, patientsCreateSchema, (body) => proxyJson(req, '/patients', { method: 'POST', body }));
}
