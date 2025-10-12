# Entry 和 Output 配置详解

## 🎯 核心问题

- Entry 到底是什么？为什么需要它？
- Entry 有哪几种配置方式？分别适用什么场景？
- Output 的各个配置项是什么意思？
- path 和 publicPath 有什么区别？

---

## 📌 Entry：入口配置

### 什么是 Entry？

**Entry（入口）**是 Webpack 构建依赖图的起点。

```
Entry（入口文件）
    ↓
分析 import/require
    ↓
找出所有依赖
    ↓
递归处理
    ↓
构建完整依赖图
    ↓
打包输出
```

**类比**：
- Entry 就像一本书的目录
- Webpack 从目录开始，找出所有章节（模块）
- 然后把所有章节整理成一本完整的书（bundle）

---

## 1️⃣ Entry 的 3 种配置方式

### 方式 1：字符串形式（单入口）⭐️ 最常用

```javascript
// webpack.config.js
module.exports = {
  entry: './src/index.js'  // 单个入口文件
};
```

**适用场景**：
- ✅ 单页应用（SPA）
- ✅ 只有一个主入口的项目
- ✅ 简单的工具库

**打包结果**：
```
dist/
└── main.js  // 默认输出文件名
```

**完整示例**：
```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'  // 自定义输出文件名
  }
};
```

---

### 方式 2：对象形式（多入口）⭐️ 多页应用

```javascript
// webpack.config.js
module.exports = {
  entry: {
    app: './src/app.js',      // 入口 1：主应用
    admin: './src/admin.js'   // 入口 2：管理后台
  }
};
```

**适用场景**：
- ✅ 多页应用（MPA）
- ✅ 需要多个独立 bundle 的项目
- ✅ 区分不同功能模块

**打包结果**：
```
dist/
├── app.js    // 主应用 bundle
└── admin.js  // 管理后台 bundle
```

**高级用法：依赖描述对象**

```javascript
module.exports = {
  entry: {
    app: {
      import: './src/app.js',           // 入口文件
      dependOn: 'shared'                 // 依赖 shared
    },
    admin: {
      import: './src/admin.js',
      dependOn: 'shared'
    },
    shared: ['react', 'react-dom']      // 共享依赖
  }
};
```

**效果**：
- `react` 和 `react-dom` 会被单独打包到 `shared.js`
- `app.js` 和 `admin.js` 都依赖 `shared.js`
- 避免重复打包公共依赖

---

### 方式 3：函数形式（动态入口）⭐️ 高级用法

```javascript
// webpack.config.js
module.exports = {
  entry: () => {
    // 动态返回入口配置
    return {
      app: './src/app.js',
      admin: './src/admin.js'
    };
  }
};
```

**适用场景**：
- ✅ 需要根据环境动态决定入口
- ✅ 需要动态发现入口文件
- ✅ 微前端、插件系统

**实际案例：动态发现所有页面**

```javascript
const glob = require('glob');
const path = require('path');

module.exports = {
  entry: () => {
    const entries = {};
    
    // 自动发现 src/pages 下的所有入口文件
    const files = glob.sync('./src/pages/*/index.js');
    
    files.forEach(file => {
      // src/pages/home/index.js -> home
      const name = path.basename(path.dirname(file));
      entries[name] = file;
    });
    
    return entries;
  }
};
```

**项目结构**：
```
src/pages/
├── home/index.js
├── about/index.js
└── contact/index.js

↓ 自动生成

entry: {
  home: './src/pages/home/index.js',
  about: './src/pages/about/index.js',
  contact: './src/pages/contact/index.js'
}
```

---

### 方式 4：数组形式（合并多个入口）

```javascript
module.exports = {
  entry: ['./src/polyfills.js', './src/index.js']
};
```

**作用**：
- 多个文件会合并成一个 bundle
- 按顺序执行

**适用场景**：
- ✅ 需要先加载 polyfill
- ✅ 需要先执行初始化代码

**等价于**：
```javascript
// polyfills.js 会先执行
import './polyfills.js';
import './index.js';
```

---

## 📊 Entry 配置方式对比

| 方式 | 语法 | 适用场景 | 输出文件数 |
|------|------|---------|-----------|
| **字符串** | `'./src/index.js'` | 单页应用 | 1 个 |
| **数组** | `['a.js', 'b.js']` | 合并多个文件 | 1 个 |
| **对象** | `{ app: '...', admin: '...' }` | 多页应用 | 多个 |
| **函数** | `() => ({ ... })` | 动态入口 | 动态 |

