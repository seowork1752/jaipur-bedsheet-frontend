/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors - Jaipur Heritage
        'royal-blue': '#0F3A6B',
        'deep-royal': '#0A2A50',
        'maroon': '#8B2E2E',
        'mustard': '#E8B04B',
        'gold': '#D4AF37',
        'beige': '#F5E6D3',
        'cream': '#FFFBF0',
        
        // Functional colors
        'primary': '#0F3A6B',
        'primary-dark': '#0A2A50',
        'accent': '#E8B04B',
        'accent-dark': '#C89A3D',
        'success': '#10B981',
        'warning': '#F59E0B',
        'error': '#EF4444',
      },
      fontFamily: {
        'display': [
          'Playfair Display',
          'Georgia',
          'serif',
        ],
        'body': [
          'Inter',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
        '4xl': '6rem',
      },
      boxShadow: {
        'luxury': '0 10px 30px rgba(15, 58, 107, 0.1)',
        'luxury-lg': '0 20px 50px rgba(15, 58, 107, 0.15)',
        'elevation-1': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'elevation-2': '0 4px 12px rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #0F3A6B 0%, #8B2E2E 50%, #E8B04B 100%)',
        'gradient-soft': 'linear-gradient(135deg, #FFFBF0 0%, #F5E6D3 100%)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.6s ease-in',
        'slideUp': 'slideUp 0.6s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '0.75rem',
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
  ],
};
