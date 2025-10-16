# 06 - 业务场景自定义规则：Feature 模块边界检查

## 📋 业务场景

在大型前端项目中，按 Feature 组织代码是常见的架构模式。为了保持模块边界清晰，防止过度耦合，我们需要强制规范：

**✅ 跨 Feature 导入代码，只能从 `shared.ts` 导入**

## 🎯 规则说明

### 目录结构

```
src/features/
  ├── exp/
  │   ├── shared.ts          # ✅ 公共 API 入口
  │   ├── components/
  │   │   └── Button.tsx     # ❌ 内部实现
  │   └── utils/
  │       └── helper.ts      # ❌ 内部实现
  │
  └── biz/
      ├── shared.ts
      ├── index.tsx
      └── components/
          └── Form.tsx
```

### 规则行为

```javascript
// ✅ 允许：从其他 feature 的 shared.ts 导入
import { ExpButton } from '@/features/exp/shared';
import { ExpButton } from '../exp/shared';

// ✅ 允许：同一 feature 内部导入
import { helper } from './utils/helper';
import { Button } from '../components/Button';

// ❌ 禁止：跨 feature 导入内部文件
import { Button } from '@/features/exp/components/Button';
import { helper } from '../exp/utils/helper';
```

## 🚀 使用方法

```bash
# 安装依赖
npm install

# 运行测试
npm test

# 运行 Demo
npm run demo
```

## 📂 文件说明

- `rules/no-cross-feature-import.js` - 自定义规则实现
- `test/run-test.js` - 规则测试用例
- `demo/demo-project.js` - 完整的项目示例

