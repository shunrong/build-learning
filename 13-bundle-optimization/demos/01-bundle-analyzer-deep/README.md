# Demo 01: Bundle 深度分析

## 📖 Demo 说明

本 Demo 演示如何使用 **webpack-bundle-analyzer** 深度分析 Bundle 组成，定位体积过大的原因，并提出优化方案。

**刻意制造的"问题"**：
- ❌ 完整导入 Lodash (70 KB)
- ❌ 完整导入 Moment.js (280 KB，包含所有 locale)
- ❌ 导入 Axios (13 KB)
- ❌ 未进行代码分割

**目的**：通过分析工具直观看到这些问题对 Bundle 体积的影响。

## 🎯 学习目标

- 掌握 webpack-bundle-analyzer 的使用
- 学会分析 Bundle 的组成
- 识别体积过大的模块
- 提出针对性的优化方案

## 🚀 运行步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 构建项目

```bash
npm run build
```

查看构建产物：

```
dist/
├── main.abc123.js        # Bundle 文件
└── index.html
```

### 3. 生成分析报告（重点）

```bash
npm run analyze
```

**执行后会**：
1. 构建项目
2. 生成 `dist/bundle-report.html`（可视化报告）
3. 生成 `dist/stats.json`（详细数据）
4. 自动在浏览器中打开分析报告

### 4. 分析报告

打开 `dist/bundle-report.html`，你会看到：

```
┌─────────────────────────────────────────────────────┐
│ Bundle Report (Total: ~500 KB parsed)              │
│                                                     │
│ ┌─────────────────┐  ┌──────────┐                 │
│ │  Moment.js      │  │ Lodash   │                 │
│ │  280 KB         │  │ 70 KB    │                 │
│ │                 │  └──────────┘                 │
│ │  ┌────────┐     │                               │
│ │  │locales │     │  ┌─────────────┐             │
│ │  │200 KB  │     │  │ React +     │             │
│ │  └────────┘     │  │ ReactDOM    │             │
│ └─────────────────┘  │ 150 KB      │             │
│                      └─────────────┘             │
└─────────────────────────────────────────────────────┘
```

## 🔍 如何分析

### 第一步：查看总体积

关注右上角的总体积：

```
Stat: 1.2 MB    // 原始代码体积
Parsed: 500 KB  // 压缩后体积（重点关注）
Gzip: 120 KB    // Gzip 压缩后体积
```

### 第二步：定位大模块

查找面积最大的方块（即体积最大的模块）：

1. **Moment.js (280 KB)** ← 最大
   - 点击查看详情
   - 发现包含了所有语言文件（`locale/`）
   - **问题**：实际只用了中文，但打包了全部语言

2. **Lodash (70 KB)**
   - 完整导入了整个库
   - **问题**：实际只用了 `range`, `random`, `sample`, `debounce` 等几个方法

3. **React + ReactDOM (150 KB)**
   - 核心依赖，无法避免
   - **优化方向**：代码分割，单独打包并长期缓存

4. **Axios (13 KB)**
   - 相对较小
   - **评估**：是否真的需要 Axios 的高级特性？简单场景可用 Fetch API

### 第三步：制定优化方案

| 模块 | 当前体积 | 优化方案 | 预期体积 | 减少 |
|------|---------|---------|---------|------|
| Moment.js | 280 KB | 替换为 Day.js | 2 KB | 278 KB |
| Lodash | 70 KB | 按需导入或 lodash-es | 5 KB | 65 KB |
| Axios | 13 KB | 评估是否必需 | 0/13 KB | 0-13 KB |
| React/ReactDOM | 150 KB | 代码分割 | 150 KB | 0 |
| **总计** | **513 KB** | - | **157-170 KB** | **343-356 KB** |

**总减少**：67-69%

## 📊 stats.json 详解

`stats.json` 包含更详细的构建信息：

```bash
# 使用 webpack-bundle-analyzer 查看
npm run report
```

**关键信息**：

