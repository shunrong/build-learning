# 手写自定义 Loader

## 🎯 学习目标

- 理解 Loader 的本质
- 掌握 Loader API
- 实现常见的自定义 Loader

---

## 📌 Loader 的本质

### Loader 是一个函数

```javascript
/**
 * Loader 就是一个导出函数的 Node.js 模块
 * @param {string|Buffer} source - 文件内容
 * @param {object} sourceMap - Source Map（可选）
 * @param {object} meta - 元数据（可选）
 * @return {string|Buffer} 转换后的内容
 */
module.exports = function(source) {
  // 1. 处理 source
  const result = transform(source);
  
  // 2. 返回结果
  return result;
};
```

---

### 最简单的 Loader

```javascript
// simple-loader.js
module.exports = function(source) {
  console.log('Processing:', this.resourcePath);
  
  // 不做任何处理，直接返回
  return source;
};
```

**使用**：
```javascript
// webpack.config.js
module.exports = {
  module: {
    rules: [
      {
        test: /\.txt$/,
        use: './loaders/simple-loader.js'
      }
    ]
  }
};
```

---

## 🔧 Loader API

### this（Loader Context）

Webpack 提供的 Loader 上下文，包含了很多有用的方法和属性。

```javascript
module.exports = function(source) {
  // 1. 资源路径
  console.log(this.resourcePath);      // 完整路径
  console.log(this.resourceQuery);     // 查询参数
  console.log(this.resource);          // resourcePath + resourceQuery
  
  // 2. 配置选项
  console.log(this.query);             // 旧版 options（已废弃）
  const options = this.getOptions();   // 获取 Loader 配置
  
  // 3. 模式
  console.log(this.mode);              // 'development' | 'production'
  
  // 4. 异步回调
  const callback = this.callback;
  
  // 5. 添加依赖
  this.addDependency(file);            // 添加文件依赖
  this.addContextDependency(dir);      // 添加目录依赖
  
  // 6. 缓存
  this.cacheable(true);                // 启用缓存（默认开启）
  
  // 7. 产物输出
  this.emitFile(name, content);        // 输出文件
  
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
  
  // this.callback(err, content, sourceMap, meta)
  this.callback(null, result);
  
  // ⚠️ 调用 callback 后不要再 return
};
```

---

#### 异步 Loader

```javascript
module.exports = function(source) {
  // 1. 获取异步回调
  const callback = this.async();
  
  // 2. 异步处理
  transformAsync(source).then(result => {
    // 3. 调用回调
    callback(null, result);
  }).catch(err => {
    callback(err);
  });
  
  // ⚠️ 不需要 return
};
```

---

### callback 参数详解

```javascript
this.callback(
  err,        // Error | null
  content,    // string | Buffer
  sourceMap,  // SourceMap（可选）
  meta        // 元数据（可选）
);
```

**示例**：
```javascript
module.exports = function(source) {
  const result = transform(source);
  
  this.callback(
    null,                     // 无错误
    result.code,              // 转换后的代码
    result.map,               // Source Map
    { ast: result.ast }       // 传递 AST 给下一个 Loader
  );
};
```

---

## 🛠️ 实战案例

### 案例 1：移除 console.log

```javascript
// remove-console-loader.js
module.exports = function(source) {
  // 移除所有 console.log 语句
  const result = source.replace(
    /console\.log\(.*?\);?/g,
    ''
  );
  
  return result;
};
```

**使用**：
```javascript
{
  test: /\.js$/,
  use: [
    './loaders/remove-console-loader',
    'babel-loader'
  ]
}
```

**效果**：
```javascript
// 输入
function test() {
  console.log('debug');
  return 42;
}

// 输出
function test() {
  
  return 42;
}
```

---

### 案例 2：Markdown to HTML

```javascript
// markdown-loader.js
const marked = require('marked');

module.exports = function(source) {
  // 将 Markdown 转换为 HTML
  const html = marked(source);
  
  // 返回为 JavaScript 模块
  return `export default ${JSON.stringify(html)}`;
};
```

