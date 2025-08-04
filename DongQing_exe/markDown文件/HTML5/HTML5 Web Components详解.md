# HTML5 Web Components 详解

Web Components 是一套不同的浏览器技术，允许您创建可重用的自定义元素，这些元素的功能封装在代码的其余部分中，并且可以在 Web 应用程序中使用。Web Components 标准由四个主要技术组成：Custom Elements、Shadow DOM、HTML Templates 和 ES Modules。

## 目录
1. [概述](#概述)
2. [HTML Templates](#html-templates)
3. [Shadow DOM](#shadow-dom)
4. [Custom Elements](#custom-elements)
5. [ES Modules](#es-modules)
6. [高级Web Components技术](#高级web-components技术)
7. [Web Components与框架集成](#web-components与框架集成)
8. [性能优化](#性能优化)
9. [安全考虑](#安全考虑)
10. [调试和测试](#调试和测试)
11. [设计模式](#设计模式)
12. [完整示例](#完整示例)
13. [最佳实践](#最佳实践)
14. [浏览器兼容性](#浏览器兼容性)
15. [Web Components生态系统](#web-components生态系统)
16. [未来发展](#未来发展)

## 概述

Web Components 是一套用于创建可重用自定义元素的 Web 平台 API，这些元素具有封装功能，可以在不考虑框架的情况下在任何现代浏览器中使用。Web Components 使开发人员能够：

- 创建可重用的自定义 HTML 元素
- 封装组件的样式和行为
- 构建模块化、可维护的 Web 应用程序

Web Components 的四个核心技术：
1. **Custom Elements** - 定义新的 HTML 元素
2. **Shadow DOM** - 封装组件的样式和标记
3. **HTML Templates** - 定义可重用的标记结构
4. **ES Modules** - 组织和重用代码

### Web Components 的历史发展

Web Components 的概念最早在 2011 年由 Alex Russell 提出。自那时起，这项技术经历了多个发展阶段：

1. **2011年** - Alex Russell 首次提出 Web Components 概念
2. **2013年** - W3C 发布第一版规范草案
3. **2014年** - Chrome 35 开始原生支持
4. **2016年** - 各大浏览器厂商开始逐步实现
5. **2018年** - 现代浏览器基本完成支持

### Web Components 的优势

1. **原生支持**
   - 不需要额外的框架或库
   - 基于 Web 标准，浏览器原生支持
   - 无需担心版本更新和兼容性问题

2. **封装性**
   - Shadow DOM 提供样式和标记的封装
   - 防止样式冲突和脚本干扰
   - 实现真正的组件隔离

3. **可重用性**
   - 可以在任何 HTML 页面中使用
   - 支持属性配置和事件通信
   - 便于构建组件库和设计系统

4. **互操作性**
   - 与任何框架兼容
   - 可以在 React、Vue、Angular 等框架中使用
   - 支持服务器端渲染

5. **标准化**
   - 基于 Web 标准
   - 获得各大浏览器厂商支持
   - 具有长期稳定性和可维护性

### Web Components 的局限性

1. **浏览器兼容性**
   - 在旧浏览器中需要 polyfills
   - IE 浏览器支持有限
   - 部分高级特性支持不一致

2. **学习曲线**
   - 需要理解多个概念
   - 与其他框架的集成需要额外学习
   - 调试技巧需要专门掌握

3. **调试复杂性**
   - Shadow DOM 可能增加调试难度
   - 浏览器开发者工具支持有限
   - 性能分析工具不够完善

4. **SEO 考虑**
   - 某些搜索引擎可能无法正确索引动态内容
   - 需要额外的服务器端渲染支持
   - 社交媒体分享可能存在问题

### Web Components 与其他技术的比较

#### 与 React 的比较

| 特性 | Web Components | React |
|------|----------------|-------|
| 学习曲线 | 中等 | 中等 |
| 封装性 | 强 | 中等 |
| 大小 | 轻量 | 较重 |
| 性能 | 高 | 高 |
| 生态系统 | 发展中 | 成熟 |
| 浏览器支持 | 现代浏览器 | 所有浏览器 |

#### 与 Vue 的比较

| 特性 | Web Components | Vue |
|------|----------------|-----|
| 模板语法 | 原生 HTML | Vue 模板 |
| 数据绑定 | 手动实现 | 内置支持 |
| 组件通信 | 事件系统 | 多种方式 |
| 学习成本 | 中等 | 低 |
| 生态系统 | 发展中 | 成熟 |

#### 与 Angular 的比较

| 特性 | Web Components | Angular |
|------|----------------|---------|
| 依赖注入 | 不支持 | 内置支持 |
| 类型检查 | 手动实现 | TypeScript |
| 构建工具 | 原生支持 | CLI 工具 |
| 学习曲线 | 中等 | 较高 |
| 企业级支持 | 有限 | 强 |

## HTML Templates

### 概念

HTML Templates 允许您定义可重用的标记结构，这些结构不会在页面加载时被渲染，但可以在运行时通过 JavaScript 实例化。`<template>` 元素及其内容不会被浏览器渲染，但可以通过 JavaScript 访问和操作。

### Template 元素的历史背景

HTML Templates 元素是在 HTML5 规范中引入的，旨在解决客户端模板的需求。在 Template 元素出现之前，开发者通常使用以下方法实现模板功能：

1. **隐藏的 DOM 元素** - 使用 `display: none` 隐藏元素
2. **字符串模板** - 使用字符串拼接生成 HTML
3. **脚本标签** - 使用 `type="text/template"` 的 script 标签

这些方法都有各自的缺点，Template 元素的出现解决了这些问题。

### Template 元素的特性

1. **内容不可见**
   - template 内容不会显示在页面上
   - 不会被屏幕阅读器读取
   - 不会影响页面布局

2. **脚本不执行**
   - template 内的脚本不会执行
   - 避免了模板加载时的副作用
   - 提高了安全性

3. **图像不加载**
   - template 内的图像不会加载
   - 减少了初始页面加载时间
   - 节省了带宽

4. **可访问性**
   - template 内的内容对辅助技术不可见
   - 避免了对无障碍访问的干扰
   - 提高了页面的可访问性

### Template 元素的属性和方法

Template 元素具有以下重要属性和方法：

- `content` - 只读属性，返回模板内容的 DocumentFragment
- `cloneNode(deep)` - 克隆模板内容
- `innerHTML` - 获取或设置模板内容的 HTML
- `outerHTML` - 获取包含模板元素本身的 HTML

```javascript
// 获取模板元素
const template = document.getElementById('my-template');

// 访问模板内容
const content = template.content;

// 克隆模板内容（深克隆）
const clone = template.content.cloneNode(true);

// 获取模板的 HTML 内容
const htmlContent = template.innerHTML;

// 设置模板的 HTML 内容
template.innerHTML = '<div>新的模板内容</div>';
```

### Template 元素的生命周期

Template 元素的生命周期与其他 HTML 元素不同：

1. **解析阶段**
   - 浏览器解析 template 标签
   - 创建模板内容 DocumentFragment
   - 不执行脚本和加载资源

2. **运行时阶段**
   - 通过 JavaScript 访问模板
   - 克隆模板内容
   - 将克隆内容添加到 DOM

3. **销毁阶段**
   - 模板元素被移除
   - 内容 DocumentFragment 被垃圾回收

### 基本用法

```html
<template id="my-template">
  <div class="card">
    <h2>标题</h2>
    <p>这是卡片内容</p>
    <button>点击我</button>
  </div>
</template>
```

```javascript
// 获取模板内容
const template = document.getElementById('my-template');

// 克隆模板内容（深克隆）
const clone = template.content.cloneNode(true);

// 将克隆的内容添加到页面
document.body.appendChild(clone);
```

### DocumentFragment 详解

DocumentFragment 是一个轻量级的文档对象，可以用来存储和操作 DOM 节点，而不会触发重排或重绘。它是 Template 元素 content 属性的返回值。

#### DocumentFragment 的特性

1. **轻量级**
   - 不是真实 DOM 树的一部分
   - 不会引起页面重排
   - 性能优于直接操作 DOM

2. **节点容器**
   - 可以包含任意 DOM 节点
   - 支持所有 DOM 操作方法
   - 可以被一次性添加到 DOM

3. **临时存储**
   - 适合临时存储 DOM 节点
   - 可以被多次使用
   - 使用后自动清空

#### DocumentFragment 的方法

DocumentFragment 继承自 Node，具有以下常用方法：

- `appendChild(node)` - 添加子节点
- `insertBefore(newNode, referenceNode)` - 在指定节点前插入节点
- `removeChild(node)` - 移除子节点
- `replaceChild(newNode, oldNode)` - 替换子节点
- `cloneNode(deep)` - 克隆节点
- `querySelector(selectors)` - 查找子节点
- `querySelectorAll(selectors)` - 查找所有匹配的子节点

```javascript
// 创建 DocumentFragment
const fragment = document.createDocumentFragment();

// 添加元素到 fragment
for (let i = 0; i < 3; i++) {
  const div = document.createElement('div');
  div.textContent = `Item ${i + 1}`;
  fragment.appendChild(div);
}

// 一次性添加到 DOM
document.body.appendChild(fragment);
```

### 使用模板的最佳实践

1. **模板复用**
   - 为相似的 UI 组件创建模板
   - 使用数据属性标记可替换内容
   - 建立模板库提高开发效率

2. **数据绑定**
   - 在克隆模板后填充数据
   - 使用数据属性或类名定位元素
   - 实现单向或双向数据绑定

3. **事件处理**
   - 在克隆模板后添加事件监听器
   - 使用事件委托减少监听器数量
   - 正确处理事件生命周期

4. **性能优化**
   - 避免频繁克隆大型模板
   - 使用 DocumentFragment 批量操作
   - 缓存常用模板避免重复查询

### 动态模板示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>HTML Templates 高级示例</title>
</head>
<body>
  <h1>HTML Templates 高级示例</h1>
  
  <!-- 定义复杂模板 -->
  <template id="user-profile-template">
    <style>
      .user-profile {
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 16px;
        margin: 16px;
        max-width: 300px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        background: white;
        font-family: Arial, sans-serif;
      }
      
      .profile-header {
        display: flex;
        align-items: center;
        margin-bottom: 12px;
      }
      
      .avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        margin-right: 12px;
        object-fit: cover;
      }
      
      .user-info h3 {
        margin: 0 0 4px 0;
        color: #333;
        font-size: 18px;
      }
      
      .user-info p {
        margin: 0;
        color: #666;
        font-size: 14px;
      }
      
      .user-stats {
        display: flex;
        justify-content: space-between;
        border-top: 1px solid #eee;
        padding-top: 12px;
        margin-top: 12px;
      }
      
      .stat {
        text-align: center;
      }
      
      .stat-value {
        font-weight: bold;
        font-size: 16px;
        color: #333;
      }
      
      .stat-label {
        font-size: 12px;
        color: #999;
      }
    </style>
    
    <div class="user-profile">
      <div class="profile-header">
        <img class="avatar" data-id="avatar" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iMjUiIHk9IjMwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM5OTkiPlVTRVI8L3RleHQ+PC9zdmc+" alt="User Avatar">
        <div class="user-info">
          <h3 data-id="name">用户名</h3>
          <p data-id="email">用户邮箱</p>
        </div>
      </div>
      
      <p data-id="bio">用户简介</p>
      
      <div class="user-stats">
        <div class="stat">
          <div class="stat-value" data-id="posts">0</div>
          <div class="stat-label">帖子</div>
        </div>
        <div class="stat">
          <div class="stat-value" data-id="followers">0</div>
          <div class="stat-label">关注者</div>
        </div>
        <div class="stat">
          <div class="stat-value" data-id="following">0</div>
          <div class="stat-label">关注中</div>
        </div>
      </div>
      
      <button data-id="follow" class="follow-btn">关注</button>
    </div>
  </template>
  
  <!-- 显示用户资料的容器 -->
  <div id="container"></div>
  
  <script>
    // 用户数据
    const users = [
      { 
        id: 1,
        name: '张三', 
        email: 'zhangsan@example.com', 
        bio: '前端开发工程师，热爱新技术',
        avatar: 'https://via.placeholder.com/50',
        posts: 128,
        followers: 1200,
        following: 350
      },
      { 
        id: 2,
        name: '李四', 
        email: 'lisi@example.com', 
        bio: 'UI/UX设计师，专注于用户体验',
        avatar: 'https://via.placeholder.com/50',
        posts: 86,
        followers: 2400,
        following: 180
      },
      { 
        id: 3,
        name: '王五', 
        email: 'wangwu@example.com', 
        bio: '全栈开发者，喜欢解决复杂问题',
        avatar: 'https://via.placeholder.com/50',
        posts: 210,
        followers: 3500,
        following: 420
      }
    ];
    
    // 获取模板
    const template = document.getElementById('user-profile-template');
    
    // 为每个用户创建资料卡片
    users.forEach(user => {
      // 克隆模板内容
      const clone = template.content.cloneNode(true);
      
      // 填充数据
      clone.querySelector('[data-id="name"]').textContent = user.name;
      clone.querySelector('[data-id="email"]').textContent = user.email;
      clone.querySelector('[data-id="bio"]').textContent = user.bio;
      clone.querySelector('[data-id="avatar"]').src = user.avatar;
      clone.querySelector('[data-id="posts"]').textContent = user.posts;
      clone.querySelector('[data-id="followers"]').textContent = user.followers;
      clone.querySelector('[data-id="following"]').textContent = user.following;
      
      // 添加关注事件
      const followBtn = clone.querySelector('[data-id="follow"]');
      followBtn.addEventListener('click', () => {
        if (followBtn.textContent === '关注') {
          followBtn.textContent = '已关注';
          followBtn.style.backgroundColor = '#eee';
          followBtn.style.color = '#666';
        } else {
          followBtn.textContent = '关注';
          followBtn.style.backgroundColor = '';
          followBtn.style.color = '';
        }
      });
      
      // 添加到页面
      document.getElementById('container').appendChild(clone);
    });
  </script>
</body>
</html>
```

### 嵌套模板

模板可以嵌套使用，以创建更复杂的结构：

```html
<template id="outer-template">
  <div class="outer">
    <h2>外层模板</h2>
    <template id="inner-template">
      <p>内层模板内容</p>
    </template>
    <div id="inner-content"></div>
  </div>
</template>

<script>
  const outerTemplate = document.getElementById('outer-template');
  const outerClone = outerTemplate.content.cloneNode(true);
  
  const innerTemplate = outerClone.querySelector('#inner-template');
  const innerClone = innerTemplate.content.cloneNode(true);
  
  outerClone.querySelector('#inner-content').appendChild(innerClone);
  
  document.body.appendChild(outerClone);
</script>
```

### 条件模板

根据条件选择不同的模板：

```html
<template id="loading-template">
  <div class="loading">加载中...</div>
</template>

<template id="success-template">
  <div class="success">加载成功</div>
</template>

<template id="error-template">
  <div class="error">加载失败</div>
</template>

<script>
  function renderTemplate(status) {
    let templateId;
    
    switch (status) {
      case 'loading':
        templateId = 'loading-template';
        break;
      case 'success':
        templateId = 'success-template';
        break;
      case 'error':
        templateId = 'error-template';
        break;
      default:
        return;
    }
    
    const template = document.getElementById(templateId);
    const clone = template.content.cloneNode(true);
    document.getElementById('container').appendChild(clone);
  }
  
  // 使用示例
  renderTemplate('loading');
  setTimeout(() => {
    document.getElementById('container').innerHTML = '';
    renderTemplate('success');
  }, 2000);
</script>
```

### 模板缓存

为了避免重复查询和克隆模板，可以实现模板缓存：

```javascript
class TemplateCache {
  constructor() {
    this.cache = new Map();
  }
  
  getTemplate(id) {
    if (!this.cache.has(id)) {
      const template = document.getElementById(id);
      if (!template) {
        throw new Error(`Template with id "${id}" not found`);
      }
      this.cache.set(id, template);
    }
    
    return this.cache.get(id);
  }
  
  cloneTemplate(id) {
    const template = this.getTemplate(id);
    return template.content.cloneNode(true);
  }
}

// 使用示例
const templateCache = new TemplateCache();

// 克隆模板
const clone = templateCache.cloneTemplate('my-template');
document.body.appendChild(clone);
```

## Shadow DOM

### 概念

Shadow DOM 是一种浏览器技术，它允许您将隐藏的、封装的 DOM 附加到元素上，这样可以将元素的功能标记与页面上的其他代码隔离开来。Shadow DOM 为 Web Components 提供了样式和标记的封装。

### Shadow DOM 的历史背景

Shadow DOM 的概念最早在 2011 年由 Google 提出，作为 Web Components 规范的一部分。它的发展经历了以下阶段：

1. **Shadow DOM v0 (2011)** - 初始版本，实现简单但功能有限
2. **Shadow DOM v1 (2015)** - 重新设计，功能更强大，获得广泛支持
3. **现代实现 (2018至今)** - 各大浏览器完成支持，成为 Web 标准

### Shadow DOM 的核心概念

Shadow DOM 引入了几个重要概念：

1. **Shadow Tree** - 封装的 DOM 树
2. **Shadow Host** - 挂载 Shadow Tree 的元素
3. **Shadow Root** - Shadow Tree 的根节点
4. **Shadow Boundary** - 封装边界，隔离内部和外部

### Shadow DOM 的类型

Shadow DOM 有两种模式：
1. **Open mode** - 可以通过 JavaScript 访问 shadow DOM
2. **Closed mode** - 无法通过 JavaScript 访问 shadow DOM

```javascript
// open 模式
const shadow = this.attachShadow({mode: 'open'});

// closed 模式
const shadow = this.attachShadow({mode: 'closed'});
```

#### Open Mode vs Closed Mode

| 特性 | Open Mode | Closed Mode |
|------|-----------|-------------|
| JavaScript 访问 | 可以 | 不可以 |
| 开发者工具可见 | 是 | 否 |
| CSS 样式化 | 可以 (通过部分) | 不可以 |
| 事件传播 | 穿越边界 | 不穿越边界 |
| 适用场景 | 大多数情况 | 需要严格封装 |

### 创建 Shadow DOM

```javascript
class MyElement extends HTMLElement {
  constructor() {
    super();
    
    // 创建 shadow root
    const shadow = this.attachShadow({mode: 'open'});
    
    // 添加内容到 shadow DOM
    shadow.innerHTML = `
      <style>
        p {
          color: blue;
        }
      </style>
      <p>这是 Shadow DOM 中的内容</p>
    `;
  }
}

customElements.define('my-element', MyElement);
```

### Shadow DOM 的结构

Shadow DOM 创建了一个独立的 DOM 树，与主文档 DOM 树并行存在：

```javascript
class ShadowExample extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    
    // 创建 shadow DOM 结构
    const wrapper = document.createElement('div');
    wrapper.className = 'wrapper';
    
    const title = document.createElement('h2');
    title.textContent = 'Shadow DOM 示例';
    
    const content = document.createElement('p');
    content.textContent = '这是 Shadow DOM 中的内容';
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      .wrapper {
        border: 2px solid #333;
        padding: 16px;
        border-radius: 8px;
      }
      
      h2 {
        color: #4a90e2;
        margin-top: 0;
      }
      
      p {
        color: #666;
        font-size: 16px;
      }
    `;
    
    // 组装 shadow DOM
    wrapper.appendChild(title);
    wrapper.appendChild(content);
    shadow.appendChild(style);
    shadow.appendChild(wrapper);
  }
}

customElements.define('shadow-example', ShadowExample);
```

### 样式封装详解

Shadow DOM 提供了样式封装，内部样式不会影响外部元素，外部样式也不会影响内部元素：

```javascript
class StyledElement extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    
    shadow.innerHTML = `
      <style>
        /* 这些样式只影响 shadow DOM 内部 */
        p {
          color: blue;
          font-size: 18px;
          background-color: #f0f0f0;
          padding: 10px;
          border-radius: 4px;
        }
        
        .container {
          border: 1px solid #ccc;
          padding: 10px;
          margin: 10px 0;
        }
        
        /* 使用 :host 选择器设置宿主元素样式 */
        :host {
          display: block;
          margin: 20px 0;
        }
        
        /* 使用 :host() 基于宿主属性设置样式 */
        :host([disabled]) {
          opacity: 0.5;
          pointer-events: none;
        }
        
        /* 使用 :host-context() 响应外部上下文 */
        :host-context(.dark-theme) {
          background-color: #333;
        }
        
        :host-context(.dark-theme) p {
          color: #fff;
          background-color: #555;
        }
        
        /* 使用 ::slotted() 选择分发的节点 */
        ::slotted(*) {
          margin: 0;
        }
        
        ::slotted(h1) {
          color: red;
        }
      </style>
      <div class="container">
        <p>这个段落只受 shadow DOM 内部样式影响</p>
        <p>另一个段落，同样受内部样式影响</p>
        <div>
          <slot></slot>
        </div>
      </div>
    `;
  }
}

customElements.define('styled-element', StyledElement);
```

#### :host 选择器详解

`:host` 选择器用于选择 Shadow DOM 的宿主元素：

```javascript
// 基本用法
:host {
  display: block;
  border: 1px solid #ccc;
}

// 基于属性的选择
:host([disabled]) {
  opacity: 0.5;
}

// 基于类的选择
:host(.featured) {
  border-color: gold;
}

// 与其它选择器组合
:host:hover {
  background-color: #f0f0f0;
}

:host(.large) h2 {
  font-size: 24px;
}
```

#### :host-context() 选择器详解

`:host-context()` 选择器用于根据宿主元素外部的上下文来设置样式：

```javascript
// 在暗色主题中应用样式
:host-context(.dark-theme) {
  background-color: #333;
  color: white;
}

// 在特定容器中应用样式
:host-context(.sidebar) {
  width: 200px;
}

// 组合使用
:host-context(.dark-theme) h2 {
  color: #4a90e2;
}
```

#### ::slotted() 选择器详解

`::slotted()` 选择器用于选择通过 slot 分发到 Shadow DOM 的元素：

```javascript
// 选择所有分发的元素
::slotted(*) {
  margin: 0;
}

// 选择特定类型的元素
::slotted(h1) {
  color: red;
}

// 选择具有特定类的元素
::slotted(.highlight) {
  background-color: yellow;
}

// 选择具有特定属性的元素
::slotted([data-important]) {
  font-weight: bold;
}
```

### Slot 机制详解

Slot 允许您将外部内容插入到 Shadow DOM 中的指定位置。这是实现内容分发的关键机制。

#### 默认 Slot

默认 slot 用于分发没有指定 name 属性的内容：

```javascript
class DefaultSlotExample extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    
    shadow.innerHTML = `
      <style>
        .container {
          border: 1px solid #ccc;
          padding: 16px;
        }
      </style>
      <div class="container">
        <h2>标题</h2>
        <div>
          <slot>
            <p>默认内容</p>
          </slot>
        </div>
      </div>
    `;
  }
}

customElements.define('default-slot-example', DefaultSlotExample);
```

使用默认 slot：

```html
<default-slot-example>
  <p>这是分发的内容</p>
  <button>按钮</button>
</default-slot-example>
```

#### 具名 Slot

具名 slot 用于分发具有特定 name 属性的内容：

```javascript
class NamedSlotExample extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    
    shadow.innerHTML = `
      <style>
        .card {
          border: 1px solid #ccc;
          border-radius: 8px;
          padding: 16px;
        }
        
        .header {
          border-bottom: 1px solid #eee;
          padding-bottom: 8px;
          margin-bottom: 8px;
        }
        
        .content {
          margin-bottom: 8px;
        }
        
        .footer {
          border-top: 1px solid #eee;
          padding-top: 8px;
        }
      </style>
      <div class="card">
        <div class="header">
          <slot name="header">默认头部</slot>
        </div>
        <div class="content">
          <slot name="content">默认内容</slot>
        </div>
        <div class="footer">
          <slot name="footer">默认底部</slot>
        </div>
      </div>
    `;
  }
}

customElements.define('named-slot-example', NamedSlotExample);
```

使用具名 slot：

```html
<named-slot-example>
  <h3 slot="header">自定义头部</h3>
  <p slot="content">自定义内容</p>
  <span slot="footer">自定义底部</span>
</named-slot-example>
```

### 高级 Slot 技术

#### 动态 Slot 内容

```javascript
class DynamicSlotComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          border: 1px solid #ccc;
          padding: 16px;
          margin: 16px;
        }
        
        .slot-container {
          background: #f9f9f9;
          padding: 12px;
          margin: 8px 0;
        }
      </style>
      <div class="container">
        <h3>动态 Slot 示例</h3>
        <div class="slot-container">
          <slot name="header">默认头部</slot>
        </div>
        <div class="slot-container">
          <slot name="main">默认主体</slot>
        </div>
        <div class="slot-container">
          <slot name="footer">默认底部</slot>
        </div>
      </div>
    `;
  }
  
  // 动态添加内容到 slot
  addContent(position, content) {
    const element = document.createElement('div');
    element.textContent = content;
    element.slot = position;
    this.appendChild(element);
  }
}

customElements.define('dynamic-slot-component', DynamicSlotComponent);

// 使用示例
// const component = document.createElement('dynamic-slot-component');
// document.body.appendChild(component);
// component.addContent('header', '这是动态添加的头部内容');
// component.addContent('main', '这是动态添加的主体内容');
```

#### Slot 事件处理

```javascript
class SlotEventComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
    
    // 监听 slotchange 事件
    this.shadowRoot.addEventListener('slotchange', (e) => {
      console.log('Slot 内容发生变化', e);
      this.handleSlotChange(e);
    });
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .container {
          border: 2px dashed #4a90e2;
          padding: 16px;
          margin: 16px;
        }
      </style>
      <div class="container">
        <slot name="content">默认内容</slot>
      </div>
    `;
  }
  
  handleSlotChange(event) {
    const slot = event.target;
    const assignedNodes = slot.assignedNodes();
    
    console.log('分配给 slot 的节点:', assignedNodes);
    
    // 对分配的节点进行处理
    assignedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        node.style.border = '1px solid red';
      }
    });
  }
}

customElements.define('slot-event-component', SlotEventComponent);
```

### Shadow DOM 事件模型

Shadow DOM 中的事件遵循特定的传播规则：

```javascript
class EventHandlingComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    
    shadow.innerHTML = `
      <style>
        .container {
          padding: 16px;
          background: #f0f0f0;
        }
        
        button {
          padding: 8px 16px;
          margin: 4px;
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <div class="container">
        <button id="shadow-button">Shadow DOM 按钮</button>
        <slot></slot>
      </div>
    `;
    
    // Shadow DOM 内部事件
    shadow.getElementById('shadow-button').addEventListener('click', (e) => {
      console.log('Shadow DOM 内部按钮被点击');
      console.log('事件目标:', e.target);
      console.log('当前目标:', e.currentTarget);
      
      // 派发自定义事件到外部
      this.dispatchEvent(new CustomEvent('custom-click', {
        detail: { message: '来自 Shadow DOM 的自定义事件' },
        bubbles: true,
        composed: true // 允许事件穿越 Shadow DOM 边界
      }));
    });
  }
}

customElements.define('event-handling-component', EventHandlingComponent);
```

#### 事件传播机制

Shadow DOM 中的事件传播分为两个阶段：

1. **Capture Phase** - 捕获阶段
2. **Bubble Phase** - 冒泡阶段

事件在 Shadow DOM 中的传播规则：

```javascript
// 在 Shadow DOM 内部监听事件
shadowRoot.addEventListener('click', (e) => {
  console.log('Shadow DOM 内部捕获:', e.eventPhase); // 1 (捕获阶段)
}, true);

// 在 Shadow DOM 内部监听冒泡事件
shadowRoot.addEventListener('click', (e) => {
  console.log('Shadow DOM 内部冒泡:', e.eventPhase); // 3 (冒泡阶段)
});

// 在宿主元素上监听事件
host.addEventListener('click', (e) => {
  console.log('宿主元素事件:', e.eventPhase); // 3 (冒泡阶段)
});

// 在文档上监听事件
document.addEventListener('click', (e) => {
  console.log('文档事件:', e.eventPhase); // 3 (冒泡阶段)
});
```

#### composed 属性

`composed` 属性控制事件是否能够穿越 Shadow DOM 边界：

```javascript
// 允许事件穿越 Shadow DOM 边界
this.dispatchEvent(new CustomEvent('my-event', {
  bubbles: true,
  composed: true
}));

// 不允许事件穿越 Shadow DOM 边界
this.dispatchEvent(new CustomEvent('my-event', {
  bubbles: true,
  composed: false
}));
```

### Shadow DOM 性能优化

#### 避免频繁创建 Shadow DOM

```javascript
class OptimizedShadowComponent extends HTMLElement {
  constructor() {
    super();
    // 只在需要时创建 Shadow DOM
    this.shadowRootCreated = false;
  }
  
  connectedCallback() {
    if (!this.shadowRootCreated) {
      this.createShadowDOM();
      this.shadowRootCreated = true;
    }
  }
  
  createShadowDOM() {
    const shadow = this.attachShadow({mode: 'open'});
    shadow.innerHTML = `
      <style>
        /* 样式定义 */
      </style>
      <div>组件内容</div>
    `;
  }
}

customElements.define('optimized-shadow-component', OptimizedShadowComponent);
```

#### 批量更新 Shadow DOM

```javascript
class BatchUpdateComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
  }
  
  render() {
    // 使用 DocumentFragment 批量更新
    const fragment = document.createDocumentFragment();
    
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
      .container { padding: 16px; }
    `;
    
    // 创建内容
    const container = document.createElement('div');
    container.className = 'container';
    container.textContent = '批量更新的内容';
    
    // 添加到 fragment
    fragment.appendChild(style);
    fragment.appendChild(container);
    
    // 一次性添加到 Shadow DOM
    this.shadowRoot.appendChild(fragment);
  }
}

customElements.define('batch-update-component', BatchUpdateComponent);
```

## Custom Elements

### 概念

Custom Elements API 允许您定义自己的 HTML 元素，包括它们的外观、行为和 API。自定义元素是 Web Components 的核心，它们允许您创建新的 HTML 标签。

### Custom Elements 的历史发展

Custom Elements API 的发展经历了两个主要版本：

1. **Custom Elements v0** - 初始版本，仅在 Chrome 中实现
2. **Custom Elements v1** - 标准化版本，获得广泛浏览器支持

### 定义自定义元素的方法

有两种类型的自定义元素：
1. **Autonomous custom elements** - 独立元素，继承自 HTMLElement
2. **Customized built-in elements** - 自定义内置元素，继承自现有 HTML 元素

#### Autonomous Custom Elements

自主自定义元素是完全独立的元素，它们继承自 HTMLElement：

```javascript
class MyButton extends HTMLElement {
  constructor() {
    super();
    
    // 创建 shadow DOM
    const shadow = this.attachShadow({mode: 'open'});
    
    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
      button {
        background-color: #4CAF50;
        border: none;
        color: white;
        padding: 15px 32px;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 16px;
        margin: 4px 2px;
        cursor: pointer;
        border-radius: 4px;
        transition: background-color 0.3s;
      }
      
      button:hover {
        background-color: #45a049;
      }
      
      button:active {
        background-color: #3d8b40;
      }
      
      button:disabled {
        background-color: #cccccc;
        cursor: not-allowed;
      }
    `;
    
    // 添加按钮
    const button = document.createElement('button');
    button.textContent = this.getAttribute('label') || '点击我';
    
    // 设置初始禁用状态
    if (this.hasAttribute('disabled')) {
      button.disabled = true;
    }
    
    // 添加点击事件
    button.addEventListener('click', () => {
      if (!button.disabled) {
        this.dispatchEvent(new CustomEvent('buttonClick', {
          detail: { 
            message: '按钮被点击了',
            timestamp: Date.now()
          }
        }));
      }
    });
    
    // 将元素添加到 shadow DOM
    shadow.appendChild(style);
    shadow.appendChild(button);
    
    // 保存按钮引用以便后续操作
    this.button = button;
  }
  
  // 指定要观察的属性
  static get observedAttributes() {
    return ['label', 'disabled'];
  }
  
  // 当被观察的属性改变时调用
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'label':
        this.button.textContent = newValue || '点击我';
        break;
      case 'disabled':
        this.button.disabled = newValue !== null;
        break;
    }
  }
  
  // 公共 API 方法
  disable() {
    this.setAttribute('disabled', '');
  }
  
  enable() {
    this.removeAttribute('disabled');
  }
  
  setLabel(label) {
    this.setAttribute('label', label);
  }
}

customElements.define('my-button', MyButton);
```

使用自定义按钮：

```html
<my-button label="自定义按钮"></my-button>
<my-button label="禁用按钮" disabled></my-button>

<script>
  const button = document.querySelector('my-button');
  button.addEventListener('buttonClick', (e) => {
    console.log(e.detail.message);
    console.log('时间戳:', e.detail.timestamp);
  });
  
  // 5秒后启用第二个按钮
  setTimeout(() => {
    document.querySelectorAll('my-button')[1].enable();
  }, 5000);
</script>
```

#### Customized Built-in Elements

自定义内置元素扩展现有的 HTML 元素：

```javascript
class ExpandingList extends HTMLUListElement {
  constructor() {
    super();
    
    // 添加展开/折叠功能
    this.addEventListener('click', (e) => {
      if (e.target.tagName === 'LI') {
        const sublist = e.target.querySelector('ul');
        if (sublist) {
          sublist.style.display = sublist.style.display === 'none' ? 'block' : 'none';
          
          // 更新箭头图标
          const arrow = e.target.querySelector('.arrow');
          if (arrow) {
            arrow.textContent = sublist.style.display === 'none' ? '▶' : '▼';
          }
        }
      }
    });
    
    // 初始化列表项
    this.initListItems();
  }
  
  initListItems() {
    this.querySelectorAll('li').forEach(li => {
      const sublist = li.querySelector('ul');
      if (sublist) {
        // 添加箭头图标
        const arrow = document.createElement('span');
        arrow.className = 'arrow';
        arrow.textContent = '▶';
        arrow.style.marginRight = '5px';
        arrow.style.cursor = 'pointer';
        
        li.insertBefore(arrow, li.firstChild);
        
        // 初始隐藏子列表
        sublist.style.display = 'none';
      }
    });
  }
}

customElements.define('expanding-list', ExpandingList, { extends: 'ul' });
```

使用自定义内置元素：

```html
<ul is="expanding-list">
  <li>项目 1
    <ul>
      <li>子项目 1.1</li>
      <li>子项目 1.2</li>
    </ul>
  </li>
  <li>项目 2
    <ul>
      <li>子项目 2.1</li>
      <li>子项目 2.2
        <ul>
          <li>子项目 2.2.1</li>
          <li>子项目 2.2.2</li>
        </ul>
      </li>
    </ul>
  </li>
  <li>项目 3</li>
</ul>
```

### 生命周期回调详解

自定义元素可以定义特殊的生命回调方法，这些方法在元素的不同阶段被调用：

```javascript
class MyElement extends HTMLElement {
  constructor() {
    super();
    console.log('1. 元素被创建');
    
    // 初始化变量和设置 shadow DOM
    this.data = null;
    this.timer = null;
  }
  
  // 当元素被插入到文档中时调用
  connectedCallback() {
    console.log('2. 元素被添加到页面');
    this.render();
    
    // 开始定时器
    this.timer = setInterval(() => {
      console.log('元素仍在页面中');
    }, 5000);
  }
  
  // 当元素从文档中移除时调用
  disconnectedCallback() {
    console.log('3. 元素从页面移除');
    
    // 清理资源
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  
  // 当元素被移动到新文档时调用
  adoptedCallback() {
    console.log('4. 元素被移动到新文档');
  }
  
  // 当元素属性改变时调用
  attributeChangedCallback(name, oldValue, newValue) {
    console.log(`5. 属性 ${name} 从 ${oldValue} 改为 ${newValue}`);
    this.render();
  }
  
  // 指定要观察的属性
  static get observedAttributes() {
    return ['title', 'color', 'data-value'];
  }
  
  render() {
    const title = this.getAttribute('title') || '默认标题';
    const color = this.getAttribute('color') || 'black';
    const dataValue = this.getAttribute('data-value') || '无数据';
    
    if (!this.shadowRoot) {
      this.attachShadow({mode: 'open'});
    }
    
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          border: 1px solid #ccc;
          padding: 16px;
          margin: 16px 0;
          border-radius: 4px;
        }
        
        h2 {
          color: ${color};
          margin-top: 0;
        }
      </style>
      <h2>${title}</h2>
      <p>数据值: ${dataValue}</p>
      <p>元素已渲染时间: ${new Date().toLocaleTimeString()}</p>
    `;
  }
  
  // 公共 API
  updateData(data) {
    this.setAttribute('data-value', data);
  }
  
  setTitle(title) {
    this.setAttribute('title', title);
  }
  
  setColor(color) {
    this.setAttribute('color', color);
  }
}

customElements.define('my-element', MyElement);
```

#### constructor()

构造函数在元素实例被创建时调用：

```javascript
constructor() {
  // 必须首先调用 super()
  super();
  
  // 初始化属性
  this.data = {};
  this.isInitialized = false;
  
  // 可以设置初始属性
  this.setAttribute('role', 'region');
  
  // 可以添加事件监听器
  this.addEventListener('click', this.handleClick);
  
  // 注意：不要在这里进行 DOM 操作
  // 因为元素可能还没有被添加到文档中
}
```

#### connectedCallback()

当元素被添加到文档中时调用：

```javascript
connectedCallback() {
  // 可以进行 DOM 操作
  this.render();
  
  // 可以访问文档中的其他元素
  const parent = this.parentNode;
  
  // 可以开始动画或定时器
  this.startAnimation();
  
  // 可以加载数据
  this.loadData();
}
```

#### disconnectedCallback()

当元素从文档中移除时调用：

```javascript
disconnectedCallback() {
  // 清理资源
  if (this.animationId) {
    cancelAnimationFrame(this.animationId);
  }
  
  // 清理定时器
  if (this.timerId) {
    clearTimeout(this.timerId);
  }
  
  // 移除事件监听器
  this.removeEventListener('click', this.handleClick);
  
  // 取消网络请求
  if (this.abortController) {
    this.abortController.abort();
  }
}
```

#### adoptedCallback()

当元素被移动到新文档时调用：

```javascript
adoptedCallback(oldDocument, newDocument) {
  // 处理文档变更
  console.log('元素被移动到新文档');
  
  // 可能需要重新初始化某些功能
  this.reinitialize();
}
```

#### attributeChangedCallback()

当被观察的属性改变时调用：

```javascript
static get observedAttributes() {
  return ['title', 'visible', 'theme'];
}

attributeChangedCallback(name, oldValue, newValue) {
  // 只在值真正改变时执行
  if (oldValue === newValue) return;
  
  switch (name) {
    case 'title':
      this.updateTitle(newValue);
      break;
    case 'visible':
      this.updateVisibility(newValue !== null);
      break;
    case 'theme':
      this.updateTheme(newValue);
      break;
  }
}
```

### 表单关联自定义元素

自定义元素可以与表单关联，成为表单控件：

```javascript
class CustomTextInput extends HTMLElement {
  static get formAssociated() {
    return true;
  }
  
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    
    // 创建内部 input 元素
    this.input = document.createElement('input');
    this.input.type = 'text';
    
    // 设置样式
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: inline-block;
      }
      
      input {
        width: 100%;
        padding: 8px;
        border: 1px solid #ccc;
        border-radius: 4px;
        font-size: 16px;
      }
      
      input:focus {
        outline: none;
        border-color: #4a90e2;
        box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
      }
    `;
    
    this.shadowRoot.append(style, this.input);
    
    // 创建表单关联
    this.internals = this.attachInternals();
    
    // 转发事件
    this.input.addEventListener('input', () => {
      this.internals.setFormValue(this.input.value);
      this.dispatchEvent(new Event('input', { bubbles: true }));
    });
    
    this.input.addEventListener('blur', () => {
      this.dispatchEvent(new Event('blur', { bubbles: true }));
    });
  }
  
  // 获取值
  get value() {
    return this.input.value;
  }
  
  // 设置值
  set value(val) {
    this.input.value = val;
    this.internals.setFormValue(val);
  }
  
  // 验证状态
  checkValidity() {
    return this.internals.checkValidity();
  }
  
  // 报告验证状态
  reportValidity() {
    return this.internals.reportValidity();
  }
  
  // 设置自定义验证消息
  setCustomValidity(message) {
    this.internals.setValidity({ customError: !!message }, message);
  }
}

customElements.define('custom-text-input', CustomTextInput);
```

### 自定义元素的高级特性

#### 静态属性和方法

```javascript
class AdvancedElement extends HTMLElement {
  // 定义元素的标签名
  static tagName = 'advanced-element';
  
  // 定义观察的属性
  static observedAttributes = ['data-value', 'disabled'];
  
  // 定义是否与表单关联
  static formAssociated = true;
  
  // 静态方法
  static getDefaultValue() {
    return '默认值';
  }
  
  constructor() {
    super();
    this.data = {};
  }
  
  // 实例方法
  getData() {
    return this.data;
  }
  
  setData(data) {
    this.data = data;
    this.render();
  }
}

// 注册元素
customElements.define(AdvancedElement.tagName, AdvancedElement);
```

#### 属性反射

属性反射是指 JavaScript 属性与 HTML 属性之间的同步：

```javascript
class ReflectiveElement extends HTMLElement {
  constructor() {
    super();
    this._value = '';
  }
  
  // 获取 value 属性
  get value() {
    return this._value;
  }
  
  // 设置 value 属性并反射到 HTML 属性
  set value(val) {
    this._value = val;
    this.setAttribute('value', val);
  }
  
  // 当 HTML 属性改变时更新 JavaScript 属性
  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'value') {
      this._value = newValue;
    }
  }
  
  static get observedAttributes() {
    return ['value'];
  }
}

customElements.define('reflective-element', ReflectiveElement);
```

## ES Modules

### 概念

ES Modules 是 JavaScript 的标准模块系统，允许您将代码组织成独立的模块，并在需要时导入和导出功能。ES Modules 提供了更好的代码组织和依赖管理。

### ES Modules 的历史发展

ES Modules 的发展经历了以下阶段：

1. **CommonJS (2009)** - Node.js 使用的模块系统
2. **AMD (2010)** - 浏览器端异步模块定义
3. **UMD (2011)** - 通用模块定义，兼容多种格式
4. **ES Modules (2015)** - ECMAScript 标准模块系统

### 基本用法

创建一个模块文件 (utils.js)：

```javascript
// utils.js

// 导出函数
export function formatDate(date) {
  return date.toLocaleDateString();
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 默认导出
export default function greet(name) {
  return `Hello, ${name}!`;
}

// 导出类
export class Calculator {
  add(a, b) {
    return a + b;
  }
  
  multiply(a, b) {
    return a * b;
  }
  
  divide(a, b) {
    if (b === 0) {
      throw new Error('除数不能为零');
    }
    return a / b;
  }
}

// 导出常量
export const PI = 3.14159;

// 导出对象
export const constants = {
  GRAVITY: 9.8,
  SPEED_OF_LIGHT: 299792458
};

// 导出多个值
export const math = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b,
  multiply: (a, b) => a * b,
  divide: (a, b) => a / b
};
```

在其他文件中导入：

```javascript
// 导入默认导出
import greet from './utils.js';

// 导入特定函数
import { formatDate, capitalize } from './utils.js';

// 导入所有内容
import * as utils from './utils.js';

// 导入类
import { Calculator } from './utils.js';

// 导入常量
import { PI, constants } from './utils.js';

// 导入多个值
import { math } from './utils.js';

// 使用导入的内容
console.log(greet('World'));
console.log(formatDate(new Date()));
console.log(capitalize('hello'));
console.log(utils.formatDate(new Date()));

const calc = new Calculator();
console.log(calc.add(2, 3));

console.log('PI:', PI);
console.log('重力常数:', constants.GRAVITY);

console.log('加法结果:', math.add(5, 3));
```

### 导入和导出的详细语法

#### 命名导出和导入

```javascript
// 命名导出
export const name = 'John';
export function greet() { return 'Hello'; }
export class Person { }

// 或者批量导出
const age = 30;
function sayGoodbye() { return 'Goodbye'; }
export { age, sayGoodbye };

// 重命名导出
export { name as userName, age as userAge };

// 导入
import { name, greet, Person } from './module.js';
import { age, sayGoodbye } from './module.js';
import { userName as name, userAge as age } from './module.js';

// 导入所有命名导出
import * as module from './module.js';
console.log(module.name);
console.log(module.greet());
```

#### 默认导出和导入

```javascript
// 默认导出
export default function main() { }
// 或者
function main() { }
export default main;

// 导入默认导出
import main from './module.js';
// 或者给默认导出起别名
import myMain from './module.js';
```

#### 混合导入

```javascript
// 同时导入默认导出和命名导出
import main, { name, greet } from './module.js';
// 或者
import { default as main, name, greet } from './module.js';
```

### 动态导入

ES Modules 还支持动态导入，允许在运行时按需加载模块：

```javascript
// 动态导入示例
async function loadModule() {
  try {
    const module = await import('./utils.js');
    console.log(module.greet('动态导入'));
    console.log(module.formatDate(new Date()));
  } catch (error) {
    console.error('模块加载失败:', error);
  }
}

// 条件导入
function conditionalImport(condition) {
  if (condition) {
    import('./advanced-utils.js').then(module => {
      module.advancedFunction();
    });
  } else {
    import('./basic-utils.js').then(module => {
      module.basicFunction();
    });
  }
}

// 基于用户交互的动态导入
document.getElementById('loadButton').addEventListener('click', async () => {
  const { heavyFunction } = await import('./heavy-module.js');
  heavyFunction();
});
```

### 在 Web Components 中使用模块

创建一个自定义元素模块 (my-component.js)：

```javascript
// my-component.js
export class MyComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          border: 1px solid #ccc;
          padding: 16px;
          margin: 16px 0;
          border-radius: 8px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        h3 {
          margin-top: 0;
          color: #fff;
        }
        
        .content {
          background: rgba(255, 255, 255, 0.1);
          padding: 12px;
          border-radius: 4px;
        }
      </style>
      <h3>我的组件</h3>
      <div class="content">
        <p>这是一个使用 ES 模块的 Web Component</p>
        <slot></slot>
      </div>
    `;
  }
}

// 立即定义自定义元素
customElements.define('my-component', MyComponent);

// 也可以导出定义函数
export function defineMyComponent() {
  if (!customElements.get('my-component')) {
    customElements.define('my-component', MyComponent);
  }
}
```

创建一个包含多个组件的模块 (components.js)：

```javascript
// components.js
export class ButtonComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        button {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <button>
        <slot name="label">按钮</slot>
      </button>
    `;
  }
}

export class CardComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        .card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 16px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      </style>
      <div class="card">
        <slot></slot>
      </div>
    `;
  }
}

// 批量定义组件
export function defineAllComponents() {
  if (!customElements.get('my-button')) {
    customElements.define('my-button', ButtonComponent);
  }
  
  if (!customElements.get('my-card')) {
    customElements.define('my-card', CardComponent);
  }
}
```

在 HTML 中使用：

```html
<!DOCTYPE html>
<html>
<head>
  <title>ES Modules 示例</title>
</head>
<body>
  <h1>ES Modules 与 Web Components</h1>
  
  <my-component>
    <p>这是通过 slot 插入的内容</p>
  </my-component>
  
  <my-button>
    <span slot="label">自定义按钮</span>
  </my-button>
  
  <my-card>
    <h3>卡片标题</h3>
    <p>卡片内容</p>
  </my-card>
  
  <!-- 导入并使用模块 -->
  <script type="module">
    // 导入单个组件
    import { MyComponent } from './my-component.js';
    
    // 创建动态实例
    const dynamicComponent = new MyComponent();
    dynamicComponent.innerHTML = '<p>动态创建的组件</p>';
    document.body.appendChild(dynamicComponent);
    
    // 导入并定义多个组件
    import { defineAllComponents } from './components.js';
    defineAllComponents();
  </script>
</body>
</html>
```

### 模块的高级特性

#### 循环依赖处理

```javascript
// a.js
import { functionB } from './b.js';

export function functionA() {
  console.log('Function A');
  // 避免直接调用，防止循环依赖
  // functionB();
}

// b.js
import { functionA } from './a.js';

export function functionB() {
  console.log('Function B');
  // 避免直接调用，防止循环依赖
  // functionA();
}

// 解决方案：动态导入
// a.js (改进版)
export function functionA() {
  console.log('Function A');
  // 动态导入避免循环依赖
  import('./b.js').then(module => {
    module.functionB();
  });
}
```

#### 模块的私有状态

```javascript
// counter.js
let count = 0;

export function increment() {
  return ++count;
}

export function decrement() {
  return --count;
}

export function getCount() {
  return count;
}

// 每次导入都共享同一个 count 变量
```

#### 模块的惰性初始化

```javascript
// lazy-module.js
let initialized = false;
let data = null;

function initialize() {
  if (!initialized) {
    data = loadData();
    initialized = true;
  }
}

export function getData() {
  initialize();
  return data;
}

export function setData(newData) {
  initialize();
  data = newData;
}

function loadData() {
  // 模拟数据加载
  return { message: 'Loaded data' };
}
```

### 模块打包和优化

#### Tree Shaking

Tree shaking 是一种消除未使用代码的技术：

```javascript
// utils.js
export function usedFunction() {
  return 'This function is used';
}

export function unusedFunction() {
  return 'This function is not used';
}

// main.js
import { usedFunction } from './utils.js';

console.log(usedFunction());
// unusedFunction 不会被打包到最终文件中
```

#### 代码分割

```javascript
// 动态导入实现代码分割
async function loadFeature() {
  const { feature } = await import('./feature-module.js');
  return feature();
}

// 基于路由的代码分割
function loadRoute(route) {
  switch (route) {
    case 'home':
      return import('./home.js');
    case 'profile':
      return import('./profile.js');
    case 'settings':
      return import('./settings.js');
    default:
      return import('./not-found.js');
  }
}
```

## 高级Web Components技术

### CSS 自定义属性（CSS Variables）

Web Components 可以使用 CSS 自定义属性来提供可定制的样式：

```javascript
class ThemedComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: var(--component-padding, 16px);
          background: var(--component-background, #f0f0f0);
          border: var(--component-border, 1px solid #ccc);
          border-radius: var(--component-border-radius, 4px);
        }
        
        .title {
          color: var(--title-color, #333);
          font-size: var(--title-font-size, 18px);
          margin: 0 0 var(--title-margin-bottom, 12px) 0;
        }
        
        .content {
          color: var(--content-color, #666);
          font-size: var(--content-font-size, 14px);
        }
      </style>
      <h2 class="title">
        <slot name="title">默认标题</slot>
      </h2>
      <div class="content">
        <slot name="content">默认内容</slot>
      </div>
    `;
  }
}

customElements.define('themed-component', ThemedComponent);
```

使用 CSS 自定义属性：

```html
<style>
  .blue-theme {
    --component-background: #e3f2fd;
    --component-border: 1px solid #2196f3;
    --title-color: #0d47a1;
    --content-color: #1565c0;
  }
  
  .large-text {
    --title-font-size: 24px;
    --content-font-size: 18px;
  }
</style>

<themed-component class="blue-theme large-text">
  <span slot="title">蓝色主题标题</span>
  <span slot="content">这是使用蓝色主题和大字体的内容</span>
</themed-component>
```

### CSS Shadow Parts

CSS Shadow Parts 允许外部样式定制 Shadow DOM 内部的特定部分：

```javascript
class StyledCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
        }
        
        .card {
          border: 1px solid #ddd;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .header {
          padding: 16px;
          background: #f5f5f5;
        }
        
        .content {
          padding: 16px;
        }
        
        .footer {
          padding: 16px;
          background: #fafafa;
          border-top: 1px solid #eee;
        }
      </style>
      <div class="card">
        <div class="header" part="header">
          <slot name="header">默认头部</slot>
        </div>
        <div class="content" part="content">
          <slot name="content">默认内容</slot>
        </div>
        <div class="footer" part="footer">
          <slot name="footer">默认底部</slot>
        </div>
      </div>
    `;
  }
}

customElements.define('styled-card', StyledCard);
```

外部样式定制：

```html
<style>
  styled-card::part(header) {
    background: #2196f3;
    color: white;
  }
  
  styled-card::part(content) {
    font-size: 16px;
    line-height: 1.6;
  }
  
  styled-card::part(footer) {
    background: #4caf50;
    color: white;
    text-align: center;
  }
</style>

<styled-card>
  <h3 slot="header">自定义头部</h3>
  <p slot="content">这是卡片的内容部分，可以包含任何 HTML 内容。</p>
  <div slot="footer">底部信息</div>
</styled-card>
```

### 国际化（i18n）支持

Web Components 可以实现国际化支持：

```javascript
class I18nComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    
    // 默认语言包
    this.translations = {
      en: {
        title: 'Welcome',
        content: 'This is internationalized content',
        button: 'Click me'
      },
      zh: {
        title: '欢迎',
        content: '这是国际化内容',
        button: '点击我'
      },
      es: {
        title: 'Bienvenido',
        content: 'Este es el contenido internacionalizado',
        button: 'Haz clic en mí'
      }
    };
    
    this.currentLanguage = 'en';
    this.render();
  }
  
  // 设置语言
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      this.render();
    }
  }
  
  // 获取翻译文本
  translate(key) {
    return this.translations[this.currentLanguage][key] || key;
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 16px;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-family: Arial, sans-serif;
        }
        
        h2 {
          color: #333;
          margin-top: 0;
        }
        
        p {
          color: #666;
        }
        
        button {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <h2>${this.translate('title')}</h2>
      <p>${this.translate('content')}</p>
      <button>${this.translate('button')}</button>
    `;
  }
}

customElements.define('i18n-component', I18nComponent);
```

### 无障碍性（Accessibility）支持

确保 Web Components 支持无障碍性：

```javascript
class AccessibleComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
  }
  
  connectedCallback() {
    // 设置无障碍属性
    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'region');
    }
    
    if (!this.hasAttribute('aria-label')) {
      this.setAttribute('aria-label', '可访问组件');
    }
    
    // 初始化键盘支持
    this.setupKeyboardNavigation();
  }
  
  setupKeyboardNavigation() {
    this.addEventListener('keydown', (e) => {
      switch (e.key) {
        case 'Enter':
        case ' ':
          // 触发点击事件
          this.click();
          e.preventDefault();
          break;
        case 'ArrowUp':
          // 处理向上箭头
          this.handleUpArrow();
          e.preventDefault();
          break;
        case 'ArrowDown':
          // 处理向下箭头
          this.handleDownArrow();
          e.preventDefault();
          break;
      }
    });
  }
  
  handleUpArrow() {
    // 向上导航逻辑
    console.log('向上箭头被按下');
  }
  
  handleDownArrow() {
    // 向下导航逻辑
    console.log('向下箭头被按下');
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 16px;
          border: 2px solid #4a90e2;
          border-radius: 8px;
          outline: none;
        }
        
        :host(:focus) {
          border-color: #e91e63;
          box-shadow: 0 0 0 3px rgba(233, 30, 99, 0.3);
        }
        
        .content {
          margin-bottom: 12px;
        }
        
        button {
          background: #4a90e2;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <div class="content" tabindex="0">
        <slot name="content">可访问的内容</slot>
      </div>
      <button tabindex="0">操作按钮</button>
    `;
  }
}

customElements.define('accessible-component', AccessibleComponent);
```

## Web Components与框架集成

### 与 React 集成

Web Components 可以在 React 应用中使用：

```javascript
// React 组件中使用 Web Components
import React, { useRef, useEffect } from 'react';

function WebComponentWrapper() {
  const componentRef = useRef(null);
  
  useEffect(() => {
    const component = componentRef.current;
    
    // 监听自定义事件
    const handleCustomEvent = (e) => {
      console.log('收到自定义事件:', e.detail);
    };
    
    component.addEventListener('custom-event', handleCustomEvent);
    
    // 清理事件监听器
    return () => {
      component.removeEventListener('custom-event', handleCustomEvent);
    };
  }, []);
  
  // 设置属性
  const setAttribute = () => {
    if (componentRef.current) {
      componentRef.current.setAttribute('data-value', 'React 设置的值');
    }
  };
  
  // 调用方法
  const callMethod = () => {
    if (componentRef.current && typeof componentRef.current.publicMethod === 'function') {
      componentRef.current.publicMethod();
    }
  };
  
  return (
    <div>
      <h2>React 中使用 Web Components</h2>
      <my-custom-component 
        ref={componentRef}
        data-initial="来自 React 的初始值"
      >
        <span slot="content">通过 React 插入的内容</span>
      </my-custom-component>
      
      <button onClick={setAttribute}>设置属性</button>
      <button onClick={callMethod}>调用方法</button>
    </div>
  );
}
```

### 与 Vue 集成

Web Components 也可以在 Vue 应用中使用：

```vue
<template>
  <div>
    <h2>Vue 中使用 Web Components</h2>
    <my-custom-component 
      :data-value="componentValue"
      @custom-event="handleCustomEvent"
    >
      <span slot="content">通过 Vue 插入的内容</span>
    </my-custom-component>
    
    <button @click="updateValue">更新值</button>
  </div>
</template>

<script>
export default {
  name: 'WebComponentDemo',
  data() {
    return {
      componentValue: 'Vue 初始值'
    };
  },
  methods: {
    handleCustomEvent(event) {
      console.log('收到自定义事件:', event.detail);
    },
    updateValue() {
      this.componentValue = 'Vue 更新的值 ' + Date.now();
    }
  }
};
</script>
```

### 与 Angular 集成

在 Angular 中使用 Web Components：

```typescript
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] // 允许使用自定义元素
})
export class AppModule { }

// app.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div>
      <h2>Angular 中使用 Web Components</h2>
      <my-custom-component 
        [attr.data-value]="componentValue"
        (customEvent)="handleCustomEvent($event)">
        <span slot="content">通过 Angular 插入的内容</span>
      </my-custom-component>
      
      <button (click)="updateValue()">更新值</button>
    </div>
  `
})
export class AppComponent {
  componentValue = 'Angular 初始值';
  
  handleCustomEvent(event: CustomEvent) {
    console.log('收到自定义事件:', event.detail);
  }
  
  updateValue() {
    this.componentValue = 'Angular 更新的值 ' + Date.now();
  }
}
```

## 性能优化

### 渲染性能优化

```javascript
class OptimizedComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    
    // 使用 DocumentFragment 减少重排
    const fragment = document.createDocumentFragment();
    
    // 创建样式
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        padding: 16px;
      }
    `;
    
    // 创建内容
    const container = document.createElement('div');
    container.textContent = '优化的组件';
    
    fragment.appendChild(style);
    fragment.appendChild(container);
    
    // 一次性添加到 shadow DOM
    this.shadowRoot.appendChild(fragment);
  }
  
  // 批量更新属性
  updateAttributes(attributes) {
    // 使用 requestAnimationFrame 批量更新
    requestAnimationFrame(() => {
      Object.keys(attributes).forEach(key => {
        this.setAttribute(key, attributes[key]);
      });
    });
  }
}

customElements.define('optimized-component', OptimizedComponent);
```

### 内存管理

```javascript
class MemoryEfficientComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.eventListeners = new Map();
    this.timers = new Set();
    this.render();
  }
  
  connectedCallback() {
    // 添加事件监听器并保存引用
    this.addEventListener('click', this.handleClick);
    this.eventListeners.set('click', this.handleClick);
    
    // 启动定时器并保存引用
    const timer = setInterval(() => {
      console.log('定时器执行');
    }, 1000);
    
    this.timers.add(timer);
  }
  
  disconnectedCallback() {
    // 清理事件监听器
    this.eventListeners.forEach((handler, event) => {
      this.removeEventListener(event, handler);
    });
    
    // 清理定时器
    this.timers.forEach(timer => {
      clearInterval(timer);
    });
    
    this.eventListeners.clear();
    this.timers.clear();
  }
  
  handleClick = (e) => {
    console.log('组件被点击');
  };
  
  render() {
    this.shadowRoot.innerHTML = `
      <div>内存高效的组件</div>
    `;
  }
}

