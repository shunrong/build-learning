# Formatter 集成与实践

## 🎯 目标

学习如何在项目中集成 Formatter，以及 Formatter 在工程化中的最佳实践。

---

## 🔧 集成方式

### 1. 编辑器集成

#### VSCode

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  
  // 针对不同文件类型使用不同 Formatter
  "[javascript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[json]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

#### WebStorm / IntelliJ IDEA

```
Preferences → Languages & Frameworks → JavaScript → Prettier
✅ Run on save for files
✅ On 'Reformat Code' action
```

### 2. CLI 集成

```json
// package.json
{
  "scripts": {
    "format": "prettier --write \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:check": "prettier --check \"src/**/*.{js,jsx,ts,tsx,json,css,md}\"",
    "format:staged": "lint-staged"
  }
}
```

### 3. Git Hooks 集成

#### 使用 Husky + lint-staged

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,css,md}": [
      "prettier --write"
    ]
  }
}
```

### 4. CI/CD 集成

#### GitHub Actions

```yaml
# .github/workflows/format-check.yml
name: Format Check

on: [push, pull_request]

jobs:
  format-check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Check formatting
        run: npm run format:check
```

---

## ⚙️ 配置管理

### 1. 配置文件

#### .prettierrc

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "quoteProps": "as-needed",
  "jsxSingleQuote": false,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

#### .prettierignore

```
# 构建产物
dist/
build/
coverage/

# 依赖
node_modules/

# 生成的文件
*.min.js
*.bundle.js

# 特定文件
public/
.next/
```

### 2. 针对不同文件类型的配置

```javascript
// prettier.config.js
module.exports = {
  // 基础配置
  printWidth: 80,
  tabWidth: 2,
  
  // 针对特定文件的覆盖配置
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
        tabWidth: 2
      }
    },
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always'
      }
    },
    {
      files: '*.css',
      options: {
        singleQuote: false
      }
    }
  ]
};
```

---

## 🤝 与 ESLint 协作

### 1. 冲突问题

```
ESLint：代码质量 + 代码风格
Prettier：代码风格

冲突区域：代码风格规则
```

### 2. 解决方案

#### 方案 1：关闭 ESLint 的风格规则

```bash
npm install --save-dev eslint-config-prettier
```

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "prettier"  // 必须放在最后
  ]
}
```

#### 方案 2：使用 eslint-plugin-prettier

```bash
npm install --save-dev eslint-plugin-prettier
```

```json
// .eslintrc.json
{
  "extends": [
    "eslint:recommended",
    "plugin:prettier/recommended"
  ]
}
```

### 3. 推荐工作流

```
代码编写
  ↓
保存时自动格式化（Prettier）
  ↓
提交前检查（ESLint + Prettier）
  ↓
CI/CD 验证
```

---

## 📦 多项目统一配置

### 1. 创建共享配置包

```bash
# @mycompany/prettier-config
npm init -y
```

```javascript
// index.js
module.exports = {
  printWidth: 100,
  tabWidth: 2,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always'
};
```

```json
// package.json
{
  "name": "@mycompany/prettier-config",
  "version": "1.0.0",
  "main": "index.js"
}
```

### 2. 在项目中使用

```bash
npm install --save-dev @mycompany/prettier-config
```

```json
// package.json
{
  "prettier": "@mycompany/prettier-config"
}
```

或扩展配置：

```javascript
// prettier.config.js
module.exports = {
  ...require('@mycompany/prettier-config'),
  // 覆盖特定配置
  printWidth: 120
};
```

---

## 🎨 团队协作最佳实践

### 1. 统一编辑器配置

```ini
# .editorconfig
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false
```

### 2. 强制格式化检查

```json
// package.json
{
  "scripts": {
    "precommit": "lint-staged",
    "prepush": "npm run format:check && npm test"
  }
}
```

### 3. PR 自动检查

```yaml
# .github/workflows/pr-check.yml
name: PR Check

on:
  pull_request:
    branches: [main, develop]

jobs:
  format-and-lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install dependencies
        run: npm ci
      
      - name: Format check
        run: npm run format:check
      
      - name: Lint check
        run: npm run lint
```

---

## 🚀 性能优化

### 1. 增量格式化

```json
// package.json
{
  "scripts": {
    "format:changed": "prettier --write $(git diff --name-only --diff-filter=ACM \"*.js\" \"*.ts\")"
  }
}
```

### 2. 并行处理

```javascript
// format-parallel.js
const glob = require('glob');
const prettier = require('prettier');
const fs = require('fs').promises;
const pLimit = require('p-limit');

const limit = pLimit(10);  // 并发限制

async function formatFiles(pattern) {
  const files = glob.sync(pattern);
  const config = await prettier.resolveConfig(process.cwd());
  
  await Promise.all(
    files.map(file =>
      limit(async () => {
        const code = await fs.readFile(file, 'utf8');
        const formatted = prettier.format(code, {
          ...config,
          filepath: file
        });
        await fs.writeFile(file, formatted);
        console.log(`✓ ${file}`);
      })
    )
  );
}

formatFiles('src/**/*.{js,ts}');
```

### 3. 缓存机制

