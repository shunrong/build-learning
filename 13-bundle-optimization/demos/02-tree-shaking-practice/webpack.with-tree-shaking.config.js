const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const glob = require('glob');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');

/**
 * 启用 Tree Shaking 的配置
 * 对比未启用 Tree Shaking 的体积差异
 */
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist-with-tree-shaking'),
    filename: '[name].[contenthash:8].js',
    clean: true
  },
  
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['@babel/preset-env', {
                modules: false  // ← 保留 ES Module，启用 Tree Shaking
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
        sideEffects: true  // CSS 有副作用，不能移除
      }
    ]
  },
  
  optimization: {
    usedExports: true,     // ← 标记未使用的导出
    sideEffects: true,     // ← 根据 package.json 的 sideEffects 决定
    minimize: true,        // 压缩代码
    concatenateModules: true  // 模块合并（Scope Hoisting）
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: '启用 Tree Shaking'
    }),
    
    // CSS Tree Shaking
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
      safelist: ['html', 'body']  // 保护这些选择器不被移除
    })
  ]
};

