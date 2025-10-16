/**
 * ESLint Rule: no-cross-feature-import
 * 
 * 禁止跨 feature 导入内部文件，只能从 shared.ts 导入
 * 
 * @example
 * // ✅ 允许
 * import { something } from '@/features/exp/shared';
 * import { something } from '../exp/shared';
 * 
 * // ❌ 禁止
 * import { something } from '@/features/exp/components/Button';
 * import { something } from '../exp/utils/helper';
 */

const path = require('path');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: '禁止跨 feature 导入内部文件，只能从 shared.ts 导入',
      category: 'Best Practices',
      recommended: true
    },
    messages: {
      noCrossFeatureImport: 
        '禁止从其他 feature 的内部文件导入。请从 "{{targetFeature}}/shared" 导入: {{suggestion}}',
    },
    schema: [
      {
        type: 'object',
        properties: {
          featuresRoot: {
            type: 'string',
            default: 'src/features'
          },
          sharedFile: {
            type: 'string',
            default: 'shared'
          },
          alias: {
            type: 'object',
            default: { '@': 'src' }
          }
        },
        additionalProperties: false
      }
    ]
  },

  create(context) {
    const options = context.options[0] || {};
    const featuresRoot = options.featuresRoot || 'src/features';
    const sharedFile = options.sharedFile || 'shared';
    const alias = options.alias || { '@': 'src' };

    // 获取当前文件的路径
    const currentFilePath = context.getFilename();

    /**
     * 解析别名路径
     */
    function resolveAlias(importPath) {
      for (const [aliasKey, aliasValue] of Object.entries(alias)) {
        if (importPath.startsWith(aliasKey + '/')) {
          return importPath.replace(aliasKey, aliasValue);
        }
      }
      return importPath;
    }

    /**
     * 获取文件所属的 feature
     */
    function getFeatureName(filePath) {
      const normalized = filePath.replace(/\\/g, '/');
      const match = normalized.match(new RegExp(`${featuresRoot}/([^/]+)`));
      return match ? match[1] : null;
    }

    /**
     * 手动解析路径，处理 ../ 和 ./
     */
    function normalizePath(pathStr) {
      const parts = pathStr.split('/').filter(p => p && p !== '.');
      const result = [];
      
      for (const part of parts) {
        if (part === '..') {
          // 遇到 ..，弹出上一级目录
          if (result.length > 0) {
            result.pop();
          }
        } else {
          result.push(part);
        }
      }
      
      return result.join('/');
    }

    /**
     * 解析导入路径，返回规范化的路径
     */
    function resolveImportPath(importPath, fromFile) {
      // 处理别名
      let resolved = resolveAlias(importPath);

      // 如果是相对路径，解析为路径
      if (resolved.startsWith('.')) {
        const fromDir = path.dirname(fromFile).replace(/\\/g, '/');
        // 拼接路径
        const joined = fromDir + '/' + resolved;
        // 手动规范化，正确处理 ../ 路径
        resolved = normalizePath(joined);
      }

      // 确保使用 / 分隔符
      return resolved.replace(/\\/g, '/');
    }

    /**
     * 检查是否是跨 feature 导入
     */
    function isCrossFeatureImport(importPath, currentFile) {
      const currentFeature = getFeatureName(currentFile);
      const importedFeature = getFeatureName(importPath);

      // 如果当前文件不在 feature 中，不检查
      if (!currentFeature) {
        return { isCross: false };
      }

      // 如果导入的不是 feature，不检查
      if (!importedFeature) {
        return { isCross: false };
      }

      // 如果是同一个 feature，允许
      if (currentFeature === importedFeature) {
        return { isCross: false };
      }

      // 跨 feature 导入
      return {
        isCross: true,
        currentFeature,
        importedFeature
      };
    }

    /**
     * 检查是否是从 shared 文件导入
     */
    function isSharedImport(importPath) {
      const normalized = importPath.replace(/\\/g, '/');
      // 匹配 features/xxx/shared 或 features/xxx/shared.ts
      const pattern = new RegExp(`${featuresRoot}/[^/]+/${sharedFile}(\\.ts|\\.js)?$`);
      return pattern.test(normalized);
    }

    return {
      ImportDeclaration(node) {
        const importPath = node.source.value;
        
        // 忽略 node_modules
        if (!importPath.startsWith('.') && !importPath.startsWith('@')) {
          return;
        }

        // 解析导入路径
        const resolvedPath = resolveImportPath(importPath, currentFilePath);

        // 检查是否是跨 feature 导入
        const crossCheck = isCrossFeatureImport(resolvedPath, currentFilePath);
        
        if (!crossCheck.isCross) {
          return;
        }

        // 检查是否从 shared 导入
        if (isSharedImport(resolvedPath)) {
          return; // 从 shared 导入，允许
        }

        // 违规：跨 feature 导入内部文件
        const { currentFeature, importedFeature } = crossCheck;
        
        // 生成建议的导入路径
        const suggestion = importPath.includes('@/')
          ? `import { ... } from '@/${featuresRoot}/${importedFeature}/${sharedFile}'`
          : `import { ... } from '../${importedFeature}/${sharedFile}'`;

        context.report({
          node: node.source,
          messageId: 'noCrossFeatureImport',
          data: {
            targetFeature: importedFeature,
            suggestion
          }
        });
      }
    };
  }
};

