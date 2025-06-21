/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: false,
  },
  distDir: '.next',
  generateBuildId: async () => {
    // Use a timestamp-based build ID for consistency
    return `build-${Date.now()}`
  },
}

export default nextConfig
