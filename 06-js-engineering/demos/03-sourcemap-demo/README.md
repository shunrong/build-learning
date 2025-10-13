# Demo 3: Source Map 实战

## 📝 简介

本 Demo 演示如何使用 Source Map 调试转换后的代码，对比不同 devtool 选项的效果。

## 🚀 快速开始

### 1. 安装依赖
```bash
npm install
```

### 2. 开发模式
```bash
npm run dev
```

### 3. 构建所有 Source Map 类型
```bash
npm run build:all
```

生成文件：
- `dist/false/` - 无 Source Map
- `dist/eval/` - eval
- `dist/source-map/` - source-map
- `dist/eval-source-map/` - eval-source-map
- `dist/cheap-module-source-map/` - cheap-module-source-map

## 🔍 Chrome DevTools 调试实战

### 步骤 1：打开 DevTools 并定位源码

```bash
# 启动开发服务器
npm run dev
```

**在浏览器中**：
1. 按 `F12` 打开 DevTools
2. 切换到 **Sources** 面板
3. 查看左侧文件树，你会看到三种类型：

```
Sources
├─ 📁 Page (localhost:xxxx)
│  └─ main.js                    ← ❌ 实际加载的压缩代码（不要看）
│
├─ 📁 webpack://                 ← ✅ 你的源码（主要调试这里）
│  └─ .
│     └─ src/
│        ├─ index.js            ← ✅ 打开这个文件！
│        ├─ utils.js
│        └─ api.js
│
└─ 📁 webpack-internal://        ← 🔧 Webpack 内部代码
   └─ ./src/index.js
```

**快速定位源码**：
- 按 `Ctrl+P` (Mac: `Cmd+P`)
- 输入 `index.js`
- 选择 `webpack://./src/index.js` ⭐️

---

### 步骤 2：设置断点

在 `webpack://./src/index.js` 中：
1. 找到 `testError()` 函数（约第 30 行）
2. 点击行号设置断点
3. 页面上点击 "触发错误" 按钮
4. 代码会在断点处暂停

---

### 步骤 3：查看调用栈和变量

**右侧面板**：
- **Call Stack**：查看函数调用链
  ```
  testError          (index.js:30)
  onclick            (index.js:50)
  ```
- **Scope**：查看当前作用域的所有变量
- **Watch**：添加监视表达式（如 `Date.now()`）

---

### 步骤 4：对比有无 Source Map 的差异

#### ✅ 有 Source Map（当前开发模式）

**错误堆栈**：
```
Error: Something went wrong!
  at testError (utils.js:10)        ← 源码位置，可读！
  at onclick (index.js:30)
```

**Sources 面板**：
- ✅ 可以看到 `webpack://./src/` 目录
- ✅ 源码清晰可读
- ✅ 可以设置断点

#### ❌ 无 Source Map（构建 `dist/false/`）

**错误堆栈**：
```
Error: Something went wrong!
  at t (main.js:1:2345)             ← 压缩后位置，无法理解！
  at r (main.js:1:6789)
```

**Sources 面板**：
- ❌ 只能看到 `localhost` 下的压缩代码
- ❌ 变量名被混淆（a, b, c）
- ❌ 无法有效调试

**验证方法**：
```bash
# 1. 构建无 Source Map 版本
npm run build:false

# 2. 启动本地服务器
cd dist/false
npx http-server -p 8081

# 3. 打开 http://localhost:8081
# 4. 按 F12，点击 "触发错误"，观察差异
```

---

### 步骤 5：使用高级调试技巧

#### 条件断点

```
右键点击行号 → Add conditional breakpoint
输入条件：userId > 100

只有当条件为 true 时才会暂停
```

#### Logpoint（无侵入式日志）

```
右键点击行号 → Add logpoint
输入：'Current user:', userData

不修改源码，直接在断点处输出日志
```

#### 黑盒脚本（跳过第三方库）

```
右键 webpack://./node_modules/ → Blackbox script

调试时自动跳过 node_modules，不会进入第三方库代码
```

---

## 🧪 测试不同 devtool 选项

### 构建所有类型

```bash
npm run build:all
```

