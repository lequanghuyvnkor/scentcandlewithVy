# Hướng dẫn sử dụng — Scent Candle Studio 🕯️

Tài liệu này mô tả **toàn bộ tính năng** của app, dành cho người chủ tiệm vừa quản lý vừa trực tiếp sản xuất. Ứng dụng có 2 phần hoàn toàn tách biệt:

- **Giao diện khách hàng** — ai cũng vào được, dùng để xem/mua nến hoặc tự thiết kế nến theo ý mình.
- **Giao diện quản lý (Admin)** — nơi chủ tiệm điều hành toàn bộ: đơn hàng, sản xuất, kho, mua hàng, kiểm kê, báo cáo.

> **Lưu ý về dữ liệu**: app hiện lưu dữ liệu ngay trên trình duyệt (không có máy chủ/cơ sở dữ liệu thật phía sau). Nếu xoá dữ liệu trình duyệt hoặc đổi sang máy khác, toàn bộ đơn hàng/kho/lịch sử sẽ mất và quay về dữ liệu mẫu ban đầu. Trước khi dùng thật cho việc kinh doanh, nên hỏi người phát triển về việc gắn app vào một nơi lưu trữ bền vững hơn.

---

## 1. Đăng nhập

Góc trên bên phải có nút **"Đăng nhập"**, bấm vào sẽ hiện 2 lựa chọn:

| Vai trò | Cách vào | Dùng để |
|---|---|---|
| 🛍️ Khách hàng | Nhập tên (bắt buộc) + số điện thoại (không bắt buộc) | Xem/mua nến ở Cửa hàng, tạo đơn ở phần Mô phỏng |
| 🔑 Quản lý | Nhập mật khẩu: **`candle2026`** | Vào toàn bộ giao diện quản lý |

> Mật khẩu quản lý hiện đang là mã demo cố định, hiện ngay trên màn hình đăng nhập — không phải mật khẩu bảo mật thật. Không dùng app này với dữ liệu thật quan trọng cho tới khi có cơ chế đăng nhập an toàn hơn.

Sau khi đăng nhập, bấm **"Đăng xuất"** ở góc trên phải bất cứ lúc nào để thoát.

---

## 2. Giao diện khách hàng

### 2.1. Trang chủ

Trang giới thiệu tĩnh: banner mời chọn mùi hương/pha màu/thử lọ, danh sách 4 dòng sản phẩm (Hoa Cỏ, Trái Cây, Gỗ Ấm, Tươi Mát), và phần "Cách hoạt động" giải thích 4 bước tự thiết kế nến. Hai nút chính dẫn sang **Cửa hàng** hoặc **Mô phỏng**.

### 2.2. Cửa hàng — mua nến có sẵn

Hiển thị 9 mẫu nến đã pha sẵn (9 SKU), có thể lọc theo dòng sản phẩm. Mỗi nến hiện: hình lọ nến minh hoạ, tên, mùi hương, giá bán, và nút tăng/giảm số lượng.

Khi chọn số lượng > 0, một thanh giỏ hàng nổi lên ở cuối trang hiện tổng số lượng + tổng tiền và nút **"Đặt hàng →"**. Bấm vào sẽ mở form xác nhận (nhập tên/SĐT nếu chưa đăng nhập khách hàng), xác nhận xong đơn hàng được tạo ngay với trạng thái **"Mới"** và xuất hiện lập tức bên Admin → tab **Đơn hàng**.

### 2.3. Mô phỏng — tự thiết kế nến theo ý mình

Đây là tính năng nổi bật nhất bên khách hàng: một wizard 5 bước để khách tự pha chế một cây nến của riêng họ.

