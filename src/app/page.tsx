"use client";

import { useState, useMemo } from "react";
import {
  ShoppingBag, Plus, Trash2, CheckCircle, Clock, XCircle,
  TrendingUp, Package, Users, DollarSign, ChefHat, Star,
  X, BarChart2, Bell, Edit2, Check, Flame
} from "lucide-react";

type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";
type Category = "rice" | "swallow" | "protein" | "snack" | "drink" | "soup" | "special";

interface MenuItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  available: boolean;
  emoji: string;
  bestseller?: boolean;
}

interface OrderItem {
  menuItemId: string;
  name: string;
  qty: number;
  unitPrice: number;
}

interface Order {
  id: string;
  orderNo: string;
  customerName: string;
  customerPhone: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  note?: string;
  createdAt: string;
  channel: "walkin" | "whatsapp" | "call";
}

function genId() { return Math.random().toString(36).slice(2, 9); }
function fmtNaira(n: number) { return "₦" + new Intl.NumberFormat("en-NG").format(n); }
function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

const CATEGORY_META: Record<Category, { label: string; color: string; bg: string }> = {
  rice:    { label: "Rice",     color: "#d62828", bg: "#fee2e2" },
  swallow: { label: "Swallow",  color: "#7c3aed", bg: "#ede9fe" },
  protein: { label: "Protein",  color: "#b45309", bg: "#fef3c7" },
  snack:   { label: "Snack",    color: "#0369a1", bg: "#e0f2fe" },
  drink:   { label: "Drink",    color: "#0891b2", bg: "#cffafe" },
  soup:    { label: "Soup",     color: "#c2410c", bg: "#ffedd5" },
  special: { label: "Special",  color: "#2d6a4f", bg: "#dcfce7" },
};

const STATUS_CFG: Record<OrderStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending:   { label: "Pending",   color: "#92400e", bg: "#fef3c7", icon: <Clock size={13}/> },
  preparing: { label: "Preparing", color: "#1d4ed8", bg: "#dbeafe", icon: <Flame size={13}/> },
  ready:     { label: "Ready",     color: "#166534", bg: "#dcfce7", icon: <CheckCircle size={13}/> },
  delivered: { label: "Delivered", color: "#374151", bg: "#f3f4f6", icon: <Check size={13}/> },
  cancelled: { label: "Cancelled", color: "#991b1b", bg: "#fee2e2", icon: <XCircle size={13}/> },
};

const SEED_MENU: MenuItem[] = [
  { id: "m1", name: "Jollof Rice",          category: "rice",    price: 800,  available: true,  emoji: "🍚", bestseller: true },
  { id: "m2", name: "Fried Rice",           category: "rice",    price: 900,  available: true,  emoji: "🍛" },
  { id: "m3", name: "White Rice + Stew",    category: "rice",    price: 700,  available: true,  emoji: "🥘" },
  { id: "m4", name: "Egusi Soup",           category: "soup",    price: 600,  available: true,  emoji: "🍲", bestseller: true },
  { id: "m5", name: "Ogbono Soup",          category: "soup",    price: 600,  available: true,  emoji: "🫕" },
  { id: "m6", name: "Amala",               category: "swallow", price: 200,  available: true,  emoji: "⚫" },
  { id: "m7", name: "Eba",                 category: "swallow", price: 150,  available: true,  emoji: "🟡" },
  { id: "m8", name: "Pounded Yam",         category: "swallow", price: 300,  available: true,  emoji: "⚪", bestseller: true },
  { id: "m9", name: "Chicken (Full)",      category: "protein", price: 1800, available: true,  emoji: "🍗" },
  { id: "m10",name: "Chicken (Half)",      category: "protein", price: 1000, available: true,  emoji: "🍗" },
  { id: "m11",name: "Beef",               category: "protein", price: 500,  available: true,  emoji: "🥩" },
  { id: "m12",name: "Fish (Titus)",       category: "protein", price: 800,  available: true,  emoji: "🐟" },
  { id: "m13",name: "Puff Puff (5pcs)",   category: "snack",   price: 300,  available: true,  emoji: "🟠" },
  { id: "m14",name: "Small Chops Plate",  category: "snack",   price: 2500, available: true,  emoji: "🍢", bestseller: true },
  { id: "m15",name: "Zobo",              category: "drink",   price: 300,  available: true,  emoji: "🍹" },
  { id: "m16",name: "Chapman",           category: "drink",   price: 500,  available: false, emoji: "🧃" },
  { id: "m17",name: "Caterer Special",   category: "special", price: 5000, available: true,  emoji: "👑" },
];

