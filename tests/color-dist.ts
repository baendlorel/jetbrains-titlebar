import { hashString } from '../src/core/utils';
import { GLOW_COLORS } from '../src/lib/colors';
// Default number of samples to generate
const DEFAULT_COUNT = 5000;

// Read count from CLI args
const argvCount = Number(process.argv[2] ?? 0);
const COUNT = Number.isInteger(argvCount) && argvCount > 0 ? argvCount : DEFAULT_COUNT;

// Characters used to build random strings
const CHARS = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

function randomString(len: number) {
  let s = '';
  for (let i = 0; i < len; i++) {
    s += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return s;
}

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const bigint = parseInt(
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h,
    16
  );
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
}

function bgColorAnsi(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return `\u001b[48;2;${r};${g};${b}m`;
}

function fgColorAnsi(hex: string) {
  const [r, g, b] = hexToRgb(hex);
  return `\u001b[38;2;${r};${g};${b}m`;
}

function resetAnsi() {
  return '\u001b[0m';
}

async function main() {
  const counts = new Array<number>(GLOW_COLORS.length).fill(0);

  for (let i = 0; i < COUNT; i++) {
    // generate strings with varying lengths
    const len = 4 + Math.floor(Math.random() * 16);
    const s = randomString(len);
    const idx = hashString(s);
    counts[idx]++;
  }

  const total = counts.reduce((a, b) => a + b, 0);

  console.log(`Samples: ${total}, Colors: ${GLOW_COLORS.length}`);
  console.log('── Distribution ─────────────────────────────────────────────────────');

  // Determine longest label for alignment
  const maxCount = Math.max(...counts);
  const barMaxWidth = 40;

  for (let i = 0; i < GLOW_COLORS.length; i++) {
    const color = GLOW_COLORS[i];
    const cnt = counts[i];
    const pct = (cnt / total) * 100;

    // create a colored block and a bar proportional to frequency
    const block = `${bgColorAnsi(color)}  ${resetAnsi()}`;
    const barLen = Math.round((cnt / maxCount) * barMaxWidth);
    const bar = `${bgColorAnsi(color)}${' '.repeat(barLen)}${resetAnsi()}`;

    // print index, hex, block, count and percentage
    const idxLabel = String(i).padStart(3, ' ');
    const countLabel = String(cnt).padStart(String(maxCount).length, ' ');
    console.log(`${idxLabel} ${color} ${block} ${countLabel} (${pct.toFixed(2)}%) ${bar}`);
  }

  console.log('───────────────────────────────────────────────────────────────────');
}

main().catch((e) => {
  console.error('Error running color distribution test:', e);
  process.exit(1);
});
