@echo off
REM ==========================================
REM 🕯️ Candle Studio — Copy from WSL to Windows
REM ==========================================

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  🕯️  CANDLE STUDIO - Copy from WSL                     ║
echo ║                                                          ║
echo ║  This will copy project from WSL to Windows             ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

REM Source and destination paths
set "SOURCE=\\wsl$\Ubuntu\mnt\user-data\outputs\scentcandlewithVy"
set "DEST=%USERPROFILE%\Documents\GitHub\scentcandlewithVy"

REM Check if source exists
if not exist "%SOURCE%" (
    echo.
    echo ❌ ERROR: WSL folder not found!
    echo Expected path: %SOURCE%
    echo.
    echo Make sure:
    echo   1. WSL is installed
    echo   2. The project is in the correct location
    echo.
    pause
    exit /b 1
)

echo ✅ Source found: %SOURCE%
echo.
echo 📁 Destination: %DEST%
echo.

REM Check if destination folder already exists
if exist "%DEST%" (
    echo ⚠️  Folder already exists!
    echo.
    set /p CHOICE="Overwrite? (yes/no): "
    if /i not "%CHOICE%"=="yes" (
        echo Cancelled.
        pause
        exit /b 0
    )
    echo Removing old folder...
    rmdir /s /q "%DEST%"
)

REM Create GitHub folder if it doesn't exist
if not exist "%USERPROFILE%\Documents\GitHub" (
    echo Creating GitHub folder...
    mkdir "%USERPROFILE%\Documents\GitHub"
)

echo.
echo 📦 Copying files (this may take a moment)...
echo.

REM Copy files
xcopy "%SOURCE%" "%DEST%" /E /I /Y /Q

if errorlevel 1 (
    echo.
    echo ❌ Copy failed!
    pause
    exit /b 1
)

echo.
echo ✅ Copy successful!
echo.

REM Ask to open folder
set /p OPEN="Open folder in Explorer? (yes/no): "
if /i "%OPEN%"=="yes" (
    start explorer "%DEST%"
)

echo.
echo ╔══════════════════════════════════════════════════════════╗
echo ║  ✅ NEXT STEPS                                          ║
echo ║                                                          ║
echo ║  1. Double-click: SETUP.bat                             ║
echo ║  2. Wait for npm install                                ║
echo ║  3. Close window                                        ║
echo ║  4. Double-click: START_CANDLE_STUDIO.bat               ║
echo ║  5. Open: http://localhost:5173                         ║
echo ║                                                          ║
echo ╚══════════════════════════════════════════════════════════╝
echo.

pause

exit /b 0
