# Demo 2: HMR 深入演示

## 📖 学习目标

通过本 Demo，你将深入理解：

1. ✅ **React Fast Refresh**：组件热更新 + 状态保持
2. ✅ **CSS HMR**：样式无刷新更新
3. ✅ **Vanilla JS HMR**：使用 `module.hot` API 手动实现
4. ✅ **HMR 原理**：WebSocket 通信、模块替换机制
5. ✅ **HMR 最佳实践**：不同场景的优化策略

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

### 3. 构建生产版本

```bash
npm run build
```

---

## 📂 项目结构

```
02-hmr-demo/
├── src/
│   ├── index.html
│   ├── index.js                # 入口文件 + HMR API 演示
│   ├── App.jsx                 # React 根组件
│   ├── styles.css              # 全局样式
│   ├── vanilla-js-demo.js      # Vanilla JS HMR 演示
│   └── components/
│       ├── Counter.jsx         # 计数器组件
│       └── ColorBox.jsx        # 颜色选择器组件
├── webpack.config.js           # Webpack 配置（含 React Refresh）
├── .babelrc                    # Babel 配置
├── package.json
└── README.md
```

---

## 🎯 核心技术详解

### 1. React Fast Refresh

#### 什么是 React Fast Refresh？

React Fast Refresh 是 React 官方的 HMR 实现，相比传统的热更新：

| 特性 | 传统 HMR | React Fast Refresh |
|------|----------|-------------------|
| **状态保持** | ❌ 丢失 | ✅ 保留 |
| **Hooks 支持** | ⚠️ 不稳定 | ✅ 完美支持 |
| **错误恢复** | ❌ 需要刷新 | ✅ 自动恢复 |
| **可靠性** | ⚠️ 中等 | ✅ 高 |

#### 配置方法

```javascript
// webpack.config.js
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              isDev && require.resolve('react-refresh/babel')
            ].filter(Boolean)
          }
        }
      }
    ]
  },
  plugins: [
    isDev && new ReactRefreshWebpackPlugin()
  ].filter(Boolean)
};
```

```json
// .babelrc
{
  "presets": [
    "@babel/preset-env",
    ["@babel/preset-react", { "runtime": "automatic" }]
  ]
}
```

#### 使用注意事项

✅ **推荐做法**：
```javascript
// 具名导出组件
export default function Counter() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}
```

❌ **避免**：
```javascript
// 匿名函数（Fast Refresh 无法识别）
export default () => {
  // ...
}

// 箭头函数作为默认导出
export default props => <div>{props.text}</div>;
```

---

### 2. CSS HMR

#### 工作原理

```
CSS 文件修改
    ↓
Webpack 重新编译
    ↓
style-loader 接收更新
    ↓
查找对应的 <style> 标签
    ↓
替换 CSS 内容
    ↓
✅ 完成（无刷新）
```

#### 实现方式

`style-loader` 内置了 HMR 支持：

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']  // style-loader 自动处理 HMR
      }
    ]
  }
};
```

#### 开发 vs 生产

| 环境 | Loader | 结果 | HMR 支持 |
|------|--------|------|----------|
| **开发** | `style-loader` | 注入 `<style>` | ✅ 是 |
| **生产** | `MiniCssExtractPlugin.loader` | 提取 `.css` | ❌ 否 |

---

### 3. Vanilla JS HMR

#### module.hot API

```javascript
if (module.hot) {
  // 1. 接受当前模块的更新
  module.hot.accept();
  
  // 2. 接受特定模块的更新
  module.hot.accept('./module', () => {
    console.log('模块已更新');
  });
  
  // 3. 保存状态（更新前调用）
  module.hot.dispose(data => {
    data.count = currentCount;  // 保存到 data 对象
  });
  
  // 4. 恢复状态（更新后调用）
  const data = module.hot.data;
  if (data) {
    currentCount = data.count;  // 恢复状态
  }
  
  // 5. 监听 HMR 状态
  module.hot.addStatusHandler(status => {
    console.log('HMR 状态:', status);
  });
}
```

#### 完整示例

```javascript
// vanilla-js-demo.js
export const config = {
  title: '原生 JS 模块',
  count: 0
};

let currentCount = 0;

export function render() {
  document.getElementById('demo').innerHTML = `
    <h3>${config.title}</h3>
    <div>${currentCount}</div>
  `;
}

// HMR 处理
if (module.hot) {
  // 保存状态
  module.hot.dispose(data => {
    data.count = currentCount;
  });
  
  // 接受更新
  module.hot.accept(() => {
    // 恢复状态
    const data = module.hot.data;
    if (data) {
      currentCount = data.count;
    }
    
    // 重新渲染
    render();
  });
}
```

---

### 4. HMR 工作流程

#### 完整流程图

```
1. 文件监听
   ├─ Webpack 监听文件变化
   └─ 文件修改触发重新编译

