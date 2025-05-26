/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'raw.githubusercontent.com',
                pathname: '**',
            },
        ],
        unoptimized: true
    },
    // Enable static file serving from /public directory
    reactStrictMode: true,
    trailingSlash: true,
    // Configure static file handling
    async headers() {
        return [
            {
                source: '/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
    // Ensure static files are served correctly
    pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

export default nextConfig;
