import { Platform } from "react-native";

export interface Category {
  id: number;
  name: string;
  icon: string;
}

export interface MenuItem {
  id: number;
  category_id: number;
  category_name?: string;
  name: string;
  description: string;
  price: number;
  image_key: string;
  rating: number;
  prep_time: string;
  is_popular: number;
  is_available: number;
}

export interface Order {
  id: number;
  status: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  notes: string;
  created_at: string;
}

export interface OrderItem {
  id: number;
  order_id: number;
  item_name: string;
  item_price: number;
  quantity: number;
}

// ─── Web in-memory store ───────────────────────────────────────────────────────

const WEB_CATEGORIES: Category[] = [
  { id: 1, name: "Burgers", icon: "🍔" },
  { id: 2, name: "Pizza", icon: "🍕" },
  { id: 3, name: "Chicken", icon: "🍗" },
  { id: 4, name: "Salads", icon: "🥗" },
  { id: 5, name: "Sushi", icon: "🍣" },
  { id: 6, name: "Shawarma", icon: "🌯" },
];

let WEB_MENU_ITEMS: MenuItem[] = [
  { id: 1, category_id: 1, category_name: "Burgers", name: "Jumbo Burger", description: "A juicy beef burger with fresh lettuce, tomato, melted cheddar cheese, and our signature sauce.", price: 12.99, image_key: "burger", rating: 4.8, prep_time: "25-35 min", is_popular: 1, is_available: 1 },
  { id: 2, category_id: 1, category_name: "Burgers", name: "Triple Burger", description: "Three stacked beef patties with bacon, caramelized onions, and smoky BBQ sauce.", price: 16.99, image_key: "burger", rating: 4.7, prep_time: "30-40 min", is_popular: 1, is_available: 1 },
  { id: 3, category_id: 1, category_name: "Burgers", name: "Veggie Burger", description: "Plant-based patty with avocado, sprouts, and zesty lime mayo on a whole grain bun.", price: 10.99, image_key: "burger", rating: 4.5, prep_time: "20-30 min", is_popular: 0, is_available: 1 },
  { id: 4, category_id: 2, category_name: "Pizza", name: "Margherita Pizza", description: "Classic tomato sauce, fresh mozzarella, and basil leaves on a thin crispy crust.", price: 13.99, image_key: "pizza", rating: 4.9, prep_time: "20-30 min", is_popular: 1, is_available: 1 },
  { id: 5, category_id: 2, category_name: "Pizza", name: "Pepperoni Pizza", description: "Loaded with premium pepperoni slices, mozzarella, and tomato sauce.", price: 15.99, image_key: "pizza", rating: 4.8, prep_time: "25-35 min", is_popular: 1, is_available: 1 },
  { id: 6, category_id: 2, category_name: "Pizza", name: "BBQ Chicken Pizza", description: "Smoky BBQ sauce base, grilled chicken, red onions, and mozzarella cheese.", price: 16.49, image_key: "pizza", rating: 4.6, prep_time: "25-35 min", is_popular: 0, is_available: 1 },
  { id: 7, category_id: 3, category_name: "Chicken", name: "Crispy Chicken Wings", description: "Golden fried wings tossed in your choice of buffalo, honey garlic, or BBQ sauce.", price: 11.99, image_key: "chicken", rating: 4.7, prep_time: "20-30 min", is_popular: 1, is_available: 1 },
  { id: 8, category_id: 3, category_name: "Chicken", name: "Grilled Chicken Plate", description: "Herb-marinated grilled chicken breast with rice and garden salad.", price: 13.49, image_key: "chicken", rating: 4.6, prep_time: "25-35 min", is_popular: 0, is_available: 1 },
  { id: 9, category_id: 4, category_name: "Salads", name: "Caesar Salad", description: "Romaine lettuce, parmesan, croutons, and classic Caesar dressing.", price: 8.99, image_key: "salad", rating: 4.5, prep_time: "10-15 min", is_popular: 0, is_available: 1 },
  { id: 10, category_id: 4, category_name: "Salads", name: "Greek Salad", description: "Fresh cucumber, tomatoes, olives, feta cheese, and oregano vinaigrette.", price: 9.49, image_key: "salad", rating: 4.6, prep_time: "10-15 min", is_popular: 0, is_available: 1 },
  { id: 11, category_id: 5, category_name: "Sushi", name: "Salmon Sushi Roll", description: "Fresh salmon, cucumber, and avocado wrapped in seasoned sushi rice and nori.", price: 14.99, image_key: "sushi", rating: 4.9, prep_time: "15-20 min", is_popular: 1, is_available: 1 },
  { id: 12, category_id: 5, category_name: "Sushi", name: "Dragon Roll", description: "Shrimp tempura inside, avocado and tobiko on top with eel sauce.", price: 16.99, image_key: "sushi", rating: 4.8, prep_time: "20-25 min", is_popular: 0, is_available: 1 },
  { id: 13, category_id: 6, category_name: "Shawarma", name: "Chicken Shawarma", description: "Marinated chicken, garlic sauce, pickles, and fresh veggies wrapped in warm pita.", price: 10.99, image_key: "shawarma", rating: 4.7, prep_time: "15-20 min", is_popular: 1, is_available: 1 },
  { id: 14, category_id: 6, category_name: "Shawarma", name: "Beef Shawarma", description: "Slow-roasted spiced beef with tahini, tomatoes, and onions in a warm wrap.", price: 12.49, image_key: "shawarma", rating: 4.8, prep_time: "15-20 min", is_popular: 1, is_available: 1 },
];

