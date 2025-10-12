/**
 * Markdown Loader
 * 
 * 功能：将 Markdown 文件转换为 HTML
 * 使用：import html from './README.md'
 */

const { marked } = require('marked');

module.exports = function(source) {
  // 1. 标记为可缓存
  this.cacheable && this.cacheable();
  
  // 2. 转换 Markdown 为 HTML
  const html = marked(source);
  
  // 3. 返回 ES 模块
  return `export default ${JSON.stringify(html)}`;
};

