# Demo 2: 多入口应用配置

## 📖 说明

这是一个多页应用（MPA）示例，演示如何配置多入口 Webpack 项目，包括多个独立页面、公共代码提取、代码复用等。

---

## 🎯 学习目标

- 理解多入口配置（对象形式）
- 掌握多页应用的配置方法
- 理解公共代码提取机制
- 学会配置多个 HtmlWebpackPlugin
- 理解 chunks 的作用

---

## 🚀 运行方式

### 1. 安装依赖
```bash
npm install
```

### 2. 开发模式
```bash
npm run dev
```

**效果**：
- 启动开发服务器
- 自动打开首页（http://localhost:8080/home.html）
- 支持热更新

### 3. 生产构建
```bash
npm run build
ls -lh dist/
```

**生成的文件**：
```
dist/
├── home.html              # 首页 HTML
├── about.html             # 关于页 HTML
├── contact.html           # 联系页 HTML
├── home.[hash].js         # 首页 JS
├── about.[hash].js        # 关于页 JS
├── contact.[hash].js      # 联系页 JS
├── common.[hash].js       # 公共代码
├── runtime.[hash].js      # Webpack runtime
└── *.js.map               # Source Map 文件
```

---

## 🔍 核心配置详解

### 1. 多入口配置

```javascript
entry: {
  home: './src/pages/home/index.js',       // 首页入口
  about: './src/pages/about/index.js',     // 关于页入口
  contact: './src/pages/contact/index.js'  // 联系页入口
}
```

**要点**：
- 使用**对象形式**配置多个入口
- key（home/about/contact）会作为输出文件名
- 每个入口独立打包

---

### 2. 输出配置

```javascript
output: {
  filename: '[name].[contenthash:8].js'
  // [name] 会被替换为 entry 的 key
}
```

**输出结果**：
```
home.[hash].js
about.[hash].js
contact.[hash].js
```

---

### 3. HTML 插件配置

```javascript
plugins: [
  new HtmlWebpackPlugin({
    template: './src/pages/home/index.html',
    filename: 'home.html',
    chunks: ['home']  // ⭐️ 只引入 home.js
  }),
  new HtmlWebpackPlugin({
    template: './src/pages/about/index.html',
    filename: 'about.html',
    chunks: ['about']  // ⭐️ 只引入 about.js
  }),
  // ...
]
```

**关键配置**：
- `template`：HTML 模板路径
- `filename`：输出的 HTML 文件名
- `chunks`：指定该 HTML 引入哪些 JS 文件

**不配置 chunks 会怎样？**
```html
<!-- ❌ 不配置 chunks，会引入所有 JS -->
<script src="home.js"></script>
<script src="about.js"></script>
<script src="contact.js"></script>

<!-- ✅ 配置 chunks: ['home']，只引入 home.js -->
<script src="home.js"></script>
```

---

### 4. 公共代码提取

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      // 提取第三方库
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10
      },
      // 提取公共代码
      common: {
        minChunks: 2,  // 至少被2个chunk引用
        name: 'common',
        priority: 5,
        reuseExistingChunk: true
      }
    }
  }
}
```

**效果**：
```
src/shared/utils.js  (被 home/about/contact 共享)
    ↓
提取到 common.js
    ↓
每个页面的 bundle 体积减小
```

---

## 📊 项目结构

```
src/
├── pages/                    # 页面目录
│   ├── home/
│   │   ├── index.html       # 首页模板
│   │   └── index.js         # 首页入口
│   ├── about/
│   │   ├── index.html
│   │   └── index.js
│   └── contact/
│       ├── index.html
│       └── index.js
│
└── shared/                   # 共享代码
    ├── utils.js             # 工具函数（会被提取到 common.js）
    ├── styles.css           # 共享样式
    └── components/
        └── counter.js       # 共享组件
```

**设计思路**：
- `pages/`：每个页面独立的代码
- `shared/`：多个页面共享的代码
- 共享代码会被自动提取

---

## 🔍 体验要点

### 1. 观察 Network 面板

#### 访问首页
```
home.html
home.[hash].js      ← 首页专属代码
common.[hash].js    ← 公共代码
runtime.[hash].js   ← Webpack runtime
```

#### 访问关于页
```
about.html
about.[hash].js     ← 关于页专属代码
common.[hash].js    ← 公共代码（缓存）
runtime.[hash].js   ← Webpack runtime（缓存）
```

**观察**：
- 每个页面只加载自己的 JS
- 公共代码只加载一次（浏览器缓存）

---

### 2. 对比构建结果

```bash
# 开发模式
npm run build:dev

