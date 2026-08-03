/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'hsl(var(--border) / <alpha-value>)',
        input: 'hsl(var(--input) / <alpha-value>)',
        ring: 'hsl(var(--ring) / <alpha-value>)',
        background: 'hsl(var(--background) / <alpha-value>)',
        foreground: 'hsl(var(--foreground) / <alpha-value>)',
        shell: {
          DEFAULT: 'hsl(var(--shell) / <alpha-value>)',
          elevated: 'hsl(var(--shell-elevated) / <alpha-value>)',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
          foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
          foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
          foreground: 'hsl(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          foreground: 'hsl(var(--accent-foreground) / <alpha-value>)',
        },
        brand: {
          DEFAULT: 'hsl(var(--brand) / <alpha-value>)',
        },
        feed: {
          DEFAULT: 'hsl(var(--feed) / <alpha-value>)',
        },
        icon: {
          DEFAULT: 'hsl(var(--icon) / <alpha-value>)',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
          foreground: 'hsl(var(--popover-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT: 'hsl(var(--card) / <alpha-value>)',
          foreground: 'hsl(var(--card-foreground) / <alpha-value>)',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      maxWidth: {
        feed: '680px',
        content: '56rem',
      },
      keyframes: {
        fadeInOut1: {
          '0%': { opacity: '0' },
          '1%': { opacity: '100' },
          '25%': { opacity: '100' },
          '29%': { opacity: '0' },
          '100%': { opacity: '0' },
        },
        fadeInOut2: {
          '0%': { opacity: '0' },
          '24%': { opacity: '0' },
          '25%': { opacity: '100' },
          '50%': { opacity: '100' },
          '54%': { opacity: '0' },
          '100%': { opacity: '0' },
        },
        fadeInOut3: {
          '0%': { opacity: '0' },
          '49%': { opacity: '0' },
          '50%': { opacity: '100' },
          '75%': { opacity: '100' },
          '79%': { opacity: '0' },
          '100%': { opacity: '0' },
        },
        fadeInOut4: {
          '0%': { opacity: '0' },
          '74%': { opacity: '0' },
          '75%': { opacity: '100' },
          '99%': { opacity: '100' },
          '100%': { opacity: '0' },
        },
      },
      animation: {
        loginImage1: 'fadeInOut1 20s ease-in-out infinite',
        loginImage2: 'fadeInOut2 20s ease-in-out infinite',
        loginImage3: 'fadeInOut3 20s ease-in-out infinite',
        loginImage4: 'fadeInOut4 20s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
