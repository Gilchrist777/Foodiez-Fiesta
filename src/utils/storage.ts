import { Order, MenuItem, DailySummary } from '../types';
import { DEFAULT_MENU_ITEMS, NOTE_COLORS } from '../data/defaultMenu';

const STORAGE_KEYS = {
  ORDERS: 'foodiez_fiesta_orders_v2',
  MENU: 'foodiez_fiesta_menu_v2',
  ACTIVE_ORDER_ID: 'foodiez_fiesta_active_id',
  KIOSK_NAME: 'foodiez_fiesta_kiosk_name',
  CURRENCY: 'foodiez_fiesta_currency',
};

export function getTodayDateStr(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatDateLabel(dateStr: string): string {
  const today = getTodayDateStr();
  const yesterday = getYesterdayDateStr();
  if (dateStr === today) return 'Today';
  if (dateStr === yesterday) return 'Yesterday';
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', weekday: 'short' });
  } catch {
    return dateStr;
  }
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

// Menu Items Storage
export function getMenuItems(): MenuItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MENU);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(DEFAULT_MENU_ITEMS));
      return DEFAULT_MENU_ITEMS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_MENU_ITEMS;
  }
}

export function saveMenuItems(items: MenuItem[]): void {
  localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
}

// Orders Storage
export function getAllOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!raw) {
      // Put demo orders in YESTERDAY so TODAY starts 100% fresh with 0 orders and Order #1 ready
      const yesterday = getYesterdayDateStr();
      const initialOrders: Order[] = [
        {
          id: 'order-yest-1',
          tokenNumber: 1,
          color: 'Gold',
          date: yesterday,
          createdAt: Date.now() - 26 * 60 * 60 * 1000,
          updatedAt: Date.now() - 26 * 60 * 60 * 1000,
          items: [
            { itemId: 'chk-leg', name: 'Chicken Leg', price: 80, quantity: 2 },
            { itemId: 'blue-mojito', name: 'Blue Mojito', price: 50, quantity: 1 },
            { itemId: 'extra-mayo', name: 'Extra Mayonnaise', price: 10, quantity: 1 },
          ],
          totalAmount: 220,
          status: 'paid',
          paymentMethod: 'upi',
          note: 'Order #1 - Parcel',
        },
        {
          id: 'order-yest-2',
          tokenNumber: 2,
          color: 'Emerald',
          date: yesterday,
          createdAt: Date.now() - 24 * 60 * 60 * 1000,
          updatedAt: Date.now() - 24 * 60 * 60 * 1000,
          items: [
            { itemId: 'chk-lays', name: 'Lays Chicken', price: 120, quantity: 1 },
            { itemId: 'chk-pops-m', name: 'Chicken Pops (M)', price: 80, quantity: 1 },
            { itemId: 'green-mojito', name: 'Green Mojito', price: 50, quantity: 1 },
          ],
          totalAmount: 250,
          status: 'paid',
          paymentMethod: 'cash',
          note: 'Order #2 - Less spicy',
        },
        {
          id: 'order-yest-3',
          tokenNumber: 3,
          color: 'Ruby',
          date: yesterday,
          createdAt: Date.now() - 22 * 60 * 60 * 1000,
          updatedAt: Date.now() - 22 * 60 * 60 * 1000,
          items: [
            { itemId: 'chk-wings', name: 'Chicken Wings', price: 100, quantity: 2 },
            { itemId: 'momos', name: 'Momos (Steamed / Fried)', price: 70, quantity: 1 },
            { itemId: 'extra-mayo', name: 'Extra Mayonnaise', price: 10, quantity: 2 },
          ],
          totalAmount: 290,
          status: 'paid',
          paymentMethod: 'upi',
          note: 'Order #3 - Extra dip cup',
        },
      ];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders));
      return initialOrders;
    }
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveAllOrders(orders: Order[]): void {
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
}

// Next order number for that specific date (Always starts at 1 for fresh day)
export function getNextTokenNumber(dateStr: string = getTodayDateStr()): number {
  const orders = getAllOrders().filter((o) => o.date === dateStr);
  if (orders.length === 0) return 1;
  const maxToken = Math.max(...orders.map((o) => o.tokenNumber || 0));
  return maxToken + 1;
}

