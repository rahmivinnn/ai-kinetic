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
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com'],
  },
  // Fix for Netlify deployment - ensure all routes work correctly
  trailingSlash: false,
  // Ensure all paths are properly handled
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
