import vscode from 'vscode';
import { Commands, Consts } from '@/common/consts';
import i18n from '@/common/i18n';
import configs from '@/common/configs';

class Version {
  get(context: vscode.ExtensionContext) {
    const extension = vscode.extensions.getExtension(context.extension.id);
    if (!extension) {
      vscode.window.showErrorMessage(i18n.Version.selfNotFound);
    }
    return extension?.packageJSON.version ?? 'outdated';
  }

  async updated(context: vscode.ExtensionContext) {
    const version = configs.currentVersion;
    const actualVersion = this.get(context);
    if (actualVersion !== version) {
      vscode.window.showInformationMessage(
        `🎉 ${Consts.DisplayName} ${i18n.Version.updated(actualVersion)}`
      );
      configs.setCurrentVersion(actualVersion);

      // 用执行命令的方式拉起，减少引入
      vscode.commands.executeCommand(Commands.ControlPanel);
      return true;
    }
    return false;
  }
}

const version = new Version();
export default version;
