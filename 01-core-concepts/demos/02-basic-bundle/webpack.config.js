// 最简单的 Webpack 配置
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 1. 入口：从哪里开始打包
  entry: './src/index.js',
  
  // 2. 输出：打包到哪里
  output: {
    path: path.resolve(__dirname, 'dist'),  // 输出目录
    filename: 'bundle.js',                   // 输出文件名
    clean: true                              // 每次打包前清空 dist 目录
  },
  
  // 3. 开发服务器配置
  devServer: {
    static: './dist',     // 服务器根目录
    port: 'auto',         // 自动寻找可用端口
    open: true,           // 自动打开浏览器
    hot: true             // 热模块替换
  },
  
  // 4. 插件
  plugins: [
    // 自动生成 HTML 并注入打包后的 JS
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'Demo 2: Webpack 打包示例'
    })
  ],
  
  // 5. Source Map（方便调试）
  devtool: 'source-map'
};

