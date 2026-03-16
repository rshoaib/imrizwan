import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    reactStrictMode: true,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**.supabase.co',
            },
            {
                protocol: 'https',
                hostname: '**.supabase.in',
            },
        ],
    },
    devIndicators: false,
    async redirects() {
        return [
            {
                source: '/blog/spfx-1-23-new-cli-replacing-yeoman-heft-migration-guide-2026',
                destination: '/blog/spfx-migrate-gulp-heft-webpack-2026',
                permanent: true,
            },
            {
                source: '/tag/:path*',
                destination: '/blog',
                permanent: true,
            },
        ]
    },
}

export default nextConfig
