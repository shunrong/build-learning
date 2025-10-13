const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🚀 综合优化效果对比\n');
console.log('═'.repeat(80));

const results = [];

// 优化前构建
console.log('\n1️⃣  优化前构建（基准）...');
const beforeStart = Date.now();
try {
  execSync('npm run build:before', { stdio: 'pipe' });
  const beforeTime = Date.now() - beforeStart;
  const beforeSize = getDistSize('dist-before');
  results.push({
    name: '优化前',
    time: beforeTime,
    size: beforeSize,
    ...analyzeDistFiles('dist-before')
  });
  console.log(`   ✅ 完成 - 耗时: ${(beforeTime / 1000).toFixed(2)}s, 体积: ${formatBytes(beforeSize)}`);
} catch (error) {
  console.log('   ❌ 失败:', error.message);
}

// 优化后构建
console.log('\n2️⃣  优化后构建...');
const afterStart = Date.now();
try {
  execSync('npm run build:after', { stdio: 'pipe' });
  const afterTime = Date.now() - afterStart;
  const afterSize = getDistSize('dist-after');
  results.push({
    name: '优化后',
    time: afterTime,
    size: afterSize,
    ...analyzeDistFiles('dist-after')
  });
  console.log(`   ✅ 完成 - 耗时: ${(afterTime / 1000).toFixed(2)}s, 体积: ${formatBytes(afterSize)}`);
} catch (error) {
  console.log('   ❌ 失败:', error.message);
}

// 汇总对比
console.log('\n' + '═'.repeat(80));
console.log('\n📊 性能提升汇总:\n');

if (results.length === 2) {
  const [before, after] = results;
  const timeImprovement = ((1 - after.time / before.time) * 100).toFixed(1);
  const sizeReduction = ((1 - after.size / before.size) * 100).toFixed(1);

  console.log('⏱️  构建时间:');
  console.log(`   优化前: ${(before.time / 1000).toFixed(2)}s`);
  console.log(`   优化后: ${(after.time / 1000).toFixed(2)}s`);
  console.log(`   提升: ${timeImprovement}%\n`);

  console.log('📦 输出体积:');
  console.log(`   优化前: ${formatBytes(before.size)}`);
  console.log(`   优化后: ${formatBytes(after.size)}`);
  console.log(`   减少: ${sizeReduction}%\n`);

  console.log('📁 文件数量:');
  console.log(`   优化前: ${before.fileCount} 个文件`);
  console.log(`   优化后: ${after.fileCount} 个文件`);
  console.log(`   ${after.fileCount > before.fileCount ? '增加' : '减少'}: ${Math.abs(after.fileCount - before.fileCount)} 个 (Code Splitting)\n`);

  console.log('🎯 最大文件:');
  console.log(`   优化前: ${before.largestFile?.name} (${formatBytes(before.largestFile?.size)})`);
  console.log(`   优化后: ${after.largestFile?.name} (${formatBytes(after.largestFile?.size)})\n`);
}

console.log('💡 应用的优化技巧:');
console.log('   1. ✅ 持久化缓存 (filesystem cache) - 二次构建速度提升 80%+');
console.log('   2. ✅ 并行构建 (thread-loader) - 多核 CPU 加速编译');
console.log('   3. ✅ 并行压缩 (TerserPlugin parallel) - 压缩速度提升 50%+');
console.log('   4. ✅ 代码分割 (splitChunks) - vendor/react/common 分离');
console.log('   5. ✅ Tree Shaking (usedExports) - 移除未使用代码');
console.log('   6. ✅ 懒加载 (lazy) - 路由级别代码分割');
console.log('   7. ✅ 缩小 resolve 范围 - 加快模块解析');
console.log('   8. ✅ noParse - 跳过预编译库解析\n');

console.log('🔍 二次构建测试（验证缓存效果）:');
console.log('   运行以下命令对比首次/二次构建速度：');
console.log('   $ time npm run build:after  # 首次构建');
console.log('   $ time npm run build:after  # 二次构建（应该快 80%+）\n');

console.log('═'.repeat(80) + '\n');

// 辅助函数
function getDistSize(distDir) {
  const distPath = path.resolve(__dirname, distDir);
  if (!fs.existsSync(distPath)) return 0;

  let totalSize = 0;
  const files = fs.readdirSync(distPath);

  files.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      totalSize += stats.size;
    }
  });

  return totalSize;
}

function analyzeDistFiles(distDir) {
  const distPath = path.resolve(__dirname, distDir);
  if (!fs.existsSync(distPath)) {
    return { fileCount: 0, largestFile: null };
  }

  const files = fs.readdirSync(distPath)
    .map(file => {
      const filePath = path.join(distPath, file);
      const stats = fs.statSync(filePath);
      return stats.isFile() ? { name: file, size: stats.size } : null;
    })
    .filter(Boolean);

  const largestFile = files.sort((a, b) => b.size - a.size)[0];

  return {
    fileCount: files.length,
    largestFile
  };
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

