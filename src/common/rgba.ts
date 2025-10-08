const parseRgba = (s: string | undefined) => {
  s = s?.replace(/\s/g, '') || '';

  const hexMatch = s.match(/^#([0-9a-fA-F]{6})([0-9a-fA-F]{2})?$/);
  if (hexMatch) {
    const hex = hexMatch[1];
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a = hexMatch[2] ? parseInt(hexMatch[2], 16) / 255 : 1;
    return { r, g, b, a, valid: true };
  }

  const rgbaMatch = s.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1], 10);
    const g = parseInt(rgbaMatch[2], 10);
    const b = parseInt(rgbaMatch[3], 10);
    const a = rgbaMatch[4] ? parseFloat(rgbaMatch[4]) : 1;
    return { r, g, b, a, valid: true };
  }

  return { r: 0, g: 0, b: 0, a: 0, valid: false };
};

const toHex = (n: number) => Math.floor(n).toString(16).padStart(2, '0');

/**
 * RGBColor 类用于处理 RGB 颜色。
 * 支持从字符串解析颜色，混合颜色，转换为 hex 字符串等功能。
 */
export default class RGBA {
  /**
   * 生成一个随机的RGB颜色
   */
  static randomRGB() {
    // & 特意和另一个位置的算法不同，理论上都是均匀的
    const set = Array.from({ length: 3 }, () => toHex(Math.random() * 256));
    return `#${set.join('')}`;
  }

  private r: number;
  private g: number;
  private b: number;
  private a: number;

  readonly valid: boolean;

  constructor(s?: string | RGBA) {
    if (s instanceof RGBA) {
      this.r = s.r;
      this.g = s.g;
      this.b = s.b;
      this.a = s.a;
      this.valid = s.valid;
      return;
    }
    const parsed = parseRgba(s);
    this.r = parsed.r;
    this.g = parsed.g;
    this.b = parsed.b;
    this.a = parsed.a;
    this.valid = parsed.valid;
  }

  /**
   * 混合两个颜色，系数代表原本颜色占比
   * - 系数为0代表自己，1代表other，0.5代表各一半
   * @param other 另一个颜色
   * @param factor 系数
   * @returns 新的颜色
   */
  mix(other: RGBA, factor: number) {
    const c = new RGBA();
    c.r = Math.floor(this.r + (other.r - this.r) * factor);
    c.g = Math.floor(this.g + (other.g - this.g) * factor);
    c.b = Math.floor(this.b + (other.b - this.b) * factor);
    c.a = Math.floor(this.a + (other.a - this.a) * factor);
    return c;
  }

  /**
   * 将本颜色输出为hex字符串
   * - `#RRGGBBAA`
   * - 有alpha
   */
  toString() {
    const r = toHex(this.r);
    const g = toHex(this.g);
    const b = toHex(this.b);
    const a = toHex(this.a * 255);
    return `#${r}${g}${b}${a}`;
  }

  /**
   * 将本颜色输出为hex字符串
   * - `#RRGGBB`
   * - 不含alpha
   */
  toRGBString() {
    const r = toHex(this.r);
    const g = toHex(this.g);
    const b = toHex(this.b);
    return `#${r}${g}${b}`;
  }

  /**
   * 将本颜色输出为极简的hex字符串
   * - `RRGGBB`或`RGB`
   * - 不含`#`
   * - 不含alpha
   */
  toRGBShort() {
    const r = toHex(this.r);
    const g = toHex(this.g);
    const b = toHex(this.b);
    if (r[0] === r[1] && g[0] === g[1] && b[0] === b[1]) {
      // 如果每个颜色通道的两个字符相同，则可以缩短为单个字符
      return `${r[0]}${g[0]}${b[0]}`;
    }
    return `${r}${g}${b}`;
  }

  /**
   * 将本颜色变灰变暗后输出为hex字符串
   * @param intensity 烈度，数值越大越灰越暗
   */
  toGreyDarkenString(intensity?: number) {
    // 这个默认值是测试的结果，灰度比较满意
    intensity = intensity ?? 0.56;

    // intensity 越大，越灰且越暗，建议 0.1 ~ 0.5
    const gray = (this.r + this.g + this.b) / 3;

    const mix = (channel: number) => {
      const darker = channel * (1 - intensity);
      const grayer = gray * intensity;
      return Math.round(darker + grayer);
    };

    const r = toHex(mix(this.r));
    const g = toHex(mix(this.g));
    const b = toHex(mix(this.b));
    const a = toHex(this.a * 255);
    return `#${r}${g}${b}${a}`;
  }
}
