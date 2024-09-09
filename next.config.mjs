import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/locales/i18n.ts');

const dev = process.env.NODE_ENV !== 'production';

// const proxy = {
//   fallback: [
//     {
//       source: '/ms-login/:path*',
//       destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-login/:path*`,
//     },
//     {
//       source: '/ms-system/:path*',
//       destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-system/:path*`,
//     },
//     {
//       source: '/device-manger/:path*',
//       destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/device-manger/:path*`,
//     },
//     {
//       source: '/cx-alarm/:path*',
//       destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-alarm/:path*`,
//     },
//     {
//       source: '/ms-gateway/video-server/:path*',
//       destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-gateway/video-server/:path*`,
//     },
//     {
//       source: '/ms-msds/:path*',
//       destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-msds/:path*`,
//     },
//   ],
// };
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: dev ? undefined : process.env.notStandAlone ? undefined : 'standalone',
  transpilePackages: ['echarts', 'zrender'],
  productionBrowserSourceMaps: true,
  basePath: process.env.NEXT_PUBLIC_ANALYTICS_BasePath,
  async rewrites() {
    return [
      {
        source: '/strapi/:path*',
        destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Strapi_Server}/:path*`,
      },
      {
        source: '/ms-gateway/:path*',
        destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/:path*`,
      },
    ];
  },
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