```javascript
// format-with-cache.js
const fs = require('fs');
const crypto = require('crypto');

class FormatterWithCache {
  constructor(cacheDir = '.format-cache') {
    this.cacheDir = cacheDir;
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir);
    }
  }
  
  getHash(code) {
    return crypto.createHash('md5').update(code).digest('hex');
  }
  
  getCachePath(hash) {
    return `${this.cacheDir}/${hash}`;
  }
  
  async format(code, file) {
    const hash = this.getHash(code);
    const cachePath = this.getCachePath(hash);
    
    // 检查缓存
    if (fs.existsSync(cachePath)) {
      console.log(`✓ Cache hit: ${file}`);
      return fs.readFileSync(cachePath, 'utf8');
    }
    
    // 格式化
    const formatted = prettier.format(code, {
      filepath: file
    });
    
    // 写入缓存
    fs.writeFileSync(cachePath, formatted);
    console.log(`✓ Formatted: ${file}`);
    
    return formatted;
  }
}
```

---

## 🔍 调试和故障排查

### 1. 检查配置

```bash
# 查看生效的配置
prettier --find-config-path src/index.js

# 查看文件的配置
prettier --show-config src/index.js
```

### 2. 调试格式化结果

```javascript
// debug-format.js
const prettier = require('prettier');
const fs = require('fs');

const code = fs.readFileSync('src/index.js', 'utf8');

// 格式化并输出 AST
const ast = prettier.__debug.parse(code, {
  parser: 'babel'
});

console.log(JSON.stringify(ast, null, 2));

// 格式化并输出 Doc（IR）
const doc = prettier.__debug.formatDoc(
  prettier.__debug.printToDoc(code, {
    parser: 'babel'
  })
);

console.log(doc);
```

### 3. 常见问题

#### 问题 1：格式化后代码错误

```javascript
// ❌ 错误：Prettier 不应该改变语义
const x = 1 + 2 * 3;  // 7

// 格式化后
const x = 1 + 2 * 3;  // 仍然是 7 ✅

// 如果格式化后变成了 (1 + 2) * 3，那就是 Bug！
```

#### 问题 2：与 ESLint 冲突

```bash
# 检查冲突
npx eslint-config-prettier src/index.js

# 输出冲突的规则
# The following rules are enabled but conflict with prettier:
#   - indent
#   - quotes
```

#### 问题 3：性能慢

```bash
# 使用 --debug-check 找出慢的文件
prettier --debug-check "src/**/*.js"
```

---

## 📊 统计和报告

### 1. 格式化覆盖率

```javascript
// format-coverage.js
const glob = require('glob');
const prettier = require('prettier');
const fs = require('fs');

async function checkCoverage(pattern) {
  const files = glob.sync(pattern);
  let formatted = 0;
  let unformatted = 0;
  
  for (const file of files) {
    const code = fs.readFileSync(file, 'utf8');
    const isFormatted = prettier.check(code, { filepath: file });
    
    if (isFormatted) {
      formatted++;
    } else {
      unformatted++;
      console.log(`❌ Not formatted: ${file}`);
    }
  }
  
  const total = formatted + unformatted;
  const coverage = (formatted / total * 100).toFixed(2);
  
  console.log(`\n📊 Format Coverage: ${coverage}%`);
  console.log(`   Formatted: ${formatted}`);
  console.log(`   Unformatted: ${unformatted}`);
  console.log(`   Total: ${total}`);
}

checkCoverage('src/**/*.{js,ts}');
```

### 2. 格式化变更报告

```javascript
// format-diff.js
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

async function formatDiff() {
  // 格式化所有文件
  await execPromise('prettier --write "src/**/*.js"');
  
  // 查看 Git 变更
  const { stdout } = await execPromise('git diff --stat');
  
  console.log('📝 Formatting changes:\n');
  console.log(stdout);
}

formatDiff();
```

---

## 💡 最佳实践总结

### 1. 配置管理

✅ 使用共享配置包  
✅ 配置文件提交到 Git  
✅ 使用 .prettierignore 排除文件

### 2. 编辑器集成

✅ 启用保存时格式化  
✅ 配置默认 Formatter  
✅ 团队统一编辑器配置

### 3. Git Hooks

✅ pre-commit 检查格式化  
✅ 只格式化暂存文件  
✅ 格式化失败阻止提交

### 4. CI/CD

✅ PR 检查格式化  
✅ 格式化失败阻止合并  
✅ 自动生成格式化报告

### 5. 性能优化

✅ 增量格式化  
✅ 并行处理  
✅ 使用缓存

---

## 🎯 实践建议

1. **从新项目开始**：
   - 配置 Prettier
   - 设置 Git Hooks
   - 团队达成共识

2. **老项目迁移**：
   - 先统一配置
   - 一次性格式化全部代码
   - 提交为单独的 commit
   - 继续开发

3. **持续改进**：
   - 定期审查配置
   - 收集团队反馈
   - 优化性能

---

## 📚 扩展阅读

- [Prettier 官方文档](https://prettier.io/docs/en/)
- [Integrating with Linters](https://prettier.io/docs/en/integrating-with-linters.html)
- [Prettier Options](https://prettier.io/docs/en/options.html)

---

## 🎓 核心收获

1. Formatter 集成是多层次的
2. 与 ESLint 协作需要正确配置
3. Git Hooks 是强制执行的关键
4. 性能优化很重要
5. 团队协作需要统一配置

**正确的集成让 Formatter 发挥最大价值！**

