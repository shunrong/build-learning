const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin');
const glob = require('glob');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';
  
  return {
    mode: argv.mode,
    entry: './src/index.js',
    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isDev ? '[name].js' : '[name].[contenthash:8].js',
      clean: true
    },
    
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        
        // CSS Modules
        {
          test: /\.module\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: isDev
                    ? '[name]__[local]--[hash:base64:5]'
                    : '[hash:base64:8]',
                  exportLocalsConvention: 'camelCase'
                },
                sourceMap: true
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                sourceMap: true
              }
            }
          ]
        },
        
        // 普通 CSS
        {
          test: /\.css$/,
          exclude: /\.module\.css$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader'
          ]
        },
        
        // Sass/SCSS
        {
          test: /\.scss$/,
          use: [
            isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
      ]
    },
    
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: 'CSS 工程化完整示例'
      }),
      
      !isDev && new MiniCssExtractPlugin({
        filename: 'css/[name].[contenthash:8].css'
      }),
      
      // ⭐️ 注意：暂时禁用 PurgeCSS
      // 原因：
      // 1. CSS Modules 生成的哈希类名（如 a1b2c3d4）在运行时动态生成
      // 2. PurgeCSS 无法识别这些类名，会错误地删除 CSS Modules 的样式
      // 3. CSS Modules 本身就是按需加载的，不需要 PurgeCSS
      // 4. PurgeCSS 主要用于 Tailwind CSS 等全局样式库
      //
      // 如果项目中使用了 Tailwind CSS 等全局样式，可以这样配置：
      // new PurgeCSSPlugin({
      //   paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true }),
      //   // 只处理全局样式，排除 CSS Modules
      //   safelist: {
      //     standard: ['active', 'show'],
      //     // 保留所有 CSS Modules 生成的类名
      //     greedy: [/^[a-z0-9]{8}$/]  // 8位哈希
      //   }
      // })
      
      // 暂时禁用 PurgeCSS
      // !isDev && new PurgeCSSPlugin({ ... })
    ].filter(Boolean),
    
    optimization: {
      minimizer: [
        `...`,
        new CssMinimizerPlugin()
      ]
    },
    
    devServer: {
      port: 'auto',
      open: true,
      hot: true
    },
    
    devtool: isDev ? 'eval-cheap-module-source-map' : 'source-map'
  };
};