const now = new Date().toISOString();
const minsAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();

const SEED_ORDERS: Order[] = [
  {
    id: "o1", orderNo: "CHE-041", customerName: "Tunde Badmus", customerPhone: "08031111111",
    items: [{ menuItemId: "m1", name: "Jollof Rice", qty: 2, unitPrice: 800 }, { menuItemId: "m9", name: "Chicken (Full)", qty: 1, unitPrice: 1800 }],
    total: 3400, status: "preparing", createdAt: minsAgo(12), channel: "whatsapp",
    note: "No pepper for one plate",
  },
  {
    id: "o2", orderNo: "CHE-042", customerName: "Mama Emeka", customerPhone: "07052222222",
    items: [{ menuItemId: "m4", name: "Egusi Soup", qty: 1, unitPrice: 600 }, { menuItemId: "m8", name: "Pounded Yam", qty: 2, unitPrice: 300 }],
    total: 1200, status: "pending", createdAt: minsAgo(3), channel: "walkin",
  },
  {
    id: "o3", orderNo: "CHE-040", customerName: "Chidinma Obi", customerPhone: "09063333333",
    items: [{ menuItemId: "m14", name: "Small Chops Plate", qty: 3, unitPrice: 2500 }],
    total: 7500, status: "ready", createdAt: minsAgo(28), channel: "call",
    note: "Event delivery — call before dispatch",
  },
  {
    id: "o4", orderNo: "CHE-039", customerName: "Kehinde Alabi", customerPhone: "08104444444",
    items: [{ menuItemId: "m2", name: "Fried Rice", qty: 1, unitPrice: 900 }, { menuItemId: "m10", name: "Chicken (Half)", qty: 1, unitPrice: 1000 }, { menuItemId: "m15", name: "Zobo", qty: 2, unitPrice: 300 }],
    total: 2500, status: "delivered", createdAt: minsAgo(95), channel: "whatsapp",
  },
  {
    id: "o5", orderNo: "CHE-038", customerName: "Fatima Sule", customerPhone: "08155555555",
    items: [{ menuItemId: "m17", name: "Caterer Special", qty: 1, unitPrice: 5000 }],
    total: 5000, status: "delivered", createdAt: minsAgo(180), channel: "call",
  },
];

type Tab = "orders" | "menu" | "analytics";

const ORDER_FLOW: OrderStatus[] = ["pending", "preparing", "ready", "delivered"];