**使用**：
```javascript
{
  test: /\.md$/,
  use: './loaders/markdown-loader'
}
```

**效果**：
```javascript
// README.md
# Title
Content

// 转换后
export default "<h1>Title</h1>\n<p>Content</p>";

// 使用
import content from './README.md';
document.body.innerHTML = content;
```

---

### 案例 3：国际化 Loader

```javascript
// i18n-loader.js
module.exports = function(source) {
  const options = this.getOptions();
  const locale = options.locale || 'en';
  
  // 解析 JSON
  const translations = JSON.parse(source);
  const localeData = translations[locale] || translations.en;
  
  // 返回为 JavaScript 模块
  return `export default ${JSON.stringify(localeData)}`;
};
```

**使用**：
```javascript
{
  test: /\.i18n\.json$/,
  use: {
    loader: './loaders/i18n-loader',
    options: {
      locale: 'zh-CN'
    }
  }
}
```

**效果**：
```json
// messages.i18n.json
{
  "en": {
    "hello": "Hello"
  },
  "zh-CN": {
    "hello": "你好"
  }
}
```

```javascript
// 转换后（locale: 'zh-CN'）
export default {
  "hello": "你好"
};

// 使用
import messages from './messages.i18n.json';
console.log(messages.hello);  // "你好"
```

---

### 案例 4：JSON Schema 验证 Loader

```javascript
// json-validate-loader.js
const Ajv = require('ajv');

module.exports = function(source) {
  const options = this.getOptions();
  const schema = options.schema;
  
  // 解析 JSON
  const data = JSON.parse(source);
  
  // 验证
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(data);
  
  if (!valid) {
    // 编译错误
    const errors = validate.errors
      .map(err => `${err.dataPath} ${err.message}`)
      .join('\n');
    
    throw new Error(`JSON validation failed:\n${errors}`);
  }
  
  // 验证通过，返回原内容
  return source;
};
```

**使用**：
```javascript
{
  test: /config\.json$/,
  use: {
    loader: './loaders/json-validate-loader',
    options: {
      schema: {
        type: 'object',
        properties: {
          port: { type: 'number' },
          host: { type: 'string' }
        },
        required: ['port', 'host']
      }
    }
  }
}
```

---

### 案例 5：Banner 注入 Loader

```javascript
// banner-loader.js
module.exports = function(source) {
  const options = this.getOptions();
  const banner = options.banner || '';
  
  // 在文件顶部添加注释
  return `/*\n${banner}\n*/\n${source}`;
};
```

**使用**：
```javascript
{
  test: /\.js$/,
  enforce: 'pre',  // 前置 Loader
  use: {
    loader: './loaders/banner-loader',
    options: {
      banner: 'Copyright (c) 2024\nAuthor: Your Name'
    }
  }
}
```

**效果**：
```javascript
/*
Copyright (c) 2024
Author: Your Name
*/
function hello() {
  return 'world';
}
```

---

### 案例 6：异步图片优化 Loader

```javascript
// image-optimize-loader.js
const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');

module.exports = function(source) {
  // 1. 获取异步回调
  const callback = this.async();
  
  // 2. 获取配置
  const options = this.getOptions();
  
  // 3. 异步优化图片
  imagemin.buffer(source, {
    plugins: [
      imageminPngquant({
        quality: options.quality || [0.6, 0.8]
      })
    ]
  })
  .then(optimized => {
    // 4. 返回优化后的图片
    callback(null, optimized);
  })
  .catch(err => {
    callback(err);
  });
};

// ⚠️ 标记为原始 Loader（处理 Buffer）
module.exports.raw = true;
```

**使用**：
```javascript
{
  test: /\.(png|jpg)$/,
  type: 'asset/resource',
  use: {
    loader: './loaders/image-optimize-loader',
    options: {
      quality: [0.6, 0.8]
    }
  }
}
```

---

## 🔍 高级技巧

### 1. raw Loader（处理 Buffer）

默认情况下，Loader 接收字符串。如果要处理二进制文件（图片、字体等），需要设置 `raw` 属性。

