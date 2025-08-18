# HTML5 多媒体 API 详解

HTML5 多媒体 API 为网页中的音频和视频处理提供了原生支持，无需依赖第三方插件。这些 API 使得在网页中嵌入、控制和操作多媒体内容变得更加简单和标准化。

## 目录
1. [概述](#概述)
2. [音频 API](#音频-api)
3. [视频 API](#视频-api)
4. [媒体元素属性](#媒体元素属性)
5. [媒体元素方法](#媒体元素方法)
6. [媒体事件](#媒体事件)
7. [自适应流媒体](#自适应流媒体)
8. [Web Audio API](#web-audio-api)
9. [完整示例](#完整示例)

## 概述

HTML5 引入了原生的多媒体支持，主要包括：

1. **Audio 元素** - 用于播放音频内容
2. **Video 元素** - 用于播放视频内容
3. **Web Audio API** - 提供更高级的音频处理能力
4. **Media Source Extensions (MSE)** - 支持自适应流媒体

这些技术使得开发者可以在不使用 Flash 或其他插件的情况下，在网页中嵌入丰富的多媒体内容。

## 音频 API

### audio 元素基础

```html
<!-- 基本音频播放 -->
<audio controls>
  <source src="audio.mp3" type="audio/mpeg">
  <source src="audio.ogg" type="audio/ogg">
  您的浏览器不支持音频元素。
</audio>
```

### audio 元素属性

```html
<audio 
  src="audio.mp3" 
  controls 
  autoplay 
  loop 
  muted 
  preload="auto">
</audio>
```

常用属性说明：
- `src` - 音频文件的URL
- `controls` - 显示播放控件
- `autoplay` - 自动播放
- `loop` - 循环播放
- `muted` - 静音
- `preload` - 预加载策略（none, metadata, auto）

### JavaScript 控制音频

```javascript
// 获取音频元素
const audio = document.getElementById('myAudio');

// 播放和暂停
audio.play();
audio.pause();

// 控制音量 (0.0 到 1.0)
audio.volume = 0.5;

// 控制播放位置（秒）
audio.currentTime = 30;

// 静音控制
audio.muted = true;

// 检查播放状态
if (audio.paused) {
  console.log('音频已暂停');
} else {
  console.log('音频正在播放');
}
```

## 视频 API

### video 元素基础

```html
<!-- 基本视频播放 -->
<video width="640" height="480" controls>
  <source src="video.mp4" type="video/mp4">
  <source src="video.webm" type="video/webm">
  您的浏览器不支持视频元素。
</video>
```

### video 元素属性

```html
<video 
  width="640" 
  height="480" 
  src="video.mp4" 
  controls 
  autoplay 
  loop 
  muted 
  poster="poster.jpg"
  preload="metadata">
</video>
```

常用属性说明：
- `width/height` - 视频显示尺寸
- `poster` - 视频封面图片
- 其他属性与音频元素相同

### JavaScript 控制视频

```javascript
// 获取视频元素
const video = document.getElementById('myVideo');

// 播放和暂停
video.play();
video.pause();

// 控制音量
video.volume = 0.7;

// 控制播放位置
video.currentTime = 60;

// 全屏控制
if (video.requestFullscreen) {
  video.requestFullscreen();
}

// 检查播放状态
console.log('视频时长:', video.duration);
console.log('当前播放位置:', video.currentTime);
console.log('是否暂停:', video.paused);
```

## 媒体元素属性

### 标准属性

```javascript
const media = document.getElementById('myMedia');

// 只读属性
console.log('媒体时长:', media.duration);        // 秒
console.log('当前播放位置:', media.currentTime);   // 秒
console.log('是否暂停:', media.paused);          // 布尔值
console.log('是否结束:', media.ended);           // 布尔值
console.log('播放速度:', media.playbackRate);    // 1.0 为正常速度

// 可读写属性
media.volume = 0.8;           // 音量 (0.0 - 1.0)
media.muted = false;          // 是否静音
media.currentTime = 10;       // 设置播放位置
media.playbackRate = 1.5;     // 播放速度 (2.0 为2倍速)
```

### 网络状态属性

```javascript
const media = document.getElementById('myMedia');

// 网络状态
console.log('网络状态:', media.networkState);
// 0 = NETWORK_EMPTY (未初始化)
// 1 = NETWORK_IDLE (未使用网络)
// 2 = NETWORK_LOADING (正在下载数据)
// 3 = NETWORK_NO_SOURCE (未找到资源)

// 就绪状态
console.log('就绪状态:', media.readyState);
// 0 = HAVE_NOTHING (没有信息)
// 1 = HAVE_METADATA (元数据已加载)
// 2 = HAVE_CURRENT_DATA (当前播放位置数据可用)
// 3 = HAVE_FUTURE_DATA (未来播放位置数据可用)
// 4 = HAVE_ENOUGH_DATA (有足够的数据可以播放)
```

## 媒体元素方法

### 基本控制方法

```javascript
const media = document.getElementById('myMedia');

// 播放控制
media.play();     // 开始播放
media.pause();    // 暂停播放

// 时间控制
media.load();     // 重新加载媒体
media.canPlayType('video/mp4'); // 检查格式支持

// 快捷操作
media.fastSeek(30); // 快速跳转到指定时间（实验性）
```

### 格式支持检测

```javascript
const video = document.createElement('video');

// 检查浏览器支持的视频格式
const mp4Support = video.canPlayType('video/mp4');
const webmSupport = video.canPlayType('video/webm');
const oggSupport = video.canPlayType('video/ogg');

console.log('MP4 支持:', mp4Support);   // "probably", "maybe", ""
console.log('WebM 支持:', webmSupport);
console.log('Ogg 支持:', oggSupport);
```

## 媒体事件

### 常用事件

```javascript
const media = document.getElementById('myMedia');

// 播放相关事件
media.addEventListener('play', () => {
  console.log('开始播放');
});

media.addEventListener('pause', () => {
  console.log('暂停播放');
});

media.addEventListener('ended', () => {
  console.log('播放结束');
});

// 时间相关事件
media.addEventListener('timeupdate', () => {
  console.log('播放位置更新:', media.currentTime);
});

media.addEventListener('durationchange', () => {
  console.log('媒体时长变化:', media.duration);
});

// 加载相关事件
media.addEventListener('loadstart', () => {
  console.log('开始加载');
});

media.addEventListener('loadedmetadata', () => {
  console.log('元数据加载完成');
});

media.addEventListener('loadeddata', () => {
  console.log('媒体数据加载完成');
});

media.addEventListener('canplay', () => {
  console.log('可以播放');
});

media.addEventListener('canplaythrough', () => {
  console.log('可以流畅播放');
});

// 错误事件
media.addEventListener('error', (e) => {
  console.log('媒体加载错误:', e);
});
```

### 进度事件

```javascript
const media = document.getElementById('myMedia');

// 缓冲进度
media.addEventListener('progress', () => {
  if (media.buffered.length > 0) {
    const bufferedEnd = media.buffered.end(media.buffered.length - 1);
    const duration = media.duration;
    const bufferedPercent = (bufferedEnd / duration) * 100;
    console.log('缓冲进度:', bufferedPercent + '%');
  }
});

// 寻找事件
media.addEventListener('seeking', () => {
  console.log('正在寻找位置');
});

media.addEventListener('seeked', () => {
  console.log('寻找位置完成');
});
```

## 自适应流媒体

### Media Source Extensions (MSE)

```javascript
// 检查 MSE 支持
if ('MediaSource' in window) {
  console.log('支持 Media Source Extensions');
}

// 基本 MSE 使用
const video = document.getElementById('myVideo');
const mediaSource = new MediaSource();

video.src = URL.createObjectURL(mediaSource);

mediaSource.addEventListener('sourceopen', () => {
  const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
  
  // 添加媒体数据
  fetch('segment.mp4')
    .then(response => response.arrayBuffer())
    .then(data => {
      sourceBuffer.appendBuffer(data);
    });
});
```

### 简单的自适应播放器

```javascript
class AdaptivePlayer {
  constructor(videoElement) {
    this.video = videoElement;
    this.mediaSource = new MediaSource();
    this.video.src = URL.createObjectURL(this.mediaSource);
    
    this.qualityLevels = [
      { bitrate: 500000, url: 'low.mp4' },
      { bitrate: 1000000, url: 'medium.mp4' },
      { bitrate: 2000000, url: 'high.mp4' }
    ];
    
    this.currentLevel = 1;
  }
  
  init() {
    this.mediaSource.addEventListener('sourceopen', () => {
      this.loadSegment(this.qualityLevels[this.currentLevel].url);
    });
  }
  
  loadSegment(url) {
    const sourceBuffer = this.mediaSource.addSourceBuffer('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');
    
    fetch(url)
      .then(response => response.arrayBuffer())
      .then(data => {
        sourceBuffer.appendBuffer(data);
      });
  }
  
  switchQuality(level) {
    if (level >= 0 && level < this.qualityLevels.length) {
      this.currentLevel = level;
      // 实现质量切换逻辑
      console.log('切换到质量等级:', level);
    }
  }
}

// 使用示例
// const player = new AdaptivePlayer(document.getElementById('myVideo'));
// player.init();
```

## Web Audio API

### AudioContext 基础

```javascript
// 创建音频上下文
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// 加载音频文件
async function loadAudio(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  return audioBuffer;
}

// 播放音频
async function playAudio(url) {
  const audioBuffer = await loadAudio(url);
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(audioContext.destination);
  source.start();
}
```

### 音频处理节点

```javascript
// 创建增益节点（音量控制）
const gainNode = audioContext.createGain();
gainNode.gain.value = 0.5; // 设置音量为50%

// 创建滤波器
const filter = audioContext.createBiquadFilter();
filter.type = 'lowpass';
filter.frequency.value = 1000;

// 连接节点
// source -> filter -> gain -> destination
source.connect(filter);
filter.connect(gainNode);
gainNode.connect(audioContext.destination);
```

### 简单音频播放器

```javascript
class WebAudioPlayer {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    this.source = null;
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
  }
  
  async load(url) {
    // 停止当前播放
    if (this.source) {
      this.source.stop();
    }
    
    // 加载新音频
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
  }
  
  play() {
    if (this.audioBuffer) {
      this.source = this.audioContext.createBufferSource();
      this.source.buffer = this.audioBuffer;
      this.source.connect(this.gainNode);
      this.source.start();
    }
  }
  
  stop() {
    if (this.source) {
      this.source.stop();
    }
  }
  
  setVolume(volume) {
    this.gainNode.gain.value = volume;
  }
}

// 使用示例
// const player = new WebAudioPlayer();
// player.load('audio.mp3').then(() => {
//   player.play();
// });
```

## 完整示例

### 自定义媒体播放器

```html
<!DOCTYPE html>
<html>
<head>
  <title>自定义媒体播放器</title>
  <style>
    .media-player {
      max-width: 600px;
      margin: 20px auto;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      font-family: Arial, sans-serif;
    }
    
    .media-container {
      position: relative;
      background: #000;
    }
    
    .media-container video {
      width: 100%;
      display: block;
    }
    
    .controls {
      background: #333;
      color: white;
      padding: 10px;
    }
    
    .control-row {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
    }
    
    .control-row:last-child {
      margin-bottom: 0;
    }
    
    .play-btn, .mute-btn {
      background: #555;
      border: none;
      color: white;
      padding: 5px 10px;
      margin-right: 10px;
      cursor: pointer;
      border-radius: 3px;
    }
    
    .play-btn:hover, .mute-btn:hover {
      background: #666;
    }
    
    .progress-container {
      flex: 1;
      height: 5px;
      background: #555;
      border-radius: 3px;
      cursor: pointer;
      margin: 0 10px;
    }
    
    .progress-bar {
      height: 100%;
      background: #4a90e2;
      border-radius: 3px;
      width: 0%;
    }
    
    .time-display {
      font-size: 12px;
      min-width: 100px;
    }
    
    .volume-container {
      display: flex;
      align-items: center;
      width: 150px;
    }
    
    .volume-slider {
      flex: 1;
      margin: 0 10px;
    }
  </style>
</head>
<body>
  <div class="media-player">
    <div class="media-container">
      <video id="myVideo">
        <source src="sample.mp4" type="video/mp4">
        您的浏览器不支持视频播放。
      </video>
    </div>
    
    <div class="controls">
      <div class="control-row">
        <button class="play-btn" id="playBtn">播放</button>
        <div class="progress-container" id="progressContainer">
          <div class="progress-bar" id="progressBar"></div>
        </div>
        <div class="time-display" id="timeDisplay">00:00 / 00:00</div>
      </div>
      
      <div class="control-row">
        <button class="mute-btn" id="muteBtn">静音</button>
        <div class="volume-container">
          <span>音量:</span>
          <input type="range" class="volume-slider" id="volumeSlider" min="0" max="1" step="0.1" value="1">
        </div>
      </div>
    </div>
  </div>
  
  <script>
    class CustomMediaPlayer {
      constructor(videoElement) {
        this.video = videoElement;
        this.isPlaying = false;
        this.init();
      }
      
      init() {
        // 获取控制元素
        this.playBtn = document.getElementById('playBtn');
        this.muteBtn = document.getElementById('muteBtn');
        this.progressContainer = document.getElementById('progressContainer');
        this.progressBar = document.getElementById('progressBar');
        this.timeDisplay = document.getElementById('timeDisplay');
        this.volumeSlider = document.getElementById('volumeSlider');
        
        // 绑定事件
        this.bindEvents();
      }
      
      bindEvents() {
        // 播放/暂停按钮
        this.playBtn.addEventListener('click', () => {
          if (this.isPlaying) {
            this.pause();
          } else {
            this.play();
          }
        });
        
        // 静音按钮
        this.muteBtn.addEventListener('click', () => {
          this.video.muted = !this.video.muted;
          this.muteBtn.textContent = this.video.muted ? '取消静音' : '静音';
        });
        
        // 进度条点击
        this.progressContainer.addEventListener('click', (e) => {
          const rect = this.progressContainer.getBoundingClientRect();
          const pos = (e.clientX - rect.left) / rect.width;
          this.video.currentTime = pos * this.video.duration;
        });
        
        // 音量控制
        this.volumeSlider.addEventListener('input', (e) => {
          this.video.volume = e.target.value;
        });
        
        // 视频事件
        this.video.addEventListener('play', () => {
          this.isPlaying = true;
          this.playBtn.textContent = '暂停';
        });
        
        this.video.addEventListener('pause', () => {
          this.isPlaying = false;
          this.playBtn.textContent = '播放';
        });
        
        this.video.addEventListener('timeupdate', () => {
          this.updateProgress();
          this.updateTimeDisplay();
        });
        
        this.video.addEventListener('loadedmetadata', () => {
          this.updateTimeDisplay();
        });
      }
      
      play() {
        this.video.play();
      }
      
      pause() {
        this.video.pause();
      }
      
      updateProgress() {
        const percent = (this.video.currentTime / this.video.duration) * 100;
        this.progressBar.style.width = percent + '%';
      }
      
      updateTimeDisplay() {
        const current = this.formatTime(this.video.currentTime);
        const duration = this.formatTime(this.video.duration);
        this.timeDisplay.textContent = `${current} / ${duration}`;
      }
      
      formatTime(seconds) {
        if (isNaN(seconds)) return '00:00';
        
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
    }
    
    // 初始化播放器
    document.addEventListener('DOMContentLoaded', () => {
      const video = document.getElementById('myVideo');
      const player = new CustomMediaPlayer(video);
    });
  </script>
</body>
</html>
```

### 音频可视化示例

```html
<!DOCTYPE html>
<html>
<head>
  <title>音频可视化</title>
  <style>
    .audio-visualizer {
      max-width: 600px;
      margin: 20px auto;
      text-align: center;
    }
    
    canvas {
      background: #000;
      width: 100%;
      height: 200px;
      display: block;
    }
    
    .controls {
      margin: 20px 0;
    }
    
    button {
      padding: 10px 20px;
      margin: 0 10px;
      font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="audio-visualizer">
    <h2>音频可视化示例</h2>
    
    <canvas id="visualizer" width="600" height="200"></canvas>
    
    <div class="controls">
      <button id="playBtn">播放</button>
      <button id="stopBtn">停止</button>
    </div>
    
    <input type="file" id="audioFile" accept="audio/*">
  </div>
  
  <script>
    class AudioVisualizer {
      constructor(canvasElement) {
        this.canvas = canvasElement;
        this.ctx = this.canvas.getContext('2d');
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.analyser = this.audioContext.createAnalyser();
        this.source = null;
        
        // 设置分析器
        this.analyser.fftSize = 256;
        this.bufferLength = this.analyser.frequencyBinCount;
        this.dataArray = new Uint8Array(this.bufferLength);
        
        // 绑定事件
        this.bindEvents();
      }
      
      bindEvents() {
        document.getElementById('playBtn').addEventListener('click', () => {
          this.play();
        });
        
        document.getElementById('stopBtn').addEventListener('click', () => {
          this.stop();
        });
        
        document.getElementById('audioFile').addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            this.loadFile(file);
          }
        });
      }
      
      loadFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.stop();
          this.audioContext.decodeAudioData(e.target.result)
            .then((buffer) => {
              this.audioBuffer = buffer;
            });
        };
        reader.readAsArrayBuffer(file);
      }
      
      play() {
        if (this.audioBuffer && !this.source) {
          this.source = this.audioContext.createBufferSource();
          this.source.buffer = this.audioBuffer;
          this.source.connect(this.analyser);
          this.analyser.connect(this.audioContext.destination);
          this.source.start();
          
          // 开始可视化
          this.draw();
        }
      }
      
      stop() {
        if (this.source) {
          this.source.stop();
          this.source = null;
        }
      }
      
      draw() {
        if (!this.source) return;
        
        // 清除画布
        this.ctx.fillStyle = 'rgb(0, 0, 0)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 获取频域数据
        this.analyser.getByteFrequencyData(this.dataArray);
        
        // 绘制条形图
        const barWidth = (this.canvas.width / this.bufferLength) * 2.5;
        let barHeight;
        let x = 0;
        
        for (let i = 0; i < this.bufferLength; i++) {
          barHeight = this.dataArray[i] / 2;
          
          this.ctx.fillStyle = `rgb(${barHeight + 100}, 50, 50)`;
          this.ctx.fillRect(x, this.canvas.height - barHeight, barWidth, barHeight);
          
          x += barWidth + 1;
        }
        
        // 继续动画
        requestAnimationFrame(() => this.draw());
      }
    }
    
    // 初始化可视化器
    document.addEventListener('DOMContentLoaded', () => {
      const canvas = document.getElementById('visualizer');
      const visualizer = new AudioVisualizer(canvas);
    });
  </script>
</body>
</html>
```

## 总结

HTML5 多媒体 API 提供了丰富的功能来处理网页中的音频和视频内容：

1. **基础媒体元素** - audio 和 video 元素提供了简单的媒体播放功能
2. **JavaScript 控制** - 通过 API 可以精确控制媒体播放
3. **事件系统** - 丰富的事件支持媒体状态跟踪
4. **高级功能** - Web Audio API 和 MSE 提供了更强大的处理能力

虽然相对于其他 HTML5 特性，多媒体 API 可能不是最重要的，但它们在现代 Web 应用中仍然扮演着重要角色，特别是在媒体播放、流媒体和音频处理等方面。