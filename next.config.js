/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_WALLETCONNECT_ID: process.env.NEXT_PUBLIC_WALLETCONNECT_ID,
  },
};

if (!process.env.NEXT_PUBLIC_WALLETCONNECT_ID) {
  console.warn('Warning: NEXT_PUBLIC_WALLETCONNECT_ID is not set. Wallet connections may fail.');
}

module.exports = nextConfig;
