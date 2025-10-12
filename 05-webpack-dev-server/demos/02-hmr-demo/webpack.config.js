const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = (env, argv) => {
  const isDev = argv.mode === 'development';

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
      clean: true
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                ['@babel/preset-react', { runtime: 'automatic' }]
              ],
              plugins: [
                isDev && require.resolve('react-refresh/babel')
              ].filter(Boolean)
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/index.html',
        title: 'HMR 深入演示'
      }),
      isDev && new ReactRefreshWebpackPlugin()
    ].filter(Boolean),
    devServer: {
      port: 'auto',
      open: true,
      hot: true,
      
      client: {
        logging: 'info',
        overlay: {
          errors: true,
          warnings: false
        }
      }
    },
    devtool: 'eval-source-map',
    resolve: {
      extensions: ['.js', '.jsx']
    }
  };
};

