class:part titlebar inactive
id:workbench.parts.titlebar

---

现在我要实现一个在 vscode 标题栏左侧位置显示光晕的效果。这需要注入 workbench.desktop.main.css 文件实现。请你：

1. 最好能实现自动搜索 workbench.desktop.main.css 可能出现的位置，但我不确定在不同操作系统里，它会在哪里
2. 如果不能自动搜索到，就让用户手动输入路径
3. 注入用的函数是 src/core/hacker.ts 里的 apply 方法。但是它还不完整，等会我会说到
4. 因为标题栏只能拥有一个样式，且标题栏样式无法在插件运行的时候动态更改。我觉得应该选择创建一个页面元素的方法，再让 css 选择器用 has 之类的指令，来实现选中它。我的初步想法是，根据项目文件夹名字计算出一个颜色，找到颜色对应的 class，然后用 has 之类的选择器选中包含这个 class 的标题栏。以此来指定标题栏的光晕颜色。

---

现在我想增加个新功能：还原jetbrains的ide系列的左上角的项目名缩写。它会给出两个字母，然后某种颜色的圆角矩形背景。我觉得你可以注入css，对这个样式：window-appicon操作，首先调整其宽度，再用::after做出伪元素。但是具体如何实现两个字母，我觉得要再议。你先写好：1、注入window-appicon的const enum；2、提取项目名中的两个字母，规则和jetbrains系列一样。

---

git分支名字可以创建第二个渐变在整个标题栏中间或者别的什么地方

---

新增一个选项，要求：1、这个选项决定了是否要显示新功能的projectinital。如果
