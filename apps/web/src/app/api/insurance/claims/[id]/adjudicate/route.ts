import { NextRequest } from 'next/server';
import { z } from 'zod';
import { proxyJson, validated } from '@/lib/proxy';

const schema = z.object({ allowedCents: z.number().int().nonnegative(), denialCode: z.string().max(20).nullish() }).strict();

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return validated(req, schema, (body) =>
    proxyJson(req, `/insurance/claims/${encodeURIComponent(params.id)}/adjudicate`, { method: 'POST', body }),
  );
}
