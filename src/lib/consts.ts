const enum Css {
  token = '\u002F\u002A__JETBRAINS_TITLEBAR_KASUKABETSUMUGI__\u002A\u002F',
  base = `body:has(#KasukabeTsumugi\u005C\u002Ejetbrains-titlebar) #workbench\u005C\u002Eparts\u005C\u002Etitlebar::before{
        content: '';
        position: absolute;
        width: {{width}}px;
        left: {{offsetX}}px;
        transform: translateX(-50%);
        top: 0;
        height: 100%;
        pointer-events: none;
        opacity: {{opacity}};
        z-index: 1;
      }`,
  template = `body:has(#KasukabeTsumugi\u005C\u002Ejetbrains-titlebar[aria-label="KS{{index}}"]) #workbench\u005C\u002Eparts\u005C\u002Etitlebar::before{
        background: radial-gradient(circle at 50% 0px, {{color}}ff 0%, {{color}}80 40%, transparent 96%);
      }`,
}

// # Default glow parameters
const enum Intensity {
  default = 32,
}

const enum Diameter {
  default = 260,
  min = 0,
}

const enum Offset {
  default = 120,
  min = -10000,
}
