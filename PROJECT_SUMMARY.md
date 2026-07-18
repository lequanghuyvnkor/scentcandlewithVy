# 🎉 Project Summary — Scent Candle Distribution System

## ✅ Hoàn thành toàn bộ

Đã xây dựng **full-stack application** gồm **3 giai đoạn** quản lý tiệm nến thơm, với kiến trúc professional và tổ chức code chuẩn.

---

## 📦 Cấu trúc dự án

```
scentcandlewithVy/                         (root)
│
├─ frontend/                               (React + Vite)
│  ├─ src/
│  │  ├─ components/
│  │  │  ├─ ui/Primitives.jsx             # Card, Button, Input, Modal, Badge, Toast
│  │  │  ├─ CandleStudio.jsx              # Wizard: chọn sáp → kích thước → lưu
│  │  │  └─ Distribution.jsx              # Kanban: 5 trạng thái đơn hàng
│  │  ├─ hooks/
│  │  │  └─ useStorage.js                 # Custom hook: persistent state
│  │  ├─ utils/
│  │  │  └─ formatters.js                 # VND format, totals, profit calc
│  │  ├─ data/
│  │  │  ├─ theme.js                      # Pastel colors + status colors
│  │  │  └─ recipes.js                    # Products + BOM (Bill of Materials)
│  │  ├─ App.jsx                          # Main app (tab router)
│  │  └─ main.jsx                         # Entry point
│  ├─ index.html                          # HTML template
│  ├─ package.json                        # Dependencies: React, Vite, Recharts
│  ├─ vite.config.js                      # Vite config + API proxy
│  └─ .gitignore
│
├─ backend/                                (Express.js)
│  ├─ src/
│  │  └─ server.js                        # Express app + ALL routes
│  │                                       # ├─ GET /health
│  │                                       # ├─ /products (CRUD)
│  │                                       # ├─ /materials (read + restock)
│  │                                       # ├─ /customers (CRUD)
│  │                                       # ├─ /orders (CRUD)
│  │                                       # └─ /stats (dashboard)
│  ├─ package.json                        # Dependencies: Express, CORS, UUID
│  ├─ .env.example                        # Environment template
│  └─ .gitignore
│
├─ docs/
│  ├─ SETUP.md                            # ⭐ Hướng dẫn cài đặt chi tiết
│  ├─ API.md                              # ⭐ Danh sách tất cả endpoints
│  ├─ ARCHITECTURE.md                     # ⭐ Kiến trúc + data flow + models
│
├─ README.md                              # ⭐ Tổng quan dự án
├─ QUICK_START.md                         # ⭐ Chạy app trong 5 phút
├─ PROJECT_SUMMARY.md                     # File này
├─ .gitignore
└─ package-lock.json (tuỳ chọn)
```

---

## 🎯 Features Hoàn thành

### ✅ Giai đoạn 1 — Order Management
- [x] Tạo đơn hàng mới (modal với chọn khách + sản phẩm)
- [x] Kanban board 5 trạng thái (kéo-thả)
- [x] Chuyển đơn giữa các trạng thái
- [x] Hiển thị chi tiết từng đơn

### ✅ Giai đoạn 2 — Inventory Management
- [x] Quản lý 21 nguyên liệu (sáp, dầu thơm, lọ, bấc, phẩm)
- [x] Auto-deduct kho khi chuyển sang "Sản xuất" (theo BOM)
- [x] Check stock trước deduct — chặn nếu không đủ
- [x] Auto-restore kho khi lùi lại từ "Sản xuất"
- [x] Cảnh báo khi sắp hết (ngưỡng mặc định)
- [x] Modal nhập kho + ước tính chi phí

### ✅ Giai đoạn 3 — Dashboard & Insights
- [x] KPI cards (doanh thu, đơn chạy, kho sắp hết, khách)
- [x] Biểu đồ doanh thu 7 ngày (Bar chart)
- [x] Top products bán chạy + lãi
- [x] Low stock alert
- [x] Hồ sơ khách hàng (lịch sử, công thức yêu thích)
- [x] Tính lợi nhuận & margin % realtime

### ✅ Candle Studio
- [x] Wizard 4 bước (sáp → kích thước → tên → lưu)
- [x] Cute pastel UI
- [x] Lưu công thức dạng SKU

---

## 🏗️ Kiến trúc & Design

### Frontend
- **React 18** + **Vite** (fast bundler)
- **Recharts** (biểu đồ)
- **Custom React hook** (useStorage) → persistent state
- **Pastel theme** (tím, hồng, xanh, vàng)
- **Responsive UI** (flex/grid)

