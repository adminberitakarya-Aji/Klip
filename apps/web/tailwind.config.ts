import type { Config } from "tailwindcss";

// Tailwind CSS v4 - configuration is primarily done via CSS
// This file is kept for compatibility but most config is in globals.css
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
};

export default config;
