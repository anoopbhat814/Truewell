import { NextRequest } from 'next/server';
import { proxyJson, proxyList, validated } from '@/lib/proxy';
import { messageThreadsCreateSchema } from './schema';

export async function GET(req: NextRequest) {
  return proxyList(req, '/message-threads');
}

export async function POST(req: NextRequest) {
  return validated(req, messageThreadsCreateSchema, (body) => proxyJson(req, '/message-threads', { method: 'POST', body }));
}