customElements.define('memory-efficient-component', MemoryEfficientComponent);
```

## 安全考虑

### 内容安全策略（CSP）

```javascript
class SecureComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    
    // 避免使用 innerHTML，使用安全的 DOM 操作
    const container = document.createElement('div');
    container.textContent = '安全的组件内容';
    
    const button = document.createElement('button');
    button.textContent = '安全按钮';
    button.addEventListener('click', this.handleClick);
    
    this.shadowRoot.appendChild(container);
    this.shadowRoot.appendChild(button);
  }
  
  // 安全的事件处理
  handleClick = () => {
    // 避免使用 eval 或类似函数
    console.log('安全的点击处理');
  };
  
  // 安全地设置属性
  setSafeAttribute(name, value) {
    // 验证属性名和值
    if (typeof name === 'string' && typeof value === 'string') {
      // 过滤特殊字符
      const safeValue = value.replace(/</g, '&lt;').replace(/>/g, '&gt;');
      this.setAttribute(name, safeValue);
    }
  }
}

customElements.define('secure-component', SecureComponent);
```

## 完整示例

下面是一个完整的 Web Components 示例，创建一个功能丰富的任务管理器组件：

```html
<!DOCTYPE html>
<html>
<head>
  <title>Web Components 任务管理器</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    
    h1 {
      color: #333;
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>Web Components 任务管理器</h1>
  
  <task-manager></task-manager>
  
  <script>
    class TaskManager extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({mode: 'open'});
        this.tasks = [];
        this.nextId = 1;
      }
      
      connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.loadTasks();
      }
      
      render() {
        this.shadowRoot.innerHTML = `
          <style>
            :host {
              display: block;
              background: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            
            .header {
              background: #4a90e2;
              color: white;
              padding: 16px;
              display: flex;
              align-items: center;
            }
            
            .header h2 {
              margin: 0;
              flex: 1;
            }
            
            .add-task {
              display: flex;
              padding: 16px;
              border-bottom: 1px solid #eee;
            }
            
            .add-task input {
              flex: 1;
              padding: 8px;
              border: 1px solid #ddd;
              border-radius: 4px;
              margin-right: 8px;
            }
            
            .add-task button {
              background: #4a90e2;
              color: white;
              border: none;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
            }
            
            .tasks {
              max-height: 400px;
              overflow-y: auto;
            }
            
            .task {
              display: flex;
              align-items: center;
              padding: 12px 16px;
              border-bottom: 1px solid #eee;
            }
            
            .task.completed {
              background: #f9f9f9;
            }
            
            .task.completed .task-text {
              text-decoration: line-through;
              color: #999;
            }
            
            .task-checkbox {
              margin-right: 12px;
            }
            
            .task-text {
              flex: 1;
              color: #333;
            }
            
            .task-actions {
              display: flex;
            }
            
            .task-actions button {
              background: none;
              border: none;
              color: #999;
              cursor: pointer;
              font-size: 16px;
              margin-left: 8px;
            }
            
            .task-actions button:hover {
              color: #e74c3c;
            }
            
            .empty-state {
              text-align: center;
              padding: 40px;
              color: #999;
            }
            
            .stats {
              padding: 16px;
              background: #f9f9f9;
              display: flex;
              justify-content: space-between;
              font-size: 14px;
              color: #666;
            }
          </style>
          
          <div class="header">
            <h2>任务管理器</h2>
          </div>
          
          <div class="add-task">
            <input type="text" id="taskInput" placeholder="添加新任务...">
            <button id="addTaskBtn">添加</button>
          </div>
          
          <div class="tasks" id="tasksContainer">
            <!-- 任务将在这里渲染 -->
          </div>
          
          <div class="stats">
            <span>总任务: <span id="totalTasks">0</span></span>
            <span>已完成: <span id="completedTasks">0</span></span>
          </div>
        `;
      }
      
      setupEventListeners() {
        const taskInput = this.shadowRoot.getElementById('taskInput');
        const addTaskBtn = this.shadowRoot.getElementById('addTaskBtn');
        
        addTaskBtn.addEventListener('click', () => {
          this.addTask(taskInput.value);
          taskInput.value = '';
          taskInput.focus();
        });
        
        taskInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            this.addTask(taskInput.value);
            taskInput.value = '';
          }
        });
      }
      
      addTask(text) {
        if (!text.trim()) return;
        
        const task = {
          id: this.nextId++,
          text: text.trim(),
          completed: false,
          createdAt: new Date()
        };
        
        this.tasks.push(task);
        this.renderTasks();
        this.updateStats();
        this.saveTasks();
      }
      
      removeTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.renderTasks();
        this.updateStats();
        this.saveTasks();
      }
      
      toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
          task.completed = !task.completed;
          this.renderTasks();
          this.updateStats();
          this.saveTasks();
        }
      }
      
      renderTasks() {
        const container = this.shadowRoot.getElementById('tasksContainer');
        
        if (this.tasks.length === 0) {
          container.innerHTML = `
            <div class="empty-state">
              <p>暂无任务</p>
              <p>添加任务开始使用</p>
            </div>
          `;
          return;
        }
        
        container.innerHTML = '';
        
        this.tasks.forEach(task => {
          const taskElement = document.createElement('div');
          taskElement.className = `task ${task.completed ? 'completed' : ''}`;
          taskElement.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}">
            <div class="task-text">${task.text}</div>
            <div class="task-actions">
              <button class="delete-btn" data-id="${task.id}">✕</button>
            </div>
          `;
          
          container.appendChild(taskElement);
        });
        
        // 添加事件监听器
        container.querySelectorAll('.task-checkbox').forEach(checkbox => {
          checkbox.addEventListener('change', (e) => {
            const id = parseInt(e.target.dataset.id);
            this.toggleTask(id);
          });
        });
        
        container.querySelectorAll('.delete-btn').forEach(button => {
          button.addEventListener('click', (e) => {
            const id = parseInt(e.target.dataset.id);
            this.removeTask(id);
          });
        });
      }
      
      updateStats() {
        const totalTasks = this.tasks.length;
        const completedTasks = this.tasks.filter(task => task.completed).length;
        
        this.shadowRoot.getElementById('totalTasks').textContent = totalTasks;
        this.shadowRoot.getElementById('completedTasks').textContent = completedTasks;
      }
      
      saveTasks() {
        try {
          localStorage.setItem('taskManagerTasks', JSON.stringify(this.tasks));
        } catch (e) {
          console.error('保存任务失败:', e);
        }
      }
      
      loadTasks() {
        try {
          const savedTasks = localStorage.getItem('taskManagerTasks');
          if (savedTasks) {
            this.tasks = JSON.parse(savedTasks);
            // 更新 nextId 以避免 ID 冲突
            const maxId = Math.max(...this.tasks.map(task => task.id), 0);
            this.nextId = maxId + 1;
          }
        } catch (e) {
          console.error('加载任务失败:', e);
          this.tasks = [];
        }
        
        this.renderTasks();
        this.updateStats();
      }
    }
    
    customElements.define('task-manager', TaskManager);
  </script>
</body>
</html>
```

## 最佳实践

### 1. 组件命名

- 使用连字符分隔的名称（如 `my-component`）
- 避免使用现有的 HTML 元素名称
- 使用描述性的名称

```javascript
// 好的命名
customElements.define('user-card', UserCard);
customElements.define('image-slider', ImageSlider);
customElements.define('data-table', DataTable);

// 避免的命名
customElements.define('div', MyDiv); // 与现有元素冲突
customElements.define('mycomponent', MyComponent); // 缺少连字符
customElements.define('button', MyButton); // 与现有元素冲突
```

### 2. 样式封装

- 使用 Shadow DOM 封装样式
- 避免样式泄漏到外部
- 使用 `:host` 选择器设置宿主样式

```javascript
class MyComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({mode: 'open'});
    
    shadow.innerHTML = `
      <style>
        /* 使用 :host 设置宿主样式 */
        :host {
          display: block;
          border: 1px solid #ccc;
        }
        
        /* 使用 :host() 设置基于属性的样式 */
        :host([disabled]) {
          opacity: 0.5;
          pointer-events: none;
        }
        
        /* 使用 :host-context() 响应外部上下文 */
        :host-context(.dark-theme) {
          background: #333;
          color: white;
        }
        
        /* 定义 CSS 自定义属性提供可定制性 */
        :host {
          --primary-color: #4a90e2;
          --border-radius: 4px;
        }
        
        .container {
          border-radius: var(--border-radius);
          padding: 16px;
        }
        
        .button {
          background: var(--primary-color);
          color: white;
        }
      </style>
      <div class="container">
        <button class="button">组件按钮</button>
      </div>
    `;
  }
}
```

### 3. 属性和属性处理

- 使用 `observedAttributes` 观察属性变化
- 在 `attributeChangedCallback` 中处理属性更新
- 提供合理的默认值

```javascript
class MyComponent extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'color', 'disabled', 'size'];
  }
  
  attributeChangedCallback(name, oldValue, newValue) {
    // 只在值真正改变时执行
    if (oldValue === newValue) return;
    
    switch (name) {
      case 'title':
        this.updateTitle(newValue);
        break;
      case 'color':
        this.updateColor(newValue);
        break;
      case 'disabled':
        this.updateDisabled(newValue !== null);
        break;
      case 'size':
        this.updateSize(newValue);
        break;
    }
  }
  
  updateTitle(title) {
    // 更新标题逻辑
    if (!this.shadowRoot) return;
    
    const titleElement = this.shadowRoot.querySelector('.title');
    if (titleElement) {
      titleElement.textContent = title || '默认标题';
    }
  }
  
  updateColor(color) {
    // 更新颜色逻辑
    if (!this.shadowRoot) return;
    
    const contentElement = this.shadowRoot.querySelector('.content');
    if (contentElement) {
      contentElement.style.color = color || 'black';
    }
  }
  
  updateDisabled(disabled) {
    // 更新禁用状态逻辑
    if (!this.shadowRoot) return;
    
    const button = this.shadowRoot.querySelector('button');
    if (button) {
      button.disabled = disabled;
    }
  }
  
  updateSize(size) {
    // 更新尺寸逻辑
    if (!this.shadowRoot) return;
    
    const container = this.shadowRoot.querySelector('.container');
    if (container) {
      container.className = `container size-${size || 'medium'}`;
    }
  }
}
```

### 4. 事件处理

- 使用自定义事件与外部通信
- 提供有意义的事件数据
- 正确处理事件生命周期

```javascript
class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        button {
          padding: 8px 16px;
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
      </style>
      <button id="actionButton">执行操作</button>
    `;
    
    this.shadowRoot.getElementById('actionButton').addEventListener('click', () => {
      this.handleAction();
    });
  }
  
  handleAction() {
    // 执行内部逻辑
    const actionData = {
      timestamp: Date.now(),
      action: 'button-click',
      componentId: this.id || 'unknown'
    };
    
    // 派发自定义事件
    this.dispatchEvent(new CustomEvent('component-action', {
      detail: actionData,
      bubbles: true,        // 是否冒泡
      composed: true        // 是否穿越 shadow DOM 边界
    }));
  }
  
  // 公共 API 方法
  performAction(data) {
    // 执行操作并派发事件
    this.dispatchEvent(new CustomEvent('action-performed', {
      detail: {
        data: data,
        timestamp: Date.now()
      }
    }));
  }
}
```

### 5. 性能优化

- 避免在构造函数中进行复杂操作
- 使用 `connectedCallback` 进行初始化
- 在 `disconnectedCallback` 中清理资源

```javascript
class OptimizedComponent extends HTMLElement {
  constructor() {
    super();
    // 只进行基本初始化
    this.data = null;
    this.timers = new Set();
    this.eventListeners = new Map();
  }
  