---

## 📌 Output：输出配置

### 什么是 Output？

**Output（输出）**告诉 Webpack 把打包后的文件输出到哪里，以及如何命名。

```javascript
module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist'),     // 输出目录
    filename: 'bundle.js',                      // 输出文件名
    publicPath: '/',                            // 公共路径
    clean: true                                 // 清空输出目录
  }
};
```

---

## 2️⃣ Output 核心配置项

### 1. path：输出目录 ⭐️ 必须

```javascript
const path = require('path');

module.exports = {
  output: {
    path: path.resolve(__dirname, 'dist')  // 绝对路径
  }
};
```

**要点**：
- ✅ **必须是绝对路径**
- ✅ 使用 `path.resolve()` 生成绝对路径
- ✅ `__dirname` 是当前配置文件所在目录

**常见错误**：
```javascript
// ❌ 错误：相对路径
output: {
  path: './dist'  // 会报错！
}

// ✅ 正确：绝对路径
output: {
  path: path.resolve(__dirname, 'dist')
}
```

---

### 2. filename：输出文件名 ⭐️ 必须

#### 单入口：固定文件名
```javascript
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js'  // 输出 dist/bundle.js
  }
};
```

#### 多入口：动态文件名
```javascript
module.exports = {
  entry: {
    app: './src/app.js',
    admin: './src/admin.js'
  },
  output: {
    filename: '[name].js'  // [name] 会被替换为 entry 的 key
  }
};

// 输出：
// dist/app.js
// dist/admin.js
```

#### 文件名模板变量

| 变量 | 说明 | 示例 |
|------|------|------|
| `[name]` | Entry 的名字 | `app.js` |
| `[id]` | Chunk 的 ID | `0.js` |
| `[hash]` | 编译的 hash | `a1b2c3d4.js` |
| `[chunkhash]` | Chunk 的 hash | `e5f6g7h8.js` |
| `[contenthash]` | 内容的 hash | `i9j0k1l2.js` |

---

## 🎯 Hash 模式详解（重要！）

### 为什么需要 Hash？

**目标**：实现**长期缓存**（Long-term Caching）

```
用户首次访问
  ↓
下载 app.a1b2c3d4.js
  ↓
浏览器缓存（根据文件名）
  ↓
再次访问
  ↓
直接使用缓存 ✅ 快！
```

**问题**：如果代码更新了，怎么让浏览器重新下载？

**解决方案**：文件名中加入 hash，内容变化 → hash 变化 → 文件名变化 → 浏览器下载新文件

---

### Hash 的 3 种模式

#### 1️⃣ hash：编译级别（全局 hash）

```javascript
output: {
  filename: '[name].[hash:8].js'
}
```

**特点**：
- ⚠️ **整个项目共用一个 hash**
- ⚠️ **任何文件改变，所有文件的 hash 都变**
- ❌ 无法实现精确的缓存控制

**示例**：
```javascript
// 第一次构建
app.a1b2c3d4.js
vendor.a1b2c3d4.js    // ← 相同的 hash

// 只修改 app.js，再次构建
app.e5f6g7h8.js       // hash 变了
vendor.e5f6g7h8.js    // ← vendor 没改，但 hash 也变了！❌
```

**缺点**：
```
修改 app.js
  ↓
整个项目重新编译
  ↓
所有文件的 hash 都变
  ↓
浏览器需要重新下载所有文件
  ↓
缓存失效 ❌
```

**适用场景**：
- ❌ **不推荐在生产环境使用**
- ⚠️ 仅用于开发环境的文件标识

---

#### 2️⃣ chunkhash：Chunk 级别

```javascript
output: {
  filename: '[name].[chunkhash:8].js'
}
```

**特点**：
- ✅ **每个 chunk 有自己的 hash**
- ✅ **只有改变的 chunk 的 hash 会变**
- ⚠️ **但同一个 chunk 中的所有模块共用一个 hash**

**Chunk 是什么？**
```
Entry Chunk (入口 chunk)
  ├── app.js
  ├── utils.js         ← 这些模块在一个 chunk 里
  └── api.js           ← 共用一个 chunkhash

Vendor Chunk (第三方库 chunk)
  ├── react.js
  └── react-dom.js     ← 另一个 chunkhash
```

