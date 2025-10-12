const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// ⭐️ 多入口应用配置示例
module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  
  console.log('==========================================');
  console.log('🔧 多入口应用构建配置：');
  console.log('  - Mode:', argv.mode);
  console.log('  - 页面数量: 3 个（home, about, contact）');
  console.log('==========================================');
  
  return {
    // 1️⃣ 入口：多个入口文件（对象形式）
    entry: {
      home: './src/pages/home/index.js',       // 首页
      about: './src/pages/about/index.js',     // 关于页
      contact: './src/pages/contact/index.js'  // 联系页
    },
    
    // 2️⃣ 输出
    output: {
      path: path.resolve(__dirname, 'dist'),
      // [name] 会被替换为 entry 的 key（home/about/contact）
      filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
      clean: true
    },
    
    // 3️⃣ Source Map
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    
    // 4️⃣ 开发服务器
    devServer: {
      static: './dist',
      hot: true,
      port: 'auto',  // 自动寻找可用端口
      open: '/home.html',  // 默认打开首页
      compress: true
    },
    
    // 5️⃣ 模块规则（处理 CSS）
    module: {
      rules: [
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    
    // 6️⃣ 优化配置
    optimization: {
      // 生产模式：提取公共代码
      splitChunks: isDev ? false : {
        chunks: 'all',
        cacheGroups: {
          // 第三方库
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true
          },
          // 公共代码
          common: {
            minChunks: 2,  // 至少被2个chunk引用
            name: 'common',
            priority: 5,
            reuseExistingChunk: true
          }
        }
      },
      
      // 提取 runtime
      runtimeChunk: isDev ? false : 'single'
    },
    
    // 7️⃣ 插件：为每个页面生成对应的 HTML
    plugins: [
      // 首页
      new HtmlWebpackPlugin({
        template: './src/pages/home/index.html',
        filename: 'home.html',
        chunks: ['home'],  // 只引入 home.js
        title: '首页 - 多页应用示例',
        minify: isDev ? false : {
          removeComments: true,
          collapseWhitespace: true
        }
      }),
      
      // 关于页
      new HtmlWebpackPlugin({
        template: './src/pages/about/index.html',
        filename: 'about.html',
        chunks: ['about'],  // 只引入 about.js
        title: '关于我们 - 多页应用示例',
        minify: isDev ? false : {
          removeComments: true,
          collapseWhitespace: true
        }
      }),
      
      // 联系页
      new HtmlWebpackPlugin({
        template: './src/pages/contact/index.html',
        filename: 'contact.html',
        chunks: ['contact'],  // 只引入 contact.js
        title: '联系我们 - 多页应用示例',
        minify: isDev ? false : {
          removeComments: true,
          collapseWhitespace: true
        }
      })
    ]
  };
};

