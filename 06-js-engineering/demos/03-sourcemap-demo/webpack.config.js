const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env = {}, argv) => {
  const isDev = argv.mode === 'development';
  const devtool = env.devtool || (isDev ? 'eval-cheap-module-source-map' : 'source-map');
  
  return {
    mode: argv.mode,
    entry: './src/index.js',
    
    output: {
      path: path.resolve(__dirname, `dist/${devtool || 'none'}`),
      filename: 'bundle.js',
      clean: true
    },
    
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', {
                  targets: { browsers: ['> 1%', 'last 2 versions'] },
                  modules: false
                }]
              ]
            }
          }
        }
      ]
    },
    
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: `Source Map Demo - devtool: ${devtool || '(none)'}`
      })
    ],
    
    devServer: {
      port: 'auto',
      open: true,
      hot: true
    },
    
    devtool: devtool === 'false' ? false : devtool
  };
};

