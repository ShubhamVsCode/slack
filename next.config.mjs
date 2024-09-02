/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "brave-blackbird-391.convex.cloud",
      },
    ],
  },
};

export default nextConfig;
