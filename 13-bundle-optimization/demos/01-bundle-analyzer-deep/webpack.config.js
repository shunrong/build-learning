const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env = {}) => ({
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
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
      title: 'Bundle 分析 Demo'
    }),
    // Bundle Analyzer Plugin
    ...(env.analyze ? [
      new BundleAnalyzerPlugin({
        analyzerMode: 'static',           // 生成静态 HTML 文件
        reportFilename: 'bundle-report.html',
        openAnalyzer: true,               // 自动打开报告
        generateStatsFile: true,          // 生成 stats.json
        statsFilename: 'stats.json',
        statsOptions: {
          source: false,                  // 不包含源码（减小文件）
          modules: true,                  // 包含模块信息
          chunks: true,                   // 包含 chunk 信息
          chunkModules: true,             // 包含 chunk 的模块信息
          chunkOrigins: true,             // 包含 chunk 来源
          reasons: true,                  // 包含依赖原因
          depth: true,                    // 包含深度信息
          usedExports: true,              // 包含使用的导出
          providedExports: true,          // 包含提供的导出
          optimizationBailout: true,      // 包含优化失败原因
          errorDetails: true              // 包含错误详情
        },
        defaultSizes: 'parsed',           // 默认显示解析后的大小
        logLevel: 'info'
      })
    ] : [])
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  // 性能提示
  performance: {
    hints: 'warning',
    maxEntrypointSize: 500000,  // 500 KB
    maxAssetSize: 250000        // 250 KB
  }
});

