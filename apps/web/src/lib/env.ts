import { z } from 'zod';

const schema = z.object({
  TRUEWELL_API_URL: z.string().url().default('http://localhost:8000'),
  SESSION_COOKIE_NAME: z.string().default('tw_session'),
  REFRESH_COOKIE_NAME: z.string().default('tw_refresh'),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_NAME: z.string().default('Truewell'),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().default('support@truewell.example'),
});

export type Env = z.infer<typeof schema>;

let cached: Env | undefined;

export function env(): Env {
  cached ??= schema.parse(process.env);
  return cached;
}
