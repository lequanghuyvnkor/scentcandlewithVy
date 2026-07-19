# Hướng dẫn vận hành Kho & Logistics 📦

Tài liệu này đi sâu vào **riêng phần quản lý kho/chuỗi cung ứng** của app — không nhắc lại phần khách hàng (Cửa hàng, Mô phỏng thiết kế nến) đã có trong [Hướng dẫn sử dụng](./HUONG_DAN_SU_DUNG.md). Đối tượng đọc: người trực tiếp vận hành kho — ra quyết định đặt hàng, sản xuất, kiểm kê — cần hiểu **vì sao** app đề xuất một con số, không chỉ **cách bấm nút**.

Các tab liên quan: **Kho · Mua hàng · Kiểm kê · Sản xuất · Sản phẩm (phần tồn kho) · Báo cáo · Logistics (sandbox)**.

---

## 0. Luồng dữ liệu tổng thể

```
Bán hàng (Đơn hàng) → Nhu cầu tiêu thụ (D, σD) → Kế hoạch sản xuất (BOM)
    → Nhu cầu nguyên vật liệu → Đề xuất mua hàng (ROP/Target Stock)
    → Đơn mua hàng (Mua hàng) → Nhận hàng → Lô nguyên vật liệu (Kho)
    → Sản xuất (trừ NVL theo FEFO) → Lô thành phẩm (Sản phẩm)
    → Bán ra (trừ từ "sẵn sàng bán") → quay lại vòng lặp
```

Nguyên tắc xuyên suốt cả hệ thống: **không ai được sửa tay số tồn kho**. Mọi tăng/giảm đều phải đi qua một giao dịch có ghi rõ loại, số lượng, lô liên quan, người/vai trò thực hiện, và chứng từ tham chiếu. Đây là lý do vì sao các báo cáo (mục 10) tính ra được chính xác mà không cần một cơ sở dữ liệu lịch sử riêng — sổ giao dịch chính là lịch sử.

---

## 1. Lô hàng & nguyên tắc FEFO/FIFO

Mỗi lần nguyên vật liệu **vào kho** (nhận hàng mua, điều chỉnh kiểm kê dư, hoàn kho...), hệ thống tạo một **lô** riêng biệt — không cộng dồn vào một con số tổng duy nhất. Mỗi lô có: mã lô, ngày nhập, hạn sử dụng (nếu có), số lượng ban đầu, số lượng còn lại.

Khi **xuất kho** (sản xuất, điều chỉnh kiểm kê thiếu...), hệ thống tự chọn lô để trừ theo thứ tự:

1. **FEFO** (First-Expired-First-Out): lô có hạn dùng gần nhất bị trừ trước — áp dụng cho nguyên vật liệu có hạn sử dụng (tinh dầu, màu...).
2. **FIFO** (First-In-First-Out) làm tiêu chí phụ: nếu hai lô cùng hạn dùng (hoặc đều không có hạn), lô nhập trước bị trừ trước.

**Ví dụ thật trong dữ liệu mẫu (Dầu Hoa sen)**: có 2 lô — LOT-3 nhập ngày 5/6 (hạn dùng xa, còn ~257 ngày) và LOT-4 nhập ngày 10/7 (hạn dùng gần, còn ~18 ngày). Dù LOT-4 nhập **sau** LOT-3, hệ thống vẫn xuất LOT-4 trước vì hạn dùng gần hơn — đúng nguyên tắc FEFO, không phải cứ nhập trước là xuất trước.

**Xem lô của một nguyên vật liệu**: tab Kho → bấm nút "Lô N" cạnh NVL đó. Danh sách hiện đúng theo thứ tự sẽ xuất (lô trên cùng xuất trước), kèm nhãn trạng thái hạn dùng:

| Trạng thái | Ý nghĩa |
|---|---|
| (không hiện gì) | Còn hạn dùng xa hoặc không có hạn dùng |
| "Còn N ngày" (nền vàng) | Sắp hết hạn trong vòng 30 ngày |
| "Hết hạn N ngày trước" (nền đỏ) | Đã quá hạn, cần xử lý gấp |

