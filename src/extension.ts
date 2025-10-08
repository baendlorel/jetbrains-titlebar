import { ExtensionContext, workspace } from 'vscode';
import { Marker } from '@/core/marker.js';
import registers from '@/registers.js';
import hacker from '@/core/hacker';

export const activate = async (context: ExtensionContext) => {
  await hacker.apply();
  const marker = new Marker();

  registers(context);

  context.subscriptions.push(
    marker.item,
    workspace.onDidChangeWorkspaceFolders(() => marker.update())
  );
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const deactivate = () => {};
