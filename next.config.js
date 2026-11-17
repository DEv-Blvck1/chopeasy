/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["three"],
  webpack: (config) => {
    // Disable webpack disk caching to prevent OneDrive file-locking (EBUSY/EPERM) conflicts on Windows
    config.cache = false;
    return config;
  },
};

module.exports = nextConfig;
