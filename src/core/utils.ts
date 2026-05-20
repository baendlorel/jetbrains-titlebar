import { workspace } from 'vscode';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

import { COLORS } from '@/lib/colors';
import { projectName } from '@/lib/config';

/**
 * 1. try to get a non-null result from `f0s` in order, if all return null/undefined, return null
 * 2. if got a non-null result, pass it to all `f1s` in order, then return the result
 */
export function nullReturn<T, A extends any[]>(
  f0s: Array<((...arg: A) => Promise<T | null>) | ((...arg: A) => T | null)>,
  f1s: Array<(arg: T) => any>,
) {
  return async (...arg: A): Promise<T | null> => {
    let r: T | null = null;
    for (let i = 0; i < f0s.length; i++) {
      r = await f0s[i](...arg);
      if (r !== null && r !== undefined) {
        break;
      }
    }
    if (r === null || r === undefined) {
      return null;
    }

    for (let i = 0; i < f1s.length; i++) {
      await f1s[i](r);
    }
    return r;
  };
}

export const hashIndex = (input: string): number => {
  const hash = createHash('sha1').update(input).digest();
  const n = (BigInt(hash.readUInt32BE(0)) << 32n) | BigInt(hash.readUInt32BE(4));
  const r = Number(n & 0x7fffffffffffffffn); // Keep it positive
  return r % COLORS.length;
};

/**
 * Return 1 char if the first char is CJK, otherwise return up to 2 chars.
 */
export const getProjectInitials = (): string => {
  const name = projectName();

  if (!name) {
    return '';
  }

  if (/[\u4e00-\u9fff\u3400-\u4dbf\uf900-\ufaff]/.test(name[0])) {
    return name[0];
  }

  const normalized = name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[._\-\\/]+/g, ' ')
    .replace(/\s+/g, ' ');
  const tokens = normalized.split(' ').filter(Boolean);
  const initials: string[] = [];

  for (const token of tokens) {
    if (initials.length >= 2) {
      break;
    }
    const match = token.match(/[\p{L}\p{N}]/u);
    if (match) {
      initials.push(match[0]);
    }
  }

  if (initials.length >= 2) {
    return initials.slice(0, 2).join('').toLocaleUpperCase();
  }

  const fallback = Array.from(name.matchAll(/[\p{L}\p{N}]/gu), (m) => m[0]);
  if (fallback.length === 0) {
    return '';
  }

  return fallback.slice(0, 2).join('').toLocaleUpperCase();
};

export const clamp = (n: number, min: number, max: number): number => (n <= min ? min : n >= max ? max : n);
export const safeInt = (n: number, defaultValue: number): number => {
  n = Math.floor(n);
  return Number.isSafeInteger(n) ? n : defaultValue;
};
