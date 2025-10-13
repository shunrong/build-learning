# Demo 03: 并行构建优化

## 📖 学习目标

理解并行构建的原理，掌握 thread-loader 的使用，明白何时使用并行优化。

---

## ⚙️ 核心概念

### Node.js 的单线程限制

```
传统 Webpack 构建：
  主线程 → 模块1 → 模块2 → 模块3 → ...
           (串行执行，无法利用多核 CPU)

并行构建：
  Worker 1 → 模块1
  Worker 2 → 模块2  (同时执行，充分利用 CPU)
  Worker 3 → 模块3
  Worker 4 → 模块4
```

**效果**：理论加速比 = CPU 核心数，实际加速比 = 1.4-1.6x

---

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

---

## 📊 对比实验

### 实验 1：单线程 vs 并行（首次构建）

#### Step 1: 单线程构建

```bash
time npm run build:single
```

**记录时间**：___ 秒

---

#### Step 2: 并行构建

```bash
time npm run build:parallel
```

**记录时间**：___ 秒

**预期效果**：快 **40-60%** ⚡️⚡️

---

### 实验 2：有缓存的情况

#### Step 1: 单线程（二次构建）

```bash
time npm run build:single:cached
```

**记录时间**：___ 秒

---

#### Step 2: 并行（二次构建）

```bash
time npm run build:parallel:cached
```

**记录时间**：___ 秒

**预期效果**：差不多（缓存已经很快了）

---

### 实验 3: 查看系统信息

```bash
npm run compare
```

这会显示：
- CPU 核心数
- 使用的 Worker 数量
- 预期效果对比
- 原理解析

---

## 📈 数据记录表

| 场景 | 单线程 | 并行 | 提升 |
|------|--------|------|------|
| 首次构建（无缓存） | ___s | ___s | ___% |
| 二次构建（有缓存） | ___s | ___s | ___% |

---

## 🔧 配置对比

### 单线程配置

```javascript
// webpack.single.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader'  // ❌ 单线程处理
      }
    ]
  },
  
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: false  // ❌ 单线程压缩
      })
    ]
  }
};
```

---

### 并行配置 ⭐️

```javascript
// webpack.parallel.config.js
const os = require('os');
const threadLoader = require('thread-loader');

// ⭐️ 预热 Worker Pool
threadLoader.warmup(
  { workers: os.cpus().length - 1 },
  ['babel-loader']
);

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          // ⭐️ thread-loader（并行）
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length - 1,
              workerParallelJobs: 50,
              poolTimeout: 2000,
            }
          },
          'babel-loader'
        ]
      }
    ]
  },
  
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true  // ⭐️ 并行压缩
      })
    ]
  }
};
```

---

## 🔍 深入理解

### 1. thread-loader 的工作原理

```
主线程（Main Thread）
  ↓
创建 Worker Pool
  ↓
┌─────────────────────────────┐
│ Worker Pool                 │
├─────────────────────────────┤
│ Worker 1: babel-loader(文件1)│
│ Worker 2: babel-loader(文件2)│
│ Worker 3: babel-loader(文件3)│
│ Worker 4: babel-loader(文件4)│
└─────────────────────────────┘
  ↓
并行处理，返回结果
  ↓
主线程收集结果
```

---

### 2. Worker Pool 预热

```javascript
threadLoader.warmup(
  { workers: 3 },
  ['babel-loader']
);
```

**作用**：
- 提前启动 Worker（避免首次使用时的启动延迟）
- Worker 启动需要 ~600ms
- 预热后可以立即使用

---

### 3. 并行压缩（TerserPlugin）

```javascript
new TerserPlugin({
  parallel: true,  // 自动检测 CPU 核心数
  // parallel: 4,  // 或手动指定
})
```

**效果**：
- 压缩阶段提升 30-50%
- Webpack 5 默认启用

---

## 💡 关键知识点

### 1. 何时使用 thread-loader？

#### ✅ 适合的场景

```
1. 大型项目
   └─ 模块数量 > 1000

2. 耗时的 Loader
   └─ babel-loader（JS 转换）
   └─ ts-loader（TS 编译）
   └─ sass-loader（Sass 编译）

3. 构建时间长
   └─ 总构建时间 > 60s
```

---

#### ❌ 不适合的场景

```
1. 小型项目
   └─ 模块数量 < 500
   └─ Worker 启动开销 > 收益

2. 已有缓存优化
   └─ 缓存已经很快了
   └─ 并行优势不明显

3. 开发环境
   └─ 热更新有延迟
   └─ Worker 启动影响体验
```

---

### 2. Worker 数量配置

```javascript
// 推荐：CPU 核心数 - 1
workers: os.cpus().length - 1

// 为什么 -1？
// 留一个核心给主线程
```

**不同 CPU 的效果**：

| CPU 核心数 | Worker 数量 | 理论加速 | 实际加速 |
|-----------|------------|---------|---------|
| 2 核 | 1 | 2x | 1.2x |
| 4 核 | 3 | 4x | 1.5x |
| 8 核 | 7 | 8x | 1.8x |

