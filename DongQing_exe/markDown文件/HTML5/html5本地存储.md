# HTML5 本地存储详解

## 目录

- [概述](#概述)
- [localStorage](#localstorage)
- [sessionStorage](#sessionstorage)
- [IndexedDB](#indexeddb)
- [Web SQL](#web-sql)
- [Cookies](#cookies)
- [本地存储对比](#本地存储对比)
- [最佳实践](#最佳实践)
- [安全考虑](#安全考虑)

## 概述

HTML5 引入了多种本地存储方案，使网页应用能够在客户端存储数据，从而提高性能、减少服务器负载，并支持离线应用功能。本文将详细介绍这些存储方案的特点、用法和适用场景。

在 HTML5 之前，网页存储数据主要依赖 Cookies，但 Cookies 存在诸多限制，如容量小（通常限制为 4KB）、每次 HTTP 请求都会发送到服务器（增加流量）等。HTML5 本地存储技术解决了这些问题，提供了更大的存储空间和更灵活的 API。

## localStorage

### 概念

localStorage 是一种持久化的本地存储方式，数据存储在浏览器中，即使关闭浏览器窗口或重启电脑，数据仍然存在，除非被明确删除。

### 特点

- **持久存储**：数据永久保存，除非手动删除
- **容量大**：通常为 5MB 左右（各浏览器略有不同）
- **同源策略**：只能访问来自同一域名、同一协议、同一端口的数据
- **同步 API**：操作会阻塞主线程
- **仅支持字符串**：存储的值会被转换为字符串

### 基本用法

```javascript
// 存储数据
localStorage.setItem('username', '张三');

// 读取数据
const username = localStorage.getItem('username');
console.log(username); // 输出: 张三

// 删除特定数据
localStorage.removeItem('username');

// 清空所有数据
localStorage.clear();

// 获取存储项数量
const count = localStorage.length;
console.log(`当前有 ${count} 个存储项`);

// 获取指定索引的键名
const keyName = localStorage.key(0); // 获取第一个键名
```

### 存储复杂数据类型

由于 localStorage 只能存储字符串，存储复杂数据类型（如对象、数组）需要使用 JSON 转换：

```javascript
// 存储对象
const user = {
  name: '张三',
  age: 30,
  skills: ['HTML', 'CSS', 'JavaScript']
};

localStorage.setItem('user', JSON.stringify(user));

// 读取对象
const storedUser = JSON.parse(localStorage.getItem('user'));
console.log(storedUser.name); // 输出: 张三
console.log(storedUser.skills[2]); // 输出: JavaScript
```

### 实际应用示例：记住用户主题偏好

```javascript
// 设置主题函数
function setTheme(themeName) {
  // 保存主题设置到 localStorage
  localStorage.setItem('theme', themeName);
  
  // 应用主题
  document.body.className = themeName;
}

// 加载主题函数
function loadTheme() {
  // 获取保存的主题，如果没有则使用默认主题 'light'
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // 应用主题
  document.body.className = savedTheme;
}

// 页面加载时恢复主题设置
document.addEventListener('DOMContentLoaded', loadTheme);

// 主题切换按钮事件
document.getElementById('themeToggle').addEventListener('click', function() {
  const currentTheme = localStorage.getItem('theme') || 'light';
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
});
```

## sessionStorage

### 概念

sessionStorage 与 localStorage 类似，但数据只在当前会话（session）期间有效，关闭标签页或浏览器窗口后数据会被清除。

### 特点

- **会话期间存储**：数据在会话结束后自动清除
- **容量大**：通常为 5MB 左右
- **同源策略**：只能访问来自同一域名、同一协议、同一端口的数据
- **标签页隔离**：不同标签页之间的 sessionStorage 数据互不影响
- **同步 API**：操作会阻塞主线程
- **仅支持字符串**：存储的值会被转换为字符串

### 基本用法

```javascript
// 存储数据
sessionStorage.setItem('tempData', '临时数据');

// 读取数据
const tempData = sessionStorage.getItem('tempData');
console.log(tempData); // 输出: 临时数据

// 删除特定数据
sessionStorage.removeItem('tempData');

// 清空所有数据
sessionStorage.clear();
```

### 实际应用示例：表单数据暂存

```javascript
// 监听表单输入，实时保存到 sessionStorage
document.querySelectorAll('form input, form textarea').forEach(element => {
  // 初始加载时恢复数据
  const savedValue = sessionStorage.getItem(element.id);
  if (savedValue) {
    element.value = savedValue;
  }
  
  // 监听输入事件，保存数据
  element.addEventListener('input', function() {
    sessionStorage.setItem(this.id, this.value);
  });
});

// 表单提交后清除暂存数据
document.querySelector('form').addEventListener('submit', function() {
  sessionStorage.clear();
});
```

## IndexedDB

### 概念

IndexedDB 是一个低级 API，用于客户端存储大量结构化数据，包括文件和二进制数据。它使用索引实现高性能搜索，是一个事务型数据库系统，类似于基于 SQL 的 RDBMS。

### 特点

- **大容量存储**：通常没有固定上限，但浏览器可能会要求用户授权
- **支持复杂数据类型**：可以存储几乎任何类型的 JavaScript 对象
- **异步 API**：不会阻塞主线程
- **支持事务**：确保数据完整性
- **支持索引**：可以高效查询数据
- **同源策略**：只能访问来自同一域名、同一协议、同一端口的数据

### 基本用法

```javascript
// 打开数据库
const request = indexedDB.open('myDatabase', 1);

// 处理数据库升级（首次创建或版本更新时触发）
request.onupgradeneeded = function(event) {
  const db = event.target.result;
  
  // 创建对象仓库（类似于表）
  const objectStore = db.createObjectStore('customers', { keyPath: 'id', autoIncrement: true });
  
  // 创建索引
  objectStore.createIndex('name', 'name', { unique: false });
  objectStore.createIndex('email', 'email', { unique: true });
};

// 数据库打开成功
request.onsuccess = function(event) {
  const db = event.target.result;
  console.log('数据库打开成功');
  
  // 添加数据
  function addCustomer(customer) {
    const transaction = db.transaction(['customers'], 'readwrite');
    const objectStore = transaction.objectStore('customers');
    const request = objectStore.add(customer);
    
    request.onsuccess = function() {
      console.log('数据添加成功');
    };
    
    transaction.oncomplete = function() {
      console.log('事务完成');
    };
    
    transaction.onerror = function(event) {
      console.error('事务错误:', event.target.error);
    };
  }
  
  // 查询数据
  function getCustomerByEmail(email) {
    const transaction = db.transaction(['customers'], 'readonly');
    const objectStore = transaction.objectStore('customers');
    const index = objectStore.index('email');
    const request = index.get(email);
    
    request.onsuccess = function() {
      if (request.result) {
        console.log('查询结果:', request.result);
      } else {
        console.log('未找到匹配记录');
      }
    };
  }
  
  // 使用示例
  addCustomer({ name: '李四', email: 'lisi@example.com', age: 28 });
  getCustomerByEmail('lisi@example.com');
};

// 处理错误
request.onerror = function(event) {
  console.error('数据库错误:', event.target.error);
};
```

### 实际应用示例：离线待办事项应用

```javascript
// 初始化数据库
function initDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TodoApp', 1);
    
    request.onupgradeneeded = function(event) {
      const db = event.target.result;
      const store = db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
      store.createIndex('completed', 'completed', { unique: false });
    };
    
    request.onsuccess = function(event) {
      resolve(event.target.result);
    };
    
    request.onerror = function(event) {
      reject('IndexedDB 错误: ' + event.target.errorCode);
    };
  });
}

// 添加待办事项
async function addTodo(title) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');
    const todo = {
      title: title,
      completed: false,
      createdAt: new Date().getTime()
    };
    
    const request = store.add(todo);
    
    request.onsuccess = function(event) {
      resolve(event.target.result); // 返回新添加的 ID
    };
    
    request.onerror = function(event) {
      reject('添加失败: ' + event.target.errorCode);
    };
  });
}

// 获取所有待办事项
async function getAllTodos() {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['todos'], 'readonly');
    const store = transaction.objectStore('todos');
    const request = store.getAll();
    
    request.onsuccess = function(event) {
      resolve(event.target.result);
    };
    
    request.onerror = function(event) {
      reject('获取失败: ' + event.target.errorCode);
    };
  });
}

// 更新待办事项状态
async function toggleTodoStatus(id) {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['todos'], 'readwrite');
    const store = transaction.objectStore('todos');
    const request = store.get(id);
    
    request.onsuccess = function(event) {
      const todo = event.target.result;
      todo.completed = !todo.completed;
      
      const updateRequest = store.put(todo);
      updateRequest.onsuccess = function() {
        resolve(true);
      };
    };
    
    request.onerror = function(event) {
      reject('更新失败: ' + event.target.errorCode);
    };
  });
}

// 使用示例
async function demo() {
  try {
    await addTodo('学习 IndexedDB');
    await addTodo('完成项目');
    const todos = await getAllTodos();
    console.log('所有待办事项:', todos);
    
    if (todos.length > 0) {
      await toggleTodoStatus(todos[0].id);
      console.log('更新后的待办事项:', await getAllTodos());
    }
  } catch (error) {
    console.error(error);
  }
}

demo();
```

## Web SQL

### 概念

Web SQL 是一个已废弃的 Web API，它提供了一个类似 SQL 的数据库，允许使用 SQL 查询语言操作客户端数据库。尽管 W3C 已停止维护此规范，但许多浏览器仍然支持它。

> **注意**：由于 Web SQL 已被废弃，建议在新项目中使用 IndexedDB。

### 特点

- **SQL 语法**：使用熟悉的 SQL 语句操作数据
- **事务支持**：确保数据完整性
- **异步 API**：不会阻塞主线程
- **容量限制**：通常为 5MB 左右，但可以请求更多空间
- **已废弃**：W3C 不再维护此规范

### 基本用法

```javascript
// 打开数据库（参数：数据库名称，版本，描述，大小（字节），回调函数）
const db = openDatabase('mydb', '1.0', '我的数据库', 2 * 1024 * 1024, function(db) {
  console.log('数据库创建/打开成功');
});

// 执行 SQL 语句
db.transaction(function(tx) {
  // 创建表
  tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE)');
  
  // 插入数据
  tx.executeSql('INSERT INTO users (name, email) VALUES (?, ?)', ['王五', 'wangwu@example.com'], 
    function(tx, results) {
      console.log('插入成功，新行ID:', results.insertId);
    },
    function(tx, error) {
      console.error('插入失败:', error.message);
    }
  );
  
  // 查询数据
  tx.executeSql('SELECT * FROM users', [], 
    function(tx, results) {
      const len = results.rows.length;
      console.log('查询到 ' + len + ' 条记录');
      
      for (let i = 0; i < len; i++) {
        console.log('用户 ' + i + ':', results.rows.item(i));
      }
    },
    function(tx, error) {
      console.error('查询失败:', error.message);
    }
  );
});
```

### 实际应用示例：简单的联系人管理

```javascript
// 初始化数据库和表
function initDatabase() {
  const db = openDatabase('contactsDB', '1.0', '联系人数据库', 2 * 1024 * 1024);
  
  db.transaction(function(tx) {
    tx.executeSql(`
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT,
        email TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
  
  return db;
}

// 添加联系人
function addContact(name, phone, email) {
  const db = initDatabase();
  
  return new Promise((resolve, reject) => {
    db.transaction(function(tx) {
      tx.executeSql(
        'INSERT INTO contacts (name, phone, email) VALUES (?, ?, ?)',
        [name, phone, email],
        function(tx, results) {
          resolve(results.insertId);
        },
        function(tx, error) {
          reject(error.message);
        }
      );
    });
  });
}

// 获取所有联系人
function getAllContacts() {
  const db = initDatabase();
  
  return new Promise((resolve, reject) => {
    db.transaction(function(tx) {
      tx.executeSql(
        'SELECT * FROM contacts ORDER BY name',
        [],
        function(tx, results) {
          const contacts = [];
          const len = results.rows.length;
          
          for (let i = 0; i < len; i++) {
            contacts.push(results.rows.item(i));
          }
          
          resolve(contacts);
        },
        function(tx, error) {
          reject(error.message);
        }
      );
    });
  });
}

// 搜索联系人
function searchContacts(query) {
  const db = initDatabase();
  
  return new Promise((resolve, reject) => {
    db.transaction(function(tx) {
      tx.executeSql(
        'SELECT * FROM contacts WHERE name LIKE ? OR phone LIKE ? OR email LIKE ?',
        [`%${query}%`, `%${query}%`, `%${query}%`],
        function(tx, results) {
          const contacts = [];
          const len = results.rows.length;
          
          for (let i = 0; i < len; i++) {
            contacts.push(results.rows.item(i));
          }
          
          resolve(contacts);
        },
        function(tx, error) {
          reject(error.message);
        }
      );
    });
  });
}

// 使用示例
async function demo() {
  try {
    await addContact('张三', '13800138000', 'zhangsan@example.com');
    await addContact('李四', '13900139000', 'lisi@example.com');
    
    const allContacts = await getAllContacts();
    console.log('所有联系人:', allContacts);
    
    const searchResults = await searchContacts('张');
    console.log('搜索结果:', searchResults);
  } catch (error) {
    console.error('操作失败:', error);
  }
}

demo();
```

## Cookies

### 概念

Cookie 是存储在用户浏览器中的小型文本文件，最初设计用于在 HTTP 请求之间保持状态信息。虽然 HTML5 引入了更现代的存储方案，但 Cookie 仍然在某些场景下有其独特的用途，特别是需要与服务器交互的场景。

### 特点

- **容量小**：通常限制为 4KB
- **请求附带**：每次 HTTP 请求都会将 Cookie 发送到服务器
- **可设置过期时间**：可以是会话期间或指定日期
- **可限制访问路径**：可以指定 Cookie 对哪些路径有效
- **可设置安全标志**：可以限制只在 HTTPS 连接中发送
- **可设置域**：可以指定 Cookie 对哪些域名有效

### 基本用法

```javascript
// 设置 Cookie
document.cookie = "username=张三; expires=Fri, 31 Dec 2023 23:59:59 GMT; path=/";

// 设置带有更多选项的 Cookie
document.cookie = "preference=dark; max-age=31536000; path=/; secure; samesite=strict";

// 读取所有 Cookie
console.log(document.cookie); // 输出所有可访问的 cookie 字符串

// 解析 Cookie
function getCookie(name) {
  const cookieArr = document.cookie.split(';');
  
  for (let i = 0; i < cookieArr.length; i++) {
    const cookiePair = cookieArr[i].split('=');
    const cookieName = cookiePair[0].trim();
    
    if (cookieName === name) {
      return decodeURIComponent(cookiePair[1]);
    }
  }
  
  return null;
}

// 删除 Cookie（通过设置过期时间为过去的时间）
function deleteCookie(name) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
}

// 使用示例
console.log(getCookie('username')); // 输出: 张三
deleteCookie('username');
```

### Cookie 选项说明

| 选项 | 描述 | 示例 |
|------|------|------|
| `expires` | 设置 Cookie 的过期日期 | `expires=Fri, 31 Dec 2023 23:59:59 GMT` |
| `max-age` | 设置 Cookie 的有效期（秒） | `max-age=31536000`（一年） |
| `path` | 指定 Cookie 的有效路径 | `path=/admin`（仅在 /admin 路径下有效） |
| `domain` | 指定 Cookie 的有效域名 | `domain=example.com` |
| `secure` | 仅在 HTTPS 连接中发送 | `secure` |
| `samesite` | 控制跨站请求时是否发送 | `samesite=strict`（仅同站点请求发送） |
| `httpOnly` | 禁止 JavaScript 访问（仅服务器设置） | `httpOnly`（客户端 JavaScript 无法设置） |

### 实际应用示例：用户偏好设置

```javascript
// Cookie 工具函数
const CookieUtil = {
  // 设置 Cookie
  set: function(name, value, options = {}) {
    let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
    
    // 添加过期时间
    if (options.expires instanceof Date) {
      cookie += `; expires=${options.expires.toUTCString()}`;
    } else if (typeof options.maxAge === 'number') {
      cookie += `; max-age=${options.maxAge}`;
    }
    
    // 添加路径
    if (options.path) {
      cookie += `; path=${options.path}`;
    }
    
    // 添加域名
    if (options.domain) {
      cookie += `; domain=${options.domain}`;
    }
    
    // 添加安全标志
    if (options.secure) {
      cookie += '; secure';
    }
    
    // 添加 SameSite 设置
    if (options.sameSite) {
      cookie += `; samesite=${options.sameSite}`;
    }
    
    document.cookie = cookie;
  },
  
  // 获取 Cookie
  get: function(name) {
    const cookieArr = document.cookie.split(';');
    
    for (let i = 0; i < cookieArr.length; i++) {
      const cookiePair = cookieArr[i].split('=');
      const cookieName = decodeURIComponent(cookiePair[0].trim());
      
      if (cookieName === name) {
        return decodeURIComponent(cookiePair[1]);
      }
    }
    
    return null;
  },
  
  // 删除 Cookie
  delete: function(name, options = {}) {
    options.expires = new Date(0); // 设置为过去的时间
    this.set(name, '', options);
  }
};

// 使用示例：保存用户偏好设置
function saveUserPreferences() {
  const theme = document.getElementById('themeSelect').value;
  const fontSize = document.getElementById('fontSizeSelect').value;
  
  // 保存设置，有效期一年
  CookieUtil.set('userTheme', theme, { maxAge: 31536000, path: '/' });
  CookieUtil.set('userFontSize', fontSize, { maxAge: 31536000, path: '/' });
  
  alert('偏好设置已保存');
}

// 加载用户偏好设置
function loadUserPreferences() {
  const theme = CookieUtil.get('userTheme') || 'light';
  const fontSize = CookieUtil.get('userFontSize') || 'medium';
  
  // 应用设置
  document.getElementById('themeSelect').value = theme;
  document.getElementById('fontSizeSelect').value = fontSize;
  
  // 更新页面样式
  document.body.className = theme;
  document.body.style.fontSize = fontSize === 'small' ? '14px' : fontSize === 'medium' ? '16px' : '18px';
}

// 页面加载时应用设置
document.addEventListener('DOMContentLoaded', loadUserPreferences);

// 保存按钮点击事件
document.getElementById('savePreferences').addEventListener('click', saveUserPreferences);
```

## 本地存储对比

下表比较了不同本地存储方案的主要特点：

| 特性 | localStorage | sessionStorage | IndexedDB | Web SQL | Cookies |
|------|-------------|---------------|-----------|---------|---------|
| **数据持久性** | 永久，除非手动删除 | 会话期间 | 永久，除非手动删除 | 永久，除非手动删除 | 可设置过期时间 |
| **存储容量** | ~5MB | ~5MB | 无固定限制 | ~5MB（可请求更多） | ~4KB |
| **与服务器通信** | 否 | 否 | 否 | 否 | 是（每次请求） |
| **API 复杂度** | 简单 | 简单 | 复杂 | 中等 | 简单但繁琐 |
| **数据类型支持** | 字符串 | 字符串 | 几乎所有类型 | 支持 SQL 数据类型 | 字符串 |
| **索引支持** | 否 | 否 | 是 | 是 | 否 |
| **事务支持** | 否 | 否 | 是 | 是 | 否 |
| **同步/异步** | 同步 | 同步 | 异步 | 异步 | 同步 |
| **浏览器支持** | 很好 | 很好 | 很好 | 部分（已废弃） | 全部 |
| **适用场景** | 简单数据存储 | 临时数据存储 | 复杂/大量数据 | 复杂查询（不推荐） | 服务器通信 |

## 最佳实践

### 选择合适的存储方案

- **简单数据，无需持久化**：使用 sessionStorage
- **简单数据，需要持久化**：使用 localStorage
- **复杂或大量数据**：使用 IndexedDB
- **需要与服务器交互的数据**：使用 Cookies（仅必要信息）

### localStorage 和 sessionStorage 最佳实践

1. **避免存储敏感信息**：本地存储不加密，不要存储密码等敏感信息

2. **处理存储限制**：
   ```javascript
   try {
     localStorage.setItem('key', 'value');
   } catch (e) {
     if (e.name === 'QuotaExceededError') {
       alert('存储空间已满，请清理一些数据');
       // 可以尝试清理一些不重要的数据
       localStorage.removeItem('less-important-data');
     }
   }
   ```

3. **使用命名空间**：避免命名冲突
   ```javascript
   // 使用前缀作为简单的命名空间
   localStorage.setItem('myApp.settings.theme', 'dark');
   localStorage.setItem('myApp.user.id', '12345');
   ```

4. **批量操作**：减少 JSON 解析和序列化次数
   ```javascript
   // 不好的做法：频繁读写
   const settings = JSON.parse(localStorage.getItem('settings')) || {};
   settings.theme = 'dark';
   localStorage.setItem('settings', JSON.stringify(settings));
   settings.fontSize = 'large';
   localStorage.setItem('settings', JSON.stringify(settings));
   
   // 好的做法：批量修改后一次性保存
   const settings = JSON.parse(localStorage.getItem('settings')) || {};
   settings.theme = 'dark';
   settings.fontSize = 'large';
   localStorage.setItem('settings', JSON.stringify(settings));
   ```

5. **使用包装库**：简化操作和错误处理
   ```javascript
   // 简单的 localStorage 包装库
   const Storage = {
     get: function(key, defaultValue = null) {
       try {
         const item = localStorage.getItem(key);
         return item ? JSON.parse(item) : defaultValue;
       } catch (e) {
         console.error('Storage.get error:', e);
         return defaultValue;
       }
     },
     
     set: function(key, value) {
       try {
         localStorage.setItem(key, JSON.stringify(value));
         return true;
       } catch (e) {
         console.error('Storage.set error:', e);
         return false;
       }
     },
     
     remove: function(key) {
       try {
         localStorage.removeItem(key);
         return true;
       } catch (e) {
         console.error('Storage.remove error:', e);
         return false;
       }
     },
     
     clear: function() {
       try {
         localStorage.clear();
         return true;
       } catch (e) {
         console.error('Storage.clear error:', e);
         return false;
       }
     }
   };
   
   // 使用示例
   Storage.set('user', { name: '张三', age: 30 });
   const user = Storage.get('user');
   ```

### IndexedDB 最佳实践

1. **使用 Promise 包装**：简化异步操作
   ```javascript
   // 打开数据库的 Promise 包装
   function openDB(name, version) {
     return new Promise((resolve, reject) => {
       const request = indexedDB.open(name, version);
       
       request.onupgradeneeded = (event) => {
         // 处理数据库升级逻辑
       };
       
       request.onsuccess = (event) => {
         resolve(event.target.result);
       };
       
       request.onerror = (event) => {
         reject(event.target.error);
       };
     });
   }
   ```

2. **使用事务**：确保数据完整性
   ```javascript
   // 使用事务进行多个操作
   function performBatchOperations(db, operations) {
     return new Promise((resolve, reject) => {
       const transaction = db.transaction(['store'], 'readwrite');
       const store = transaction.objectStore('store');
       
       let completed = 0;
       
       operations.forEach(operation => {
         const request = store.add(operation);
         request.onsuccess = () => {
           completed++;
           if (completed === operations.length) {
             resolve();
           }
         };
       });
       
       transaction.oncomplete = () => {
         resolve();
       };
       
       transaction.onerror = (event) => {
         reject(event.target.error);
       };
     });
   }
   ```

3. **版本管理**：处理数据库架构变更
   ```javascript
   function setupDatabase(db, oldVersion, newVersion) {
     // 根据版本号执行不同的升级操作
     if (oldVersion < 1) {
       // 首次创建
       const store = db.createObjectStore('users', { keyPath: 'id' });
       store.createIndex('email', 'email', { unique: true });
     }
     
     if (oldVersion < 2) {
       // 版本 2 的升级：添加新索引
       const store = db.transaction.objectStore('users');
       store.createIndex('name', 'name', { unique: false });
     }
     
     if (oldVersion < 3) {
       // 版本 3 的升级：添加新存储
       const store = db.createObjectStore('orders', { keyPath: 'id', autoIncrement: true });
       store.createIndex('userId', 'userId', { unique: false });
     }
   }
   ```

### Cookies 最佳实践

1. **最小化 Cookie 大小**：仅存储必要信息，减少网络负载
2. **使用 HttpOnly 标志**：防止 XSS 攻击获取敏感 Cookie
3. **使用 Secure 标志**：确保 Cookie 仅通过 HTTPS 发送
4. **使用 SameSite 属性**：防止 CSRF 攻击
5. **设置合理的过期时间**：避免 Cookie 过早失效或长期存在

## 安全考虑

### 通用安全注意事项

1. **不存储敏感信息**：本地存储机制通常不加密，不应存储密码、信用卡信息等敏感数据
2. **验证存储的数据**：从存储中读取数据时进行验证，防止 XSS 攻击
3. **考虑同源策略限制**：本地存储受同源策略限制，不同域名、协议或端口无法访问彼此的存储
4. **防范 XSS 攻击**：避免将未经验证的用户输入直接存储或从存储中读取后直接插入 DOM

### localStorage 和 sessionStorage 安全

```javascript
// 不安全的做法：直接存储用户输入
localStorage.setItem('userNote', document.getElementById('userInput').value);
document.getElementById('notes').innerHTML = localStorage.getItem('userNote');

// 安全的做法：存储前进行编码，使用前进行解码
function encodeHTML(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
}

// 存储时编码
localStorage.setItem('userNote', encodeHTML(document.getElementById('userInput').value));

// 使用时安全地插入
document.getElementById('notes').textContent = localStorage.getItem('userNote');
// 或者使用 innerText 而不是 innerHTML
document.getElementById('notes').innerText = localStorage.getItem('userNote');
```

### IndexedDB 安全

1. **验证输入数据**：在存储前验证和清理数据
2. **使用内容安全策略（CSP）**：限制可执行的脚本来源
3. **定期清理不需要的数据**：不要无限期存储用户数据

### Cookies 安全

1. **使用 HttpOnly 标志**：防止 JavaScript 访问 Cookie
   ```
   Set-Cookie: sessionId=abc123; HttpOnly
   ```

2. **使用 Secure 标志**：仅通过 HTTPS 发送 Cookie
   ```
   Set-Cookie: sessionId=abc123; Secure
   ```

3. **使用 SameSite 属性**：控制跨站请求时是否发送 Cookie
   ```
   Set-Cookie: sessionId=abc123; SameSite=Strict
   ```

4. **设置合适的域和路径**：限制 Cookie 的可用范围
   ```
   Set-Cookie: sessionId=abc123; Domain=example.com; Path=/account
   ```

## 结论

HTML5 本地存储技术为 Web 应用提供了强大的客户端数据存储能力，从简单的键值对存储（localStorage 和 sessionStorage）到复杂的结构化数据存储（IndexedDB）。选择合适的存储方案取决于应用需求、数据复杂性和持久性要求。

在实际应用中，可以组合使用不同的存储技术：
- 使用 localStorage 存储用户偏好和设置
- 使用 sessionStorage 存储临时会话数据
- 使用 IndexedDB 存储大量结构化数据
- 使用 Cookies 存储需要与服务器交互的认证信息

无论选择哪种存储方案，都应该注意安全性，避免存储敏感信息，并防范常见的 Web 安全威胁。

## 参考资源

- [MDN Web Docs: Web Storage API](https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Storage_API)
- [MDN Web Docs: IndexedDB API](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API)
- [MDN Web Docs: HTTP cookies](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Cookies)
- [Web SQL Database](https://www.w3.org/TR/webdatabase/)
- [HTML Living Standard: Storage](https://html.spec.whatwg.org/multipage/webstorage.html)