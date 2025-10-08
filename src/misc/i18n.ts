import vscode from 'vscode';

const zh = {
  'hacker.get-css-path.title': '请输入 workbench.desktop.main.css 文件路径',
  'hacker.get-css-path.prompt': '指定 workbench.desktop.main.css 路径以实现样式注入',
  'hacker.get-css-path.placeHolder': 'workbench.desktop.main.css 文件路径',
  'hacker.get-css-path.success': '样式注入成功',
};

const en = {
  'hacker.get-css-path.title': 'Please enter the path to workbench.desktop.main.css',
  'hacker.get-css-path.prompt':
    'Specify the path to workbench.desktop.main.css for style injection',
  'hacker.get-css-path.placeHolder': 'Path to workbench.desktop.main.css',
  'hacker.get-css-path.success': 'Style injection succeeded',
} satisfies typeof zh;

export const i18n = vscode.env.language.startsWith('en') ? en : zh;
