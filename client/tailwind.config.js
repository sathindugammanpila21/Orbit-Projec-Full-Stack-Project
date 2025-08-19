/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#F0F2F5',
        'text-primary': '#1F2937',
        'text-secondary': '#6B7280',
        'primary-dark': '#1d4ed8',
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
  corePlugins: {
    preflight: false,
  },
}