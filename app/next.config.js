const webpack = require('webpack');
// Force restart: docs page fix
const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Force alias for privacycash to avoid resolution errors
    let privacyCashPath;
    try {
      privacyCashPath = path.dirname(require.resolve('privacycash/package.json'));
    } catch (e) {
      privacyCashPath = path.resolve(__dirname, 'node_modules/privacycash');
    }

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'privacycash': privacyCashPath,
      // '@lightprotocol/hasher.rs': path.resolve(__dirname, 'node_modules/@lightprotocol/hasher.rs')
      // WASM fix: Use top-level hasher to avoid nested resolution issues
      '@lightprotocol/hasher.rs': path.resolve(__dirname, 'node_modules/@lightprotocol/hasher.rs')
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
  // NOTE: Removed @solana/web3.js and @coral-xyz/anchor from transpilePackages to speed up build
  // They are usually pre-compiled enough for Next.js to handle without forced transpilation.
  transpilePackages: [
    "@alleyboss/ashborn-sdk",
  ],
  // Externalize Node.js-only packages that use import.meta.dirname
  // Externalize Node.js-only packages that use import.meta.dirname
  experimental: {
    serverComponentsExternalPackages: [
      "privacycash",
      "node-localstorage",
      "@lightprotocol/hasher.rs"
    ],
  },
  swcMinify: true, // Enable SWC minification for faster builds

  // Vercel Lead Engineer Optimization: Tree-shake icon libraries
  // Note: hugeicons-react removed due to non-standard snake_case file naming making transforms difficult
  modularizeImports: {
    'lucide-react': {
      transform: 'lucide-react/dist/esm/icons/{{member}}',
    }
  },
  // output: "standalone",
};

module.exports = nextConfig;
