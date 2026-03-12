const GLOW_COLOR_COUNT = 36;

function hslToHex(hue: number, saturation: number, lightness: number): string {
  const s = saturation / 100;
  const l = lightness / 100;
  const chroma = (1 - Math.abs(2 * l - 1)) * s;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - chroma / 2;

  let red = 0;
  let green = 0;
  let blue = 0;

  if (hue < 60) {
    [red, green, blue] = [chroma, x, 0];
  } else if (hue < 120) {
    [red, green, blue] = [x, chroma, 0];
  } else if (hue < 180) {
    [red, green, blue] = [0, chroma, x];
  } else if (hue < 240) {
    [red, green, blue] = [0, x, chroma];
  } else if (hue < 300) {
    [red, green, blue] = [x, 0, chroma];
  } else {
    [red, green, blue] = [chroma, 0, x];
  }

  const toHex = (value: number) => Math.round((value + m) * 255).toString(16).padStart(2, '0');
  return `#${toHex(red)}${toHex(green)}${toHex(blue)}`;
}

/**
 * CSS colors array
 */
export const GLOW_COLORS = Array.from({ length: GLOW_COLOR_COUNT }, (_, index) =>
  hslToHex((index * 360) / GLOW_COLOR_COUNT, 100, 46),
);

export const INITIAL_GLOW_COLORS = Array.from({ length: GLOW_COLOR_COUNT }, (_, index) =>
  hslToHex((index * 360) / GLOW_COLOR_COUNT, 100, 28),
);
