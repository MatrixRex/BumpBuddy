/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        bumpbuddy: {
          primary: "#7970c3",      // Soft Lavender (Dominant Brand Color)
          secondary: "#ffacda",    // Soft Pink (Secondary / Highlights / Warm CTAs)
          accent: "#a8e6cf",       // Mint Green (Checklist success states, badges)
          neutral: "#3d4451",      // Slate Grey for readable text
          "base-100": "#faf8f6",   // Warm off-white background
          info: "#7970c3",
          success: "#a8e6cf",
          warning: "#f3cc30",
          error: "#e58b8b",
        },
      },
    ],
  },
}
