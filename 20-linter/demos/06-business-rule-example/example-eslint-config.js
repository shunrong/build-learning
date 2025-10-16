/**
 * ESLint 配置示例
 * 展示如何在实际项目中使用自定义规则
 */

module.exports = {
  // ... 其他配置

  plugins: [
    // 假设你把规则发布为了 npm 包: eslint-plugin-feature-boundary
    'feature-boundary'
  ],

  rules: {
    // 启用自定义规则
    'feature-boundary/no-cross-feature-import': ['error', {
      // 配置项
      featuresRoot: 'src/features',  // Features 根目录
      sharedFile: 'shared',          // 共享文件名（不带扩展名）
      alias: {
        '@': 'src',                  // 路径别名
        '~': 'src'
      }
    }]
  }
};

// ============================================
// 如果不发布为 npm 包，直接在项目中使用：
// ============================================

// 方式 1：使用本地插件
// .eslintrc.js
module.exports = {
  plugins: [
    // 指向本地规则文件
    './lint-rules/feature-boundary'
  ],
  rules: {
    'feature-boundary/no-cross-feature-import': ['error', {
      featuresRoot: 'src/features',
      sharedFile: 'shared'
    }]
  }
};

// 方式 2：直接配置规则目录
// .eslintrc.js
const path = require('path');

module.exports = {
  // 加载本地规则
  plugins: ['local-rules'],
  
  // 指定规则目录
  rulePaths: [path.resolve(__dirname, 'lint-rules')],
  
  rules: {
    'no-cross-feature-import': ['error', {
      featuresRoot: 'src/features',
      sharedFile: 'shared',
      alias: {
        '@': 'src'
      }
    }]
  }
};