let WEB_ORDERS: Order[] = [];
let WEB_ORDER_ITEMS: OrderItem[] = [];
let webNextItemId = 15;
let webNextOrderId = 1;

// ─── Native SQLite ─────────────────────────────────────────────────────────────

let _db: any = null;

function getDb() {
  if (!_db) {
    const SQLite = require("expo-sqlite");
    _db = SQLite.openDatabaseSync("restaurant.db");
  }
  return _db;
}

export function initDatabase() {
  if (Platform.OS === "web") return;

  const database = getDb();
  database.execSync("PRAGMA journal_mode = WAL;");

  database.execSync(`CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, icon TEXT NOT NULL);`);
  database.execSync(`CREATE TABLE IF NOT EXISTS menu_items (id INTEGER PRIMARY KEY AUTOINCREMENT, category_id INTEGER NOT NULL, name TEXT NOT NULL, description TEXT DEFAULT '', price REAL NOT NULL, image_key TEXT NOT NULL DEFAULT 'burger', rating REAL DEFAULT 4.5, prep_time TEXT DEFAULT '20-30 min', is_popular INTEGER DEFAULT 0, is_available INTEGER DEFAULT 1);`);
  database.execSync(`CREATE TABLE IF NOT EXISTS orders (id INTEGER PRIMARY KEY AUTOINCREMENT, status TEXT DEFAULT 'confirmed', subtotal REAL NOT NULL, delivery_fee REAL NOT NULL, total REAL NOT NULL, customer_name TEXT DEFAULT '', customer_phone TEXT DEFAULT '', delivery_address TEXT DEFAULT '', notes TEXT DEFAULT '', created_at TEXT DEFAULT (datetime('now')));`);
  database.execSync(`CREATE TABLE IF NOT EXISTS order_items (id INTEGER PRIMARY KEY AUTOINCREMENT, order_id INTEGER NOT NULL, item_name TEXT NOT NULL, item_price REAL NOT NULL, quantity INTEGER NOT NULL);`);

  const row = database.getFirstSync("SELECT COUNT(*) as count FROM categories");
  if (!row || row.count === 0) {
    seedNative(database);
  }
}

