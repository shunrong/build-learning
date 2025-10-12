# HMR 原理深入

深入理解热模块替换（Hot Module Replacement）的工作原理和实现。

---

## 📋 目录

1. [什么是 HMR](#什么是-hmr)
2. [为什么需要 HMR](#为什么需要-hmr)
3. [HMR 工作原理](#hmr-工作原理)
4. [WebSocket 通信](#websocket-通信)
5. [module.hot API](#modulehot-api)
6. [CSS HMR 实现](#css-hmr-实现)
7. [JS HMR 实现](#js-hmr-实现)
8. [React HMR 实现](#react-hmr-实现)
9. [HMR 失败降级](#hmr-失败降级)

---

## 什么是 HMR？

### 🎯 定义

**HMR（Hot Module Replacement，热模块替换）** 是一种在运行时替换、添加或删除模块的技术，无需完全刷新页面。

### 📊 对比

```
传统刷新（Live Reload）：
修改代码 → 编译 → 刷新整个页面
                    ↑ 慢 + 状态丢失

HMR（Hot Module Replacement）：
修改代码 → 编译 → 只替换变化的模块
                    ↑ 快 + 状态保持 ✅
```

---

## 为什么需要 HMR？

### 😫 没有 HMR 的痛点

```
场景：开发一个表单页面

1. 填写表单（输入了很多数据）
2. 修改样式
3. 页面刷新 ← 所有数据丢失！😱
4. 重新填写表单
5. 重复 2-4...
```

**痛点**：
- ❌ 状态丢失（表单数据、滚动位置等）
- ❌ 反馈慢（需要重新操作到之前的状态）
- ❌ 效率低（重复劳动）

---

### ✅ 使用 HMR 的优势

```
场景：开发一个表单页面

1. 填写表单（输入了很多数据）
2. 修改样式
3. 样式即时更新 ← 表单数据保持！✨
4. 继续开发
```

**优势**：
- ✅ 状态保持（表单数据不丢失）
- ✅ 反馈快（即时看到效果）
- ✅ 效率高（专注开发）
- ✅ 体验好（无缝更新）

---

## HMR 工作原理

### 🔄 完整流程图

```
┌─────────────────────────────────────────────────────────┐
│                     开发者                               │
└────────────────┬────────────────────────────────────────┘
                 │ 修改文件
                 ↓
┌─────────────────────────────────────────────────────────┐
│               Webpack (watch 模式)                       │
├─────────────────────────────────────────────────────────┤
│  1. 检测到文件变化                                        │
│  2. 重新编译变化的模块                                    │
│  3. 生成 update manifest (JSON)                         │
│     {                                                   │
│       h: "abc123",           // 新的 hash               │
│       c: { main: true },     // 更新的 chunk            │
│       m: [1, 2, 3]           // 更新的模块 ID            │
│     }                                                   │
│  4. 生成更新的模块代码                                    │
│     1.abc123.hot-update.js                              │
│     main.abc123.hot-update.json                         │
└────────────────┬────────────────────────────────────────┘
                 │ WebSocket 推送
                 ↓
┌─────────────────────────────────────────────────────────┐
│           webpack-dev-server                            │
├─────────────────────────────────────────────────────────┤
│  WebSocket Server                                       │
│    └─ 发送消息: { type: 'update', hash: 'abc123' }      │
└────────────────┬────────────────────────────────────────┘
                 │ WebSocket
                 ↓
┌─────────────────────────────────────────────────────────┐
│                  浏览器                                  │
├─────────────────────────────────────────────────────────┤
│  5. HMR Runtime (客户端代码)                             │
│     ├─ 接收 WebSocket 消息                               │
│     ├─ 发起 AJAX 请求下载更新                            │
│     │    GET /main.abc123.hot-update.json               │
│     │    GET /1.abc123.hot-update.js                    │
│     ├─ 对比新旧模块                                      │
│     ├─ 删除旧模块                                        │
│     ├─ 执行新模块代码                                     │
│     └─ 调用 module.hot.accept 回调                      │
│  6. 页面更新（无刷新）✅                                  │
└─────────────────────────────────────────────────────────┘
```

---

### 🔍 详细步骤

#### 步骤 1：文件监听

```javascript
// Webpack watch 模式
const compiler = webpack(config);

compiler.watch(
  { poll: 1000 },  // 轮询间隔
  (err, stats) => {
    console.log('文件变化，重新编译');
  }
);
```

---

#### 步骤 2：生成更新文件

```javascript
// 编译后生成：

// 1. manifest 文件
// main.abc123.hot-update.json
{
  "h": "def456",        // 新的 hash
  "c": {                // 更新的 chunk
    "main": true
  }
}

// 2. 更新的模块
// 1.abc123.hot-update.js
webpackHotUpdate("main", {
  1: (module, exports, require) => {
    // 新的模块代码
  }
});
```

---

#### 步骤 3：WebSocket 推送

```javascript
// 服务器端
io.emit('message', {
  type: 'update',
  hash: 'abc123'
});

// 浏览器端
socket.on('message', (data) => {
  if (data.type === 'update') {
    // 开始更新流程
    hotCheck(data.hash);
  }
});
```

---

#### 步骤 4：下载更新

```javascript
// HMR Runtime
function hotCheck(hash) {
  // 1. 下载 manifest
  fetch(`/main.${hash}.hot-update.json`)
    .then(res => res.json())
    .then(manifest => {
      // 2. 下载更新的模块
      const promises = manifest.c.map(chunkId => {
        return loadScript(`/${chunkId}.${hash}.hot-update.js`);
      });
      
      return Promise.all(promises);
    })
    .then(() => {
      // 3. 应用更新
      hotApply();
    });
}
```

---

#### 步骤 5：应用更新

```javascript
function hotApply() {
  // 1. 找出需要更新的模块
  const outdatedModules = findOutdatedModules();
  
  // 2. 删除旧模块
  outdatedModules.forEach(moduleId => {
    delete installedModules[moduleId];
  });
  
  // 3. 执行新模块
  outdatedModules.forEach(moduleId => {
    require(moduleId);
  });
  
  // 4. 调用 accept 回调
  outdatedModules.forEach(moduleId => {
    if (module.hot._acceptedDependencies[moduleId]) {
      module.hot._acceptedDependencies[moduleId]();
    }
  });
}
```

---

## WebSocket 通信

### 🔌 连接建立

```javascript
// 浏览器端（HMR Runtime）
const socket = new WebSocket('ws://localhost:8080/ws');

socket.onopen = () => {
  console.log('🔗 WebSocket 连接成功');
};

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  handleMessage(message);
};
```

---

### 📨 消息类型

```javascript
// 1. invalid - 开始编译
{
  type: 'invalid',
  timestamp: 1673520000000
}

// 2. hash - 新的 hash
{
  type: 'hash',
  data: 'abc123'
}

// 3. ok - 编译成功
{
  type: 'ok'
}

// 4. warnings - 编译警告
{
  type: 'warnings',
  data: [...]
}

// 5. errors - 编译错误
{
  type: 'errors',
  data: [...]
}

// 6. static-changed - 静态文件变化（刷新页面）
{
  type: 'static-changed'
}
```

---

### 🎬 完整通信流程

```
浏览器                     服务器
  │                          │
  │─────── WebSocket ────────▶│ 连接建立
  │                          │
  │                          │ 文件变化
  │                          │
  │◀───── invalid ───────────│ 开始编译
  │                          │
  │                          │ 编译中...
  │                          │
  │◀───── hash ──────────────│ 新 hash: abc123
  │                          │
  │◀───── ok ────────────────│ 编译成功
  │                          │
  │─── GET update.json ──────▶│ 请求更新信息
  │◀─── update.json ─────────│
  │                          │
  │─── GET update.js ────────▶│ 请求更新模块
  │◀─── update.js ───────────│
  │                          │
  │ 应用更新 ✅                │
```

---

## module.hot API

### 🎯 核心 API

```javascript
if (module.hot) {
  // 1. accept - 接受更新
  module.hot.accept();
  
  // 2. accept(依赖, 回调)
  module.hot.accept('./module.js', () => {
    console.log('module.js 已更新');
  });
  
  // 3. dispose - 清理
  module.hot.dispose((data) => {
    // 保存状态
    data.oldState = state;
  });
  
  // 4. decline - 拒绝更新
  module.hot.decline();
  
  // 5. status - 获取状态
  const status = module.hot.status();
  // 'idle' | 'check' | 'prepare' | 'ready' | 'dispose' | 'apply' | 'abort' | 'fail'
  
  // 6. addStatusHandler - 监听状态
  module.hot.addStatusHandler((status) => {
    console.log('HMR 状态:', status);
  });
}
```

---

### 📝 详细说明

#### 1. module.hot.accept()

```javascript
// 场景 1：接受当前模块的更新
if (module.hot) {
  module.hot.accept();  // 当前模块更新时，直接重新执行
}
```

```javascript
// 场景 2：接受依赖模块的更新
import render from './render.js';

render();

if (module.hot) {
  module.hot.accept('./render.js', () => {
    // render.js 更新时的回调
    console.log('render.js 已更新');
    render();  // 重新渲染
  });
}
```

```javascript
// 场景 3：接受多个依赖
if (module.hot) {
  module.hot.accept(
    ['./moduleA.js', './moduleB.js'],
    () => {
      console.log('模块已更新');
    }
  );
}
```

---

#### 2. module.hot.dispose()

```javascript
// 场景：清理副作用
let timer;

function start() {
  timer = setInterval(() => {
    console.log('tick');
  }, 1000);
}

start();

if (module.hot) {
  module.hot.dispose((data) => {
    // 清理定时器
    clearInterval(timer);
    
    // 保存状态（供新模块使用）
    data.count = count;
  });
  
  // 新模块中获取旧状态
  if (module.hot.data) {
    count = module.hot.data.count;
  }
}
```

---

#### 3. module.hot.decline()

```javascript
// 场景：拒绝 HMR，降级为刷新页面
if (module.hot) {
  module.hot.decline();  // 这个模块更新时，刷新页面
}
```

---

## CSS HMR 实现

### ✅ 自动支持

**好消息**：CSS 的 HMR 是**自动支持**的，不需要额外配置！

```javascript
// 只要使用了 style-loader
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']  // ✅ 自动支持 HMR
      }
    ]
  }
};
```

---

### 🔍 原理

```javascript
// style-loader 内部实现（简化版）
if (module.hot) {
  module.hot.accept();  // 接受自身更新
  
  module.hot.dispose(() => {
    // 移除旧样式
    removeStyle(styleElement);
  });
}

// 应用新样式
function applyStyles(css) {
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
}
```

---

### 🎬 实际效果

```
1. 修改 style.css
   .button { color: blue; }
   ↓
   .button { color: red; }

2. Webpack 重新编译

3. style-loader 接收更新
   ├─ 移除旧 <style> 标签
   └─ 插入新 <style> 标签

4. 页面样式即时更新 ✅
   └─ 无刷新
   └─ 状态保持
```

---

## JS HMR 实现

### ⚠️ 需要手动配置

**不同于 CSS**，JavaScript 的 HMR 需要手动实现。

### 📝 基础示例

```javascript
// render.js
export function render(data) {
  document.getElementById('app').innerHTML = `
    <h1>${data.title}</h1>
    <p>${data.content}</p>
  `;
}
```

```javascript
// main.js
import { render } from './render.js';

let data = {
  title: 'Hello',
  content: 'World'
};

render(data);

// ✅ 实现 HMR
if (module.hot) {
  module.hot.accept('./render.js', () => {
    // render.js 更新时，重新导入并渲染
    const { render: newRender } = require('./render.js');
    newRender(data);  // 使用旧数据重新渲染
  });
}
```

---

### 🎯 状态保持示例

```javascript
// counter.js
export class Counter {
  constructor(initialValue = 0) {
    this.value = initialValue;
  }
  
  increment() {
    this.value++;
    this.render();
  }
  
  render() {
    document.getElementById('app').innerHTML = `
      <div>
        <p>Count: ${this.value}</p>
        <button onclick="window.counter.increment()">+1</button>
      </div>
    `;
  }
}
```

```javascript
// main.js
import { Counter } from './counter.js';

let counter;

function init() {
  // 尝试恢复旧状态
  const oldValue = module.hot && module.hot.data
    ? module.hot.data.counterValue
    : 0;
  
  counter = new Counter(oldValue);
  counter.render();
  
  // 暴露到全局（供按钮点击）
  window.counter = counter;
}

init();

if (module.hot) {
  // 保存状态
  module.hot.dispose((data) => {
    data.counterValue = counter.value;
  });
  
  // 接受更新
  module.hot.accept('./counter.js', () => {
    init();  // 重新初始化
  });
}
```

**效果**：
```
1. 点击按钮，count: 5
2. 修改 Counter 类的样式
3. HMR 更新
4. count 依然是 5 ✅（状态保持）
```

---

## React HMR 实现

### 🚀 使用 React Refresh

**React Fast Refresh** 是 React 官方的 HMR 方案，零配置！

#### 1. 安装

```bash
npm install -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

#### 2. 配置

```javascript
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              require.resolve('react-refresh/babel')  // ✅ 添加插件
            ]
          }
        }
      }
    ]
  },
  
  plugins: [
    new ReactRefreshWebpackPlugin()  // ✅ 添加插件
  ]
};
```

---

### 📝 示例

```jsx
// App.jsx
import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        +1
      </button>
    </div>
  );
}
```

**效果**：
```
1. 点击按钮，count: 5
2. 修改组件（比如改变样式）
3. React Refresh 自动更新
4. count 依然是 5 ✅（状态保持）
5. 无需手动写 module.hot.accept ✅
```

---

### 🎯 React Refresh 的优势

| 特性 | 传统 HMR | React Refresh |
|------|---------|---------------|
| **配置** | 需要手动 | 自动 ✅ |
| **状态保持** | 需要手动实现 | 自动 ✅ |
| **组件级更新** | 整个模块 | 单个组件 ✅ |
| **错误恢复** | 需要刷新 | 自动恢复 ✅ |

---

## HMR 失败降级

### ⚠️ HMR 何时失败？

```
HMR 失败的场景：

