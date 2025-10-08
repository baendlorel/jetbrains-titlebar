import { spawn } from 'node:child_process';

export function execute(args: string[], opts = {}) {
  return new Promise((resolve, reject) => {
    spawn(args[0], args.slice(1), {
      ...opts,
      stdio: 'inherit',
      shell: true,
    }).on('close', (code) => {
      console.log(`\n${args.join(' ')} completed\n`);
      if (code === 0) {
        resolve(null);
      } else {
        reject(new Error(`${args.join(' ')} failed with code ${code}`));
      }
    });
  });
}
