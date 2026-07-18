@echo off
REM ==========================================
REM 🕯️ Candle Studio — Setup
REM ==========================================
REM Install all npm dependencies

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  🕯️  CANDLE STUDIO - Setup                             ║
echo ║                                                          ║
echo ║  ⚙️  Installing Dependencies...                         ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Get the directory where this script is located
cd /d "%~dp0"

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ ERROR: Node.js is not installed!
    echo.
    echo Please download and install Node.js from:
    echo   https://nodejs.org/ (LTS version recommended)
    echo.
    echo After installing Node.js, run this script again.
    echo.
    pause
    exit /b 1
)

echo ✅ Node.js found: 
node --version
npm --version
echo.

REM Install frontend dependencies
echo.
echo 📦 Installing Frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo.
    echo ❌ Failed to install frontend dependencies!
    cd ..
    pause
    exit /b 1
)
echo ✅ Frontend dependencies installed!
cd ..

REM Install backend dependencies
echo.
echo 📦 Installing Backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo.
    echo ❌ Failed to install backend dependencies!
    cd ..
    pause
    exit /b 1
)
echo ✅ Backend dependencies installed!
cd ..

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  ✅ Setup Complete!                                     ║
echo ║                                                          ║
echo ║  Next steps:                                            ║
echo ║  1. Double-click START_CANDLE_STUDIO.bat                ║
echo ║     OR                                                   ║
echo ║  2. Run from command prompt:                            ║
echo ║     START_CANDLE_STUDIO.bat                             ║
echo ║                                                          ║
echo ║  Then open browser:                                     ║
echo ║     http://localhost:5173                               ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

pause

exit /b 0
