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
    unoptimized: true,
  },
  // Output as a standalone build
  output: 'standalone',
  // Disable source maps in production
  productionBrowserSourceMaps: false,
  // Enable SWC minification
  swcMinify: true,
  // Disable rewrites as they're handled by Vercel config
  async rewrites() {
    return [];
  },
  // Add redirects for common paths
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
