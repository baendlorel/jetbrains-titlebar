import { getColorIndexFromWorkspace } from './utils.js';

/**
 * Inject a marker element into the titlebar to identify the current workspace color
 * This marker will be used by CSS :has() selector to apply the correct glow color
 */
export function injectMarker(): void {
  const colorIndex = getColorIndexFromWorkspace();

  // Remove any existing markers first
  removeTitlebarMarker();

  // Find the titlebar element
  const titlebar = document.querySelector('.part.titlebar');
  if (!titlebar) {
    console.warn('Titlebar element not found');
    return;
  }

  // Create and inject the marker element
  const marker = document.createElement('div');
  marker.className = `jb-titlebar-glow-marker jb-color-${colorIndex}`;
  marker.style.display = 'none'; // Hidden element, only used for CSS selector
  titlebar.appendChild(marker);
}

/**
 * Remove the marker element from the titlebar
 */
export function removeTitlebarMarker(): void {
  const existingMarkers = document.querySelectorAll('.jb-titlebar-glow-marker');
  existingMarkers.forEach((marker) => marker.remove());
}
