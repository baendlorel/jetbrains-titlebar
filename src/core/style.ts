import vscode from 'vscode';
import { join } from 'node:path';
import { readdir, readFile, rm } from 'node:fs/promises';

import { Commands, SettingsJson, TitleBarConsts } from '@/common/consts';
import i18n from '@/common/i18n';
import configs from '@/common/configs';
import popSuggest from '@/common/pop-suggest';
import RGBA from '@/common/rgba';

import { getColor } from './colors';

class TitleBarStyle {
  /**
   * 设置标题栏颜色
   */
  async refresh() {
    if (!configs.cwd) {
      return;
    }

    // 如果标题栏样式不是custom，且用户坚持不改，那么则不设置颜色
    const globalTitleBarStyleIsCustom = await this.tryCustom();
    if (!globalTitleBarStyleIsCustom) {
      return;
    }

    // 不是项目文件夹就不设置
    const isProject = await this.checkDirIsProject();
    if (!isProject) {
      return;
    }

    // 开始计算颜色并应用
    const color = getColor(configs.cwd);
    await this.applyColor(color);

    const suggest = i18n.Features.color.suggest;
    // 询问用户是否要手动选择颜色
    const result = await popSuggest(suggest.msg, suggest.yes, suggest.no);
    if (result === suggest.yes) {
      // 通过命令ID拉起颜色选择器，避免循环引用
      await vscode.commands.executeCommand(Commands.ControlPanel);
    }
  }

  applyColor(color: string | RGBA): Thenable<void> {
    color = new RGBA(color);
    const newStyle = {
      [TitleBarConsts.ActiveBg]: color.toString(),
      [TitleBarConsts.InactiveBg]: color.toGreyDarkenString(),
    };
    return configs.setWorkbenchColorCustomizations(newStyle);
  }

  applyIfNotSet(): Promise<void> {
    if (this.alreadySet()) {
      return Promise.resolve();
    }
    return this.refresh();
  }

  /**
   * 将计算的标题栏颜色清空
   * @deprecated
   */
  async clear() {
    const emptyStyle = {
      [TitleBarConsts.ActiveBg]: undefined,
      [TitleBarConsts.InactiveBg]: undefined,
    };
    await configs.setWorkbenchColorCustomizations(emptyStyle);

    // 如果.vscode下只有settings一个文件，而且内容和上面的compact一样，那么删除.vscode
    const settingsPath = join(configs.cwd, SettingsJson.Dir); // , 'settings.json'
    const list = await readdir(settingsPath);
    const content = await readFile(join(settingsPath, SettingsJson.FileName), 'utf-8');
    if (list.length === 1 && content.replace(/\s/g, '') === SettingsJson.MinimumContent) {
      await rm(settingsPath, { recursive: true, force: true });
    }
  }

  /**
   * 看看是不是已经设置了颜色，已经设置了就不要重复了
   */
  private alreadySet(): boolean {
    const workspaceValue = configs.inspectWorkbenchColorCustomizations?.workspaceValue;
    if (!workspaceValue) {
      return false;
    }
    return (
      workspaceValue[TitleBarConsts.ActiveBg] !== undefined &&
      workspaceValue[TitleBarConsts.InactiveBg] !== undefined
    );
  }

  private async checkDirIsProject() {
    const list = await readdir(configs.cwd);
    const indicators = configs.projectIndicators;
    for (let i = 0; i < list.length; i++) {
      if (indicators.includes(list[i])) {
        return true;
      }
    }
    return false;
  }

  /**
   * 全局的`titleBarStyle`配置必须是`custom`，修改标题栏颜色的操作才能生效
   */
  private async tryCustom(): Promise<boolean> {
    // 检测当前标题栏样式设置
    if (configs.windowTitleBarStyle === TitleBarConsts.Expected) {
      return true;
    }

    const result = await vscode.window.showWarningMessage(
      i18n.NotCustomTitleBarStyle(i18n.ConfigLevel[vscode.ConfigurationTarget.Global]),
      i18n.SetTitleBarStyleToCustom,
      i18n.Cancel
    );
    if (result !== i18n.SetTitleBarStyleToCustom) {
      throw false;
    }

    await configs.justifyWindowTitleBarStyle();
    vscode.window.showInformationMessage(i18n.SetTitleBarStyleToCustomSuccess);
    return true;
  }
}

const style = new TitleBarStyle();
export default style;
