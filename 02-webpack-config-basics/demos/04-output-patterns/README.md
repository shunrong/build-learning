# Demo 4: 输出文件命名策略

## 📖 说明

这个示例详细演示 **hash、chunkhash、contenthash** 三种文件命名策略的区别、使用场景和最佳实践。

---

## 🎯 学习目标

- 理解 hash、chunkhash、contenthash 的区别
- 掌握长期缓存策略
- 学会选择合适的 hash 策略
- 理解浏览器缓存机制

---

## 🚀 运行方式

### 1. 安装依赖
```bash
npm install
```

### 2. 对比三种策略

#### 方式 1：hash（全局hash）
```bash
npm run build:hash
ls -lh dist-hash/
```

**观察输出**：
```
main.a1b2c3d4.js
main.a1b2c3d4.css
vendor.a1b2c3d4.js
runtime.a1b2c3d4.js

注意：所有文件的 hash 都是 a1b2c3d4（相同）
```

---

#### 方式 2：chunkhash（chunk级别）
```bash
npm run build:chunkhash
ls -lh dist-chunkhash/
```

**观察输出**：
```
main.e5f6g7h8.js
main.e5f6g7h8.css      ← CSS 和 JS 的 hash 相同（同一个chunk）
vendor.i9j0k1l2.js
runtime.m3n4o5p6.js
```

---

#### 方式 3：contenthash（内容hash）✅ 推荐
```bash
npm run build:contenthash
ls -lh dist-contenthash/
```

**观察输出**：
```
main.q7r8s9t0.js
main.u1v2w3x4.css      ← CSS 和 JS 的 hash 不同（独立）
vendor.y5z6a7b8.js
runtime.c9d0e1f2.js
```

---

## 🧪 实验：观察 Hash 变化

### 实验 1：修改 JS 文件

```bash
# 1. 构建 contenthash 版本
npm run build:contenthash

# 2. 记录文件名
ls dist-contenthash/
# main.q7r8s9t0.js
# main.u1v2w3x4.css
# vendor.y5z6a7b8.js

# 3. 修改 src/index.js（添加一行注释）
echo "// test comment" >> src/index.js

# 4. 重新构建
npm run build:contenthash

# 5. 对比文件名
ls dist-contenthash/
# main.XXXXXXXX.js       ← hash 变了（JS 文件改变）
# main.u1v2w3x4.css      ← hash 不变（CSS 没改）✅
# vendor.y5z6a7b8.js     ← hash 不变（vendor 没改）✅
```

**结论**：
- ✅ 只有修改的文件 hash 改变
- ✅ 未修改的文件 hash 不变，继续使用缓存

---

### 实验 2：修改 CSS 文件

```bash
# 1. 构建
npm run build:contenthash

# 2. 修改 src/styles.css（改变背景色）
# background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
# 改为
# background: linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 100%);

# 3. 重新构建
npm run build:contenthash

# 4. 对比
# main.q7r8s9t0.js       ← hash 不变（JS 没改）✅
# main.YYYYYYYY.css      ← hash 变了（CSS 改变）
# vendor.y5z6a7b8.js     ← hash 不变（vendor 没改）✅
```

**contenthash 的优势**：
- CSS 和 JS 独立，互不影响
- 精确的缓存控制

---

### 实验 3：对比 chunkhash

使用 chunkhash 重复实验 2：

```bash
# 1. 构建
npm run build:chunkhash

# 2. 修改 CSS
# 3. 重新构建
npm run build:chunkhash

# 4. 对比
# main.XXXXXXXX.js       ← hash 也变了！（同一个 chunk）❌
# main.XXXXXXXX.css      ← hash 变了（CSS 改变）
# vendor.i9j0k1l2.js     ← hash 不变
```

**chunkhash 的问题**：
- CSS 和 JS 在同一个 chunk
- CSS 改变会导致 JS 的 hash 也变
- 浏览器需要重新下载 JS（即使 JS 没变）❌

---

## 📊 三种策略对比

### 1. hash（全局hash）

**配置**：
```javascript
output: {
  filename: '[name].[hash:8].js'
}
```

**特点**：
- 整个编译过程的 hash
- 任何文件改变，所有文件的 hash 都会改变

