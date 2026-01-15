const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        path: false, // Patched in index.js
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer/'),
        vm: require.resolve('vm-browserify'),
        "node:path": false,
        "node:fs": false,
        "node:crypto": require.resolve('crypto-browserify'),
      };
      config.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
          Buffer: ['buffer', 'Buffer'],
        })
      );
    }

    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };

    // Force privacycash to resolve from app's node_modules (fixes SDK transitive dependency issue)
    config.resolve.alias = {
      ...config.resolve.alias,
      'privacycash': require.resolve('privacycash'),
    };

    return config;
  },
  // Optimize for Solana web3.js
  transpilePackages: [
    "@solana/web3.js",
    "@coral-xyz/anchor",
    "privacycash",
    "@alleyboss/ashborn-sdk",
    "@lightprotocol/hasher.rs"
  ],
  // output: "standalone",
};

module.exports = nextConfig;
