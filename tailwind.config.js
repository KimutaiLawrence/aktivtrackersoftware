/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"SF Pro Display"',
          '"SF Pro Text"',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        mono: [
          '"SF Mono"',
          'Monaco',
          'Menlo',
          'Consolas',
          '"Liberation Mono"',
          '"Courier New"',
          'monospace'
        ],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],
        sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],
        lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.03em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.04em' }]
      },
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700'
      },
      colors: {
        // Text Colors - Black and White System
        foreground: '#020817',
        'foreground-muted': '#647488',
        
        // Background Colors
        background: '#ffffff',
        'background-muted': '#f8fafc',
        
        // Border Colors
        border: '#e2e8f0',
        'border-muted': '#cbd5e1',
        
        // Primary Colors - Apple Blue (#0071E3) with darker shades
        primary: {
          50: '#e6f2ff',
          100: '#b3d9ff',
          200: '#80c0ff',
          300: '#4da7ff',
          400: '#1a8eff',
          500: '#0071E3',  // Base Apple Blue
          600: '#005bb5',  // Darker for menu items
          700: '#004588',  // Even darker
          800: '#00305a',  // Very dark
          900: '#001a2d',  // Darkest
          DEFAULT: '#0071E3',
          foreground: '#ffffff'
        },
        
        // Card Colors
        card: {
          DEFAULT: '#ffffff',
          foreground: '#020817'
        },
        
        // Input Colors
        input: '#e2e8f0',
        
        // Ring (focus) Colors
        ring: '#2563EB',
        'ring-offset': '#ffffff',
        
        // Accent Colors
        accent: {
          DEFAULT: '#f1f5f9',
          foreground: '#020817'
        },
        
        // Muted Colors
        muted: {
          DEFAULT: '#f8fafc',
          foreground: '#647488'
        },
        
        // Keep surface colors for backward compatibility
        surface: {
          0: '#ffffff',
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        },
      },
      borderRadius: {
        none: '0',
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      },
      spacing: {
        xs: '0.5rem',
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem'
      },
      keyframes: {
        slidedown: {
          '0%': { maxHeight: '0', opacity: '0' },
          '100%': { maxHeight: '500px', opacity: '1' }
        },
        slideup: {
          '0%': { maxHeight: '500px', opacity: '1' },
          '100%': { maxHeight: '0', opacity: '0' }
        }
      },
      animation: {
        'slidedown': 'slidedown 0.4s ease-in-out',
        'slideup': 'slideup 0.4s ease-in-out'
      }
    },
  },
  plugins: [],
}
