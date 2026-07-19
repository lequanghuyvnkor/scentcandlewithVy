import { WAX, FRAGS, RECIPES, BOM } from "../data/recipes";

export const fmtVND = (n) => Math.round(n).toLocaleString("vi-VN") + "đ";
export const rgbStr = (c) => `rgb(${c[0]},${c[1]},${c[2]})`;
export const hexToRgb = (h) => [parseInt(h.slice(1,3),16), parseInt(h.slice(3,5),16), parseInt(h.slice(5,7),16)];
export const mixRGB = (a, b, t) => [0,1,2].map(i => Math.round(a[i]*(1-t) + b[i]*t));
export const lighten = (rgb, amt) => rgb.map(v => Math.min(255, v + amt));
export const darken  = (rgb, amt) => rgb.map(v => Math.max(0, v - amt));

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

// Gộp toàn bộ nguyên liệu cần dùng cho danh sách items (CHỈ dành cho nến custom)
export function materialsNeededForItems(items) {
  const need = {};
  for (const item of items) {
    if (item.type === "custom") {
      for (const [mid, qty] of item.bom) need[mid] = (need[mid] ?? 0) + qty * item.qty;
    }
  }
  return need;
}

// Gộp số lượng thành phẩm cần dùng cho đơn hàng
export function productsNeededForItems(items) {
  const need = {};
  for (const item of items) {
    if (item.type === "catalog") {
      need[item.productId] = (need[item.productId] ?? 0) + item.qty;
    }
  }
  return need;
}

export function checkStockForItems(items, materials, products) {
  const matNeed = materialsNeededForItems(items);
  const prodNeed = productsNeededForItems(items);
  const missing = [];
  
  for (const [mid, q] of Object.entries(matNeed)) {
    const m = materials.find(x=>x.id===mid);
    if (!m || m.qty < q) missing.push({ name: m?.name ?? mid, need: q, have: m?.qty ?? 0, unit: m?.unit ?? "" });
  }
  for (const [pid, q] of Object.entries(prodNeed)) {
    const p = products.find(x=>x.id===pid);
    const r = RECIPES[pid];
    if (!p || p.qty < q) missing.push({ name: r?.name ?? pid, need: q, have: p?.qty ?? 0, unit: "cây" });
  }
  
  return missing;
}

// --- INVENTORY OPTIMIZATION MATH & STATS ---

// Xấp xỉ hàm phân phối chuẩn ngược (Inverse Standard Normal CDF) - Rational Approximation (Abramowitz and Stegun)
export function NORMSINV(p) {
  if (p <= 0) return -3.090232; // Giới hạn dưới an toàn (0.1%)
  if (p >= 1) return 3.090232; // Giới hạn trên an toàn (99.9%)
  
  let c0 = 2.515517, c1 = 0.802853, c2 = 0.010328;
  let d1 = 1.432788, d2 = 0.189269, d3 = 0.001308;
  
  let t, sign;
  if (p < 0.5) { t = Math.sqrt(-2 * Math.log(p)); sign = -1; }
  else { t = Math.sqrt(-2 * Math.log(1 - p)); sign = 1; }
  
  let num = c0 + c1*t + c2*t*t;
  let den = 1 + d1*t + d2*t*t + d3*t*t*t;
  let z = t - (num / den);
  
  return sign * z;
}

// Tính hàm mật độ xác suất của phân phối chuẩn (Gaussian PDF)
export function gaussianPDF(x, mean, std) {
  if (std === 0) return x === mean ? 1 : 0;
  return (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / std, 2));
}

// Làm tròn số lượng đề xuất nhập lên theo MOQ và quy cách đóng gói (F09) — ví dụ trong kế hoạch:
// cần bổ sung 370ml, quy cách chai 500ml → đề xuất 1 chai (500ml), không đề xuất số lẻ.
export function roundOrderQty(rawNeed, moq = 0, packSize = 1) {
  const pack = packSize > 0 ? packSize : 1;
  const minQty = Math.max(rawNeed, moq || 0);
  return Math.ceil(minQty / pack) * pack;
}

// Tính Demand (D) và Độ lệch chuẩn (sigma_D) từ lịch sử đơn hàng cho từng nguyên liệu
export function calculateDemandStats(orders) {
  // Lọc đơn hàng đã giao (done)
  const doneOrders = orders.filter(o => o.status === 'done');
  if (doneOrders.length === 0) return {};
  
  // Nhóm lượng tiêu thụ nguyên liệu theo ngày
  const dailyUsage = {};
  for (const o of doneOrders) {
    const d = o.created; // yyyy-mm-dd
    if (!d) continue;
    if (!dailyUsage[d]) dailyUsage[d] = {};
    const mats = materialsNeededForItems(o.items);
    const prods = productsNeededForItems(o.items);
    for (const [mid, qty] of Object.entries(mats)) {
      dailyUsage[d][mid] = (dailyUsage[d][mid] || 0) + qty;
    }
    for (const [pid, qty] of Object.entries(prods)) {
      dailyUsage[d][pid] = (dailyUsage[d][pid] || 0) + qty;
    }
  }
  
  const dates = Object.keys(dailyUsage).sort();
  if (dates.length === 0) return {};
  
  // Tạo danh sách tiêu thụ của từng nguyên liệu qua các ngày
  const matUsages = {}; 
  for (const date of dates) {
    for (const [mid, qty] of Object.entries(dailyUsage[date])) {
      if (!matUsages[mid]) matUsages[mid] = [];
      matUsages[mid].push(qty);
    }
  }
  
  const firstDate = new Date(dates[0]);
  const lastDate = new Date(dates[dates.length-1]);
  let daysDiff = Math.ceil((lastDate - firstDate) / (1000 * 3600 * 24)) + 1;
  if (daysDiff < 1) daysDiff = 1;
  
  const stats = {};
  for (const [mid, usages] of Object.entries(matUsages)) {
    const total = usages.reduce((s, v) => s + v, 0);
    const mean = total / daysDiff;
    
    // Tính độ lệch chuẩn
    let sumSq = 0;
    // Có usages.length ngày có data
    for (const u of usages) {
      sumSq += Math.pow(u - mean, 2);
    }
    // Những ngày không có data (nhu cầu = 0)
    const zeroDays = daysDiff - usages.length;
    for (let i = 0; i < zeroDays; i++) {
      sumSq += Math.pow(0 - mean, 2);
    }
    
    const variance = sumSq / daysDiff;
    const stdDev = Math.sqrt(variance);
    
    stats[mid] = { D: mean, sigma_D: stdDev };
  }
  return stats;
}
