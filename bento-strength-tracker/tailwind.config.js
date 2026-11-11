/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        bentoDark: '#121316',
        bentoCardDark: '#1E2024',
        bentoCardLight: '#F3F4F6',
        bentoBlue: '#E6EFFB',
        bentoBlueAccent: '#2F68D6',
        bentoGraySub: '#8E929C'
      },
      borderRadius: {
        'bento': '28px',
        'bento-sm': '18px'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif']
      }
    }
  },
  plugins: []
};
