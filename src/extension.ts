import vscode from 'vscode';
import { injectTitlebarMarker, updateTitlebarMarker } from '@/core/marker.js';
import registers from '@/registers.js';

export const activate = async (context: vscode.ExtensionContext) => {
  // Inject the titlebar marker on activation
  injectTitlebarMarker();

  // Update marker when workspace folders change
  context.subscriptions.push(
    vscode.workspace.onDidChangeWorkspaceFolders(() => {
      updateTitlebarMarker();
    })
  );

  // Register commands
  registers(context);
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const deactivate = () => {};
