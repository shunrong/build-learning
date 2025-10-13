const fs = require('fs');
const path = require('path');

// 获取文件大小（字节）
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// 格式化文件大小
function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / 1024 / 1024).toFixed(2) + ' MB';
}

// 分析各个方案的打包体积
const configs = [
  { name: 'useBuiltIns: false', dir: 'dist/false' },
  { name: 'useBuiltIns: entry', dir: 'dist/entry' },
  { name: 'useBuiltIns: usage', dir: 'dist/usage' },
  { name: 'transform-runtime', dir: 'dist/runtime' }
];

console.log('\n========================================');
console.log('  Polyfill 方案体积对比');
console.log('========================================\n');

const results = configs.map(config => {
  const bundlePath = path.resolve(__dirname, config.dir, 'bundle.js');
  const size = getFileSize(bundlePath);
  
  return {
    name: config.name,
    size,
    sizeStr: formatSize(size)
  };
});

// 排序（按体积从小到大）
results.sort((a, b) => a.size - b.size);

// 输出结果
results.forEach((result, index) => {
  const star = index === 0 ? ' ⭐ (最小)' : '';
  console.log(`${index + 1}. ${result.name}${star}`);
  console.log(`   体积: ${result.sizeStr}`);
  if (index > 0) {
    const diff = result.size - results[0].size;
    const percent = ((diff / results[0].size) * 100).toFixed(1);
    console.log(`   比最小方案多: ${formatSize(diff)} (${percent}%)`);
  }
  console.log('');
});

// 总结
console.log('========================================');
console.log('  总结');
console.log('========================================');
console.log('');
console.log('体积排序: ');
results.forEach((result, index) => {
  console.log(`  ${index + 1}. ${result.name} - ${result.sizeStr}`);
});
console.log('');
console.log('推荐方案:');
console.log('  • 应用开发: useBuiltIns: \'usage\' (按需引入，体积小)');
console.log('  • 库开发: transform-runtime (不污染全局)');
console.log('  • 现代浏览器: useBuiltIns: false (不需要 Polyfill)');
console.log('');

