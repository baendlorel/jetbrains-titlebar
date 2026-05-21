import type { ConfigName, CommandName, Fn } from './types/global.js';
import { commands, workspace, ExtensionContext, ConfigurationChangeEvent } from 'vscode';

import { errorPop } from './lib/native.js';
import { disposeMarkers, updateMarkers } from './core/marker.js';
import { apply, manualRelocate, relocate, remove } from './core/hacker.js';

const changed = (e: ConfigurationChangeEvent, ...names: ConfigName[]) =>
  names.some((name) => e.affectsConfiguration(`jetbrains-titlebar.${name}`));

const cmd = (c: CommandName, cb: Fn) => commands.registerCommand(`jetbrains-titlebar.${c}`, cb);

export default (context: ExtensionContext) => {
  context.subscriptions.push(
    // * elements
    disposeMarkers,

    // * change events
    workspace.onDidChangeWorkspaceFolders(updateMarkers),
    workspace.onDidChangeConfiguration((e) => {
      if (changed(e, 'colorSeed', 'showProjectInitials')) {
        updateMarkers();
      } else if (changed(e, 'glowIntensity', 'glowDiameter', 'glowOffsetX')) {
        apply().catch(errorPop).finally(updateMarkers);
      }
    }),

    // * commands
    cmd('applyGlow', apply),
    cmd('removeGlow', remove),
    cmd('manuallyRelocateCssPath', manualRelocate),
    cmd('autoRelocateCssPath', relocate),
  );
};
