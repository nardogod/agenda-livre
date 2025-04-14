module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        "purple-600": "#8B5CF6",
        "purple-700": "#7C3AED",
        "purple-100": "#EDE9FE",
        "purple-50": "#F5F3FF",
        "gray-50": "#F9FAFB",
        "gray-100": "#F3F4F6",
        "gray-200": "#E5E7EB",
        "gray-400": "#9CA3AF",
        "gray-500": "#6B7280",
        "gray-700": "#374151",
        "gray-800": "#1F2937",
        "green-500": "#10B981",
        "green-50": "#ECFDF5",
        "amber-500": "#F59E0B",
        "amber-50": "#FFFBEB",
        "red-500": "#EF4444",
        "red-50": "#FEF2F2",
        "blue-500": "#3B82F6",
        "blue-50": "#EFF6FF",
      },
      borderRadius: {
        "xl": "12px",
      }
    },
  },
  plugins: [],
}
