import vscode from 'vscode';

const zh = {
  'file-not-found': '文件 {0} 不存在，请检查路径',
  'config.outdated-css-path': '失效的css文件路径: {0}',
  'config.save-css-path': '新css文件路径已保存： {0}',
  'search-css.code-shell-not-found': 'appRoot\\bin\\code 没有找到，查找的路径： {0}',
  'search-css.code-shell-invalid': 'appRoot\\bin\\code 无效, 文件中没有 VERSIONFOLDER 字样',
  'hacker.input-path.prompt': '指定 workbench.desktop.main.css 路径以实现样式注入',
  'hacker.input-path.success': '样式注入成功！重启 VS Code 生效。若没有效果，可运行命令面板中的“手动指定”',
  'hacker.clean.success': '样式清理成功',
  'hacker.clean.no-need': '未发现注入标记，无需清理',
  'hacker.clean.malformed': 'CSS文件格式异常，简易手动检查/清理',
  'hacker.relocate.success': 'CSS 文件路径已更新',
  'hacker.auto-relocate.fail': '没有找到CSS文件，请手动指定',
  'hacker.invalid-windows-path': 'Windows 路径无效: {0}',
};

const en: typeof zh = {
  'file-not-found': 'File {0} not found, please check the path',
  'config.outdated-css-path': 'Outdated css path: {0}',
  'config.save-css-path': 'New css path saved: {0}',
  'search-css.code-shell-not-found': 'appRoot\\bin\\code is not found from: {0}',
  'search-css.code-shell-invalid': 'appRoot\\bin\\code is invalid, VERSIONFOLDER not found in content',
  'hacker.input-path.prompt': 'Specify the path to workbench.desktop.main.css for style injection',
  'hacker.input-path.success': 'Style injection succeeded. Restart VS Code to make it work!',
  'hacker.clean.success': 'Style cleanup succeeded',
  'hacker.clean.no-need': 'Did not find injection markers, no need to clean',
  'hacker.clean.malformed': 'CSS file is malformed, please check/clean it manually',
  'hacker.relocate.success': 'CSS file path has been updated',
  'hacker.auto-relocate.fail': 'No CSS file found, please specify it manually',
  'hacker.invalid-windows-path': 'Invalid Windows path: {0}',
};

const dict = vscode.env.language.includes('zh') ? zh : en;

export const t = (key: keyof typeof dict, ...args: string[]): string => {
  let template = dict[key] || key;
  args.forEach((arg, index) => (template = template.replace(`{{${index}}`, arg)));
  return template;
};
