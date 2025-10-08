import vscode from 'vscode';
import { Consts, GradientStyle, HashSource, TitleBarConsts } from './consts';

const i18n = (() => {
  const zh = {
    Unknown: '未知',
    InvalidAkasha: '用户配置读取失败，也许是配置数据损坏，将启用默认配置覆盖',

    BlockAllSuggestion: { button: '屏蔽所有建议' },
    NotWorkspace: '没有打开工作区文件夹，不改变标题栏颜色',
    NotProject: '当前不是项目目录，不改变标题栏颜色',

    Version: {
      updated: (v: string) => `已更新至 v${v}，为您打开控制面板以查看新功能`,
      selfNotFound: '怎么可能没找到自己？',
      button: '打开控制面板！',
    },

    ControlPanel: {
      title: '设置',
      description: '在这里可以控制标题栏颜色和样式',
      loading: '更新中...',
      typeError: (value: unknown, shouldBe?: string) =>
        `值或值类型无效，得到的是${value}(${typeof value})${shouldBe ? '，应该是' + shouldBe : ''}`,
      success: '保存成功',
      showSuggest: {
        label: '显示建议',
        description: `显示偶尔会弹出的建议`,
      },
      workbenchCssPath: {
        label: `${Consts.WorkbenchCssName}路径`,
        description: '用于注入渐变样式。提示VS Code损坏是意料之内的，选“不再显示”即可',
        notExist: '路径不存在',
      },
      gradient: {
        label: '渐变样式',
        description: '选择后立即注入css，选项不会保存在配置中。选择后需要重启生效',
        empty: '-- 请选择 --',
        [GradientStyle.BrightCenter]: '中间较亮',
        [GradientStyle.BrightLeft]: '左侧较亮',
        [GradientStyle.ArcLeft]: '左侧弧光',
        [GradientStyle.None]: '取消渐变',
        success: '注入成功，重启后生效',
      },
      gradientBrightness: {
        label: '渐变亮度',
        description: '表示亮的地方有多亮',
        success: '保存成功，重新选择渐变样式即可生效',
      },
      gradientDarkness: {
        label: '渐变暗度',
        description: '表示暗的地方有多暗',
        success: '保存成功，重新选择渐变样式即可生效',
      },
      hashSource: {
        label: 'Hash入参',
        description: `将会以设定的内容作为计算Hash的依据`,
        [HashSource.ProjectName]: '项目名',
        [HashSource.FullPath]: '完整路径',
        [HashSource.ProjectNameDate]: '项目名 + Date.getDate()',
        success: '保存成功，点击"重新计算颜色"可以生效',
      },
      refresh: {
        label: '重新计算颜色',
        description: `再次让本插件自动计算颜色`,
        button: '开始计算',
        success: (token: string, color: string) =>
          `重新计算颜色成功，哈希入参：${token}，颜色：${color}`,
      },
      randomColor: {
        label: '操作',
        description: `可以选择用当前配置的颜色来随机、纯随机或者直接用调色盘🎨指定颜色`,
        colorSet: '当前套组',
        pure: '纯随机',
        specify: '调色盘',
      },
      projectIndicators: {
        label: '项目指示器',
        description: `含有这些文件的文件夹会计算标题栏颜色，使用回车分隔`,
      },
      themeColors: {
        label: '颜色套组',
        description: '编辑亮色和暗色主题的颜色套组，用于计算颜色生成。颜色的顺序会影响计算出的颜色',
        light: '亮色套组',
        dark: '暗色套组',
        addColor: '添加颜色',
        removeColor: '删除',
        dragHint: '拖拽重新排序',
        emptyPalette: (name: string) => `${name}至少得有1个颜色`,
        invalidPaletteColor: (name: string) => `${name}存在无效颜色`,
        allSaved: '全都保存完成',
      },
    },

    Features: {
      gradient: {
        suggest: {
          msg: '已支持美丽的标题栏渐变色！需要开启吗？',
          yes: '好的！',
        },
        title: `${Consts.WorkbenchCssName}文件地址`,
        prompt: `启用渐变色标题栏需要修改${Consts.WorkbenchCssName}，请提供该文件地址（WSl 需要映射到子系统内部的地址）`,
        placeHolder: `例如：../../${Consts.WorkbenchCssName}`,
        workbenchCssPathInvalid: `${Consts.WorkbenchCssName}路径无效，请检查`,
        style: {
          [GradientStyle.BrightCenter]: '中间较亮',
          [GradientStyle.BrightLeft]: '左侧较亮',
          [GradientStyle.ArcLeft]: '左侧弧光',
        },
        invalidStyle: '无效的样式',
        success: '修改css文件成功！重启VS Code生效。若碰到提示VS Code损坏，可以直接点击“不再显示”',
        fail: '修改css文件失败！',
        backup: {
          notFound: (filePath?: string) => {
            filePath = filePath ? `（${filePath}）` : '';
            return `未找到备份的css文件${filePath}！如果样式出现混乱，您可能需要重新安装VS Code`;
          },
          success: '备份css文件成功',
          fail: '备份css文件失败！',
        },
        restore: {
          success: '备份css文件成功',
          fail: '备份css文件失败！',
        },
      },
      color: {
        suggest: {
          msg: '对自动计算的颜色不满意？可以手动选择！',
          yes: '我要手选！',
          no: '现在这个蛮好',
        },
      },
    },

    ConfigLevel: {
      [vscode.ConfigurationTarget.Workspace]: '工作区',
      [vscode.ConfigurationTarget.WorkspaceFolder]: '工作区文件夹',
      [vscode.ConfigurationTarget.Global]: '全局',
    },

    // 设置标题栏颜色
    TitleBarColorSet: (settingsCreated: boolean) =>
      `标题栏颜色已更新${settingsCreated ? '，已创建settings.json' : ''}`,

    // 设置全局标题栏样式
    NotCustomTitleBarStyle: (level: string) =>
      `检测到"${level}"级别的标题栏样式设置不是"${TitleBarConsts.Expected}"，需要设置为"${TitleBarConsts.Expected}"本插件才能生效`,
    SetTitleBarStyleToCustom: '帮我设置好',
    Cancel: '还是算了',
    SetTitleBarStyleToCustomSuccess: `标题栏样式已设置为${TitleBarConsts.Expected}，重启VS Code后生效`,
  };

  const en = {
    Unknown: 'unknown',
    InvalidAkasha:
      'User configuration read failed, maybe the config data is corrupted, will use default config to override',

    BlockAllSuggestion: { button: 'Block Suggestions' },
    NotWorkspace: 'No workspace folder opened, titlebar color remains unchanged',
    NotProject: 'Current folder is not a project directory, titlebar color remains unchanged',

    Version: {
      updated: (v: string) =>
        `is updated to v${v}. The control panel is opened to see the new features`,
      selfNotFound: 'How could I not find myself?',
      button: 'Open Control Panel!',
    },

    ControlPanel: {
      title: 'Settings',
      description: 'Control titlebar color and style here',
      loading: 'Updating...',
      success: 'Saved successfully',
      typeError: (value: unknown, shouldBe?: string) =>
        `Invalid value or value type, got ${value}(${typeof value})${
          shouldBe ? '. Should be ' + shouldBe : ''
        }`,
      showSuggest: {
        label: 'Show Suggestions',
        description: `Turning it off will block all suggestions`,
      },
      workbenchCssPath: {
        label: `${Consts.WorkbenchCssName} Path`,
        description:
          'After injection, VS Code might show "corrupted", just select "Never show again"',
        notExist: 'Path does not exist',
      },
      gradient: {
        label: 'Gradient Style',
        description:
          'After selection, CSS is injected immediately, options are not saved in settings. Restart to take effect',
        empty: '-- Select --',
        [GradientStyle.BrightCenter]: 'Bright Center',
        [GradientStyle.BrightLeft]: 'Bright Left',
        [GradientStyle.ArcLeft]: 'Arc Left',
        [GradientStyle.None]: 'None',
        success: 'Injected successfully, restart to take effect',
      },
      gradientBrightness: {
        label: 'Gradient Brightness',
        description: 'Indicates how bright the brighter part of the gradient is',
        success: 'Saved successfully, reselect gradient style to apply changes',
      },
      gradientDarkness: {
        label: 'Gradient Darkness',
        description: 'Indicates how dark the darker part of the gradient is',
        success: 'Saved successfully, reselect gradient style to apply changes',
      },
      hashSource: {
        label: 'Hash Source',
        description: `Determines the basis for calculating the hash used for color`,
        [HashSource.ProjectName]: 'Project Name',
        [HashSource.FullPath]: 'Full Path',
        [HashSource.ProjectNameDate]: 'Project Name + Date.getDate()',
        success: 'Saved successfully, click "Recalculate Color" to apply changes',
      },
      refresh: {
        label: 'Recalculate Color',
        description: `Recalculate the titlebar color automatically`,
        button: 'Calculate',
        success: (token: string, color: string) =>
          `Recalculated color successfully, hash input: ${token}, color: ${color}`,
      },
      randomColor: {
        label: 'Random/Specify',
        description: `Choose to randomize within the current color set, pure random or directly specify a color using 🎨`,
        colorSet: 'Current Color Set',
        pure: 'Pure Random',
        specify: 'Palette',
      },
      projectIndicators: {
        label: 'Project Indicators',
        description: `Folders containing these files will have their titlebar color calculated. Separate with new lines`,
      },
      themeColors: {
        label: 'Color Palette',
        description:
          'Edit light and dark theme color sets for random color functionality. Order of the colors will affect the generated results',
        light: 'Light Colors',
        dark: 'Dark Colors',
        addColor: 'Add Color',
        removeColor: 'Remove',
        dragHint: 'Drag to reorder',
        emptyPalette: (name: string) => `${name} should add at least 1 color`,
        invalidPaletteColor: (name: string) => `${name} has invalid color(s)`,
        allSaved: 'All color sets are saved',
      },
    },

    Features: {
      gradient: {
        suggest: {
          msg: 'Gradient titlebar is supported! Do you want to enable it now?',
          yes: 'YES! Enable it now!',
        },
        title: `${Consts.WorkbenchCssName} Path`,
        prompt: `To enable gradient titlebar, please provide the path to "${Consts.WorkbenchCssName}". WSL paths should map to the internal path of the subsystem`,
        placeHolder: `Example: ../../${Consts.WorkbenchCssName}`,
        workbenchCssPathInvalid: `The path to "${Consts.WorkbenchCssName}" is invalid, please check`,
        style: {
          [GradientStyle.BrightCenter]: 'Bright Center',
          [GradientStyle.BrightLeft]: 'Bright Left',
          [GradientStyle.ArcLeft]: 'Arc Left',
        },
        invalidStyle: 'Invalid style',
        success:
          'CSS file modified successfully! Restart VS Code to apply changes. If you see a message like "Your Code installation appears to be corrupt. Please reinstall.", you can simply click never show again.',
        fail: 'CSS file modification failed!',
        backup: {
          notFound: (filePath?: string) => {
            filePath = filePath ? `(${filePath})` : '';
            return `Backup CSS file not found${filePath}! If the style is messed up, you may need to reinstall VS Code`;
          },
          success: 'Backup CSS file created successfully',
          fail: 'Backup CSS file failed!',
        },
        restore: {
          success: 'CSS file restored successfully',
          fail: 'Backup CSS file restoration failed!',
        },
      },
      color: {
        suggest: {
          msg: 'Not satisfied with the auto-calculated color? You can choose manually!',
          yes: 'I want to pick a color',
          no: 'This one is fine',
        },
      },
    },

    ConfigLevel: {
      [vscode.ConfigurationTarget.Workspace]: 'Workspace',
      [vscode.ConfigurationTarget.WorkspaceFolder]: 'Workspace Folder',
      [vscode.ConfigurationTarget.Global]: 'Global',
    },

    // 设置标题栏颜色
    TitleBarColorSet: (settingsCreated: boolean) =>
      `TitleBar color has been updated${
        settingsCreated ? ', "settings.json" has been created' : ''
      }`,

    // 设置全局标题栏样式
    NotCustomTitleBarStyle: (level: string) =>
      `Detected "${level}" level "titleBarStyle" setting is not "${TitleBarConsts.Expected}", it needs to be "${TitleBarConsts.Expected}" for this extension to take effect`,
    SetTitleBarStyleToCustom: 'Set it for me',
    Cancel: 'Not now',
    SetTitleBarStyleToCustomSuccess: `"titleBarStyle" has been set to ${TitleBarConsts.Expected}, Please restart VS Code to make it work`,
  } satisfies typeof zh;

  const isChinese = vscode.env.language.toLowerCase().startsWith('zh');
  return isChinese ? zh : en;
})();

export default i18n;
