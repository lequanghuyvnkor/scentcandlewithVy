// ═══════════════════ JAR TYPES — 10 mẫu lọ cố định ═══════════════════
export const JAR_TYPES = [
  { id: "round",   name: "Lọ tròn cổ điển",      emoji: "🫙", diam: 8,   height: 10, factor: 0.88, lid: "none"  },
  { id: "square",  name: "Hộp vuông kem",         emoji: "🧊", diam: 8,   height: 9,  factor: 0.82, lid: "wood"  },
  { id: "cone",    name: "Ly nến hình nón",       emoji: "🍧", diam: 7,   height: 8,  factor: 0.75, lid: "none"  },
  { id: "tall",    name: "Trụ cao thanh lịch",    emoji: "📏", diam: 6,   height: 14, factor: 0.90, lid: "none"  },
  { id: "bottle",  name: "Chai thủy tinh cổ dài", emoji: "🍾", diam: 9,   height: 16, factor: 0.55, lid: "cork"  },
  { id: "tin",     name: "Hũ thiếc mini",         emoji: "🥫", diam: 6,   height: 4,  factor: 0.90, lid: "tin"   },
  { id: "bowl",    name: "Bát gốm rộng",          emoji: "🥣", diam: 11,  height: 5,  factor: 0.85, lid: "none"  },
  { id: "heart",   name: "Lọ trái tim",           emoji: "💗", diam: 8,   height: 7,  factor: 0.65, lid: "none"  },
  { id: "hexagon", name: "Lọ lục giác",           emoji: "⬡",  diam: 8,   height: 10, factor: 0.80, lid: "none"  },
  { id: "mason",   name: "Hũ mason cổ điển",      emoji: "🏺", diam: 8.5, height: 11, factor: 0.85, lid: "mason" },
];

// ═══════════════════ SÁP ═══════════════════
export const WAX = {
  soy:      { name: "Sáp đậu nành", emoji: "🌱", density: 0.86, burnRate: 7.0, meltPoint: 54, loadMax: 12, hotF: 0.85, coldF: 0.90, base: [252, 246, 228], desc: "Cháy sạch, giữ mùi tốt" },
  beeswax:  { name: "Sáp ong",       emoji: "🐝", density: 0.96, burnRate: 5.5, meltPoint: 63, loadMax: 8,  hotF: 0.78, coldF: 0.95, base: [237, 205, 130], desc: "Tự nhiên, cháy lâu" },
  soybee:   { name: "Sáp hỗn hợp (80% Đậu nành)", emoji: "🍯", density: 0.88, burnRate: 6.7, meltPoint: 56, loadMax: 11, hotF: 0.83, coldF: 0.91, base: [249, 238, 208], desc: "An toàn cho mẹ bầu và trẻ nhỏ" },
};

// ═══════════════════ DẦU THƠM ═══════════════════
export const FRAGS = [
  { id: "lotus",      name: "Hoa sen",    emoji: "🪷", family: "Hoa cỏ",    fp: 80, top: 6, mid: 9, base: 5,  dye: [245, 200, 215] },
  { id: "greenrice",  name: "Cốm non",    emoji: "🌾", family: "Hoa cỏ",    fp: 85, top: 8, mid: 7, base: 5,  dye: [180, 220, 150] },
  { id: "jasmine",    name: "Hoa nhài",   emoji: "🌼", family: "Hoa cỏ",    fp: 85, top: 6, mid: 9, base: 6,  dye: [244, 228, 172] },
  { id: "rose",       name: "Hoa hồng",   emoji: "🌹", family: "Hoa cỏ",    fp: 82, top: 7, mid: 9, base: 5,  dye: [238, 168, 180] },
  { id: "orange",     name: "Cam ngọt",   emoji: "🍊", family: "Trái cây",  fp: 72, top: 9, mid: 5, base: 4,  dye: [250, 170, 80] },
  { id: "pear",       name: "Quả lê",     emoji: "🍐", family: "Trái cây",  fp: 76, top: 8, mid: 7, base: 5,  dye: [200, 230, 160] },
  { id: "aloe",       name: "Lô hội",     emoji: "🪴", family: "Tươi mát",  fp: 80, top: 8, mid: 6, base: 6,  dye: [160, 210, 170] },
  { id: "oud",        name: "Trầm hương", emoji: "🤎", family: "Gỗ ấm",     fp: 88, top: 3, mid: 5, base: 10, dye: [160, 118, 78] },
  { id: "wood",       name: "Gỗ mộc",     emoji: "🪵", family: "Gỗ ấm",     fp: 85, top: 4, mid: 7, base: 9,  dye: [180, 140, 100] },
  { id: "licorice",   name: "Cam thảo",   emoji: "🪵", family: "Gỗ ấm",     fp: 82, top: 5, mid: 6, base: 8,  dye: [170, 130, 90] },
  { id: "amaranth",   name: "Bách nhật",  emoji: "🏵️", family: "Gỗ ấm",     fp: 80, top: 6, mid: 7, base: 7,  dye: [210, 150, 180] },
  { id: "sage",       name: "Xô thơm",    emoji: "🌿", family: "Gỗ ấm",     fp: 78, top: 7, mid: 6, base: 7,  dye: [150, 180, 150] },
];

