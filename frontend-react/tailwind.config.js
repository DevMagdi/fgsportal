import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const palette = require('./src/brand.json');

// Tonal neutrals are mixes of the official primary colours, not a second palette.
function mix(foreground, background, weight) {
  const channel = (hex, offset) => parseInt(hex.slice(offset, offset + 2), 16);
  const values = [1, 3, 5].map((offset) => Math.round(
    channel(foreground, offset) * weight + channel(background, offset) * (1 - weight),
  ).toString(16).padStart(2, '0'));
  return `#${values.join('')}`;
}

const tint = (color, weight) => mix(color, palette.white, weight);
const brand = {
  50: tint(palette.indigo, 0.05), 100: tint(palette.indigo, 0.10),
  200: tint(palette.indigo, 0.20), 300: tint(palette.indigo, 0.40),
  400: tint(palette.indigo, 0.80), 500: palette.indigo, 600: palette.indigo,
  700: palette.indigo, 800: palette.indigo, 900: palette.indigo,
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    // Only the official palette and primary-colour tints are available to utilities.
    colors: {
      transparent: 'transparent', current: 'currentColor', white: palette.white,
      brand, skin: palette.skin, pink: palette.pink, lavender: palette.lavender,
      violet: palette.violet, turquoise: palette.turquoise, cyan: palette.cyan,
      surface: tint(palette.skin, 0.16),
      slate: {
        50: tint(palette.skin, 0.12), 100: tint(palette.skin, 0.25),
        200: tint(palette.skin, 0.55), 300: tint(palette.skin, 0.80),
        400: tint(palette.indigo, 0.90), 500: tint(palette.indigo, 0.92),
        600: tint(palette.indigo, 0.95), 700: palette.indigo,
        800: palette.indigo, 900: palette.indigo, 950: palette.indigo,
      },
    },
    extend: {
      fontFamily: {
        sans: ['Graphik', 'Inter', '"IBM Plex Sans Arabic"', 'system-ui', 'sans-serif'],
      },
      borderRadius: { xl2: '14px' },
      boxShadow: {
        sm: '0 1px 2px rgb(69 67 110 / 0.06)',
        '2xl': '0 24px 50px -12px rgb(69 67 110 / 0.30)',
        card: '0 1px 2px rgb(69 67 110 / 0.04), 0 3px 12px rgb(69 67 110 / 0.035)',
        lift: '0 10px 28px -10px rgb(69 67 110 / 0.22)',
      },
    },
  },
  plugins: [],
};