### Backend
- **Express.js** (lightweight framework)
- **In-memory database** (JS objects)
- **CORS enabled** (frontend-backend communication)
- **Structured routes** (all in one server.js for MVP)
- **RESTful API** (GET, POST, PUT)

### Data Persistence
- **Frontend**: `window.storage` API (auto-persist every 600ms)
- **Backend**: In-memory (cache reset on restart)
- **Migration path**: Ready for PostgreSQL/MongoDB (models định sẵn)

### Business Logic
- **BOM (Bill of Materials)**: Mỗi sản phẩm có danh sách nguyên liệu cần
- **Inventory Deduction**: Tự động trừ kho khi sản xuất
- **Stock Check**: Kiểm tra trước deduct → báo lỗi nếu thiếu
- **Profit Calculation**: (price - cost) × quantity
- **Customer Tracking**: Lịch sử mua, công thức yêu thích

---

## 📊 Seed Data

Đã tạo sẵn:

**4 Sản phẩm:**
1. 💜 Lavender Dream — 185k (sáp soy, lavender+vanilla)
2. 🍑 Peach Sunset — 175k (sáp dừa, đào+cam chanh)
3. 🪵 Cozy Woods — 235k (sáp ong, đàn hương+trầm)
4. 🍓 Berry Kiss — 155k (sáp soy, dâu+hoa hồng)

**21 Nguyên liệu:** 3 loại sáp, 8 loại dầu thơm, 3 loại lọ, 3 cỡ bấc, 4 phẩm màu

**3 Khách hàng:** Chị Mai, Anh Tuấn, Shop Cỏ May

**4 Đơn hàng mẫu:** Ở các trạng thái khác nhau

---

## 🚀 Cách chạy

### Frontend
```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

### Backend
```bash
cd backend
npm install
npm run dev
# → http://localhost:3000
```

### Production Build
```bash
cd frontend
npm run build
# → dist/ folder (deploy lên Vercel/Netlify)

cd backend
npm start
# → Deploy lên Heroku/Railway/DigitalOcean
```

---

## 📖 Tài liệu

| File | Mục đích |
|------|---------|
| **README.md** | 👈 Bắt đầu từ đây |
| **QUICK_START.md** | 5 phút chạy app |
| **docs/SETUP.md** | Cài đặt chi tiết + troubleshoot |
| **docs/API.md** | Tất cả endpoints + params |
| **docs/ARCHITECTURE.md** | Kiến trúc + data flow + models |

---

## 🎨 Thiết kế

- **Pastel theme**: Hồng #F6A8C0, Xanh #B5D8A6, Vàng #F8DE8D
- **Font**: Quicksand (tròn trịa, dễ thương)
- **Components**: Reusable primitives (Card, Button, Input, Modal, Badge)
- **Responsive**: Mobile-friendly (flex, grid, viewport)

---

## 🔮 Tương lai (Roadmap)

- [ ] Real database (PostgreSQL)
- [ ] Authentication & JWT
- [ ] Multi-user support (role-based)
- [ ] SMS/Email notifications
- [ ] Advance search & filters
- [ ] Automated invoice generation
- [ ] Shipping label integration
- [ ] Analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Payment gateway (VNPay, Momo)

---

## 📁 Copy vào Windows

Tất cả code đã ở trong:
```
/mnt/user-data/outputs/scentcandlewithVy/
```

**Copy toàn bộ vào:**
```
C:\Users\PC\Documents\GitHub\scentcandlewithVy
```

Xong! Mở 2 terminal + `npm install` + `npm run dev` 🚀

---

## 🎓 Learning Resources

Dự án này là **full-stack example** tốt cho:
- React hooks & state management
- Vite bundler
- Express.js API
- Frontend-backend integration
- Data persistence strategies
- UI component architecture

---

## 📞 Support

Mọi câu hỏi — tham khảo:
1. QUICK_START.md (5 phút chạy)
2. docs/SETUP.md (troubleshoot)
3. docs/API.md (API calls)
4. docs/ARCHITECTURE.md (design patterns)

---

## ✨ Highlights

✅ **Production-ready structure** — không lộn xộn, dễ scale
✅ **Full documentation** — SETUP, API, ARCHITECTURE
✅ **Cute UI** — Pastel theme + reusable components
✅ **Business logic** — Inventory, profit, customer tracking
✅ **Persistent data** — Auto-save frontend + backend ready
✅ **Zero-config** — Clone + npm install + npm run dev

---

**🎉 Đã sẵn sàng để launch! Chỉ còn copy + install + chạy**

Made with 💗 for Scent Candle with Vy
