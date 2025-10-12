const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  
  console.log('==========================================');
  console.log('🔧 构建模式:', argv.mode);
  console.log('  - isDev:', isDev);
  console.log('  - CSS 处理:', isDev ? 'style-loader (注入)' : 'MiniCssExtractPlugin (提取)');
  console.log('==========================================');
  
  return {
  entry: './src/index.js',
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    clean: true
  },
  
  module: {
    rules: [
      // 1. Sass/SCSS 处理链
      {
        test: /\.scss$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2  // postcss-loader + sass-loader
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              api: 'modern'  // 使用现代 API，避免废弃警告
            }
          }
        ]
      },
      
      // 2. Less 处理链
      {
        test: /\.less$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 2  // postcss-loader + less-loader
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'less-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      
      // 3. 普通 CSS
      {
        test: /\.css$/,
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true,
              importLoaders: 1  // postcss-loader
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      }
    ]
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: 'CSS 预处理器'
    }),
    
    !isDev && new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    })
  ].filter(Boolean),
  
  devServer: {
    port: 'auto',  // 自动寻找可用端口
    hot: true,
    open: true
  },
  
  devtool: isDev ? 'eval-source-map' : 'source-map'
  };
};

