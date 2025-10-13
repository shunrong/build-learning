# 代码分割最佳实践

## 📖 概述

**代码分割（Code Splitting）** 是优化应用加载性能的关键技术，通过将代码拆分成多个 chunk，实现**按需加载**和**并行加载**，显著提升首屏加载速度。

**核心思想**：
```
不要一次性加载所有代码 → 只加载当前需要的代码 → 其他代码按需懒加载
```

**本文目标**：
- 理解代码分割的原理和收益
- 掌握三种代码分割方式
- 精通 splitChunks 配置
- 学会实现最佳的分割策略

## 🎯 为什么需要代码分割？

### 问题场景

**单一 Bundle 的问题**：

```
首次访问网站：
├─ 下载 main.js (2 MB)
│  ├─ React/Vue 框架 (300 KB)
│  ├─ 路由库 (50 KB)
│  ├─ 工具库 Lodash (70 KB)
│  ├─ 图表库 Echarts (800 KB)  ← 用户可能不会访问图表页
│  ├─ 富文本编辑器 (500 KB)    ← 用户可能不会编辑
│  └─ 业务代码 (280 KB)
├─ 等待时间: 5-10s（3G 网络）
└─ 用户体验: 😡 太慢了，离开网站
```

**代码分割后**：

```
首次访问网站：
├─ 下载 runtime.js (2 KB)      # Webpack 运行时
├─ 下载 react.js (150 KB)      # React 框架（缓存）
├─ 下载 vendors.js (120 KB)    # 公共库（缓存）
├─ 下载 main.js (50 KB)        # 首页代码
├─ 总计: 322 KB
├─ 等待时间: 1-2s
└─ 用户体验: 😊 很快！

访问图表页时：
├─ 复用缓存: react.js, vendors.js
├─ 懒加载: chart.js (800 KB)  # 只在需要时加载
└─ 等待时间: 0.5s（仅加载新代码）
```

### 收益分析

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| 首屏加载体积 | 2 MB | 322 KB | **84%** |
| 首屏加载时间 | 8s | 1.5s | **81%** |
| 缓存命中率 | 0% | 70% | - |
| 用户留存率 | 60% | 85% | **+25%** |

**关键数据**：
- 首屏加载时间每减少 1s，转化率提升 7%
- 用户期望的页面加载时间是 2s 以内
- 超过 3s，53% 的用户会离开

## 🔍 代码分割的三种方式

### 1. 入口分割（Entry Points）

**原理**：手动配置多个入口，Webpack 为每个入口生成独立的 Bundle。

**配置**：

```javascript
// webpack.config.js
module.exports = {
  entry: {
    index: './src/index.js',
    admin: './src/admin.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
```

**产物**：

```
dist/
├── index.bundle.js  # 首页代码
└── admin.bundle.js  # 后台代码
```

**适用场景**：
- ✅ 多页应用（MPA）
- ✅ 完全独立的功能模块
- ❌ 单页应用（SPA）- 有更好的方案

**缺点**：
- ⚠️ 共享的依赖会被重复打包
- ⚠️ 需要手动管理入口

**示例**：

```javascript
// 问题：lodash 被重复打包
// index.js
import _ from 'lodash';
console.log(_.join(['Index', 'Page'], ' '));

// admin.js
import _ from 'lodash';
console.log(_.join(['Admin', 'Page'], ' '));

// 结果：index.bundle.js 和 admin.bundle.js 都包含完整的 lodash (70 KB)
// 总体积: 140 KB（重复）
```

### 2. 动态导入（Dynamic Import）

**原理**：使用 `import()` 语法，按需懒加载模块。

**基础用法**：

```javascript
// 静态导入 - 立即加载
import { add } from './math';

// 动态导入 - 懒加载
button.addEventListener('click', async () => {
  const { add } = await import(/* webpackChunkName: "math" */ './math');
  console.log(add(1, 2));
});
```

**React 中的使用**：

```javascript
import React, { lazy, Suspense } from 'react';

// 懒加载组件
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analytics" element={<Analytics />} />
      </Routes>
    </Suspense>
  );
}
```

