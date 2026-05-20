import { StatusBarAlignment, StatusBarItem, window } from 'vscode';
import { getProjectInitials as getAbbr, hashIndex } from './utils.js';
import { config, projectName } from '@/lib/config.js';

const createAbbrStatusBarItem = () => {
  if (abbrItem) {
    return;
  }
  abbrItem = window.createStatusBarItem(ABBR_ITEM_ID, StatusBarAlignment.Left, -Infinity);
  abbrItem.color = '#f7f8faaf';
  abbrItem.show();
};

const update = () => {
  statusBarItem.text = getColorIndex().toString();

  syncProjectInitials();
  if (abbrItem) {
    abbrItem.text = getAbbr();
  }
};

const syncProjectInitials = () => {
  if (config().get('showProjectInitials', true)) {
    createAbbrStatusBarItem();
    return;
  }

  if (abbrItem) {
    abbrItem.dispose();
    abbrItem = null;
  }
};

const getColorIndex = (): number => {
  const name = projectName();

  // Mix in color seed if configured
  const colorSeed = config().get('colorSeed', '');
  const mixedName = colorSeed ? `${name}::${colorSeed}` : name;

  return hashIndex(mixedName);
};

export const ABBR_ITEM_ID = 'project-initials';
export const statusBarItem = window.createStatusBarItem(StatusBarAlignment.Left, -Infinity);
let abbrItem: StatusBarItem | null = null;

update();
statusBarItem.color = 'transparent';
statusBarItem.show();
syncProjectInitials();
