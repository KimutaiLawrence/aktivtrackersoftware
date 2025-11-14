// Theme configuration for centralized styling
export const themeConfig = {
  // Typography - Geist with SF Pro fallback
  typography: {
    fontFamily: {
      sans: [
        '"Geist"',
        '"Geist Sans"',
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
      ]
    },
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.05em' }],      // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }], // 14px
      base: ['1rem', { lineHeight: '1.5rem', letterSpacing: '0' }],          // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }], // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],  // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],    // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.03em' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.04em' }]   // 36px
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  
  // Colors - Black and White System
  colors: {
    // Text Colors
    foreground: '#020817',        // Main text (black)
    'foreground-muted': '#647488', // Muted text (gray)
    
    // Background Colors
    background: '#ffffff',        // White background
    'background-muted': '#f8fafc', // Light gray background
    
    // Border Colors
    border: '#e2e8f0',          // Light border
    'border-muted': '#cbd5e1',   // Muted border
    
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
    
    // Ring (focus) Colors - using primary blue
    ring: '#0071E3',
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
    }
  },
  
  // Spacing
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem'    // 64px
  },
  
  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    DEFAULT: '0.5rem', // 8px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem'       // 16px
  }
}
