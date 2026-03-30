/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        'cyber-black': '#0f0f1a',
        'cyber-blue': '#4f8ef7',
        'cyber-cyan': '#4fd1ff',
        'cyber-teal': '#2dd4bf',
        'cyber-green': '#34d399',
        'cyber-amber': '#f59e0b',
        'cyber-red': '#ef4444',
        'cyber-purple': '#8b5cf6',
        'cyber-slate': '#111827',
      },
      fontFamily: {
        mono: ['Space Mono', 'monospace'],
        display: ['Poppins', 'Inter', 'sans-serif'],
        body: ['Inter', 'Poppins', 'sans-serif'],
      },
      gridTemplateColumns: {
        16: 'repeat(16, minmax(0, 1fr))',
      },
      boxShadow: {
        cyan: '0 0 8px #00d4ff88, 0 0 20px #00d4ff22',
        green: '0 0 8px #00ff8888, 0 0 20px #00ff8822',
        amber: '0 0 8px #ffb30088, 0 0 20px #ffb30022',
      },
      animation: {
        'bit-pulse': 'bitPulse 0.45s ease-in-out',
        'glow-pulse': 'glowPulse 1.8s ease-in-out infinite',
        'cursor-blink': 'typingCursor 1s steps(1) infinite',
        'slide-left': 'slideInFromLeft 0.4s ease-in-out',
        'slide-right': 'slideInFromRight 0.4s ease-in-out',
        'slide-top': 'slideInFromTop 0.4s ease-in-out',
        'slide-bottom': 'slideInFromBottom 0.4s ease-in-out',
        flow: 'bitFlow 1.2s linear infinite',
      },
    },
  },
  plugins: [],
};
