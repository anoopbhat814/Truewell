import { describe, expect, it } from 'vitest';
import { GET } from './route';

describe('/api/health', () => {
  it('reports ok with a timestamp', async () => {
    const body = await GET().json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('truewell-web');
    expect(Number.isNaN(Date.parse(body.time))).toBe(false);
  });
});
