@echo off
REM ==========================================
REM 🕯️ Candle Studio — Start App
REM ==========================================
REM This script starts both frontend and backend

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  🕯️  CANDLE STUDIO - Distribution System               ║
echo ║                                                          ║
echo ║  ✨ Starting Frontend + Backend...                      ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Get the directory where this script is located
cd /d "%~dp0"

REM Check if node_modules exists, if not prompt to run setup
if not exist "frontend\node_modules" (
    echo.
    echo ⚠️  Dependencies not installed!
    echo Please run SETUP.bat first to install npm packages.
    echo.
    pause
    exit /b 1
)

if not exist "backend\node_modules" (
    echo.
    echo ⚠️  Backend dependencies not installed!
    echo Please run SETUP.bat first to install npm packages.
    echo.
    pause
    exit /b 1
)

echo.
echo 📦 Starting Frontend (React + Vite)...
echo 🌐 Will open at: http://localhost:5173
echo.

REM Start frontend in new window
start cmd /k "cd /d "%~dp0frontend" && npm run dev"

timeout /t 3 /nobreak

echo.
echo 📡 Starting Backend (Express Server)...
echo 🔌 Will open at: http://localhost:3000
echo.

REM Start backend in new window
start cmd /k "cd /d "%~dp0backend" && npm run dev"

timeout /t 2 /nobreak

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  ✅ Both servers starting!                              ║
echo ║                                                          ║
echo ║  Frontend:  http://localhost:5173                       ║
echo ║  Backend:   http://localhost:3000                       ║
echo ║                                                          ║
echo ║  Close either window to stop that server.               ║
echo ║  Close both windows when done.                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Keep this window open for reference
pause

exit /b 0
