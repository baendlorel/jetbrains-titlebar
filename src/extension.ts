import vscode from 'vscode';

import style from './core/style';
import catcher from './common/catcher';
import register from './registers';
import version from './core/version';

export const activate = catcher(async (context: vscode.ExtensionContext) => {
  // 注册命令
  register(context);

  context.globalState.update('lastVersion', undefined); // 重置版本号，便于测试

  // 如果颜色没有设置过，那么应用标题栏颜色
  await style.applyIfNotSet();

  await version.updated(context);
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const deactivate = () => {};
