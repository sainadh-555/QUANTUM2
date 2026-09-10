/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        quantum: {
          bg: '#050711',
          panel: '#0c1024',
          card: '#131b3b',
          border: 'rgba(255, 255, 255, 0.08)',
          cyan: '#00f2fe',
          blue: '#4facfe',
          purple: '#7f00ff',
          violet: '#a855f7',
          pink: '#ec4899',
          glow: 'rgba(0, 242, 254, 0.15)',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'quantum-grid': 'radial-gradient(circle, rgba(0, 242, 254, 0.05) 1px, transparent 1px)',
        'quantum-glow': 'radial-gradient(circle at 50% 0%, rgba(79, 172, 254, 0.12), transparent 70%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow-pulse': 'glow 3s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(0, 242, 254, 0.2)' },
          '100%': { boxShadow: '0 0 25px rgba(0, 242, 254, 0.6)' },
        }
      }
    },
  },
  plugins: [],
}
