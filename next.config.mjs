const isStaticExport = process.env.STATIC_EXPORT === "1";
const customDomain = "icelandtaxioffers.is";

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
  ...(!isStaticExport
    ? {
        async redirects() {
          return [
            {
              source: "/:path*",
              has: [
                {
                  type: "host",
                  value: `www.${customDomain}`
                }
              ],
              destination: `https://${customDomain}/:path*`,
              permanent: true
            }
          ];
        }
      }
    : {}),
  ...(isStaticExport
    ? {
        output: "export",
        assetPrefix: "."
      }
    : {})
};

export default nextConfig;
