{/* @type {import('next').NextConfig}
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['res.cloudinary.com'],
  },
};

module.exports = nextConfig;*/}

/** @type {import('next').NextConfig} */
const nextConfig = {
  //output: 'export',
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;