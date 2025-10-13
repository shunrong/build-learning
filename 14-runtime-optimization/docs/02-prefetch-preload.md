# Prefetch 和 Preload 资源预加载

## 📖 什么是资源预加载

**资源预加载**是在浏览器空闲时提前加载未来可能需要的资源，从而提升用户体验。

### 两种预加载方式

| 特性 | Preload | Prefetch |
|------|---------|----------|
| **加载时机** | 当前页面立即加载 | 浏览器空闲时加载 |
| **优先级** | 高优先级 | 低优先级 |
| **使用场景** | 当前页面必需的资源 | 未来页面可能需要的资源 |
| **典型例子** | 字体、关键CSS | 下一页的JS、图片 |

## 🚀 Preload - 预加载

### 基本用法

```html
<!-- 预加载字体 -->
<link rel="preload" href="font.woff2" as="font" type="font/woff2" crossorigin>

<!-- 预加载关键 CSS -->
<link rel="preload" href="critical.css" as="style">

<!-- 预加载关键图片 -->
<link rel="preload" href="hero.jpg" as="image">

<!-- 预加载 JavaScript -->
<link rel="preload" href="bundle.js" as="script">
```

### Webpack Magic Comments

```javascript
// Preload 模块
import(/* webpackPreload: true */ './CriticalComponent');
```

生成的 HTML：

```html
<link rel="preload" as="script" href="CriticalComponent.chunk.js">
<script src="CriticalComponent.chunk.js"></script>
```

### 使用场景

**1. 字体预加载**（最常用）

```html
<link 
  rel="preload" 
  href="/fonts/myfont.woff2" 
  as="font" 
  type="font/woff2" 
  crossorigin
>
```

**为什么需要 preload 字体？**
- 字体文件通常在 CSS 中引用
- 浏览器解析 CSS 后才发现需要字体
- Preload 可以提前加载，避免 FOIT/FOUT

**2. 关键渲染路径资源**

```html
<!-- 预加载首屏背景图 -->
<link rel="preload" href="hero-bg.jpg" as="image">

<!-- 预加载关键 CSS -->
<link rel="preload" href="critical.css" as="style">
```

**3. 动态导入的关键组件**

```javascript
// Modal 可能会立即打开，使用 preload
const Modal = lazy(() => 
  import(/* webpackPreload: true */ './Modal')
);
```

### Preload 原理

```
页面加载流程：
1. HTML 解析
2. 发现 <link rel="preload">
3. 立即以高优先级下载资源
4. 资源下载完成，缓存起来
5. 后续需要时，直接从缓存读取
```

### 注意事项

**⚠️ 不要滥用 Preload**

```html
<!-- ❌ 错误：预加载过多资源 -->
<link rel="preload" href="file1.js" as="script">
<link rel="preload" href="file2.js" as="script">
<link rel="preload" href="file3.js" as="script">
<link rel="preload" href="file4.js" as="script">
<link rel="preload" href="file5.js" as="script">
```

**问题**：
- 占用带宽
- 延迟其他资源加载
- 可能降低性能

**✅ 正确：只预加载关键资源**

```html
<link rel="preload" href="critical-font.woff2" as="font" crossorigin>
<link rel="preload" href="hero-image.jpg" as="image">
```

## 📡 Prefetch - 预获取

### 基本用法

```html
<!-- 预获取下一页的资源 -->
<link rel="prefetch" href="/next-page.js">
<link rel="prefetch" href="/next-page.css">
```

### Webpack Magic Comments

```javascript
// Prefetch 模块（推荐）
import(/* webpackPrefetch: true */ './NextPage');
```

生成的 HTML：

```html
<link rel="prefetch" as="script" href="NextPage.chunk.js">
```

### 使用场景

**1. 路由预获取**

```javascript
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  useEffect(() => {
    // 在首页时，预获取其他页面
    if (location.pathname === '/') {
      import(/* webpackPrefetch: true */ './pages/About');
      import(/* webpackPrefetch: true */ './pages/Dashboard');
    }
  }, [location]);

  return <Routes>...</Routes>;
}
```

**2. 交互预获取**

```javascript
function ProductCard({ product }) {
  return (
    <div 
      onMouseEnter={() => {
        // 鼠标悬停时预获取详情页
        import(/* webpackPrefetch: true */ './ProductDetail');
      }}
    >
      <Link to={`/product/${product.id}`}>
        {product.name}
      </Link>
    </div>
  );
}
```

**3. 低优先级资源**

```javascript
// 页面加载后，预获取图表库
useEffect(() => {
  setTimeout(() => {
    import(/* webpackPrefetch: true */ 'echarts');
  }, 2000);
}, []);
```

### Prefetch 原理

```
页面加载流程：
1. 页面加载完成
2. 浏览器空闲时
3. 以低优先级下载 prefetch 资源
4. 资源下载完成，缓存起来
5. 未来需要时，直接从缓存读取
```

### 动态 Prefetch

```javascript
function usePrefetch(loader) {
  useEffect(() => {
    // 页面加载后 3 秒，预获取资源
    const timer = setTimeout(() => {
      loader();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
}

// 使用
function App() {
  usePrefetch(() => import('./HeavyComponent'));
  return <div>...</div>;
}
```

## 🔄 Preload vs Prefetch 对比

### 加载时机对比

```
时间线：
0s       HTML 加载
1s       CSS 解析
2s       JavaScript 执行
3s       页面渲染完成
4s       浏览器空闲
         ↓
Preload: 在 0-3s 期间加载（高优先级）
Prefetch: 在 4s 之后加载（低优先级）
```

