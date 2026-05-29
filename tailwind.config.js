/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hermes: {
          50: 'var(--hermes-50)',
          100: 'var(--hermes-100)',
          200: 'var(--hermes-200)',
          300: 'var(--hermes-300)',
          400: 'var(--hermes-400)',
          500: 'var(--hermes-500)',
          600: 'var(--hermes-600)',
          700: 'var(--hermes-700)',
          800: 'var(--hermes-800)',
          900: 'var(--hermes-900)',
        },
        /* Semantic surface colors */
        surface: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
        },
        /* Semantic text colors */
        content: {
          primary: 'var(--text-primary)',
          secondary: 'var(--text-secondary)',
          tertiary: 'var(--text-tertiary)',
        },
        /* Semantic border colors */
        edge: {
          primary: 'var(--border-primary)',
          secondary: 'var(--border-secondary)',
        },
        /* Sidebar-specific */
        sidebar: {
          DEFAULT: 'var(--bg-sidebar)',
          hover: 'var(--bg-sidebar-hover)',
          active: 'var(--bg-sidebar-active)',
          text: 'var(--text-sidebar)',
          heading: 'var(--text-sidebar-heading)',
          border: 'var(--border-sidebar)',
        },
      },
    },
  },
  plugins: [],
}
