# Session Progress Log

## Current State

**Last Updated:** 2026-07-19 23:40
**Session ID:** feat-008
**Active Feature:** feat-009 + feat-008 — DONE, feat-010 tiếp theo (user yêu cầu "tiếp tục, hoàn thiện cho tôi")

**9/10 feature đã xong**: feat-001,002,003,004,007,006,005,009,008. Còn **feat-010** (báo cáo quản trị) đang làm.

- **feat-009 (Giá thanh lý 3 cấp)**: `SALVAGE_DEFAULTS` (recipes.js) + `db.salvageConfig` chỉnh được qua `SalvageConfigModal`. `resolveGrossSalvage`/`computeNetSalvage` (formatters.js) thay thế công thức `salvage ?? cost*0.5` cũ. `PriceModal` giờ có input override salvage/phí bán/đóng gói lại/huỷ hàng (để trống = kế thừa cấp 2/3) + dòng breakdown NetSalvageValue. Verify: khớp chính xác ví dụ trong kế hoạch gốc (70.000 - 5.000 - 5.000 = 60.000).
- **feat-008 (Trạng thái tồn thành phẩm chi tiết)**: `frontend/src/utils/productBatches.js` mới (song song batches.js nhưng cho thành phẩm, có trạng thái available/qc_hold/defective/sample). `inventoryPos.available` cho products giờ = tổng lô "available" (không phải tổng thô). `checkStockForItems` nhận thêm `productBatches` để chỉ kiểm tra lượng sẵn sàng bán. Mọi điểm thay đổi qty thành phẩm (lệnh sản xuất hoàn thành, xuất/hoàn đơn custom, khách trả hàng) đều đi qua lô thay vì cộng/trừ thẳng — khách trả hàng giờ vào lô "chờ QC", KHÔNG tự động cộng vào tồn sẵn bán. Products tab có panel "📦 N" xem breakdown theo trạng thái + đổi trạng thái từng lô qua dropdown. Verify: sản xuất 10 cây → sẵn sàng bán 10; chuyển sang "mẫu" → sẵn sàng bán về 0; khách trả 1 → tạo lô riêng "chờ QC" 1, sẵn sàng bán vẫn giữ nguyên 10 (không cộng nhầm).

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
- [x] **feat-006 hoàn thành**: sổ giao dịch đầy đủ.
  - `ROLES` (kho/sanxuat/quanly/chuso) + selector "Đang thao tác với vai trò" dưới hàng tab, ghi vào `db.currentRole` (mặc định "quanly") — chỉ để gắn nhãn, không chặn gì.
  - `TX_TYPE_LABELS` (10 loại nghiệp vụ) + `actorRole`/`txType`/`refDoc` gắn vào MỌI điểm tạo giao dịch có sẵn (moveOrder xuất/hoàn, lệnh sản xuất hoàn thành, nhận hàng PO, hoàn tất kiểm kê).
  - Những điểm tiêu thụ nhiều lô trong 1 hành động (xuất sản xuất, hoàn tất kiểm kê phần thiếu) đổi từ 1 dòng gộp sang 1 dòng/lô, mỗi dòng có đúng `batchId` riêng — truy vết chính xác tới từng lô.
  - Thêm 2 loại giao dịch MỚI có UI thật (không chỉ khai báo enum): "Ghi hao hụt" (nút trên từng lô trong bảng lô ở tab Kho — chọn Hàng hỏng/Hàng hết hạn, trừ đúng lô đó, không FEFO) và "Khách trả hàng" (nút trên đơn "Hoàn tất" ở tab Đơn hàng — chọn số lượng trả theo từng sản phẩm).
  - Bảng "Lịch sử biến động kho" thêm cột "Người TH" + dòng phụ hiện loại nghiệp vụ/Lô/Chứng từ dưới Lý do.
  - Verify sống: đổi vai trò sang "Nhân viên kho" → ghi hao hụt "hết hạn" cho đúng LOT-4 (180ml, xác nhận LOT-3 không bị đụng) → sổ giao dịch hiện đúng "Hàng hết hạn · Lô: LOT-4" + actor đúng; khách trả 1 cây Lotus Dream trên DH-001 → sổ giao dịch hiện "Khách trả hàng · Chứng từ: DH-001", tồn sẵn bán Lotus Dream 0→1.
  - Việc hoãn lại (nêu trong mô tả gốc nhưng không đủ hạ tầng): "chuyển vị trí kho" (chưa có khái niệm nhiều vị trí lưu kho) và "hàng dùng thử/tặng khách" (chưa có luồng riêng).