1. **Chọn kiểu lọ** — 10 mẫu lọ thật (tròn cổ điển, hộp vuông, ly hình nón, trụ cao, chai thuỷ tinh, hũ thiếc, bát gốm, lọ trái tim, lọ lục giác, hũ mason).
2. **Chọn sáp** — 3 loại: Sáp đậu nành, Sáp ong, hoặc Sáp hỗn hợp 80% đậu nành (mặc định). Mỗi loại có ngưỡng tải mùi hương tối đa khác nhau (soy 12%, sáp ong 8%, hỗn hợp 11%).
3. **Chọn mùi hương** — chọn **tối đa 4 mùi** trong 12 mùi có sẵn (lọc theo nhóm: Hoa cỏ / Trái cây / Tươi mát / Gỗ ấm), mỗi mùi có thanh trượt chỉnh % tải riêng (1–10%, bước 0.5). Nếu tổng % vượt ngưỡng của loại sáp đã chọn, app chỉ **cảnh báo bằng gợi ý**, không chặn — khách vẫn có thể tiếp tục.
4. **Trang trí lọ** — chọn màu lọ (trong suốt/đen nhám/hổ phách/sứ trắng, chỉ mang tính thẩm mỹ) và có thể khắc chữ tuỳ ý (tối đa 30 ký tự).
5. **Hoàn thiện** — chọn cỡ bấc (5 cỡ, ảnh hưởng thời gian cháy), có nút "Đốt thử" để xem hình nến cháy trực quan. App tự tính và hiển thị: số gam sáp/tinh dầu cần dùng, số giờ cháy, diện tích toả hương, độ toả hương lạnh/nóng, biểu đồ diễn biến hương theo thời gian (nốt cao/giữa/trầm), và các gợi ý tự động (ví dụ: tải hương quá cao/thấp, vùng chảy quá nhỏ...).

**Về giá**: giá hiển thị được tính **trực tiếp từ giá nguyên vật liệu hiện tại trong kho** (Admin → Kho), theo công thức: giá = giá vốn × 1.9 + 18.000đ, làm tròn lên 1.000đ gần nhất, tối thiểu 60.000đ. Nghĩa là nếu giá nguyên vật liệu bên Kho thay đổi, giá nến tự thiết kế cũng thay đổi theo ngay lập tức — không phải giá cố định.

Bấm **"🛍️ Đặt mua cây nến này"** sẽ tạo đơn hàng y hệt bên Cửa hàng (trạng thái "Mới"), nhưng là một dòng "custom" mang tên mô tả đầy đủ (mùi + khắc chữ + màu lọ) thay vì tên một SKU có sẵn.

---

## 3. Giao diện quản lý (Admin)

Sau khi đăng nhập bằng mật khẩu quản lý, thanh điều hướng đổi thành các tab quản lý. Ngay dưới hàng tab luôn có một dòng nhỏ:

> **"Đang thao tác với vai trò: [🧺 Nhân viên kho / 🏭 Nhân viên sản xuất / 🔑 Quản lý / 👑 Chủ shop]"**

Đây **không phải** cơ chế phân quyền/chặn thao tác (vì app này dành cho 1 người vừa quản lý vừa sản xuất) — đổi vai trò ở đây chỉ để **gắn nhãn** cho mỗi hành động, phục vụ báo cáo sau này (ví dụ: biết được hôm nay mình làm việc kho bao nhiêu, sản xuất bao nhiêu). Nên đổi đúng vai trò trước khi thao tác để dữ liệu báo cáo có ý nghĩa, nhưng không đổi cũng không sao — mọi tính năng vẫn dùng được bình thường.

### 3.1. 🏠 Tổng quan (Dashboard)

Trang tổng hợp nhanh:
- 4 thẻ số liệu: Doanh thu, Vốn đọng kho (giá trị tồn kho NVL + thành phẩm), Đơn đang chạy, Số món sắp hết.
- Biểu đồ doanh thu 7 ngày gần nhất.
- Biểu đồ tròn số đơn hàng theo từng trạng thái.
- Danh sách sản phẩm bán chạy nhất (theo số lượng đã bán ở đơn "Hoàn tất").
- Danh sách nguyên vật liệu cần nhập thêm.
- **Thẻ "Hoạt động theo vai trò"**: với mỗi vai trò trong 4 vai trò ở trên, hiện số giao dịch kho đã thực hiện + ngày hoạt động gần nhất — đây chính là nơi dùng dữ liệu "vai trò đang thao tác" nói ở trên.

### 3.2. 📦 Đơn hàng

Bảng Kanban 5 cột: **Mới → Xác nhận → Sản xuất → Đóng gói → Hoàn tất**. Đơn hàng tự động được tạo từ Cửa hàng/Mô phỏng bên khách hàng — quản lý chỉ cần bấm nút mũi tên để đẩy đơn tới trạng thái tiếp theo (hoặc lùi lại).