// ═══════════════════ MÀU LỌ NẾN ═══════════════════
export const JAR_COLORS = [
  { id: "clear", name: "Trong suốt", hex: "transparent" },
  { id: "black", name: "Đen nhám",   hex: "#2C2C2E" },
  { id: "amber", name: "Hổ phách",   hex: "#B5651D" },
  { id: "white", name: "Sứ trắng",   hex: "#F5F5F5" },
];

// ═══════════════════ BẤC ═══════════════════
export const WICKS = [
  { id: "xs", name: "Nhỏ xíu",  factor: 0.70, meltK: 0.55 },
  { id: "sm", name: "Nhỏ",      factor: 0.85, meltK: 0.75 },
  { id: "md", name: "Vừa",      factor: 1.00, meltK: 1.00 },
  { id: "lg", name: "Lớn",      factor: 1.20, meltK: 1.18 },
  { id: "xl", name: "Siêu lớn", factor: 1.40, meltK: 1.35 },
];

// ═══════════════════ DÒNG SẢN PHẨM ═══════════════════
export const LINES = [
  { id: "floral", name: "Dòng Hoa Cỏ",   emoji: "🌸" },
  { id: "fruity", name: "Dòng Trái Cây", emoji: "🍑" },
  { id: "woody",  name: "Dòng Gỗ Ấm",    emoji: "🪵" },
  { id: "fresh",  name: "Dòng Tươi Mát", emoji: "🌿" },
];

// ═══════════════════ GIÁ THANH LÝ 3 CẤP (F15) ═══════════════════
// Cấp 1 (cao nhất): product.salvage — SKU tự cấu hình. Cấp 2: byLine — % giá vốn mặc định theo dòng sản phẩm.
// Cấp 3: systemPct — % giá vốn mặc định toàn hệ thống khi SKU và dòng đều chưa cấu hình.
export const SALVAGE_DEFAULTS = {
  systemPct: 0.5,
  defaultFeesPct: 0.05,
  byLine: { floral: 0.55, fruity: 0.45, woody: 0.5, fresh: 0.5 },
};

