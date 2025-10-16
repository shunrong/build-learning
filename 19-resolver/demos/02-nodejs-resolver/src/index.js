/**
 * Node.js 风格模块解析器
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║        Node.js 风格模块解析器                   ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

class NodeResolver {
  constructor() {
    this.extensions = ['.js', '.json', '.node'];
  }

  resolve(specifier, fromFile) {
    // 相对路径
    if (specifier.startsWith('./') || specifier.startsWith('../')) {
      return this.resolveRelative(specifier, fromFile);
    }
    
    // 绝对路径
    if (specifier.startsWith('/')) {
      return this.resolveAsFile(specifier) || this.resolveAsDirectory(specifier);
    }
    
    // 模块路径
    return this.resolveModule(specifier, fromFile);
  }

  resolveRelative(specifier, fromFile) {
    const fromDir = path.dirname(fromFile);
    const absPath = path.resolve(fromDir, specifier);
    return this.resolveAsFile(absPath) || this.resolveAsDirectory(absPath);
  }

  resolveModule(moduleName, fromFile) {
    const dirs = this.getNodeModulesPaths(fromFile);
    
    for (const dir of dirs) {
      const modulePath = path.join(dir, moduleName);
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
        if (pkg.main) {
          const mainPath = path.join(dirPath, pkg.main);
          return this.resolveAsFile(mainPath);
        }
      } catch (e) {}
    }
    
    // 查找 index 文件
    return this.resolveAsFile(path.join(dirPath, 'index'));
  }

  getNodeModulesPaths(fromFile) {
    const paths = [];
    let currentDir = path.dirname(fromFile);
    
    while (true) {
      paths.push(path.join(currentDir, 'node_modules'));
      const parent = path.dirname(currentDir);
      if (parent === currentDir) break;
      currentDir = parent;
    }
    
    return paths;
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
const resolver = new NodeResolver();
const testFile = __filename; // 使用当前文件作为起点

const testCases = [
  { spec: './index', desc: '相对路径 - 当前目录', shouldExist: true },
  { spec: './test', desc: '相对路径 - 不存在的文件', shouldExist: false },
  { spec: 'chalk', desc: '模块路径 - chalk', shouldExist: false, note: 'chalk v5+ 使用 exports，需要更复杂的解析' },
  { spec: 'react', desc: '模块路径 - react（未安装）', shouldExist: false }
];

console.log(chalk.yellow('从文件:'), chalk.white(testFile));
console.log(chalk.gray('Node modules 搜索路径:'));
const modulePaths = resolver.getNodeModulesPaths(testFile);
modulePaths.slice(0, 3).forEach(p => {
  console.log(chalk.gray(`  • ${p}`));
});
if (modulePaths.length > 3) {
  console.log(chalk.gray(`  ... 共 ${modulePaths.length} 个路径`));
}
console.log();

testCases.forEach(({ spec, desc, shouldExist, note }) => {
  console.log(chalk.blue(`[${desc}]`), chalk.white(spec));
  const result = resolver.resolve(spec, testFile);
  if (result) {
    console.log(chalk.green('  解析结果:'), chalk.gray(result));
    console.log(chalk.green('  ✓ 成功'));
  } else {
    console.log(chalk.red('  解析结果: 未找到'));
    if (shouldExist) {
      console.log(chalk.yellow('  ⚠ 预期应该找到，但未找到'));
    } else {
      console.log(chalk.gray('  ℹ 预期未找到（文件/模块不存在）'));
    }
    if (note) {
      console.log(chalk.cyan(`  💡 ${note}`));
    }
  }
  console.log();
});

console.log(chalk.cyan('说明:'));
console.log(chalk.white('  • Node.js 解析顺序: 文件 → 扩展名补全 → 目录/package.json → index 文件'));
console.log(chalk.white('  • node_modules 搜索: 从当前目录逐级向上查找'));
console.log(chalk.white('  • 扩展名: .js, .json, .node'));
console.log();

console.log(chalk.green('✅ Node.js 风格解析演示完成\n'));
