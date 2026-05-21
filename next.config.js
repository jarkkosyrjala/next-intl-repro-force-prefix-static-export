const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// When deploying to GitHub Pages at https://<user>.github.io/<repo>/, the app
// lives on a subpath. We pass the repo name in via NEXT_PUBLIC_BASE_PATH in CI.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath || undefined,
  images: {unoptimized: true},
  trailingSlash: true
};

module.exports = withNextIntl(nextConfig);
