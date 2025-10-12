/**
 * i18n Loader
 * 
 * 功能：根据语言环境加载国际化文件
 * 使用：import messages from './messages.i18n.json'
 */

const { validate } = require('schema-utils');

const schema = {
  type: 'object',
  properties: {
    locale: {
      type: 'string'
    }
  },
  required: ['locale']
};

module.exports = function(source) {
  // 1. 获取配置
  const options = this.getOptions();
  
  // 2. 验证配置
  validate(schema, options, {
    name: 'i18n Loader',
    baseDataPath: 'options'
  });
  
  // 3. 解析 JSON
  const translations = JSON.parse(source);
  const locale = options.locale || 'en';
  
  // 4. 选择对应语言
  const localeData = translations[locale] || translations.en || {};
  
  // 5. 返回 ES 模块
  return `export default ${JSON.stringify(localeData)}`;
};

