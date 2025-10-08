import vscode from 'vscode';

const zh = {
  'hacker.get-css-path.title': '请输入 workbench.desktop.main.css 文件路径',
  'hacker.get-css-path.prompt': '指定 workbench.desktop.main.css 路径以实现样式注入',
  'hacker.get-css-path.placeHolder': 'workbench.desktop.main.css 文件路径',
  'hacker.get-css-path.success': '样式注入成功',
  'hacker.get-css-path.auto-found.title': '已自动找到 CSS 文件',
  'hacker.get-css-path.auto-found.placeHolder': '使用此路径',
  'hacker.get-css-path.not-found': '文件不存在，请检查路径',
};

const en = {
  'hacker.get-css-path.title': 'Please enter the path to workbench.desktop.main.css',
  'hacker.get-css-path.prompt':
    'Specify the path to workbench.desktop.main.css for style injection',
  'hacker.get-css-path.placeHolder': 'Path to workbench.desktop.main.css',
  'hacker.get-css-path.success': 'Style injection succeeded',
  'hacker.get-css-path.auto-found.title': 'CSS file found automatically',
  'hacker.get-css-path.auto-found.placeHolder': 'Use this path',
  'hacker.get-css-path.not-found': 'File not found, please check the path',
} satisfies typeof zh;

export const i18n = vscode.env.language.startsWith('en') ? en : zh;
