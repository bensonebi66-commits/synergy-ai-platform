/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1e3a5f', // Dark blue for header
        accent: '#f97316',  // Orange for buttons
        background: '#171717', // Dark background
        surface: '#262626', // Card surface
        text: '#FFFFFF', // Primary text
        textSecondary: '#A3A3A3', // Secondary text
        border: '#2F2F2F', // Border color
        success: '#10b981', // Success green
        warning: '#f59e0b', // Warning yellow
        error: '#ef4444', // Error red
      },
      borderRadius: {
        'xl': '16px', // Larger rounded corners for cards
      },
      boxShadow: {
        'custom': '0 4px 20px rgba(0, 0, 0, 0.2)', // Custom shadow for depth
      },
    },
  },
  plugins: [],
}
