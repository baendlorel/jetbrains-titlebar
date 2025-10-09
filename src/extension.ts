import { ExtensionContext, workspace } from 'vscode';
import { Marker } from '@/core/marker.js';
import registers from '@/registers.js';
import hacker from '@/core/hacker';
import { errorPop } from '@/core/utils';

export const activate = async (context: ExtensionContext) => {
  await hacker.apply().catch(errorPop);
  const marker = new Marker();

  registers(context);

  context.subscriptions.push(
    marker.item,
    workspace.onDidChangeWorkspaceFolders(() => marker.update()),
    workspace.onDidChangeConfiguration(async (e) => {
      const changed =
        e.affectsConfiguration('jetbrains-titlebar.glowIntensity') ||
        e.affectsConfiguration('jetbrains-titlebar.glowDiameter') ||
        e.affectsConfiguration('jetbrains-titlebar.glowOffsetX');
      if (changed) {
        hacker.apply().catch(errorPop);
      }
    })
  );
};

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const deactivate = () => {};
