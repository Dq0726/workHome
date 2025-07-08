# JavaScript 模块的使用方法

## 一、JS 模块的基本使用

### 1. 支持 JS 模块的浏览器
现代浏览器均支持 ES6 模块（`<script type="module">`），但需注意：
- 需使用 `type="module"` 声明脚本类型
- 支持跨域请求（需配置 CORS）

### 2. 模块导出（被读取端处理）
假设有一个模块文件 `sample.js`，支持以下导出方式：

#### (1) 命名导出（Named Exports）
```javascript
export let user = "陆凌牛";
export function sayMessage(message) {
    alert(message);
}
```

#### (2) 直接定义后导出（推荐分模块管理）
```javascript
let user = "陆凌牛";
function sayMessage(message) {
    alert(message);
}
export { user, sayMessage }; // 集中导出
```

#### (3) 默认导出（Default Export）
```javascript
export default {
    user: "陆凌牛",
    sayMessage(message) {
        alert(message);
    }
}
```

### 3. 模块导入（读取端处理）
在需要使用模块的文件中：

#### (1) 导入命名导出
```javascript
import { user, sayMessage } from "./sample.js";
```

#### (2) 使用别名导入
```javascript
import { user as _user, sayMessage as _sayMessage } from "./sample.js";
```

#### (3) 全部导入为命名空间
```javascript
import * as sample from "./sample.js";
sample.sayMessage(sample.user); // 通过命名空间调用
```

#### (4) 导入默认导出
```javascript
import All from "./sample.js"; // 对象名可任意（如 All）
All.sayMessage(All.user);
```

## 二、JS 模块的外部引用

### 1. HTML 中引用模块文件
在 HTML 中通过 `<script>` 标签引入模块：
```html
<script type="module">
    import { user, sayMessage } from "./sample.js";
    console.log(user); // 使用模块内容
</script>
```

### 2. 引用第三方模块（示例：Three.js）
```javascript
import * as THREE from 
'https://cdnjs.cloudflare.com/ajax/libs/three.js/87/three.module.js';
// 后续可调用 THREE 的 API
```

## 注意事项
1. 模块文件需通过服务器访问（本地直接打开可能报 CORS 错误）
2. 模块默认启用严格模式（`'use strict'`）
3. 模块作用域隔离，变量不会污染全局
