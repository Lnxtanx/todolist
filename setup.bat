@echo off
echo 🚀 Setting up Todo Application...

REM Install dependencies
echo 📦 Installing dependencies...
call npm install
echo ✅ Dependencies installed

echo.
echo 🎉 Setup complete!
echo.
echo To start the application:
echo npm start
echo.
echo The application will run on: http://localhost:3000
echo API endpoints: http://localhost:3000/api
pause 