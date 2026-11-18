import { NextRequest } from 'next/server';
import { proxyJson, validated } from '@/lib/proxy';
import { pharmaciesPatchSchema } from '../schema';

type Ctx = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Ctx) {
  return proxyJson(req, `/pharmacies/${encodeURIComponent(params.id)}`);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  return validated(req, pharmaciesPatchSchema, (body) =>
    proxyJson(req, `/pharmacies/${encodeURIComponent(params.id)}`, { method: 'PATCH', body }),
  );
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  return proxyJson(req, `/pharmacies/${encodeURIComponent(params.id)}`, { method: 'DELETE' });
}
