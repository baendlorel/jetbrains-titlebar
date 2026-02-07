declare const enum Css {
  // & use unicode to have precise strings, and avoid collision of real comments
  token = '\u002F\u002A__JETBRAINS_TITLEBAR_KASUKABETSUMUGI__\u002A\u002F',
  tokenVersion = '\u002F\u002A__VERSION__\u002A\u002F',
  tokenDate = '\u002F\u002A__DATE_TIME__\u002A\u002F',
  base = `body:has(#{{id}}) #workbench\u005C\u002Eparts\u005C\u002Etitlebar::before{
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
  template = `body:has(#{{id}}[aria-label="{{index}}"]) #workbench\u005C\u002Eparts\u005C\u002Etitlebar::before{
        background: radial-gradient(circle at 50% 50%, {{color}}ff 0%, {{color}}80 40%, transparent 96%);
      }`,
  projectInitial = `
  body:has(#{{id}}) .menubar[role="menubar"]{
    margin-left: 30px !important;
  }
  #KasukabeTsumugi\u005C\u002Ejetbrains-titlebar\u005C\u002Eproject-initials{
    position: fixed;
    border-radius: 5px;
    left: 36px;
    top: 6.5px;
    height: 21px;
    padding: 1.5px 0px;
    background-color: #f7f8fa28;
  }
  #KasukabeTsumugi\u005C\u002Ejetbrains-titlebar\u005C\u002Eproject-initials .statusbar-item-label{
    padding: 0 2.5px !important;
    color: #f7f8faaf !important;
  }  
  `,
}

// # Default glow parameters
declare const enum Intensity {
  default = 32,
}

declare const enum Diameter {
  default = 260,
  min = 0,
}

declare const enum Offset {
  default = 120,
  min = -10000,
}
