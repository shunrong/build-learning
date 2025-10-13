const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * 优化后的生产配置
 * 集成所有优化技巧
 */
module.exports = (env = {}) => ({
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist-after'),
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
    clean: true
  },
  
  // ===== 1. 缓存策略 =====
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },
  
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          // ===== 2. 并行构建 =====
          {
            loader: 'thread-loader',
            options: {
              workers: 2
            }
          },
          {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { modules: false }],  // ← 保留 ES Module
                '@babel/preset-react'
              ],
              cacheDirectory: true  // ← Babel 缓存
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        minifyJS: true,
        minifyCSS: true
      }
    }),
    
    // ===== 3. CSS 提取和优化 =====
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[name].[contenthash:8].chunk.css'
    }),
    
    // ===== 4. CSS Tree Shaking =====
    new PurgeCSSPlugin({
      paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
      safelist: ['html', 'body']
    }),
    
    // ===== 5. Gzip 压缩 =====
    new CompressionPlugin({
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8
    }),
    
    // ===== 6. Brotli 压缩 =====
    new CompressionPlugin({
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
      compressionOptions: { level: 6 },
      filename: '[path][base].br'
    }),
    
    ...(env.analyze ? [new BundleAnalyzerPlugin()] : [])
  ],
  
  resolve: {
    extensions: ['.js', '.jsx']
  },
  
  optimization: {
    // ===== 7. 运行时提取 =====
    runtimeChunk: {
      name: 'runtime'
    },
    
    // ===== 8. 代码分割 =====
    splitChunks: {
      chunks: 'all',
      minSize: 20000,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      cacheGroups: {
        // React 生态
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react-vendors',
          priority: 20
        },
        // 工具库
        utils: {
          test: /[\\/]node_modules[\\/](lodash-es|axios)[\\/]/,
          name: 'utils',
          priority: 15
        },
        // 其他第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        },
        // 公共代码
        common: {
          minChunks: 2,
          name: 'common',
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    
    // ===== 9. 高级压缩 =====
    minimize: true,
    minimizer: [
      // JavaScript 高级压缩
      new TerserPlugin({
        parallel: true,  // 并行压缩
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info'],
            passes: 2
          },
          mangle: {
            toplevel: true
          },
          output: {
            comments: false
          }
        },
        extractComments: false
      }),
      // CSS 压缩
      new CssMinimizerPlugin({
        parallel: true
      })
    ],
    
    // ===== 10. Tree Shaking =====
    usedExports: true,
    sideEffects: true,
    
    // ===== 11. Scope Hoisting =====
    concatenateModules: true
  }
});