export function createNewOrder(dateStr: string = getTodayDateStr()): Order {
  const nextToken = getNextTokenNumber(dateStr);
  const color = NOTE_COLORS[(nextToken - 1) % NOTE_COLORS.length].name;
  const newOrder: Order = {
    id: `ord_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    tokenNumber: nextToken,
    color,
    date: dateStr,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    items: [],
    totalAmount: 0,
    status: 'pending',
    note: '',
  };

  const allOrders = getAllOrders();
  allOrders.unshift(newOrder);
  saveAllOrders(allOrders);
  return newOrder;
}

export function saveOrUpdateOrder(updatedOrder: Order): void {
  const allOrders = getAllOrders();
  const index = allOrders.findIndex((o) => o.id === updatedOrder.id);
  const now = Date.now();
  const orderWithTimestamp = {
    ...updatedOrder,
    updatedAt: now,
  };

  if (index >= 0) {
    allOrders[index] = orderWithTimestamp;
  } else {
    allOrders.unshift(orderWithTimestamp);
  }

  saveAllOrders(allOrders);
}

export function deleteOrder(orderId: string): void {
  const allOrders = getAllOrders().filter((o) => o.id !== orderId);
  saveAllOrders(allOrders);
}

export function getDailySummary(targetDate: string = getTodayDateStr()): DailySummary {
  const orders = getAllOrders().filter((o) => o.date === targetDate && o.status !== 'cancelled');
  
  let totalSales = 0;
  let paidOrders = 0;
  let pendingOrders = 0;
  let cashSales = 0;
  let upiSales = 0;

  for (const order of orders) {
    if (order.status === 'paid') {
      totalSales += order.totalAmount;
      paidOrders += 1;
      if (order.paymentMethod === 'cash') {
        cashSales += order.totalAmount;
      } else if (order.paymentMethod === 'upi') {
        upiSales += order.totalAmount;
      } else {
        upiSales += order.totalAmount;
      }
    } else if (order.status === 'pending') {
      pendingOrders += 1;
    }
  }

  const avgOrderValue = paidOrders > 0 ? Math.round(totalSales / paidOrders) : 0;

  return {
    date: targetDate,
    totalSales,
    totalOrders: orders.length,
    paidOrders,
    pendingOrders,
    cashSales,
    upiSales,
    avgOrderValue,
  };
}

export function getAvailableDates(): string[] {
  const orders = getAllOrders();
  const dates = new Set<string>();
  dates.add(getTodayDateStr());
  dates.add(getYesterdayDateStr());
  for (const order of orders) {
    if (order.date) dates.add(order.date);
  }
  return Array.from(dates).sort((a, b) => b.localeCompare(a));
}

// Analytics: Highly Sold & Less Sold items
export interface ItemSalesStat {
  name: string;
  quantity: number;
  revenue: number;
  category?: string;
}

export function getItemSalesAnalytics(orders: Order[]): {
  topSelling: ItemSalesStat[];
  leastSelling: ItemSalesStat[];
  totalQuantity: number;
} {
  const itemMap = new Map<string, { quantity: number; revenue: number }>();

  // Count items from paid orders
  for (const o of orders) {
    if (o.status === 'paid') {
      for (const item of o.items) {
        const current = itemMap.get(item.name) || { quantity: 0, revenue: 0 };
        itemMap.set(item.name, {
          quantity: current.quantity + item.quantity,
          revenue: current.revenue + item.price * item.quantity,
        });
      }
    }
  }

  const list: ItemSalesStat[] = Array.from(itemMap.entries()).map(([name, data]) => ({
    name,
    quantity: data.quantity,
    revenue: data.revenue,
  }));

  list.sort((a, b) => b.quantity - a.quantity);

  const totalQuantity = list.reduce((acc, i) => acc + i.quantity, 0);

  const topSelling = list.slice(0, 5);
  const leastSelling = list.length > 5 ? [...list].reverse().slice(0, 5) : [];

  return {
    topSelling,
    leastSelling,
    totalQuantity,
  };
}

// Monthly & 7-Day sales chart data
export interface DaySalesStat {
  date: string;
  label: string;
  sales: number;
  orderCount: number;
}

export function getLast7DaysSales(orders: Order[]): DaySalesStat[] {
  const result: DaySalesStat[] = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const dayOrders = orders.filter((o) => o.date === dateStr && o.status === 'paid');
    const sales = dayOrders.reduce((acc, o) => acc + o.totalAmount, 0);

    const dayName = i === 0 ? 'Today' : i === 1 ? 'Yest' : d.toLocaleDateString('en-IN', { weekday: 'narrow' });

    result.push({
      date: dateStr,
      label: dayName,
      sales,
      orderCount: dayOrders.length,
    });
  }

  return result;
}

// Export data to CSV
export function exportOrdersToCSV(dateStr: string): string {
  const orders = getAllOrders().filter((o) => o.date === dateStr);
  const headers = ['Order #', 'Time', 'Items Breakdown', 'Total Amount', 'Status', 'Payment Method', 'Notes'];
  
  const rows = orders.map((o) => [
    `#${o.tokenNumber}`,
    formatTime(o.createdAt),
    `"${o.items.map((i) => `${i.name} x${i.quantity} (₹${i.price * i.quantity})`).join(', ')}"`,
    o.totalAmount,
    o.status.toUpperCase(),
    o.paymentMethod ? o.paymentMethod.toUpperCase() : 'N/A',
    `"${(o.note || '').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}
