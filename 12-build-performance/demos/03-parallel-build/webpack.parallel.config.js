const path = require('path');
const os = require('os');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const threadLoader = require('thread-loader');

// ⭐️ 预热 Worker Pool
threadLoader.warmup(
  {
    workers: os.cpus().length - 1,
    poolTimeout: 2000,
  },
  ['babel-loader']
);

module.exports = {
  mode: 'production',
  
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash:8].js',
    clean: true
  },
  
  // ⭐️ 启用缓存（公平对比）
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
        use: [
          // ⭐️ thread-loader（并行处理）
          {
            loader: 'thread-loader',
            options: {
              workers: os.cpus().length - 1,
              workerParallelJobs: 50,
              poolTimeout: 2000,
            }
          },
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ],
              cacheDirectory: true
            }
          }
        ],
        exclude: /node_modules/
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
      title: '并行构建'
    })
  ],
  
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,  // ⭐️ 并行压缩
        terserOptions: {
          compress: {
            drop_console: true
          }
        }
      })
    ]
  },
  
  resolve: {
    extensions: ['.js', '.jsx']
  }
};

