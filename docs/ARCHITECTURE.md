# 🏗️ Architecture & Design

Thiết kế kiến trúc hệ thống Candle Studio Distribution

## Tổng Quan

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT (React + Vite)                   │
│                                                               │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │                   Pages / Tabs                          │ │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │ │
│  │  │ Studio       │  │ Distribution │  │ Dashboard    │  │ │
│  │  │ (Thiết kế)   │  │ (Bán hàng)    │  │ (Thống kê)   │  │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │ │
│  └─────────────────────────────────────────────────────────┘ │
│                            │                                  │
│  ┌─────────────────────────▼─────────────────────────────┐  │
│  │         useStorage Hook (Persistent Storage)          │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │  window.storage API (Claude artifact storage)   │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └─────────────────────────┬─────────────────────────────┘  │
└─────────────────────────────┼──────────────────────────────────┘
                              │ HTTP (fetch/axios)
┌─────────────────────────────▼──────────────────────────────────┐
│                    API Gateway (Proxy)                         │
│                  localhost:3000/api/*                          │
└─────────────────────────────┬──────────────────────────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────────┐
│                   Express Server (Backend)                     │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐        │
│  │ /products    │  │ /orders      │  │ /materials   │  ...  │
│  └──────────────┘  └──────────────┘  └──────────────┘        │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │          In-Memory Database (JS Objects)                │ │
│  │  - products                                              │ │
│  │  - materials                                             │ │
│  │  - customers                                             │ │
│  │  - orders                                                │ │
│  └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘

[Tương lai: Migrate từ In-Memory → PostgreSQL / MongoDB]
```

## Frontend Architecture

### Cấu trúc Component

```
App.jsx (Tab router)
  ├── CandleStudio.jsx (Wizard flow 4 bước)
  │   ├── Step 0: Chọn sáp
  │   ├── Step 1: Kích thước lọ
  │   ├── Step 2: Tên công thức
  │   └── Step 3: Lưu
  │
  ├── Distribution.jsx (Kanban board)
  │   ├── Order Kanban (5 status columns)
  │   ├── Order Detail Modal
  │   └── Status transition logic
  │
  └── Dashboard.jsx (Stats & insights)
      ├── KPI Cards (revenue, orders, stock)
      ├── Revenue Chart (7 days)
      ├── Top Products
      └── Low Stock Alert

UI Primitives (reusable):
  ├── Card.jsx
  ├── Button.jsx
  ├── Input.jsx
  ├── Badge.jsx
  ├── Modal.jsx
  └── Toast.jsx

Custom Hooks:
  └── useStorage.js (persistent state)

Utilities:
  ├── formatters.js (VND, totals, calculations)
  ├── theme.js (colors & themes)
  └── recipes.js (product data & BOM)
```

### Data Flow

```
State: db = { products, materials, customers, orders }
                    │
                    ├─→ useStorage hook
                    │    └─→ window.storage.set/get (auto-persist)
                    │
                    ├─→ Render components
                    │    ├─→ CandleStudio (read-only)
                    │    ├─→ Distribution (read + update)
                    │    └─→ Dashboard (read-only)
                    │
                    └─→ User interactions
                         └─→ setDb() → triggers save
```

### Theme System

Pastel + cute aesthetic:

```javascript
THEME = {
  bg:        "#FDEEF3",    // Background
  card:      "#FFFBF7",    // Card background
  pink:      "#F6A8C0",    // Primary accent
  pinkDeep:  "#E37D9F",    // Primary deep
  green:     "#B5D8A6",    // Success
  red:       "#F0A3A3",    // Danger
  yellow:    "#F8DE8D",    // Warning
  blue:      "#A8CDEB",    // Info
  text:      "#7A5C64",    // Body text
  muted:     "#B0929B",    // Muted text
}
```

## Backend Architecture

### Server Structure

```
Express Server
  ├── Middleware
  │   ├── CORS
  │   └── JSON Parser
  │
  ├── Routes
  │   ├── /health          [GET]  - Health check
  │   ├── /products        [GET]  - List all
  │   ├── /products        [POST] - Create
  │   ├── /products/:id    [PUT]  - Update
  │   │
  │   ├── /materials       [GET]
  │   ├── /materials/:id/restock [POST]
  │   │
  │   ├── /customers       [GET]
  │   ├── /customers       [POST]
  │   │
  │   ├── /orders          [GET]
  │   ├── /orders          [POST]
  │   ├── /orders/:id      [PUT]
  │   │
  │   └── /stats           [GET]  - Dashboard stats
  │
  └── In-Memory DB
      ├── products[]
      ├── materials[]
      ├── customers[]
      └── orders[]
```

### Data Models

#### Product
```javascript
{
  id: "lavender-dream",
  name: "Lavender Dream",
  price: 185000,      // VND
  cost: 62000,        // VND
  active: true
}
```

#### Material
```javascript
{
  id: "wax-soy",
  name: "Sáp đậu nành",
  unit: "g",          // g | ml | cái
  qty: 12000,         // Current quantity
  min: 3000,          // Alert threshold
  price: 0.12         // Unit price
}
```

#### Order
```javascript
{
  id: "DH-001",
  customerId: "c1",
  items: [             // [productId, quantity]
    ["lavender-dream", 2],
    ["peach-sunset", 3]
  ],
  status: "producing", // new | confirmed | producing | packing | done
  created: "2026-07-10"
}
```

#### Customer
```javascript
{
  id: "c1",
  name: "Chị Mai",
  phone: "0901 234 567",
  note: "Thích mùi hoa, không thích gỗ",
  fav: "lavender-dream"  // favorite product
}
```

### Business Logic

#### Order Workflow

```
new → xác nhận → producing → packing → done
                    ↓
            [Trừ kho tự động]
            - Tra BOM của từng sản phẩm
            - Nhân qty theo đơn hàng
            - Check stock trước
            - Trừ material.qty
            - Mark order.deducted = true

Lùi lại:
  producing → confirmed → new
                    ↓
            [Hoàn kho tự động]
            - Cộng lại material.qty
            - Mark order.deducted = false
```

#### Inventory Tracking

```
Material:
  current_qty
  min_qty (threshold)
  
Alerts:
  - Hiển thị đỏ nếu qty ≤ min
  - Gợi ý nhập thêm
  
Cost Calculation:
  material_cost = unit_price × qty
```

#### Profit Calculation

```
Product Profit = (price - cost) × quantity_sold
Profit Margin = ((price - cost) / price) × 100%

Dashboard hiển thị:
  - Total revenue (đã hoàn tất)
  - Gross profit per product
  - Margin %
  - Top sellers
```

## Data Persistence Strategy

### Current (Development)

```
Frontend:  window.storage API
Backend:   JavaScript Objects in memory
           └─ Reset on server restart
```

### Future (Production)

```
Frontend:  Upgrade to IndexedDB hoặc SQLite WASM
Backend:   Migrate to PostgreSQL / MongoDB
           ├── Connection pooling
           ├── Transactions
           ├── Backup strategy
           └── Query optimization
```

## Security Considerations (TODO)

- [ ] Input validation (backend)
- [ ] CORS whitelisting
- [ ] Rate limiting
- [ ] Authentication (JWT)
- [ ] Authorization (role-based)
- [ ] HTTPS in production
- [ ] Sensitive data encryption

## Performance Optimization

### Frontend
- Lazy load components
- Memoize expensive calculations
- Optimize re-renders
- Bundle splitting

### Backend
- Database indexing (when migrated)
- Query optimization
- Caching (Redis for stats)
- Pagination for large datasets

## Monitoring & Logging

**Future additions:**
- Error tracking (Sentry)
- Performance monitoring (New Relic)
- Analytics (Mixpanel/Amplitude)
- Audit logs

---

**Next Steps:**
1. ✅ Complete MVP (all 3 phases)
2. ⬜ Integrate real database
3. ⬜ Add authentication
4. ⬜ Deploy to production
5. ⬜ Multi-user support
6. ⬜ Mobile app

---

Made with 💗 for Scent Candle Studio