**示例**：
```javascript
// 项目结构
entry: {
  app: './src/app.js',      // app chunk
  vendor: './src/vendor.js'  // vendor chunk
}

// 第一次构建
app.a1b2c3d4.js       // chunkhash-1
vendor.e5f6g7h8.js    // chunkhash-2

// 只修改 app.js，再次构建
app.i9j0k1l2.js       // ✅ chunkhash 变了
vendor.e5f6g7h8.js    // ✅ vendor 没变，hash 不变
```

**问题场景**：
```javascript
// app.js
import './app.css';  // 导入 CSS
console.log('app');

// 第一次构建
app.a1b2c3d4.js
app.a1b2c3d4.css      // ← CSS 和 JS 共用 chunkhash

// 只修改 app.css，再次构建
app.e5f6g7h8.js       // ← JS 没变，但 hash 变了！❌
app.e5f6g7h8.css      // ← CSS 变了
```

**缺点**：
- ⚠️ CSS 和 JS 在同一个 chunk 中，共用 chunkhash
- ⚠️ 修改 CSS，JS 的 hash 也会变（虽然 JS 内容没变）

**适用场景**：
- ✅ **纯 JS 项目**（没有提取 CSS）
- ⚠️ **不适合有 CSS 提取的项目**

---

#### 3️⃣ contenthash：内容级别（推荐 ⭐️）

```javascript
output: {
  filename: '[name].[contenthash:8].js'
}

plugins: [
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash:8].css'
  })
]
```

**特点**：
- ✅ **根据文件内容生成 hash**
- ✅ **内容不变，hash 不变**
- ✅ **最精确的缓存控制**

**示例**：
```javascript
// 第一次构建
app.a1b2c3d4.js       // JS contenthash
app.e5f6g7h8.css      // CSS contenthash

// 只修改 app.css，再次构建
app.a1b2c3d4.js       // ✅ JS 没变，hash 不变
app.i9j0k1l2.css      // ✅ CSS 变了，hash 变了

// 只修改 app.js，再次构建
app.m3n4o5p6.js       // ✅ JS 变了，hash 变了
app.i9j0k1l2.css      // ✅ CSS 没变，hash 不变
```

**优点**：
```
修改 app.css
  ↓
只有 CSS 的 contenthash 变
  ↓
只有 CSS 文件名变
  ↓
浏览器只下载新的 CSS
  ↓
JS 文件继续使用缓存 ✅
```

**适用场景**：
- ✅ **生产环境强烈推荐**
- ✅ **任何需要长期缓存的项目**

---

### 📊 三种 Hash 对比

| Hash 类型 | 粒度 | 变化条件 | 优点 | 缺点 | 推荐 |
|----------|------|---------|------|------|------|
| **hash** | 全局 | 任何文件变化 | 简单 | 缓存失效太频繁 | ❌ |
| **chunkhash** | Chunk | chunk 内任何模块变化 | 按 chunk 缓存 | CSS/JS 互相影响 | ⚠️ |
| **contenthash** | 文件 | 文件内容变化 | 最精确 | 无 | ✅ |

---

### 🧪 实际对比实验

#### 场景：项目有 JS、CSS、第三方库

```javascript
// 配置
module.exports = {
  entry: {
    main: './src/index.js',
    vendor: ['react', 'react-dom']
  },
  output: {
    filename: '[name].[contenthash:8].js'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    })
  ]
};
```

**构建结果**：
```
第一次构建：
main.a1b2c3d4.js         (10 KB)
main.e5f6g7h8.css        (5 KB)
vendor.i9j0k1l2.js       (150 KB)

只修改 CSS：
main.a1b2c3d4.js         ✅ 没变（缓存命中）
main.m3n4o5p6.css        ✅ 变了（重新下载 5 KB）
vendor.i9j0k1l2.js       ✅ 没变（缓存命中）

只修改 JS：
main.q7r8s9t0.js         ✅ 变了（重新下载 10 KB）
main.m3n4o5p6.css        ✅ 没变（缓存命中）
vendor.i9j0k1l2.js       ✅ 没变（缓存命中）

升级 React：
main.q7r8s9t0.js         ✅ 没变（缓存命中）
main.m3n4o5p6.css        ✅ 没变（缓存命中）
vendor.u1v2w3x4.js       ✅ 变了（重新下载 150 KB）
```

**效果**：
- 用户每次只下载真正改变的文件
- 其他文件继续使用缓存
- 节省带宽，提升速度 🚀

