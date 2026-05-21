import { Disposable, StatusBarAlignment, StatusBarItem, window } from 'vscode';
import { getProjectInitials as getAbbr, hashIndex } from './utils.js';
import { config, projectName } from '@/lib/config.js';

export const MARKER_ITEM_ID = 'marker';
export const ABBR_ITEM_ID = 'project-initials';

const MARKER_ITEM_NAME = 'JetBrains Titlebar Marker';
const ABBR_ITEM_NAME = 'JetBrains Titlebar Project Initials';

const setAbbrItemText = () => {
  if (!abbrItem) {
    return;
  }

  abbrItem.text = getAbbr();
  abbrItem.tooltip = projectName();
};

const disposeAbbrStatusBarItem = () => {
  if (!abbrItem) {
    return;
  }

  abbrItem.dispose();
  abbrItem = null;
};

const createAbbrStatusBarItem = () => {
  if (abbrItem) {
    return;
  }

  abbrItem = window.createStatusBarItem(ABBR_ITEM_ID, StatusBarAlignment.Left, -Infinity);
  abbrItem.name = ABBR_ITEM_NAME;
  abbrItem.color = '#f7f8faaf';
  setAbbrItemText();
  abbrItem.show();
};

export const updateMarker = () => {
  statusBarItem.text = getColorIndex().toString();
  statusBarItem.tooltip = projectName();

  syncMarker();
  setAbbrItemText();
};

const syncMarker = () => {
  if (config().get('showProjectInitials', true)) {
    createAbbrStatusBarItem();
    return;
  }

  disposeAbbrStatusBarItem();
};

const getColorIndex = (): number => {
  const name = projectName();

  // Mix in color seed if configured
  const colorSeed = config().get('colorSeed', '');
  const mixedName = colorSeed ? `${name}::${colorSeed}` : name;

  return hashIndex(mixedName);
};

export const statusBarItem = window.createStatusBarItem(MARKER_ITEM_ID, StatusBarAlignment.Left, -Infinity);
statusBarItem.name = MARKER_ITEM_NAME;
let abbrItem: StatusBarItem | null = null;

export const markerItemsDisposable = Disposable.from(statusBarItem, {
  dispose: disposeAbbrStatusBarItem,
});

updateMarker();
statusBarItem.color = 'transparent';
statusBarItem.show();
syncMarker();
