# Module Federation 微前端架构

## 📖 什么是 Module Federation

**Module Federation（模块联邦）**是 Webpack 5 引入的革命性特性，允许：

> 多个独立的 Webpack 构建可以在运行时共享代码，无需重新打包。

### 核心概念

**传统方式**：
```
App A ──────┐
            ├──> 打包 ──> Bundle (包含所有依赖)
App B ──────┘
```

**Module Federation**：
```
App A (Host) ──> 独立打包 ──> Bundle A
                               ↓ 运行时加载
App B (Remote) ─> 独立打包 ──> Bundle B (暴露模块)
```

### 解决的问题

1. **依赖重复**
   - 多个应用独立打包，React 等库被重复打包
   - 用户需要下载多份相同的代码

2. **版本不一致**
   - 不同应用使用不同版本的依赖
   - 难以统一管理

3. **部署复杂**
   - 多个应用需要协调部署
   - 一个应用更新，所有应用都需要重新构建

4. **团队协作**
   - 多个团队开发不同模块
   - 难以独立开发和部署

## 🏗️ 核心概念

### 1. Host（宿主应用）

**加载和消费**其他应用的模块。

```javascript
// webpack.config.js (Host)
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        app1: 'app1@http://localhost:3001/remoteEntry.js',
        app2: 'app2@http://localhost:3002/remoteEntry.js'
      },
      shared: ['react', 'react-dom']
    })
  ]
};
```

### 2. Remote（远程应用）

**暴露**模块给其他应用使用。

```javascript
// webpack.config.js (Remote)
module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'app1',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/Button',
        './Header': './src/Header'
      },
      shared: ['react', 'react-dom']
    })
  ]
};
```

### 3. Shared（共享依赖）

在多个应用之间**共享**公共依赖。

```javascript
shared: {
  react: {
    singleton: true,      // 只加载一次
    requiredVersion: '^18.0.0',
    eager: false         // 异步加载
  },
  'react-dom': {
    singleton: true,
    requiredVersion: '^18.0.0'
  }
}
```

## 🚀 基础示例

### Remote 应用（提供者）

```javascript
// remote-app/webpack.config.js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  name: 'remote',
  filename: 'remoteEntry.js',
  
  plugins: [
    new ModuleFederationPlugin({
      name: 'remoteApp',
      filename: 'remoteEntry.js',
      exposes: {
        './Button': './src/components/Button',
        './utils': './src/utils'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};
```

```javascript
// remote-app/src/components/Button.jsx
export default function Button({ children, onClick }) {
  return (
    <button onClick={onClick}>
      {children}
    </button>
  );
}
```

### Host 应用（消费者）

```javascript
// host-app/webpack.config.js
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'hostApp',
      remotes: {
        remote: 'remoteApp@http://localhost:3001/remoteEntry.js'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
};
```

```javascript
// host-app/src/App.jsx
import React, { Suspense, lazy } from 'react';

// 加载远程组件
const RemoteButton = lazy(() => import('remote/Button'));

function App() {
  return (
    <div>
      <h1>Host App</h1>
      <Suspense fallback="Loading Button...">
        <RemoteButton onClick={() => alert('Clicked!')}>
          Remote Button
        </RemoteButton>
      </Suspense>
    </div>
  );
}
```

## 🔧 高级配置

### 共享依赖策略

```javascript
shared: {
  // 方式1：简单配置
  react: { singleton: true },
  
  // 方式2：详细配置
  lodash: {
    singleton: true,        // 单例模式
    requiredVersion: '^4.17.0',  // 版本要求
    strictVersion: false,   // 不严格版本检查
    eager: false,           // 非 eager 加载
    shareKey: 'lodash',     // 共享键名
    shareScope: 'default'   // 共享作用域
  },
  
  // 方式3：版本自动提取
  'package.json': {
    singleton: true,
    requiredVersion: false  // 从 package.json 读取
  }
}
```

### 动态Remote

```javascript
// host/src/App.jsx
import { useState } from 'react';

function App() {
  const [Component, setComponent] = useState(null);

  const loadRemote = async (url, module) => {
    // 动态加载 remote
    const container = await import(/* webpackIgnore: true */ url);
    await container.init(__webpack_share_scopes__.default);
    const factory = await container.get(module);
    const Module = factory();
    setComponent(() => Module.default);
  };

  return (
    <div>
      <button onClick={() => 
        loadRemote('http://localhost:3001/remoteEntry.js', './Button')
      }>
        加载远程组件
      </button>
      {Component && <Component />}
    </div>
  );
}
```

