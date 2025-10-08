const enum Css {
  token = '\u002F\u002A__JETBRAINS_TITLEBAR_KASUKABETSUMUGI__\u002A\u002F',
  // CSS template with :has() selector to target titlebar based on injected element's class
  template = `body:has(#KasukabeTsumugi.jetbrains-titlebar[aria-label="KS{{index}}"]) #workbench\u005C\u002Eparts\u005C\u002Etitlebar::before{
        content: '';
        position: absolute;
        width: 200px;
        height: 125%;
        top: -12.5%;
        left: 0;
        background: radial-gradient(ellipse at left, {{color}}80 0%, {{color}}40 30%, transparent 72%);
        pointer-events: none;
        z-index: 1;
      }`,
}
