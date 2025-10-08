export const enum Consts {
  Name = 'colorful-titlebar',
  DisplayName = 'Colorful Titlebar',
  Akasha = 'akasha',
  WorkbenchCssName = 'workbench.desktop.main.css',
  SerializerSeparator = '\u2063',
  ConfigSeparator = '\u200B',
}

export const enum TitleBarConsts {
  Expected = 'custom',
  Section = 'window.titleBarStyle',
  WorkbenchSection = 'workbench.colorCustomizations',
  ActiveBg = 'titleBar.activeBackground',
  InactiveBg = 'titleBar.inactiveBackground',
}

export const enum SettingsJson {
  FileName = 'settings.json',
  Dir = '.vscode',
  MinimumContent = `{"${TitleBarConsts.WorkbenchSection}":{}}`,
}

export const enum Commands {
  ControlPanel = `${Consts.Name}.controlPanel`,
}

// #region 配置项相关

export const enum GradientStyle {
  BrightLeft,
  BrightCenter,
  ArcLeft,
  None,
}

export const enum HashSource {
  ProjectName,
  FullPath,
  ProjectNameDate,
}

// #endregion
