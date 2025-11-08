import { palette, effects } from './designTokens';

const stickerNormal =
  '0px 0px 0px 0px rgba(0, 0, 0, 0.06), 0px 1px 1px 0px rgba(0, 0, 0, 0.06), 0px 3px 3px 0px rgba(0, 0, 0, 0.06), 0px 0px 1.6px 0px rgba(0, 0, 0, 0.25)';

const paletteByTheme = {
  white: palette.white,
  black: palette.black,
  pink: palette.pink,
  yellow: palette.yellow,
};

const mapPaletteToVariables = ({ main, background, label, fills, separator }) => ({
  'surface---main': main,
  'background---primary': background.primary,
  'background---secondary': background.secondary,
  'label---primary': label.primary,
  'label---secondary': label.secondary,
  'label---tertiary': label.tertiary,
  'label---accent': label.accent,
  'fills---primary': fills.primary,
  'fills---secondary': fills.secondary,
  'fills---non--opaque': fills.nonOpaque,
  'fills---linear-non--opaque': fills.nonOpaqueMain,
  'separator---black-10': separator.black10,
  'separator---white-20': separator.white20,
  'shadows--extra_small': effects.shadows.extraSmall,
  'shadows--small': effects.shadows.small,
  'shadows--normal': effects.shadows.normal,
  'shadows--3d': effects.shadows.big,
  'sticker--normal': stickerNormal,
});

export const themes = Object.entries(paletteByTheme).reduce((acc, [themeName, themePalette]) => {
  acc[themeName] = mapPaletteToVariables(themePalette);
  return acc;
}, {});
