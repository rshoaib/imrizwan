import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
    // Explicitly enforce no trailing slashes for SEO
    trailingSlash: false,
    poweredByHeader: false,
    reactStrictMode: true,
    devIndicators: false,
    async redirects() {
        return [
            {
                source: '/blog/spfx-1-23-new-cli-replacing-yeoman-heft-migration-guide-2026',
                destination: '/blog/spfx-migrate-gulp-heft-webpack-2026',
                permanent: true,
            },
            {
                source: '/blog/sharepoint-column-formatting-json',
                destination: '/blog',
                permanent: true,
            },
            {
                source: '/me/drive/recent',
                destination: '/',
                permanent: true,
            },
            {
                source: '/blog/pnp-powershell-sharepoint-online-scripts-admin-guide-2026',
                destination: '/blog',
                permanent: true,
            },
            {
                source: '/blog/power-automate-expressions-cheat-sheet-2026',
                destination: '/blog',
                permanent: true,
            },
            {
                source: '/blog/sharepoint-online-csp-enforcement-spfx-developer-guide-2026',
                destination: '/blog',
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
