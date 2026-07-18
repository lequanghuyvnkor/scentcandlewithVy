# 🚀 AUTO SETUP — Tự động copy + tạo shortcut

Nếu bạn muốn **tự động copy project từ WSL sang Windows + tạo desktop shortcut** thì dùng cách này!

## 📖 Cách dùng

### Bước 1: Mở PowerShell (Admin)

- **Windows 10/11:** Nhấn `Win + X` → Chọn **Windows PowerShell (Admin)** hoặc **Terminal (Admin)**

### Bước 2: Allow Script Execution

Dán lệnh này và nhấn Enter:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Nhập `Y` rồi Enter khi hỏi

### Bước 3: Chạy Auto Setup

Dán lệnh này:

```powershell
cd $env:TEMP
Invoke-WebRequest -Uri "\\wsl$\Ubuntu\mnt\user-data\outputs\scentcandlewithVy\AUTO_SETUP.ps1" -OutFile "auto_setup.ps1"
.\auto_setup.ps1
```

Hoặc nếu file đã ở PC:

```powershell
C:\Users\PC\Documents\GitHub\scentcandlewithVy\AUTO_SETUP.ps1
```

### Bước 4: Follow the prompts

Script sẽ:
1. ✅ Copy project từ WSL → Windows
2. ✅ Tạo desktop shortcut
3. ✅ Mở folder

---

## ⚡ Chỉ 2 câu lệnh xong!

**PowerShell (Admin):**

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://raw.githubusercontent.com/YOUR_REPO/AUTO_SETUP.ps1'))
```

---

## 🎯 Sau khi AUTO SETUP xong

1. **Mở thư mục vừa copy** (script sẽ mở Explorer)
2. **Double-click `SETUP.bat`** → Chờ cài npm packages
3. **Đóng cửa sổ** khi xong
4. **Double-click 🕯️ Candle Studio** trên Desktop → App chạy!

---

## 🆘 Nếu AUTO_SETUP không work

Dùng cách manual:

```powershell
# 1. Copy
Copy-Item -Recurse "\\wsl$\Ubuntu\mnt\user-data\outputs\scentcandlewithVy" `
  -Destination "$env:USERPROFILE\Documents\GitHub\"

# 2. Create shortcut
$SourcePath = "$env:USERPROFILE\Documents\GitHub\scentcandlewithVy\START_CANDLE_STUDIO.bat"
$DesktopPath = "$env:USERPROFILE\Desktop\🕯️ Candle Studio.lnk"
$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($DesktopPath)
$Shortcut.TargetPath = $SourcePath
$Shortcut.Save()
```

---

**Xong! Cách nhanh nhất là dùng AUTO_SETUP.ps1** 🚀

Hoặc dùng cách manual ở `COPY_AND_SHORTCUT.md` 📖
