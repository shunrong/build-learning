# commitlint 详解

## 📖 什么是 commitlint？

**commitlint** 是一个检查 Git 提交信息是否符合规范的工具。

---

## Conventional Commits 规范

### 格式

```
<type>(<scope>): <subject>

<body>

<footer>
```

**简化格式**（最常用）：
```
<type>: <subject>
```

### type（必需）

| Type | 说明 | 示例 |
|------|------|------|
| **feat** | 新功能 | `feat: 添加用户登录功能` |
| **fix** | 修复 bug | `fix: 修复登录按钮无响应` |
| **docs** | 文档 | `docs: 更新 README` |
| **style** | 格式 | `style: 格式化代码` |
| **refactor** | 重构 | `refactor: 重构用户模块` |
| **test** | 测试 | `test: 添加登录测试` |
| **chore** | 构建/工具 | `chore: 更新依赖` |
| **perf** | 性能优化 | `perf: 优化列表渲染` |
| **ci** | CI 配置 | `ci: 更新 GitHub Actions` |
| **build** | 构建系统 | `build: 更新 webpack 配置` |
| **revert** | 回滚 | `revert: 回滚上次提交` |

### scope（可选）

```bash
feat(user): 添加用户登录功能
fix(button): 修复按钮样式问题
docs(readme): 更新安装说明
```

### subject（必需）

- 简短描述（建议不超过 50 字符）
- 使用祈使句
- 不要以句号结尾

---

## 快速开始

### 1. 安装

```bash
npm install -D @commitlint/cli @commitlint/config-conventional
```

### 2. 配置

**commitlint.config.js**：
```javascript
module.exports = {
  extends: ['@commitlint/config-conventional']
};
```

### 3. 添加 Hook

```bash
# 创建 commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit $1'
```

**.husky/commit-msg**：
```bash
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx --no -- commitlint --edit $1
```

---

## 配置详解

### 1. 基础配置

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  
  rules: {
    // type 必须小写
    'type-case': [2, 'always', 'lower-case'],
    
    // type 必须是指定值之一
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore'
      ]
    ],
    
    // subject 不能为空
    'subject-empty': [2, 'never'],
    
    // subject 最大长度
    'subject-max-length': [2, 'always', 50]
  }
};
```

### 2. 自定义规则

```javascript
module.exports = {
  extends: ['@commitlint/config-conventional'],
  
  rules: {
    // 允许中文
    'subject-case': [0],
    
    // 允许更长的 subject
    'subject-max-length': [2, 'always', 100],
    
    // 自定义 type
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
        'chore',    // 构建
        'wip'       // 进行中（自定义）
      ]
    ]
  }
};
```

### 3. 规则级别

```javascript
[level, applicable, value]

// level
0 - 禁用规则
1 - 警告
2 - 错误

// applicable
'always' - 必须
'never' - 不能

// value
具体值
```

---

## 提交示例

### ✅ 正确的提交

```bash
# 新功能
git commit -m "feat: 添加用户登录功能"
git commit -m "feat(auth): 添加 JWT 认证"

# 修复
git commit -m "fix: 修复登录按钮无响应"
git commit -m "fix(button): 修复按钮样式错误"

# 文档
git commit -m "docs: 更新 README 安装说明"
git commit -m "docs(api): 添加 API 文档"

# 格式化
git commit -m "style: 格式化代码"

# 重构
git commit -m "refactor: 重构用户模块"
git commit -m "refactor(user): 优化用户数据处理"

# 测试
git commit -m "test: 添加登录功能测试"

# 构建
git commit -m "chore: 更新依赖"
git commit -m "chore(deps): 升级 webpack 到 5.0"
```

### ❌ 错误的提交

```bash
# 没有 type
git commit -m "添加登录功能"

# type 错误
git commit -m "add: 添加登录功能"

# 没有 subject
git commit -m "feat:"

# subject 以句号结尾
git commit -m "feat: 添加登录功能。"

# subject 太模糊
git commit -m "fix: 修复bug"
git commit -m "update"
git commit -m "WIP"
```

---

## 🎯 最佳实践

### 1. 使用规范的 type

```bash
# ✅ 推荐
feat: 添加用户注册功能
fix: 修复密码验证错误
docs: 更新 API 文档

# ❌ 不推荐
update: 更新代码
modify: 修改文件
```

### 2. subject 要简洁明确

```bash
# ✅ 好
fix: 修复登录页面按钮点击无响应

# ❌ 差
fix: 修复问题
fix: 修复一个bug
```

### 3. 使用中文 or 英文保持一致

```bash
# ✅ 全中文
feat: 添加用户登录功能
fix: 修复按钮样式问题

# ✅ 全英文
feat: add user login
fix: fix button style issue

# ❌ 混用
feat: add 用户登录
fix: 修复 button style
```

### 4. 复杂提交使用 body

```bash
git commit -m "feat: 添加用户登录功能" -m "
- 添加登录表单
- 添加密码加密
- 添加 JWT 认证
- 添加记住密码功能
"
```

---

## 常见问题

### 1. 如何临时跳过检查？

```bash
git commit -m "WIP" --no-verify
```

**⚠️ 注意**：只在紧急情况下使用！

### 2. 如何支持中文？

```javascript
// commitlint.config.js
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'subject-case': [0]  // 禁用 case 检查
  }
};
```

### 3. 如何查看所有规则？

```bash
npx commitlint --help-config
```

---

## 配合工具使用

### 1. commitizen（交互式提交）

```bash
npm install -D commitizen cz-conventional-changelog

# 使用
npx cz
```

会提示你选择 type、输入 scope、subject 等。

### 2. standard-version（自动生成 CHANGELOG）

```bash
npm install -D standard-version

# 使用
npx standard-version
```

会根据提交信息自动生成 CHANGELOG.md。

---

## 🎯 完整工作流

```
1. git add files
    ↓
2. git commit -m "feat: 添加功能"
    ↓
3. commit-msg hook 触发
    ↓
4. commitlint 检查提交信息
    ├─ 检查 type 是否合法
    ├─ 检查 subject 是否为空
    └─ 检查格式是否正确
    ↓
5. 通过 → 提交成功 ✅
   失败 → 提交失败 ❌
```

---

**Phase 09 文档已完成！** 🎉

