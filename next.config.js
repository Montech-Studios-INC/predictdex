/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_WALLETCONNECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
  },
};

if (process.env.NODE_ENV === 'production' && process.env.npm_lifecycle_event === 'build') {
  if (!process.env.NEXT_PUBLIC_WALLETCONNECT_ID) {
    throw new Error('Build Error: NEXT_PUBLIC_WALLETCONNECT_ID is required for production builds.');
  }
}

module.exports = nextConfig;
