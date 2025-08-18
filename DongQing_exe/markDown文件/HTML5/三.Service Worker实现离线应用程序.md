# Service Worker 完全指南

## 目录
- [1. Service Worker 基础概念](#1-service-worker-基础概念)
- [2. 生命周期](#2-生命周期)
- [3. 注册与安装](#3-注册与安装)
- [4. 缓存策略](#4-缓存策略)
- [5. 实际应用示例](#5-实际应用示例)
- [6. 调试技巧](#6-调试技巧)
- [7. 兼容性与注意事项](#7-兼容性与注意事项)

## 1. Service Worker 基础概念

### 什么是 Service Worker？

Service Worker 是一种运行在浏览器后台的脚本，它独立于网页，能够拦截和处理网络请求，包括管理缓存以实现离线访问。它是 Progressive Web App (PWA) 的核心技术之一。

### 主要特性

- **离线工作**：可以缓存资源，使应用在离线状态下仍能运行
- **后台处理**：独立于主线程，不会阻塞页面渲染
- **网络代理**：可以拦截网络请求并自定义响应
- **推送通知**：接收服务器推送的消息并显示通知
- **后台同步**：在网络恢复时执行数据同步

### 限制条件

- 只能在 HTTPS 环境下运行（本地开发环境 localhost 除外）
- 不能直接访问 DOM
- 采用异步编程模型，大量使用 Promise
- 有自己的生命周期，独立于网页
- 在不使用时会被中止，在需要时重新激活

## 2. 生命周期

Service Worker 的生命周期包含以下几个阶段：

1. **注册**：网页通过 `navigator.serviceWorker.register()` 注册 Service Worker
2. **安装**：首次注册或发现新版本时触发 `install` 事件
3. **激活**：安装成功后触发 `activate` 事件，此时可以管理缓存
4. **空闲**：等待事件（如 fetch、push 等）
5. **终止**：浏览器可能在空闲时终止 Service Worker 以节省资源
6. **更新**：当检测到新版本时，会重新安装并在合适时机激活

![Service Worker 生命周期](https://web.dev/static/articles/service-worker-lifecycle/image/service-worker-lifecycle-8-9db9b2f23.svg)

## 3. 注册与安装

### 注册 Service Worker

```javascript
// 在主页面的 JavaScript 中
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker 注册成功，作用域为：', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker 注册失败：', error);
      });
  });
}
```

### 安装与缓存资源

```javascript
// 在 sw.js 文件中
const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/styles/main.css',
  '/scripts/main.js',
  '/images/logo.png'
];

// 安装事件：预缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        // 强制新 Service Worker 立即激活
        return self.skipWaiting();
      })
  );
});

// 激活事件：清理旧缓存
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // 删除不在白名单中的缓存
            return caches.delete(cacheName);
          }
        })
      );
    })
    .then(() => {
      // 立即控制所有打开的页面
      return self.clients.claim();
    })
  );
});
```

## 4. 缓存策略

Service Worker 可以实现多种缓存策略，以下是几种常见的策略：

### 1. 缓存优先 (Cache First)

先查询缓存，如果缓存中没有，则发起网络请求。适合静态资源。

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 返回缓存的响应或发起网络请求
        return response || fetch(event.request);
      })
  );
});
```

### 2. 网络优先 (Network First)

先尝试网络请求，如果失败则使用缓存。适合经常更新的资源。

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // 缓存响应副本
        const responseClone = response.clone();
        caches.open(CACHE_NAME)
          .then(cache => {
            cache.put(event.request, responseClone);
          });
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
```

### 3. 缓存与网络竞速 (Stale While Revalidate)

同时从缓存和网络获取资源，先返回缓存内容，然后用网络响应更新缓存。

```javascript
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
        // 返回缓存响应或等待网络响应
        return cachedResponse || fetchPromise;
      });
    })
  );
});
```

### 4. 按资源类型选择策略

根据请求 URL 或资源类型选择不同的缓存策略。

```javascript
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // 静态资源使用缓存优先
  if (url.pathname.startsWith('/static/')) {
    event.respondWith(cacheFirst(event.request));
  } 
  // API 请求使用网络优先
  else if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(event.request));
  }
  // 其他请求使用缓存后备
  else {
    event.respondWith(staleWhileRevalidate(event.request));
  }
});

// 缓存优先策略
function cacheFirst(request) {
  return caches.match(request)
    .then(response => response || fetch(request));
}

// 网络优先策略
function networkFirst(request) {
  return fetch(request)
    .catch(() => caches.match(request));
}

// 缓存与网络竞速策略
function staleWhileRevalidate(request) {
  return caches.open(CACHE_NAME).then(cache => {
    return cache.match(request).then(cachedResponse => {
      const fetchPromise = fetch(request).then(networkResponse => {
        cache.put(request, networkResponse.clone());
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    });
  });
}
```

## 5. 实际应用示例

以下是一个完整的离线应用示例，包含三个文件：

### index.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Service Worker 示例</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header>
    <h1>Service Worker 示例应用</h1>
    <div id="status">在线</div>
  </header>
  
  <main>
    <div class="card">
      <h2>欢迎使用</h2>
      <p>这是一个支持离线访问的 Web 应用示例。</p>
      <p>尝试关闭网络连接并刷新页面，应用仍然可以访问。</p>
    </div>
    
    <div class="card">
      <h2>网络状态</h2>
      <button id="check-btn">检查网络</button>
      <div id="network-status">点击按钮检查网络状态</div>
    </div>
    
    <div class="card">
      <h2>缓存管理</h2>
      <button id="clear-cache">清除缓存</button>
      <div id="cache-status"></div>
    </div>
  </main>
  
  <script src="app.js"></script>
</body>
</html>
```

### style.css

```css
body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
  color: #333;
}

header {
  background-color: #2196F3;
  color: white;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#status {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #4CAF50;
}

#status.offline {
  background-color: #F44336;
}

main {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.card {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}

button {
  background-color: #2196F3;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  margin-right: 0.5rem;
}

button:hover {
  background-color: #0b7dda;
}

#network-status, #cache-status {
  margin-top: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.online {
  background-color: #e8f5e9;
  color: #2e7d32;
}

.offline {
  background-color: #ffebee;
  color: #c62828;
}
```

### app.js

```javascript
// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker 注册成功，作用域为：', registration.scope);
      })
      .catch(error => {
        console.error('Service Worker 注册失败：', error);
      });
  });
}

