#!/bin/bash

# Install dependencies with legacy peer deps
npm install --legacy-peer-deps

# Create a simple postcss.config.js if it doesn't exist
if [ ! -f postcss.config.js ]; then
  echo "module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}" > postcss.config.js
fi

# Create a simple tailwind.config.js if it doesn't exist
if [ ! -f tailwind.config.js ]; then
  echo "/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}" > tailwind.config.js
fi

# Build the application
SKIP_INSTALL_DEPS=1 npm run build
