import typescript from 'rollup-typescript'
import tsConfigPaths from 'rollup-plugin-ts-paths'

export default {
  input: './package/e2e-cli/index.ts',
  banner: '#!/usr/local/bin/node',
  output: {
    name: 'e2e-cli',
    file: './build/lib/e2e-cli.js',
    format: 'cjs'
  },
  watch: {
    chokidar: true,
    include: 'package/e2e-cli/**',

    // include and exclude govern which files to watch. by
    // default, all dependencies will be watched
    exclude: ['node_modules/**']
  },
  plugins: [
    typescript(),
    tsConfigPaths()
  ]
}
