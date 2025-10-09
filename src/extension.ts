import { ExtensionContext } from 'vscode';
import { errorPop } from './core/utils';
import { Hacker } from './core/hacker';
import registers from './registers.js';

export const activate = async (context: ExtensionContext) => {
  await Hacker.getInstance().apply().catch(errorPop);

  registers(context);
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const deactivate = () => {};
