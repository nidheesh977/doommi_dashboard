const http = require('http');

module.exports = (req, res) => {
  const targetPath = req.url.startsWith('/api/') ? req.url.replace('/api/', '/api/dashboard/') : req.url;
  const options = {
    hostname: '13.201.93.238',
    port: 80,
    path: targetPath,
    method: req.method,
    headers: {
      ...req.headers,
      host: '13.201.93.238',
    },
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
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Failed to proxy request' });
  });

  if (req.method === 'POST' || req.method === 'PUT') {
    req.pipe(proxyReq, { end: true });
  } else {
    proxyReq.end();
  }
};