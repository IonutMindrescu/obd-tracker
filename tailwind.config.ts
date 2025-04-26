import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        white: '#FFFFFF',
        black: '#000000',
        primary: '#FFD771',
        'app-background': '#222831',
        'app-secondary': '#393E46',
        'app-secondary-text': '#AAADBB',
        'app-primary-color': '#FFD369',
        'app-botton': '#F6B17A',
        'purple-100': '#7077A1',
        'button-border': '#00000066',
      },
    },

    fontFamily: {
      sen: ['Sen', 'sans-serif'],
    },

    fontSize: {
      '3xs': '0.625rem', // 10px
      '2xs': '0.75rem', // 12px
      xs: '0.875rem', // 14px
      sm: '1rem', // 16px
      md: '1.25rem', // 20px
      '2md': '1.375rem', // 22px
      lg: '1.5rem', // 24px
      xl: '1.75rem', // 28px
      '2xl': '2rem', // 32px
      '3xl': '3rem', // 48px
      '4xl': '3.75rem', // 60px
      '5xl': '5rem', // 80px
    },

    boxShadow: {
      xs: '0px 1px 2px 0px rgba(16, 24, 40 / 0.05)',
      sm: '0px 1px 2px 0px rgba(16, 24, 40 / 0.06), 0px 1px 3px 0px rgba(16, 24, 40 / 0.10);',
      md: '0px 2px 4px -2px rgba(16, 24, 40 / 0.06), 0px 4px 8px -2px rgba(16, 24, 40 / 0.10)',
      DEFAULT:
        '0px 2px 4px -2px rgba(16, 24, 40 / 0.06), 0px 4px 8px -2px rgba(16, 24, 40 / 0.10)',
      lg: '0px 4px 6px -2px rgba(16, 24, 40 / 0.03), 0px 12px 16px -4px rgba(16, 24, 40 / 0.08)',
      xl: '0px 8px 8px -4px rgba(16, 24, 40 / 0.03), 0px 20px 24px -4px rgba(16, 24, 40 / 0.08)',
      '2xl': '0px 24px 48px -12px rgba(16, 24, 40 / 0.18)',
      '3xl': '0px 32px 64px -12px rgba(16, 24, 40 / 0.14)',
      none: 'none',
    },
    spacing: {
      px: '1px',
      0: '0px',
      0.5: '0.125rem',
      1: '0.25rem',
      1.5: '0.375rem',
      2: '0.5rem',
      2.5: '0.625rem',
      3: '0.75rem',
      3.5: '0.875rem',
      4: '1rem',
      5: '1.25rem',
      6: '1.5rem',
      7: '1.75rem',
      8: '2rem',
      9: '2.25rem',
      10: '2.5rem',
      11: '2.75rem',
      12: '3rem',
      14: '3.5rem',
      15: '3.75rem',
      16: '4rem',
      17: '4.25rem',
      18: '4.5rem',
      19: '4.75rem',
      20: '5rem',
      24: '6rem',
      28: '7rem',
      32: '8rem',
      36: '9rem',
      40: '10rem',
      44: '11rem',
      48: '12rem',
      52: '13rem',
      56: '14rem',
      60: '15rem',
      64: '16rem',
      72: '18rem',
      80: '20rem',
      96: '24rem',
    },
  },
  plugins: [],
};

export default config;
