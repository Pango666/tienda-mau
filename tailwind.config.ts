import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "#18221D",
        "surface": "#18221D",
        "surface-container-lowest": "#101814",
        "surface-container-low": "#1C2A24",
        "surface-container": "#21312A",
        "surface-container-high": "#273A31",
        "surface-container-highest": "#2C4238",
        "surface-variant": "#273A31",
        "surface-dim": "#101814",
        "surface-bright": "#2C4238",
        
        "on-background": "#F4F1EA",
        "on-surface": "#F4F1EA",
        "on-surface-variant": "#B5C0BA",
        
        "primary": "#F4F1EA",
        "on-primary": "#18221D",
        "primary-container": "#F4F1EA",
        "on-primary-container": "#18221D",
        "primary-fixed": "#F4F1EA",
        "on-primary-fixed": "#18221D",
        "primary-fixed-dim": "#D8D1C1",
        "on-primary-fixed-variant": "#21312A",
        
        "secondary": "#966A45",
        "on-secondary": "#FFFFFF",
        "secondary-container": "#966A45",
        "on-secondary-container": "#FFFFFF",
        "secondary-fixed": "#966A45",
        "on-secondary-fixed": "#FFFFFF",
        "secondary-fixed-dim": "#A87B56",
        "on-secondary-fixed-variant": "#FFFFFF",
        
        "tertiary": "#B88B5D",
        "on-tertiary": "#FFFFFF",
        "tertiary-container": "#B88B5D",
        "on-tertiary-container": "#FFFFFF",
        "tertiary-fixed": "#B88B5D",
        "on-tertiary-fixed": "#18221D",
        "tertiary-fixed-dim": "#C89E73",
        "on-tertiary-fixed-variant": "#302213",
        
        "outline": "#966A45",
        "outline-variant": "#3C5448",
        
        "inverse-surface": "#F4F1EA",
        "inverse-on-surface": "#18221D",
        "inverse-primary": "#18221D",
        
        "error": "#ffb4ab",
        "error-container": "#93000a",
        "on-error": "#690005",
        "on-error-container": "#ffdad6",
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        full: "9999px",
      },
      spacing: {
        "space-md": "1rem",
        "margin-tablet": "2rem",
        "space-xl": "2.5rem",
        "space-sm": "0.5rem",
        "margin-desktop": "3rem",
        "space-lg": "1.5rem",
        "gutter-desktop": "1.5rem",
        "margin": "1rem",
        "space-xs": "0.25rem",
        "gutter": "1rem",
      },
      fontFamily: {
        "label-mono": ["Space Mono"],
        "headline-lg": ["Syne"],
        "headline-md": ["Syne"],
        "display-xl-mobile": ["Syne"],
        "display-xl": ["Syne"],
        "label-caps": ["Syne"],
        "headline-lg-mobile": ["Syne"],
        "headline-sm": ["Syne"],
        "body-md": ["Plus Jakarta Sans"],
        "body-lg": ["Plus Jakarta Sans"],
        "body-sm": ["Plus Jakarta Sans"],
      },
      fontSize: {
        "label-mono": ["11px", { lineHeight: "14px", letterSpacing: "0.05em", fontWeight: "700" }],
        "headline-lg": ["48px", { lineHeight: "52px", letterSpacing: "-0.03em", fontWeight: "700" }],
        "headline-md": ["28px", { lineHeight: "34px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "display-xl-mobile": ["44px", { lineHeight: "48px", letterSpacing: "-0.03em", fontWeight: "800" }],
        "display-xl": ["84px", { lineHeight: "88px", letterSpacing: "-0.04em", fontWeight: "800" }],
        "label-caps": ["12px", { lineHeight: "14px", letterSpacing: "0.12em", fontWeight: "800" }],
        "headline-lg-mobile": ["32px", { lineHeight: "36px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "headline-sm": ["20px", { lineHeight: "26px", letterSpacing: "-0.01em", fontWeight: "600" }],
        "body-md": ["15px", { lineHeight: "24px", letterSpacing: "0em", fontWeight: "400" }],
        "body-lg": ["18px", { lineHeight: "28px", letterSpacing: "-0.01em", fontWeight: "400" }],
        "body-sm": ["13px", { lineHeight: "20px", letterSpacing: "0.01em", fontWeight: "400" }],
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 24s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
