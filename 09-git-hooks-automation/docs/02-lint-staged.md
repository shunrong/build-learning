# lint-staged 详解

## 📖 什么是 lint-staged？

**lint-staged** 是一个只对 Git 暂存区文件运行 linters 的工具。

---

## 为什么需要它？

### 问题

```bash
# 直接运行 lint，会检查所有文件
npx eslint src/**/*.js  # 可能要检查几千个文件

# 如果项目很大
# - 耗时长（可能几分钟）
# - 可能有很多旧代码不符合规范
# - 每次提交都要等很久
```

### 解决方案

```bash
# lint-staged 只检查暂存区文件
git add src/components/Button.js  # 只添加了 1 个文件

# lint-staged 只检查这 1 个文件
# - 速度快（几秒）
# - 只检查你修改的代码
# - 不影响旧代码
```

---

## 快速开始

### 1. 安装

```bash
npm install -D lint-staged
```

### 2. 配置

#### 方式1：package.json

```json
{
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
  }
}
```

#### 方式2：.lintstagedrc.js

```javascript
module.exports = {
  '*.js': ['prettier --write', 'eslint --fix'],
  '*.css': ['prettier --write', 'stylelint --fix'],
  '*.{json,md}': ['prettier --write']
};
```

### 3. 使用

```bash
# 手动运行
npx lint-staged

# 通常在 pre-commit hook 中运行
# .husky/pre-commit
npx lint-staged
```

---

## 配置详解

### 1. 文件匹配模式

```javascript
module.exports = {
  // 匹配所有 .js 文件
  '*.js': 'eslint --fix',
  
  // 匹配所有 .ts 和 .tsx 文件
  '*.{ts,tsx}': 'eslint --fix',
  
  // 匹配特定目录
  'src/**/*.js': 'eslint --fix',
  
  // 排除特定文件
  '!(node_modules)/**/*.js': 'eslint --fix'
};
```

### 2. 命令数组

```javascript
module.exports = {
  '*.js': [
    'prettier --write',     // 1. 先格式化
    'eslint --fix',         // 2. 再检查并修复
    'git add'               // 3. 将修改后的文件重新添加到暂存区
  ]
};
```

**⚠️ 注意**：Husky 8+ 不需要手动 `git add`，会自动添加。

### 3. 函数配置

```javascript
module.exports = {
  '*.js': (filenames) => {
    // filenames 是匹配到的文件列表
    return [
      `prettier --write ${filenames.join(' ')}`,
      `eslint --fix ${filenames.join(' ')}`
    ];
  }
};
```

---

## 完整配置示例

### JavaScript 项目

```javascript
// .lintstagedrc.js
module.exports = {
  // JavaScript 文件
  '*.{js,jsx}': [
    'prettier --write',
    'eslint --fix'
  ],
  
  // TypeScript 文件
  '*.{ts,tsx}': [
    'prettier --write',
    'eslint --fix'
  ],
  
  // CSS 文件
  '*.{css,scss,less}': [
    'prettier --write',
    'stylelint --fix'
  ],
  
  // JSON/Markdown 文件
  '*.{json,md}': [
    'prettier --write'
  ]
};
```

### React 项目

```javascript
module.exports = {
  '*.{js,jsx,ts,tsx}': [
    'prettier --write',
    'eslint --fix',
    // 运行相关测试
    'jest --bail --findRelatedTests'
  ],
  '*.css': [
    'prettier --write',
    'stylelint --fix'
  ]
};
```

---

## 🎯 最佳实践

### 1. 先格式化，再检查

```javascript
{
  '*.js': [
    'prettier --write',  // 1. 先格式化
    'eslint --fix'       // 2. 再检查
  ]
}
```

### 2. 只检查必要的文件

```javascript
{
  // ✅ 只检查源代码
  'src/**/*.js': 'eslint --fix',
  
  // ❌ 不检查所有 JS 文件
  '*.js': 'eslint --fix'  // 可能包括 node_modules
}
```

### 3. 使用缓存加速

```javascript
{
  '*.js': [
    'eslint --fix --cache',  // 使用 ESLint 缓存
    'prettier --write'
  ]
}
```

### 4. 自动修复 + 手动检查

```javascript
{
  '*.js': [
    'prettier --write',
    'eslint --fix',
    'eslint --max-warnings=0'  // 有警告也失败
  ]
}
```

---

## 常见问题

### 1. lint-staged 慢怎么办？

**优化**：
```javascript
{
  '*.js': [
    'eslint --fix --cache',  // 使用缓存
    'prettier --write'
  ]
}
```

### 2. 如何跳过某些文件？

**.lintstagedrc.js**：
```javascript
{
  '*.js': (files) => {
    // 过滤掉某些文件
    const filtered = files.filter(f => !f.includes('legacy'));
    return `eslint --fix ${filtered.join(' ')}`;
  }
}
```

### 3. 如何运行测试？

```javascript
{
  '*.js': [
    'prettier --write',
    'eslint --fix',
    'jest --bail --findRelatedTests'  // 只运行相关测试
  ]
}
```

---

## 工作流程

```
1. git add file.js
    ↓
2. git commit
    ↓
3. pre-commit hook 触发
    ↓
4. lint-staged 运行
    ├─ 找到暂存区的 .js 文件
    ├─ 运行 prettier --write
    ├─ 运行 eslint --fix
    └─ 自动 git add（修改后的文件）
    ↓
5. 检查通过 → 提交成功 ✅
   检查失败 → 提交失败 ❌
```

---

**下一步**：学习 [commitlint 详解](./03-commitlint.md)

