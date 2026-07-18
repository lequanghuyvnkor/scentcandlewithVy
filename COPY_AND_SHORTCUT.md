# 🚀 Copy tới Windows & Tạo Desktop Shortcut

## 📁 Bước 1: Copy dự án tới Windows

### Cách 1: File Explorer (Dễ nhất)

1. **Mở File Explorer** → nhập đường dẫn này vào thanh địa chỉ:
   ```
   \\wsl$\Ubuntu\mnt\user-data\outputs
   ```

2. **Tìm thư mục `scentcandlewithVy`** → Right-click → **Copy**

3. **Dán vào đây:**
   ```
   C:\Users\PC\Documents\GitHub\
   ```

### Cách 2: PowerShell (Nhanh hơn)

Mở **PowerShell** (Win + X → Windows PowerShell):

```powershell
# Copy từ WSL sang Windows
Copy-Item -Recurse "\\wsl$\Ubuntu\mnt\user-data\outputs\scentcandlewithVy" `
  -Destination "C:\Users\PC\Documents\GitHub\"

# Kiểm tra
dir "C:\Users\PC\Documents\GitHub\scentcandlewithVy"
```

### Cách 3: Command Prompt

```cmd
xcopy "\\wsl$\Ubuntu\mnt\user-data\outputs\scentcandlewithVy" `
  "C:\Users\PC\Documents\GitHub\scentcandlewithVy" /E /I /Y
```

---

## ⚙️ Bước 2: Setup Dependencies (Lần 1 thôi)

1. **Mở File Explorer** → Navigate tới:
   ```
   C:\Users\PC\Documents\GitHub\scentcandlewithVy
   ```

2. **Double-click `SETUP.bat`** (file bạn sẽ thấy)
   
   Chờ nó cài npm packages (vài phút đầu tiên)

   ```
   ╔══════════════════════════════════════════════════════════╗
   ║  🕯️  CANDLE STUDIO - Setup                             ║
   ║                                                          ║
   ║  ⚙️  Installing Dependencies...                         ║
   ╚══════════════════════════════════════════════════════════╝
   
   ✅ Node.js found: v18.17.0
   📦 Installing Frontend dependencies...
   ✅ Frontend dependencies installed!
   📦 Installing Backend dependencies...
   ✅ Backend dependencies installed!
   ✅ Setup Complete!
   ```

3. Khi xong → Đóng cửa sổ

---

## 🎯 Bước 3: Tạo Desktop Shortcut (1 Nút Nhấn)

### Cách 1: Tạo shortcut bằng tay (Dễ)

1. **Right-click vào Desktop** → **New** → **Shortcut**

2. **Nhập đường dẫn này:**
   ```
   C:\Users\PC\Documents\GitHub\scentcandlewithVy\START_CANDLE_STUDIO.bat
   ```

3. **Next** → Đặt tên:
   ```
   🕯️ Candle Studio
   ```

4. **Finish**

5. **(Tuỳ chọn) Đổi icon:** Right-click shortcut → Properties → Change Icon...

### Cách 2: PowerShell (Tự động)

Mở **PowerShell** (admin):

```powershell
# Tạo shortcut tự động
$SourcePath = "C:\Users\PC\Documents\GitHub\scentcandlewithVy\START_CANDLE_STUDIO.bat"
$DesktopPath = "$env:USERPROFILE\Desktop"
$ShortcutPath = "$DesktopPath\🕯️ Candle Studio.lnk"

$WshShell = New-Object -ComObject WScript.Shell
$Shortcut = $WshShell.CreateShortcut($ShortcutPath)
$Shortcut.TargetPath = $SourcePath
$Shortcut.WorkingDirectory = (Split-Path -Parent $SourcePath)
$Shortcut.Description = "Candle Studio Distribution System"
$Shortcut.Save()

Write-Host "✅ Shortcut tạo thành công tại Desktop!"
```

---

## 🎉 Khi xong

**Trên Desktop bạn sẽ thấy:** 🕯️ **Candle Studio**

### Cách dùng:

1. **Double-click icon** → 2 cửa sổ Terminal sẽ mở:
   - Cửa sổ 1: Frontend (React Vite)
   - Cửa sổ 2: Backend (Express)

2. **Chờ 10 giây**, mở browser:
   ```
   http://localhost:5173
   ```

3. **App sẽ hiển thị!** 🎨

4. **Đóng 2 cửa sổ terminal** khi muốn tắt app

---

## 🔧 Troubleshoot

### ❌ "Node.js not found"
- Tải Node.js: https://nodejs.org/ (LTS)
- Cài đặt + Restart PowerShell/CMD
- Chạy lại `SETUP.bat`

### ❌ "Port 3000/5173 already in use"
- Có process khác dùng port
- Cách fix:
  ```cmd
  netstat -ano | findstr :3000
  taskkill /PID <PID> /F
  ```

### ❌ "npm install fails"
- Xoá folder `node_modules`:
  ```cmd
  cd C:\Users\PC\Documents\GitHub\scentcandlewithVy\frontend
  rmdir /s node_modules
  npm install
  ```

---

## 📝 Quy trình lần tới

Mỗi lần muốn chạy:
1. **Double-click 🕯️ Candle Studio** trên Desktop
2. **Chờ 10 giây** → mở http://localhost:5173
3. **Done!**

Không cần mở terminal, không cần nhập lệnh — chỉ 1 nút click 🎯

---

## 💾 File quan trọng

```
scentcandlewithVy/
├── 🎯 START_CANDLE_STUDIO.bat      ← Chạy app (double-click này!)
├── ⚙️ SETUP.bat                    ← Cài dependencies (lần 1)
├── frontend/                        ← React code
├── backend/                         ← Node.js API
└── docs/                           ← Documentation
```

---

**Xong! Giờ bạn chỉ cần 1 nút trên desktop để chạy toàn bộ app** 🌸✨

Hỏi gì thì comment nha! 💗
