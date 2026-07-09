/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === "1" || process.env.CF_PAGES === "1";

const nextConfig = {
  devIndicators: false,
  ...(isStaticExport
    ? {
        output: "export",
        images: {
          unoptimized: true,
        },
      }
    : {
        output: "standalone",
      }),
};

export default nextConfig;

if (!isStaticExport) {
  import("@opennextjs/cloudflare").then((m) => m.initOpenNextCloudflareForDev());
}
