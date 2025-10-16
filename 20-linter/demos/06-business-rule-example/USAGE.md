# 使用指南

## 🎯 规则设计理念

### 为什么需要这个规则？

在大型前端项目中，按 Feature 组织代码是常见的架构模式。但随着项目发展，容易出现以下问题：

1. **过度耦合**：Feature A 直接导入 Feature B 的内部实现
2. **难以重构**：改动内部实现会影响其他 Feature
3. **边界模糊**：不清楚哪些是公共 API，哪些是内部实现
4. **依赖混乱**：Feature 之间的依赖关系难以追踪

### 解决方案：Shared API Pattern

```
每个 Feature 通过 shared.ts 显式声明公共 API
跨 Feature 导入必须通过 shared.ts
内部实现对外不可见
```

---

## 📦 安装和配置

### 步骤 1：复制规则文件

将 `rules/no-cross-feature-import.js` 复制到你的项目中：

```bash
your-project/
  ├── lint-rules/
  │   └── no-cross-feature-import.js  # 复制到这里
  ├── src/
  │   └── features/
  └── .eslintrc.js
```

### 步骤 2：配置 ESLint

```javascript
// .eslintrc.js
const path = require('path');

module.exports = {
  // 加载本地规则目录
  rulePaths: [path.resolve(__dirname, 'lint-rules')],
  
  rules: {
    // 启用规则
    'no-cross-feature-import': ['error', {
      featuresRoot: 'src/features',  // Features 根目录
      sharedFile: 'shared',          // 共享文件名
      alias: {
        '@': 'src',                  // 路径别名配置
        '~': 'src'
      }
    }]
  }
};
```

### 步骤 3：运行 ESLint

```bash
npx eslint src/features/**/*.{ts,tsx}
```

---

## 🏗️ 项目结构

### 推荐的目录结构

```
src/features/
  ├── auth/
  │   ├── shared.ts              # ✅ 公共 API 入口
  │   ├── components/
  │   │   ├── LoginForm.tsx      # ❌ 内部组件
  │   │   └── RegisterForm.tsx   # ❌ 内部组件
  │   ├── hooks/
  │   │   └── useAuth.ts         # ❌ 内部 hook
  │   └── utils/
  │       └── validation.ts      # ❌ 内部工具
  │
  ├── dashboard/
  │   ├── shared.ts
  │   ├── components/
  │   └── ...
  │
  └── settings/
      ├── shared.ts
      ├── components/
      └── ...
```

### shared.ts 的写法

```typescript
// src/features/auth/shared.ts

// ✅ 显式导出公共 API
export { LoginForm, RegisterForm } from './components';
export { useAuth, usePermissions } from './hooks';
export { validateEmail, validatePassword } from './utils/validation';
export type { User, AuthState } from './types';

// ❌ 不要使用 export * 通配符导出
// export * from './components';  // 这会导出所有内容
```

---

## ✅ 正确的用法

### 1. 跨 Feature 导入（使用别名）

```typescript
// src/features/dashboard/pages/Home.tsx

// ✅ 正确：从 auth 的 shared.ts 导入
import { useAuth, LoginForm } from '@/features/auth/shared';

function HomePage() {
  const { user } = useAuth();
  return <div>{user ? <Dashboard /> : <LoginForm />}</div>;
}
```

### 2. 跨 Feature 导入（使用相对路径）

```typescript
// src/features/dashboard/components/Header.tsx

// ✅ 正确：从 auth 的 shared 导入
import { useAuth } from '../../auth/shared';

function Header() {
  const { user, logout } = useAuth();
  return <header>{user.name} <button onClick={logout}>退出</button></header>;
}
```

### 3. 同一 Feature 内部导入

```typescript
// src/features/auth/components/LoginForm.tsx

// ✅ 正确：同一 feature 内部可以直接导入
import { validateEmail } from '../utils/validation';
import { useAuthState } from '../hooks/useAuthState';
import { AuthButton } from './AuthButton';

function LoginForm() {
  // ...
}
```

---

## ❌ 错误的用法

### 1. 直接导入其他 Feature 的内部文件

```typescript
// src/features/dashboard/pages/Home.tsx

// ❌ 错误：直接导入 auth 的内部组件
import { LoginForm } from '@/features/auth/components/LoginForm';
//                         ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ESLint 错误: 禁止从其他 feature 的内部文件导入
// 建议: import { LoginForm } from '@/features/auth/shared'

// ❌ 错误：直接导入 auth 的内部 hook
import { useAuthState } from '../auth/hooks/useAuthState';
//                          ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ESLint 错误: 禁止从其他 feature 的内部文件导入
// 建议: import { useAuthState } from '../auth/shared'
```

### 2. 直接导入深层嵌套的内部文件

```typescript
// src/features/settings/pages/Profile.tsx

// ❌ 错误：导入其他 feature 的深层嵌套文件
import { API_URL } from '@/features/auth/config/api/endpoints';
//                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// ESLint 错误: 禁止从其他 feature 的内部文件导入
// 建议: import { API_URL } from '@/features/auth/shared'
```

