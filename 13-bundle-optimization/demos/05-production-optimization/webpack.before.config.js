const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * 优化前的生产配置
 * 只有基础的配置，没有应用优化技巧
 */
module.exports = (env = {}) => ({
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist-before'),
    filename: '[name].js',
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
            presets: [
              ['@babel/preset-env', { modules: false }],
              '@babel/preset-react'
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html'
    }),
    new MiniCssExtractPlugin(),
    ...(env.analyze ? [new BundleAnalyzerPlugin()] : [])
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  // 未优化的配置
  optimization: {
    splitChunks: false,      // 不分割代码
    runtimeChunk: false,     // 不提取运行时
    minimize: true           // 基础压缩
  }
});

