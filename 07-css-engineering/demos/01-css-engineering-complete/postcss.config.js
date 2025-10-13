module.exports = ({ env }) => ({
  plugins: [
    require('postcss-nested'),
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'nesting-rules': true
      }
    }),
    require('autoprefixer'),
    env === 'production' && require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true
        }
      }]
    })
  ].filter(Boolean)
});

