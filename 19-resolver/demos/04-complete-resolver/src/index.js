/**
 * 完整的模块解析器
 * 综合 Node.js 和 Webpack 的特性
 */

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

class CompleteResolver {
  constructor(options = {}) {
    this.alias = options.alias || {};
    this.extensions = options.extensions || ['.js', '.json', '.node'];
    this.modules = options.modules || ['node_modules'];
    this.mainFields = options.mainFields || ['module', 'main'];
    this.mainFiles = options.mainFiles || ['index'];
    this.symlinks = options.symlinks !== false;
    this.cache = new Map();
  }

  resolve(specifier, fromFile) {
    // 检查缓存
    const cacheKey = `${specifier}::${fromFile}`;
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }
    
    const result = this._resolve(specifier, fromFile);
    this.cache.set(cacheKey, result);
    return result;
  }

  _resolve(specifier, fromFile) {
    // 应用别名
    specifier = this.applyAlias(specifier);
    
    // 路径类型判断和解析
    if (specifier.startsWith('./') || specifier.startsWith('../')) {
      return this.resolveRelative(specifier, fromFile);
    }
    
    if (specifier.startsWith('/')) {
      return this.resolveAsFile(specifier) || this.resolveAsDirectory(specifier);
    }
    
    return this.resolveModule(specifier, fromFile);
  }

  applyAlias(specifier) {
    if (this.alias[specifier + '$']) {
      return this.alias[specifier + '$'];
    }
    
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
    const dirs = this.getModulePaths(fromFile);
    
    for (const dir of dirs) {
      const modulePath = path.join(dir, moduleName);
      const resolved = this.resolveAsFile(modulePath) || this.resolveAsDirectory(modulePath);
      if (resolved) return resolved;
    }
    
    return null;
  }

  resolveAsFile(filePath) {
    if (this.isFile(filePath)) return this.maybeResolveSymlink(filePath);
    
    for (const ext of this.extensions) {
      const fileWithExt = filePath + ext;
      if (this.isFile(fileWithExt)) return this.maybeResolveSymlink(fileWithExt);
    }
    
    return null;
  }

  resolveAsDirectory(dirPath) {
    if (!this.isDirectory(dirPath)) return null;
    
    const pkgPath = path.join(dirPath, 'package.json');
    if (this.isFile(pkgPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        
        for (const field of this.mainFields) {
          if (pkg[field]) {
            const mainPath = path.join(dirPath, pkg[field]);
            const resolved = this.resolveAsFile(mainPath);
            if (resolved) return resolved;
          }
        }
      } catch (e) {}
    }
    
    for (const mainFile of this.mainFiles) {
      const resolved = this.resolveAsFile(path.join(dirPath, mainFile));
      if (resolved) return resolved;
    }
    
    return null;
  }

  getModulePaths(fromFile) {
    const paths = [];
    
    // 自定义模块目录
    for (const moduleDir of this.modules) {
      if (path.isAbsolute(moduleDir)) {
        paths.push(moduleDir);
      }
    }
    
    // node_modules 逐级查找
    let currentDir = path.dirname(fromFile);
    while (true) {
      paths.push(path.join(currentDir, 'node_modules'));
      const parent = path.dirname(currentDir);
      if (parent === currentDir) break;
      currentDir = parent;
    }
    
    return paths;
  }

  maybeResolveSymlink(filePath) {
    if (!this.symlinks) return filePath;
    
    try {
      return fs.realpathSync(filePath);
    } catch (e) {
      return filePath;
    }
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

  clearCache() {
    this.cache.clear();
  }
}

console.log(chalk.bold.cyan('\n╔════════════════════════════════════════════════╗'));
console.log(chalk.bold.cyan('║          完整的模块解析器                       ║'));
console.log(chalk.bold.cyan('╚════════════════════════════════════════════════╝\n'));

const resolver = new CompleteResolver({
  alias: {
    '@': '/project/src',
    'components': '/project/src/components'
  },
  extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
  modules: ['/project/node_modules'],
  mainFields: ['browser', 'module', 'main'],
  mainFiles: ['index'],
  symlinks: true
});

console.log(chalk.green('✓ 支持别名'));
console.log(chalk.green('✓ 支持多扩展名'));
console.log(chalk.green('✓ 支持缓存'));
console.log(chalk.green('✓ 支持符号链接'));
console.log(chalk.green('✓ 支持 package.json mainFields'));
console.log();
