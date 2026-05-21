import type { ConfigName, CommandName, Fn } from './types/global.js';
import { commands, workspace, ExtensionContext, ConfigurationChangeEvent } from 'vscode';

import { $info, errorPop } from './lib/native.js';
import { marker } from './core/marker.js';
import { apply, manualRelocate, relocate, remove } from './core/hacker.js';
import { t } from './lib/l10n.js';

const changed = (e: ConfigurationChangeEvent, ...names: ConfigName[]) =>
  names.some((name) => e.affectsConfiguration(`jetbrains-titlebar.${name}`));

const cmd = (c: CommandName, cb: Fn) => commands.registerCommand(`jetbrains-titlebar.${c}`, cb);

export default (context: ExtensionContext) => {
  context.subscriptions.push(
    // * elements
    marker,

    // * change events
    workspace.onDidChangeConfiguration((e) => {
      if (changed(e, 'colorSeed', 'showProjectInitials')) {
        $info(t('marker.restart-to-apply-changes'));
      } else if (changed(e, 'glowIntensity', 'glowDiameter', 'glowOffsetX')) {
        apply().catch(errorPop);
      }
    }),

    // * commands
    cmd('applyGlow', apply),
    cmd('removeGlow', remove),
    cmd('manuallyRelocateCssPath', manualRelocate),
    cmd('autoRelocateCssPath', relocate),
  );
};
