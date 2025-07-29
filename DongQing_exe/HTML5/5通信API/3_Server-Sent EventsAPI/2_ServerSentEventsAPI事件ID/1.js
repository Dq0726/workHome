const http = require('http');

let eventId = 0; // 事件ID初始值

const server = http.createServer((req, res) => {
    if (req.url === '/sse') {
        // 设置 SSE 所需响应头
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });

        // 发送事件ID和一些数据
        setInterval(() => {
            eventId++;
            res.write(`id:${eventId}\n`); // 指定事件ID
            res.write(`data: ${new Date().toLocaleTimeString()}\n\n`); // 发送数据
            res.flushHeaders(); // 立即发送数据
        }, 1000);

        // 客户端断开连接时清理
        req.on('close', () => {
            console.log('连接已断开');
        });
    } else if (req.url === '/') {
        // 根路径返回 HTML 页面
        fs.readFile('./1.html', (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(3000, () => {
    console.log('Server listening on port 3000');
    console.log('Open http://localhost:3000 to test Server-Sent Events');
});