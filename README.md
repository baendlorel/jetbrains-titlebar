# JetBrains Style Titlebar

**English** | [中文](README.zh-cn.md)

A VS Code extension that adds a colorful glow effect to the titlebar, automatically generating unique colors based on your workspace name — inspired by JetBrains IDEs.

<img src="https://raw.githubusercontent.com/baendlorel/jetbrains-titlebar/main/assets/example.png" width="260px">

For more interesting projects, check out [my homepage 💛](https://baendlorel.github.io)

## Release Notes

### v1.6.0 - 2026-05-20
- **Accurate CSS Locating**: Finally managed to find CSS file path accurately across all platforms
- **CJK Character Support**: For project names starting with CJK characters, only 1 character is displayed to prevent overflow
- **FP Refactoring**: Refactored injection and marker modules to be more modular and maintainable

### v1.5.0 
- Simply mis-typed the version number in the last commit, no actual code changes were made

### v1.4.0
- Added `projectInitialColorOffset` setting for color customization

### v1.3.5
- Added prompts for non-writable files

### v1.3.3
- Significantly reduced color count to fix performance issues reported by users

### v1.3.0
- Auto-detect and select CSS file path
- Manual path selection option
- Improved i18n support

### v1.2.0
- Refactored core functionality and code structure

### v1.1.0 - 2026-02-08
- **Project Initials**: Display 2-letter project abbreviation in the titlebar (configurable in settings)

## ✨ Features

- 🎨 **Auto-Generated Colors**: Each workspace gets a unique color based on its folder name
- ⚙️ **Customizable Glow Effect**: Adjust intensity, diameter, and position
- 🚀 **Auto-Detection**: Automatically locates VS Code's CSS file across platforms
- 🔄 **Real-time Updates**: Changes apply immediately when switching workspaces
- 🌍 **Multi-language Support**: English and Chinese localization

## 🚀 Getting Started

### First Time Setup

After installation, the extension will automatically:

1. Try to locate your VS Code installation's `workbench.desktop.main.css` file
2. Inject custom CSS styles into it
3. Prompt you to restart VS Code

> **Note**: VS Code may warn about corruption after CSS modification. This is normal and can be safely ignored.

If auto-detection fails, you may need to:
- Grant file system permissions
- Manually specify the CSS file path

## 🎛️ Configuration

Access settings via `File > Preferences > Settings > JetBrains Titlebar`

### Available Settings

| Setting                     | Type            | Default | Description                                                                                                                |
| --------------------------- | --------------- | ------- | -------------------------------------------------------------------------------------------------------------------------- |
| `glowIntensity`             | Number (0-100)  | 32      | Opacity/intensity of the glow effect                                                                                       |
| `glowDiameter`              | Number (0-2000) | 260     | Diameter of the glow effect in pixels                                                                                      |
| `glowOffsetX`               | Number (0-2000) | 120     | Horizontal offset from the left edge                                                                                       |
| `colorSeed`                 | String          | `""`    | Random seed mixed into folder name for color calculation. Use this to get different color variations for the same project. |
| `projectInitialColorOffset` | Number          | 3       | Color offset for project initials                                                                                          |
| `cssPath`                   | Object          | `{}`    | Cached paths to workbench CSS file (auto-managed)                                                                          |

## 📋 Commands

Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`):

- **JetBrains Titlebar: Apply Titlebar Glow Effect** — Apply or re-apply the glow effect
- **JetBrains Titlebar: Remove Titlebar Glow Effect** — Remove all injected CSS styles
- **JetBrains Titlebar: Manually Specify workbench.desktop.main.css Path** — Manually specify CSS file location
- **JetBrains Titlebar: Auto Detect workbench.desktop.main.css Path** — Re-run auto-detection

## 🔧 How It Works

1. Reads your workspace folder name
2. Mixes in the color seed (if configured)
3. Computes a hash value
4. Maps the hash to a predefined color
5. Generates CSS with a radial gradient effect
6. Injects the CSS into VS Code's stylesheet

## ⚠️ Important Notes

- **System Modifications**: This extension modifies VS Code's core CSS file
- **Updates**: After VS Code updates, you may need to re-apply the glow effect
- **Permissions**: Requires write access to VS Code's installation directory

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 👤 Author

**Kasukabe Tsumugi**

- GitHub: [@baendlorel](https://github.com/baendlorel)
- Email: futami16237@gmail.com
