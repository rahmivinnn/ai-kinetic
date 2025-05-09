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
  // Output as static site for Netlify
  output: 'export',
  // Don't use trailing slash for cleaner URLs
  trailingSlash: false,
  // Image configuration for static export
  images: {
    domains: ['images.unsplash.com', 'api.dicebear.com'],
    unoptimized: true,
  },
  // Disable rewrites for static export
  // async rewrites() {
  //   return [
  //     {
  //       source: '/:path*',
  //       destination: '/:path*',
  //     },
  //     {
  //       source: '/openpose-analyzer',
  //       destination: '/openpose-analyzer',
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
