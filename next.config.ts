import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/sys-vehicles",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
