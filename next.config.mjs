/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true }, // 先上线再慢慢收紧
  typescript: { ignoreBuildErrors: false },
  poweredByHeader: false,
  compress: true, // 开启 gzip
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" } // 若图片托管在外部域名
    ],
  },
  // 若需要：导出 headers 提升缓存
  async headers() {
    return [
      {
        source: "/(.*)\\.(?:js|css|svg|png|jpg|jpeg|gif|webp|avif|woff2?)$",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
  // ISR 已在页面 getStaticProps 的 revalidate 中生效
};

export default nextConfig;
