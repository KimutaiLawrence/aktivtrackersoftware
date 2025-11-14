# Theme Usage Guide

This document explains how to use the centralized theme configuration for colors, typography, and spacing.

## Typography

### Font Family
The system uses **SF Pro Display** and **SF Pro Text** as primary fonts:
- **Sans-serif**: `"SF Pro Display", "SF Pro Text", -apple-system, BlinkMacSystemFont, system-ui, ...`
- **Monospace**: `"SF Mono", Monaco, Menlo, Consolas, ...`

**Note**: 
- On macOS and iOS devices, SF Pro fonts are automatically used via the system font stack
- To use SF Pro fonts on all platforms, you can self-host them (see `src/assets/fonts/README.md`)
- SF Pro Display is optimized for headings and large text
- SF Pro Text is optimized for body text and smaller text

### Font Sizes
Use Tailwind classes:
- `text-xs` - 12px (0.75rem)
- `text-sm` - 14px (0.875rem) - **Recommended for labels**
- `text-base` - 16px (1rem)
- `text-lg` - 18px (1.125rem)
- `text-xl` - 20px (1.25rem)
- `text-2xl` - 24px (1.5rem) - **Recommended for titles**
- `text-3xl` - 30px (1.875rem)
- `text-4xl` - 36px (2.25rem)

### Font Weights
- `font-normal` - 400
- `font-medium` - 500 - **Recommended for labels**
- `font-semibold` - 600
- `font-bold` - 700 - **Recommended for titles**

## Colors

### Text Colors
- `text-foreground` - Main text color (#020817 - black)
- `text-foreground-muted` - Muted text color (#647488 - gray)

**Examples:**
```html
<!-- Title -->
<h1 class="text-2xl font-bold text-foreground">Welcome to AS United</h1>

<!-- Label -->
<label class="text-sm font-medium text-foreground">Email or Username</label>

<!-- Muted text -->
<p class="text-sm text-foreground-muted">Digital Operations Platform</p>
```

### Background Colors
- `bg-background` - White background (#ffffff)
- `bg-background-muted` - Light gray background (#f8fafc)
- `bg-card` - Card background (#ffffff)
- `bg-muted` - Muted background (#f8fafc)

### Border Colors
- `border-border` - Light border (#e2e8f0)
- `border-border-muted` - Muted border (#cbd5e1)

### Primary Colors
- `bg-primary` - Primary button background (#2563EB)
- `text-primary-foreground` - Text on primary buttons (#ffffff)
- `bg-primary/90` - Primary hover state

### Input Colors
- `border-input` - Input border (#e2e8f0)
- `bg-background` - Input background (#ffffff)
- `placeholder:text-foreground-muted` - Placeholder text

## Example: Login Form Styling

Based on the reference design:

```html
<!-- Card Container -->
<div class="rounded-lg border border-border bg-card shadow-sm">
  <!-- Header -->
  <div class="flex flex-col space-y-1.5 p-6 text-center">
    <div class="tracking-tight text-2xl font-bold text-foreground">
      Welcome to AS United
    </div>
    <div class="text-sm text-foreground-muted">
      Digital Operations Platform for AS United PTE LTD
    </div>
  </div>
  
  <!-- Form -->
  <div class="p-6 pt-0">
    <form class="space-y-4">
      <!-- Input Field -->
      <div class="space-y-2">
        <label class="text-sm font-medium text-foreground leading-none">
          Email or Username
        </label>
        <input 
          type="text"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-foreground-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          placeholder="Enter your email or username"
        />
      </div>
      
      <!-- Button -->
      <button 
        type="submit"
        class="inline-flex items-center justify-center rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
      >
        Sign In
      </button>
    </form>
  </div>
</div>
```

## Using Theme Config in Components

You can also import the theme config directly:

```javascript
import { themeConfig } from '@/config/theme.js'

// Access colors
const textColor = themeConfig.colors.foreground
const mutedColor = themeConfig.colors['foreground-muted']

// Access typography
const fontFamily = themeConfig.typography.fontFamily.sans
const fontSize = themeConfig.typography.fontSize.sm
```

## CSS Variables

All theme values are also available as CSS variables in `style.css`:

```css
/* Text Colors */
--foreground: #020817;
--foreground-muted: #647488;

/* Background Colors */
--background: #ffffff;
--background-muted: #f8fafc;

/* Primary Colors */
--primary: #2563EB;
--primary-foreground: #ffffff;
```

Use in CSS:
```css
.my-custom-class {
  color: var(--foreground);
  background: var(--background);
}
```

