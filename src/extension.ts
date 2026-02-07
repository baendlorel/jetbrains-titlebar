import { ExtensionContext } from 'vscode';
import { hacker } from './core/hacker.js';
import { errorPop } from './lib/native.js';
import registers from './registers.js';

export const activate = async (context: ExtensionContext) => {
  await hacker.apply().catch(errorPop);

  registers(context);
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const deactivate = () => {};
