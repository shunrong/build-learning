/**
 * Pitch Loader 示例
 * 
 * 演示 pitch 方法的使用
 */

module.exports = function(source) {
  console.log('Normal phase:', this.resourcePath);
  return source;
};

module.exports.pitch = function(remainingRequest, precedingRequest, data) {
  console.log('Pitch phase:', this.resourcePath);
  console.log('Remaining request:', remainingRequest);
  console.log('Preceding request:', precedingRequest);
  
  // 传递数据到 normal 阶段
  data.value = 'from pitch';
  
  // 如果返回值，会跳过后续 Loader
  // return 'skip';
};