- [x] **feat-005 hoàn thành (rescoped)**: dùng thẳng dữ liệu `actorRole` feat-006 vừa dựng, không cần cơ chế gắn nhãn mới.
  - Dashboard: card "Hoạt động theo vai trò 👤" — mỗi vai trò hiện số giao dịch + ngày hoạt động gần nhất, tính trực tiếp từ `db.transactions`.
  - Kho tab: dropdown "Lọc theo vai trò" trên bảng Lịch sử biến động kho, lọc đúng danh sách đã hiển thị (kể cả txType/batchId/refDoc), có thông báo trống riêng khi lọc ra 0 kết quả (khác với "chưa có giao dịch nào").
  - CHỦ ĐỘNG KHÔNG làm phần "xác nhận nhẹ" từng nhắc trong mô tả rescoped — tự đánh giá là hình thức vô nghĩa khi chỉ 1 người tự duyệt cho chính mình; actorRole đã ghi nhận đúng "đang đội mũ vai trò gì lúc đó" là đủ cho mục đích F17 với doanh nghiệp 1 người.
  - Verify sống: đổi vai trò "sanxuat", hoàn tất 1 lệnh sản xuất (7 dòng sổ) → thẻ Dashboard hiện đúng "7 giao dịch · Gần nhất: 19/7/2026" cho Nhân viên sản xuất, các vai trò khác vẫn 0; lọc bảng theo "sanxuat" → đúng 7 dòng đó (mỗi dòng vẫn giữ đúng batchId riêng); lọc theo vai trò chưa có hoạt động ("chuso") → đúng thông báo trống riêng biệt.

### What's In Progress

- (không có — toàn bộ 3 feature còn lại từ yêu cầu "làm feat 5 6 7" đã xong: feat-007 → feat-006 → feat-005, đúng thứ tự đã chọn.)

### What's Next

- Hỏi user muốn làm gì tiếp theo. Còn lại trong feature-list.json: feat-008 (trạng thái tồn thành phẩm chi tiết), feat-009 (giá thanh lý 3 cấp), feat-010 (báo cáo quản trị) — cả 3 đều đã đủ điều kiện dependency, chưa có yêu cầu nào về thứ tự.

## Blockers / Risks

- [x] ~~feat-005 cần hỏi user về kiến trúc backend~~ — ĐÃ GIẢI QUYẾT: user xác nhận doanh nghiệp 1 người, feat-005 chỉ cần gắn nhãn vai trò (client-side, không cần backend/auth thật, không chặn quyền). feat-006 đã dựng sẵn `db.currentRole` + `actorRole` trên transactions — feat-005 chỉ cần XÀI dữ liệu này cho báo cáo, không cần dựng lại cơ chế gắn nhãn.
- [ ] Toàn bộ app vẫn client-only (`window.storage`), một người dùng — phù hợp với thực tế nghiệp vụ, không còn là vấn đề cần giải quyết.
- [ ] Giới hạn đã biết trong feat-001: hoàn kho đơn custom tạo lô "hoàn trả" mới thay vì truy ngược đúng lô gốc.
- [ ] Giới hạn đã biết trong feat-004: không có bước phê duyệt điều chỉnh kiểm kê thật (chỉ 1 người dùng nên không có ý nghĩa) — feat-005 rescoped có thể thêm bước "xác nhận nhẹ" mang tính nhắc nhở, không phải access-control.
- [ ] feat-006 chưa làm "chuyển vị trí kho" và "hàng dùng thử/tặng khách" — thiếu hạ tầng tương ứng (đa vị trí lưu kho, luồng tặng/mẫu riêng), nằm ngoài phạm vi hợp lý của 1 feature.
- [ ] Môi trường browser-test của session này: `computer` tool's `left_click` không đáng tin cậy. Cách xử lý ổn định: tìm nút qua `document.querySelectorAll('button')`, gọi trực tiếp `element[reactPropsKey].onClick(...)` qua `javascript_tool`, và LUÔN tách hành động và bước kiểm tra thành 2 lời gọi `javascript_exec` riêng. Khi trang có NHIỀU input cùng type (vd. nhiều input number), lọc theo ngữ cảnh gần nhất (label/placeholder hoặc đếm số lượng input hiện có) thay vì lấy `.find()` đầu tiên — dễ nhầm sang input nền phía sau modal.

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
