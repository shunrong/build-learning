# Demo 1: 不用打包工具的痛点演示

## 📖 说明

这是一个简单的计算器应用，**完全不使用任何打包工具**，直接使用传统的 `<script>` 标签加载 JavaScript 文件。

通过这个 Demo，你将亲身体验到不使用打包工具时会遇到的各种问题。

---

## 🎯 学习目标

- 理解为什么需要打包工具
- 体验全局变量污染的问题
- 体验依赖管理的困难
- 体验多个 HTTP 请求对性能的影响

---

## 🚀 运行方式

### 方法 1：直接打开（推荐）
```bash
# 在浏览器中直接打开
open index.html  # macOS
# 或
xdg-open index.html  # Linux
# 或
start index.html  # Windows
```

### 方法 2：使用本地服务器
```bash
# 如果你安装了 Python
python -m http.server 8080
# 然后访问 http://localhost:8080

# 或使用 Node.js 的 http-server
npx http-server -p 8080
```

---

## 🔍 体验要点

### 1. 打开 Network 面板
1. 在浏览器中按 `F12` 打开开发者工具
2. 切换到 `Network` 标签
3. 刷新页面
4. 观察：**加载了 6 个 JS 文件**（index.html + 5 个 .js 文件）

**问题**：
- ❌ 多个 HTTP 请求，增加加载时间
- ❌ 每个文件都有网络开销
- ❌ 大型项目可能有几十上百个文件

---

### 2. 打开 Console 面板
观察控制台输出，你会看到：

```
[时间] ✅ utils.js 加载完成
[时间] ⚠️ 定义了全局变量: appName, version, log, checkBrowser
[时间] ✅ validator.js 加载完成
[时间] ⚠️ 依赖了 utils.js 的 log 函数（但看不出来！）
...
[时间] ⚠️ 覆盖了全局变量 version: 从 1.0.0 变成了 2.0.0
```

**问题**：
- ❌ 所有变量都在全局作用域
- ❌ 变量可能被意外覆盖
- ❌ 依赖关系不明确

---

### 3. 在 Console 中执行
```javascript
// 所有变量都可以在控制台访问（全局污染）
console.log(window.appName);        // "Calculator App"
console.log(window.version);        // "2.0.0" (已被覆盖！)
console.log(window.Calculator);     // {add: ƒ, subtract: ƒ, ...}

// 任何人都可以修改这些变量
window.Calculator.add = function() { return 999; };
handleAdd();  // 现在加法总是返回 999！

// 查看所有污染的全局变量
Object.keys(window).filter(key => 
  typeof window[key] === 'function' && 
  !window[key].toString().includes('[native code]')
);
```

**问题**：
- ❌ 全局变量可以被任意修改
- ❌ 容易导致命名冲突
- ❌ 难以维护和调试

---

### 4. 尝试打乱加载顺序
编辑 `index.html`，把 script 标签的顺序改成：

```html
<!-- ❌ 错误的顺序 -->
<script src="app.js"></script>        <!-- 依赖其他所有文件 -->
<script src="ui.js"></script>
<script src="calculator.js"></script>
<script src="validator.js"></script>
<script src="utils.js"></script>
```

刷新页面，你会看到：
```
Uncaught ReferenceError: log is not defined
```

**问题**：
- ❌ 必须手动管理加载顺序
- ❌ 顺序错了就报错
- ❌ 大型项目的依赖关系像一团乱麻

---

### 5. 尝试使用现代语法
在任何 JS 文件中添加：

```javascript
// ❌ 不支持 ES Modules
import { add } from './calculator.js';

// ❌ 不支持 CommonJS
const utils = require('./utils.js');

// ❌ 不支持箭头函数（如果要兼容 IE）
const add = (a, b) => a + b;

// ❌ 无法使用 npm 包
import _ from 'lodash';
```

**问题**：
- ❌ 无法使用现代 JavaScript 特性
- ❌ 无法使用 npm 生态
- ❌ 无法使用模块化语法

---

## 📊 项目结构

```
01-no-bundler/
├── index.html          # 入口 HTML
├── utils.js            # 工具函数（基础）
├── validator.js        # 验证函数（依赖 utils）
├── calculator.js       # 计算函数（依赖 utils）
├── ui.js               # UI 函数（依赖 validator, calculator）
├── app.js              # 应用入口（依赖所有）
└── README.md           # 本文件
```

**依赖关系**：
```
app.js
  ├── ui.js
  │   ├── validator.js
  │   │   └── utils.js
  │   └── calculator.js
  │       └── utils.js
  └── utils.js
```

**问题**：
- 从代码上看不出这个依赖关系
- 只能通过 script 标签的顺序来保证
- 新人很难理解项目结构

---

## 🐛 存在的问题总结

### 1. 全局变量污染 ⚠️
```javascript
// 所有变量都在 window 对象上
window.appName
window.version
window.Calculator
window.log
// ... 还有十几个
```

### 2. 命名冲突 ⚠️
```javascript
// utils.js
var version = "1.0.0";

// calculator.js
var version = "2.0.0";  // 覆盖了！
```

### 3. 依赖管理困难 ⚠️
```html
<!-- 必须严格按顺序 -->
<script src="utils.js"></script>
<script src="validator.js"></script>  <!-- 依赖 utils -->
<script src="calculator.js"></script> <!-- 依赖 utils -->
<script src="ui.js"></script>         <!-- 依赖 validator, calculator -->
<script src="app.js"></script>        <!-- 依赖所有 -->
```

### 4. 性能问题 ⚠️
```
index.html      100ms
utils.js        50ms
validator.js    50ms
calculator.js   50ms
ui.js           50ms
app.js          50ms
总计：350ms（串行加载）
```

### 5. 无法使用现代特性 ⚠️
- ❌ 不支持 `import/export`
- ❌ 不支持 npm 包
- ❌ 不支持 TypeScript/JSX
- ❌ 不支持 Babel 转译
- ❌ 不支持 Tree Shaking
- ❌ 不支持代码压缩

### 6. 难以维护 ⚠️
- ❌ 依赖关系不清晰
- ❌ 文件多了难以管理
- ❌ 团队协作困难

---

## 💡 思考题

1. **全局变量污染**：
   - 为什么所有变量都在 window 对象上？
   - 如何避免命名冲突？

2. **依赖管理**：
   - 如何从代码上看出依赖关系？
   - 如何自动管理加载顺序？

3. **性能优化**：
   - 如何减少 HTTP 请求数？
   - 如何压缩代码？

4. **现代特性**：
   - 如何使用 ES Modules？
   - 如何使用 npm 包？

---

## 🎯 下一步

体验了这些痛点后，前往 [Demo 2](../02-basic-bundle/) 看看 Webpack 是如何解决这些问题的！

你会发现：
- ✅ 所有文件打包成一个 bundle.js
- ✅ 没有全局变量污染
- ✅ 依赖关系自动管理
- ✅ 支持 ES Modules
- ✅ 代码自动压缩
- ✅ 可以使用 npm 包

**对比是最好的学习方式！** 🚀

