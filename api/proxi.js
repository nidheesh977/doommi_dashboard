// project_root/api/proxy.js
const http = require('http');

module.exports = (req, res) => {
  const options = {
    hostname: '13.201.93.238',
    port: 80,
    path: '/api/dashboard' + req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, {
      ...proxyRes.headers,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    res.status(500).json({ error: 'Failed to proxy request' });
  });

  req.pipe(proxyReq, { end: true });
};