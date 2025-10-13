# 并行构建：充分利用多核 CPU

## 📖 为什么需要并行构建？

### Node.js 的单线程限制

```
传统 Webpack 构建：

单线程 →  模块1 → 模块2 → 模块3 → ... → 模块3000
           ↓      ↓      ↓              ↓
          200ms  200ms  200ms         200ms

总耗时：3000 × 200ms = 600s (10分钟) 😫


并行构建（4核CPU）：

线程1 →  模块1 → 模块5 → 模块9  → ...
线程2 →  模块2 → 模块6 → 模块10 → ...
线程3 →  模块3 → 模块7 → 模块11 → ...
线程4 →  模块4 → 模块8 → 模块12 → ...

总耗时：3000 × 200ms ÷ 4 = 150s (2.5分钟) ⚡️
```

**理论加速比** = CPU 核心数

**实际加速比** = 40-60%（考虑线程开销）

---

## 🚀 thread-loader ⭐️⭐️⭐️

### 什么是 thread-loader？

将耗时的 loader 放在**独立的 Worker Pool** 中运行。

**原理**：

```
┌────────────────────────────────────┐
│         主线程（Main Thread）        │
├────────────────────────────────────┤
│  Webpack Core                      │
│    ↓                               │
│  发送任务到 Worker Pool             │
└────────────────────────────────────┘
         ↓
┌────────────────────────────────────┐
│     Worker Pool（多线程）           │
├────────────────────────────────────┤
│  Worker 1: babel-loader (模块1)    │
│  Worker 2: babel-loader (模块2)    │
│  Worker 3: babel-loader (模块3)    │
│  Worker 4: babel-loader (模块4)    │
└────────────────────────────────────┘
         ↓
    并行处理，返回结果
```

---

### 安装

```bash
npm install --save-dev thread-loader
```

---

### 基础配置

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          'thread-loader',  // ⭐️ 放在最前面
          'babel-loader'
        ],
        exclude: /node_modules/
      }
    ]
  }
};
```

**关键点**：
- ✅ thread-loader 要放在**最前面**（loader 从右到左执行）
- ✅ 只用于**耗时的 loader**（如 babel-loader, ts-loader）

---

### 完整配置（进阶）

```javascript
// webpack.config.js
const os = require('os');

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              // Worker 数量（默认：CPU 核心数 - 1）
              workers: os.cpus().length - 1,
              
              // Worker 并行任务数（默认：20）
              workerParallelJobs: 50,
              
              // Worker 超时时间（默认：500ms）
              poolTimeout: 2000,
              
              // 池子的大小（默认：500）
              poolParallelJobs: 200,
              
              // 池子的名称（用于不同规则共享池子）
              name: 'js-pool'
            }
          },
          'babel-loader'
        ],
        exclude: /node_modules/
      }
    ]
  }
};
```

---

### 预热 Worker Pool

Worker 启动有开销（~600ms），可以提前预热：

```javascript
// webpack.config.js
const threadLoader = require('thread-loader');

// ⭐️ 预热 Worker Pool
threadLoader.warmup(
  {
    workers: os.cpus().length - 1,
    poolTimeout: 2000,
  },
  [
    'babel-loader',
    // '@babel/preset-env',
  ]
);

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['thread-loader', 'babel-loader']
      }
    ]
  }
};
```

---

### 何时使用 thread-loader？

#### ✅ 适合的场景

```
1. 大型项目
   └─ 模块数量 > 1000

2. 耗时的 Loader
   └─ babel-loader (JS 转换)
   └─ ts-loader (TS 编译)
   └─ sass-loader (Sass 编译)

3. 构建时间 > 60s
   └─ 有足够的优化空间
```

#### ❌ 不适合的场景

```
1. 小型项目
   └─ 模块数量 < 500
   └─ Worker 启动开销 > 收益

2. 快速的 Loader
   └─ 单个模块处理时间 < 50ms
   └─ 线程通信开销 > 收益

3. 开发环境（可选）
   └─ 热更新时，Worker 启动有延迟
   └─ 可以只在生产构建时使用
```

---

### 实战效果

#### 项目背景

```
├─ 模块数量：~2500
├─ 技术栈：React + Babel
├─ 主要瓶颈：babel-loader
└─ 单线程构建时间：120s
```

#### 配置对比

**配置 1：单线程**

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'
      }
    ]
  }
};
```

**配置 2：多线程（4 核 CPU）**

```javascript
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'thread-loader',
            options: {
              workers: 3  // CPU 核心数 - 1
            }
          },
          'babel-loader'
        ]
      }
    ]
  }
};
```

