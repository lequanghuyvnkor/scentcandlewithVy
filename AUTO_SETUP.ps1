# 🕯️ Candle Studio - Auto Copy & Setup Desktop Shortcut
# Run this in PowerShell (Admin) to automatically:
# 1. Copy project from WSL to Windows
# 2. Create desktop shortcut
# 3. Launch setup

Write-Host @"
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   🕯️  CANDLE STUDIO - Auto Setup                              ║
║                                                                  ║
║   This script will:                                             ║
║   1. Copy project from WSL to Windows                           ║
║   2. Create Desktop shortcut                                    ║
║   3. Launch setup                                               ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# Configuration
$SourcePath = "\\wsl$\Ubuntu\mnt\user-data\outputs\scentcandlewithVy"
$DestPath = "$env:USERPROFILE\Documents\GitHub\scentcandlewithVy"
$DesktopPath = "$env:USERPROFILE\Desktop"
$ShortcutPath = "$DesktopPath\🕯️ Candle Studio.lnk"

# Check if source exists
Write-Host "`n⏳ Checking source folder..." -ForegroundColor Yellow
if (-not (Test-Path $SourcePath)) {
    Write-Host "❌ Source not found: $SourcePath" -ForegroundColor Red
    Write-Host "Make sure WSL is set up and path is correct." -ForegroundColor Red
    pause
    exit 1
}
Write-Host "✅ Source folder found!" -ForegroundColor Green

# Create destination folder if it doesn't exist
$GitHubDir = "$env:USERPROFILE\Documents\GitHub"
if (-not (Test-Path $GitHubDir)) {
    Write-Host "`n📁 Creating GitHub folder..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $GitHubDir -Force | Out-Null
}

# Check if already exists
if (Test-Path $DestPath) {
    Write-Host "`n⚠️  Folder already exists at: $DestPath" -ForegroundColor Yellow
    $choice = Read-Host "Overwrite? (y/n)"
    if ($choice -ne "y") {
        Write-Host "Skipping copy..." -ForegroundColor Yellow
    } else {
        Write-Host "`n📦 Copying project (this may take a minute)..." -ForegroundColor Yellow
        Remove-Item $DestPath -Recurse -Force -ErrorAction SilentlyContinue
        Copy-Item -Path $SourcePath -Destination $DestPath -Recurse -Force
        Write-Host "✅ Copy complete!" -ForegroundColor Green
    }
} else {
    Write-Host "`n📦 Copying project (this may take a minute)..." -ForegroundColor Yellow
    Copy-Item -Path $SourcePath -Destination $DestPath -Recurse -Force
    Write-Host "✅ Copy complete!" -ForegroundColor Green
}

# Create desktop shortcut
Write-Host "`n🎯 Creating desktop shortcut..." -ForegroundColor Yellow

$BatchFile = "$DestPath\START_CANDLE_STUDIO.bat"

if (-not (Test-Path $BatchFile)) {
    Write-Host "❌ START_CANDLE_STUDIO.bat not found!" -ForegroundColor Red
    pause
    exit 1
}

try {
    $WshShell = New-Object -ComObject WScript.Shell
    $Shortcut = $WshShell.CreateShortcut($ShortcutPath)
    $Shortcut.TargetPath = $BatchFile
    $Shortcut.WorkingDirectory = $DestPath
    $Shortcut.Description = "Candle Studio Distribution System - Click to start"
    $Shortcut.IconLocation = "C:\Windows\System32\cmd.exe,0"
    $Shortcut.Save()
    Write-Host "✅ Desktop shortcut created!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to create shortcut: $_" -ForegroundColor Red
    Write-Host "You can create it manually:" -ForegroundColor Yellow
    Write-Host "  Right-click Desktop → New → Shortcut" -ForegroundColor Gray
    Write-Host "  Paste: $BatchFile" -ForegroundColor Gray
}

# Show completion message
Write-Host @"

╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║   ✅ AUTO SETUP COMPLETE!                                       ║
║                                                                  ║
║   📁 Project location:                                          ║
║      $DestPath
║                                                                  ║
║   🎯 Desktop shortcut created:                                  ║
║      🕯️ Candle Studio                                          ║
║                                                                  ║
║   📝 NEXT STEPS:                                                ║
║   1. Open File Explorer → Go to project folder                  ║
║   2. Double-click: SETUP.bat                                    ║
║   3. Wait for npm install to complete                           ║
║   4. Close window                                               ║
║   5. Double-click 🕯️ Candle Studio on Desktop                 ║
║   6. Open browser: http://localhost:5173                        ║
║                                                                  ║
║   🎨 App will start automatically!                              ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Green

# Ask to open explorer
$choice = Read-Host "`nOpen project folder now? (y/n)"
if ($choice -eq "y") {
    Start-Process explorer.exe -ArgumentList $DestPath
}

Write-Host "`n✨ Done! Press any key to exit..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
