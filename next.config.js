/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'images.unsplash.com',
      'res.cloudinary.com',
      'via.placeholder.com',
      'images.pexels.com',
    ],
    unoptimized: false,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
    NEXT_PUBLIC_RAZORPAY_KEY: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_key',
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // PWA support
  webpack: (config, { isServer }) => {
    return config;
  },
  // Redirect old URLs
  async redirects() {
    return [
      {
        source: '/product/:slug',
        destination: '/shop/:slug',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
