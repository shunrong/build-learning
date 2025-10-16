# 实现总结：Feature 模块边界检查规则

## 🎯 业务价值

这个自定义 ESLint 规则解决了大型前端项目中的核心架构问题：

1. **强制模块边界**：禁止跨 Feature 导入内部实现
2. **清晰的公共 API**：通过 `shared.ts` 显式声明可共享的代码
3. **减少耦合**：Feature 之间只能通过公共 API 通信
4. **便于重构**：内部实现可以自由修改，不影响其他 Feature
5. **代码审查**：自动化检查，无需人工审查导入规范

---

## 🔍 核心技术要点

### 1. 路径解析算法

**关键挑战**：正确处理相对路径中的 `../`

```javascript
// 手动实现路径规范化，处理 .. 和 .
function normalizePath(pathStr) {
  const parts = pathStr.split('/').filter(p => p && p !== '.');
  const result = [];
  
  for (const part of parts) {
    if (part === '..') {
      if (result.length > 0) {
        result.pop();  // 遇到 ..，回退一级
      }
    } else {
      result.push(part);
    }
  }
  
  return result.join('/');
}

// 示例：
// src/features/biz/pages + ../../exp/utils/helper
//   → src/features/biz/pages/../.. exp/utils/helper
//   → src/features/exp/utils/helper ✅
```

### 2. Feature 识别

**通过正则匹配提取 Feature 名称**：

```javascript
function getFeatureName(filePath) {
  const normalized = filePath.replace(/\\/g, '/');
  const match = normalized.match(/src\/features\/([^/]+)/);
  return match ? match[1] : null;
}

// 示例：
// src/features/biz/pages/Home.tsx → 'biz'
// src/features/exp/shared.ts → 'exp'
```

### 3. 跨 Feature 检测

```javascript
function isCrossFeatureImport(importPath, currentFile) {
  const currentFeature = getFeatureName(currentFile);    // 'biz'
  const importedFeature = getFeatureName(importPath);    // 'exp'
  
  // 不同 Feature → 跨 Feature 导入
  return currentFeature !== importedFeature;
}
```

### 4. Shared 文件检测

```javascript
function isSharedImport(importPath) {
  // 匹配 features/xxx/shared 或 features/xxx/shared.ts
  const pattern = /src\/features\/[^/]+\/shared(\.(ts|js))?$/;
  return pattern.test(importPath);
}
```

---

## 📊 规则工作流程

```
用户代码
  ↓
import { Button } from '@/features/exp/components/Button'
  ↓
ESLint 解析 AST，找到 ImportDeclaration 节点
  ↓
【规则执行】
  1. resolveAlias: 处理路径别名
     @/features/exp/components/Button
     → src/features/exp/components/Button
  
  2. resolveImportPath: 解析为完整路径
     如果是相对路径，拼接并规范化
  
  3. getFeatureName: 提取 Feature 名称
     当前文件: src/features/biz/index.tsx → 'biz'
     导入路径: src/features/exp/components/Button → 'exp'
  
  4. isCrossFeatureImport: 检查是否跨 Feature
     'biz' !== 'exp' → true （跨 Feature）
  
  5. isSharedImport: 检查是否从 shared 导入
     src/features/exp/components/Button → false （不是 shared）
  
  6. context.report: 报告错误
     ❌ 禁止从其他 feature 的内部文件导入
     💡 建议: import { ... } from '@/features/exp/shared'
```

---

## 🛠️ 实际应用建议

### 1. 渐进式启用

```javascript
// 阶段 1：警告模式（不阻止提交）
{
  'no-cross-feature-import': ['warn', {
    featuresRoot: 'src/features',
    sharedFile: 'shared'
  }]
}

// 阶段 2：错误模式（阻止提交）
{
  'no-cross-feature-import': ['error', { /* ... */ }]
}
```

### 2. 配合 Git Hooks

```javascript
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 只检查这个规则
eslint --rule 'no-cross-feature-import: error' src/features/
```

### 3. CI/CD 集成

```yaml
# .github/workflows/lint.yml
- name: Check Feature Boundaries
  run: |
    npx eslint \
      --rule 'no-cross-feature-import: error' \
      --report-unused-disable-directives \
      src/features/
```

---

## 📈 性能优化建议

### 1. 限制检查范围

```javascript
// .eslintrc.js
overrides: [
  {
    files: ['src/features/**/*.{ts,tsx}'],  // 只检查 features 目录
    rules: {
      'no-cross-feature-import': 'error'
    }
  }
]
```

### 2. 缓存结果

```javascript
// 在规则内部添加缓存
const featureCache = new Map();

function getFeatureName(filePath) {
  if (featureCache.has(filePath)) {
    return featureCache.get(filePath);
  }
  
  const feature = /* ... 解析逻辑 ... */;
  featureCache.set(filePath, feature);
  return feature;
}
```

---

## 🔥 常见问题和解决方案

### Q1: 如何处理类型定义？

```typescript
// ✅ 方案 1：在 shared.ts 中导出类型
// src/features/auth/shared.ts
export type { User, AuthState } from './types';

// ✅ 方案 2：创建全局类型定义（如果类型被多个 feature 共享）
// src/types/global.d.ts
declare global {
  interface User { /* ... */ }
}
```

### Q2: 如何处理工具函数？

```typescript
// ❌ 错误：直接导入其他 feature 的工具函数
import { formatDate } from '@/features/utils/format';

// ✅ 方案 1：将通用工具函数提取到 src/utils（非 feature）
import { formatDate } from '@/utils/format';

// ✅ 方案 2：如果确实需要共享，在 shared.ts 中导出
// src/features/utils/shared.ts
export { formatDate } from './format';
```

### Q3: 如何处理常量和配置？

```typescript
// ✅ 方案 1：在 shared.ts 中导出
// src/features/config/shared.ts
export { API_URL, TIMEOUT } from './constants';

// ✅ 方案 2：使用环境变量
const API_URL = process.env.REACT_APP_API_URL;
```

---

## 🎓 学习收获

### 1. ESLint 规则开发

- ✅ 理解 ESLint 规则的结构（meta + create）
- ✅ 掌握 AST 遍历和节点访问
- ✅ 学会使用 `context.report` 报告错误

### 2. 路径解析算法

- ✅ 处理相对路径（`./`、`../`）
- ✅ 处理路径别名（`@/`、`~/`）
- ✅ 跨平台路径规范化（Windows vs Unix）

### 3. 架构设计思想

- ✅ 模块边界的重要性
- ✅ 公共 API 的设计原则
- ✅ 通过工具强制执行架构规范

---

## 📚 扩展阅读

1. [ESLint Custom Rules 官方文档](https://eslint.org/docs/latest/developer-guide/working-with-rules)
2. [Feature-Sliced Design](https://feature-sliced.design/)
3. [Modular Frontends](https://martinfowler.com/articles/modular-frontends.html)
4. [Path Resolution in Node.js](https://nodejs.org/api/modules.html#modules_all_together)
5. [AST Explorer](https://astexplorer.net/)

---

## ✨ 下一步

1. **添加 auto-fix 功能**：自动将错误的导入改为正确的 shared 导入
2. **支持白名单**：允许某些特殊情况绕过检查
3. **生成依赖图**：可视化 Feature 之间的依赖关系
4. **发布为 npm 包**：`eslint-plugin-feature-boundary`
5. **添加更多规则**：例如禁止循环依赖、限制依赖深度等