**示例**：
```
构建 1：
main.a1b2c3d4.js
vendor.a1b2c3d4.js
style.a1b2c3d4.css

修改 main.js：
main.e5f6g7h8.js       ← hash 变了
vendor.e5f6g7h8.js     ← hash 也变了（尽管 vendor 没改）❌
style.e5f6g7h8.css     ← hash 也变了（尽管 CSS 没改）❌
```

**缺点**：
- ❌ 无法利用浏览器缓存
- ❌ 任何改动都会导致所有文件重新下载

**适用场景**：
- 几乎没有，不推荐使用

---

### 2. chunkhash（chunk级别）

**配置**：
```javascript
output: {
  filename: '[name].[chunkhash:8].js'
}
```

**特点**：
- chunk 级别的 hash
- 同一个 chunk 的文件 hash 相同
- 不同 chunk 的 hash 独立

**示例**：
```
构建 1：
main.a1b2c3d4.js       ← main chunk
main.a1b2c3d4.css      ← 同一个 chunk
vendor.e5f6g7h8.js     ← vendor chunk

修改 main.js：
main.i9j0k1l2.js       ← main chunk hash 变了
main.i9j0k1l2.css      ← CSS hash 也变了（同一个 chunk）⚠️
vendor.e5f6g7h8.js     ← vendor chunk hash 不变 ✅
```

**优点**：
- ✅ 比 hash 更精确
- ✅ 不同 chunk 独立缓存

**缺点**：
- ⚠️ CSS 和 JS 在同一个 chunk，CSS 改变会影响 JS 的 hash

**适用场景**：
- JS 文件（如果不提取 CSS）
- 作为 contenthash 的替代方案（旧版 Webpack）

---

### 3. contenthash（内容hash）✅ 推荐

**配置**：
```javascript
output: {
  filename: '[name].[contenthash:8].js'
},
plugins: [
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash:8].css'
  })
]
```

**特点**：
- 根据文件内容生成 hash
- 每个文件独立计算 hash
- 内容不变，hash 不变

**示例**：
```
构建 1：
main.a1b2c3d4.js       ← 根据 JS 内容
main.e5f6g7h8.css      ← 根据 CSS 内容（独立）
vendor.i9j0k1l2.js     ← 根据 vendor 内容

修改 main.js：
main.m3n4o5p6.js       ← JS hash 变了 ✅
main.e5f6g7h8.css      ← CSS hash 不变（内容没变）✅
vendor.i9j0k1l2.js     ← vendor hash 不变 ✅

修改 main.css：
main.m3n4o5p6.js       ← JS hash 不变 ✅
main.q7r8s9t0.css      ← CSS hash 变了 ✅
vendor.i9j0k1l2.js     ← vendor hash 不变 ✅
```

**优点**：
- ✅ 最精确的缓存控制
- ✅ 每个文件独立
- ✅ 完美利用浏览器缓存

**缺点**：
- 无明显缺点

**适用场景**：
- ✅ 所有文件类型（推荐）
- ✅ 生产环境必备

---

## 📊 对比表格

| 策略 | 更新时机 | 缓存效果 | 适用 | 推荐度 |
|------|---------|---------|------|--------|
| **hash** | 任何文件变化 | ❌ 最差 | 无 | ⚠️ 不推荐 |
| **chunkhash** | 同 chunk 文件变化 | ⚠️ 一般 | JS | ✅ 可用 |
| **contenthash** | 文件内容变化 | ✅ 最好 | 所有 | ✅ 强烈推荐 |

---

## 🎯 最佳实践

### 推荐配置

```javascript
module.exports = {
  output: {
    // JS 使用 contenthash
    filename: '[name].[contenthash:8].js',
    // 静态资源使用 contenthash
    assetModuleFilename: 'assets/[hash][ext]'
  },
  
  plugins: [
    // CSS 使用 contenthash
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    })
  ],
  
  optimization: {
    // 提取 runtime（减少 main bundle 的变化）
    runtimeChunk: 'single',
    
    // 提取第三方库（很少变化）
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

---

### Hash 长度选择

```javascript
// 8 位：推荐，足够避免冲突
filename: '[name].[contenthash:8].js'

// 20 位：完整 hash（默认）
filename: '[name].[contenthash].js'