// ═══════════════════ CÔNG THỨC (8 SKU, chia 4 dòng) ═══════════════════
export const RECIPES = {
  "lotus-dream":  { name: "Lotus Dream", emoji: "🪷", line: "floral", wax: "soybee",  frags: [["Hoa sen", 18], ["Cốm non", 12]],    jarType: "round",   wick: "md" },
  "hanoi-autumn": { name: "Hanoi Autumn",emoji: "🍂", line: "woody",  wax: "soybee",  frags: [["Cốm non", 15], ["Gỗ mộc", 10]],     jarType: "round",   wick: "md" },
  "rose-garden":  { name: "Rose Garden", emoji: "🌹", line: "floral", wax: "soy",     frags: [["Hoa hồng", 16], ["Hoa nhài", 10]],  jarType: "heart",   wick: "sm" },
  "sweet-pear":   { name: "Sweet Pear",  emoji: "🍐", line: "fruity", wax: "soybee",  frags: [["Quả lê", 20], ["Cam ngọt", 10]],    jarType: "cone",    wick: "sm" },
  "aloe-breeze":  { name: "Aloe Breeze", emoji: "🪴", line: "fresh",  wax: "soy",     frags: [["Lô hội", 15], ["Hoa nhài", 8]],     jarType: "tin",     wick: "xs" },
  "cozy-woods":   { name: "Cozy Woods",  emoji: "🪵", line: "woody",  wax: "beeswax", frags: [["Gỗ mộc", 17], ["Trầm hương", 13]],  jarType: "mason",   wick: "lg" },
  "amber-nights": { name: "Amber Nights",emoji: "🤎", line: "woody",  wax: "soybee",  frags: [["Trầm hương", 15], ["Cam thảo", 10]],jarType: "bottle",  wick: "md" },
  "sage-garden":  { name: "Sage Garden", emoji: "🌿", line: "fresh",  wax: "soybee",  frags: [["Xô thơm", 18], ["Cam ngọt", 9]],    jarType: "hexagon", wick: "md" },
  "pure-jasmine": { name: "Pure Jasmine",emoji: "🌼", line: "floral", wax: "soy",     frags: [["Hoa nhài", 20], ["Cốm non", 8]],    jarType: "square",  wick: "md" },
};

// ═══════════════════ BOM — Bill of Materials mỗi công thức ═══════════════════
export const BOM = {
  "lotus-dream":  [["wax-soy", 304], ["wax-bee", 76], ["oil-lotus", 18], ["oil-greenrice", 12], ["jar-round", 1],   ["wick-md", 1]],
  "hanoi-autumn": [["wax-soy", 256], ["wax-bee", 64], ["oil-greenrice", 15], ["oil-wood", 10],  ["jar-round", 1],   ["wick-md", 1]],
  "rose-garden":  [["wax-soy", 300], ["oil-rose", 16], ["oil-jasmine", 10], ["jar-heart", 1],   ["wick-sm", 1]],
  "sweet-pear":   [["wax-soy", 256], ["wax-bee", 64], ["oil-pear", 20], ["oil-orange", 10],     ["jar-cone", 1],    ["wick-sm", 1]],
  "aloe-breeze":  [["wax-soy", 150], ["oil-aloe", 15], ["oil-jasmine", 8], ["jar-tin", 1],      ["wick-xs", 1]],
  "cozy-woods":   [["wax-bee", 420], ["oil-wood", 17], ["oil-oud", 13], ["jar-mason", 1],       ["wick-lg", 1]],
  "amber-nights": [["wax-soy", 200], ["wax-bee", 50], ["oil-oud", 15], ["oil-licorice", 10],    ["jar-bottle", 1],  ["wick-md", 1]],
  "sage-garden":  [["wax-soy", 304], ["wax-bee", 76], ["oil-sage", 18], ["oil-orange", 9],      ["jar-hexagon", 1], ["wick-md", 1]],
  "pure-jasmine": [["wax-soy", 350], ["oil-jasmine", 20], ["oil-greenrice", 8], ["jar-square", 1], ["wick-md", 1]],
};

// ═══════════════════ TRẠNG THÁI ĐƠN HÀNG ═══════════════════
export const STATUSES_DEF = [
  { id: "new",       label: "Mới",      emoji: "🌱" },
  { id: "confirmed", label: "Xác nhận", emoji: "💌" },
  { id: "producing", label: "Sản xuất", emoji: "🕯️" },
  { id: "packing",   label: "Đóng gói", emoji: "🎀" },
  { id: "done",      label: "Hoàn tất", emoji: "💗" },
];

