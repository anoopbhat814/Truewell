import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { remindersCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/reminders');
}

export async function POST(req: NextRequest) {
  return validated(req, remindersCreateSchema, (body) => proxyJson(req, '/reminders', { method: 'POST', body }));
}
