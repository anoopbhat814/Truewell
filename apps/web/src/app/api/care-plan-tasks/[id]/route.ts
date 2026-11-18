import { NextRequest } from 'next/server';
import { proxyJson, validated } from '@/lib/proxy';
import { carePlanTasksPatchSchema } from '../schema';

type Ctx = { params: { id: string } };

export async function GET(req: NextRequest, { params }: Ctx) {
  return proxyJson(req, `/care-plan-tasks/${encodeURIComponent(params.id)}`);
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  return validated(req, carePlanTasksPatchSchema, (body) =>
    proxyJson(req, `/care-plan-tasks/${encodeURIComponent(params.id)}`, { method: 'PATCH', body }),
  );
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  return proxyJson(req, `/care-plan-tasks/${encodeURIComponent(params.id)}`, { method: 'DELETE' });
}
