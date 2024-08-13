import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/locales/i18n.ts');

const dev = process.env.NODE_ENV !== 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: dev ? undefined : process.env.notStandAlone ? undefined : 'standalone',
  transpilePackages: ['echarts', 'zrender'],
  productionBrowserSourceMaps: true,
  basePath: process.env.NEXT_PUBLIC_ANALYTICS_BasePath,
  webpack: (config, op) => {
    config.module.rules.push({
      test: /\.node/,
      use: 'raw-loader',
    });
    return config;
  },
  experimental: {
    cpus: process.env.isBuilding ? 1 : undefined,
    workerThreads: process.env.notStandAlone ? false : undefined,
    webpackBuildWorker: true,
    proxyTimeout: 600 * 1000,
  },
};

export default withNextIntl(nextConfig);
