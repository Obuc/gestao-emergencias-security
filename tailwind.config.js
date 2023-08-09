/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#00354F',
        'primary-opacity': 'rgba(16, 56, 79, .18)',
        'secondary': '#89D329',
        'background': '#FDFDFD',
        'blue': '#00BCFF',
        'pink': '#FF3162',
      },
      keyframes: {
        overlayShow: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        contentShow: {
          from: { opacity: 0, transform: 'translate(-50%, -48%) scale(0.96)' },
          to: { opacity: 1, transform: 'translate(-50%, -50%) scale(1)' },
        },
        hide: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        slideIn: {
          from: { transform: 'translateX(calc(100% + var(--viewport-padding)))' },
          to: { transform: 'translateX(0)' },
        },
        swipeOut: {
          from: { transform: 'translateX(var(--radix-toast-swipe-end-x))' },
          to: { transform: 'translateX(calc(100% + var(--viewport-padding)))' },
        },
        slideDown: {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        slideUp: {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
      },
      animation: {
        overlayShow: 'overlayShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        contentShow: 'contentShow 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        hide: 'hide 100ms ease-in',
        slideIn: 'slideIn 150ms cubic-bezier(0.16, 1, 0.3, 1)',
        swipeOut: 'swipeOut 100ms ease-out',
        slideDown: 'slideDown 300ms cubic-bezier(0.87, 0, 0.13, 1)',
        slideUp: 'slideUp 300ms cubic-bezier(0.87, 0, 0.13, 1)',
      },
      boxShadow: {
        'xs-app': '0px 0px 2px rgba(0, 0, 0, 0.15)',
        'sm-app': '0px 0px 2px rgba(0, 0, 0, 0.29)',
        'md-app': '0px 0px 6px 0px rgba(0, 0, 0, 0.29)',
        'lg-app': '0px 0px 6px rgba(32, 33, 36, 0.22)',
        'xs-primary-app': '0px 0px 2px 0px rgba(16, 56, 79, 0.16)',
        'sm-primary-app': '0px 0px 4px 0px rgba(16, 56, 79, 0.22)',
        'popover': '0px 0px 20px 0px rgba(126, 126, 126, 0.40)',
      },
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'bg-home': 'linear-gradient(180deg, #09222F 0%, #0C2B3C 100%)',
        'bg-home-2': 'linear-gradient(45deg, #09222F 0%, #0C2B3C 100%);',
        'bg-file': 'linear-gradient(180deg, #D9EFFF 0%, #7EA5FF 100%);'

      }
    },
  },
  plugins: [],
}
