# 迁移到统一工具链

## 🎯 为什么要迁移

### 传统工具链的痛点

```
ESLint + Prettier + Webpack + Babel
  ↓
问题：
1. 配置文件多（4+个）
2. 重复解析 AST（4次）
3. 性能慢（串行执行）
4. 工具冲突（ESLint vs Prettier）
5. 学习成本高
```

### 统一工具链的优势

```
Biome / Oxc
  ↓
优势：
1. 单个配置文件
2. 单次 AST 解析
3. 性能快（25-40x）
4. 无冲突
5. 学习成本低
```

---

## 🚀 迁移策略

### 策略 1：新项目直接使用

```bash
# 创建新项目
npm init -y

# 安装 Biome
npm install --save-dev @biomejs/biome

# 初始化
npx @biomejs/biome init

# 完成 ✅
```

### 策略 2：渐进式迁移

```
Phase 1: 先迁移 Formatter
  ESLint + Prettier → ESLint + Biome Format
  
Phase 2: 再迁移 Linter
  ESLint + Biome Format → Biome Check
  
Phase 3: 完全迁移
  Biome Check → Biome (All-in-One)
```

### 策略 3：并行运行

```json
// 同时运行新旧工具
{
  "scripts": {
    "lint:old": "eslint .",
    "lint:new": "biome check .",
    "lint": "npm run lint:old && npm run lint:new"
  }
}

// 逐步切换
```

---

## 📝 详细迁移步骤

### 从 ESLint + Prettier 迁移到 Biome

#### 1. 安装 Biome

```bash
npm install --save-dev @biomejs/biome
```

#### 2. 初始化配置

```bash
npx @biomejs/biome init
```

生成 `biome.json`。

#### 3. 迁移规则配置

```javascript
// .eslintrc.js
module.exports = {
  rules: {
    'no-console': 'error',
    'no-debugger': 'error',
    'prefer-const': 'warn'
  }
};

// biome.json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noConsoleLog": "error",
        "noDebugger": "error"
      },
      "style": {
        "useConst": "warn"
      }
    }
  }
}
```

#### 4. 更新 scripts

```json
{
  "scripts": {
    "lint": "biome check .",
    "format": "biome format . --write",
    "check": "biome check . --apply"
  }
}
```

#### 5. 更新 Git Hooks

```javascript
// .husky/pre-commit
#!/bin/sh
npx biome check --apply $(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(js|ts|jsx|tsx)$')
```

#### 6. 更新编辑器配置

```json
// .vscode/settings.json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true
}
```

#### 7. 删除旧工具

```bash
npm uninstall eslint prettier
rm .eslintrc.js .prettierrc.js
```

---

## ⚠️ 常见问题

### 1. 规则不完全匹配

**问题**：ESLint 有 300+ 规则，Biome 只有 200+

**解决**：
- 保留必要的 ESLint 规则
- 或接受 Biome 的推荐配置

```json
// 混合使用
{
  "scripts": {
    "lint:biome": "biome check .",
    "lint:eslint": "eslint --rule 'custom-rule: error' .",
    "lint": "npm run lint:biome && npm run lint:eslint"
  }
}
```

### 2. 自定义 ESLint 插件

**问题**：项目使用了自定义 ESLint 插件

**解决**：
- 保留 ESLint 仅用于自定义规则
- Biome 处理标准规则

### 3. 格式化差异

**问题**：Biome 和 Prettier 格式化结果略有不同

**解决**：
- 一次性格式化整个项目
- 提交为单独的 commit
- 团队达成共识

```bash
# 一次性格式化
biome format . --write

# 提交
git add .
git commit -m "chore: 迁移到 Biome"
```

---

## 📊 迁移收益

### 性能提升

```
原来（ESLint + Prettier）：
- Lint: 20s
- Format: 10s
- 总计: 30s

现在（Biome）：
- Check: 1.2s
- 提升: 25x ⚡️
```

### 配置简化

```
原来：
.eslintrc.js (100 行)
.prettierrc.js (20 行)
.eslintignore (10 行)
.prettierignore (10 行)
总计: 140 行

现在：
biome.json (30 行)
总计: 30 行
```

### 开发体验

```
原来：
- 保存时格式化需要 500ms
- Lint 报错需要 2s

现在：
- 保存时格式化需要 50ms ⚡️
- Lint 报错需要 200ms ⚡️
```

---

## 🎯 最佳实践

### 1. 团队沟通

```
迁移前：
1. 团队会议讨论
2. 说明收益和成本
3. 达成共识
4. 制定迁移计划
```

### 2. 分支策略

```
1. 创建迁移分支
2. 完成迁移
3. 测试验证
4. Code Review
5. 合并主分支
```

### 3. 文档更新

```
更新：
- README.md
- CONTRIBUTING.md
- 开发文档
- CI/CD 配置
```

---

## 🎓 核心收获

1. **渐进式迁移最安全**
2. **性能提升 25x**
3. **配置简化 80%**
4. **新项目直接使用**
5. **旧项目评估后迁移**

**迁移到统一工具链，提升开发效率！**

