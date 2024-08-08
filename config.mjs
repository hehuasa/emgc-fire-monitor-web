const dev = process.env.NODE_ENV !== 'production';

const basePath = dev ? '' : process.env.NEXT_PUBLIC_ANALYTICS_BasePath;
const devHttpsPort = 9191;
export { basePath, devHttpsPort };
