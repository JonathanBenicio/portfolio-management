import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    buildExcludes: [/middleware-manifest\.json$/],
})

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    // Enable automatic code splitting
    experimental: {
        optimizePackageImports: ['@mui/material', '@mui/icons-material', 'recharts'],
    },
    // Optimize images
    images: {
        formats: ['image/webp', 'image/avif'],
    },
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
}

export default withPWA(nextConfig)
