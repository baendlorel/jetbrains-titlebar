// @ts-check
import { readFileSync } from 'node:fs';
import path from 'node:path';

// plugins
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import alias from '@rollup/plugin-alias';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import funcMacro from 'rollup-plugin-func-macro';
import constEnum from 'rollup-plugin-const-enum';
import conditional from 'rollup-plugin-conditional-compilation';

// custom plugins
import { replaceLiteralOpts, replaceOpts } from './.scripts/replace.mjs';

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
        sourcemap: true,
        name: 'JetBrains Titlebar',
        globals: {
          vscode: 'vscode',
        },
      },
    ],

    plugins: [
      alias(aliasOpts),
      replace({
        preventAssignment: false,
        delimiters: ['', ''],
        values: replaceLiteralOpts,
      }),
      replace(replaceOpts),
      funcMacro(),
      constEnum(),
      resolve(),
      commonjs(),
      typescript({ tsconfig, removeComments: false }),
      terser({
        format: {
          comments: false, // remove comments
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
