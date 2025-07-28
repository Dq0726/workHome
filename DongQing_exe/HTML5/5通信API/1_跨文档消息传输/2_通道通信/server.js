const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg'
};

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // 如果请求的是根路径，则默认返回 parent.html
  if (pathname === '/') {
    pathname = '/parent.html';
  }
  
  const filePath = path.join(__dirname, pathname);

  fs.exists(filePath, exists => {
    if (!exists) {
      res.writeHead(404);
      res.end('404 Not Found');
      return;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('500 Internal Server Error');
        return;
      }

      const extname = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[extname] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    });
  });
});

// 查找可用端口
function startServer(port) {
  server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
    console.log(`Open http://127.0.0.1:${port}/ to test the Channel Messaging API`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} is busy, trying ${port + 1}`);
      startServer(port + 1);
    }
  });
}

// 从3000端口开始尝试
startServer(3000);