1. 模块没有 accept
   └─ 冒泡到父模块
   └─ 一直冒泡到入口
   └─ 入口也没有 accept
   └─ 降级为刷新页面 ❌

2. accept 回调执行出错
   └─ HMR 中断
   └─ 降级为刷新页面 ❌

3. 循环依赖
   └─ HMR 无法处理
   └─ 降级为刷新页面 ❌
```

---

### 🔄 降级流程

```
1. 文件变化（例如：utils.js）
   ↓
2. Webpack 编译
   ↓
3. 推送更新
   ↓
4. HMR Runtime 检查
   ├─ utils.js 有 accept？
   │  └─ ✅ 是 → 应用 HMR
   └─ ❌ 否 → 检查父模块
      ├─ parent.js 有 accept('./utils.js')？
      │  └─ ✅ 是 → 应用 HMR
      └─ ❌ 否 → 继续向上冒泡
         └─ 到达入口 → 刷新页面 ❌
```

---

### 📝 示例

```javascript
// utils.js（没有 accept）
export function add(a, b) {
  return a + b;
}

// main.js（也没有 accept utils.js）
import { add } from './utils.js';

console.log(add(1, 2));

// 修改 utils.js → 刷新页面 ❌
```

**修复**：
```javascript
// main.js
import { add } from './utils.js';

