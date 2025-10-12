const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  
  console.log('==========================================');
  console.log('🔧 构建模式:', argv.mode);
  console.log('  - isDev:', isDev);
  console.log('  - CSS 处理:', isDev ? 'style-loader (注入)' : 'MiniCssExtractPlugin (提取)');
  console.log('==========================================');
  
  return {
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    clean: true
  },
  
  module: {
    rules: [
      // 1. 普通 CSS：style-loader（开发）/ MiniCssExtractPlugin（生产）
      {
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      },
      
      // 2. CSS Modules
      {
        test: /\.module\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: isDev 
                  ? '[path][name]__[local]--[hash:base64:5]'
                  : '[hash:base64:8]'
              }
            }
          }
        ]
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'CSS Loader 基础'
    }),
    
    // 生产环境提取 CSS
    !isDev && new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    })
  ].filter(Boolean),
  
  devServer: {
    port: 'auto',  // 自动寻找可用端口
    hot: true,
    open: true
  },
  
  devtool: isDev ? 'eval-source-map' : false
  };
};

