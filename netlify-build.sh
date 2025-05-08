#!/bin/bash

# Print Node.js and npm versions
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Verify globals.css file
echo "Checking globals.css file..."
cat src/app/globals.css | head -10

# Create a simple postcss.config.js if it doesn't exist
if [ ! -f postcss.config.js ]; then
  echo "Creating postcss.config.js..."
  echo "module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}" > postcss.config.js
fi

# Create a simple tailwind.config.js if it doesn't exist
if [ ! -f tailwind.config.js ]; then
  echo "Creating tailwind.config.js..."
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
echo "Building the application..."
npm run build
