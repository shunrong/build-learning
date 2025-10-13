# TypeScript 基础

## 📖 什么是 TypeScript？

**TypeScript** 是 JavaScript 的超集，添加了类型系统和其他特性。

### 优势

- ✅ 类型安全（编译时发现错误）
- ✅ 更好的 IDE 支持（智能提示）
- ✅ 更好的代码可维护性
- ✅ 更好的重构体验

---

## tsconfig.json 配置

### 基础配置

```json
{
  "compilerOptions": {
    // 编译目标
    "target": "ES2020",
    
    // 模块系统
    "module": "ESNext",
    
    // 库文件
    "lib": ["ES2020", "DOM"],
    
    // JSX 支持
    "jsx": "react-jsx",
    
    // 严格模式
    "strict": true,
    
    // 模块解析
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    
    // Source Map
    "sourceMap": true,
    
    // 输出目录
    "outDir": "./dist",
    
    // 跳过库检查（加速编译）
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

## 关键配置项详解

### 1. target

指定编译后的 JavaScript 版本。

```json
{
  "target": "ES5"      // 兼容性最好，体积较大
  "target": "ES2015"   // 现代浏览器
  "target": "ES2020"   // 推荐 ⭐️
  "target": "ESNext"   // 最新特性
}
```

### 2. module

指定模块系统。

```json
{
  "module": "CommonJS"   // Node.js
  "module": "ESNext"     // 推荐（Webpack 处理）⭐️
  "module": "UMD"        // 通用模块
}
```

### 3. strict

启用所有严格类型检查选项。

```json
{
  "strict": true  // 推荐 ⭐️
}
```

等价于：
```json
{
  "noImplicitAny": true,
  "strictNullChecks": true,
  "strictFunctionTypes": true,
  "strictBindCallApply": true,
  "strictPropertyInitialization": true,
  "noImplicitThis": true,
  "alwaysStrict": true
}
```

### 4. jsx

JSX 支持（React 项目）。

```json
{
  "jsx": "react"         // React 17 之前
  "jsx": "react-jsx"     // React 17+ 推荐 ⭐️
  "jsx": "preserve"      // 不转换（Babel 处理）
}
```

---

## 🔍 TypeScript 的双重职能

### 为什么一个工具有两个职能？

TypeScript 同时承担 **编译器（Compiler）** 和 **类型检查器（Type Checker）** 的角色。

#### 1️⃣ 类型检查器（Type Checker）

```typescript
// 源码
function add(a: number, b: number): number {
  return a + b;
}

add(1, "2");  // ❌ 类型错误！
//     ^^^
// Argument of type 'string' is not assignable to parameter of type 'number'
```

**职责**：
- ✅ 分析类型注解
- ✅ 推导类型信息
- ✅ 检查类型兼容性
- ✅ 报告类型错误
- ❌ **不生成 JS 文件**

#### 2️⃣ 编译器（Compiler）

```typescript
// TypeScript 源码
const greeting = (name: string): string => {
  return `Hello, ${name}!`;
};

// ⬇️ 编译后的 JavaScript（target: ES5）
var greeting = function (name) {
  return "Hello, " + name + "!";
};
```

**职责**：
- ✅ 移除类型注解
- ✅ 转换语法（ES6+ → ES5）
- ✅ 生成 JavaScript 文件
- ✅ 生成 Source Map
- ✅ 生成声明文件（.d.ts）

---

### 为什么设计成这样？

```
历史原因：
  TypeScript 诞生时（2012年）
    ↓
  还没有 Babel 这样的现代工具
    ↓
  TypeScript 需要自己处理所有事情：
    ├─ 类型检查
    ├─ 语法转换
    └─ 代码生成

现代实践：
  现在有 Babel、esbuild、swc 等工具
    ↓
  可以分离职责：
    ├─ TypeScript → 只做类型检查
    └─ Babel/esbuild → 负责编译
