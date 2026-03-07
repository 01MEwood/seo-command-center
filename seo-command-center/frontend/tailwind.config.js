/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sh: { DEFAULT: '#E8490F', light: '#FF6B3D' },
        ims: { DEFAULT: '#1B7A52', light: '#2EAA72' },
        dark: {
          900: '#0A0A1B',
          800: '#0E0E22',
          700: '#13132A',
          600: '#1E1E3E',
          500: '#22224A',
        },
      },
      fontFamily: {
        display: ['Onest', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
