# Session Progress Log

## Current State

**Last Updated:** 2026-07-19 19:10
**Session ID:** feat-002
**Active Feature:** feat-002 - Danh mục nhà cung cấp + MOQ + quy cách đóng gói — DONE

## Status

### What's Done

- [x] Đối chiếu codebase với bản kế hoạch "Định hình tính năng quản lý kho hàng", dựng bộ harness (`AGENTS.md`, `feature-list.json`, `init.sh`, `progress.md`, `session-handoff.md`)
- [x] Sửa 2 lỗi baseline có sẵn (thiếu ESLint config, 2 lỗi `react/no-unescaped-entities`) để `./init.sh` chạy sạch
- [x] **feat-001 hoàn thành**: batch/lot tracking + FEFO/FIFO (`frontend/src/utils/batches.js`, `db.batches` seed, nối vào moveOrder/production-complete/RestockModal, UI bảng lô trong tab Kho). Đã fix kèm 1 bug có sẵn (transactions.push mutate mảng dùng chung gây nhân đôi dưới StrictMode). Đã commit + push lên `origin/main` (commit `4b9a1d5`).
- [x] **feat-002 hoàn thành**: thêm `SEED.suppliers` (5 NCC: sáp, tinh dầu nội địa, tinh dầu nhập khẩu, bao bì, bấc — mỗi NCC có leadTimeAvg/Min/Max/StdDev) và `supplierId`/`moq`/`packSize` trên từng NVL trong `recipes.js`. Kho tab hiển thị dòng "🏷️ NCC · MOQ x · Đóng gói y/kiện" cho mỗi NVL. Nhân tiện sửa 1 bug có sẵn: fallback Lead Time (`L`) trước đây kiểm tra `m.id.startsWith("frag")` — không NVL nào có id bắt đầu bằng "frag" nên nhánh đó chết, luôn rơi về hằng số 2; và `sL` (độ lệch chuẩn lead time) luôn hardcode 0.5. Giờ cả hai mặc định lấy từ NCC gán cho NVL đó khi chưa bị ghi đè tay.
- [x] Verify sống trên browser cho cả 2 feature (xem `feature-list.json` → feat-001/feat-002.evidence)
- [x] `./init.sh` sạch sau cả 2 feature (lint 0 lỗi/8 warning vô hại, build qua)

### What's In Progress

- [ ] (không có — feat-002 đã đóng, sẵn sàng chọn feature tiếp theo)

### What's Next

1. feat-003 (đơn mua hàng tách biệt khỏi nhập kho tức thời) và feat-004 (kiểm kê kho) giờ đã đủ điều kiện (phụ thuộc feat-001+feat-002 đều xong)
2. feat-007 (làm tròn đề xuất nhập theo MOQ/quy cách) cũng đã đủ điều kiện — có thể làm sớm hơn nếu muốn thấy MOQ/packSize thực sự tác động tới số đề xuất, không chỉ hiển thị

## Blockers / Risks

- [ ] feat-005 (phân quyền) cần quyết định kiến trúc: bật backend Express thật hay tiếp tục client-only — hỏi user trước khi code.
- [ ] Toàn bộ app vẫn client-only (`window.storage`), một người dùng.
- [ ] Giới hạn đã biết trong feat-001: hoàn kho đơn custom tạo lô "hoàn trả" mới thay vì truy ngược đúng lô gốc (order items chưa lưu batchId đã dùng). Tổng số lượng luôn đúng, chỉ lịch sử lô của giao dịch hoàn trả không khớp lô gốc.
- [ ] feat-002 chỉ dừng ở dữ liệu (đúng phạm vi mô tả) — MOQ/packSize CHƯA được dùng để làm tròn số lượng đề xuất nhập (đó là feat-007), và chưa có màn hình CRUD quản lý nhà cung cấp riêng (không bắt buộc theo mô tả feature).
- [ ] Môi trường browser-test của session này: `computer` tool's `left_click` trên nút đôi khi không kích hoạt onClick của React một cách đáng tin cậy (lý do chưa rõ — không phải bug của app, đã xác nhận bằng cách gọi trực tiếp `props.onClick` qua `__reactProps` và thấy hoạt động đúng). Nếu gặp lại tình trạng "click không phản hồi" ở phiên sau, thử invoke onClick trực tiếp qua JS thay vì nghi ngờ code app trước.

## Decisions Made

- **Batches là nguồn sự thật duy nhất, `material.qty` chỉ là cache đồng bộ** — giữ nguyên mọi chỗ đọc `m.qty` hiện có.
- **Hoàn kho đơn custom tạo lô "hoàn trả" mới thay vì truy ngược đúng lô gốc** — order schema chưa lưu batchId đã dùng, nằm ngoài phạm vi feat-001.
- **feat-002 không xây dựng UI CRUD nhà cung cấp riêng** — mô tả feature chỉ yêu cầu dữ liệu + gắn vào NVL ("là điều kiện để hoàn thiện F01 và F09"), không yêu cầu màn hình quản lý; tránh over-scope.
- **Sửa luôn 2 default bị hỏng (L fallback chết, sL hardcode) khi đụng tới vì cùng chỗ và cùng mục đích** (dùng dữ liệu NCC thật thay vì hằng số đoán mò) — rủi ro thấp, không đổi công thức ROP/SS, chỉ đổi nguồn giá trị mặc định.

## Files Modified This Session

- `AGENTS.md`, `feature-list.json`, `feature-list.schema.json`, `init.sh`, `progress.md`, `session-handoff.md` — bộ harness
- `.claude/launch.json` — cấu hình preview dev server
- `frontend/.eslintrc.cjs` — baseline fix (ESLint config)
- `frontend/src/components/SimulationTab.jsx` — sửa 2 lỗi lint có sẵn + fix bug nhân đôi transaction (feat-001)
- `frontend/src/utils/batches.js` — mới, logic FEFO/FIFO (feat-001)
- `frontend/src/data/recipes.js` — `SEED.batches`/`nextBatchNum` (feat-001); `SEED.suppliers` + `supplierId`/`moq`/`packSize` trên materials (feat-002)
- `frontend/src/components/AdminApp.jsx` — nối batch consumption + UI lô (feat-001); hiển thị NCC/MOQ/đóng gói + fix default L/sL (feat-002)

## Evidence of Completion

- [x] `./init.sh`: lint 0 lỗi (8 warning vô hại, không thuộc scope), build thành công — chạy lại sau cả feat-001 và feat-002.
- [x] Verify tay trên browser cho cả 2 feature — chi tiết đầy đủ trong `feature-list.json`.
- [x] feat-001 đã commit (`4b9a1d5`) và push lên `origin/main`. feat-002 chưa commit — xem "What's Next" khi bắt đầu phiên sau.

## Notes for Next Session

feat-001 và feat-002 đã xong và verify. Nếu feat-002 chưa được commit/push khi đọc file này, hỏi user trước khi push (đừng tự ý). Feature tiếp theo hợp lý: feat-003 (đơn mua hàng) hoặc feat-004 (kiểm kê) — cả hai giờ không còn bị chặn bởi dependencies.
