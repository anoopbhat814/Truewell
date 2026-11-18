import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { notificationsCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/notifications');
}

export async function POST(req: NextRequest) {
  return validated(req, notificationsCreateSchema, (body) => proxyJson(req, '/notifications', { method: 'POST', body }));
}
