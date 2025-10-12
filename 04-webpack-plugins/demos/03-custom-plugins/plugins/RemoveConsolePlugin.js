/**
 * RemoveConsolePlugin
 * 移除 console.log
 */
class RemoveConsolePlugin {
  constructor(options = {}) {
    this.options = {
      enabled: true,
      include: /\.js$/,
      ...options
    };
  }
  
  apply(compiler) {
    if (!this.options.enabled) {
      return;
    }
    
    const { include } = this.options;
    
    compiler.hooks.emit.tapAsync(
      'RemoveConsolePlugin',
      (compilation, callback) => {
        for (const filename in compilation.assets) {
          if (!include.test(filename)) {
            continue;
          }
          
          const asset = compilation.assets[filename];
          let content = asset.source().toString();
          
          // 移除 console.log
          content = content.replace(/console\.log\([^)]*\);?/g, '');
          
          // 移除多余空行
          content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
          
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

module.exports = RemoveConsolePlugin;

