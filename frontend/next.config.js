/** @type {import('next').NextConfig} */
const apiOrigin = process.env.API_ORIGIN || 'http://127.0.0.1:8000';

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        // Do not use /api — Next.js reserves it and returns 308 before the rewrite runs
        source: '/backend-api/:path*',
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;





