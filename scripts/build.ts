import { execSync } from 'node:child_process';
import { rmSync } from 'node:fs';
import path from 'node:path';

const isDev = process.env.NODE_ENV === 'dev';

// "test-build": "rimraf out && export NODE_ENV=dev && tsx ./.scripts/rollup.ts",
// "build": "rimraf out &&  tsx ./.scripts/rollup.ts",

function build() {
  const outDir = path.join(import.meta.dirname, '..', 'out');
  rmSync(outDir, { recursive: true, force: true });
  execSync('rollup -c', { stdio: 'inherit', env: process.env });
}

build();
