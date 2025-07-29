const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    if (req.url === '/sse') {
        // 设置 SSE 所需响应头
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*'
        });

        // 发送重连时间设置
        res.write("retry: 5000\n\n");
        
        
        // 发送一些数据
        res.write("data: 初始连接建立\n\n");

        // 每秒发送当前时间数据
        const interval = setInterval(() => {
            const data = `data: ${new Date().toLocaleTimeString()}\n\n`;
            res.write(data);
        }, 1000);

        // 10秒后主动断开连接（用于测试 retry）
        setTimeout(() => {
            clearInterval(interval);
            res.end(); // 主动断开连接
        }, 10000);

        // 客户端断开连接时清理
        req.on('close', () => {
            clearInterval(interval);
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