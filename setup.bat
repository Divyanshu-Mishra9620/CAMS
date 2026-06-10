@echo off
REM setup.bat - Automated backend setup script for Windows

echo.
echo CAMS Backend Setup Script
echo ==============================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: npm not found
    pause
    exit /b 1
)

echo npm version:
npm --version
echo.

REM Install dependencies
echo Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)

echo Dependencies installed successfully!
echo.
echo Setup complete!
echo.
echo Next steps:
echo 1. Make sure MongoDB is running
echo 2. Run: npm start
echo 3. Open http://localhost:5000/api/health to verify server
echo 4. Update frontend HTML files with api-client.js
echo.
pause
