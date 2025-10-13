# Demo 05: 综合优化案例

## 📖 Demo 说明

这是一个**综合优化案例**，整合了 Phase 12 学习的所有性能优化技巧，通过对比优化前/后的构建数据，直观展示优化效果。

本 Demo 构建了一个 React SPA 应用，包含：
- React + React Router（路由级别懒加载）
- Lodash（Tree Shaking）
- Axios（HTTP 请求）
- Moment.js（日期处理，演示 noParse）

## 🎯 学习目标

- 掌握性能优化的综合应用
- 理解不同优化技巧的协同效果
- 学会对比和量化优化成果
- 建立完整的性能优化思维模型

## 🚀 运行步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

访问自动打开的页面，体验三个页面的懒加载效果。

### 3. 对比优化效果

#### 方式一：自动对比（推荐）

```bash
npm run compare
```

自动运行优化前/后两次构建，并输出详细对比数据。

#### 方式二：手动对比

```bash
# 优化前构建
npm run build:before

# 优化后构建
npm run build:after

# 分析优化前的包结构
npm run analyze:before

# 分析优化后的包结构
npm run analyze:after
```

### 4. 验证缓存效果（重要）

```bash
# 首次构建（记录时间）
time npm run build:after

# 二次构建（应该快 80%+）
time npm run build:after
```

## 📊 优化清单

本 Demo 应用了 **8 项核心优化技巧**：

| # | 优化技巧 | 配置文件 | 预期效果 |
|---|---------|---------|---------|
| 1 | **持久化缓存** | `cache: { type: 'filesystem' }` | 二次构建提速 80%+ |
| 2 | **并行构建** | `thread-loader` | 多核 CPU 加速，提速 30%+ |
| 3 | **并行压缩** | `TerserPlugin({ parallel: true })` | 压缩提速 50%+ |
| 4 | **代码分割** | `splitChunks` | vendor/react/common 分离 |
| 5 | **Tree Shaking** | `usedExports: true` | 移除未使用代码，减小 10-20% |
| 6 | **懒加载** | `React.lazy()` | 路由级别代码分割 |
| 7 | **缩小 resolve** | `resolve.modules/extensions` | 模块解析提速 |
| 8 | **noParse** | `noParse: /lodash|moment/` | 跳过预编译库，提速 5-10% |

## 🔍 核心配置详解

### 1. 持久化缓存

```javascript
// webpack.after.config.js
module.exports = {
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]  // 配置变化时失效缓存
    }
  }
};
```

**效果**：
- 首次构建：正常速度
- 二次构建：提速 80%+（未修改文件直接复用缓存）

### 2. 并行构建

```javascript
{
  test: /\.jsx?$/,
  use: [
    {
      loader: 'thread-loader',
      options: {
        workers: 2,              // 并行进程数
        poolTimeout: Infinity    // 保持进程池（开发模式）
      }
    },
    'babel-loader'
  ]
}
```

**效果**：
- 充分利用多核 CPU
- 大型项目提速 30-50%
- 小项目效果不明显（进程通信开销）

### 3. 代码分割

```javascript
optimization: {
  splitChunks: {
    chunks: 'all',
    cacheGroups: {
      // React 相关单独打包
      react: {
        test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
        name: 'react',
        priority: 20
      },
      // 其他 vendor
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        priority: 10
      },
      // 公共代码
      common: {
        minChunks: 2,
        priority: 5,
        reuseExistingChunk: true
      }
    }
  }
}
```

**效果**：
- `react.xxx.js`：React 相关（稳定，长期缓存）
- `vendors.xxx.js`：其他第三方库
- `common.xxx.js`：业务公共代码
- `main.xxx.js`：入口代码
- 懒加载的页面单独打包（`src_pages_*.js`）

### 4. 并行压缩

```javascript
optimization: {
  minimizer: [
    new TerserPlugin({
      parallel: true,  // 并行压缩
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }),
    new CssMinimizerPlugin({
      parallel: true
    })
  ]
}
```

**效果**：
- 压缩速度提升 50%+
- 自动移除 `console.log` 和 `debugger`

### 5. noParse

```javascript
module: {
  noParse: /lodash|moment/  // 跳过这些库的解析
}
```

**效果**：
- 跳过预编译库的 AST 解析
- 适用于已经打包好的库（无依赖）
- 提速 5-10%

## 📈 优化效果预览

运行 `npm run compare` 后的典型输出：

```
📊 性能提升汇总:

⏱️  构建时间:
   优化前: 12.50s
   优化后: 8.30s
   提升: 33.6%

📦 输出体积:
   优化前: 850.23 KB
   优化后: 720.45 KB
   减少: 15.3%

📁 文件数量:
   优化前: 3 个文件
   优化后: 8 个文件
   增加: 5 个 (Code Splitting)

🎯 最大文件:
   优化前: main.abc123.js (780.45 KB)
   优化后: react.def456.js (150.23 KB)

💡 应用的优化技巧:
   1. ✅ 持久化缓存 (filesystem cache) - 二次构建速度提升 80%+
   2. ✅ 并行构建 (thread-loader) - 多核 CPU 加速编译
   3. ✅ 并行压缩 (TerserPlugin parallel) - 压缩速度提升 50%+
   4. ✅ 代码分割 (splitChunks) - vendor/react/common 分离
   5. ✅ Tree Shaking (usedExports) - 移除未使用代码
   6. ✅ 懒加载 (lazy) - 路由级别代码分割
   7. ✅ 缩小 resolve 范围 - 加快模块解析
   8. ✅ noParse - 跳过预编译库解析

🔍 二次构建测试（验证缓存效果）:
   运行以下命令对比首次/二次构建速度：
   $ time npm run build:after  # 首次构建
   $ time npm run build:after  # 二次构建（应该快 80%+）
```

