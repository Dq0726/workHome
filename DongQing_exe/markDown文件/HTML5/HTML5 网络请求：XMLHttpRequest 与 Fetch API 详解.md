
# HTML5 网络请求：XMLHttpRequest 与 Fetch API 详解
## 目录
- [HTML5 网络请求：XMLHttpRequest 与 Fetch API 详解](#html5-网络请求xmlhttprequest-与-fetch-api-详解)
  - [目录](#目录)
  - [概述](#概述)
  - [XMLHttpRequest API](#xmlhttprequest-api)
    - [历史与演变](#历史与演变)
    - [基本用法](#基本用法)
    - [发送不同类型的请求](#发送不同类型的请求)
      - [POST 请求发送 JSON 数据](#post-请求发送-json-数据)
      - [发送表单数据](#发送表单数据)
    - [处理响应](#处理响应)
    - [监控进度](#监控进度)
    - [超时处理](#超时处理)
    - [错误处理](#错误处理)
    - [取消请求](#取消请求)
    - [跨域资源共享 (CORS)](#跨域资源共享-cors)
  - [Fetch API](#fetch-api)
    - [基本概念](#基本概念)
    - [基本用法](#基本用法-1)
    - [请求配置](#请求配置)
    - [处理响应](#处理响应-1)
    - [处理不同类型的响应](#处理不同类型的响应)
    - [发送不同类型的请求](#发送不同类型的请求-1)
      - [POST 请求发送 JSON 数据](#post-请求发送-json-数据-1)
      - [发送表单数据](#发送表单数据-1)
      - [PUT 请求更新资源](#put-请求更新资源)
      - [DELETE 请求删除资源](#delete-请求删除资源)
    - [请求控制](#请求控制)
      - [超时控制](#超时控制)
      - [取消请求](#取消请求-1)
    - [跨域请求](#跨域请求)
  - [XMLHttpRequest 与 Fetch API 对比](#xmlhttprequest-与-fetch-api-对比)
    - [何时使用 XMLHttpRequest](#何时使用-xmlhttprequest)
    - [何时使用 Fetch API](#何时使用-fetch-api)
  - [实际应用场景](#实际应用场景)
    - [表单提交](#表单提交)
      - [使用 XMLHttpRequest 提交表单](#使用-xmlhttprequest-提交表单)
      - [使用 Fetch API 提交表单](#使用-fetch-api-提交表单)
    - [文件上传](#文件上传)
      - [使用 XMLHttpRequest 上传文件](#使用-xmlhttprequest-上传文件)
      - [使用 Fetch API 上传文件](#使用-fetch-api-上传文件)
    - [数据轮询](#数据轮询)
      - [使用 XMLHttpRequest 进行轮询](#使用-xmlhttprequest-进行轮询)
      - [使用 Fetch API 进行轮询](#使用-fetch-api-进行轮询)
    - [流式数据处理](#流式数据处理)
      - [使用 Fetch API 处理流式数据](#使用-fetch-api-处理流式数据)
  - [最佳实践](#最佳实践)
    - [通用最佳实践](#通用最佳实践)
    - [XMLHttpRequest 最佳实践](#xmlhttprequest-最佳实践)
    - [Fetch API 最佳实践](#fetch-api-最佳实践)
  - [浏览器兼容性](#浏览器兼容性)
    - [XMLHttpRequest 兼容性](#xmlhttprequest-兼容性)
    - [Fetch API 兼容性](#fetch-api-兼容性)
  - [总结](#总结)
    - [XMLHttpRequest 总结](#xmlhttprequest-总结)
    - [Fetch API 总结](#fetch-api-总结)
    - [选择建议](#选择建议)
  - [参考资源](#参考资源)
## 概述
在现代 Web 应用中，能够在不刷新页面的情况下与服务器交换数据是至关重要的。HTML5 提供了两种主要的 API 来实现这一功能：传统的 XMLHttpRequest（XHR）和更现代的 Fetch API。这两种技术都允许浏览器与服务器进行异步通信，但它们在设计理念、易用性和功能上有显著差异。
本文将详细介绍这两种 API 的使用方法、特点和最佳实践，帮助开发者选择适合自己项目的网络请求方案。
## XMLHttpRequest API
### 历史与演变
XMLHttpRequest 最初由微软在 IE5 中引入，后来被其他浏览器采纳并标准化。尽管名称中包含 "XML"，但它可以用于传输任何类型的数据，不仅限于 XML。
XMLHttpRequest 经历了两个主要版本：
- **XMLHttpRequest Level 1**：最初的实现，提供基本的异步请求功能
- **XMLHttpRequest Level 2**：HTML5 中引入的扩展版本，增加了许多新特性，如跨域请求支持、上传进度事件、二进制数据处理等
### 基本用法
创建一个简单的 GET 请求：
```javascript
// 创建 XMLHttpRequest 对象
const xhr = new XMLHttpRequest();
// 配置请求
xhr.open('GET', 'https://api.example.com/data', true); // true 表示异步
// 设置响应类型（可选）
xhr.responseType = 'json';
// 注册事件处理函数
xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    // 请求成功
    console.log('响应数据:', xhr.response);
  } else {
    // 请求失败
    console.error('请求失败，状态码:', xhr.status);
  }
};
// 注册错误处理函数
xhr.onerror = function() {
  console.error('请求遇到网络错误');
};
// 发送请求
xhr.send();
```
### 发送不同类型的请求
#### POST 请求发送 JSON 数据
```javascript
const xhr = new XMLHttpRequest();
xhr.open('POST', 'https://api.example.com/users', true);
// 设置请求头
xhr.setRequestHeader('Content-Type', 'application/json');
// 准备数据
const data = {
  name: '张三',
  email: 'zhangsan@example.com',
  age: 30
};
// 注册事件处理函数
xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log('用户创建成功:', xhr.response);
  } else {
    console.error('创建用户失败:', xhr.status);
  }
};
// 发送请求，将 JavaScript 对象转换为 JSON 字符串
xhr.send(JSON.stringify(data));
```
#### 发送表单数据
```javascript
const xhr = new XMLHttpRequest();
xhr.open('POST', 'https://api.example.com/submit-form', true);
// 使用 FormData 对象
const formData = new FormData();
formData.append('username', '李四');
formData.append('email', 'lisi@example.com');
formData.append('message', '这是一条测试消息');
// 注册事件处理函数
xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log('表单提交成功');
  } else {
    console.error('表单提交失败');
  }
};
// 发送表单数据（不需要设置 Content-Type，浏览器会自动设置）
xhr.send(formData);
```
### 处理响应
XMLHttpRequest 提供了多种方式来访问响应数据：
```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data', true);
xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    // 1. 作为文本获取响应
    console.log('响应文本:', xhr.responseText);
   
    // 2. 作为 XML 文档获取响应（如果服务器返回 XML）
    if (xhr.responseXML) {
      console.log('XML 响应:', xhr.responseXML);
    }
   
    // 3. 使用 responseType 设置为 'json' 时
    if (xhr.responseType === 'json') {
      console.log('JSON 响应:', xhr.response);
    }
   
    // 4. 手动解析 JSON
    try {
      const jsonData = JSON.parse(xhr.responseText);
      console.log('手动解析的 JSON:', jsonData);
    } catch (e) {
      console.error('JSON 解析错误:', e);
    }
   
    // 5. 获取响应头
    const contentType = xhr.getResponseHeader('Content-Type');
    console.log('Content-Type:', contentType);
   
    // 6. 获取所有响应头
    const allHeaders = xhr.getAllResponseHeaders();
    console.log('所有响应头:', allHeaders);
  }
};
xhr.send();
```
### 监控进度
XMLHttpRequest Level 2 引入了进度事件，使开发者能够监控请求和响应的进度：
```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://example.com/large-file.zip', true);
// 下载进度
xhr.onprogress = function(event) {
  if (event.lengthComputable) {
    const percentComplete = (event.loaded / event.total) * 100;
    console.log(`下载进度: ${percentComplete.toFixed(2)}%`);
   
    // 更新进度条
    document.getElementById('progress').value = percentComplete;
    document.getElementById('status').textContent =
      `已下载 ${Math.round(event.loaded / 1024)} KB，共 ${Math.round(event.total / 1024)} KB`;
  }
};
// 上传进度（适用于 POST、PUT 等请求）
xhr.upload.onprogress = function(event) {
  if (event.lengthComputable) {
    const percentComplete = (event.loaded / event.total) * 100;
    console.log(`上传进度: ${percentComplete.toFixed(2)}%`);
  }
};
// 加载开始
xhr.onloadstart = function() {
  console.log('开始加载');
};
// 加载结束
xhr.onloadend = function() {
  console.log('加载结束');
};
xhr.onload = function() {
  console.log('下载完成');
};
xhr.send();
```
### 超时处理
设置请求超时时间并处理超时事件：
```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data', true);
// 设置 5 秒超时
xhr.timeout = 5000;
// 超时处理函数
xhr.ontimeout = function() {
  console.error('请求超时');
  alert('服务器响应时间过长，请稍后再试');
};
xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log('响应数据:', xhr.response);
  }
};
xhr.send();
```
### 错误处理
全面的错误处理示例：
```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/data', true);
// 网络错误
xhr.onerror = function() {
  console.error('网络错误，无法完成请求');
};
// 请求中止
xhr.onabort = function() {
  console.log('请求被中止');
};
// 超时错误
xhr.timeout = 10000; // 10 秒
xhr.ontimeout = function() {
  console.error('请求超时');
};
// 状态变化（可用于调试）
xhr.onreadystatechange = function() {
  console.log('就绪状态:', xhr.readyState);
  /*
    readyState 值:
    0: UNSENT - 尚未调用 open() 方法
    1: OPENED - open() 方法已被调用
    2: HEADERS_RECEIVED - send() 方法已被调用，响应头已接收
    3: LOADING - 正在接收响应体
    4: DONE - 请求完成
  */
};
// 加载完成（包括成功和失败）
xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    // 成功
    console.log('请求成功:', xhr.response);
  } else {
    // HTTP 错误
    console.error('HTTP 错误:', xhr.status, xhr.statusText);
   
    // 根据状态码处理不同情况
    switch(xhr.status) {
      case 404:
        console.error('资源未找到');
        break;
      case 500:
        console.error('服务器内部错误');
        break;
      case 403:
        console.error('没有权限访问');
        break;
      default:
        console.error('未知错误');
    }
  }
};
xhr.send();
```
### 取消请求
可以在任何时候中止正在进行的请求：
```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'https://api.example.com/large-data', true);
xhr.onload = function() {
  console.log('请求完成');
};
xhr.onabort = function() {
  console.log('请求已被取消');
};
// 开始请求
xhr.send();
// 设置一个按钮来取消请求
document.getElementById('cancelButton').addEventListener('click', function() {
  xhr.abort();
  console.log('用户取消了请求');
});
// 或者在一定条件下自动取消
setTimeout(function() {
  if (xhr.readyState !== 4) { // 如果请求尚未完成
    xhr.abort();
    console.log('请求自动取消');
  }
}, 3000); // 3 秒后取消
```
### 跨域资源共享 (CORS)
XMLHttpRequest Level 2 支持跨域请求，但服务器需要配置正确的 CORS 头：
```javascript
const xhr = new XMLHttpRequest();
// 跨域请求
xhr.open('GET', 'https://api.another-domain.com/data', true);
// 设置凭据（如果需要发送 cookies）
xhr.withCredentials = true;
xhr.onload = function() {
  if (xhr.status >= 200 && xhr.status < 300) {
    console.log('跨域请求成功:', xhr.response);
  } else {
    console.error('跨域请求失败:', xhr.status);
  }
};
xhr.onerror = function() {
  console.error('跨域请求错误 - 可能是 CORS 策略阻止了请求');
};
xhr.send();
```
服务器需要返回以下响应头以允许跨域请求：
```
Access-Control-Allow-Origin: https://your-domain.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Allow-Credentials: true  // 如果需要发送 cookies
```
## Fetch API
### 基本概念
Fetch API 是一个现代的、基于 Promise 的网络请求接口，旨在替代传统的 XMLHttpRequest。它提供了一个更简洁、更灵活的语法，并与其他现代 JavaScript 特性（如 Promise、async/await）无缝集成。
Fetch API 的核心是全局的 `fetch()` 函数，它返回一个 Promise，这个 Promise 会在请求响应后被解析，无论响应是成功还是失败。
### 基本用法
最简单的 Fetch 请求：
```javascript
fetch('https://api.example.com/data')
  .then(response => {
    // 检查响应状态
    if (!response.ok) {
      throw new Error(`HTTP 错误: ${response.status}`);
    }
    // 解析 JSON 响应
    return response.json();
  })
  .then(data => {
    // 处理数据
    console.log('获取的数据:', data);
  })
  .catch(error => {
    // 处理错误
    console.error('获取数据失败:', error);
  });
```
使用 async/await 语法（更现代的方式）：
```javascript
async function fetchData() {
  try {
    const response = await fetch('https://api.example.com/data');
   
    if (!response.ok) {
      throw new Error(`HTTP 错误: ${response.status}`);
    }
   
    const data = await response.json();
    console.log('获取的数据:', data);
    return data;
  } catch (error) {
    console.error('获取数据失败:', error);
    throw error; // 可以选择重新抛出错误
  }
}
// 调用函数
fetchData().then(data => {
  // 使用数据更新 UI
  document.getElementById('result').textContent = JSON.stringify(data, null, 2);
}).catch(error => {
  // 显示错误信息
  document.getElementById('error').textContent = `发生错误: ${error.message}`;
});
```
### 请求配置
Fetch API 允许通过第二个参数对象来配置请求：
```javascript
fetch('https://api.example.com/data', {
  method: 'GET', // *GET, POST, PUT, DELETE 等
  mode: 'cors', // no-cors, *cors, same-origin
  cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
  credentials: 'same-origin', // include, *same-origin, omit
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token-here'
  },
  redirect: 'follow', // manual, *follow, error
  referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade 等
  // body 数据类型必须与 "Content-Type" 头部匹配
  body: JSON.stringify({ key: 'value' }) // 仅用于 POST, PUT 等方法
})
.then(response => response.json())
.then(data => console.log(data));
```
### 处理响应
Fetch API 的 Response 对象提供了多种方法来处理不同类型的响应数据：
```javascript
fetch('https://api.example.com/data')
  .then(response => {
    // 响应状态和头部信息
    console.log('状态:', response.status); // 例如 200
    console.log('状态文本:', response.statusText); // 例如 "OK"
    console.log('是否成功:', response.ok); // 如果状态码在 200-299 范围内，则为 true
    console.log('响应类型:', response.type); // basic, cors, error, opaque 等
   
    // 获取特定响应头
    console.log('Content-Type:', response.headers.get('Content-Type'));
   
    // 遍历所有响应头
    response.headers.forEach((value, name) => {
      console.log(`${name}: ${value}`);
    });
   
    // 根据响应类型选择适当的解析方法
    const contentType = response.headers.get('Content-Type') || '';
   
    if (contentType.includes('application/json')) {
      return response.json();
    } else if (contentType.includes('text/')) {
      return response.text();
    } else if (contentType.includes('image/')) {
      return response.blob();
    }
   
    // 默认返回 JSON
    return response.json();
  })
  .then(data => {
    console.log('解析后的数据:', data);
  });
```
### 处理不同类型的响应
Fetch API 提供了多种方法来处理不同格式的响应数据：
```javascript
// 1. JSON 数据
fetch('https://api.example.com/users')
  .then(response => response.json())
  .then(users => console.log('用户列表:', users));
// 2. 纯文本
fetch('https://api.example.com/message.txt')
  .then(response => response.text())
  .then(text => console.log('文本内容:', text));
// 3. Blob 数据（二进制数据，如图片）
fetch('https://api.example.com/image.jpg')
  .then(response => response.blob())
  .then(blob => {
    const imageUrl = URL.createObjectURL(blob);
    document.getElementById('myImage').src = imageUrl;
  });
// 4. ArrayBuffer（用于处理二进制数据）
fetch('https://api.example.com/binary-data')
  .then(response => response.arrayBuffer())
  .then(buffer => {
    // 处理二进制数据
    const view = new Uint8Array(buffer);
    console.log('二进制数据的前 10 个字节:', view.slice(0, 10));
  });
// 5. FormData（用于处理表单数据）
fetch('https://api.example.com/form-data')
  .then(response => response.formData())
  .then(formData => {
    console.log('表单字段 "name":', formData.get('name'));
  });
```
### 发送不同类型的请求
#### POST 请求发送 JSON 数据
```javascript
const user = {
  name: '张三',
  email: 'zhangsan@example.com',
  age: 30
};
fetch('https://api.example.com/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(user)
})
.then(response => {
  if (!response.ok) {
    throw new Error(`HTTP 错误: ${response.status}`);
  }
  return response.json();
})
.then(data => {
  console.log('创建的用户:', data);
})
.catch(error => {
  console.error('创建用户失败:', error);
});
```
#### 发送表单数据
```javascript
const formData = new FormData();
formData.append('username', '李四');
formData.append('email', 'lisi@example.com');
formData.append('message', '这是一条测试消息');
// 添加文件（如果有文件上传）
const fileInput = document.querySelector('#fileInput');
if (fileInput.files.length > 0) {
  formData.append('file', fileInput.files[0]);
}
fetch('https://api.example.com/submit-form', {
  method: 'POST',
  body: formData
  // 不需要设置 Content-Type，浏览器会自动设置为 multipart/form-data
})
.then(response => response.json())
.then(result => {
  console.log('表单提交成功:', result);
})
.catch(error => {
  console.error('表单提交失败:', error);
});
```
#### PUT 请求更新资源
```javascript
const updatedUser = {
  name: '张三（已更新）',
  email: 'zhangsan@example.com',
  age: 31
};
fetch('https://api.example.com/users/123', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(updatedUser)
})
.then(response => response.json())
.then(data => {
  console.log('更新后的用户:', data);
});
```
#### DELETE 请求删除资源
```javascript
fetch('https://api.example.com/users/123', {
  method: 'DELETE'
})
.then(response => {
  if (response.ok) {
    console.log('用户已成功删除');
    return { success: true };
  }
  return response.json();
})
.then(data => {
  console.log('响应数据:', data);
})
.catch(error => {
  console.error('删除用户失败:', error);
});
```
### 请求控制
#### 超时控制
Fetch API 本身不直接支持超时设置，但可以通过 Promise.race() 实现：
```javascript
// 创建一个超时 Promise
function timeout(ms) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error('请求超时')), ms)
  );
}
// 结合 fetch 和超时
Promise.race([
  fetch('https://api.example.com/data'),
  timeout(5000) // 5 秒超时
])
.then(response => response.json())
.then(data => console.log('数据:', data))
.catch(error => console.error('错误或超时:', error));
```
#### 取消请求
使用 AbortController 接口取消 fetch 请求：
```javascript
// 创建一个 AbortController 实例
const controller = new AbortController();
const signal = controller.signal;
// 发起可取消的请求
fetch('https://api.example.com/large-data', { signal })
  .then(response => response.json())
  .then(data => console.log('数据:', data))
  .catch(error => {
    if (error.name === 'AbortError') {
      console.log('请求被用户取消');
    } else {
      console.error('请求失败:', error);
    }
  });
// 设置一个按钮来取消请求
document.getElementById('cancelButton').addEventListener('click', () => {
  controller.abort();
  console.log('请求已被取消');
});
// 或者在一定条件下自动取消
setTimeout(() => {
  controller.abort();
  console.log('请求自动取消');
}, 3000); // 3 秒后取消
```
### 跨域请求
Fetch API 默认遵循同源策略，但可以通过 CORS 进行跨域请求：
```javascript
// 简单的跨域请求
fetch('https://api.another-domain.com/data')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('跨域请求失败:', error));
// 带凭据的跨域请求（发送 cookies）
fetch('https://api.another-domain.com/user-data', {
  credentials: 'include' // 包含凭据
})
.then(response => response.json())
.then(data => console.log('用户数据:', data));
// 预检请求（复杂请求，如使用 PUT 方法或自定义头）
fetch('https://api.another-domain.com/resource', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'X-Custom-Header': 'value'
  },
  body: JSON.stringify({ key: 'value' })
})
.then(response => response.json())
.then(data => console.log(data));
```
## XMLHttpRequest 与 Fetch API 对比
| 特性 | XMLHttpRequest | Fetch API |
|------|---------------|-----------|
| **语法** | 基于回调和事件 | 基于 Promise |
| **易用性** | 较复杂，代码冗长 | 简洁，链式调用 |
| **错误处理** | 通过事件（onerror, ontimeout 等） | 通过 Promise 的 catch 方法 |
| **请求取消** | xhr.abort() | AbortController |
| **进度监控** | 内置支持（onprogress 事件） | 需要通过 Response.body 流处理 |
| **超时设置** | 内置支持（xhr.timeout） | 需要自行实现（Promise.race） |
| **重定向处理** | 自动跟随重定向 | 可配置（redirect 选项） |
| **流式数据** | 有限支持 | 完全支持（通过 Response.body） |
| **CORS 支持** | 支持（xhr.withCredentials） | 支持（credentials 选项） |
| **浏览器兼容性** | 几乎所有浏览器 | 现代浏览器（IE 不支持） |
| **同步请求** | 支持（不推荐） | 不支持（仅异步） |
### 何时使用 XMLHttpRequest
- 需要支持旧版浏览器（如 IE）
- 需要精细控制上传/下载进度
- 需要直接访问二进制数据而不进行转换
- 需要监控请求的各个阶段（通过 readyState）
### 何时使用 Fetch API
- 开发现代 Web 应用，不需要支持旧浏览器
- 喜欢使用 Promise 和 async/await 语法
- 需要更简洁的代码
- 需要处理流式数据
- 需要更灵活的请求配置
## 实际应用场景
### 表单提交
#### 使用 XMLHttpRequest 提交表单
```javascript
document.getElementById('userForm').addEventListener('submit', function(event) {
  event.preventDefault(); // 阻止表单默认提交
 
  const formData = new FormData(this); // 从表单元素创建 FormData
 
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://api.example.com/submit-form', true);
 
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      const response = JSON.parse(xhr.responseText);
      alert('表单提交成功！');
      console.log('服务器响应:', response);
    } else {
      alert('表单提交失败: ' + xhr.status);
    }
  };
 
  xhr.onerror = function() {
    alert('网络错误，无法提交表单');
  };
 
  // 显示进度
  xhr.upload.onprogress = function(event) {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      document.getElementById('progressBar').value = percentComplete;
      document.getElementById('progressStatus').textContent = `${Math.round(percentComplete)}%`;
    }
  };
 
  xhr.send(formData);
});
```
#### 使用 Fetch API 提交表单
```javascript
document.getElementById('userForm').addEventListener('submit', async function(event) {
  event.preventDefault(); // 阻止表单默认提交
 
  const formData = new FormData(this);
 
  try {
    const response = await fetch('https://api.example.com/submit-form', {
      method: 'POST',
      body: formData
    });
   
    if (!response.ok) {
      throw new Error(`HTTP 错误: ${response.status}`);
    }
   
    const result = await response.json();
    alert('表单提交成功！');
    console.log('服务器响应:', result);
  } catch (error) {
    alert('表单提交失败: ' + error.message);
    console.error('错误:', error);
  }
});
```
### 文件上传
#### 使用 XMLHttpRequest 上传文件
```javascript
document.getElementById('fileForm').addEventListener('submit', function(event) {
  event.preventDefault();
 
  const fileInput = document.getElementById('fileInput');
  if (!fileInput.files.length) {
    alert('请选择文件');
    return;
  }
 
  const formData = new FormData();
 
  // 添加所有选择的文件
  for (let i = 0; i < fileInput.files.length; i++) {
    formData.append('files', fileInput.files[i]);
  }
 
  // 添加其他表单字段
  formData.append('username', document.getElementById('username').value);
 
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://api.example.com/upload', true);
 
  // 进度监控
  xhr.upload.onprogress = function(event) {
    if (event.lengthComputable) {
      const percentComplete = (event.loaded / event.total) * 100;
      document.getElementById('uploadProgress').value = percentComplete;
      document.getElementById('uploadStatus').textContent =
        `已上传 ${Math.round(event.loaded / 1024)} KB，共 ${Math.round(event.total / 1024)} KB (${Math.round(percentComplete)}%)`;
    }
  };
 
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      const response = JSON.parse(xhr.responseText);
      document.getElementById('uploadResult').textContent = '文件上传成功！';
      console.log('上传结果:', response);
    } else {
      document.getElementById('uploadResult').textContent = '文件上传失败: ' + xhr.status;
    }
  };
 
  xhr.onerror = function() {
    document.getElementById('uploadResult').textContent = '网络错误，上传失败';
  };
 
  xhr.send(formData);
});
```
#### 使用 Fetch API 上传文件
```javascript
document.getElementById('fileForm').addEventListener('submit', async function(event) {
  event.preventDefault();
 
  const fileInput = document.getElementById('fileInput');
  if (!fileInput.files.length) {
    alert('请选择文件');
    return;
  }
 
  const formData = new FormData();
 
  // 添加所有选择的文件
  for (let i = 0; i < fileInput.files.length; i++) {
    formData.append('files', fileInput.files[i]);
  }
 
  // 添加其他表单字段
  formData.append('username', document.getElementById('username').value);
 
  try {
    const response = await fetch('https://api.example.com/upload', {
      method: 'POST',
      body: formData
    });
   
    if (!response.ok) {
      throw new Error(`HTTP 错误: ${response.status}`);
    }
   
    const result = await response.json();
    document.getElementById('uploadResult').textContent = '文件上传成功！';
    console.log('上传结果:', result);
  } catch (error) {
    document.getElementById('uploadResult').textContent = '上传失败: ' + error.message;
    console.error('错误:', error);
  }
});
// 注意：Fetch API 本身不提供进度监控，需要使用 ReadableStream 实现
```
### 数据轮询
#### 使用 XMLHttpRequest 进行轮询
```javascript
function pollServerXHR(url, interval = 5000) {
  // 初始化轮询
  function poll() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
   
    xhr.onload = function() {
      if (xhr.status >= 200 && xhr.status < 300) {
        // 处理数据
        updateUI(xhr.response);
       
        // 继续轮询
        setTimeout(poll, interval);
      } else {
        console.error('轮询失败:', xhr.status);
        // 出错后延迟重试
        setTimeout(poll, interval * 2);
      }
    };
   
    xhr.onerror = function() {
      console.error('轮询网络错误');
      // 出错后延迟重试
      setTimeout(poll, interval * 2);
    };
   
    xhr.send();
  }
 
  // 开始轮询
  poll();
}
function updateUI(data) {
  console.log('收到新数据:', data);
  // 更新 UI 逻辑
  document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
  document.getElementById('dataCount').textContent = data.count || 0;
}
// 使用轮询
pollServerXHR('https://api.example.com/status', 3000);
```
#### 使用 Fetch API 进行轮询
```javascript
async function pollServerFetch(url, interval = 5000) {
  // 初始化轮询
  async function poll() {
    try {
      const response = await fetch(url);
     
      if (!response.ok) {
        throw new Error(`HTTP 错误: ${response.status}`);
      }
     
      const data = await response.json();
     
      // 处理数据
      updateUI(data);
     
      // 继续轮询
      setTimeout(poll, interval);
    } catch (error) {
      console.error('轮询错误:', error);
      // 出错后延迟重试
      setTimeout(poll, interval * 2);
    }
  }
 
  // 开始轮询
  poll();
}
function updateUI(data) {
  console.log('收到新数据:', data);
  // 更新 UI 逻辑
  document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
  document.getElementById('dataCount').textContent = data.count || 0;
}
// 使用轮询
pollServerFetch('https://api.example.com/status', 3000);
```
### 流式数据处理
#### 使用 Fetch API 处理流式数据
```javascript
async function streamData() {
  try {
    const response = await fetch('https://api.example.com/stream');
   
    if (!response.ok) {
      throw new Error(`HTTP 错误: ${response.status}`);
    }
   
    // 获取响应体的可读流
    const reader = response.body.getReader();
   
    // 用于存储接收到的数据块
    let receivedLength = 0;
    const chunks = [];
   
    // 读取数据流
    while (true) {
      const { done, value } = await reader.read();
     
      if (done) {
        console.log('流读取完成');
        break;
      }
     
      chunks.push(value);
      receivedLength += value.length;
     
      console.log(`接收到 ${value.length} 字节的数据，总计 ${receivedLength} 字节`);
     
      // 更新进度
      updateStreamProgress(receivedLength);
    }
   
    // 合并所有数据块
    const allChunks = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      allChunks.set(chunk, position);
      position += chunk.length;
    }
   
    // 将二进制数据转换为文本
    const result = new TextDecoder('utf-8').decode(allChunks);
    console.log('完整数据:', result);
   
    // 或者解析为 JSON
    try {
      const jsonData = JSON.parse(result);
      console.log('解析后的 JSON 数据:', jsonData);
    } catch (e) {
      console.log('数据不是有效的 JSON 格式');
    }
  } catch (error) {
    console.error('流处理错误:', error);
  }
}
function updateStreamProgress(bytesReceived) {
  document.getElementById('streamStatus').textContent = `已接收 ${Math.round(bytesReceived / 1024)} KB`;
}
// 开始流式处理
streamData();
```
## 最佳实践
### 通用最佳实践
1. **始终处理错误**：无论使用哪种 API，都要确保适当处理错误情况。
2. **使用超时机制**：为请求设置合理的超时时间，避免长时间挂起。
3. **实现重试逻辑**：对于重要请求，考虑在失败时实现自动重试机制。
```javascript
   async function fetchWithRetry(url, options = {}, maxRetries = 3) {
     let retries = 0;
     
     while (retries < maxRetries) {
       try {
         const response = await fetch(url, options);
         if (!response.ok) {
           throw new Error(`HTTP 错误: ${response.status}`);
         }
         return response;
       } catch (error) {
         retries++;
         if (retries >= maxRetries) {
           throw error; // 达到最大重试次数，重新抛出错误
         }
         
         console.log(`请求失败，${retries}/${maxRetries} 次重试`);
         // 指数退避策略
         const delay = Math.min(1000 * (2 ** retries), 10000);
         await new Promise(resolve => setTimeout(resolve, delay));
       }
     }
   }
```
4. **取消不必要的请求**：当用户导航离开或操作取消时，确保取消正在进行的请求。
5. **使用适当的 HTTP 方法**：遵循 RESTful 原则，使用正确的 HTTP 方法（GET、POST、PUT、DELETE 等）。
6. **缓存考虑**：利用 HTTP 缓存机制减少不必要的请求。
```javascript
   // 使用缓存策略
   fetch('https://api.example.com/data', {
     cache: 'force-cache' // 优先使用缓存
   });
   
   // 或者强制刷新
   fetch('https://api.example.com/data', {
     cache: 'no-cache' // 忽略缓存
   });
```
### XMLHttpRequest 最佳实践
1. **使用封装函数**：创建一个封装 XMLHttpRequest 的函数，简化重复代码。
```javascript
   function makeRequest(method, url, data = null, options = {}) {
     return new Promise((resolve, reject) => {
       const xhr = new XMLHttpRequest();
       
       xhr.open(method, url, true);
       
       // 设置默认响应类型
       xhr.responseType = options.responseType || 'json';
       
       // 设置超时
       if (options.timeout) {
         xhr.timeout = options.timeout;
       }
       
       // 设置请求头
       if (options.headers) {
         Object.keys(options.headers).forEach(key => {
           xhr.setRequestHeader(key, options.headers[key]);
         });
       }
       
       // 处理凭据
       if (options.withCredentials) {
         xhr.withCredentials = true;
       }
       
       // 事件处理
       xhr.onload = function() {
         if (xhr.status >= 200 && xhr.status < 300) {
           resolve(xhr.response);
         } else {
           reject(new Error(`请求失败: ${xhr.status}`));
         }
       };
       
       xhr.onerror = function() {
         reject(new Error('网络错误'));
       };
       
       xhr.ontimeout = function() {
         reject(new Error('请求超时'));
       };
       
       // 进度监控
       if (options.onProgress && xhr.upload) {
         xhr.upload.onprogress = options.onProgress;
       }
       
       // 发送请求
       if (data) {
         // 如果是对象且不是 FormData，转换为 JSON
         if (typeof data === 'object' && !(data instanceof FormData)) {
           xhr.setRequestHeader('Content-Type', 'application/json');
           xhr.send(JSON.stringify(data));
         } else {
           xhr.send(data);
         }
       } else {
         xhr.send();
       }
     });
   }
   
   // 使用示例
   makeRequest('GET', 'https://api.example.com/data')
     .then(data => console.log('成功:', data))
     .catch(error => console.error('错误:', error));
   
   makeRequest('POST', 'https://api.example.com/users', { name: '王五', age: 25 })
     .then(response => console.log('用户创建成功:', response))
     .catch(error => console.error('创建失败:', error));
```
2. **避免同步请求**：永远不要使用同步 XMLHttpRequest 请求（即 `xhr.open(method, url, false)`），它会阻塞主线程，导致糟糕的用户体验。
3. **使用适当的事件处理**：根据需要选择正确的事件处理器（onload、onerror、onprogress 等）。
4. **正确处理二进制数据**：使用适当的响应类型（如 'arraybuffer' 或 'blob'）处理二进制响应。
### Fetch API 最佳实践
1. **检查响应状态**：Fetch 不会将 HTTP 错误状态视为 JavaScript 错误，需要手动检查。
```javascript
   fetch('https://api.example.com/data')
     .then(response => {
       if (!response.ok) {
         throw new Error(`HTTP 错误: ${response.status}`);
       }
       return response.json();
     })
     .then(data => console.log('数据:', data))
     .catch(error => console.error('错误:', error));
```
2. **创建可复用的 fetch 包装函数**：
```javascript
   async function fetchAPI(url, options = {}) {
     const defaultOptions = {
       headers: {
         'Content-Type': 'application/json',
         'Accept': 'application/json'
       },
       // 默认超时 30 秒
       timeout: 30000
     };
     
     // 合并选项
     const mergedOptions = { ...defaultOptions, ...options };
     
     // 如果有 body 且是对象，转换为 JSON
     if (mergedOptions.body && typeof mergedOptions.body === 'object') {
       mergedOptions.body = JSON.stringify(mergedOptions.body);
     }
     
     // 实现超时
     const controller = new AbortController();
     const timeoutId = setTimeout(() => controller.abort(), mergedOptions.timeout);
     mergedOptions.signal = controller.signal;
     
     try {
       const response = await fetch(url, mergedOptions);
       clearTimeout(timeoutId);
       
       if (!response.ok) {
         const errorBody = await response.text();
         throw new Error(`HTTP 错误 ${response.status}: ${errorBody}`);
       }
       
       // 根据内容类型选择解析方法
       const contentType = response.headers.get('Content-Type') || '';
       if (contentType.includes('application/json')) {
         return await response.json();
       } else if (contentType.includes('text/')) {
         return await response.text();
       } else {
         return await response.blob();
       }
     } catch (error) {
       clearTimeout(timeoutId);
       if (error.name === 'AbortError') {
         throw new Error(`请求超时（${mergedOptions.timeout}ms）`);
       }
       throw error;
     }
   }
   
   // 使用示例
   async function getUser(id) {
     try {
       return await fetchAPI(`https://api.example.com/users/${id}`);
     } catch (error) {
       console.error('获取用户失败:', error);
       throw error;
     }
   }
   
   async function createUser(userData) {
     try {
       return await fetchAPI('https://api.example.com/users', {
         method: 'POST',
         body: userData
       });
     } catch (error) {
       console.error('创建用户失败:', error);
       throw error;
     }
   }
```
3. **正确处理 JSON 数据**：
```javascript
   // 发送 JSON 数据
   fetch('https://api.example.com/data', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json'
     },
     body: JSON.stringify({ key: 'value' })
   });
   
   // 接收 JSON 数据
   fetch('https://api.example.com/data')
     .then(response => {
       if (!response.ok) {
         throw new Error(`HTTP 错误: ${response.status}`);
       }
       return response.json();
     })
     .then(data => console.log(data))
     .catch(error => console.error('错误:', error));
```
4. **使用 async/await 简化代码**：
```javascript
   async function fetchData() {
     try {
       const response = await fetch('https://api.example.com/data');
       
       if (!response.ok) {
         throw new Error(`HTTP 错误: ${response.status}`);
       }
       
       const data = await response.json();
       return data;
     } catch (error) {
       console.error('获取数据失败:', error);
       throw error; // 重新抛出错误以便调用者处理
     }
   }
```
5. **合理使用 AbortController**：
```javascript
   // 创建一个可以在多个请求间共享的控制器
   const controller = new AbortController();
   const signal = controller.signal;
   
   // 发起多个请求
   const fetchUsers = fetch('/api/users', { signal });
   const fetchProducts = fetch('/api/products', { signal });
   
   // 可以一次性取消所有请求
   document.querySelector('#cancelButton').addEventListener('click', () => {
     controller.abort();
   });
   
   // 处理请求
   Promise.all([
     fetchUsers.then(r => r.json()).catch(e => {
       if (e.name === 'AbortError') return { aborted: true };
       throw e;
     }),
     fetchProducts.then(r => r.json()).catch(e => {
       if (e.name === 'AbortError') return { aborted: true };
       throw e;
     })
   ])
   .then(([users, products]) => {
     if (users.aborted || products.aborted) {
       console.log('请求被取消');
       return;
     }
     // 处理数据
   })
   .catch(error => console.error('错误:', error));
```
## 浏览器兼容性
### XMLHttpRequest 兼容性
XMLHttpRequest 在几乎所有现代浏览器中都得到支持，包括：
- Chrome
- Firefox
- Safari
- Edge
- Internet Explorer 7+（基本功能）
- Internet Explorer 10+（完整功能）
但是，某些高级功能（如进度事件、响应类型等）在旧版浏览器中可能不可用。
### Fetch API 兼容性
Fetch API 是一个较新的标准，支持情况如下：
- Chrome 42+
- Firefox 39+
- Safari 10.1+
- Edge 14+
- 不支持 Internet Explorer
对于需要支持旧浏览器的项目，可以使用 Fetch polyfill：
```html
<script src="https://cdn.jsdelivr.net/npm/whatwg-fetch@3.6.2/dist/fetch.umd.min.js"></script>
```
或者通过 npm 安装：
```bash
npm install whatwg-fetch
```
然后在代码中导入：
```javascript
import 'whatwg-fetch';
```
## 总结
HTML5 扩展的 XMLHttpRequest 和 Fetch API 为 Web 开发者提供了强大的网络通信能力，使得创建动态、交互式的 Web 应用成为可能。
### XMLHttpRequest 总结
- 成熟稳定，浏览器支持广泛
- 提供详细的进度事件和状态控制
- 语法相对复杂，基于事件回调
- 适合需要精细控制请求过程或需要支持旧浏览器的场景
### Fetch API 总结
- 现代、简洁的 Promise 基础 API
- 与现代 JavaScript 特性（如 async/await）无缝集成
- 提供更灵活的请求控制和响应处理
- 内置支持流式数据
- 不支持 IE，但可以通过 polyfill 解决
### 选择建议
1. **新项目**：优先选择 Fetch API，它提供了更现代、更简洁的 API，并且与现代 JavaScript 特性更好地集成。
2. **需要支持旧浏览器**：使用 XMLHttpRequest 或为 Fetch API 添加 polyfill。
3. **需要详细进度监控**：XMLHttpRequest 提供了更简单的进度事件支持。
4. **处理流式数据**：Fetch API 的流处理能力更强。
无论选择哪种 API，都应该遵循最佳实践，包括适当的错误处理、超时控制和用户体验考虑。随着 Web 标准的发展，Fetch API 正在成为异步网络请求的首选方法，但 XMLHttpRequest 在特定场景下仍然有其价值。
## 参考资源
- [MDN Web Docs: XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest)
- [MDN Web Docs: Fetch API](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API)
- [MDN Web Docs: 使用 Fetch](https://developer.mozilla.org/zh-CN/docs/Web/API/Fetch_API/Using_Fetch)
- [MDN Web Docs: FormData](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)
- [MDN Web Docs: 使用 XMLHttpRequest](https://developer.mozilla.org/zh-CN/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest)
- [MDN Web Docs: CORS](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/CORS)
- [Fetch Standard](https://fetch.spec.whatwg.org/)
- [JavaScript.info: 网络请求](https://zh.javascript.info/network)