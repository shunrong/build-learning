const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🗜️  压缩方案全面对比\n');
console.log('═'.repeat(80));

const configs = [
  { name: '未压缩', script: 'build:no-compress', dir: 'dist-no-compress' },
  { name: '基础压缩', script: 'build:basic', dir: 'dist-basic' },
  { name: '高级压缩', script: 'build:advanced', dir: 'dist-advanced' },
  { name: 'Gzip 压缩', script: 'build:gzip', dir: 'dist-gzip' },
  { name: 'Brotli 压缩', script: 'build:brotli', dir: 'dist-brotli' }
];

const results = [];

// 构建所有版本
configs.forEach((config, index) => {
  console.log(`\n${index + 1}️⃣  构建 ${config.name}...`);
  const startTime = Date.now();
  
  try {
    execSync(`npm run ${config.script}`, { stdio: 'pipe' });
    const buildTime = Date.now() - startTime;
    const stats = analyzeDistFiles(config.dir);
    
    results.push({
      name: config.name,
      buildTime,
      ...stats
    });
    
    console.log(`   ✅ 完成 - 耗时: ${(buildTime / 1000).toFixed(2)}s`);
    console.log(`   📦 JS 体积: ${formatBytes(stats.jsSize)}`);
    console.log(`   🎨 CSS 体积: ${formatBytes(stats.cssSize)}`);
    if (stats.gzipSize) console.log(`   📦 Gzip: ${formatBytes(stats.gzipSize)}`);
    if (stats.brotliSize) console.log(`   📦 Brotli: ${formatBytes(stats.brotliSize)}`);
  } catch (error) {
    console.log(`   ❌ 失败: ${error.message}`);
  }
});

// 详细对比
console.log('\n' + '═'.repeat(80));
console.log('\n📊 详细对比:\n');

console.log('⏱️  构建时间:');
results.forEach((result, index) => {
  console.log(`   ${index + 1}. ${result.name.padEnd(15)} ${(result.buildTime / 1000).toFixed(2)}s`);
});

console.log('\n📦 JavaScript 体积:');
const baselineJS = results[0].jsSize;
results.forEach((result, index) => {
  const reduction = baselineJS > 0 ? ((1 - result.jsSize / baselineJS) * 100).toFixed(1) : 0;
  console.log(`   ${index + 1}. ${result.name.padEnd(15)} ${formatBytes(result.jsSize).padStart(12)} ${reduction > 0 ? `(减少 ${reduction}%)` : ''}`);
});

console.log('\n🎨 CSS 体积:');
const baselineCSS = results[0].cssSize;
results.forEach((result, index) => {
  const reduction = baselineCSS > 0 ? ((1 - result.cssSize / baselineCSS) * 100).toFixed(1) : 0;
  console.log(`   ${index + 1}. ${result.name.padEnd(15)} ${formatBytes(result.cssSize).padStart(12)} ${reduction > 0 ? `(减少 ${reduction}%)` : ''}`);
});

if (results.some(r => r.gzipSize)) {
  console.log('\n📦 Gzip 压缩后:');
  results.forEach((result, index) => {
    if (result.gzipSize) {
      const total = result.jsSize + result.cssSize;
      const gzipReduction = ((1 - result.gzipSize / total) * 100).toFixed(1);
      console.log(`   ${index + 1}. ${result.name.padEnd(15)} ${formatBytes(result.gzipSize).padStart(12)} (再减少 ${gzipReduction}%)`);
    }
  });
}

if (results.some(r => r.brotliSize)) {
  console.log('\n📦 Brotli 压缩后:');
  results.forEach((result, index) => {
    if (result.brotliSize) {
      const total = result.jsSize + result.cssSize;
      const brotliReduction = ((1 - result.brotliSize / total) * 100).toFixed(1);
      const vsGzip = result.gzipSize ? ((1 - result.brotliSize / result.gzipSize) * 100).toFixed(1) : 0;
      console.log(`   ${index + 1}. ${result.name.padEnd(15)} ${formatBytes(result.brotliSize).padStart(12)} (再减少 ${brotliReduction}%) ${vsGzip > 0 ? `[比Gzip小 ${vsGzip}%]` : ''}`);
    }
  });
}

