# Demo 4: 手写自定义 Loader

## 📚 学习目标

- 理解 Loader 的本质和工作原理
- 掌握 Loader API 的使用
- 实现常见的自定义 Loader
- 理解同步和异步 Loader
- 掌握 Loader 开发最佳实践

---

## 🎯 实现的自定义 Loader

### 1. markdown-loader

**功能**：将 Markdown 文件转换为 HTML

**实现**：
```javascript
const { marked } = require('marked');

module.exports = function(source) {
  const html = marked(source);
  return `export default ${JSON.stringify(html)}`;
};
```

**使用**：
```javascript
import html from './README.md';
document.getElementById('content').innerHTML = html;
```

---

### 2. banner-loader

**功能**：在文件顶部添加注释横幅

**实现**：
```javascript
module.exports = function(source) {
  const options = this.getOptions();
  const banner = `/*\n${options.banner}\n*/\n\n`;
  return banner + source;
};
```

**配置**：
```javascript
{
  test: /\.js$/,
  enforce: 'pre',
  use: {
    loader: './loaders/banner-loader.js',
    options: {
      banner: 'Copyright (c) 2024'
    }
  }
}
```

---

### 3. remove-console-loader

**功能**：移除代码中的 console.log 语句

**实现**：
```javascript
module.exports = function(source) {
  const options = this.getOptions();
  
  if (!options.enabled) {
    return source;
  }
  
  return source.replace(
    /console\.(log|warn|info|debug|error)\(.*?\);?\s*/g,
    ''
  );
};
```

**使用场景**：生产环境自动移除调试代码

---

### 4. i18n-loader

**功能**：根据语言环境加载国际化文件

**实现**：
```javascript
module.exports = function(source) {
  const options = this.getOptions();
  const translations = JSON.parse(source);
  const locale = options.locale || 'en';
  const localeData = translations[locale] || translations.en;
  
  return `export default ${JSON.stringify(localeData)}`;
};
```

**使用**：
```javascript
// messages.i18n.json
{
  "en": { "hello": "Hello" },
  "zh-CN": { "hello": "你好" }
}

// 使用（自动选择语言）
import messages from './messages.i18n.json';
console.log(messages.hello);  // "你好"
```

---

## 🚀 运行步骤

### 1. 安装依赖

```bash
npm install
```

---

### 2. 开发模式

```bash
npm run dev
```

**观察点**：
1. Markdown 内容自动转换为 HTML
2. 打开 Sources 面板，查看文件顶部的 Banner 注释
3. 控制台有 console.log 输出（开发模式保留）
4. 国际化内容显示中文（配置为 zh-CN）

---

### 3. 修改 Markdown，观察 HMR

修改 `src/content/demo.md`：

```markdown
# 新标题

这是修改后的内容。
```

**观察**：
- 页面无需刷新
- Markdown 内容立即更新
- 控制台输出 "Markdown 热更新！"

---

### 4. 生产构建

```bash
npm run build
```

查看 `dist/js/main.*.js`，观察：
- ✅ Banner 注释已添加（文件顶部）
- ✅ console.log 已移除（Remove Console Loader）
- ✅ Markdown 已转换为 HTML

---

## 🔍 Loader 实现详解

### Loader 的本质

```javascript
/**
 * Loader 就是一个函数
 * @param {string|Buffer} source - 文件内容
 * @return {string|Buffer} 转换后的内容
 */
module.exports = function(source) {
  return transform(source);
};
```

---

### Loader API

#### 1. this.getOptions()

获取 Loader 配置：

```javascript
module.exports = function(source) {
  const options = this.getOptions();
  console.log(options);  // { banner: 'xxx' }
  
  return source;
};
```

---

#### 2. this.callback()

返回多个值（code、sourceMap、meta）：

```javascript
module.exports = function(source) {
  const result = transform(source);
  
  this.callback(
    null,           // Error | null
    result.code,    // 转换后的代码
    result.map,     // Source Map（可选）
    { ast: result.ast }  // 元数据（可选）
  );
};
```

---

#### 3. this.async()

异步 Loader：

```javascript
module.exports = function(source) {
  const callback = this.async();
  
  asyncTransform(source).then(result => {
    callback(null, result);
  }).catch(err => {
    callback(err);
  });
};
```

---

#### 4. this.resourcePath

当前文件路径：