**实际加速比 < 理论值**的原因：
- Worker 启动开销
- 线程间通信成本
- 任务分配不均

---

### 3. 开销分析

```
启动开销：
  └─ 每个 Worker 启动：~600ms
  └─ 3 个 Worker：~1800ms

内存开销：
  └─ 每个 Worker：~50MB
  └─ 3 个 Worker：~150MB

通信开销：
  └─ 主线程 ↔ Worker：序列化/反序列化
```

**小项目的问题**：

```
小项目（500 模块）：
  总构建时间：5s
  Worker 启动：1.8s
  并行构建：3.5s（启动 + 1.7s 实际构建）
  
  结论：没有提升 ❌
```

---

## 🎯 实战技巧

### 技巧 1：只在生产环境使用

```javascript
module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';
  
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          use: [
            // ⭐️ 只在生产环境使用 thread-loader
            isProd && {
              loader: 'thread-loader',
              options: {
                workers: os.cpus().length - 1
              }
            },
            'babel-loader'
          ].filter(Boolean)
        }
      ]
    }
  };
};
```

---

### 技巧 2：预热优化

```javascript
// 在配置文件顶部预热
const threadLoader = require('thread-loader');

threadLoader.warmup(
  {
    workers: os.cpus().length - 1,
    poolTimeout: 2000,
  },
  [
    'babel-loader',
    // 'sass-loader',  // 可以预热多个 loader
  ]
);
```

---

### 技巧 3：CI/CD 环境限制

```javascript
// CI 环境可能需要限制 Worker 数量
const workers = process.env.CI 
  ? 2  // CI 环境限制为 2
  : os.cpus().length - 1;  // 本地环境全速

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'thread-loader',
            options: { workers }
          },
          'babel-loader'
        ]
      }
    ]
  }
};
```

---

## 📊 性能对比案例

### 小型项目（~500 模块）

```
单线程：5s
并行：5.5s（反而慢了 ❌）

原因：Worker 启动开销 > 收益
```

---

### 中型项目（~1500 模块）

```
单线程：30s
并行：20s（-33% ⚡️）

效果：开始有明显提升
```

---

### 大型项目（~3000 模块）

```
单线程：120s
并行：70s（-42% ⚡️⚡️）

效果：提升显著
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
   └─ 每个 Worker 独立执行

4. 结果返回
   └─ 通过消息通信返回结果

优势：
  └─ 充分利用多核 CPU

开销：
  ├─ Worker 启动时间（~600ms）
  ├─ 线程间通信成本
  └─ 内存占用增加

适用场景：
  └─ 大型项目（> 1000 模块）
```

---

### 问题 2：何时使用 thread-loader？

**判断标准**：

```
使用条件（同时满足）：
1. 大型项目（> 1000 模块）
2. 耗时 Loader（babel-loader, ts-loader）
3. 构建时间长（> 60s）

不使用条件：
1. 小型项目（Worker 开销大）
2. 已有缓存（缓存更快）
3. 开发环境（热更新有延迟）
```

**数据支撑**：
"我们项目有 3000 个模块，babel-loader 占 120s，使用 thread-loader 后减少到 70s，提升了 42%。"

---

### 问题 3：并行构建和缓存哪个更重要？

**优先级对比**：

```
缓存优化：
  └─ 二次构建 -90%+ ⚡️⚡️⚡️
  └─ P0（最高优先级）

并行构建：
  └─ 首次构建 -40-60% ⚡️⚡️
  └─ P2（次要）

结论：
  ├─ 缓存 > 并行
  ├─ 优先做缓存优化
  └─ 大型项目再考虑并行
```

---

## 📝 实验报告模板

```markdown
## 并行构建实验报告

### 系统信息
- CPU 核心数：___
- Worker 数量：___
- 操作系统：___

### 实验数据

| 场景 | 单线程 | 并行 | 提升 |
|------|--------|------|------|
| 首次构建 | ___s | ___s | ___% |
| 二次构建 | ___s | ___s | ___% |

### 分析

1. 首次构建效果：
   - 是否提升明显？
   - 符合预期吗？

2. 二次构建效果：
   - 缓存是否生效？
   - 并行是否还有优势？

3. 结论：
   - 是否值得使用 thread-loader？
   - 推荐配置是什么？
```

---

## 🚀 下一步

现在你已经理解了**并行构建优化**：
- ✅ 理解多线程原理
- ✅ 掌握 thread-loader 配置
- ✅ 知道何时使用并行
- ✅ 首次构建 -40-60% ⚡️⚡️

**关键发现**：
- 缓存 > 并行
- 优先使用缓存
- 大型项目再考虑并行

**下一个 Demo**：DLL 和 Externals - `../04-dll-externals/`

---

## 📚 相关文档

- [03-parallel-build.md](../../docs/03-parallel-build.md) - 并行构建详细文档