**Ghi nhận hao hụt riêng một lô**: nếu phát hiện một lô cụ thể bị hỏng hoặc hết hạn, bấm **"Ghi hao hụt"** ngay tại lô đó (không phải trừ chung theo FEFO) — chọn "Hàng hỏng" hoặc "Hàng hết hạn", nhập số lượng và lý do. Việc này chỉ trừ đúng lô đã chọn, không đụng tới các lô khác của cùng NVL.

---

## 2. Danh mục nguyên vật liệu & nhà cung cấp

Mỗi nguyên vật liệu ở tab Kho hiển thị dòng thông tin:

**🏷️ {Tên nhà cung cấp} · MOQ {số lượng} · Đóng gói {số lượng}/kiện**

- **Nhà cung cấp mặc định**: mỗi NVL gắn với 1 nhà cung cấp, mỗi nhà cung cấp có Lead Time trung bình/tối thiểu/tối đa/độ lệch chuẩn riêng (ví dụ: sáp nội địa ~2 ngày, tinh dầu nhập khẩu ~12 ngày).
- **MOQ (Minimum Order Quantity)**: số lượng tối thiểu phải đặt mỗi lần, bất kể thực sự cần bao nhiêu.
- **Quy cách đóng gói**: đơn vị đóng gói của nhà cung cấp (ví dụ chai 500ml) — mọi đề xuất đặt hàng đều được làm tròn lên bội số này (xem mục 4).

**Lead Time (L)** hiển thị ngay cạnh D/σD của mỗi NVL, có thể **sửa tay trực tiếp** (ô nhập số cạnh "L ="). Nếu không sửa, hệ thống tự lấy Lead Time trung bình của nhà cung cấp gán cho NVL đó làm mặc định.

---

## 3. Công thức Safety Stock, ROP, Target Stock

Đây là "bộ não" của tab Kho — mọi trạng thái An toàn/Cần đặt/Khẩn cấp và mọi đề xuất số lượng đặt hàng đều xuất phát từ 3 công thức này.

### Các biến đầu vào
- **D**: nhu cầu tiêu thụ trung bình mỗi ngày, tự tính từ lịch sử các đơn hàng đã "Hoàn tất".
- **σD**: độ lệch chuẩn của nhu cầu (mức độ biến động ngày qua ngày).
- **L**: Lead Time (ngày) — xem mục 2.
- **σL**: độ lệch chuẩn Lead Time (mức độ nhà cung cấp giao trễ/sớm thất thường) — lấy từ nhà cung cấp, có thể ghi đè qua trường `sL` nếu cần.
- **CSL (Mức phục vụ mục tiêu)**: % xác suất mong muốn không bị hết hàng trong một chu kỳ, chỉnh bằng thanh trượt ở đầu tab Kho (mặc định 95%).
- **Z**: hệ số chuẩn hoá tương ứng với CSL (CSL càng cao, Z càng lớn, Safety Stock càng nhiều) — tính tự động qua hàm phân phối chuẩn ngược (NORMSINV), không cần tự tra bảng.

### Công thức

```
Safety Stock (SS)  = Z × √( L × σD² + D² × σL² )
Reorder Point (ROP) = D × L + SS
Target Stock         = max( 2 × Mức tồn tối thiểu, ROP + SS + D × 14 )
```

> Target Stock được thiết kế đủ dùng cho Lead Time + khoảng 14 ngày đệm, không chỉ vừa đủ chạm ROP — để không phải đặt hàng liên tục mỗi khi chạm ngưỡng.

### Cách đọc trạng thái

Mỗi NVL được so sánh **Vị thế tồn kho** (Inventory Position — xem công thức ở mục 5) với SS và ROP:

| Điều kiện | Trạng thái |
|---|---|
| Vị thế tồn kho < SS | 🔴 Khẩn cấp |
| SS ≤ Vị thế tồn kho ≤ ROP | 🟡 Cần đặt |
| Vị thế tồn kho > ROP | 🟢 An toàn |

**Quan trọng**: so sánh dùng **Vị thế tồn kho**, KHÔNG dùng số tồn kho thô đang có trong kho — nếu chỉ nhìn số tồn thực tế, một NVL đã có đơn mua "đang về" đủ nhiều có thể bị đề xuất mua thêm một cách thừa thãi. Xem mục 5 để hiểu rõ khác biệt.

