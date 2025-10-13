# Demo 03: 代码分割策略对比

## 📖 Demo 说明

本 Demo 通过对比**单一 Bundle** 和**代码分割**两种构建方式，直观展示代码分割对首屏加载性能的提升。

**包含的代码分割策略**：
1. **路由级别懒加载**：每个页面单独打包
2. **Vendor 分离**：React、工具库等第三方代码单独打包
3. **运行时分离**：Webpack 运行时单独提取
4. **公共代码提取**：被多次引用的代码提取到 common chunk

## 🎯 学习目标

- 理解代码分割的多种策略
- 掌握 splitChunks 的配置
- 学会实现路由级别懒加载
- 对比分割前后的性能差异

## 🚀 运行步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

访问应用，切换不同页面，打开 Network 面板观察懒加载的 chunk 文件。

### 3. 自动对比（推荐）

```bash
npm run compare
```

**自动执行**：
1. 构建单一 Bundle 版本
2. 构建代码分割版本
3. 分析文件清单和体积
4. 输出详细对比报告

**典型输出**：

```
📦 代码分割效果对比

1️⃣  构建单一 Bundle（未分割）...
   ✅ 完成 - 耗时: 5.20s
   📦 总体积: 450.23 KB
   📄 文件数: 2 个

2️⃣  构建代码分割版本...
   ✅ 完成 - 耗时: 5.80s
   📦 总体积: 468.45 KB
   📄 文件数: 10 个

📊 详细对比:

首屏加载优化:
   单一 Bundle: 450.23 KB (全部加载)
   代码分割:    180.50 KB (初始加载)
   减少: 269.73 KB (59.9%)

缓存优化:
   ✅ react-vendors.js 长期稳定，缓存命中率高
   ✅ runtime.js 很小，变化时影响有限
   ✅ 业务代码修改时，第三方库无需重新下载

懒加载收益:
   懒加载文件: 4 个
   懒加载体积: 287.95 KB
   用户不访问相关页面，这部分代码不会下载
```

### 4. 手动构建

```bash
# 构建单一 Bundle
npm run build:single
# 查看 dist-single/

# 构建代码分割版本
npm run build:split
# 查看 dist-split/
```

## 🔍 配置详解

### 单一 Bundle 配置

```javascript
// webpack.single.config.js
optimization: {
  splitChunks: false,     // 不进行代码分割
  runtimeChunk: false     // 不提取运行时
}
```

**产物**：
```
dist-single/
├── main.abc123.js (450 KB)  ← 所有代码打包在一起
└── index.html
```

### 代码分割配置

```javascript
// webpack.split.config.js
optimization: {
  runtimeChunk: {
    name: 'runtime'  // 运行时单独提取
  },
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      // React 生态
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
        name: 'react-vendors',
        priority: 20
      },
      // 工具库
      utils: {
        test: /[\\/]node_modules[\\/](lodash-es|axios)[\\/]/,
        name: 'utils',
        priority: 15
      },
      // 其他第三方库
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10
      },
      // 公共代码
      common: {
        minChunks: 2,
        name: 'common',
        priority: 5
      }
    }
  }
}
```

**产物**：
```
dist-split/
├── runtime.xyz789.js (2 KB)           # Webpack 运行时
├── react-vendors.abc123.js (150 KB)   # React 相关（长期缓存）
├── utils.def456.js (8 KB)             # Lodash + Axios
├── main.ghi789.js (20 KB)             # 主入口代码
├── home.xxx.chunk.js (5 KB)           # 首页（懒加载）
├── dashboard.xxx.chunk.js (8 KB)      # 仪表盘（懒加载）
├── analytics.xxx.chunk.js (10 KB)     # 数据分析（懒加载）
├── heavy.xxx.chunk.js (265 KB)        # 大型组件（懒加载）
└── index.html
```

## 📊 懒加载实现

### React Router 懒加载

```javascript
// App.jsx
import { lazy, Suspense } from 'react';

// 懒加载页面组件
const Home = lazy(() => import(/* webpackChunkName: "home" */ './pages/Home'));
const Dashboard = lazy(() => import(/* webpackChunkName: "dashboard" */ './pages/Dashboard'));

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<Dashboard />} />
  </Routes>
</Suspense>
```

**Magic Comments（魔法注释）**：

