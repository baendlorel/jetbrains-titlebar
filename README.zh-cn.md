# JetBrains 风格标题栏

**中文** | [English](README.md)

一个为 VS Code 标题栏添加炫彩光晕效果的扩展，根据工作区名称自动生成独特的颜色 —— 灵感来自 JetBrains IDE。

<img src="https://raw.githubusercontent.com/baendlorel/jetbrains-titlebar/main/assets/example.png" width="260px">

想了解更多有趣的项目，欢迎访问 [我的主页 💛](https://baendlorel.github.io)

## v1.1.0 新特性 - 2026-02-08

**项目首字母**：像Jetbrains IDE那样在左上角显示项目缩写的两个字母，此功能可在settings里开启。

## ✨ 特性

- 🎨 **自动生成颜色**：每个工作区根据文件夹名称生成独特的颜色
- 🌈 **丰富色板**：200+ 预定义颜色确保项目之间视觉区分度
- ⚙️ **可自定义光晕效果**：调整强度、直径和位置
- 🚀 **自动检测**：跨平台自动定位 VS Code 的 CSS 文件
- 🔄 **实时更新**：切换工作区时立即应用变化
- 🌍 **多语言支持**：英文和中文本地化

## 📸 预览

当你打开不同的项目时，标题栏会显示不同颜色的光晕效果，让你轻松区分多个 VS Code 窗口。

## 🚀 快速开始

### 首次设置

安装后，扩展会自动：

1. 尝试定位 VS Code 安装目录中的 `workbench.desktop.main.css` 文件
2. 将自定义 CSS 样式注入其中
3. 提示你重启 VS Code

> Note: VS Code 提示已经损坏是正常现象，修改了 css 文件就会有这个提示的，无需在意

**注意**：首次使用时，你可能需要：

- 授予文件系统权限
- 如果自动检测失败，需手动指定 CSS 文件路径

## 🎛️ 配置

通过 `文件 > 首选项 > 设置 > JetBrains Titlebar` 访问设置

### 可用设置

#### `jetbrains-titlebar.glowIntensity`

- **类型**：数字 (0-100)
- **默认/推荐**：32
- **描述**：控制光晕效果的不透明度/强度

#### `jetbrains-titlebar.glowDiameter`

- **类型**：数字 (0-2000)
- **默认/推荐**：260
- **描述**：光晕效果的直径（像素）

#### `jetbrains-titlebar.glowOffsetX`

- **类型**：数字 (0-2000)
- **默认/推荐**：120
- **描述**：光晕效果从左边缘的水平偏移量

#### `jetbrains-titlebar.colorSeed`

- **类型**：字符串
- **默认值**：`""` (空)
- **描述**：在计算颜色时混入文件夹名称的随机种子。使用此选项可以为同一项目获得不同的颜色变化。例如，如果你不喜欢当前的颜色，可以尝试将其设置为 "1"、"2" 或任何其他字符串来生成不同的颜色。

#### `jetbrains-titlebar.cssPath` —— 自动管理

- **类型**：对象
- **默认值**：`{}`
- **描述**：缓存的 workbench CSS 文件路径

## 📋 命令

打开命令面板（`Ctrl+Shift+P` 或 `Cmd+Shift+P`）并搜索：

### `JetBrains Titlebar: 应用标题栏光晕效果`

应用或重新应用光晕效果到标题栏。更改设置后很有用。

### `JetBrains Titlebar: 移除标题栏光晕效果`

完全从 VS Code 中移除注入的 CSS 样式。

### `JetBrains Titlebar: 手动指定 workbench.desktop.main.css 路径`

如果自动检测失败，手动指定 VS Code CSS 文件的位置。

### `JetBrains Titlebar: 自动定位 workbench.desktop.main.css 路径`

重新运行自动检测以查找 CSS 文件路径。

## 🔧 工作原理

### 颜色生成算法

1. 扩展读取你的工作区文件夹名称
2. 将颜色种子（如果配置了）混入文件夹名称
3. 计算混合后名称的哈希值
4. 将哈希映射到 200+ 预定义颜色之一
5. 生成带有径向渐变效果的 CSS

### CSS 注入流程

1. 定位 VS Code 的 `workbench.desktop.main.css` 文件
2. 在文件末尾注入自定义 CSS 规则
3. 使用唯一标记来识别和管理注入的样式
4. 支持安全移除和重新注入

## ⚠️ 重要说明

- **系统修改**：此扩展会修改 VS Code 的核心 CSS 文件。虽然安全，但你应该了解这一行为。
- **更新**：VS Code 更新后，你可能需要重新应用光晕效果。
- **权限**：需要对 VS Code 安装目录的写入权限。
- **备份**：建议在首次使用前备份 CSS 文件。

## 🤝 贡献

欢迎贡献！请随时提交问题或拉取请求。

## 📄 许可证

MIT 许可证 - 详见 LICENSE 文件

## 👤 作者

**Kasukabe Tsumugi**

- GitHub: [@baendlorel](https://github.com/baendlorel)
- Email: futami16237@gmail.com
