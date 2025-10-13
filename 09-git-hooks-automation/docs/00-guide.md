# Phase 09: Git Hooks 与自动化

## 🎯 学习目标

通过这个阶段，你将：
1. **掌握 Husky 配置和使用**
2. **掌握 lint-staged 暂存区检查**
3. **掌握 commitlint 提交规范**
4. **建立完整的提交前自动化检查流程**
5. **理解 Git Hooks 的工作原理**

---

## 📚 学习路径

```
理论学习（2-3小时）
    ↓
1. 阅读 docs/01-husky.md             (45分钟) - Husky
2. 阅读 docs/02-lint-staged.md       (45分钟) - lint-staged
3. 阅读 docs/03-commitlint.md        (60分钟) - commitlint
    ↓
实践体验（2-3小时）
    ↓
4. 运行 demos/01-git-hooks-complete/ (1-2小时)
5. 尝试提交代码，触发检查            (1小时)
    ↓
深入实践（1-2小时）
    ↓
6. 配置自己的 Git Hooks 方案         (1-2小时)
```

---

## 📖 文档列表

### 1. [Husky 详解](./01-husky.md)
- 什么是 Git Hooks？
- 什么是 Husky？
- 安装和配置
- 常用 Hooks
- 最佳实践

### 2. [lint-staged 详解](./02-lint-staged.md)
- 什么是 lint-staged？
- 为什么需要它？
- 配置和使用
- 与 ESLint/Prettier 集成
- 最佳实践

### 3. [commitlint 详解](./03-commitlint.md)
- 什么是 commitlint？
- Conventional Commits 规范
- 安装和配置
- 自定义规则
- 最佳实践

---

## 🎮 Demo

### [Git Hooks 完整示例](../demos/01-git-hooks-complete/)

**涵盖内容**：
- ✅ Husky（Git Hooks 管理）
- ✅ lint-staged（暂存区文件检查）
- ✅ commitlint（提交信息规范）
- ✅ ESLint + Prettier 自动修复
- ✅ 完整的提交前检查流程

**运行方式**：
```bash
cd demos/01-git-hooks-complete
npm install
git add .
git commit -m "test: 测试提交"  # 触发 Git Hooks
```

---

## ✅ 检验标准

完成这个阶段后，你应该能够：

### 理论层面
- [ ] 理解 Git Hooks 的工作原理
- [ ] 理解 Husky 的作用
- [ ] 理解 lint-staged 的作用
- [ ] 理解 Conventional Commits 规范
- [ ] 能够设计完整的提交检查流程

### 实践层面
- [ ] 能配置 Husky
- [ ] 能配置 lint-staged
- [ ] 能配置 commitlint
- [ ] 能编写规范的提交信息
- [ ] 能调试 Git Hooks 问题

### 面试层面
1. **什么是 Git Hooks？**
2. **Husky 的作用是什么？**
3. **为什么需要 lint-staged？**
4. **Conventional Commits 规范是什么？**
5. **如何绕过 Git Hooks？**

---

## 🎯 核心知识点

### 1. Git Hooks 类型

| Hook | 触发时机 | 常用场景 |
|------|----------|----------|
| **pre-commit** | 提交前 | 代码检查、格式化 ⭐️ |
| **commit-msg** | 提交信息时 | 提交信息规范检查 ⭐️ |
| **pre-push** | 推送前 | 运行测试 |
| **post-commit** | 提交后 | 通知、统计 |

### 2. 工具链对比

| 工具 | 作用 | 必要性 |
|------|------|--------|
| **Husky** | Git Hooks 管理 | ⭐️⭐️⭐️⭐️⭐️ |
| **lint-staged** | 暂存区文件检查 | ⭐️⭐️⭐️⭐️⭐️ |
| **commitlint** | 提交信息检查 | ⭐️⭐️⭐️⭐️ |
| **prettier** | 代码格式化 | ⭐️⭐️⭐️⭐️⭐️ |
| **eslint** | 代码质量检查 | ⭐️⭐️⭐️⭐️⭐️ |

### 3. 完整工作流

```
1. git add files
    ↓
2. git commit -m "message"
    ↓
3. pre-commit hook 触发
    ↓
4. lint-staged 运行
    ├─ Prettier 格式化
    ├─ ESLint 检查和修复
    └─ Stylelint 检查
    ↓
5. commit-msg hook 触发
    ↓
6. commitlint 检查提交信息
    ↓
7. 通过 → 提交成功 ✅
   失败 → 提交失败 ❌
```

---

## 💡 最佳实践

### 1. package.json 配置

```json
{
  "scripts": {
    "prepare": "husky install"
  },
  "lint-staged": {
    "*.js": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.css": [
      "prettier --write",
      "stylelint --fix"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  },
  "devDependencies": {
    "husky": "^8.0.3",
    "lint-staged": "^15.0.2",
    "@commitlint/cli": "^18.0.0",
    "@commitlint/config-conventional": "^18.0.0"
  }
}
```

### 2. Husky Hooks

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged

# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

### 3. commitlint 配置

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复
        'docs',     // 文档
        'style',    // 格式
        'refactor', // 重构
        'test',     // 测试
        'chore'     // 构建/工具
      ]
    ]
  }
};
```

### 4. Conventional Commits 示例

```bash
# ✅ 正确的提交信息
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复按钮点击无响应问题"
git commit -m "docs: 更新 README 文档"
git commit -m "style: 格式化代码"
git commit -m "refactor: 重构用户模块"
git commit -m "test: 添加单元测试"
git commit -m "chore: 更新依赖"

# ❌ 错误的提交信息
git commit -m "update"
git commit -m "修复bug"
git commit -m "WIP"
```

---

## 🔗 相关资源

- [Husky 官方文档](https://typicode.github.io/husky/)
- [lint-staged 官方文档](https://github.com/okonet/lint-staged)
- [commitlint 官方文档](https://commitlint.js.org/)
- [Conventional Commits 规范](https://www.conventionalcommits.org/)

---

**准备好了吗？让我们开始 Git Hooks 与自动化的学习之旅！** 🎯

