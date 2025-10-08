export const enum Css {
  BackupSuffix = 'bak',
  Token = '\u002F\u002A__COLORFUL_TITLEBAR_KASUKABETSUMUGI__\u002A\u002F',
  Selector = '#workbench\u005C\u002Eparts\u005C\u002Etitlebar::after',
}

export const enum AfterStyle {
  BrightCenter = `${Css.Selector}{
      --kskb-bright-center: 1;
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      transform: translate(-50%, -50%);
      background: linear-gradient(to right, rgba(5, 5, 5, {{darkness}}) 0%, rgba(255, 255, 255, {{brightness}}) 50%, transparent 80%);
      mix-blend-mode: overlay;
      pointer-events: none;
    }`,
  BrightLeft = `${Css.Selector}{
      --kskb-bright-left: 1;
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      width: 100%;
      height: 100%;
      transform: translate(-50%, -50%);
      background: radial-gradient(circle at 15% 50%, rgba(255, 255, 255, {{brightness}}) 0%, transparent 24%, rgba(5, 5, 5, {{darkness}}) 50%, transparent 80%);
      mix-blend-mode: overlay;
      pointer-events: none;
    }`,
  ArcLeft = `${Css.Selector}{
      --kskb-arc-left: 1;
      content: '';
      position: absolute;
      width: 100%;
      height: 125%;
      top: 15%;
      left: 5%;
      background: radial-gradient(ellipse, rgba(255, 255, 255, {{brightness}}) 0%, transparent 72%);
      pointer-events: none;
      mix-blend-mode: overlay;
    }`,
}
