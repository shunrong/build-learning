const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 单一 Bundle 配置（未分割）
 * 所有代码打包到一个文件中
 */
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist-single'),
    filename: '[name].[contenthash:8].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
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
      title: '单一 Bundle（未分割）'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  optimization: {
    // 不进行代码分割
    splitChunks: false,
    runtimeChunk: false
  }
};

