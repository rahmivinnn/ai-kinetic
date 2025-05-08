#!/bin/bash

echo "Installing dependencies..."
npm install

echo "Creating uploads directory..."
mkdir -p uploads/videos
mkdir -p uploads/images
mkdir -p uploads/profiles

echo "Creating logs directory..."
mkdir -p logs

echo "Setup complete!"
echo ""
echo "To start the development server, run: npm run dev"
echo "To seed the database with sample data, run: npm run seed"
