import { NextRequest } from 'next/server';
import { proxyJson, validated } from '@/lib/proxy';
import { prescriptionsPatchSchema } from '../schema';

type Ctx = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Ctx) {
  return proxyJson(req, `/prescriptions/${encodeURIComponent(params.id)}`);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  return validated(req, prescriptionsPatchSchema, (body) =>
    proxyJson(req, `/prescriptions/${encodeURIComponent(params.id)}`, { method: 'PATCH', body }),
  );
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  return proxyJson(req, `/prescriptions/${encodeURIComponent(params.id)}`, { method: 'DELETE' });
}
