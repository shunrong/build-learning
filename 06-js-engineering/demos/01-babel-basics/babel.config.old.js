// 针对老旧浏览器的 Babel 配置
module.exports = (api) => {
  api.cache.using(() => process.env.NODE_ENV);
  
  return {
    presets: [
      ['@babel/preset-env', {
        // 目标老旧浏览器：IE 11, Chrome 49, Safari 10
        targets: {
          ie: '11',
          chrome: '49',
          safari: '10'
        },
        
        // 不转换模块语法
        modules: false,
        
        // 开启调试
        debug: true,
        
        // 不使用 polyfill
        useBuiltIns: false
      }]
    ]
  };
};

