const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// ⭐️ 动态发现入口文件
function getEntries() {
  const entries = {};
  
  // 自动发现 src/pages 下所有的 index.js 文件
  const files = glob.sync('./src/pages/*/index.js');
  
  files.forEach(file => {
    // 提取页面名称
    // src/pages/home/index.js -> home
    const match = file.match(/\/pages\/(.+)\/index\.js$/);
    if (match) {
      const pageName = match[1];
      // 确保路径以 ./ 开头（Webpack 要求相对路径格式）
      entries[pageName] = file.startsWith('./') ? file : `./${file}`;
    }
  });
  
  return entries;
}

// ⭐️ 动态生成 HtmlWebpackPlugin 实例
function getHtmlPlugins() {
  const plugins = [];
  
  // 自动发现所有 HTML 模板
  const htmlFiles = glob.sync('./src/pages/*/index.html');
  
  htmlFiles.forEach(file => {
    // 提取页面名称
    const match = file.match(/\/pages\/(.+)\/index\.html$/);
    if (match) {
      const pageName = match[1];
      
      plugins.push(
        new HtmlWebpackPlugin({
          template: file,
          filename: `${pageName}.html`,
          chunks: [pageName],
          title: `${pageName} - 动态入口示例`
        })
      );
    }
  });
  
  return plugins;
}

module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  
  // 动态获取入口
  const entries = getEntries();
  const pageNames = Object.keys(entries);
  
  console.log('==========================================');
  console.log('🔧 动态入口配置：');
  console.log(`  - 发现 ${pageNames.length} 个页面:`, pageNames);
  console.log('  - 入口配置:', entries);
  console.log('==========================================');
  
  return {
    // 1️⃣ 动态入口
    entry: entries,
    
    // 2️⃣ 输出
    output: {
      path: path.resolve(__dirname, 'dist'),
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
      open: pageNames.length > 0 ? `/${pageNames[0]}.html` : true,  // 打开第一个页面
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
    
    // 6️⃣ 优化
    optimization: {
      splitChunks: isDev ? false : {
        chunks: 'all',
        cacheGroups: {
          common: {
            minChunks: 2,
            name: 'common',
            priority: 5
          }
        }
      },
      runtimeChunk: isDev ? false : 'single'
    },
    
    // 7️⃣ 动态生成 HTML 插件
    plugins: getHtmlPlugins()
  };
};

