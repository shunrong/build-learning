# 手写自定义 Plugin

通过实践掌握 Plugin 开发，理解原理并能够根据需求实现自定义功能。

---

## 📋 目录

1. [Plugin 基本结构](#plugin-基本结构)
2. [实战案例 1：文件清单生成器](#实战案例-1文件清单生成器)
3. [实战案例 2：版本注入插件](#实战案例-2版本注入插件)
4. [实战案例 3：注释移除插件](#实战案例-3注释移除插件)
5. [实战案例 4：资源压缩插件](#实战案例-4资源压缩插件)
6. [实战案例 5：构建通知插件](#实战案例-5构建通知插件)
7. [调试技巧](#调试技巧)
8. [最佳实践](#最佳实践)

---

## Plugin 基本结构

### 🎯 最小化 Plugin

```javascript
// 最简单的 Plugin
class BasicPlugin {
  apply(compiler) {
    console.log('BasicPlugin 已应用');
  }
}

module.exports = BasicPlugin;
```

### 📦 标准 Plugin 模板

```javascript
class StandardPlugin {
  // 1. 构造函数：接收配置
  constructor(options = {}) {
    this.options = options;
  }
  
  // 2. apply 方法：Webpack 调用
  apply(compiler) {
    const pluginName = this.constructor.name;
    
    // 3. 监听 Hook
    compiler.hooks.emit.tapAsync(
      pluginName,
      (compilation, callback) => {
        // 4. 执行逻辑
        console.log('Plugin 执行');
        
        // 5. 异步完成
        callback();
      }
    );
  }
}

module.exports = StandardPlugin;
```

### 🔧 配置参数处理

```javascript
class ConfigurablePlugin {
  constructor(options = {}) {
    // 默认配置
    this.options = {
      enabled: true,
      format: 'json',
      ...options
    };
    
    // 参数验证
    this.validateOptions();
  }
  
  validateOptions() {
    const { enabled, format } = this.options;
    
    if (typeof enabled !== 'boolean') {
      throw new Error('enabled must be a boolean');
    }
    
    if (!['json', 'text'].includes(format)) {
      throw new Error('format must be "json" or "text"');
    }
  }
  
  apply(compiler) {
    if (!this.options.enabled) {
      return; // 禁用时不执行
    }
    
    // 插件逻辑...
  }
}
```

---

## 实战案例 1：文件清单生成器

### 🎯 需求

生成一个文件清单，列出所有打包产物的文件名、大小和 hash。

### 💻 实现

```javascript
/**
 * FileListPlugin
 * 生成文件清单：filelist.txt 或 filelist.json
 */
class FileListPlugin {
  constructor(options = {}) {
    this.options = {
      filename: 'filelist.txt',  // 输出文件名
      format: 'text',             // 'text' | 'json'
      ...options
    };
  }
  
  apply(compiler) {
    const { filename, format } = this.options;
    
    // 监听 emit（生成文件之前）
    compiler.hooks.emit.tapAsync(
      'FileListPlugin',
      (compilation, callback) => {
        // 1. 收集所有文件信息
        const fileList = [];
        
        for (const filename in compilation.assets) {
          const asset = compilation.assets[filename];
          
          fileList.push({
            name: filename,
            size: asset.size(),
            content: asset.source().toString().length
          });
        }
        
        // 2. 生成内容
        let content;
        
        if (format === 'json') {
          content = JSON.stringify({
            buildTime: new Date().toISOString(),
            totalFiles: fileList.length,
            totalSize: fileList.reduce((sum, f) => sum + f.size, 0),
            files: fileList
          }, null, 2);
        } else {
          content = this.generateTextFormat(fileList);
        }
        
        // 3. 添加到输出文件
        compilation.assets[filename] = {
          source: () => content,
          size: () => content.length
        };
        
        callback();
      }
    );
  }
  
  generateTextFormat(fileList) {
    let text = '📦 文件清单\n';
    text += '='.repeat(60) + '\n';
    text += `构建时间: ${new Date().toLocaleString()}\n`;
    text += `文件总数: ${fileList.length}\n`;
    text += `总大小: ${this.formatSize(fileList.reduce((sum, f) => sum + f.size, 0))}\n`;
    text += '='.repeat(60) + '\n\n';
    
    // 按大小排序
    fileList.sort((a, b) => b.size - a.size);
    
    fileList.forEach((file, index) => {
      text += `${index + 1}. ${file.name}\n`;
      text += `   大小: ${this.formatSize(file.size)}\n\n`;
    });
    
    return text;
  }
  
  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  }
}

module.exports = FileListPlugin;
```

### 📝 使用

```javascript
// webpack.config.js
const FileListPlugin = require('./plugins/FileListPlugin');

module.exports = {
  plugins: [
    new FileListPlugin({
      filename: 'filelist.json',
      format: 'json'
    })
  ]
};
```

### 📄 输出示例

```json
{
  "buildTime": "2025-01-12T10:30:00.000Z",
  "totalFiles": 5,
  "totalSize": 523456,
  "files": [
    {
      "name": "main.abc123.js",
      "size": 345678,
      "content": 345678
    },
    {
      "name": "main.def456.css",
      "size": 123456,
      "content": 123456
    }
  ]
}
```

---

## 实战案例 2：版本注入插件

### 🎯 需求

在所有 JS 文件顶部注入版本信息和构建时间。

### 💻 实现

```javascript
/**
 * InjectVersionPlugin
 * 在文件顶部注入版本信息
 */
class InjectVersionPlugin {
  constructor(options = {}) {
    const pkg = require(process.cwd() + '/package.json');
    
    this.options = {
      version: pkg.version || '1.0.0',
      author: pkg.author || 'Unknown',
      description: pkg.description || '',
      banner: options.banner || this.getDefaultBanner(),
      include: options.include || /\.js$/,
      ...options
    };
  }
  
  getDefaultBanner() {
    return [
      '/*!',
      ` * ${this.options.description}`,
      ` * @version ${this.options.version}`,
      ` * @author ${this.options.author}`,
      ` * @build ${new Date().toISOString()}`,
      ' */',
      ''
    ].join('\n');
  }
  
  apply(compiler) {
    const { banner, include } = this.options;
    
    compiler.hooks.emit.tapAsync(
      'InjectVersionPlugin',
      (compilation, callback) => {
        // 遍历所有资源
        for (const filename in compilation.assets) {
          // 只处理匹配的文件
          if (!include.test(filename)) {
            continue;
          }
          
          const asset = compilation.assets[filename];
          const content = asset.source();
          
          // 注入 banner
          const newContent = banner + content;
          
          // 更新资源
          compilation.assets[filename] = {
            source: () => newContent,
            size: () => newContent.length
          };
        }
        
        callback();
      }
    );
  }
}

module.exports = InjectVersionPlugin;
```

### 📝 使用

```javascript
// webpack.config.js
const InjectVersionPlugin = require('./plugins/InjectVersionPlugin');

module.exports = {
  plugins: [
    new InjectVersionPlugin({
      include: /\.(js|css)$/,
      banner: '/*! My App v1.0.0 */'
    })
  ]
};
```

### 📄 输出示例

```javascript
/*!
 * My Awesome App
 * @version 1.2.3
 * @author John Doe
 * @build 2025-01-12T10:30:00.000Z
 */

(function() {
  // 原始代码...
})();
```

---

## 实战案例 3：注释移除插件

### 🎯 需求

在生产环境移除 JS 文件中的 `console.log` 和注释。

### 💻 实现

```javascript
/**
 * RemoveCommentsPlugin
 * 移除注释和 console
 */
class RemoveCommentsPlugin {
  constructor(options = {}) {
    this.options = {
      removeComments: true,
      removeConsole: true,
      include: /\.js$/,
      exclude: /node_modules/,
      ...options
    };
  }
  
  apply(compiler) {
    const { removeComments, removeConsole, include, exclude } = this.options;
    
    compiler.hooks.emit.tapAsync(
      'RemoveCommentsPlugin',
      (compilation, callback) => {
        for (const filename in compilation.assets) {
          // 跳过不匹配的文件
          if (!include.test(filename) || exclude.test(filename)) {
            continue;
          }
          
          const asset = compilation.assets[filename];
          let content = asset.source().toString();
          
          // 移除注释
          if (removeComments) {
            // 移除单行注释
            content = content.replace(/\/\/.*/g, '');
            
            // 移除多行注释（保留 /*! 开头的）
            content = content.replace(/\/\*[^!][\s\S]*?\*\//g, '');
          }
          
          // 移除 console
          if (removeConsole) {
            content = content.replace(
              /console\.(log|warn|error|info|debug)\(.*?\);?/g,
              ''
            );
          }
          
          // 移除多余的空行
          content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
          
          // 更新资源
          compilation.assets[filename] = {
            source: () => content,
            size: () => content.length
          };
        }
        
        callback();
      }
    );
  }
}

module.exports = RemoveCommentsPlugin;
```

### ⚠️ 注意事项

```javascript
// ❌ 简单的正则替换有风险
content.replace(/console\.log\(.*?\)/g, '');

// 问题：
console.log('hello'); console.log('world');
// ↓ 可能误删
console.log('hello');  // 只删除了第一个

// ✅ 更好的方案：使用 AST
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

// 解析代码
const ast = parser.parse(content);

// 遍历并移除 console
traverse(ast, {
  CallExpression(path) {
    if (
      path.node.callee.object &&
      path.node.callee.object.name === 'console'
    ) {
      path.remove();
    }
  }
});

// 生成新代码
const { code } = generate(ast);
```

---

## 实战案例 4：资源压缩插件

### 🎯 需求

对指定类型的文件进行自定义压缩。

### 💻 实现

```javascript
/**
 * CompressAssetsPlugin
 * 压缩资源文件
 */
const zlib = require('zlib');
const { promisify } = require('util');

const gzip = promisify(zlib.gzip);
const brotli = promisify(zlib.brotliCompress);

class CompressAssetsPlugin {
  constructor(options = {}) {
    this.options = {
      algorithm: 'gzip',  // 'gzip' | 'brotli'
      test: /\.(js|css|html)$/,
      threshold: 10240,   // 只压缩大于 10KB 的文件
      minRatio: 0.8,      // 压缩比小于 0.8 才保留
      deleteOriginal: false,
      ...options
    };
  }
  
  apply(compiler) {
    const { algorithm, test, threshold, minRatio, deleteOriginal } = this.options;
    
    compiler.hooks.emit.tapAsync(
      'CompressAssetsPlugin',
      async (compilation, callback) => {
        const assets = compilation.assets;
        const compressedAssets = [];
        
        for (const filename in assets) {
          // 跳过不匹配的文件
          if (!test.test(filename)) {
            continue;
          }
          
          const asset = assets[filename];
          const content = asset.source();
          const size = asset.size();
          
          // 跳过小文件
          if (size < threshold) {
            continue;
          }
          
          try {
            // 压缩
            const compressed = await this.compress(content, algorithm);
            const compressedSize = compressed.length;
            
            // 检查压缩比
            const ratio = compressedSize / size;
            
            if (ratio < minRatio) {
              // 压缩效果好，保留
              const ext = algorithm === 'gzip' ? '.gz' : '.br';
              const compressedFilename = filename + ext;
              
              compilation.assets[compressedFilename] = {
                source: () => compressed,
                size: () => compressedSize
              };
              
              compressedAssets.push({
                filename,
                originalSize: size,
                compressedSize,
                ratio: (ratio * 100).toFixed(2) + '%'
              });
              
              // 删除原文件
              if (deleteOriginal) {
                delete compilation.assets[filename];
              }
            }
          } catch (error) {
            compilation.errors.push(
              new Error(`压缩失败: ${filename}\n${error.message}`)
            );
          }
        }
        
        // 输出统计
        if (compressedAssets.length > 0) {
          console.log('\n📦 资源压缩统计：');
          compressedAssets.forEach(({ filename, originalSize, compressedSize, ratio }) => {
            console.log(`  ${filename}`);
            console.log(`    ${this.formatSize(originalSize)} → ${this.formatSize(compressedSize)} (${ratio})`);
          });
          console.log();
        }
        
        callback();
      }
    );
  }
  
  async compress(content, algorithm) {
    const buffer = Buffer.isBuffer(content) ? content : Buffer.from(content);
    
    if (algorithm === 'brotli') {
      return await brotli(buffer);
    } else {
      return await gzip(buffer);
    }
  }
  
  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  }
}

module.exports = CompressAssetsPlugin;
```

---

## 实战案例 5：构建通知插件

### 🎯 需求

构建完成后发送系统通知或 Webhook 通知。

### 💻 实现

```javascript
/**
 * BuildNotificationPlugin
 * 构建完成通知
 */
const notifier = require('node-notifier');
const https = require('https');

class BuildNotificationPlugin {
  constructor(options = {}) {
    this.options = {
      title: 'Webpack Build',
      successMessage: '构建成功！',
      errorMessage: '构建失败！',
      webhook: null,  // Webhook URL
      ...options
    };
  }
  
  apply(compiler) {
    const { title, successMessage, errorMessage, webhook } = this.options;
    
    // 构建成功
    compiler.hooks.done.tapAsync(
      'BuildNotificationPlugin',
      async (stats, callback) => {
        const info = stats.toJson();
        const hasErrors = stats.hasErrors();
        const hasWarnings = stats.hasWarnings();
        
        // 1. 系统通知
        notifier.notify({
          title: hasErrors ? '❌ ' + title : '✅ ' + title,
          message: hasErrors ? errorMessage : successMessage,
          sound: hasErrors ? 'Basso' : 'Glass',
          timeout: 5
        });
        
        // 2. Webhook 通知
        if (webhook) {
          await this.sendWebhook(webhook, {
            status: hasErrors ? 'failure' : 'success',
            time: info.time,
            errors: info.errors.length,
            warnings: info.warnings.length,
            modules: info.modules.length,
            chunks: info.chunks.length,
            assets: info.assets.length
          });
        }
        
        // 3. 控制台输出
        console.log('\n' + '='.repeat(60));
        console.log(hasErrors ? '❌ 构建失败' : '✅ 构建成功');
        console.log(`⏱️  耗时: ${info.time}ms`);
        console.log(`📦 模块: ${info.modules.length} 个`);
        console.log(`🧩 Chunk: ${info.chunks.length} 个`);
        console.log(`📄 资源: ${info.assets.length} 个`);
        
        if (hasErrors) {
          console.log(`❌ 错误: ${info.errors.length} 个`);
        }
        if (hasWarnings) {
          console.log(`⚠️  警告: ${info.warnings.length} 个`);
        }
        
        console.log('='.repeat(60) + '\n');
        
        callback();
      }
    );
    
    // 构建失败
    compiler.hooks.failed.tap(
      'BuildNotificationPlugin',
      (error) => {
        notifier.notify({
          title: '❌ ' + title,
          message: error.message,
          sound: 'Basso'
        });
      }
    );
  }
  
  async sendWebhook(url, data) {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        text: `Webpack Build ${data.status}`,
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*Status:* ${data.status}\n*Time:* ${data.time}ms`
            }
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*Modules:* ${data.modules}` },
              { type: 'mrkdwn', text: `*Chunks:* ${data.chunks}` },
              { type: 'mrkdwn', text: `*Assets:* ${data.assets}` },
              { type: 'mrkdwn', text: `*Errors:* ${data.errors}` }
            ]
          }
        ]
      });
      
      const urlObj = new URL(url);
      const options = {
        hostname: urlObj.hostname,
        port: 443,
        path: urlObj.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload)
        }
      };
      
      const req = https.request(options, (res) => {
        res.on('end', resolve);
      });
      
      req.on('error', reject);
      req.write(payload);
      req.end();
    });
  }
}

module.exports = BuildNotificationPlugin;
```

---

## 调试技巧

### 🔍 1. 打印日志

```javascript
class DebugPlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('DebugPlugin', (compilation) => {
      console.log('=== Compilation 对象 ===');
      console.log('模块数量:', compilation.modules.size);
      console.log('Chunk 数量:', compilation.chunks.size);
      console.log('资源列表:', Object.keys(compilation.assets));
      
      // 打印某个模块的信息
      const modules = Array.from(compilation.modules);
      const firstModule = modules[0];
      console.log('\n=== 第一个模块 ===');
      console.log('路径:', firstModule.resource);
      console.log('类型:', firstModule.type);
      console.log('依赖:', firstModule.dependencies.length);
    });
  }
}
```

---

### 🔍 2. 使用 VSCode 调试

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Webpack",
      "program": "${workspaceFolder}/node_modules/webpack/bin/webpack.js",
      "args": ["--mode", "development"],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

在 Plugin 代码中打断点，然后按 F5 启动调试。

---

### 🔍 3. 保存中间产物

```javascript
class SaveIntermediatePlugin {
  apply(compiler) {
    compiler.hooks.emit.tap('SaveIntermediatePlugin', (compilation) => {
      const fs = require('fs');
      const path = require('path');
      
      // 保存所有资源到临时目录
      const tempDir = path.join(__dirname, '.temp');
      if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
      }
      
      for (const filename in compilation.assets) {
        const content = compilation.assets[filename].source();
        fs.writeFileSync(
          path.join(tempDir, filename),
          content
        );
      }
      
      console.log('中间产物已保存到:', tempDir);
    });
  }
}
```

---

### 🔍 4. 性能分析

```javascript
class PerformancePlugin {
  apply(compiler) {
    const times = {};
    
    // 记录各个阶段的时间
    compiler.hooks.compile.tap('PerformancePlugin', () => {
      times.compileStart = Date.now();
    });
    
    compiler.hooks.compilation.tap('PerformancePlugin', (compilation) => {
      times.compilationStart = Date.now();
      
      compilation.hooks.seal.tap('PerformancePlugin', () => {
        times.sealStart = Date.now();
      });
      
      compilation.hooks.afterSeal.tap('PerformancePlugin', () => {
        times.sealEnd = Date.now();
      });
    });
    
    compiler.hooks.emit.tap('PerformancePlugin', () => {
      times.emitStart = Date.now();
    });
    
    compiler.hooks.done.tap('PerformancePlugin', () => {
      times.done = Date.now();
      
      console.log('\n⏱️  性能分析：');
      console.log(`编译准备: ${times.compilationStart - times.compileStart}ms`);
      console.log(`封装阶段: ${times.sealEnd - times.sealStart}ms`);
      console.log(`输出阶段: ${times.done - times.emitStart}ms`);
      console.log(`总耗时: ${times.done - times.compileStart}ms\n`);
    });
  }
}
```

---

## 最佳实践

### ✅ 1. 参数验证

```javascript
class GoodPlugin {
  constructor(options = {}) {
    // 提供默认值
    this.options = {
      enabled: true,
      format: 'json',
      ...options
    };
    
    // 验证参数
    this.validateOptions();
  }
  
  validateOptions() {
    const { enabled, format } = this.options;
    
    if (typeof enabled !== 'boolean') {
      throw new TypeError('options.enabled must be a boolean');
    }
    
    if (!['json', 'text', 'html'].includes(format)) {
      throw new Error('options.format must be "json", "text", or "html"');
    }
  }
}
```

---

### ✅ 2. 错误处理

```javascript
class SafePlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'SafePlugin',
      (compilation, callback) => {
        try {
          // 可能出错的操作
          this.processAssets(compilation);
          callback();
        } catch (error) {
          // 报告错误
          compilation.errors.push(
            new Error(`SafePlugin: ${error.message}`)
          );
          callback();
        }
      }
    );
  }
  
  processAssets(compilation) {
    // 处理资源...
  }
}
```

---

### ✅ 3. 性能优化

```javascript
class OptimizedPlugin {
  apply(compiler) {
    // 缓存计算结果
    const cache = new Map();
    
    compiler.hooks.emit.tap('OptimizedPlugin', (compilation) => {
      for (const filename in compilation.assets) {
        // 检查缓存
        const cacheKey = filename + compilation.assets[filename].size();
        
        if (cache.has(cacheKey)) {
          console.log(`使用缓存: ${filename}`);
          continue;
        }
        
        // 处理资源
        const result = this.process(compilation.assets[filename]);
        
        // 保存到缓存
        cache.set(cacheKey, result);
      }
    });
  }
}
```

---

### ✅ 4. 文档和注释

```javascript
/**
 * MyAwesomePlugin
 * 
 * @description 这个插件用于...
 * 
 * @example
 * ```javascript
 * new MyAwesomePlugin({
 *   format: 'json',
 *   output: 'report.json'
 * })
 * ```
 * 
 * @param {Object} options - 配置选项
 * @param {string} [options.format='json'] - 输出格式
 * @param {string} [options.output='output.json'] - 输出文件名
 */
class MyAwesomePlugin {
  constructor(options = {}) {
    this.options = {
      format: 'json',
      output: 'output.json',
      ...options
    };
  }
  
  /**
   * Webpack 插件的入口方法
   * @param {Compiler} compiler - Webpack Compiler 实例
   */
  apply(compiler) {
    // 实现...
  }
}
```

---

### ✅ 5. 测试

```javascript
// __tests__/MyPlugin.test.js
const webpack = require('webpack');
const MemoryFS = require('memory-fs');
const MyPlugin = require('../MyPlugin');

describe('MyPlugin', () => {
  it('should generate file list', (done) => {
    const compiler = webpack({
      entry: './test/fixtures/index.js',
      output: {
        path: '/dist',
        filename: 'bundle.js'
      },
      plugins: [
        new MyPlugin({
          filename: 'filelist.json'
        })
      ]
    });
    
    compiler.outputFileSystem = new MemoryFS();
    
    compiler.run((err, stats) => {
      expect(err).toBeFalsy();
      
      const fs = compiler.outputFileSystem;
      const fileList = fs.readFileSync('/dist/filelist.json', 'utf-8');
      const data = JSON.parse(fileList);
      
      expect(data.files).toContain('bundle.js');
      done();
    });
  });
});
```

---

## 📚 总结

### 核心要点

1. **基本结构**
   - 构造函数接收配置
   - apply 方法注册 Hooks
   - 异步操作记得调用 callback

2. **常用场景**
   - 修改资源：`compiler.hooks.emit`
   - 生成文件：`compilation.assets[name] = ...`
   - 统计信息：`compiler.hooks.done`

3. **开发技巧**
   - 参数验证和默认值
   - 错误处理和友好提示
   - 性能优化和缓存
   - 完善的文档和测试

4. **调试方法**
   - 打印日志
   - VSCode 断点调试
   - 保存中间产物
   - 性能分析

### 学习路径

```
理解基本结构
    ↓
实现简单 Plugin（文件清单）
    ↓
实现复杂 Plugin（资源处理）
    ↓
学习调试技巧
    ↓
掌握最佳实践
    ↓
阅读官方 Plugin 源码
```

---

下一步，进入实践环节：
- [Demo 1: 常用 Plugin 使用](../demos/01-common-plugins/)
- [Demo 2: 生命周期演示](../demos/02-lifecycle-demo/)
- [Demo 3: 自定义 Plugin 实现](../demos/03-custom-plugins/)

