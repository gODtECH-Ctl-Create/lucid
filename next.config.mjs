/** @type {import('next').NextConfig} */
const isGitHubPages = process.env.GITHUB_PAGES === 'true'

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  ...(isGitHubPages
    ? {
        output: 'export',
        basePath: '/lucid',
        assetPrefix: '/lucid/',
        trailingSlash: true,
      }
    : {}),
}

export default nextConfig
