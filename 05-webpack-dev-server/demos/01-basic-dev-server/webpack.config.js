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
      title: 'Webpack Dev Server 基础配置'
    })
  ],
  devServer: {
    // 1. 基础配置
    port: 'auto',              // 自动寻找可用端口
    open: true,                // 自动打开浏览器
    hot: true,                 // 启用 HMR
    
    // 2. 静态文件服务
    static: {
      directory: path.join(__dirname, 'public'),
      publicPath: '/static',   // 静态文件访问路径
      watch: true              // 监听静态文件变化
    },
    
    // 3. 开发体验优化
    compress: true,            // 启用 gzip 压缩
    historyApiFallback: true,  // SPA 路由支持
    
    // 4. 客户端配置
    client: {
      logging: 'info',         // 日志级别：none, error, warn, info, log, verbose
      overlay: {
        errors: true,          // 错误覆盖层
        warnings: false        // 警告不显示覆盖层
      },
      progress: true           // 显示编译进度
    },
    
    // 5. 开发服务器配置
    devMiddleware: {
      writeToDisk: false,      // 不写入磁盘
      stats: 'minimal'         // 输出统计信息
    },
    
    // 6. 自定义头部
    headers: {
      'X-Custom-Header': 'webpack-dev-server'
    }
  },
  devtool: 'eval-source-map',
  mode: 'development'
};

