const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  webpack: (config, { isServer }) => {
    // Ignore non-critical warnings
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      { module: /pino/ },
      { module: /viem/ },
      { module: /ox/ },
      { module: /wallet-adapter/ },
      (warning) => {
        if (warning.module?.includes('virtualMasterPool')) {
          return true;
        }
        if (warning.message?.includes('Critical dependency')) {
          return true;
        }
        return false;
      }
    ];

    // Handle optional dependencies
    config.externals = [
      ...(Array.isArray(config.externals) ? config.externals : [config.externals].filter(Boolean)),
      {
        'pino-pretty': 'commonjs pino-pretty',
        'sharp': 'commonjs sharp',
      },
    ];

    return config;
  },
};

module.exports = nextConfig;
