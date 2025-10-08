import { basename } from 'node:path';
import { createHash } from 'node:crypto';

import { HashSource } from '@/common/consts';
import configs from '@/common/configs';
import RGBA from '@/common/rgba';

/**
 * 根据项目名称获取颜色套组
 * @param fullPath 项目目录，用哈希计算出0~1之间的数字`k`
 * @param colorSet 颜色套组从`config`中获取，没有则使用默认套组
 * @returns
 */
export const getColor = (fullPath: string): RGBA => {
  const hashSource = getHashSource(fullPath);
  const hash = Array.from(createHash('md5').update(hashSource).digest());
  // const k = (hash[0] + hash[1] * 0xff) / 0xffff;
  const k = ((hash[0] << 8) | hash[hash.length - 1]) / 0xffff;
  return getColorByK(k);
};

export const getHashSource = (fullPath: string) => {
  switch (configs.hashSource) {
    case HashSource.ProjectName:
      return basename(fullPath);
    case HashSource.FullPath:
      return fullPath;
    case HashSource.ProjectNameDate:
      return new Date().getDate().toString() + basename(fullPath);
    default:
      return basename(fullPath);
  }
};

export const getColorByK = (k: number) => {
  const colorSet = configs.theme === 'dark' ? configs.darkThemeColors : configs.lightThemeColors;
  const n = colorSet.length;
  const a = Math.floor(k * n);
  const b = (a + 1) % n; // 如果不取余数，会在a=length-1时，b=length而提取到undefined，最终解析出黑色
  const factor = (k - a / n) * n;
  const c1 = new RGBA(colorSet[a]);
  const c2 = new RGBA(colorSet[b]);
  return c1.mix(c2, factor);
};
