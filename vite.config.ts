import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import replace from '@rollup/plugin-replace';

const rootDir = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(rootDir, 'src');

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    build: {
      emptyOutDir: true,
      lib: {
        entry: path.resolve(srcDir, 'extension.ts'),
        fileName: () => 'extension.js',
        formats: ['cjs'],
      },
      minify: isDev ? false : 'esbuild',
      outDir: 'out',
      rollupOptions: {
        external: ['vscode', /^node:/],
        output: {
          exports: 'named',
          inlineDynamicImports: true,
        },
        plugins: [
          replace({
            preventAssignment: true,
            __IS_DEV__: JSON.stringify(isDev),
          }),
        ],
      },
      sourcemap: false,
      target: 'node16',
    },
    resolve: {
      alias: {
        '@/': `${srcDir}/`,
      },
    },
  };
});
