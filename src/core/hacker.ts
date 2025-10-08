import vscode from 'vscode';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import { i18n } from '@/misc/i18n.js';
import { searchWorkbenchCss, getCssColors, getColorIndexFromWorkspace } from './utils.js';

const Css = {
  token: '\u002F\u002A__JETBRAINS_TITLEBAR_KASUKABETSUMUGI__\u002A\u002F',
  // CSS template with :has() selector to target titlebar based on injected element's class
  template: `#workbench\u005C\u002Eparts\u005C\u002Etitlebar:has(.jb-titlebar-glow-marker.jb-color-{{index}})::before{
      content: '';
      position: absolute;
      width: 200px;
      height: 125%;
      top: -12.5%;
      left: 0;
      background: radial-gradient(ellipse at left, {{color}}80 0%, {{color}}40 30%, transparent 72%);
      pointer-events: none;
      z-index: 1;
    }`,
};

class Hacker {
  /**
   * Get the path to the workbench CSS file
   * Auto-search common locations first, then prompt user if not found
   * @returns The CSS file path, or null if not found or user cancels input
   */
  async getWorkbenchCssPath(): Promise<string | null> {
    // Try to find CSS file automatically
    const autoPath = await searchWorkbenchCss();
    if (autoPath) {
      const useAuto = await vscode.window.showQuickPick(['Yes', 'No'], {
        title: i18n['hacker.get-css-path.auto-found.title'],
        placeHolder: `${i18n['hacker.get-css-path.auto-found.placeHolder']}: ${autoPath}`,
      });
      if (useAuto === 'Yes') {
        return autoPath;
      }
    }

    // Prompt user for manual input
    const input = await vscode.window.showInputBox({
      title: i18n['hacker.get-css-path.title'],
      prompt: i18n['hacker.get-css-path.prompt'],
      placeHolder: i18n['hacker.get-css-path.placeHolder'],
      ignoreFocusOut: true,
    });
    if (!input || !existsSync(input.trim())) {
      if (input && !existsSync(input.trim())) {
        vscode.window.showErrorMessage(i18n['hacker.get-css-path.not-found']);
      }
      return null;
    }
    return input.trim();
  }

  /**
   * Remove lines containing the CSS token from the array
   * @param lines Array of CSS lines
   * @returns Filtered array without injected lines
   */
  private purge(lines: string[]): string[] {
    return lines.filter((line) => !line.trim().startsWith(Css.token));
  }

  /**
   * Inject gradient CSS styles into the workbench CSS file
   * Creates CSS rules for all color classes using :has() selector
   * @param cssPath Path to the workbench CSS file
   */
  private async inject(cssPath: string): Promise<void> {
    const colors = getCssColors();
    const template = Css.template.replace(/\n[\s]+/g, '');

    // Generate CSS rules for all colors with their index
    const styles = colors.map((color, index) =>
      template.replaceAll('{{color}}', color).replaceAll('{{index}}', String(index))
    );

    const css = await readFile(cssPath, 'utf8');
    const lines = this.purge(css.split('\n'));

    lines.push(`${Css.token}${styles.join('')}`);
    await writeFile(cssPath, lines.join('\n'), 'utf8');
    vscode.window.showInformationMessage(i18n['hacker.get-css-path.success']);
  }

  /**
   * Remove injected gradient styles from the CSS file
   * @param cssPath Path to the workbench CSS file
   */
  private async clean(cssPath: string): Promise<void> {
    const css = await readFile(cssPath, 'utf8');
    const lines = this.purge(css.split('\n'));
    await writeFile(cssPath, lines.join('\n'), 'utf8');
    vscode.window.showInformationMessage(i18n['hacker.get-css-path.success']);
  }

  async apply(): Promise<void> {
    const cssPath = await this.getWorkbenchCssPath();
    if (!cssPath) {
      return;
    }
    await this.inject(cssPath);
  }

  async none() {
    const cssPath = await this.getWorkbenchCssPath();
    if (!cssPath) {
      return;
    }
    await this.clean(cssPath);
  }
}

export default new Hacker();
