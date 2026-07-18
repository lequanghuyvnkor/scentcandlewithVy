╔══════════════════════════════════════════════════════════════════════════╗
║                                                                          ║
║   🕯️  CANDLE STUDIO - Read Me First                                    ║
║                                                                          ║
║   Distribution System for Scent Candle Shop                             ║
║   Quản lý tiệm nến thơm — Thiết kế + Bán hàng + Kho                    ║
║                                                                          ║
╚══════════════════════════════════════════════════════════════════════════╝


🎯 CHỌN CÁCH SETUP MỐI LẦN DÙNG
════════════════════════════════════════════════════════════════════════════


CÁCH 1️⃣ : TỰ ĐỘNG (Khuyến nghị) ⭐⭐⭐
────────────────────────────────────────────────────────────────────────────
Chọn nếu bạn muốn: Copy + Shortcut + Setup tất cả tự động

1. Mở PowerShell (Admin) — Win + X → Windows PowerShell (Admin)
2. Chạy lệnh:
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force

3. Rồi chạy:
   .\AUTO_SETUP.ps1

4. Theo dõi instructions trên màn hình

📖 Chi tiết: Xem file HOW_TO_USE_AUTO_SETUP.md


CÁCH 2️⃣ : MANUAL TỪng BƯỚC (Chi tiết hơn)
────────────────────────────────────────────────────────────────────────────
Chọn nếu bạn muốn hiểu rõ từng bước hoặc tự động không work

1. Copy project từ WSL sang Windows
2. Chạy SETUP.bat để cài npm dependencies
3. Tạo desktop shortcut
4. Chạy START_CANDLE_STUDIO.bat

📖 Chi tiết: Xem file COPY_AND_SHORTCUT.md


CÁCH 3️⃣ : SIÊU NHANH (Nếu đã setup rồi)
────────────────────────────────────────────────────────────────────────────
1. Double-click icon "🕯️ Candle Studio" trên Desktop
   → App tự động chạy!

2. Mở browser: http://localhost:5173


════════════════════════════════════════════════════════════════════════════

📁 FILE HƯỚNG DẪN
════════════════════════════════════════════════════════════════════════════

🟢 BẮT ĐẦU ĐỀ:

  START_HERE.txt                    ← Tóm tắt 3 bước nhanh nhất
  
  
🟦 COPY + SHORTCUT:

  AUTO_SETUP.ps1                    ← Script tự động (khuyến nghị)
  HOW_TO_USE_AUTO_SETUP.md          ← Hướng dẫn dùng script
  
  COPY_AND_SHORTCUT.md              ← Copy manual + tạo shortcut (chi tiết)
  SETUP.bat                         ← Cài npm dependencies
  START_CANDLE_STUDIO.bat           ← Chạy app (double-click)


🟨 TÀI LIỆU DỰ ÁN:

  README.md                         ← Tổng quan dự án
  QUICK_START.md                    ← 5 phút chạy
  PROJECT_SUMMARY.md                ← Tóm tắt features & kiến trúc
  
  docs/
    ├── SETUP.md                    ← Cài đặt chi tiết + troubleshoot
    ├── API.md                      ← API endpoints
    └── ARCHITECTURE.md             ← Kiến trúc hệ thống


════════════════════════════════════════════════════════════════════════════

🚀 TÔI LÀ NGƯỜI MỚI — BẮT ĐẦU TỪ ĐÂY
════════════════════════════════════════════════════════════════════════════

1. 📖 Đọc: START_HERE.txt

2. 🎯 Chọn 1 cách setup:
   - Cách 1 (Tự động):   Xem HOW_TO_USE_AUTO_SETUP.md
   - Cách 2 (Manual):    Xem COPY_AND_SHORTCUT.md

3. ⚙️ Chạy setup (cái này chỉ 1 lần duy nhất)

4. 🎉 Mỗi lần muốn chạy app: Double-click 🕯️ Candle Studio trên Desktop


════════════════════════════════════════════════════════════════════════════

⚡ TÔI ĐÃ SETUP RỒI — CHỈ MUỐN CHẠY APP
════════════════════════════════════════════════════════════════════════════

Double-click icon "🕯️ Candle Studio" trên Desktop
  → Done! 🎨


════════════════════════════════════════════════════════════════════════════

❓ CÓ TRỤC TRẶC GÌ?
════════════════════════════════════════════════════════════════════════════

🟥 Port đã được sử dụng / Node.js không found / npm install lỗi
  → Xem: docs/SETUP.md (phần Troubleshoot)

🟥 AUTO_SETUP.ps1 không chạy
  → Xem: HOW_TO_USE_AUTO_SETUP.md (phần 🆘)

🟥 Không hiểu cách setup
  → Xem: COPY_AND_SHORTCUT.md (chi tiết từng bước)


════════════════════════════════════════════════════════════════════════════

📚 MUỐN HIỂU RỰC VỀ DỰ ÁN?
════════════════════════════════════════════════════════════════════════════

✅ Features:           PROJECT_SUMMARY.md
✅ Kiến trúc code:    docs/ARCHITECTURE.md
✅ API endpoints:     docs/API.md
✅ Setup chi tiết:    docs/SETUP.md


════════════════════════════════════════════════════════════════════════════

🎨 ỨNG DỤNG CÓ GÌ?
════════════════════════════════════════════════════════════════════════════

1. 🕯️ Candle Studio — Thiết kế nến (4 bước wizard)
2. 📦 Distribution — Quản lý bán (Kanban board)
3. 🏠 Dashboard — Thống kê (doanh thu, kho, khách)


════════════════════════════════════════════════════════════════════════════

💻 YÊU CẦU
════════════════════════════════════════════════════════════════════════════

✅ Windows 10/11
✅ Node.js 16+ (https://nodejs.org/)
✅ 2GB RAM
✅ 500MB disk space


════════════════════════════════════════════════════════════════════════════

🌸 Made with 💗 for Scent Candle Studio

Bắt đầu từ: START_HERE.txt hoặc AUTO_SETUP.ps1

════════════════════════════════════════════════════════════════════════════