export default function ChopEasy() {
  const [menu, setMenu] = useState<MenuItem[]>(SEED_MENU);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [tab, setTab] = useState<Tab>("orders");
  const [isOpen, setIsOpen] = useState(true);
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showNewItem, setShowNewItem] = useState(false);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  // New order form
  const [orderForm, setOrderForm] = useState({
    customerName: "", customerPhone: "", channel: "walkin" as Order["channel"], note: "",
    cart: [] as { menuItemId: string; name: string; qty: number; unitPrice: number }[],
  });

  // New menu item form
  const [itemForm, setItemForm] = useState({
    name: "", category: "rice" as Category, price: "", emoji: "🍽️",
  });

  // Analytics
  const analytics = useMemo(() => {
    const delivered = orders.filter(o => o.status === "delivered");
    const todayRevenue = delivered.reduce((a, o) => a + o.total, 0);
    const activeOrders = orders.filter(o => !["delivered","cancelled"].includes(o.status)).length;
    const topItems: Record<string, number> = {};
    delivered.forEach(o => o.items.forEach(i => { topItems[i.name] = (topItems[i.name]||0) + i.qty; }));
    const topSorted = Object.entries(topItems).sort((a,b)=>b[1]-a[1]).slice(0,5);
    const byChannel = { walkin: 0, whatsapp: 0, call: 0 };
    orders.forEach(o => byChannel[o.channel]++);
    const avgOrder = delivered.length > 0 ? Math.round(todayRevenue / delivered.length) : 0;
    return { todayRevenue, activeOrders, deliveredCount: delivered.length, topSorted, byChannel, avgOrder };
  }, [orders]);

  const orderNo = `CHE-${String(orders.length + 42 + 1).padStart(3,"0")}`;

  const cartTotal = orderForm.cart.reduce((a, i) => a + i.qty * i.unitPrice, 0);

  const addToCart = (item: MenuItem) => {
    setOrderForm(f => {
      const existing = f.cart.find(c => c.menuItemId === item.id);
      if (existing) {
        return { ...f, cart: f.cart.map(c => c.menuItemId === item.id ? {...c, qty: c.qty+1} : c) };
      }
      return { ...f, cart: [...f.cart, { menuItemId: item.id, name: item.name, qty: 1, unitPrice: item.price }] };
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setOrderForm(f => ({...f, cart: f.cart.filter(c => c.menuItemId !== menuItemId)}));
  };

  const changeQty = (menuItemId: string, delta: number) => {
    setOrderForm(f => ({
      ...f,
      cart: f.cart.map(c => c.menuItemId === menuItemId
        ? {...c, qty: Math.max(1, c.qty + delta)}
        : c
      )
    }));
  };

  const placeOrder = () => {
    if (!orderForm.customerName || orderForm.cart.length === 0) return;
    const newOrder: Order = {
      id: genId(), orderNo, customerName: orderForm.customerName,
      customerPhone: orderForm.customerPhone, items: orderForm.cart,
      total: cartTotal, status: "pending",
      note: orderForm.note || undefined, createdAt: new Date().toISOString(),
      channel: orderForm.channel,
    };
    setOrders(prev => [newOrder, ...prev]);
    setOrderForm({ customerName: "", customerPhone: "", channel: "walkin", note: "", cart: [] });
    setShowNewOrder(false);
  };

  const advanceOrder = (id: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== id) return o;
      const idx = ORDER_FLOW.indexOf(o.status);
      if (idx < ORDER_FLOW.length - 1) return {...o, status: ORDER_FLOW[idx+1]};
      return o;
    }));
  };

  const cancelOrder = (id: string) => {
    setOrders(prev => prev.map(o => o.id === id ? {...o, status: "cancelled"} : o));
  };

  const addMenuItem = () => {
    if (!itemForm.name || !itemForm.price) return;
    const item: MenuItem = {
      id: genId(), name: itemForm.name, category: itemForm.category,
      price: parseFloat(itemForm.price), available: true, emoji: itemForm.emoji,
    };
    setMenu(prev => [item, ...prev]);
    setItemForm({ name: "", category: "rice", price: "", emoji: "🍽️" });
    setShowNewItem(false);
  };

  const toggleAvailable = (id: string) => {
    setMenu(prev => prev.map(m => m.id === id ? {...m, available: !m.available} : m));
  };

  const filteredOrders = filterStatus === "all" ? orders : orders.filter(o => o.status === filterStatus);
  const activeCount = orders.filter(o => !["delivered","cancelled"].includes(o.status)).length;
  const menuByCategory = menu.reduce<Record<Category, MenuItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<Category, MenuItem[]>);

  return (
    <div className="min-h-screen bg-[#fffbf5]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#f0e4d0] px-5 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#d62828] flex items-center justify-center shadow-sm shadow-[#d62828]/20">
              <ChefHat size={20} className="text-white"/>
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl leading-none text-[#1c0f00]">ChopEasy</h1>
              <p className="text-xs text-[#7a5c3a]">Your food business, sorted</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Active orders badge */}
            {activeCount > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#fef3c7] border border-[#fde68a]">
                <Bell size={13} className="text-[#92400e]"/>
                <span className="text-xs font-bold text-[#92400e]">{activeCount} active</span>
              </div>
            )}

            {/* Open/Closed toggle */}
            <button onClick={() => setIsOpen(o => !o)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${isOpen ? "status-open" : "status-closed"}`}>
              <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-green-500" : "bg-red-500"} animate-pulse`}/>
              {isOpen ? "Open" : "Closed"}
            </button>

            <button onClick={() => setShowNewOrder(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#d62828] text-white text-sm font-bold hover:bg-[#b91c1c] transition-all shadow-sm shadow-[#d62828]/20">
              <Plus size={15}/> New Order
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="sticky top-[65px] z-30 bg-white border-b border-[#f0e4d0] px-5">
        <div className="max-w-5xl mx-auto flex gap-1">
          {(["orders","menu","analytics"] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-5 py-3 text-sm font-semibold capitalize transition-all border-b-2 ${
                tab === t ? "border-[#d62828] text-[#d62828]" : "border-transparent text-[#7a5c3a] hover:text-[#1c0f00]"
              }`}>
              {t}
              {t === "orders" && activeCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 rounded-full bg-[#d62828] text-white text-xs">{activeCount}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-5 py-6">

        {/* ── ORDERS TAB ── */}
        {tab === "orders" && (
          <div className="space-y-5">
            {/* Status filter pills */}
            <div className="flex gap-2 flex-wrap">
              {(["all","pending","preparing","ready","delivered","cancelled"] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize transition-all border ${
                    filterStatus === s ? "bg-[#1c0f00] text-white border-[#1c0f00]" : "bg-white text-[#7a5c3a] border-[#f0e4d0] hover:border-[#1c0f00]/20"
                  }`}>
                  {s === "all" ? `All (${orders.length})` : `${s} (${orders.filter(o=>o.status===s).length})`}
                </button>
              ))}
            </div>

            {/* Order cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredOrders.map((order) => {
                const cfg = STATUS_CFG[order.status];
                const isActive = !["delivered","cancelled"].includes(order.status);
                return (
                  <div key={order.id} className={`card p-5 rise transition-all ${isActive ? "border-[#f9a825]/50" : ""}`}>
                    {/* Order header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-[#d62828]">{order.orderNo}</span>
                          <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-semibold border`}
                            style={{ color: cfg.color, background: cfg.bg, borderColor: cfg.color+"30" }}>
                            {cfg.icon}{cfg.label}
                          </span>
                        </div>
                        <p className="font-bold text-[#1c0f00] mt-1">{order.customerName}</p>
                        <div className="flex items-center gap-2 text-xs text-[#7a5c3a] mt-0.5">
                          <span className="capitalize">{order.channel === "walkin" ? "🚶 Walk-in" : order.channel === "whatsapp" ? "💬 WhatsApp" : "📞 Call"}</span>
                          <span>·</span>
                          <span>{timeAgo(order.createdAt)}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-bold text-xl text-[#1c0f00]">{fmtNaira(order.total)}</p>
                        <p className="text-xs text-[#7a5c3a]">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</p>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-1 mb-3 bg-[#fffbf5] rounded-xl p-3">
                      {order.items.map(item => (
                        <div key={item.menuItemId} className="flex justify-between text-sm">
                          <span className="text-[#7a5c3a]">{item.qty}× {item.name}</span>
                          <span className="font-mono text-[#1c0f00]">{fmtNaira(item.qty * item.unitPrice)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Note */}
                    {order.note && (
                      <p className="text-xs bg-[#fef3c7] border border-[#fde68a] rounded-lg px-3 py-2 text-[#92400e] mb-3">
                        📝 {order.note}
                      </p>
                    )}

                    {/* Actions */}
                    {isActive && (
                      <div className="flex gap-2">
                        <button onClick={() => advanceOrder(order.id)}
                          className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                            order.status === "pending" ? "bg-[#1d4ed8] text-white hover:bg-[#1e40af]"
                            : order.status === "preparing" ? "bg-[#166534] text-white hover:bg-[#15803d]"
                            : "bg-[#374151] text-white hover:bg-[#1f2937]"
                          }`}>
                          {order.status === "pending" ? "🔥 Start Preparing"
                           : order.status === "preparing" ? "✅ Mark Ready"
                           : "🛵 Mark Delivered"}
                        </button>
                        <button onClick={() => cancelOrder(order.id)}
                          className="px-3 py-2.5 rounded-xl border border-[#f0e4d0] text-[#7a5c3a] hover:bg-[#fee2e2] hover:text-[#991b1b] hover:border-[#fca5a5] transition-all">
                          <XCircle size={16}/>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredOrders.length === 0 && (
                <div className="md:col-span-2 card p-12 text-center">
                  <ShoppingBag size={36} className="mx-auto text-[#f0e4d0] mb-3"/>
                  <p className="font-display text-2xl text-[#7a5c3a] mb-1">No orders here</p>
                  <p className="text-sm text-[#7a5c3a]">Tap "New Order" to take an order from a customer.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── MENU TAB ── */}
        {tab === "menu" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-2xl text-[#1c0f00]">Menu</h2>
                <p className="text-sm text-[#7a5c3a]">{menu.filter(m=>m.available).length} of {menu.length} items available</p>
              </div>
              <button onClick={() => setShowNewItem(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#d62828] text-[#d62828] text-sm font-bold hover:bg-[#d62828] hover:text-white transition-all">
                <Plus size={15}/> Add Item
              </button>
            </div>

            {(Object.entries(menuByCategory) as [Category, MenuItem[]][]).map(([cat, items]) => (
              <div key={cat} className="card overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3 border-b border-[#f0e4d0]"
                  style={{ background: CATEGORY_META[cat].bg }}>
                  <span className="text-sm font-bold" style={{ color: CATEGORY_META[cat].color }}>{CATEGORY_META[cat].label}</span>
                  <span className="text-xs text-[#7a5c3a]">({items.length} items)</span>
                </div>
                <div className="divide-y divide-[#f0e4d0]">
                  {items.map(item => (
                    <div key={item.id} className={`flex items-center gap-4 px-5 py-3.5 transition-colors ${!item.available ? "opacity-50 bg-[#f9f9f9]" : "hover:bg-[#fffbf5]"}`}>
                      <span className="text-2xl">{item.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm text-[#1c0f00]">{item.name}</p>
                          {item.bestseller && (
                            <span className="flex items-center gap-0.5 text-xs text-[#f9a825] font-semibold">
                              <Star size={10} fill="#f9a825"/> Best
                            </span>
                          )}
                        </div>
                        <p className="font-mono text-sm font-bold text-[#d62828]">{fmtNaira(item.price)}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => toggleAvailable(item.id)}
                          className={`relative w-11 h-6 rounded-full transition-all ${item.available ? "bg-[#2d6a4f]" : "bg-[#d1d5db]"}`}>
                          <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${item.available ? "left-5" : "left-0.5"}`}/>
                        </button>
                        <button onClick={() => setMenu(m => m.filter(mi => mi.id !== item.id))}
                          className="text-[#f0e4d0] hover:text-[#d62828] transition-colors ml-1">
                          <Trash2 size={15}/>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ANALYTICS TAB ── */}
        {tab === "analytics" && (
          <div className="space-y-5">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Today's Revenue", value: fmtNaira(analytics.todayRevenue), sub: `${analytics.deliveredCount} orders`, color: "#d62828", icon: <DollarSign size={18}/> },
                { label: "Active Orders", value: String(analytics.activeOrders), sub: "In progress", color: "#f9a825", icon: <Clock size={18}/> },
                { label: "Avg Order Value", value: fmtNaira(analytics.avgOrder), sub: "Per delivery", color: "#2d6a4f", icon: <TrendingUp size={18}/> },
                { label: "Menu Items", value: String(menu.filter(m=>m.available).length), sub: `${menu.length} total`, color: "#7c3aed", icon: <Package size={18}/> },
              ].map((stat, i) => (
                <div key={stat.label} className={`card p-4 rise d${i+1}`}>
                  <div className="w-9 h-9 rounded-xl mb-3 flex items-center justify-center" style={{ background: stat.color+"15", color: stat.color }}>
                    {stat.icon}
                  </div>
                  <p className="font-display font-bold text-2xl text-[#1c0f00] leading-none">{stat.value}</p>
                  <p className="text-xs text-[#7a5c3a] mt-1">{stat.label}</p>
                  <p className="text-xs text-[#7a5c3a]">{stat.sub}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Top selling items */}
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-[#f9a825]"/>
                  <h3 className="font-display font-bold text-lg text-[#1c0f00]">Top Sellers</h3>
                </div>
                {analytics.topSorted.length === 0 && (
                  <p className="text-sm text-[#7a5c3a]">No delivered orders yet.</p>
                )}
                <div className="space-y-3">
                  {analytics.topSorted.map(([name, qty], i) => {
                    const maxQty = analytics.topSorted[0]?.[1] ?? 1;
                    return (
                      <div key={name}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-[#1c0f00]">{i+1}. {name}</span>
                          <span className="font-mono text-[#d62828] font-bold">{qty} sold</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#f0e4d0] overflow-hidden">
                          <div className="h-full rounded-full bg-[#d62828] transition-all" style={{ width: `${(qty/maxQty)*100}%` }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Order channels */}
              <div className="card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Users size={16} className="text-[#2d6a4f]"/>
                  <h3 className="font-display font-bold text-lg text-[#1c0f00]">Order Channels</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { key: "walkin", label: "🚶 Walk-in", color: "#d62828" },
                    { key: "whatsapp", label: "💬 WhatsApp", color: "#2d6a4f" },
                    { key: "call", label: "📞 Phone Call", color: "#f9a825" },
                  ].map(ch => {
                    const count = analytics.byChannel[ch.key as keyof typeof analytics.byChannel];
                    const total = orders.length || 1;
                    return (
                      <div key={ch.key}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="font-medium text-[#1c0f00]">{ch.label}</span>
                          <span className="text-[#7a5c3a]">{count} ({Math.round((count/total)*100)}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#f0e4d0] overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${(count/total)*100}%`, background: ch.color }}/>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-5 p-3 rounded-xl bg-[#fdf0e0] border border-[#f0e4d0]">
                  <p className="text-xs text-[#7a5c3a] font-medium">💡 Tip: Most Nigerian food vendors get 60%+ orders via WhatsApp. Add your link to your profile!</p>
                </div>
              </div>
            </div>

            {/* Revenue breakdown by status */}
            <div className="card p-5">
              <h3 className="font-display font-bold text-lg text-[#1c0f00] mb-4">Revenue Breakdown</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(["pending","preparing","ready","delivered"] as OrderStatus[]).map(s => {
                  const cfg = STATUS_CFG[s];
                  const rev = orders.filter(o=>o.status===s).reduce((a,o)=>a+o.total,0);
                  return (
                    <div key={s} className="text-center p-3 rounded-xl" style={{ background: cfg.bg }}>
                      <p className="font-display font-bold text-xl" style={{ color: cfg.color }}>{fmtNaira(rev)}</p>
                      <p className="text-xs font-semibold mt-1 capitalize" style={{ color: cfg.color }}>{cfg.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── NEW ORDER MODAL ── */}
      {showNewOrder && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl p-5 max-h-[92vh] flex flex-col border border-[#f0e4d0]">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <div>
                <h3 className="font-display font-bold text-2xl text-[#1c0f00]">New Order</h3>
                <p className="text-xs text-[#7a5c3a] font-mono">{orderNo}</p>
              </div>
              <button onClick={() => setShowNewOrder(false)} className="text-[#7a5c3a] hover:text-[#1c0f00]"><X size={22}/></button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 pr-1">
              {/* Customer info */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#7a5c3a] uppercase tracking-wide mb-1.5 block">Customer Name *</label>
                  <input type="text" value={orderForm.customerName}
                    onChange={e => setOrderForm(f=>({...f, customerName: e.target.value}))}
                    placeholder="e.g. Tunde Badmus"
                    className="w-full bg-[#fffbf5] border border-[#f0e4d0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#d62828]/50 transition-colors"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#7a5c3a] uppercase tracking-wide mb-1.5 block">Phone</label>
                  <input type="tel" value={orderForm.customerPhone}
                    onChange={e => setOrderForm(f=>({...f, customerPhone: e.target.value}))}
                    placeholder="080XXXXXXXX"
                    className="w-full bg-[#fffbf5] border border-[#f0e4d0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#d62828]/50 transition-colors"/>
                </div>
              </div>

              {/* Channel */}
              <div>
                <label className="text-xs font-bold text-[#7a5c3a] uppercase tracking-wide mb-1.5 block">Order Channel</label>
                <div className="flex gap-2">
                  {([["walkin","🚶 Walk-in"],["whatsapp","💬 WhatsApp"],["call","📞 Call"]] as [Order["channel"],string][]).map(([ch,lbl]) => (
                    <button key={ch} onClick={() => setOrderForm(f=>({...f, channel: ch}))}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all border ${orderForm.channel === ch ? "bg-[#1c0f00] text-white border-[#1c0f00]" : "border-[#f0e4d0] text-[#7a5c3a]"}`}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu picker */}
              <div>
                <label className="text-xs font-bold text-[#7a5c3a] uppercase tracking-wide mb-2 block">Add Items</label>
                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {menu.filter(m=>m.available).map(item => {
                    const inCart = orderForm.cart.find(c=>c.menuItemId===item.id);
                    return (
                      <div key={item.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-[#fffbf5] border border-[#f0e4d0]">
                        <span className="text-xl">{item.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#1c0f00] truncate">{item.name}</p>
                          <p className="font-mono text-xs text-[#d62828] font-bold">{fmtNaira(item.price)}</p>
                        </div>
                        {inCart ? (
                          <div className="flex items-center gap-2">
                            <button onClick={() => { if (inCart.qty === 1) removeFromCart(item.id); else changeQty(item.id, -1); }}
                              className="w-7 h-7 rounded-lg bg-[#f0e4d0] text-[#1c0f00] flex items-center justify-center font-bold text-sm hover:bg-[#e5d5c0] transition-colors">−</button>
                            <span className="font-bold text-sm w-4 text-center">{inCart.qty}</span>
                            <button onClick={() => changeQty(item.id, 1)}
                              className="w-7 h-7 rounded-lg bg-[#d62828] text-white flex items-center justify-center font-bold text-sm hover:bg-[#b91c1c] transition-colors">+</button>
                          </div>
                        ) : (
                          <button onClick={() => addToCart(item)}
                            className="w-7 h-7 rounded-lg bg-[#d62828] text-white flex items-center justify-center font-bold text-sm hover:bg-[#b91c1c] transition-colors">
                            <Plus size={14}/>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cart summary */}
              {orderForm.cart.length > 0 && (
                <div className="bg-[#fdf0e0] border border-[#f0e4d0] rounded-2xl p-4">
                  <p className="text-xs font-bold text-[#7a5c3a] uppercase tracking-wide mb-2">Order Summary</p>
                  {orderForm.cart.map(c => (
                    <div key={c.menuItemId} className="flex justify-between text-sm py-1">
                      <span className="text-[#1c0f00]">{c.qty}× {c.name}</span>
                      <span className="font-mono font-bold text-[#d62828]">{fmtNaira(c.qty * c.unitPrice)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-base pt-2 mt-1 border-t border-[#e5d5c0]">
                    <span className="text-[#1c0f00]">Total</span>
                    <span className="font-mono font-bold text-[#d62828] text-lg">{fmtNaira(cartTotal)}</span>
                  </div>
                </div>
              )}

              {/* Note */}
              <div>
                <label className="text-xs font-bold text-[#7a5c3a] uppercase tracking-wide mb-1.5 block">Special Note</label>
                <input type="text" value={orderForm.note}
                  onChange={e => setOrderForm(f=>({...f, note: e.target.value}))}
                  placeholder="e.g. No pepper, extra fish, for delivery..."
                  className="w-full bg-[#fffbf5] border border-[#f0e4d0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#d62828]/50 transition-colors"/>
              </div>
            </div>

            {/* Place order CTA */}
            <div className="pt-4 flex-shrink-0">
              <button onClick={placeOrder}
                disabled={!orderForm.customerName || orderForm.cart.length === 0}
                className="w-full py-3.5 rounded-2xl bg-[#d62828] text-white font-bold text-base hover:bg-[#b91c1c] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-[#d62828]/20">
                {orderForm.cart.length === 0 ? "Add items to place order" : `Place Order · ${fmtNaira(cartTotal)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD MENU ITEM MODAL ── */}
      {showNewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm border border-[#f0e4d0]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-xl text-[#1c0f00]">Add Menu Item</h3>
              <button onClick={() => setShowNewItem(false)} className="text-[#7a5c3a] hover:text-[#1c0f00]"><X size={20}/></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-[#7a5c3a] uppercase tracking-wide mb-1.5 block">Item Name</label>
                  <input type="text" value={itemForm.name} onChange={e => setItemForm(f=>({...f, name: e.target.value}))}
                    placeholder="e.g. Jollof Rice"
                    className="w-full bg-[#fffbf5] border border-[#f0e4d0] rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#d62828]/50 transition-colors"/>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#7a5c3a] uppercase tracking-wide mb-1.5 block">Emoji</label>
                  <input type="text" value={itemForm.emoji} onChange={e => setItemForm(f=>({...f, emoji: e.target.value}))}
                    className="w-full bg-[#fffbf5] border border-[#f0e4d0] rounded-xl px-3 py-2.5 text-2xl text-center focus:outline-none focus:border-[#d62828]/50 transition-colors"/>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#7a5c3a] uppercase tracking-wide mb-1.5 block">Category</label>
                <div className="grid grid-cols-3 gap-2">
                  {(Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][]).map(([cat, meta]) => (
                    <button key={cat} onClick={() => setItemForm(f=>({...f, category: cat}))}
                      className="py-2 rounded-xl text-xs font-semibold border transition-all capitalize"
                      style={itemForm.category === cat ? { background: meta.bg, color: meta.color, borderColor: meta.color+"60" } : { borderColor: "#f0e4d0", color: "#7a5c3a" }}>
                      {meta.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-[#7a5c3a] uppercase tracking-wide mb-1.5 block">Price (₦)</label>
                <input type="number" value={itemForm.price} onChange={e => setItemForm(f=>({...f, price: e.target.value}))}
                  placeholder="e.g. 800"
                  className="w-full bg-[#fffbf5] border border-[#f0e4d0] rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:border-[#d62828]/50 transition-colors"/>
              </div>
              <button onClick={addMenuItem}
                className="w-full py-3 rounded-xl bg-[#d62828] text-white font-bold hover:bg-[#b91c1c] transition-all">
                Add to Menu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
