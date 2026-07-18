# ⚡ Quick Start — 5 phút chạy được app

## 📍 Vị trí hiện tại

Toàn bộ code dự án đã được tổ chức sẵn trong:
```
/mnt/user-data/outputs/scentcandlewithVy/
```

## 🔗 Copy sang Windows

### Cách 1: Copy thủ công
1. Tìm thư mục `/mnt/user-data/outputs/scentcandlewithVy/` 
2. Copy toàn bộ vào `C:\Users\PC\Documents\GitHub\scentcandlewithVy`

### Cách 2: Dùng Explorer
1. Windows File Explorer → Map Network Drive
2. Địa chỉ: `\\wsl$\Ubuntu\mnt\user-data\outputs`
3. Kéo thả `scentcandlewithVy` vào Documents\GitHub

## 🚀 Chạy app (5 phút)

### Terminal 1 — Frontend

```bash
cd C:\Users\PC\Documents\GitHub\scentcandlewithVy\frontend
npm install
npm run dev
```

→ Mở browser: **http://localhost:5173**

### Terminal 2 — Backend

```bash
cd C:\Users\PC\Documents\GitHub\scentcandlewithVy\backend
npm install
npm run dev
```

→ Server chạy: **http://localhost:3000**

## ✅ Kiểm tra hoạt động

### Frontend
- Mở http://localhost:5173
- Chuyển tab "Thiết kế nến" ↔ "Quản lý bán"
- Tạo đơn hàng mới → kéo trong Kanban

### Backend
- Truy cập http://localhost:3000/health
- Phải thấy: `{"status":"🕯️ Candle Studio API running"}`

## 📚 Tài liệu

- **README.md** — Tổng quan dự án
- **docs/SETUP.md** — Hướng dẫn cài đặt chi tiết
- **docs/API.md** — Danh sách API endpoints
- **docs/ARCHITECTURE.md** — Kiến trúc hệ thống

## 🎯 Các tab trong app

### 🕯️ Thiết kế nến
- Chọn loại sáp (soy, paraffin, ong, dừa)
- Chỉnh kích thước lọ
- Đặt tên công thức
- Lưu để dùng làm sản phẩm bán

### 📦 Quản lý bán
- **Kanban Board**: Kéo-thả đơn hàng giữa 5 trạng thái
  - 🌱 Mới
  - 💌 Xác nhận
  - 🕯️ Sản xuất (tự động trừ kho!)
  - 🎀 Đóng gói
  - 💗 Hoàn tất
- Tạo đơn mới từ button "+ Đơn mới"
- Dữ liệu tự động lưu

### 🏠 Dashboard (đã có trong code)
Hiển thị:
- 💰 Doanh thu hoàn tất
- 📦 Đơn đang chạy
- 🥺 Nguyên liệu sắp hết
- 👤 Số khách hàng
- 📈 Biểu đồ doanh thu 7 ngày

## 💾 Dữ liệu

**Seed data sẵn có:**
- ✅ 4 sản phẩm (Lavender Dream, Peach Sunset, Cozy Woods, Berry Kiss)
- ✅ 21 nguyên liệu (sáp, dầu thơm, lọ, bấc, phẩm màu)
- ✅ 3 khách hàng mẫu
- ✅ 4 đơn hàng mẫu

**Lưu trữ:**
- Frontend: `window.storage` API (auto-persist)
- Backend: In-memory (mất khi restart — sẵn sàng migrate tới database)

## 🛠️ Troubleshoot

### Port 3000/5173 đã dùng?
```bash
# Tìm process
netstat -ano | findstr :3000

# Kill process (lấy PID từ kết quả trên)
taskkill /PID <PID> /F

# Hoặc chỉnh PORT trong backend/.env
PORT=3001
```

### npm install lỗi?
```bash
# Xoá node_modules
rm -r node_modules
rm package-lock.json

# Cài lại
npm install
```

### Không có Node.js?
Download: https://nodejs.org/ (LTS version)

## 📝 Dự định phát triển

- [ ] Real database (PostgreSQL/Supabase)
- [ ] Multi-user + login
- [ ] SMS/Email thông báo
- [ ] Tính toán profit chart
- [ ] In hóa đơn & shipping label
- [ ] Mobile app

## 🚨 Chỉnh sửa code

Mọi file đã organized sẵn:

```
frontend/src/
├── components/          # React components
├── hooks/              # Custom hooks
├── utils/              # Helper functions
├── data/               # Constants
└── App.jsx             # Main entry

backend/src/
└── server.js           # Express app + tất cả routes
```

**Không cần import dài** — cấu trúc rõ ràng, dễ tìm kiếm.

---

**Đã sẵn sàng! Chỉ cần copy + npm install + npm run dev** 🌸

Hỏi gì thì mở issue hoặc hỏi lại nha! 💗
