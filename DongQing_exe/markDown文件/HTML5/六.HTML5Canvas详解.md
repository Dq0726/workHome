# HTML5 Canvas 详解

HTML5 Canvas 是一个强大的图形绘制技术，允许开发者通过 JavaScript 在网页上绘制图形、创建动画和实现各种视觉效果。Canvas 提供了一个可绘制区域，通过 JavaScript 的 2D 渲染上下文可以绘制各种图形、图像和文本。

## 目录
1. [Canvas 基础概念](#canvas-基础概念)
2. [Canvas 基本用法](#canvas-基本用法)
3. [绘制路径](#绘制路径)
4. [绘制样式和颜色](#绘制样式和颜色)
5. [绘制文本](#绘制文本)
6. [绘制图像](#绘制图像)
7. [变形和合成](#变形和合成)
8. [动画](#动画)
9. [像素操作](#像素操作)
10. [高级绘图技术](#高级绘图技术)
11. [Canvas 安全性](#canvas-安全性)
12. [性能优化](#性能优化)
13. [完整示例](#完整示例)
14. [Canvas 最佳实践](#canvas-最佳实践)

## Canvas 基础概念

### 什么是 Canvas

Canvas 是 HTML5 中的一个元素，它提供了一个可以通过脚本（通常是 JavaScript）绘制图形的区域。Canvas 本身只是一个容器，不具有绘图能力，真正的绘图是通过 JavaScript 完成的。

Canvas 与 SVG 的主要区别：
- **Canvas** 是基于像素的位图绘图，绘制后无法修改单个元素
- **SVG** 是基于矢量的绘图，每个元素都是独立的 DOM 对象

### Canvas 的基本结构

```html
<canvas id="myCanvas" width="500" height="400">
  您的浏览器不支持 Canvas
</canvas>
```

Canvas 元素的几个重要特点：
1. 如果不设置 width 和 height 属性，默认值为 300px × 150px
2. CSS 设置的宽高会缩放画布，但不会改变画布的分辨率
3. Canvas 元素的内容可以通过 JavaScript 动态修改

### 获取绘图上下文

要在 Canvas 上绘图，首先需要获取绘图上下文：

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
```

Canvas 支持多种绘图上下文：
- `2d` - 二维绘图上下文（最常用）
- `webgl` - 三维绘图上下文（基于 OpenGL ES）
- `webgl2` - WebGL 第二版
- `bitmaprenderer` - 用于替换 Canvas 内容

### Canvas 坐标系统

Canvas 使用基于像素的二维坐标系统：
- 原点 (0, 0) 位于画布的左上角
- X 轴向右为正方向
- Y 轴向下为正方向
- 坐标值可以是浮点数，允许亚像素精度

```javascript
// 在坐标 (100.5, 50.3) 处绘制一个像素点
ctx.fillStyle = 'black';
ctx.fillRect(100.5, 50.3, 1, 1);
```

### Canvas 尺寸和分辨率

理解 Canvas 的尺寸和分辨率区别非常重要：

```javascript
const canvas = document.getElementById('myCanvas');

// 设置画布分辨率（影响绘图质量）
canvas.width = 800;
canvas.height = 600;

// 设置画布显示尺寸（CSS样式）
canvas.style.width = '400px';
canvas.style.height = '300px';

// 这样会使画布内容被压缩显示，但保持原有分辨率
```

为了在高 DPI 显示器上获得清晰的绘图效果，可以使用以下方法：

```javascript
function setupHighDPICanvas(canvas, context) {
  // 获取设备像素比
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // 获取画布的显示尺寸
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;
  
  // 检查是否需要调整画布分辨率
  if (canvas.width !== displayWidth * devicePixelRatio || 
      canvas.height !== displayHeight * devicePixelRatio) {
    
    // 调整画布分辨率
    canvas.width = displayWidth * devicePixelRatio;
    canvas.height = displayHeight * devicePixelRatio;
    
    // 缩放上下文以补偿分辨率增加
    context.scale(devicePixelRatio, devicePixelRatio);
    
    // 设置 CSS 尺寸以匹配显示尺寸
    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';
  }
}
```

## Canvas 基本用法

### 矩形绘制

Canvas 提供了三个绘制矩形的便捷方法：

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 绘制填充矩形
ctx.fillRect(10, 10, 100, 100);

// 绘制边框矩形
ctx.strokeRect(120, 10, 100, 100);

// 清除矩形区域
ctx.clearRect(50, 50, 50, 50);
```

#### fillRect 详解

`fillRect(x, y, width, height)` 方法绘制一个填充的矩形：
- `x`, `y`: 矩形左上角的坐标
- `width`, `height`: 矩形的宽度和高度

```javascript
// 绘制多个不同颜色的矩形
ctx.fillStyle = 'red';
ctx.fillRect(10, 10, 50, 50);

ctx.fillStyle = 'blue';
ctx.fillRect(70, 10, 50, 50);

ctx.fillStyle = 'green';
ctx.fillRect(130, 10, 50, 50);
```

#### strokeRect 详解

`strokeRect(x, y, width, height)` 方法绘制一个矩形边框：
- 使用当前的 `strokeStyle`、`lineWidth` 等样式属性

```javascript
// 设置边框样式
ctx.strokeStyle = 'purple';
ctx.lineWidth = 5;
ctx.strokeRect(10, 70, 100, 80);
```

#### clearRect 详解

`clearRect(x, y, width, height)` 方法清除指定矩形区域的内容：
- 将指定区域的像素设置为透明黑色（rgba(0,0,0,0)）

```javascript
// 创建一个红色矩形
ctx.fillStyle = 'red';
ctx.fillRect(10, 160, 100, 100);

// 清除矩形中心部分
setTimeout(() => {
  ctx.clearRect(30, 180, 60, 60);
}, 2000);
```

### 绘制状态的保存和恢复

Canvas 提供了保存和恢复绘图状态的方法：

```javascript
// 保存当前绘图状态
ctx.save();

// 修改绘图状态
ctx.fillStyle = 'red';
ctx.translate(50, 50);

// 绘制红色矩形
ctx.fillRect(0, 0, 100, 100);

// 恢复之前的绘图状态
ctx.restore();

// 此时绘制的矩形将是默认样式
ctx.fillRect(0, 0, 100, 100);
```

绘图状态包括以下属性：
- `strokeStyle`, `fillStyle`
- `globalAlpha`
- `lineWidth`, `lineCap`, `lineJoin`, `miterLimit`, `lineDashOffset`, `setLineDash`
- `shadowOffsetX`, `shadowOffsetY`, `shadowBlur`, `shadowColor`
- `globalCompositeOperation`
- `font`, `textAlign`, `textBaseline`, `direction`
- 当前的变换矩阵

## 绘制路径

路径是 Canvas 绘图的核心概念，通过路径可以绘制复杂的图形。

### 路径的基本操作

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

// 开始新路径
ctx.beginPath();

// 移动到起始点
ctx.moveTo(50, 50);

// 绘制线段
ctx.lineTo(150, 50);
ctx.lineTo(150, 150);
ctx.lineTo(50, 150);

// 闭合路径
ctx.closePath();

// 填充路径
ctx.fill();

// 或者绘制路径边框
// ctx.stroke();
```

#### beginPath 方法

`beginPath()` 方法开始一个新的路径：
- 清除当前路径列表
- 重置当前路径为空

```javascript
// 绘制两个不相连的路径
ctx.beginPath();
ctx.rect(10, 10, 100, 100);
ctx.fillStyle = 'red';
ctx.fill();

ctx.beginPath();
ctx.rect(120, 10, 100, 100);
ctx.fillStyle = 'blue';
ctx.fill();
```

#### moveTo 方法

`moveTo(x, y)` 方法将路径的起始点移动到指定坐标：
- 不会在路径中创建线段
- 只是设置下一个子路径的起始点

```javascript
ctx.beginPath();
ctx.moveTo(50, 50);
ctx.lineTo(150, 50);
ctx.lineTo(150, 150);
ctx.moveTo(200, 200); // 移动到新位置
ctx.lineTo(300, 200);
ctx.stroke();
```

#### lineTo 方法

`lineTo(x, y)` 方法从当前点到指定点绘制一条直线：
- 添加一条直线到当前路径
- 更新当前点为指定点

```javascript
// 绘制一个三角形
ctx.beginPath();
ctx.moveTo(100, 50);
ctx.lineTo(50, 150);
ctx.lineTo(150, 150);
ctx.closePath();
ctx.stroke();
```

#### closePath 方法

`closePath()` 方法闭合当前路径：
- 从当前点到第一个点绘制一条直线
- 不会自动开始新路径

```javascript
// 绘制一个填充的三角形
ctx.beginPath();
ctx.moveTo(100, 50);
ctx.lineTo(50, 150);
ctx.lineTo(150, 150);
ctx.closePath(); // 闭合路径
ctx.fillStyle = 'lightblue';
ctx.fill();
```

### 绘制弧线和圆

Canvas 提供了多种绘制弧线的方法：

#### arc 方法

`arc(x, y, radius, startAngle, endAngle, anticlockwise)` 方法绘制圆弧：
- `x`, `y`: 圆心坐标
- `radius`: 圆弧半径
- `startAngle`: 起始角度（弧度）
- `endAngle`: 结束角度（弧度）
- `anticlockwise`: 是否逆时针绘制（可选，默认为 false）

```javascript
// 绘制完整的圆
ctx.beginPath();
ctx.arc(100, 75, 50, 0, Math.PI * 2);
ctx.stroke();

// 绘制半圆
ctx.beginPath();
ctx.arc(250, 75, 50, 0, Math.PI);
ctx.stroke();

// 绘制逆时针圆弧
ctx.beginPath();
ctx.arc(400, 75, 50, 0, Math.PI, true);
ctx.stroke();
```

#### arcTo 方法

`arcTo(x1, y1, x2, y2, radius)` 方法绘制圆弧：
- 创建从当前点到 (x1,y1) 的切线圆弧，然后到 (x2,y2)
- `radius`: 圆弧半径

```javascript
// 绘制带圆角的矩形
ctx.beginPath();
ctx.moveTo(50, 50);
ctx.arcTo(150, 50, 150, 150, 20);
ctx.arcTo(150, 150, 50, 150, 20);
ctx.arcTo(50, 150, 50, 50, 20);
ctx.arcTo(50, 50, 150, 50, 20);
ctx.stroke();
```

### 贝塞尔曲线

Canvas 支持三次贝塞尔曲线和二次贝塞尔曲线：

#### bezierCurveTo 方法

`bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y)` 方法绘制三次贝塞尔曲线：
- `cp1x`, `cp1y`: 第一个控制点
- `cp2x`, `cp2y`: 第二个控制点
- `x`, `y`: 结束点

```javascript
// 绘制三次贝塞尔曲线
ctx.beginPath();
ctx.moveTo(50, 50);
ctx.bezierCurveTo(100, 25, 150, 75, 200, 50);
ctx.stroke();

// 可视化控制点
ctx.fillStyle = 'red';
ctx.fillRect(100, 25, 4, 4);
ctx.fillRect(150, 75, 4, 4);
ctx.fillStyle = 'blue';
ctx.fillRect(200, 50, 4, 4);
```

#### quadraticCurveTo 方法

`quadraticCurveTo(cpx, cpy, x, y)` 方法绘制二次贝塞尔曲线：
- `cpx`, `cpy`: 控制点
- `x`, `y`: 结束点

```javascript
// 绘制二次贝塞尔曲线
ctx.beginPath();
ctx.moveTo(50, 50);
ctx.quadraticCurveTo(100, 25, 150, 50);
ctx.stroke();

// 可视化控制点
ctx.fillStyle = 'red';
ctx.fillRect(100, 25, 4, 4);
ctx.fillStyle = 'blue';
ctx.fillRect(150, 50, 4, 4);
```

### 复杂路径示例

```javascript
// 绘制一个心形
ctx.beginPath();
ctx.moveTo(75, 40);
ctx.bezierCurveTo(75, 37, 70, 25, 50, 25);
ctx.bezierCurveTo(20, 25, 20, 62.5, 20, 62.5);
ctx.bezierCurveTo(20, 80, 40, 102, 75, 120);
ctx.bezierCurveTo(110, 102, 130, 80, 130, 62.5);
ctx.bezierCurveTo(130, 62.5, 130, 25, 100, 25);
ctx.bezierCurveTo(85, 25, 75, 37, 75, 40);
ctx.fill();

// 绘制一个五角星
function drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
  let rot = Math.PI / 2 * 3;
  let x = cx;
  let y = cy;
  const step = Math.PI / spikes;
  
  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);
  
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;
    
    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  
  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
}

ctx.beginPath();
drawStar(ctx, 250, 100, 5, 30, 15);
ctx.stroke();
```

## 绘制样式和颜色

### 颜色设置

Canvas 提供了多种设置颜色的方式：

```javascript
// 设置填充颜色
ctx.fillStyle = 'red';
ctx.fillStyle = '#ff0000';
ctx.fillStyle = 'rgb(255, 0, 0)';
ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';

// 设置描边颜色
ctx.strokeStyle = 'blue';
ctx.strokeStyle = '#0000ff';
ctx.strokeStyle = 'rgb(0, 0, 255)';
ctx.strokeStyle = 'rgba(0, 0, 255, 0.5)';
```

#### CSS 颜色值

Canvas 支持所有 CSS 颜色值格式：

```javascript
// 颜色名称
ctx.fillStyle = 'red';
ctx.fillStyle = 'blue';
ctx.fillStyle = 'green';

// 十六进制值
ctx.fillStyle = '#ff0000';
ctx.fillStyle = '#f00';
ctx.fillStyle = '#FF0000';

// RGB 值
ctx.fillStyle = 'rgb(255, 0, 0)';
ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';

// HSL 值
ctx.fillStyle = 'hsl(0, 100%, 50%)';
ctx.fillStyle = 'hsla(0, 100%, 50%, 0.5)';

// 关键字
ctx.fillStyle = 'transparent';
```

### 渐变

Canvas 支持线性渐变和径向渐变：

#### 线性渐变

`createLinearGradient(x0, y0, x1, y1)` 方法创建线性渐变：
- `x0`, `y0`: 渐变起始点
- `x1`, `y1`: 渐变结束点

```javascript
// 创建水平线性渐变
const linearGradient = ctx.createLinearGradient(0, 0, 200, 0);
linearGradient.addColorStop(0, 'red');
linearGradient.addColorStop(0.5, 'yellow');
linearGradient.addColorStop(1, 'blue');
ctx.fillStyle = linearGradient;
ctx.fillRect(0, 0, 200, 100);

// 创建对角线性渐变
const diagonalGradient = ctx.createLinearGradient(0, 0, 200, 200);
diagonalGradient.addColorStop(0, 'red');
diagonalGradient.addColorStop(1, 'blue');
ctx.fillStyle = diagonalGradient;
ctx.fillRect(0, 110, 200, 100);
```

#### 径向渐变

`createRadialGradient(x0, y0, r0, x1, y1, r1)` 方法创建径向渐变：
- `x0`, `y0`, `r0`: 起始圆的圆心和半径
- `x1`, `y1`, `r1`: 结束圆的圆心和半径

```javascript
// 创建径向渐变
const radialGradient = ctx.createRadialGradient(100, 100, 20, 100, 100, 80);
radialGradient.addColorStop(0, 'white');
radialGradient.addColorStop(1, 'black');
ctx.fillStyle = radialGradient;
ctx.fillRect(0, 0, 200, 200);

// 创建带偏移的径向渐变
const offsetRadialGradient = ctx.createRadialGradient(75, 75, 10, 100, 100, 50);
offsetRadialGradient.addColorStop(0, 'red');
offsetRadialGradient.addColorStop(0.5, 'yellow');
offsetRadialGradient.addColorStop(1, 'blue');
ctx.fillStyle = offsetRadialGradient;
ctx.fillRect(210, 0, 200, 200);
```

#### 渐变色标

`gradient.addColorStop(offset, color)` 方法添加颜色停止点：
- `offset`: 位置（0 到 1 之间）
- `color`: 颜色值

```javascript
// 创建彩虹渐变
const rainbowGradient = ctx.createLinearGradient(0, 0, 300, 0);
rainbowGradient.addColorStop(0, 'red');
rainbowGradient.addColorStop(1/6, 'orange');
rainbowGradient.addColorStop(2/6, 'yellow');
rainbowGradient.addColorStop(3/6, 'green');
rainbowGradient.addColorStop(4/6, 'blue');
rainbowGradient.addColorStop(5/6, 'indigo');
rainbowGradient.addColorStop(1, 'violet');
ctx.fillStyle = rainbowGradient;
ctx.fillRect(0, 0, 300, 50);
```

### 图案

Canvas 还支持使用图案填充：

```javascript
// 创建图案
const img = new Image();
img.src = 'pattern.png';
img.onload = function() {
  const pattern = ctx.createPattern(img, 'repeat');
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, 300, 300);
};
```

#### 图案重复方式

`createPattern(image, repetition)` 方法的重复参数：
- `'repeat'`: 水平和垂直重复（默认）
- `'repeat-x'`: 水平重复
- `'repeat-y'`: 垂直重复
- `'no-repeat'`: 不重复

```javascript
// 创建不同重复方式的图案
const img = new Image();
img.src = 'tile.png';
img.onload = function() {
  // 水平和垂直重复
  const pattern1 = ctx.createPattern(img, 'repeat');
  ctx.fillStyle = pattern1;
  ctx.fillRect(0, 0, 100, 100);
  
  // 只水平重复
  const pattern2 = ctx.createPattern(img, 'repeat-x');
  ctx.fillStyle = pattern2;
  ctx.fillRect(110, 0, 100, 100);
  
  // 只垂直重复
  const pattern3 = ctx.createPattern(img, 'repeat-y');
  ctx.fillStyle = pattern3;
  ctx.fillRect(220, 0, 100, 100);
  
  // 不重复
  const pattern4 = ctx.createPattern(img, 'no-repeat');
  ctx.fillStyle = pattern4;
  ctx.fillRect(330, 0, 100, 100);
};
```

### 线条样式

```javascript
// 线条宽度
ctx.lineWidth = 5;

// 线条端点样式
ctx.lineCap = 'butt';     // 默认，平直边缘
ctx.lineCap = 'round';    // 圆形端点
ctx.lineCap = 'square';   // 方形端点

// 线条连接点样式
ctx.lineJoin = 'bevel';   // 斜角连接
ctx.lineJoin = 'round';   // 圆角连接
ctx.lineJoin = 'miter';   // 尖角连接

// 尖角限制
ctx.miterLimit = 10;

// 虚线样式
ctx.setLineDash([5, 10]); // 5px 实线，10px 虚线
ctx.lineDashOffset = 5;   // 虚线偏移
```

#### lineWidth 详解

`lineWidth` 属性设置线条宽度：
- 值为正数
- 默认值为 1.0

```javascript
// 绘制不同宽度的线条
ctx.lineWidth = 1;
ctx.beginPath();
ctx.moveTo(10, 10);
ctx.lineTo(200, 10);
ctx.stroke();

ctx.lineWidth = 5;
ctx.beginPath();
ctx.moveTo(10, 30);
ctx.lineTo(200, 30);
ctx.stroke();

ctx.lineWidth = 10;
ctx.beginPath();
ctx.moveTo(10, 60);
ctx.lineTo(200, 60);
ctx.stroke();
```

#### lineCap 详解

`lineCap` 属性设置线条端点样式：

```javascript
ctx.lineWidth = 15;

// butt 端点（默认）
ctx.lineCap = 'butt';
ctx.beginPath();
ctx.moveTo(20, 20);
ctx.lineTo(180, 20);
ctx.stroke();

// round 端点
ctx.lineCap = 'round';
ctx.beginPath();
ctx.moveTo(20, 60);
ctx.lineTo(180, 60);
ctx.stroke();

// square 端点
ctx.lineCap = 'square';
ctx.beginPath();
ctx.moveTo(20, 100);
ctx.lineTo(180, 100);
ctx.stroke();
```

#### lineJoin 详解

`lineJoin` 属性设置线条连接点样式：

```javascript
ctx.lineWidth = 15;

// miter 连接点（默认）
ctx.lineJoin = 'miter';
ctx.beginPath();
ctx.moveTo(20, 20);
ctx.lineTo(100, 80);
ctx.lineTo(180, 20);
ctx.stroke();

// round 连接点
ctx.lineJoin = 'round';
ctx.beginPath();
ctx.moveTo(20, 100);
ctx.lineTo(100, 160);
ctx.lineTo(180, 100);
ctx.stroke();

// bevel 连接点
ctx.lineJoin = 'bevel';
ctx.beginPath();
ctx.moveTo(20, 180);
ctx.lineTo(100, 240);
ctx.lineTo(180, 180);
ctx.stroke();
```

#### 虚线样式

`setLineDash(segments)` 和 `lineDashOffset` 属性：

```javascript
// 简单虚线
ctx.setLineDash([5, 15]);
ctx.beginPath();
ctx.moveTo(10, 10);
ctx.lineTo(200, 10);
ctx.stroke();

// 复杂虚线模式
ctx.setLineDash([5, 10, 15, 20]);
ctx.beginPath();
ctx.moveTo(10, 30);
ctx.lineTo(200, 30);
ctx.stroke();

// 虚线偏移
ctx.setLineDash([5, 10]);
ctx.lineDashOffset = 5;
ctx.beginPath();
ctx.moveTo(10, 50);
ctx.lineTo(200, 50);
ctx.stroke();

// 重置为实线
ctx.setLineDash([]);
ctx.beginPath();
ctx.moveTo(10, 70);
ctx.lineTo(200, 70);
ctx.stroke();
```

## 绘制文本

Canvas 提供了多种绘制文本的方法：

```javascript
// 填充文本
ctx.font = '30px Arial';
ctx.fillStyle = 'black';
ctx.fillText('Hello World', 50, 50);

// 描边文本
ctx.font = '30px Arial';
ctx.strokeStyle = 'blue';
ctx.strokeText('Hello World', 50, 100);

// 文本对齐
ctx.textAlign = 'start';    // 默认，文本左侧对齐
ctx.textAlign = 'end';      // 文本右侧对齐
ctx.textAlign = 'left';     // 文本左侧对齐
ctx.textAlign = 'right';    // 文本右侧对齐
ctx.textAlign = 'center';   // 文本居中对齐

// 文本基线
ctx.textBaseline = 'top';       // 文本基线在文本顶部
ctx.textBaseline = 'hanging';   // 文本基线在悬挂基线
ctx.textBaseline = 'middle';    // 文本基线在文本中间
ctx.textBaseline = 'alphabetic'; // 默认，文本基线在字母基线
ctx.textBaseline = 'ideographic'; // 文本基线在表意字基线
ctx.textBaseline = 'bottom';    // 文本基线在文本底部

// 测量文本
const text = 'Hello World';
const metrics = ctx.measureText(text);
console.log('文本宽度:', metrics.width);
```

### font 属性

`font` 属性设置文本字体样式：

```javascript
// 字体大小和字体族
ctx.font = '30px Arial';
ctx.fillText('Arial 字体', 10, 30);

ctx.font = '30px serif';
ctx.fillText('Serif 字体', 10, 70);

ctx.font = '30px sans-serif';
ctx.fillText('Sans-serif 字体', 10, 110);

ctx.font = '30px monospace';
ctx.fillText('Monospace 字体', 10, 150);

// 字体样式
ctx.font = 'italic 30px Arial';
ctx.fillText('斜体文本', 10, 190);

ctx.font = 'bold 30px Arial';
ctx.fillText('粗体文本', 10, 230);

ctx.font = 'bold italic 30px Arial';
ctx.fillText('粗斜体文本', 10, 270);
```

### textAlign 属性

`textAlign` 属性设置文本水平对齐方式：

```javascript
ctx.font = '20px Arial';
ctx.strokeStyle = 'gray';

// 绘制对齐参考线
ctx.beginPath();
ctx.moveTo(200, 0);
ctx.lineTo(200, 300);
ctx.stroke();

// 不同对齐方式的文本
ctx.textAlign = 'start';
ctx.fillText('start 对齐', 200, 30);

ctx.textAlign = 'end';
ctx.fillText('end 对齐', 200, 60);

ctx.textAlign = 'left';
ctx.fillText('left 对齐', 200, 90);

ctx.textAlign = 'right';
ctx.fillText('right 对齐', 200, 120);

ctx.textAlign = 'center';
ctx.fillText('center 对齐', 200, 150);
```

### textBaseline 属性

`textBaseline` 属性设置文本垂直对齐方式：

```javascript
ctx.font = '20px Arial';
ctx.strokeStyle = 'gray';

// 绘制基线参考线
ctx.beginPath();
ctx.moveTo(0, 100);
ctx.lineTo(400, 100);
ctx.stroke();

// 不同基线的文本
ctx.textBaseline = 'top';
ctx.fillText('top 基线', 10, 100);

ctx.textBaseline = 'middle';
ctx.fillText('middle 基线', 100, 100);

ctx.textBaseline = 'bottom';
ctx.fillText('bottom 基线', 200, 100);

ctx.textBaseline = 'alphabetic';
ctx.fillText('alphabetic 基线', 300, 100);
```

### measureText 方法

`measureText(text)` 方法测量文本尺寸：

```javascript
ctx.font = '20px Arial';
const text = '测量文本宽度';
const metrics = ctx.measureText(text);

console.log('文本宽度:', metrics.width);
console.log('字体边界:', metrics.fontBoundingBoxAscent, metrics.fontBoundingBoxDescent);
console.log('实际边界:', metrics.actualBoundingBoxAscent, metrics.actualBoundingBoxDescent);

// 可视化文本边界
ctx.fillText(text, 50, 50);

// 绘制文本边界框
ctx.strokeStyle = 'red';
ctx.strokeRect(50, 50 - metrics.actualBoundingBoxAscent, 
               metrics.width, 
               metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent);
```

## 绘制图像

Canvas 可以绘制图像，并提供多种操作选项：

```javascript
const img = new Image();
img.src = 'image.jpg';
img.onload = function() {
  // 基本绘制
  ctx.drawImage(img, 0, 0);
  
  // 指定尺寸绘制
  ctx.drawImage(img, 0, 0, 200, 150);
  
  // 指定源和目标区域绘制
  ctx.drawImage(img, 10, 10, 50, 50, 0, 0, 100, 100);
};
```

### drawImage 方法详解

`drawImage()` 方法有三种重载形式：

#### drawImage(image, dx, dy)

在指定位置绘制图像：

```javascript
const img = new Image();
img.src = 'photo.jpg';
img.onload = function() {
  ctx.drawImage(img, 50, 50);
};
```

#### drawImage(image, dx, dy, dWidth, dHeight)

在指定位置和尺寸绘制图像：

```javascript
const img = new Image();
img.src = 'photo.jpg';
img.onload = function() {
  // 缩放图像
  ctx.drawImage(img, 50, 50, 200, 150);
  
  // 放大图像
  ctx.drawImage(img, 300, 50, 300, 300);
};
```

#### drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

裁剪并绘制图像的一部分：

```javascript
const img = new Image();
img.src = 'photo.jpg';
img.onload = function() {
  // 绘制图像的左上角四分之一
  ctx.drawImage(img, 0, 0, img.width/2, img.height/2, 50, 50, 100, 100);
  
  // 绘制图像的中心部分
  ctx.drawImage(img, 
                img.width/4, img.height/4,    // 源位置
                img.width/2, img.height/2,    // 源尺寸
                200, 50,                      // 目标位置
                100, 100);                    // 目标尺寸
};
```

### 图像处理示例

```javascript
// 灰度图像处理
function grayscaleImage(ctx, image) {
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg;     // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// 反色处理
function invertImage(ctx, image) {
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = 255 - data[i];     // red
    data[i + 1] = 255 - data[i + 1]; // green
    data[i + 2] = 255 - data[i + 2]; // blue
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// 亮度调整
function adjustBrightness(ctx, image, brightness) {
  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, Math.max(0, data[i] + brightness));     // red
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + brightness)); // green
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + brightness)); // blue
  }
  
  ctx.putImageData(imageData, 0, 0);
}
```

## 变形和合成

### 变形操作

Canvas 提供了多种变形方法：

```javascript
// 平移
ctx.translate(100, 100);

// 旋转（参数为弧度）
ctx.rotate(Math.PI / 4); // 旋转45度

// 缩放
ctx.scale(2, 2); // 水平和垂直方向都放大2倍

// 变形矩阵
ctx.transform(1, 0.2, 0.2, 1, 0, 0); // 剪切变换

// 设置变形矩阵
ctx.setTransform(1, 0, 0, 1, 0, 0); // 重置为单位矩阵
```

#### translate 方法

`translate(x, y)` 方法平移坐标系统：

```javascript
// 不使用 translate
ctx.fillStyle = 'red';
ctx.fillRect(50, 50, 100, 100);

// 使用 translate
ctx.translate(200, 0);
ctx.fillStyle = 'blue';
ctx.fillRect(50, 50, 100, 100);

// 重置变换
ctx.setTransform(1, 0, 0, 1, 0, 0);
```

#### rotate 方法

`rotate(angle)` 方法旋转坐标系统：

```javascript
// 绘制未旋转的矩形
ctx.fillStyle = 'red';
ctx.fillRect(100, 100, 100, 50);

// 旋转45度并绘制
ctx.translate(300, 125);
ctx.rotate(Math.PI / 4);
ctx.fillStyle = 'blue';
ctx.fillRect(-50, -25, 100, 50);

// 重置变换
ctx.setTransform(1, 0, 0, 1, 0, 0);
```

#### scale 方法

`scale(x, y)` 方法缩放坐标系统：

```javascript
// 正常大小
ctx.fillStyle = 'red';
ctx.fillRect(50, 50, 50, 50);

// 水平拉伸2倍
ctx.save();
ctx.translate(150, 50);
ctx.scale(2, 1);
ctx.fillStyle = 'blue';
ctx.fillRect(0, 0, 50, 50);
ctx.restore();

// 垂直拉伸2倍
ctx.save();
ctx.translate(300, 50);
ctx.scale(1, 2);
ctx.fillStyle = 'green';
ctx.fillRect(0, 0, 50, 50);
ctx.restore();

// 水平翻转
ctx.save();
ctx.translate(450, 50);
ctx.scale(-1, 1);
ctx.fillStyle = 'purple';
ctx.fillRect(-50, 0, 50, 50);
ctx.restore();
```

#### transform 方法

`transform(a, b, c, d, e, f)` 方法应用变换矩阵：

```javascript
// 变换矩阵:
// [ a c e ]
// [ b d f ]
// [ 0 0 1 ]

// 剪切变换
ctx.transform(1, 0.5, 0.5, 1, 0, 0);
ctx.fillStyle = 'red';
ctx.fillRect(50, 50, 100, 100);

// 重置变换
ctx.setTransform(1, 0, 0, 1, 0, 0);
```

#### setTransform 方法

`setTransform(a, b, c, d, e, f)` 方法设置绝对变换矩阵：

```javascript
// 设置变换矩阵
ctx.setTransform(1, 0.5, 0.5, 1, 50, 50);
ctx.fillStyle = 'blue';
ctx.fillRect(0, 0, 100, 100);

// 再次设置会覆盖之前的变换
ctx.setTransform(2, 0, 0, 2, 100, 100);
ctx.fillStyle = 'green';
ctx.fillRect(0, 0, 50, 50);
```

### 合成操作

Canvas 提供了多种全局合成操作：

```javascript
// 全局透明度
ctx.globalAlpha = 0.5;

// 合成操作
ctx.globalCompositeOperation = 'source-over';      // 默认，在目标上绘制源
ctx.globalCompositeOperation = 'source-in';        // 在目标内绘制源
ctx.globalCompositeOperation = 'source-out';       // 在目标外绘制源
ctx.globalCompositeOperation = 'source-atop';      // 在目标顶部绘制源
ctx.globalCompositeOperation = 'destination-over'; // 在源上绘制目标
ctx.globalCompositeOperation = 'destination-in';   // 在源内绘制目标
ctx.globalCompositeOperation = 'destination-out';  // 在源外绘制目标
ctx.globalCompositeOperation = 'destination-atop'; // 在源顶部绘制目标
ctx.globalCompositeOperation = 'lighter';          // 源和目标相加
ctx.globalCompositeOperation = 'copy';             // 只绘制源
ctx.globalCompositeOperation = 'xor';              // 源和目标异或
```

#### globalAlpha 属性

`globalAlpha` 属性设置全局透明度：

```javascript
// 完全不透明
ctx.globalAlpha = 1.0;
ctx.fillStyle = 'red';
ctx.fillRect(50, 50, 100, 100);

// 半透明
ctx.globalAlpha = 0.5;
ctx.fillStyle = 'blue';
ctx.fillRect(100, 100, 100, 100);

// 很透明
ctx.globalAlpha = 0.2;
ctx.fillStyle = 'green';
ctx.fillRect(150, 150, 100, 100);

// 重置透明度
ctx.globalAlpha = 1.0;
```

#### globalCompositeOperation 属性

`globalCompositeOperation` 属性设置合成操作模式：

```javascript
// 绘制背景
ctx.fillStyle = 'lightgray';
ctx.fillRect(0, 0, 400, 300);

// 绘制目标（蓝色圆）
ctx.fillStyle = 'blue';
ctx.beginPath();
ctx.arc(150, 100, 50, 0, Math.PI * 2);
ctx.fill();

// 绘制源（红色方块）使用不同合成模式
const operations = [
  'source-over', 'source-in', 'source-out', 'source-atop',
  'destination-over', 'destination-in', 'destination-out', 'destination-atop',
  'lighter', 'copy', 'xor'
];

for (let i = 0; i < operations.length; i++) {
  const x = (i % 4) * 100 + 50;
  const y = Math.floor(i / 4) * 100 + 200;
  
  ctx.globalCompositeOperation = operations[i];
  ctx.fillStyle = 'red';
  ctx.fillRect(x - 25, y - 25, 50, 50);
  
  // 标注
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'black';
  ctx.font = '10px Arial';
  ctx.fillText(operations[i], x - 25, y + 40);
}
```

## 动画

Canvas 动画通过重复绘制和清除来实现：

### 基本动画框架

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');

let x = 0;
let y = 50;

function draw() {
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 绘制内容
  ctx.fillStyle = 'red';
  ctx.fillRect(x, y, 50, 50);
  
  // 更新位置
  x += 2;
  if (x > canvas.width) {
    x = -50;
  }
  
  // 继续动画
  requestAnimationFrame(draw);
}

// 启动动画
draw();
```

### 使用 requestAnimationFrame

`requestAnimationFrame` 是创建流畅动画的最佳方式：

```javascript
let startTime = null;
const duration = 2000; // 2秒

function animate(currentTime) {
  if (!startTime) startTime = currentTime;
  const elapsed = currentTime - startTime;
  const progress = Math.min(elapsed / duration, 1);
  
  // 清除画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 根据进度绘制动画
  drawAnimation(progress);
  
  // 如果动画未完成，继续下一帧
  if (progress < 1) {
    requestAnimationFrame(animate);
  }
}

function drawAnimation(progress) {
  const x = progress * canvas.width;
  ctx.fillStyle = 'blue';
  ctx.fillRect(x, 50, 50, 50);
}

// 启动动画
requestAnimationFrame(animate);
```

### 时间控制和帧率

```javascript
class Animation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.lastTime = 0;
    this.fps = 60;
    this.frameInterval = 1000 / this.fps;
  }
  
  start() {
    this.animate(0);
  }
  
  animate(timestamp) {
    // 控制帧率
    if (timestamp - this.lastTime >= this.frameInterval) {
      this.update();
      this.draw();
      this.lastTime = timestamp;
    }
    
    requestAnimationFrame((time) => this.animate(time));
  }
  
  update() {
    // 更新逻辑
  }
  
  draw() {
    // 绘制逻辑
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

// 使用示例
const anim = new Animation(document.getElementById('myCanvas'));
anim.start();
```

### 复杂动画示例

```javascript
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.gravity = 0.1;
    this.wind = 0.01;
    
    // 创建粒子
    for (let i = 0; i < 100; i++) {
      this.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: Math.random() * 2 - 1,
        vy: Math.random() * 2 - 1,
        size: Math.random() * 5 + 1,
        color: `hsl(${Math.random() * 360}, 50%, 50%)`,
        life: Math.random() * 100 + 50
      });
    }
  }
  
  update() {
    this.particles.forEach((particle, index) => {
      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // 应用力
      particle.vy += this.gravity;
      particle.vx += this.wind;
      
      // 减少生命值
      particle.life--;
      
      // 边界检查
      if (particle.x > this.canvas.width || particle.x < 0 || 
          particle.y > this.canvas.height || particle.life <= 0) {
        // 重置粒子
        particle.x = Math.random() * this.canvas.width;
        particle.y = 0;
        particle.vx = Math.random() * 2 - 1;
        particle.vy = Math.random() * 2 - 1;
        particle.life = Math.random() * 100 + 50;
      }
    });
  }
  
  draw() {
    // 创建拖尾效果
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // 绘制粒子
    this.particles.forEach(particle => {
      this.ctx.fillStyle = particle.color;
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  
  start() {
    const animate = () => {
      this.update();
      this.draw();
      requestAnimationFrame(animate);
    };
    animate();
  }
}

// 使用示例
const canvas = document.getElementById('particleCanvas');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const particleSystem = new ParticleSystem(canvas);
particleSystem.start();
```

## 像素操作

Canvas 允许直接操作像素数据：

### 获取和设置像素数据

```javascript
// 获取图像数据
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
const data = imageData.data; // Uint8ClampedArray

// 遍历像素数据（每个像素有4个值：R, G, B, A）
for (let i = 0; i < data.length; i += 4) {
  data[i]     = 255; // red
  data[i + 1] = 0;   // green
  data[i + 2] = 0;   // blue
  data[i + 3] = 255; // alpha
}

// 将修改后的数据放回画布
ctx.putImageData(imageData, 0, 0);
```

### ImageData 对象

`ImageData` 对象包含以下属性：
- `width`: 图像宽度（像素）
- `height`: 图像高度（像素）
- `data`: 像素数据（Uint8ClampedArray）

```javascript
// 创建新的 ImageData
const imageData = ctx.createImageData(100, 100);
const data = imageData.data;

// 填充纯红色
for (let i = 0; i < data.length; i += 4) {
  data[i]     = 255; // red
  data[i + 1] = 0;   // green
  data[i + 2] = 0;   // blue
  data[i + 3] = 255; // alpha
}

// 绘制图像数据
ctx.putImageData(imageData, 50, 50);
```

### 像素操作示例

```javascript
// 创建噪点效果
function createNoise(ctx, width, height) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const color = Math.random() * 255;
    data[i]     = color; // red
    data[i + 1] = color; // green
    data[i + 2] = color; // blue
    data[i + 3] = 255;   // alpha
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// 创建渐变效果
function createGradient(ctx, width, height) {
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4;
      data[index]     = (x / width) * 255;     // red
      data[index + 1] = (y / height) * 255;    // green
      data[index + 2] = 128;                   // blue
      data[index + 3] = 255;                   // alpha
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}

// 马赛克效果
function mosaicEffect(ctx, width, height, blockSize) {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let y = 0; y < height; y += blockSize) {
    for (let x = 0; x < width; x += blockSize) {
      // 获取块的平均颜色
      let r = 0, g = 0, b = 0;
      let count = 0;
      
      for (let by = 0; by < blockSize && y + by < height; by++) {
        for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
          const index = ((y + by) * width + (x + bx)) * 4;
          r += data[index];
          g += data[index + 1];
          b += data[index + 2];
          count++;
        }
      }
      
      const avgR = r / count;
      const avgG = g / count;
      const avgB = b / count;
      
      // 应用平均颜色到整个块
      for (let by = 0; by < blockSize && y + by < height; by++) {
        for (let bx = 0; bx < blockSize && x + bx < width; bx++) {
          const index = ((y + by) * width + (x + bx)) * 4;
          data[index]     = avgR;
          data[index + 1] = avgG;
          data[index + 2] = avgB;
        }
      }
    }
  }
  
  ctx.putImageData(imageData, 0, 0);
}
```

## 高级绘图技术

### 阴影效果

Canvas 支持绘制阴影效果：

```javascript
// 设置阴影属性
ctx.shadowOffsetX = 5;    // 水平偏移
ctx.shadowOffsetY = 5;    // 垂直偏移
ctx.shadowBlur = 10;      // 模糊程度
ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'; // 阴影颜色

// 绘制带阴影的矩形
ctx.fillStyle = 'red';
ctx.fillRect(50, 50, 100, 100);

// 清除阴影设置
ctx.shadowColor = 'transparent';
```

### 裁剪路径

使用裁剪路径限制绘制区域：

```javascript
// 创建裁剪路径
ctx.beginPath();
ctx.arc(100, 100, 50, 0, Math.PI * 2);
ctx.clip(); // 应用裁剪

// 在裁剪区域内绘制
ctx.fillStyle = 'blue';
ctx.fillRect(0, 0, 200, 200);

// 重置裁剪区域
ctx.restore(); // 如果之前调用了 save()
```

### 命中检测

实现点击检测功能：

```javascript
// 简单的矩形命中检测
function isPointInRect(x, y, rectX, rectY, rectWidth, rectHeight) {
  return x >= rectX && x <= rectX + rectWidth && 
         y >= rectY && y <= rectY + rectHeight;
}

// 使用 Canvas 的内置方法
function isPointInPath(x, y) {
  ctx.beginPath();
  ctx.rect(50, 50, 100, 100);
  return ctx.isPointInPath(x, y);
}

// 复杂路径的命中检测
function isPointInComplexPath(x, y) {
  ctx.beginPath();
  ctx.moveTo(100, 50);
  ctx.bezierCurveTo(150, 100, 50, 100, 100, 150);
  ctx.closePath();
  return ctx.isPointInPath(x, y);
}
```

### 离屏渲染

使用离屏 Canvas 提高性能：

```javascript
// 创建离屏 Canvas
const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = 100;
offscreenCanvas.height = 100;
const offscreenCtx = offscreenCanvas.getContext('2d');

// 在离屏 Canvas 上绘制复杂图形
offscreenCtx.fillStyle = 'red';
offscreenCtx.beginPath();
offscreenCtx.arc(50, 50, 40, 0, Math.PI * 2);
offscreenCtx.fill();

// 将离屏 Canvas 绘制到主 Canvas
ctx.drawImage(offscreenCanvas, 0, 0);
```

## Canvas 安全性

### 污染画布

当 Canvas 绘制了跨域图像时，会变成"被污染"状态：

```javascript
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
const img = new Image();

// 跨域图像
img.src = 'http://example.com/image.jpg';
img.onload = function() {
  ctx.drawImage(img, 0, 0);
  
  try {
    // 这会抛出安全错误
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  } catch (e) {
    console.log('Canvas 已被污染，无法读取像素数据');
  }
};
```

### 解决跨域问题

使用 CORS 加载图像：

```javascript
const img = new Image();
img.crossOrigin = 'Anonymous'; // 设置跨域属性
img.src = 'http://example.com/image.jpg';
img.onload = function() {
  ctx.drawImage(img, 0, 0);
  // 现在可以安全地读取像素数据
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
};
```

## 性能优化

### 优化技巧

1. **避免频繁的状态切换**
```javascript
// 不好的做法
for (let i = 0; i < 100; i++) {
  ctx.fillStyle = 'red';
  ctx.fillRect(i * 10, 0, 5, 5);
  ctx.fillStyle = 'blue';
  ctx.fillRect(i * 10, 10, 5, 5);
}

// 好的做法
ctx.fillStyle = 'red';
for (let i = 0; i < 100; i++) {
  ctx.fillRect(i * 10, 0, 5, 5);
}
ctx.fillStyle = 'blue';
for (let i = 0; i < 100; i++) {
  ctx.fillRect(i * 10, 10, 5, 5);
}
```

2. **使用离屏 Canvas**
```javascript
// 创建离屏 Canvas
const offscreenCanvas = document.createElement('canvas');
offscreenCanvas.width = 100;
offscreenCanvas.height = 100;
const offscreenCtx = offscreenCanvas.getContext('2d');

// 在离屏 Canvas 上绘制复杂图形
offscreenCtx.fillStyle = 'red';
offscreenCtx.beginPath();
offscreenCtx.arc(50, 50, 40, 0, Math.PI * 2);
offscreenCtx.fill();

// 将离屏 Canvas 绘制到主 Canvas
ctx.drawImage(offscreenCanvas, 0, 0);
```

3. **使用 requestAnimationFrame**
```javascript
// 好的做法
function animate() {
  // 更新和绘制
  update();
  draw();
  
  // 请求下一帧
  requestAnimationFrame(animate);
}

// 不好的做法
setInterval(() => {
  update();
  draw();
}, 1000/60);
```

### 批量绘制操作

```javascript
// 批量绘制多个相似对象
function drawBatch(rectangles) {
  // 只设置一次样式
  ctx.fillStyle = 'blue';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;
  
  // 批量绘制
  rectangles.forEach(rect => {
    ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
    ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  });
}
```

### 缓存复杂图形

```javascript
class GraphicCache {
  constructor() {
    this.cache = new Map();
  }
  
  getCachedGraphic(key, drawFunction, width, height) {
    if (!this.cache.has(key)) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      drawFunction(ctx);
      this.cache.set(key, canvas);
    }
    return this.cache.get(key);
  }
}

// 使用缓存
const cache = new GraphicCache();
const starGraphic = cache.getCachedGraphic('star', (ctx) => {
  // 绘制复杂的星星图形
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  // ... 绘制代码
  ctx.fill();
}, 50, 50);

// 在多个地方使用缓存的图形
ctx.drawImage(starGraphic, 100, 100);
ctx.drawImage(starGraphic, 200, 200);
```

## 完整示例

### 交互式绘图板

```html
<!DOCTYPE html>
<html>
<head>
  <title>Canvas 绘图板</title>
  <style>
    canvas {
      border: 1px solid #000;
      cursor: crosshair;
    }
    
    .controls {
      margin: 10px 0;
    }
    
    button {
      margin: 5px;
      padding: 5px 10px;
    }
  </style>
</head>
<body>
  <h1>Canvas 绘图板</h1>
  
  <div class="controls">
    <label>颜色: 
      <input type="color" id="colorPicker" value="#000000">
    </label>
    <label>线宽: 
      <input type="range" id="lineWidth" min="1" max="20" value="2">
    </label>
    <button id="clearBtn">清空画布</button>
    <button id="saveBtn">保存图像</button>
  </div>
  
  <canvas id="drawingCanvas" width="800" height="500"></canvas>
  
  <script>
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const lineWidth = document.getElementById('lineWidth');
    const clearBtn = document.getElementById('clearBtn');
    const saveBtn = document.getElementById('saveBtn');
    
    // 绘图状态
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;
    
    // 设置初始样式
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = lineWidth.value;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    
    // 绘图函数
    function draw(e) {
      if (!isDrawing) return;
      
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
      
      lastX = e.offsetX;
      lastY = e.offsetY;
    }
    
    // 事件监听
    canvas.addEventListener('mousedown', (e) => {
      isDrawing = true;
      lastX = e.offsetX;
      lastY = e.offsetY;
    });
    
    canvas.addEventListener('mousemove', draw);
    
    canvas.addEventListener('mouseup', () => {
      isDrawing = false;
    });
    
    canvas.addEventListener('mouseout', () => {
      isDrawing = false;
    });
    
    // 控件事件
    colorPicker.addEventListener('change', () => {
      ctx.strokeStyle = colorPicker.value;
    });
    
    lineWidth.addEventListener('change', () => {
      ctx.lineWidth = lineWidth.value;
    });
    
    clearBtn.addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });
    
    saveBtn.addEventListener('click', () => {
      const dataURL = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'drawing.png';
      link.href = dataURL;
      link.click();
    });
  </script>
</body>
</html>
```

### 粒子动画系统

```html
<!DOCTYPE html>
<html>
<head>
  <title>Canvas 粒子动画</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background: #000;
      overflow: hidden;
    }
    
    canvas {
      display: block;
    }
  </style>
</head>
<body>
  <canvas id="particleCanvas"></canvas>
  
  <script>
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    
    // 设置画布大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 粒子类
    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 3 + 1;
        this.speedX = Math.random() * 3 - 1.5;
        this.speedY = Math.random() * 3 - 1.5;
        this.color = `hsl(${Math.random() * 360}, 50%, 50%)`;
      }
      
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // 边界检查
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
      }
      
      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    // 创建粒子数组
    const particles = [];
    const particleCount = 100;
    
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
    
    // 动画循环
    function animate() {
      // 创建拖尾效果
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // 更新和绘制粒子
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      
      requestAnimationFrame(animate);
    }
    
    // 启动动画
    animate();
    
    // 窗口大小调整
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  </script>
</body>
</html>
```

### 时钟示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>Canvas 时钟</title>
  <style>
    body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      margin: 0;
      background: #f0f0f0;
    }
    
    canvas {
      border: 1px solid #ccc;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
  </style>
</head>
<body>
  <canvas id="clockCanvas" width="400" height="400"></canvas>
  
  <script>
    const canvas = document.getElementById('clockCanvas');
    const ctx = canvas.getContext('2d');
    
    function drawClock() {
      // 清除画布
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 获取当前时间
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();
      
      // 计算中心点
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(centerX, centerY) - 10;
      
      // 绘制表盘
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 3;
      ctx.stroke();
      
      // 绘制中心点
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      ctx.fillStyle = 'black';
      ctx.fill();
      
      // 绘制时钟刻度
      for (let i = 0; i < 12; i++) {
        const angle = (i * Math.PI / 6) - (Math.PI / 2);
        const x1 = centerX + Math.cos(angle) * (radius - 10);
        const y1 = centerY + Math.sin(angle) * (radius - 10);
        const x2 = centerX + Math.cos(angle) * (radius - 25);
        const y2 = centerY + Math.sin(angle) * (radius - 25);
        
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      // 绘制数字
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 1; i <= 12; i++) {
        const angle = (i * Math.PI / 6) - (Math.PI / 2);
        const x = centerX + Math.cos(angle) * (radius - 40);
        const y = centerY + Math.sin(angle) * (radius - 40);
        ctx.fillStyle = 'black';
        ctx.fillText(i.toString(), x, y);
      }
      
      // 计算时针角度
      const hourAngle = (hours % 12 + minutes / 60) * (Math.PI / 6) - (Math.PI / 2);
      // 计算分针角度
      const minuteAngle = (minutes + seconds / 60) * (Math.PI / 30) - (Math.PI / 2);
      // 计算秒针角度
      const secondAngle = (seconds + milliseconds / 1000) * (Math.PI / 30) - (Math.PI / 2);
      
      // 绘制时针
      const hourHandLength = radius * 0.5;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(hourAngle) * hourHandLength,
        centerY + Math.sin(hourAngle) * hourHandLength
      );
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 6;
      ctx.stroke();
      
      // 绘制分针
      const minuteHandLength = radius * 0.7;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(minuteAngle) * minuteHandLength,
        centerY + Math.sin(minuteAngle) * minuteHandLength
      );
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 4;
      ctx.stroke();
      
      // 绘制秒针
      const secondHandLength = radius * 0.8;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(
        centerX + Math.cos(secondAngle) * secondHandLength,
        centerY + Math.sin(secondAngle) * secondHandLength
      );
      ctx.strokeStyle = 'red';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 绘制时间数字
      ctx.font = 'bold 16px Arial';
      ctx.fillStyle = 'black';
      ctx.fillText(
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
        centerX,
        centerY + 30
      );
    }
    
    // 每秒更新时钟
    setInterval(drawClock, 1000);
    
    // 初始绘制
    drawClock();
  </script>
</body>
</html>
```

## Canvas 最佳实践

### 性能优化建议

1. **最小化状态更改**
   - 批量绘制相同样式的对象
   - 避免在循环中频繁更改绘图状态

2. **使用离屏渲染**
   - 对于复杂且不经常变化的图形，使用离屏 Canvas
   - 缓存重复使用的图形元素

3. **合理使用动画**
   - 使用 `requestAnimationFrame` 而不是 `setInterval`
   - 在不可见时暂停动画

4. **优化清除操作**
   - 对于全屏动画，使用 `clearRect` 清除整个画布
   - 对于局部更新，只清除需要更新的区域

### 代码组织建议

1. **模块化设计**
   - 将不同的功能封装成独立的函数或类
   - 使用设计模式组织复杂的应用

2. **错误处理**
   - 检查 Canvas 支持情况
   - 处理图像加载失败的情况

3. **可维护性**
   - 使用常量定义配置参数
   - 添加适当的注释和文档

### 跨浏览器兼容性

1. **特性检测**
```javascript
function supportsCanvas() {
  const canvas = document.createElement('canvas');
  return !!(canvas.getContext && canvas.getContext('2d'));
}
```

2. **降级方案**
   - 为不支持 Canvas 的浏览器提供替代方案
   - 使用 polyfill 增强兼容性

## 总结

HTML5 Canvas 是一个功能强大的图形绘制技术，提供了丰富的 API 来创建各种图形、动画和交互式应用。通过掌握以下核心概念，您可以创建出令人印象深刻的视觉效果：

1. **基础绘图** - 矩形、路径、颜色和样式
2. **文本和图像处理** - 绘制文本和操作图像
3. **变形和合成** - 创建复杂的效果和过渡
4. **动画技术** - 使用 requestAnimationFrame 创建流畅动画
5. **像素操作** - 提供像素级控制能力
6. **性能优化** - 提高 Canvas 应用的运行效率

Canvas 的主要优势包括：
- 高性能的图形渲染
- 丰富的绘图 API
- 与 JavaScript 的无缝集成
- 支持像素级操作
- 良好的浏览器兼容性

通过学习和实践这些技术，您可以创建从简单的图形到复杂的交互式应用等各种项目。记住要遵循最佳实践，关注性能优化，并根据需要采用适当的设计模式来组织代码。