const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    let filePath = '.' + req.url;
    
    // 如果请求的是根路径，则默认返回第一个页面
    if (filePath === './') {
        filePath = './1_BroadcastChannelAPI的基本概念.html';
    }
    
    // 如果路径不包含文件扩展名，则添加.html扩展名
    if (!path.extname(filePath)) {
        filePath += '.html';
    }
    
    // 映射文件路径
    if (filePath === './1.html') {
        filePath = './1_BroadcastChannelAPI的基本概念.html';
    } else if (filePath === './2.html') {
        filePath = './2.html';
    }
    
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if (err.code === 'ENOENT') {
                // 文件未找到
                res.writeHead(404);
                res.end('404 Not Found');
            } else {
                // 其他服务器错误
                res.writeHead(500);
                res.end('Server Error: ' + err.code);
            }
        } else {
            // 成功读取文件
            const extname = path.extname(filePath);
            let contentType = 'text/html';
            
            if (extname === '.js') {
                contentType = 'text/javascript';
            } else if (extname === '.css') {
                contentType = 'text/css';
            }
            
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`服务器运行在 http://localhost:${PORT}`);
    console.log(`页面1访问: http://localhost:${PORT}/1.html`);
    console.log(`页面2访问: http://localhost:${PORT}/2.html`);
});