---

### 💡 Hash 长度控制

```javascript
// 默认：20 位
filename: '[name].[contenthash].js'
// → app.a1b2c3d4e5f6g7h8i9j0.js

// 推荐：8 位（足够避免冲突）
filename: '[name].[contenthash:8].js'
// → app.a1b2c3d4.js

// 可选：6 位（更短）
filename: '[name].[contenthash:6].js'
// → app.a1b2c3.js
```

**推荐使用 8 位**：
- ✅ 足够避免冲突（碰撞概率极低）
- ✅ 文件名不会太长
- ✅ 业界标准

---

### 🎯 最佳实践配置

```javascript
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  
  entry: {
    main: './src/index.js',
    vendor: ['react', 'react-dom']
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    // ✅ JS 使用 contenthash
    filename: '[name].[contenthash:8].js',
    // ✅ 静态资源使用 contenthash
    assetModuleFilename: 'images/[name].[contenthash:8][ext]',
    clean: true
  },
  
  plugins: [
    new MiniCssExtractPlugin({
      // ✅ CSS 使用 contenthash
      filename: '[name].[contenthash:8].css'
    })
  ],
  
  optimization: {
    // ✅ 提取 runtime
    runtimeChunk: 'single',
    
    // ✅ 代码分割
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    }
  }
};
```

**输出结果**：
```
dist/
├── main.a1b2c3d4.js           ← 业务代码
├── main.e5f6g7h8.css          ← 样式文件
├── vendors.i9j0k1l2.js        ← 第三方库
├── runtime.m3n4o5p6.js        ← webpack runtime
└── images/
    └── logo.q7r8s9t0.png      ← 图片资源
```

**缓存策略**：
- `main.*.js` - 经常变化，每次发版可能更新
- `main.*.css` - 样式调整时更新
- `vendors.*.js` - 很少变化，依赖升级才更新
- `runtime.*.js` - 很少变化，chunk 关系变化才更新
- `images/*` - 几乎不变，除非替换图片

---

### ⚠️ 常见错误

#### 错误 1：混用 hash 类型

```javascript
// ❌ 不一致
output: {
  filename: '[name].[hash].js'  // 全局 hash
},
plugins: [
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash].css'  // 内容 hash
  })
]

// ✅ 统一使用 contenthash
output: {
  filename: '[name].[contenthash:8].js'
},
plugins: [
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash:8].css'
  })
]
```

#### 错误 2：开发环境使用 hash

```javascript
// ❌ 开发环境不需要 hash
// development
output: {
  filename: '[name].[contenthash].js'  // 每次都生成新文件名，HMR 失效
}

// ✅ 开发环境用简单文件名
const isDev = process.env.NODE_ENV === 'development';

output: {
  filename: isDev ? '[name].js' : '[name].[contenthash:8].js'
}
```

---

### 📝 小结

**记住这个原则**：
```
开发环境：[name].js
生产环境：[name].[contenthash:8].js
```

**推荐配置**：
- ✅ JS：`[name].[contenthash:8].js`
- ✅ CSS：`[name].[contenthash:8].css`
- ✅ 图片：`images/[name].[contenthash:8][ext]`
- ✅ 字体：`fonts/[name].[contenthash:8][ext]`

**避免**：
- ❌ 不要在生产环境用 `[hash]`
- ❌ 不要在有 CSS 提取时用 `[chunkhash]`
- ❌ 不要在开发环境用任何 hash

---

### 3. publicPath：公共路径 ⭐️ 重要

**publicPath** 指定资源的访问路径（URL 路径）。

```javascript
module.exports = {
  output: {
    path: '/Users/project/dist',        // 文件系统路径（本地）
    publicPath: '/assets/'               // 浏览器访问路径（线上）
  }
};
```

**理解 publicPath**：

```html
<!-- publicPath: '/' -->
<script src="/bundle.js"></script>

<!-- publicPath: '/assets/' -->
<script src="/assets/bundle.js"></script>

<!-- publicPath: 'https://cdn.example.com/' -->
<script src="https://cdn.example.com/bundle.js"></script>
```

**常见场景**：

#### 场景 1：根目录部署
```javascript
output: {
  publicPath: '/'  // 默认值
}
// HTML: <script src="/bundle.js">
// 访问: https://example.com/bundle.js
```

