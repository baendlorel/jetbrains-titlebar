# JetBrains 风格标题栏

**中文** | [English](README.md)

一个为 VS Code 标题栏添加炫彩光晕效果的扩展，根据工作区名称自动生成独特的颜色 —— 灵感来自 JetBrains IDE。

<img src="https://raw.githubusercontent.com/baendlorel/jetbrains-titlebar/main/assets/example.png" width="260px">

想了解更多有趣的项目，欢迎访问 [我的主页 💛](https://baendlorel.github.io)

## 版本更新

### v1.6.0 - 2026-05-20
- **精准定位 CSS**：终于能够准确找到各平台的 CSS 文件路径
- **中日韩字符支持**：项目名以中日韩字符开头时，只显示 1 个字符防止溢出
- **函数式重构**：重构注入和标记模块，提高模块化和可维护性

### v1.5.0 
- 上次提交时版本号输入错误，实际上没有任何代码更改

### v1.4.0
- 新增 `projectInitialColorOffset` 设置，支持自定义颜色偏移

### v1.3.5
- 为不可写文件添加提示

### v1.3.3
- 大幅削减颜色数量，修复用户反馈的卡顿问题

### v1.3.0
- 自动搜索并选择 CSS 文件路径
- 支持手动选择路径
- 改进国际化支持

### v1.2.0
- 重构核心功能和代码结构

### v1.1.0 - 2026-02-08
- **项目首字母**：在标题栏左上角显示项目缩写的两个字母（可在设置中开启）

## ✨ 特性

- 🎨 **自动生成颜色**：每个工作区根据文件夹名称生成独特的颜色
- ⚙️ **可自定义光晕**：调整强度、直径和位置
- 🚀 **自动检测**：跨平台自动定位 VS Code 的 CSS 文件
- 🔄 **实时更新**：切换工作区时立即应用变化
- 🌍 **多语言支持**：英文和中文界面

## 🚀 快速开始

### 首次设置

安装后，扩展会自动：
1. 定位 VS Code 安装目录中的 `workbench.desktop.main.css` 文件
2. 将自定义 CSS 样式注入其中
3. 提示你重启 VS Code

> **注意**：VS Code 提示已损坏是正常现象，修改 CSS 文件后会有此提示，可以安全忽略。

如果自动检测失败，你可能需要：
- 授予文件系统权限
- 手动指定 CSS 文件路径

## 🎛️ 配置

通过 `文件 > 首选项 > 设置 > JetBrains Titlebar` 访问设置

### 可用设置

| 设置                        | 类型          | 默认值 | 说明                                             |
| --------------------------- | ------------- | ------ | ------------------------------------------------ |
| `glowIntensity`             | 数字 (0-100)  | 32     | 光晕效果的强度/不透明度                          |
| `glowDiameter`              | 数字 (0-2000) | 260    | 光晕效果的直径（像素）                           |
| `glowOffsetX`               | 数字 (0-2000) | 120    | 距离左边缘的水平偏移                             |
| `colorSeed`                 | 字符串        | `""`   | 混入文件夹名称的随机种子，用于生成不同的颜色变化 |
| `projectInitialColorOffset` | 数字          | 3      | 项目首字母的颜色偏移                             |
| `cssPath`                   | 对象          | `{}`   | workbench CSS 文件路径缓存（自动管理）           |

## 📋 命令

打开命令面板（`Ctrl+Shift+P` 或 `Cmd+Shift+P`）：

- **JetBrains Titlebar: 应用标题栏光晕效果** — 应用或重新应用光晕效果
- **JetBrains Titlebar: 移除标题栏光晕效果** — 移除所有注入的 CSS 样式
- **JetBrains Titlebar: 手动指定 workbench.desktop.main.css 路径** — 手动指定 CSS 文件位置
- **JetBrains Titlebar: 自动定位 workbench.desktop.main.css 路径** — 重新运行自动检测

## 🔧 工作原理

1. 读取工作区文件夹名称
2. 混入颜色种子（如果配置了）
3. 计算哈希值
4. 将哈希映射到预定义颜色
5. 生成带径向渐变效果的 CSS
6. 将 CSS 注入 VS Code 样式表

## ⚠️ 重要说明

- **系统修改**：此扩展会修改 VS Code 的核心 CSS 文件
- **更新**：VS Code 更新后，可能需要重新应用光晕效果
- **权限**：需要 VS Code 安装目录的写入权限

## 🤝 贡献

欢迎贡献！请随时提交问题或拉取请求。

## 📄 许可证

MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 👤 作者

**Kasukabe Tsumugi**

- GitHub: [@baendlorel](https://github.com/baendlorel)
- Email: futami16237@gmail.com
