/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 确保 Vercel 可以正确部署
  output: 'standalone',
};

export default nextConfig; 