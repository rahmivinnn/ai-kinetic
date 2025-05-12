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
  // Don't use trailing slash for cleaner URLs
  trailingSlash: false,
  // Image configuration
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com'],
  },
  // Enable rewrites for Vercel deployment
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
};

module.exports = nextConfig;
