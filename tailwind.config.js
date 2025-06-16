/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#9333EA', // Primary buttons, active states, and key interactive elements - purple-600
        'primary-hover': '#7E22CE', // Hover state for primary interactive elements - purple-700
        'primary-light': '#F3E8FF', // Backgrounds for selected items, highlights, and secondary indicators - purple-100
        'background': '#09090B', // Main application background - zinc-950
        'surface': '#18181B', // Card backgrounds, modals, and elevated surfaces - zinc-900
        'surface-alt': '#27272A', // Secondary surfaces, hover states for dark elements - zinc-800
        'border': '#3F3F46', // Subtle borders and dividers - zinc-700
        'text-primary': '#FFFFFF', // Primary text content - white
        'text-secondary': '#A1A1AA', // Secondary text, descriptions, and less important information - zinc-400
        'text-disabled': '#71717A', // Placeholder text and disabled content - zinc-500
        'success': '#10B981', // Success states, confirmations, and positive indicators - emerald-500
        'warning': '#F59E0B', // Warnings, alerts that require attention - amber-500
        'error': '#F43F5E', // Error states, destructive actions, and critical alerts - rose-500
        'info': '#0EA5E9', // Informational messages and neutral notifications - sky-500
        'spotify': '#22C55E', // Spotify brand integration elements - green-500
      },
      fontFamily: {
        'sans': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        'display': ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-down': 'slideDown 0.2s ease-out',
        'slide-up': 'slideUp 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}