**Chỉnh CSL** ảnh hưởng ngay lập tức tới SS/ROP của **mọi** nguyên vật liệu cùng lúc (thanh trượt ở đầu trang Kho là chung, không phải riêng từng NVL).

---

## 4. Đề xuất nhập hàng — làm tròn theo MOQ & quy cách đóng gói

Khi bấm **"+ Đặt hàng"** tại một NVL, app hiện hộp "🤖 AI Khuyến nghị Đặt hàng" giải thích đầy đủ:

1. Tính **nhu cầu cần bổ sung trước làm tròn** = max(0, Target Stock − Vị thế tồn kho hiện tại).
2. Lấy giá trị lớn hơn giữa nhu cầu đó và **MOQ**.
3. **Làm tròn lên** tới bội số gần nhất của **quy cách đóng gói**.

**Ví dụ minh hoạ (đúng như trong thiết kế gốc)**: Vị thế tồn kho 130ml, ROP 150ml, Target Stock 500ml, MOQ 200ml, quy cách chai 500ml/chai →
nhu cầu cần bổ sung = 500 − 130 = 370ml → lớn hơn MOQ (200ml) nên giữ 370ml → làm tròn lên bội số của 500ml → **đề xuất đặt 500ml (1 chai)**, không đề xuất số lẻ 370ml.

Nếu tồn kho hiện tại **đã đủ** Target Stock nhưng bạn vẫn muốn đặt hàng (ví dụ để tranh thủ đợt giao hàng), app sẽ nói rõ: *"đã đủ Target Stock... nhưng quy cách/MOQ yêu cầu tối thiểu X mỗi đơn"* — tức số đề xuất lúc này chỉ là mức tối thiểu theo MOQ, không phản ánh nhu cầu thực sự thiếu hụt.

---

## 5. Quy trình đơn mua hàng (Purchase Order)

Điểm mấu chốt: **tạo đơn mua ≠ nhập kho ngay**. Hàng chỉ thực sự vào kho khi bấm "Nhận hàng".

```
📝 Nháp → 📤 Đã gửi NCC → 🚚 Đang về → ✅ Đã nhận
                ↓               ↓
              🚫 Huỷ          🚫 Huỷ
```

- **Tạo đơn** (từ tab Mua hàng bấm "+ Đơn mua mới", hoặc từ tab Kho bấm "+ Đặt hàng" tại một NVL cụ thể): chọn NVL, số lượng, đơn giá dự kiến → đơn ở trạng thái **Nháp**.
- **Nháp → Đã gửi NCC**: xác nhận đã thực sự đặt hàng với nhà cung cấp. Từ bước này, số lượng đơn mới được tính vào **"Đang về"**.
- **Đã gửi NCC → Đang về**: xác nhận nhà cung cấp đã báo đang giao hàng.
- **Đang về → Đã nhận**: bấm **"Nhận hàng"** — bước duy nhất tạo lô mới thật sự. Nhập số lượng **thực nhận** (có thể khác số đã đặt nếu giao thiếu/thừa) và **hạn sử dụng** của lô này (nếu NVL có hạn dùng).
- **Huỷ**: có thể huỷ đơn ở 3 trạng thái đầu (không huỷ được sau khi đã nhận).

### Công thức Vị thế tồn kho (Inventory Position)

```
Vị thế tồn kho = Tồn thực tế + Đang về − Đã giữ chỗ
```

- *Đang về* chỉ tính đơn mua ở trạng thái **"Đã gửi NCC"** hoặc **"Đang về"** — đơn còn **Nháp** chưa được tính, vì nháp mới là dự định nội bộ, chưa phải cam kết thật với nhà cung cấp.
- *Đã giữ chỗ* là lượng đã bị khoá cho đơn hàng khách hoặc lệnh sản xuất đang chờ xử lý (chưa thực sự xuất kho).

Mọi quyết định "có cần đặt hàng không" trong toàn bộ app đều dựa trên con số này, không dựa vào tồn kho thô — đây là lý do một NVL có "Đang về" nhiều có thể vẫn hiện 🟢 An toàn dù tồn thực tế đang thấp.

---

## 6. Sản xuất & tiêu hao nguyên vật liệu (BOM)

Mỗi sản phẩm có một **định mức (BOM)** cố định — ví dụ nến Hoa Sen 200g cần: sáp, tinh dầu, bấc, lọ, nắp theo tỷ lệ cố định.

