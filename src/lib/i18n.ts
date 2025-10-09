import { env } from 'vscode';

const zh = {
  'hacker.get-css-path.title': '请输入 workbench.desktop.main.css 文件路径',
  'hacker.get-css-path.prompt': '指定 workbench.desktop.main.css 路径以实现样式注入',
  'hacker.get-css-path.placeHolder': 'workbench.desktop.main.css 文件路径',
  'hacker.get-css-path.success':
    '样式注入成功，重启 VS Code 生效。若没有效果，可以开启命令面板，使用命令“relocateCssPath”来手动指定workbench.desktop.main.css 文件路径',
  'hacker.get-css-path.auto-found.title': '已自动找到 CSS 文件',
  'hacker.get-css-path.auto-found.placeHolder': '使用此路径',
  'hacker.get-css-path.not-found': '文件不存在，请检查路径',
  'hacker.clean.success': '样式清理成功',
  'hacker.relocate.success': 'CSS 文件路径已更新',
  'hacker.relocate-auto.fail': '没有找到CSS文件，请手动指定',
  'hacker.relocate-auto.fail-again': '没有找到CSS文件',
};

const en = {
  'hacker.get-css-path.title': 'Please enter the path to workbench.desktop.main.css',
  'hacker.get-css-path.prompt':
    'Specify the path to workbench.desktop.main.css for style injection',
  'hacker.get-css-path.placeHolder': 'Path to workbench.desktop.main.css',
  'hacker.get-css-path.success':
    'Style injection succeeded. Restart VS Code to take effect. If there is no effect, you can open the command palette, use the command "relocateCssPath" to specify the path to workbench.desktop.main.css',
  'hacker.get-css-path.auto-found.title': 'CSS file found automatically',
  'hacker.get-css-path.auto-found.placeHolder': 'Use this path',
  'hacker.get-css-path.not-found': 'File not found, please check the path',
  'hacker.clean.success': 'Style cleanup succeeded',
  'hacker.relocate.success': 'CSS file path has been updated',
  'hacker.relocate-auto.fail': 'No CSS file found, please specify it manually',
  'hacker.relocate-auto.fail-again': 'No CSS file found',
} satisfies typeof zh;

export const i18n = env.language.startsWith('en') ? en : zh;