```json
{
  "assets": [
    {
      "name": "main.abc123.js",
      "size": 512000,  // 字节
      "chunks": ["main"],
      "emitted": true
    }
  ],
  "modules": [
    {
      "name": "./node_modules/moment/moment.js",
      "size": 51350,
      "reasons": [
        {
          "module": "./src/index.js",
          "type": "import"
        }
      ]
    }
  ]
}
```

## 💡 优化示例

### 优化 1：Moment.js → Day.js

```bash
# 卸载 moment
npm uninstall moment

# 安装 day.js
npm install dayjs
```

```javascript
// 修改 src/index.js 和 src/App.jsx
// import moment from 'moment';
import dayjs from 'dayjs';

// moment().format('YYYY-MM-DD')
dayjs().format('YYYY-MM-DD')

// moment().subtract(7, 'days')
dayjs().subtract(7, 'day')

// moment(date).fromNow()
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
dayjs(date).fromNow()
```

**效果**：Bundle 减少 278 KB（55%）

### 优化 2：Lodash → lodash-es

```bash
npm install lodash-es
```

```javascript
// 修改 src/index.js 和 src/App.jsx
// import _ from 'lodash';
import { range, random, sample, debounce, chain, filter, meanBy, maxBy, countBy } from 'lodash-es';

// _.range(1, 101)
range(1, 101)

// _.debounce(fn, 500)
debounce(fn, 500)

// 注意：chain 需要特殊处理
import { chain } from 'lodash-es';
chain(data).filter(...).sortBy('price').value()
```

**效果**：Bundle 减少 65 KB（13%）

### 优化 3：代码分割

```javascript
// webpack.config.js
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10
      }
    }
  },
  runtimeChunk: 'single'
}
```

**效果**：

```
优化前:
└── main.js (500 KB)

优化后:
├── runtime.js (2 KB)
├── vendors.js (150 KB)   ← 长期缓存
└── main.js (20 KB)       ← 业务代码
```

## 🎯 验证优化效果

应用所有优化后，再次运行分析：

```bash
npm run analyze
```

**对比结果**：

```
优化前:
├── Total: 500 KB
├── Moment.js: 280 KB
├── Lodash: 70 KB
├── React: 150 KB

优化后:
├── Total: 170 KB (减少 66%)
├── Day.js: 2 KB
├── lodash-es (按需): 5 KB
├── React: 150 KB (单独 chunk)
```

## 📈 性能提升

| 指标 | 优化前 | 优化后 | 提升 |
|------|--------|--------|------|
| Bundle 体积 | 500 KB | 170 KB | 66% |
| Gzip 后体积 | 120 KB | 45 KB | 62.5% |
| 首屏加载时间 | 2.5s | 0.8s | 68% |

## 🎓 延伸实践

### 1. 分析自己的项目

```bash
# 在你的项目中安装
npm install --save-dev webpack-bundle-analyzer

# 添加到 webpack.config.js
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

plugins: [
  new BundleAnalyzerPlugin()
]

# 构建并分析
npm run build
```

### 2. 设置性能预算

```javascript
// webpack.config.js
module.exports = {
  performance: {
    hints: 'error',             // 超出预算时报错
    maxEntrypointSize: 250000,  // 250 KB
    maxAssetSize: 100000        // 100 KB
  }
};
```

### 3. CI/CD 集成

```yaml
# .github/workflows/bundle-size.yml
name: Bundle Size Check

on: [pull_request]

jobs:
  size-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install
        run: npm install
      - name: Build
        run: npm run build
      - name: Check Size
        run: |
          SIZE=$(stat -f%z dist/main.*.js)
          if [ $SIZE -gt 250000 ]; then
            echo "❌ Bundle size exceeds 250 KB: $SIZE bytes"
            exit 1
          fi
          echo "✅ Bundle size: $SIZE bytes"
```

## 📚 相关资源

- [webpack-bundle-analyzer GitHub](https://github.com/webpack-contrib/webpack-bundle-analyzer)
- [Bundlephobia](https://bundlephobia.com/) - 在线查询包体积
- [Source Map Explorer](https://github.com/danvk/source-map-explorer)

---

**下一步**：运行 `npm run analyze`，亲自体验 Bundle 分析的强大功能！