- Khi đẩy đơn sang **"Sản xuất"**: hệ thống tự động trừ nguyên vật liệu (theo FEFO/FIFO — xem mục Kho) và trừ thành phẩm có sẵn (chỉ trừ từ hàng "sẵn sàng bán"). Nếu không đủ nguyên liệu/hàng, app báo lỗi ngay và không cho chuyển.
- Lùi đơn lại từ "Sản xuất" về trước sẽ **tự động hoàn kho** (cộng lại nguyên vật liệu/thành phẩm đã trừ).
- Với đơn đã **"Hoàn tất"**, có thêm nút **"↩️ Khách trả hàng"** — mở ra form chọn số lượng khách trả cho từng sản phẩm trong đơn đó. Hàng trả về được đưa vào trạng thái **"Chờ kiểm tra chất lượng"**, KHÔNG tự động cộng vào tồn có thể bán ngay — phải qua bước duyệt riêng (xem mục 3.3).

### 3.3. 🕯️ Sản phẩm

Mỗi sản phẩm (SKU) hiển thị dưới dạng thẻ, nhóm theo 4 dòng sản phẩm:
- Hình lọ nến minh hoạ, tên, mùi hương, giá bán/giá vốn/% lãi.
- **"Làm thêm X"**: số lượng tối đa có thể sản xuất thêm dựa trên nguyên vật liệu hiện có.
- **"Tồn sẵn bán"**: CHỈ tính phần hàng ở trạng thái "sẵn sàng bán" — không tính hàng đang chờ QC/lỗi/mẫu (xem chi tiết bên dưới).
- Với sản phẩm đánh dấu **"Mùa vụ"**: hiện thêm Tỉ lệ phục vụ tối ưu (CR*) và số lượng nên sản xuất (Q*) theo mô hình Newsvendor — dùng cho hàng theo mùa/limited (dễ ế nếu sản xuất dư).
- Nút **"✏️ Sửa giá"**: đổi giá bán, đánh dấu sản phẩm mùa vụ hay không, và cấu hình **giá thanh lý** khi hàng bị ế:
  - Có thể để trống (dùng mức mặc định theo dòng sản phẩm hoặc mặc định toàn hệ thống — xem thẻ cấu hình phía trên danh sách sản phẩm), hoặc nhập riêng cho SKU này.
  - Có thể nhập thêm phí bán khi xả hàng, chi phí đóng gói lại, chi phí huỷ hàng — app tự tính ra **Giá trị thu hồi ròng** (số tiền thực sự thu về sau khi trừ hết chi phí), dùng để tính CR*/Q* chính xác hơn thay vì chỉ dùng giá thanh lý thô.
  - Thẻ **"Giá thanh lý mặc định (F15)"** ở đầu trang Sản phẩm cho phép chỉnh mức % mặc định theo từng dòng sản phẩm và mức mặc định chung toàn hệ thống, áp dụng cho mọi SKU chưa tự cấu hình riêng.
- Nút **"📦 N"**: mở bảng chi tiết tồn kho thành phẩm theo 4 trạng thái — ✅ Sẵn sàng bán / 🔍 Chờ kiểm tra chất lượng / ⚠️ Hàng lỗi / 🎁 Hàng mẫu — kèm danh sách từng lô hàng và một ô chọn để **chuyển trạng thái** (ví dụ: sau khi kiểm tra hàng khách trả xong, đổi từ "Chờ QC" sang "Sẵn sàng bán" để được bán lại; hoặc chuyển sang "Hàng lỗi" nếu phát hiện hỏng).

### 3.4. 🏭 Sản xuất

Danh sách lệnh sản xuất. Bấm **"+ Lệnh mới"** để chọn sản phẩm cần làm + số lượng (app hiện luôn số lượng tối đa làm được với NVL hiện có để tham khảo). Lệnh mới ở trạng thái "Đang chờ" — khi thực sự làm xong, bấm **"Hoàn thành"**:
- Tự động trừ nguyên vật liệu theo định mức (BOM) của sản phẩm, theo FEFO/FIFO.
- Tạo một lô thành phẩm mới ở trạng thái "Sẵn sàng bán".

### 3.5. 🛒 Mua hàng

Đây là nơi quản lý việc **đặt hàng nhà cung cấp** — tách biệt hẳn với việc nhập kho thực tế. Một đơn mua đi qua các bước:

