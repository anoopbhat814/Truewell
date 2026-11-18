import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { messagesCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/messages');
}

export async function POST(req: NextRequest) {
  return validated(req, messagesCreateSchema, (body) => proxyJson(req, '/messages', { method: 'POST', body }));
}
