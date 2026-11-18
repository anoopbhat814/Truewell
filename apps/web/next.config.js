/** @type {import('next').NextConfig} */
const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
];

module.exports = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['@truewell/types', '@truewell/utils', '@truewell/ui', '@truewell/api-client'],
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};