```javascript
module.exports = function(source) {
  console.log(this.resourcePath);
  // /Users/xxx/src/index.js
  
  return source;
};
```

---

#### 5. this.emitFile()

输出额外文件：

```javascript
module.exports = function(source) {
  this.emitFile('output.txt', 'file content');
  return source;
};
```

---

### 同步 vs 异步 Loader

#### 同步 Loader（简单返回）

```javascript
module.exports = function(source) {
  const result = transformSync(source);
  return result;
};
```

---

#### 同步 Loader（使用 callback）

```javascript
module.exports = function(source) {
  const result = transformSync(source);
  this.callback(null, result);
  // ⚠️ 不要 return
};
```

---

#### 异步 Loader

```javascript
module.exports = function(source) {
  const callback = this.async();
  
  asyncTransform(source).then(result => {
    callback(null, result);
  });
  
  // ⚠️ 不要 return
};
```

---

## 🔧 配置验证

### 使用 schema-utils

```bash
npm install -D schema-utils
```

```javascript
const { validate } = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    age: { type: 'number' }
  },
  required: ['name']
};

module.exports = function(source) {
  const options = this.getOptions();
  
  validate(schema, options, {
    name: 'My Loader',
    baseDataPath: 'options'
  });
  
  return source;
};
```

---

## 💡 核心概念

### 1. Loader 链

```
file.js
    ↓ loader-a
transformed-1
    ↓ loader-b
transformed-2
    ↓ loader-c
final
```

**执行顺序**：从右到左

```javascript
use: ['loader-c', 'loader-b', 'loader-a']
```

---

### 2. enforce

控制执行顺序：

```javascript
// pre: 前置 Loader
{
  test: /\.js$/,
  enforce: 'pre',
  use: 'eslint-loader'
}

// normal: 普通 Loader（默认）
{
  test: /\.js$/,
  use: 'babel-loader'
}

// post: 后置 Loader
{
  test: /\.js$/,
  enforce: 'post',
  use: 'uglify-loader'
}
```

**执行顺序**：pre → normal → post

---

### 3. pitch 方法

Loader 有两个阶段：
1. **Pitch 阶段**：从左到右
2. **Normal 阶段**：从右到左

```javascript
module.exports = function(source) {
  console.log('Normal phase');
  return source;
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  console.log('Pitch phase');
  
  // 传递数据给 normal 阶段
  data.value = 42;
  
  // 如果返回值，跳过后续 Loader
  // return 'skip';
};
```

---

### 4. raw Loader

处理二进制文件（图片、字体等）：

```javascript
module.exports = function(source) {
  // source 是 Buffer
  console.log(Buffer.isBuffer(source));  // true
  
  return source;
};

// ⚠️ 标记为 raw
module.exports.raw = true;
```

---

## 🐛 调试技巧

### 1. 打印日志

```javascript
module.exports = function(source) {
  console.log('='.repeat(50));
  console.log('Resource:', this.resourcePath);
  console.log('Source length:', source.length);
  console.log('Options:', this.getOptions());
  console.log('='.repeat(50));
  
  return source;
};
```

---

### 2. 使用 debugger

```javascript
module.exports = function(source) {
  debugger;  // 设置断点
  
  const result = transform(source);
  return result;
};
```

**调试命令**：
```bash
node --inspect-brk ./node_modules/webpack/bin/webpack.js
```

---

### 3. 单元测试

```javascript
const loader = require('./my-loader');

// 模拟 Loader 上下文
const context = {
  getOptions() {
    return { enabled: true };
  },
  resourcePath: '/path/to/file.js'
};

const source = 'console.log("test");';
const result = loader.call(context, source);

console.log(result);  // 输出结果
```

---

## 📁 项目结构

```
04-custom-loader/
├── loaders/                      # 自定义 Loader 目录
│   ├── markdown-loader.js        # Markdown 转 HTML
│   ├── banner-loader.js          # 添加 Banner
│   ├── remove-console-loader.js  # 移除 console
│   ├── i18n-loader.js            # 国际化
│   ├── async-loader-example.js   # 异步 Loader 示例
│   └── pitch-loader-example.js   # Pitch 方法示例
├── src/
│   ├── content/
│   │   └── demo.md               # Markdown 文件
│   ├── locales/
│   │   └── messages.i18n.json    # 国际化文件
│   ├── styles/
│   │   └── main.css
│   ├── index.html
│   └── index.js
├── webpack.config.js             # Webpack 配置
├── package.json
└── README.md
```

