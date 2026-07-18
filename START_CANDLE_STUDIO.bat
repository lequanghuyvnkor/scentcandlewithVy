@echo off
title Scent Candle Studio
cd /d "%~dp0"

echo ===================================================
echo   CANDLE STUDIO - Starting Application
echo ===================================================
echo.

REM Auto-pull latest updates from GitHub if Git is available
git --version >nul 2>&1
if not errorlevel 1 (
    echo [INFO] Checking and downloading latest updates from GitHub...
    git pull origin main
    echo.
)

if not exist "frontend\node_modules" (
    echo [INFO] Installing Frontend dependencies...
    cd /d "%~dp0frontend" && npm install
    cd /d "%~dp0"
)

if not exist "backend\node_modules" (
    echo [INFO] Installing Backend dependencies...
    cd /d "%~dp0backend" && npm install
    cd /d "%~dp0"
)

echo [1/3] Starting Frontend Server (React + Vite)...
start "Candle Studio - Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

ping 127.0.0.1 -n 4 >nul

echo [2/3] Starting Backend Server (Express)...
start "Candle Studio - Backend" cmd /k "cd /d "%~dp0backend" && npm run dev"

ping 127.0.0.1 -n 3 >nul

echo [3/3] Opening Web Browser at http://localhost:5173...
start http://localhost:5173

echo.
echo ===================================================
echo   SUCCESS: Both servers are running!
echo   - Frontend: http://localhost:5173
echo   - Backend:  http://localhost:3000
echo ===================================================
echo.

pause
