import { HashSource } from './consts';
import RGBA from './rgba';

class Sanitizer {
  colors(rawColors: RGBA[] | string[] | undefined): RGBA[] | null {
    if (!Array.isArray(rawColors)) {
      return null;
    }

    const colors = rawColors.map((color) => {
      if (color instanceof RGBA) {
        return color;
      } else if (typeof color === 'string') {
        color = color.replace('#', '');

        // 适配所有情况
        if (/^[0-9a-fA-F]{6}$/g.test(color)) {
          color = '#' + color;
        } else if (/^[0-9a-fA-F]{8}$/g.test(color)) {
          color = '#' + color;
        } else if (/^[0-9a-fA-F]{3}$/g.test(color)) {
          color = '#' + color[0].repeat(2) + color[1].repeat(2) + color[2].repeat(2);
        } else if (/^[0-9a-fA-F]{4}$/g.test(color)) {
          color =
            '#' + color[0].repeat(2) + color[1].repeat(2) + color[2].repeat(2) + color[3].repeat(2);
        }

        // 其他情况一定解析不出来，会生成invalid的RGBA对象
        return new RGBA(color);
      } else {
        // 这会生成一个invalid的RGBA对象
        return new RGBA(color);
      }
    });

    return colors.some((c) => !c.valid) ? null : colors;
  }

  percent(value: number | string | undefined): number | null {
    if (typeof value === 'string') {
      value = parseInt(value, 10);
    }
    if (typeof value === 'number' && value >= 0 && value <= 100 && Number.isSafeInteger(value)) {
      return value;
    } else {
      return null;
    }
  }

  hashSource(value: HashSource | string | undefined): HashSource | null {
    if (typeof value === 'string') {
      value = parseInt(value, 10) as HashSource;
    }
    return value === HashSource.ProjectName ||
      value === HashSource.FullPath ||
      value === HashSource.ProjectNameDate
      ? value
      : null;
  }
}

/**
 * 净化器
 * - 用于净化配置数据
 */
const sanitizer = new Sanitizer();
export default sanitizer;
