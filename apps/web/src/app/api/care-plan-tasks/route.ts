import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { carePlanTasksCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/care-plan-tasks');
}

export async function POST(req: NextRequest) {
  return validated(req, carePlanTasksCreateSchema, (body) => proxyJson(req, '/care-plan-tasks', { method: 'POST', body }));
}
