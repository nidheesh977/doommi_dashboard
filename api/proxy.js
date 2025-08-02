const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const url = `http://13.201.93.238${req.url}`;
  try {
    const response = await fetch(url, {
      method: req.method,
      headers: req.headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? req.body : undefined,
    });
    const data = await response.text();
    res.status(response.status).send(data);
  } catch (error) {
    res.status(500).send('Proxy error');
  }
};