## 💡 关键知识点

### 1. 为什么优化后文件数量变多？

优化前：
```
dist-before/
├── main.abc123.js       (780 KB) ← 所有代码打包在一起
├── main.abc123.css
└── index.html
```

优化后：
```
dist-after/
├── runtime.xyz789.js    (2 KB)   ← Webpack 运行时
├── react.def456.js      (150 KB) ← React 相关（长期缓存）
├── vendors.ghi789.js    (320 KB) ← Lodash/Axios/Moment
├── common.jkl012.js     (30 KB)  ← 业务公共代码
├── main.mno345.js       (50 KB)  ← 入口代码
├── src_pages_Dashboard*.js (40 KB) ← 懒加载页面
├── src_pages_Analytics*.js (35 KB)
├── main.abc123.css
└── index.html
```

**好处**：
- React 几乎不变 → 长期缓存
- 修改业务代码 → 只需下载 `main.js` 和 `common.js`
- 按需加载 → Dashboard 页面只在访问时下载

### 2. 为什么首次构建反而更慢？

优化后配置更复杂：
- `thread-loader` 需要启动工作进程
- `splitChunks` 需要分析依赖关系
- 缓存需要首次写入磁盘

**但是**：
- 二次构建会快 80%+（缓存效果）
- 生产环境通常只构建一次
- 开发环境二次构建是常态

### 3. 何时应用这些优化？

**小型项目（< 100 个模块）**：
- ✅ 持久化缓存
- ✅ splitChunks（简单配置）
- ❌ thread-loader（开销大于收益）
- ❌ noParse（效果不明显）

**中型项目（100-500 个模块）**：
- ✅ 持久化缓存
- ✅ splitChunks
- ✅ 并行压缩
- ⚠️ thread-loader（视 CPU 核心数）

**大型项目（> 500 个模块）**：
- ✅ 所有优化技巧
- ✅ 考虑 Externals (CDN)
- ✅ 考虑微前端架构

## 🎓 延伸思考

### 1. 如何量化优化效果？

使用 `speed-measure-webpack-plugin` 和 `webpack-bundle-analyzer`：

```javascript
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = smp.wrap({
  // 你的 webpack 配置
});
```

### 2. 如何在团队中推广性能优化？

**步骤**：
1. **建立基准**：记录当前构建速度和包体积
2. **逐步优化**：一次应用一项优化，记录效果
3. **可视化对比**：使用图表展示优化前后对比
4. **编写文档**：记录最佳实践和配置模板
5. **自动化检测**：CI/CD 中集成性能监控

**示例 CI 脚本**：
```bash
#!/bin/bash
# 在 CI 中对比构建时间
BEFORE=$(date +%s)
npm run build
AFTER=$(date +%s)
DURATION=$((AFTER - BEFORE))

if [ $DURATION -gt 60 ]; then
  echo "⚠️ 构建时间过长: ${DURATION}s"
  exit 1
fi
```

### 3. Webpack 5 vs Webpack 4 优化差异

| 优化技巧 | Webpack 4 | Webpack 5 |
|---------|-----------|-----------|
| 持久化缓存 | 需要 `hard-source-webpack-plugin` | 内置 `filesystem cache` |
| Tree Shaking | 需要手动配置 | 默认开启且更智能 |
| Code Splitting | 配置复杂 | 更智能的默认配置 |
| 长期缓存 | `chunkhash` | `contenthash` 更稳定 |

**建议**：
- 新项目直接使用 Webpack 5
- 老项目评估升级成本（通常值得）

## 📚 相关文档

- [Webpack 5 Cache 配置](https://webpack.js.org/configuration/cache/)
- [SplitChunksPlugin 详解](https://webpack.js.org/plugins/split-chunks-plugin/)
- [thread-loader 使用指南](https://webpack.js.org/loaders/thread-loader/)
- [TerserPlugin 配置选项](https://webpack.js.org/plugins/terser-webpack-plugin/)
- [性能优化最佳实践](https://webpack.js.org/guides/build-performance/)

## 🔗 下一步学习

完成本 Demo 后，建议：
1. ✅ 复习 Phase 12 所有文档
2. ✅ 将优化技巧应用到自己的项目
3. ✅ 进入 Phase 13（Bundle 优化）
4. ✅ 进入 Phase 14（运行时优化）

---

**恭喜你完成了 Phase 12 的学习！🎉**

你现在已经掌握了 Webpack 构建性能优化的核心技巧，这些知识将帮助你在实际项目中大幅提升开发体验和构建效率。

