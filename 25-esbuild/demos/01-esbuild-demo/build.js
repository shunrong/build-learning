import * as esbuild from 'esbuild';

const isWatch = process.argv.includes('--watch');
const isMinify = process.argv.includes('--minify');

const buildOptions = {
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'dist/bundle.js',
  platform: 'browser',
  target: 'es2020',
  sourcemap: true,
  minify: isMinify,
  
  // TypeScript 配置
  loader: {
    '.ts': 'ts'
  },
  
  // 日志配置
  logLevel: 'info',
  
  // 元信息
  metafile: true
};

async function build() {
  try {
    const startTime = Date.now();
    console.log('🚀 开始构建...\n');
    
    if (isWatch) {
      // 监听模式
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      console.log('👀 监听文件变化...');
    } else {
      // 单次构建
      const result = await esbuild.build(buildOptions);
      
      const endTime = Date.now();
      const buildTime = endTime - startTime;
      
      console.log(`\n✅ 构建完成！`);
      console.log(`⏱️  构建时间: ${buildTime}ms`);
      
      // 输出文件大小信息
      if (result.metafile) {
        const outputs = result.metafile.outputs;
        for (const [file, info] of Object.entries(outputs)) {
          const sizeKB = (info.bytes / 1024).toFixed(2);
          console.log(`📦 ${file}: ${sizeKB} KB`);
        }
      }
      
      if (isMinify) {
        console.log('🗜️  已启用代码压缩');
      }
    }
  } catch (error) {
    console.error('❌ 构建失败:', error);
    process.exit(1);
  }
}

build();

