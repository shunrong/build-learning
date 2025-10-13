const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    clean: true
  },
  
  // ⚠️ 无缓存配置
  cache: false,
  
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react'
            ],
            // ⚠️ babel-loader 也不缓存
            cacheDirectory: false
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: '无缓存构建'
    })
  ],
  
  resolve: {
    extensions: ['.js', '.jsx']
  }
};

