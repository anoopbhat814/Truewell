import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { insurancePoliciesCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/insurance/policies');
}

export async function POST(req: NextRequest) {
  return validated(req, insurancePoliciesCreateSchema, (body) => proxyJson(req, '/insurance/policies', { method: 'POST', body }));
}