```javascript
module.exports = function(source) {
  // source 是 Buffer
  console.log(Buffer.isBuffer(source));  // true
  
  return source;
};

// ⚠️ 关键：标记为 raw
module.exports.raw = true;
```

---

### 2. pitch 方法

Loader 有两个阶段：
1. **pitch 阶段**：从左到右
2. **normal 阶段**：从右到左

```javascript
module.exports = function(source) {
  console.log('Normal phase');
  return source;
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  console.log('Pitch phase');
  
  // 如果 pitch 返回值，跳过后续 Loader
  // return 'skip';
};
```

**执行顺序**：
```
Loader A.pitch → Loader B.pitch → Loader C.pitch
    ↓
Loader C → Loader B → Loader A
```

**用途**：
- 提前拦截
- 缓存优化
- style-loader 就使用了 pitch

---

### 3. 传递数据

#### 通过 data 对象（pitch → normal）

```javascript
module.exports = function(source) {
  // 读取 pitch 阶段传递的数据
  console.log(this.data.value);  // 42
  return source;
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  // 传递数据给 normal 阶段
  data.value = 42;
};
```

---

#### 通过 meta 对象（Loader → Loader）

```javascript
// loader-a.js
module.exports = function(source) {
  this.callback(null, source, null, {
    customData: 'from A'
  });
};

// loader-b.js
module.exports = function(source, sourceMap, meta) {
  console.log(meta.customData);  // "from A"
  return source;
};
```

---

### 4. 缓存控制

```javascript
module.exports = function(source) {
  // 默认启用缓存
  // this.cacheable(true);
  
  // 如果结果依赖外部因素，禁用缓存
  this.cacheable(false);
  
  return source;
};
```

---

### 5. 添加依赖

```javascript
module.exports = function(source) {
  // 添加文件依赖（文件变化时重新构建）
  this.addDependency('./config.json');
  
  // 添加目录依赖
  this.addContextDependency('./templates');
  
  return source;
};
```

---

### 6. 输出文件

```javascript
module.exports = function(source) {
  const filename = 'output.txt';
  const content = processSource(source);
  
  // 输出额外文件
  this.emitFile(filename, content);
  
  return source;
};
```

---

## 📦 Loader 工具库

### loader-utils

```bash
npm install -D loader-utils
```

```javascript
const { getOptions, interpolateName } = require('loader-utils');

module.exports = function(source) {
  // 1. 获取配置
  const options = getOptions(this);
  
  // 2. 生成文件名
  const filename = interpolateName(this, '[hash].[ext]', {
    content: source
  });
  
  // 3. 输出文件
  this.emitFile(filename, source);
  
  return `export default ${JSON.stringify(filename)}`;
};
```

---

### schema-utils

```bash
npm install -D schema-utils
```

```javascript
const { validate } = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string'
    },
    age: {
      type: 'number'
    }
  },
  required: ['name']
};

module.exports = function(source) {
  const options = this.getOptions();
  
  // 验证配置
  validate(schema, options, {
    name: 'My Loader',
    baseDataPath: 'options'
  });
  
  return source;
};
```

---

## 🐛 调试技巧

### 1. 使用 console.log

```javascript
module.exports = function(source) {
  console.log('='.repeat(50));
  console.log('Resource:', this.resourcePath);
  console.log('Source length:', source.length);
  console.log('='.repeat(50));
  
  return source;
};
```

---

### 2. 使用 VS Code 调试

**launch.json**：
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Webpack",
  "program": "${workspaceFolder}/node_modules/webpack/bin/webpack.js",
  "args": ["--mode", "development"]
}
```

在 Loader 中设置断点：
```javascript
module.exports = function(source) {
  debugger;  // 断点
  return source;
};
```

---

### 3. 抛出友好的错误

```javascript
module.exports = function(source) {
  try {
    const result = transform(source);
    return result;
  } catch (error) {
    // 抛出带上下文的错误
    this.callback(new Error(
      `Transform failed in ${this.resourcePath}:\n${error.message}`
    ));
  }
};
```

---

## 💡 最佳实践

### 1. 单一职责

```javascript
// ✅ 好：每个 Loader 只做一件事
// remove-console-loader.js
module.exports = function(source) {
  return source.replace(/console\.log\(.*?\);?/g, '');
};

