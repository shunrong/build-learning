const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const webpackConfig = require('./webpack.config.js');

const smp = new SpeedMeasurePlugin({
  outputFormat: 'human',
  outputTarget: './build-measure.txt'
});

module.exports = smp.wrap(webpackConfig);

