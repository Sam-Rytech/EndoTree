/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com'],
  },
  env: {
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_BASE_SEPOLIA_RPC: 'https://sepolia.base.org',
    NEXT_PUBLIC_CHAIN_ID: '84532',
  },
}

export default nextConfig

