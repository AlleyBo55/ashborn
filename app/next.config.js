const webpack = require('webpack');
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Force alias for privacycash to avoid resolution errors
    config.resolve.alias = {
      ...config.resolve.alias,
      'privacycash': path.resolve(__dirname, 'node_modules/privacycash')
    };

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
