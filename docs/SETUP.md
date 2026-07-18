# 🚀 Setup Guide

Hướng dẫn cài đặt Candle Studio Distribution System

## Yêu cầu

- **Node.js** 16+
- **npm** hoặc **yarn**
- **Git** (tuỳ chọn)

## Cài đặt từ đầu

### 1. Clone hoặc tải dự án

```bash
# Nếu dùng git
git clone <repo-url>
cd scentcandlewithVy

# Hoặc tải thủ công và giải nén
# Mở terminal trong thư mục dự án
```

### 2. Cài đặt Frontend

```bash
cd frontend

# Install dependencies
npm install

# Chạy dev server
npm run dev

# Hoặc build cho production
npm run build
```

**Lưu ý:** Frontend sẽ chạy trên `http://localhost:5173`

### 3. Cài đặt Backend

```bash
# Mở terminal mới (hoặc quay lại thư mục gốc trước)
cd backend

# Install dependencies
npm install

# Chạy server
npm run dev

# Hoặc chạy một lần
npm start
```

**Lưu ý:** Backend chạy trên `http://localhost:3000`

### 4. Kiểm tra kết nối

Mở trình duyệt, truy cập:

```
http://localhost:5173
```

Frontend sẽ tự động kết nối tới backend qua proxy `/api`.

## Cấu trúc Folder

```
scentcandlewithVy/
├── frontend/
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/          # UI primitives (Card, Button, Modal...)
│   │   │   ├── CandleStudio.jsx
│   │   │   └── Distribution.jsx
│   │   ├── hooks/           # Custom React hooks
│   │   │   └── useStorage.js
│   │   ├── utils/           # Utilities
│   │   │   └── formatters.js
│   │   ├── data/            # Constants
│   │   │   ├── theme.js
│   │   │   └── recipes.js
│   │   └── App.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .gitignore
│
├── backend/
│   ├── src/
│   │   └── server.js        # Express app + routes
│   ├── package.json
│   ├── .env.example         # Environment template
│   └── .gitignore
│
├── docs/
│   ├── API.md               # API endpoints
│   ├── SETUP.md             # This file
│   └── ARCHITECTURE.md
│
└── README.md
```

## Environment Variables

### Backend (.env)

Copy `.env.example` thành `.env` và điền:

```env
PORT=3000
NODE_ENV=development

# Nếu cần database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=scent_candle
DB_USER=postgres
DB_PASS=yourpassword
```

## Development Workflow

### Terminal 1 — Frontend

```bash
cd frontend
npm run dev
```

### Terminal 2 — Backend

```bash
cd backend
npm run dev
```

### Terminal 3 — Có tuỳ chọn

Dùng để chạy lệnh Git, cài thêm package, etc.

## Troubleshooting

### Port đã được sử dụng

**Lỗi:** `Error: listen EADDRINUSE: address already in use :::3000`

**Giải pháp:**
```bash
# Tìm process dùng port
lsof -i :3000

# Kill process (macOS/Linux)
kill -9 <PID>

# Hoặc thay đổi PORT trong backend/.env
PORT=3001
```

### Module not found

**Lỗi:** `Cannot find module 'react'`

**Giải pháp:**
```bash
cd frontend
rm -rf node_modules
npm install
```

### Frontend không thấy backend

**Lỗi:** Network error khi gọi API

**Kiểm tra:**
1. Backend chạy không? `http://localhost:3000/health`
2. Frontend proxy config đúng không? (vite.config.js)
3. CORS enabled trong backend?

## Build & Deploy

### Frontend Build

```bash
cd frontend
npm run build

# Output: dist/
# Deploy: Upload `dist/` folder tới hosting
```

### Backend Deploy

```bash
cd backend
npm start
```

## Tiếp theo

- Xem [API Documentation](./API.md) để hiểu các endpoint
- Xem [Architecture](./ARCHITECTURE.md) để hiểu kiến trúc tổng thể
- Migrate từ in-memory data tới real database
- Thêm authentication & authorization
- Deploy lên production (Heroku, Railway, Vercel, etc.)

---

Happy coding! 🕯️✨
