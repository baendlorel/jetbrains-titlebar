import { env } from 'vscode';

const zh = {
  'css-found': 'CSS文件找到了: $0',
  'file-not-found': '文件 $0 不存在，请检查路径',
  'hacker.input-path.prompt': '指定 workbench.desktop.main.css 路径以实现样式注入',
  'hacker.input-path.success': '样式注入成功！重启 VS Code 生效。若没有效果，可运行命令面板中的“手动指定”',
  'hacker.clean.success': '样式清理成功',
  'hacker.clean.no-need': '未发现注入标记，无需清理',
  'hacker.clean.malformed': 'CSS文件格式异常，简易手动检查/清理',
  'hacker.relocate.success': 'CSS 文件路径已更新',
  'hacker.auto-relocate.choose': '自动检测到如下css文件地址，请选择：',
  'hacker.auto-relocate.fail': '没有找到CSS文件，请手动指定',
};

const en = {
  'css-found': 'Found CSS file at: $0',
  'file-not-found': 'File $0 not found, please check the path',
  'hacker.input-path.prompt': 'Specify the path to workbench.desktop.main.css for style injection',
  'hacker.input-path.success':
    'Style injection succeeded. Restart VS Code to take effect. If there is no effect, you can open the command palette, use the command "manuallyRelocateCssPath" to specify the path to workbench.desktop.main.css',
  'hacker.clean.success': 'Style cleanup succeeded',
  'hacker.clean.no-need': 'Did not find injection markers, no need to clean',
  'hacker.clean.malformed': 'CSS file is malformed, please check/clean it manually',
  'hacker.relocate.success': 'CSS file path has been updated',
  'hacker.auto-relocate.choose': 'Auto-detected CSS file paths below. Please choose one:',
  'hacker.auto-relocate.fail': 'No CSS file found, please specify it manually',
} satisfies typeof zh;

const dict = env.language.startsWith('en') ? en : zh;

export const i18n = (key: keyof typeof dict, ...args: string[]) => {
  let str = dict[key] || key;
  args.forEach((arg, index) => (str = str.replace(`$${index}`, arg)));
  return str;
};