**📝 Nháp → 📤 Đã gửi NCC → 🚚 Đang về → ✅ Đã nhận** (hoặc 🚫 Huỷ ở 3 bước đầu)

- **"+ Đơn mua mới"**: chọn nguyên vật liệu cần mua (tự hiện nhà cung cấp + lead time trung bình của NVL đó), nhập số lượng và đơn giá dự kiến.
- Ở mỗi bước draft/sent, có nút chuyển sang bước tiếp theo hoặc **"Huỷ"**.
- Khi đơn ở trạng thái "Đang về", có nút **"📦 Nhận hàng"** — đây là bước **DUY NHẤT** thực sự nhập hàng vào kho: nhập số lượng thực nhận (có thể khác số đã đặt) và hạn sử dụng lô hàng (nếu có), hệ thống tạo một lô nguyên vật liệu mới và ghi nhận giao dịch nhập kho.
- Chỉ khi đơn ở trạng thái "Đã gửi NCC" hoặc "Đang về" mới được tính là **"Đang về"** trong tồn kho (đơn còn nháp chưa tính, vì chưa phải cam kết thật với nhà cung cấp).

> Ở tab **Kho**, nút "+ Đặt hàng" cạnh mỗi nguyên vật liệu chính là lối tắt để tạo đơn mua mới cho đúng NVL đó, kèm gợi ý số lượng nên đặt (xem mục 3.7).

### 3.6. 📋 Kiểm kê

Dùng khi cần đối chiếu số liệu trên hệ thống với số đếm thực tế trong kho.

1. Bấm **"+ Tạo phiếu kiểm kê"**, chọn những nguyên vật liệu cần kiểm (mặc định chọn hết). Ngay khi tạo, hệ thống **chốt số liệu hệ thống hiện tại** cho từng dòng.
2. Bấm **"Xem chi tiết"** để mở phiếu, nhập số lượng **đếm được thực tế** cho từng dòng. Chênh lệch được tính ngay lập tức.
3. Nếu có chênh lệch (dù thừa hay thiếu), bắt buộc phải nhập **lý do/giải trình** — nút "Hoàn tất kiểm kê" sẽ bị khoá cho tới khi mọi dòng đã được đếm và mọi dòng lệch đã có lý do.
4. Khi hoàn tất, hệ thống **tự động sinh giao dịch điều chỉnh kho** (không ai được sửa tay số tồn kho): thừa thì tạo thêm một lô mới, thiếu thì trừ dần từ các lô hiện có.

### 3.7. 🧺 Kho

Đây là màn hình trung tâm để quản lý nguyên vật liệu. Mỗi dòng nguyên vật liệu hiện:

- **D, σD**: nhu cầu tiêu thụ trung bình mỗi ngày và độ biến động, tự tính từ lịch sử đơn hàng đã hoàn tất.
- **L (Lead Time)**: số ngày chờ hàng về, có thể sửa tay hoặc để mặc định theo nhà cung cấp đã gán.
- **Nhà cung cấp / MOQ / Quy cách đóng gói**: ví dụ "Hương Liệu Sài Gòn · MOQ 1.000ml · Đóng gói 500ml/kiện".
- **Khả dụng / Thực tế / Giữ chỗ / Đang về**: 
  - *Thực tế* = tổng tồn kho vật lý.
  - *Giữ chỗ* = đã bị "khoá" cho đơn hàng/lệnh sản xuất đang chờ xử lý.
  - *Đang về* = số lượng đã đặt mua (đơn ở trạng thái "Đã gửi NCC"/"Đang về") nhưng chưa nhận.
  - *Khả dụng* = Thực tế − Giữ chỗ (số thực sự dùng ngay được).
- **Trạng thái**: An toàn 🟢 / Cần đặt 🟡 / Khẩn cấp 🔴 — dựa trên so sánh **Vị thế tồn kho** (Thực tế + Đang về − Giữ chỗ, KHÔNG chỉ dựa vào số đang có trong kho) với Điểm đặt hàng lại (ROP) và Tồn kho an toàn (Safety Stock).
- **"+ Đặt hàng"**: mở form tạo đơn mua mới cho đúng NVL này. Nếu bấm từ đây, app hiện sẵn khuyến nghị số lượng nên đặt kèm giải thích chi tiết (nhu cầu, lead time, ROP, Target Stock), và số lượng đề xuất đã được **làm tròn theo MOQ và quy cách đóng gói** của nhà cung cấp (ví dụ: cần bổ sung 370ml nhưng quy cách là chai 500ml → đề xuất đặt đúng 1 chai, không đề xuất số lẻ).
- **"Lô N ⚠️"**: mở danh sách các lô hàng của NVL này, sắp theo đúng thứ tự sẽ được xuất trước (lô hết hạn sớm hơn xuất trước, kể cả khi lô đó nhập sau — nguyên tắc FEFO). Mỗi lô có nút **"Ghi hao hụt"** để ghi nhận hàng hỏng hoặc hết hạn ngay tại lô cụ thể đó (không ảnh hưởng các lô khác).