**Tạo lệnh sản xuất** (tab Sản xuất → "+ Lệnh mới"): chọn sản phẩm + số lượng. App hiện ngay "đủ làm tối đa X cây" dựa trên tồn NVL hiện có, để biết trước có khả thi không.

**Bấm "Hoàn thành"**:
1. Trừ nguyên vật liệu theo đúng định mức × số lượng, theo nguyên tắc FEFO/FIFO (mục 1) — có thể trừ từ nhiều lô khác nhau nếu một lô không đủ.
2. Tạo một **lô thành phẩm mới** ở trạng thái "Sẵn sàng bán" (xem mục 8).

Việc trừ NVL theo lô (không chỉ trừ vào một con số tổng) là lý do **Báo cáo chênh lệch BOM** (mục 10.3) tính được chính xác tiêu hao thực tế của từng lệnh sản xuất, không chỉ là con số ước lượng.

---

## 7. Kiểm kê kho (Stocktake)

Dùng khi cần đối chiếu số hệ thống với số đếm tay thực tế. Quy trình 4 bước, có kiểm soát chặt để không thể "sửa khống" số liệu:

1. **Tạo phiếu**: chọn NVL cần kiểm (mặc định chọn tất cả). Ngay khi tạo, hệ thống **chốt số liệu hệ thống tại thời điểm đó** cho từng dòng — số này không đổi dù sau đó có giao dịch khác xảy ra.
2. **Đếm thực tế**: mở phiếu, nhập số đếm được cho từng dòng. Chênh lệch (thừa/thiếu) hiện ngay.
3. **Giải trình bắt buộc**: bất kỳ dòng nào có chênh lệch khác 0 đều **bắt buộc phải nhập lý do** trước khi được phép hoàn tất. Nút "Hoàn tất kiểm kê" tự động khoá lại nếu còn dòng chưa đếm hoặc còn dòng lệch chưa có lý do.
4. **Hoàn tất**: hệ thống tự sinh giao dịch điều chỉnh — **không ai sửa tay số tồn kho được**:
   - Thừa (đếm > hệ thống) → tạo một **lô mới** với số lượng chênh lệch.
   - Thiếu (đếm < hệ thống) → **trừ dần từ các lô hiện có** theo đúng FEFO/FIFO, giống như một lần xuất kho bình thường.

---

## 8. Quản lý tồn kho thành phẩm theo trạng thái

Tồn kho thành phẩm không phải một con số duy nhất — mỗi lô thành phẩm mang 1 trong 4 trạng thái:

| Trạng thái | Khi nào phát sinh | Có tính vào "Tồn sẵn bán" không? |
|---|---|---|
| ✅ Sẵn sàng bán | Sản xuất hoàn thành; hoặc sau khi tự tay duyệt từ trạng thái khác | **Có** |
| 🔍 Chờ kiểm tra chất lượng | Khách trả hàng (tự động) | Không |
| ⚠️ Hàng lỗi | Tự tay chuyển sau khi kiểm tra thấy hỏng | Không |
| 🎁 Hàng mẫu | Tự tay chuyển để dùng làm mẫu/trưng bày | Không |

**Nguyên tắc quan trọng nhất**: đơn hàng bán ra **chỉ được trừ từ lô "Sẵn sàng bán"**. Hàng khách trả về **không tự động** cộng lại vào tồn sẵn bán — nó vào thẳng "Chờ kiểm tra chất lượng", buộc phải qua bước duyệt tay.

**Xem & đổi trạng thái**: tab Sản phẩm → bấm nút "📦 N" ở mỗi sản phẩm → xem breakdown theo 4 trạng thái + danh sách từng lô, mỗi lô có ô chọn để đổi trạng thái (ví dụ: kiểm tra xong hàng khách trả, không lỗi → đổi từ "Chờ QC" sang "Sẵn sàng bán" để bán lại được).

### Sản phẩm mùa vụ / limited — mô hình Newsvendor

Với sản phẩm đánh dấu "Mùa vụ" (dễ ế nếu sản xuất dư, ví dụ hàng theo dịp lễ), app không dùng ROP/SS thông thường mà dùng mô hình **Newsvendor**, tính:

