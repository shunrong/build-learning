/**
 * Remove Console Loader
 * 
 * 功能：移除代码中的 console.log 语句
 * 使用：生产环境自动移除 console
 */

const { validate } = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    enabled: {
      type: 'boolean'
    }
  }
};

module.exports = function(source) {
  // 1. 获取配置
  const options = this.getOptions() || {};
  
  // 2. 验证配置
  validate(schema, options, {
    name: 'Remove Console Loader',
    baseDataPath: 'options'
  });
  
  // 3. 如果未启用，直接返回
  if (!options.enabled) {
    return source;
  }
  
  // 4. 移除 console.log 语句
  const result = source.replace(
    /console\.(log|warn|info|debug|error)\(.*?\);?\s*/g,
    ''
  );
  
  // 5. 返回结果
  return result;
};

