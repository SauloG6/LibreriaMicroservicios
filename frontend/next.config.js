/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  env: {
    NEXT_PUBLIC_AUTH_SERVICE_URL: process.env.NEXT_PUBLIC_AUTH_SERVICE_URL || 'http://localhost:3001',
    NEXT_PUBLIC_PRODUCT_SERVICE_URL: process.env.NEXT_PUBLIC_PRODUCT_SERVICE_URL || 'http://localhost:3002',
    NEXT_PUBLIC_INVOICE_SERVICE_URL: process.env.NEXT_PUBLIC_INVOICE_SERVICE_URL || 'http://localhost:3003',
    NEXT_PUBLIC_CHAT_SERVICE_URL: process.env.NEXT_PUBLIC_CHAT_SERVICE_URL || 'http://localhost:3004',
  },
  async rewrites() {
    return [
      {
        source: '/api/auth/:path*',
        destination: 'http://auth-service:3001/api/auth/:path*',
      },
      {
        source: '/api/products/:path*',
        destination: 'http://product-service:3002/api/products/:path*',
      },
      {
        source: '/api/invoices/:path*',
        destination: 'http://invoice-service:3003/api/invoices/:path*',
      },
      {
        source: '/api/chat/:path*',
        destination: 'http://chat-service:3004/api/chat/:path*',
      },
    ];
  },
}

module.exports = nextConfig