```javascript
import(
  /* webpackChunkName: "my-chunk" */    // 指定 chunk 名称
  /* webpackPrefetch: true */           // 空闲时预加载
  /* webpackPreload: true */            // 与父 chunk 并行加载
  './module'
);
```

## 💡 代码分割策略

### 1. 按路由分割（最常用）

```javascript
// 每个路由一个 chunk
const Page1 = lazy(() => import('./Page1'));
const Page2 = lazy(() => import('./Page2'));
```

**适用场景**：
- ✅ 单页应用（SPA）
- ✅ 用户不一定访问所有页面
- ✅ 某些页面体积较大

### 2. 按功能模块分割

```javascript
// 大型功能懒加载
button.addEventListener('click', async () => {
  const { Chart } = await import('./chart');
  new Chart().render();
});
```

**适用场景**：
- ✅ 图表库（Echarts）
- ✅ 富文本编辑器
- ✅ PDF 导出功能
- ✅ 不常用的功能

### 3. 按第三方库分割

```javascript
splitChunks: {
  cacheGroups: {
    react: { ... },    // React 单独打包
    ui: { ... },       // UI 库单独打包
    utils: { ... }     // 工具库单独打包
  }
}
```

**适用场景**：
- ✅ 所有项目
- ✅ 第三方库体积大且稳定
- ✅ 提升长期缓存命中率

## 🎯 性能提升

| 指标 | 单一 Bundle | 代码分割 | 提升 |
|------|------------|---------|------|
| 首屏加载体积 | 450 KB | 180 KB | 60% |
| 首屏加载时间 | 3.0s | 1.2s | 60% |
| 缓存命中率 | 0% | 70% | - |
| 文件数量 | 2 个 | 10 个 | - |

## ⚠️ 注意事项

### 1. 不要过度分割

```javascript
// ❌ 错误：每个模块都分割
splitChunks: {
  minSize: 1000  // 1 KB 就分割
}

// ✅ 正确：合理的分割阈值
splitChunks: {
  minSize: 20000  // 20 KB 才分割
}
```

### 2. 控制 HTTP 请求数

```javascript
optimization: {
  splitChunks: {
    maxInitialRequests: 6,   // 限制初始请求数
    maxAsyncRequests: 30     // 限制异步请求数
  }
}
```

### 3. 预加载和预获取

```javascript
// 预获取（空闲时加载）
const Analytics = lazy(() => import(
  /* webpackPrefetch: true */
  './pages/Analytics'
));

// 预加载（与父 chunk 并行）
const Critical = lazy(() => import(
  /* webpackPreload: true */
  './pages/Critical'
));
```

## 📈 调试技巧

### 1. Chrome DevTools

```
Network 面板：
1. 刷新页面，查看初始加载的文件
2. 切换页面，观察懒加载的 chunk
3. 查看文件大小和加载时间
```

### 2. Webpack Bundle Analyzer

```bash
# 在 webpack.split.config.js 中添加
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

plugins: [
  new BundleAnalyzerPlugin()
]
```

### 3. React DevTools Profiler

```
1. 安装 React DevTools
2. 打开 Profiler 面板
3. 记录页面切换时的性能
4. 分析组件加载时间
```

## 🎓 延伸思考

### Q1: 为什么代码分割后总体积变大？

**答**：
- splitChunks 会增加少量模块包裹代码
- 运行时代码单独提取
- 但首屏加载体积显著减小（这才是关键）

### Q2: 如何确定最佳的分割策略？

**答**：
1. 分析用户访问路径（Google Analytics）
2. 识别大型依赖（Bundle Analyzer）
3. 按访问频率分割（高频 vs 低频）
4. 实际测试加载性能

### Q3: 代码分割对 SEO 有影响吗？

**答**：
- 对客户端渲染（CSR）影响较小
- 对服务端渲染（SSR）需要注意
- 使用预渲染或 SSG 可以解决

## 📚 相关资源

- [Webpack Code Splitting](https://webpack.js.org/guides/code-splitting/)
- [React Lazy Loading](https://reactjs.org/docs/code-splitting.html)
- [Web.dev - Code Splitting](https://web.dev/code-splitting/)

---

**下一步**：尝试在自己的项目中实现代码分割，体验性能提升！

