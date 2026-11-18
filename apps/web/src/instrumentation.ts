export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  const { env } = await import('./lib/env');
  // Fail fast at boot when required configuration is malformed, instead of on the first request.
  const config = env();
  console.info(JSON.stringify({ level: 'info', msg: 'web booted', api: new URL(config.TRUEWELL_API_URL).host }));
}
