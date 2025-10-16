import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.js',
  
  output: [
    {
      file: 'dist/math-utils.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named'
    },
    {
      file: 'dist/math-utils.esm.js',
      format: 'esm',
      sourcemap: true
    },
    {
      file: 'dist/math-utils.umd.js',
      format: 'umd',
      name: 'MathUtils',
      sourcemap: true,
      exports: 'named'
    }
  ],
  
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', {
          targets: {
            browsers: '> 0.25%, not dead'
          }
        }]
      ]
    }),
    terser()
  ]
};

