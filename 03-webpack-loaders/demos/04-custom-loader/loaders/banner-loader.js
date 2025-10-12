/**
 * Banner Loader
 * 
 * 功能：在文件顶部添加注释横幅
 * 使用：enforce: 'pre' 确保最先执行
 */

const { validate } = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    banner: {
      type: 'string'
    }
  },
  required: ['banner']
};

module.exports = function(source) {
  // 1. 获取配置
  const options = this.getOptions();
  
  // 2. 验证配置
  validate(schema, options, {
    name: 'Banner Loader',
    baseDataPath: 'options'
  });
  
  // 3. 添加横幅
  const banner = `/*\n${options.banner}\n*/\n\n`;
  
  // 4. 返回结果
  return banner + source;
};

