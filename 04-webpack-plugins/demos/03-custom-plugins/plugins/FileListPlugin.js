/**
 * FileListPlugin
 * 生成文件清单
 */
class FileListPlugin {
  constructor(options = {}) {
    this.options = {
      filename: 'filelist.txt',
      format: 'text',  // 'text' | 'json'
      ...options
    };
  }
  
  apply(compiler) {
    const { filename, format } = this.options;
    
    compiler.hooks.emit.tapAsync(
      'FileListPlugin',
      (compilation, callback) => {
        // 收集文件信息
        const fileList = [];
        
        for (const name in compilation.assets) {
          const asset = compilation.assets[name];
          fileList.push({
            name,
            size: asset.size()
          });
        }
        
        // 生成内容
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
        
        // 添加到输出
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
    
    fileList.sort((a, b) => b.size - a.size);
    
    fileList.forEach((file, index) => {
      text += `${index + 1}. ${file.name} (${this.formatSize(file.size)})\n`;
    });
    
    return text;
  }
  
  formatSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
  }
}

module.exports = FileListPlugin;

