import { existsSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

import { build, context, type BuildOptions, type Plugin } from 'esbuild';

const args = new Set(process.argv.slice(2));
const isDev = args.has('--dev');
const isWatch = args.has('--watch');
const projectRoot = path.join(__dirname, '..');
const srcDir = path.join(projectRoot, 'src');
const outDir = path.join(projectRoot, 'out');

function preprocessConditionals(source: string, debug: boolean): string {
  const lines = source.split(/\r?\n/);
  const output: string[] = [];
  const stack: Array<{ parentEnabled: boolean; condition: boolean; inElse: boolean }> = [];

  for (const line of lines) {
    const ifMatch = line.match(/^\s*\/\/\s+#if\s+DEBUG\s*$/);
    if (ifMatch) {
      const parentEnabled = stack.every(
        (entry) => entry.parentEnabled && (entry.inElse ? !entry.condition : entry.condition),
      );
      stack.push({ parentEnabled, condition: debug, inElse: false });
      continue;
    }

    const elseMatch = line.match(/^\s*\/\/\s+#else\s*$/);
    if (elseMatch) {
      const current = stack.at(-1);
      if (!current) {
        throw new Error('Found #else without matching #if DEBUG');
      }
      current.inElse = true;
      continue;
    }

    const endifMatch = line.match(/^\s*\/\/\s+#endif\s*$/);
    if (endifMatch) {
      if (!stack.pop()) {
        throw new Error('Found #endif without matching #if DEBUG');
      }
      continue;
    }

    const isEnabled = stack.every(
      (entry) => entry.parentEnabled && (entry.inElse ? !entry.condition : entry.condition),
    );
    if (isEnabled) {
      output.push(line);
    }
  }

  if (stack.length > 0) {
    throw new Error('Unclosed #if DEBUG block');
  }

  return output.join('\n');
}

function resolveSourceFile(targetPath: string): string | null {
  const candidates = new Set<string>([targetPath]);

  if (targetPath.endsWith('.js')) {
    candidates.add(targetPath.slice(0, -3) + '.ts');
    candidates.add(targetPath.slice(0, -3) + '.tsx');
  }

  if (!path.extname(targetPath)) {
    candidates.add(targetPath + '.ts');
    candidates.add(targetPath + '.tsx');
    candidates.add(path.join(targetPath, 'index.ts'));
    candidates.add(path.join(targetPath, 'index.tsx'));
  }

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return null;
}

function internalResolverPlugin(): Plugin {
  return {
    name: 'internal-resolver',
    setup(pluginBuild) {
      pluginBuild.onResolve({ filter: /^@\// }, (args) => {
        const resolved = resolveSourceFile(path.join(srcDir, args.path.slice(2)));
        if (!resolved) {
          return null;
        }

        return { path: resolved };
      });

      pluginBuild.onResolve({ filter: /^(\.\.?\/|\/)/ }, (args) => {
        const resolved = resolveSourceFile(path.resolve(args.resolveDir, args.path));
        if (!resolved) {
          return null;
        }

        return { path: resolved };
      });
    },
  };
}

function conditionalCompilationPlugin(debug: boolean): Plugin {
  return {
    name: 'conditional-compilation',
    setup(pluginBuild) {
      pluginBuild.onLoad({ filter: /\.tsx?$/ }, (args) => {
        const source = readFileSync(args.path, 'utf8');
        const contents = preprocessConditionals(source, debug);
        return {
          contents,
          loader: args.path.endsWith('.tsx') ? 'tsx' : 'ts',
        };
      });
    },
  };
}

function createBuildOptions(): BuildOptions {
  return {
    absWorkingDir: projectRoot,
    bundle: true,
    entryPoints: [path.join(srcDir, 'extension.ts')],
    external: ['vscode'],
    format: 'cjs',
    legalComments: 'none',
    minify: !isDev,
    outfile: path.join(outDir, 'extension.js'),
    platform: 'node',
    plugins: [internalResolverPlugin(), conditionalCompilationPlugin(isDev)],
    sourcemap: false,
    target: 'node16',
    treeShaking: true,
  };
}

async function runBuild() {
  const outDir = path.join(__dirname, '..', 'out');
  rmSync(outDir, { recursive: true, force: true });

  if (isWatch) {
    const ctx = await context(createBuildOptions());
    await ctx.watch();
    console.log('Watching esbuild bundle...');

    const dispose = async () => {
      await ctx.dispose();
      process.exit(0);
    };

    process.once('SIGINT', () => {
      void dispose();
    });
    process.once('SIGTERM', () => {
      void dispose();
    });
    return;
  }

  await build(createBuildOptions());
}

void runBuild().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
