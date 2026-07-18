import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory database (for now — migrate to real DB later)
let db = {
  products: [
    { id: "lavender-dream", name: "Lavender Dream", price: 185000, cost: 62000, active: true },
    { id: "peach-sunset", name: "Peach Sunset", price: 175000, cost: 58000, active: true },
    { id: "cozy-woods", name: "Cozy Woods", price: 235000, cost: 88000, active: true },
    { id: "berry-kiss", name: "Berry Kiss", price: 155000, cost: 48000, active: true },
  ],
  materials: [
    { id: "wax-soy", name: "Sáp đậu nành", emoji: "🌱", unit: "g", qty: 12000, min: 3000, price: 0.12 },
    { id: "wax-coconut", name: "Sáp dừa", emoji: "🥥", unit: "g", qty: 8000, min: 2000, price: 0.15 },
    { id: "wax-bee", name: "Sáp ong", emoji: "🐝", unit: "g", qty: 5000, min: 1500, price: 0.22 },
  ],
  customers: [
    { id: "c1", name: "Chị Mai", phone: "0901 234 567", note: "Thích mùi hoa" },
    { id: "c2", name: "Anh Tuấn", phone: "0912 888 123", note: "Mua tặng vợ" },
  ],
  orders: [
    { id: "DH-001", customerId: "c1", items: [["lavender-dream", 2]], status: "done", created: "2026-07-10" },
  ],
};

// ════════ ROUTES ════════

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "🕯️ Candle Studio API running" });
});

// Products
app.get("/products", (req, res) => {
  res.json(db.products);
});

app.post("/products", (req, res) => {
  const product = { id: uuidv4(), ...req.body };
  db.products.push(product);
  res.json(product);
});

app.put("/products/:id", (req, res) => {
  const product = db.products.find((p) => p.id === req.params.id);
  if (!product) return res.status(404).json({ error: "Not found" });
  Object.assign(product, req.body);
  res.json(product);
});

// Materials
app.get("/materials", (req, res) => {
  res.json(db.materials);
});

app.post("/materials/:id/restock", (req, res) => {
  const material = db.materials.find((m) => m.id === req.params.id);
  if (!material) return res.status(404).json({ error: "Not found" });
  material.qty += req.body.qty;
  res.json(material);
});

// Customers
app.get("/customers", (req, res) => {
  res.json(db.customers);
});

app.post("/customers", (req, res) => {
  const customer = { id: `c${Date.now()}`, ...req.body };
  db.customers.push(customer);
  res.json(customer);
});

// Orders
app.get("/orders", (req, res) => {
  res.json(db.orders);
});

app.post("/orders", (req, res) => {
  const order = {
    id: `DH-${String(db.orders.length + 1).padStart(3, "0")}`,
    ...req.body,
    created: new Date().toISOString().slice(0, 10),
  };
  db.orders.push(order);
  res.json(order);
});

app.put("/orders/:id", (req, res) => {
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) return res.status(404).json({ error: "Not found" });
  Object.assign(order, req.body);
  res.json(order);
});

// Dashboard stats
app.get("/stats", (req, res) => {
  const revenue = db.orders
    .filter((o) => o.status === "done")
    .reduce((sum, o) => {
      return sum + o.items.reduce((s, [pid, qty]) => {
        const p = db.products.find((pr) => pr.id === pid);
        return s + (p?.price ?? 0) * qty;
      }, 0);
    }, 0);

  res.json({
    revenue,
    activeOrders: db.orders.filter((o) => o.status !== "done").length,
    lowStock: db.materials.filter((m) => m.qty <= m.min).length,
    customers: db.customers.length,
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`🕯️ Candle Studio API running on http://localhost:${PORT}`);
});
