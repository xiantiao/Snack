/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 确保 Vercel 可以正确部署
  output: "export",
  // 禁用服务器端渲染
  images: { unoptimized: true }
};

export default nextConfig;
