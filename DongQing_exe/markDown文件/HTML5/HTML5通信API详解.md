# HTML5 通信 API 详解

HTML5 引入了多种新的通信 API，极大地增强了 Web 应用程序的实时通信能力。这些 API 使得 Web 应用能够实现更复杂的交互，包括跨文档通信、服务器推送、实时数据传输等。本文将详细介绍 HTML5 中的主要通信技术。

## 目录
1. [跨文档消息传输 (Cross-document messaging)](#跨文档消息传输)
2. [WebSocket API](#websocket-api)
3. [Server-Sent Events](#server-sent-events)
4. [BroadcastChannel API](#broadcastchannel-api)
5. [总结](#总结)

## 跨文档消息传输

跨文档消息传输（Cross-document messaging）允许来自不同源的文档之间进行安全通信。这是 HTML5 中 `postMessage` API 的核心功能。

### 基本概念

在 HTML5 之前，由于同源策略（Same-Origin Policy）的限制，不同源的文档之间无法直接通信。HTML5 的 `postMessage` API 提供了一种安全的跨源通信方式。

### postMessage 方法

`postMessage` 方法允许一个窗口向另一个窗口发送消息：

```javascript
otherWindow.postMessage(message, targetOrigin, [transfer]);
```

参数说明：
- `message`: 要发送的数据，可以是字符串、对象等
- `targetOrigin`: 目标窗口的源（协议+主机+端口），用于安全检查
- `transfer` (可选): 一个可转移对象的序列，比如端口或缓冲区

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

### 安全注意事项

1. 始终验证 `message` 事件的 `origin` 属性
2. 避免使用 `'*'` 作为目标源，除非确实需要
3. 对接收到的数据进行验证和清理

## WebSocket API

WebSocket 提供了浏览器和服务器之间的全双工通信通道。与传统的 HTTP 请求不同，WebSocket 允许服务器主动向客户端推送数据。

### 基本概念

WebSocket 协议提供了一个持久的连接，使得客户端和服务器可以随时互相发送数据，而不需要像传统的 HTTP 请求那样每次都需要建立新连接。

### WebSocket 对象

创建 WebSocket 连接非常简单：

```javascript
const socket = new WebSocket('ws://localhost:8080');
```

WebSocket URL 使用 `ws://` 或 `wss://`（安全的 WebSocket）协议。

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
    </style>
</head>
<body>
    <h1>WebSocket 聊天室</h1>
    <div id="messages"></div>
    <input type="text" id="messageInput" placeholder="输入消息..." style="width: 300px;">
    <button onclick="sendMessage()">发送</button>
    <button onclick="connect()">重新连接</button>

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
                const data = JSON.parse(event.data);
                addMessage(`${data.user}: ${data.message}`, 'message');
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
            };
        }

        // 发送消息
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message && socket.readyState === WebSocket.OPEN) {
                const data = {
                    user: '用户',
                    message: message
                };
                socket.send(JSON.stringify(data));
                messageInput.value = '';
            }
        }

        // 添加消息到显示区域
        function addMessage(text, className) {
            const messageElement = document.createElement('div');
            messageElement.className = className;
            messageElement.textContent = text;
            messages.appendChild(messageElement);
            messages.scrollTop = messages.scrollHeight;
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

// 处理新的连接
wss.on('connection', function connection(ws) {
    // 将新客户端添加到集合中
    clients.add(ws);
    console.log('新的客户端连接');

    // 向所有客户端广播消息
    broadcast({
        user: '系统',
        message: '新用户加入聊天室'
    });

    // 处理收到的消息
    ws.on('message', function incoming(data) {
        console.log('收到消息:', data);
        
        try {
            const messageData = JSON.parse(data);
            // 广播消息给所有客户端
            broadcast(messageData);
        } catch (e) {
            console.error('解析消息错误:', e);
        }
    });

    // 处理连接关闭
    ws.on('close', function() {
        // 从客户端集合中移除
        clients.delete(ws);
        console.log('客户端断开连接');
        
        // 广播用户离开消息
        broadcast({
            user: '系统',
            message: '用户离开聊天室'
        });
    });

    // 处理错误
    ws.on('error', function(error) {
        console.error('WebSocket 错误:', error);
        clients.delete(ws);
    });
});

// 广播消息给所有客户端
function broadcast(data) {
    const message = JSON.stringify(data);
    clients.forEach(function(client) {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}
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

### EventSource 对象

创建 EventSource 对象非常简单：

```javascript
const eventSource = new EventSource('http://localhost:8080/events');
```

### EventSource 事件

EventSource 支持以下事件：

1. `open`: 连接建立时触发
2. `message`: 收到消息时触发
3. `error`: 发生错误时触发

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

### 完整示例

**客户端代码 (sse.html):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>Server-Sent Events 示例</title>
</head>
<body>
    <h1>Server-Sent Events 实时更新</h1>
    <div id="status">连接状态: 未连接</div>
    <div id="messages"></div>
    <button onclick="closeConnection()">关闭连接</button>

    <script>
        let eventSource;

        // 建立 SSE 连接
        function connect() {
            if (!!window.EventSource) {
                eventSource = new EventSource('http://localhost:8080/events');
                
                // 连接打开事件
                eventSource.onopen = function(event) {
                    document.getElementById('status').textContent = '连接状态: 已连接';
                    addMessage('SSE 连接已建立');
                };

                // 默认消息事件
                eventSource.onmessage = function(event) {
                    addMessage('收到消息: ' + event.data);
                };

                // 自定义事件
                eventSource.addEventListener('time', function(event) {
                    addMessage('服务器时间: ' + event.data);
                });

                // 错误事件
                eventSource.onerror = function(event) {
                    document.getElementById('status').textContent = '连接状态: 连接错误';
                    addMessage('连接发生错误');
                };
            } else {
                alert('你的浏览器不支持 Server-Sent Events');
            }
        }

        // 添加消息到显示区域
        function addMessage(text) {
            const messageElement = document.createElement('div');
            messageElement.textContent = new Date().toLocaleTimeString() + ' - ' + text;
            document.getElementById('messages').appendChild(messageElement);
        }

        // 关闭连接
        function closeConnection() {
            if (eventSource) {
                eventSource.close();
                document.getElementById('status').textContent = '连接状态: 已关闭';
                addMessage('连接已关闭');
            }
        }

        // 页面加载时连接
        window.onload = function() {
            connect();
        };
    </script>
</body>
</html>
```

**服务器端代码 (sse-server.js):**
```javascript
const http = require('http');
const fs = require('fs');
const url = require('url');

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
            'Access-Control-Allow-Origin': '*'
        });

        // 发送初始消息
        res.write('data: 连接已建立\n\n');

        // 定时发送时间更新
        const timer = setInterval(() => {
            const time = new Date().toISOString();
            res.write(`event: time\ndata: ${time}\n\n`);
        }, 1000);

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

        // 客户端断开连接时清理定时器
        req.on('close', () => {
            clearInterval(timer);
            clearInterval(messageTimer);
            console.log('SSE 连接已关闭');
        });
    } 
    // 处理静态文件请求
    else {
        // 提供 HTML 文件
        if (parsedUrl.pathname === '/' || parsedUrl.pathname === '/index.html') {
            fs.readFile('sse.html', (err, data) => {
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
```

### SSE 优势

1. 简单易用：基于 HTTP，使用简单
2. 自动重连：浏览器会自动尝试重新连接
3. 支持事件类型：可以发送不同类型的事件
4. 适用于单向实时更新场景

## BroadcastChannel API

BroadcastChannel API 允许同源的浏览器上下文之间进行通信，包括窗口、标签页、iframe 或 workers。

### 基本概念

BroadcastChannel API 提供了一种在同源上下文之间广播消息的简单方法。所有监听同一频道的上下文都会收到广播的消息。

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

### 完整示例

**第一个页面 (page1.html):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>广播页面 1</title>
</head>
<body>
    <h1>广播页面 1</h1>
    <input type="text" id="messageInput" placeholder="输入消息">
    <button onclick="sendMessage()">发送广播消息</button>
    <div id="messages"></div>

    <script>
        // 创建广播频道
        const channel = new BroadcastChannel('chat_room');
        const messageInput = document.getElementById('messageInput');
        const messages = document.getElementById('messages');

        // 发送消息
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message) {
                channel.postMessage({
                    user: '页面1',
                    message: message,
                    timestamp: new Date().toISOString()
                });
                messageInput.value = '';
            }
        }

        // 监听广播消息
        channel.onmessage = function(event) {
            const data = event.data;
            const messageElement = document.createElement('div');
            messageElement.innerHTML = 
                `<strong>${data.user}:</strong> ${data.message} <em>(${new Date(data.timestamp).toLocaleTimeString()})</em>`;
            messages.appendChild(messageElement);
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
        });
    </script>
</body>
</body>
</html>
```

**第二个页面 (page2.html):**
```html
<!DOCTYPE html>
<html>
<head>
    <title>广播页面 2</title>
</head>
<body>
    <h1>广播页面 2</h1>
    <input type="text" id="messageInput" placeholder="输入消息">
    <button onclick="sendMessage()">发送广播消息</button>
    <div id="messages"></div>

    <script>
        // 创建广播频道
        const channel = new BroadcastChannel('chat_room');
        const messageInput = document.getElementById('messageInput');
        const messages = document.getElementById('messages');

        // 发送消息
        function sendMessage() {
            const message = messageInput.value.trim();
            if (message) {
                channel.postMessage({
                    user: '页面2',
                    message: message,
                    timestamp: new Date().toISOString()
                });
                messageInput.value = '';
            }
        }

        // 监听广播消息
        channel.onmessage = function(event) {
            const data = event.data;
            const messageElement = document.createElement('div');
            messageElement.innerHTML = 
                `<strong>${data.user}:</strong> ${data.message} <em>(${new Date(data.timestamp).toLocaleTimeString()})</em>`;
            messages.appendChild(messageElement);
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
        });
    </script>
</body>
</html>
```

### 错误处理

BroadcastChannel 也支持错误处理：

```javascript
channel.onmessageerror = function(event) {
    console.error('消息接收错误:', event);
};
```

### 使用场景

1. 同步多个标签页的状态
2. 在页面间共享数据
3. 实现标签页间的协作功能

## 总结

HTML5 提供了多种通信 API，每种都有其特定的使用场景：

| API | 通信方向 | 主要用途 | 特点 |
|-----|---------|---------|------|
| 跨文档消息传输 | 双向 | 不同源文档间通信 | 安全的跨源通信 |
| WebSocket | 双向 | 实时双向通信 | 低延迟，高效率 |
| Server-Sent Events | 单向 | 服务器推送更新 | 简单，自动重连 |
| BroadcastChannel | 双向 | 同源上下文广播 | 同源页面间通信 |

选择合适的通信技术取决于你的具体需求：
- 需要跨源通信？使用 `postMessage`
- 需要实时双向通信？使用 WebSocket
- 只需要服务器推送？使用 Server-Sent Events
- 需要在同源上下文间广播？使用 BroadcastChannel

通过合理使用这些通信 API，可以构建功能强大、响应迅速的现代 Web 应用程序。