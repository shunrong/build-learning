const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n📦 代码分割效果对比\n');
console.log('═'.repeat(80));

const results = [];

// 构建单一 Bundle
console.log('\n1️⃣  构建单一 Bundle（未分割）...');
const singleStart = Date.now();
try {
  execSync('npm run build:single', { stdio: 'pipe' });
  const singleTime = Date.now() - singleStart;
  const singleStats = analyzeDistFiles('dist-single');
  results.push({
    name: '单一 Bundle',
    time: singleTime,
    ...singleStats
  });
  console.log(`   ✅ 完成 - 耗时: ${(singleTime / 1000).toFixed(2)}s`);
  console.log(`   📦 总体积: ${formatBytes(singleStats.totalSize)}`);
  console.log(`   📄 文件数: ${singleStats.fileCount} 个`);
} catch (error) {
  console.log('   ❌ 失败:', error.message);
}

// 构建代码分割版本
console.log('\n2️⃣  构建代码分割版本...');
const splitStart = Date.now();
try {
  execSync('npm run build:split', { stdio: 'pipe' });
  const splitTime = Date.now() - splitStart;
  const splitStats = analyzeDistFiles('dist-split');
  results.push({
    name: '代码分割',
    time: splitTime,
    ...splitStats
  });
  console.log(`   ✅ 完成 - 耗时: ${(splitTime / 1000).toFixed(2)}s`);
  console.log(`   📦 总体积: ${formatBytes(splitStats.totalSize)}`);
  console.log(`   📄 文件数: ${splitStats.fileCount} 个`);
} catch (error) {
  console.log('   ❌ 失败:', error.message);
}

// 对比结果
console.log('\n' + '═'.repeat(80));
console.log('\n📊 详细对比:\n');

if (results.length === 2) {
  const [single, split] = results;

  console.log('⏱️  构建时间:');
  console.log(`   单一 Bundle: ${(single.time / 1000).toFixed(2)}s`);
  console.log(`   代码分割:    ${(split.time / 1000).toFixed(2)}s`);
  console.log(`   差异: ${Math.abs(split.time - single.time) > 1000 ? '+' : ''}${((split.time - single.time) / 1000).toFixed(2)}s\n`);

  console.log('📦 总体积:');
  console.log(`   单一 Bundle: ${formatBytes(single.totalSize)}`);
  console.log(`   代码分割:    ${formatBytes(split.totalSize)}`);
  const sizeDiff = ((split.totalSize - single.totalSize) / single.totalSize * 100).toFixed(1);
  console.log(`   差异: ${sizeDiff > 0 ? '+' : ''}${sizeDiff}% (${sizeDiff > 0 ? '稍大' : '稍小'})\n`);

  console.log('📄 文件数量:');
  console.log(`   单一 Bundle: ${single.fileCount} 个`);
  console.log(`   代码分割:    ${split.fileCount} 个`);
  console.log(`   增加: ${split.fileCount - single.fileCount} 个\n`);

  console.log('📁 文件清单:\n');
  console.log('   单一 Bundle:');
  single.files.forEach(file => {
    console.log(`      ${file.name.padEnd(30)} ${formatBytes(file.size).padStart(12)}`);
  });

  console.log('\n   代码分割:');
  split.files.forEach(file => {
    const type = file.name.includes('runtime') ? '(运行时)' :
                 file.name.includes('react-vendors') ? '(React)' :
                 file.name.includes('utils') ? '(工具库)' :
                 file.name.includes('vendors') ? '(第三方)' :
                 file.name.includes('common') ? '(公共代码)' :
                 file.name.includes('chunk') ? '(懒加载)' : '';
    console.log(`      ${file.name.padEnd(30)} ${formatBytes(file.size).padStart(12)} ${type}`);
  });

  console.log('\n💡 关键发现:\n');
  
  console.log('   1. 首屏加载优化:');
  const singleInitialSize = single.totalSize;
  const splitInitialSize = split.files
    .filter(f => !f.name.includes('chunk'))
    .reduce((sum, f) => sum + f.size, 0);
  const initialReduction = ((1 - splitInitialSize / singleInitialSize) * 100).toFixed(1);
  console.log(`      单一 Bundle: ${formatBytes(singleInitialSize)} (全部加载)`);
  console.log(`      代码分割:    ${formatBytes(splitInitialSize)} (初始加载)`);
  console.log(`      减少: ${formatBytes(singleInitialSize - splitInitialSize)} (${initialReduction}%)`);

  console.log('\n   2. 缓存优化:');
  console.log(`      ✅ react-vendors.js 长期稳定，缓存命中率高`);
  console.log(`      ✅ runtime.js 很小，变化时影响有限`);
  console.log(`      ✅ 业务代码修改时，第三方库无需重新下载`);

  console.log('\n   3. 懒加载收益:');
  const lazyChunks = split.files.filter(f => f.name.includes('chunk'));
  const lazySize = lazyChunks.reduce((sum, f) => sum + f.size, 0);
  console.log(`      懒加载文件: ${lazyChunks.length} 个`);
  console.log(`      懒加载体积: ${formatBytes(lazySize)}`);
  console.log(`      用户不访问相关页面，这部分代码不会下载`);

  console.log('\n   4. 最佳实践:');
  console.log(`      ✅ 路由级别懒加载 - 按需加载页面代码`);
  console.log(`      ✅ vendor 分离 - React 等稳定库单独打包`);
  console.log(`      ✅ 运行时分离 - 减少主 chunk 变化`);
  console.log(`      ✅ 公共代码提取 - 避免重复打包`);

  console.log('\n🎯 结论:');
  if (initialReduction > 30) {
    console.log(`   ✅ 代码分割效果显著，首屏体积减少 ${initialReduction}%`);
    console.log('   ✅ 强烈推荐在生产环境中使用');
  } else {
    console.log(`   ⚠️  代码分割有一定效果，首屏体积减少 ${initialReduction}%`);
    console.log('   ⚠️  可以进一步优化懒加载策略');
  }
}

console.log('\n' + '═'.repeat(80) + '\n');

// 辅助函数
function analyzeDistFiles(distDir) {
  const distPath = path.resolve(__dirname, distDir);
  if (!fs.existsSync(distPath)) {
    return { totalSize: 0, fileCount: 0, files: [] };
  }

  const files = fs.readdirSync(distPath)
    .filter(file => file.endsWith('.js') || file.endsWith('.css'))
    .map(file => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      return {
        name: file,
        size: stats.size
      };
    })
    .sort((a, b) => b.size - a.size);

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);

  return {
    totalSize,
    fileCount: files.length,
    files
  };
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