#### 场景 2：子目录部署
```javascript
output: {
  publicPath: '/my-app/'
}
// HTML: <script src="/my-app/bundle.js">
// 访问: https://example.com/my-app/bundle.js
```

#### 场景 3：CDN 部署
```javascript
output: {
  publicPath: 'https://cdn.example.com/'
}
// HTML: <script src="https://cdn.example.com/bundle.js">
// 访问: CDN 地址
```

#### 场景 4：动态 publicPath
```javascript
output: {
  publicPath: 'auto'  // 自动推断（Webpack 5）
}
```

---

### 4. clean：清空输出目录 ⭐️ 推荐

```javascript
module.exports = {
  output: {
    clean: true  // 每次构建前清空 dist 目录
  }
};
```

**等价于**（Webpack 4）：
```javascript
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  plugins: [
    new CleanWebpackPlugin()
  ]
};
```

---

### 5. assetModuleFilename：静态资源文件名

```javascript
module.exports = {
  output: {
    assetModuleFilename: 'images/[hash][ext]'
  }
};
```

**作用**：
- 指定静态资源（图片、字体等）的输出路径和文件名

**输出示例**：
```
dist/
├── bundle.js
└── images/
    ├── a1b2c3d4.png
    └── e5f6g7h8.jpg
```

---

## 3️⃣ 完整配置示例

### 单页应用配置

```javascript
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.[contenthash:8].js',
    publicPath: '/',
    clean: true
  }
};
```

### 多页应用配置

```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    home: './src/pages/home/index.js',
    about: './src/pages/about/index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    publicPath: '/',
    clean: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/pages/home/index.html',
      filename: 'home.html',
      chunks: ['home']  // 只引入 home.js
    }),
    new HtmlWebpackPlugin({
      template: './src/pages/about/index.html',
      filename: 'about.html',
      chunks: ['about']  // 只引入 about.js
    })
  ]
};
```

---

## 📝 常见问题

### Q1: path 和 publicPath 有什么区别？

```javascript
output: {
  path: '/Users/project/dist',        // 本地文件系统路径
  publicPath: 'https://cdn.com/'      // 浏览器访问的 URL 路径
}
```

**区别**：
- **path**：告诉 Webpack 文件输出到哪里（本地）
- **publicPath**：告诉浏览器从哪里加载文件（线上）

**类比**：
- path = 你家的地址（本地存储）
- publicPath = 快递公司的地址（访问地址）

---

### Q2: 什么时候需要配置 publicPath？

**需要配置的场景**：
1. ✅ 部署到子目录：`publicPath: '/my-app/'`
2. ✅ 使用 CDN：`publicPath: 'https://cdn.com/'`
3. ✅ 动态加载：确保动态导入的模块路径正确

**不需要配置的场景**：
1. ❌ 部署到根目录：默认 `/` 即可
2. ❌ 本地开发：webpack-dev-server 会自动处理

---

### Q3: 多入口如何避免重复打包公共代码？

**方法 1：使用 dependOn**
```javascript
entry: {
  app: { import: './src/app.js', dependOn: 'shared' },
  admin: { import: './src/admin.js', dependOn: 'shared' },
  shared: ['react', 'react-dom']
}
```

**方法 2：使用 SplitChunksPlugin**（推荐）
```javascript
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
  }
}
```

---

## 📊 总结

### Entry 核心要点
1. **字符串**：单入口，最简单
2. **对象**：多入口，多页应用
3. **函数**：动态入口，灵活配置
4. **依赖描述**：提取公共依赖

### Output 核心要点
1. **path**：输出目录（绝对路径）
2. **filename**：输出文件名（支持模板变量）
3. **publicPath**：浏览器访问路径
4. **clean**：清空旧文件
5. **assetModuleFilename**：静态资源路径

### 最佳实践
- ✅ 单页应用用字符串 entry
- ✅ 多页应用用对象 entry
- ✅ 文件名使用 `[name].[contenthash:8]`
- ✅ 开启 `clean: true`
- ✅ 生产环境使用 CDN 时配置 publicPath

---

## 🎯 下一步

继续学习：
- [Mode 概念详解](./02-mode-concept.md) - development vs production
- [配置文件的多种形式](./03-config-file.md) - 函数式配置、TS 配置

然后通过 Demo 实践：
- [Demo 1: 单入口应用](../demos/01-single-entry/)
- [Demo 2: 多入口应用](../demos/02-multi-entry/)

