const webpack = require('webpack');
// Force restart: docs page fix
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Make privacycash optional - only resolve if it exists
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@lightprotocol/hasher.rs': path.resolve(__dirname, 'node_modules/@lightprotocol/hasher.rs')
    };

    // Mark privacycash as external for server-side
    if (isServer) {
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push('privacycash');
      }
    }

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
  // NOTE: Removed @solana/web3.js and @coral-xyz/anchor from transpilePackages to speed up build
  // They are usually pre-compiled enough for Next.js to handle without forced transpilation.
  transpilePackages: [
    "@alleyboss/ashborn-sdk",
  ],
  // Externalize Node.js-only packages that use import.meta.dirname
  // Externalize Node.js-only packages that use import.meta.dirname
  serverExternalPackages: [
    "privacycash",
    "node-localstorage",
    "@lightprotocol/hasher.rs"
  ],
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    }
  },
  // output: "standalone",
};

module.exports = nextConfig;