#### 数据对比

```
┌─────────────────┬──────────┬──────────┬──────────┐
│     场景         │  单线程   │ 多线程   │  提升    │
├─────────────────┼──────────┼──────────┼──────────┤
│ 首次构建         │  120s    │   70s    │  -42%   │
│ 二次构建（无缓存）│  120s    │   70s    │  -42%   │
│ 二次构建（有缓存）│   15s    │   15s    │   0%    │
└─────────────────┴──────────┴──────────┴──────────┘

结论：
  ├─ 无缓存时：提升 40-60% ⚡️⚡️
  ├─ 有缓存时：无提升（缓存已经足够快）
  └─ 建议：缓存 + 并行 结合使用
```

---

## ⚙️ TerserPlugin 并行压缩 ⭐️⭐️

### 什么是 TerserPlugin？

Webpack 5 内置的 JS 压缩插件（基于 Terser）。

**压缩过程很耗时**：

```
生产构建：
  ├─ 编译阶段：60s
  └─ 压缩阶段：40s  ← ⚠️ 占比 40%
```

---

### 启用并行压缩

```javascript
// webpack.config.js
const TerserPlugin = require('terser-webpack-plugin');

module.exports = {
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,  // ⭐️ 启用并行压缩（默认为 true）
        // parallel: 4,  // 指定并行数量
        
        terserOptions: {
          compress: {
            drop_console: true,  // 移除 console
          }
        }
      })
    ]
  }
};
```

**默认行为**：
- Webpack 5：`parallel: true`（默认启用）
- 并行数量：`os.cpus().length - 1`

---

### 实战效果

```
项目背景：
  └─ 打包体积：5 MB（未压缩）

配置对比：

单线程压缩：
  └─ 压缩时间：45s

并行压缩（4核）：
  └─ 压缩时间：28s（-38%）⚡️

结论：
  └─ 压缩阶段提升 30-50%
```

---

## 🔄 HappyPack（已废弃）

### 了解历史

**HappyPack** 是 Webpack 3/4 时代的并行构建方案。

**为什么废弃**？
1. thread-loader 是官方推荐方案
2. 维护不活跃（最后更新：2019年）
3. Webpack 5 性能已大幅提升

**仅供参考**（不推荐使用）。

---

## 📊 并行优化策略

### 完整配置（生产级）

```javascript
// webpack.config.js
const os = require('os');
const threadLoader = require('thread-loader');
const TerserPlugin = require('terser-webpack-plugin');

// 预热 Worker Pool
threadLoader.warmup(
  {
    workers: os.cpus().length - 1,
  },
  ['babel-loader']
);

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            // ⚠️ 只在生产环境使用 thread-loader
            isProd && {
              loader: 'thread-loader',
              options: {
                workers: os.cpus().length - 1,
                workerParallelJobs: 50,
              }
            },
            'babel-loader'
          ].filter(Boolean),
          exclude: /node_modules/
        }
      ]
    },
    
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          parallel: true,  // 并行压缩
          terserOptions: {
            compress: {
              drop_console: true,
            }
          }
        })
      ]
    }
  };
};
```

---

### 开发 vs 生产

| 配置 | 开发环境 | 生产环境 |
|------|---------|---------|
| **thread-loader** | ❌ 不推荐（热更新有延迟） | ✅ 推荐 |
| **并行压缩** | ❌ 不需要（不压缩） | ✅ 必须 |
| **Worker 数量** | - | CPU 核心数 - 1 |

---

## 🐛 常见问题

### 问题 1：thread-loader 反而变慢了？

**原因**：Worker 启动开销 > 收益

**解决方案**：
```javascript
// 只在大型项目或生产环境使用
const isProd = process.env.NODE_ENV === 'production';
const moduleCount = 1000;  // 假设模块数量

use: [
  // 只有模块数量 > 1000 且是生产环境才使用
  (moduleCount > 1000 && isProd) && {
    loader: 'thread-loader'
  },
  'babel-loader'
].filter(Boolean)
```

---

### 问题 2：Worker 数量如何配置？

**推荐配置**：

```javascript
const os = require('os');

// 方式 1：CPU 核心数 - 1（推荐）
workers: os.cpus().length - 1

// 方式 2：固定数量
workers: 4

// 方式 3：根据环境动态调整
workers: process.env.CI ? 2 : os.cpus().length - 1
```

**原则**：
- ✅ 留一个核心给主线程
- ✅ CI 环境可能需要限制（避免资源竞争）

