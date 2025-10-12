const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const LifecyclePlugin = require('./plugins/LifecyclePlugin');

module.exports = {
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    clean: true
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'Webpack 生命周期演示'
    }),
    
    // 生命周期演示插件
    new LifecyclePlugin()
  ],
  
  devtool: false
};

