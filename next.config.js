const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable SWC minification (faster builds)
  swcMinify: true,
  
  // Security headers including CSP
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.walletconnect.com https://*.walletconnect.org",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://sa-api-server-1.replit.app https://*.walletconnect.com https://*.walletconnect.org https://relay.walletconnect.com https://relay.walletconnect.org wss://*.walletconnect.com wss://*.walletconnect.org wss://relay.walletconnect.com wss://relay.walletconnect.org https://verify.walletconnect.com https://verify.walletconnect.org https://api.coingecko.com https://*.infura.io https://*.alchemy.com wss://*.infura.io wss://*.alchemy.com https://rpc.walletconnect.com https://pulse.walletconnect.com https://explorer-api.walletconnect.com https://keys.walletconnect.com https://*.walletlink.org wss://*.walletlink.org https://www.walletlink.org wss://www.walletlink.org",
              "frame-src 'self' https://*.walletconnect.com https://*.walletconnect.org https://verify.walletconnect.com https://verify.walletconnect.org",
              "frame-ancestors 'self' https://*.replit.dev https://*.repl.co https://*.africapredicts.com https://africapredicts.com",
            ].join('; '),
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },
  
  // Reduce bundle size with tree-shaking optimizations
  experimental: {
    optimizePackageImports: [
      '@rainbow-me/rainbowkit',
      'viem',
      'zustand',
      'qrcode.react',
    ],
  },
  
  // Enable compression
  compress: true,
  
  // Strict output for smaller builds
  output: 'standalone',
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    // Minimize chunks
    config.optimization = {
      ...config.optimization,
      moduleIds: 'deterministic',
    };
    
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
