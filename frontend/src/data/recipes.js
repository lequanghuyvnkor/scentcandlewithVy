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
  paraffin: { name: "Paraffin",      emoji: "🕯️", density: 0.90, burnRate: 8.5, meltPoint: 58, loadMax: 10, hotF: 0.95, coldF: 0.80, base: [253, 250, 240], desc: "Hot throw mạnh nhất" },
  beeswax:  { name: "Sáp ong",       emoji: "🐝", density: 0.96, burnRate: 5.5, meltPoint: 63, loadMax: 8,  hotF: 0.78, coldF: 0.95, base: [237, 205, 130], desc: "Tự nhiên, cháy lâu" },
  coconut:  { name: "Sáp dừa",       emoji: "🥥", density: 0.85, burnRate: 7.5, meltPoint: 45, loadMax: 14, hotF: 0.92, coldF: 0.88, base: [253, 249, 238], desc: "Mềm mịn, ôm mùi" },
};

// ═══════════════════ DẦU THƠM ═══════════════════
export const FRAGS = [
  { id: "lavender",   name: "Lavender",   emoji: "💜", family: "Hoa cỏ",    fp: 83, top: 8, mid: 7, base: 4,  dye: [196, 181, 253] },
  { id: "vanilla",    name: "Vanilla",    emoji: "🍦", family: "Ngọt ngào", fp: 90, top: 3, mid: 6, base: 9,  dye: [242, 214, 160] },
  { id: "rose",       name: "Hoa hồng",  emoji: "🌹", family: "Hoa cỏ",    fp: 82, top: 7, mid: 9, base: 5,  dye: [238, 168, 180] },
  { id: "citrus",     name: "Cam chanh", emoji: "🍊", family: "Tươi mát",  fp: 70, top: 9, mid: 5, base: 3,  dye: [248, 190, 110] },
  { id: "sandalwood", name: "Đàn hương", emoji: "🪵", family: "Gỗ ấm",     fp: 75, top: 4, mid: 7, base: 9,  dye: [196, 156, 108] },
  { id: "jasmine",    name: "Hoa nhài",  emoji: "🌼", family: "Hoa cỏ",    fp: 85, top: 6, mid: 9, base: 6,  dye: [244, 228, 172] },
  { id: "mint",       name: "Bạc hà",    emoji: "🌿", family: "Tươi mát",  fp: 79, top: 9, mid: 7, base: 4,  dye: [178, 212, 172] },
  { id: "oud",        name: "Trầm hương",emoji: "🤎", family: "Gỗ ấm",     fp: 88, top: 3, mid: 5, base: 10, dye: [160, 118, 78] },
  { id: "peach",      name: "Đào ngọt",  emoji: "🍑", family: "Trái cây",  fp: 78, top: 8, mid: 8, base: 4,  dye: [246, 186, 154] },
  { id: "berry",      name: "Dâu berry", emoji: "🍓", family: "Trái cây",  fp: 76, top: 8, mid: 7, base: 5,  dye: [222, 128, 138] },
];

