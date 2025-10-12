const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    clean: true
  },
  
  module: {
    rules: [
      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      
      // 1. Markdown Loader（自定义）
      {
        test: /\.md$/,
        use: [
          {
            loader: path.resolve(__dirname, 'loaders/markdown-loader.js')
          }
        ]
      },
      
      // 2. Banner Loader（自定义）
      {
        test: /\.js$/,
        exclude: /node_modules/,
        enforce: 'pre',  // 前置 Loader
        use: [
          {
            loader: path.resolve(__dirname, 'loaders/banner-loader.js'),
            options: {
              banner: `
                This file is part of Webpack Loader Demo
                Author: Learning Project
                Generated: ${new Date().toISOString()}
              `
            }
          }
        ]
      },
      
      // 3. Remove Console Loader（自定义）
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: path.resolve(__dirname, 'loaders/remove-console-loader.js'),
            options: {
              enabled: process.env.NODE_ENV === 'production'
            }
          }
        ]
      },
      
      // 4. JSON i18n Loader（自定义）
      {
        test: /\.i18n\.json$/,
        type: 'javascript/auto',  // 禁用 Webpack 5 内置的 JSON 处理
        use: [
          {
            loader: path.resolve(__dirname, 'loaders/i18n-loader.js'),
            options: {
              locale: 'en'
            }
          }
        ]
      }
    ]
  },
  
  resolveLoader: {
    // Loader 搜索路径
    modules: ['node_modules', path.resolve(__dirname, 'loaders')]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: '自定义 Loader'
    })
  ],
  
  devServer: {
    port: 'auto',  // 自动寻找可用端口
    hot: true,
    open: true
  },
  
  devtool: 'eval-source-map'
};

