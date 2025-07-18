s# Web Workers 详解

## 目录
- [什么是Web Workers](#什么是web-workers)
- [为什么需要Web Workers](#为什么需要web-workers)
- [Web Workers的类型](#web-workers的类型)
- [基本用法](#基本用法)
- [通信机制](#通信机制)
- [数据传输](#数据传输)
- [错误处理](#错误处理)
- [终止Worker](#终止worker)
- [Worker中的限制](#worker中的限制)
- [实际应用场景](#实际应用场景)
- [完整示例](#完整示例)
- [浏览器兼容性](#浏览器兼容性)
- [最佳实践](#最佳实践)

## 什么是Web Workers

Web Workers 是HTML5提供的一项技术，允许JavaScript代码在主线程之外的后台线程中运行。这意味着可以在不阻塞用户界面的情况下执行耗时的计算任务，从而创建更加流畅的Web应用程序。

Web Workers 提供了一个简单的方式来生成后台脚本，这些脚本可以独立于主线程运行，不会影响页面的响应性。

## 为什么需要Web Workers

JavaScript传统上是单线程的，这意味着所有代码都在一个线程中执行。这种设计有其优点，如简化DOM操作和避免复杂的并发问题，但也带来了明显的限制：

- **性能瓶颈**：当执行耗时的计算任务时，整个用户界面可能会冻结
- **用户体验差**：长时间运行的脚本会导致页面无响应
- **资源利用率低**：无法充分利用现代多核处理器的优势

Web Workers 解决了这些问题，通过允许将耗时的处理任务移至后台线程，使主线程可以继续响应用户交互。

## Web Workers的类型

Web Workers主要有两种类型：

### 1. 专用Worker (Dedicated Worker)

- 只能被创建它的脚本访问
- 最常用的Worker类型
- 使用 `Worker()` 构造函数创建

```javascript
// 创建一个新的专用Worker实例
// 参数是包含Worker代码的JavaScript文件的路径
// 浏览器会异步加载这个文件并在单独的线程中执行它
// Worker的创建是非阻塞的，主线程会继续执行后续代码
// 一旦创建，Worker就会立即开始运行，直到被明确终止或页面关闭
const myWorker = new Worker('worker.js');
```

### 2. 共享Worker (Shared Worker)

- 可以被多个脚本共享，即使这些脚本来自不同的窗口、iframe或其他Worker
- 使用 `SharedWorker()` 构造函数创建

```javascript
// 创建一个新的共享Worker实例
// 共享Worker可以被多个浏览器上下文(如窗口、iframe或其他Worker)共同访问
// 参数是包含共享Worker代码的JavaScript文件的路径
// 与专用Worker不同，共享Worker可以同时被多个脚本实例访问
// 这使得不同标签页、窗口或iframe之间可以共享同一个Worker实例
// 共享Worker特别适合需要在多个页面间协调工作的场景，如共享数据缓存或消息传递
const mySharedWorker = new SharedWorker('shared-worker.js');
```

## 基本用法

### 创建Worker

创建一个Worker非常简单，只需要提供一个JavaScript文件的路径：

```javascript
// 在主线程中创建Worker
// 这会初始化一个新的Worker线程，并立即开始加载和执行指定的JavaScript文件
// Worker的创建是异步的，不会阻塞主线程
const myWorker = new Worker('worker.js');
```

### Worker文件内容

Worker文件是一个独立的JavaScript文件，包含Worker线程要执行的代码：

```javascript
// worker.js - Worker线程的JavaScript文件
// 在Worker中，self引用Worker的全局作用域(相当于主线程中的window)

// 设置消息事件处理函数，用于接收来自主线程的消息
self.onmessage = function(e) {
  // 接收来自主线程的消息
  // e.data包含通过postMessage传递的数据
  const receivedData = e.data;
  
  // 进行一些计算
  // 这里可以执行任何耗时的操作，不会阻塞主线程
  const result = performHeavyCalculation(receivedData);
  
  // 将结果发送回主线程
  // postMessage是Worker与主线程通信的主要方法
  self.postMessage(result);
};

// 定义一个执行耗时计算的函数
function performHeavyCalculation(data) {
  // 这里是耗时的计算逻辑
  // 在实际应用中，这可能是复杂的数学计算、数据处理等
  return data * 2; // 简单示例
}
```

## 通信机制

Worker与主线程之间通过消息传递进行通信，这是一种事件驱动的机制。

### 从主线程发送消息到Worker

```javascript
// 主线程代码
// 创建一个新的Worker实例，指定Worker脚本的路径
const myWorker = new Worker('worker.js');

// 向Worker发送消息
// postMessage方法用于将数据从主线程传递到Worker线程
// 这里发送的是简单的数值42，但也可以发送更复杂的数据结构
myWorker.postMessage(42);
```

### 在Worker中接收消息

```javascript
// worker.js
// 设置消息事件处理函数，用于接收来自主线程的消息
self.onmessage = function(e) {
  // e是MessageEvent对象，包含从主线程传递的数据
  // e.data属性包含实际传递的数据值
  // 在Worker中，console.log输出会显示在浏览器开发者工具的控制台中
  console.log('Worker收到的数据:', e.data); // 输出: 42
};
```

### 从Worker发送消息到主线程

```javascript
// worker.js
// 使用postMessage方法从Worker向主线程发送消息
// 这是Worker与主线程通信的主要方式
// 可以发送字符串、数字、对象、数组等各种数据类型
// 数据会被结构化克隆算法复制，而不是共享引用
self.postMessage('来自Worker的消息');
```

### 在主线程中接收Worker的消息

```javascript
// 主线程代码
// 设置onmessage事件处理函数来接收Worker发送的消息
myWorker.onmessage = function(e) {
  // e是MessageEvent对象，包含从Worker线程传递的数据
  // e.data属性包含Worker通过postMessage发送的实际数据
  // 当Worker调用postMessage时，这个事件处理函数会被触发
  console.log('主线程收到的数据:', e.data);
};
```

## 数据传输

### 结构化克隆算法

当使用`postMessage()`传递数据时，浏览器使用"结构化克隆算法"来复制数据。这意味着：

- 可以传递复杂的数据结构（对象、数组等）
- 数据会被完全复制，而不是共享引用
- 这种复制可能对大型数据结构造成性能影响

```javascript
// 主线程代码
// 创建一个包含多种数据类型的复杂对象
const complexData = {
  numbers: [1, 2, 3, 4],         // 数组
  text: "Hello Worker",          // 字符串
  date: new Date(),              // 日期对象
  nested: {                      // 嵌套对象
    property: "value"
  }
};

// 将复杂对象发送给Worker
// 结构化克隆算法会深度复制这个对象及其所有属性
// 在Worker中收到的将是一个完全独立的副本
// 注意：函数、DOM节点、循环引用等某些类型不能被克隆
myWorker.postMessage(complexData);
```

### Transferable Objects

为了提高性能，可以使用Transferable Objects。这些对象的所有权会被转移而不是复制，这对于大型数据（如ArrayBuffer）特别有用：

```javascript
// 创建一个1GB的数组缓冲区
// ArrayBuffer是一个固定长度的二进制数据缓冲区
// 这里创建了一个1GB大小的缓冲区(1024 * 1024 * 1024字节)
const hugeBuffer = new ArrayBuffer(1024 * 1024 * 1024);

// 将缓冲区的所有权转移给Worker
// postMessage的第二个参数是一个数组，包含要转移所有权的对象
// 转移(transfer)意味着数据的所有权从主线程转移到Worker线程
// 这比复制更高效，特别是对于大型二进制数据
myWorker.postMessage(hugeBuffer, [hugeBuffer]);

// 此时，主线程不能再访问hugeBuffer
// 因为它的所有权已经转移到了Worker线程
// byteLength属性变为0表示缓冲区在当前上下文中已不可用
console.log(hugeBuffer.byteLength); // 输出: 0
```

支持转移的对象类型包括：
- ArrayBuffer
- MessagePort
- ImageBitmap
- OffscreenCanvas

## 错误处理

### 在Worker中处理错误

```javascript
// worker.js
try {
  // 可能会抛出错误的代码
  // 在Worker中，错误不会自动传播到主线程
  // 需要显式捕获并处理这些错误
  const result = riskyOperation();
  
  // 如果操作成功，将结果发送回主线程
  self.postMessage(result);
} catch (error) {
  // 捕获错误并将错误信息发送回主线程
  // 将错误包装在对象中，以便主线程可以识别这是一个错误
  // 这种模式允许主线程区分正常结果和错误情况
  self.postMessage({ error: error.message });
}
```

### 在主线程中捕获Worker错误

```javascript
// 主线程代码
myWorker.onerror = function(error) {
  console.error('Worker错误:', error.message);
  // 错误处理逻辑
};
```

## 终止Worker

当不再需要Worker时，应该终止它以释放资源：

### 从主线程终止Worker

```javascript
// 立即终止Worker
// terminate()方法会立即停止Worker的执行
// 所有正在进行的操作都会被中断，不会有任何回调或事件被触发
// 一旦Worker被终止，它就不能被重新启动，必须创建一个新的Worker实例
// 这是从主线程控制Worker生命周期的主要方法
myWorker.terminate();
```

### 从Worker内部终止自己

```javascript
// worker.js
// self.close()方法允许Worker自己结束自己的执行
// 这通常用于Worker完成任务后的清理工作
// 与terminate()类似，一旦调用close()，Worker就会立即停止执行
// 所有正在进行的操作都会被中断，不会有任何回调或事件被触发
// 这是Worker自行控制其生命周期的方法
self.close();
```

## Worker中的限制

Worker有一些重要的限制：

1. **无法访问DOM**：Worker不能直接操作DOM元素
2. **无法访问window对象**：Worker没有window对象的访问权限
3. **无法访问document对象**：不能使用document相关的API
4. **有限的全局对象**：只能访问部分全局对象和API

Worker可以访问的API包括：
- 自己的全局作用域（self或this）
- 标准JavaScript对象（Object, Array, Date等）
- XMLHttpRequest
- setTimeout/setInterval
- navigator对象（部分属性）
- location对象（只读）
- importScripts()方法（用于导入其他脚本）
- WebSockets
- IndexedDB
- Fetch API

## 实际应用场景

Web Workers特别适合以下场景：

1. **复杂计算**：数学计算、图像处理、数据分析等
2. **数据处理**：解析大型JSON、CSV文件
3. **实时数据处理**：处理WebSocket或SSE的持续数据流
4. **离线数据缓存**：结合IndexedDB进行大量数据的后台处理
5. **周期性后台同步**：定期与服务器同步数据而不阻塞UI
6. **加密/解密**：执行密集型加密操作

## 完整示例

下面是一个完整的示例，展示了如何使用Web Worker进行耗时的计算：

### 主页面 (index.html)

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>Web Worker示例</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        button {
            padding: 10px 15px;
            margin: 10px 5px;
            font-size: 16px;
        }
        #result {
            margin-top: 20px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 4px;
            min-height: 100px;
        }
        .progress {
            height: 20px;
            background-color: #f3f3f3;
            border-radius: 4px;
            margin: 10px 0;
            overflow: hidden;
        }
        .progress-bar {
            height: 100%;
            background-color: #4CAF50;
            width: 0%;
            transition: width 0.3s;
        }
    </style>
</head>
<body>
    <h1>Web Worker 素数计算示例</h1>
    
    <div>
        <label for="number">计算小于此数的所有素数:</label>
        <input type="number" id="number" value="100000" min="1">
    </div>
    
    <button id="calculate-main">在主线程计算</button>
    <button id="calculate-worker">使用Worker计算</button>
    <button id="animate">动画测试</button>
    
    <div class="progress">
        <div class="progress-bar" id="progress"></div>
    </div>
    
    <div id="result">
        <p>结果将显示在这里...</p>
    </div>
    
    <div id="animation" style="width: 50px; height: 50px; background-color: red; position: relative;"></div>
    
    <script>
        // 检查浏览器是否支持Web Workers
        // 通过检查window.Worker属性来确定当前浏览器是否支持Web Workers
        // 这是一种常见的特性检测模式，确保代码在不支持的浏览器中不会崩溃
        if (window.Worker) {
            // 创建一个新的Worker实例
            // 'prime-worker.js'是Worker脚本的路径，包含Worker线程将执行的代码
            // 一旦创建，Worker就会立即开始加载并执行指定的脚本
            const worker = new Worker('prime-worker.js');
            
            // 获取DOM元素引用，用于后续操作
            // 这些元素将用于显示计算结果、进度条和动画
            const resultElement = document.getElementById('result');
            const progressBar = document.getElementById('progress');
            const animation = document.getElementById('animation');
            
            // 存储动画帧请求ID的变量，用于后续取消动画
            let animationId;
            
            // 在主线程中计算素数的按钮事件处理
            // 这将在主线程上执行计算，可能会阻塞UI
            document.getElementById('calculate-main').addEventListener('click', function() {
                // 获取用户输入的数值并转换为整数
                const max = parseInt(document.getElementById('number').value);
                
                // 更新UI，显示计算正在进行
                resultElement.innerHTML = '<p>计算中...</p>';
                progressBar.style.width = '0%';
                
                // 使用setTimeout让UI有机会更新
                // 这是一个小技巧，确保"计算中..."消息和进度条重置能够在计算开始前显示出来
                // 否则，由于JavaScript单线程的特性，UI更新会被计算过程阻塞
                setTimeout(() => {
                    // 记录开始时间，用于计算执行时间
                    const startTime = performance.now();
                    
                    // 调用素数计算函数
                    // 这是一个CPU密集型操作，在主线程上执行会阻塞UI
                    const primes = findPrimes(max);
                    
                    // 记录结束时间
                    const endTime = performance.now();
                    
                    // 更新UI，显示计算结果
                    // 包括找到的素数数量、计算耗时和前10个素数
                    resultElement.innerHTML = `
                        <p>找到 ${primes.length} 个素数</p>
                        <p>耗时: ${(endTime - startTime).toFixed(2)} 毫秒</p>
                        <p>前10个素数: ${primes.slice(0, 10).join(', ')}...</p>
                    `;
                    
                    // 将进度条设置为100%，表示计算完成
                    progressBar.style.width = '100%';
                }, 10);
            });
            
            // 使用Worker计算素数的按钮事件处理
            // 这将在后台线程中执行计算，不会阻塞UI
            document.getElementById('calculate-worker').addEventListener('click', function() {
                // 获取用户输入的数值并转换为整数
                const max = parseInt(document.getElementById('number').value);
                
                // 更新UI，显示Worker计算正在进行
                resultElement.innerHTML = '<p>Worker计算中...</p>';
                progressBar.style.width = '0%';
                
                // 发送数据到Worker
                // 这会将max值传递给Worker线程进行处理
                // 通信是异步的，不会阻塞主线程
                worker.postMessage(max);
            });
            
            // 设置接收Worker消息的事件处理函数
            // 当Worker通过postMessage发送数据时，这个函数会被调用
            worker.onmessage = function(e) {
                // 根据消息类型执行不同的操作
                if (e.data.type === 'progress') {
                    // 如果是进度更新消息，更新进度条
                    // 这允许在长时间计算过程中向用户显示进度
                    progressBar.style.width = e.data.percent + '%';
                } else if (e.data.type === 'result') {
                    // 如果是结果消息，显示最终计算结果
                    const primes = e.data.primes;
                    const time = e.data.time;
                    
                    // 更新UI，显示Worker计算的结果
                    // 包括找到的素数数量、计算耗时和前10个素数
                    resultElement.innerHTML = `
                        <p>Worker找到 ${primes.length} 个素数</p>
                        <p>Worker耗时: ${time.toFixed(2)} 毫秒</p>
                        <p>前10个素数: ${primes.slice(0, 10).join(', ')}...</p>
                    `;
                    
                    // 将进度条设置为100%，表示计算完成
                    progressBar.style.width = '100%';
                }
            };
            
            // 设置Worker错误处理函数
            // 当Worker中发生未捕获的错误时，这个函数会被调用
            worker.onerror = function(error) {
                // 在结果区域显示错误信息
                // 这确保用户知道发生了错误，而不是无限等待结果
                resultElement.innerHTML = `<p>Worker错误: ${error.message}</p>`;
            };
            
            // 动画测试按钮的事件处理
            // 这个功能用于展示主线程是否被阻塞
            // 如果动画流畅运行，说明主线程没有被阻塞
            document.getElementById('animate').addEventListener('click', function() {
                if (animationId) {
                    // 如果动画正在运行，停止它
                    cancelAnimationFrame(animationId);
                    animationId = null;
                    this.textContent = '开始动画';
                } else {
                    // 如果动画没有运行，启动它
                    this.textContent = '停止动画';
                    
                    // 初始化动画参数
                    let position = 0;  // 当前位置
                    let direction = 1;  // 移动方向：1表示向右，-1表示向左
                    
                    // 定义动画函数
                    // 这个函数会在每一帧被调用，更新红色方块的位置
                    function animate() {
                        // 根据当前方向更新位置
                        position += direction * 2;
                        
                        // 检查是否需要改变方向
                        // 当方块到达右边界(700px)时，开始向左移动
                        // 当方块到达左边界(0px)时，开始向右移动
                        if (position > 700) {
                            direction = -1;
                        } else if (position < 0) {
                            direction = 1;
                        }
                        
                        // 更新方块的CSS left属性，实现移动效果
                        animation.style.left = position + 'px';
                        
                        // 请求下一帧动画
                        // 这会在浏览器的下一个重绘之前调用animate函数
                        // 创建平滑的动画效果
                        animationId = requestAnimationFrame(animate);
                    }
                    
                    // 启动动画
                    // 第一次调用animate函数，开始动画循环
                    animationId = requestAnimationFrame(animate);
                }
            });
            
            /**
             * 在主线程中计算素数的函数
             * 这是一个CPU密集型操作，在主线程上执行会阻塞UI
             * @param {number} max - 要检查的最大数字
             * @return {Array} - 找到的素数数组
             */
            function findPrimes(max) {
                // 存储找到的素数
                const primes = [];
                
                // 检查从2到max的每个数字是否为素数
                for (let i = 2; i <= max; i++) {
                    // 假设i是素数，除非证明它不是
                    let isPrime = true;
                    
                    // 检查i是否能被任何小于等于其平方根的数整除
                    // 这是一个优化：如果i能被整除，其因子之一必定小于等于√i
                    for (let j = 2; j <= Math.sqrt(i); j++) {
                        // 如果i能被j整除，那么i不是素数
                        if (i % j === 0) {
                            isPrime = false;
                            break;  // 找到一个因子就可以停止检查
                        }
                    }
                    
                    // 如果i通过了所有检查，将其添加到素数数组
                    if (isPrime) {
                        primes.push(i);
                    }
                }
                
                // 返回找到的所有素数
                return primes;
            }
        } else {
            // 如果浏览器不支持Web Workers，显示警告消息
            // 这确保用户知道为什么功能不可用
            alert('您的浏览器不支持Web Workers!');
        }
    </script>
</body>
</html>
```

### Worker文件 (prime-worker.js)

```javascript
/**
 * prime-worker.js - Web Worker用于计算素数
 * 
 * 这个Worker文件负责在后台线程中执行素数计算，
 * 并通过消息传递机制与主线程通信，报告进度和最终结果。
 */

// 设置消息事件处理函数，用于接收来自主线程的消息
// 当主线程调用postMessage时，这个函数会被触发
self.onmessage = function(e) {
    // 从事件对象中获取传入的最大值
    // e.data包含主线程通过postMessage传递的数据
    const max = e.data;
    
    // 记录开始时间，用于计算执行时间
    // performance.now()提供高精度的时间戳，单位是毫秒
    const startTime = performance.now();
    
    // 调用findPrimes函数执行实际的素数计算
    // 这是一个CPU密集型操作，但在Worker中执行不会阻塞主线程
    const primes = findPrimes(max);
    
    // 记录结束时间
    const endTime = performance.now();
    
    // 计算完成后，将结果发送回主线程
    // 使用postMessage方法发送一个包含结果信息的对象
    self.postMessage({
        type: 'result',           // 消息类型：结果
        primes: primes,           // 找到的素数数组
        time: endTime - startTime // 计算耗时（毫秒）
    });
};

/**
 * 计算给定范围内的所有素数
 * 
 * @param {number} max - 要检查的最大数字
 * @return {Array} - 找到的素数数组
 */
function findPrimes(max) {
    // 存储找到的素数
    const primes = [];
    
    // 发送初始进度消息（0%）
    // 这让主线程知道计算已经开始
    self.postMessage({
        type: 'progress',
        percent: 0
    });
    
    // 检查从2到max的每个数字是否为素数
    for (let i = 2; i <= max; i++) {
        // 假设i是素数，除非证明它不是
        let isPrime = true;
        
        // 检查i是否能被任何小于等于其平方根的数整除
        // 这是一个优化：如果i能被整除，其因子之一必定小于等于√i
        for (let j = 2; j <= Math.sqrt(i); j++) {
            // 如果i能被j整除，那么i不是素数
            if (i % j === 0) {
                isPrime = false;
                break;  // 找到一个因子就可以停止检查
            }
        }
        
        // 如果i通过了所有检查，将其添加到素数数组
        if (isPrime) {
            primes.push(i);
        }
        
        // 每处理1%的数据更新一次进度
        // 这减少了消息传递的频率，同时仍提供有用的进度更新
        if (i % Math.floor(max / 100) === 0) {
            // 发送进度更新消息
            // 计算当前进度百分比并发送给主线程
            self.postMessage({
                type: 'progress',
                percent: Math.floor(i / max * 100)
            });
        }
    }
    
    // 返回找到的所有素数
    return primes;
}
```

## 浏览器兼容性

Web Workers在现代浏览器中得到了广泛支持：

| 浏览器 | 版本支持 |
|-------|---------|
| Chrome | 4+ |
| Firefox | 3.5+ |
| Safari | 4+ |
| Edge | 12+ |
| Opera | 10.6+ |
| IE | 10+ |
| Android Browser | 4.4+ |
| iOS Safari | 5.1+ |

在使用Web Workers之前，可以进行特性检测：

```javascript
if (window.Worker) {
    // 浏览器支持Web Workers
    const myWorker = new Worker('worker.js');
} else {
    // 浏览器不支持Web Workers，提供备选方案
    console.log('您的浏览器不支持Web Workers');
}
```

## 最佳实践

### 1. 合理使用Worker

不是所有任务都适合放在Worker中执行。只有计算密集型、耗时的任务才值得使用Worker。对于简单的操作，创建Worker的开销可能超过其带来的好处。

### 2. 错误处理

始终为Worker添加错误处理，以便在Worker中发生异常时能够优雅地处理：

```javascript
worker.onerror = function(error) {
    console.error('Worker错误:', error.message);
    // 提供备选方案或向用户显示错误消息
};
```

### 3. 合理终止Worker

当不再需要Worker时，应该显式终止它以释放资源：

```javascript
// 完成任务后终止Worker
worker.terminate();
```

### 4. 避免过多的消息传递

每次消息传递都会产生序列化和反序列化的开销。尽量减少消息传递的频率，每次传递更多的数据。

### 5. 使用Transferable Objects

对于大型数据（如ArrayBuffer），使用Transferable Objects可以显著提高性能：

```javascript
const buffer = new ArrayBuffer(1024 * 1024);
worker.postMessage(buffer, [buffer]);
```

### 6. Worker池

对于需要频繁创建和销毁Worker的场景，考虑实现Worker池模式，重用Worker实例：

```javascript
/**
 * WorkerPool类 - 实现Web Worker池模式
 * 
 * 这个类管理一组可重用的Web Worker实例，避免频繁创建和销毁Worker的开销。
 * Worker池特别适用于需要频繁执行短期任务的场景，如处理批量数据或并行计算。
 */
class WorkerPool {
    /**
     * 创建一个新的Worker池
     * @param {number} size - Worker池的大小（Worker实例数量）
     * @param {string} scriptURL - Worker脚本的URL
     */
    constructor(size, scriptURL) {
        // 存储所有Worker实例及其状态
        this.workers = [];
        
        // 存储等待处理的任务队列
        this.queue = [];
        
        // 跟踪当前活跃的Worker数量
        this.activeWorkers = 0;
        
        // 初始化Worker池 - 创建指定数量的Worker实例
        for (let i = 0; i < size; i++) {
            // 创建新的Worker实例
            const worker = new Worker(scriptURL);
            
            // 将Worker及其状态信息添加到池中
            this.workers.push({
                worker: worker,   // Worker实例
                busy: false       // 初始状态为空闲
            });
            
            // 设置Worker的消息处理函数
            // 当Worker完成任务并返回结果时调用
            worker.onmessage = (e) => {
                // 从队列中获取对应的回调函数
                // 由于我们按FIFO顺序处理任务，第一个回调对应当前完成的任务
                const callback = this.queue.shift();
                if (callback) {
                    // 调用回调函数，传递null表示没有错误，e.data是Worker返回的结果
                    callback(null, e.data);
                }
                
                // 找到对应的Worker信息并将其标记为空闲
                const workerInfo = this.workers.find(w => w.worker === worker);
                if (workerInfo) {
                    workerInfo.busy = false;
                }
                
                // 减少活跃Worker计数
                this.activeWorkers--;
                
                // 尝试处理队列中的下一个任务
                this.processQueue();
            };
            
            // 设置Worker的错误处理函数
            // 当Worker中发生未捕获的错误时调用
            worker.onerror = (error) => {
                // 从队列中获取对应的回调函数
                const callback = this.queue.shift();
                if (callback) {
                    // 调用回调函数，传递错误对象
                    callback(error);
                }
                
                // 找到对应的Worker信息并将其标记为空闲
                const workerInfo = this.workers.find(w => w.worker === worker);
                if (workerInfo) {
                    workerInfo.busy = false;
                }
                
                // 减少活跃Worker计数
                this.activeWorkers--;
                
                // 尝试处理队列中的下一个任务
                this.processQueue();
            };
        }
    }
    
    /**
     * 处理任务队列
     * 尝试找到空闲的Worker来处理队列中的下一个任务
     * 如果没有空闲Worker或队列为空，则不执行任何操作
     */
    processQueue() {
        // 如果队列为空，没有任务需要处理
        if (this.queue.length === 0) return;
        
        // 查找第一个空闲的Worker
        const availableWorker = this.workers.find(w => !w.busy);
        
        // 如果找到空闲Worker，分配任务
        if (availableWorker) {
            // 从队列中获取下一个任务
            const task = this.queue.shift();
            
            // 将Worker标记为忙碌
            availableWorker.busy = true;
            
            // 增加活跃Worker计数
            this.activeWorkers++;
            
            // 向Worker发送任务数据
            // Worker将开始处理任务，完成后会触发onmessage事件
            availableWorker.worker.postMessage(task.data);
        }
    }
    
    /**
     * 执行任务
     * 将任务添加到队列并尝试立即处理
     * @param {any} data - 要发送给Worker的数据
     * @return {Promise} - 解析为Worker的结果或拒绝为错误
     */
    exec(data) {
        // 返回一个Promise，表示异步任务的最终完成或失败
        return new Promise((resolve, reject) => {
            // 将任务添加到队列
            this.queue.push({
                data: data,           // 要处理的数据
                callback: (error, result) => {
                    // 当Worker完成任务时调用的回调函数
                    if (error) reject(error);  // 如果有错误，拒绝Promise
                    else resolve(result);      // 否则，解析Promise为结果
                }
            });
            
            // 尝试立即处理新添加的任务
            this.processQueue();
        });
    }
    
    /**
     * 终止所有Worker并清空队列
     * 通常在不再需要Worker池时调用，如页面卸载时
     */
    terminate() {
        // 终止所有Worker
        this.workers.forEach(w => w.worker.terminate());
        
        // 清空Worker数组和任务队列
        this.workers = [];
        this.queue = [];
    }
}

/**
 * Worker池使用示例
 * 
 * 创建一个包含4个Worker的池，所有Worker都使用同一个脚本
 * 然后执行任务并处理结果
 */
const pool = new WorkerPool(4, 'worker.js');

// 执行任务并处理结果
// exec方法返回一个Promise，可以使用then/catch或async/await处理结果
pool.exec(data).then(result => console.log(result));
```

### 7. 导入脚本

在Worker中，可以使用`importScripts()`方法导入其他脚本：

```javascript
// worker.js
importScripts('helper1.js', 'helper2.js');

// 现在可以使用helper1.js和helper2.js中定义的函数和变量
```

### 8. 调试Worker

Worker可以使用`console`方法进行调试。在大多数现代浏览器中，Worker的控制台输出会显示在开发者工具的控制台中。

---

通过本文档，你应该对Web Workers有了全面的了解，包括它们的用途、工作原理、使用方法以及最佳实践。Web Workers是构建高性能Web应用程序的强大工具，特别是对于需要处理大量数据或执行复杂计算的应用程序。