### 优先级对比

**Chrome DevTools - Network**：

```
Priority 列：
Preload:  Highest / High
Prefetch: Lowest / Idle
```

### 使用场景对比

**Preload**：
```javascript
// 当前页面立即需要的资源
const Modal = lazy(() => 
  import(/* webpackPreload: true */ './Modal')
);

// 用户点击按钮后立即打开 Modal
<button onClick={() => setShowModal(true)}>
  打开
</button>
```

**Prefetch**：
```javascript
// 未来可能需要的资源
const NextPage = lazy(() => 
  import(/* webpackPrefetch: true */ './NextPage')
);

// 用户可能会点击链接跳转
<Link to="/next">下一页</Link>
```

## 🎯 最佳实践

### 1. Preload 字体（强烈推荐）

```html
<head>
  <!-- 预加载自定义字体 -->
  <link 
    rel="preload" 
    href="/fonts/custom-font.woff2" 
    as="font" 
    type="font/woff2" 
    crossorigin
  >
</head>
```

**收益**：
- 避免 FOIT (Flash of Invisible Text)
- 避免 FOUT (Flash of Unstyled Text)
- 首屏渲染更快

### 2. Prefetch 路由（强烈推荐）

```javascript
// 根据用户行为预测
function App() {
  return (
    <div>
      <Link 
        to="/dashboard"
        onMouseEnter={() => {
          // 鼠标悬停时预获取
          import(/* webpackPrefetch: true */ './Dashboard');
        }}
      >
        仪表盘
      </Link>
    </div>
  );
}
```

**收益**：
- 路由切换几乎无延迟
- 用户体验显著提升

### 3. 智能预获取

```javascript
function useSmartPrefetch(routes) {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    // 分析用户行为，预测下一步
    const nextRoute = predictNextRoute(location, history);
    
    if (nextRoute) {
      // 预获取最可能访问的路由
      routes[nextRoute].load();
    }
  }, [location]);
}
```

### 4. 避免重复预加载

```javascript
const prefetched = new Set();

function prefetchOnce(loader) {
  const key = loader.toString();
  if (!prefetched.has(key)) {
    prefetched.add(key);
    loader();
  }
}

// 使用
prefetchOnce(() => import('./Module'));
```

## 📊 性能对比

### 场景：字体加载

**未使用 Preload**：
```
0s    - HTML 加载
0.5s  - CSS 加载
1.0s  - CSS 解析，发现需要字体
1.1s  - 开始下载字体
1.8s  - 字体加载完成，文字显示  ← FOIT 持续 0.8s
```

**使用 Preload**：
```
0s    - HTML 加载，发现 preload
0s    - 开始下载字体（并行）
0.7s  - 字体加载完成，缓存
1.0s  - CSS 解析，字体已在缓存
1.0s  - 文字立即显示  ← 无 FOIT
```

**提升**：首屏文字显示提前 0.8s

### 场景：路由切换

**未使用 Prefetch**：
```
用户点击链接
↓
开始下载路由代码 (500ms)
↓
执行代码 (100ms)
↓
渲染页面
总计：600ms
```

**使用 Prefetch**：
```
鼠标悬停时预获取 (后台完成)
↓
用户点击链接
↓
代码已在缓存，立即执行 (100ms)
↓
渲染页面
总计：100ms
```

**提升**：路由切换快 500ms（83%）

## 🔧 Webpack 配置

### 自动 Prefetch

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          prefetch: true  // 自动 prefetch vendor chunk
        }
      }
    }
  }
};
```

### 禁用 Prefetch

```javascript
// 某些情况下可能需要禁用
module.exports = {
  performance: {
    hints: 'warning',
    maxAssetSize: 250000,
    maxEntrypointSize: 250000
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
    splitChunks: false
  }
};
```

## 💡 常见问题

### Q1: Prefetch 会影响当前页面性能吗？

**答**：不会，因为：
- Prefetch 在浏览器**空闲时**执行
- 优先级**最低**
- 不会阻塞当前页面资源加载

### Q2: Preload 的资源一定会被使用吗？

**答**：应该确保使用，否则：
- 浪费带宽
- Chrome 会警告：`The resource was preloaded using link preload but not used within a few seconds`

**解决**：只 preload 确定会用的资源

### Q3: 如何验证 Prefetch/Preload 生效？

**Chrome DevTools - Network**：
1. 打开 Network 面板
2. 查看 Priority 列
3. Preload 资源显示 High/Highest
4. Prefetch 资源显示 Lowest
5. 查看 Size 列，如果显示 `(prefetch cache)` 说明命中缓存

## 🎓 面试高频问题

### Q1: Preload 和 Prefetch 的区别？

**答**：

| 维度 | Preload | Prefetch |
|------|---------|----------|
| 时机 | 立即加载 | 空闲时加载 |
| 优先级 | 高 | 低 |
| 场景 | 当前页面必需 | 未来页面可能需要 |
| 例子 | 字体、关键图片 | 下一页JS |

### Q2: 什么时候使用 Preload？

**答**：

1. **字体文件**（最常见）
2. **关键路径资源**（首屏必需的图片/CSS）
3. **立即需要的异步模块**

### Q3: Prefetch 的最佳实践？

**答**：

1. **路由预获取**：鼠标悬停时预获取
2. **行为预测**：基于用户行为预测下一步
3. **低优先级资源**：不影响当前页面的资源
4. **避免过度**：只预获取高概率使用的资源

---

**下一步**：学习 Module Federation，构建微前端架构！

