const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  // 多入口配置
  entry: {
    index: './src/pages/index/index.js',
    about: './src/pages/about/index.js',
    contact: './src/pages/contact/index.js',
    dashboard: './src/pages/dashboard/index.js'
  },
  
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
    clean: true
  },
  
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  
  plugins: [
    // 首页
    new HtmlWebpackPlugin({
      template: './src/pages/index/index.html',
      filename: 'index.html',
      chunks: ['index'],  // 只引入 index 的 JS
      title: '首页 - 多页面应用演示'
    }),
    
    // 关于页
    new HtmlWebpackPlugin({
      template: './src/pages/about/index.html',
      filename: 'about.html',
      chunks: ['about'],
      title: '关于我们'
    }),
    
    // 联系页
    new HtmlWebpackPlugin({
      template: './src/pages/contact/index.html',
      filename: 'contact.html',
      chunks: ['contact'],
      title: '联系我们'
    }),
    
    // 仪表盘页
    new HtmlWebpackPlugin({
      template: './src/pages/dashboard/index.html',
      filename: 'dashboard.html',
      chunks: ['dashboard'],
      title: '仪表盘'
    })
  ],
  
  devServer: {
    port: 'auto',
    open: true,
    hot: true,
    
    // ===== 多页面应用配置 =====
    
    // 1. 历史路由支持（SPA 风格的 URL）
    historyApiFallback: {
      rewrites: [
        { from: /^\/about/, to: '/about.html' },
        { from: /^\/contact/, to: '/contact.html' },
        { from: /^\/dashboard/, to: '/dashboard.html' }
      ]
    },
    
    // 2. 静态文件服务
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/static'
    },
    
    // 3. 客户端配置
    client: {
      logging: 'info',
      overlay: {
        errors: true,
        warnings: false
      }
    },
    
    // 4. 自定义页面列表（开发辅助）
    onListening: function (devServer) {
      if (!devServer) {
        throw new Error('webpack-dev-server is not defined');
      }

      const port = devServer.server.address().port;
      const protocol = devServer.options.https ? 'https' : 'http';
      const host = devServer.options.host || 'localhost';
      
      console.log('\n📄 可访问的页面：');
      console.log(`  ${protocol}://${host}:${port}/          - 首页`);
      console.log(`  ${protocol}://${host}:${port}/about.html    - 关于我们`);
      console.log(`  ${protocol}://${host}:${port}/contact.html  - 联系我们`);
      console.log(`  ${protocol}://${host}:${port}/dashboard.html - 仪表盘`);
      console.log('');
    }
  },
  
  devtool: 'eval-source-map',
  mode: 'development'
};

