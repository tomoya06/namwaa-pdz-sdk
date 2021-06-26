// rollup.config.js
import typescript from 'rollup-plugin-typescript2';
import commonjs from '@rollup/plugin-commonjs';

function buildConfig(filename) {
  return {
    input: `src/${filename}.ts`,
    output: {
      file: `dist/${filename}.js`,
      format: 'es'
    },
    external: ['lodash', 'combinations'],
    plugins: [
      commonjs(),
      typescript({
        tsconfigOverride: { compilerOptions: { module: "es2015" } }
      })
    ],
  }
}

export default [
  buildConfig('index'),
  buildConfig('bot'),
  buildConfig('game'),
];