**Vue 中的使用**：

```javascript
// Vue Router 懒加载
const router = new VueRouter({
  routes: [
    {
      path: '/dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ './views/Dashboard.vue')
    },
    {
      path: '/analytics',
      component: () => import(/* webpackChunkName: "analytics" */ './views/Analytics.vue')
    }
  ]
});
```

**Magic Comments（魔法注释）**：

```javascript
// 指定 chunk 名称
import(/* webpackChunkName: "my-chunk" */ './module');

// 预加载（空闲时加载）
import(/* webpackPrefetch: true */ './module');

// 预载入（与父 chunk 并行加载）
import(/* webpackPreload: true */ './module');

// 组合使用
import(
  /* webpackChunkName: "chart" */
  /* webpackPrefetch: true */
  './chart'
);
```

**适用场景**：
- ✅ 路由级别懒加载（最常用）
- ✅ 大型组件（图表、富文本编辑器）
- ✅ 条件功能（弹窗、表单验证）
- ✅ 不常用功能（导出 PDF、打印）

### 3. splitChunks（推荐）⭐

**原理**：自动分析模块依赖，提取公共代码到独立的 chunk。

**默认配置**：

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'async',          // 'all' | 'async' | 'initial'
      minSize: 20000,           // 最小体积（字节）
      minRemainingSize: 0,      // 确保拆分后剩余的最小体积
      minChunks: 1,             // 最少被引用次数
      maxAsyncRequests: 30,     // 最大异步请求数
      maxInitialRequests: 30,   // 最大初始请求数
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }
  }
};
```

**生产环境最佳配置**：

```javascript
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',  // ← 关键：对所有 chunk 生效
      cacheGroups: {
        // React 相关
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react',
          priority: 20,
          reuseExistingChunk: true
        },
        // Ant Design / Element UI 等 UI 库
        ui: {
          test: /[\\/]node_modules[\\/](antd|@ant-design|element-ui)[\\/]/,
          name: 'ui',
          priority: 15,
          reuseExistingChunk: true
        },
        // 其他第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true
        },
        // 公共业务代码
        common: {
          minChunks: 2,           // 至少被 2 个 chunk 引用
          name: 'common',
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    // 运行时代码单独提取
    runtimeChunk: {
      name: 'runtime'
    }
  }
};
```

**产物示例**：

```
dist/
├── runtime.abc123.js          # Webpack 运行时 (2 KB)
├── react.def456.js            # React 相关 (150 KB) ← 长期缓存
├── ui.ghi789.js               # UI 库 (300 KB)       ← 长期缓存
├── vendors.jkl012.js          # 其他第三方库 (200 KB)
├── common.mno345.js           # 公共业务代码 (50 KB)
├── main.pqr678.js             # 首页代码 (30 KB)
├── dashboard.stu901.chunk.js  # Dashboard 页面 (40 KB) ← 懒加载
└── analytics.vwx234.chunk.js  # Analytics 页面 (35 KB) ← 懒加载
```

## ⚙️ splitChunks 配置详解

### chunks 选项

控制哪些 chunk 参与分割：

```javascript
splitChunks: {
  // 1. 'async'（默认）- 只分割异步加载的 chunk
  chunks: 'async',
  // 适用：懒加载的路由、组件
  // 优点：减少首屏体积
  // 缺点：初始加载的公共代码会重复

  // 2. 'initial' - 只分割初始加载的 chunk
  chunks: 'initial',
  // 适用：多入口应用
  // 优点：提取公共依赖
  // 缺点：异步 chunk 可能重复

  // 3. 'all'（推荐）- 分割所有 chunk
  chunks: 'all',
  // 适用：所有场景
  // 优点：最大化代码复用
  // 缺点：可能产生过多 chunk（需优化）
}
```

### cacheGroups 详解

**priority（优先级）**：

```javascript
splitChunks: {
  cacheGroups: {
    react: {
      test: /[\\/]node_modules[\\/]react/,
      priority: 20  // 优先级最高
    },
    vendor: {
      test: /[\\/]node_modules[\\/]/,
      priority: 10  // 优先级中等
    },
    default: {
      priority: -20  // 优先级最低（默认组）
    }
  }
}
```

**工作原理**：
1. 模块匹配多个 cacheGroup
2. 优先选择 priority 最高的
3. 将模块分配到该组

**示例**：

```javascript
// react-dom 同时匹配 react 和 vendor
// ✅ priority: 20 > 10，分配到 react 组
// ❌ 不会分配到 vendor 组
```

**test（匹配规则）**：

```javascript
cacheGroups: {
  // 1. 正则表达式（最常用）
  vendor: {
    test: /[\\/]node_modules[\\/]/
  },

  // 2. 函数（灵活控制）
  bigModules: {
    test(module) {
      // 提取大于 100 KB 的模块
      return module.size() > 100000;
    }
  },

  // 3. 字符串（匹配文件路径）
  styles: {
    test: /\.css$/
  }
}
```

**reuseExistingChunk（复用已存在的 chunk）**：

```javascript
splitChunks: {
  cacheGroups: {
    vendor: {
      test: /[\\/]node_modules[\\/]/,
      reuseExistingChunk: true  // ← 关键：避免重复打包
    }
  }
}
```

**工作原理**：

```javascript
// moduleA.js
import React from 'react';