console.log(add(1, 2));

if (module.hot) {
  module.hot.accept('./utils.js', () => {
    // utils.js 更新时的处理
    console.log('utils.js 已更新');
  });
}

// 修改 utils.js → HMR 更新 ✅
```

---

### 🎯 最佳实践

```javascript
// 1. 在入口文件接受所有更新（兜底）
if (module.hot) {
  module.hot.accept();  // 接受当前模块及所有依赖的更新
}

// 2. 关键模块单独处理
if (module.hot) {
  module.hot.accept('./App.js', () => {
    // App 更新时重新渲染
    render();
  });
}

// 3. 添加错误处理
if (module.hot) {
  module.hot.accept('./module.js', () => {
    try {
      // 更新逻辑
    } catch (error) {
      console.error('HMR 更新失败:', error);
      // 可以选择刷新页面
      window.location.reload();
    }
  });
}
```

---

## 📚 总结

### 核心要点

1. **HMR 是什么**
   - 运行时替换模块
   - 无需刷新页面
   - 状态保持

2. **工作原理**
   - Webpack watch 模式编译
   - WebSocket 推送更新
   - HMR Runtime 应用更新

3. **CSS vs JS**
   - CSS：自动支持 ✅
   - JS：需要手动实现 ⚠️
   - React：使用 React Refresh ✅

4. **失败降级**
   - 没有 accept → 冒泡
   - 到达入口 → 刷新页面
   - 添加兜底 accept

### 实用技巧

```javascript
// 1. CSS：无需配置
module: {
  rules: [
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']  // ✅ 自动 HMR
    }
  ]
}

// 2. JS：手动实现
if (module.hot) {
  module.hot.accept('./module.js', () => {
    // 更新回调
  });
}

// 3. React：使用 React Refresh
plugins: [
  new ReactRefreshWebpackPlugin()  // ✅ 自动 HMR
]

// 4. 兜底方案
if (module.hot) {
  module.hot.accept();  // 入口文件接受所有更新
}
```

---

下一步，继续学习：[代理配置详解](./03-proxy-config.md)

