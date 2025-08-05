# HTML5 通信 API 详解

HTML5 引入了多种新的通信 API，极大地增强了 Web 应用程序的实时通信能力。这些 API 使得 Web 应用能够实现更复杂的交互，包括跨文档通信、服务器推送、实时数据传输等。本文将详细介绍 HTML5 中的主要通信技术。

## 目录
1. [跨文档消息传输 (Cross-document messaging)](#跨文档消息传输)
2. [WebSocket API](#websocket-api)
3. [Server-Sent Events](#server-sent-events)
4. [BroadcastChannel API](#broadcastchannel-api)
5. [高级通信模式](#高级通信模式)
6. [性能优化与最佳实践](#性能优化与最佳实践)
7. [安全性考虑](#安全性考虑)
8. [兼容性处理](#兼容性处理)
9. [总结](#总结)

## 跨文档消息传输

跨文档消息传输（Cross-document messaging）允许来自不同源的文档之间进行安全通信。这是 HTML5 中 `postMessage` API 的核心功能。

### 基本概念

在 HTML5 之前，由于同源策略（Same-Origin Policy）的限制，不同源的文档之间无法直接通信。HTML5 的 `postMessage` API 提供了一种安全的跨源通信方式。

同源策略是浏览器的重要安全机制，它限制了不同源之间的资源访问。源由协议、域名和端口组成，只有这三个部分都相同才被认为是同源。

### postMessage 方法

`postMessage` 方法允许一个窗口向另一个窗口发送消息：

```javascript
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

参数说明：
- `message`: 要发送的数据，可以是字符串、对象等
- `targetOrigin`: 目标窗口的源（协议+主机+端口），用于安全检查
- `transfer` (可选): 一个可转移对象的序列，比如端口或缓冲区

#### message 参数详解

[message] 参数可以是任何可以通过结构化克隆算法复制的数据类型，包括：
- 基本数据类型（字符串、数字、布尔值等）
- 数组和对象
- ArrayBuffer 和 ArrayBufferView
- ImageData、File、Blob 等

注意：函数、DOM 节点等无法通过 postMessage 传输。

#### targetOrigin 参数详解

targetOrigin 参数用于指定目标窗口的源，这是一个重要的安全机制：

- 使用具体的源（如 `'https://example.com'`）可以确保消息只发送到指定的源
- 使用 `'*'` 会将消息发送到任何源，但这会带来安全风险，应避免使用

#### transfer 参数详解

transfer 参数允许转移可转移对象的所有权，而不是复制它们。这对于传输大量数据特别有用：

```javascript
// 创建一个 ArrayBuffer
const buffer = new ArrayBuffer(1024);

// 将 buffer 转移到另一个窗口，原窗口将失去访问权限
otherWindow.postMessage(buffer, '*', [buffer]);
```

### message 事件

接收消息的窗口需要监听 `message` 事件来处理接收到的消息：

```javascript
window.addEventListener('message', function(event) {
    // 检查消息来源
    if (event.origin !== 'http://example.com') return;
    
    // 处理收到的消息
    console.log('收到消息:', event.data);
    
    // event.source 是发送消息的窗口引用
    // event.origin 是发送消息的源
    // event.data 是实际的消息内容
});
```

event 对象包含以下重要属性：
- `data`: 从其他窗口发送的数据
- `origin`: 发送消息的源（协议+主机+端口）
- `source`: 发送消息的窗口代理，可以用于回复消息
- `ports`: 与消息一起传输的 MessagePort 对象数组

### 完整示例

下面是一个父子窗口通信的完整示例：

**父窗口 (parent.html):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>父窗口</title>
</head>
<body>
    <h1>父窗口</h1>
    <iframe src="child.html" id="childFrame" width="500" height="300"></iframe>
    <br>
    <input type="text" id="messageInput" placeholder="输入要发送的消息">
    <button onclick="sendMessage()">发送消息到子窗口</button>
    <div id="messages"></div>

    <script>
        const childFrame = document.getElementById('childFrame');
        const messageInput = document.getElementById('messageInput');
        const messages = document.getElementById('messages');

        // 等待 iframe 加载完成
        childFrame.onload = function() {
            console.log('子窗口已加载');
        };

        // 发送消息到子窗口
        function sendMessage() {
            const message = messageInput.value;
            if (message) {
                // 向子窗口发送消息
                childFrame.contentWindow.postMessage({
                    type: 'message',
                    content: message,
                    timestamp: new Date().toISOString()
                }, '*'); // 在实际应用中应该指定具体的源
                
                messageInput.value = '';
            }
        }

        // 监听来自子窗口的消息
        window.addEventListener('message', function(event) {
            // 安全检查：验证消息来源
            // if (event.origin !== 'http://trusted-domain.com') return;
            
            const data = event.data;
            const messageElement = document.createElement('div');
            messageElement.innerHTML = `<strong>来自子窗口:</strong> ${data.content} <em>(${data.timestamp})</em>`;
            messages.appendChild(messageElement);
        });
    </script>
</body>
</html>
```

**子窗口 (child.html):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>子窗口</title>
</head>
<body>
    <h2>子窗口</h2>
    <input type="text" id="replyInput" placeholder="输入回复消息">
    <button onclick="sendReply()">回复父窗口</button>
    <div id="receivedMessages"></div>

    <script>
        const replyInput = document.getElementById('replyInput');
        const receivedMessages = document.getElementById('receivedMessages');

        // 监听来自父窗口的消息
        window.addEventListener('message', function(event) {
            // 安全检查：验证消息来源
            // if (event.origin !== 'http://parent-domain.com') return;
            
            const data = event.data;
            const messageElement = document.createElement('div');
            
            if (data.type === 'message') {
                messageElement.innerHTML = `<strong>收到消息:</strong> ${data.content} <em>(${data.timestamp})</em>`;
                receivedMessages.appendChild(messageElement);
            }
        });

        // 发送回复到父窗口
        function sendReply() {
            const reply = replyInput.value;
            if (reply) {
                // 向父窗口发送消息
                window.parent.postMessage({
                    type: 'reply',
                    content: reply,
                    timestamp: new Date().toISOString()
                }, '*'); // 在实际应用中应该指定具体的源
                
                replyInput.value = '';
            }
        }
    </script>
</body>
</html>
```

### 通道通信 (MessageChannel)

MessageChannel 提供了一种更高级的通信方式，允许创建一个直接的通信通道：

```javascript
// 创建消息通道
const channel = new MessageChannel();

// 在一个窗口中设置端口1
window.postMessage('hello', '*', [channel.port1]);

// 在另一个窗口中监听消息并设置端口2
window.addEventListener('message', function(event) {
    if (event.ports[0]) {
        const port = event.ports[0];
        port.onmessage = function(e) {
            console.log('通过通道收到消息:', e.data);
        };
        
        // 通过通道发送回复
        port.postMessage('reply through channel');
    }
});
```

### 安全注意事项

1. 始终验证 `message` 事件的 `origin` 属性
2. 避免使用 `'*'` 作为目标源，除非确实需要
3. 对接收到的数据进行验证和清理
4. 不要将敏感信息通过 postMessage 发送
5. 使用 CSP（内容安全策略）进一步限制通信

## WebSocket API

WebSocket 提供了浏览器和服务器之间的全双工通信通道。与传统的 HTTP 请求不同，WebSocket 允许服务器主动向客户端推送数据。

### 基本概念

WebSocket 协议提供了一个持久的连接，使得客户端和服务器可以随时互相发送数据，而不需要像传统的 HTTP 请求那样每次都需要建立新连接。

WebSocket 连接的生命周期：
1. 握手阶段：通过 HTTP 协议升级到 WebSocket 协议
2. 数据传输阶段：全双工通信
3. 连接关闭阶段：正常或异常关闭

### WebSocket 对象

创建 WebSocket 连接非常简单：

```javascript
const socket = new WebSocket('ws://localhost:8080');
```

WebSocket URL 使用 `ws://` 或 `wss://`（安全的 WebSocket）协议。

#### WebSocket 构造函数参数

```javascript
// 基本用法
const socket1 = new WebSocket('ws://localhost:8080');

// 带协议的用法
const socket2 = new WebSocket('ws://localhost:8080', 'chat');

// 带多个协议的用法
const socket3 = new WebSocket('ws://localhost:8080', ['chat', 'superchat']);
```

### WebSocket 状态

WebSocket 对象有以下几种状态：

- `CONNECTING` (0): 连接尚未建立
- `OPEN` (1): 连接已建立，可以通信
- `CLOSING` (2): 连接正在进行关闭
- `CLOSED` (3): 连接已经关闭或无法打开

可以通过 `readyState` 属性获取当前状态：

```javascript
if (socket.readyState === WebSocket.OPEN) {
    // 连接已建立
}
```

### WebSocket 事件

WebSocket 对象支持以下事件：

1. `open`: 连接建立时触发
2. `message`: 收到消息时触发
3. `error`: 发生错误时触发
4. `close`: 连接关闭时触发

#### open 事件

当 WebSocket 连接成功建立时触发：

```javascript
socket.onopen = function(event) {
    console.log('WebSocket 连接已建立');
    // 可以在这里发送初始消息
    socket.send('Hello Server!');
};
```

#### message 事件

当从服务器接收到数据时触发：

```javascript
socket.onmessage = function(event) {
    // event.data 包含接收到的数据
    console.log('收到消息:', event.data);
    
    // 根据数据类型处理
    if (typeof event.data === 'string') {
        // 文本数据
        console.log('文本消息:', event.data);
    } else if (event.data instanceof ArrayBuffer) {
        // 二进制数据
        console.log('二进制数据长度:', event.data.byteLength);
    } else if (event.data instanceof Blob) {
        // Blob 数据
        console.log('Blob 数据大小:', event.data.size);
    }
};
```

#### error 事件

当发生错误时触发：

```javascript
socket.onerror = function(error) {
    console.error('WebSocket 错误:', error);
};
```

#### close 事件

当连接关闭时触发：

```javascript
socket.onclose = function(event) {
    console.log('连接已关闭');
    console.log('关闭代码:', event.code);
    console.log('关闭原因:', event.reason);
    console.log('是否正常关闭:', event.wasClean);
};
```

### WebSocket 方法

#### send() 方法

用于向服务器发送数据：

```javascript
// 发送文本
socket.send('Hello Server!');

// 发送 JSON 数据
socket.send(JSON.stringify({type: 'message', content: 'Hello'}));

// 发送二进制数据
const buffer = new ArrayBuffer(128);
socket.send(buffer);

// 发送 Blob
const blob = new Blob(['Hello World'], {type: 'text/plain'});
socket.send(blob);
```

#### close() 方法

用于关闭连接：

```javascript
// 正常关闭
socket.close();

// 带状态码和原因的关闭
socket.close(1000, '正常关闭');
```

### 完整示例

下面是一个简单的聊天应用示例：

**客户端代码 (chat.html):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>WebSocket 聊天示例</title>
    <style>
        #messages {
            border: 1px solid #ccc;
            height: 300px;
            overflow-y: scroll;
            padding: 10px;
            margin-bottom: 10px;
        }
        .message {
            margin-bottom: 10px;
            padding: 5px;
            background-color: #f9f9f9;
        }
        .status {
            color: #888;
            font-style: italic;
        }
        .user-message {
            background-color: #e3f2fd;
            text-align: right;
        }
        .system-message {
            color: #666;
            font-style: italic;
        }
    </style>
</head>
<body>
    <h1>WebSocket 聊天室</h1>
    <div id="messages"></div>
    <input type="text" id="messageInput" placeholder="输入消息..." style="width: 300px;">
    <button onclick="sendMessage()">发送</button>
    <button onclick="connect()">重新连接</button>
    <button onclick="disconnect()">断开连接</button>

    <script>
        let socket;
        const messages = document.getElementById('messages');
        const messageInput = document.getElementById('messageInput');

        // 连接到 WebSocket 服务器
        function connect() {
            // 注意：这里使用的是本地地址，实际应用中需要替换为真实的服务器地址
            socket = new WebSocket('ws://localhost:8080');

            // 连接打开事件
            socket.onopen = function(event) {
                addMessage('已连接到服务器', 'status');
                console.log('WebSocket 连接已建立');
            };

            // 收到消息事件
            socket.onmessage = function(event) {
                try {
                    const data = JSON.parse(event.data);
                    if (data.type === 'message') {
                        addMessage(`${data.user}: ${data.message}`, 'message');
                    } else if (data.type === 'system') {
                        addMessage(data.message, 'system-message');
                    } else if (data.type === 'userList') {
                        // 处理用户列表更新
                        console.log('当前在线用户:', data.users);
                    }
                } catch (e) {
                    // 如果不是 JSON 格式，当作普通文本处理
                    addMessage(event.data, 'message');
                }
            };

            // 错误事件
            socket.onerror = function(error) {
                addMessage('连接发生错误', 'status');
                console.error('WebSocket 错误:', error);
            };

            // 连接关闭事件
            socket.onclose = function(event) {
                addMessage('连接已关闭', 'status');
                console.log('WebSocket 连接已关闭');
                console.log('关闭代码:', event.code);
                console.log('关闭原因:', event.reason);
                console.log('是否正常关闭:', event.wasClean);
            };
        }

        // 发送消息
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message && socket && socket.readyState === WebSocket.OPEN) {
                const data = {
                    type: 'message',
                    user: '用户',
                    message: message
                };
                socket.send(JSON.stringify(data));
                addMessage(`我: ${message}`, 'message user-message');
                messageInput.value = '';
            }
        }

        // 添加消息到显示区域
        function addMessage(text, className = '') {
            const messageElement = document.createElement('div');
            messageElement.className = className;
            messageElement.textContent = text;
            messages.appendChild(messageElement);
            messages.scrollTop = messages.scrollHeight;
        }

        // 断开连接
        function disconnect() {
            if (socket) {
                socket.close(1000, '用户主动断开连接');
            }
        }

        // 按回车键发送消息
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // 页面加载时连接服务器
        window.onload = function() {
            connect();
        };
    </script>
</body>
</html>
```

**服务器端代码 (server.js):**
```javascript
// 需要先安装 ws 模块: npm install ws
const WebSocket = require('ws');

// 创建 WebSocket 服务器，监听 8080 端口
const wss = new WebSocket.Server({ port: 8080 });

console.log('WebSocket 服务器运行在端口 8080');

// 存储所有连接的客户端
const clients = new Set();
let userCounter = 0;

// 处理新的连接
wss.on('connection', function connection(ws, req) {
    // 为新用户分配ID
    const userId = ++userCounter;
    const username = `用户${userId}`;
    
    // 将新客户端添加到集合中
    clients.add(ws);
    console.log(`新的客户端连接: ${username} (IP: ${req.socket.remoteAddress})`);
    
    // 向新用户发送欢迎消息
    ws.send(JSON.stringify({
        type: 'system',
        message: `欢迎 ${username} 加入聊天室!`
    }));

    // 向所有客户端广播用户加入消息
    broadcast({
        type: 'system',
        message: `${username} 加入了聊天室`
    }, ws); // 不发送给新用户自己

    // 向所有用户发送更新的用户列表
    sendUserList();

    // 处理收到的消息
    ws.on('message', function incoming(data) {
        console.log(`收到消息 from ${username}:`, data);
        
        try {
            const messageData = JSON.parse(data);
            
            if (messageData.type === 'message') {
                // 广播消息给所有客户端
                broadcast({
                    type: 'message',
                    user: username,
                    message: messageData.message
                });
            }
        } catch (e) {
            console.error('解析消息错误:', e);
            
            // 如果不是 JSON 格式，当作普通文本广播
            broadcast({
                type: 'message',
                user: username,
                message: data.toString()
            });
        }
    });

    // 处理连接关闭
    ws.on('close', function(code, reason) {
        // 从客户端集合中移除
        clients.delete(ws);
        console.log(`客户端 ${username} 断开连接 (代码: ${code}, 原因: ${reason})`);
        
        // 广播用户离开消息
        broadcast({
            type: 'system',
            message: `${username} 离开了聊天室`
        });
        
        // 更新用户列表
        sendUserList();
    });

    // 处理错误
    ws.on('error', function(error) {
        console.error('WebSocket 错误:', error);
        clients.delete(ws);
    });
});

// 广播消息给所有客户端（除了发送者）
function broadcast(data, exclude = null) {
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    clients.forEach(function(client) {
        if (client !== exclude && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

// 发送用户列表给所有客户端
function sendUserList() {
    const userList = Array.from(clients)
        .filter(client => client.readyState === WebSocket.OPEN)
        .map((client, index) => `用户${index + 1}`);
    
    broadcast({
        type: 'userList',
        users: userList
    });
}

// 定期清理无效连接
setInterval(() => {
    clients.forEach(client => {
        if (client.readyState === WebSocket.CLOSED) {
            clients.delete(client);
        }
    });
    sendUserList();
}, 30000); // 每30秒检查一次
```

### WebSocket 二进制数据传输

WebSocket 支持传输二进制数据，这对于传输文件、图像等非常有用：

```javascript
// 客户端发送二进制数据
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
// 绘制一些内容到 canvas
ctx.fillStyle = 'rgb(200,0,0)';
ctx.fillRect(10, 10, 55, 50);

// 将 canvas 内容转换为 Blob 并发送
canvas.toBlob(function(blob) {
    socket.send(blob);
});

// 客户端接收二进制数据
socket.onmessage = function(event) {
    if (event.data instanceof Blob) {
        // 处理接收到的图像数据
        const img = document.createElement('img');
        img.src = URL.createObjectURL(event.data);
        document.body.appendChild(img);
    }
};
```

### WebSocket 心跳机制

为了保持连接活跃并检测断开连接，可以实现心跳机制：

```javascript
let heartbeatInterval;

function startHeartbeat() {
    heartbeatInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'ping' }));
        }
    }, 30000); // 每30秒发送一次心跳
}

function stopHeartbeat() {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
    }
}

// 在连接建立时启动心跳
socket.onopen = function() {
    startHeartbeat();
};

// 在连接关闭时停止心跳
socket.onclose = function() {
    stopHeartbeat();
};
```

### WebSocket 优势

1. 双向通信：服务器可以主动推送数据到客户端
2. 低延迟：避免了 HTTP 请求的握手开销
3. 轻量级：头部开销小
4. 实时性：适用于实时应用，如聊天、游戏、实时数据展示等

## Server-Sent Events

Server-Sent Events (SSE) 是一种允许服务器向浏览器推送更新的技术。与 WebSocket 不同，SSE 是单向的（服务器到客户端），基于 HTTP 协议。

### 基本概念

SSE 允许服务器通过 HTTP 连接向客户端推送实时更新。客户端使用 EventSource API 接收这些更新。

SSE 相比 WebSocket 更简单，但功能也相对有限。它特别适合以下场景：
- 实时通知和提醒
- 股票价格更新
- 社交媒体更新
- 系统状态监控

### EventSource 对象

创建 EventSource 对象非常简单：

```javascript
const eventSource = new EventSource('http://localhost:8080/events');
```

#### EventSource 构造函数参数

```javascript
// 基本用法
const eventSource1 = new EventSource('/events');

// 带配置的用法
const eventSource2 = new EventSource('/events', {
    withCredentials: true // 是否携带凭据
});
```

### EventSource 状态

EventSource 对象有以下几种状态：

- `CONNECTING` (0): 连接中
- `OPEN` (1): 连接已建立
- `CLOSED` (2): 连接已关闭

可以通过 `readyState` 属性获取当前状态：

```javascript
if (eventSource.readyState === EventSource.OPEN) {
    console.log('SSE 连接已建立');
}
```

### EventSource 事件

EventSource 支持以下事件：

1. `open`: 连接建立时触发
2. `message`: 收到消息时触发
3. `error`: 发生错误时触发

#### open 事件

当 SSE 连接成功建立时触发：

```javascript
eventSource.onopen = function(event) {
    console.log('SSE 连接已建立');
};
```

#### message 事件

当从服务器接收到数据时触发：

```javascript
eventSource.onmessage = function(event) {
    console.log('收到消息:', event.data);
    console.log('事件类型:', event.type);
    console.log('事件ID:', event.lastEventId);
};
```

#### error 事件

当发生错误时触发：

```javascript
eventSource.onerror = function(event) {
    console.error('SSE 错误:', event);
    
    // 根据错误类型进行处理
    if (eventSource.readyState === EventSource.CONNECTING) {
        console.log('正在尝试重新连接...');
    }
};
```

### 服务器端格式

服务器需要以特定格式发送数据：

```
data: 这是消息内容\n\n
```

或者：

```
event: customEvent
data: 这是自定义事件的消息内容\n\n
```

#### 数据格式详解

SSE 数据格式由以下字段组成：
- `data`: 消息数据
- `event`: 事件类型（可选）
- `id`: 事件ID（可选）
- `retry`: 重新连接时间（毫秒，可选）

```javascript
// 单行数据
res.write('data: Hello\n\n');

// 多行数据
res.write('data: 第一行\n');
res.write('data: 第二行\n\n');

// 带事件类型
res.write('event: notification\ndata: 你有一条新消息\n\n');

// 带事件ID
res.write('id: 123\ndata: 带ID的消息\n\n');

// 设置重连时间
res.write('retry: 10000\ndata: 设置重连时间为10秒\n\n');
```

### 完整示例

**客户端代码 (sse.html):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Server-Sent Events 示例</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        #status {
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
        }
        .connected {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .disconnected {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        #messages {
            border: 1px solid #ddd;
            height: 400px;
            overflow-y: auto;
            padding: 10px;
            margin-bottom: 10px;
            background-color: #f8f9fa;
        }
        .message {
            padding: 8px;
            margin: 5px 0;
            border-radius: 4px;
            background-color: white;
            border-left: 4px solid #007bff;
        }
        .notification {
            border-left-color: #28a745;
        }
        .alert {
            border-left-color: #dc3545;
        }
        .time-update {
            border-left-color: #ffc107;
        }
        button {
            padding: 8px 16px;
            margin-right: 10px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .connect-btn {
            background-color: #28a745;
            color: white;
        }
        .disconnect-btn {
            background-color: #dc3545;
            color: white;
        }
    </style>
</head>
<body>
    <h1>Server-Sent Events 实时更新</h1>
    <div id="status" class="disconnected">连接状态: 未连接</div>
    <div>
        <button class="connect-btn" onclick="connect()">连接</button>
        <button class="disconnect-btn" onclick="closeConnection()">断开连接</button>
    </div>
    <div id="messages"></div>

    <script>
        let eventSource;

        // 建立 SSE 连接
        function connect() {
            if (!!window.EventSource) {
                eventSource = new EventSource('http://localhost:8080/events');
                
                // 连接打开事件
                eventSource.onopen = function(event) {
                    document.getElementById('status').textContent = '连接状态: 已连接';
                    document.getElementById('status').className = 'connected';
                    addMessage('SSE 连接已建立', 'message');
                };

                // 默认消息事件
                eventSource.onmessage = function(event) {
                    addMessage('收到消息: ' + event.data, 'message');
                };

                // 自定义事件
                eventSource.addEventListener('time', function(event) {
                    addMessage('服务器时间: ' + event.data, 'message time-update');
                });

                // 通知事件
                eventSource.addEventListener('notification', function(event) {
                    addMessage('通知: ' + event.data, 'message notification');
                });

                // 警报事件
                eventSource.addEventListener('alert', function(event) {
                    addMessage('警报: ' + event.data, 'message alert');
                });

                // 错误事件
                eventSource.onerror = function(event) {
                    if (eventSource.readyState === EventSource.CONNECTING) {
                        document.getElementById('status').textContent = '连接状态: 正在重新连接...';
                        document.getElementById('status').className = 'disconnected';
                        addMessage('正在尝试重新连接...', 'message');
                    } else {
                        document.getElementById('status').textContent = '连接状态: 连接错误';
                        document.getElementById('status').className = 'disconnected';
                        addMessage('连接发生错误', 'message');
                    }
                };
            } else {
                alert('你的浏览器不支持 Server-Sent Events');
            }
        }

        // 添加消息到显示区域
        function addMessage(text, className = 'message') {
            const messageElement = document.createElement('div');
            messageElement.className = className;
            messageElement.textContent = new Date().toLocaleTimeString() + ' - ' + text;
            document.getElementById('messages').appendChild(messageElement);
            document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
        }

        // 关闭连接
        function closeConnection() {
            if (eventSource) {
                eventSource.close();
                document.getElementById('status').textContent = '连接状态: 已关闭';
                document.getElementById('status').className = 'disconnected';
                addMessage('连接已关闭', 'message');
            }
        }

        // 页面加载时连接
        window.onload = function() {
            connect();
        };

        // 页面卸载时关闭连接
        window.addEventListener('beforeunload', function() {
            closeConnection();
        });
    </script>
</body>
</html>
```

**服务器端代码 (sse-server.js):**
```javascript
const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    
    // 处理 SSE 请求
    if (parsedUrl.pathname === '/events') {
        // 设置 SSE 相关的响应头
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'X-Accel-Buffering': 'no' // 禁用 nginx 缓冲
        });

        console.log('新的 SSE 连接');

        // 发送初始消息
        res.write('data: 连接已建立\n\n');

        // 发送带 ID 的消息示例
        res.write('id: 1\ndata: 这是带 ID 的第一条消息\n\n');

        // 定时发送时间更新
        const timeTimer = setInterval(() => {
            const time = new Date().toISOString();
            res.write(`event: time\ndata: ${time}\n\n`);
        }, 2000);

        // 定时发送通知
        const notificationTimer = setInterval(() => {
            const notifications = [
                '您有一条新邮件',
                '系统维护将在今晚进行',
                '新的功能已上线',
                '请检查您的账户安全设置'
            ];
            const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
            res.write(`event: notification\ndata: ${randomNotification}\n\n`);
        }, 8000);

        // 定时发送警报
        const alertTimer = setInterval(() => {
            const alerts = [
                'CPU 使用率超过 90%',
                '磁盘空间不足',
                '网络连接不稳定',
                '服务器响应时间过长'
            ];
            const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
            res.write(`event: alert\ndata: ${randomAlert}\n\n`);
        }, 15000);

        // 定时发送普通消息
        const messageTimer = setInterval(() => {
            const messages = [
                '欢迎使用 Server-Sent Events!',
                '这是实时推送的消息',
                '服务器正在运行中',
                '每5秒发送一次普通消息'
            ];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            res.write(`data: ${randomMessage}\n\n`);
        }, 5000);

        // 模拟发送重连指令
        setTimeout(() => {
            res.write('retry: 5000\n\n'); // 设置客户端重连时间为5秒
        }, 30000);

        // 客户端断开连接时清理定时器
        req.on('close', () => {
            clearInterval(timeTimer);
            clearInterval(notificationTimer);
            clearInterval(alertTimer);
            clearInterval(messageTimer);
            console.log('SSE 连接已关闭');
        });
    } 
    // 处理静态文件请求
    else {
        // 提供 HTML 文件
        if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
            fs.readFile(path.join(__dirname, 'sse.html'), (err, data) => {
                if (err) {
                    res.writeHead(404);
                    res.end('文件未找到');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404);
            res.end('页面未找到');
        }
    }
});

server.listen(8080, () => {
    console.log('服务器运行在 http://localhost:8080');
});

// 优雅关闭服务器
process.on('SIGINT', () => {
    console.log('\n正在关闭服务器...');
    server.close(() => {
        console.log('服务器已关闭');
        process.exit(0);
    });
});
```

### EventSource 与 WebSocket 对比

| 特性 | EventSource | WebSocket |
|------|-------------|-----------|
| 通信方向 | 单向（服务器到客户端） | 双向 |
| 协议 | HTTP | WebSocket |
| 二进制数据支持 | 不支持 | 支持 |
| 自动重连 | 支持 | 需要手动实现 |
| 浏览器兼容性 | 较好 | 较好 |
| 实现复杂度 | 简单 | 相对复杂 |
| 适用场景 | 服务器推送 | 实时双向通信 |

### SSE 优势

1. 简单易用：基于 HTTP，使用简单
2. 自动重连：浏览器会自动尝试重新连接
3. 支持事件类型：可以发送不同类型的事件
4. 适用于单向实时更新场景

## BroadcastChannel API

BroadcastChannel API 允许同源的浏览器上下文之间进行通信，包括窗口、标签页、iframe 或 workers。

### 基本概念

BroadcastChannel API 提供了一种在同源上下文之间广播消息的简单方法。所有监听同一频道的上下文都会收到广播的消息。

BroadcastChannel 特别适合以下场景：
- 同步多个标签页的状态
- 在页面间共享数据
- 实现标签页间的协作功能
- 通知其他标签页执行操作

### 使用方法

创建 BroadcastChannel 非常简单：

```javascript
// 创建频道
const channel = new BroadcastChannel('my_channel');

// 发送消息
channel.postMessage('Hello from another context!');

// 监听消息
channel.onmessage = function(event) {
    console.log('收到广播消息:', event.data);
};

// 关闭频道
channel.close();
```

#### BroadcastChannel 构造函数

```javascript
// 创建频道
const channel = new BroadcastChannel('channel_name');

// 频道名称可以是任何字符串
const channel1 = new BroadcastChannel('user_notifications');
const channel2 = new BroadcastChannel('data_sync');
```

### BroadcastChannel 事件

BroadcastChannel 支持以下事件：

1. `message`: 收到消息时触发
2. `messageerror`: 消息接收错误时触发

#### message 事件

当从其他上下文接收到消息时触发：

```javascript
channel.onmessage = function(event) {
    console.log('消息来源:', event.origin);
    console.log('消息数据:', event.data);
    console.log('时间戳:', event.timeStamp);
};

// 或者使用 addEventListener
channel.addEventListener('message', function(event) {
    // 处理消息
});
```

#### messageerror 事件

当消息接收发生错误时触发：

```javascript
channel.onmessageerror = function(event) {
    console.error('消息接收错误:', event);
};
```

### 完整示例

**第一个页面 (page1.html):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>广播页面 1</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .message-input {
            width: 70%;
            padding: 10px;
            margin-right: 10px;
        }
        .send-btn {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .message-list {
            border: 1px solid #ddd;
            height: 300px;
            overflow-y: auto;
            padding: 10px;
            margin-top: 20px;
            background-color: #f8f9fa;
        }
        .message-item {
            padding: 8px;
            margin: 5px 0;
            border-radius: 4px;
            background-color: white;
            border-left: 4px solid #007bff;
        }
        .self-message {
            border-left-color: #28a745;
            text-align: right;
        }
        .status {
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
            background-color: #d4edda;
            color: #155724;
        }
    </style>
</head>
<body>
    <h1>广播页面 1</h1>
    <div class="status" id="status">频道状态: 已连接</div>
    <div>
        <input type="text" id="messageInput" class="message-input" placeholder="输入消息">
        <button class="send-btn" onclick="sendMessage()">发送广播消息</button>
    </div>
    <div class="message-list" id="messages"></div>

    <script>
        // 创建广播频道
        const channel = new BroadcastChannel('chat_room');
        const messageInput = document.getElementById('messageInput');
        const messages = document.getElementById('messages');
        const status = document.getElementById('status');

        // 发送消息
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message) {
                const messageData = {
                    user: '页面1',
                    message: message,
                    timestamp: new Date().toISOString(),
                    id: Date.now()
                };
                
                // 广播消息
                channel.postMessage(messageData);
                
                // 显示自己的消息
                displayMessage(messageData, true);
                
                messageInput.value = '';
            }
        }

        // 显示消息
        function displayMessage(data, isSelf = false) {
            const messageElement = document.createElement('div');
            messageElement.className = 'message-item' + (isSelf ? ' self-message' : '');
            messageElement.innerHTML = 
                `<strong>${data.user}:</strong> ${data.message} <br>
                <small>${new Date(data.timestamp).toLocaleTimeString()}</small>`;
            messages.appendChild(messageElement);
            messages.scrollTop = messages.scrollHeight;
        }

        // 监听广播消息
        channel.onmessage = function(event) {
            const data = event.data;
            // 不显示自己发送的消息
            if (data.user !== '页面1') {
                displayMessage(data);
            }
        };

        // 监听回车键发送
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // 页面卸载时关闭频道
        window.addEventListener('beforeunload', function() {
            channel.close();
            status.textContent = '频道状态: 已关闭';
            status.style.backgroundColor = '#f8d7da';
            status.style.color = '#721c24';
        });

        // 错误处理
        channel.onmessageerror = function(event) {
            console.error('消息接收错误:', event);
            status.textContent = '频道状态: 接收消息错误';
            status.style.backgroundColor = '#fff3cd';
            status.style.color = '#856404';
        };
    </script>
</body>
</html>
```

**第二个页面 (page2.html):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>广播页面 2</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        .message-input {
            width: 70%;
            padding: 10px;
            margin-right: 10px;
        }
        .send-btn {
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        .message-list {
            border: 1px solid #ddd;
            height: 300px;
            overflow-y: auto;
            padding: 10px;
            margin-top: 20px;
            background-color: #f8f9fa;
        }
        .message-item {
            padding: 8px;
            margin: 5px 0;
            border-radius: 4px;
            background-color: white;
            border-left: 4px solid #28a745;
        }
        .self-message {
            border-left-color: #ffc107;
            text-align: right;
        }
        .status {
            padding: 10px;
            margin: 10px 0;
            border-radius: 4px;
            background-color: #d4edda;
            color: #155724;
        }
    </style>
</head>
<body>
    <h1>广播页面 2</h1>
    <div class="status" id="status">频道状态: 已连接</div>
    <div>
        <input type="text" id="messageInput" class="message-input" placeholder="输入消息">
        <button class="send-btn" onclick="sendMessage()">发送广播消息</button>
    </div>
    <div class="message-list" id="messages"></div>

    <script>
        // 创建广播频道
        const channel = new BroadcastChannel('chat_room');
        const messageInput = document.getElementById('messageInput');
        const messages = document.getElementById('messages');
        const status = document.getElementById('status');

        // 发送消息
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message) {
                const messageData = {
                    user: '页面2',
                    message: message,
                    timestamp: new Date().toISOString(),
                    id: Date.now()
                };
                
                // 广播消息
                channel.postMessage(messageData);
                
                // 显示自己的消息
                displayMessage(messageData, true);
                
                messageInput.value = '';
            }
        }

        // 显示消息
        function displayMessage(data, isSelf = false) {
            const messageElement = document.createElement('div');
            messageElement.className = 'message-item' + (isSelf ? ' self-message' : '');
            messageElement.innerHTML = 
                `<strong>${data.user}:</strong> ${data.message} <br>
                <small>${new Date(data.timestamp).toLocaleTimeString()}</small>`;
            messages.appendChild(messageElement);
            messages.scrollTop = messages.scrollHeight;
        }

        // 监听广播消息
        channel.onmessage = function(event) {
            const data = event.data;
            // 不显示自己发送的消息
            if (data.user !== '页面2') {
                displayMessage(data);
            }
        };

        // 监听回车键发送
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        // 页面卸载时关闭频道
        window.addEventListener('beforeunload', function() {
            channel.close();
            status.textContent = '频道状态: 已关闭';
            status.style.backgroundColor = '#f8d7da';
            status.style.color = '#721c24';
        });

        // 错误处理
        channel.onmessageerror = function(event) {
            console.error('消息接收错误:', event);
            status.textContent = '频道状态: 接收消息错误';
            status.style.backgroundColor = '#fff3cd';
            status.style.color = '#856404';
        };
    </script>
</body>
</html>
```

### BroadcastChannel 高级用法

#### 发送复杂数据

BroadcastChannel 可以发送复杂的数据结构：

```javascript
// 发送对象
channel.postMessage({
    type: 'user_action',
    action: 'click',
    element: '#submit-button',
    timestamp: Date.now()
});

// 发送数组
channel.postMessage([
    { id: 1, name: '项目1' },
    { id: 2, name: '项目2' }
]);

// 发送 Blob
const blob = new Blob(['重要数据'], { type: 'text/plain' });
channel.postMessage({
    type: 'file',
    data: blob,
    name: 'data.txt'
});
```

#### 多频道管理

可以同时使用多个频道：

```javascript
// 创建多个频道
const chatChannel = new BroadcastChannel('chat');
const notificationChannel = new BroadcastChannel('notifications');
const dataSyncChannel = new BroadcastChannel('data_sync');

// 分别处理不同频道的消息
chatChannel.onmessage = function(event) {
    // 处理聊天消息
};

notificationChannel.onmessage = function(event) {
    // 处理通知
};

dataSyncChannel.onmessage = function(event) {
    // 处理数据同步
};
```

### 使用场景

1. 同步多个标签页的状态
2. 在页面间共享数据
3. 实现标签页间的协作功能

## 高级通信模式

### 1. 组合使用多种通信技术

在实际应用中，往往需要组合使用多种通信技术：

```javascript
// 使用 BroadcastChannel 同步多个标签页状态
const stateChannel = new BroadcastChannel('app_state');

// 使用 WebSocket 进行实时通信
const socket = new WebSocket('ws://localhost:8080');

// 使用 postMessage 与 iframe 通信
const iframe = document.getElementById('myIframe');
iframe.contentWindow.postMessage({type: 'init'}, '*');

// 监听状态变化并广播
function updateAppState(newState) {
    // 更新本地状态
    localStorage.setItem('appState', JSON.stringify(newState));
    
    // 广播状态变化
    stateChannel.postMessage({
        type: 'state_update',
        state: newState
    });
    
    // 通过 WebSocket 发送到服务器
    socket.send(JSON.stringify({
        type: 'state_update',
        state: newState
    }));
}
```

### 2. 消息队列模式

实现消息队列以处理大量消息：

```javascript
class MessageQueue {
    constructor(channelName) {
        this.channel = new BroadcastChannel(channelName);
        this.queue = [];
        this.processing = false;
        this.setupListeners();
    }
    
    setupListeners() {
        this.channel.onmessage = (event) => {
            this.queue.push(event.data);
            this.processQueue();
        };
    }
    
    async processQueue() {
        if (this.processing || this.queue.length === 0) {
            return;
        }
        
        this.processing = true;
        
        while (this.queue.length > 0) {
            const message = this.queue.shift();
            try {
                await this.processMessage(message);
            } catch (error) {
                console.error('处理消息时出错:', error);
            }
        }
        
        this.processing = false;
    }
    
    async processMessage(message) {
        // 模拟处理时间
        await new Promise(resolve => setTimeout(resolve, 100));
        console.log('处理消息:', message);
    }
    
    send(message) {
        this.channel.postMessage(message);
    }
}

// 使用消息队列
const messageQueue = new MessageQueue('task_queue');
```

### 3. 重连机制

为各种通信技术实现重连机制：

```javascript
class RobustWebSocket {
    constructor(url, protocols, options = {}) {
        this.url = url;
        this.protocols = protocols;
        this.options = {
            reconnectInterval: 1000,
            maxReconnectInterval: 30000,
            reconnectDecay: 1.5,
            timeoutInterval: 2000,
            maxReconnectAttempts: null,
            ...options
        };
        
        this.reconnectAttempts = 0;
        this.connect();
    }
    
    connect() {
        this.ws = new WebSocket(this.url, this.protocols);
        
        this.ws.onopen = (event) => {
            this.onopen && this.onopen(event);
            this.reconnectAttempts = 0;
        };
        
        this.ws.onmessage = (event) => {
            this.onmessage && this.onmessage(event);
        };
        
        this.ws.onerror = (event) => {
            this.onerror && this.onerror(event);
        };
        
        this.ws.onclose = (event) => {
            this.onclose && this.onclose(event);
            
            // 检查是否应该重连
            if (!event.wasClean && this.shouldReconnect()) {
                const timeout = this.reconnectInterval();
                setTimeout(() => {
                    this.reconnectAttempts++;
                    this.connect();
                }, timeout);
            }
        };
    }
    
    shouldReconnect() {
        return this.options.maxReconnectAttempts === null || 
               this.reconnectAttempts < this.options.maxReconnectAttempts;
    }
    
    reconnectInterval() {
        return Math.min(
            this.options.maxReconnectInterval,
            this.options.reconnectInterval * Math.pow(this.options.reconnectDecay, this.reconnectAttempts)
        );
    }
    
    send(data) {
        this.ws.send(data);
    }
    
    close() {
        this.ws.close();
    }
}
```

## 性能优化与最佳实践

### 1. 消息批处理

对于高频消息，使用批处理减少通信开销：

```javascript
class MessageBatcher {
    constructor(sendFunction, batchSize = 10, interval = 100) {
        this.sendFunction = sendFunction;
        this.batchSize = batchSize;
        this.interval = interval;
        this.batch = [];
        this.timer = null;
    }
    
    add(message) {
        this.batch.push(message);
        
        if (this.batch.length >= this.batchSize) {
            this.flush();
        } else if (!this.timer) {
            this.timer = setTimeout(() => this.flush(), this.interval);
        }
    }
    
    flush() {
        if (this.batch.length > 0) {
            this.sendFunction(this.batch);
            this.batch = [];
        }
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }
}

// 使用示例
const socket = new WebSocket('ws://localhost:8080');
const batcher = new MessageBatcher((messages) => {
    socket.send(JSON.stringify({type: 'batch', messages}));
});

// 高频发送消息
setInterval(() => {
    batcher.add({timestamp: Date.now(), value: Math.random()});
}, 10);
```

### 2. 数据压缩

对于大量数据传输，考虑使用压缩：

```javascript
// 使用 CompressionStream API (现代浏览器)
async function compressData(data) {
    const stream = new CompressionStream('gzip');
    const writer = stream.writable.getWriter();
    const reader = stream.readable.getReader();
    
    writer.write(new TextEncoder().encode(JSON.stringify(data)));
    writer.close();
    
    const chunks = [];
    let done = false;
    while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
            chunks.push(value);
        }
    }
    
    return new Blob(chunks);
}

// 发送压缩数据
async function sendCompressedData(socket, data) {
    try {
        const compressed = await compressData(data);
        socket.send(compressed);
    } catch (error) {
        // 降级到未压缩数据
        socket.send(JSON.stringify(data));
    }
}
```

### 3. 连接池

对于多个 WebSocket 连接，使用连接池管理：

```javascript
class WebSocketPool {
    constructor(maxConnections = 5) {
        this.maxConnections = maxConnections;
        this.connections = [];
        this.available = [];
        this.pending = [];
    }
    
    async getConnection() {
        if (this.available.length > 0) {
            return this.available.pop();
        }
        
        if (this.connections.length < this.maxConnections) {
            const connection = await this.createConnection();
            this.connections.push(connection);
            return connection;
        }
        
        // 等待可用连接
        return new Promise((resolve) => {
            this.pending.push(resolve);
        });
    }
    
    releaseConnection(connection) {
        if (this.pending.length > 0) {
            const resolve = this.pending.shift();
            resolve(connection);
        } else {
            this.available.push(connection);
        }
    }
    
    async createConnection() {
        return new Promise((resolve) => {
            const socket = new WebSocket('ws://localhost:8080');
            socket.onopen = () => resolve(socket);
        });
    }
}
```

## 安全性考虑

### 1. WebSocket 安全

使用安全的 WebSocket (wss://)：

```javascript
// 不安全的方式
const insecureSocket = new WebSocket('ws://example.com');

// 安全的方式
const secureSocket = new WebSocket('wss://example.com');
```

### 2. 消息验证

验证接收到的消息：

```javascript
// 验证消息来源
window.addEventListener('message', function(event) {
    // 检查来源
    if (event.origin !== 'https://trusted-domain.com') {
        console.warn('不可信的消息来源:', event.origin);
        return;
    }
    
    // 验证消息格式
    if (!isValidMessage(event.data)) {
        console.warn('无效的消息格式');
        return;
    }
    
    // 处理消息
    processMessage(event.data);
});

function isValidMessage(data) {
    // 实现消息验证逻辑
    return typeof data === 'object' && 
           data.hasOwnProperty('type') && 
           data.hasOwnProperty('payload');
}
```

### 3. 认证和授权

实现认证机制：

```javascript
// WebSocket 认证示例
const socket = new WebSocket('wss://example.com');

socket.onopen = function() {
    // 发送认证令牌
    socket.send(JSON.stringify({
        type: 'authenticate',
        token: localStorage.getItem('authToken')
    }));
};

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'auth_required') {
        // 需要重新认证
        requestNewToken().then(token => {
            socket.send(JSON.stringify({
                type: 'authenticate',
                token: token
            }));
        });
    } else if (data.type === 'authenticated') {
        // 认证成功
        console.log('认证成功');
    } else {
        // 处理其他消息
        handleMessage(data);
    }
};
```

## 兼容性处理

### 1. 特性检测

检测浏览器支持情况：

```javascript
// 检测 WebSocket 支持
function supportsWebSocket() {
    return 'WebSocket' in window || 'MozWebSocket' in window;
}

// 检测 EventSource 支持
function supportsEventSource() {
    return 'EventSource' in window;
}

// 检测 BroadcastChannel 支持
function supportsBroadcastChannel() {
    return 'BroadcastChannel' in window;
}

// 检测 postMessage 支持
function supportsPostMessage() {
    return 'postMessage' in window;
}
```

### 2. 降级方案

为不支持的特性提供降级方案：

```javascript
class CommunicationManager {
    constructor() {
        this.method = this.detectBestMethod();
    }
    
    detectBestMethod() {
        if (supportsWebSocket()) {
            return 'websocket';
        } else if (supportsEventSource()) {
            return 'sse';
        } else {
            return 'polling';
        }
    }
    
    sendMessage(data) {
        switch (this.method) {
            case 'websocket':
                this.sendViaWebSocket(data);
                break;
            case 'sse':
                this.sendViaSSE(data);
                break;
            case 'polling':
                this.sendViaPolling(data);
                break;
        }
    }
    
    sendViaWebSocket(data) {
        // WebSocket 实现
    }
    
    sendViaSSE(data) {
        // SSE 实现（需要 HTTP 请求）
        fetch('/send-message', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
    
    sendViaPolling(data) {
        // 轮询实现
        fetch('/send-message', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }
}
```

## 总结

HTML5 提供了多种通信 API，每种都有其特定的使用场景：

| API | 通信方向 | 主要用途 | 特点 |
|-----|---------|---------|------|
| 跨文档消息传输 | 双向 | 不同源文档间通信 | 安全的跨源通信 |
| WebSocket | 双向 | 实时双向通信 | 低延迟，高效率 |
| Server-Sent Events | 单向 | 服务器推送更新 | 简单，自动重连 |
| BroadcastChannel | 双向 | 同源上下文广播 | 同源页面间通信 |

### 选择指南

选择合适的通信技术取决于你的具体需求：

1. **需要跨源通信？** 使用 `postMessage`
2. **需要实时双向通信？** 使用 WebSocket
3. **只需要服务器推送？** 使用 Server-Sent Events
4. **需要在同源上下文间广播？** 使用 BroadcastChannel

### 最佳实践

1. **安全性优先**：始终验证消息来源和内容
2. **错误处理**：实现完善的错误处理和重连机制
3. **性能优化**：使用批处理、压缩等技术优化性能
4. **兼容性考虑**：为不支持的浏览器提供降级方案
5. **资源管理**：及时关闭不需要的连接和频道

通过合理使用这些通信 API，可以构建功能强大、响应迅速的现代 Web 应用程序。