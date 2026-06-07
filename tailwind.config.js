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
          primary: "#6d64ad",              // Calming Cozy Lavender (Dominant Brand Color)
          "primary-content": "#ffffff",    // Clear white text on primary backgrounds
          secondary: "#e8b7b3",            // Cozy Tea Rose (Secondary Highlights)
          "secondary-content": "#4c1c18",  // Cozy Deep Mahogany text on Tea Rose backgrounds
          accent: "#9ebfa6",               // Cozy Minty Sage (Checklists & Success badges)
          "accent-content": "#213d28",     // Cozy Deep Forest Green text on sage backgrounds
          neutral: "#2b2738",              // Deep Cozy Charcoal for neutral texts
          "neutral-content": "#faf7f2",    // Warm linen text on dark containers
          "base-100": "#faf7f2",           // Warm Linen Off-White background
          "base-content": "#2b2738",       // Cozy Charcoal text on linen background
          info: "#6d64ad",
          success: "#92c2a0",
          warning: "#dfaf50",              // Muted Warm Gold
          error: "#c97f7f",                // Muted Soft Rose-Red
        },
      },
    ],
  },
}