2. 增量编译
   ├─ 只编译修改的模块
   └─ 生成 update manifest 和 update chunk

3. 推送更新
   ├─ WebSocket 通知客户端
   └─ 客户端请求 update chunk

4. 模块替换
   ├─ HMR Runtime 加载新模块
   ├─ 调用 module.hot.accept() 回调
   └─ 替换旧模块

5. 结果
   ├─ ✅ 成功：应用更新
   └─ ❌ 失败：自动刷新页面
```

#### WebSocket 通信

```javascript
// 客户端（浏览器）
const ws = new WebSocket('ws://localhost:8080/ws');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  
  switch (message.type) {
    case 'hash':
      // 保存新的编译 hash
      currentHash = message.data;
      break;
      
    case 'ok':
      // 编译成功，开始热更新
      reloadApp();
      break;
      
    case 'warnings':
      // 显示警告
      console.warn(message.data);
      break;
      
    case 'errors':
      // 显示错误覆盖层
      showErrorOverlay(message.data);
      break;
  }
};
```

#### Update Manifest

```json
// {hash}.hot-update.json
{
  "h": "abcdef123456",  // 新的 hash
  "c": {
    "main": true        // 需要更新的 chunk
  }
}
```

#### Update Chunk

```javascript
// main.{hash}.hot-update.js
webpackHotUpdate("main", {
  "./src/App.jsx": function(module, exports, __webpack_require__) {
    // 更新后的模块代码
  }
});
```

---

## 🔬 实验指南

### 实验 1：React 状态保持

**目标**：体验 React Fast Refresh 的状态保持能力

1. 启动 `npm run dev`
2. 点击计数器，增加到 **10**
3. 修改 `Counter.jsx` 的样式或文本

```jsx
// Counter.jsx
<h3>🔢 我的计数器</h3>  // 修改标题
```

4. 观察：
   - ✅ 标题立即更新
   - ✅ 计数器的值仍然是 **10**（状态保持）
   - ✅ 页面没有刷新

**原理**：React Fast Refresh 会：
1. 替换组件定义
2. 保留组件实例和 state
3. 重新渲染组件

---

### 实验 2：CSS 无刷新更新

**目标**：体验 CSS 热更新

1. 修改 `styles.css` 中的颜色

```css
.box-1 {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
}
```

2. 观察：
   - ✅ Box 1 的颜色立即改变
   - ✅ 没有任何闪烁
   - ✅ 页面状态完全保持

**在控制台看到**：
```
🎨 样式已更新
[HMR] Updated modules:
  - ./src/styles.css
```

---

### 实验 3：Vanilla JS HMR

**目标**：理解手动实现 HMR 的原理

1. 点击 Vanilla JS Demo 的计数器，增加到 **5**
2. 修改 `vanilla-js-demo.js` 的配置

```javascript
export const config = {
  title: '我的原生模块',  // 修改标题
  description: 'HMR 演示成功！',
  color: '#ff6b6b'  // 修改颜色
};
```

3. 观察控制台：
```
💾 保存状态: 5
✅ Vanilla JS 模块已更新
♻️ 恢复状态: 5
🛠️ Vanilla JS 模块已渲染，当前计数: 5
```

4. 观察页面：
   - ✅ 标题和描述更新
   - ✅ 计数器的值仍然是 **5**
   - ✅ 颜色也更新了

**关键代码**：
```javascript
if (module.hot) {
  // 保存状态
  module.hot.dispose(data => {
    data.count = currentCount;  // 关键：保存到 data
  });
  
  // 恢复状态
  module.hot.accept(() => {
    const data = module.hot.data;  // 关键：从 data 恢复
    if (data) {
      currentCount = data.count;
    }
    render();
  });
}
```

---

### 实验 4：HMR 失败降级

**目标**：观察 HMR 失败时的自动刷新机制

1. 制造语法错误

```javascript
// Counter.jsx
const test =   // 故意不完整
```

2. 观察：
   - ❌ 浏览器显示错误覆盖层
   - ⚠️ HMR 无法处理语法错误

3. 修复错误，观察自动恢复

**降级策略**：
```
HMR 尝试应用更新
    ↓
❌ 失败（语法错误、模块未 accept 等）
    ↓
⚠️ 降级为 Live Reload
    ↓
🔄 自动刷新页面
```

---

### 实验 5：监听 HMR 状态

**目标**：理解 HMR 的生命周期

1. 打开浏览器控制台
2. 修改任意文件
3. 观察状态变化：

```
📊 HMR 状态: idle
📊 HMR 状态: check
📊 HMR 状态: prepare
📊 HMR 状态: ready
📊 HMR 状态: dispose
📊 HMR 状态: apply
📊 HMR 状态: idle
```

**状态说明**：
- `idle`：等待文件变化
- `check`：检查更新
- `prepare`：准备应用更新
- `ready`：更新准备就绪
- `dispose`：清理旧模块
- `apply`：应用新模块
- `abort`/`fail`：更新失败

---

## 💡 HMR 最佳实践

### 1. React 组件

✅ **推荐**：
```javascript
// 具名函数
export default function MyComponent() {
  return <div>Hello</div>;
}

