// ==========================================
// WebSocket服务器示例
// 
// 如何运行:
// 1. 确保已安装Node.js
// 2. 在项目目录下运行: npm install ws
// 3. 启动服务器: node server.js
// 4. 服务器将在 localhost:8000 上监听
// ==========================================

const WebSocket = require('ws');

// 创建WebSocket服务器，监听8000端口
const wss = new WebSocket.Server({ port: 8005 });

console.log('WebSocket服务器已启动，监听端口8005');

wss.on('connection', function connection(ws) {
    console.log('客户端已连接');
    
    // 向客户端发送欢迎消息
    ws.send('欢迎连接到WebSocket服务器！');
    
    // 监听客户端消息
    ws.on('message', function incoming(message) {
        console.log('收到客户端消息:', message);
        
        // 回复客户端
        ws.send('服务器收到消息: ' + message);
    });
    
    // 监听连接关闭
    ws.on('close', function close() {
        console.log('客户端已断开连接');
    });
});

// 添加错误处理
wss.on('error', function error(err) {
    console.error('WebSocket服务器错误:', err);
});

console.log('请确保已运行 "npm install ws" 安装依赖');
console.log('访问 ws://localhost:8005 来连接服务器');