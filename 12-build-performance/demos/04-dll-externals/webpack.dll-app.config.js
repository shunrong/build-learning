const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
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
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: path.resolve(__dirname, 'dll/vendor-manifest.json')
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'DLL 预编译',
      inject: 'body',
      scriptLoading: 'blocking',
      // 手动在模板中添加 DLL 脚本引用
      templateParameters: {
        dllScript: '<script src="./dll/vendor.dll.js"></script>'
      }
    }),
    // 复制 DLL 文件到 dist/dll
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'dll/vendor.dll.js'),
          to: path.resolve(__dirname, 'dist/dll')
        }
      ]
    })
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  }
};

