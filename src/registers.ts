import { commands, workspace, ExtensionContext, ConfigurationChangeEvent } from 'vscode';
import { errorPop } from './lib/native.js';
import { Hacker } from './core/hacker';
import { Marker } from './core/marker';

const changed = (e: ConfigurationChangeEvent, ...names: ConfigName[]) =>
  names.some((name) => e.affectsConfiguration(`jetbrains-titlebar.${name}`));

const cmd = (c: CommandName, cb: Fn) => commands.registerCommand(`jetbrains-titlebar.${c}`, cb);

export default (context: ExtensionContext) => {
  const hacker = Hacker.instance;
  const marker = Marker.instance;

  context.subscriptions.push(
    ...[
      // * elements
      marker.item,

      // * change events
      workspace.onDidChangeWorkspaceFolders(() => marker.update()),
      workspace.onDidChangeConfiguration((e) => {
        if (changed(e, 'colorSeed')) {
          marker.update();
        } else if (changed(e, 'showProjectInitials')) {
          marker.update();
        } else if (changed(e, 'glowIntensity', 'glowDiameter', 'glowOffsetX')) {
          hacker
            .apply()
            .catch(errorPop)
            .finally(() => marker.update());
        }
      }),

      // * commands
      cmd('applyGlow', () => hacker.apply()),
      cmd('removeGlow', () => hacker.remove()),
      cmd('manuallyRelocateCssPath', () => hacker.manualReloc()),
      cmd('autoRelocateCssPath', () => hacker.autoReloc(false)),
    ].filter((v) => v !== undefined)
  );
};
