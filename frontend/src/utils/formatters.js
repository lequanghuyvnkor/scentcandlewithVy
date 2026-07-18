import { WAX, FRAGS, DYES, RECIPES, BOM } from "../data/recipes";

export const fmtVND = (n) => Math.round(n).toLocaleString("vi-VN") + "đ";
export const rgbStr = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
export const hexToRgb = (h) => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
export const mixRGB = (a, b, t) => [0,1,2].map(i => Math.round(a[i]*(1-t) + b[i]*t));
export const lighten = (rgb, amt) => rgb.map(v => Math.min(255, v + amt));
export const darken  = (rgb, amt) => rgb.map(v => Math.max(0, v - amt));

// Tính màu sáp cuối cùng dựa trên loại sáp + mùi hương pha trộn + phẩm màu
export function candleColor(waxType, dyeId, dyeConc, blend) {
  let c = [...WAX[waxType].base];
  const totalPct = Object.values(blend).reduce((s,v)=>s+v,0);
  if (totalPct > 0) {
    let fr = [0,0,0];
    for (const [id, pct] of Object.entries(blend)) {
      const f = FRAGS.find(x=>x.id===id);
      fr = [0,1,2].map(i => fr[i] + f.dye[i]*(pct/totalPct));
    }
    c = mixRGB(c, fr.map(Math.round), 0.14);
  }
  const dye = DYES.find(d=>d.id===dyeId);
  if (dye?.hex) c = mixRGB(c, hexToRgb(dye.hex), Math.min(dyeConc/5, 1) * 0.9);
  return c;
}

// Hiển thị tên/emoji cho 1 item trong đơn hàng (catalog hoặc custom từ mô phỏng)
export function itemDisplay(item) {
  if (item.type === "custom") return { name: item.name, emoji: item.emoji };
  const r = RECIPES[item.productId];
  return { name: r?.name ?? item.productId, emoji: r?.emoji ?? "🕯️" };
}

export function itemUnitPrice(item, products) {
  if (item.type === "custom") return item.price;
  return products.find(p=>p.id===item.productId)?.price ?? 0;
}

export function orderTotal(order, products) {
  return order.items.reduce((s, item) => s + itemUnitPrice(item, products) * item.qty, 0);
}

// Gộp toàn bộ nguyên liệu cần dùng cho danh sách items (dùng chung cho catalog + custom)
export function materialsNeededForItems(items) {
  const need = {};
  for (const item of items) {
    if (item.type === "custom") {
      for (const [mid, qty] of item.bom) need[mid] = (need[mid] ?? 0) + qty * item.qty;
    } else {
      for (const [mid, per] of (BOM[item.productId] ?? [])) need[mid] = (need[mid] ?? 0) + per * item.qty;
    }
  }
  return need;
}

export function checkStockForItems(items, materials) {
  const need = materialsNeededForItems(items);
  const missing = [];
  for (const [mid, q] of Object.entries(need)) {
    const m = materials.find(x=>x.id===mid);
    if (!m || m.qty < q) missing.push({ name: m?.name ?? mid, need: q, have: m?.qty ?? 0, unit: m?.unit ?? "" });
  }
  return missing;
}
