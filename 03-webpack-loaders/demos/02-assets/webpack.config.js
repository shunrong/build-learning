const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    clean: true,
    // 静态资源的公共路径
    assetModuleFilename: 'assets/[hash][ext][query]'
  },
  
  module: {
    rules: [
      // CSS
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      
      // 1. asset/resource: 输出文件（适合大图片）
      {
        test: /\.(png|jpe?g|gif)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'images/[name].[hash:8][ext]'
        }
      },
      
      // 2. asset/inline: 转 base64（适合小图标）
      // 注意：SVG 图标使用 asset/source 可以直接内联源代码
      {
        test: /\.svg$/i,
        type: 'asset/source'  // 导出 SVG 源代码
      },
      
      // 3. asset: 自动选择（根据文件大小）
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024  // 8KB 以下转 base64
          }
        },
        generator: {
          filename: 'fonts/[name].[hash:8][ext]'
        }
      },
      
      // 4. asset/source: 导出源码（适合文本文件）
      {
        test: /\.txt$/i,
        type: 'asset/source'
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: '静态资源处理'
    })
  ],
  
  devServer: {
    port: 'auto',  // 自动寻找可用端口
    hot: true,
    open: true
  },
  
  devtool: 'eval-source-map'
};