Cuối trang là **"Lịch sử biến động kho"** — sổ ghi mọi thay đổi (nhập/xuất), có thể lọc theo vai trò thực hiện, mỗi dòng ghi rõ loại nghiệp vụ (xuất sản xuất, nhập mua hàng, điều chỉnh kiểm kê, hàng hỏng...), lô hàng liên quan, và chứng từ tham chiếu (mã đơn hàng/đơn mua/phiếu kiểm kê).

**Mức phục vụ (CSL)** ở góc trên trang Kho: thanh trượt chỉnh mức độ "chắc chắn không hết hàng" mong muốn (mặc định 95%) — ảnh hưởng tới cách tính Safety Stock cho mọi nguyên vật liệu.

### 3.8. 🚚 Logistics

Đây là khu vực **mô phỏng/thử nghiệm** các công thức tối ưu tồn kho, không gắn với dữ liệu thật — dùng để hiểu cách các con số ở tab Kho được tính ra:

1. **Sandbox CSL/ROP/Safety Stock**: kéo thanh trượt Mức phục vụ, Lead Time, Nhu cầu trung bình, Độ lệch chuẩn — xem trực quan Safety Stock/ROP thay đổi ra sao, kèm biểu đồ chu kỳ tồn kho hình răng cưa và biểu đồ phân phối chuẩn nhu cầu.
2. **Sandbox Newsvendor**: nhập Giá bán / Chi phí sản xuất / Giá thanh lý — xem Mức phục vụ tối ưu (CR*) tính ra và có thể bấm áp dụng luôn vào thanh trượt CSL ở trên.

### 3.9. 👤 Khách

Danh sách khách hàng: số đơn đã đặt, tổng tiền đã chi (tính trên đơn "Hoàn tất"), mùi hương yêu thích, ghi chú.

### 3.10. 📊 Báo cáo

4 báo cáo quản trị:

1. **Nhập - Xuất - Tồn theo kỳ**: chọn khoảng ngày, xem tồn đầu kỳ/nhập/xuất/tồn cuối kỳ cho mọi mặt hàng có biến động trong kỳ đó (cả nguyên vật liệu lẫn thành phẩm).
2. **Hàng sắp hết hạn**: liệt kê mọi lô (nguyên vật liệu và thành phẩm) đang sắp hết hạn hoặc đã hết hạn, sắp theo mức độ khẩn cấp.
3. **Chênh lệch BOM**: so sánh định mức nguyên vật liệu theo công thức (BOM) với mức tiêu hao thực tế trung bình mỗi lệnh sản xuất — giúp phát hiện hao hụt bất thường trong sản xuất.
4. **Tỷ lệ hết hàng theo SKU**: cho biết bao nhiêu % sản phẩm đang bán mà hiện tại không còn hàng sẵn sàng bán. *(Lưu ý: đây là ảnh chụp tại thời điểm xem, chưa phải tỷ lệ % thời gian hết hàng trong lịch sử, vì app chưa lưu lịch sử tồn kho theo từng ngày.)*

---

## 4. Các khái niệm cần hiểu (giải thích nhanh)

