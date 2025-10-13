const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * 代码分割配置
 * 演示多种分割策略
 */
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist-split'),
    filename: '[name].[contenthash:8].js',
    chunkFilename: '[name].[contenthash:8].chunk.js',
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
      title: '代码分割（多种策略）'
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
  optimization: {
    // 运行时代码单独提取
    runtimeChunk: {
      name: 'runtime'
    },
    
    // 代码分割配置
    splitChunks: {
      chunks: 'all',  // 对所有 chunk 生效
      minSize: 20000,  // 最小 20 KB 才分割
      minChunks: 1,    // 最少被引用 1 次
      maxAsyncRequests: 30,  // 最大异步请求数
      maxInitialRequests: 30,  // 最大初始请求数
      
      cacheGroups: {
        // 1. React 生态单独打包
        react: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
          name: 'react-vendors',
          priority: 20,  // 优先级最高
          reuseExistingChunk: true
        },
        
        // 2. 工具库单独打包
        utils: {
          test: /[\\/]node_modules[\\/](lodash-es|axios)[\\/]/,
          name: 'utils',
          priority: 15,
          reuseExistingChunk: true
        },
        
        // 3. 其他第三方库
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          reuseExistingChunk: true
        },
        
        // 4. 公共业务代码
        common: {
          minChunks: 2,  // 至少被 2 个 chunk 引用
          name: 'common',
          priority: 5,
          reuseExistingChunk: true
        }
      }
    }
  }
};

