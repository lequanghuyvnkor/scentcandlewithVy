# 📝 Changelog — v2

## Thay đổi lớn trong bản cập nhật này

### 1. Landing page là màn hình chính
- Trang chủ hiện hero banner, 4 dòng sản phẩm, và phần "Cách hoạt động"
- Nút **Đăng nhập** chỉ còn là 1 nút nhỏ ở góc phải header
- Khách có thể browse Cửa hàng / Mô phỏng thoải mái mà **không cần đăng nhập**

### 2. Data linking thật giữa các phần
- Toàn bộ app (Cửa hàng, Mô phỏng, Quản lý) dùng chung 1 `db` object qua `window.storage`
- Đơn hàng dùng chung format `items` (`type: "catalog"` hoặc `type: "custom"`)
- Admin Kanban/Kho/Dashboard đọc được cả đơn từ Cửa hàng lẫn đơn tự thiết kế từ Mô phỏng

### 3. Mua hàng ngay sau khi mô phỏng xong
- Bước "Hoàn thiện" trong Mô phỏng có card **"Thích cây nến này chưa?"**
- Giá được tính từ chi phí nguyên liệu thật (BOM) × biên lãi
- Nút **Đặt mua cây nến này** → mở checkout → tạo đơn hàng custom gửi thẳng vào Kanban quản lý

### 4. Tổ chức lại dòng sản phẩm + bỏ tạo đơn thủ công
- 8 công thức chia thành 4 dòng: 🌸 Hoa Cỏ, 🍑 Trái Cây, 🪵 Gỗ Ấm, 🌿 Tươi Mát
- Cửa hàng có filter theo dòng sản phẩm
- Trang "Sản phẩm" bên Quản lý nhóm theo dòng
- **Bỏ nút "+ Đơn mới"** bên Quản lý — đơn hàng giờ chỉ được tạo tự động từ hành động của khách (Cửa hàng hoặc Mô phỏng)

### 5. Mô phỏng với 10 mẫu lọ thật
- Bước đầu tiên trong Mô phỏng giờ là **chọn kiểu lọ** trước khi chọn sáp
- 10 mẫu: tròn, vuông, nón, trụ cao, chai cổ dài, hũ thiếc, bát gốm, trái tim, lục giác, mason
- Mỗi mẫu có SVG hình dáng riêng biệt (không còn dùng chung 1 hình chữ nhật)
- Có nắp gỗ / nắp thiếc / nút bần / nắp mason tùy loại lọ
- Màu sáp thay đổi rõ ràng theo lựa chọn sáp/mùi/phẩm màu

### 6. Đổi theme sang tone kem
- Từ hồng pastel (`#F6A8C0`) sang be/kem/caramel (`#F7F0E3`, `#C9A15F`, `#8F6C3B`)

## Cấu trúc file mới trong `frontend/src/`

```
components/
  ├── ui/Primitives.jsx      # Card, Btn, Input, Badge, Modal, Toast
  ├── JarCandle.jsx          # 10 hình dáng lọ SVG
  ├── Header.jsx             # Nav bar + Login modal
  ├── LandingPage.jsx        # Trang chủ
  ├── CheckoutModal.jsx      # Modal thanh toán dùng chung Shop + Sim
  ├── ShopTab.jsx            # Cửa hàng (browse + cart + checkout)
  ├── SimulationTab.jsx      # Mô phỏng 5 bước + mua hàng
  └── AdminApp.jsx           # Dashboard, Kanban, Sản phẩm, Kho, Khách

data/
  ├── theme.js               # Bảng màu tone kem + ADMIN_PASSCODE
  └── recipes.js             # JAR_TYPES, WAX, FRAGS, DYES, WICKS, LINES,
                              # RECIPES, BOM, SEED, STATUSES_DEF

utils/
  └── formatters.js          # fmtVND, candleColor, orderTotal,
                              # materialsNeededForItems, checkStockForItems...

hooks/
  └── useStorage.js          # (không đổi)

App.jsx                      # Root — quản lý view/identity/adminAuthed
```

## Mật khẩu quản lý demo

```
candle2026
```
