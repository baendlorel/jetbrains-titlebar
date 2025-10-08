import vscode from 'vscode';

import configs from './configs';
import i18n from './i18n';

export default configs.showSuggest
  ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async (msg: string, ...items: any[]) => {
      const result = await vscode.window.showInformationMessage(
        msg,
        ...items,
        i18n.BlockAllSuggestion.button
      );
      if (result === i18n.BlockAllSuggestion) {
        await configs.setShowSuggest(false);
      }
      return result;
    }
  : async (_: string) => undefined;
