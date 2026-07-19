# Session Progress Log

## Current State

**Last Updated:** 2026-07-19 21:30
**Session ID:** feat-007
**Active Feature:** feat-007 - Đề xuất nhập hàng làm tròn theo MOQ/quy cách — DONE

**QUAN TRỌNG — bối cảnh doanh nghiệp (user cung cấp 2026-07-19):** Đây là doanh nghiệp 1 người — chủ vừa quản lý vừa trực tiếp sản xuất, không có nhân viên riêng biệt. User yêu cầu: giữ nguyên toàn bộ tính năng quản lý hiện có (không bỏ bớt), nhưng feat-005 (phân quyền) KHÔNG nên xây dựng theo hướng chặn/giới hạn quyền giữa các vai trò (vì chỉ có 1 người thật). Đã thống nhất hướng đi: feat-005 sẽ là "gắn nhãn vai trò đang thao tác" (Kho/Sản xuất/Quản lý/Chủ shop) vào transaction — dùng để LỌC/BÁO CÁO sau này, không dùng để CHẶN thao tác. Ghép chung cơ chế với trường "người thực hiện" của feat-006 cho gọn (cùng là việc gắn nhãn ai/vai trò gì làm hành động, không phải access-control thật).

## Status

### What's Done

- [x] Đối chiếu codebase với bản kế hoạch "Định hình tính năng quản lý kho hàng", dựng bộ harness (`AGENTS.md`, `feature-list.json`, `init.sh`, `progress.md`, `session-handoff.md`)
- [x] Sửa 2 lỗi baseline có sẵn (thiếu ESLint config, 2 lỗi `react/no-unescaped-entities`) để `./init.sh` chạy sạch
- [x] **feat-001 hoàn thành** (batch/lot + FEFO/FIFO). Commit + push `4b9a1d5`.
- [x] **feat-002 hoàn thành** (nhà cung cấp + MOQ + quy cách đóng gói). Commit + push `f7b720b`.
- [x] **feat-003 hoàn thành** (đơn mua hàng tách khỏi nhập kho tức thời, Inventory Position). Commit + push `e6d136b`.
- [x] **feat-004 hoàn thành**: kiểm kê kho.
  - `db.stocktakes` mới, mỗi phiếu có `lines: [{materialId, systemQty, actualQty, note}]`. Tạo phiếu = chọn NVL (mặc định chọn hết) → chốt `systemQty` ngay lúc tạo → trạng thái "counting".
  - Tab mới "📋 Kiểm kê": mỗi phiếu mở rộng ra xem từng dòng, nhập số thực tế (khi đang "counting"), chênh lệch tính live, ô lý do CHỈ hiện + bắt buộc khi có chênh lệch. Nút "Hoàn tất kiểm kê" bị khoá tới khi mọi dòng đã đếm VÀ mọi dòng lệch đã có lý do.
  - `completeStocktake`: chênh lệch dương → tạo lô mới `ADJ-N` (IN); chênh lệch âm → trừ qua `consumeMaterialBatches` (FEFO/FIFO) như các luồng xuất kho khác (OUT). Không sửa tay `material.qty` — đúng nguyên tắc #1.
  - Verify sống trên browser: mở ST-1 (seed sẵn 1 dòng đã đếm+giải trình, 2 dòng chưa) → nút Hoàn tất khoá đúng; nhập 2 dòng còn lại (1 dòng lệch 0 không cần lý do, 1 dòng lệch -5 cần lý do) → nút chỉ mở sau khi điền lý do; hoàn tất → đúng 2 giao dịch OUT tham chiếu đúng mã phiếu + lý do, không nhân đôi; Kho tab xác nhận jar-round 60→58, oil-sage 240→235, vẫn 1 lô (trừ từ lô có sẵn, không tạo lô âm).
- [x] `./init.sh` sạch sau cả 4 feature (lint 0 lỗi/8 warning vô hại, build qua)
- [x] **feat-007 hoàn thành**: `roundOrderQty(rawNeed, moq, packSize)` mới trong `formatters.js`, dùng trong Kho tab thay cho công thức trừ thô cũ. Sửa luôn lời giải thích AI-suggestion vốn luôn nói "đang thấp hơn ROP" dù đôi khi lý do thực sự là MOQ (không phải thiếu hàng) — giờ tách 2 nhánh văn bản đúng ngữ cảnh. Verify sống: wax-soy hiện đúng "đã đủ Target Stock... nhưng MOQ yêu cầu tối thiểu 10.000g".

### What's In Progress

- User đã xác nhận đây là **doanh nghiệp 1 người** (chủ vừa quản lý vừa sản xuất). Đã thống nhất thứ tự làm nốt: **feat-007 (xong) → feat-006 → feat-005**, và feat-005 đổi hướng thành "gắn nhãn vai trò" thay vì phân quyền chặn thật.

### What's Next

