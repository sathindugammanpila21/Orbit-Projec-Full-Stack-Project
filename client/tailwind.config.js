/** @type {import('tailwindcss').Config} */
module.exports = {
  // Tell Tailwind where to look for classes
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        'primary-dark': '#1d4ed8',
        secondary: '#F0F2F5',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },

  plugins: [
    require('@tailwindcss/line-clamp'),
  ],

  corePlugins: {
    // Disable preflight if you are using a different CSS reset
    preflight: false,
  },
};