  connectedCallback() {
    // 在元素连接到 DOM 时进行初始化
    this.initializeComponent();
  }
  
  initializeComponent() {
    if (!this.shadowRoot) {
      this.attachShadow({mode: 'open'});
      this.render();
      this.setupEventListeners();
    }
    
    // 启动定时器
    const timer = setInterval(() => {
      this.updateData();
    }, 1000);
    
    this.timers.add(timer);
    
    // 加载数据
    this.loadData();
  }
  
  disconnectedCallback() {
    // 清理资源
    this.timers.forEach(timer => {
      clearInterval(timer);
    });
    
    this.eventListeners.forEach((handler, event) => {
      this.removeEventListener(event, handler);
    });
    
    this.timers.clear();
    this.eventListeners.clear();
  }
  
  render() {
    // 渲染逻辑
  }
  
  setupEventListeners() {
    // 设置事件监听器
  }
  
  loadData() {
    // 加载数据逻辑
  }
  
  updateData() {
    // 更新数据逻辑
  }
}
```

### 6. 错误处理

- 提供错误边界
- 优雅地处理异常
- 提供有用的错误信息

```javascript
class RobustComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
  }
  
  connectedCallback() {
    try {
      this.initialize();
    } catch (error) {
      this.handleError(error);
    }
  }
  
  initialize() {
    // 初始化逻辑
    this.render();
    this.setupEventListeners();
  }
  
  render() {
    try {
      this.shadowRoot.innerHTML = `
        <div class="component">
          <h2>稳健的组件</h2>
          <!-- 组件内容 -->
        </div>
      `;
    } catch (error) {
      this.handleError(error, '渲染组件时出错');
    }
  }
  
  handleError(error, context = '') {
    console.error(`组件错误 ${context}:`, error);
    
    // 显示用户友好的错误信息
    if (this.shadowRoot) {
      this.shadowRoot.innerHTML = `
        <div class="error">
          <h3>组件加载失败</h3>
          <p>请稍后重试或联系技术支持。</p>
        </div>
      `;
    }
  }
}
```

## 浏览器兼容性

Web Components 在现代浏览器中有良好的支持：

| 特性 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| Custom Elements | 54+ | 63+ | 10.1+ | 79+ |
| Shadow DOM | 53+ | 63+ | 10.1+ | 79+ |
| HTML Templates | 26+ | 22+ | 8+ | 13+ |
| ES Modules | 61+ | 60+ | 10.1+ | 16+ |
| CSS Custom Properties | 49+ | 36+ | 9.1+ | 15+ |
| CSS Shadow Parts | 79+ | 72+ | 13.1+ | 79+ |

对于需要支持旧浏览器的情况，可以使用 polyfills：

```html
<!-- 加载 Web Components polyfills -->
<script src="https://unpkg.com/@webcomponents/webcomponentsjs@2.5.0/webcomponents-bundle.js"></script>