---

## 💡 最佳实践

### 1. 单一职责

```javascript
// ✅ 好：每个 Loader 只做一件事
module.exports = function(source) {
  return removeComments(source);
};
```

---

### 2. 可配置

```javascript
// ✅ 好：提供配置选项
module.exports = function(source) {
  const options = this.getOptions();
  const { enabled = true } = options;
  
  return enabled ? transform(source) : source;
};
```

---

### 3. 验证配置

```javascript
// ✅ 好：验证配置
const { validate } = require('schema-utils');

module.exports = function(source) {
  const options = this.getOptions();
  validate(schema, options, { name: 'My Loader' });
  
  return transform(source);
};
```

---

### 4. 启用缓存

```javascript
// ✅ 好：启用缓存
module.exports = function(source) {
  this.cacheable && this.cacheable(true);
  return transform(source);
};
```

---

### 5. 友好的错误信息

```javascript
// ✅ 好：提供详细错误信息
module.exports = function(source) {
  try {
    return transform(source);
  } catch (error) {
    throw new Error(
      `Failed to transform ${this.resourcePath}:\n${error.message}`
    );
  }
};
```

---

## 🎯 实验任务

### 任务 1：创建自己的 Loader

1. 在 `loaders/` 目录创建 `my-loader.js`
2. 实现一个简单的转换功能（如大写转换）
3. 在 webpack.config.js 中配置
4. 测试运行

---

### 任务 2：添加配置选项

1. 给 Loader 添加配置选项
2. 使用 `this.getOptions()` 获取
3. 使用 schema-utils 验证

---

### 任务 3：实现异步 Loader

1. 修改 Loader 为异步版本
2. 使用 `this.async()` 获取回调
3. 模拟异步操作（如读取文件）

---

### 任务 4：调试 Loader

1. 在 Loader 中添加 `console.log`
2. 打印 `this.resourcePath`、options 等
3. 观察执行流程

---

## 🐛 常见问题

### Q1: Loader 没有执行？

**原因**：路径配置错误

```javascript
// ✅ 正确：使用绝对路径
use: path.resolve(__dirname, 'loaders/my-loader.js')

// 或配置 resolveLoader
resolveLoader: {
  modules: ['node_modules', path.resolve(__dirname, 'loaders')]
}
```

---

### Q2: 异步 Loader 没有输出？

**原因**：忘记调用 callback

```javascript
// ❌ 错误：没有调用 callback
module.exports = function(source) {
  const callback = this.async();
  asyncTransform(source);  // 忘记调用 callback
};

// ✅ 正确
module.exports = function(source) {
  const callback = this.async();
  asyncTransform(source).then(result => {
    callback(null, result);  // 调用 callback
  });
};
```

---

### Q3: 配置验证失败？

**原因**：schema 定义不正确

```javascript
// ✅ 确保 schema 正确
const schema = {
  type: 'object',
  properties: {
    enabled: { type: 'boolean' }
  },
  required: []  // 非必填
};
```

---

## 📚 扩展阅读

- [Webpack Loader API](https://webpack.js.org/api/loaders/)
- [loader-utils 文档](https://github.com/webpack/loader-utils)
- [schema-utils 文档](https://github.com/webpack/schema-utils)
- [如何编写一个 Loader](https://webpack.js.org/contribute/writing-a-loader/)

---

## 🎯 下一步

完成 Phase 03 后，继续学习：
- **Phase 04: Plugin 机制深入** - 理解和实现 Webpack 插件
- **Phase 05: 构建优化** - 提升构建性能

---

## 📝 总结

### 核心要点

1. **Loader 本质**：导出函数的 Node.js 模块
2. **输入输出**：接收源码，返回转换后的代码
3. **同步/异步**：使用 return 或 this.callback/this.async
4. **Loader API**：丰富的上下文方法（getOptions、emitFile 等）
5. **最佳实践**：单一职责、可配置、验证配置、启用缓存

### Loader 开发流程

1. 创建 Loader 文件
2. 导出函数
3. 处理 source
4. 返回结果
5. 配置 webpack
6. 测试验证

恭喜你完成 Phase 03！🎉

