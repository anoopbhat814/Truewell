import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

const r = (p: string) => fileURLToPath(new URL(p, import.meta.url));

export default defineConfig({
  plugins: [react()],
  test: { environment: 'jsdom', globals: false, include: ['src/**/*.test.{ts,tsx}'] },
  resolve: {
    alias: {
      '@': r('./src'),
      '@truewell/types': r('../../packages/types/src'),
      '@truewell/utils': r('../../packages/utils/src'),
      '@truewell/ui': r('../../packages/ui/src'),
      '@truewell/api-client': r('../../packages/api-client/src'),
    },
  },
});
