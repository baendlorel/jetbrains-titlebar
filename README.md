# JetBrains Style Titlebar

[中文版本](README.zh-cn.md) | **English**

A VS Code extension that adds a colorful glow effect to the titlebar, automatically generating unique colors based on your workspace name - inspired by JetBrains IDEs.

<img src="https://raw.githubusercontent.com/baendlorel/jetbrains-titlebar/main/assets/example.png" width="260px">

For more interesting projects, check out [my homepage💛](https://baendlorel.github.io)

## ✨ Features

- 🎨 **Auto-Generated Colors**: Each workspace gets a unique color based on its folder name
- 🌈 **Wide Color Palette**: 200+ predefined colors ensure visual distinction between projects
- ⚙️ **Customizable Glow Effect**: Adjust intensity, diameter, and position
- 🚀 **Auto-Detection**: Automatically locates VS Code's CSS file across platforms
- 🔄 **Real-time Updates**: Changes apply immediately when switching workspaces
- 🌍 **Multi-language Support**: English and Chinese localization

## 📸 Preview

When you open different projects, the titlebar will display different colored glow effects, making it easy to distinguish between multiple VS Code windows.

## 🚀 Getting Started

### First Time Setup

After installation, the extension will automatically:

1. Try to locate your VS Code installation's `workbench.desktop.main.css` file
2. Inject custom CSS styles into it
3. Prompt you to restart VS Code

> Note: It is normal for VS Code to warn that it is corrupted; this happens whenever the CSS file is modified and can be safely ignored.

**Note**: On first use, you may need to:

- Grant file system permissions
- Manually specify the CSS file path if auto-detection fails

## 🎛️ Configuration

Access settings via `File > Preferences > Settings > JetBrains Titlebar`

### Available Settings

#### `jetbrains-titlebar.glowIntensity`

- **Type**: Number (0-100)
- **Default**: 32
- **Description**: Controls the opacity/intensity of the glow effect

#### `jetbrains-titlebar.glowDiameter`

- **Type**: Number (0-2000)
- **Default/Recommended**: 260
- **Description**: The diameter of the glow effect in pixels

#### `jetbrains-titlebar.glowOffsetX`

- **Type**: Number (0-2000)
- **Default/Recommended**: 120
- **Description**: Horizontal offset of the glow effect from the left edge

#### `jetbrains-titlebar.colorSeed`

- **Type**: String
- **Default**: `""` (empty)
- **Description**: A random seed mixed into the folder name during color calculation. Use this to get different color variations for the same project. For example, if you don't like the current color, try setting it to "1", "2", or any other string to generate a different color.

#### `jetbrains-titlebar.cssPath` —— Auto Managed

- **Type**: Object
- **Default/Recommended**: `{}`
- **Description**: Cached paths to workbench CSS file

## 📋 Commands

Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`) and search for:

### `JetBrains Titlebar: Apply Titlebar Glow Effect`

Applies or re-applies the glow effect to the titlebar. Useful after changing settings.

### `JetBrains Titlebar: Remove Titlebar Glow Effect`

Completely removes the injected CSS styles from VS Code.

### `JetBrains Titlebar: Manually Specify workbench.desktop.main.css Path`

Manually specify the location of VS Code's CSS file if auto-detection fails.

### `JetBrains Titlebar: Auto Detect workbench.desktop.main.css Path`

Re-run auto-detection to find the CSS file path.

## 🔧 How It Works

### Color Generation Algorithm

1. The extension reads your workspace folder name
2. Mixes the color seed (if configured) into the folder name
3. Computes a hash value from the mixed name
4. Maps the hash to one of 200+ predefined colors
5. Generates CSS with a radial gradient effect

### CSS Injection Process

1. Locates VS Code's `workbench.desktop.main.css` file
2. Injects custom CSS rules at the end of the file
3. Uses a unique token to identify and manage injected styles
4. Supports safe removal and re-injection

## 🛠️ Troubleshooting

### Glow effect not showing after restart?

1. Run command: `JetBrains Titlebar: Auto Detect workbench.desktop.main.css Path`
2. If auto-detection fails, use `Manually Specify workbench.desktop.main.css Path`
3. Check that you have write permissions to the CSS file

## ⚠️ Important Notes

- **System Modifications**: This extension modifies VS Code's core CSS file. While safe, you should be aware of this behavior.
- **Updates**: After VS Code updates, you may need to re-apply the glow effect.
- **Permissions**: Requires write access to VS Code's installation directory.
- **Backups**: Consider backing up the CSS file before first use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Kasukabe Tsumugi**

- GitHub: [@baendlorel](https://github.com/baendlorel)
- Email: futami16237@gmail.com
