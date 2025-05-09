#!/bin/bash

# Print Node.js and npm versions
echo "Node.js version: $(node -v)"
echo "npm version: $(npm -v)"

# Install dependencies
echo "Installing dependencies..."
npm install --legacy-peer-deps

# Fix globals.css file
echo "Fixing globals.css file..."
# Create a temporary file with the correct Tailwind directives
echo "@tailwind base;" > src/app/globals.css.tmp
echo "@tailwind components;" >> src/app/globals.css.tmp
echo "@tailwind utilities;" >> src/app/globals.css.tmp
# Append the rest of the file, skipping any existing Tailwind directives
sed -n '4,$p' src/app/globals.css >> src/app/globals.css.tmp
# Replace the original file
mv src/app/globals.css.tmp src/app/globals.css
# Show the beginning of the fixed file
echo "Fixed globals.css file:"
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

# Ensure public directory exists
echo "Ensuring public directory exists..."
mkdir -p public

# Copy _redirects and _headers to public directory to ensure they're included in the build
echo "Copying _redirects and _headers to public directory..."
if [ -f public/_redirects ]; then
  echo "public/_redirects exists, ensuring it has correct content..."
  # Comment out any existing redirects that might conflict with Next.js
  sed -i 's/^\/\*.*$/# &/' public/_redirects
  # Add the correct redirects if they don't exist
  if ! grep -q "/.netlify/functions/next" public/_redirects; then
    echo "/* /.netlify/functions/next 200" >> public/_redirects
  fi
else
  echo "Creating public/_redirects..."
  echo "/* /.netlify/functions/next 200" > public/_redirects
fi

# Ensure _headers file exists with correct cache control
if [ ! -f public/_headers ]; then
  echo "Creating public/_headers..."
  echo "/*" > public/_headers
  echo "  Cache-Control: public, max-age=0, must-revalidate" >> public/_headers
  echo "" >> public/_headers
  echo "/_next/static/*" >> public/_headers
  echo "  Cache-Control: public, max-age=31536000, immutable" >> public/_headers
fi

# Build the application
echo "Building the application..."
npm run build

# Post-build checks
echo "Performing post-build checks..."
if [ -d ".next" ]; then
  echo ".next directory exists, build seems successful."
else
  echo "WARNING: .next directory does not exist, build may have failed."
fi

echo "Build process completed."
