export interface ColorPreset {
  name: string;
  bg: string;
  duotone: string;
}

export const COLOR_PRESETS: ColorPreset[] = [
  // High contrast complementary (user favorite)
  { name: 'Purple Gold', bg: '#4A1B6D', duotone: '#D4B255' },
  // Tonal: same-hue variations (darkened)
  { name: 'Ocean Mist', bg: '#062C2C', duotone: '#81D1D1' },
  { name: 'Plum Rose', bg: '#2C0E27', duotone: '#D8A2BF' },
  { name: 'Forest Sage', bg: '#10231A', duotone: '#A6BFA6' },
  // Analogous: nearby hues (darkened)
  { name: 'Midnight Peach', bg: '#0E1626', duotone: '#E6BFA6' },
  { name: 'Wine Blush', bg: '#2C0E1A', duotone: '#DFBBBB' },
  // New: pink/purple backgrounds with blue duotones
  { name: 'Pink Azure', bg: '#5A1238', duotone: '#5C9DC4' },
  { name: 'Violet Sky', bg: '#2E1548', duotone: '#6A9FC8' },
];
