/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has TypeScript errors.
    ignoreBuildErrors: true,
  },
  // Comment out static export for development preview
  // output: 'export',
  // Don't use trailing slash for cleaner URLs
  trailingSlash: false,
  // Image configuration
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com'],
    unoptimized: true,
  },
  // Enable CORS and allow iframe embedding
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
          { key: 'X-Frame-Options', value: 'ALLOWALL' }
        ],
      },
    ];
  },
  // Enable rewrites for development
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: '/:path*',
      },
      {
        source: '/openpose-analyzer',
        destination: '/openpose-analyzer',
      },
    ];
  },
  // Set the server to listen on all interfaces and use the correct port
  webpack: (config) => {
    return config;
  },
  // Development server configuration
  devServer: {
    port: 12000,
    host: '0.0.0.0',
    allowedHosts: ['*'],
  },
};

module.exports = nextConfig;
