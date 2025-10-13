const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/index-entry.js',  // 不同的入口
  output: {
    path: path.resolve(__dirname, 'dist/entry'),
    filename: 'bundle.js',
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
                targets: { browsers: ['ie 11'] },
                useBuiltIns: 'entry',  // 全量引入
                corejs: 3,
                modules: false
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
      title: 'useBuiltIns: entry'
    })
  ]
};