// 网络状态监听
function updateOnlineStatus() {
  const status = document.getElementById('status');
  const condition = navigator.onLine ? '在线' : '离线';
  
  status.textContent = condition;
  status.className = navigator.onLine ? '' : 'offline';
  
  console.log('网络状态：', condition);
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// 网络检查按钮
document.getElementById('check-btn').addEventListener('click', () => {
  const networkStatus = document.getElementById('network-status');
  
  if (navigator.onLine) {
    fetch('https://jsonplaceholder.typicode.com/todos/1')
      .then(response => {
        networkStatus.textContent = '网络连接正常，可以访问互联网';
        networkStatus.className = 'online';
      })
      .catch(error => {
        networkStatus.textContent = '网络连接受限，无法访问互联网';
        networkStatus.className = 'offline';
      });
  } else {
    networkStatus.textContent = '当前处于离线状态';
    networkStatus.className = 'offline';
  }
});

// 清除缓存按钮
document.getElementById('clear-cache').addEventListener('click', () => {
  const cacheStatus = document.getElementById('cache-status');
  
  if ('caches' in window) {
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
      cacheStatus.textContent = '缓存已清除';
      cacheStatus.className = 'online';
    }).catch(error => {
      cacheStatus.textContent = '清除缓存失败: ' + error;
      cacheStatus.className = 'offline';
    });
  } else {
    cacheStatus.textContent = '浏览器不支持 Cache API';
    cacheStatus.className = 'offline';
  }
});

// 与 Service Worker 通信
function sendMessageToSW(message) {
  return new Promise((resolve, reject) => {
    const messageChannel = new MessageChannel();
    
    messageChannel.port1.onmessage = event => {
      if (event.data.error) {
        reject(event.data.error);
      } else {
        resolve(event.data);
      }
    };
    
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
    } else {
      reject('Service Worker 未激活');
    }
  });
}
```

### sw.js

```javascript
const CACHE_NAME = 'offline-app-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/app.js',
  '/offline.html'
];

// 安装事件 - 预缓存资源
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 请求拦截 - 缓存优先策略
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 返回缓存的响应或发起网络请求
        return response || fetch(event.request)
          .then(fetchResponse => {
            // 不缓存 API 请求
            if (event.request.url.includes('jsonplaceholder')) {
              return fetchResponse;
            }
            
            // 缓存其他成功响应
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, fetchResponse.clone());
              return fetchResponse;
            });
          })
          .catch(error => {
            // 如果是 HTML 请求且失败，返回离线页面
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
            
            console.error('Fetch failed:', error);
            throw error;
          });
      })
  );
});

// 消息处理
self.addEventListener('message', event => {
  console.log('Service Worker 收到消息:', event.data);
  
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
  
  // 回复消息
  if (event.ports && event.ports[0]) {
    event.ports[0].postMessage({
      message: 'Service Worker 已处理消息'
    });
  }
});