```

---

### 两种使用模式

#### 模式 1：TypeScript 全包（传统方式）

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES5",        // ✅ 编译到 ES5
    "module": "CommonJS",   // ✅ 转换模块
    "outDir": "./dist",     // ✅ 输出目录
    "sourceMap": true       // ✅ 生成 Source Map
  }
}
```

```bash
# 编译并生成 JS 文件
tsc

# 结果：
src/index.ts → dist/index.js
             → dist/index.js.map
```

**使用场景**：
- ✅ Node.js 后端项目
- ✅ 简单的 CLI 工具
- ✅ 不需要 Webpack/Babel 的项目

---

#### 模式 2：只做类型检查（现代方式）⭐️

```json
// tsconfig.json
{
  "compilerOptions": {
    "noEmit": true,         // ⭐️ 不生成 JS 文件
    "strict": true,         // ✅ 只做类型检查
    "target": "ESNext",     // 不影响（因为不输出）
    "module": "ESNext"      // 不影响（因为不输出）
  }
}
```

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',  // ← Babel 负责编译
        // TypeScript 只负责类型检查（IDE 或 fork-ts-checker）
      }
    ]
  }
};
```

**使用场景**：
- ✅ React/Vue 项目（用 Webpack）
- ✅ 需要 Babel 的项目
- ✅ 需要快速构建的项目

**优势**：
- 🚀 更快（Babel/esbuild 比 tsc 快）
- 🔧 更灵活（Babel 生态更丰富）
- ⚡️ 类型检查和编译分离（并行处理）

---

### noEmit 详解

#### 什么是 noEmit？

```json
{
  "compilerOptions": {
    "noEmit": true  // ⭐️ 不生成任何输出文件
  }
}
```

**作用**：
- TypeScript **只做类型检查**
- **不生成** `.js` 文件
- **不生成** `.d.ts` 文件
- **不生成** `.js.map` 文件

#### 为什么需要 noEmit？

**场景 1：Babel 负责编译**

```
你的项目：
  TypeScript 源码
    ↓ (类型检查)
  TypeScript → 只检查类型 ✅
    ↓ (编译)
  Babel → 生成 JS 文件 ✅
```

**如果不设置 `noEmit: true`**：

```
❌ 问题：
  TypeScript 生成 → dist/index.js
  Babel 也生成    → dist/index.js
  
  两个工具都在输出文件！
  互相覆盖，混乱！
```

**设置 `noEmit: true` 后**：

```
✅ 解决：
  TypeScript     → 只检查，不输出
  Babel         → 负责输出
  
  职责清晰！
