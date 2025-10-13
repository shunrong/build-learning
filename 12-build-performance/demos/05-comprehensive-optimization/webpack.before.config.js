const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * 优化前配置 - 未应用任何性能优化
 * 用作性能对比的基准
 */
module.exports = (env = {}) => ({
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist-before'),
    filename: '[name].[contenthash:8].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: '优化前'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css'
    }),
    ...(env.analyze ? [new BundleAnalyzerPlugin()] : [])
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
});

