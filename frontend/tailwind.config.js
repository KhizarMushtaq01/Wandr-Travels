/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        w: {
          dark:   '#080810',
          navy:   '#0d1628',
          blue:   '#132040',
          mid:    '#1a3060',
          accent: '#e8c27a',
          gold:   '#d4a843',
          text:   '#c8d6e8',
          muted:  '#6b8ab8',
          border: '#1e3256',
          card:   '#0f1a2e',
        },
        wandr: {
          dark:   '#080810',
          navy:   '#0d1628',
          blue:   '#132040',
          mid:    '#1a3060',
          accent: '#e8c27a',
          gold:   '#d4a843',
          text:   '#c8d6e8',
          muted:  '#6b8ab8',
          border: '#1e3256',
          card:   '#0f1a2e',
        }
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"Cabinet Grotesk"', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.6s ease-out both',
        'slide-up':   'slideUp 0.7s ease-out both',
        'slide-left': 'slideLeft 0.7s ease-out both',
        'slide-down': 'slideDown 0.2s ease-out both',
        'scale-in':   'scaleIn 0.5s ease-out both',
        'float':      'float 8s ease-in-out infinite',
        'drift':      'drift 20s linear infinite',
        'shimmer':    'shimmer 2.5s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn:    { from: { opacity: 0 },                             to: { opacity: 1 } },
        slideUp:   { from: { opacity: 0, transform: 'translateY(32px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        slideLeft: { from: { opacity: 0, transform: 'translateX(32px)' }, to: { opacity: 1, transform: 'translateX(0)' } },
        slideDown: { from: { opacity: 0, transform: 'translateY(-8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn:   { from: { opacity: 0, transform: 'scale(0.9)' },    to: { opacity: 1, transform: 'scale(1)' } },
        float:     { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-12px)' } },
        drift:     { from: { transform: 'translateX(0) rotate(0deg)' }, to: { transform: 'translateX(-50%) rotate(360deg)' } },
        shimmer:   { '0%,100%': { opacity: 0.4 }, '50%': { opacity: 1 } },
        glowPulse: { '0%,100%': { boxShadow: '0 0 20px rgba(232,194,122,0.1)' }, '50%': { boxShadow: '0 0 60px rgba(232,194,122,0.3)' } },
      }
    }
  },
  plugins: [],
}
