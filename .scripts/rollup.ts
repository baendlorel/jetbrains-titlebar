import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { execute } from './execute.js';

type BaseFileInfo = { file: string; size: number };

const dist = join(process.cwd(), 'out');

function printSize(files: string[]) {
  let maxLen = 0;
  let total = 0;

  const info: BaseFileInfo[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const size = statSync(join(dist, file)).size;
      maxLen = Math.max(maxLen, file.length);
      total += size;
      info.push({ file, size });
    } catch (e) {
      console.warn(`${file}: Not found or no permission to read`, e);
    }
  }

  info.sort((a, b) => a.size - b.size);
  info.push({ file: 'Total', size: total });

  const mapper = ({ file, size }: BaseFileInfo) =>
    `${file.padEnd(maxLen, ' ')} - ${(size / 1024).toFixed(3)} KB`;

  console.log(info.map(mapper).join('\n'));
}

async function run() {
  await execute(['rimraf', 'out']);

  const cwd = join(process.cwd(), 'package.json');
  const rawpkg = readFileSync(cwd, 'utf-8');

  const pkg = JSON.parse(rawpkg) as typeof import('../package.json');

  const { name, version, purpose } = pkg;
  console.log(`Building`, `[${purpose}]`, name, version);
  console.log(`NODE_ENV`, process.env.NODE_ENV || '[empty]');

  await execute(['rollup', '-c'], { env: { ...process.env } });

  const files = readdirSync(dist);
  printSize(files);
  console.log(`Built`, `[${purpose}]`, name, version);
}

run();