<!-- 等待 Web Components 准备就绪 -->
<script>
  if (!window.customElements) {
    document.addEventListener('WebComponentsReady', function() {
      // Web Components 已准备就绪
      // 可以安全地使用自定义元素
      initializeApp();
    });
  } else {
    // 现代浏览器直接初始化
    initializeApp();
  }
  
  function initializeApp() {
    // 应用初始化逻辑
  }
</script>
```

### 渐进增强策略

```javascript
// 检测 Web Components 支持
function supportsWebComponents() {
  return 'customElements' in window && 
         'attachShadow' in Element.prototype &&
         'content' in document.createElement('template');
}

// 根据支持情况提供不同实现
if (supportsWebComponents()) {
  // 使用 Web Components
  customElements.define('modern-component', ModernComponent);
} else {
  // 提供降级方案
  document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('modern-component');
    elements.forEach(element => {
      element.innerHTML = '<div>请升级浏览器以获得最佳体验</div>';
    });
  });
}
```

## Web Components生态系统

### 流行的 Web Components 库

1. **LitElement** - 轻量级的 Web Components 库
2. **Stencil** - 用于构建可重用组件的编译器
3. **FAST** - Microsoft 的 Web Components 工具包
4. **Shoelace** - 一套基于 Web Components 的 UI 组件

### LitElement 示例

```javascript
import { LitElement, html, css } from 'lit-element';

