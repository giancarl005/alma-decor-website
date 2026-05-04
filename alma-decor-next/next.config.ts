import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // Eliminat pentru a permite randarea dinamică (force-dynamic) pe serverul Node.js
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'https',
        hostname: 'almadecor.ro',
      },
    ],
  },
};

export default nextConfig;
