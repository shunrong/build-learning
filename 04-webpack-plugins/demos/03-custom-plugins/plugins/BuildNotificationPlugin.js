/**
 * BuildNotificationPlugin
 * 构建完成通知
 */
class BuildNotificationPlugin {
  constructor(options = {}) {
    this.options = {
      title: 'Webpack Build',
      ...options
    };
  }
  
  apply(compiler) {
    const { title } = this.options;
    
    compiler.hooks.done.tap('BuildNotificationPlugin', (stats) => {
      const info = stats.toJson();
      const hasErrors = stats.hasErrors();
      
      console.log('\n' + '='.repeat(80));
      console.log(hasErrors ? '❌ 构建失败' : '✅ 构建成功');
      console.log('='.repeat(80));
      console.log(`⏱️  耗时: ${info.time}ms`);
      console.log(`📦 模块: ${info.modules.length} 个`);
      console.log(`🧩 Chunk: ${info.chunks.length} 个`);
      console.log(`📄 资源: ${info.assets.length} 个`);
      
      if (hasErrors) {
        console.log(`❌ 错误: ${info.errors.length} 个`);
      }
      if (stats.hasWarnings()) {
        console.log(`⚠️  警告: ${info.warnings.length} 个`);
      }
      
      console.log('='.repeat(80) + '\n');
    });
    
    compiler.hooks.failed.tap('BuildNotificationPlugin', (error) => {
      console.error('\n❌ 编译失败:', error.message, '\n');
    });
  }
}

module.exports = BuildNotificationPlugin;

