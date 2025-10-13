const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    mode: argv.mode,
    
    entry: './src/index.js',
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
      clean: true
    },
    
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
            // Babel 配置在 babel.config.js 中
          }
        }
      ]
    },
    
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: 'Babel 基础配置 Demo'
      })
    ],
    
    devServer: {
      port: 'auto',
      open: true,
      hot: true
    },
    
    // Source Map 配置（在 Demo 3 中详细讲解）
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map'
  };
};

