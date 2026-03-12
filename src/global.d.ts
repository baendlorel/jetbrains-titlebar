export {};

declare global {
  type ConfigName =
    | 'showProjectInitials'
    | 'cssPath'
    | 'glowIntensity'
    | 'glowDiameter'
    | 'glowOffsetX'
    | 'projectInitialColorOffset'
    | 'colorSeed';

  type CommandName = 'applyGlow' | 'removeGlow' | 'manuallyRelocateCssPath' | 'autoRelocateCssPath';
}
