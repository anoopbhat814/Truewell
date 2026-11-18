import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { cliniciansCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/clinicians');
}

export async function POST(req: NextRequest) {
  return validated(req, cliniciansCreateSchema, (body) => proxyJson(req, '/clinicians', { method: 'POST', body }));
}
