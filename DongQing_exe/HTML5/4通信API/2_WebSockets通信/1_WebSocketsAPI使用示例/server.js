// ==========================================
// WebSocket服务器示例
// 
// 如何运行:
// 1. 确保已安装Node.js
// 2. 在项目目录下运行: npm install ws
// 3. 启动服务器: node server.js
// 4. 服务器将在 localhost:8005 上监听
// ==========================================

const WebSocket = require('ws');

// 创建WebSocket服务器，监听8005端口
const wss = new WebSocket.Server({ port: 8005 });

console.log('WebSocket服务器已启动，监听端口8005');

wss.on('connection', function connection(ws) {
    console.log('客户端已连接');
    
    // 向客户端发送欢迎消息
    ws.send(JSON.stringify({
        type: 'welcome',
        message: '欢迎连接到WebSocket服务器！',
        timestamp: new Date().toISOString()
    }));
    
    // 监听客户端消息
    ws.on('message', function incoming(message) {
        console.log('收到客户端消息:', message);
        
        try {
            // 尝试解析客户端发送的JSON数据
            const data = JSON.parse(message);
            
            // 检查是否是用户数据对象
            if (data.userName && data.userAge) {
                console.log('收到用户数据:', data);
                
                // 模拟数据库操作
                const result = processData(data);
                
                // 发送处理结果回客户端
                ws.send(JSON.stringify({
                    result: result.success,
                    time: new Date().toISOString(),
                    message: result.message
                }));
            } else {
                // 普通消息处理
                ws.send(JSON.stringify({
                    type: 'reply',
                    message: '服务器收到消息: ' + message,
                    timestamp: new Date().toISOString()
                }));
            }
        } catch(e) {
            // 如果不是JSON数据，按普通文本处理
            ws.send(JSON.stringify({
                type: 'reply',
                message: '服务器收到消息: ' + message,
                timestamp: new Date().toISOString()
            }));
        }
    });
    
    // 监听连接关闭
    ws.on('close', function close() {
        console.log('客户端已断开连接');
    });
});

// 模拟处理数据的函数
function processData(data) {
    console.log('处理数据:', data);
    
    // 模拟数据库操作
    let success = true;
    let message = '';
    
    // 根据数据库类型给出不同处理结果
    switch(data.DataType) {
        case 'SQLServer':
            message = '数据已成功插入到SQL Server数据库';
            break;
        case 'ORACLE':
            message = '数据已成功插入到ORACLE数据库';
            break;
        case 'MySQL':
            message = '数据已成功插入到MySQL数据库';
            break;
        default:
            message = '数据已处理';
    }
    
    // 模拟偶尔的失败情况
    if (Math.random() < 0.1) { // 10%概率失败
        success = false;
        message = '数据库操作失败';
    }
    
    return {
        success: success,
        message: message
    };
}

// 添加错误处理
wss.on('error', function error(err) {
    console.error('WebSocket服务器错误:', err);
});

console.log('请确保已运行 "npm install ws" 安装依赖');
console.log('访问 ws://localhost:8005 来连接服务器');