// ═══════════════════ SEED DATA (dữ liệu khởi tạo) ═══════════════════
export const SEED = {
  products: [
    { id: "lotus-dream",  price: 220000, cost: 72000, active: true, qty: 0, isSeasonal: false },
    { id: "hanoi-autumn", price: 185000, cost: 61000, active: true, qty: 0, isSeasonal: true },
    { id: "rose-garden",  price: 210000, cost: 74000, active: true, qty: 0, isSeasonal: false },
    { id: "sweet-pear",   price: 175000, cost: 58000, active: true, qty: 0, isSeasonal: false },
    { id: "aloe-breeze",  price: 125000, cost: 38000, active: true, qty: 0, isSeasonal: false },
    { id: "cozy-woods",   price: 235000, cost: 88000, active: true, qty: 0, isSeasonal: true },
    { id: "amber-nights", price: 245000, cost: 92000, active: true, qty: 0, isSeasonal: false },
    { id: "sage-garden",  price: 165000, cost: 54000, active: true, qty: 0, isSeasonal: false },
    { id: "pure-jasmine", price: 170000, cost: 56000, active: true, qty: 0, isSeasonal: false },
  ],
  materials: [
    { id: "wax-soy",      name: "Sáp đậu nành",   emoji: "🌱", unit: "g",   qty: 12000, min: 3000, price: 0.12, supplierId: "SUP-1", moq: 10000, packSize: 5000 },
    { id: "wax-bee",      name: "Sáp ong",        emoji: "🐝", unit: "g",   qty: 5000,  min: 1500, price: 0.22, supplierId: "SUP-1", moq: 4000,  packSize: 2000 },
    { id: "oil-lotus",    name: "Dầu Hoa sen",    emoji: "🪷", unit: "ml",  qty: 480,   min: 100,  price: 1.8, supplierId: "SUP-2", moq: 1000, packSize: 500 },
    { id: "oil-greenrice",name: "Dầu Cốm non",    emoji: "🌾", unit: "ml",  qty: 350,   min: 100,  price: 1.6, supplierId: "SUP-2", moq: 1000, packSize: 500 },
    { id: "oil-jasmine",  name: "Dầu Hoa nhài",   emoji: "🌼", unit: "ml",  qty: 200,   min: 60,   price: 2.1, supplierId: "SUP-2", moq: 1000, packSize: 500 },
    { id: "oil-rose",     name: "Dầu Hoa hồng",   emoji: "🌹", unit: "ml",  qty: 190,   min: 60,   price: 2.0, supplierId: "SUP-2", moq: 1000, packSize: 500 },
    { id: "oil-orange",   name: "Dầu Cam ngọt",   emoji: "🍊", unit: "ml",  qty: 300,   min: 80,   price: 1.4, supplierId: "SUP-2", moq: 1000, packSize: 500 },
    { id: "oil-pear",     name: "Dầu Quả lê",     emoji: "🍐", unit: "ml",  qty: 260,   min: 80,   price: 1.7, supplierId: "SUP-2", moq: 1000, packSize: 500 },
    { id: "oil-aloe",     name: "Dầu Lô hội",     emoji: "🪴", unit: "ml",  qty: 240,   min: 80,   price: 1.6, supplierId: "SUP-2", moq: 1000, packSize: 500 },
    { id: "oil-oud",      name: "Dầu Trầm hương", emoji: "🤎", unit: "ml",  qty: 120,   min: 50,   price: 3.2, supplierId: "SUP-3", moq: 2000, packSize: 500 },
    { id: "oil-wood",     name: "Dầu Gỗ mộc",     emoji: "🪵", unit: "ml",  qty: 180,   min: 60,   price: 2.4, supplierId: "SUP-3", moq: 2000, packSize: 500 },
    { id: "oil-licorice", name: "Dầu Cam thảo",   emoji: "🪵", unit: "ml",  qty: 220,   min: 70,   price: 2.5, supplierId: "SUP-3", moq: 2000, packSize: 500 },
    { id: "oil-amaranth", name: "Dầu Bách nhật",  emoji: "🏵️", unit: "ml",  qty: 200,   min: 70,   price: 2.2, supplierId: "SUP-3", moq: 2000, packSize: 500 },
    { id: "oil-sage",     name: "Dầu Xô thơm",    emoji: "🌿", unit: "ml",  qty: 240,   min: 70,   price: 1.5, supplierId: "SUP-2", moq: 1000, packSize: 500 },
    { id: "jar-round",    name: "Lọ tròn cổ điển",emoji: "🫙", unit: "cái", qty: 60,    min: 20,   price: 15000, supplierId: "SUP-4", moq: 20, packSize: 10 },
    { id: "jar-square",   name: "Hộp vuông kem",  emoji: "🧊", unit: "cái", qty: 40,    min: 15,   price: 16000, supplierId: "SUP-4", moq: 20, packSize: 10 },
    { id: "jar-cone",     name: "Ly nến hình nón",emoji: "🍧", unit: "cái", qty: 35,    min: 15,   price: 13000, supplierId: "SUP-4", moq: 20, packSize: 10 },
    { id: "jar-tall",     name: "Trụ cao thanh lịch", emoji: "📏", unit: "cái", qty: 25, min: 10,   price: 17000, supplierId: "SUP-4", moq: 20, packSize: 10 },
    { id: "jar-bottle",   name: "Chai thủy tinh cổ dài", emoji: "🍾", unit: "cái", qty: 20, min: 8, price: 21000, supplierId: "SUP-4", moq: 20, packSize: 10 },
    { id: "jar-tin",      name: "Hũ thiếc mini",  emoji: "🥫", unit: "cái", qty: 55,    min: 20,   price: 9000, supplierId: "SUP-4", moq: 20, packSize: 10 },
    { id: "jar-bowl",     name: "Bát gốm rộng",   emoji: "🥣", unit: "cái", qty: 18,    min: 8,    price: 24000, supplierId: "SUP-4", moq: 20, packSize: 10 },
    { id: "jar-heart",    name: "Lọ trái tim",    emoji: "💗", unit: "cái", qty: 22,    min: 8,    price: 19000, supplierId: "SUP-4", moq: 20, packSize: 10 },
    { id: "jar-hexagon",  name: "Lọ lục giác",    emoji: "⬡",  unit: "cái", qty: 28,    min: 10,   price: 18000, supplierId: "SUP-4", moq: 20, packSize: 10 },
    { id: "jar-mason",    name: "Hũ mason cổ điển", emoji: "🏺", unit: "cái", qty: 24,  min: 10,   price: 20000, supplierId: "SUP-4", moq: 20, packSize: 10 },
    { id: "wick-xs",      name: "Bấc nhỏ xíu",    emoji: "🧵", unit: "cái", qty: 80,    min: 20,   price: 1800, supplierId: "SUP-5", moq: 100, packSize: 50 },
    { id: "wick-sm",      name: "Bấc nhỏ",        emoji: "🧵", unit: "cái", qty: 120,   min: 30,   price: 2000, supplierId: "SUP-5", moq: 100, packSize: 50 },
    { id: "wick-md",      name: "Bấc vừa",        emoji: "🧵", unit: "cái", qty: 150,   min: 40,   price: 2500, supplierId: "SUP-5", moq: 100, packSize: 50 },
    { id: "wick-lg",      name: "Bấc lớn",        emoji: "🧵", unit: "cái", qty: 60,    min: 20,   price: 3000, supplierId: "SUP-5", moq: 100, packSize: 50 },
    { id: "wick-xl",      name: "Bấc siêu lớn",   emoji: "🧵", unit: "cái", qty: 35,    min: 15,   price: 3600, supplierId: "SUP-5", moq: 100, packSize: 50 },
  ],
  // ═══ Nhà cung cấp (F01) — mỗi NVL gắn 1 NCC mặc định qua materials[].supplierId.
  // Lead Time lưu đủ trung bình/min/max/độ lệch chuẩn theo NCC (không chỉ 1 số cố định).
  suppliers: [
    { id: "SUP-1", name: "Sáp Việt An",                 note: "Sáp đậu nành & sáp ong nội địa", leadTimeAvg: 2,  leadTimeMin: 1, leadTimeMax: 4,  leadTimeStdDev: 0.6 },
    { id: "SUP-2", name: "Hương Liệu Sài Gòn",          note: "Tinh dầu nội địa (hoa cỏ, trái cây, tươi mát)", leadTimeAvg: 6,  leadTimeMin: 4, leadTimeMax: 9,  leadTimeStdDev: 1.2 },
    { id: "SUP-3", name: "Hương Liệu Nhập Khẩu Âu Mỹ",  note: "Tinh dầu nhập khẩu (gỗ ấm, trầm hương)", leadTimeAvg: 12, leadTimeMin: 7, leadTimeMax: 21, leadTimeStdDev: 3.5 },
    { id: "SUP-4", name: "Bao Bì Thủy Tinh Miền Nam",   note: "Lọ, hũ, chai đựng nến", leadTimeAvg: 4,  leadTimeMin: 2, leadTimeMax: 7,  leadTimeStdDev: 1.0 },
    { id: "SUP-5", name: "Xưởng Bấc & Phụ Kiện",        note: "Bấc nến các cỡ", leadTimeAvg: 3,  leadTimeMin: 2, leadTimeMax: 5,  leadTimeStdDev: 0.6 },
  ],
  customers: [
    { id: "c1", name: "Chị Mai",  phone: "0901234567", note: "Thích mùi hoa, không thích gỗ", fav: "lotus-dream" },
    { id: "c2", name: "Anh Tuấn", phone: "0912888123", note: "Mua tặng vợ, sinh nhật 12/8",   fav: "rose-garden" },
    { id: "c3", name: "Shop Cỏ May", phone: "0977555999", note: "Đại lý — chiết khấu 15%",    fav: "cozy-woods" },
  ],
  orders: [
    { id: "DH-001", customerId: "c1", items: [{ type: "catalog", productId: "lotus-dream", qty: 2 }], status: "done", created: "2026-07-10", deducted: true },
    { id: "DH-002", customerId: "c3", items: [{ type: "catalog", productId: "cozy-woods", qty: 10 }, { type: "catalog", productId: "sweet-pear", qty: 5 }], status: "producing", created: "2026-07-14", deducted: true },
    { id: "DH-003", customerId: "c2", items: [{ type: "catalog", productId: "rose-garden", qty: 1 }], status: "confirmed", created: "2026-07-16", deducted: false },
  ],
  transactions: [],
  productionOrders: [],
  // ═══ Lô hàng (F04) — mỗi NVL có ít nhất 1 lô ban đầu. Tinh dầu có hạn dùng (FEFO),
  // sáp/lọ/bấc không có hạn dùng (expiryDate: null → xuất theo FIFO qua receivedDate).
  // oil-lotus cố tình có 2 lô để minh hoạ FEFO ≠ FIFO: lô nhập SAU (LOT-batch-lotus-2)
  // lại hết hạn TRƯỚC lô nhập trước đó, nên hệ thống phải xuất lô nhập sau trước.
  batches: [
    { id: "LOT-1",  materialId: "wax-soy",       receivedDate: "2026-06-01", expiryDate: null,         initialQty: 12000, remainingQty: 12000, unitCost: 0.12, qcStatus: "passed" },
    { id: "LOT-2",  materialId: "wax-bee",        receivedDate: "2026-06-01", expiryDate: null,         initialQty: 5000,  remainingQty: 5000,  unitCost: 0.22, qcStatus: "passed" },
    { id: "LOT-3",  materialId: "oil-lotus",      receivedDate: "2026-06-05", expiryDate: "2027-04-01", initialQty: 300,   remainingQty: 300,   unitCost: 1.8,  qcStatus: "passed" },
    { id: "LOT-4",  materialId: "oil-lotus",      receivedDate: "2026-07-10", expiryDate: "2026-08-05", initialQty: 180,   remainingQty: 180,   unitCost: 1.8,  qcStatus: "passed" },
    { id: "LOT-5",  materialId: "oil-greenrice",  receivedDate: "2026-06-10", expiryDate: "2027-03-01", initialQty: 350,   remainingQty: 350,   unitCost: 1.6,  qcStatus: "passed" },
    { id: "LOT-6",  materialId: "oil-jasmine",    receivedDate: "2026-06-20", expiryDate: "2026-07-30", initialQty: 200,   remainingQty: 200,   unitCost: 2.1,  qcStatus: "passed" },
    { id: "LOT-7",  materialId: "oil-rose",       receivedDate: "2026-05-15", expiryDate: "2026-07-10", initialQty: 190,   remainingQty: 190,   unitCost: 2.0,  qcStatus: "passed" },
    { id: "LOT-8",  materialId: "oil-orange",     receivedDate: "2026-06-15", expiryDate: "2027-02-15", initialQty: 300,   remainingQty: 300,   unitCost: 1.4,  qcStatus: "passed" },
    { id: "LOT-9",  materialId: "oil-pear",       receivedDate: "2026-06-15", expiryDate: "2027-02-15", initialQty: 260,   remainingQty: 260,   unitCost: 1.7,  qcStatus: "passed" },
    { id: "LOT-10", materialId: "oil-aloe",       receivedDate: "2026-06-15", expiryDate: "2027-01-20", initialQty: 240,   remainingQty: 240,   unitCost: 1.6,  qcStatus: "passed" },
    { id: "LOT-11", materialId: "oil-oud",        receivedDate: "2026-05-20", expiryDate: "2027-05-20", initialQty: 120,   remainingQty: 120,   unitCost: 3.2,  qcStatus: "passed" },
    { id: "LOT-12", materialId: "oil-wood",       receivedDate: "2026-06-01", expiryDate: "2027-03-01", initialQty: 180,   remainingQty: 180,   unitCost: 2.4,  qcStatus: "passed" },
    { id: "LOT-13", materialId: "oil-licorice",   receivedDate: "2026-06-01", expiryDate: "2027-03-01", initialQty: 220,   remainingQty: 220,   unitCost: 2.5,  qcStatus: "passed" },
    { id: "LOT-14", materialId: "oil-amaranth",   receivedDate: "2026-06-01", expiryDate: "2027-03-01", initialQty: 200,   remainingQty: 200,   unitCost: 2.2,  qcStatus: "passed" },
    { id: "LOT-15", materialId: "oil-sage",       receivedDate: "2026-06-01", expiryDate: "2027-03-01", initialQty: 240,   remainingQty: 240,   unitCost: 1.5,  qcStatus: "passed" },
    { id: "LOT-16", materialId: "jar-round",      receivedDate: "2026-06-01", expiryDate: null,         initialQty: 60,    remainingQty: 60,    unitCost: 15000, qcStatus: "passed" },
    { id: "LOT-17", materialId: "jar-square",     receivedDate: "2026-06-01", expiryDate: null,         initialQty: 40,    remainingQty: 40,    unitCost: 16000, qcStatus: "passed" },
    { id: "LOT-18", materialId: "jar-cone",       receivedDate: "2026-06-01", expiryDate: null,         initialQty: 35,    remainingQty: 35,    unitCost: 13000, qcStatus: "passed" },
    { id: "LOT-19", materialId: "jar-tall",       receivedDate: "2026-06-01", expiryDate: null,         initialQty: 25,    remainingQty: 25,    unitCost: 17000, qcStatus: "passed" },
    { id: "LOT-20", materialId: "jar-bottle",     receivedDate: "2026-06-01", expiryDate: null,         initialQty: 20,    remainingQty: 20,    unitCost: 21000, qcStatus: "passed" },
    { id: "LOT-21", materialId: "jar-tin",        receivedDate: "2026-06-01", expiryDate: null,         initialQty: 55,    remainingQty: 55,    unitCost: 9000,  qcStatus: "passed" },
    { id: "LOT-22", materialId: "jar-bowl",       receivedDate: "2026-06-01", expiryDate: null,         initialQty: 18,    remainingQty: 18,    unitCost: 24000, qcStatus: "passed" },
    { id: "LOT-23", materialId: "jar-heart",      receivedDate: "2026-06-01", expiryDate: null,         initialQty: 22,    remainingQty: 22,    unitCost: 19000, qcStatus: "passed" },
    { id: "LOT-24", materialId: "jar-hexagon",    receivedDate: "2026-06-01", expiryDate: null,         initialQty: 28,    remainingQty: 28,    unitCost: 18000, qcStatus: "passed" },
    { id: "LOT-25", materialId: "jar-mason",      receivedDate: "2026-06-01", expiryDate: null,         initialQty: 24,    remainingQty: 24,    unitCost: 20000, qcStatus: "passed" },
    { id: "LOT-26", materialId: "wick-xs",        receivedDate: "2026-06-01", expiryDate: null,         initialQty: 80,    remainingQty: 80,    unitCost: 1800,  qcStatus: "passed" },
    { id: "LOT-27", materialId: "wick-sm",        receivedDate: "2026-06-01", expiryDate: null,         initialQty: 120,   remainingQty: 120,   unitCost: 2000,  qcStatus: "passed" },
    { id: "LOT-28", materialId: "wick-md",        receivedDate: "2026-06-01", expiryDate: null,         initialQty: 150,   remainingQty: 150,   unitCost: 2500,  qcStatus: "passed" },
    { id: "LOT-29", materialId: "wick-lg",        receivedDate: "2026-06-01", expiryDate: null,         initialQty: 60,    remainingQty: 60,    unitCost: 3000,  qcStatus: "passed" },
    { id: "LOT-30", materialId: "wick-xl",        receivedDate: "2026-06-01", expiryDate: null,         initialQty: 35,    remainingQty: 35,    unitCost: 3600,  qcStatus: "passed" },
  ],
  // ═══ Đơn mua hàng (F03/F09) — tách "đặt hàng" khỏi "nhận hàng thực tế".
  // draft → sent → in_transit → received (hoặc cancelled). Chỉ khi "received" mới sinh lô + giao dịch.
  purchaseOrders: [
    { id: "PUR-1", materialId: "oil-jasmine", supplierId: "SUP-2", qty: 1000, unitCost: 2.1, status: "in_transit", createdDate: "2026-07-15", expectedDate: "2026-07-21", receivedDate: null },
    { id: "PUR-2", materialId: "jar-bottle",  supplierId: "SUP-4", qty: 20,   unitCost: 21000, status: "draft", createdDate: "2026-07-18", expectedDate: "2026-07-22", receivedDate: null },
  ],
  // ═══ Kiểm kê kho (F16) — chốt số liệu hệ thống khi tạo phiếu, nhập số thực tế, giải trình chênh lệch,
  // hoàn tất mới sinh giao dịch điều chỉnh. Phiếu demo dưới đây đang dở: đã đếm+giải trình 1/3 dòng.
  stocktakes: [
    {
      id: "ST-1",
      createdDate: "2026-07-17",
      status: "counting",
      completedDate: null,
      lines: [
        { materialId: "jar-round", systemQty: 60, actualQty: 58, note: "Vỡ 2 cái khi sắp xếp lại kho" },
        { materialId: "wick-md", systemQty: 150, actualQty: null, note: "" },
        { materialId: "oil-sage", systemQty: 240, actualQty: null, note: "" },
      ],
    },
  ],
  // Vai trò đang thao tác (F17, rescoped cho doanh nghiệp 1 người — xem AdminApp.jsx ROLES) — chỉ để gắn nhãn
  // giao dịch cho báo cáo/lọc sau này, không dùng để chặn quyền vì chỉ có 1 người dùng thật.
  currentRole: "quanly",
  // F15 — bản sao có thể chỉnh sửa của SALVAGE_DEFAULTS (cấp 2 + cấp 3); cấp 1 nằm trên từng product.salvage.
  salvageConfig: { ...SALVAGE_DEFAULTS, byLine: { ...SALVAGE_DEFAULTS.byLine } },
  // F12 — lô thành phẩm theo trạng thái (sẵn sàng bán/chờ QC/lỗi/mẫu). Bắt đầu rỗng vì mọi SKU seed ở qty:0,
  // chỉ có hàng khi qua lệnh sản xuất hoặc khách trả hàng — khớp đúng với qty:0 hiện tại của products.
  productBatches: [],
  nextOrderNum: 4, nextCustNum: 4, nextTxNum: 1, nextPoNum: 1, nextBatchNum: 31, nextPurNum: 3, nextStNum: 2, nextPBatchNum: 1,
};
