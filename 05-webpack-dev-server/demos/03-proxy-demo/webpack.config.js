const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
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
    new HtmlWebpackPlugin({
      template: './src/index.html',
      title: '代理配置演示'
    })
  ],
  devServer: {
    port: 'auto',
    open: true,
    hot: true,
    
    // ===== 代理配置 =====
    proxy: [
      // 1. 基础代理：API 请求
      {
        context: ['/api'],
        target: 'http://localhost:4000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''  // 移除 /api 前缀
        }
      },
      
      // 2. 多路径代理：GitHub API
      {
        context: ['/github'],
        target: 'https://api.github.com',
        changeOrigin: true,
        pathRewrite: {
          '^/github': ''
        },
        headers: {
          'User-Agent': 'webpack-dev-server'
        }
      },
      
      // 3. WebSocket 代理
      {
        context: ['/socket.io'],
        target: 'http://localhost:4000',
        ws: true,  // 启用 WebSocket 代理
        changeOrigin: true
      },
      
      // 4. 条件代理：根据请求头
      {
        context: ['/conditional'],
        target: 'http://localhost:4000',
        bypass: function(req, res, proxyOptions) {
          // 如果请求来自浏览器，返回 index.html
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('🔀 跳过代理：返回 HTML');
            return '/index.html';
          }
          // 否则代理到后端
        },
        changeOrigin: true
      }
    ],
    
    // 客户端配置
    client: {
      logging: 'info',
      overlay: {
        errors: true,
        warnings: false
      }
    }
  },
  devtool: 'eval-source-map',
  mode: 'development'
};

