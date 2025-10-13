# 声明文件

## 📖 什么是声明文件？

**声明文件（.d.ts）** 是 TypeScript 的类型定义文件，描述 JavaScript 代码的类型。

### 作用

```typescript
// utils.js（JavaScript 代码）
export function add(a, b) {
  return a + b;
}

// utils.d.ts（声明文件）
export function add(a: number, b: number): number;

// 使用时有类型提示 ✅
import { add } from './utils';
add(1, 2);  // ✅
add('1', '2');  // ❌ 类型错误
```

---

## 生成声明文件

### 配置

**tsconfig.json**：
```json
{
  "compilerOptions": {
    "declaration": true,         // 生成声明文件
    "declarationMap": true,      // 生成声明映射
    "declarationDir": "./types"  // 声明文件输出目录
  }
}
```

### 效果

```
src/
├── index.ts
└── utils.ts

types/（生成）
├── index.d.ts
├── index.d.ts.map
├── utils.d.ts
└── utils.d.ts.map
```

---

## 第三方库类型

### 1. 内置类型

```bash
# 大多数流行库都有类型定义
npm install react
npm install @types/react  # React 类型
```

### 2. DefinitelyTyped

```bash
# lodash 没有内置类型
npm install lodash
npm install -D @types/lodash  # 社区提供的类型
```

### 3. 查找类型包

访问：https://www.typescriptlang.org/dt/search

或使用：
```bash
npx typesync  # 自动安装缺失的类型包
```

---

## 自定义类型声明

### 场景 1：第三方库没有类型

```typescript
// src/types/my-library.d.ts
declare module 'my-library' {
  export function doSomething(value: string): number;
  export const version: string;
}
```

### 场景 2：全局变量

```typescript
// src/types/global.d.ts
declare global {
  interface Window {
    myGlobalVar: string;
  }
  
  const API_URL: string;
}

export {};
```

### 场景 3：非代码资源

```typescript
// src/types/assets.d.ts

// CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// 图片
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

// JSON
declare module '*.json' {
  const value: any;
  export default value;
}
```

---

## 库开发（发布类型）

### package.json 配置

```json
{
  "name": "my-library",
  "version": "1.0.0",
  "main": "dist/index.js",
  "types": "dist/index.d.ts",  // 声明文件入口
  "files": [
    "dist"
  ]
}
```

### 目录结构

```
my-library/
├── src/
│   └── index.ts
├── dist/（构建输出）
│   ├── index.js
│   └── index.d.ts
├── package.json
└── tsconfig.json
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "declaration": true,
    "declarationMap": true,
    "outDir": "./dist"
  },
  "include": ["src/**/*"]
}
```

---

## 🎯 最佳实践

### 1. 项目结构

```
src/
├── components/
│   ├── Button.tsx
│   └── Card.tsx
├── utils/
│   └── helpers.ts
├── types/              # 全局类型声明
│   ├── global.d.ts
│   └── assets.d.ts
└── index.ts

types/（生成的声明文件）
├── components/
│   ├── Button.d.ts
│   └── Card.d.ts
├── utils/
│   └── helpers.d.ts
└── index.d.ts
```

### 2. tsconfig.json 推荐配置

```json
{
  "compilerOptions": {
    // 生成声明文件
    "declaration": true,
    "declarationMap": true,
    "declarationDir": "./types",
    
    // 类型检查
    "strict": true,
    
    // 模块
    "module": "ESNext",
    "moduleResolution": "node",
    "esModuleInterop": true,
    
    // 输出
    "outDir": "./dist",
    "sourceMap": true,
    
    // 其他
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "types"]
}
```

### 3. package.json 脚本

```json
{
  "scripts": {
    "build": "tsc",
    "build:types": "tsc --emitDeclarationOnly",
    "type-check": "tsc --noEmit"
  }
}
```

### 4. 类型组织

```typescript
// src/types/index.ts（集中导出）
export * from './user';
export * from './api';
export * from './common';

// 使用
import { User, ApiResponse } from '@/types';
```

---

## 常见问题

### 1. 如何忽略某些文件的声明生成？

```json
{
  "exclude": ["src/**/*.test.ts", "src/**/*.spec.ts"]
}
```

### 2. 如何为 JavaScript 文件生成声明？

```json
{
  "compilerOptions": {
    "allowJs": true,
    "declaration": true
  }
}
```

### 3. 如何处理动态 import？

```typescript
// 声明文件中
declare function dynamicImport(path: string): Promise<any>;
```

---

**Phase 10 文档已完成！** 🎉