class MyLitElement extends LitElement {
  static get properties() {
    return {
      title: { type: String },
      count: { type: Number }
    };
  }
  
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
      }
      
      button {
        background: #4a90e2;
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
      }
    `;
  }
  
  constructor() {
    super();
    this.title = 'LitElement 示例';
    this.count = 0;
  }
  
  render() {
    return html`
      <h2>${this.title}</h2>
      <p>计数: ${this.count}</p>
      <button @click="${this.increment}">增加</button>
    `;
  }
  
  increment() {
    this.count++;
  }
}

customElements.define('my-lit-element', MyLitElement);
```

### 组件库示例

```javascript
// 创建一套 UI 组件库
class UIComponentLibrary {
  static defineAll() {
    // 定义按钮组件
    class UIButton extends HTMLElement {
      // 按钮实现
    }
    
    // 定义卡片组件
    class UICard extends HTMLElement {
      // 卡片实现
    }
    
    // 定义表单组件
    class UIInput extends HTMLElement {
      // 输入框实现
    }
    
    // 注册所有组件
    customElements.define('ui-button', UIButton);
    customElements.define('ui-card', UICard);
    customElements.define('ui-input', UIInput);
  }
}

// 使用组件库
UIComponentLibrary.defineAll();
```

## 总结

Web Components 提供了一种标准化的方法来创建可重用的 Web 组件，具有以下优势：

1. **原生支持** - 不需要额外的框架或库
2. **封装性** - Shadow DOM 提供样式和标记的封装
3. **可重用性** - 可以在任何 HTML 页面中使用
4. **互操作性** - 与任何框架兼容
5. **标准化** - 基于 Web 标准

通过合理使用 Web Components，您可以构建更加模块化、可维护的 Web 应用程序，并提高代码的可重用性。

关键要点：
- 理解并正确使用四个核心技术
- 遵循最佳实践确保组件质量
- 考虑浏览器兼容性并提供降级方案
- 注重性能优化和用户体验
- 保持组件的可访问性和安全性

Web Components 是现代 Web 开发的重要技术，掌握它将帮助您构建更好的 Web 应用程序。