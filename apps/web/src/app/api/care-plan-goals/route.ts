import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { carePlanGoalsCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/care-plan-goals');
}

export async function POST(req: NextRequest) {
  return validated(req, carePlanGoalsCreateSchema, (body) => proxyJson(req, '/care-plan-goals', { method: 'POST', body }));
}
