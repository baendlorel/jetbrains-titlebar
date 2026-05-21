export const enum Css {
  // & use unicode to have precise strings, and avoid collision of real comments
  tokenOld = '\u002F\u002A__JETBRAINS_TITLEBAR_KASUKABETSUMUGI__\u002A\u002F',
  tokenStart = '\u002F\u002A__JETBRAINS_TITLEBAR_KASUKABETSUMUGI_START__\u002A\u002F',
  tokenEnd = '\u002F\u002A__JETBRAINS_TITLEBAR_KASUKABETSUMUGI_END__\u002A\u002F',
  tokenVersion = '\u002F\u002A__VERSION__\u002A\u002F',
  base = `body:has(#KasukabeTsumugi\\.jetbrains-titlebar\\.marker) #workbench\\.parts\\.titlebar::before{
        width: {{diameter}};
        left: {{offsetX}};
        opacity: {{intensity}};

        content: '';
        position: absolute;
        transform: translateX(-50%);
        top: 0;
        height: 100%;
        pointer-events: none;
        z-index: 1;
      }`,
  template = `body:has(#KasukabeTsumugi\\.jetbrains-titlebar\\.marker[aria-label="{{index}}"]) #workbench\\.parts\\.titlebar::before{
        background: radial-gradient(circle at 50% 50%, {{color}}ff 0%, {{color}}80 40%, transparent 96%);
      }`,
  abbr = `
  body:has(#KasukabeTsumugi\\.jetbrains-titlebar\\.marker) .menubar[role="menubar"]{
    margin-left: 30px !important;
  }
  #KasukabeTsumugi\\.jetbrains-titlebar\\.project-initials{
    position: fixed;
    border-radius: 5px;
    left: 40px;
    top: 6.5px;
    height: 20px;
    width: 24px;
    padding: 1.5px 0px;
    text-align: center;
  }
  #KasukabeTsumugi\\.jetbrains-titlebar\\.project-initials > .statusbar-item-label{
    padding: 0 0px !important;
    color: #f7f8fae6 !important;
    display: block;
    margin-top: -1.3px;
  }`,
  abbrBg = `
  body:has(#KasukabeTsumugi\\.jetbrains-titlebar\\.marker[aria-label="{{index}}"]) #KasukabeTsumugi\\.jetbrains-titlebar\\.project-initials{
    background: {{color}} !important;
  }`,
}

// # Default glow parameters
export const enum Intensity {
  default = 32,
}

export const enum Diameter {
  default = 260,
  min = 0,
}

export const enum Offset {
  default = 120,
  min = -10000,
}
