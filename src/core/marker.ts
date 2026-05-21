import { StatusBarAlignment, StatusBarItem, window } from 'vscode';
import { getProjectInitials as getAbbr, hashIndex } from './utils.js';
import { config, projectName } from '@/lib/config.js';
import { Disposable } from 'vscode';

const colorIndex = (): string => {
  const name = projectName();
  const colorSeed = config().get('colorSeed', '');
  const mixedName = colorSeed ? `${name}::${colorSeed}` : name;
  return hashIndex(mixedName).toString();
};

const marker = (() => {
  const o = window.createStatusBarItem('marker', StatusBarAlignment.Left, -Infinity);
  o.name = 'JetBrains Titlebar Marker';
  o.color = 'transparent';
  o.text = colorIndex();
  o.tooltip = projectName();
  o.show();
  return o;
})();

const createProjectInitial = (): StatusBarItem => {
  const o = window.createStatusBarItem('project-initials', StatusBarAlignment.Left, -Infinity);
  o.name = 'JetBrains Titlebar Project Initials';
  o.color = '#f7f8faaf';
  o.accessibilityInformation = { label: colorIndex() };
  o.text = getAbbr();
  o.tooltip = projectName();
  o.show();
  return o;
};

let projectInitial: StatusBarItem | null = config().get('showProjectInitials', true) ? createProjectInitial() : null;

export const updateMarkers = () => {
  marker.text = colorIndex();

  const showProjectInitials = config().get('showProjectInitials', true);
  if (projectInitial && showProjectInitials) {
    // be -> be  update color index only
    projectInitial.accessibilityInformation = { label: colorIndex() };
  } else if (projectInitial && !showProjectInitials) {
    // be -> null
    projectInitial.dispose();
    projectInitial = null;
  } else if (!projectInitial && showProjectInitials) {
    // null -> be
    projectInitial = createProjectInitial();
  } else if (!projectInitial && !showProjectInitials) {
    // null -> null, do nothing
  }
};

export const disposeMarkers = Disposable.from({
  dispose: () => {
    marker.dispose();
    projectInitial?.dispose();
  },
});
