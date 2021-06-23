// rollup.config.js
import typescript from 'rollup-plugin-typescript2';

function buildConfig(filename) {
  return   {
    input: `src/${filename}.ts`,
    output: {
      file: `dist/${filename}.js`,
      format: 'es'
    },
    external: [ 'lodash', 'combinations' ],
    plugins: [typescript()],
  }
}

export default [
  buildConfig('index'),
  buildConfig('bot'),
  buildConfig('game'),
];
