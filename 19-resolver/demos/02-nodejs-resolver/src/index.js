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
const testFile = '/project/src/app.js';

const testCases = [
  './utils',
  '../config',
  'lodash',
  'react'
];

console.log(chalk.yellow('从文件:'), chalk.white(testFile));
console.log();

testCases.forEach(spec => {
  const result = resolver.resolve(spec, testFile);
  console.log(chalk.blue('解析:'), chalk.white(spec));
  if (result) {
    console.log(chalk.green('  →'), chalk.gray(result));
  } else {
    console.log(chalk.red('  → 未找到'));
  }
  console.log();
});
