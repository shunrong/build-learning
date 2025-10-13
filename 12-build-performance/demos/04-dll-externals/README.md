# Demo 04: DLL 和 Externals 预编译优化

## 📖 Demo 说明

本 Demo 对比了三种不同的构建优化策略：

1. **普通构建**：每次都编译所有依赖（包括 React、Lodash）
2. **DLL 预编译**：使用 `DllPlugin` 将第三方库预编译，业务代码快速构建
3. **Externals (CDN)**：通过 CDN 引入依赖，构建时排除第三方库

## 🎯 学习目标

- 理解 DLL 和 Externals 的区别和适用场景
- 掌握 `DllPlugin` 和 `DllReferencePlugin` 的配置
- 学习如何配置 `externals` 使用 CDN
- 对比不同策略的构建速度和包体积

## 📁 项目结构

```
04-dll-externals/
├── src/
│   ├── index.html              # 普通/DLL 构建的 HTML 模板
│   ├── index-externals.html    # Externals 构建的 HTML 模板（含 CDN 链接）
│   ├── index.js                # 应用入口
│   ├── App.jsx                 # React 主组件（使用 Lodash）
│   └── styles.css              # 样式文件
├── webpack.normal.config.js    # 普通构建配置
├── webpack.dll.config.js       # DLL 预编译配置
├── webpack.dll-app.config.js   # DLL 应用构建配置
├── webpack.externals.config.js # Externals 配置
├── compare.js                  # 性能对比脚本
└── package.json
```

## 🚀 运行步骤

### 1. 安装依赖

```bash
npm install
```

### 2. 方式一：普通构建

```bash
npm run build:normal
```

- 每次构建都编译 React、ReactDOM、Lodash
- 适合小型项目或依赖频繁更新的场景

### 3. 方式二：DLL 预编译

```bash
# 首次需要预编译第三方库（耗时较长）
npm run build:dll:vendor

# 之后只需构建业务代码（速度快）
npm run build:dll:app

# 或者一键执行两步
npm run build:dll
```

- **优点**：业务代码构建速度极快（复用 DLL）
- **缺点**：首次构建慢，依赖更新需重新预编译
- **适用**：依赖稳定的中大型项目

### 4. 方式三：Externals (CDN)

```bash
npm run build:externals
```

- **优点**：构建速度最快，包体积最小
- **缺点**：依赖 CDN 稳定性，首屏可能受网络影响
- **适用**：CDN 可用且稳定的生产环境

### 5. 性能对比

```bash
npm run compare
```

自动运行三种构建方式，并输出对比数据：

```
📊 对比结果汇总:

1. 普通构建
   构建时间: 8.50s
   输出体积: 450.23 KB

2. DLL 预编译
   构建时间: 2.30s (提升 72.9%)
   输出体积: 455.12 KB (减少 -1.1%)

3. Externals (CDN)
   构建时间: 1.80s (提升 78.8%)
   输出体积: 15.45 KB (减少 96.6%)
```

## 🔍 核心配置解析

### 1. DLL 预编译配置

**webpack.dll.config.js**（预编译第三方库）：

```javascript
module.exports = {
  entry: {
    vendor: ['react', 'react-dom', 'lodash']  // 需要预编译的库
  },
  output: {
    filename: '[name].dll.js',
    library: '[name]_library'                 // 暴露全局变量
  },
  plugins: [
    new webpack.DllPlugin({
      name: '[name]_library',
      path: path.resolve(__dirname, 'dll/[name]-manifest.json')  // 生成映射清单
    })
  ]
};
```

**webpack.dll-app.config.js**（引用 DLL）：

```javascript
module.exports = {
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require('./dll/vendor-manifest.json')  // 读取 DLL 映射
    }),
    new AddAssetHtmlPlugin({
      filepath: path.resolve(__dirname, 'dll/vendor.dll.js')  // 注入 DLL 到 HTML
    })
  ]
};
```

### 2. Externals 配置

**webpack.externals.config.js**：

