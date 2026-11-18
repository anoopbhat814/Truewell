import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { claimsCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/insurance/claims');
}

export async function POST(req: NextRequest) {
  return validated(req, claimsCreateSchema, (body) => proxyJson(req, '/insurance/claims', { method: 'POST', body }));
}
