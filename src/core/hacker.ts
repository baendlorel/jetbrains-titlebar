import { window } from 'vscode';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

import { i18n } from '@/lib/i18n.js';
import { searchWorkbenchCss, getCssColors } from './utils.js';

// * /mnt/d/Programs/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css
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
      const useAuto = await window.showQuickPick(['Yes', 'No'], {
        title: i18n['hacker.get-css-path.auto-found.title'],
        placeHolder: `${i18n['hacker.get-css-path.auto-found.placeHolder']}: ${autoPath}`,
      });
      if (useAuto === 'Yes') {
        return autoPath;
      }
    }

    // Prompt user for manual input
    const input = await window.showInputBox({
      title: i18n['hacker.get-css-path.title'],
      prompt: i18n['hacker.get-css-path.prompt'],
      placeHolder: i18n['hacker.get-css-path.placeHolder'],
      ignoreFocusOut: true,
    });
    if (!input || !existsSync(input.trim())) {
      if (input && !existsSync(input.trim())) {
        window.showErrorMessage(i18n['hacker.get-css-path.not-found']);
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
    window.showInformationMessage(i18n['hacker.get-css-path.success']);
  }

  /**
   * Remove injected gradient styles from the CSS file
   * @param cssPath Path to the workbench CSS file
   */
  private async clean(cssPath: string): Promise<void> {
    const css = await readFile(cssPath, 'utf8');
    const lines = this.purge(css.split('\n'));
    await writeFile(cssPath, lines.join('\n'), 'utf8');
    window.showInformationMessage(i18n['hacker.clean.success']);
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