生成目录：
```
dist/
├─ false/                         # devtool: false
│  └─ main.js (无 Source Map)
│
├─ eval/                          # devtool: 'eval'
│  └─ main.js (使用 eval)
│
├─ source-map/                    # devtool: 'source-map'
│  ├─ main.js
│  └─ main.js.map ⭐️
│
├─ eval-source-map/               # devtool: 'eval-source-map'
│  └─ main.js (内联 Source Map)
│
└─ cheap-module-source-map/       # devtool: 'cheap-module-source-map'
   ├─ main.js
   └─ main.js.map
```

### 逐一测试

```bash
# 测试无 Source Map
cd dist/false && npx http-server -p 8081

# 测试 source-map
cd dist/source-map && npx http-server -p 8082

# 测试 eval-source-map
cd dist/eval-source-map && npx http-server -p 8083
```

每个版本都打开 DevTools → Sources 面板，对比：
- ✅ 是否能看到 `webpack://` 节点？
- ✅ 源码是否清晰可读？
- ✅ 行号是否准确？
- ✅ 错误堆栈是否友好？

---

## 📊 实验结果对比

| devtool | 构建速度 | 重构建速度 | 源码可见性 | 行号准确性 | 调试体验 |
|---------|---------|-----------|----------|----------|---------|
| `false` | 🚀🚀🚀🚀🚀 | 🚀🚀🚀🚀🚀 | ❌ 无 | ❌ 无 | 💀 |
| `eval` | 🚀🚀🚀🚀 | 🚀🚀🚀🚀🚀 | ⚠️ 模块级 | ✅ 行号 | 😐 |
| `cheap-module-source-map` | 🚀🚀🚀 | 🚀🚀🚀 | ✅ 完整 | ✅ 行号 | 😊 |
| `eval-cheap-module-source-map` | 🚀🚀🚀🚀 | 🚀🚀🚀🚀🚀 | ✅ 完整 | ✅ 行号 | 😊 ⭐️ |
| `source-map` | 🚀 | 🚀🚀 | ✅ 完整 | ✅ 行列 | 😍 |
| `eval-source-map` | 🚀🚀 | 🚀🚀🚀 | ✅ 完整 | ✅ 行列 | 😍 |

---

## 💡 推荐配置

### 开发环境 ⭐️

```javascript
devtool: 'eval-cheap-module-source-map'
```

**理由**：
- ✅ 重构建最快（适合 HMR）
- ✅ 能看到完整源码
- ✅ 行号准确（列号不准确，但影响不大）
- ✅ 映射质量优秀

### 生产环境 ⭐️

```javascript
devtool: 'hidden-source-map'
```

**理由**：
- ✅ 生成 Source Map 文件
- ✅ 但不在 `main.js` 中引用（用户无法访问）
- ✅ 可以上传到监控平台（Sentry/Bugsnag）
- ✅ 保护源码安全

---

## 🔧 Source Map 诊断

### 检查 Source Map 是否加载成功

**方法 1：查看 Network 面板**
```
DevTools → Network → 筛选 ".map"
查看 main.js.map 是否加载（状态码 200）
```

**方法 2：查看 Console 警告**
```
如果 Source Map 加载失败，Console 会显示：
⚠️ DevTools failed to load SourceMap
```

**方法 3：检查文件末尾**
```bash
# 查看打包后的文件末尾
tail -n 1 dist/source-map/main.js

# 应该看到：
//# sourceMappingURL=main.js.map
```

---

## 🎯 调试检查清单

**开始调试前**：
- ✅ `devtool` 设置为 `eval-cheap-module-source-map`
- ✅ DevTools → Sources 能看到 `webpack://` 节点
- ✅ 能在 `webpack://./src/` 下找到你的源文件
- ✅ Console 错误堆栈显示源码文件名（如 `index.js:23`）

**调试时**：
- ✅ 在 `webpack://` 下的源码中设置断点（不是 `localhost` 下）
- ✅ 使用 `Ctrl+P` 快速搜索文件
- ✅ 右键 `node_modules` → Blackbox 跳过第三方代码
- ✅ 使用条件断点和 Logpoint 提高效率

**生产环境错误排查**：
- ✅ 使用 `hidden-source-map`
- ✅ 不要将 `.map` 文件部署到公网
- ✅ 上传到错误监控平台
- ✅ 在平台查看还原后的堆栈

---

## 📚 延伸阅读

详细的 Source Map 原理和调试技巧，请查看：
- [../docs/03-source-map.md](../docs/03-source-map.md) - 完整的 Source Map 指南
- Chrome DevTools 实战调试部分（文档第 7 章）