function seedNative(database: any) {
  const cats = [["Burgers","🍔"],["Pizza","🍕"],["Chicken","🍗"],["Salads","🥗"],["Sushi","🍣"],["Shawarma","🌯"]];
  for (const [name, icon] of cats) database.runSync("INSERT INTO categories (name, icon) VALUES (?, ?)", [name, icon]);

  for (const item of WEB_MENU_ITEMS) {
    database.runSync(
      `INSERT INTO menu_items (category_id, name, description, price, image_key, rating, prep_time, is_popular, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [item.category_id, item.name, item.description, item.price, item.image_key, item.rating, item.prep_time, item.is_popular]
    );
  }
}

// ─── Unified ops ──────────────────────────────────────────────────────────────

export const db_ops = {
  getCategories(): Category[] {
    if (Platform.OS === "web") return WEB_CATEGORIES;
    return getDb().getAllSync("SELECT * FROM categories") as Category[];
  },

  getAllMenuItems(): MenuItem[] {
    if (Platform.OS === "web") return WEB_MENU_ITEMS;
    return getDb().getAllSync("SELECT m.*, c.name as category_name FROM menu_items m LEFT JOIN categories c ON m.category_id = c.id") as MenuItem[];
  },

  getMenuItemsByCategory(categoryId: number): MenuItem[] {
    if (Platform.OS === "web") return WEB_MENU_ITEMS.filter(i => i.category_id === categoryId);
    return getDb().getAllSync("SELECT m.*, c.name as category_name FROM menu_items m LEFT JOIN categories c ON m.category_id = c.id WHERE m.category_id = ?", [categoryId]) as MenuItem[];
  },

  getPopularItems(): MenuItem[] {
    if (Platform.OS === "web") return WEB_MENU_ITEMS.filter(i => i.is_popular === 1 && i.is_available === 1).slice(0, 6);
    return getDb().getAllSync("SELECT m.*, c.name as category_name FROM menu_items m LEFT JOIN categories c ON m.category_id = c.id WHERE m.is_popular = 1 AND m.is_available = 1 LIMIT 6") as MenuItem[];
  },

  getMenuItemById(id: number): MenuItem | null {
    if (Platform.OS === "web") return WEB_MENU_ITEMS.find(i => i.id === id) ?? null;
    return (getDb().getFirstSync("SELECT m.*, c.name as category_name FROM menu_items m LEFT JOIN categories c ON m.category_id = c.id WHERE m.id = ?", [id]) ?? null) as MenuItem | null;
  },

  addMenuItem(item: Omit<MenuItem, "id" | "category_name">): number {
    if (Platform.OS === "web") {
      const cat = WEB_CATEGORIES.find(c => c.id === item.category_id);
      const newItem: MenuItem = { ...item, id: webNextItemId++, category_name: cat?.name };
      WEB_MENU_ITEMS.push(newItem);
      return newItem.id;
    }
    const result = getDb().runSync(
      `INSERT INTO menu_items (category_id, name, description, price, image_key, rating, prep_time, is_popular, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [item.category_id, item.name, item.description, item.price, item.image_key, item.rating, item.prep_time, item.is_popular, item.is_available]
    );
    return result.lastInsertRowId;
  },

  updateMenuItem(id: number, item: Omit<MenuItem, "id" | "category_name">) {
    if (Platform.OS === "web") {
      const cat = WEB_CATEGORIES.find(c => c.id === item.category_id);
      WEB_MENU_ITEMS = WEB_MENU_ITEMS.map(i => i.id === id ? { ...item, id, category_name: cat?.name } : i);
      return;
    }
    getDb().runSync(`UPDATE menu_items SET category_id=?, name=?, description=?, price=?, image_key=?, prep_time=?, is_popular=?, is_available=? WHERE id=?`,
      [item.category_id, item.name, item.description, item.price, item.image_key, item.prep_time, item.is_popular, item.is_available, id]);
  },

  toggleItemAvailability(id: number, isAvailable: boolean) {
    if (Platform.OS === "web") {
      WEB_MENU_ITEMS = WEB_MENU_ITEMS.map(i => i.id === id ? { ...i, is_available: isAvailable ? 1 : 0 } : i);
      return;
    }
    getDb().runSync("UPDATE menu_items SET is_available = ? WHERE id = ?", [isAvailable ? 1 : 0, id]);
  },

  deleteMenuItem(id: number) {
    if (Platform.OS === "web") {
      WEB_MENU_ITEMS = WEB_MENU_ITEMS.filter(i => i.id !== id);
      return;
    }
    getDb().runSync("DELETE FROM menu_items WHERE id = ?", [id]);
  },

  searchMenuItems(query: string): MenuItem[] {
    const q = query.toLowerCase();
    if (Platform.OS === "web") return WEB_MENU_ITEMS.filter(i => i.name.toLowerCase().includes(q) || i.description.toLowerCase().includes(q));
    return getDb().getAllSync("SELECT m.*, c.name as category_name FROM menu_items m LEFT JOIN categories c ON m.category_id = c.id WHERE m.name LIKE ? OR m.description LIKE ?", [`%${query}%`, `%${query}%`]) as MenuItem[];
  },

  createOrder(order: Omit<Order, "id" | "created_at">, items: { item_name: string; item_price: number; quantity: number }[]): number {
    if (Platform.OS === "web") {
      const id = webNextOrderId++;
      WEB_ORDERS.push({ ...order, id, created_at: new Date().toISOString() });
      items.forEach((item, idx) => WEB_ORDER_ITEMS.push({ id: idx + 1, order_id: id, ...item }));
      return id;
    }
    const result = getDb().runSync(
      `INSERT INTO orders (status, subtotal, delivery_fee, total, customer_name, customer_phone, delivery_address, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [order.status, order.subtotal, order.delivery_fee, order.total, order.customer_name, order.customer_phone, order.delivery_address, order.notes]
    );
    const orderId = result.lastInsertRowId;
    for (const item of items) {
      getDb().runSync("INSERT INTO order_items (order_id, item_name, item_price, quantity) VALUES (?, ?, ?, ?)", [orderId, item.item_name, item.item_price, item.quantity]);
    }
    return orderId;
  },

  getOrders(): Order[] {
    if (Platform.OS === "web") return [...WEB_ORDERS].reverse();
    return getDb().getAllSync("SELECT * FROM orders ORDER BY created_at DESC") as Order[];
  },

  getOrderItems(orderId: number): OrderItem[] {
    if (Platform.OS === "web") return WEB_ORDER_ITEMS.filter(i => i.order_id === orderId);
    return getDb().getAllSync("SELECT * FROM order_items WHERE order_id = ?", [orderId]) as OrderItem[];
  },
};