```

---

**场景 2：开发时只检查类型**

```bash
# package.json
{
  "scripts": {
    "dev": "webpack serve",              // Webpack 编译
    "type-check": "tsc --noEmit",        // 只检查类型
    "build": "webpack --mode production"
  }
}
```

```
开发流程：
1. webpack serve        → 快速编译运行（Babel）
2. tsc --noEmit         → 检查类型错误（TypeScript）
3. 修复类型错误
4. webpack build        → 生产构建
```

---

### 相关配置对比

| 配置 | 作用 | 何时使用 |
|------|------|---------|
| `noEmit: true` | 不生成任何文件 | Babel/Webpack 负责编译 ⭐️ |
| `emitDeclarationOnly: true` | 只生成 `.d.ts` | 库开发（类型定义） |
| `declaration: true` | 生成 `.d.ts` | 需要类型声明 |
| `sourceMap: true` | 生成 `.js.map` | 需要调试 |

---

## 📚 tsconfig.json 完整配置分类

### 一、编译目标配置

#### 1. target - 编译目标版本

```json
{
  "target": "ES5"      // IE 11
  "target": "ES2015"   // 现代浏览器（基础）
  "target": "ES2020"   // 现代浏览器（推荐）⭐️
  "target": "ESNext"   // 最新特性
}
```

**影响**：
- `const/let` → `var` (ES5)
- `箭头函数` → `function` (ES5)
- `async/await` → `generator + Promise` (ES5)

---

#### 2. module - 模块系统

```json
{
  "module": "CommonJS"   // Node.js (require/exports)
  "module": "ESNext"     // ES Modules (import/export) ⭐️
  "module": "AMD"        // RequireJS
  "module": "UMD"        // 通用模块
}
```

**实战建议**：
- Webpack 项目 → `"ESNext"` ⭐️
- Node.js 项目 → `"CommonJS"`
- 库开发 → `"ESNext"` + Rollup

---

#### 3. lib - 内置类型库

```json
{
  "lib": ["ES2020", "DOM"]  // 浏览器项目
  "lib": ["ES2020"]         // Node.js 项目
  "lib": ["ESNext", "DOM", "WebWorker"]  // PWA 项目
}
```

**常用库**：
- `ES2020` - ES2020 语法
- `DOM` - document, window 等
- `WebWorker` - Web Worker API
- `ESNext` - 最新 JS 特性

---

### 二、严格检查配置

#### strict - 严格模式（推荐开启）⭐️

```json
{
  "strict": true  // 启用所有严格检查
}
```

**等价于**（以下 7 个选项全部为 true）：

```json
{
  "noImplicitAny": true,              // 禁止隐式 any
  "strictNullChecks": true,           // 严格 null 检查
  "strictFunctionTypes": true,        // 严格函数类型
  "strictBindCallApply": true,        // 严格 bind/call/apply
  "strictPropertyInitialization": true, // 严格属性初始化
  "noImplicitThis": true,             // 禁止隐式 this
  "alwaysStrict": true                // 始终使用严格模式
}
```

**实战示例**：

```typescript
// noImplicitAny: true
function bad(x) {  // ❌ 错误：x 隐式为 any
  return x;
}
function good(x: number) {  // ✅ 正确
  return x;
}

// strictNullChecks: true
let name: string = null;  // ❌ 错误
let name: string | null = null;  // ✅ 正确

// strictPropertyInitialization: true
class User {
  name: string;  // ❌ 错误：未初始化
  age: number = 0;  // ✅ 正确
}
```

---

#### 其他严格检查

```json
{
  "noUnusedLocals": true,        // 未使用的局部变量
  "noUnusedParameters": true,    // 未使用的参数
  "noImplicitReturns": true,     // 函数必须有返回值
  "noFallthroughCasesInSwitch": true  // switch 必须有 break
}
```

---

### 三、模块解析配置

#### 1. moduleResolution

```json
{
  "moduleResolution": "node"     // Node.js 解析（推荐）⭐️
  "moduleResolution": "classic"  // TypeScript 经典解析
}
```

**作用**：决定如何查找模块

```typescript
import { Button } from '@components/Button';

// node 模式查找顺序：
1. node_modules/@components/Button.ts
2. node_modules/@components/Button.tsx
3. node_modules/@components/Button.d.ts
4. node_modules/@components/Button/index.ts
5. ...
```

---

#### 2. baseUrl 和 paths - 路径别名

```json
{
  "baseUrl": "./",
  "paths": {
    "@/*": ["src/*"],
    "@components/*": ["src/components/*"],
    "@utils/*": ["src/utils/*"]
  }
}
```

**⚠️ 注意**：
- TypeScript 只负责**类型解析**
- **运行时解析**需要 Webpack alias 配置
- 必须两边都配置！

---

#### 3. esModuleInterop

```json
{
  "esModuleInterop": true  // 推荐 ⭐️
}
```

**作用**：兼容 CommonJS 模块

```typescript
// esModuleInterop: false
import * as React from 'react';  // ❌ 必须这样