// 总结
console.log('\n' + '═'.repeat(80));
console.log('\n💡 关键发现:\n');

if (results.length >= 5) {
  const noCompress = results[0];
  const basic = results[1];
  const advanced = results[2];
  const gzip = results[3];
  const brotli = results[4];

  console.log('1. JavaScript 压缩效果:');
  console.log(`   未压缩 → 基础压缩: 减少 ${((1 - basic.jsSize / noCompress.jsSize) * 100).toFixed(1)}%`);
  console.log(`   基础 → 高级压缩: 再减少 ${((1 - advanced.jsSize / basic.jsSize) * 100).toFixed(1)}%`);
  console.log(`   累计减少: ${((1 - advanced.jsSize / noCompress.jsSize) * 100).toFixed(1)}%`);

  console.log('\n2. CSS 压缩效果:');
  console.log(`   未压缩 → 基础压缩: 减少 ${((1 - basic.cssSize / noCompress.cssSize) * 100).toFixed(1)}%`);
  console.log(`   累计减少: ${((1 - advanced.cssSize / noCompress.cssSize) * 100).toFixed(1)}%`);

  if (gzip.gzipSize) {
    console.log('\n3. Gzip 压缩效果:');
    const advancedTotal = advanced.jsSize + advanced.cssSize;
    console.log(`   高级压缩 → Gzip: 再减少 ${((1 - gzip.gzipSize / advancedTotal) * 100).toFixed(1)}%`);
    console.log(`   相对未压缩: 减少 ${((1 - gzip.gzipSize / (noCompress.jsSize + noCompress.cssSize)) * 100).toFixed(1)}%`);
  }

  if (brotli.brotliSize) {
    console.log('\n4. Brotli 压缩效果:');
    console.log(`   Brotli vs Gzip: 再减少 ${((1 - brotli.brotliSize / gzip.gzipSize) * 100).toFixed(1)}%`);
    console.log(`   相对未压缩: 减少 ${((1 - brotli.brotliSize / (noCompress.jsSize + noCompress.cssSize)) * 100).toFixed(1)}%`);
  }

  console.log('\n5. 构建时间影响:');
  console.log(`   高级压缩比基础压缩慢: ${((advanced.buildTime / basic.buildTime - 1) * 100).toFixed(1)}%`);
  console.log(`   Brotli 比基础压缩慢: ${((brotli.buildTime / basic.buildTime - 1) * 100).toFixed(1)}%`);
}

console.log('\n🎯 推荐配置:\n');
console.log('   开发环境: 不压缩或基础压缩（快速构建）');
console.log('   测试环境: 基础压缩（平衡速度和体积）');
console.log('   生产环境: 高级压缩 + Gzip（标准配置）');
console.log('   追求极致: 高级压缩 + Gzip + Brotli（体积最小）');

console.log('\n' + '═'.repeat(80) + '\n');

// 辅助函数
function analyzeDistFiles(distDir) {
  const distPath = path.resolve(__dirname, distDir);
  if (!fs.existsSync(distPath)) {
    return { jsSize: 0, cssSize: 0, gzipSize: 0, brotliSize: 0 };
  }

  const files = fs.readdirSync(distPath);
  let jsSize = 0;
  let cssSize = 0;
  let gzipSize = 0;
  let brotliSize = 0;

  files.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);

    if (file.endsWith('.js') && !file.endsWith('.gz') && !file.endsWith('.br')) {
      jsSize += stats.size;
    } else if (file.endsWith('.css') && !file.endsWith('.gz') && !file.endsWith('.br')) {
      cssSize += stats.size;
    } else if (file.endsWith('.gz')) {
      gzipSize += stats.size;
    } else if (file.endsWith('.br')) {
      brotliSize += stats.size;
    }
  });

  return { jsSize, cssSize, gzipSize, brotliSize };
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

