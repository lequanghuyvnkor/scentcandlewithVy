# Session Progress Log

## Current State

**Last Updated:** 2026-07-19 18:00
**Session ID:** feat-001
**Active Feature:** feat-001 - Lô hàng (Batch/Lot) & xuất kho FEFO/FIFO — DONE

## Status

### What's Done

- [x] Đối chiếu codebase với bản kế hoạch "Định hình tính năng quản lý kho hàng", dựng bộ harness (`AGENTS.md`, `feature-list.json`, `init.sh`, `progress.md`, `session-handoff.md`)
- [x] Sửa 2 lỗi baseline có sẵn (thiếu ESLint config, 2 lỗi `react/no-unescaped-entities`) để `./init.sh` chạy sạch
- [x] **feat-001 hoàn thành**: thêm `frontend/src/utils/batches.js` (FEFO/FIFO consumption, `syncMaterialQtyFromBatches`, `batchStatus`); thêm `db.batches` seed (1 lô/NVL, oil-lotus có 2 lô để minh hoạ FEFO≠FIFO, oil-jasmine/oil-rose có lô sắp hết hạn/đã hết hạn) trong `frontend/src/data/recipes.js`
- [x] Nối batch consumption vào 3 điểm trừ/hoàn kho trong `AdminApp.jsx`: `moveOrder` (đơn custom producing/revert), lệnh sản xuất "Hoàn thành", và `RestockModal` (tạo lô mới + hạn dùng tuỳ chọn)
- [x] Thêm UI: nút "Lô N ⚠️" mở rộng bảng lô theo từng NVL trong tab Kho, hiển thị mã lô/ngày nhập/còn lại/trạng thái hạn dùng, sắp theo đúng thứ tự FEFO/FIFO sẽ xuất
- [x] Phát hiện & sửa 1 bug có sẵn: `transactions.push(...)` trên tham chiếu mảng dùng chung (`d.transactions`) gây nhân đôi giao dịch dưới React StrictMode double-invoke — sửa bằng cách copy mảng (`[...(d.transactions||[])]`) trước khi push, ở cả `moveOrder` và handler "Hoàn thành" lệnh sản xuất
- [x] Verify sống trên browser (`npm run dev` qua `.claude/launch.json` mới tạo): FEFO ưu tiên đúng lô hết hạn sớm dù nhập sau; tiêu thụ từng phần và tiêu thụ hết sạch 1 lô đều đúng; nhập kho tạo lô mới đúng; sổ giao dịch không còn nhân đôi sau fix
- [x] `./init.sh` sạch (lint 0 lỗi/8 warning vô hại, build qua)

### What's In Progress

- [ ] (không có — feat-001 đã đóng, sẵn sàng chọn feature tiếp theo)

### What's Next

1. Chọn feat-002 (Nhà cung cấp + MOQ + quy cách đóng gói) — không phụ thuộc gì, làm tiếp theo hợp lý
2. Sau đó feat-003 (đơn mua hàng tách biệt) và feat-004 (kiểm kê) đều phụ thuộc feat-001 nên giờ đã mở khoá được

## Blockers / Risks

- [ ] feat-005 (phân quyền) cần quyết định kiến trúc: bật backend Express thật hay tiếp tục client-only — hỏi user trước khi code.
- [ ] Toàn bộ app vẫn client-only (`window.storage`), một người dùng.
- [ ] Giới hạn đã biết trong feat-001: khi hoàn kho đơn custom (producing → new/confirmed), hệ thống KHÔNG truy ngược đúng lô đã xuất ban đầu (order items không lưu batchId đã dùng) — thay vào đó tạo một lô "hoàn trả" mới (`RET-N`, không hạn dùng). Tổng số lượng luôn đúng, nhưng lịch sử lô của giao dịch hoàn trả không phản ánh đúng lô gốc. Chấp nhận được cho phạm vi feat-001; có thể cải thiện sau nếu cần truy vết chính xác tới từng lô.
- [ ] Vite dev server cần `.claude/launch.json` (đã tạo, trỏ `npm --prefix frontend run dev` cổng 5173) để `preview_start` hoạt động.

## Decisions Made

- **Batches là nguồn sự thật duy nhất, `material.qty` chỉ là cache đồng bộ** (`syncMaterialQtyFromBatches`) — giữ mọi chỗ đọc `m.qty` hiện có (ROP/SS, canMake, inventoryPos...) không cần sửa, giảm diện ảnh hưởng.
  - Context: tránh phải sửa hàng chục điểm đọc `m.qty` trong `AdminApp.jsx`/`formatters.js`.
- **Hoàn kho đơn custom tạo lô "hoàn trả" mới thay vì truy ngược đúng lô gốc** (xem Blockers).
  - Context: order items hiện không lưu batchId đã tiêu thụ; truy vết chính xác cần mở rộng transaction/order schema, vượt phạm vi feat-001.

## Files Modified This Session

- `AGENTS.md`, `feature-list.json`, `feature-list.schema.json`, `init.sh`, `progress.md`, `session-handoff.md` — bộ harness
- `frontend/.eslintrc.cjs` — baseline fix (ESLint config)
- `frontend/src/components/SimulationTab.jsx` — sửa 2 lỗi lint có sẵn + fix bug nhân đôi transaction (2 chỗ)
- `frontend/src/utils/batches.js` — mới, logic FEFO/FIFO
- `frontend/src/data/recipes.js` — thêm `SEED.batches`, `SEED.nextBatchNum`
- `frontend/src/components/AdminApp.jsx` — nối batch consumption vào moveOrder/production-complete/RestockModal, thêm UI bảng lô trong tab Kho
- `.claude/launch.json` — mới, cấu hình preview dev server

## Evidence of Completion

- [x] `./init.sh`: lint 0 lỗi (8 warning vô hại, không thuộc scope), build thành công.
- [x] Verify tay trên browser: xem chi tiết trong `feature-list.json` → feat-001.evidence (kịch bản FEFO 2-lô, tiêu thụ từng phần, tiêu thụ hết 1 lô, nhập kho tạo lô mới, không còn nhân đôi giao dịch).

## Notes for Next Session

feat-001 xong. Bắt đầu feat-002 (nhà cung cấp/MOQ/quy cách đóng gói) — không phụ thuộc gì. Nhớ: batches là nguồn sự thật, đừng sửa `material.qty` trực tiếp ở feature mới; nếu cần thêm field mới cho material (supplierId, moq, packSize) chỉ cần mở rộng object trong `recipes.js` và đọc trong AdminApp, không đụng tới cơ chế batch.
