/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export',
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;