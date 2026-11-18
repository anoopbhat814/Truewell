import { NextRequest } from 'next/server';
import { z } from 'zod';
import { problem, proxyJson } from '@/lib/proxy';

const querySchema = z.object({
  clinicianId: z.string().min(1),
  day: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  minutes: z.coerce.number().int().min(5).max(120).default(20),
});

export async function GET(req: NextRequest) {
  const parsed = querySchema.safeParse(Object.fromEntries(req.nextUrl.searchParams));
  if (!parsed.success) return problem(422, 'validation_failed', 'Invalid query', { issues: parsed.error.flatten().fieldErrors });
  const query = new URLSearchParams({ clinicianId: parsed.data.clinicianId, day: parsed.data.day, minutes: String(parsed.data.minutes) });
  return proxyJson(req, '/scheduling/open-slots', { query });
}