---

### 问题 3：哪些 Loader 适合并行？

**适合**：
```javascript
✅ babel-loader    // JS 转换（耗时）
✅ ts-loader       // TS 编译（耗时）
✅ sass-loader     // Sass 编译（耗时）
✅ less-loader     // Less 编译（耗时）
```

**不适合**：
```javascript
❌ file-loader     // 文件拷贝（很快）
❌ url-loader      // Base64 转换（很快）
❌ cache-loader    // 缓存操作（IO 密集）
❌ eslint-loader   // 代码检查（已有并行方案）
```

---

## 🎓 面试攻防

### 问题 1：thread-loader 的原理是什么？

**标准回答**：

```
原理：
1. 创建 Worker Pool
   └─ 使用 Node.js 的 worker_threads

2. 主线程分发任务
   └─ 将 Loader 任务发送到 Worker

3. Worker 并行处理
   └─ 每个 Worker 独立执行 Loader

4. 结果返回主线程
   └─ 通过消息通信返回结果

优势：
  ├─ 充分利用多核 CPU
  └─ 提升 40-60% 构建速度

开销：
  ├─ Worker 启动时间（~600ms）
  ├─ 线程间通信成本
  └─ 内存占用增加
```

---

### 问题 2：何时使用 thread-loader？

**判断标准**：

```
使用条件（同时满足）：
1. 大型项目
   └─ 模块数量 > 1000

2. 耗时 Loader
   └─ babel-loader, ts-loader

3. 构建时间长
   └─ 总构建时间 > 60s

不使用条件：
1. 小型项目
   └─ Worker 启动开销 > 收益

2. 已有缓存优化
   └─ 缓存效果已经足够好

3. 开发环境
   └─ 热更新有延迟
```

**数据支撑**：
"我们项目有 2500 个模块，babel-loader 占用 120s，使用 thread-loader 后减少到 70s，提升了 42%。"

---

### 问题 3：并行构建和缓存哪个更重要？

**优先级**：

```
P0（最高）：缓存
  └─ filesystem cache
  └─ babel-loader cache
  └─ 效果：-90%+ ⚡️⚡️⚡️

P1（次要）：并行构建
  └─ thread-loader
  └─ TerserPlugin parallel
  └─ 效果：-40-60% ⚡️⚡️

结论：
  └─ 缓存 > 并行
  └─ 但两者结合效果最好
```

**案例**：

```
只有缓存：
  ├─ 首次：180s
  └─ 二次：15s（-92%）

只有并行：
  ├─ 首次：70s（-61%）
  └─ 二次：70s（无提升）

缓存 + 并行：
  ├─ 首次：70s（-61%）
  └─ 二次：12s（-93%）⚡️⚡️⚡️
```

---

## 📝 实践建议

### 1. 渐进式优化

```
优化顺序：
1. 启用缓存（filesystem cache）
   └─ 效果最好，成本最低

2. 测量效果
   └─ 如果二次构建已经 < 30s，可以不用并行

3. 考虑并行
   └─ 如果首次构建仍然很慢，加上 thread-loader

4. 验证效果
   └─ 对比单线程 vs 多线程
```

### 2. 配置模板

```javascript
// webpack.config.js（生产级配置）
const os = require('os');
const threadLoader = require('thread-loader');
const TerserPlugin = require('terser-webpack-plugin');

// 预热
threadLoader.warmup(
  { workers: os.cpus().length - 1 },
  ['babel-loader']
);

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  
  return {
    cache: {
      type: 'filesystem',  // ⭐️ 优先：缓存
    },
    
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            isProd && {  // ⭐️ 次要：并行（仅生产）
              loader: 'thread-loader',
              options: {
                workers: os.cpus().length - 1
              }
            },
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true  // ⭐️ babel 缓存
              }
            }
          ].filter(Boolean)
        }
      ]
    },
    
    optimization: {
      minimize: isProd,
      minimizer: [
        new TerserPlugin({
          parallel: true  // ⭐️ 并行压缩
        })
      ]
    }
  };
};
```

---

## 🚀 下一步

现在你已经掌握了**并行构建优化**：
- ✅ 理解多线程原理
- ✅ 掌握 thread-loader 使用
- ✅ 掌握 TerserPlugin 并行压缩
- ✅ 知道何时使用并行构建

**构建速度提升 40-60%！** ⚡️⚡️

**下一步**：学习预编译优化 - [04-dll-externals.md](./04-dll-externals.md) 🚀

