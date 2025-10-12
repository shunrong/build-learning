const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

// ⭐️ 使用函数式配置，根据环境动态调整
module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  const isAnalyze = env.analyze;
  
  console.log('==========================================');
  console.log('🔧 构建配置信息：');
  console.log('  - Mode:', argv.mode);
  console.log('  - 开发模式:', isDev);
  console.log('  - 分析模式:', isAnalyze);
  console.log('==========================================');
  
  return {
    // 1️⃣ 入口：单个入口文件
    entry: './src/index.js',
    
    // 2️⃣ 输出
    output: {
      path: path.resolve(__dirname, 'dist'),
      // 开发模式：简单文件名
      // 生产模式：带 hash 的文件名（利于缓存）
      filename: isDev ? 'bundle.js' : 'bundle.[contenthash:8].js',
      clean: true  // 清空输出目录
    },
    
    // 3️⃣ Source Map
    // 开发模式：快速构建，详细的源码映射
    // 生产模式：完整的 Source Map（可选）
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map',
    
    // 4️⃣ 开发服务器（仅开发模式有效）
    devServer: {
      static: './dist',
      hot: true,           // 热模块替换
      port: 'auto',        // 自动寻找可用端口
      open: true,          // 自动打开浏览器
      compress: true,      // gzip 压缩
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
      // 生产模式自动开启代码压缩
      minimize: !isDev,
      
      // 模块 ID 生成策略
      moduleIds: isDev ? 'named' : 'deterministic',
      
      // 提取 runtime 代码（生产模式）
      runtimeChunk: isDev ? false : 'single',
      
      // 代码分割（生产模式）
      splitChunks: isDev ? false : {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10
          }
        }
      }
    },
    
    // 7️⃣ 插件
    plugins: [
      // 自动生成 HTML
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: 'Demo 1: 单入口应用',
        // 生产模式压缩 HTML
        minify: isDev ? false : {
          removeComments: true,
          collapseWhitespace: true
        }
      }),
      
      // 打包分析（可选）
      isAnalyze && new BundleAnalyzerPlugin({
        analyzerMode: 'static',
        openAnalyzer: true
      })
    ].filter(Boolean),  // 过滤掉 false 值
    
    // 8️⃣ 性能提示
    performance: {
      hints: isDev ? false : 'warning',
      maxAssetSize: 250000,      // 单个文件最大 250KB
      maxEntrypointSize: 250000  // 入口文件最大 250KB
    }
  };
};

