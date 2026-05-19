// @ts-check
import path from 'node:path';

// plugins
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import terser from '@rollup/plugin-terser';
import conditional from 'rollup-plugin-conditional-compilation';

// # common options

/**
 * build config
 */
const tsconfig = './tsconfig.build.json';

/**
 * @type {import('@rollup/plugin-alias').RollupAliasOptions}
 */
const aliasOpts = {
  entries: [{ find: /^@\//, replacement: path.resolve(import.meta.dirname, 'src') + '/' }],
};

// # main options

const DEBUG = process.env.NODE_ENV === 'dev';

/**
 * @type {import('rollup').RollupOptions[]}
 */
const options = [
  {
    input: 'src/extension.ts',
    output: [
      {
        file: 'out/extension.js',
        format: 'cjs',
        sourcemap: false,
        name: 'JetBrains Titlebar',
        globals: {
          vscode: 'vscode',
        },
      },
    ],

    plugins: [
      alias(aliasOpts),
      resolve(),
      commonjs(),
      typescript({ tsconfig, removeComments: false }),
      conditional({ variables: { DEBUG } }),
      DEBUG
        ? null
        : terser({
            format: {
              comments: false,
            },
            compress: {
              reduce_vars: true,
              drop_console: true,
              dead_code: true, // ✅ Safe: remove dead code
              evaluate: true, // ✅ Safe: evaluate constant expressions
            },
            mangle: {
              properties: {
                regex: /^_/, // only mangle properties starting with '_'
              },
            },
          }),
    ].filter(Boolean),
    external: [],
  },
];

export default options;
