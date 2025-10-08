class:part titlebar inactive
id:workbench.parts.titlebar

---

现在我要实现一个在 vscode 标题栏左侧位置显示光晕的效果。这需要注入 workbench.desktop.main.css 文件实现。请你：

1. 最好能实现自动搜索 workbench.desktop.main.css 可能出现的位置，但我不确定在不同操作系统里，它会在哪里
2. 如果不能自动搜索到，就让用户手动输入路径
3. 注入用的函数是 src/core/hacker.ts 里的 apply 方法。但是它还不完整，等会我会说到
4. 因为标题栏只能拥有一个样式，且标题栏样式无法在插件运行的时候动态更改。我觉得应该选择创建一个页面元素的方法，再让 css 选择器用 has 之类的指令，来实现选中它。我的初步想法是，根据项目文件夹名字计算出一个颜色，找到颜色对应的 class，然后用 has 之类的选择器选中包含这个 class 的标题栏。以此来指定标题栏的光晕颜色。
