/**
 * 异步 Loader 示例
 * 
 * 演示如何实现异步 Loader
 */

module.exports = function(source) {
  // 1. 获取异步回调
  const callback = this.async();
  
  // 2. 模拟异步操作
  setTimeout(() => {
    try {
      // 3. 处理源码
      const result = source.toUpperCase();
      
      // 4. 调用回调返回结果
      callback(null, result);
    } catch (error) {
      // 5. 错误处理
      callback(error);
    }
  }, 1000);
  
  // ⚠️ 异步 Loader 不需要 return
};

