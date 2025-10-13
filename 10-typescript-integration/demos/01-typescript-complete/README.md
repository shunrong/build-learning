# TypeScript 集成完整示例

## 📝 简介

本 Demo 展示如何在 Webpack 项目中完整集成 TypeScript，包括类型检查、声明文件、路径别名等特性。

## 🎯 涵盖内容

1. **TypeScript 基础配置**（tsconfig.json）
2. **ts-loader 集成**
3. **异步类型检查**（fork-ts-checker-webpack-plugin）
4. **路径别名**（@/ @components/ @utils/）
5. **TypeScript ESLint**
6. **类型声明文件**

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 开发模式

```bash
npm run dev
```

浏览器会自动打开，查看 TypeScript 示例。

### 3. 类型检查

```bash
# 单次检查
npm run type-check

# 持续检查
npm run type-check:watch
```

### 4. 生产构建

```bash
npm run build
```

---

## 📂 项目结构

```
01-typescript-complete/
├── src/
│   ├── components/
│   │   ├── Button.ts        # 按钮组件
│   │   └── UserCard.ts      # 用户卡片
│   ├── utils/
│   │   └── helpers.ts       # 工具函数（泛型示例）
│   ├── types/
│   │   ├── index.ts         # 类型定义
│   │   └── assets.d.ts      # 资源声明
│   ├── index.html
│   ├── index.ts             # 入口文件
│   └── styles.css
├── tsconfig.json            # TypeScript 配置
├── webpack.config.js        # Webpack 配置
├── .eslintrc.js            # ESLint 配置
└── package.json
```

---

## 🔧 核心配置

### 1. tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    
    // 路径别名
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@utils/*": ["src/utils/*"]
    },
    
    // 声明文件
    "declaration": true,
    "declarationMap": true,
    "declarationDir": "./types"
  }
}
```

### 2. webpack.config.js

```javascript
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true  // 只编译，不检查
          }
        }
      }
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin()  // 异步类型检查
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils')
    }
  }
};
```

---

## 💡 TypeScript 特性演示

### 1. 类型定义

```typescript
// src/types/index.ts
export interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
```

### 2. 泛型函数

```typescript
// src/utils/helpers.ts
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array));
}

// 使用
const numbers = unique([1, 2, 2, 3]);  // number[]
const strings = unique(['a', 'b', 'b']);  // string[]
```

### 3. 路径别名

```typescript
// ❌ 相对路径
import { Button } from '../../../components/Button';

// ✅ 路径别名
import { Button } from '@components/Button';
import { helpers } from '@utils/helpers';
```

### 4. 类型安全

```typescript
const user: User = {
  id: 1,
  name: '张三',
  email: 'zhangsan@example.com'
  // age 是可选的
};

// ✅ 类型正确
formatUserName(user);

// ❌ 类型错误（编译时发现）
formatUserName('not a user');
```

---

## 🎮 功能演示

### 1. 邮箱验证

```typescript
import { validateEmail } from '@utils/helpers';

const email = 'test@example.com';
const isValid = validateEmail(email);  // boolean
```

### 2. 数组去重（泛型）

```typescript
import { unique } from '@utils/helpers';

const numbers = [1, 2, 2, 3, 3, 3];
const uniqueNumbers = unique(numbers);  // [1, 2, 3]
```

### 3. 数组分组（泛型）

```typescript
import { groupBy } from '@utils/helpers';

const items = [
  { name: '苹果', category: '水果' },
  { name: '香蕉', category: '水果' },
  { name: '胡萝卜', category: '蔬菜' }
];

const grouped = groupBy(items, 'category');
// {
//   '水果': [{ name: '苹果', ... }, { name: '香蕉', ... }],
//   '蔬菜': [{ name: '胡萝卜', ... }]
// }
```

---

## 🔍 类型检查说明

### 开发模式

```bash
npm run dev
```

- `ts-loader` 只编译，不检查（transpileOnly: true）
- `fork-ts-checker-webpack-plugin` 在单独进程中异步检查
- 不阻塞构建，开发体验好 ✅

### 生产构建

```bash
npm run build
```

- 完整的类型检查
- 发现类型错误会阻塞构建

### 手动检查

```bash
npm run type-check
```

---

## ✅ 验证清单

完成本 Demo 后，请确认：

- [ ] 理解 TypeScript 在 Webpack 中的配置
- [ ] 理解 ts-loader 和 fork-ts-checker 的配合
- [ ] 会使用路径别名
- [ ] 会定义类型和接口
- [ ] 会使用泛型
- [ ] 会配置 TypeScript ESLint

---

## 🎯 最佳实践

1. ✅ 使用 `transpileOnly` + `fork-ts-checker` 优化性能
2. ✅ 配置路径别名，避免深层相对路径
3. ✅ 启用 `strict` 模式，确保类型安全
4. ✅ 为公共类型创建独立的 `types` 目录
5. ✅ 使用泛型提高代码复用性

---

**Phase 10: TypeScript 集成 Demo 已完成！** 🎉

