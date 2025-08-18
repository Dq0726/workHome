
# JavaScript文件API精通指南
## 目录
- [1. 基础知识](#1-基础知识)
  - [1.1 File对象](#11-file对象)
  - [1.2 FileList对象](#12-filelist对象)
  - [1.3 基本属性和方法](#13-基本属性和方法)
- [2. FileReader API详解](#2-filereader-api详解)
  - [2.1 FileReader对象](#21-filereader对象)
  - [2.2 读取方法](#22-读取方法)
  - [2.3 事件处理](#23-事件处理)
  - [2.4 错误处理](#24-错误处理)
  - [2.5 读取进度监控](#25-读取进度监控)
- [3. 拖放API与文件](#3-拖放api与文件)
  - [3.1 拖放事件](#31-拖放事件)
  - [3.2 DataTransfer对象](#32-datatransfer对象)
  - [3.3 拖放文件示例](#33-拖放文件示例)
  - [3.4 拖放区域定制](#34-拖放区域定制)
- [4. 现代File API](#4-现代file-api)
  - [4.1 Promise-based文件操作](#41-promise-based文件操作)
  - [4.2 async/await与文件操作](#42-asyncawait与文件操作)
  - [4.3 文件类型检测](#43-文件类型检测)
  - [4.4 读取不同类型的文件](#44-读取不同类型的文件)
- [5. Blob对象详解](#5-blob对象详解)
  - [5.1 创建Blob](#51-创建blob)
  - [5.2 Blob操作](#52-blob操作)
  - [5.3 Blob转换](#53-blob转换)
  - [5.4 Blob URL](#54-blob-url)
- [6. 文件下载](#6-文件下载)
  - [6.1 使用Blob创建下载](#61-使用blob创建下载)
  - [6.2 使用Data URL下载](#62-使用data-url下载)
  - [6.3 使用服务器端生成的文件](#63-使用服务器端生成的文件)
- [7. 文件上传](#7-文件上传)
  - [7.1 基本文件上传](#71-基本文件上传)
  - [7.2 多文件上传](#72-多文件上传)
  - [7.3 分块上传大文件](#73-分块上传大文件)
  - [7.4 断点续传](#74-断点续传)
## 文件分布说明
- 第1部分：基础知识（1.1-1.3）
- 第2部分：FileReader API详解（2.1-2.5）
- 第3部分：拖放API与文件（3.1-3.4）
- 第4部分：现代File API开始（4.1-4.2）
- 第5部分：现代File API续（4.3部分）
- 第6部分：现代File API续（4.4部分开始）
- 第7部分：现代File API续（4.4部分续）
- 第8部分：现代File API续（4.4部分结束）和Blob对象详解开始（5.1部分）
- 第9部分：Blob对象详解续（5.2-5.3部分）
- 第10部分：Blob对象详解结束（5.4部分）和文件下载开始（6.1-6.2部分）
- 第11部分：文件下载结束（6.3部分）和文件上传开始（7.1部分）
- 第12部分：文件上传续（7.2-7.3部分）
- 第13部分：文件上传结束（7.4部分）
## 1. 文件API概述
### 1.1 什么是文件API
JavaScript文件API是一组允许Web应用程序与用户本地文件系统交互的接口。这些API使得Web应用能够读取、创建、修改和处理文件，而无需将文件上传到服务器。
```javascript
// 文件API的核心是一组相互关联的接口
// 主要包括：File, FileList, FileReader, Blob, URL等
```
文件API的出现解决了Web应用中的一个重要限制：在此之前，浏览器无法直接访问用户设备上的文件，所有文件操作都需要通过服务器进行。文件API使得许多以前只能在桌面应用中实现的功能现在可以在Web应用中实现。
### 1.2 历史与发展
文件API的发展经历了几个重要阶段：
```javascript
/**
 * 文件API的发展历程
 *
 * 1. 早期Web (2000年代初)
 *    - 只能通过表单上传文件
 *    - 无法直接访问文件内容
 *    - 无法在客户端处理文件
 *
 * 2. File API引入 (HTML5时代，约2010年)
 *    - 引入File和FileReader对象
 *    - 允许读取文件元数据和内容
 *    - 支持基本的客户端文件处理
 *
 * 3. 现代扩展 (2010年代中期至今)
 *    - 添加拖放支持
 *    - 改进的进度监控
 *    - 分片上传能力
 *    - Promise化的API (如file.text(), file.arrayBuffer())
 *
 * 4. 未来发展
 *    - File System Access API
 *    - 更强大的文件系统交互能力
 */
```
### 1.3 主要功能与用途
JavaScript文件API提供了多种功能，使Web应用能够以多种方式与文件交互：
```javascript
// 1. 文件选择 - 允许用户从本地文件系统选择文件
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.multiple = true; // 允许选择多个文件
fileInput.accept = 'image/*'; // 限制文件类型
// 2. 文件读取 - 读取文件内容（文本、二进制、数据URL等）
const reader = new FileReader();
reader.onload = (e) => console.log(e.target.result);
reader.readAsText(file); // 读取为文本
// 3. 文件创建 - 生成新文件并提供下载
const blob = new Blob(['文件内容'], {type: 'text/plain'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'filename.txt';
a.click();
// 4. 文件上传 - 将文件发送到服务器
const formData = new FormData();
formData.append('file', file);
fetch('/upload', {method: 'POST', body: formData});
// 5. 拖放支持 - 通过拖放操作处理文件
dropZone.addEventListener('drop', (e) => {
  e.preventDefault();
  const files = e.dataTransfer.files;
  // 处理拖放的文件
});
```
文件API的主要用途包括：
- 图像上传和预览
- 文档处理和编辑
- 媒体文件处理（音频、视频）
- 客户端文件转换和处理
- 离线应用和数据存储
- 大文件分片上传
- 生成和下载动态文件
### 1.4 浏览器支持情况
现代浏览器对文件API的支持情况：
```javascript
/**
 * 浏览器支持情况 (截至2023年)
 *
 * 基本文件API (File, FileReader, Blob):
 * - Chrome: 完全支持
 * - Firefox: 完全支持
 * - Safari: 完全支持
 * - Edge: 完全支持
 * - IE11: 部分支持，缺少现代方法
 *
 * 现代方法 (如file.text(), file.arrayBuffer()):
 * - Chrome 76+: 支持
 * - Firefox 69+: 支持
 * - Safari 14+: 支持
 * - Edge 79+: 支持
 * - IE: 不支持
 *
 * File System Access API:
 * - Chrome 86+: 支持
 * - Edge 86+: 支持
 * - Firefox, Safari: 不支持或需要标志启用
 */
// 检测基本文件API支持
function checkFileAPISupport() {
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log('基本文件API完全支持');
    return true;
  } else {
    console.warn('浏览器不完全支持文件API');
    return false;
  }
}
// 检测现代方法支持
function checkModernFileAPISupport() {
  const testFile = new File(["test"], "test.txt");
  return typeof testFile.text === 'function' &&
         typeof testFile.arrayBuffer === 'function';
}
```
## 2. 核心接口与对象
### 2.1 File对象
File对象表示用户选择的文件，继承自Blob对象，并添加了与文件系统相关的属性。
#### 2.1.1 获取File对象
```javascript
// 从input元素获取File对象
const fileInput = document.querySelector('input[type="file"]');
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0]; // 获取第一个文件
  console.log('选择的文件:', file);
});
// 从拖放事件获取File对象
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  const file = event.dataTransfer.files[0]; // 获取第一个拖放的文件
  console.log('拖放的文件:', file);
});
// 从剪贴板事件获取File对象
document.addEventListener('paste', (event) => {
  const items = event.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    if (items[i].kind === 'file') {
      const file = items[i].getAsFile(); // 获取粘贴的文件
      console.log('粘贴的文件:', file);
      break;
    }
  }
});
```
#### 2.1.2 File对象属性
```javascript
/**
 * File对象的主要属性
 * @param {File} file - 文件对象
 */
function inspectFile(file) {
  // 基本属性
  console.log('文件名:', file.name); // 完整文件名，包括扩展名
  console.log('文件大小:', file.size, '字节'); // 文件大小（字节）
  console.log('MIME类型:', file.type); // 文件的MIME类型
  console.log('最后修改时间:', new Date(file.lastModified)); // 最后修改时间
 
  // 文件名解析
  const nameParts = file.name.split('.');
  const extension = nameParts.pop(); // 获取扩展名
  const baseName = nameParts.join('.'); // 不带扩展名的文件名
  console.log('文件名(不含扩展):', baseName);
  console.log('扩展名:', extension);
  
// 判断文件类型
  if (file.type.startsWith('image/')) {
    console.log('这是一个图像文件');
  } else if (file.type.startsWith('video/')) {
    console.log('这是一个视频文件');
  } else if (file.type.startsWith('audio/')) {
    console.log('这是一个音频文件');
  } else if (file.type === 'application/pdf') {
    console.log('这是一个PDF文件');
  }
 
  // 检查文件大小
  const sizeInKB = file.size / 1024;
  const sizeInMB = sizeInKB / 1024;
  console.log('文件大小:', sizeInKB.toFixed(2), 'KB', `(${sizeInMB.toFixed(2)} MB)`);
}
// 使用示例
fileInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  if (file) {
    inspectFile(file);
  }
});
```
#### 2.1.3 创建File对象
除了从用户输入获取File对象外，还可以通过构造函数创建新的File对象：
```javascript
/**
 * 创建一个新的File对象
 * @param {Array} parts - 文件内容部分的数组
 * @param {string} name - 文件名
 * @param {Object} options - 配置选项
 * @returns {File} - 新创建的File对象
 */
function createFile(parts, name, options = {}) {
  // 默认选项
  const defaultOptions = {
    type: 'text/plain',
    lastModified: Date.now()
  };
 
  // 合并选项
  const fileOptions = { ...defaultOptions, ...options };
 
  // 创建File对象
  return new File(parts, name, fileOptions);
}
// 使用示例：创建文本文件
const textFile = createFile(['这是文件内容'], 'example.txt');
// 使用示例：创建JSON文件
const data = { name: 'John', age: 30 };
const jsonFile = createFile(
  [JSON.stringify(data, null, 2)],
  'data.json',
  { type: 'application/json' }
);
// 使用示例：创建包含多个部分的文件
const multiPartFile = createFile(
  ['第一部分', '第二部分', new Uint8Array([65, 66, 67])],
  'multi-part.txt'
);
console.log('创建的文件:', textFile);
```
### 2.2 FileList对象
FileList对象表示一个文件对象的列表，通常从`<input type="file" multiple>`元素或拖放操作中获取。
```javascript
/**
 * 处理FileList对象
 * @param {FileList} fileList - 文件列表对象
 */
function handleFileList(fileList) {
  console.log('选择的文件数量:', fileList.length);
 
  // 遍历文件列表
  for (let i = 0; i < fileList.length; i++) {
    const file = fileList[i];
    console.log(`文件 ${i+1}:`, file.name, `(${file.type}, ${file.size} 字节)`);
  }
 
  // 使用Array方法处理FileList
  const filesArray = Array.from(fileList);
 
  // 过滤特定类型的文件
  const imageFiles = filesArray.filter(file => file.type.startsWith('image/'));
  console.log('图像文件数量:', imageFiles.length);
 
  // 按大小排序
  const sortedBySize = filesArray.sort((a, b) => a.size - b.size);
  console.log('最小文件:', sortedBySize[0].name, `(${sortedBySize[0].size} 字节)`);
 
  // 计算总大小
  const totalSize = filesArray.reduce((sum, file) => sum + file.size, 0);
  console.log('总大小:', (totalSize / 1024 / 1024).toFixed(2), 'MB');
}
// 使用示例
fileInput.addEventListener('change', (event) => {
  handleFileList(event.target.files);
});
// 限制文件数量
function validateFileCount(fileList, maxFiles = 5) {
  if (fileList.length > maxFiles) {
    alert(`最多只能选择 ${maxFiles} 个文件`);
    return false;
  }
  return true;
}
// 限制文件大小
function validateFileSize(fileList, maxSizeMB = 10) {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].size > maxSizeBytes) {
      alert(`文件 "${fileList[i].name}" 超过最大大小限制 (${maxSizeMB}MB)`);
      return false;
    }
  }
  return true;
}
```
### 2.3 FileReader对象
FileReader对象允许Web应用异步读取文件内容。
#### 2.3.1 基本用法
```javascript
/**
 * 使用FileReader读取文件内容
 * @param {File} file - 要读取的文件
 * @param {string} readAs - 读取方式：'text', 'dataURL', 'arrayBuffer', 'binaryString'
 * @returns {Promise} - 包含读取结果的Promise
 */
function readFile(file, readAs = 'text') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
   
    // 设置事件处理程序
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = (event) => {
      reader.abort();
      reject(new Error('文件读取失败: ' + reader.error));
    };
   
    // 根据指定的方式读取文件
    switch (readAs.toLowerCase()) {
      case 'text':
        reader.readAsText(file);
        break;
      case 'dataurl':
        reader.readAsDataURL(file);
        break;
      case 'arraybuffer':
        reader.readAsArrayBuffer(file);
        break;
      case 'binarystring':
        reader.readAsBinaryString(file);
        break;
      default:
        reject(new Error('不支持的读取方式: ' + readAs));
    }
  });
}
// 使用示例：读取文本文件
async function displayTextFile(file) {
  try {
    const content = await readFile(file, 'text');
    console.log('文件内容:', content);
    document.getElementById('content').textContent = content;
  } catch (error) {
    console.error('读取文件失败:', error);
  }
}
// 使用示例：读取图像文件
async function displayImageFile(file) {
  try {
    const dataUrl = await readFile(file, 'dataURL');
    const img = document.createElement('img');
    img.src = dataUrl;
    document.body.appendChild(img);
  } catch (error) {
    console.error('读取图像失败:', error);
  }
}
```
#### 2.3.2 FileReader事件
```javascript
/**
 * 详细演示FileReader的所有事件
 * @param {File} file - 要读取的文件
 */
function demonstrateFileReaderEvents(file) {
  const reader = new FileReader();
 
  // 开始加载时触发
  reader.onloadstart = (event) => {
    console.log('开始读取文件');
    updateProgressBar(0);
  };
 
  // 读取进行中触发
  reader.onprogress = (event) => {
    if (event.lengthComputable) {
      const progress = (event.loaded / event.total) * 100;
      console.log(`读取进度: ${progress.toFixed(2)}%`);
      updateProgressBar(progress);
    }
  };
 
  // 读取中止时触发
  reader.onabort = (event) => {
    console.log('读取已中止');
    updateStatus('aborted');
  };
 
  // 读取出错时触发
  reader.onerror = (event) => {
    console.error('读取错误:', reader.error);
    updateStatus('error');
   
    // 错误代码
    const errorMessages = {
      1: '未找到文件',
      2: '安全错误',
      3: '读取被中止',
      4: '文件不可读',
      5: '编码错误'
    };
   
    console.error('错误详情:', errorMessages[reader.error.code] || '未知错误');
  };
 
  // 读取完成时触发（无论成功或失败）
  reader.onloadend = (event) => {
    console.log('读取操作完成');
    if (reader.readyState === FileReader.DONE && !reader.error) {
      console.log('读取成功完成');
    }
  };
 
  // 读取成功完成时触发
  reader.onload = (event) => {
    console.log('文件读取成功');
    console.log('文件大小:', event.total, '字节');
    updateStatus('success');
   
    // 处理读取结果
    const result = event.target.result;
    // 根据文件类型处理结果...
  };
 
  // 开始读取
  reader.readAsText(file);
 
  // 提供中止读取的方法
  function abortReading() {
    if (reader.readyState === FileReader.LOADING) {
      reader.abort();
    }
  }
 
  // 辅助函数
  function updateProgressBar(percent) {
    // 更新进度条UI
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = `${percent}%`;
      progressBar.textContent = `${percent.toFixed(0)}%`;
    }
  }
 
  function updateStatus(status) {
    // 更新状态UI
    const statusElement = document.getElementById('status');
    if (statusElement) {
      statusElement.textContent = status;
      statusElement.className = status;
    }
  }
}
```
#### 2.3.3 FileReader的readyState
```javascript
/**
 * FileReader的readyState常量
 *
 * FileReader.EMPTY = 0: 尚未加载任何数据
 * FileReader.LOADING = 1: 数据正在加载中
 * FileReader.DONE = 2: 读取操作已完成
 */
function monitorFileReaderState(file) {
  const reader = new FileReader();
 
  function checkState() {
    switch (reader.readyState) {
      case FileReader.EMPTY:
        console.log('状态: EMPTY - 尚未加载任何数据');
        break;
      case FileReader.LOADING:
        console.log('状态: LOADING - 数据正在加载中');
        break;
      case FileReader.DONE:
        console.log('状态: DONE - 读取操作已完成');
        break;
    }
  }
 
  // 初始状态
  checkState();
 
  // 设置事件处理程序
  reader.onloadstart = checkState;
  reader.onprogress = checkState;
  reader.onload = checkState;
  reader.onloadend = checkState;
 
  // 开始读取
  reader.readAsText(file);
}
```
### 2.4 Blob对象
Blob（Binary Large Object）对象表示一个不可变的、原始数据的类文件对象。它是File对象的父类，提供了处理二进制数据的基础功能。
#### 2.4.1 创建Blob
```javascript
/**
 * 创建不同类型的Blob对象
 */
function createBlobs() {
  // 创建文本Blob
  const textBlob = new Blob(['Hello, world!'], { type: 'text/plain' });
  console.log('文本Blob:', textBlob);
 
  // 创建JSON Blob
  const data = { name: 'John', age: 30 };
  const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  console.log('JSON Blob:', jsonBlob);
 

// 创建HTML Blob
  const htmlContent = '<html><body><h1>Hello World</h1></body></html>';
  const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
  console.log('HTML Blob:', htmlBlob);
 
  // 从TypedArray创建Blob
  const buffer = new ArrayBuffer(8);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < view.length; i++) {
    view[i] = i + 65; // ASCII值: A, B, C, ...
  }
  const binaryBlob = new Blob([buffer], { type: 'application/octet-stream' });
  console.log('二进制Blob:', binaryBlob);
 
  // 从多个源创建Blob
  const multiSourceBlob = new Blob([
    'String content,',
    ' more text,',
    new Uint8Array([65, 66, 67]),
    buffer
  ]);
  console.log('多源Blob:', multiSourceBlob);
 
  return {
    textBlob,
    jsonBlob,
    htmlBlob,
    binaryBlob,
    multiSourceBlob
  };
}
```
#### 2.4.2 Blob属性和方法
```javascript
/**
 * 演示Blob对象的属性和方法
 * @param {Blob} blob - Blob对象
 */
function demonstrateBlobProperties(blob) {
  // 属性
  console.log('Blob大小(字节):', blob.size);
  console.log('Blob MIME类型:', blob.type);
 
  // 方法: slice - 创建Blob的一个子集
  const partialBlob = blob.slice(0, 10, 'text/plain');
  console.log('部分Blob:', partialBlob);
 
  // 方法: text() - 将Blob内容读取为字符串 (返回Promise)
  blob.text().then(text => {
    console.log('Blob内容(文本):', text);
  });
 
  // 方法: arrayBuffer() - 将Blob内容读取为ArrayBuffer (返回Promise)
  blob.arrayBuffer().then(buffer => {
    console.log('Blob内容(ArrayBuffer):', buffer);
    console.log('ArrayBuffer长度:', buffer.byteLength);
   
    // 使用TypedArray查看内容
    const view = new Uint8Array(buffer);
    console.log('前10个字节:', Array.from(view.slice(0, 10)));
  });
 
  // 方法: stream() - 返回一个ReadableStream (用于流处理)
  const stream = blob.stream();
  console.log('Blob流:', stream);
 
  // 使用流处理大型Blob
  const reader = stream.getReader();
  const chunks = [];
 
  function processStream() {
    reader.read().then(({ done, value }) => {
      if (done) {
        console.log('流处理完成，收集了', chunks.length, '个块');
        return;
      }
     
      chunks.push(value);
      console.log('读取块:', value);
      processStream(); // 递归处理下一个块
    });
  }
 
  // 开始流处理
  // processStream(); // 注释掉以避免实际执行
}
```
#### 2.4.3 Blob转换
```javascript
/**
 * 演示Blob与其他数据格式的转换
 * @param {Blob} blob - 要转换的Blob对象
 */
async function demonstrateBlobConversions(blob) {
  // Blob -> 文本
  const text = await blob.text();
  console.log('Blob -> 文本:', text);
 
  // Blob -> ArrayBuffer
  const buffer = await blob.arrayBuffer();
  console.log('Blob -> ArrayBuffer:', buffer);
 
  // Blob -> Base64 (使用FileReader)
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  console.log('Blob -> Base64:', base64);
 
  // Blob -> URL
  const url = URL.createObjectURL(blob);
  console.log('Blob -> URL:', url);
 
  // 记得在不需要时释放URL
  setTimeout(() => {
    URL.revokeObjectURL(url);
    console.log('URL已释放');
  }, 5000);
 
  // 文本 -> Blob
  const textBlob = new Blob([text], { type: blob.type });
  console.log('文本 -> Blob:', textBlob);
 
  // ArrayBuffer -> Blob
  const bufferBlob = new Blob([buffer], { type: blob.type });
  console.log('ArrayBuffer -> Blob:', bufferBlob);
 
  // Base64 -> Blob
  async function base64ToBlob(base64String) {
    // 移除Data URL前缀 (如 "data:image/png;base64,")
    const parts = base64String.split(',');
    const matches = parts[0].match(/:(.*?);/);
    const contentType = matches ? matches[1] : '';
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
   
    // 将Base64解码的字符串转换为ArrayBuffer
    const buffer = new ArrayBuffer(rawLength);
    const view = new Uint8Array(buffer);
    for (let i = 0; i < rawLength; i++) {
      view[i] = raw.charCodeAt(i);
    }
   
    return new Blob([buffer], { type: contentType });
  }
 
  const blobFromBase64 = await base64ToBlob(base64);
  console.log('Base64 -> Blob:', blobFromBase64);
}
```
### 2.5 URL对象
URL对象提供了创建和管理对象URL的方法，这些URL可以用来引用内存中的文件或Blob对象。
```javascript
/**
 * 演示URL对象的使用
 * @param {Blob} blob - 要创建URL的Blob对象
 */
function demonstrateURLObject(blob) {
  // 创建对象URL
  const url = URL.createObjectURL(blob);
  console.log('创建的对象URL:', url);
 
  // 对象URL的用途
 
  // 1. 在<img>元素中显示图像
  if (blob.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Blob图像';
    document.body.appendChild(img);
    console.log('图像已添加到文档');
  }
 
  // 2. 在<a>元素中创建下载链接
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = 'blob-content.txt';
  downloadLink.textContent = '下载文件';
  document.body.appendChild(downloadLink);
  console.log('下载链接已添加到文档');
 
  // 3. 在<audio>或<video>元素中播放媒体
  if (blob.type.startsWith('audio/') || blob.type.startsWith('video/')) {
    const media = document.createElement(blob.type.startsWith('audio/') ? 'audio' : 'video');
    media.src = url;
    media.controls = true;
    document.body.appendChild(media);
    console.log('媒体元素已添加到文档');
  }
 
  // 4. 在<iframe>中显示HTML内容
  if (blob.type === 'text/html') {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    document.body.appendChild(iframe);
    console.log('iframe已添加到文档');
  }
 
  // 释放对象URL
  // 重要：当不再需要URL时，应该释放它以避免内存泄漏
  setTimeout(() => {
    URL.revokeObjectURL(url);
    console.log('对象URL已释放');
  }, 10000); // 10秒后释放
 
  // 创建和释放多个URL
  function createAndReleaseMultipleURLs() {
    const urls = [];
   
    // 创建10个URL
    for (let i = 0; i < 10; i++) {
      const smallBlob = new Blob([`Content ${i}`], { type: 'text/plain' });
      urls.push(URL.createObjectURL(smallBlob));
    }
   
    console.log('创建了10个URL:', urls);
   
    // 释放所有URL
    urls.forEach(url => URL.revokeObjectURL(url));
    console.log('所有URL已释放');
  }
 
  createAndReleaseMultipleURLs();
}
```
## 3. 文件选择与获取
### 3.1 使用input元素
`<input type="file">`元素是获取用户文件的最基本方式。
```javascript
/**
 * 创建和配置文件输入元素
 * @param {Object} options - 配置选项
 * @returns {HTMLInputElement} - 配置好的文件输入元素
 */
function createFileInput(options = {}) {
  // 默认选项
  const defaultOptions = {
    multiple: false,
    accept: '',
    capture: '',
    hidden: false
  };
 
  // 合并选项
  const config = { ...defaultOptions, ...options };
 
  // 创建input元素
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
 
  // 应用配置
  if (config.multiple) {
    fileInput.multiple = true;
  }
 
  if (config.accept) {
    fileInput.accept = config.accept;
  }
 
  if (config.capture) {
    fileInput.capture = config.capture;
  }
 
  if (config.hidden) {
    fileInput.style.display = 'none';
  }
 
  return fileInput;
}
// 使用示例：基本文件选择
const basicInput = createFileInput();
document.body.appendChild(basicInput);
// 使用示例：多文件选择
const multipleInput = createFileInput({ multiple: true });
document.body.appendChild(multipleInput);
// 使用示例：限制文件类型
const imageInput = createFileInput({ accept: 'image/*' });
document.body.appendChild(imageInput);
// 使用示例：指定多种文件类型
const documentInput = createFileInput({ accept: '.pdf,.doc,.docx,.txt' });
document.body.appendChild(documentInput);
// 使用示例：使用摄像头
const cameraInput = createFileInput({ accept: 'image/*', capture: 'camera' });
document.body.appendChild(cameraInput);
// 使用示例：隐藏输入并通过按钮触发
const hiddenInput = createFileInput({ hidden: true });
document.body.appendChild(hiddenInput);
const button = document.createElement('button');
button.textContent = '选择文件';
button.addEventListener('click', () => hiddenInput.click());
document.body.appendChild(button);
// 处理文件选择事件
function handleFileSelection(event) {
  const files = event.target.files;
  if (!files || files.length === 0) {
    console.log('未选择文件');
    return;
  }
 
  console.log('选择的文件:', files);
 
  // 处理选择的文件...
}
// 添加事件监听器
basicInput.addEventListener('change', handleFileSelection);
multipleInput.addEventListener('change', handleFileSelection);
imageInput.addEventListener('change', handleFileSelection);
documentInput.addEventListener('change', handleFileSelection);
cameraInput.addEventListener('change', handleFileSelection);
hiddenInput.addEventListener('change', handleFileSelection);
```
### 3.2 拖放API
拖放API允许用户通过拖放操作选择文件。
```javascript
/**
 * 创建一个文件拖放区域
 * @param {Object} options - 配置选项
 * @returns {HTMLElement} - 拖放区域元素
 */
function createDropZone(options = {}) {
  // 默认选项
  const defaultOptions = {
    width: '300px',
    height: '200px',
    border: '2px dashed #ccc',
    borderRadius: '8px',
    backgroundColor: '#f8f8f8',
    text: '拖放文件到这里',
    allowedTypes: null, // 允许的文件类型，如 ['image/jpeg', 'image/png']
    maxFiles: null, // 最大文件数量
    maxSize: null // 最大文件大小（字节）
  };
 
  // 合并选项
  const config = { ...defaultOptions, ...options };
 

// 创建拖放区域
  const dropZone = document.createElement('div');
  dropZone.style.width = config.width;
  dropZone.style.height = config.height;
  dropZone.style.border = config.border;
  dropZone.style.borderRadius = config.borderRadius;
  dropZone.style.backgroundColor = config.backgroundColor;
  dropZone.style.display = 'flex';
  dropZone.style.alignItems = 'center';
  dropZone.style.justifyContent = 'center';
  dropZone.style.cursor = 'pointer';
 
  // 添加提示文本
  const textElement = document.createElement('p');
  textElement.textContent = config.text;
  textElement.style.textAlign = 'center';
  textElement.style.color = '#666';
  dropZone.appendChild(textElement);
 
  // 存储配置
  dropZone.config = config;
 
  // 添加事件监听器
  setupDropZoneEvents(dropZone);
 
  return dropZone;
}
/**
 * 为拖放区域设置事件处理程序
 * @param {HTMLElement} dropZone - 拖放区域元素
 */
function setupDropZoneEvents(dropZone) {
  // 阻止默认拖放行为
  ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, preventDefaults, false);
  });
 
  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }
 
  // 高亮显示拖放区域
  ['dragenter', 'dragover'].forEach(eventName => {
    dropZone.addEventListener(eventName, highlight, false);
  });
 
  ['dragleave', 'drop'].forEach(eventName => {
    dropZone.addEventListener(eventName, unhighlight, false);
  });
 
  function highlight() {
    dropZone.style.border = '2px dashed #007bff';
    dropZone.style.backgroundColor = '#e6f2ff';
  }
 
  function unhighlight() {
    dropZone.style.border = dropZone.config.border;
    dropZone.style.backgroundColor = dropZone.config.backgroundColor;
  }
 
  // 处理拖放
  dropZone.addEventListener('drop', handleDrop, false);
 
  function handleDrop(e) {
    const dt = e.dataTransfer;
    const files = dt.files;
   
    // 验证文件
    const validFiles = validateFiles(files, dropZone.config);
   
    // 触发自定义事件
    const dropEvent = new CustomEvent('filesDrop', {
      detail: { files: validFiles.valid, invalidFiles: validFiles.invalid }
    });
    dropZone.dispatchEvent(dropEvent);
  }
 
  // 点击拖放区域也可以选择文件
  dropZone.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
   
    if (dropZone.config.allowedTypes) {
      fileInput.accept = dropZone.config.allowedTypes.join(',');
    }
   
    if (dropZone.config.maxFiles !== 1) {
      fileInput.multiple = true;
    }
   
    fileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const validFiles = validateFiles(e.target.files, dropZone.config);
       
        const changeEvent = new CustomEvent('filesDrop', {
          detail: { files: validFiles.valid, invalidFiles: validFiles.invalid }
        });
        dropZone.dispatchEvent(changeEvent);
      }
    });
   
    fileInput.click();
  });
}
/**
 * 验证文件是否符合配置要求
 * @param {FileList} files - 文件列表
 * @param {Object} config - 配置选项
 * @returns {Object} - 包含有效和无效文件的对象
 */
function validateFiles(files, config) {
  const validFiles = [];
  const invalidFiles = [];
 
  // 检查文件数量
  if (config.maxFiles && files.length > config.maxFiles) {
    console.warn(`超过最大文件数量限制 (${config.maxFiles})`);
    // 仍然处理允许的最大数量
  }
 
  // 检查每个文件
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    let isValid = true;
    let reason = '';
   
    // 检查文件类型
    if (config.allowedTypes && !config.allowedTypes.includes(file.type)) {
      isValid = false;
      reason = `不支持的文件类型: ${file.type}`;
    }
   
    // 检查文件大小
    if (isValid && config.maxSize && file.size > config.maxSize) {
      isValid = false;
      reason = `文件大小超过限制: ${file.size} > ${config.maxSize} 字节`;
    }
   
    // 添加到相应的数组
    if (isValid) {
      validFiles.push(file);
      if (config.maxFiles && validFiles.length >= config.maxFiles) {
        break; // 达到最大文件数量
      }
    } else {
      invalidFiles.push({ file, reason });
    }
  }
 
  return { valid: validFiles, invalid: invalidFiles };
}
// 使用示例
const dropZone = createDropZone({
  width: '400px',
  height: '300px',
  text: '拖放图片到这里，或点击选择图片',
  allowedTypes: ['image/jpeg', 'image/png', 'image/gif'],
  maxFiles: 5,
  maxSize: 5 * 1024 * 1024 // 5MB
});
document.body.appendChild(dropZone);
// 监听文件拖放事件
dropZone.addEventListener('filesDrop', (event) => {
  const { files, invalidFiles } = event.detail;
 
  console.log('有效文件:', files);
  console.log('无效文件:', invalidFiles);
 
  // 处理有效文件...
  files.forEach(file => {
    // 例如，创建预览
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '100px';
        img.style.maxHeight = '100px';
        img.style.margin = '5px';
        document.getElementById('previews').appendChild(img);
      };
      reader.readAsDataURL(file);
    }
  });
 
  // 显示无效文件的错误信息
  invalidFiles.forEach(({ file, reason }) => {
    console.warn(`文件 "${file.name}" 无效: ${reason}`);
  });
});
// 创建预览容器
const previewsContainer = document.createElement('div');
previewsContainer.id = 'previews';
previewsContainer.style.display = 'flex';
previewsContainer.style.flexWrap = 'wrap';
previewsContainer.style.marginTop = '20px';
document.body.appendChild(previewsContainer);
```
### 3.3 剪贴板API
剪贴板API允许从剪贴板获取文件，例如截图或复制的文件。
```javascript
/**
 * 设置剪贴板文件处理
 * @param {HTMLElement} element - 要监听粘贴事件的元素
 * @param {Function} onPaste - 粘贴文件时的回调函数
 */
function setupClipboardFileHandler(element, onPaste) {
  element.addEventListener('paste', (event) => {
    // 阻止默认粘贴行为（可选）
    // event.preventDefault();
   
    const items = event.clipboardData.items;
    const files = [];
   
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
     
      // 检查是否是文件类型
      if (item.kind === 'file') {
        const file = item.getAsFile();
        files.push(file);
        console.log('从剪贴板获取文件:', file.name, file.type, file.size);
      }
    }
   
    if (files.length > 0 && typeof onPaste === 'function') {
      onPaste(files);
    }
  });
}
// 使用示例
const pasteArea = document.createElement('div');
pasteArea.style.width = '400px';
pasteArea.style.height = '200px';
pasteArea.style.border = '2px dashed #ccc';
pasteArea.style.padding = '20px';
pasteArea.style.margin = '20px 0';
pasteArea.textContent = '在此处粘贴图片或文件 (Ctrl+V)';
pasteArea.style.display = 'flex';
pasteArea.style.alignItems = 'center';
pasteArea.style.justifyContent = 'center';
pasteArea.tabIndex = 0; // 使元素可聚焦
document.body.appendChild(pasteArea);
// 设置剪贴板处理程序
setupClipboardFileHandler(pasteArea, (files) => {
  console.log('粘贴的文件:', files);
 
  // 处理粘贴的文件
  files.forEach(file => {
    if (file.type.startsWith('image/')) {
      // 处理图像文件
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement('img');
        img.src = e.target.result;
        img.style.maxWidth = '200px';
        img.style.maxHeight = '200px';
        pasteArea.innerHTML = '';
        pasteArea.appendChild(img);
      };
      reader.readAsDataURL(file);
    } else {
      // 处理其他类型的文件
      pasteArea.textContent = `文件: ${file.name} (${file.type}, ${file.size} 字节)`;
    }
  });
});
// 聚焦粘贴区域以便于粘贴
pasteArea.focus();
// 高级：监听整个文档的粘贴事件
document.addEventListener('paste', (event) => {
  const items = event.clipboardData.items;
 
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
   
    if (item.kind === 'file') {
      const file = item.getAsFile();
      console.log('文档级粘贴文件:', file.name);
     
      // 可以在这里处理文件，或者忽略它
      // 如果你想在特定元素中处理粘贴，可以检查事件目标
      if (event.target === pasteArea) {
        console.log('在粘贴区域中粘贴');
      }
    } else if (item.kind === 'string') {
      // 处理粘贴的文本
      item.getAsString((text) => {
        console.log('粘贴的文本:', text);
      });
    }
  }
});
```
### 3.4 媒体捕获
使用媒体捕获API可以直接从用户的摄像头或麦克风获取媒体文件。
```javascript
/**
 * 从摄像头捕获图像
 * @param {Object} options - 配置选项
 * @returns {Promise<File>} - 包含捕获图像的File对象的Promise
 */
async function captureImage(options = {}) {
  // 默认选项
  const defaultOptions = {
    width: 640,
    height: 480,
    facingMode: 'user', // 'user'前置摄像头，'environment'后置摄像头
    mimeType: 'image/jpeg',
    quality: 0.8 // 0到1之间的图像质量
  };
 
  // 合并选项
  const config = { ...defaultOptions, ...options };
 
  try {
    // 请求摄像头访问权限
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: config.width },
        height: { ideal: config.height },
        facingMode: config.facingMode
      }
    });
   
    // 创建视频元素
    const video = document.createElement('video');
    video.srcObject = stream;
    video.style.display = 'none';
    document.body.appendChild(video);
   
    // 等待视频加载
    await new Promise(resolve => {
      video.onloadedmetadata = () => {
        video.play();
        resolve();
      };
    });
   
    // 给摄像头一点时间来调整亮度和对焦
    await new Promise(resolve => setTimeout(resolve, 500));
   
    // 创建canvas并绘制视频帧
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
   
    // 停止视频流
    stream.getTracks().forEach(track => track.stop());
    video.remove();
   
    // 将canvas转换为Blob
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, config.mimeType, config.quality);
    });
   

// 创建File对象
  const file = new File([blob], `capture-${Date.now()}.jpg`, {
    type: config.mimeType,
    lastModified: Date.now()
  });
 
  return file;
}
// 使用示例
async function takePicture() {
  try {
    const captureButton = document.getElementById('capture-button');
    captureButton.disabled = true;
    captureButton.textContent = '正在拍照...';
   
    const imageFile = await captureImage({
      width: 1280,
      height: 720,
      facingMode: 'environment', // 使用后置摄像头
      quality: 0.9
    });
   
    console.log('捕获的图像:', imageFile);
   
    // 显示捕获的图像
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.style.maxWidth = '100%';
      document.getElementById('capture-preview').appendChild(img);
    };
    reader.readAsDataURL(imageFile);
   
    // 可以将文件上传到服务器或进行其他处理
   
    return imageFile;
  } catch (error) {
    console.error('捕获图像失败:', error);
    alert('无法访问摄像头: ' + error.message);
  } finally {
    const captureButton = document.getElementById('capture-button');
    captureButton.disabled = false;
    captureButton.textContent = '拍照';
  }
}
/**
 * 录制视频
 * @param {Object} options - 配置选项
 * @returns {Promise<File>} - 包含录制视频的File对象的Promise
 */
async function recordVideo(options = {}) {
  // 默认选项
  const defaultOptions = {
    width: 640,
    height: 480,
    duration: 5000, // 录制时长（毫秒）
    mimeType: 'video/webm;codecs=vp9', // 或 'video/mp4'
    audioBitsPerSecond: 128000,
    videoBitsPerSecond: 2500000
  };
 
  // 合并选项
  const config = { ...defaultOptions, ...options };
 
  try {
    // 请求摄像头和麦克风访问权限
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: config.width },
        height: { ideal: config.height }
      },
      audio: true
    });
   
    // 创建视频预览元素
    const videoPreview = document.createElement('video');
    videoPreview.srcObject = stream;
    videoPreview.muted = true; // 避免反馈
    videoPreview.style.width = '100%';
    videoPreview.style.maxWidth = '400px';
    videoPreview.style.display = 'block';
    videoPreview.style.margin = '0 auto';
    document.getElementById('video-container').appendChild(videoPreview);
    videoPreview.play();
   
    // 检查支持的MIME类型
    const supportedMimeTypes = [
      'video/webm;codecs=vp9',
      'video/webm;codecs=vp8',
      'video/webm',
      'video/mp4'
    ];
   
    let mimeType = config.mimeType;
    for (const type of supportedMimeTypes) {
      if (MediaRecorder.isTypeSupported(type)) {
        mimeType = type;
        break;
      }
    }
   
    // 创建MediaRecorder
    const recorder = new MediaRecorder(stream, {
      mimeType,
      audioBitsPerSecond: config.audioBitsPerSecond,
      videoBitsPerSecond: config.videoBitsPerSecond
    });
   
    const chunks = [];
   
    // 收集录制的数据
    recorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunks.push(e.data);
      }
    };
   
    // 开始录制
    recorder.start();
    console.log('开始录制视频');
   
    // 设置录制时长
    await new Promise(resolve => setTimeout(resolve, config.duration));
   
    // 停止录制
    recorder.stop();
   
    // 等待录制完成
    const recordedBlob = await new Promise(resolve => {
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: mimeType });
        resolve(blob);
      };
    });
   
    // 停止所有媒体轨道
    stream.getTracks().forEach(track => track.stop());
   
    // 移除预览
    videoPreview.remove();
   
    // 创建File对象
    const file = new File([recordedBlob], `video-${Date.now()}.webm`, {
      type: mimeType,
      lastModified: Date.now()
    });
   
    return file;
  } catch (error) {
    console.error('录制视频失败:', error);
    throw error;
  }
}
// 使用示例
async function startVideoRecording() {
  try {
    const recordButton = document.getElementById('record-button');
    recordButton.disabled = true;
    recordButton.textContent = '正在录制...';
   
    // 创建视频容器
    const videoContainer = document.createElement('div');
    videoContainer.id = 'video-container';
    document.body.appendChild(videoContainer);
   
    const videoFile = await recordVideo({
      duration: 5000, // 5秒
      width: 1280,
      height: 720
    });
   
    console.log('录制的视频:', videoFile);
   
    // 显示录制的视频
    const videoURL = URL.createObjectURL(videoFile);
    const videoElement = document.createElement('video');
    videoElement.src = videoURL;
    videoElement.controls = true;
    videoElement.style.width = '100%';
    videoElement.style.maxWidth = '400px';
    document.body.appendChild(videoElement);
   
    // 可以将文件上传到服务器或进行其他处理
   
    return videoFile;
  } catch (error) {
    console.error('视频录制失败:', error);
    alert('无法录制视频: ' + error.message);
  } finally {
    const recordButton = document.getElementById('record-button');
    recordButton.disabled = false;
    recordButton.textContent = '录制视频';
   
    // 清理视频容器
    const videoContainer = document.getElementById('video-container');
    if (videoContainer) {
      videoContainer.remove();
    }
  }
}
```
## 4. 读取文件内容
### 4.1 使用FileReader
FileReader是读取文件内容的传统方式，支持多种格式的读取。
```javascript
/**
 * 使用FileReader读取文件内容的完整示例
 * @param {File} file - 要读取的文件
 * @param {string} readAs - 读取方式
 * @returns {Promise} - 包含读取结果的Promise
 */
function readFileContent(file, readAs = 'text') {
  return new Promise((resolve, reject) => {
    // 创建FileReader实例
    const reader = new FileReader();
   
    // 设置成功回调
    reader.onload = (event) => {
      resolve(event.target.result);
    };
   
    // 设置错误回调
    reader.onerror = (event) => {
      reject(new Error(`文件读取失败: ${reader.error.message}`));
    };
   
    // 设置进度回调（可选）
    reader.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        console.log(`读取进度: ${percent}%`);
      }
    };
   
    // 根据指定的方式读取文件
    try {
      switch (readAs.toLowerCase()) {
        case 'text':
          reader.readAsText(file);
          break;
        case 'dataurl':
        case 'datauri':
          reader.readAsDataURL(file);
          break;
        case 'arraybuffer':
          reader.readAsArrayBuffer(file);
          break;
        case 'binarystring':
          reader.readAsBinaryString(file);
          break;
        default:
          reject(new Error(`不支持的读取方式: ${readAs}`));
      }
    } catch (error) {
      reject(error);
    }
  });
}
// 使用示例：读取文本文件
async function readTextFile(file) {
  try {
    const text = await readFileContent(file, 'text');
    console.log('文件内容:', text);
    return text;
  } catch (error) {
    console.error('读取文本文件失败:', error);
    throw error;
  }
}
// 使用示例：读取图像文件为Data URL
async function readImageAsDataURL(file) {
  if (!file.type.startsWith('image/')) {
    throw new Error('不是图像文件');
  }
 
  try {
    const dataURL = await readFileContent(file, 'dataURL');
    console.log('图像Data URL:', dataURL.substring(0, 50) + '...');
    return dataURL;
  } catch (error) {
    console.error('读取图像文件失败:', error);
    throw error;
  }
}
// 使用示例：读取二进制文件为ArrayBuffer
async function readBinaryFile(file) {
  try {
    const arrayBuffer = await readFileContent(file, 'arrayBuffer');
    console.log('文件大小:', arrayBuffer.byteLength, '字节');
   
    // 查看前10个字节
    const view = new Uint8Array(arrayBuffer);
    const firstBytes = Array.from(view.slice(0, 10))
      .map(byte => byte.toString(16).padStart(2, '0'))
      .join(' ');
    console.log('前10个字节:', firstBytes);
   
    return arrayBuffer;
  } catch (error) {
    console.error('读取二进制文件失败:', error);
    throw error;
  }
}
// 使用示例：读取CSV文件并解析
async function readAndParseCSV(file) {
  if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
    throw new Error('不是CSV文件');
  }
 
  try {
    const text = await readFileContent(file, 'text');
   
    // 简单的CSV解析
    const rows = text.split('\n').map(line => line.trim()).filter(Boolean);
    const headers = rows[0].split(',').map(header => header.trim());
   
    const data = rows.slice(1).map(row => {
      const values = row.split(',').map(value => value.trim());
      const rowData = {};
     
      headers.forEach((header, index) => {
        rowData[header] = values[index];
      });
     
      return rowData;
    });
   
    console.log('CSV 头部:', headers);
    console.log('CSV 数据:', data);
   
    return { headers, data };
  } catch (error) {
    console.error('读取CSV文件失败:', error);
    throw error;
  }
}
// 使用示例：读取JSON文件并解析
async function readAndParseJSON(file) {
  if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
    throw new Error('不是JSON文件');
  }
 
  try {
    const text = await readFileContent(file, 'text');
    const data = JSON.parse(text);
    console.log('JSON 数据:', data);
    return data;
  } catch (error) {
    console.error('读取JSON文件失败:', error);
    throw error;
  }
}
```
### 4.2 使用现代Promise API
现代浏览器提供了File对象的Promise-based API，使文件读取更加简洁。
```javascript
/**
 * 使用现代Promise API读取文件
 * @param {File} file - 要读取的文件
 */
async function demonstrateModernFileAPI(file) {
  try {
    // 1. 读取为文本
    console.log('使用 file.text():');
    const text = await file.text();
    console.log('文件内容:', text.substring(0, 100) + (text.length > 100 ? '...' : ''));
   
    // 2. 读取为ArrayBuffer
    console.log('使用 file.arrayBuffer():');
    const buffer = await file.arrayBuffer();
    console.log('ArrayBuffer 大小:', buffer.byteLength, '字节');
   
    // 3. 读取为Blob切片
    console.log('使用 file.slice():');
    const slice = file.slice(0, 100); // 获取前100个字节
    const sliceText = await slice.text();
    console.log('Blob切片内容:', sliceText);
   
    // 4. 流式读取（实验性）
    if ('stream' in file) {
      console.log('使用 file.stream():');
      const stream = file.stream();
      const reader = stream.getReader();
     
      let receivedLength = 0;
      let chunks = [];
     
      while (true) {
        const { done, value } = await reader.read();
       
        if (done) {
          break;
        }
       

        chunks.push(value);
        receivedLength += value.length;
        console.log(`接收到 ${value.length} 字节，总共: ${receivedLength}`);
      }
     
      console.log('流读取完成，总大小:', receivedLength);
     
      // 合并块
      const allChunks = new Uint8Array(receivedLength);
      let position = 0;
      for (const chunk of chunks) {
        allChunks.set(chunk, position);
        position += chunk.length;
      }
     
      console.log('合并后的数据大小:', allChunks.length);
    } else {
      console.log('此浏览器不支持 file.stream() API');
    }
   
  } catch (error) {
    console.error('使用现代File API时出错:', error);
  }
}
// 使用示例
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    await demonstrateModernFileAPI(file);
  }
});
/**
 * 比较传统FileReader和现代Promise API
 * @param {File} file - 要读取的文件
 */
async function compareFileReadingMethods(file) {
  console.log('文件:', file.name, `(${file.size} 字节)`);
 
  // 使用FileReader
  console.time('FileReader');
  const fileReaderResult = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(reader.error);
    reader.readAsText(file);
  });
  console.timeEnd('FileReader');
  console.log('FileReader结果长度:', fileReaderResult.length);
 
  // 使用现代API
  console.time('file.text()');
  const modernResult = await file.text();
  console.timeEnd('file.text()');
  console.log('file.text()结果长度:', modernResult.length);
 
  // 比较结果
  console.log('结果相同:', fileReaderResult === modernResult);
}
```
### 4.3 读取大文件
处理大文件时，应该使用分块读取或流式处理，以避免内存问题。
```javascript
/**
 * 分块读取大文件
 * @param {File} file - 要读取的大文件
 * @param {number} chunkSize - 每个块的大小（字节）
 * @param {Function} processChunk - 处理每个块的回调函数
 * @param {Function} onProgress - 进度回调函数
 * @returns {Promise} - 完成时解析的Promise
 */
async function readLargeFile(file, chunkSize = 1024 * 1024, processChunk, onProgress) {
  const fileSize = file.size;
  let offset = 0;
  let chunkIndex = 0;
 
  while (offset < fileSize) {
    // 计算当前块的大小
    const currentChunkSize = Math.min(chunkSize, fileSize - offset);
   
    // 从文件中切出一块
    const chunk = file.slice(offset, offset + currentChunkSize);
   
    // 读取块内容
    const arrayBuffer = await chunk.arrayBuffer();
   
    // 处理块
    if (typeof processChunk === 'function') {
      await processChunk(arrayBuffer, chunkIndex, offset);
    }
   
    // 更新偏移量
    offset += currentChunkSize;
    chunkIndex++;
   
    // 报告进度
    const progress = (offset / fileSize) * 100;
    if (typeof onProgress === 'function') {
      onProgress(progress, offset, fileSize);
    }
  }
 
  return chunkIndex; // 返回处理的块数
}
// 使用示例：读取大文本文件并计算行数
async function countLinesInLargeFile(file) {
  let totalLines = 0;
  let partialLine = '';
 
  // 处理每个块
  const processChunk = async (arrayBuffer, chunkIndex, offset) => {
    // 将ArrayBuffer转换为文本
    const decoder = new TextDecoder();
    const text = decoder.decode(arrayBuffer, { stream: true }); // stream:true表示可能有更多数据
   
    // 将部分行与当前文本合并
    const combinedText = partialLine + text;
   
    // 分割成行
    const lines = combinedText.split('\n');
   
    // 保存最后一个可能不完整的行
    partialLine = lines.pop() || '';
   
    // 更新行数
    totalLines += lines.length;
   
    console.log(`块 ${chunkIndex}: 处理了 ${lines.length} 行，当前总行数: ${totalLines}`);
  };
 
  // 进度回调
  const onProgress = (progress, bytesRead, totalBytes) => {
    console.log(`进度: ${progress.toFixed(2)}%, 已读取: ${bytesRead}/${totalBytes} 字节`);
   
    // 更新UI进度条
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
      progressBar.style.width = `${progress}%`;
      progressBar.textContent = `${progress.toFixed(0)}%`;
    }
  };
 
  // 开始读取
  console.time('读取文件');
  const chunksProcessed = await readLargeFile(file, 1024 * 1024, processChunk, onProgress);
  console.timeEnd('读取文件');
 
  // 处理最后一个可能的行
  if (partialLine) {
    totalLines++;
  }
 
  console.log(`文件 "${file.name}" 共有 ${totalLines} 行，处理了 ${chunksProcessed} 个块`);
  return totalLines;
}
// 使用示例：读取大型CSV文件并处理数据
async function processLargeCSV(file) {
  let headers = null;
  let rowCount = 0;
  let partialRow = '';
  const results = [];
 
  // 处理每个块
  const processChunk = async (arrayBuffer, chunkIndex, offset) => {
    // 将ArrayBuffer转换为文本
    const decoder = new TextDecoder();
    const text = decoder.decode(arrayBuffer, { stream: true });
   
    // 将部分行与当前文本合并
    const combinedText = partialRow + text;
   
    // 分割成行
    const rows = combinedText.split('\n');
   
    // 保存最后一个可能不完整的行
    partialRow = rows.pop() || '';
   
    // 处理行
    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue;
     
      // 第一行是标题
      if (headers === null) {
        headers = row.split(',').map(h => h.trim());
        continue;
      }
     
      // 解析数据行
      const values = row.split(',').map(v => v.trim());
      const rowData = {};
     
      headers.forEach((header, index) => {
        rowData[header] = values[index];
      });
     
      // 处理行数据（这里只是收集，实际应用中可能需要其他处理）
      results.push(rowData);
      rowCount++;
     
      // 为了避免内存问题，可能需要限制结果数量或进行其他处理
      if (results.length > 1000) {
        // 例如，可以将结果发送到另一个函数进行处理
        await processResults(results.splice(0));
      }
    }
   
    console.log(`块 ${chunkIndex}: 处理了 ${rowCount} 行数据`);
  };
 
  // 模拟处理结果的函数
  async function processResults(batchResults) {
    console.log(`处理批次结果: ${batchResults.length} 行`);
    // 在实际应用中，可能会将结果保存到数据库或进行其他处理
  }
 
  // 开始读取
  await readLargeFile(file, 512 * 1024, processChunk);
 
  // 处理最后一批结果
  if (results.length > 0) {
    await processResults(results);
  }
 
  // 处理最后一个可能的行
  if (partialRow) {
    const values = partialRow.split(',').map(v => v.trim());
    const rowData = {};
   
    headers.forEach((header, index) => {
      rowData[header] = values[index];
    });
   
    await processResults([rowData]);
    rowCount++;
  }
 
  console.log(`CSV文件处理完成，共 ${rowCount} 行数据`);
  return { rowCount, headers };
}
// 使用示例：使用流API读取大文件
async function readLargeFileWithStreams(file) {
  if (!('stream' in file)) {
    throw new Error('此浏览器不支持流API');
  }
 
  const stream = file.stream();
  const reader = stream.getReader();
 
  let processedBytes = 0;
  const fileSize = file.size;
 
  // 创建TextDecoder用于将二进制数据转换为文本
  const decoder = new TextDecoder();
  let partialChunk = '';
  let lineCount = 0;
 
  while (true) {
    const { done, value } = await reader.read();
   
    if (done) {
      // 处理最后一个可能的部分块
      if (partialChunk) {
        lineCount += partialChunk.split('\n').length;
      }
      break;
    }
   
    // 更新已处理字节数
    processedBytes += value.length;
   
    // 将二进制数据转换为文本
    const chunk = decoder.decode(value, { stream: true });
   
    // 将部分块与当前块合并
    const combinedChunk = partialChunk + chunk;
   
    // 分割成行，保留最后一个可能不完整的行
    const lines = combinedChunk.split('\n');
    partialChunk = lines.pop() || '';
   
    // 更新行数
    lineCount += lines.length;
   
    // 报告进度
    const progress = (processedBytes / fileSize) * 100;
    console.log(`进度: ${progress.toFixed(2)}%, 已处理: ${processedBytes}/${fileSize} 字节, 行数: ${lineCount}`);
  }
 
  console.log(`文件处理完成，共 ${lineCount} 行，总大小: ${processedBytes} 字节`);
  return { lineCount, processedBytes };
}
```
### 4.4 读取不同类型的文件
不同类型的文件需要不同的处理方式。
```javascript
/**
 * 根据文件类型读取并处理文件
 * @param {File} file - 要读取的文件
 * @returns {Promise} - 包含处理结果的Promise
 */
async function readFileByType(file) {
  // 确定文件类型
  const fileType = determineFileType(file);
  console.log(`文件 "${file.name}" 被识别为: ${fileType}`);
 
  // 根据文件类型处理
  switch (fileType) {
    case 'text':
      return await readTextFile(file);
    case 'image':
      return await readImageFile(file);
    case 'audio':
      return await readAudioFile(file);
    case 'video':
      return await readVideoFile(file);
    case 'pdf':
      return await readPDFFile(file);
    case 'json':
      return await readJSONFile(file);
    case 'csv':
      return await readCSVFile(file);
    case 'xml':
      return await readXMLFile(file);
    case 'zip':
      return await readZipFile(file);
    default:
      return await readBinaryFile(file);
  }
}
/**
 * 确定文件类型
 * @param {File} file - 要检查的文件
 * @returns {string} - 文件类型
 */
function determineFileType(file) {
  // 首先检查MIME类型
  const mimeType = file.type;
 
  if (mimeType.startsWith('text/')) {
    // 检查特定的文本格式
    if (mimeType === 'text/csv' || file.name.endsWith('.csv')) {
      return 'csv';
    } else if (mimeType === 'application/json' || file.name.endsWith('.json')) {
      return 'json';
    } else if (mimeType === 'application/xml' || mimeType === 'text/xml' ||
               file.name.endsWith('.xml')) {
      return 'xml';
    } else {
      return 'text';
    }
  } else if (mimeType.startsWith('image/')) {
    return 'image';
  } else if (mimeType.startsWith('audio/')) {
    return 'audio';
  } else if (mimeType.startsWith('video/')) {

   return 'video';
  } else if (mimeType === 'application/pdf' || file.name.endsWith('.pdf')) {
    return 'pdf';
  } else if (mimeType === 'application/zip' ||
             mimeType === 'application/x-zip-compressed' ||
             file.name.endsWith('.zip')) {
    return 'zip';
  }
 
  // 如果MIME类型不明确，尝试通过文件扩展名判断
  const extension = file.name.split('.').pop().toLowerCase();
 
  switch (extension) {
    case 'txt':
    case 'log':
    case 'md':
    case 'html':
    case 'css':
    case 'js':
      return 'text';
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
    case 'svg':
      return 'image';
    case 'mp3':
    case 'wav':
    case 'ogg':
    case 'flac':
    case 'm4a':
      return 'audio';
    case 'mp4':
    case 'webm':
    case 'ogv':
    case 'mov':
    case 'avi':
      return 'video';
    case 'pdf':
      return 'pdf';
    case 'json':
      return 'json';
    case 'csv':
      return 'csv';
    case 'xml':
      return 'xml';
    case 'zip':
    case 'rar':
    case '7z':
      return 'zip';
    default:
      return 'binary';
  }
}
/**
 * 读取文本文件
 * @param {File} file - 文本文件
 * @returns {Promise<string>} - 文件内容
 */
async function readTextFile(file) {
  try {
    const text = await file.text();
    console.log(`文本文件 "${file.name}" 读取成功，大小: ${text.length} 字符`);
    return text;
  } catch (error) {
    console.error('读取文本文件失败:', error);
    throw error;
  }
}
/**
 * 读取图像文件
 * @param {File} file - 图像文件
 * @returns {Promise<Object>} - 包含图像信息和数据URL的对象
 */
async function readImageFile(file) {
  try {
    // 读取为Data URL
    const dataURL = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
   
    // 获取图像尺寸和其他信息
    const imageInfo = await getImageInfo(dataURL);
   
    console.log(`图像文件 "${file.name}" 读取成功，尺寸: ${imageInfo.width}x${imageInfo.height}`);
   
    return {
      dataURL,
      ...imageInfo
    };
  } catch (error) {
    console.error('读取图像文件失败:', error);
    throw error;
  }
}
/**
 * 获取图像信息
 * @param {string} dataURL - 图像的Data URL
 * @returns {Promise<Object>} - 图像信息
 */
function getImageInfo(dataURL) {
  return new Promise((resolve, reject) => {
    const img = new Image();
   
    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
        aspectRatio: img.width / img.height
      });
    };
   
    img.onerror = () => {
      reject(new Error('加载图像失败'));
    };
   
    img.src = dataURL;
  });
}
/**
 * 读取音频文件
 * @param {File} file - 音频文件
 * @returns {Promise<Object>} - 包含音频信息和URL的对象
 */
async function readAudioFile(file) {
  try {
    // 创建对象URL
    const url = URL.createObjectURL(file);
   
    // 获取音频信息
    const audioInfo = await getAudioInfo(url);
   
    console.log(`音频文件 "${file.name}" 读取成功，时长: ${audioInfo.duration.toFixed(2)} 秒`);
   
    return {
      url,
      ...audioInfo
    };
  } catch (error) {
    console.error('读取音频文件失败:', error);
    throw error;
  }
}
/**
 * 获取音频信息
 * @param {string} url - 音频URL
 * @returns {Promise<Object>} - 音频信息
 */
function getAudioInfo(url) {
  return new Promise((resolve, reject) => {
    const audio = new Audio();
   
    audio.addEventListener('loadedmetadata', () => {
      resolve({
        duration: audio.duration,
        channels: audio.mozChannels || 2 // 大多数浏览器不提供此信息，默认为2
      });
    });
   
    audio.addEventListener('error', () => {
      reject(new Error('加载音频失败'));
    });
   
    audio.src = url;
  });
}
/**
 * 读取视频文件
 * @param {File} file - 视频文件
 * @returns {Promise<Object>} - 包含视频信息和URL的对象
 */
async function readVideoFile(file) {
  try {
    // 创建对象URL
    const url = URL.createObjectURL(file);
   
    // 获取视频信息
    const videoInfo = await getVideoInfo(url);
   
    console.log(`视频文件 "${file.name}" 读取成功，尺寸: ${videoInfo.width}x${videoInfo.height}，时长: ${videoInfo.duration.toFixed(2)} 秒`);
   
    return {
      url,
      ...videoInfo
    };
  } catch (error) {
    console.error('读取视频文件失败:', error);
    throw error;
  }
}
/**
 * 获取视频信息
 * @param {string} url - 视频URL
 * @returns {Promise<Object>} - 视频信息
 */
function getVideoInfo(url) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
   
    video.addEventListener('loadedmetadata', () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight,
        duration: video.duration,
        aspectRatio: video.videoWidth / video.videoHeight
      });
    });
   
    video.addEventListener('error', () => {
      reject(new Error('加载视频失败'));
    });
   
    video.src = url;
    video.load();
  });
}
/**
 * 读取PDF文件
 * @param {File} file - PDF文件
 * @returns {Promise<Object>} - 包含PDF信息和URL的对象
 */
async function readPDFFile(file) {
  try {
    // 创建对象URL
    const url = URL.createObjectURL(file);
   
    console.log(`PDF文件 "${file.name}" 读取成功，大小: ${file.size} 字节`);
   
    // 注意：要获取PDF页数和其他元数据，需要使用PDF.js库
    // 这里只返回基本信息
    return {
      url,
      size: file.size,
      name: file.name
    };
  } catch (error) {
    console.error('读取PDF文件失败:', error);
    throw error;
  }
}
/**
 * 读取JSON文件
 * @param {File} file - JSON文件
 * @returns {Promise<Object>} - 解析后的JSON对象
 */
async function readJSONFile(file) {
  try {
    const text = await file.text();
    const json = JSON.parse(text);
   
    console.log(`JSON文件 "${file.name}" 读取成功`);
   
    return json;
  } catch (error) {
    console.error('读取JSON文件失败:', error);
    throw error;
  }
}
/**
 * 读取CSV文件
 * @param {File} file - CSV文件
 * @returns {Promise<Object>} - 包含解析后的CSV数据的对象
 */
async function readCSVFile(file) {
  try {
    const text = await file.text();
   
    // 简单的CSV解析
    const rows = text.split('\n').map(line => line.trim()).filter(Boolean);
    const headers = rows[0].split(',').map(header => header.trim());
   
    const data = rows.slice(1).map(row => {
      const values = row.split(',').map(value => value.trim());
      const rowData = {};
     
      headers.forEach((header, index) => {
        rowData[header] = values[index];
      });
     
      return rowData;
    });
   
    console.log(`CSV文件 "${file.name}" 读取成功，${data.length} 行数据`);
   
    return { headers, data };
  } catch (error) {
    console.error('读取CSV文件失败:', error);
    throw error;
  }
}
/**
 * 读取XML文件
 * @param {File} file - XML文件
 * @returns {Promise<Document>} - 解析后的XML文档
 */
async function readXMLFile(file) {
  try {
    const text = await file.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, 'text/xml');
   
    // 检查解析错误
    const parseError = xmlDoc.getElementsByTagName('parsererror');
    if (parseError.length > 0) {
      throw new Error('XML解析错误: ' + parseError[0].textContent);
    }
   
    console.log(`XML文件 "${file.name}" 读取成功`);
   
    return xmlDoc;
  } catch (error) {
    console.error('读取XML文件失败:', error);
    throw error;
  }
}
/**
 * 读取二进制文件
 * @param {File} file - 二进制文件
 * @returns {Promise<ArrayBuffer>} - 文件的ArrayBuffer
 */
async function readBinaryFile(file) {
  try {
    const arrayBuffer = await file.arrayBuffer();
   
    console.log(`二进制文件 "${file.name}" 读取成功，大小: ${arrayBuffer.byteLength} 字节`);
   
    return arrayBuffer;
  } catch (error) {
    console.error('读取二进制文件失败:', error);
    throw error;
  }
}
// 使用示例
fileInput.addEventListener('change', async (event) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const result = await readFileByType(file);
      console.log('文件处理结果:', result);
     
      // 根据文件类型显示结果
      displayFileResult(file, result);
    } catch (error) {
      console.error('处理文件失败:', error);
    }
  }
});
/**
 * 显示文件处理结果
 * @param {File} file - 原始文件
 * @param {any} result - 处理结果
 */
function displayFileResult(file, result) {
  const resultContainer = document.getElementById('result-container');
  if (!resultContainer) return;
 
  resultContainer.innerHTML = '';
 
  const fileType = determineFileType(file);
 
  switch (fileType) {
    case 'text':
      resultContainer.textContent = result;
      break;
    case 'image':
      const img = document.createElement('img');
      img.src = result.dataURL;
      img.style.maxWidth = '100%';
      resultContainer.appendChild(img);
     
      const info = document.createElement('div');
      info.textContent = `尺寸: ${result.width}x${result.height}`;
      resultContainer.appendChild(info);
      break;
    case 'audio':
      const audio = document.createElement('audio');
      audio.src = result.url;
      audio.controls = true;
      resultContainer.appendChild(audio);
     
      const audioInfo = document.createElement('div');
      audioInfo.textContent = `时长: ${result.duration.toFixed(2)} 秒`;
      resultContainer.appendChild(audioInfo);
      break;
    case 'video':
      const video = document.createElement('video');
      video.src = result.url;
      video.controls = true;
      video.style.maxWidth = '100%';
      resultContainer.appendChild(video);
     

      const videoInfo = document.createElement('div');
      videoInfo.textContent = `尺寸: ${result.width}x${result.height}, 时长: ${result.duration.toFixed(2)} 秒`;
      resultContainer.appendChild(videoInfo);
      break;
    case 'pdf':
      const pdfLink = document.createElement('a');
      pdfLink.href = result.url;
      pdfLink.target = '_blank';
      pdfLink.textContent = `在新窗口中查看PDF: ${file.name}`;
      resultContainer.appendChild(pdfLink);
     
      // 如果想要嵌入PDF查看器
      const pdfEmbed = document.createElement('embed');
      pdfEmbed.src = result.url;
      pdfEmbed.type = 'application/pdf';
      pdfEmbed.style.width = '100%';
      pdfEmbed.style.height = '500px';
      resultContainer.appendChild(pdfEmbed);
      break;
    case 'json':
      const jsonPre = document.createElement('pre');
      jsonPre.textContent = JSON.stringify(result, null, 2);
      resultContainer.appendChild(jsonPre);
      break;
    case 'csv':
      // 创建表格显示CSV数据
      const table = document.createElement('table');
      table.border = '1';
      table.style.borderCollapse = 'collapse';
     
      // 添加表头
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
     
      result.headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        th.style.padding = '5px';
        headerRow.appendChild(th);
      });
     
      thead.appendChild(headerRow);
      table.appendChild(thead);
     
      // 添加数据行
      const tbody = document.createElement('tbody');
     
      result.data.forEach(rowData => {
        const tr = document.createElement('tr');
       
        result.headers.forEach(header => {
          const td = document.createElement('td');
          td.textContent = rowData[header] || '';
          td.style.padding = '5px';
          tr.appendChild(td);
        });
       
        tbody.appendChild(tr);
      });
     
      table.appendChild(tbody);
      resultContainer.appendChild(table);
      break;
    case 'xml':
      // 显示XML结构
      const xmlPre = document.createElement('pre');
      const serializer = new XMLSerializer();
      const xmlString = serializer.serializeToString(result);
      xmlPre.textContent = formatXML(xmlString);
      resultContainer.appendChild(xmlPre);
      break;
    default:
      // 二进制文件
      const binaryInfo = document.createElement('div');
      binaryInfo.textContent = `二进制文件: ${file.name}, 大小: ${file.size} 字节`;
      resultContainer.appendChild(binaryInfo);
     
      // 添加下载链接
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(file);
      downloadLink.download = file.name;
      downloadLink.textContent = `下载 ${file.name}`;
      resultContainer.appendChild(downloadLink);
  }
}
/**
 * 格式化XML字符串
 * @param {string} xml - XML字符串
 * @returns {string} - 格式化后的XML
 */
function formatXML(xml) {
  let formatted = '';
  let indent = '';
  const tab = '  '; // 两个空格的缩进
 
  xml.split(/>\s*</).forEach(function(node) {
    if (node.match(/^\/\w/)) {
      // 结束标签
      indent = indent.substring(tab.length);
    }
   
    formatted += indent + '<' + node + '>\r\n';
   
    if (node.match(/^<?\w[^>]*[^\/]$/) && !node.startsWith("?")) {
      // 开始标签
      indent += tab;
    }
  });
 
  return formatted.substring(1, formatted.length - 3);
}
```
## 5. Blob对象详解
### 5.1 创建Blob
Blob（Binary Large Object）对象表示一个不可变的、原始数据的类文件对象。
```javascript
/**
 * 创建不同类型的Blob对象
 */
function createBlobs() {
  // 1. 从字符串创建Blob
  const textBlob = new Blob(['Hello, world!'], { type: 'text/plain' });
  console.log('文本Blob:', textBlob);
 
  // 2. 从JSON对象创建Blob
  const data = { name: 'John', age: 30, isAdmin: false };
  const jsonBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
  console.log('JSON Blob:', jsonBlob);
 
  // 3. 从HTML创建Blob
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Blob Test</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #0066cc; }
      </style>
    </head>
    <body>
      <h1>Hello from Blob!</h1>
      <p>This HTML was created from a Blob object.</p>
    </body>
    </html>
  `;
  const htmlBlob = new Blob([htmlContent], { type: 'text/html' });
  console.log('HTML Blob:', htmlBlob);
 
  // 4. 从ArrayBuffer创建Blob
  const buffer = new ArrayBuffer(16);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < view.length; i++) {
    view[i] = i + 65; // ASCII: A, B, C, ...
  }
  const arrayBufferBlob = new Blob([buffer], { type: 'application/octet-stream' });
  console.log('ArrayBuffer Blob:', arrayBufferBlob);
 
  // 5. 从TypedArray创建Blob
  const typedArray = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in ASCII
  const typedArrayBlob = new Blob([typedArray], { type: 'application/octet-stream' });
  console.log('TypedArray Blob:', typedArrayBlob);
 
  // 6. 从多个源创建Blob
  const multiSourceBlob = new Blob([
    'Header\n',
    new Uint8Array([65, 66, 67, 10]), // "ABC\n" in ASCII
    buffer,
    '\nFooter'
  ], { type: 'text/plain' });
  console.log('多源Blob:', multiSourceBlob);
 
  // 7. 从Canvas创建Blob
  const canvas = document.createElement('canvas');
  canvas.width = 200;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
 
  // 绘制一些内容
  ctx.fillStyle = 'blue';
  ctx.fillRect(0, 0, 100, 100);
  ctx.fillStyle = 'red';
  ctx.fillRect(100, 100, 100, 100);
 
  // 将Canvas转换为Blob（异步）
  canvas.toBlob(function(blob) {
    console.log('Canvas Blob:', blob);
  }, 'image/png');
 
  return {
    textBlob,
    jsonBlob,
    htmlBlob,
    arrayBufferBlob,
    typedArrayBlob,
    multiSourceBlob
  };
}
// 使用示例
const blobs = createBlobs();
console.log('创建的Blob对象:', blobs);
```
### 5.2 Blob操作
```javascript
/**
 * 演示Blob对象的操作
 * @param {Blob} blob - Blob对象
 */
async function demonstrateBlobOperations(blob) {
  console.log('原始Blob:', blob);
  console.log('大小:', blob.size, '字节');
  console.log('类型:', blob.type || '未指定');
 
  // 1. 切片操作
  const firstHalf = blob.slice(0, Math.floor(blob.size / 2), blob.type);
  console.log('前半部分:', firstHalf);
 
  const secondHalf = blob.slice(Math.floor(blob.size / 2), blob.size, blob.type);
  console.log('后半部分:', secondHalf);
 
  // 提取特定范围
  const middle = blob.slice(Math.floor(blob.size / 4), Math.floor(blob.size * 3 / 4), blob.type);
  console.log('中间部分:', middle);
 
  // 2. 读取Blob内容
  // 使用FileReader
  const readWithFileReader = async (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
     
      if (blob.type.startsWith('text/') || blob.type === 'application/json') {
        reader.readAsText(blob);
      } else {
        reader.readAsArrayBuffer(blob);
      }
    });
  };
 
  // 使用现代API
  const readWithModernAPI = async (blob) => {
    if (blob.type.startsWith('text/') || blob.type === 'application/json') {
      return await blob.text();
    } else {
      return await blob.arrayBuffer();
    }
  };
 
  // 比较两种方法
  console.time('FileReader');
  const contentFromFileReader = await readWithFileReader(blob);
  console.timeEnd('FileReader');
 
  console.time('Modern API');
  const contentFromModernAPI = await readWithModernAPI(blob);
  console.timeEnd('Modern API');
 
  console.log('内容相同:',
    contentFromFileReader.toString() === contentFromModernAPI.toString());
 
  // 3. 合并Blob
  const mergeBlobs = (...blobs) => {
    return new Blob(blobs, { type: blobs[0].type });
  };
 
  const mergedBlob = mergeBlobs(firstHalf, secondHalf);
  console.log('合并后的Blob:', mergedBlob);
  console.log('大小相同:', blob.size === mergedBlob.size);
 
  // 验证内容相同
  const originalContent = await blob.text();
  const mergedContent = await mergedBlob.text();
  console.log('内容相同:', originalContent === mergedContent);
 
  // 4. 创建Blob URL
  const url = URL.createObjectURL(blob);
  console.log('Blob URL:', url);
 
  // 使用URL
  if (blob.type.startsWith('image/')) {
    const img = document.createElement('img');
    img.src = url;
    document.body.appendChild(img);
    console.log('图像已添加到文档');
  }
 
  // 释放URL
  setTimeout(() => {
    URL.revokeObjectURL(url);
    console.log('URL已释放');
  }, 5000);
 
  return {
    firstHalf,
    secondHalf,
    middle,
    mergedBlob,
    url
  };
}
// 使用示例
const textBlob = new Blob(['这是一个测试文本，用于演示Blob操作。'], { type: 'text/plain' });
demonstrateBlobOperations(textBlob).then(results => {
  console.log('Blob操作结果:', results);
});
```
### 5.3 Blob转换
```javascript
/**
 * 演示Blob与其他数据格式的转换
 */
async function demonstrateBlobConversions() {
  // 创建一个示例Blob
  const originalText = 'Hello, this is a test for Blob conversions!';
  const blob = new Blob([originalText], { type: 'text/plain' });
 
  console.log('原始Blob:', blob);
 
  // 1. Blob -> 文本
  const text = await blob.text();
  console.log('Blob -> 文本:', text);
  console.log('文本匹配:', text === originalText);
 
  // 2. Blob -> ArrayBuffer
  const arrayBuffer = await blob.arrayBuffer();
  console.log('Blob -> ArrayBuffer:', arrayBuffer);
  console.log('ArrayBuffer大小:', arrayBuffer.byteLength, '字节');
 

  // 3. Blob -> Base64
  const base64 = await blobToBase64(blob);
  console.log('Blob -> Base64:', base64.substring(0, 50) + '...');
 
  // 4. Blob -> Data URL
  const dataURL = await blobToDataURL(blob);
  console.log('Blob -> Data URL:', dataURL.substring(0, 50) + '...');
 
  // 5. Blob -> URL
  const url = URL.createObjectURL(blob);
  console.log('Blob -> URL:', url);
 
  // 6. 文本 -> Blob
  const textBlob = new Blob([text], { type: 'text/plain' });
  console.log('文本 -> Blob:', textBlob);
 
  // 7. ArrayBuffer -> Blob
  const arrayBufferBlob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
  console.log('ArrayBuffer -> Blob:', arrayBufferBlob);
 
  // 8. Base64 -> Blob
  const base64Blob = await base64ToBlob(base64, 'text/plain');
  console.log('Base64 -> Blob:', base64Blob);
 
  // 9. Data URL -> Blob
  const dataURLBlob = await dataURLToBlob(dataURL);
  console.log('Data URL -> Blob:', dataURLBlob);
 
  // 10. URL -> Blob (需要fetch)
  try {
    const urlBlob = await fetch(url).then(r => r.blob());
    console.log('URL -> Blob:', urlBlob);
  } catch (error) {
    console.error('URL -> Blob 转换失败:', error);
  }
 
  // 清理
  URL.revokeObjectURL(url);
 
  return {
    text,
    arrayBuffer,
    base64,
    dataURL,
    url,
    textBlob,
    arrayBufferBlob,
    base64Blob,
    dataURLBlob
  };
}
/**
 * 将Blob转换为Base64
 * @param {Blob} blob - 要转换的Blob
 * @returns {Promise<string>} - Base64字符串
 */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const base64 = dataUrl.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
/**
 * 将Blob转换为Data URL
 * @param {Blob} blob - 要转换的Blob
 * @returns {Promise<string>} - Data URL
 */
function blobToDataURL(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
/**
 * 将Base64转换为Blob
 * @param {string} base64 - Base64字符串
 * @param {string} type - MIME类型
 * @returns {Promise<Blob>} - Blob对象
 */
function base64ToBlob(base64, type = 'application/octet-stream') {
  return new Promise((resolve) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
   
    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
     
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
     
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
   
    const blob = new Blob(byteArrays, { type });
    resolve(blob);
  });
}
/**
 * 将Data URL转换为Blob
 * @param {string} dataURL - Data URL
 * @returns {Promise<Blob>} - Blob对象
 */
function dataURLToBlob(dataURL) {
  return new Promise((resolve) => {
    const parts = dataURL.split(',');
    const matches = parts[0].match(/:(.*?);/);
    const type = matches ? matches[1] : '';
    const base64 = parts[1];
   
    const blob = base64ToBlob(base64, type);
    resolve(blob);
  });
}
// 使用示例
demonstrateBlobConversions().then(results => {
  console.log('转换结果:', results);
});
```
### 5.4 Blob URL
Blob URL（也称为Object URL）是一种表示Blob对象或File对象的URL，可以在浏览器中使用。
```javascript
/**
 * 演示Blob URL的使用
 */
function demonstrateBlobURLs() {
  // 创建不同类型的Blob
  const textBlob = new Blob(['这是一个文本文件的内容'], { type: 'text/plain' });
  const htmlBlob = new Blob(['<html><body><h1>Hello World</h1><p>这是一个HTML文件</p></body></html>'], { type: 'text/html' });
  const jsonBlob = new Blob([JSON.stringify({ name: 'John', age: 30 })], { type: 'application/json' });
 
  // 创建Blob URL
  const textURL = URL.createObjectURL(textBlob);
  const htmlURL = URL.createObjectURL(htmlBlob);
  const jsonURL = URL.createObjectURL(jsonBlob);
 
  console.log('文本Blob URL:', textURL);
  console.log('HTML Blob URL:', htmlURL);
  console.log('JSON Blob URL:', jsonURL);
 
  // 使用Blob URL
 
  // 1. 在新窗口中打开
  const openInNewWindow = (url, name) => {
    const win = window.open(url, name);
    if (!win) {
      console.error('无法打开新窗口，可能被浏览器阻止');
    }
    return win;
  };
 
  // 打开HTML Blob
  const htmlWindow = openInNewWindow(htmlURL, 'HTML Blob');
 
  // 2. 创建下载链接
  const createDownloadLink = (url, filename, text) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.textContent = text;
    document.body.appendChild(link);
    return link;
  };
 
  const textLink = createDownloadLink(textURL, 'text-file.txt', '下载文本文件');
  const htmlLink = createDownloadLink(htmlURL, 'page.html', '下载HTML文件');
  const jsonLink = createDownloadLink(jsonURL, 'data.json', '下载JSON文件');
 
  // 3. 在iframe中显示
  const displayInIframe = (url) => {
    const iframe = document.createElement('iframe');
    iframe.src = url;
    iframe.style.width = '100%';
    iframe.style.height = '200px';
    iframe.style.border = '1px solid #ccc';
    document.body.appendChild(iframe);
    return iframe;
  };
 
  const htmlIframe = displayInIframe(htmlURL);
 
  // 4. 作为图像源
  const createImageFromCanvas = () => {
    // 创建Canvas并绘制内容
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
   
    // 绘制渐变背景
    const gradient = ctx.createLinearGradient(0, 0, 200, 200);
    gradient.addColorStop(0, 'blue');
    gradient.addColorStop(1, 'white');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 200, 200);
   
    // 添加文本
    ctx.fillStyle = 'white';
    ctx.font = '20px Arial';
    ctx.fillText('Canvas to Blob', 40, 100);
   
    // 转换为Blob
    return new Promise(resolve => {
      canvas.toBlob(blob => {
        const url = URL.createObjectURL(blob);
       
        // 创建图像元素
        const img = document.createElement('img');
        img.src = url;
        img.style.border = '1px solid #ccc';
        document.body.appendChild(img);
       
        resolve({ blob, url, img });
      }, 'image/png');
    });
  };
 
  // 创建并显示图像
  const imagePromise = createImageFromCanvas();
 
  // 5. 释放Blob URL
  // 重要：当不再需要Blob URL时，应该释放它以避免内存泄漏
  setTimeout(() => {
    console.log('释放Blob URL...');
    URL.revokeObjectURL(textURL);
    URL.revokeObjectURL(htmlURL);
    URL.revokeObjectURL(jsonURL);
   
    // 也可以在使用后立即释放
    imagePromise.then(({ url }) => {
      setTimeout(() => {
        URL.revokeObjectURL(url);
        console.log('图像Blob URL已释放');
      }, 3000);
    });
   
    console.log('所有Blob URL已释放');
  }, 10000); // 10秒后释放
 
  return {
    blobs: { textBlob, htmlBlob, jsonBlob },
    urls: { textURL, htmlURL, jsonURL },
    elements: { textLink, htmlLink, jsonLink, htmlIframe },
    imagePromise
  };
}
// 使用示例
const blobURLDemo = demonstrateBlobURLs();
console.log('Blob URL演示:', blobURLDemo);
```
## 6. 文件下载
### 6.1 使用Blob创建下载
```javascript
/**
 * 使用Blob创建文件下载
 * @param {Blob|File} blob - 要下载的Blob或File对象
 * @param {string} filename - 下载文件名
 * @returns {boolean} - 是否成功触发下载
 */
function downloadBlob(blob, filename) {
  // 检查参数
  if (!(blob instanceof Blob)) {
    console.error('参数必须是Blob或File对象');
    return false;
  }
 
  if (!filename) {
    console.warn('未提供文件名，使用默认文件名');
    filename = 'download';
   
    // 尝试根据MIME类型添加扩展名
    const mimeExtensions = {
      'text/plain': '.txt',
      'text/html': '.html',
      'text/css': '.css',
      'text/javascript': '.js',
      'application/json': '.json',
      'application/xml': '.xml',
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/svg+xml': '.svg',
      'application/pdf': '.pdf'
    };
   
    if (blob.type && mimeExtensions[blob.type]) {
      filename += mimeExtensions[blob.type];
    }
  }
 
  try {
    // 创建Blob URL
    const url = URL.createObjectURL(blob);
   
    // 创建下载链接
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
   
    // 添加到文档中（不可见）
    link.style.display = 'none';
    document.body.appendChild(link);
   
    // 触发点击事件
    link.click();
   
    // 清理
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);
   
    return true;
  } catch (error) {
    console.error('下载文件失败:', error);
    return false;
  }
}
// 使用示例：下载文本文件
function downloadTextFile(text, filename = 'text-file.txt') {
  const blob = new Blob([text], { type: 'text/plain' });
  return downloadBlob(blob, filename);
}
// 使用示例：下载JSON文件
function downloadJSON(data, filename = 'data.json') {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  return downloadBlob(blob, filename);
}
// 使用示例：下载HTML文件
function downloadHTML(html, filename = 'page.html') {
  const blob = new Blob([html], { type: 'text/html' });
  return downloadBlob(blob, filename);
}
// 使用示例：下载CSV文件

function downloadCSV(data, filename = 'data.csv') {
  // 如果data是对象数组，转换为CSV格式
  let csv;
 
  if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
    // 获取所有唯一的键
    const headers = Array.from(
      new Set(
        data.reduce((keys, obj) => keys.concat(Object.keys(obj)), [])
      )
    );
   
    // 创建CSV内容
    const csvRows = [];
   
    // 添加标题行
    csvRows.push(headers.join(','));
   
    // 添加数据行
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header] || '';
        // 处理包含逗号、引号或换行符的值
        if (/[",\n\r]/.test(value)) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
      csvRows.push(values.join(','));
    }
   
    csv = csvRows.join('\n');
  } else if (typeof data === 'string') {
    // 如果已经是CSV字符串
    csv = data;
  } else {
    throw new Error('无效的CSV数据格式');
  }
 
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  return downloadBlob(blob, filename);
}
// 使用示例：下载图像
async function downloadImage(imageUrl, filename) {
  try {
    // 获取图像
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }
   
    // 转换为Blob
    const blob = await response.blob();
   
    // 如果未提供文件名，尝试从URL中提取
    if (!filename) {
      const urlParts = imageUrl.split('/');
      filename = urlParts[urlParts.length - 1];
     
      // 移除URL参数
      filename = filename.split('?')[0];
     
      // 如果仍然没有有效的文件名，使用默认名称
      if (!filename || filename.trim() === '') {
        filename = 'image';
       
        // 根据MIME类型添加扩展名
        if (blob.type === 'image/jpeg') {
          filename += '.jpg';
        } else if (blob.type === 'image/png') {
          filename += '.png';
        } else if (blob.type === 'image/gif') {
          filename += '.gif';
        } else if (blob.type === 'image/svg+xml') {
          filename += '.svg';
        } else {
          filename += '.img';
        }
      }
    }
   
    // 下载图像
    return downloadBlob(blob, filename);
  } catch (error) {
    console.error('下载图像失败:', error);
    return false;
  }
}
// 使用示例：下载Canvas内容
function downloadCanvas(canvas, filename = 'canvas.png', type = 'image/png', quality = 0.95) {
  return new Promise((resolve, reject) => {
    try {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            const result = downloadBlob(blob, filename);
            resolve(result);
          } else {
            reject(new Error('无法从Canvas创建Blob'));
          }
        },
        type,
        quality
      );
    } catch (error) {
      reject(error);
    }
  });
}
// 使用示例：下载多个文件（创建ZIP）
async function downloadMultipleFiles(files, zipFilename = 'download.zip') {
  // 注意：这需要JSZip库
  // 如果JSZip未加载，尝试动态加载
  if (typeof JSZip === 'undefined') {
    try {
      // 动态加载JSZip
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js');
    } catch (error) {
      console.error('无法加载JSZip库:', error);
      return false;
    }
  }
 
  try {
    const zip = new JSZip();
   
    // 添加文件到ZIP
    for (const file of files) {
      if (file.content instanceof Blob) {
        // 如果内容是Blob或File
        zip.file(file.name, file.content);
      } else {
        // 如果内容是字符串或其他格式
        zip.file(file.name, file.content);
      }
    }
   
    // 生成ZIP文件
    const zipBlob = await zip.generateAsync({ type: 'blob' });
   
    // 下载ZIP文件
    return downloadBlob(zipBlob, zipFilename);
  } catch (error) {
    console.error('创建ZIP文件失败:', error);
    return false;
  }
}
// 辅助函数：动态加载脚本
function loadScript(src) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error(`无法加载脚本: ${src}`));
    document.head.appendChild(script);
  });
}
```
### 6.2 使用Data URL下载
```javascript
/**
 * 使用Data URL创建文件下载
 * @param {string} dataURL - Data URL
 * @param {string} filename - 下载文件名
 * @returns {boolean} - 是否成功触发下载
 */
function downloadDataURL(dataURL, filename) {
  // 检查是否是有效的Data URL
  if (!dataURL.startsWith('data:')) {
    console.error('无效的Data URL');
    return false;
  }
 
  try {
    // 创建下载链接
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = filename;
   
    // 添加到文档中（不可见）
    link.style.display = 'none';
    document.body.appendChild(link);
   
    // 触发点击事件
    link.click();
   
    // 清理
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
   
    return true;
  } catch (error) {
    console.error('下载Data URL失败:', error);
    return false;
  }
}
// 使用示例：下载Canvas内容（使用Data URL）
function downloadCanvasAsDataURL(canvas, filename = 'canvas.png', type = 'image/png', quality = 0.95) {
  try {
    // 获取Canvas的Data URL
    const dataURL = canvas.toDataURL(type, quality);
   
    // 下载Data URL
    return downloadDataURL(dataURL, filename);
  } catch (error) {
    console.error('下载Canvas失败:', error);
    return false;
  }
}
// 使用示例：将文本转换为Data URL并下载
function downloadTextAsDataURL(text, filename = 'text.txt', mimeType = 'text/plain') {
  try {
    // 创建Data URL
    const dataURL = `data:${mimeType};charset=utf-8,${encodeURIComponent(text)}`;
   
    // 下载Data URL
    return downloadDataURL(dataURL, filename);
  } catch (error) {
    console.error('下载文本失败:', error);
    return false;
  }
}
```
### 6.3 使用服务器端生成的文件
```javascript
/**
 * 从服务器下载文件
 * @param {string} url - 文件URL
 * @param {string} filename - 下载文件名（可选）
 * @returns {Promise<boolean>} - 是否成功触发下载
 */
async function downloadFromServer(url, filename) {
  try {
    // 发送请求获取文件
    const response = await fetch(url);
   
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }
   
    // 获取文件Blob
    const blob = await response.blob();
   
    // 如果未提供文件名，尝试从响应头或URL中提取
    if (!filename) {
      // 尝试从Content-Disposition头中提取
      const contentDisposition = response.headers.get('Content-Disposition');
      if (contentDisposition) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1].replace(/['"]/g, '');
        }
      }
     
      // 如果仍然没有文件名，从URL中提取
      if (!filename) {
        const urlParts = url.split('/');
        filename = urlParts[urlParts.length - 1];
       
        // 移除URL参数
        filename = filename.split('?')[0];
      }
    }
   
    // 下载文件
    return downloadBlob(blob, filename);
  } catch (error) {
    console.error('从服务器下载文件失败:', error);
    return false;
  }
}
// 使用示例：下载大文件并显示进度
async function downloadLargeFile(url, filename, onProgress) {
  try {
    // 发送请求
    const response = await fetch(url);
   
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    }
   
    // 获取文件大小
    const contentLength = response.headers.get('Content-Length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
   
    // 创建响应读取器
    const reader = response.body.getReader();
   
    // 收集块
    const chunks = [];
    let received = 0;
   
    // 读取数据
    while (true) {
      const { done, value } = await reader.read();
     
      if (done) {
        break;
      }
     
      chunks.push(value);
      received += value.length;
     
      // 报告进度
      if (typeof onProgress === 'function' && total > 0) {
        onProgress(received, total, Math.round((received / total) * 100));
      }
    }
   
    // 合并块
    const allChunks = new Uint8Array(received);
    let position = 0;
    for (const chunk of chunks) {
      allChunks.set(chunk, position);
      position += chunk.length;
    }
   
    // 创建Blob
    const blob = new Blob([allChunks], { type: response.headers.get('Content-Type') || 'application/octet-stream' });
   
    // 下载文件
    return downloadBlob(blob, filename);
  } catch (error) {
    console.error('下载大文件失败:', error);
    return false;
  }
}
// 使用示例
document.getElementById('download-button').addEventListener('click', async () => {
  const url = 'https://example.com/large-file.zip';
  const filename = 'download.zip';
 
  // 创建进度条
  const progressBar = document.createElement('progress');
  progressBar.max = 100;
  progressBar.value = 0;
  document.body.appendChild(progressBar);
 
  // 创建进度文本
  const progressText = document.createElement('div');
  document.body.appendChild(progressText);
 
  // 下载文件并显示进度
  const success = await downloadLargeFile(
    url,
    filename,
    (received, total, percent) => {
      progressBar.value = percent;
      progressText.textContent = `${percent}% (${formatSize(received)} / ${formatSize(total)})`;
    }
  );
 
  if (success) {
    progressText.textContent = '下载完成!';
  } else {
    progressText.textContent = '下载失败!';
  }
});
// 辅助函数：格式化文件大小
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
 
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
 
  return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}
```
## 7. 文件上传
### 7.1 基本文件上传
```javascript
/**
 * 上传文件到服务器
 * @param {File|Blob} file - 要上传的文件
 * @param {string} url - 上传URL
 * @param {Object} options - 上传选项
 * @returns {Promise<Object>} - 服务器响应
 */
async function uploadFile(file, url, options = {}) {
  // 默认选项
  const defaultOptions = {
    method: 'POST',
    fieldName: 'file',
    headers: {},
    formData: null,
    onProgress: null,
    withCredentials: false
  };
 
  // 合并选项
  const config = { ...defaultOptions, ...options };
 
  return new Promise((resolve, reject) => {
    // 创建XMLHttpRequest对象
    const xhr = new XMLHttpRequest();
   
    // 设置进度事件
    if (typeof config.onProgress === 'function') {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          config.onProgress(percent, event.loaded, event.total);
        }
      };
    }
   
    // 设置完成事件

    // 设置完成事件
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        // 成功
        try {
          const response = xhr.responseType === 'json' ? xhr.response : JSON.parse(xhr.responseText);
          resolve(response);
        } catch (error) {
          // 如果响应不是JSON
          resolve(xhr.responseText);
        }
      } else {
        // 错误
        reject(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`));
      }
    };
   
    // 设置错误事件
    xhr.onerror = () => {
      reject(new Error('网络错误'));
    };
   
    // 设置中止事件
    xhr.onabort = () => {
      reject(new Error('上传已取消'));
    };
   
    // 打开连接
    xhr.open(config.method, url, true);
   
    // 设置凭据
    xhr.withCredentials = config.withCredentials;
   
    // 设置响应类型
    xhr.responseType = 'json';
   
    // 设置请求头
    for (const [key, value] of Object.entries(config.headers)) {
      xhr.setRequestHeader(key, value);
    }
   
    // 创建FormData
    let formData = config.formData;
    if (!formData) {
      formData = new FormData();
    }
   
    // 添加文件
    formData.append(config.fieldName, file, file.name);
   
    // 发送请求
    xhr.send(formData);
   
    // 返回取消上传的函数
    return {
      cancel: () => xhr.abort()
    };
  });
}
// 使用示例
document.getElementById('upload-form').addEventListener('submit', async (event) => {
  event.preventDefault();
 
  const fileInput = document.getElementById('file-input');
  const file = fileInput.files[0];
 
  if (!file) {
    alert('请选择文件');
    return;
  }
 
  // 创建进度条
  const progressBar = document.createElement('progress');
  progressBar.max = 100;
  progressBar.value = 0;
  document.body.appendChild(progressBar);
 
  // 创建进度文本
  const progressText = document.createElement('div');
  document.body.appendChild(progressText);
 
  try {
    // 上传文件
    const response = await uploadFile(
      file,
      'https://example.com/upload',
      {
        headers: {
          'X-Custom-Header': 'CustomValue'
        },
        onProgress: (percent, loaded, total) => {
          progressBar.value = percent;
          progressText.textContent = `${percent}% (${formatSize(loaded)} / ${formatSize(total)})`;
        }
      }
    );
   
    console.log('上传成功:', response);
    progressText.textContent = '上传完成!';
  } catch (error) {
    console.error('上传失败:', error);
    progressText.textContent = `上传失败: ${error.message}`;
  }
});
```
### 7.2 多文件上传
```javascript
/**
 * 上传多个文件到服务器
 * @param {File[]|FileList} files - 要上传的文件列表
 * @param {string} url - 上传URL
 * @param {Object} options - 上传选项
 * @returns {Promise<Object[]>} - 服务器响应数组
 */
async function uploadMultipleFiles(files, url, options = {}) {
  // 默认选项
  const defaultOptions = {
    concurrent: true, // 是否并发上传
    maxConcurrent: 3, // 最大并发数
    fieldName: 'files',
    headers: {},
    formData: null,
    onProgress: null, // 总体进度回调
    onFileProgress: null, // 单个文件进度回调
    withCredentials: false
  };
 
  // 合并选项
  const config = { ...defaultOptions, ...options };
 
  // 转换FileList为数组
  const fileArray = Array.from(files);
 
  // 如果没有文件，返回空数组
  if (fileArray.length === 0) {
    return [];
  }
 
  // 并发上传
  if (config.concurrent) {
    // 限制并发数
    const results = [];
    const pending = [...fileArray];
    const inProgress = new Set();
    let completed = 0;
    const total = fileArray.length;
   
    // 更新总体进度
    const updateTotalProgress = () => {
      if (typeof config.onProgress === 'function') {
        const percent = Math.round((completed / total) * 100);
        config.onProgress(percent, completed, total);
      }
    };
   
    // 上传下一个文件
    const uploadNext = async () => {
      if (pending.length === 0) {
        return;
      }
     
      // 如果正在上传的文件数量达到最大并发数，等待
      if (inProgress.size >= config.maxConcurrent) {
        return;
      }
     
      // 获取下一个文件
      const file = pending.shift();
      const index = fileArray.indexOf(file);
      inProgress.add(file);
     
      try {
        // 上传文件
        const result = await uploadFile(file, url, {
          ...config,
          onProgress: (percent, loaded, total) => {
            // 调用单个文件进度回调
            if (typeof config.onFileProgress === 'function') {
              config.onFileProgress(index, file, percent, loaded, total);
            }
          }
        });
       
        // 保存结果
        results[index] = {
          success: true,
          file,
          response: result
        };
      } catch (error) {
        // 保存错误
        results[index] = {
          success: false,
          file,
          error
        };
      } finally {
        // 更新状态
        inProgress.delete(file);
        completed++;
        updateTotalProgress();
       
        // 继续上传下一个文件
        uploadNext();
      }
    };
   
    // 开始上传
    const promises = [];
    for (let i = 0; i < Math.min(config.maxConcurrent, fileArray.length); i++) {
      promises.push(uploadNext());
    }
   
    // 等待所有文件上传完成
    await Promise.all(promises);
   
    return results;
  } else {
    // 顺序上传
    const results = [];
    let completed = 0;
    const total = fileArray.length;
   
    // 更新总体进度
    const updateTotalProgress = () => {
      if (typeof config.onProgress === 'function') {
        const percent = Math.round((completed / total) * 100);
        config.onProgress(percent, completed, total);
      }
    };
   
    // 逐个上传文件
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];
     
      try {
        // 上传文件
        const result = await uploadFile(file, url, {
          ...config,
          onProgress: (percent, loaded, total) => {
            // 调用单个文件进度回调
            if (typeof config.onFileProgress === 'function') {
              config.onFileProgress(i, file, percent, loaded, total);
            }
          }
        });
       
        // 保存结果
        results.push({
          success: true,
          file,
          response: result
        });
      } catch (error) {
        // 保存错误
        results.push({
          success: false,
          file,
          error
        });
      } finally {
        // 更新状态
        completed++;
        updateTotalProgress();
      }
    }
   
    return results;
  }
}
// 使用示例
document.getElementById('multi-upload-form').addEventListener('submit', async (event) => {
  event.preventDefault();
 
  const fileInput = document.getElementById('multi-file-input');
  const files = fileInput.files;
 
  if (files.length === 0) {
    alert('请选择文件');
    return;
  }
 
  // 创建总体进度条
  const totalProgress = document.createElement('progress');
  totalProgress.max = 100;
  totalProgress.value = 0;
  document.body.appendChild(totalProgress);
 
  // 创建总体进度文本
  const totalProgressText = document.createElement('div');
  document.body.appendChild(totalProgressText);
 
  // 创建文件进度容器
  const fileProgressContainer = document.createElement('div');
  document.body.appendChild(fileProgressContainer);
 
  // 为每个文件创建进度条
  const fileProgressBars = {};
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
   
    const container = document.createElement('div');
    container.style.marginBottom = '10px';
   
    const nameSpan = document.createElement('span');
    nameSpan.textContent = file.name;
    container.appendChild(nameSpan);
   
    const progressBar = document.createElement('progress');
    progressBar.max = 100;
    progressBar.value = 0;
    progressBar.style.marginLeft = '10px';
    container.appendChild(progressBar);
   
    const progressText = document.createElement('span');
    progressText.style.marginLeft = '10px';
    progressText.textContent = '0%';
    container.appendChild(progressText);
   
    fileProgressContainer.appendChild(container);
   
    fileProgressBars[i] = {
      progressBar,
      progressText
    };
  }
 
  try {
    // 上传文件
    const results = await uploadMultipleFiles(
      files,
      'https://example.com/upload',
      {
        concurrent: true,
        maxConcurrent: 3,
        onProgress: (percent, completed, total) => {
          totalProgress.value = percent;
          totalProgressText.textContent = `总进度: ${percent}% (${completed}/${total} 文件)`;
        },
        onFileProgress: (index, file, percent, loaded, total) => {
          const { progressBar, progressText } = fileProgressBars[index];
          progressBar.value = percent;
          progressText.textContent = `${percent}% (${formatSize(loaded)} / ${formatSize(total)})`;
        }
      }
    );
   
    console.log('上传结果:', results);
   
    // 显示结果
    const successCount = results.filter(result => result.success).length;
    totalProgressText.textContent = `上传完成! ${successCount}/${files.length} 文件上传成功`;
  } catch (error) {
    console.error('上传失败:', error);
    totalProgressText.textContent = `上传失败: ${error.message}`;
  }
});
```
### 7.3 分块上传大文件
```javascript
/**
 * 分块上传大文件
 * @param {File|Blob} file - 要上传的文件
 * @param {string} url - 上传URL
 * @param {Object} options - 上传选项
 * @returns {Promise<Object>} - 服务器响应
 */
async function uploadLargeFile(file, url, options = {}) {
  // 默认选项
  const defaultOptions = {
    chunkSize: 1024 * 1024, // 1MB
    concurrentChunks: 3, // 并发上传的块数
    fieldName: 'file',
    headers: {},
    metadata: {}, // 文件元数据
    onProgress: null, // 总体进度回调
    onChunkProgress: null, // 块进度回调
    withCredentials: false,
    retries: 3 // 每个块的重试次数
  };
 
  // 合并选项
  const config = { ...defaultOptions, ...options };
 
  // 计算块数
  const fileSize = file.size;
  const chunkSize = config.chunkSize;
  const chunkCount = Math.ceil(fileSize / chunkSize);
 
  // 初始化进度
  let uploadedSize = 0;
 
  // 更新总体进度
  const updateTotalProgress = (additionalSize = 0) => {
    if (typeof config.onProgress === 'function') {
      const newUploadedSize = uploadedSize + additionalSize;
      const percent = Math.round((newUploadedSize / fileSize) * 100);
      config.onProgress(percent, newUploadedSize, fileSize);
    }
  };
 

 // 初始化上传
  const initResponse = await fetch(`${url}/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...config.headers
    },
    body: JSON.stringify({
      fileName: file.name,
      fileSize,
      fileType: file.type,
      chunkCount,
      chunkSize,
      metadata: config.metadata
    }),
    credentials: config.withCredentials ? 'include' : 'same-origin'
  });
 
  if (!initResponse.ok) {
    throw new Error(`初始化上传失败: ${initResponse.status} ${initResponse.statusText}`);
  }
 
  const { uploadId } = await initResponse.json();
 
  // 上传单个块
  const uploadChunk = async (chunkIndex, retryCount = 0) => {
    // 计算块的起始和结束位置
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, fileSize);
    const chunkSize = end - start;
   
    // 从文件中切出块
    const chunk = file.slice(start, end);
   
    try {
      // 创建FormData
      const formData = new FormData();
      formData.append('uploadId', uploadId);
      formData.append('chunkIndex', chunkIndex);
      formData.append('totalChunks', chunkCount);
      formData.append(config.fieldName, chunk, `${file.name}.part${chunkIndex}`);
     
      // 上传块
      const response = await fetch(`${url}/chunk`, {
        method: 'POST',
        headers: {
          ...config.headers
        },
        body: formData,
        credentials: config.withCredentials ? 'include' : 'same-origin'
      });
     
      if (!response.ok) {
        throw new Error(`上传块失败: ${response.status} ${response.statusText}`);
      }
     
      // 更新进度
      uploadedSize += chunkSize;
      updateTotalProgress();
     
      return await response.json();
    } catch (error) {
      // 重试
      if (retryCount < config.retries) {
        console.warn(`块 ${chunkIndex} 上传失败，重试 (${retryCount + 1}/${config.retries})...`);
        return uploadChunk(chunkIndex, retryCount + 1);
      }
     
      throw error;
    }
  };
 
  // 并发上传块
  const uploadChunks = async () => {
    const results = new Array(chunkCount);
    const pendingChunks = Array.from({ length: chunkCount }, (_, i) => i);
    const inProgress = new Set();
   
    // 上传下一个块
    const uploadNextChunk = async () => {
      if (pendingChunks.length === 0) {
        return;
      }
     
      // 如果正在上传的块数量达到最大并发数，等待
      if (inProgress.size >= config.concurrentChunks) {
        return;
      }
     
      // 获取下一个块
      const chunkIndex = pendingChunks.shift();
      inProgress.add(chunkIndex);
     
      try {
        // 上传块
        const result = await uploadChunk(chunkIndex);
       
        // 保存结果
        results[chunkIndex] = {
          success: true,
          chunkIndex,
          response: result
        };
      } catch (error) {
        // 保存错误
        results[chunkIndex] = {
          success: false,
          chunkIndex,
          error
        };
       
        // 如果有块上传失败，中止整个上传
        throw new Error(`块 ${chunkIndex} 上传失败: ${error.message}`);
      } finally {
        // 更新状态
        inProgress.delete(chunkIndex);
       
        // 继续上传下一个块
        uploadNextChunk();
      }
    };
   
    // 开始上传
    const promises = [];
    for (let i = 0; i < Math.min(config.concurrentChunks, chunkCount); i++) {
      promises.push(uploadNextChunk());
    }
   
    // 等待所有块上传完成
    await Promise.all(promises);
   
    return results;
  };
 
  // 上传所有块
  const chunkResults = await uploadChunks();
 
  // 完成上传
  const completeResponse = await fetch(`${url}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...config.headers
    },
    body: JSON.stringify({
      uploadId,
      fileName: file.name,
      fileSize,
      chunkCount
    }),
    credentials: config.withCredentials ? 'include' : 'same-origin'
  });
 
  if (!completeResponse.ok) {
    throw new Error(`完成上传失败: ${completeResponse.status} ${completeResponse.statusText}`);
  }
 
  // 返回完成响应
  return await completeResponse.json();
}
// 使用示例
document.getElementById('large-upload-form').addEventListener('submit', async (event) => {
  event.preventDefault();
 
  const fileInput = document.getElementById('large-file-input');
  const file = fileInput.files[0];
 
  if (!file) {
    alert('请选择文件');
    return;
  }
 
  // 创建进度条
  const progressBar = document.createElement('progress');
  progressBar.max = 100;
  progressBar.value = 0;
  document.body.appendChild(progressBar);
 
  // 创建进度文本
  const progressText = document.createElement('div');
  document.body.appendChild(progressText);
 
  try {
    // 上传文件
    const response = await uploadLargeFile(
      file,
      'https://example.com/upload',
      {
        chunkSize: 2 * 1024 * 1024, // 2MB
        concurrentChunks: 3,
        metadata: {
          userId: 'user123',
          category: 'documents'
        },
        onProgress: (percent, loaded, total) => {
          progressBar.value = percent;
          progressText.textContent = `${percent}% (${formatSize(loaded)} / ${formatSize(total)})`;
        }
      }
    );
   
    console.log('上传成功:', response);
    progressText.textContent = '上传完成!';
  } catch (error) {
    console.error('上传失败:', error);
    progressText.textContent = `上传失败: ${error.message}`;
  }
});
```
### 7.4 断点续传
```javascript
/**
 * 支持断点续传的大文件上传
 * @param {File|Blob} file - 要上传的文件
 * @param {string} url - 上传URL
 * @param {Object} options - 上传选项
 * @returns {Promise<Object>} - 服务器响应
 */
async function resumableUpload(file, url, options = {}) {
  // 默认选项
  const defaultOptions = {
    chunkSize: 1024 * 1024, // 1MB
    concurrentChunks: 3, // 并发上传的块数
    fieldName: 'file',
    headers: {},
    metadata: {}, // 文件元数据
    onProgress: null, // 总体进度回调
    onChunkProgress: null, // 块进度回调
    withCredentials: false,
    retries: 3, // 每个块的重试次数
    storageKey: null // 用于保存上传状态的本地存储键
  };
 
  // 合并选项
  const config = { ...defaultOptions, ...options };
 
  // 生成文件的唯一标识符
  const generateFileId = async (file) => {
    // 使用文件名、大小和最后修改时间创建唯一ID
    const fileInfo = `${file.name}-${file.size}-${file.lastModified}`;
   
    // 使用SubtleCrypto API计算SHA-256哈希
    const encoder = new TextEncoder();
    const data = encoder.encode(fileInfo);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
   
    // 将哈希转换为十六进制字符串
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
   
    return hashHex;
  };
 
  // 获取存储键
  const fileId = await generateFileId(file);
  const storageKey = config.storageKey || `resumable-upload-${fileId}`;
 
  // 从本地存储加载上传状态
  const loadUploadState = () => {
    try {
      const savedState = localStorage.getItem(storageKey);
      if (savedState) {
        return JSON.parse(savedState);
      }
    } catch (error) {
      console.warn('无法加载上传状态:', error);
    }
    return null;
  };
 
  // 保存上传状态到本地存储
  const saveUploadState = (state) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn('无法保存上传状态:', error);
    }
  };
 
  // 清除上传状态
  const clearUploadState = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch (error) {
      console.warn('无法清除上传状态:', error);
    }
  };
 
  // 计算块数
  const fileSize = file.size;
  const chunkSize = config.chunkSize;
  const chunkCount = Math.ceil(fileSize / chunkSize);
 
  // 加载之前的上传状态
  let uploadState = loadUploadState();
  let uploadId = uploadState?.uploadId;
  let uploadedChunks = uploadState?.uploadedChunks || [];
 
  // 初始化进度
  let uploadedSize = uploadedChunks.reduce((size, chunkIndex) => {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, fileSize);
    return size + (end - start);
  }, 0);
 
  // 更新总体进度
  const updateTotalProgress = (additionalSize = 0) => {
    if (typeof config.onProgress === 'function') {
      const newUploadedSize = uploadedSize + additionalSize;
      const percent = Math.round((newUploadedSize / fileSize) * 100);
      config.onProgress(percent, newUploadedSize, fileSize);
    }
  };
 
  // 初始化或恢复上传
  if (!uploadId) {
    // 初始化新上传
    const initResponse = await fetch(`${url}/init`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      body: JSON.stringify({
        fileName: file.name,
        fileSize,
        fileType: file.type,
        chunkCount,
        chunkSize,
        metadata: config.metadata,
        fileId
      }),
      credentials: config.withCredentials ? 'include' : 'same-origin'
    });
   
    if (!initResponse.ok) {
      throw new Error(`初始化上传失败: ${initResponse.status} ${initResponse.statusText}`);
    }
   
    const initData = await initResponse.json();
    uploadId = initData.uploadId;
   
    // 保存上传状态
    uploadState = { uploadId, uploadedChunks: [] };
    saveUploadState(uploadState);
  } else {
    // 恢复上传，验证服务器上的状态
    const resumeResponse = await fetch(`${url}/resume`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...config.headers
      },
      body: JSON.stringify({
        uploadId,
        fileName: file.name,
        fileSize,
        fileId
      }),
      credentials: config.withCredentials ? 'include' : 'same-origin'
    });
   
    if (!resumeResponse.ok) {
      // 如果恢复失败，清除状态并重新开始
      clearUploadState();
      return resumableUpload(file, url, options);
    }
   

 // 获取服务器上已上传的块
  const resumeData = await resumeResponse.json();
  uploadedChunks = resumeData.uploadedChunks || uploadedChunks;
 
  // 更新上传状态
  uploadState.uploadedChunks = uploadedChunks;
  saveUploadState(uploadState);
 
  // 更新已上传大小
  uploadedSize = uploadedChunks.reduce((size, chunkIndex) => {
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, fileSize);
    return size + (end - start);
  }, 0);
 
  // 更新进度
  updateTotalProgress();
 
  // 上传单个块
  const uploadChunk = async (chunkIndex, retryCount = 0) => {
    // 如果块已上传，跳过
    if (uploadedChunks.includes(chunkIndex)) {
      return { success: true, chunkIndex, skipped: true };
    }
   
    // 计算块的起始和结束位置
    const start = chunkIndex * chunkSize;
    const end = Math.min(start + chunkSize, fileSize);
    const currentChunkSize = end - start;
   
    // 从文件中切出块
    const chunk = file.slice(start, end);
   
    try {
      // 创建FormData
      const formData = new FormData();
      formData.append('uploadId', uploadId);
      formData.append('chunkIndex', chunkIndex);
      formData.append('totalChunks', chunkCount);
      formData.append(config.fieldName, chunk, `${file.name}.part${chunkIndex}`);
     
      // 上传块
      const response = await fetch(`${url}/chunk`, {
        method: 'POST',
        headers: {
          ...config.headers
        },
        body: formData,
        credentials: config.withCredentials ? 'include' : 'same-origin'
      });
     
      if (!response.ok) {
        throw new Error(`上传块失败: ${response.status} ${response.statusText}`);
      }
     
      // 更新进度
      uploadedSize += currentChunkSize;
      updateTotalProgress();
     
      // 更新上传状态
      uploadedChunks.push(chunkIndex);
      uploadState.uploadedChunks = uploadedChunks;
      saveUploadState(uploadState);
     
      return {
        success: true,
        chunkIndex,
        response: await response.json()
      };
    } catch (error) {
      // 重试
      if (retryCount < config.retries) {
        console.warn(`块 ${chunkIndex} 上传失败，重试 (${retryCount + 1}/${config.retries})...`);
        return uploadChunk(chunkIndex, retryCount + 1);
      }
     
      throw error;
    }
  };
 
  // 并发上传块
  const uploadChunks = async () => {
    const results = new Array(chunkCount);
    const pendingChunks = Array.from({ length: chunkCount }, (_, i) => i)
      .filter(i => !uploadedChunks.includes(i)); // 排除已上传的块
   
    const inProgress = new Set();
   
    // 上传下一个块
    const uploadNextChunk = async () => {
      if (pendingChunks.length === 0) {
        return;
      }
     
      // 如果正在上传的块数量达到最大并发数，等待
      if (inProgress.size >= config.concurrentChunks) {
        return;
      }
     
      // 获取下一个块
      const chunkIndex = pendingChunks.shift();
      inProgress.add(chunkIndex);
     
      try {
        // 上传块
        const result = await uploadChunk(chunkIndex);
       
        // 保存结果
        results[chunkIndex] = result;
      } catch (error) {
        // 保存错误
        results[chunkIndex] = {
          success: false,
          chunkIndex,
          error
        };
       
        // 如果有块上传失败，中止整个上传
        throw new Error(`块 ${chunkIndex} 上传失败: ${error.message}`);
      } finally {
        // 更新状态
        inProgress.delete(chunkIndex);
       
        // 继续上传下一个块
        uploadNextChunk();
      }
    };
   
    // 开始上传
    const promises = [];
    for (let i = 0; i < Math.min(config.concurrentChunks, pendingChunks.length); i++) {
      promises.push(uploadNextChunk());
    }
   
    // 等待所有块上传完成
    await Promise.all(promises);
   
    return results;
  };
 
  // 上传所有块
  const chunkResults = await uploadChunks();
 
  // 完成上传
  const completeResponse = await fetch(`${url}/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...config.headers
    },
    body: JSON.stringify({
      uploadId,
      fileName: file.name,
      fileSize,
      chunkCount,
      fileId
    }),
    credentials: config.withCredentials ? 'include' : 'same-origin'
  });
 
  if (!completeResponse.ok) {
    throw new Error(`完成上传失败: ${completeResponse.status} ${completeResponse.statusText}`);
  }
 
  // 清除上传状态
  clearUploadState();
 
  // 返回完成响应
  return await completeResponse.json();
}
// 使用示例
document.getElementById('resumable-upload-form').addEventListener('submit', async (event) => {
  event.preventDefault();
 
  const fileInput = document.getElementById('resumable-file-input');
  const file = fileInput.files[0];
 
  if (!file) {
    alert('请选择文件');
    return;
  }
 
  // 创建进度条
  const progressBar = document.createElement('progress');
  progressBar.max = 100;
  progressBar.value = 0;
  document.body.appendChild(progressBar);
 
  // 创建进度文本
  const progressText = document.createElement('div');
  document.body.appendChild(progressText);
 
  // 创建暂停/恢复按钮
  const pauseButton = document.createElement('button');
  pauseButton.textContent = '暂停';
  document.body.appendChild(pauseButton);
 
  // 上传状态
  let isPaused = false;
  let uploadPromise = null;
 
  // 暂停/恢复处理
  pauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? '恢复' : '暂停';
   
    if (!isPaused && !uploadPromise) {
      // 恢复上传
      startUpload();
    }
  });
 
  // 开始上传
  const startUpload = async () => {
    try {
      uploadPromise = resumableUpload(
        file,
        'https://example.com/upload',
        {
          chunkSize: 2 * 1024 * 1024, // 2MB
          concurrentChunks: 3,
          storageKey: `upload-${file.name}-${file.size}`,
          onProgress: (percent, loaded, total) => {
            progressBar.value = percent;
            progressText.textContent = `${percent}% (${formatSize(loaded)} / ${formatSize(total)})`;
           
            // 如果暂停，中断上传
            if (isPaused) {
              uploadPromise = null;
              throw new Error('上传已暂停');
            }
          }
        }
      );
     
      const response = await uploadPromise;
      console.log('上传成功:', response);
      progressText.textContent = '上传完成!';
      pauseButton.disabled = true;
    } catch (error) {
      if (error.message === '上传已暂停') {
        console.log('上传已暂停，可以稍后恢复');
        progressText.textContent += ' (已暂停)';
      } else {
        console.error('上传失败:', error);
        progressText.textContent = `上传失败: ${error.message}`;
      }
    } finally {
      uploadPromise = null;
    }
  };
 
  // 开始上传
  if (!isPaused) {
    startUpload();
  }
});
```