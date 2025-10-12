# Demo 2: 最简单的 Webpack 打包

## 📖 说明

这是**同样的计算器应用**，但使用了 Webpack 进行打包。

通过对比 [Demo 1](../01-no-bundler/)，你将直观地感受到 Webpack 带来的改变。

---

## 🎯 学习目标

- 理解 Webpack 的基本配置
- 体验模块化开发的好处
- 对比打包前后的差异
- 理解 Webpack 如何解决 Demo 1 的问题

---

## 🚀 运行方式

### 1. 安装依赖
```bash
npm install
```

### 2. 开发模式（推荐）
```bash
npm start
```

这会：
- 启动开发服务器（http://localhost:8080）
- 自动打开浏览器
- 支持热模块替换（HMR）
- 修改代码自动刷新

### 3. 构建生产版本
```bash
# 生产模式构建（代码会被压缩）
npm run build

# 开发模式构建（代码不压缩，有 source map）
npm run build:dev

# 查看打包结果
ls -lh dist/
```

---

## 🔍 体验要点

### 1. 查看项目结构

```
02-basic-bundle/
├── src/                    # 源代码目录
│   ├── index.js           # 入口文件 ⭐️
│   ├── calculator.js      # 计算器模块
│   ├── validator.js       # 验证模块
│   ├── ui.js              # UI 模块
│   ├── utils.js           # 工具模块
│   └── index.html         # HTML 模板
├── dist/                   # 打包输出目录（自动生成）
│   ├── index.html         # 自动生成的 HTML
│   ├── bundle.js          # 打包后的 JS ⭐️
│   └── bundle.js.map      # Source Map
├── webpack.config.js      # Webpack 配置 ⭐️
├── package.json           # 项目配置
└── README.md              # 本文件
```

---

### 2. 对比源代码

#### Demo 1（不用 Webpack）
```javascript
// 全局变量
var appName = "Calculator App";

// 全局函数
function log(message) {
  console.log(message);
}
```

#### Demo 2（使用 Webpack）
```javascript
// ✅ ES Modules - 导出
export const appName = "Calculator App";

export function log(message) {
  console.log(message);
}

// ✅ ES Modules - 导入
import { log } from './utils.js';
```

**区别**：
- ✅ 使用 `import/export` 语法
- ✅ 依赖关系清晰可见
- ✅ 没有全局变量污染

---

### 3. 打开 Network 面板

#### Demo 1（不用 Webpack）
```
index.html       200  1.2KB
utils.js         200  1.5KB
validator.js     200  2.1KB
calculator.js    200  1.8KB
ui.js            200  2.3KB
app.js           200  1.9KB
总计：6 个请求，10.8KB
```

#### Demo 2（使用 Webpack）
```
index.html       200  2.5KB
bundle.js        200  8.2KB
总计：2 个请求，10.7KB

# 生产模式构建后
bundle.js        200  3.1KB（压缩后）
```

**区别**：
- ✅ **6 个文件 → 1 个文件**
- ✅ **6 个请求 → 1 个请求**
- ✅ **生产模式下代码自动压缩**

---

### 4. 查看打包后的代码

```bash
# 开发模式（可读）
npm run build:dev
cat dist/bundle.js

# 生产模式（压缩）
npm run build
cat dist/bundle.js
```

**你会看到**：
- 所有模块都被包裹在一个 IIFE 中
- Webpack 的运行时代码（`__webpack_require__`）
- 模块映射对象
- 生产模式下代码被压缩混淆

---

### 5. 在 Console 中测试

```javascript
// Demo 1（不用 Webpack）
console.log(window.appName);     // ✅ "Calculator App" - 全局变量
console.log(window.Calculator);  // ✅ {add: ƒ, ...} - 全局对象
window.Calculator = null;        // ⚠️ 可以被随意修改！

// Demo 2（使用 Webpack）
console.log(window.appName);     // ❌ undefined - 不在全局！
console.log(window.Calculator);  // ❌ undefined - 不在全局！

// ✅ 所有变量都在模块作用域内，外部无法访问和修改
```

---

### 6. 理解 Webpack 配置

```javascript
// webpack.config.js
module.exports = {
  // 1️⃣ 入口：告诉 Webpack 从哪里开始
  entry: './src/index.js',
  
  // 2️⃣ 输出：告诉 Webpack 打包到哪里
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  
  // 3️⃣ 插件：扩展 Webpack 功能
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'  // 自动生成 HTML
    })
  ]
};
```

**这就是最基础的 Webpack 配置！**

---

### 7. 体验热模块替换（HMR）

1. 运行 `npm start`
2. 修改 `src/utils.js` 中的代码：
```javascript
export const appName = "我的计算器";  // 改个中文名
```
3. 保存文件
4. 浏览器**自动刷新**，显示新的应用名

**这就是 Webpack 的开发体验！**

---

## 📊 Demo 1 vs Demo 2 对比

