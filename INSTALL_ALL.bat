@echo off
REM ==========================================
REM 🕯️ Candle Studio — COMPLETE SETUP
REM ==========================================
REM All-in-one: Copy + Setup + Create Shortcut
REM Just double-click and wait!

setlocal enabledelayedexpansion

cls
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                                                                          ║
echo ║   🕯️  CANDLE STUDIO - COMPLETE SETUP (ALL-IN-ONE)                     ║
echo ║                                                                          ║
echo ║   This will:                                                            ║
echo ║   1. Copy project from WSL → Windows                                    ║
echo ║   2. Install npm dependencies                                           ║
echo ║   3. Create Desktop shortcut                                            ║
echo ║                                                                          ║
echo ║   Just wait... this takes 15-20 minutes (first time only)               ║
echo ║                                                                          ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.
echo Press any key to START...
pause

REM Check if Node.js is installed
echo.
echo ⏳ Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo.
    echo ❌ ERROR: Node.js not found!
    echo.
    echo Please install from: https://nodejs.org/
    echo After installing, run this script again.
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js found

REM Define paths
set "SOURCE=\\wsl$\Ubuntu\mnt\user-data\outputs\scentcandlewithVy"
set "DEST=%USERPROFILE%\Documents\GitHub\scentcandlewithVy"
set "STARTBAT=%DEST%\START_CANDLE_STUDIO.bat"
set "DESKTOPSHORTCUT=%USERPROFILE%\Desktop\🕯️ Candle Studio.lnk"

REM ════════════════════════════════════════════════════════════════
REM STEP 1: Copy from WSL
REM ════════════════════════════════════════════════════════════════

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  STEP 1/3: Copying from WSL → Windows (5-10 min)            ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

if not exist "%SOURCE%" (
    echo ❌ ERROR: WSL folder not found!
    echo Path: %SOURCE%
    echo.
    echo Make sure WSL is working properly.
    echo.
    pause
    exit /b 1
)

echo Checking source: %SOURCE%
echo.

if exist "%DEST%" (
    echo ⚠️  Folder already exists at %DEST%
    echo Removing old folder...
    rmdir /s /q "%DEST%" >nul 2>&1
)

echo Checking/Creating GitHub folder...
if not exist "%USERPROFILE%\Documents\GitHub" (
    mkdir "%USERPROFILE%\Documents\GitHub"
)

echo.
echo 📦 Copying files...
xcopy "%SOURCE%" "%DEST%" /E /I /Y /Q

if errorlevel 1 (
    echo.
    echo ❌ Copy failed!
    echo.
    pause
    exit /b 1
)

echo ✅ Copy successful!

REM ════════════════════════════════════════════════════════════════
REM STEP 2: Install npm dependencies
REM ════════════════════════════════════════════════════════════════

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  STEP 2/3: Installing npm dependencies (5-10 min)           ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

echo Installing Frontend...
cd /d "%DEST%\frontend"
call npm install
if errorlevel 1 (
    echo ❌ Frontend npm install failed!
    pause
    exit /b 1
)
echo ✅ Frontend done

echo.
echo Installing Backend...
cd /d "%DEST%\backend"
call npm install
if errorlevel 1 (
    echo ❌ Backend npm install failed!
    pause
    exit /b 1
)
echo ✅ Backend done

REM ════════════════════════════════════════════════════════════════
REM STEP 3: Create Desktop Shortcut
REM ════════════════════════════════════════════════════════════════

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  STEP 3/3: Creating Desktop shortcut                         ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

if not exist "%STARTBAT%" (
    echo ❌ START_CANDLE_STUDIO.bat not found!
    pause
    exit /b 1
)

echo Creating shortcut...

REM Create shortcut using PowerShell
powershell -NoProfile -Command ^
  "$WshShell = New-Object -ComObject WScript.Shell; " ^
  "$Shortcut = $WshShell.CreateShortcut('%DESKTOPSHORTCUT%'); " ^
  "$Shortcut.TargetPath = '%STARTBAT%'; " ^
  "$Shortcut.WorkingDirectory = '%DEST%'; " ^
  "$Shortcut.Description = 'Candle Studio - Click to start app'; " ^
  "$Shortcut.Save()"

if errorlevel 1 (
    echo ⚠️  Could not create shortcut via PowerShell
    echo But you can create it manually:
    echo   Right-click Desktop ^> New ^> Shortcut
    echo   Paste: %STARTBAT%
) else (
    echo ✅ Desktop shortcut created!
)

REM ════════════════════════════════════════════════════════════════
REM SUCCESS
REM ════════════════════════════════════════════════════════════════

echo.
echo.
echo ╔══════════════════════════════════════════════════════════════════════════╗
echo ║                                                                          ║
echo ║   ✅ SETUP COMPLETE!                                                   ║
echo ║                                                                          ║
echo ║   📁 Project location:                                                  ║
echo ║      %DEST%
echo ║                                                                          ║
echo ║   🎯 Desktop shortcut created:                                          ║
echo ║      🕯️ Candle Studio                                                  ║
echo ║                                                                          ║
echo ║   🚀 TO START APP:                                                      ║
echo ║      Double-click: 🕯️ Candle Studio (on Desktop)                      ║
echo ║                                                                          ║
echo ║   📱 Open browser:                                                      ║
echo ║      http://localhost:5173                                              ║
echo ║                                                                          ║
echo ║   ⏰ Wait 10 seconds for both terminal windows to appear                 ║
echo ║                                                                          ║
echo ║   🎨 Enjoy!                                                             ║
echo ║                                                                          ║
echo ╚══════════════════════════════════════════════════════════════════════════╝
echo.

REM Open folder
explorer "%DEST%"

pause

exit /b 0
