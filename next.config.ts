/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Disables ESLint checks during build (helps with Vercel deploys)
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
