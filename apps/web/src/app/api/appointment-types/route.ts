import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { appointmentTypesCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/appointment-types');
}

export async function POST(req: NextRequest) {
  return validated(req, appointmentTypesCreateSchema, (body) => proxyJson(req, '/appointment-types', { method: 'POST', body }));
}
