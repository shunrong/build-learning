const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 不启用 Tree Shaking 的配置
 * 用于对比 Tree Shaking 的效果
 */
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist-no-tree-shaking'),
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
                modules: 'commonjs'  // ← 转换为 CommonJS，无法 Tree Shaking
              }]
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  optimization: {
    usedExports: false,    // ← 不标记未使用的导出
    sideEffects: false,    // ← 不考虑副作用
    minimize: true         // 仍然压缩代码
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: '未启用 Tree Shaking'
    })
  ]
};

