/**
 * LifecyclePlugin
 * 演示 Webpack 完整的生命周期
 */
class LifecyclePlugin {
  apply(compiler) {
    const logs = [];
    
    const log = (hook, message, data = {}) => {
      const timestamp = Date.now();
      const logEntry = {
        hook,
        message,
        timestamp,
        ...data
      };
      logs.push(logEntry);
      console.log(`\n[${hook}] ${message}`);
      if (Object.keys(data).length > 0) {
        console.log('  数据:', data);
      }
    };
    
    console.log('\n' + '='.repeat(80));
    console.log('🔄 Webpack 生命周期演示');
    console.log('='.repeat(80));
    
    // === 1. 初始化阶段 ===
    compiler.hooks.environment.tap('LifecyclePlugin', () => {
      log('environment', '✅ 环境准备');
    });
    
    compiler.hooks.afterEnvironment.tap('LifecyclePlugin', () => {
      log('afterEnvironment', '✅ 环境准备完成');
    });
    
    compiler.hooks.entryOption.tap('LifecyclePlugin', (context, entry) => {
      log('entryOption', '✅ 读取入口配置', {
        context,
        entry: typeof entry === 'string' ? entry : Object.keys(entry)
      });
    });
    
    compiler.hooks.afterPlugins.tap('LifecyclePlugin', (compiler) => {
      log('afterPlugins', '✅ 插件加载完成', {
        pluginCount: compiler.options.plugins.length
      });
    });
    
    compiler.hooks.afterResolvers.tap('LifecyclePlugin', () => {
      log('afterResolvers', '✅ 解析器准备完成');
    });
    
    // === 2. 编译前 ===
    compiler.hooks.beforeRun.tapAsync('LifecyclePlugin', (compiler, callback) => {
      log('beforeRun', '🚀 准备开始编译');
      callback();
    });
    
    compiler.hooks.run.tapAsync('LifecyclePlugin', (compiler, callback) => {
      log('run', '🚀 开始编译');
      callback();
    });
    
    // === 3. 编译中 ===
    compiler.hooks.beforeCompile.tapAsync('LifecyclePlugin', (params, callback) => {
      log('beforeCompile', '⚙️  编译准备');
      callback();
    });
    
    compiler.hooks.compile.tap('LifecyclePlugin', (params) => {
      log('compile', '⚙️  开始编译');
    });
    
    compiler.hooks.thisCompilation.tap('LifecyclePlugin', (compilation) => {
      log('thisCompilation', '📦 Compilation 对象创建');
    });
    
    compiler.hooks.compilation.tap('LifecyclePlugin', (compilation, params) => {
      log('compilation', '📦 Compilation 准备完成', {
        name: compilation.name
      });
      
      // === Compilation Hooks ===
      let moduleCount = 0;
      
      compilation.hooks.buildModule.tap('LifecyclePlugin', (module) => {
        moduleCount++;
        if (moduleCount <= 3) {  // 只打印前3个
          log('buildModule', `  └─ 构建模块: ${module.resource || module.identifier()}`);
        }
      });
      
      compilation.hooks.succeedModule.tap('LifecyclePlugin', (module) => {
        // 不打印，模块太多
      });
      
      compilation.hooks.seal.tap('LifecyclePlugin', () => {
        log('seal', '🔒 封装阶段开始', {
          moduleCount: compilation.modules.size
        });
      });
      
      compilation.hooks.optimize.tap('LifecyclePlugin', () => {
        log('optimize', '🎯 优化阶段');
      });
      
      compilation.hooks.optimizeModules.tap('LifecyclePlugin', (modules) => {
        log('optimizeModules', '  └─ 优化模块', {
          count: modules.size
        });
      });
      
      compilation.hooks.optimizeChunks.tap('LifecyclePlugin', (chunks) => {
        log('optimizeChunks', '  └─ 优化 Chunk', {
          count: chunks.size
        });
      });
      
      compilation.hooks.beforeHash.tap('LifecyclePlugin', () => {
        log('beforeHash', '  └─ Hash 生成前');
      });
      
      compilation.hooks.afterHash.tap('LifecyclePlugin', () => {
        log('afterHash', '  └─ Hash 生成完成', {
          hash: compilation.hash
        });
      });
      
      compilation.hooks.afterSeal.tapAsync('LifecyclePlugin', (callback) => {
        log('afterSeal', '🔒 封装完成');
        callback();
      });
    });
    
    compiler.hooks.make.tapAsync('LifecyclePlugin', (compilation, callback) => {
      log('make', '🏗️  开始构建模块树');
      callback();
    });
    
    compiler.hooks.afterCompile.tapAsync('LifecyclePlugin', (compilation, callback) => {
      log('afterCompile', '✅ 编译完成', {
        modules: compilation.modules.size,
        chunks: compilation.chunks.size
      });
      callback();
    });
    
    // === 4. 输出阶段 ===
    compiler.hooks.shouldEmit.tap('LifecyclePlugin', (compilation) => {
      log('shouldEmit', '🤔 检查是否需要输出');
      return true;
    });
    
    compiler.hooks.emit.tapAsync('LifecyclePlugin', (compilation, callback) => {
      const assets = Object.keys(compilation.assets);
      log('emit', '📝 输出资源文件', {
        assetCount: assets.length,
        assets: assets.slice(0, 5)  // 只显示前5个
      });
      callback();
    });
    
    compiler.hooks.afterEmit.tapAsync('LifecyclePlugin', (compilation, callback) => {
      log('afterEmit', '✅ 资源输出完成');
      callback();
    });
    
    // === 5. 完成 ===
    compiler.hooks.done.tap('LifecyclePlugin', (stats) => {
      const info = stats.toJson();
      const endTime = Date.now();
      const startTime = logs[0].timestamp;
      
      log('done', '🎉 编译全部完成', {
        time: info.time,
        modules: info.modules.length,
        chunks: info.chunks.length,
        assets: info.assets.length,
        errors: info.errors.length,
        warnings: info.warnings.length
      });
      
      console.log('\n' + '='.repeat(80));
      console.log('📊 编译统计');
      console.log('='.repeat(80));
      console.log(`⏱️  总耗时: ${endTime - startTime}ms`);
      console.log(`📦 模块数: ${info.modules.length}`);
      console.log(`🧩 Chunk数: ${info.chunks.length}`);
      console.log(`📄 资源数: ${info.assets.length}`);
      console.log(`❌ 错误数: ${info.errors.length}`);
      console.log(`⚠️  警告数: ${info.warnings.length}`);
      console.log('='.repeat(80) + '\n');
      
      // 生成日志文件
      const logContent = this.generateLogReport(logs, info);
      compilation.assets['lifecycle-log.txt'] = {
        source: () => logContent,
        size: () => logContent.length
      };
      
      console.log('📄 生命周期日志已保存到: dist/lifecycle-log.txt\n');
    });
    
    compiler.hooks.failed.tap('LifecyclePlugin', (error) => {
      log('failed', '❌ 编译失败', {
        error: error.message
      });
    });
  }
  
  generateLogReport(logs, stats) {
    let report = '='.repeat(80) + '\n';
    report += 'Webpack 生命周期日志\n';
    report += '='.repeat(80) + '\n\n';
    
    report += `构建时间: ${new Date().toLocaleString()}\n`;
    report += `总耗时: ${stats.time}ms\n`;
    report += `模块数: ${stats.modules.length}\n`;
    report += `Chunk数: ${stats.chunks.length}\n`;
    report += `资源数: ${stats.assets.length}\n\n`;
    
    report += '='.repeat(80) + '\n';
    report += '生命周期详细记录\n';
    report += '='.repeat(80) + '\n\n';
    
    logs.forEach((log, index) => {
      report += `${index + 1}. [${log.hook}] ${log.message}\n`;
      if (log.moduleCount) {
        report += `   模块数: ${log.moduleCount}\n`;
      }
      if (log.count) {
        report += `   数量: ${log.count}\n`;
      }
      report += '\n';
    });
    
    return report;
  }
}

module.exports = LifecyclePlugin;

