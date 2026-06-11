/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        orange: {
          energy: "#F97316",
          dark: "#EA580C",
          glow: "#FDBA74"
        },
        night: "#0A0A0A",
        surface: "#111827",
        mist: "#9CA3AF"
      },
      fontFamily: {
        heading: ["var(--font-heading)", "Sora", "Space Grotesk", "sans-serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 60px rgba(249, 115, 22, 0.28)",
        soft: "0 24px 80px rgba(0, 0, 0, 0.45)"
      },
      backgroundImage: {
        "radial-energy": "radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.28), transparent 38%)"
      }
    }
  },
  plugins: []
};
