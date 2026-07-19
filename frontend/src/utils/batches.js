// F04 — Quản lý lô hàng & hạn sử dụng. Xuất kho ưu tiên FEFO (hết hạn trước dùng trước),
// rơi về FIFO khi không có hạn dùng (jar/wax/wick không cần theo dõi hạn).

// Ngày "hiện tại" mô phỏng của app (khớp với seed data và mốc dùng ở AdminApp.jsx dashboard).
export const TODAY = "2026-07-18";

// FEFO trước (expiry sớm hơn lên trước, không hạn dùng xếp cuối), FIFO là tiêu chí phụ.
export function sortForConsumption(batches) {
  return [...batches].sort((a, b) => {
    const ea = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
    const eb = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
    if (ea !== eb) return ea - eb;
    return new Date(a.receivedDate) - new Date(b.receivedDate);
  });
}

// Trừ kho theo FEFO/FIFO cho một nguyên vật liệu. Trả về batches đã cập nhật + đã trừ từ lô nào (để truy vết).
export function consumeMaterialBatches(batches, materialId, qty) {
  let remaining = qty;
  const consumedFrom = [];
  const touched = new Map();
  const candidates = sortForConsumption(batches.filter((b) => b.materialId === materialId && b.remainingQty > 0));

  for (const b of candidates) {
    if (remaining <= 0) break;
    const take = Math.min(b.remainingQty, remaining);
    if (take <= 0) continue;
    touched.set(b.id, (touched.get(b.id) || 0) + take);
    consumedFrom.push({ batchId: b.id, qty: take });
    remaining -= take;
  }

  const updatedBatches = batches.map((b) => (touched.has(b.id) ? { ...b, remainingQty: b.remainingQty - touched.get(b.id) } : b));
  return { batches: updatedBatches, consumedFrom, shortfall: Math.max(0, remaining) };
}

// Trừ kho cho nhiều nguyên vật liệu cùng lúc. needMap: { materialId: qty }
export function consumeManyBatches(batches, needMap) {
  let curBatches = batches;
  const consumedLog = {};
  for (const [materialId, qty] of Object.entries(needMap)) {
    const { batches: nb, consumedFrom } = consumeMaterialBatches(curBatches, materialId, qty);
    curBatches = nb;
    consumedLog[materialId] = consumedFrom;
  }
  return { batches: curBatches, consumedLog };
}

export function materialOnHand(batches, materialId) {
  return batches.filter((b) => b.materialId === materialId).reduce((s, b) => s + b.remainingQty, 0);
}

// Đồng bộ lại material.qty = tổng remainingQty các lô — batches là nguồn sự thật duy nhất.
export function syncMaterialQtyFromBatches(materials, batches) {
  return materials.map((m) => ({ ...m, qty: materialOnHand(batches, m.id) }));
}

export function daysUntilExpiry(expiryDate, today = TODAY) {
  if (!expiryDate) return null;
  return Math.ceil((new Date(expiryDate) - new Date(today)) / (1000 * 3600 * 24));
}

// level: "none" (không hạn dùng) | "ok" | "soon" (<=30 ngày) | "expired"
export function batchStatus(expiryDate, today = TODAY) {
  const days = daysUntilExpiry(expiryDate, today);
  if (days === null) return { label: "Không hạn dùng", level: "none", days: null };
  if (days < 0) return { label: `Hết hạn ${Math.abs(days)} ngày trước`, level: "expired", days };
  if (days <= 30) return { label: `Còn ${days} ngày`, level: "soon", days };
  return { label: `Còn ${days} ngày`, level: "ok", days };
}
