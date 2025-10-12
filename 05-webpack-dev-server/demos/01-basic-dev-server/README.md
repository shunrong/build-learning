# Demo 1: Webpack Dev Server 基础配置

## 📖 学习目标

通过本 Demo，你将掌握：

1. ✅ **基础配置**：port、open、hot 等核心选项
2. ✅ **静态文件服务**：如何配置 static 提供静态资源
3. ✅ **开发体验优化**：压缩、日志、进度显示
4. ✅ **客户端配置**：错误覆盖层、日志级别
5. ✅ **开发中间件**：输出控制、磁盘写入

---

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 启动开发服务器

```bash
npm run dev
```

服务器将自动：
- 🔍 寻找可用端口
- 🌐 打开浏览器
- 🔥 启用热模块替换
- 📊 显示编译进度

### 3. 构建生产版本

```bash
npm run build
```

---

## 📂 项目结构

```
01-basic-dev-server/
├── src/
│   ├── index.html          # HTML 模板
│   ├── index.js            # 入口 JS
│   └── styles.css          # 样式文件
├── public/
│   └── data.json           # 静态文件示例
├── webpack.config.js       # Webpack 配置
├── package.json
└── README.md
```

---

## 🎯 核心配置详解

### 1. 基础配置

```javascript
devServer: {
  port: 'auto',              // 自动寻找可用端口
  open: true,                // 自动打开浏览器
  hot: true,                 // 启用 HMR
}
```

**配置说明**：
- `port: 'auto'`：避免端口冲突，自动选择可用端口
- `open: true`：启动后自动在默认浏览器打开
- `hot: true`：启用 HMR，CSS 可以无刷新更新

### 2. 静态文件服务

```javascript
static: {
  directory: path.join(__dirname, 'public'),
  publicPath: '/static',     // 访问路径
  watch: true                // 监听文件变化
}
```

**使用场景**：
- 放置不需要 webpack 处理的文件
- 如：mock 数据、图片、字体等
- 访问方式：`http://localhost:port/static/data.json`

### 3. 客户端配置

```javascript
client: {
  logging: 'info',           // 日志级别
  overlay: {
    errors: true,            // 显示错误覆盖层
    warnings: false          // 不显示警告
  },
  progress: true             // 显示编译进度
}
```

**日志级别**：
- `none`：无日志
- `error`：仅错误
- `warn`：错误和警告
- `info`：信息、警告、错误
- `log`：更详细的日志
- `verbose`：最详细

### 4. 开发中间件

```javascript
devMiddleware: {
  writeToDisk: false,        // 不写入磁盘（内存中）
  stats: 'minimal'           // 输出统计信息
}
```

**性能优化**：
- `writeToDisk: false`：文件存储在内存中，速度更快
- `stats: 'minimal'`：减少控制台输出

---

## 🔬 实验指南

### 实验 1：CSS 热更新

**目标**：体验 CSS 无刷新更新

1. 启动 `npm run dev`
2. 修改 `src/styles.css` 中的颜色值
3. 观察页面样式实时更新，**无需刷新**

```css
/* 修改彩色方块的颜色 */
.color-box {
  background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
}
```

**原理**：
- `style-loader` 支持 HMR
- CSS 修改后，只替换样式表
- 不需要刷新页面

---

### 实验 2：JavaScript 更新

**目标**：观察 JS 更新行为

1. 修改 `src/index.js` 中的代码
2. 观察页面**自动刷新**

```javascript
// 修改初始计数值
let count = 100;
```

**为什么刷新**：
- JS 修改通常需要重新初始化
- 除非实现了 `module.hot.accept()`
- 下一个 Demo 会演示 JS 的 HMR

---

### 实验 3：错误覆盖层

**目标**：体验错误提示功能

1. 制造语法错误

```javascript
// 在 index.js 中故意写错
const test = 
```

2. 观察浏览器中的错误覆盖层
3. 修复错误，覆盖层自动消失

**配置**：
```javascript
client: {
  overlay: {
    errors: true,           // ✅ 显示错误
    warnings: false         // ❌ 不显示警告
  }
}
```

---

### 实验 4：静态文件服务

**目标**：测试静态资源访问