// 推送通知
self.addEventListener('push', event => {
  const title = '推送通知';
  const options = {
    body: event.data ? event.data.text() : '无消息内容',
    icon: '/images/icon.png',
    badge: '/images/badge.png'
  };
  
  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// 通知点击
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// 后台同步
self.addEventListener('sync', event => {
  if (event.tag === 'sync-data') {
    event.waitUntil(
      // 执行数据同步操作
      fetch('/api/sync')
        .then(response => {
          console.log('数据同步成功');
        })
        .catch(error => {
          console.error('数据同步失败:', error);
        })
    );
  }
});
```

### offline.html

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>离线状态</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background-color: #f5f5f5;
      color: #333;
    }
    .container {
      text-align: center;
      padding: 2rem;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      max-width: 500px;
    }
    h1 {
      color: #F44336;
    }
    p {
      margin: 1rem 0;
      line-height: 1.5;
    }
    button {
      background-color: #2196F3;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 1rem;
      margin-top: 1rem;
    }
    button:hover {
      background-color: #0b7dda;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>您当前处于离线状态</h1>
    <p>无法连接到互联网。请检查您的网络连接，然后重试。</p>
    <p>部分功能可能在离线状态下不可用。</p>
    <button onclick="window.location.reload()">重新加载</button>
  </div>
</body>
</html>
```

## 6. 调试技巧

### Chrome DevTools

1. 打开 Chrome DevTools (F12 或右键 → 检查)
2. 切换到 **Application** 标签
3. 在左侧面板选择 **Service Workers**

![Chrome DevTools Service Worker 面板](https://developers.google.com/web/tools/chrome-devtools/progressive-web-apps/imgs/sw-pane.png)

### 常用调试功能

- **Offline**：模拟离线状态
- **Update on reload**：强制更新 Service Worker
- **Bypass for network**：绕过 Service Worker
- **Clear storage**：清除所有缓存和存储

### 调试命令

```javascript
// 在控制台查看所有注册的 Service Worker
navigator.serviceWorker.getRegistrations()
  .then(registrations => console.log(registrations));

// 强制更新 Service Worker
navigator.serviceWorker.getRegistration()
  .then(registration => registration.update());

// 卸载 Service Worker
navigator.serviceWorker.getRegistration()
  .then(registration => registration.unregister());

// 查看缓存内容
caches.open('cache-name')
  .then(cache => cache.keys().then(keys => console.log(keys)));
```

### 常见问题排查

1. **Service Worker 未注册**：检查 HTTPS 环境、路径是否正确
2. **缓存未生效**：检查 `fetch` 事件处理逻辑
3. **更新不生效**：检查是否有活动的页面阻止更新

## 7. 兼容性与注意事项

### 浏览器兼容性

| 浏览器 | 最低支持版本 |
|-------|------------|
| Chrome | 40+ |
| Firefox | 44+ |
| Safari | 11.1+ |
| Edge | 17+ |
| Opera | 27+ |
| Android Chrome | 40+ |
| iOS Safari | 11.3+ |

### 特性检测

```javascript
if ('serviceWorker' in navigator) {
  // Service Worker 可用
}

if ('caches' in window) {
  // Cache API 可用
}

if ('sync' in ServiceWorkerRegistration.prototype) {
  // 后台同步 API 可用
}

if ('pushManager' in ServiceWorkerRegistration.prototype) {
  // 推送通知 API 可用
}
```

### 优雅降级

```javascript
// 注册 Service Worker 并提供降级方案
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then(registration => {
      console.log('Service Worker 注册成功');
    })
    .catch(error => {
      console.log('Service Worker 注册失败，使用传统缓存');
      setupAppCache(); // 传统缓存方案
    });
} else {
  console.log('浏览器不支持 Service Worker，使用传统缓存');
  setupAppCache(); // 传统缓存方案
}

// 传统缓存方案
function setupAppCache() {
  // 使用 localStorage 或其他方式缓存关键数据
}
```

### 最佳实践

1. **版本控制**：为缓存名称添加版本号，便于更新
2. **离线页面**：提供专门的离线页面，提升用户体验
3. **定期清理**：在激活阶段清理旧缓存，避免存储空间浪费
4. **选择性缓存**：根据资源类型选择不同的缓存策略
5. **错误处理**：为所有网络请求添加错误处理逻辑
6. **通信机制**：建立页面与 Service Worker 之间的通信机制
7. **更新提示**：当检测到新版本时，提示用户刷新页面

### 安全注意事项

1. Service Worker 只能在 HTTPS 环境下运行（localhost 除外）
2. 避免在 Service Worker 中存储敏感信息
3. 谨慎处理第三方请求，避免缓存不安全的内容
4. 定期更新 Service Worker，修复潜在的安全漏洞

## 总结

Service Worker 是构建现代 Web 应用的强大工具，它能够提供离线访问、性能优化和增强的用户体验。通过本指南中的示例和最佳实践，您可以开始在自己的项目中实现 Service Worker，并充分利用其提供的功能。

随着对 Service Worker 的深入学习，您可以实现更复杂的缓存策略、推送通知和后台同步等高级功能，进一步提升应用的用户体验。