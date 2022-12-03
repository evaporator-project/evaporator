const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://127.0.0.1:8080',
      changeOrigin: true,
      pathRewrite: { '/api': '/api' },
    })
  );
  app.use(
    '/config',
    createProxyMiddleware({
      target: 'http://10.5.153.1:8090',
      changeOrigin: true,
      pathRewrite: { '/config': '/api/config' },
    })
  );
  app.use(
    '/report',
    createProxyMiddleware({
      target: 'http://10.5.153.1:8090',
      changeOrigin: true,
      pathRewrite: { '/report': '/api/report' },
    })
  );
};
