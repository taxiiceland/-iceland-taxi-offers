/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: process.env.STATIC_EXPORT === "1" ? "1" : "0"
  },
  ...(process.env.STATIC_EXPORT === "1"
    ? {
        output: "export",
        assetPrefix: ".",
        images: {
          unoptimized: true
        }
      }
    : {})
};

export default nextConfig;