| Thuật ngữ | Ý nghĩa đơn giản |
|---|---|
| **Lead Time (L)** | Số ngày chờ từ lúc đặt hàng tới lúc nhận được hàng |
| **Safety Stock (SS)** | Lượng tồn "dự phòng" để không bị hết hàng khi nhu cầu tăng bất ngờ hoặc hàng về trễ |
| **ROP (Reorder Point)** | Ngưỡng tồn kho mà khi chạm tới, phải đặt hàng ngay |
| **Target Stock** | Mức tồn kho mục tiêu muốn có sau khi đặt hàng xong |
| **Inventory Position (Vị thế tồn kho)** | Tồn thực tế + Đang về − Đã giữ chỗ — con số ĐÚNG để quyết định có cần đặt hàng hay không, không phải chỉ nhìn số tồn kho thô |
| **FEFO / FIFO** | Ưu tiên xuất lô hết hạn trước (FEFO) hoặc lô nhập trước (FIFO) — nguyên vật liệu có hạn dùng (tinh dầu...) áp dụng FEFO |
| **MOQ** | Số lượng tối thiểu mỗi lần đặt hàng với nhà cung cấp |
| **Quy cách đóng gói** | Đơn vị đóng gói của nhà cung cấp (ví dụ: chai 500ml) — số lượng đặt hàng luôn được làm tròn lên bội số này |
| **CSL (Mức phục vụ)** | % xác suất mong muốn không bị hết hàng — càng cao thì Safety Stock càng lớn |
| **Newsvendor / CR\* / Q\*** | Mô hình tính số lượng sản xuất tối ưu cho hàng mùa vụ/limited, cân bằng giữa rủi ro hết hàng và rủi ro tồn dư phải xả giá rẻ |
| **NetSalvageValue** | Số tiền thực sự thu về khi phải xả hàng tồn, sau khi trừ phí bán/đóng gói lại/huỷ hàng |
| **Vai trò đang thao tác** | Chỉ để gắn nhãn báo cáo (ai làm gì, khi nào) — không giới hạn quyền truy cập bất kỳ tính năng nào |

---

## 5. Gợi ý quy trình sử dụng hàng ngày/hàng tuần

1. **Đầu ngày**: mở tab Tổng quan xem có đơn mới, món nào sắp hết, đơn mua nào cần theo dõi.
2. **Có đơn mới**: qua tab Đơn hàng, xác nhận và đẩy đơn tới "Sản xuất" khi sẵn sàng làm.
3. **Cần làm nến**: qua tab Sản xuất, tạo lệnh sản xuất, làm xong bấm "Hoàn thành".
4. **Thấy cảnh báo "Cần đặt"/"Khẩn cấp" ở tab Kho**: bấm "+ Đặt hàng" ngay tại dòng NVL đó, làm theo gợi ý số lượng.
5. **Đơn mua đã gửi NCC**: theo dõi ở tab Mua hàng, khi hàng về bấm "Nhận hàng" để nhập kho chính thức.
6. **Định kỳ (ví dụ cuối tháng)**: tạo phiếu ở tab Kiểm kê để đối chiếu tồn kho thực tế, xử lý chênh lệch nếu có.
7. **Khách trả hàng**: xử lý ở tab Đơn hàng (nút "Khách trả hàng" trên đơn đã hoàn tất), sau đó nhớ vào tab Sản phẩm kiểm tra/duyệt lại hàng trả (chuyển từ "Chờ QC" sang "Sẵn sàng bán" hoặc "Hàng lỗi").
8. **Xem lại tình hình định kỳ**: tab Báo cáo để biết nhập-xuất-tồn theo kỳ, hàng sắp hết hạn cần xử lý gấp, chênh lệch BOM để phát hiện hao hụt bất thường trong sản xuất.

---

## 6. Giới hạn hiện tại (nên biết trước khi dùng thật)

- Dữ liệu chỉ lưu trên trình duyệt, chưa có cơ sở dữ liệu/máy chủ thật đứng sau.
- Mật khẩu quản lý là mã demo cố định (`candle2026`), chưa phải cơ chế đăng nhập an toàn.
- "Vai trò đang thao tác" chỉ mang tính gắn nhãn/báo cáo, không giới hạn quyền truy cập — phù hợp với việc chỉ có 1 người vận hành toàn bộ.
- Chưa có tính năng quản lý nhiều vị trí lưu kho (chuyển kho giữa các kệ/khu vực), chưa có luồng riêng cho hàng dùng thử/tặng khách, và chưa quản lý "kho bán thành phẩm" (nến đã đổ nhưng chưa đóng gói).
- Báo cáo "Tỷ lệ hết hàng" là ảnh chụp hiện tại, chưa phải số liệu lịch sử theo thời gian.
- Chưa có bộ kiểm thử tự động — mọi thay đổi tính năng nên được kiểm tra tay trực tiếp trên trình duyệt trước khi tin dùng.