// esModuleInterop: true
import React from 'react';  // ✅ 可以这样（更自然）
```

---

#### 4. resolveJsonModule

```json
{
  "resolveJsonModule": true
}
```

**作用**：允许导入 JSON 文件

```typescript
import data from './data.json';  // ✅ 可以导入
console.log(data.name);
```

---

### 四、输出配置

#### 1. outDir - 输出目录

```json
{
  "outDir": "./dist"
}
```

**作用**：指定 `.js` 文件输出目录

```
src/
  ├─ index.ts
  └─ utils.ts

  ↓ tsc

dist/
  ├─ index.js
  └─ utils.js
```

---

#### 2. sourceMap - Source Map

```json
{
  "sourceMap": true
}
```

**作用**：生成 `.js.map` 文件

```
dist/
  ├─ index.js
  └─ index.js.map  ← 用于调试
```

---

#### 3. declaration - 类型声明文件

```json
{
  "declaration": true,
  "declarationDir": "./types"
}
```

**作用**：生成 `.d.ts` 文件

```typescript
// src/utils.ts
export function add(a: number, b: number): number {
  return a + b;
}

  ↓ tsc

// types/utils.d.ts
export declare function add(a: number, b: number): number;
```

**使用场景**：
- ✅ 库开发（发布到 npm）
- ✅ 团队共享的工具库
- ❌ 普通业务项目（不需要）

---

#### 4. noEmit vs emitDeclarationOnly

```json
// 方案 1：不输出任何文件（最常用）⭐️
{
  "noEmit": true
}

// 方案 2：只输出 .d.ts（库开发）
{
  "emitDeclarationOnly": true,
  "declaration": true
}
```

---

### 五、其他实用配置

#### 1. skipLibCheck - 跳过库检查

```json
{
  "skipLibCheck": true  // ⭐️ 强烈推荐
}
```

**作用**：跳过 `node_modules` 中 `.d.ts` 文件的类型检查

**优势**：
- 🚀 大幅加快编译速度（30-50%）
- 🐛 避免第三方库的类型错误
- ✅ 只检查你自己的代码

---

#### 2. forceConsistentCasingInFileNames

```json
{
  "forceConsistentCasingInFileNames": true  // ⭐️ 推荐
}
```

**作用**：强制文件名大小写一致

```typescript
// Button.tsx
export function Button() {}

// ❌ 错误（大小写不一致）
import { Button } from './button';  // Windows 可能通过，Linux 会失败

// ✅ 正确
import { Button } from './Button';
```

---

#### 3. allowJs 和 checkJs

```json
{
  "allowJs": true,   // 允许编译 .js 文件
  "checkJs": true    // 检查 .js 文件的类型
}
```

**使用场景**：
- 逐步迁移 JS 项目到 TS
- 混合 JS/TS 项目

---

## 路径别名

### 配置

**tsconfig.json**：
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    }
  }
}
```

**webpack.config.js**：
```javascript
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  }
};
```

### 使用

```typescript
// ❌ 相对路径（不推荐）
import { Button } from '../../../components/Button';

// ✅ 路径别名（推荐）
import { Button } from '@components/Button';
```

---

## 🚀 实战场景与最佳实践

### 场景 1：Webpack + TypeScript 项目（本 Demo）⭐️

**目标**：快速构建，类型检查分离

```json
// tsconfig.json
{
  "compilerOptions": {
    // 🔥 核心：不输出文件（ts-loader 或 babel-loader 负责编译）
    "noEmit": true,
    
    // 目标
    "target": "ESNext",  // 不重要（不输出）
    "module": "ESNext",
    
    // 严格检查
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    
    // 模块解析
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    
    // 路径别名（必须与 Webpack alias 一致）
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    },
    
    // 性能优化
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    
    // Source Map（Webpack 生成，TS 不生成）
    "sourceMap": false  // 可选
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        options: {
          transpileOnly: true  // 只编译，不检查（快速）
        }
      }
    ]
  },
  plugins: [
    // 在单独进程检查类型
    new ForkTsCheckerWebpackPlugin()
  ]
};
```

