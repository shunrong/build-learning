module.exports = {
  extends: ['@commitlint/config-conventional'],

  rules: {
    // 允许中文
    'subject-case': [0],

    // type 必须小写
    'type-case': [2, 'always', 'lower-case'],

    // type 枚举
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复
        'docs', // 文档
        'style', // 格式
        'refactor', // 重构
        'test', // 测试
        'chore', // 构建/工具
        'perf', // 性能优化
        'ci', // CI 配置
        'build', // 构建系统
        'revert', // 回滚
      ],
    ],

    // subject 不能为空
    'subject-empty': [2, 'never'],

    // subject 最大长度
    'subject-max-length': [2, 'always', 100],
  },
};