// ═══════════════════ PHẨM MÀU ═══════════════════
export const DYES = [
  { id: "none",   name: "Không màu", hex: null },
  { id: "pink",   name: "Hồng đất",  hex: "#D79E8C" },
  { id: "peach",  name: "Cam đào",   hex: "#E3A96E" },
  { id: "butter", name: "Vàng bơ",   hex: "#E8CA7C" },
  { id: "matcha", name: "Xanh trà",  hex: "#A4B885" },
  { id: "sky",    name: "Xanh khói", hex: "#9DB4BE" },
  { id: "lilac",  name: "Tím khói",  hex: "#B6A0BE" },
  { id: "cocoa",  name: "Nâu cacao", hex: "#8A6949" },
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

// ═══════════════════ CÔNG THỨC (8 SKU, chia 4 dòng) ═══════════════════
export const RECIPES = {
  "lavender-dream": { name: "Lavender Dream", emoji: "💜", line: "floral", wax: "soy",     frags: [["Lavender", 19], ["Vanilla", 11]],    jarType: "round",   wick: "md" },
  "rose-garden":    { name: "Rose Garden",    emoji: "🌹", line: "floral", wax: "soy",     frags: [["Hoa hồng", 16], ["Hoa nhài", 10]],   jarType: "heart",   wick: "sm" },
  "peach-sunset":   { name: "Peach Sunset",   emoji: "🍑", line: "fruity", wax: "coconut", frags: [["Đào ngọt", 21], ["Cam chanh", 10]],  jarType: "cone",    wick: "sm" },
  "berry-kiss":     { name: "Berry Kiss",     emoji: "🍓", line: "fruity", wax: "soy",     frags: [["Dâu berry", 10], ["Hoa hồng", 5]],   jarType: "tin",     wick: "xs" },
  "cozy-woods":     { name: "Cozy Woods",     emoji: "🪵", line: "woody",  wax: "beeswax", frags: [["Đàn hương", 17], ["Trầm hương", 13]],jarType: "mason",   wick: "lg" },
  "amber-nights":   { name: "Amber Nights",   emoji: "🤎", line: "woody",  wax: "beeswax", frags: [["Trầm hương", 15], ["Vanilla", 10]],  jarType: "bottle",  wick: "md" },
  "mint-breeze":    { name: "Mint Breeze",    emoji: "🌿", line: "fresh",  wax: "coconut", frags: [["Bạc hà", 18], ["Cam chanh", 9]],     jarType: "hexagon", wick: "md" },
  "garden-jasmine": { name: "Garden Jasmine", emoji: "🌼", line: "fresh",  wax: "soy",     frags: [["Hoa nhài", 20], ["Bạc hà", 8]],      jarType: "square",  wick: "md" },
};

// ═══════════════════ BOM — Bill of Materials mỗi công thức ═══════════════════
export const BOM = {
  "lavender-dream": [["wax-soy", 380], ["oil-lavender", 19], ["oil-vanilla", 11], ["jar-round", 1],   ["wick-md", 1], ["dye-lilac", 2]],
  "rose-garden":    [["wax-soy", 300], ["oil-rose", 16],     ["oil-jasmine", 10], ["jar-heart", 1],   ["wick-sm", 1], ["dye-pink", 2]],
  "peach-sunset":   [["wax-coconut", 320], ["oil-peach", 21],["oil-citrus", 10],  ["jar-cone", 1],    ["wick-sm", 1], ["dye-peach", 2]],
  "berry-kiss":     [["wax-soy", 150], ["oil-berry", 10],    ["oil-rose", 5],     ["jar-tin", 1],     ["wick-xs", 1], ["dye-pink", 1]],
  "cozy-woods":     [["wax-bee", 420], ["oil-sandal", 17],   ["oil-oud", 13],     ["jar-mason", 1],   ["wick-lg", 1], ["dye-cocoa", 2]],
  "amber-nights":   [["wax-bee", 250], ["oil-oud", 15],      ["oil-vanilla", 10], ["jar-bottle", 1],  ["wick-md", 1], ["dye-cocoa", 2]],
  "mint-breeze":    [["wax-coconut", 380], ["oil-mint", 18], ["oil-citrus", 9],   ["jar-hexagon", 1], ["wick-md", 1], ["dye-matcha", 2]],
  "garden-jasmine": [["wax-soy", 350], ["oil-jasmine", 20],  ["oil-mint", 8],     ["jar-square", 1],  ["wick-md", 1], ["dye-butter", 2]],
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
    { id: "lavender-dream", price: 185000, cost: 62000, active: true },
    { id: "rose-garden",    price: 210000, cost: 74000, active: true },
    { id: "peach-sunset",   price: 175000, cost: 58000, active: true },
    { id: "berry-kiss",     price: 125000, cost: 38000, active: true },
    { id: "cozy-woods",     price: 235000, cost: 88000, active: true },
    { id: "amber-nights",   price: 245000, cost: 92000, active: true },
    { id: "mint-breeze",    price: 165000, cost: 54000, active: true },
    { id: "garden-jasmine", price: 170000, cost: 56000, active: true },
  ],
  materials: [
    { id: "wax-soy",      name: "Sáp đậu nành",  emoji: "🌱", unit: "g",   qty: 12000, min: 3000, price: 0.12 },
    { id: "wax-coconut",  name: "Sáp dừa",        emoji: "🥥", unit: "g",   qty: 8000,  min: 2000, price: 0.15 },
    { id: "wax-bee",      name: "Sáp ong",        emoji: "🐝", unit: "g",   qty: 5000,  min: 1500, price: 0.22 },
    { id: "oil-lavender", name: "Dầu Lavender",   emoji: "💜", unit: "ml",  qty: 480,   min: 100,  price: 1.8 },
    { id: "oil-vanilla",  name: "Dầu Vanilla",    emoji: "🍦", unit: "ml",  qty: 350,   min: 100,  price: 1.6 },
    { id: "oil-rose",     name: "Dầu Hoa hồng",   emoji: "🌹", unit: "ml",  qty: 190,   min: 60,   price: 2.0 },
    { id: "oil-jasmine",  name: "Dầu Hoa nhài",   emoji: "🌼", unit: "ml",  qty: 200,   min: 60,   price: 2.1 },
    { id: "oil-peach",    name: "Dầu Đào",        emoji: "🍑", unit: "ml",  qty: 260,   min: 80,   price: 1.7 },
    { id: "oil-citrus",   name: "Dầu Cam chanh",  emoji: "🍊", unit: "ml",  qty: 300,   min: 80,   price: 1.4 },
    { id: "oil-sandal",   name: "Dầu Đàn hương",  emoji: "🪵", unit: "ml",  qty: 180,   min: 60,   price: 2.4 },
    { id: "oil-oud",      name: "Dầu Trầm",       emoji: "🤎", unit: "ml",  qty: 120,   min: 50,   price: 3.2 },
    { id: "oil-berry",    name: "Dầu Dâu berry",  emoji: "🍓", unit: "ml",  qty: 220,   min: 70,   price: 1.5 },
    { id: "oil-mint",     name: "Dầu Bạc hà",     emoji: "🌿", unit: "ml",  qty: 240,   min: 70,   price: 1.5 },
    { id: "jar-round",    name: "Lọ tròn cổ điển",emoji: "🫙", unit: "cái", qty: 60,    min: 20,   price: 15000 },
    { id: "jar-square",   name: "Hộp vuông kem",  emoji: "🧊", unit: "cái", qty: 40,    min: 15,   price: 16000 },
    { id: "jar-cone",     name: "Ly nến hình nón",emoji: "🍧", unit: "cái", qty: 35,    min: 15,   price: 13000 },
    { id: "jar-tall",     name: "Trụ cao thanh lịch", emoji: "📏", unit: "cái", qty: 25, min: 10,   price: 17000 },
    { id: "jar-bottle",   name: "Chai thủy tinh cổ dài", emoji: "🍾", unit: "cái", qty: 20, min: 8, price: 21000 },
    { id: "jar-tin",      name: "Hũ thiếc mini",  emoji: "🥫", unit: "cái", qty: 55,    min: 20,   price: 9000 },
    { id: "jar-bowl",     name: "Bát gốm rộng",   emoji: "🥣", unit: "cái", qty: 18,    min: 8,    price: 24000 },
    { id: "jar-heart",    name: "Lọ trái tim",    emoji: "💗", unit: "cái", qty: 22,    min: 8,    price: 19000 },
    { id: "jar-hexagon",  name: "Lọ lục giác",    emoji: "⬡",  unit: "cái", qty: 28,    min: 10,   price: 18000 },
    { id: "jar-mason",    name: "Hũ mason cổ điển", emoji: "🏺", unit: "cái", qty: 24,  min: 10,   price: 20000 },
    { id: "wick-xs",      name: "Bấc nhỏ xíu",    emoji: "🧵", unit: "cái", qty: 80,    min: 20,   price: 1800 },
    { id: "wick-sm",      name: "Bấc nhỏ",        emoji: "🧵", unit: "cái", qty: 120,   min: 30,   price: 2000 },
    { id: "wick-md",      name: "Bấc vừa",        emoji: "🧵", unit: "cái", qty: 150,   min: 40,   price: 2500 },
    { id: "wick-lg",      name: "Bấc lớn",        emoji: "🧵", unit: "cái", qty: 60,    min: 20,   price: 3000 },
    { id: "wick-xl",      name: "Bấc siêu lớn",   emoji: "🧵", unit: "cái", qty: 35,    min: 15,   price: 3600 },
    { id: "dye-lilac",    name: "Phẩm tím khói",  emoji: "🎨", unit: "g",   qty: 80,    min: 20,   price: 800 },
    { id: "dye-peach",    name: "Phẩm cam đào",   emoji: "🎨", unit: "g",   qty: 65,    min: 20,   price: 800 },
    { id: "dye-cocoa",    name: "Phẩm nâu cacao", emoji: "🎨", unit: "g",   qty: 50,    min: 15,   price: 800 },
    { id: "dye-pink",     name: "Phẩm hồng đất",  emoji: "🎨", unit: "g",   qty: 90,    min: 20,   price: 800 },
    { id: "dye-matcha",   name: "Phẩm xanh trà",  emoji: "🎨", unit: "g",   qty: 45,    min: 15,   price: 800 },
    { id: "dye-butter",   name: "Phẩm vàng bơ",   emoji: "🎨", unit: "g",   qty: 55,    min: 15,   price: 800 },
    { id: "dye-sky",      name: "Phẩm xanh khói", emoji: "🎨", unit: "g",   qty: 40,    min: 15,   price: 800 },
  ],
  customers: [
    { id: "c1", name: "Chị Mai",  phone: "0901234567", note: "Thích mùi hoa, không thích gỗ", fav: "lavender-dream" },
    { id: "c2", name: "Anh Tuấn", phone: "0912888123", note: "Mua tặng vợ, sinh nhật 12/8",   fav: "berry-kiss" },
    { id: "c3", name: "Shop Cỏ May", phone: "0977555999", note: "Đại lý — chiết khấu 15%",    fav: "cozy-woods" },
  ],
  orders: [
    { id: "DH-001", customerId: "c1", items: [{ type: "catalog", productId: "lavender-dream", qty: 2 }], status: "done", created: "2026-07-10", deducted: true },
    { id: "DH-002", customerId: "c3", items: [{ type: "catalog", productId: "cozy-woods", qty: 10 }, { type: "catalog", productId: "peach-sunset", qty: 5 }], status: "producing", created: "2026-07-14", deducted: true },
    { id: "DH-003", customerId: "c2", items: [{ type: "catalog", productId: "berry-kiss", qty: 1 }], status: "confirmed", created: "2026-07-16", deducted: false },
  ],
  nextOrderNum: 4, nextCustNum: 4,
};
