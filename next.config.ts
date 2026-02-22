import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  images: {
    unoptimized: true,
  },
  // Setting an empty turbopack config to silence the error if needed, 
  // or just removing the webpack config entirely.
};

export default nextConfig;