```
Cu (chi phí thiếu hàng) = Giá bán − Giá vốn
Co (chi phí tồn dư)     = Giá vốn − NetSalvageValue
CR* (Mức phục vụ tối ưu) = Cu / (Cu + Co)
Q* (Số lượng nên làm)    = Nhu cầu dự báo + Z(CR*) × Độ lệch chuẩn dự báo
```

CR* và Q* hiện ngay trên thẻ sản phẩm nếu đã đánh dấu "Mùa vụ". Có thể thử nghiệm công thức này trực quan (kéo thanh trượt giá bán/chi phí/giá thanh lý) ở tab **Logistics → mục 2 "Tối ưu theo mô hình Newsvendor"** trước khi áp dụng thật.

### Giá thanh lý 3 cấp & NetSalvageValue

`NetSalvageValue` (giá trị thu hồi ròng khi phải xả hàng tồn) được tính:

```
NetSalvageValue = Giá xả hàng gộp − Phí bán − Chi phí đóng gói lại − Chi phí huỷ hàng
```

"Giá xả hàng gộp" được xác định theo 3 cấp ưu tiên (cấp cao hơn ghi đè cấp thấp hơn):

1. **Riêng SKU**: nhập trực tiếp trong "✏️ Sửa giá" của sản phẩm đó.
2. **Theo dòng sản phẩm**: % giá vốn mặc định cho cả dòng (Hoa Cỏ/Trái Cây/Gỗ Ấm/Tươi Mát), chỉnh ở thẻ "Giá thanh lý mặc định" đầu tab Sản phẩm.
3. **Mặc định hệ thống**: % giá vốn áp dụng khi 2 cấp trên đều chưa cấu hình.

**Ví dụ**: giá vốn 100.000đ, giá xả hàng gộp 70.000đ, phí bán 5.000đ, chi phí đóng gói lại 5.000đ → NetSalvageValue = 70.000 − 5.000 − 5.000 = **60.000đ**, dùng thay cho giá thanh lý thô trong công thức Co ở trên — tránh đánh giá quá lạc quan lợi nhuận thu hồi khi hàng bị ế.

---

## 9. Sổ giao dịch & truy vết

Mọi biến động kho (NVL lẫn thành phẩm) đều tạo ra **một dòng trong sổ giao dịch** (xem cuối tab Kho), với đầy đủ:

- **Loại (IN/OUT)** và **số lượng**.
- **Loại nghiệp vụ**: Nhập mua hàng, Xuất sản xuất, Nhập thành phẩm, Xuất bán hàng, Khách trả hàng, Hoàn trả NVL, Hàng hỏng, Hàng hết hạn, Điều chỉnh kiểm kê, Hoàn tác trạng thái.
- **Lô hàng liên quan** (batchId) — nếu một lần xuất kho phải lấy từ 2 lô khác nhau, sổ ghi thành 2 dòng riêng, mỗi dòng đúng 1 lô, không gộp chung.
- **Chứng từ tham chiếu**: mã đơn hàng / đơn mua / lệnh sản xuất / phiếu kiểm kê liên quan.
- **Người thực hiện**: vai trò đang thao tác tại thời điểm đó (xem mục "vai trò" trong hướng dẫn tổng quát).

**Lọc theo vai trò**: dùng dropdown "Lọc theo vai trò" ngay trên bảng để xem riêng hoạt động của một vai trò — hữu ích khi muốn biết "tuần này mình dành bao nhiêu thời gian cho việc kho vs sản xuất".

**Giới hạn đã biết**: khi hoàn kho một đơn hàng custom (đơn bị lùi trạng thái sau khi đã trừ kho), hệ thống tạo một lô "hoàn trả" mới thay vì trả đúng về lô gốc đã xuất (vì đơn hàng chưa lưu lại chính xác đã lấy từ lô nào) — tổng số lượng vẫn luôn đúng, chỉ lịch sử lô của giao dịch hoàn trả không khớp 100% với lô gốc.

---

## 10. Báo cáo quản trị

Tab **📊 Báo cáo** — 4 báo cáo, tất cả tính trực tiếp từ sổ giao dịch/lô hàng hiện có (không cần chờ "tích luỹ dữ liệu" riêng):

