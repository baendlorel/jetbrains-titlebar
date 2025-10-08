import vscode from 'vscode';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';

import { GradientStyle } from '@/common/consts';
import i18n from '@/common/i18n';
import configs from '@/common/configs';

import { AfterStyle, Css } from './consts';

class Hacker {
  private readonly Enable = i18n.Features.gradient;

  /**
   * Get the path to the workbench CSS file
   * @returns The CSS file path, or null if not found or user cancels input
   */
  async getWorkbenchCssPath(): Promise<string | null> {
    let cssPath = configs.workbenchCssPath;
    if (existsSync(cssPath)) {
      return cssPath;
    }

    const input = await vscode.window.showInputBox({
      title: this.Enable.title,
      prompt: this.Enable.prompt,
      placeHolder: this.Enable.placeHolder,
      ignoreFocusOut: true,
    });
    if (!input || !existsSync(input.trim())) {
      return null;
    }

    cssPath = input.trim();
    await configs.setWorkbenchCssPath(cssPath);
    return cssPath;
  }

  /**
   * Remove lines containing the CSS token from the array
   * @param lines Array of CSS lines
   * @returns Filtered array without injected lines
   */
  private purge(lines: string[]): string[] {
    return lines.filter((line) => !line.trim().startsWith(Css.Token));
  }

  /**
   * Inject gradient CSS styles into the workbench CSS file
   * @param cssPath Path to the workbench CSS file
   * @param gradientStyle The gradient style to apply
   */
  async inject(cssPath: string, gradientStyle: GradientStyle): Promise<void> {
    const backupPath = `${cssPath}.${Css.BackupSuffix}`;
    if (!existsSync(backupPath)) {
      const buffer = await readFile(cssPath);
      await writeFile(`${cssPath}.${Css.BackupSuffix}`, buffer);
    }

    let rawStyle = AfterStyle.BrightLeft;
    switch (gradientStyle) {
      case GradientStyle.BrightLeft:
        rawStyle = AfterStyle.BrightLeft;
        break;
      case GradientStyle.BrightCenter:
        rawStyle = AfterStyle.BrightCenter;
        break;
      case GradientStyle.ArcLeft:
        rawStyle = AfterStyle.ArcLeft;
        break;
    }

    const darkness = (configs.gradientDarkness / 100).toString();
    const brightness = (configs.gradientBrightness / 100).toString();
    const style = rawStyle
      .replaceAll('{{darkness}}', darkness)
      .replaceAll('{{brightness}}', brightness)
      .replace(/\n[\s]+/g, '');

    const css = await readFile(cssPath, 'utf8');
    const lines = this.purge(css.split('\n'));

    lines.push(`${Css.Token}${style}`);
    await writeFile(cssPath, lines.join('\n'), 'utf8');
    vscode.window.showInformationMessage(this.Enable.success);
  }

  /**
   * Remove injected gradient styles from the CSS file
   * @param cssPath Path to the workbench CSS file
   */
  async clean(cssPath: string): Promise<void> {
    const css = await readFile(cssPath, 'utf8');
    // 消除旧的注入
    const lines = this.purge(css.split('\n'));
    await writeFile(cssPath, lines.join('\n'), 'utf8');
    vscode.window.showInformationMessage(this.Enable.success);
  }

  /**
   * Restore the CSS file from backup
   * @param cssPath Path to the workbench CSS file
   * @deprecated Currently unused
   */
  async restore(cssPath: string): Promise<void> {
    const backupPath = `${cssPath}.${Css.BackupSuffix}`;
    if (!existsSync(backupPath)) {
      vscode.window.showErrorMessage(this.Enable.backup.notFound(backupPath));
      return;
    }
    const buffer = await readFile(backupPath);
    await writeFile(cssPath, buffer);
    vscode.window.showInformationMessage(this.Enable.restore.success);
  }
}

export default new Hacker();