// 或者先定义再导出
function MyComponent() {
  return <div>Hello</div>;
}
export default MyComponent;
```

❌ **避免**：
```javascript
// 匿名箭头函数
export default () => <div>Hello</div>;

// 高阶组件包裹（可能丢失状态）
export default connect(mapStateToProps)(MyComponent);
```

### 2. CSS 样式

✅ **推荐**：
```javascript
// 开发环境：style-loader
{
  test: /\.css$/,
  use: ['style-loader', 'css-loader']
}

// 生产环境：提取 CSS
{
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, 'css-loader']
}
```

### 3. Vanilla JS 模块

✅ **推荐**：
```javascript
if (module.hot) {
  // 1. 清理副作用
  module.hot.dispose(() => {
    clearInterval(timer);  // 清理定时器
    element.removeEventListener('click', handler);  // 清理监听器
  });
  
  // 2. 保存状态
  module.hot.dispose(data => {
    data.state = getCurrentState();
  });
  
  // 3. 接受更新
  module.hot.accept(() => {
    restoreState(module.hot.data);
    reinitialize();
  });
}
```

### 4. 第三方库

❌ **避免对 node_modules 使用 HMR**：
```javascript
// webpack.config.js
module: {
  rules: [
    {
      test: /\.jsx?$/,
      exclude: /node_modules/,  // 排除第三方库
      use: 'babel-loader'
    }
  ]
}
```

✅ **使用 Externals 或 DLL**：
```javascript
externals: {
  react: 'React',
  'react-dom': 'ReactDOM'
}
```

---

## 🎓 知识点总结

### 1. HMR vs Live Reload

| 特性 | HMR | Live Reload |
|------|-----|-------------|
| **刷新方式** | 模块级替换 | 整页刷新 |
| **状态保持** | ✅ 保持 | ❌ 丢失 |
| **速度** | ⚡ 很快 | 🐢 较慢 |
| **用户体验** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |
| **实现复杂度** | 高 | 低 |

### 2. HMR 支持情况

| 类型 | HMR 支持 | 配置难度 | 说明 |
|------|----------|----------|------|
| **CSS** | ✅ 原生支持 | ⭐ 简单 | style-loader 内置 |
| **React** | ✅ Fast Refresh | ⭐⭐ 中等 | 需要插件 |
| **Vue** | ✅ Vue HMR | ⭐⭐ 中等 | vue-loader 内置 |
| **Vanilla JS** | ⚠️ 需手动实现 | ⭐⭐⭐ 复杂 | module.hot API |
| **TypeScript** | ✅ 支持 | ⭐⭐ 中等 | 同 JS |
| **Images** | ❌ 不支持 | - | 需要刷新 |

### 3. 性能对比

```
传统开发流程：
修改代码 → 保存 → 重新构建(5s) → 刷新页面(1s) → 重新操作(10s) = 16s

HMR 流程：
修改代码 → 保存 → 增量编译(0.5s) → 模块替换(0.1s) = 0.6s

效率提升：26倍！
```

---

## 🐛 常见问题

### 1. React 组件更新后状态丢失

**原因**：
- 使用了匿名函数
- 组件被高阶组件包裹
- Fast Refresh 未正确配置

**解决**：
```javascript
// ❌ 错误
export default () => <div>Hello</div>;

// ✅ 正确
export default function Hello() {
  return <div>Hello</div>;
}
```

### 2. CSS 更新需要刷新页面

**原因**：使用了 `MiniCssExtractPlugin.loader`

**解决**：
```javascript
// 开发环境用 style-loader
const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  }
};
```

### 3. module.hot 未定义

**原因**：生产环境不启用 HMR

**解决**：始终检查
```javascript
if (module.hot) {
  // HMR 代码
}
```

### 4. HMR 不工作

**检查清单**：
1. ✅ `devServer.hot: true` 已启用
2. ✅ `webpack.HotModuleReplacementPlugin` 已添加（或 `hot: true` 自动添加）
3. ✅ 没有使用 `[contenthash]`（开发环境不需要）
4. ✅ 模块调用了 `module.hot.accept()`

---

## 🔗 相关资源

- [Webpack HMR 官方文档](https://webpack.js.org/concepts/hot-module-replacement/)
- [React Fast Refresh 文档](https://github.com/pmmmwh/react-refresh-webpack-plugin)
- [module.hot API](https://webpack.js.org/api/hot-module-replacement/)
- 本项目文档：`../docs/02-hmr-principle.md`

---

## 🎯 下一步

完成本 Demo 后，继续学习：

- **Demo 3**：代理配置（解决跨域问题）
- **Demo 4**：多页面应用配置

掌握 HMR 后，你的开发效率将大幅提升！🚀

