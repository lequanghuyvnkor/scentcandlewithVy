# Session Progress Log

## Current State

**Last Updated:** 2026-07-19 20:15
**Session ID:** feat-003
**Active Feature:** feat-003 - Quy trình đơn mua hàng (PO) tách khỏi nhập kho tức thời — DONE

## Status

### What's Done

- [x] Đối chiếu codebase với bản kế hoạch "Định hình tính năng quản lý kho hàng", dựng bộ harness (`AGENTS.md`, `feature-list.json`, `init.sh`, `progress.md`, `session-handoff.md`)
- [x] Sửa 2 lỗi baseline có sẵn (thiếu ESLint config, 2 lỗi `react/no-unescaped-entities`) để `./init.sh` chạy sạch
- [x] **feat-001 hoàn thành**: batch/lot tracking + FEFO/FIFO. Đã commit + push (`4b9a1d5`).
- [x] **feat-002 hoàn thành**: nhà cung cấp + MOQ + quy cách đóng gói trên từng NVL. Đã commit + push (`f7b720b`).
- [x] **feat-003 hoàn thành**: đơn mua hàng (PO) tách khỏi nhập kho tức thời.
  - `db.purchaseOrders` mới (draft → sent → in_transit → received/cancelled), seed 2 đơn demo.
  - Tab mới "🛒 Mua hàng": danh sách PO + nút chuyển trạng thái theo Kanban 1 chiều (giống pattern đơn hàng bán/lệnh sản xuất đã có), badge đếm đơn đang hoạt động (draft/sent/in_transit).
  - `RestockModal` đổi thành `NewPurchaseOrderModal` — nút "+ Nhập" ở Kho tab đổi tên thành "+ Đặt hàng" và giờ chỉ TẠO ĐƠN MUA (nháp), không cộng thẳng vào tồn kho nữa. Modal hỗ trợ 2 chế độ: preset (mở từ dòng NVL trong Kho, có gợi ý AI như cũ) và tự do (mở từ tab Mua hàng, có dropdown chọn NVL).
  - `ReceivePOModal` mới — chỗ DUY NHẤT còn tạo lô (feat-001) + giao dịch IN, khi bấm "Nhận hàng" ở đơn `in_transit`; hỏi số lượng thực nhận + hạn dùng lúc đó (đúng thời điểm biết hạn dùng thật).
  - `inventoryPos` giờ tính `onOrder` từ PO trạng thái `sent`/`in_transit` (draft không tính — chưa phải cam kết thật với NCC) và thêm field `position = onHand + onOrder - reserved` (đúng công thức Inventory Position trong F02). Toàn bộ logic quyết định ROP/SS/màu trạng thái/suggest qty và `lowStock` chuyển từ dùng `available` sang dùng `position` (nguyên tắc #3 của kế hoạch: đề xuất phải dựa trên Inventory Position).
  - Verify sống trên browser: nhận hàng PUR-1 (oil-jasmine) → tạo lô mới, qty 200→1200, badge 2→1; chuyển PUR-2 (jar-bottle) draft→sent → "Đang về: 20" xuất hiện đúng lúc (không hiện khi còn draft); tạo đơn mới qua dropdown chọn oil-oud → tự động điền đúng NCC/lead time, expectedDate = createdDate+12 ngày; huỷ đơn → badge giảm đúng.
- [x] `./init.sh` sạch sau cả 3 feature (lint 0 lỗi/8 warning vô hại, build qua)

### What's In Progress

- [ ] (không có — feat-003 đã đóng, sẵn sàng làm feat-004)

### What's Next

1. **feat-004 (Kiểm kê kho)** — user yêu cầu làm tuần tự feat-003 xong mới tới feat-004, giờ bắt đầu.
2. Sau feat-004: feat-005 (phân quyền) đủ điều kiện nhưng cần hỏi user về kiến trúc backend trước.

## Blockers / Risks

- [ ] feat-005 (phân quyền) cần quyết định kiến trúc: bật backend Express thật hay tiếp tục client-only — hỏi user trước khi code.
- [ ] Toàn bộ app vẫn client-only (`window.storage`), một người dùng.
- [ ] Giới hạn đã biết trong feat-001: hoàn kho đơn custom tạo lô "hoàn trả" mới thay vì truy ngược đúng lô gốc.
- [ ] feat-003 chưa liên kết PO với chuyển động giữ chỗ NVL cho sản xuất (vd. một PO "sắp về" không tự động gợi ý ưu tiên cho lệnh sản xuất đang thiếu NVL) — nằm ngoài phạm vi mô tả feat-003, có thể là việc của feat-004 nâng cao sau này (giai đoạn 4 trong kế hoạch gốc).
- [ ] Môi trường browser-test của session này: `computer` tool's `left_click` trên nút đôi khi không kích hoạt onClick của React một cách đáng tin cậy. Cách xử lý ổn định trong session: tìm nút qua `document.querySelectorAll('button')`, lấy prop `__reactProps...`, gọi trực tiếp `props.onClick(...)` qua `javascript_tool`. Luôn tách hành động (click/nhập) và bước kiểm tra kết quả thành 2 lời gọi `javascript_exec` riêng biệt — gộp chung trong 1 script đôi khi đọc state cũ do timing.

## Decisions Made

- **Batches là nguồn sự thật duy nhất, `material.qty` chỉ là cache đồng bộ.**
- **feat-002 không xây dựng UI CRUD nhà cung cấp riêng** — chỉ dữ liệu + hiển thị.
- **feat-003: draft không tính vào `onOrder`** — chỉ `sent`/`in_transit` là cam kết thật với NCC, khớp định nghĩa "Đang về" trong F02 (số lượng đã đặt mua, không phải mới nháp nội bộ).
- **feat-003: chuyển toàn bộ logic quyết định (ROP/SS/suggest/lowStock) từ `available` sang `position`** — bắt buộc phải làm ngay khi `onOrder` bắt đầu có giá trị thật (trước đó `onOrder` luôn 0 nên `available` và `position` trùng nhau, giờ khác nhau thật sự). Đây là nguyên tắc #3 trong kế hoạch gốc, không phải scope creep.
- **feat-003: nhận hàng không cho nhận từng phần theo % mà chỉ chỉnh số lượng thực nhận 1 lần** — giữ đơn giản, đúng phạm vi mô tả feature (không yêu cầu partial receipt phức tạp).

## Files Modified This Session (tính từ đầu phiên, gồm cả feat-001/002/003)

- `AGENTS.md`, `feature-list.json`, `feature-list.schema.json`, `init.sh`, `progress.md`, `session-handoff.md` — bộ harness
- `.claude/launch.json` — cấu hình preview dev server
- `frontend/.eslintrc.cjs` — baseline fix (ESLint config)
- `frontend/src/components/SimulationTab.jsx` — sửa lỗi lint có sẵn + fix bug nhân đôi transaction (feat-001)
- `frontend/src/utils/batches.js` — mới, logic FEFO/FIFO (feat-001)
- `frontend/src/data/recipes.js` — `SEED.batches` (feat-001); `SEED.suppliers`+ fields trên materials (feat-002); `SEED.purchaseOrders`+`nextPurNum` (feat-003)
- `frontend/src/components/AdminApp.jsx` — batch consumption + UI lô (feat-001); NCC/MOQ/đóng gói + fix default L/sL (feat-002); tab Mua hàng, PO_STATUSES, NewPurchaseOrderModal, ReceivePOModal, inventoryPos.onOrder/.position (feat-003)

## Evidence of Completion

- [x] `./init.sh`: lint 0 lỗi, build thành công — chạy lại sau feat-003.
- [x] Verify tay trên browser cho cả 3 feature — chi tiết đầy đủ trong `feature-list.json`.
- [x] feat-001 (`4b9a1d5`) và feat-002 (`f7b720b`) đã push lên `origin/main`. feat-003 chưa commit tại thời điểm ghi file này.

## Notes for Next Session

feat-001, feat-002, feat-003 đã xong và verify. Nếu feat-003 chưa được commit/push khi đọc file này, hỏi user trước khi push. Tiếp theo: feat-004 (Kiểm kê kho) theo đúng thứ tự user yêu cầu.