// moduleB.js
import React from 'react';

// 如果 reuseExistingChunk: true
// ✅ React 只打包一次，moduleA 和 moduleB 共享

// 如果 reuseExistingChunk: false
// ❌ React 可能被打包两次
```

## 📊 最佳实践策略

### 策略1：框架分离（最常用）

```javascript
splitChunks: {
  chunks: 'all',
  cacheGroups: {
    // React 生态
    react: {
      test: /[\\/]node_modules[\\/](react|react-dom|react-router|react-router-dom|redux|react-redux)[\\/]/,
      name: 'react-vendors',
      priority: 20
    },
    // Vue 生态
    vue: {
      test: /[\\/]node_modules[\\/](vue|vuex|vue-router|@vue)[\\/]/,
      name: 'vue-vendors',
      priority: 20
    }
  }
}
```

**收益**：
- React/Vue 长期稳定，缓存命中率高
- 更新业务代码时，用户无需重新下载框架

### 策略2：UI 库分离

```javascript
cacheGroups: {
  ui: {
    test: /[\\/]node_modules[\\/](antd|@ant-design|element-ui|@element-plus)[\\/]/,
    name: 'ui-lib',
    priority: 15
  }
}
```

### 策略3：工具库分离

```javascript
cacheGroups: {
  utils: {
    test: /[\\/]node_modules[\\/](lodash|lodash-es|moment|dayjs|axios)[\\/]/,
    name: 'utils',
    priority: 12
  }
}
```

### 策略4：按体积分割

```javascript
cacheGroups: {
  largeModules: {
    test(module) {
      return module.size() > 200000;  // 超过 200 KB
    },
    name(module) {
      // 动态命名
      const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
      return `large-${packageName.replace('@', '')}`;
    },
    priority: 25
  }
}
```

### 策略5：公共代码提取

```javascript
cacheGroups: {
  common: {
    minChunks: 2,  // 至少被 2 个 chunk 使用
    name: 'common',
    priority: 5,
    reuseExistingChunk: true
  }
}
```

## 🎯 实战案例

### 案例1：电商项目优化

**项目特点**：
- React + Ant Design
- 首页、商品列表、商品详情、购物车、订单
- 图表库（仅在统计页使用）

**优化前**：

```
dist/
└── main.js (2.5 MB)
    ├── React (150 KB)
    ├── Ant Design (500 KB)
    ├── Echarts (800 KB)
    ├── Lodash (70 KB)
    └── 业务代码 (980 KB)

首屏加载: 2.5 MB
加载时间: 8s (3G 网络)
```

**优化后**：

```javascript
// webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
        name: 'react',
        priority: 20
      },
      antd: {
        test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
        name: 'antd',
        priority: 15
      },
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10
      }
    }
  },
  runtimeChunk: 'single'
}