### 版本管理

```javascript
// 自动检测版本冲突
shared: {
  react: {
    singleton: true,
    requiredVersion: '^18.0.0',
    strictVersion: true  // 严格版本检查
  }
}
```

**版本冲突处理**：
- Host 要求：React 18.2.0
- Remote 提供：React 18.1.0

如果 `strictVersion: true`，会报错。
如果 `strictVersion: false`，使用 Host 的版本。

## 📊 实际应用场景

### 场景1：大型应用拆分

```
Main App (Host)
├── Header  (Remote A)
├── Sidebar (Remote B)
├── Content (Remote C)
└── Footer  (Remote D)
```

**优势**：
- 各模块独立开发
- 独立部署更新
- 团队并行开发

### 场景2：组件库共享

```
设计系统 (Remote)
└── 暴露组件：Button, Input, Modal...

应用A (Host) ──┐
应用B (Host) ──┼──> 使用设计系统组件
应用C (Host) ──┘
```

**优势**：
- 统一 UI 风格
- 组件库独立更新
- 应用无需重新构建

### 场景3：微前端架构

```
主应用 (Shell)
├── 用户中心 (Remote - Team A)
├── 商品管理 (Remote - Team B)
└── 订单系统 (Remote - Team C)
```

**优势**：
- 团队独立开发
- 技术栈可以不同
- 独立部署上线

## ⚠️ 注意事项

### 1. 类型安全

```typescript
// 生成类型定义
// remote-app/src/types.d.ts
declare module 'remote/Button' {
  export default function Button(props: ButtonProps): JSX.Element;
}

// host-app 使用
import Button from 'remote/Button';  // 有类型提示
```

### 2. 错误处理

```javascript
import React, { Suspense, lazy } from 'react';
import ErrorBoundary from './ErrorBoundary';

const RemoteComponent = lazy(() =>
  import('remote/Component').catch(() => ({
    default: () => <div>远程模块加载失败</div>
  }))
);

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback="Loading...">
        <RemoteComponent />
      </Suspense>
    </ErrorBoundary>
  );
}
```

### 3. 性能优化

```javascript
// 预加载远程模块
useEffect(() => {
  // 页面加载后预加载
  import('remote/HeavyComponent');
}, []);
```

### 4. 安全性

```javascript
// 验证远程来源
const ALLOWED_REMOTES = [
  'https://app1.example.com',
  'https://app2.example.com'
];

function loadRemote(url) {
  const origin = new URL(url).origin;
  if (!ALLOWED_REMOTES.includes(origin)) {
    throw new Error('Untrusted remote');
  }
  return import(/* webpackIgnore: true */ url);
}
```

## 💡 vs 其他微前端方案

### Module Federation vs iframe

| 特性 | Module Federation | iframe |
|------|-------------------|--------|
| 隔离性 | JS 隔离 | 完全隔离 |
| 性能 | 高 | 较低 |
| 共享依赖 | 支持 | 不支持 |
| 通信 | 简单 | postMessage |
| SEO | 友好 | 不友好 |

### Module Federation vs single-spa

| 特性 | Module Federation | single-spa |
|------|-------------------|------------|
| 配置 | Webpack配置 | JS 配置 |
| 依赖共享 | 自动 | 手动 |
| 学习曲线 | 低 | 中等 |
| 灵活性 | 中等 | 高 |

## 🎓 面试高频问题

### Q1: Module Federation 的原理是什么？

**答**：

1. **构建阶段**：
   - Remote 打包时生成 `remoteEntry.js`
   - 包含模块映射和加载逻辑

2. **运行时**：
   ```javascript
   // Host 加载 Remote
   1. 加载 remoteEntry.js
   2. 初始化共享作用域
   3. 按需加载远程模块
   4. 执行模块代码
   ```

3. **依赖共享**：
   ```javascript
   // Host 和 Remote 共享 React
   1. Host 加载 React 18.2.0
   2. Remote 检测 Host 已有 React
   3. Remote 使用 Host 的 React（不重复加载）
   ```

### Q2: 如何处理版本冲突？

**答**：

1. **singleton: true**：强制单例
2. **requiredVersion**：指定版本范围
3. **strictVersion**：严格版本检查
4. **fallback**：版本不匹配时的降级方案

### Q3: Module Federation 的优势？

**答**：

1. **独立部署**：Remote 更新不影响 Host
2. **依赖共享**：避免重复加载
3. **技术栈灵活**：可以混用不同版本
4. **团队协作**：多团队并行开发

---

**下一步**：学习运行时性能监控，完善性能优化体系！

