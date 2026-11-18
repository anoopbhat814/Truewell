import { NextRequest } from 'next/server';
import { proxyJson, validated } from '@/lib/proxy';
import { patientsPatchSchema } from '../schema';

type Ctx = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Ctx) {
  return proxyJson(req, `/patients/${encodeURIComponent(params.id)}`);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  return validated(req, patientsPatchSchema, (body) =>
    proxyJson(req, `/patients/${encodeURIComponent(params.id)}`, { method: 'PATCH', body }),
  );
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  return proxyJson(req, `/patients/${encodeURIComponent(params.id)}`, { method: 'DELETE' });
}
