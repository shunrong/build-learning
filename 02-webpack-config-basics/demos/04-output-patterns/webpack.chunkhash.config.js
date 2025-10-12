const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// ⚠️ chunkhash：chunk 级别的 hash
module.exports = {
  mode: 'production',
  
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  },
  
  output: {
    path: path.resolve(__dirname, 'dist-chunkhash'),
    // chunkhash：同一个 chunk 的文件 hash 相同
    filename: '[name].[chunkhash:8].js',
    clean: true
  },
  
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'Demo 4: chunkhash 策略'
    }),
    // ⚠️ CSS 使用 chunkhash 会有问题
    new MiniCssExtractPlugin({
      filename: '[name].[chunkhash:8].css'
    })
  ],
  
  optimization: {
    runtimeChunk: 'single'
  }
};

