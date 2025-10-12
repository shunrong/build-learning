const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const pkg = require('./package.json');

module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  const shouldAnalyze = env.analyze === 'true';
  
  console.log('\n' + '='.repeat(60));
  console.log('🔧 构建模式:', argv.mode);
  console.log('📊 分析模式:', shouldAnalyze ? '开启' : '关闭');
  console.log('='.repeat(60) + '\n');
  
  return {
    entry: './src/index.js',
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDev ? '[name].js' : 'js/[name].[contenthash:8].js',
      clean: true
    },
    
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            // 🔌 Plugin 1: MiniCssExtractPlugin
            // 开发：style-loader（注入）
            // 生产：MiniCssExtractPlugin（提取）
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader'
          ]
        }
      ]
    },
    
    plugins: [
      // 🔌 Plugin 1: HtmlWebpackPlugin
      // 自动生成 HTML 并注入资源
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: '常用 Plugin 演示',
        meta: {
          viewport: 'width=device-width, initial-scale=1',
          description: '学习 Webpack 常用 Plugin 的使用'
        },
        minify: !isDev ? {
          removeComments: true,
          collapseWhitespace: true
        } : false
      }),
      
      // 🔌 Plugin 2: MiniCssExtractPlugin
      // 提取 CSS 到独立文件（仅生产环境）
      !isDev && new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css',
        chunkFilename: 'css/[id].[contenthash:8].css'
      }),
      
      // 🔌 Plugin 3: DefinePlugin
      // 定义全局常量
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(argv.mode),
        '__VERSION__': JSON.stringify(pkg.version),
        '__BUILD_TIME__': JSON.stringify(new Date().toISOString())
      }),
      
      // 🔌 Plugin 4: CopyWebpackPlugin
      // 复制静态资源
      new CopyWebpackPlugin({
        patterns: [
          {
            from: 'public',
            to: 'public',
            noErrorOnMissing: true  // 如果目录不存在也不报错
          }
        ]
      }),
      
      // 🔌 Plugin 5: BundleAnalyzerPlugin
      // 分析打包产物（按需启用）
      shouldAnalyze && new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        reportFilename: 'bundle-report.html',
        openAnalyzer: true
      })
    ].filter(Boolean),
    
    devServer: {
      port: 'auto',
      hot: true,
      open: true,
      compress: true
    },
    
    devtool: isDev ? 'eval-source-map' : 'source-map'
  };
};

