const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    mode: argv.mode,
    entry: './src/index.js',
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
      chunkFilename: isDev ? '[name].chunk.js' : '[name].[contenthash:8].chunk.js',
      clean: true
    },
    
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: { browsers: ['> 1%', 'last 2 versions'] },
                  modules: false,  // 不转换模块，支持 Tree Shaking
                  useBuiltIns: 'usage',
                  corejs: 3
                }]
              ]
            }
          }
        }
      ]
    },
    
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: '模块化最佳实践 Demo'
      }),
      env.analyze && new BundleAnalyzerPlugin()
    ].filter(Boolean),
    
    optimization: {
      usedExports: true,  // 标记未使用的导出
      sideEffects: true,  // 识别 package.json 中的 sideEffects
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10
          }
        }
      }
    },
    
    devServer: {
      port: 'auto',
      open: true,
      hot: true
    },
    
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map'
  };
};

