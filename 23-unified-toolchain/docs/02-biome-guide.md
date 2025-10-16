# Biome 完全指南

## 🎯 什么是 Biome

**Biome** 是一个统一的 Web 开发工具链，整合了 Linter、Formatter、Bundler 等功能。

```
传统方案：
ESLint + Prettier + Webpack
  ↓
统一工具链：
Biome (All-in-One)
```

---

## ⚡️ 核心优势

### 1. 极致性能

```
Biome 比 ESLint + Prettier 快 25x！

基准测试（10000 个文件）：
- ESLint + Prettier: 45 秒
- Biome:             1.8 秒 ⚡️
```

**为什么这么快？**
- Rust 实现
- 单次 AST 解析
- 并行处理
- 增量编译

### 2. 零配置

```json
// ❌ 传统方案需要多个配置文件
.eslintrc.js
.prettierrc.js
webpack.config.js

// ✅ Biome 只需一个
biome.json
```

### 3. 统一体验

```bash
# 一个命令搞定所有
biome check .          # Lint + Format
biome check . --apply  # 自动修复
```

---

## 🚀 快速开始

### 1. 安装

```bash
npm install --save-dev @biomejs/biome
```

### 2. 初始化

```bash
npx @biomejs/biome init
```

生成 `biome.json`:
```json
{
  "$schema": "https://biomejs.dev/schemas/1.4.1/schema.json",
  "organizeImports": {
    "enabled": true
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  }
}
```

### 3. 使用

```bash
# 检查
biome check src/

# 自动修复
biome check src/ --apply

# 只格式化
biome format src/ --write

# 只 Lint
biome lint src/
```

---

## ⚙️ 配置详解

### 1. Linter 配置

```json
{
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true,
      
      // 自定义规则
      "suspicious": {
        "noDebugger": "error",
        "noConsoleLog": "warn"
      },
      
      "style": {
        "useConst": "error",
        "useTemplate": "warn"
      }
    }
  }
}
```

### 2. Formatter 配置

```json
{
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80,
    "lineEnding": "lf"
  }
}
```

### 3. 忽略文件

```json
{
  "files": {
    "ignore": [
      "node_modules",
      "dist",
      "build",
      "*.min.js"
    ]
  }
}
```

---

## 💡 迁移指南

### 从 ESLint + Prettier 迁移

#### 1. 安装 Biome

```bash
npm install --save-dev @biomejs/biome
```

#### 2. 初始化配置

```bash
npx @biomejs/biome init
```

#### 3. 更新 scripts

```json
{
  "scripts": {
    "lint": "biome check .",
    "format": "biome format . --write",
    "check": "biome check . --apply"
  }
}
```

#### 4. 卸载旧工具

```bash
npm uninstall eslint prettier
rm .eslintrc.js .prettierrc.js
```

#### 5. 更新 Git Hooks

```json
// .husky/pre-commit
#!/bin/sh
npx biome check --apply --no-errors-on-unmatched --files-ignore-unknown=true
```

---

## 🎨 编辑器集成

### VSCode

```bash
# 安装扩展
code --install-extension biomejs.biome
```

`.vscode/settings.json`:
```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "quickfix.biome": true,
    "source.organizeImports.biome": true
  }
}
```

---

## 📊 Biome vs ESLint + Prettier

| 特性 | Biome | ESLint + Prettier |
|------|-------|------------------|
| **性能** | ⚡️ 25x 更快 | 慢 |
| **配置** | 单文件 | 多文件 |
| **规则数量** | 200+ | 300+ |
| **生态** | 🟡 成长中 | 🟢 成熟 |
| **支持语言** | JS/TS/JSON | JS/TS + 插件 |
| **学习曲线** | 🟢 简单 | 🔴 复杂 |

---

## 🎯 适用场景

### ✅ 推荐使用 Biome

- 新项目
- 追求极致性能
- 希望简化工具链
- 纯 JS/TS 项目

### ⚠️ 谨慎使用

- 需要特定 ESLint 插件
- 团队不愿意迁移
- 需要 Vue/Svelte 等特殊语言支持

---

## 🎓 核心收获

1. **Biome = All-in-One**
2. **性能提升 25x**
3. **零配置开箱即用**
4. **适合新项目**
5. **未来趋势**

**Biome 代表了前端工具链的未来方向！**

