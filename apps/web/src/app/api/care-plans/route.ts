import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { carePlansCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/care-plans');
}

export async function POST(req: NextRequest) {
  return validated(req, carePlansCreateSchema, (body) => proxyJson(req, '/care-plans', { method: 'POST', body }));
}
