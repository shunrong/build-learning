const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// ⚠️ 不推荐：hash（全局hash）
module.exports = {
  mode: 'production',
  
  entry: {
    main: './src/index.js',
    vendor: './src/vendor.js'
  },
  
  output: {
    path: path.resolve(__dirname, 'dist-hash'),
    // ⚠️ hash：任何文件改变，所有文件的 hash 都会改变
    filename: '[name].[hash:8].js',
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
      title: 'Demo 4: hash 策略（不推荐）'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[hash:8].css'
    })
  ],
  
  optimization: {
    runtimeChunk: 'single'
  }
};