dist/
├── home.js          45KB
├── about.js         42KB
├── contact.js       43KB
总计：130KB

# 生产模式（提取公共代码）
npm run build

dist/
├── home.[hash].js      15KB
├── about.[hash].js     12KB
├── contact.[hash].js   13KB
├── common.[hash].js    25KB  ← 公共代码
├── runtime.[hash].js    2KB  ← Webpack runtime
总计：67KB

节省：130KB → 67KB（减少 48%）
```

---

### 3. 修改共享代码

修改 `src/shared/utils.js`：
```javascript
export function log(message, type = 'info') {
  console.log('🎉', message);  // 添加 emoji
}
```

**运行 `npm run build` 观察**：
```
home.[hash].js      ✅ hash 变了（使用了 utils.js）
about.[hash].js     ✅ hash 变了（使用了 utils.js）
contact.[hash].js   ✅ hash 变了（使用了 utils.js）
common.[hash].js    ✅ hash 变了（包含 utils.js）
```

**修改单个页面的代码**：
```
home.js 改动
    ↓
只有 home.[hash].js 的 hash 变化
其他文件 hash 不变（继续使用缓存）
```

---

## 📝 常见问题

### Q1: 为什么需要配置 chunks？

**不配置 chunks**：
```html
<!-- 每个 HTML 都引入所有 JS -->
<script src="home.js"></script>
<script src="about.js"></script>
<script src="contact.js"></script>
```
- ❌ 加载不需要的代码
- ❌ 浪费带宽
- ❌ 影响性能

**配置 chunks**：
```html
<!-- home.html 只引入 home.js -->
<script src="home.js"></script>
```
- ✅ 只加载需要的代码
- ✅ 按需加载
- ✅ 性能更好

---

### Q2: 公共代码如何判断？

**判断依据**：
```javascript
splitChunks: {
  cacheGroups: {
    common: {
      minChunks: 2,  // ⭐️ 至少被2个chunk引用
    }
  }
}
```

**示例**：
```javascript
// utils.js 被 home 和 about 引用（2次）
import { log } from './shared/utils.js';  // home.js
import { log } from './shared/utils.js';  // about.js

// ✅ 会被提取到 common.js

// counter.js 只被 home 引用（1次）
import { createCounter } from './shared/counter.js';  // home.js

// ❌ 不会被提取，直接打包到 home.js
```

---

### Q3: SPA vs MPA 如何选择？

| 场景 | 推荐方案 | 原因 |
|------|---------|------|
| **官网、博客** | MPA | SEO 友好，首屏快 |
| **管理后台** | SPA | 无需 SEO，交互复杂 |
| **电商网站** | MPA | SEO 重要，页面多 |
| **工具应用** | SPA | 类似桌面应用，交互多 |

**混合方案**：
- 官网用 MPA（利于 SEO）
- 管理后台用 SPA（交互复杂）

---

## 🎯 练习建议

1. **添加新页面**：
   - 创建 `src/pages/products/`
   - 添加入口配置
   - 添加 HtmlWebpackPlugin
   - 观察构建结果

2. **实验 chunks 配置**：
   - 删除 `chunks: ['home']`
   - 观察 HTML 引入了哪些 JS
   - 理解 chunks 的作用

3. **调整 splitChunks**：
   - 修改 `minChunks: 3`
   - 观察哪些代码被提取
   - 理解阈值的作用

4. **性能优化**：
   - 分析打包结果
   - 找出可以优化的地方
   - 实施优化并对比效果

---

## 📊 核心要点总结

### 多入口配置
```javascript
entry: {
  page1: './src/page1.js',  // 对象形式
  page2: './src/page2.js'
}
```

### HtmlWebpackPlugin
- 为每个页面创建一个实例
- 使用 `chunks` 指定引入的 JS
- 避免引入不需要的代码

### 公共代码提取
- `splitChunks.chunks: 'all'`
- `minChunks`: 最少引用次数
- `cacheGroups`: 分组提取

### 最佳实践
1. 页面间共享的代码放在 `shared/`
2. 生产模式开启 `splitChunks`
3. 使用 contenthash 实现长期缓存
4. 每个页面只引入需要的 JS

---

## 🎯 下一步

完成 Demo 2 后，你已经掌握了：
- ✅ 单入口配置（Demo 1）
- ✅ 多入口配置（Demo 2）

可以选择：
- 继续学习 **Demo 3**：动态入口配置
- 继续学习 **Demo 4**：输出命名策略
- 进入 **Phase 03**：Loader 机制深入

