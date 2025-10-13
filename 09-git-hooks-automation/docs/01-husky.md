# Husky 详解

## 📖 什么是 Git Hooks？

**Git Hooks** 是 Git 在特定事件（如 commit、push）时自动执行的脚本。

### 常用 Hooks

```bash
.git/hooks/
├── pre-commit        # 提交前执行
├── commit-msg        # 提交信息验证
├── pre-push          # 推送前执行
└── post-commit       # 提交后执行
```

---

## 什么是 Husky？

**Husky** 是一个让 Git Hooks 更容易使用的工具。

### 问题

直接使用 Git Hooks 的问题：
- ❌ `.git/hooks/` 不会被 git 跟踪
- ❌ 团队成员需要手动复制脚本
- ❌ 难以管理和维护

### 解决方案

Husky 的优势：
- ✅ Hooks 配置在项目中（`.husky/`）
- ✅ 随代码一起版本管理
- ✅ `npm install` 自动安装
- ✅ 易于配置和维护

---

## 快速开始

### 1. 安装

```bash
npm install -D husky
```

### 2. 初始化

```bash
# 创建 .husky 目录
npx husky install

# 在 package.json 中添加 prepare 脚本
npm pkg set scripts.prepare="husky install"
```

**package.json**：
```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

`prepare` 脚本会在 `npm install` 后自动执行。

### 3. 添加 Hook

```bash
# 添加 pre-commit hook
npx husky add .husky/pre-commit "npm test"

# 添加 commit-msg hook
npx husky add .husky/commit-msg "npx --no -- commitlint --edit $1"
```

---

## 常用 Hooks

### 1. pre-commit（提交前检查）⭐️

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 运行 lint-staged
npx lint-staged

# 或直接运行 lint
# npm run lint
```

**用途**：
- ✅ 代码格式化
- ✅ 代码检查
- ✅ 单元测试

### 2. commit-msg（提交信息检查）⭐️

```bash
# .husky/commit-msg
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 检查提交信息格式
npx --no -- commitlint --edit $1
```

**用途**：
- ✅ 提交信息规范检查

### 3. pre-push（推送前检查）

```bash
# .husky/pre-push
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 运行测试
npm test

# 运行构建
npm run build
```

**用途**：
- ✅ 运行完整测试
- ✅ 检查构建是否成功

---

## 完整配置

### package.json

```json
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint src/**/*.js",
    "test": "jest"
  },
  "devDependencies": {
    "husky": "^8.0.3"
  }
}
```

### 目录结构

```
project/
├── .husky/
│   ├── _/
│   │   └── husky.sh        # Husky 核心脚本
│   ├── pre-commit          # 提交前 hook
│   ├── commit-msg          # 提交信息 hook
│   └── pre-push            # 推送前 hook
└── package.json
```

---

## 🎯 最佳实践

### 1. 使用 lint-staged 优化性能

```bash
# .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

# 只检查暂存区文件，而不是所有文件
npx lint-staged
```

### 2. 提供清晰的错误信息

```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

echo "🔍 Running ESLint..."
npx lint-staged || {
  echo "❌ ESLint failed. Please fix the errors and try again."
  exit 1
}
```

### 3. 允许临时跳过

```bash
# 跳过所有 hooks
git commit -m "message" --no-verify

# 或
git commit -m "message" -n
```

**⚠️ 注意**：只在紧急情况下使用！

---

## 常见问题

### 1. Hooks 没有执行？

**检查**：
1. 是否运行了 `husky install`
2. Hook 文件是否有执行权限：`chmod +x .husky/pre-commit`
3. 是否在 Git 仓库中

### 2. 如何调试 Hooks？

```bash
# 添加调试输出
echo "Pre-commit hook is running..."
echo "Current directory: $(pwd)"
```

### 3. 团队成员 Hooks 不生效？

确保 `package.json` 中有：
```json
{
  "scripts": {
    "prepare": "husky install"
  }
}
```

团队成员执行 `npm install` 后会自动安装 Hooks。

---

**下一步**：学习 [lint-staged 详解](./02-lint-staged.md)

