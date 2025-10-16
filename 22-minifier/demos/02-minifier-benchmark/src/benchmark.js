const { minify: terserMinify } = require('terser');
const { transformSync } = require('esbuild');
const chalk = require('chalk');

// 生成测试代码
function generateCode(lines) {
  let code = '';
  for (let i = 0; i < lines; i++) {
    code += `function func${i}(param${i}) { return param${i} * 2 + ${i}; }\n`;
  }
  return code;
}

// 性能测试
async function benchmark() {
  console.log(chalk.bold.blue('\n========== Minifier 性能对比 ==========\n'));
  
  const sizes = [100, 500, 1000];
  
  for (const size of sizes) {
    console.log(chalk.yellow(`\n【测试】${size} 个函数\n`));
    
    const code = generateCode(size);
    const originalSize = code.length;
    
    // Terser
    const terserStart = Date.now();
    const terserResult = await terserMinify(code);
    const terserTime = Date.now() - terserStart;
    const terserSize = terserResult.code.length;
    
    console.log(chalk.green('Terser:'));
    console.log(chalk.gray(`  时间: ${terserTime}ms`));
    console.log(chalk.gray(`  大小: ${originalSize} → ${terserSize} (${((1 - terserSize/originalSize) * 100).toFixed(1)}% 减少)`));
    
    // esbuild
    const esbuildStart = Date.now();
    const esbuildResult = transformSync(code, {
      minify: true,
      loader: 'js'
    });
    const esbuildTime = Date.now() - esbuildStart;
    const esbuildSize = esbuildResult.code.length;
    
    console.log(chalk.cyan('\nesbuild:'));
    console.log(chalk.gray(`  时间: ${esbuildTime}ms`));
    console.log(chalk.gray(`  大小: ${originalSize} → ${esbuildSize} (${((1 - esbuildSize/originalSize) * 100).toFixed(1)}% 减少)`));
    
    console.log(chalk.magenta(`\n对比: esbuild 比 Terser 快 ${(terserTime / esbuildTime).toFixed(1)}x`));
  }
  
  console.log(chalk.bold.green('\n✅ 性能对比完成！'));
  console.log(chalk.gray('\n结论：'));
  console.log(chalk.gray('- esbuild: 速度极快（10-100x）'));
  console.log(chalk.gray('- Terser: 压缩率更好'));
  console.log(chalk.gray('- 实际选择：看项目需求\n'));
}

benchmark();

