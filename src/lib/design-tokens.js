/* =============================================================================
   WEBCOM Design Tokens
   Global color palette and design system
   ============================================================================= */

/* Brand Colors */
export const brand = {
  primary: "#2563eb",
  primaryDark: "#1d4ed8",
  primaryLight: "#dbeafe",
  primaryHover: "#1e40af",
  secondary: "#0ea5e9",
};

/* Semantic Colors */
export const semantic = {
  success: "#10b981",
  successLight: "#ecfdf5",
  successBorder: "#6ee7b7",
  warning: "#f59e0b",
  warningLight: "#fffbeb",
  warningBorder: "#fcd34d",
  danger: "#ef4444",
  dangerLight: "#fef2f2",
  dangerBorder: "#fca5a5",
};

/* Text Colors */
export const text = {
  primary: "#0f172a",
  secondary: "#475569",
  tertiary: "#64748b",
  disabled: "#cbd5e1",
  muted: "#94a3b8",
};

/* Background Colors */
export const background = {
  default: "#f8f9fc",
  secondary: "#f0f2f8",
  paper: "#ffffff",
  elevated: "#fafbfd",
};

/* Border Colors */
export const border = {
  light: "#e2e8f0",
  default: "#cbd5e1",
  strong: "#94a3b8",
};

/* Shadow Colors */
export const shadow = {
  xs: "0 1px 2px rgba(15, 23, 42, 0.05)",
  sm: "0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)",
  md: "0 4px 6px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.06)",
  lg: "0 10px 15px rgba(15, 23, 42, 0.1), 0 4px 6px rgba(15, 23, 42, 0.05)",
  xl: "0 20px 25px rgba(15, 23, 42, 0.1), 0 8px 10px rgba(15, 23, 42, 0.04)",
  "2xl": "0 25px 50px rgba(15, 23, 42, 0.15)",
  brand: "0 4px 12px rgba(37, 99, 235, 0.12)",
  brandDark: "0 4px 14px rgba(37, 99, 235, 0.35)",
  purple: "0 4px 20px rgba(139, 92, 246, 0.25)",
};

/* Typography Scale */
export const typography = {
  fontSize: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.25rem",
    "2xl": "1.5rem",
    "3xl": "1.875rem",
    "4xl": "2.25rem",
    "5xl": "3rem",
  },
  lineHeight: {
    tight: "1.25",
    normal: "1.5",
    relaxed: "1.625",
  },
};

/* Spacing Scale */
export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "2.5rem",
  "3xl": "3rem",
  "4xl": "4rem",
};

/* Border Radius */
export const radius = {
  sm: "0.375rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.25rem",
  "3xl": "1.5rem",
  full: "9999px",
};

/* Transitions */
export const transition = {
  fast: "150ms cubic-bezier(0.4, 0, 0.2, 1)",
  base: "200ms cubic-bezier(0.4, 0, 0.2, 1)",
  slow: "300ms cubic-bezier(0.4, 0, 0.2, 1)",
};

/* CSS Custom Properties to add to globals.css */
export const cssVariables = `
:root {
    /* Brand Colors */
    --brand-primary: #2563eb;
    --brand-primary-dark: #1d4ed8;
    --brand-primary-light: #dbeafe;
    --brand-primary-hover: #1e40af;
    --brand-secondary: #0ea5e9;

    /* Semantic Colors */
    --success: #10b981;
    --success-light: #ecfdf5;
    --success-border: #6ee7b7;
    --warning: #f59e0b;
    --warning-light: #fffbeb;
    --warning-border: #fcd34d;
    --danger: #ef4444;
    --danger-light: #fef2f2;
    --danger-border: #fca5a5;

    /* Text Colors */
    --text-primary: #0f172a;
    --text-secondary: #475569;
    --text-tertiary: #64748b;
    --text-disabled: #cbd5e1;
    --text-muted: #94a3b8;

    /* Background Colors */
    --bg: #f8f9fc;
    --bg-secondary: #f0f2f8;
    --bg-alt: #f0f2f8;
    --paper: #ffffff;
    --paper-elevated: #fafbfd;

    /* Border Colors */
    --border-light: #e2e8f0;
    --border-default: #cbd5e1;
    --border-strong: #94a3b8;

    /* Shadow System */
    --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.05);
    --shadow-sm: 0 1px 3px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04);
    --shadow-md: 0 4px 6px rgba(15, 23, 42, 0.08), 0 2px 4px rgba(15, 23, 42, 0.06);
    --shadow-lg: 0 10px 15px rgba(15, 23, 42, 0.1), 0 4px 6px rgba(15, 23, 42, 0.05);
    --shadow-xl: 0 20px 25px rgba(15, 23, 42, 0.1), 0 8px 10px rgba(15, 23, 42, 0.04);
    --shadow-2xl: 0 25px 50px rgba(15, 23, 42, 0.15);
    --shadow-sm-blue: 0 4px 12px rgba(37, 99, 235, 0.12);
    --shadow-brand: 0 4px 12px rgba(37, 99, 235, 0.12);
    --shadow-brand-dark: 0 4px 14px rgba(37, 99, 235, 0.35);
    --shadow-purple: 0 4px 20px rgba(139, 92, 246, 0.25);

    /* Typography Scale */
    --font-size-xs: 0.75rem;
    --font-size-sm: 0.875rem;
    --font-size-base: 1rem;
    --font-size-lg: 1.125rem;
    --font-size-xl: 1.25rem;
    --font-size-2xl: 1.5rem;
    --font-size-3xl: 1.875rem;
    --font-size-4xl: 2.25rem;
    --font-size-5xl: 3rem;

    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.625;

    /* Spacing Scale */
    --spacing-xs: 0.25rem;
    --spacing-sm: 0.5rem;
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    --spacing-xl: 2rem;
    --spacing-2xl: 2.5rem;
    --spacing-3xl: 3rem;
    --spacing-4xl: 4rem;

    /* Border Radius */
    --radius-sm: 0.375rem;
    --radius-md: 0.5rem;
    --radius-lg: 0.75rem;
    --radius-xl: 1rem;
    --radius-2xl: 1.25rem;
    --radius-3xl: 1.5rem;
    --radius-full: 9999px;

    /* Transitions */
    --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);

    /* Backdrop */
    --nav-bg: rgba(255, 255, 255, 0.94);

    /* Hero Gradients */
    --hero-from: #eff6ff;
    --hero-via: #f5f3ff;
    --hero-to: #fdf4ff;
    --hero-to: #f0f9ff;

    /* Badge Colors */
    --badge-green-bg: #ecfdf5;
    --badge-green-border: #6ee7b7;
    --badge-green-text: #15803d;
    --badge-blue-bg: #eff6ff;
    --badge-blue-border: #93c5fd;
    --badge-blue-text: #1d4ed8;

    /* Line Color (alias) */
    --line: #e2e8f0;
    --card-shadow: rgba(15, 23, 42, 0.08);
    --brand: #2563eb;
    --brand-soft: #eff6ff;
    --brand-dark: #1d4ed8;
    --ink: #0f172a;
}
`;

/* Usage guide:
 *
 * Import in JS files:
 *   import { brand, semantic, typography } from '@/lib/design-tokens';
 *
 * Use in inline styles:
 *   style={{ background: brand.primary }}
 *
 * Use in tailwind arbitrary values:
 *   className="bg-[--brand-primary]"
 *
 * Or use the CSS custom properties directly in CSS:
 *   .my-class { background: var(--brand-primary); }
 */
