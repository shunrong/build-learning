const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('\n🌳 Tree Shaking 效果对比\n');
console.log('═'.repeat(80));

const results = [];

// 构建未启用 Tree Shaking 的版本
console.log('\n1️⃣  构建未启用 Tree Shaking 的版本...');
const noTreeShakingStart = Date.now();
try {
  execSync('npm run build:no-tree-shaking', { stdio: 'pipe' });
  const noTreeShakingTime = Date.now() - noTreeShakingStart;
  const noTreeShakingSize = getDistSize('dist-no-tree-shaking');
  results.push({
    name: '未启用 Tree Shaking',
    time: noTreeShakingTime,
    size: noTreeShakingSize
  });
  console.log(`   ✅ 完成 - 耗时: ${(noTreeShakingTime / 1000).toFixed(2)}s, 体积: ${formatBytes(noTreeShakingSize)}`);
} catch (error) {
  console.log('   ❌ 失败:', error.message);
}

// 构建启用 Tree Shaking 的版本
console.log('\n2️⃣  构建启用 Tree Shaking 的版本...');
const withTreeShakingStart = Date.now();
try {
  execSync('npm run build:with-tree-shaking', { stdio: 'pipe' });
  const withTreeShakingTime = Date.now() - withTreeShakingStart;
  const withTreeShakingSize = getDistSize('dist-with-tree-shaking');
  results.push({
    name: '启用 Tree Shaking',
    time: withTreeShakingTime,
    size: withTreeShakingSize
  });
  console.log(`   ✅ 完成 - 耗时: ${(withTreeShakingTime / 1000).toFixed(2)}s, 体积: ${formatBytes(withTreeShakingSize)}`);
} catch (error) {
  console.log('   ❌ 失败:', error.message);
}

// 对比结果
console.log('\n' + '═'.repeat(80));
console.log('\n📊 对比结果:\n');

if (results.length === 2) {
  const [noTreeShaking, withTreeShaking] = results;
  const sizeReduction = ((1 - withTreeShaking.size / noTreeShaking.size) * 100).toFixed(1);
  const timeDiff = withTreeShaking.time - noTreeShaking.time;

  console.log('📦 体积对比:');
  console.log(`   未启用 Tree Shaking: ${formatBytes(noTreeShaking.size)}`);
  console.log(`   启用 Tree Shaking:   ${formatBytes(withTreeShaking.size)}`);
  console.log(`   减少: ${formatBytes(noTreeShaking.size - withTreeShaking.size)} (${sizeReduction}%)\n`);

  console.log('⏱️  构建时间:');
  console.log(`   未启用 Tree Shaking: ${(noTreeShaking.time / 1000).toFixed(2)}s`);
  console.log(`   启用 Tree Shaking:   ${(withTreeShaking.time / 1000).toFixed(2)}s`);
  console.log(`   ${timeDiff > 0 ? '增加' : '减少'}: ${Math.abs(timeDiff / 1000).toFixed(2)}s\n`);

  console.log('🎯 效果分析:');
  console.log('   1. JavaScript Tree Shaking:');
  console.log('      - 移除了未使用的函数 (subtract, divide, power, Calculator)');
  console.log('      - 移除了未使用的常量 (PI, E, GOLDEN_RATIO)');
  console.log('      - lodash-es 按需打包 (只包含 debounce, throttle, chunk)\n');
  
  console.log('   2. CSS Tree Shaking (PurgeCSS):');
  console.log('      - 移除了未使用的样式类 (.unused-style, .another-unused, .yet-another-unused)');
  console.log('      - 只保留实际使用的 CSS\n');

  console.log('   3. 模块合并 (Scope Hoisting):');
  console.log('      - 将多个模块合并到一个作用域');
  console.log('      - 减少函数包裹代码，进一步减小体积\n');

  console.log('💡 关键发现:');
  if (sizeReduction > 30) {
    console.log(`   ✅ Tree Shaking 效果显著，体积减少 ${sizeReduction}%`);
    console.log('   ✅ 建议在生产环境中启用 Tree Shaking');
  } else if (sizeReduction > 10) {
    console.log(`   ⚠️  Tree Shaking 有一定效果，体积减少 ${sizeReduction}%`);
    console.log('   ⚠️  可能未使用的代码较少，或配置需要优化');
  } else {
    console.log(`   ❌ Tree Shaking 效果不明显，体积仅减少 ${sizeReduction}%`);
    console.log('   ❌ 检查是否正确配置 ES Module 和 sideEffects');
  }
}

console.log('\n' + '═'.repeat(80) + '\n');

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

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

