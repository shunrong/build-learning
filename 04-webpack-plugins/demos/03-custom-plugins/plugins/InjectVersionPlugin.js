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
      include: /\.js$/,
      ...options
    };
  }
  
  apply(compiler) {
    const { version, author, include } = this.options;
    
    compiler.hooks.emit.tapAsync(
      'InjectVersionPlugin',
      (compilation, callback) => {
        const banner = [
          '/*!',
          ` * Version: ${version}`,
          ` * Author: ${author}`,
          ` * Build: ${new Date().toISOString()}`,
          ' */',
          ''
        ].join('\n');
        
        for (const filename in compilation.assets) {
          if (!include.test(filename)) {
            continue;
          }
          
          const asset = compilation.assets[filename];
          const content = asset.source();
          const newContent = banner + content;
          
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