```javascript
module.exports = {
  externals: {
    'react': 'React',           // import React from 'react' → 全局变量 React
    'react-dom': 'ReactDOM',    // import ReactDOM from 'react-dom' → 全局 ReactDOM
    'lodash': '_'               // import _ from 'lodash' → 全局 _
  }
};
```

**index-externals.html**（手动引入 CDN）：

```html
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lodash@4.17.21/lodash.min.js"></script>
```

## 💡 核心知识点

### DLL vs Externals 对比

| 特性 | DLL | Externals |
|------|-----|-----------|
| **构建速度** | 首次慢，后续快 | 最快 |
| **包体积** | 稍大（包含 DLL） | 最小（仅业务代码） |
| **网络依赖** | 无（本地资源） | 有（依赖 CDN） |
| **版本控制** | 强（锁定版本） | 弱（CDN 可能变化） |
| **适用场景** | 中大型项目 | CDN 稳定的生产环境 |

### 何时使用 DLL？

✅ **推荐场景**：
- 大型项目，依赖库多且稳定
- 开发阶段频繁重新构建
- 需要离线环境支持

❌ **不推荐场景**：
- 小型项目（配置复杂度高于收益）
- 依赖频繁更新（需频繁重新预编译）
- Webpack 5 + 持久化缓存已足够快

### 何时使用 Externals？

✅ **推荐场景**：
- CDN 可用且稳定（如企业内网 CDN）
- 需要极致的包体积优化
- 多个应用共享同一套依赖

❌ **不推荐场景**：
- 网络不稳定（影响首屏加载）
- 需要精确的版本控制（CDN 可能升级）
- 离线环境或内网环境

### Webpack 5 时代的建议

> **重要提示**：Webpack 5 引入了强大的**持久化缓存**机制，在很多场景下可以替代 DLL：

```javascript
// webpack.config.js
module.exports = {
  cache: {
    type: 'filesystem',  // 文件系统缓存
    buildDependencies: {
      config: [__filename]  // 配置文件变化时失效缓存
    }
  }
};
```

**现代化最佳实践**：
1. **首选**：Webpack 5 持久化缓存 + `splitChunks`
2. **次选**：Externals（CDN 可用且稳定）
3. **备选**：DLL（特殊场景，如 Webpack 4 项目）

## 📊 实战对比数据

运行 `npm run compare` 后的典型结果：

```
📊 对比结果汇总:

1. 普通构建
   构建时间: 8.50s
   输出体积: 450.23 KB

2. DLL 预编译（首次）
   构建时间: 10.20s (首次预编译耗时)
   输出体积: 455.12 KB

   后续构建:
   构建时间: 2.30s (提升 72.9%) ← 只构建业务代码
   输出体积: 455.12 KB

3. Externals (CDN)
   构建时间: 1.80s (提升 78.8%)
   输出体积: 15.45 KB (减少 96.6%) ← 仅业务代码

💡 关键发现:
   • DLL: 首次构建较慢（需预编译），后续构建快（复用 DLL）
   • Externals: 构建最快且包体积最小，但依赖 CDN 稳定性
   • 普通构建: 简单但每次都编译全部依赖，大项目耗时长
```

## 🎓 延伸思考

1. **为什么 DLL 构建后包体积反而变大？**
   - 因为 DLL 文件和业务代码都需要部署
   - 但浏览器可以缓存 DLL 文件（不常变化）

2. **Externals 的版本如何控制？**
   ```html
   <!-- 精确版本号 -->
   <script src="https://unpkg.com/react@18.2.0/umd/react.production.min.js"></script>
   ```

3. **如何在开发/生产环境切换？**
   ```javascript
   const isProduction = process.env.NODE_ENV === 'production';
   module.exports = {
     externals: isProduction ? {
       'react': 'React',
       'react-dom': 'ReactDOM'
     } : {}
   };
   ```

## 📚 相关文档

- [Webpack DllPlugin 官方文档](https://webpack.js.org/plugins/dll-plugin/)
- [Externals 配置指南](https://webpack.js.org/configuration/externals/)
- [Webpack 5 持久化缓存](https://webpack.js.org/configuration/cache/)

