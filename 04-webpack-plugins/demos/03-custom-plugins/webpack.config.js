const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// 自定义 Plugin
const FileListPlugin = require('./plugins/FileListPlugin');
const InjectVersionPlugin = require('./plugins/InjectVersionPlugin');
const RemoveConsolePlugin = require('./plugins/RemoveConsolePlugin');
const BuildNotificationPlugin = require('./plugins/BuildNotificationPlugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    entry: './src/index.js',
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
      clean: true
    },
    
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: '自定义 Plugin 演示'
      }),
      
      // 🔌 自定义 Plugin 1: 文件清单
      new FileListPlugin({
        filename: 'filelist.txt',
        format: 'text'
      }),
      
      // 🔌 自定义 Plugin 2: 版本注入
      new InjectVersionPlugin(),
      
      // 🔌 自定义 Plugin 3: 移除 console（仅生产）
      new RemoveConsolePlugin({
        enabled: !isDev
      }),
      
      // 🔌 自定义 Plugin 4: 构建通知
      new BuildNotificationPlugin({
        title: '自定义 Plugin 演示'
      })
    ],
    
    devtool: isDev ? 'eval-source-map' : false
  };
};