// add-banner-loader.js
module.exports = function(source) {
  const banner = this.getOptions().banner;
  return `${banner}\n${source}`;
};
```

---

### 2. 可配置

```javascript
// ✅ 好：提供配置选项
module.exports = function(source) {
  const options = this.getOptions();
  const { prefix = '', suffix = '' } = options;
  
  return `${prefix}${source}${suffix}`;
};
```

---

### 3. 验证配置

```javascript
const { validate } = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' }
  }
};

module.exports = function(source) {
  const options = this.getOptions();
  
  // ✅ 验证配置
  validate(schema, options, {
    name: 'My Loader'
  });
  
  return source;
};
```

---

### 4. 启用缓存

```javascript
module.exports = function(source) {
  // ✅ 默认启用缓存
  this.cacheable(true);
  
  return transform(source);
};
```

---

### 5. 友好的错误信息

```javascript
module.exports = function(source) {
  try {
    return transform(source);
  } catch (error) {
    // ✅ 提供详细错误信息
    throw new Error(
      `Failed to transform ${this.resourcePath}:\n` +
      `${error.message}\n` +
      `Source preview: ${source.substring(0, 100)}...`
    );
  }
};
```

---

## 📝 完整示例：自定义 SVG Loader

```javascript
// svg-inline-loader.js
const { validate } = require('schema-utils');
const { optimize } = require('svgo');

const schema = {
  type: 'object',
  properties: {
    removeSVGTagAttrs: { type: 'boolean' },
    classPrefix: { type: 'string' }
  }
};

module.exports = function(source) {
  // 1. 获取并验证配置
  const options = this.getOptions();
  validate(schema, options, { name: 'SVG Inline Loader' });
  
  // 2. 优化 SVG
  const result = optimize(source, {
    plugins: [
      'removeDoctype',
      'removeComments'
    ]
  });
  
  let svg = result.data;
  
  // 3. 处理配置
  if (options.removeSVGTagAttrs) {
    svg = svg.replace(/<svg([^>]*)>/, '<svg>');
  }
  
  if (options.classPrefix) {
    svg = svg.replace(/class="([^"]*)"/g, (match, className) => {
      return `class="${options.classPrefix}${className}"`;
    });
  }
  
  // 4. 返回 JavaScript 模块
  return `export default ${JSON.stringify(svg)}`;
};
```

**使用**：
```javascript
{
  test: /\.svg$/,
  use: {
    loader: './loaders/svg-inline-loader',
    options: {
      removeSVGTagAttrs: true,
      classPrefix: 'icon-'
    }
  }
}
```

---

## 🎯 总结

### 核心要点

1. **Loader 本质**：导出函数的 Node.js 模块
2. **输入输出**：接收源码，返回转换后的代码
3. **同步/异步**：使用 `return` 或 `this.callback`
4. **Loader API**：丰富的上下文方法
5. **单一职责**：每个 Loader 只做一件事

### 开发流程

1. 创建 Loader 文件
2. 导出函数
3. 处理 source
4. 返回结果
5. 配置 webpack
6. 测试验证

### 常用 API

```javascript
this.resourcePath      // 资源路径
this.getOptions()      // 获取配置
this.callback()        // 返回结果
this.async()           // 异步回调
this.emitFile()        // 输出文件
this.addDependency()   // 添加依赖
this.cacheable()       // 缓存控制
```

---

## 🎯 下一步

通过 Demo 实践：
- [Demo 1: CSS Loader 基础](../demos/01-css-basic/)
- [Demo 2: 静态资源处理](../demos/02-assets/)
- [Demo 3: CSS 预处理器](../demos/03-preprocessors/)
- [Demo 4: 自定义 Loader](../demos/04-custom-loader/) - 动手实现

完成 Phase 03 后，继续学习：
- Phase 04: Plugin 机制深入

