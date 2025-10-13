const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

/**
 * 高级压缩配置
 * 深度优化压缩选项
 */
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist-advanced'),
    filename: '[name].js',
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
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
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true
      }
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    })
  ],
  optimization: {
    minimize: true,
    minimizer: [
      // JavaScript 高级压缩
      new TerserPlugin({
        parallel: true,  // 并行压缩
        terserOptions: {
          compress: {
            drop_console: true,      // 移除 console
            drop_debugger: true,     // 移除 debugger
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            passes: 2,               // 多次传递优化
            dead_code: true,         // 移除死代码
            unused: true,            // 移除未使用的函数
            booleans: true,          // 优化布尔值
            conditionals: true,      // 优化条件语句
            inline: true             // 内联函数
          },
          mangle: {
            toplevel: true,          // 混淆顶层作用域
            properties: {
              regex: /^_/            // 混淆以 _ 开头的属性
            }
          },
          output: {
            comments: false,         // 移除注释
            beautify: false,         // 不美化
            ascii_only: true         // ASCII 字符
          }
        },
        extractComments: false       // 不提取注释到单独文件
      }),
      // CSS 高级压缩
      new CssMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
              normalizeWhitespace: true,
              colormin: true,
              minifyFontValues: true,
              minifyGradients: true,
              calc: true,
              normalizeUrl: true
            }
          ]
        }
      })
    ]
  }
};

