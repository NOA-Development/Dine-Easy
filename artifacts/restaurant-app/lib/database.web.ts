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

const CATEGORIES: Category[] = [
  { id: 1, name: "Burgers", icon: "🍔" },
  { id: 2, name: "Pizza", icon: "🍕" },
  { id: 3, name: "Chicken", icon: "🍗" },
  { id: 4, name: "Salads", icon: "🥗" },
  { id: 5, name: "Sushi", icon: "🍣" },
  { id: 6, name: "Shawarma", icon: "🌯" },
];

const MENU_ITEMS: MenuItem[] = [
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

let menuItems = [...MENU_ITEMS];
let orders: Order[] = [];
let orderItems: OrderItem[] = [];
let nextItemId = 15;
let nextOrderId = 1;

export function initDatabase() {}

export const db_ops = {
  getCategories(): Category[] {
    return CATEGORIES;
  },

  getAllMenuItems(): MenuItem[] {
    return menuItems;
  },

  getMenuItemsByCategory(categoryId: number): MenuItem[] {
    return menuItems.filter((i) => i.category_id === categoryId);
  },

  getPopularItems(): MenuItem[] {
    return menuItems.filter((i) => i.is_popular === 1 && i.is_available === 1).slice(0, 6);
  },

  getMenuItemById(id: number): MenuItem | null {
    return menuItems.find((i) => i.id === id) ?? null;
  },

  addMenuItem(item: Omit<MenuItem, "id" | "category_name">): number {
    const cat = CATEGORIES.find((c) => c.id === item.category_id);
    const newItem: MenuItem = { ...item, id: nextItemId++, category_name: cat?.name };
    menuItems.push(newItem);
    return newItem.id;
  },

  updateMenuItem(id: number, item: Omit<MenuItem, "id" | "category_name">) {
    const cat = CATEGORIES.find((c) => c.id === item.category_id);
    menuItems = menuItems.map((i) =>
      i.id === id ? { ...item, id, category_name: cat?.name } : i
    );
  },

  toggleItemAvailability(id: number, isAvailable: boolean) {
    menuItems = menuItems.map((i) =>
      i.id === id ? { ...i, is_available: isAvailable ? 1 : 0 } : i
    );
  },

  deleteMenuItem(id: number) {
    menuItems = menuItems.filter((i) => i.id !== id);
  },

  searchMenuItems(query: string): MenuItem[] {
    const q = query.toLowerCase();
    return menuItems.filter(
      (i) =>
        i.name.toLowerCase().includes(q) ||
        i.description.toLowerCase().includes(q)
    );
  },

  createOrder(
    order: Omit<Order, "id" | "created_at">,
    items: { item_name: string; item_price: number; quantity: number }[]
  ): number {
    const id = nextOrderId++;
    orders.push({
      ...order,
      id,
      created_at: new Date().toISOString(),
    });
    items.forEach((item, idx) => {
      orderItems.push({ id: idx + 1, order_id: id, ...item });
    });
    return id;
  },

  getOrders(): Order[] {
    return [...orders].reverse();
  },

  getOrderItems(orderId: number): OrderItem[] {
    return orderItems.filter((i) => i.order_id === orderId);
  },
};