// 16 位：平衡
filename: '[name].[contenthash:16].js'
```

**建议**：
- ✅ 使用 8 位（`[contenthash:8]`）
- 原因：足够避免冲突，文件名不会太长

---

## 🚀 长期缓存策略

### 目标
- 未修改的文件使用缓存（减少下载）
- 修改的文件立即更新（避免旧版本）

### 实现

```javascript
// 1. JS 文件
output: {
  filename: '[name].[contenthash:8].js'
}

// 2. CSS 文件
plugins: [
  new MiniCssExtractPlugin({
    filename: '[name].[contenthash:8].css'
  })
]

// 3. 图片、字体
output: {
  assetModuleFilename: 'assets/[hash][ext]'
}

// 4. 提取 runtime
optimization: {
  runtimeChunk: 'single'
}

// 5. 提取第三方库
optimization: {
  splitChunks: {
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
        priority: 10
      }
    }
  }
}
```

### 效果

```
首次访问：
├── vendors.a1b2c3d4.js    (200KB) ← 下载
├── main.e5f6g7h8.js       (50KB)  ← 下载
├── main.i9j0k1l2.css      (10KB)  ← 下载
└── runtime.m3n4o5p6.js    (2KB)   ← 下载
总计：262KB

修改业务代码后再次访问：
├── vendors.a1b2c3d4.js    (200KB) ← 使用缓存 ✅
├── main.XXXXXXXX.js       (50KB)  ← 下载新版本
├── main.YYYYYYYY.css      (10KB)  ← 下载新版本
└── runtime.ZZZZZZZZ.js    (2KB)   ← 下载新版本
总计：62KB（节省 200KB）
```

---

## 🔍 监听模式实验

```bash
# 1. 启动监听模式
npm run build:watch

# 2. 修改 src/index.js
# 添加注释或修改代码

# 3. 观察终端输出
# 自动重新构建

# 4. 查看 dist/ 目录
# 观察哪些文件的 hash 变了
```

**观察要点**：
- 修改 JS → 只有 JS 的 hash 变化
- 修改 CSS → 只有 CSS 的 hash 变化
- vendor 和 runtime 的 hash 很少变化

---

## 📝 常见问题

### Q1: 为什么需要提取 runtime？

**runtime**：Webpack 的运行时代码，用于加载和管理模块

**不提取**：
```
main.js 包含：
  - 业务代码
  - runtime 代码

业务代码改变 → main.js hash 变化
runtime 没变，但也要重新下载 ❌
```

**提取后**：
```
main.js：业务代码
runtime.js：runtime 代码

业务代码改变：
  - main.js hash 变化
  - runtime.js hash 不变 ✅
```

---

### Q2: hash 的位数如何选择？

**对比**：
```
[contenthash:4]  → a1b2
[contenthash:8]  → a1b2c3d4  ✅ 推荐
[contenthash:16] → a1b2c3d4e5f6g7h8
[contenthash:32] → a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
[contenthash]    → 完整 hash（20位）
```

**建议**：8 位
- ✅ 足够避免冲突（2^32 ≈ 40亿种组合）
- ✅ 文件名不会太长
- ✅ 易于阅读和调试

---

### Q3: 开发模式需要 hash 吗？

**不需要**：
```javascript
const isDev = process.env.NODE_ENV === 'development';

output: {
  filename: isDev ? '[name].js' : '[name].[contenthash:8].js'
}
```

**原因**：
- 开发模式使用 webpack-dev-server（内存）
- 不需要缓存
- 简化文件名方便调试

---

## 📊 总结

### 核心要点

1. **hash 类型**：
   - hash：全局（不推荐）
   - chunkhash：chunk 级别（JS 可用）
   - contenthash：内容级别（推荐）

2. **最佳实践**：
   - JS：`[name].[contenthash:8].js`
   - CSS：`[name].[contenthash:8].css`
   - 图片：`[hash][ext]`

3. **优化策略**：
   - 提取 runtime
   - 提取第三方库
   - 使用 contenthash

### 推荐配置

```javascript
// 生产环境
module.exports = {
  mode: 'production',
  output: {
    filename: '[name].[contenthash:8].js',
    assetModuleFilename: 'assets/[hash][ext]'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    })
  ],
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
};
```

---

## 🎯 下一步

完成 Phase 02 的所有 Demo 后，进入：
- **Phase 03**: Loader 机制深入
- **Phase 04**: Plugin 机制深入

