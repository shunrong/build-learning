module.exports = (api) => {
  // 使用 api.cache.using() 替代 api.cache(true) 避免与 babel-loader 缓存冲突
  api.cache.using(() => process.env.NODE_ENV);
  
  // 判断环境
  const isDev = api.env('development');
  
  return {
    presets: [
      ['@babel/preset-env', {
        // 目标环境（也可以在 package.json 的 browserslist 中配置）
        targets: {
          browsers: ['> 1%', 'last 2 versions', 'not dead']
        },
        
        // 不转换模块语法，让 Webpack 处理（支持 Tree Shaking）
        modules: false,
        
        // 开启调试信息（可以看到启用了哪些插件）
        debug: isDev,
        
        // Polyfill 配置（在 Demo 2 中详细讲解）
        // 这里先设置为 false，只转换语法
        useBuiltIns: false
      }]
    ]
  };
};