// 懒加载图表
const Statistics = lazy(() => import(/* webpackChunkName: "statistics" */ './Statistics'));
```

**产物**：

```
dist/
├── runtime.js (2 KB)
├── react.js (150 KB)         ← 长期缓存
├── antd.js (500 KB)          ← 长期缓存
├── vendors.js (70 KB)        ← 长期缓存
├── main.js (300 KB)          ← 首屏代码
└── statistics.chunk.js (850 KB)  ← 懒加载

首屏加载: 1.02 MB (减少 59%)
加载时间: 3s (提升 62%)
```

### 案例2：后台管理系统

**优化策略**：

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    maxInitialRequests: 6,  // 允许更多初始请求（后台系统网络较好）
    cacheGroups: {
      // Vue 生态
      vue: {
        test: /[\\/]node_modules[\\/](vue|vuex|vue-router)[\\/]/,
        name: 'vue',
        priority: 20
      },
      // Element UI
      elementUI: {
        test: /[\\/]node_modules[\\/]element-ui[\\/]/,
        name: 'element-ui',
        priority: 15
      },
      // 图表库
      charts: {
        test: /[\\/]node_modules[\\/](echarts|@antv)[\\/]/,
        name: 'charts',
        priority: 12
      },
      // 其他第三方库
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10
      },
      // 公共组件
      components: {
        test: /[\\/]src[\\/]components[\\/]/,
        name: 'components',
        minChunks: 2,
        priority: 8
      }
    }
  }
}
```

## ⚠️ 注意事项

### 1. 避免过度分割

**问题**：

```javascript
// ❌ 过度分割
splitChunks: {
  minSize: 1000,  // 1 KB 就分割
  maxSize: 50000  // 超过 50 KB 就拆分
}

// 产物：100+ 个小 chunk
// 问题：HTTP 请求过多，反而变慢
```

**建议**：

```javascript
// ✅ 合理分割
splitChunks: {
  minSize: 20000,   // 至少 20 KB 才分割
  maxSize: 244000,  // 超过 244 KB 才考虑拆分
  maxInitialRequests: 6  // 限制初始请求数
}
```

### 2. 控制 chunk 数量

**HTTP/2 前**：
- 请求数过多会严重影响性能
- 建议：3-6 个初始 chunk

**HTTP/2 后**：
- 支持多路复用，请求数影响较小
- 建议：可以适当增加到 10-15 个

### 3. 长期缓存优化

```javascript
output: {
  filename: '[name].[contenthash:8].js',
  chunkFilename: '[name].[contenthash:8].chunk.js'
},
optimization: {
  runtimeChunk: 'single',  // 运行时代码单独提取
  moduleIds: 'deterministic'  // 固定模块 ID
}
```

### 4. 预加载和预获取

```javascript
// 预获取（prefetch）- 空闲时加载
import(/* webpackPrefetch: true */ './future-module');

// 预加载（preload）- 与父 chunk 并行加载
import(/* webpackPreload: true */ './critical-module');
```

**区别**：

| 特性 | Prefetch | Preload |
|------|----------|---------|
| 加载时机 | 空闲时 | 立即 |
| 优先级 | 低 | 高 |
| 使用场景 | 未来可能用到 | 当前页面必需 |
| 生成标签 | `<link rel="prefetch">` | `<link rel="preload">` |

## 📈 效果评估

### 关键指标

1. **First Contentful Paint (FCP)**
   - 首次内容绘制时间
   - 目标：< 1.8s

2. **Largest Contentful Paint (LCP)**
   - 最大内容绘制时间
   - 目标：< 2.5s

3. **Total Blocking Time (TBT)**
   - 总阻塞时间
   - 目标：< 200ms

4. **Time to Interactive (TTI)**
   - 可交互时间
   - 目标：< 3.8s

### 使用 Lighthouse 评估

```bash
# 全局安装
npm install -g lighthouse

# 分析网站
lighthouse https://your-site.com --view
```

## 🔗 下一步

掌握了代码分割后，接下来学习：

👉 [04-compression.md](./04-compression.md) - 压缩优化全解析

---

**记住**：代码分割是性能优化的基石，合理的分割策略能显著提升用户体验！