1. 点击"加载静态文件"按钮
2. 查看加载的 JSON 数据
3. 修改 `public/data.json`
4. 再次点击按钮，查看更新

**访问路径**：
- 配置的 `publicPath: '/static'`
- 访问 URL：`/static/data.json`
- 实际文件：`public/data.json`

---

### 实验 5：修改配置

**目标**：理解不同配置项的作用

尝试修改 `webpack.config.js`：

```javascript
devServer: {
  port: 8080,              // 固定端口
  open: false,             // 不自动打开
  hot: false,              // 禁用 HMR
  
  client: {
    logging: 'verbose',    // 更详细的日志
    overlay: {
      warnings: true       // 显示警告
    }
  }
}
```

观察每个配置的效果。

---

## 💡 配置最佳实践

### 开发环境推荐配置

```javascript
devServer: {
  port: 'auto',
  open: true,
  hot: true,
  compress: true,
  
  client: {
    logging: 'info',
    overlay: {
      errors: true,
      warnings: false      // 生产环境再关注警告
    },
    progress: true
  },
  
  devMiddleware: {
    writeToDisk: false,    // 内存模式更快
    stats: 'minimal'       // 减少输出
  }
}
```

### 生产环境

生产环境不使用 dev server，但可以参考：

```javascript
// 生产构建不需要 devServer
// 但可以用 webpack-dev-middleware 在 Node.js 中使用
```

---

## 🎓 知识点总结

### 1. Dev Server 的作用

- ✅ 提供本地开发服务器
- ✅ 实现模块热替换（HMR）
- ✅ 自动刷新浏览器
- ✅ 提供静态文件服务
- ✅ 代理 API 请求（下个 Demo 演示）

### 2. HMR vs 自动刷新

| 特性 | HMR | 自动刷新 |
|------|-----|----------|
| **CSS** | ✅ 无刷新更新 | ❌ 刷新页面 |
| **JS** | 需要额外配置 | ✅ 自动刷新 |
| **状态保持** | ✅ 保持状态 | ❌ 丢失状态 |
| **速度** | ⚡ 更快 | 🐢 较慢 |

### 3. 静态文件 vs Webpack 模块

| 类型 | 静态文件 | Webpack 模块 |
|------|----------|--------------|
| **处理方式** | 直接访问 | 经过 loader 处理 |
| **路径** | `/static/xxx` | `import xxx` |
| **用途** | Mock 数据、资源 | 源代码、依赖 |
| **变化** | 需要刷新 | HMR 更新 |

### 4. 配置优先级

```javascript
// 配置层次
devServer: {
  // 1. 基础配置（必须）
  port, open, hot
  
  // 2. 静态文件（可选）
  static
  
  // 3. 客户端配置（优化体验）
  client
  
  // 4. 中间件配置（性能优化）
  devMiddleware
  
  // 5. 高级配置（下个 Demo）
  proxy, historyApiFallback
}
```

---

## 🔗 相关文档

- [webpack-dev-server 官方文档](https://webpack.js.org/configuration/dev-server/)
- [HMR 指南](https://webpack.js.org/guides/hot-module-replacement/)
- 本项目文档：`../docs/01-dev-server-basics.md`

---

## 🐛 常见问题

### 1. 端口被占用

**问题**：`EADDRINUSE: address already in use :::3000`

**解决**：
```javascript
devServer: {
  port: 'auto'  // 自动寻找可用端口
}
```

### 2. 静态文件 404

**问题**：`/static/data.json` 返回 404

**检查**：
1. `public` 目录是否存在
2. `publicPath` 配置是否正确
3. 访问路径是否正确

### 3. HMR 不工作

**原因**：
- `hot: false` 未启用
- 使用了 `[contenthash]`（开发环境不需要）
- 浏览器缓存问题

**解决**：
```javascript
devServer: {
  hot: true
}
```

---

## 🎯 下一步

完成本 Demo 后，继续学习：

- **Demo 2**：HMR 深入演示（JS、React HMR）
- **Demo 3**：代理配置（解决跨域）
- **Demo 4**：多页面应用配置

掌握这些基础后，你将能够构建高效的开发环境！🚀

