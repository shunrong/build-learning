# Source Map 原理与实践

## 📖 目录

1. [什么是 Source Map？](#什么是-source-map)
2. [为什么需要 Source Map？](#为什么需要-source-map)
3. [Source Map 工作原理](#source-map-工作原理)
4. [Webpack devtool 选项详解](#webpack-devtool-选项详解)
5. [devtool 类型详解](#devtool-类型详解)
6. [性能对比](#性能对比)
7. [开发 vs 生产环境](#开发-vs-生产环境)
8. [调试技巧](#调试技巧)
9. [Source Map 安全性](#source-map-安全性)
10. [最佳实践](#最佳实践)

---

## 什么是 Source Map?

**Source Map（源码映射）** 是一个存储了源代码与编译后代码位置映射关系的文件。

### 问题场景

```javascript
// 源代码（ES6+，可读）
const greeting = (name) => {
  console.log(`Hello, ${name}!`);
};
greeting('World');

// 编译后代码（ES5，不可读）
var greeting=function(e){console.log("Hello, "+e+"!")};greeting("World");

// ❌ 在浏览器中报错：bundle.js:1
// 你无法知道错误发生在源代码的哪一行
```

### 解决方案

```javascript
// 有了 Source Map
// 浏览器报错：src/index.js:2
//               const greeting = (name) => {
//                     ^
// ✅ 可以精确定位到源代码位置
```

---

## 为什么需要 Source Map？

### 1. 代码经过转换

现代前端开发中，代码会经过多次转换：

```
源代码（TypeScript/JSX）
        ↓
  Babel 转译
        ↓
  Webpack 打包
        ↓
  Terser 压缩
        ↓
最终产物（不可读）
```

### 2. 调试困难

```javascript
// 源代码
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

// 压缩后
function a(b){return b.reduce((c,d)=>c+d.price,0)}

// ❌ 报错信息：bundle.js:1:45
// 完全无法定位原始位置
```

### 3. 生产环境调试

```javascript
// 用户报错：bundle.min.js:12:3456
// 如果没有 Source Map，无法定位问题

// 有 Source Map：src/components/UserProfile.tsx:45:12
// ✅ 可以快速定位并修复
```

---

## Source Map 工作原理

### 1. Source Map 文件结构

```javascript
// bundle.js.map
{
  "version": 3,                    // Source Map 版本
  "file": "bundle.js",             // 生成的文件
  "sources": [                     // 源文件列表
    "src/index.js",
    "src/utils.js"
  ],
  "sourcesContent": [              // 源文件内容（可选）
    "const greeting = ...",
    "export const add = ..."
  ],
  "names": [                       // 原始变量名
    "greeting",
    "name",
    "console",
    "log"
  ],
  "mappings": "AAAA,MAAM,CAAC..."  // 映射信息（Base64 VLQ 编码）
}
```

### 2. mappings 字段解析

**mappings** 使用 **Base64 VLQ（Variable Length Quantity）** 编码，记录位置映射。

```
AAAA,MAAM,CAAC,QAAQ,GAAG,CAAC...

解码后表示：
- 生成代码的 列号
- 源文件索引
- 源代码的 行号
- 源代码的 列号
- 原始变量名索引
```

### 3. 映射过程

```javascript
// 1. 浏览器加载 bundle.js
// 2. bundle.js 末尾有注释
//# sourceMappingURL=bundle.js.map

// 3. 浏览器解析 Source Map
// 4. 建立位置映射关系

// 5. 报错时自动映射
bundle.js:1:234  →  src/index.js:15:8
```

### 4. 引用方式

#### 内联（Inline）

```javascript
// bundle.js 末尾
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjoz...

// 优点：单文件，方便
// 缺点：体积大，性能差
```

#### 外链（External）

```javascript
// bundle.js 末尾
//# sourceMappingURL=bundle.js.map

// 优点：不影响主文件体积
// 缺点：需要额外请求
```

---

## Webpack devtool 选项详解

Webpack 通过 `devtool` 选项控制 Source Map 的生成方式。

### 配置位置

```javascript
// webpack.config.js
module.exports = {
  devtool: 'source-map'  // 配置 Source Map 类型
};
```

### 命名规则

```
[inline-|hidden-|eval-][nosources-][cheap-[module-]]source-map
```

**关键词含义**：

| 关键词 | 含义 |
|--------|------|
| **eval** | 使用 `eval()` 包裹模块代码，速度最快 |
| **inline** | Source Map 内联到 bundle 中（DataURL） |
| **hidden** | 生成 Source Map 但不引用（安全） |
| **nosources** | 不包含源代码内容（安全） |
| **cheap** | 忽略列信息，只保留行信息 |
| **module** | 包含 Loader 的 Source Map（Babel 等） |
| **source-map** | 生成完整的外部 Source Map 文件 |

---

## devtool 类型详解

### 1️⃣ (none) - 不生成

```javascript
devtool: false  // 或不配置
```

**特点**：
- ✅ 构建最快
- ✅ 体积最小
- ❌ 无法调试

**适用**：
- 生产环境（不想暴露源码）

---

### 2️⃣ eval

```javascript
devtool: 'eval'
```

**生成代码**：

```javascript
eval("var greeting = function(name) {...}\n//# sourceURL=webpack://my-app/./src/index.js");
```

**特点**：
- ✅ 构建极快（模块用 eval 包裹）
- ✅ 重构建极快
- ❌ 映射到转换后的代码（不是源码）
- ❌ 无法正确显示行号

**适用**：
- 不需要精确调试的开发环境

---

### 3️⃣ source-map

```javascript
devtool: 'source-map'
```

**生成文件**：
- `bundle.js`
- `bundle.js.map` （完整的 Source Map）

**特点**：
- ✅ 最高质量（完整的行列映射）
- ✅ 映射到原始源码
- ❌ 构建最慢
- ❌ 重构建最慢

**适用**：
- 生产环境（需要调试）

---

### 4️⃣ eval-source-map

```javascript
devtool: 'eval-source-map'
```

**生成代码**：

```javascript
eval("var greeting = ...\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,...");
```

**特点**：
- ✅ 高质量（完整的行列映射）
- ✅ 映射到原始源码
- ✅ 重构建较快
- ❌ 初始构建慢
- ❌ eval 包裹，浏览器有性能损耗

**适用**：
- 开发环境（需要精确调试）

---

### 5️⃣ cheap-source-map

```javascript
devtool: 'cheap-source-map'
```

**特点**：
- ✅ 构建较快（只映射行，不映射列）
- ✅ 体积较小
- ❌ 映射到转换后的代码（Babel 转译后）
- ❌ 无法精确到列

**适用**：
- 开发环境（不需要精确到列）

---

### 6️⃣ cheap-module-source-map

```javascript
devtool: 'cheap-module-source-map'
```

**特点**：
- ✅ 构建较快（只映射行）
- ✅ 映射到原始源码（包含 Loader 处理前）
- ❌ 无法精确到列

**适用**：
- 开发环境（推荐）⭐️

---

### 7️⃣ eval-cheap-module-source-map

```javascript
devtool: 'eval-cheap-module-source-map'
```

**特点**：
- ✅ 构建快（eval + 只映射行）
- ✅ 重构建极快
- ✅ 映射到原始源码
- ❌ 无法精确到列

**适用**：
- 开发环境（速度优先）⭐️⭐️⭐️

---

### 8️⃣ hidden-source-map

```javascript
devtool: 'hidden-source-map'
```

**生成文件**：
- `bundle.js`（无 sourceMappingURL 注释）
- `bundle.js.map`

**特点**：
- ✅ 不暴露 Source Map 引用
- ✅ 可以手动上传到错误监控平台
- ❌ 浏览器无法自动加载

**适用**：
- 生产环境（错误监控）⭐️

---

### 9️⃣ nosources-source-map

```javascript
devtool: 'nosources-source-map'
```

**特点**：
- ✅ 可以看到文件名和行号
- ✅ 不暴露源代码内容
- ❌ 无法查看源码

**适用**：
- 生产环境（安全优先）⭐️

---

## 性能对比

### 构建速度对比

| devtool | 初始构建 | 重构建 | 生产环境 | 质量 |
|---------|----------|--------|----------|------|
| **(none)** | ⚡⚡⚡⚡⚡ | ⚡⚡⚡⚡⚡ | ✅ | - |
| **eval** | ⚡⚡⚡⚡⚡ | ⚡⚡⚡⚡⚡ | ❌ | 生成代码 |
| **eval-cheap-source-map** | ⚡⚡⚡⚡ | ⚡⚡⚡⚡⚡ | ❌ | 转换代码（行） |
| **eval-cheap-module-source-map** | ⚡⚡⚡ | ⚡⚡⚡⚡ | ❌ | 原始代码（行） |
| **eval-source-map** | ⚡⚡ | ⚡⚡⚡⚡ | ❌ | 原始代码（行列） |
| **cheap-source-map** | ⚡⚡⚡ | ⚡⚡ | ❌ | 转换代码（行） |
| **cheap-module-source-map** | ⚡⚡ | ⚡⚡⚡ | ❌ | 原始代码（行） |
| **source-map** | ⚡ | ⚡ | ✅ | 原始代码（行列） |
| **hidden-source-map** | ⚡ | ⚡ | ✅ | 原始代码（行列） |
| **nosources-source-map** | ⚡ | ⚡ | ✅ | 原始代码（行列）无源码 |

### 实测数据（示例项目）

```
项目：React 应用，50 个模块

(none)                          : 1.2s / 0.3s
eval                            : 1.3s / 0.3s
eval-cheap-source-map           : 1.5s / 0.4s
eval-cheap-module-source-map    : 1.8s / 0.5s  ⭐️ 开发推荐
eval-source-map                 : 2.5s / 0.8s
cheap-module-source-map         : 2.0s / 1.2s
source-map                      : 3.5s / 2.5s  ⭐️ 生产推荐
```

---

## 开发 vs 生产环境

### 开发环境（推荐配置）

#### 选项 1：速度优先（推荐）⭐️⭐️⭐️⭐️⭐️

```javascript
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map'
};
```

**特点**：
- ✅ 构建快
- ✅ 重构建极快
- ✅ 映射到原始源码
- ✅ 行级定位（足够用）

---

#### 选项 2：质量优先

```javascript
module.exports = {
  mode: 'development',
  devtool: 'eval-source-map'
};
```

**特点**：
- ✅ 高质量（行列精确）
- ✅ 映射到原始源码
- ❌ 构建稍慢

---

### 生产环境（推荐配置）

#### 选项 1：完整 Source Map（需要调试）⭐️⭐️⭐️⭐️

```javascript
module.exports = {
  mode: 'production',
  devtool: 'source-map'
};
```

**特点**：
- ✅ 完整映射
- ✅ 可以调试生产问题
- ❌ 构建慢
- ❌ 暴露源码

**适用**：
- 内部系统
- 可以接受暴露源码

---

#### 选项 2：隐藏 Source Map（错误监控）⭐️⭐️⭐️⭐️⭐️

```javascript
module.exports = {
  mode: 'production',
  devtool: 'hidden-source-map'
};
```

**特点**：
- ✅ 生成完整 Source Map
- ✅ 不暴露给用户
- ✅ 可上传到 Sentry 等监控平台

**适用**：
- 公开产品
- 使用错误监控服务

---

#### 选项 3：不包含源码（安全优先）⭐️⭐️⭐️

```javascript
module.exports = {
  mode: 'production',
  devtool: 'nosources-source-map'
};
```

**特点**：
- ✅ 可以看到文件名和行号
- ✅ 不暴露源码内容
- ❌ 无法查看源码

**适用**：
- 商业产品
- 极度注重安全

---

#### 选项 4：不生成（最安全）⭐️⭐️

```javascript
module.exports = {
  mode: 'production',
  devtool: false
};
```

**特点**：
- ✅ 最安全
- ✅ 体积最小
- ❌ 无法调试

**适用**：
- 不需要调试生产环境
- 极度注重安全和体积

---

### 配置示例

```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    mode: argv.mode,
    devtool: isDev
      ? 'eval-cheap-module-source-map'  // 开发：快速 + 准确
      : 'hidden-source-map',            // 生产：安全 + 监控
  };
};
```

---

## 调试技巧

### 1. Chrome DevTools 使用

```javascript
// 1. 打开 DevTools（F12）
// 2. Sources 面板
// 3. webpack:// 目录下可以看到原始源码

webpack://
  ├─ src/
  │   ├─ index.js      // ✅ 原始源码
  │   ├─ utils.js
  │   └─ components/
  └─ node_modules/
```

### 2. 断点调试

```javascript
// 源代码中直接打断点
function calculateTotal(items) {
  debugger;  // 或在 DevTools 中点击行号
  return items.reduce((sum, item) => sum + item.price, 0);
}

// ✅ 断点会停在源码位置，而不是打包后的代码
```

### 3. 错误堆栈

```javascript
// 没有 Source Map
Error: Cannot read property 'price' of undefined
    at a (bundle.js:1:234)  // ❌ 无法定位

// 有 Source Map
Error: Cannot read property 'price' of undefined
    at calculateTotal (src/utils.js:15:34)  // ✅ 精确定位
    at App (src/App.js:25:10)
```

### 4. console.log 定位

```javascript
// 源代码
console.log('User data:', userData);

// 浏览器控制台显示
User data: {...}
  src/components/UserProfile.js:42  // ✅ 显示源码位置
```

### 5. 性能分析

```javascript
// DevTools → Performance
// 录制性能，可以看到原始函数名

function expensiveCalculation() {
  // ...
}

// ✅ Performance 面板会显示 "expensiveCalculation"
// 而不是压缩后的 "a" 或 "b"
```

---

## Source Map 安全性

### 1. 风险

```javascript
// ❌ 使用 source-map
// 用户可以：
// 1. 看到完整的源代码
// 2. 看到文件结构
// 3. 看到注释和变量名
// 4. 可能看到敏感信息（API密钥等）
```

### 2. 解决方案

#### 方案 1：hidden-source-map（推荐）

```javascript
// webpack.config.js
module.exports = {
  devtool: 'hidden-source-map'
};

// 1. 生成 Source Map
// 2. 不在 bundle.js 中引用
// 3. 上传到错误监控平台（Sentry）
// 4. 用户无法访问
```

#### 方案 2：nosources-source-map

```javascript
module.exports = {
  devtool: 'nosources-source-map'
};

// 可以看到文件名和行号
// 但看不到源码内容
```

#### 方案 3：服务器限制访问

```nginx
# Nginx 配置
location ~ \.map$ {
  # 只允许内网访问
  allow 192.168.0.0/16;
  deny all;
}
```

#### 方案 4：环境变量控制

```javascript
// webpack.config.js
module.exports = {
  devtool: process.env.ENABLE_SOURCE_MAP === 'true'
    ? 'source-map'
    : false
};
```

### 3. 错误监控集成

```javascript
// 上传 Source Map 到 Sentry
const SentryWebpackPlugin = require('@sentry/webpack-plugin');

module.exports = {
  devtool: 'hidden-source-map',
  plugins: [
    new SentryWebpackPlugin({
      include: './dist',
      authToken: process.env.SENTRY_AUTH_TOKEN,
      org: 'my-org',
      project: 'my-project',
      // 上传后删除本地 Source Map
      cleanArtifacts: true
    })
  ]
};
```

---

## 最佳实践

### 1. 开发环境

```javascript
// ✅ 推荐
module.exports = {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map'
};

// 理由：
// - 构建快
// - 映射准确
// - 开发体验好
```

### 2. 生产环境

```javascript
// ✅ 推荐（使用错误监控）
module.exports = {
  mode: 'production',
  devtool: 'hidden-source-map'
};

// ✅ 推荐（不需要调试）
module.exports = {
  mode: 'production',
  devtool: false
};

// ⚠️ 谨慎使用（会暴露源码）
module.exports = {
  mode: 'production',
  devtool: 'source-map'
};
```

### 3. 分环境配置

```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  const isStaging = process.env.NODE_ENV === 'staging';
  
  let devtool;
  if (isDev) {
    devtool = 'eval-cheap-module-source-map';
  } else if (isStaging) {
    devtool = 'source-map';  // 预发布环境可以完整调试
  } else {
    devtool = 'hidden-source-map';  // 生产环境隐藏
  }
  
  return {
    mode: argv.mode,
    devtool
  };
};
```

### 4. 第三方库

```javascript
// 如果第三方库已经提供了 Source Map
// Webpack 会自动处理

// node_modules/some-lib/dist/
//   ├─ index.js
//   └─ index.js.map  // ✅ 自动识别
```

### 5. 性能优化

```javascript
// 大型项目中，可以只对自己的代码生成 Source Map
module.exports = {
  devtool: 'eval-cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,  // 排除第三方库
        use: {
          loader: 'babel-loader',
          options: {
            sourceMaps: true  // 只为自己的代码生成
          }
        }
      }
    ]
  }
};
```

---

## 📱 Chrome DevTools 实战调试指南

### Sources 面板结构解析

当你打开 Chrome DevTools 的 Sources 面板时，会看到三个主要区域：

#### 1️⃣ 文件树区域（左侧）

Sources 面板左侧显示了三种不同类型的文件来源：

```
Sources
├─ 📁 Page (页面)
│  └─ 📁 localhost:8080
│     ├─ index.html          ← 实际加载的 HTML
│     ├─ main.js             ← 实际加载的打包后 JS（已压缩/转译）
│     └─ main.js.map         ← Source Map 文件（如果可见）
│
├─ 📁 webpack:// (Webpack 源码)  ⭐️ 调试时主要看这里
│  ├─ . (项目根目录)
│  │  └─ src/
│  │     ├─ index.js         ← 你的源代码（未转译）
│  │     ├─ utils.js
│  │     └─ api.js
│  │
│  └─ ./node_modules/        ← 第三方库源码
│     ├─ lodash/
│     └─ axios/
│
└─ 📁 webpack-internal:// (Webpack 内部)
   ├─ ./src/index.js         ← Webpack 运行时包装后的模块
   └─ ./src/utils.js         ← 带有模块 ID 和热更新代码
```

#### 📋 三种文件来源详解

| 区域 | DevTools 实际显示 | 作用 | 调试时使用 |
|------|------------------|------|-----------|
| **Page** | `localhost:8080/main.js` | 浏览器**实际下载并执行**的文件（所有模块打包+压缩） | ❌ 不推荐 |
| **webpack://** | `03-sourcemap-demo/./src/index.js` | 通过 Source Map **映射回的源码**（和你写的代码一模一样） | ✅ **主要使用** |
| **webpack-internal://** | `webpack-internal:///./src/index.js` | Webpack **模块包装层**（源码+运行时逻辑） | 🔧 高级调试 |

**注意**：
- `webpack://` 只是协议前缀，实际显示的是项目名（来自 `package.json` 的 `name` 字段）
- 例如：`webpack://03-sourcemap-demo/./src/index.js` 在 DevTools 中显示为 `03-sourcemap-demo/./src/index.js`

---

### 🔬 深度解析：三种文件来源的本质区别

很多开发者对 `webpack-internal://` 的作用感到困惑，让我们通过一个实际例子深入理解：

#### 示例：一个简单的模块

**你写的源码**：
```javascript
// src/utils.js
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}
```

#### 在 DevTools 中的三种呈现形式

##### 1️⃣ webpack://03-sourcemap-demo/./src/utils.js（✅ 主要调试这个）

**这是什么**：通过 Source Map 映射回的**原始源码**

```javascript
// 和你写的代码完全一样！
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}
```

**特点**：
- ✅ 清晰可读
- ✅ 变量名未混淆
- ✅ 格式完整保留
- ✅ **这是你应该调试的地方**

---

##### 2️⃣ webpack-internal:///./src/utils.js（🔧 高级调试用）

**这是什么**：Webpack **模块包装层**，包含了运行时逻辑

```javascript
/***/ "./src/utils.js":
/*!***********************!*\
  !*** ./src/utils.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

  "use strict";
  eval(`
    __webpack_require__.r(__webpack_exports__);
    
    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
    /* harmony export */   "add": () => (/* binding */ add),
    /* harmony export */   "multiply": () => (/* binding */ multiply)
    /* harmony export */ });
    
    function add(a, b) {
      return a + b;
    }
    
    function multiply(a, b) {
      return a * b;
    }
    
    //# sourceURL=webpack-internal:///./src/utils.js
  `);

/***/ }),
```

**特点**：
- 🔧 包含 Webpack 运行时代码（`__webpack_require__`, `__webpack_exports__`）
- 🔧 显示模块的导出/导入处理
- 🔧 显示模块 ID 和依赖关系
- 🔧 如果启用 HMR，还会包含热更新代码
- ⚠️ **不是"编译后的文件"，而是 Webpack 的模块包装**

**何时查看**：
- 调试 Webpack 模块加载机制
- 排查模块导入/导出问题
- 理解 HMR 工作原理
- 分析模块依赖关系

---

##### 3️⃣ localhost:8080/main.js（❌ 不要调试这个）

**这是什么**：**最终打包的文件**，所有模块合并 + Webpack 运行时

```javascript
// 生产环境（压缩后）
(function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n(0)})([function(e,t,n){"use strict";n.r(t),n.d(t,{add:(()=>r),multiply:(()=>o)});const r=(e,t)=>e+t,o=(e,t)=>e*t}]);

// 开发环境（未压缩，但包含所有运行时）
(function(modules) {
  // Webpack 运行时代码（200+ 行）
  var installedModules = {};
  function __webpack_require__(moduleId) { ... }
  __webpack_require__.r = function(exports) { ... };
  __webpack_require__.d = function(exports, definition) { ... };
  // ... 更多运行时代码
  
  // 模块集合
  return __webpack_require__("./src/utils.js");
})({
  "./src/utils.js": function(module, __webpack_exports__, __webpack_require__) {
    eval("...");
  },
  "./src/index.js": function(module, __webpack_exports__, __webpack_require__) {
    eval("...");
  }
  // ... 所有模块
});
```

**特点**：
- ❌ 生产环境：压缩混淆，完全无法阅读
- ❌ 开发环境：包含大量 Webpack 运行时代码，干扰调试
- ❌ 所有模块混在一起
- ❌ **这是浏览器实际执行的文件，但不应该在这里调试**

---

#### 📊 三者关系总结

```
你的源码 (src/utils.js)
    │
    │ Babel 转译
    ↓
webpack://... (源码，通过 Source Map 映射)  ← ✅ 在这里调试
    │
    │ Webpack 模块包装（添加 __webpack_require__ 等）
    ↓
webpack-internal://... (模块包装层)          ← 🔧 高级调试
    │
    │ Webpack 打包合并（所有模块 + 运行时）
    ↓
localhost/main.js (最终打包文件)              ← ❌ 不要在这调试
    │
    │ 浏览器执行
    ↓
实际运行
```

---

#### 🎯 关键理解

1. **webpack-internal:// 不是"编译后的对应文件"**
   - 它是 Webpack 的**模块包装层**
   - 包含了 Webpack 如何加载、导出、依赖管理的逻辑
   - 它和 `webpack://` **不是一一对应的编译关系**

2. **三者的关系不是简单的"编译链"**
   ```
   ❌ 错误理解：
   webpack:// (源码) 
     → webpack-internal:// (编译后)
       → localhost (打包后)
   
   ✅ 正确理解：
   webpack:// (源码，Source Map 映射)
   webpack-internal:// (模块包装，添加运行时)
   localhost (所有模块合并 + 运行时)
   ```

3. **为什么需要 webpack-internal://?**
   - 调试 Webpack 模块系统
   - 理解模块如何被加载（`__webpack_require__`）
   - 查看 HMR 代码如何注入
   - 排查模块循环依赖问题
   - 分析代码分割（Code Splitting）边界

---

#### 💡 实践建议

**日常开发调试**：
```
✅ 永远在 webpack://03-sourcemap-demo/./src/ 下调试
   - 这是你的源码
   - 清晰可读
   - 和你写的代码完全一致
```

**遇到模块加载问题**：
```
🔧 可以查看 webpack-internal:///./src/
   - 查看模块导出是否正确
   - 检查 __webpack_require__ 调用
   - 排查循环依赖
```

**不要做**：
```
❌ 不要在 localhost/main.js 中调试
   - 生产环境：完全无法阅读
   - 开发环境：大量干扰代码
   - 浪费时间
```

---

### 🔍 实战：如何定位和调试代码

#### 方法 1️⃣：通过文件树找到源码（推荐）

```
步骤 1：按 F12 打开 DevTools
步骤 2：切换到 Sources 面板
步骤 3：展开左侧 "webpack://" 节点  ⭐️
步骤 4：展开 "./" (项目根目录)
步骤 5：找到 "src/" 目录，点击你的源文件（如 index.js）
步骤 6：在源码中设置断点（点击行号）
```

**判断是否启用了 Source Map**：
- ✅ 如果能看到 `webpack://` 节点，且能看到原始的 `src/` 目录，说明 Source Map **已启用**
- ❌ 如果只能看到 `localhost` 下的压缩代码，说明 Source Map **未启用**

#### 方法 2️⃣：通过 Ctrl+P 快速搜索（最快）

```
步骤 1：在 Sources 面板中按 Ctrl+P (Mac: Cmd+P)
步骤 2：输入文件名，如 "index.js"
步骤 3：从下拉列表选择 "webpack://./src/index.js"  ⭐️
步骤 4：设置断点
```

**提示**：搜索结果会显示多个同名文件，选择 `webpack://` 开头的！

#### 方法 3️⃣：在代码中触发断点

在你的源码中添加 `debugger;` 语句：

```javascript
// src/index.js
function handleClick() {
  debugger;  // ← 执行到这里会自动暂停
  console.log('Button clicked');
}
```

浏览器会自动定位到源码位置！

#### 方法 4️⃣：从错误堆栈跳转

当代码抛出错误时：

```
步骤 1：打开 Console 面板，查看错误信息
步骤 2：点击错误堆栈中的文件链接（通常显示为 index.js:23）
步骤 3：DevTools 会自动跳转到 webpack:// 下的源码位置  ⭐️
```

**Source Map 的作用**：将错误堆栈中的 `main.js:1:2345` 自动映射为 `src/index.js:23:5`

---

### 🎨 Source Map 可视化对比

#### ❌ 没有 Source Map（devtool: false）

```javascript
// Page → localhost:8080/main.js (实际加载的文件)
!function(e){var t={};function n(r){if(t[r])return t[r].exports;var o=t[r]={i:r,l:!1,exports:{}};return e[r].call(o.exports,o,o.exports,n),o.l=!0,o.exports}...

// ❌ 无法阅读，无法调试
// ❌ Sources 面板只能看到这些压缩代码
```

#### ✅ 有 Source Map（devtool: 'eval-cheap-module-source-map'）

```javascript
// Page → localhost:8080/main.js (实际加载的文件，仍然是压缩的)
!function(e){var t={};function n(r)...

// ✅ webpack://./src/index.js (映射回的源码，可读！)
import { fetchUserData } from './api.js';
import { formatDate } from './utils.js';

async function init() {
  try {
    const userData = await fetchUserData();
    console.log('User:', userData);
  } catch (error) {
    console.error('Error:', error);  // ← 可以在这里打断点！
  }
}

init();
```

---

### 🛠️ 实战演练：调试 03-sourcemap-demo

让我们用实际的 demo 演练一次完整的调试流程：

#### 场景：调试一个 API 请求错误

```bash
# 启动 demo
cd 06-js-engineering/demos/03-sourcemap-demo
npm run dev
```

#### 步骤 1：打开页面，触发错误

1. 浏览器打开 `http://localhost:xxxx`
2. 点击 "模拟 API 调用" 按钮
3. Console 中会显示错误

#### 步骤 2：从错误堆栈定位源码

**Console 中的错误（有 Source Map）**：
```
❌ Error: API request failed
    at fetchData (api.js:15)        ← 点击这里
    at async init (index.js:23)     ← 自动映射到源码位置
```

**Console 中的错误（无 Source Map）**：
```
❌ Error: API request failed
    at e (main.js:1:2345)           ← 点击后只能看到压缩代码
    at async r (main.js:1:6789)     ← 完全无法理解
```

#### 步骤 3：设置断点

1. 点击错误堆栈中的 `api.js:15`
2. DevTools 自动打开 `webpack://./src/api.js`
3. 在第 15 行（抛出错误的位置）点击行号设置断点

#### 步骤 4：重新触发，调试

1. 刷新页面
2. 再次点击 "模拟 API 调用" 按钮
3. 代码执行到断点处自动暂停
4. 右侧 **Scope** 面板查看变量值
5. 使用 **Step Over / Step Into** 单步执行

#### 步骤 5：查看调用栈

右侧 **Call Stack** 面板显示：
```
Call Stack:
  fetchData              (api.js:15)       ← 当前位置
  init                   (index.js:23)     ← 调用者
  onclick                (index.js:50)     ← 事件处理
```

**Source Map 的作用**：所有堆栈都显示**源码位置**，而不是 `main.js:1:2345`！

---

### 💡 实用调试技巧

#### 1. 条件断点

```javascript
// 只在 userId > 100 时暂停
右键点击行号 → Add conditional breakpoint
输入：userId > 100
```

#### 2. Logpoint（不影响代码的日志）

```javascript
// 不修改源码，直接在 DevTools 中添加日志
右键点击行号 → Add logpoint
输入：'userId:', userId, 'timestamp:', Date.now()
```

#### 3. Watch 表达式

在右侧 **Watch** 面板添加表达式：
```javascript
userData.name
Date.now()
localStorage.getItem('token')
```

#### 4. 黑盒脚本（跳过第三方库）

```javascript
// 调试时跳过 node_modules
右键点击 webpack://./node_modules/ → Blackbox script
```

#### 5. 本地覆盖（Local Overrides）

```
Sources → Overrides → Enable Local Overrides
选择本地文件夹
修改 webpack:// 下的源码
刷新页面，修改仍然生效！⭐️
```

---

### 🔧 Source Map 诊断工具

#### 检查 Source Map 是否正确加载

**方法 1：查看网络请求**
```
DevTools → Network 面板
筛选 ".map"
查看是否成功加载 main.js.map (状态码 200)
```

**方法 2：查看控制台警告**
```
如果 Source Map 失败，Console 会显示：
⚠️ DevTools failed to load SourceMap: Could not load content for http://localhost:8080/main.js.map
```

**方法 3：检查 Source Map 引用**
```bash
# 查看打包后的文件末尾
cat dist/main.js | tail -n 1

# 应该包含：
//# sourceMappingURL=main.js.map
```

#### 验证 Source Map 映射是否准确

```javascript
// 1. 在源码中添加 console.log
console.log('Line 23 in index.js');

// 2. 打开 Console，点击日志中的文件链接
// 3. 应该跳转到 webpack://./src/index.js:23
// 4. 如果跳转到错误的行号，说明 Source Map 质量不佳
```

---

### 📊 不同 devtool 在 DevTools 中的表现

| devtool | Sources 显示 | 行号准确性 | 列号准确性 | 调试体验 |
|---------|-------------|----------|----------|---------|
| `false` | ❌ 只有压缩代码 | ❌ 无 | ❌ 无 | 💀 无法调试 |
| `eval` | ⚠️ 模块级源码 | ✅ 准确 | ❌ 无 | 😐 基本可用 |
| `cheap-source-map` | ✅ 完整源码 | ✅ 准确 | ❌ 无 | 😊 良好 |
| `source-map` | ✅ 完整源码 | ✅ 准确 | ✅ 准确 | 😍 完美 |
| `eval-cheap-module-source-map` | ✅ 完整源码 | ✅ 准确 | ❌ 无 | 😊 推荐开发 |

---

### 🎯 快速判断：我应该看哪个文件？

```
📌 调试时的黄金法则：永远在 webpack:// 下找源码！

✅ 推荐查看：
  webpack://./src/index.js          ← 你的源码
  webpack://./src/components/       ← 你的组件
  webpack://./src/utils/            ← 你的工具函数

❌ 不要看：
  localhost:8080/main.js            ← 压缩后的代码（看不懂）
  webpack-internal:///              ← Webpack 内部模块（有干扰）

🔧 高级场景：
  如果需要调试 Webpack 热更新逻辑或模块加载机制，
  可以查看 webpack-internal:// 下的代码
```

---

### 🚀 实战检查清单

**开发环境调试前检查**：
- ✅ `devtool` 设置为 `eval-cheap-module-source-map`
- ✅ DevTools → Sources 能看到 `webpack://./src/` 目录
- ✅ Network 中成功加载 `.map` 文件（如果使用独立文件）
- ✅ Console 错误堆栈显示源码文件名（如 `index.js:23`）

**生产环境错误排查**：
- ✅ `devtool` 设置为 `hidden-source-map`
- ✅ Source Map 文件**不要部署到公网**
- ✅ 使用错误监控平台（Sentry/Bugsnag）上传 Source Map
- ✅ 在监控平台查看还原后的错误堆栈

---

## 🎯 总结

### 核心要点

1. **Source Map 的作用**：将编译后代码映射回源代码，方便调试
2. **devtool 选项**：Webpack 提供多种 Source Map 类型
3. **开发环境**：`eval-cheap-module-source-map`（快速 + 准确）⭐️
4. **生产环境**：`hidden-source-map`（安全 + 监控）⭐️
5. **安全性**：不要在生产环境暴露完整 Source Map

### 快速决策

```
开发环境：
  ├─ 速度优先 → eval-cheap-module-source-map ⭐️⭐️⭐️⭐️⭐️
  └─ 质量优先 → eval-source-map ⭐️⭐️⭐️⭐️

生产环境：
  ├─ 使用错误监控 → hidden-source-map ⭐️⭐️⭐️⭐️⭐️
  ├─ 需要调试 → source-map ⭐️⭐️⭐️
  ├─ 安全优先 → nosources-source-map ⭐️⭐️⭐️
  └─ 最安全 → false ⭐️⭐️
```

### 推荐配置

```javascript
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    mode: argv.mode,
    devtool: isDev
      ? 'eval-cheap-module-source-map'
      : 'hidden-source-map'
  };
};
```

### 常见面试题

1. **什么是 Source Map？**
   - 答：存储源码与编译后代码映射关系的文件

2. **为什么需要 Source Map？**
   - 答：代码经过转译/压缩后无法调试，Source Map 可以映射回源码

3. **Source Map 的工作原理？**
   - 答：通过 mappings 字段记录位置对应关系（Base64 VLQ 编码）

4. **开发环境推荐什么 devtool？**
   - 答：eval-cheap-module-source-map（快速 + 准确）

5. **生产环境推荐什么 devtool？**
   - 答：hidden-source-map（安全 + 可监控）或 false（最安全）

6. **eval 的优缺点？**
   - 答：优点是构建快，缺点是映射质量差、有性能损耗

7. **hidden-source-map 的作用？**
   - 答：生成 Source Map 但不引用，可上传到监控平台，用户无法访问

8. **如何保护 Source Map 安全？**
   - 答：使用 hidden/nosources-source-map、服务器限制访问、错误监控平台

---

**下一步**：学习 [JavaScript 模块化方案](./04-module-systems.md)，了解现代模块化的最佳实践。

