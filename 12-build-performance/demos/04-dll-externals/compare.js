const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 DLL/Externals 构建性能对比\n');
console.log('═'.repeat(80));

const results = [];

// 普通构建
console.log('\n1️⃣  普通构建（无优化）...');
const normalStart = Date.now();
try {
  execSync('npm run build:normal', { stdio: 'pipe' });
  const normalTime = Date.now() - normalStart;
  const normalSize = getDistSize();
  results.push({
    name: '普通构建',
    time: normalTime,
    size: normalSize
  });
  console.log(`   ✅ 完成 - 耗时: ${(normalTime / 1000).toFixed(2)}s, 体积: ${normalSize} bytes`);
} catch (error) {
  console.log('   ❌ 失败:', error.message);
}

// DLL 构建
console.log('\n2️⃣  DLL 预编译构建...');
const dllStart = Date.now();
try {
  execSync('npm run build:dll', { stdio: 'pipe' });
  const dllTime = Date.now() - dllStart;
  const dllSize = getDistSize();
  results.push({
    name: 'DLL 预编译',
    time: dllTime,
    size: dllSize
  });
  console.log(`   ✅ 完成 - 耗时: ${(dllTime / 1000).toFixed(2)}s, 体积: ${dllSize} bytes`);
} catch (error) {
  console.log('   ❌ 失败:', error.message);
}

// Externals 构建
console.log('\n3️⃣  Externals (CDN) 构建...');
const externalsStart = Date.now();
try {
  execSync('npm run build:externals', { stdio: 'pipe' });
  const externalsTime = Date.now() - externalsStart;
  const externalsSize = getDistSize();
  results.push({
    name: 'Externals (CDN)',
    time: externalsTime,
    size: externalsSize
  });
  console.log(`   ✅ 完成 - 耗时: ${(externalsTime / 1000).toFixed(2)}s, 体积: ${externalsSize} bytes`);
} catch (error) {
  console.log('   ❌ 失败:', error.message);
}

// 汇总结果
console.log('\n' + '═'.repeat(80));
console.log('\n📊 对比结果汇总:\n');

results.forEach((result, index) => {
  const baseline = results[0];
  const timeImprovement = baseline ? ((1 - result.time / baseline.time) * 100).toFixed(1) : 0;
  const sizeReduction = baseline ? ((1 - result.size / baseline.size) * 100).toFixed(1) : 0;
  
  console.log(`${index + 1}. ${result.name}`);
  console.log(`   构建时间: ${(result.time / 1000).toFixed(2)}s ${timeImprovement > 0 ? `(提升 ${timeImprovement}%)` : ''}`);
  console.log(`   输出体积: ${formatBytes(result.size)} ${sizeReduction > 0 ? `(减少 ${sizeReduction}%)` : ''}`);
  console.log('');
});

console.log('💡 关键发现:');
console.log('   • DLL: 首次构建较慢（需预编译），后续构建快（复用 DLL）');
console.log('   • Externals: 构建最快且包体积最小，但依赖 CDN 稳定性');
console.log('   • 普通构建: 简单但每次都编译全部依赖，大项目耗时长\n');

console.log('═'.repeat(80));

// 辅助函数：获取 dist 目录大小
function getDistSize() {
  const distPath = path.resolve(__dirname, 'dist');
  if (!fs.existsSync(distPath)) return 0;

  let totalSize = 0;
  const files = fs.readdirSync(distPath);
  
  files.forEach(file => {
    const filePath = path.join(distPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile()) {
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      // 递归计算子目录
      totalSize += getDirSize(filePath);
    }
  });

  return totalSize;
}

function getDirSize(dirPath) {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile()) {
      totalSize += stats.size;
    } else if (stats.isDirectory()) {
      totalSize += getDirSize(filePath);
    }
  });

  return totalSize;
}

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

