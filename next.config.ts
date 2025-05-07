import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      // bodySizeLimit: "1mb", // Set body size limit
      allowedOrigins: ["*"], // Allow all origins
      bodySizeLimit: "10mb",
    }, // Enable Server Actions
  },
  env: {
    SERVER_DOMAIN: process.env.SERVER_DOMAIN,
    AUTH_SECRET: process.env.AUTH_SECRET,
    IMGS_DOMAIN: process.env.IMGS_DOMAIN,
  },
  images: {
    domains: ['localhost', 'localhost:8000', '192.168.1.5'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
