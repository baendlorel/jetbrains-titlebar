declare const enum Css {
  token = '\u002F\u002A__JETBRAINS_TITLEBAR_KASUKABETSUMUGI__\u002A\u002F',
  base = `body:has(#KasukabeTsumugi\u005C\u002Ejetbrains-titlebar) #workbench\u005C\u002Eparts\u005C\u002Etitlebar::before{
        content: '';
        position: absolute;
        width: {{diameter}}px;
        left: {{offset}}px;
        transform: translateX(-50%);
        top: 0;
        height: 100%;
        pointer-events: none;
        opacity: {{intensity}};
        z-index: 1;
      }`,
  template = `body:has(#KasukabeTsumugi\u005C\u002Ejetbrains-titlebar[aria-label="KS{{index}}"]) #workbench\u005C\u002Eparts\u005C\u002Etitlebar::before{
          background: radial-gradient(circle at 50% 0px, {{color}}ff 0%, {{color}}80 40%, transparent 96%);
        }`,
}

declare const enum Consts {
  DefaultIntensity = 32,
  DefaultGlowDiameter = 260,
  DefaultGlowOffset = 120,
}
