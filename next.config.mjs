const isStaticExport = process.env.STATIC_EXPORT === "1";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_STATIC_EXPORT: isStaticExport ? "1" : "0"
  },
  images: {
    qualities: [82],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      }
    ],
    ...(isStaticExport ? { unoptimized: true } : {})
  },
  ...(isStaticExport
    ? {
        output: "export",
        assetPrefix: "."
      }
    : {})
};

export default nextConfig;
