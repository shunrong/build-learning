const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

/**
 * 优化后配置 - 综合应用所有性能优化技巧
 * 
 * 优化清单：
 * 1. ✅ 持久化缓存 (filesystem cache)
 * 2. ✅ 并行构建 (thread-loader)
 * 3. ✅ 并行压缩 (TerserPlugin parallel)
 * 4. ✅ 缩小 resolve 范围
 * 5. ✅ noParse 跳过预编译库
 * 6. ✅ Code Splitting (splitChunks)
 * 7. ✅ Tree Shaking (usedExports + sideEffects)
 * 8. ✅ CSS 压缩优化
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

  // 🚀 优化 1: 持久化缓存
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename]
    }
  },

  module: {
    // 🚀 优化 2: noParse 跳过预编译库
    noParse: /lodash|moment/,

    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          // 🚀 优化 3: thread-loader 并行构建
          {
            loader: 'thread-loader',
            options: {
              workers: 2,
              poolTimeout: Infinity
            }
          },
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
              // Babel 自身的缓存
              cacheDirectory: true,
              cacheCompression: false
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: false
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: '优化后',
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
      filename: '[name].[contenthash:8].css',
      chunkFilename: '[id].[contenthash:8].css'
    }),
    ...(env.analyze ? [new BundleAnalyzerPlugin()] : [])
  ],

  optimization: {
    // 🚀 优化 4: Tree Shaking
    usedExports: true,
    sideEffects: true,

    // 🚀 优化 5: Code Splitting
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        // 第三方库单独打包
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true
        },
        // React 相关单独打包
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react',
          priority: 20,
          reuseExistingChunk: true
        },
        // 公共代码
        common: {
          minChunks: 2,
          priority: 5,
          reuseExistingChunk: true,
          name: 'common'
        }
      }
    },

    // 🚀 优化 6: 运行时代码单独打包
    runtimeChunk: {
      name: 'runtime'
    },

    // 🚀 优化 7: 并行压缩
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log']
          },
          output: {
            comments: false
          }
        },
        extractComments: false
      }),
      new CssMinimizerPlugin({
        parallel: true
      })
    ]
  },

  // 🚀 优化 8: 缩小 resolve 范围
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },

  // 性能提示
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  }
});

