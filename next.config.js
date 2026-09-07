/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
  async headers() {
    return [
      {
        // Apply these security headers to all routes across RongoStay
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY', // Blocks clickjacking via iframes
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff', // Prevents MIME-type sniffing
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin', // Protects referral paths
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()', // Restricts device hardware access
          },
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Content-Security-Policy',
            // Permits Next.js scripts, inline styles, Supabase API/Storage, and Sentry logging
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https: *.supabase.co; font-src 'self'; connect-src 'self' https://*.supabase.co https://*.sentry.io; frame-ancestors 'none';",
          },
        ],
      },
    ];
  },
};

// Injected content via Sentry wizard below
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = withSentryConfig(nextConfig, {
  // For all available options, see:
  // https://www.npmjs.com/package/@sentry/webpack-plugin#options

  org: "rongostay",
  project: "javascript-nextjs",

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  webpack: {
    // Enables automatic instrumentation of Vercel Cron Monitors
    automaticVercelMonitors: true,

    // Tree-shaking options for reducing bundle size
    treeshake: {
      removeDebugLogging: true,
    },
  },
});