# AGENTS.md — Scent Candle with Vy (Kho & Phân phối)

Ứng dụng quản lý tiệm nến thơm nhỏ (React + Vite frontend, Express backend hiện chưa được frontend gọi tới — toàn bộ state chạy qua `window.storage` phía client, một người dùng, không xác thực). Mục tiêu hiện tại: nâng phân hệ Kho lên khớp với bản kế hoạch "Định hình tính năng quản lý kho hàng" — phần toán tối ưu (ROP/Safety Stock/Newsvendor) đã làm tốt, nhưng lớp nền tảng dữ liệu (lô hàng/hạn dùng, nhà cung cấp, đơn mua hàng, kiểm kê, phân quyền) còn thiếu. Xem chi tiết từng feature trong `feature-list.json`.

## Startup Workflow

Trước khi viết code:

1. **Xác nhận thư mục làm việc** bằng `pwd`
2. **Đọc file này** đầy đủ
3. **Đọc tài liệu dự án nếu có** (`docs/ARCHITECTURE.md`, `docs/API.md`, `docs/SETUP.md`, `README.md`)
4. **Chạy `./init.sh`** để xác nhận môi trường (frontend + backend) hoạt động tốt
5. **Đọc `feature-list.json`** để biết trạng thái feature hiện tại
6. **Xem lại commit gần đây** bằng `git log --oneline -5`

Nếu verification nền (`./init.sh`) đang lỗi, sửa nó trước khi thêm scope mới.

## Working Rules

- **Mỗi lần chỉ làm một feature**: Chọn đúng một feature chưa xong trong `feature-list.json`, ưu tiên theo thứ tự dependencies.
- **Bắt buộc verify**: Không được báo "done" nếu chưa chạy lệnh xác minh (lint/build/test thủ công qua browser).
- **Cập nhật artifact**: Trước khi kết thúc phiên, cập nhật `progress.md` và `feature-list.json`.
- **Giữ đúng scope**: Không sửa file không liên quan tới feature đang làm.
- **Để lại trạng thái sạch**: Phiên sau phải chạy được `./init.sh` ngay lập tức.
- **Ngôn ngữ**: UI và domain wording của dự án là tiếng Việt — feature mới giữ nguyên convention này (tên biến/code tiếng Anh, string hiển thị tiếng Việt, đúng như code hiện tại trong `frontend/src/components/AdminApp.jsx`).
- **Kiến trúc hiện tại**: Đừng giả định có backend/DB thật đang chạy — `backend/src/server.js` là Express in-memory và **không được gọi** từ frontend. Nếu một feature (vd. phân quyền — feat-005) thực sự cần backend thật, phải nêu rõ quyết định kiến trúc này trong `progress.md` trước khi code, không tự ý bật kết nối ngầm.

## Required Artifacts

- `feature-list.json` — Nguồn sự thật về trạng thái feature (theo `feature-list.schema.json`)
- `progress.md` — Nhật ký liên tục giữa các phiên
- `init.sh` — Đường dẫn khởi động & verify chuẩn
- `session-handoff.md` — Dùng cho phiên làm việc lớn/bàn giao

## Definition of Done

Một feature chỉ được coi là done khi TẤT CẢ đều đúng:

- [ ] Hành vi mục tiêu đã được implement
- [ ] Verification bắt buộc đã thực sự chạy (lint / build / test tay qua browser)
- [ ] Có bằng chứng ghi lại trong `feature-list.json` (trường `evidence`) hoặc `progress.md`
- [ ] Repo vẫn khởi động lại được từ `./init.sh`

## End of Session

Trước khi kết thúc phiên:

1. Cập nhật `progress.md` với trạng thái hiện tại
2. Cập nhật `feature-list.json` với trạng thái feature mới
3. Ghi lại rủi ro/blocker chưa giải quyết
4. Commit với message rõ ràng khi code ở trạng thái an toàn
5. Để repo đủ sạch cho phiên sau chạy `./init.sh` ngay

## Verification Commands

```bash
# Full verification (khuyến nghị)
./init.sh
```

Các kiểm tra bắt buộc:
- `cd frontend && npm run lint` — ESLint cho React/JSX
- `cd frontend && npm run build` — Vite build phải qua được (bắt lỗi type/import runtime)
- `cd backend && npm install` — chỉ cài đặt, backend chưa có test thật (script `test` trong `package.json` chỉ là placeholder `exit 1`)
- Với feature có UI: mở `npm run dev` (frontend) và thao tác thật trên tab Kho/Sản xuất trong `AdminApp.jsx` để xác nhận hành vi, vì dự án chưa có test tự động cho UI.

## Escalation

Nếu gặp:
- **Quyết định kiến trúc** (vd. có cần bật backend thật cho phân quyền không): hỏi user, đừng tự quyết.
- **Yêu cầu không rõ**: đối chiếu lại bản kế hoạch gốc "Định hình tính năng quản lý kho hàng" (đã tóm tắt gap trong `feature-list.json`).
- **Test/build lặp lại lỗi**: cập nhật `progress.md`, gắn cờ để user review.
- **Mơ hồ về scope**: đọc lại phần `dependencies`/`description` của feature trong `feature-list.json`.
