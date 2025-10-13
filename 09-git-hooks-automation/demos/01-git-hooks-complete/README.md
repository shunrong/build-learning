# Git Hooks 与自动化完整示例

## 📝 简介

本 Demo 展示如何使用 Husky、lint-staged 和 commitlint 建立完整的 Git 提交自动化检查流程。

## 🎯 涵盖内容

1. **Husky** - Git Hooks 管理
2. **lint-staged** - 暂存区文件检查
3. **commitlint** - 提交信息规范
4. **ESLint + Prettier** - 代码检查和格式化
5. **完整的提交前自动化流程**

## 🚀 快速开始

### 1. 安装依赖

```bash
npm install
```

**⚠️ 注意**：`npm install` 会自动执行 `husky install`，安装 Git Hooks。

### 2. 开发模式

```bash
npm run dev
```

### 3. 体验 Git Hooks

#### 步骤 1：修改代码

```bash
# 修改任意文件，例如
echo "console.log('test');" >> src/utils.js
```

#### 步骤 2：暂存文件

```bash
git add src/utils.js
```

#### 步骤 3：提交（触发 Hooks）

```bash
# ✅ 正确的提交
git commit -m "feat: 添加测试功能"

# ❌ 错误的提交（会被 commitlint 拒绝）
git commit -m "update"
git commit -m "修改代码"
```

---

## 📂 项目结构

```
01-git-hooks-complete/
├── .husky/                      # Husky 配置
│   ├── pre-commit              # 提交前检查
│   └── commit-msg              # 提交信息检查
├── src/
│   ├── components/
│   │   └── button.js
│   ├── utils.js
│   ├── styles.css
│   ├── index.html
│   └── index.js
├── .eslintrc.js                # ESLint 配置
├── .prettierrc.js              # Prettier 配置
├── commitlint.config.js        # commitlint 配置
├── webpack.config.js           # Webpack 配置
└── package.json                # 包含 lint-staged 配置
```

---

## 🔧 核心配置

### 1. Husky Hooks

#### .husky/pre-commit

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
```

**作用**：提交前运行 lint-staged。

#### .husky/commit-msg

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

**作用**：检查提交信息是否符合规范。

### 2. lint-staged 配置

**package.json**：
```json
{
  "lint-staged": {
    "*.js": [
      "prettier --write",
      "eslint --fix"
    ],
    "*.css": [
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

**作用**：只检查暂存区文件，提高效率。

### 3. commitlint 配置

**commitlint.config.js**：
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0],  // 允许中文
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore']
    ]
  }
};
```

---

## 🎮 工作流程演示

### 1. 修改代码

```bash
# 修改文件
vim src/utils.js
```

### 2. 暂存文件

```bash
git add src/utils.js
```

### 3. 提交代码

```bash
git commit -m "feat: 添加新工具函数"
```

### 4. Hook 执行流程

```
1. pre-commit hook 触发
    ↓
2. lint-staged 运行
    ├─ Prettier 格式化 src/utils.js
    ├─ ESLint 检查并修复 src/utils.js
    └─ 自动将修改添加到暂存区
    ↓
3. commit-msg hook 触发
    ↓
4. commitlint 检查提交信息
    ├─ 检查 type 是否合法 (feat ✅)
    ├─ 检查 subject 是否为空 (✅)
    └─ 检查格式是否正确 (✅)
    ↓
5. ✅ 所有检查通过 → 提交成功！
```

---

## 📝 Conventional Commits 规范

### 格式

```
<type>: <subject>
```

### 常用 Type

| Type | 说明 | 示例 |
|------|------|------|
| **feat** | 新功能 | `feat: 添加用户登录功能` |
| **fix** | 修复 | `fix: 修复按钮点击无响应` |
| **docs** | 文档 | `docs: 更新 README` |
| **style** | 格式 | `style: 格式化代码` |
| **refactor** | 重构 | `refactor: 重构用户模块` |
| **test** | 测试 | `test: 添加单元测试` |
| **chore** | 构建/工具 | `chore: 更新依赖` |

### ✅ 正确示例

```bash
git commit -m "feat: 添加用户登录功能"
git commit -m "fix: 修复按钮样式问题"
git commit -m "docs: 更新 API 文档"
git commit -m "style: 格式化代码"
git commit -m "refactor: 重构用户模块"
git commit -m "test: 添加登录测试"
git commit -m "chore: 更新 webpack 配置"
```

### ❌ 错误示例

```bash
# 没有 type
git commit -m "添加登录功能"  # ❌

# type 错误
git commit -m "add: 添加功能"  # ❌

# subject 太模糊
git commit -m "fix: 修复bug"  # ❌
git commit -m "update"  # ❌
```

---

## 🎯 实践练习

### 练习 1：修改代码并提交

```bash
# 1. 修改文件（故意写错格式）
echo "const test=1" >> src/utils.js

# 2. 暂存
git add src/utils.js

# 3. 提交（观察 Prettier 和 ESLint 自动修复）
git commit -m "feat: 添加测试变量"

# 4. 查看修复后的代码
git diff HEAD
```

### 练习 2：测试错误的提交信息

```bash
# 这些提交都会被 commitlint 拒绝
git commit -m "update"              # ❌ type 错误
git commit -m "添加功能"             # ❌ 没有 type
git commit -m "feat:"               # ❌ subject 为空
```

### 练习 3：跳过 Hooks（紧急情况）

```bash
# 跳过所有 hooks
git commit -m "WIP" --no-verify

# ⚠️ 注意：只在紧急情况下使用！
```

---

## 🔍 调试 Hooks

### 查看 Hook 是否安装

```bash
ls -la .husky/
```

### 手动运行 lint-staged

```bash
npx lint-staged
```

### 手动检查提交信息

```bash
echo "feat: test" | npx commitlint
```

---

## ✅ 验证清单

完成本 Demo 后，请确认：

- [ ] 理解 Git Hooks 的工作原理
- [ ] 会配置 Husky
- [ ] 会配置 lint-staged
- [ ] 会配置 commitlint
- [ ] 能写出规范的提交信息
- [ ] 理解提交前自动化检查流程

---

## 💡 最佳实践

1. ✅ 使用 lint-staged 只检查暂存区文件
2. ✅ 先格式化（Prettier），再检查（ESLint）
3. ✅ 使用 Conventional Commits 规范
4. ✅ 提供清晰的错误提示
5. ✅ 允许紧急情况下跳过检查（--no-verify）

---

**Phase 09: Git Hooks 与自动化 Demo 已完成！** 🎉

