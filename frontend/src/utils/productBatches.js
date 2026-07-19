// F12 — Trạng thái tồn kho thành phẩm chi tiết. Song song với batches.js (NVL) nhưng cho thành phẩm:
// mỗi lô thành phẩm có trạng thái (sẵn sàng bán / chờ QC / hàng lỗi / hàng mẫu) — đơn hàng bán chỉ được
// trừ từ trạng thái "available" (nguyên tắc F12: "Đơn hàng bán chỉ được trừ từ lượng sẵn sàng bán").
import { batchStatus } from "./batches";

export const PRODUCT_BATCH_STATUSES = [
  { id: "available", label: "Sẵn sàng bán", emoji: "✅" },
  { id: "qc_hold", label: "Chờ kiểm tra chất lượng", emoji: "🔍" },
  { id: "defective", label: "Hàng lỗi", emoji: "⚠️" },
  { id: "sample", label: "Hàng mẫu", emoji: "🎁" },
];

function sortAvailableForConsumption(batches) {
  return [...batches]
    .filter((b) => b.status === "available" && b.remainingQty > 0)
    .sort((a, b) => {
      const ea = a.expiryDate ? new Date(a.expiryDate).getTime() : Infinity;
      const eb = b.expiryDate ? new Date(b.expiryDate).getTime() : Infinity;
      if (ea !== eb) return ea - eb;
      return new Date(a.receivedDate) - new Date(b.receivedDate);
    });
}

// Trừ kho thành phẩm CHỈ từ các lô "available" (FEFO/FIFO) — không được đụng tới lô QC/lỗi/mẫu.
export function consumeAvailableProductBatches(batches, productId, qty) {
  let remaining = qty;
  const consumedFrom = [];
  const touched = new Map();
  const candidates = sortAvailableForConsumption(batches.filter((b) => b.productId === productId));

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

export function productOnHandQty(batches, productId) {
  return batches.filter((b) => b.productId === productId).reduce((s, b) => s + b.remainingQty, 0);
}

export function productSellableQty(batches, productId) {
  return batches.filter((b) => b.productId === productId && b.status === "available").reduce((s, b) => s + b.remainingQty, 0);
}

// products[].qty = tổng TẤT CẢ trạng thái (onHand thật) — batches là nguồn sự thật duy nhất, giống materials.
export function syncProductQtyFromBatches(products, batches) {
  return products.map((p) => ({ ...p, qty: productOnHandQty(batches, p.id) }));
}

export function productStatusBreakdown(batches, productId) {
  const out = {};
  for (const s of PRODUCT_BATCH_STATUSES) {
    out[s.id] = batches.filter((b) => b.productId === productId && b.status === s.id).reduce((sum, b) => sum + b.remainingQty, 0);
  }
  return out;
}

export { batchStatus as productBatchExpiryStatus };
