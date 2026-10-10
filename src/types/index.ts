export type PaymentMethod = 'cash' | 'upi' | 'card' | 'other';

export type OrderStatus = 'pending' | 'paid' | 'cancelled';

export interface MenuItem {
  id: string;
  name: string;
  category: 'chicken' | 'snacks' | 'drinks' | 'fastfood' | 'custom';
  price: number;
  available: boolean;
  emoji?: string;
  description?: string;
}

export interface OrderItem {
  itemId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  tokenNumber: number;
  color: string; // ColorNote sticky color (e.g. yellow, orange, green, blue, pink, purple)
  date: string; // YYYY-MM-DD
  createdAt: number; // timestamp
  updatedAt: number; // timestamp
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  note?: string; // e.g. "Spicy", "No Mayo", customer name
}

export interface DailySummary {
  date: string;
  totalSales: number;
  totalOrders: number;
  paidOrders: number;
  pendingOrders: number;
  cashSales: number;
  upiSales: number;
  avgOrderValue: number;
}