---

## 🔧 配置选项

### `featuresRoot`

Features 目录的根路径（相对于项目根目录）

```javascript
{
  featuresRoot: 'src/features'  // 默认值
}
```

### `sharedFile`

共享文件的名称（不包含扩展名）

```javascript
{
  sharedFile: 'shared'  // 默认值，匹配 shared.ts、shared.js
}

// 如果你想使用 index.ts 作为公共 API 入口
{
  sharedFile: 'index'  // 匹配 index.ts、index.js
}

// 如果你想使用 public.ts 作为公共 API 入口
{
  sharedFile: 'public'  // 匹配 public.ts、public.js
}
```

### `alias`

路径别名配置（需要与 tsconfig.json 或 webpack 配置一致）

```javascript
{
  alias: {
    '@': 'src',       // @/features/auth/shared → src/features/auth/shared
    '~': 'src',       // ~/features/auth/shared → src/features/auth/shared
    '@features': 'src/features'  // @features/auth/shared → src/features/auth/shared
  }
}
```

---

## 🎨 与其他工具集成

### 1. 与 TypeScript 集成

确保 `tsconfig.json` 中的路径别名与 ESLint 配置一致：

```json
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@features/*": ["src/features/*"]
    }
  }
}
```

### 2. 与 Webpack 集成

确保 webpack 的别名配置与 ESLint 一致：

```javascript
// webpack.config.js
module.exports = {
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@features': path.resolve(__dirname, 'src/features')
    }
  }
};
```

### 3. 与 Vite 集成

```javascript
// vite.config.ts
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@features': path.resolve(__dirname, 'src/features')
    }
  }
});
```

---

## 🚀 进阶用法

### 1. 自动修复（可选）

你可以为规则添加 `fix` 功能，自动将错误的导入改为正确的：

```javascript
// 在规则的 meta 中添加
meta: {
  fixable: 'code'
}

// 在 context.report 中添加 fix
context.report({
  node: node.source,
  messageId: 'noCrossFeatureImport',
  fix(fixer) {
    // 自动替换为正确的导入路径
    const correctPath = `'@/features/${importedFeature}/shared'`;
    return fixer.replaceText(node.source, correctPath);
  }
});
```

### 2. 白名单机制

允许某些特殊情况绕过检查：

```javascript
// .eslintrc.js
{
  'no-cross-feature-import': ['error', {
    featuresRoot: 'src/features',
    sharedFile: 'shared',
    whitelist: [
      // 允许从 common feature 导入任何文件
      'common',
      // 允许导入特定的 types 文件
      'types.ts'
    ]
  }]
}
```

### 3. 多 shared 文件支持

支持多个公共 API 入口：

```javascript
{
  sharedFiles: ['shared', 'public-api', 'exports']
}
```

---

## 📊 效果展示

### 在 VSCode 中的显示

```typescript
// ❌ 错误会在 IDE 中实时显示
import { LoginForm } from '@/features/auth/components/LoginForm';
//                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
// 禁止从其他 feature 的内部文件导入
// 请从 "auth/shared" 导入: import { ... } from '@/features/auth/shared'
```

### 在 CI/CD 中的检查

```bash
# 在 CI 中运行
npm run lint

# 输出示例
src/features/dashboard/pages/Home.tsx
  5:31  error  禁止从其他 feature 的内部文件导入
               请从 "auth/shared" 导入  no-cross-feature-import

✖ 1 problem (1 error, 0 warnings)
```

---

## 💡 最佳实践

1. **尽早启用规则**：在项目初期就启用规则，避免后期大规模重构
2. **完善 shared.ts**：定期 review shared.ts，确保公共 API 合理
3. **配合文档**：为每个 feature 编写 README，说明公共 API 的用途
4. **团队规范**：制定 feature 划分规范，明确边界
5. **渐进式启用**：对于老项目，可以先设为 `warn`，逐步修复

---

## 🤔 常见问题

### Q: 是否可以有多层 features？

A: 可以，规则会自动识别顶层 feature：

```
src/features/
  └── user/
      ├── profile/       # 子 feature
      │   └── shared.ts
      └── settings/      # 子 feature
          └── shared.ts

# 跨子 feature 导入也会被检查
```

### Q: 如何处理类型定义？

A: 建议在 shared.ts 中导出类型：

```typescript
// src/features/auth/shared.ts
export type { User, AuthState } from './types';
```

### Q: shared.ts 太大怎么办？

A: 可以拆分为多个文件，然后在 shared.ts 中统一导出：

```typescript
// src/features/auth/shared.ts
export * from './exports/components';
export * from './exports/hooks';
export * from './exports/utils';
```

---

## 📚 相关资源

- [ESLint Custom Rules 文档](https://eslint.org/docs/latest/developer-guide/working-with-rules)
- [Feature-Sliced Design](https://feature-sliced.design/)
- [模块化架构最佳实践](https://martinfowler.com/articles/modular-frontends.html)

