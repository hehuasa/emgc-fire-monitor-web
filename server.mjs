import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { createProxyMiddleware } from 'http-proxy-middleware';
import dotenv from 'dotenv';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
dotenv.config({ path: dev ? '.env.local' : '.env.production' });

const handle = app.getRequestHandler();

const createProxyMiddlewareFun = ({ target, pathRewrite, req, res }) => {
  return createProxyMiddleware({
    target,
    pathRewrite,
    logger: console,
    changeOrigin: false,
  })(req, res, (result) => {
    if (result instanceof Error) {
      throw result;
    }
  });
};

const proxyObj = {
  [`${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/ms-gateway`]: {
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway,
    pathRewrite: {
      [`^${process.env.NEXT_PUBLIC_ANALYTICS_BasePath}/ms-gateway`]: '',
    },
  },
};
const needProxy = (pathname) => {
  const key = Object.keys(proxyObj).find((url) => pathname.includes(url));

  return key ? proxyObj[key] : false;
};

const middleProxy = (needProxy, req, res) => {
  // for (const element of object) {

  // }

  if (needProxy) {
    const { target, pathRewrite } = needProxy;
    createProxyMiddlewareFun({
      target,
      pathRewrite,
      req,
      res,
    });
  }
};
const server = createServer(async (req, res) => {
  const parsedUrl = parse(req.url, true);
  const { pathname } = parsedUrl;
  console.info('============pathname==============', pathname);
  console.info('============proxyObj==============', proxyObj);
  const proxy = needProxy(pathname);
  if (proxy) {
    middleProxy(proxy, req, res);
  } else {
    await handle(req, res, parsedUrl);
  }
});

app.prepare().then(() => {
  server.listen(port);

  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  );
});
