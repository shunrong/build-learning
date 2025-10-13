const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintWebpackPlugin = require('eslint-webpack-plugin');
const StylelintWebpackPlugin = require('stylelint-webpack-plugin');

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
          use: 'babel-loader'
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
        title: '代码质量工程化 Demo'
      }),
      
      // ESLint Plugin
      new ESLintWebpackPlugin({
        extensions: ['js'],
        fix: true,  // 自动修复
        emitWarning: isDev,
        emitError: !isDev,
        failOnError: !isDev  // 生产环境失败时阻塞构建
      }),
      
      // Stylelint Plugin
      new StylelintWebpackPlugin({
        files: 'src/**/*.css',
        fix: true,  // 自动修复
        emitWarning: isDev,
        emitError: !isDev
      })
    ],
    
    devServer: {
      port: 'auto',
      open: true,
      hot: true
    },
    
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map'
  };
};

