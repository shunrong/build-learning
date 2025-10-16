/**
 * Webpack 风格解析器
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║        Webpack 风格解析器                       ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

class WebpackResolver {
  constructor(options = {}) {
    this.alias = options.alias || {};
    this.extensions = options.extensions || ['.js', '.json'];
    this.modules = options.modules || ['node_modules'];
    this.mainFields = options.mainFields || ['module', 'main'];
    this.mainFiles = options.mainFiles || ['index'];
  }

  resolve(specifier, fromFile) {
    // 1. 应用别名
    specifier = this.applyAlias(specifier);
    
    // 2. 判断路径类型
    if (specifier.startsWith('./') || specifier.startsWith('../')) {
      return this.resolveRelative(specifier, fromFile);
    }
    
    if (specifier.startsWith('/')) {
      return this.resolveAsFile(specifier) || this.resolveAsDirectory(specifier);
    }
    
    return this.resolveModule(specifier, fromFile);
  }

  applyAlias(specifier) {
    // 精确匹配（以 $ 结尾）
    if (this.alias[specifier + '$']) {
      return this.alias[specifier + '$'];
    }
    
    // 前缀匹配
    for (const [key, value] of Object.entries(this.alias)) {
      if (key.endsWith('$')) continue;
      if (specifier === key || specifier.startsWith(key + '/')) {
        return specifier.replace(key, value);
      }
    }
    
    return specifier;
  }

  resolveRelative(specifier, fromFile) {
    const fromDir = path.dirname(fromFile);
    const absPath = path.resolve(fromDir, specifier);
    return this.resolveAsFile(absPath) || this.resolveAsDirectory(absPath);
  }

  resolveModule(moduleName, fromFile) {
    for (const moduleDir of this.modules) {
      const modulePath = path.isAbsolute(moduleDir)
        ? path.join(moduleDir, moduleName)
        : path.join(path.dirname(fromFile), moduleDir, moduleName);
      
      const resolved = this.resolveAsFile(modulePath) || this.resolveAsDirectory(modulePath);
      if (resolved) return resolved;
    }
    
    return null;
  }

  resolveAsFile(filePath) {
    // 精确匹配
    if (this.isFile(filePath)) return filePath;
    
    // 补全扩展名
    for (const ext of this.extensions) {
      const fileWithExt = filePath + ext;
      if (this.isFile(fileWithExt)) return fileWithExt;
    }
    
    return null;
  }

  resolveAsDirectory(dirPath) {
    if (!this.isDirectory(dirPath)) return null;
    
    // 读取 package.json
    const pkgPath = path.join(dirPath, 'package.json');
    if (this.isFile(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        
        // 按 mainFields 顺序查找
        for (const field of this.mainFields) {
          if (pkg[field]) {
            const mainPath = path.join(dirPath, pkg[field]);
            const resolved = this.resolveAsFile(mainPath);
            if (resolved) return resolved;
          }
        }
      } catch (e) {}
    }
    
    // 查找 mainFiles
    for (const mainFile of this.mainFiles) {
      const resolved = this.resolveAsFile(path.join(dirPath, mainFile));
      if (resolved) return resolved;
    }
    
    return null;
  }

  isFile(filePath) {
    try {
      return fs.statSync(filePath).isFile();
    } catch (e) {
      return false;
    }
  }

  isDirectory(dirPath) {
    try {
      return fs.statSync(dirPath).isDirectory();
    } catch (e) {
      return false;
    }
  }
}

// 测试
const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const nodeModulesDir = path.join(projectRoot, 'node_modules');

const resolver = new WebpackResolver({
  alias: {
    '@': srcDir,
    'utils$': path.join(srcDir, 'index.js')  // 精确别名
  },
  extensions: ['.js', '.json'],
  modules: [nodeModulesDir]
});

const testFile = path.join(srcDir, 'app.js');

const testCases = [
  { desc: '别名（精确）', spec: 'utils', expected: srcDir + '/index.js' },
  { desc: '别名（前缀）', spec: '@/index', expected: srcDir + '/index.js' },
  { desc: '相对路径（文件存在）', spec: './index', expected: srcDir + '/index.js' },
  { desc: '模块路径', spec: 'chalk', expected: 'chalk 模块' }
];

console.log(chalk.yellow('配置:'));
console.log(chalk.white('  项目根目录:'), chalk.gray(projectRoot));
console.log(chalk.white('  src 目录:'), chalk.gray(srcDir));
console.log(chalk.white('  别名:'));
Object.entries(resolver.alias).forEach(([key, value]) => {
  console.log(chalk.gray(`    ${key} → ${value}`));
});
console.log(chalk.white('  扩展名:'), chalk.gray(resolver.extensions.join(', ')));
console.log();

console.log(chalk.yellow('从文件:'), chalk.white(testFile));
console.log();

testCases.forEach(({ desc, spec, expected }) => {
  console.log(chalk.blue(`[${desc}]`), chalk.white(spec));
  console.log(chalk.gray(`  期望: ${expected}`));
  const result = resolver.resolve(spec, testFile);
  if (result) {
    console.log(chalk.green('  解析结果:'), chalk.gray(result));
    console.log(chalk.green('  ✓ 成功'));
  } else {
    console.log(chalk.red('  解析结果: 未找到'));
    console.log(chalk.yellow('  ⚠ 如果文件/模块不存在，这是正常的'));
  }
  console.log();
});

console.log(chalk.cyan('说明:'));
console.log(chalk.white('  • 此 demo 演示解析逻辑，部分路径可能不存在'));
console.log(chalk.white('  • 别名（精确）: utils$ 只匹配 "utils"，不匹配 "utils/xxx"'));
console.log(chalk.white('  • 别名（前缀）: @ 可匹配 "@/xxx"'));
console.log(chalk.white('  • 相对路径: 从当前文件目录解析'));
console.log(chalk.white('  • 模块路径: 从 node_modules 解析'));
console.log();

console.log(chalk.green('✅ Webpack 风格解析演示完成\n'));
