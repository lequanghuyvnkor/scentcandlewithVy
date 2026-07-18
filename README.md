# 🕯️ Scent Candle with Vy — Distribution Management System

Hệ thống quản lý tiệm nến thơm nhỏ — từ thiết kế công thức nến (Candle Studio) đến quản lý bán hàng (Distribution).

## 📦 Cấu trúc dự án

```
scentcandlewithVy/
├── frontend/                 # React + Vite
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Helper functions
│   │   ├── data/            # Constants & data
│   │   └── App.jsx          # Main app
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Express.js
│   ├── src/
│   │   ├── routes/          # API routes
│   │   ├── controllers/      # Logic
│   │   ├── models/          # Data models
│   │   └── server.js        # Express app
│   ├── package.json
│   └── .env.example
│
├── docs/                     # Documentation
│   ├── API.md               # API reference
│   ├── SETUP.md             # Setup guide
│   └── ARCHITECTURE.md      # Architecture
│
└── README.md
```

## 🚀 Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
# Mở http://localhost:5173
```

### Backend

```bash
cd backend
npm install
npm run dev
# API chạy trên http://localhost:3000
```

## 🎯 Features

### Candle Studio (Thiết kế nến)
- Chọn loại sáp, kích thước lọ
- Pha chế mùi hương (tối đa 4 mùi)
- Trộn màu sắc realtime
- Lưu công thức dạng SKU

### Distribution (Quản lý bán)

**Giai đoạn 1 — Order Management**
- Tạo đơn hàng mới
- Kanban board 5 trạng thái
- Chuyển đơn giữa các giai đoạn

**Giai đoạn 2 — Inventory**
- Quản lý kho nguyên liệu
- Tự động trừ kho khi sản xuất (logic BOM)
- Cảnh báo khi sắp hết
- Nhập kho & tính chi phí

**Giai đoạn 3 — Insights**
- Dashboard tổng quan (doanh thu, đơn hàng, kho)
- Theo dõi khách hàng
- Báo cáo bán chạy nhất
- Tính lợi nhuận realtime

## 💾 Data Persistence

- Frontend: Dùng `window.storage` API (auto-save)
- Backend: In-memory (sẵn sàng migrate tới PostgreSQL/MongoDB)

## 📚 Documentation

- [API Reference](./docs/API.md) — Tất cả endpoints
- [Setup Guide](./docs/SETUP.md) — Hướng dẫn cài đặt chi tiết
- [Architecture](./docs/ARCHITECTURE.md) — Sơ đồ kiến trúc

## 🛠️ Tech Stack

**Frontend:**
- React 18 + Vite
- Recharts (biểu đồ)
- Pastel theme (custom CSS)

**Backend:**
- Express.js
- Node.js ES Modules
- In-memory + Ready for DB

## 📝 Hướng phát triển

- [ ] Integrate thật database (PostgreSQL/Supabase)
- [ ] Multi-user + role-based auth
- [ ] SMS/Email notifications
- [ ] Mobile app
- [ ] Integration với VNPay/Momo
- [ ] Auto-generate invoice & shipping label

## 📞 Contact

Hỏi gì tại repo này nha! 🌸

---

Made with 💗 for a cute little candle shop