**工作流程**：
```
1. webpack serve
   ├─ ts-loader（transpileOnly: true）→ 快速编译
   └─ ForkTsCheckerWebpackPlugin → 异步检查类型

2. IDE（VSCode）→ 实时显示类型错误

3. webpack build → 生产构建
```

---

### 场景 2：Node.js 后端项目

**目标**：直接用 tsc 编译和类型检查

```json
// tsconfig.json
{
  "compilerOptions": {
    // 🔥 核心：输出文件
    "outDir": "./dist",
    "rootDir": "./src",
    
    // 目标
    "target": "ES2020",     // Node.js 14+
    "module": "CommonJS",   // Node.js 模块系统
    "lib": ["ES2020"],      // 不需要 DOM
    
    // 严格检查
    "strict": true,
    
    // 模块解析
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    
    // 输出
    "sourceMap": true,
    "declaration": true,  // 可选：生成 .d.ts
    
    // 其他
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

```json
// package.json
{
  "scripts": {
    "build": "tsc",
    "dev": "tsc --watch",
    "start": "node dist/index.js"
  }
}
```

---

### 场景 3：npm 库开发

**目标**：发布类型定义和 JS 文件

```json
// tsconfig.json
{
  "compilerOptions": {
    // 🔥 核心：输出 JS + .d.ts
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,        // 生成 .d.ts
    "declarationMap": true,     // 生成 .d.ts.map
    
    // 目标（兼容性）
    "target": "ES2015",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    
    // 严格检查
    "strict": true,
    
    // 模块解析
    "moduleResolution": "node",
    "esModuleInterop": true,
    
    // Source Map
    "sourceMap": true,
    
    // 其他
    "skipLibCheck": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/__tests__"]
}
```

```json
// package.json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "dist/index.js",        // CommonJS 入口
  "module": "dist/index.esm.js",  // ESM 入口（Rollup 生成）
  "types": "dist/index.d.ts",     // 类型定义
  "files": ["dist"],
  "scripts": {
    "build": "npm run build:tsc && npm run build:rollup",
    "build:tsc": "tsc",
    "build:rollup": "rollup -c"
  }
}
```

---

### 场景 4：Monorepo 项目

**目标**：多个包共享配置

```json
// tsconfig.base.json（根目录）
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    
    // 路径别名（全局）
    "baseUrl": ".",
    "paths": {
      "@myapp/*": ["packages/*/src"]
    }
  }
}
```

```json
// packages/web/tsconfig.json（前端项目）
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "noEmit": true,
    "jsx": "react-jsx",
    "lib": ["ES2020", "DOM"]
  },
  "include": ["src/**/*"]
}
```

```json
// packages/server/tsconfig.json（后端项目）
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "module": "CommonJS",
    "lib": ["ES2020"]
  },
  "include": ["src/**/*"]
}
```

---

## ❓ 实战常见问题

### 问题 1：路径别名不生效

**现象**：
```typescript
import { Button } from '@components/Button';
// ❌ 运行时报错：Cannot find module '@components/Button'
```

**原因**：
- `tsconfig.json` 的 `paths` 只负责**类型解析**
- **运行时解析**需要 Webpack/Node.js 配置

**解决方案**：

```json
// tsconfig.json（类型解析）
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@components/*": ["src/components/*"]
    }
  }
}
```

```javascript
// webpack.config.js（运行时解析）
module.exports = {
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components')
    }
  }
};
```

---

### 问题 2：第三方库没有类型定义

**现象**：
```typescript
import someLib from 'some-lib';
// ❌ Could not find a declaration file for module 'some-lib'
```

**解决方案 1**：安装类型定义

```bash
npm install --save-dev @types/some-lib
```

**解决方案 2**：手动声明类型

```typescript
// src/types/some-lib.d.ts
declare module 'some-lib' {
  export function doSomething(): void;
}
```

**解决方案 3**：临时忽略（不推荐）

```typescript
// @ts-ignore
import someLib from 'some-lib';
```

---

### 问题 3：类型检查太慢

**现象**：
- `tsc` 编译 5 分钟
- Webpack 构建卡顿

**解决方案**：

```json
// tsconfig.json
{
  "compilerOptions": {
    // 1. 跳过库检查（最重要）⭐️
    "skipLibCheck": true,
    
    // 2. 关闭不必要的检查
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    
    // 3. 使用增量编译
    "incremental": true,
    "tsBuildInfoFile": "./.tsbuildinfo"
  }
}
```

```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true  // ⭐️ 只编译，不检查
          }
        }
      }
    ]
  },
  plugins: [
    // 异步检查类型（不阻塞编译）
    new ForkTsCheckerWebpackPlugin()
  ]
};
```

---

### 问题 4：production 构建报类型错误

**现象**：
- `npm run dev` 正常
- `npm run build` 报类型错误

**原因**：
- 开发环境用 `transpileOnly: true`（跳过检查）
- 生产环境 `transpileOnly: false`（检查类型）

**解决方案 1**：添加单独的类型检查脚本

```json
{
  "scripts": {
    "dev": "webpack serve",
    "type-check": "tsc --noEmit",  // ⭐️ 开发时手动运行
    "build": "npm run type-check && webpack --mode production"
  }
}
```

**解决方案 2**：统一开关

```javascript
// webpack.config.js
module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: {
            loader: 'ts-loader',
            options: {
              transpileOnly: isDev  // ⭐️ 开发跳过，生产检查
            }
          }
        }
      ]
    }
  };
};
```

---

### 问题 5：monorepo 中的跨包引用

**现象**：
```typescript
// packages/web/src/index.ts
import { api } from '@myapp/server';
// ❌ Cannot find module '@myapp/server'
```

**解决方案**：配置引用

```json
// packages/web/tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@myapp/server": ["../server/src"]
    }
  },
  "references": [
    { "path": "../server" }
  ]
}
```

---

## 🎯 推荐配置模板

### 小型项目（Webpack + TS）

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    
    "strict": true,
    "noEmit": true,
    
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

---

### React 项目（生产级）⭐️

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020", "DOM"],
    "jsx": "react-jsx",
    
    // 严格检查
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    
    // 输出（Webpack 负责）
    "noEmit": true,
    "sourceMap": false,
    
    // 模块解析
    "moduleResolution": "node",
    "esModuleInterop": true,
    "resolveJsonModule": true,
    
    // 路径别名
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    },
    
    // 性能优化
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    
    // 增量编译
    "incremental": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "**/__tests__"]
}
```

---

## 📋 配置检查清单

### 必须配置 ✅

- [ ] `target` - 编译目标
- [ ] `module` - 模块系统
- [ ] `strict` - 严格模式
- [ ] `moduleResolution` - 模块解析
- [ ] `esModuleInterop` - ES 模块兼容
- [ ] `skipLibCheck` - 跳过库检查

### Webpack 项目必须 ✅

- [ ] `noEmit: true` - 不输出文件
- [ ] `paths` 与 Webpack `alias` 一致
- [ ] `transpileOnly: true` (开发)
- [ ] `ForkTsCheckerWebpackPlugin` (异步检查)

### React 项目必须 ✅

- [ ] `jsx: "react-jsx"` (React 17+)
- [ ] `lib: ["ES2020", "DOM"]`
- [ ] `resolveJsonModule: true`

### 库开发必须 ✅

- [ ] `declaration: true` - 生成 .d.ts
- [ ] `declarationMap: true` - 生成映射
- [ ] `outDir` - 输出目录
- [ ] `package.json` 的 `types` 字段

---

**下一步**：学习 [Loader 方案对比](./02-loader-comparison.md)