| 特性 | Demo 1（无打包） | Demo 2（Webpack） |
|------|-----------------|------------------|
| **模块系统** | ❌ 全局变量 | ✅ ES Modules |
| **依赖管理** | ❌ 手动排序 script | ✅ 自动分析 |
| **HTTP 请求** | ❌ 6 个文件 | ✅ 1 个文件 |
| **全局污染** | ❌ 严重 | ✅ 无污染 |
| **代码压缩** | ❌ 无 | ✅ 自动压缩 |
| **开发体验** | ❌ 手动刷新 | ✅ HMR |
| **npm 包** | ❌ 不支持 | ✅ 支持 |
| **现代语法** | ❌ 受限 | ✅ ES6+ |

---

## 🎓 核心概念

### 1. Entry（入口）
```javascript
entry: './src/index.js'
```
- Webpack 从这里开始分析依赖
- 可以有多个入口（多页应用）

### 2. Output（输出）
```javascript
output: {
  path: path.resolve(__dirname, 'dist'),
  filename: 'bundle.js'
}
```
- 指定打包后的文件输出到哪里
- 可以自定义文件名（支持 hash）

### 3. Plugin（插件）
```javascript
plugins: [
  new HtmlWebpackPlugin({
    template: './src/index.html'
  })
]
```
- 扩展 Webpack 功能
- 这里使用了 `HtmlWebpackPlugin`：
  - 自动生成 HTML
  - 自动注入打包后的 JS
  - 自动处理路径

### 4. Mode（模式）
```bash
# 开发模式
webpack --mode development
- 不压缩代码
- 生成 Source Map
- 启用开发工具

# 生产模式
webpack --mode production
- 压缩代码
- 移除注释
- 优化性能
```

---

## 💡 深入理解

### Webpack 做了什么？

1. **分析依赖**：
```
index.js
  ├── utils.js
  ├── calculator.js
  ├── validator.js
  │   └── utils.js
  └── ui.js
      ├── utils.js
      ├── validator.js
      └── calculator.js
```

2. **构建依赖图**：
- 递归分析所有 `import` 语句
- 找出所有依赖的模块
- 构建完整的依赖关系图

3. **打包成一个文件**：
```javascript
(function(modules) {
  // Webpack 运行时
  function __webpack_require__(moduleId) {
    // 加载模块
  }
  
  // 模块映射
  var moduleMap = {
    './src/index.js': function() { /* ... */ },
    './src/utils.js': function() { /* ... */ },
    // ...
  };
  
  // 启动应用
  __webpack_require__('./src/index.js');
})();
```

4. **生成 HTML**：
```html
<!DOCTYPE html>
<html>
<head>...</head>
<body>
  ...
  <script src="bundle.js"></script>  <!-- 自动注入 -->
</body>
</html>
```

---

## 🎯 思考题

1. **模块化**：
   - ES Modules 和全局变量有什么区别？
   - 为什么 import/export 更好？

2. **依赖管理**：
   - Webpack 如何知道一个模块依赖了哪些其他模块？
   - 为什么不需要手动管理加载顺序了？

3. **性能优化**：
   - 为什么打包成一个文件更快？
   - 多个小文件 vs 一个大文件，哪个更好？

4. **开发体验**：
   - HMR（热模块替换）是如何工作的？
   - 为什么修改代码后浏览器会自动刷新？

---

## 🎯 下一步

完成了 Phase 1.1 的学习，你应该已经：
- ✅ 理解了为什么需要打包工具
- ✅ 体验了 Webpack 的基本功能
- ✅ 理解了模块化的价值
- ✅ 能够配置最简单的 Webpack 项目

**接下来**：
- **Phase 1.2**：配置系统入门 - 深入学习 entry/output/mode 配置
- **Phase 1.3**：Loader 机制 - 处理 CSS、图片等非 JS 文件
- **Phase 1.4**：Plugin 机制 - 深入理解插件系统

---

## 📝 练习建议

1. **修改配置**：
   - 改变输出文件名：`bundle.js` → `app.js`
   - 改变输出目录：`dist` → `build`
   - 添加 hash：`bundle.[contenthash].js`

2. **添加新模块**：
   - 创建 `src/history.js`，记录计算历史
   - 在 `index.js` 中导入并使用
   - 观察 Webpack 如何处理新模块

3. **对比打包结果**：
   - 运行 `npm run build:dev` 和 `npm run build`
   - 对比两个 `bundle.js` 的区别
   - 理解开发模式和生产模式的差异

---

## 🎉 总结

通过这个 Demo，你应该深刻理解了：

1. **Webpack 的核心价值**：
   - 模块化管理
   - 依赖自动分析
   - 打包优化

2. **模块化的好处**：
   - 无全局污染
   - 依赖关系清晰
   - 代码易于维护

3. **开发体验的提升**：
   - HMR 热更新
   - 自动刷新
   - 开发服务器

**这就是现代前端开发的基础！** 🚀