1. **feat-006** (hoàn thiện sổ giao dịch: người thực hiện + đủ loại giao dịch + tham chiếu lô/chứng từ) — làm tiếp theo.
2. **feat-005** (rescoped: gắn "vai trò đang thao tác" vào transaction cho mục đích lọc/báo cáo, KHÔNG chặn quyền truy cập nào — vì chỉ 1 người dùng thật) — làm cuối, tận dụng cơ chế actor của feat-006.

## Blockers / Risks

- [x] ~~feat-005 cần hỏi user về kiến trúc backend~~ — ĐÃ GIẢI QUYẾT: user xác nhận doanh nghiệp 1 người, feat-005 chỉ cần gắn nhãn vai trò (client-side, không cần backend/auth thật, không chặn quyền).
- [ ] Toàn bộ app vẫn client-only (`window.storage`), một người dùng — phù hợp với thực tế nghiệp vụ (xem trên), không còn là vấn đề cần giải quyết.
- [ ] Giới hạn đã biết trong feat-001: hoàn kho đơn custom tạo lô "hoàn trả" mới thay vì truy ngược đúng lô gốc.
- [ ] Giới hạn đã biết trong feat-004: không có bước phê duyệt điều chỉnh kiểm kê (F16 có nhắc "người có quyền phê duyệt") — vì hệ thống chưa có phân quyền (feat-005 chưa làm), bất kỳ ai vào Admin cũng tự hoàn tất được. Sẽ khoá lại đúng vai trò khi feat-005 xong.
- [ ] Môi trường browser-test của session này: `computer` tool's `left_click` không đáng tin cậy. Cách xử lý ổn định: tìm nút qua `document.querySelectorAll('button')`, gọi trực tiếp `element[reactPropsKey].onClick(...)` qua `javascript_tool`, và LUÔN tách hành động và bước kiểm tra thành 2 lời gọi `javascript_exec` riêng (gộp chung dễ đọc phải state cũ do timing).

## Decisions Made

- **Batches là nguồn sự thật duy nhất, `material.qty` chỉ là cache đồng bộ.**
- **feat-003: draft không tính vào `onOrder`; mọi logic quyết định (ROP/SS/suggest/lowStock) dùng `position` thay vì `available`.**
- **feat-004: "chốt số liệu hệ thống" xảy ra ngay lúc TẠO phiếu** (không có bước "draft" riêng trước khi chốt) — khớp đúng thứ tự 2 bước đầu trong mô tả feature ("tạo phiếu" + "chốt số liệu" gộp làm một hành động).
- **feat-004: chênh lệch dương tạo lô mới (ADJ-N), chênh lệch âm trừ qua FEFO/FIFO từ lô có sẵn** — nhất quán với cách feat-001 đã xử lý xuất/nhập, không cần cơ chế riêng.
- **feat-004: không làm approval/role gate** — vì phân quyền (feat-005) chưa được quyết định kiến trúc, thêm gate giả (không backend thật) sẽ vô nghĩa; ghi rõ giới hạn này để feat-005 quay lại xử lý.

## Files Modified This Session (từ đầu phiên, gồm feat-001/002/003/004)

- `AGENTS.md`, `feature-list.json`, `feature-list.schema.json`, `init.sh`, `progress.md`, `session-handoff.md` — bộ harness
- `.claude/launch.json` — cấu hình preview dev server
- `frontend/.eslintrc.cjs` — baseline fix (ESLint config)
- `frontend/src/components/SimulationTab.jsx` — sửa lỗi lint có sẵn + fix bug nhân đôi transaction (feat-001)
- `frontend/src/utils/batches.js` — logic FEFO/FIFO (feat-001), dùng lại nguyên trong feat-004
- `frontend/src/data/recipes.js` — `SEED.batches` (feat-001); `SEED.suppliers`+fields (feat-002); `SEED.purchaseOrders` (feat-003); `SEED.stocktakes` (feat-004)
- `frontend/src/components/AdminApp.jsx` — batch consumption + UI lô (feat-001); NCC/MOQ/đóng gói (feat-002); tab Mua hàng + PO modals + Inventory Position (feat-003); tab Kiểm kê + NewStocktakeModal + completeStocktake (feat-004)

## Evidence of Completion

- [x] `./init.sh`: lint 0 lỗi, build thành công — chạy lại sau feat-004.
- [x] Verify tay trên browser cho cả 4 feature — chi tiết đầy đủ trong `feature-list.json`.
- [x] feat-001 (`4b9a1d5`), feat-002 (`f7b720b`), feat-003 (`e6d136b`) đã push lên `origin/main`. feat-004 chưa commit tại thời điểm ghi file này.

## Notes for Next Session

feat-001 → feat-004 đã xong và verify đầy đủ, đúng thứ tự user yêu cầu (feat-003 xong mới tới feat-004). Nếu feat-004 chưa được commit/push khi đọc file này, hỏi user trước khi push. Hỏi user muốn làm feature nào tiếp theo — không có yêu cầu thứ tự cụ thể nào khác đã được đưa ra.
