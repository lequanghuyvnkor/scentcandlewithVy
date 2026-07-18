# 🕯️ Candle Studio API Reference

Base URL: `http://localhost:3000`

## Health Check

```
GET /health
```

Response:
```json
{ "status": "🕯️ Candle Studio API running" }
```

---

## Products (Sản phẩm)

### Lấy tất cả sản phẩm
```
GET /products
```

Response:
```json
[
  {
    "id": "lavender-dream",
    "name": "Lavender Dream",
    "price": 185000,
    "cost": 62000,
    "active": true
  }
]
```

### Tạo sản phẩm mới
```
POST /products
```

Body:
```json
{
  "name": "New Candle",
  "price": 200000,
  "cost": 70000,
  "active": true
}
```

### Cập nhật sản phẩm
```
PUT /products/:id
```

Body:
```json
{
  "price": 210000,
  "cost": 75000
}
```

---

## Materials (Nguyên liệu)

### Lấy tất cả nguyên liệu
```
GET /materials
```

### Nhập kho
```
POST /materials/:id/restock
```

Body:
```json
{
  "qty": 1000
}
```

---

## Customers (Khách hàng)

### Lấy tất cả khách
```
GET /customers
```

### Tạo khách mới
```
POST /customers
```

Body:
```json
{
  "name": "Chị Hoa",
  "phone": "0901 234 567",
  "note": "Thích mùi hoa"
}
```

---

## Orders (Đơn hàng)

### Lấy tất cả đơn hàng
```
GET /orders
```

Response:
```json
[
  {
    "id": "DH-001",
    "customerId": "c1",
    "items": [["lavender-dream", 2]],
    "status": "done",
    "created": "2026-07-10"
  }
]
```

### Tạo đơn hàng mới
```
POST /orders
```

Body:
```json
{
  "customerId": "c1",
  "items": [["lavender-dream", 2]],
  "status": "new"
}
```

### Cập nhật đơn hàng (chuyển trạng thái)
```
PUT /orders/:id
```

Body:
```json
{
  "status": "producing"
}
```

---

## Dashboard Stats

### Lấy thống kê
```
GET /stats
```

Response:
```json
{
  "revenue": 370000,
  "activeOrders": 3,
  "lowStock": 2,
  "customers": 3
}
```

---

## Status Values

- `new` — Mới
- `confirmed` — Xác nhận
- `producing` — Sản xuất
- `packing` — Đóng gói
- `done` — Hoàn tất

---

## Error Handling

Tất cả lỗi trả về 404 hoặc 500:

```json
{ "error": "Not found" }
```

---

## Integration Notes

- Frontend tự động proxy `/api/*` tới backend qua `localhost:3000`
- Mọi requests đều JSON
- Lưu ý: API hiện dùng in-memory storage — dữ liệu sẽ mất khi restart server
- Cần migrate tới real database cho production
