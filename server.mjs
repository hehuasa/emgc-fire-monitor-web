import { createServer as createHttpServer } from 'http';
import { createServer as createHttpsServer } from 'https';

import { readFileSync } from 'fs';

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import next from 'next';
import { parse } from 'url';

const dev = process.env.NODE_ENV !== 'production';
const hostname = '127.0.0.1';
const httpPort = 3008;
const httpsPort = 443;
const devHttpsPort = 9191;

const expressApp = express();
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port: dev ? httpsPort : httpPort });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  if (dev) {
    const httpsOptions = {
      key: readFileSync('./certs/cx_dev-key.pem'),
      cert: readFileSync('./certs/cx_dev.pem'),
    };
    createHttpsServer(httpsOptions, expressApp, async (req, res) => {
      try {
        // Be sure to pass `true` as the second argument to `url.parse`.
        // This tells it to parse the query portion of the URL.
        const parsedUrl = parse(req.url, true);
        // const { pathname, query } = parsedUrl
        console.log('启动');
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    }).listen(httpsPort, (err) => {
      if (err) throw err;
      console.log(`> Ready on https://127.0.0.1:${httpsPort}`);
    });

    createHttpsServer(httpsOptions, expressApp).listen(devHttpsPort, (err) => {
      if (err) throw err;
      console.log(`> Ready on https://127.0.0.1:${devHttpsPort}`);
    });
    createHttpServer(expressApp, async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);

        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    }).listen(httpPort, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://127.0.0.1:${httpPort}`);
    });
  } else {
    createHttpServer(expressApp, async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);

        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('internal server error');
      }
    }).listen(httpPort, (err) => {
      if (err) throw err;
      console.log(`> Ready on http://127.0.0.1:${httpPort}`);
    });
  }
});
// 反向代理

expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/ms-login',
  createProxyMiddleware({
    // target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_login,
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/ms-login',
    changeOrigin: true,
    // pathRewrite: {
    //   '^/ms-login': '',
    // },
  })
);
expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/ms-system',
  createProxyMiddleware({
    // target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_system,
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/ms-system',
    changeOrigin: true,
    // pathRewrite: {
    //   '^/ms-system': '',
    // },
  })
);
expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/device-manger',
  createProxyMiddleware({
    // target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_device,
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/device-manger',
    changeOrigin: true,
    // pathRewrite: {
    //   '^/device-manger': '',
    // },
  })
);
expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/cx-alarm',
  createProxyMiddleware({
    // target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_alarm,
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/cx-alarm',
    changeOrigin: true,
    // pathRewrite: {
    //   '^/cx-alarm': '',
    // },
  })
);
expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/video-server',
  createProxyMiddleware({
    // target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_video,
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/video-server',
    changeOrigin: true,
    // pathRewrite: {
    //   '^/video-server': '',
    // },
  })
);
expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/map-server',
  createProxyMiddleware({
    target: process.env.NEXT_PUBLIC_ANALYTICS_Map,
    // target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/map-server',
    changeOrigin: true,
    secure: false,
    // pathRewrite: {
    //   '^/map-server': '',
    // },
  })
);
expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/weNet-server',
  createProxyMiddleware({
    // target: process.env.NEXT_PUBLIC_ANALYTICS_WeNetUrl,
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/weNet-server',
    changeOrigin: true,
    ws: true,
    // pathRewrite: {
    //   '^/weNet-server': '',
    // },
    logger: console,
  })
);
expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/pt-message',
  createProxyMiddleware({
    // target: process.env.NEXT_PUBLIC_ANALYTICS_Pt_message,
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/pt-message',
    ws: true,
    changeOrigin: true,
    // pathRewrite: {
    //   '^/pt-message': '',
    // },
  })
);
expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/httpflv',
  createProxyMiddleware({
    target: process.env.NEXT_PUBLIC_ANALYTICS_HttpFlv,
    // target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/httpflv',
    // ws: true,
    changeOrigin: true,
    // pathRewrite: {
    //   '^/httpflv': '',
    // },
  })
);
expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/webrtcApi', //
  createProxyMiddleware({
    target: process.env.NEXT_PUBLIC_ANALYTICS_WebRtcApi,
    // ws: true,
    changeOrigin: true,
    // pathRewrite: {
    //   '^/webrtcApi': '',
    // },
  })
);
expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/phone-websocket', //
  createProxyMiddleware({
    target: 'http://192.168.0.49:8443/server',
    //target: 'http://192.168.0.210:9050/websocket',
    ws: true,
    changeOrigin: true,
    // pathRewrite: {
    //   '^/phone-websocket': '',
    // },
  })
);
expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/szk',
  createProxyMiddleware({
    // target: 'http://192.168.0.242:8001/ms-plan',
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/szk',
    // ws: true,
    changeOrigin: true,
    // pathRewrite: {
    //   '^/ms-plan': '',
    // },
  })
);
expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/ms-msg-push',
  createProxyMiddleware({
    // target: process.env.NEXT_PUBLIC_ANALYTICS_MsgPush,
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/ms-msg-push',
    // ws: true,
    changeOrigin: true,
    // pathRewrite: {
    //   '^/ms-msg-push': '',
    // },
  })
);
expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/ue-socket', //
  createProxyMiddleware({
    target: 'http://192.168.0.240/ue-socket/',
    //target: 'http://192.168.0.210:9050/websocket',
    ws: true,
    changeOrigin: true,
    secure: false,
    logger: console,
    // pathRewrite: {
    //   '^/ue-socket': '',
    // },
  })
);

expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/qs-dp',
  createProxyMiddleware({
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/qs-dp',
    ws: false,
    changeOrigin: true,
    secure: false,
    logger: console,
    // pathRewrite: {
    //   '^/qs-dp': '',
    // },
  })
);

expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/cx-scws',
  createProxyMiddleware({
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/cx-scws',
    ws: false,
    changeOrigin: true,
    secure: false,
    logger: console,
  })
);

expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/static',
  createProxyMiddleware({
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/static',
    changeOrigin: true,
  })
);

expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/cx-largescreen',
  createProxyMiddleware({
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/cx-largescreen',
    ws: false,
    changeOrigin: true,
    secure: false,
    logger: console,
  })
);

expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/ms-safety-sources',
  createProxyMiddleware({
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/ms-safety-sources',
    changeOrigin: true,
  })
);

expressApp.use(
  process.env.NEXT_PUBLIC_ANALYTICS_BasePath + '/ms-monitor-alarm',
  createProxyMiddleware({
    target: process.env.NEXT_PUBLIC_ANALYTICS_Ms_Gateway + '/ms-monitor-alarm',
    changeOrigin: true,
  })
);

expressApp.all('*', (req, res) => handle(req, res));