### 10.1. Nhập - Xuất - Tồn theo kỳ
Chọn khoảng ngày, xem với mỗi mặt hàng có biến động trong kỳ: tồn đầu kỳ, tổng nhập, tổng xuất, tồn cuối kỳ. Tồn đầu kỳ được suy ngược từ tồn hiện tại (đúng vì mọi biến động đều đi qua giao dịch — không có "biến động ẩn" nào bị bỏ sót).

### 10.2. Hàng sắp hết hạn
Gộp cả lô nguyên vật liệu và lô thành phẩm (chỉ tính lô "sẵn sàng bán"), sắp theo mức độ khẩn cấp (hết hạn trước hiện trước). Dùng để lên kế hoạch xả hàng/ưu tiên sử dụng trước khi quá hạn.

### 10.3. Chênh lệch BOM
So sánh **định mức** (BOM) với **tiêu hao thực tế trung bình mỗi đơn vị** của từng nguyên vật liệu, tính từ các lệnh sản xuất **đã hoàn thành**. Chênh lệch dương (thực tế > định mức) có thể báo hiệu hao hụt trong quá trình sản xuất (đổ tràn, cân đo không chính xác...); chênh lệch âm có thể là dấu hiệu định mức đang đặt cao hơn thực tế cần.

> Chỉ áp dụng cho lệnh sản xuất theo sản phẩm chuẩn (có BOM cố định) — đơn hàng tự thiết kế (custom) từ Mô phỏng có công thức pha riêng theo từng đơn, không so sánh theo BOM chung được.

### 10.4. Tỷ lệ hết hàng theo SKU
% sản phẩm đang bán (active) hiện có 0 tồn "sẵn sàng bán". **Đây là ảnh chụp tại thời điểm xem**, chưa phải tỷ lệ % thời gian hết hàng trong quá khứ (app chưa lưu lịch sử tồn kho theo từng ngày để tính chỉ số đó).

---

## 11. Sandbox thuật toán (tab Logistics)

Đây là "phòng thí nghiệm" để hiểu và thử công thức **trước khi** áp dụng vào dữ liệu thật ở tab Kho/Sản phẩm:

- **Sandbox 1 — CSL/ROP/Safety Stock**: kéo thanh trượt Mức phục vụ, Lead Time, Nhu cầu trung bình, Độ lệch chuẩn nhu cầu → xem SS/ROP tính ra ngay, kèm 2 biểu đồ trực quan (chu kỳ tồn kho hình răng cưa, và phân phối chuẩn của nhu cầu trong Lead Time — vùng bên phải đường ROP là vùng rủi ro hết hàng).
- **Sandbox 2 — Newsvendor**: nhập Giá bán / Chi phí sản xuất / Giá thanh lý → app tính CR* và có nút **"Áp dụng CSL = X%"** để đưa thẳng kết quả này vào thanh trượt CSL chung của tab Kho.

Đây thuần tuý là công cụ mô phỏng — không đọc/ghi dữ liệu thật, nên có thể chỉnh thoải mái để thử các kịch bản mà không sợ ảnh hưởng số liệu đang vận hành.

---

## Phụ lục — Bảng tra công thức nhanh

| Công thức | Ý nghĩa |
|---|---|
| `Available = OnHand − Reserved` | Tồn có thể dùng ngay (chưa cộng "đang về") |
| `Inventory Position = OnHand + OnOrder − Reserved` | Vị thế tồn kho — dùng để quyết định đặt hàng |
| `SS = Z × √(L·σD² + D²·σL²)` | Tồn kho an toàn |
| `ROP = D×L + SS` | Điểm đặt hàng lại |
| `Target Stock = max(2×Min, ROP + SS + D×14)` | Mức tồn kho mục tiêu |
| `Đề xuất = ceil(max(rawNeed, MOQ) / PackSize) × PackSize` | Số lượng đặt hàng sau làm tròn MOQ/quy cách |
| `Cu = Giá bán − Giá vốn` | Chi phí cơ hội khi thiếu hàng (Newsvendor) |
| `Co = Giá vốn − NetSalvageValue` | Chi phí tồn dư khi thừa hàng (Newsvendor) |
| `CR* = Cu / (Cu + Co)` | Mức phục vụ tối ưu cho hàng mùa vụ |
| `NetSalvageValue = GiáXả − PhíBán − ĐóngGóiLại − HuỷHàng` | Giá trị thu hồi ròng thực tế |
