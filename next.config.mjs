// const withTM = require('next-transpile-modules')(['echarts', 'zrender']);
// import ntm from 'next-transpile-modules';
// const withTM = ntm(['echarts', 'zrender']);
// const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
// import MonacoWebpackPlugin from 'monaco-editor-webpack-plugin';

const dev = process.env.NODE_ENV !== 'production';

console.log('notStandAlone', process.env.notStandAlone);

console.log('NEXT_PUBLIC_ANALYTICS_BasePath', process.env.NEXT_PUBLIC_ANALYTICS_BasePath);
console.log('NODE_ENV', process.env.NODE_ENV);

const proxy = {
	fallback: [
		{
			source: '/ms-login/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-login/:path*`,
		},
		{
			source: '/ms-system/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-system/:path*`,
		},
		{
			source: '/device-manger/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/device-manger/:path*`,
		},
		{
			source: '/cx-alarm/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-alarm/:path*`,
		},
		{
			source: '/video-server/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/video-server/:path*`,
		},
		{
			source: '/ms-msds/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-msds/:path*`,
		},
		{
			source: '/map-server/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Map}/:path*`,
		},
		{
			source: '/weNet-server/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_WeNetUrl}/:path*`,
		},
		{
			source: '/webrtcApi/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_WebRtcApi}/:path*`,
		},
		//
		{
			source: '/httpflv/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_HttpFlv}/:path*`,
		},
		// {
		//   source: '/httpflv3/:path*',
		//   destination: `${process.env.NEXT_PUBLIC_ANALYTICS_HttpFlv_Three}/:path*`,
		// },
		// {
		//   source: '/httpflv4/:path*',
		//   destination: `${process.env.NEXT_PUBLIC_ANALYTICS_HttpFlv_Four}/:path*`,
		// },
		// {
		//   source: '/httpflv5/:path*',
		//   destination: `${process.env.NEXT_PUBLIC_ANALYTICS_HttpFlv_Five}/:path*`,
		// },
		// {
		//   source: '/httpflv6/:path*',
		//   destination: `${process.env.NEXT_PUBLIC_ANALYTICS_HttpFlv_Six}/:path*`,
		// },
		{
			source: '/ms-plan/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-plan/:path*`,
		},
		{
			source: '/ms-msg-push/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-msg-push/:path*`,
		},
		{
			source: '/qs-dp/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/qs-dp/:path*`,
		},

		{
			source: '/cx-scws/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-scws/:path*`,
		},

		{
			source: '/static/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/static/:path*`,
		},
		{
			source: '/cx-largescreen/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/cx-largescreen/:path*`,
		},
		{
			source: '/strapi/:path*',
			destination: `http://192.168.0.240:1337/:path*`,
		},

		// {
		//   source: '/minio/:path*',
		//   destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Minio}/:path*`,
		// },
		{
			source: '/ms-safety-sources/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-safety-sources/:path*`,
		},
		{
			source: '/ms-monitor-alarm/:path*',
			destination: `${process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway}/ms-monitor-alarm/:path*`,
		},
	],
};
/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
	swcMinify: true,
	output: dev ? undefined : process.env.notStandAlone ? undefined : 'standalone',
	transpilePackages: ['echarts', 'zrender'],
	productionBrowserSourceMaps: true,
	basePath: process.env.NEXT_PUBLIC_ANALYTICS_BasePath,
	webpack: (config, op) => {
		if (!dev && !op.isServer && process.env.NEXT_PUBLIC_ANALYTICS_person !== 'zhanghao') {
			config.plugins.push;
			// new MonacoWebpackPlugin({
			//   languages: ['json'],
			//   filename: 'static/[name].worker.[contenthash].js',
			// })();
			//   new ForkTsCheckerWebpackPlugin()
		}
		config.module.rules.push({
			test: /\.node/,
			use: 'raw-loader',
		});
		return config;
	},
	experimental: {
		// appDir: true,
		proxyTimeout: 600 * 1000,
	},
	eslint: {
		// Warning: This allows production builds to successfully complete even if
		// your project has ESLint errors.
		ignoreDuringBuilds: true,
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	async redirects() {
		return [
			{
				source: '/emgc/largeScreen',
				destination: '/largeScreen',
				permanent: true,
			},
			{
				source: '/emgc/largeScreenCenter',
				destination: '/largeScreenCenter',
				permanent: true,
			},
		];
	},
	async rewrites() {
		return proxy;
	},
};

export default nextConfig;
