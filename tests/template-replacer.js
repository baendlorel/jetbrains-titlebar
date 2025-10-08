/**
 * 模板字符串替换器 - 用于浏览器调试
 * Template String Replacer for Browser Debugging
 */

(function () {
  // 中英文文本数据
  const textData = {
    zh: {
      // 面板文本 (中文)
      Panel: {
        title: '设置',
        description: '在这里可以控制标题栏颜色和样式',
        loading: '更新中...',

        showSuggest: {
          label: '显示建议',
          description: '显示偶尔会弹出的建议',
        },

        workbenchCssPath: {
          label: 'workbench.desktop.main.css路径',
          description: '用于注入渐变样式。提示VS Code损坏是意料之内的，选"不再显示"即可',
        },

        gradient: {
          label: '渐变样式',
          description: '选择后立即注入css，选项不会保存在配置中。选择后需要重启生效',
          empty: '-- 请选择 --',
          1: '中间较亮', // BrightCenter
          0: '左侧较亮', // BrightLeft
          2: '左侧弧光', // ArcLeft
        },

        gradientBrightness: {
          label: '渐变亮度',
          description: '表示亮的地方有多亮',
        },

        gradientDarkness: {
          label: '渐变暗度',
          description: '表示暗的地方有多暗',
        },

        hashSource: {
          label: 'Hash入参',
          description: '将会以设定的内容作为计算Hash的依据',
          0: '项目名', // ProjectName
          1: '完整路径', // FullPath
          2: '项目名 + Date.getDate()', // ProjectNameDate
        },

        refresh: {
          label: '重新计算颜色',
          description: '再次让本插件自动计算颜色',
          button: '开始计算',
        },

        randomColor: {
          label: '操作',
          description: '可以选择用当前配置的颜色来随机、纯随机或者直接用调色盘🎨指定颜色',
          colorSet: '当前套组',
          pure: '纯随机',
          specify: '调色盘',
        },
        projectIndicators: {
          label: '项目指示器',
          description: `含有这些文件的文件夹会计算标题栏颜色`,
        },

        themeColors: {
          label: '颜色套组',
          description:
            '编辑亮色和暗色主题的颜色套组，用于计算颜色生成。颜色的顺序会影响计算出的颜色',
          lightColors: '亮色套组',
          darkColors: '暗色套组',
          addColor: '添加颜色',
          removeColor: '删除',
          dragHint: '拖拽重新排序',
        },
      },
    },

    en: {
      // Panel text (English)
      Panel: {
        title: 'Settings',
        description: 'Control titlebar color and style here',
        loading: 'Updating...',

        showSuggest: {
          label: 'Show Suggestions',
          description: 'Show occasional popup suggestions',
        },

        workbenchCssPath: {
          label: 'workbench.desktop.main.css Path',
          description:
            'Used for injecting gradient styles. VS Code corruption warnings are expected, just select "Don\'t Show Again"',
        },

        gradient: {
          label: 'Gradient Style',
          description:
            "CSS will be injected immediately after selection, option won't be saved in config. Restart required to take effect",
          empty: '-- Please Select --',
          1: 'Bright Center', // BrightCenter
          0: 'Bright Left', // BrightLeft
          2: 'Arc Left', // ArcLeft
        },

        gradientBrightness: {
          label: 'Gradient Brightness',
          description: 'How bright the bright areas are',
        },

        gradientDarkness: {
          label: 'Gradient Darkness',
          description: 'How dark the dark areas are',
        },

        hashSource: {
          label: 'Hash Source',
          description: 'The content used as the basis for hash calculation',
          0: 'Project Name', // ProjectName
          1: 'Full Path', // FullPath
          2: 'Project Name + Date.getDate()', // ProjectNameDate
        },

        refresh: {
          label: 'Recalculate Color',
          description: 'Let the plugin automatically calculate color again',
          button: 'Start Calculation',
        },

        randomColor: {
          label: 'Random/Specify',
          description:
            'You can choose to randomize with current configured colors, pure random, or directly specify a color with the color picker🎨',
          colorSet: 'Current Set',
          pure: 'Pure Random',
          specify: 'Palette',
        },
        projectIndicators: {
          label: 'Project Indicators',
          description: `Folders containing these files will have their titlebar color calculated`,
        },

        themeColors: {
          label: 'Color Palette',
          description:
            'Edit light and dark theme color sets for random color functionality. Order of the colors will affect the generated results',
          lightColors: 'Light Colors',
          darkColors: 'Dark Colors',
          addColor: 'Add Color',
          removeColor: 'Remove',
          dragHint: 'Drag to reorder',
        },
      },
    },
  };

  // 当前语言设置
  const currentLang = ((match) => {
    if (match) {
      console.log(`🌐 Language switched to: ${match[0].split('=')[1]}`);
      return match[0].split('=')[1];
    } else {
      console.log(`🌐 Language switched to: zh`);
      return 'zh';
    }
  })(location.href.match(/\?lang=([a-z]+)/g));

  const langToggler = document.createElement('button');
  langToggler.textContent = '切换语言';
  langToggler.style.position = 'fixed';
  langToggler.style.top = '10px';
  langToggler.style.right = '10px';
  langToggler.style.zIndex = '1000';
  langToggler.onclick = () => {
    const newLang = currentLang === 'zh' ? 'en' : 'zh';
    window.location.href = window.location.href.split('?')[0] + '?lang=' + newLang;
  };
  document.body.appendChild(langToggler);

  const freezer = document.createElement('button');
  freezer.textContent = '冻结/解冻';
  freezer.style.position = 'fixed';
  freezer.style.top = '50px';
  freezer.style.right = '10px';
  freezer.style.zIndex = '1000';
  freezer.frozen = false;
  freezer.onclick = () => {
    if (freezer.frozen) {
      window.unfreeze();
    } else {
      window.freeze();
    }
    freezer.frozen = !freezer.frozen;
  };
  document.body.appendChild(freezer);

  // 测试数据定义
  const mockData = {
    // 常量
    Consts: {
      DisplayName: 'Colorful Titlebar',
    },

    // 枚举
    GradientStyle: {
      BrightCenter: 1,
      BrightLeft: 0,
      ArcLeft: 2,
    },

    HashSource: {
      ProjectName: 0,
      FullPath: 1,
      ProjectNameDate: 2,
    },

    // 面板文本 (动态切换)
    get Panel() {
      return textData[currentLang].Panel;
    },

    // 配置数据
    configs: {
      theme: 'light',
      showSuggest: 'true',
      workbenchCssPath:
        '/d/software/Microsoft VS Code/resources/app/out/vs/workbench/workbench.desktop.main.css',
      hashSource: '0',
      get lang() {
        return currentLang;
      },
    },

    // 版本信息
    version: {
      get: function () {
        return '1.2.2';
      },
    },

    // 其他数据
    gradientBrightness: '85',
    gradientDarkness: '15',
    currentColor: '#007ACC',
    env: 'dev',
    projectIndicators: '.git;Cargo.toml;README.md;package.json;pom.xml;build.gradle;Makefile',

    // 颜色套组数据
    lightColors: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8'],
    darkColors: ['#E74C3C', '#1ABC9C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6', '#34495E'],
  };

  /**
   * @param {string} text
   * @returns {string}
   */
  function replace(text) {
    return text
      .replace('v{{VERSION}}', 'v12.32.12')
      .replaceAll('{{ENUM_DISPLAY_NAME}}', 'Colorful Titlebar')
      .replaceAll('{{I18N_', '')
      .replaceAll('{{ENUM_', '')
      .replaceAll('{{CFG_', '')
      .replaceAll('{{CTRL_', '')
      .replaceAll('{{DATA_', '')
      .replaceAll('{{', '')
      .replaceAll('_LABEL}}', '')
      .replaceAll('_DESC}}', '_')
      .replaceAll('}}', '');
  }

  // 模板替换函数
  function replaceTemplates() {
    /**
     *
     * @param {HTMLElement} el
     */
    const visit = (el) => {
      const attrs = el.getAttributeNames();
      for (let i = 0; i < attrs.length; i++) {
        const attr = el.getAttribute(attrs[i]);
        el.setAttribute(attrs[i], replace(attr));
      }

      for (let i = 0; i < el.childNodes.length; i++) {
        const node = el.childNodes[i];
        if (node instanceof Text) {
          node.textContent = replace(node.textContent);
        }
        if (node instanceof HTMLElement) {
          visit(el.childNodes[i]);
        }
      }
    };

    visit(document.querySelector('title'));
    visit(document.body);
  }

  // & 必须等一会再换，否则colorlist初始化还没好就被换掉了，会导致找不到元素
  requestAnimationFrame(replaceTemplates);
})();
