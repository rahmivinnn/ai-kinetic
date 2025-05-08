@echo off
echo Installing dependencies...
npm install

echo Creating uploads directory...
mkdir uploads
mkdir uploads\videos
mkdir uploads\images
mkdir uploads\profiles

echo Creating logs directory...
mkdir logs

echo Setup complete!
echo.
echo To start the development server, run: npm run dev
echo To seed the database with sample data, run: npm run seed
