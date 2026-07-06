/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // If you are pulling hostel images from Supabase storage, add this:
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
