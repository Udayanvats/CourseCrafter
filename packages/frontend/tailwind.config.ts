import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    'node_modules/preline/dist/*.js'
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        animatedgradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s linear infinite",
        gradient: 'animatedgradient 6s ease infinite alternate',
      },
      backgroundSize: {
        '300%': '300%',
      },
      
      colors:{
        background:"#0F0F0F",
        primary:"#6366f1",
        secondaryBackground:"#191919"

      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(to right, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3))',
        'gradient-secondary': 'linear-gradient(to right, rgba(99, 102, 241, 0.4), rgba(168, 85, 247, 0.4))',
        'gradient-full': 'linear-gradient(to right, rgba(99, 102, 241, 1), rgba(168, 85, 247, 1))',


      },

    },


  },
  plugins: [require("tailwindcss-animate"),require("daisyui"),require('preline/plugin')],
} satisfies Config

export default config