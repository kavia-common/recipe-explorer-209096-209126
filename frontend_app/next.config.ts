import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export to keep deployment simple and portable
  output: "export",
  images: {
    // Using local images initially; when switching to remote images uncomment
    // and configure allowed remote domains/patterns:
    // remotePatterns: [
    //   { protocol: "https", hostname: "images.example.com" },
    // ],
    unoptimized: true, // ensure compatibility with static export
  },
};

export default nextConfig;
