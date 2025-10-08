const enum Css {
  token = '\u002F\u002A__JETBRAINS_TITLEBAR_KASUKABETSUMUGI__\u002A\u002F',
  template = `body:has(#KasukabeTsumugi\u005C\u002Ejetbrains-titlebar[aria-label="KS{{index}}"]) #workbench\u005C\u002Eparts\u005C\u002Etitlebar::before{
        content: '';
        position: absolute;
        width: 260px;
        height: 100%;
        background: radial-gradient(ellipse at left, {{color}}40 0%, {{color}}20 30%, transparent 92%);
        pointer-events: none;
        z-index: 1;
      }`,
}
