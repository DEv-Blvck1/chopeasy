"use client";

import { useState, useMemo, useEffect } from "react";
import {
  ShoppingBag, Plus, Trash2, CheckCircle2, Clock, XCircle,
  TrendingUp, Package, Users, DollarSign, ChefHat, Star,
  X, BarChart3, Bell, Check, Flame, Sparkles, Phone,
  MessageCircle, Footprints, Store, LogOut, LogIn,
  UserPlus, ChevronDown, Search, ShieldCheck, Settings,
  ArrowLeft
} from "lucide-react";
import ChopEasyLogo from "@/components/ChopEasyLogo";
import AuthModal, { UserSession } from "@/components/AuthModal";
import TermsModal from "@/components/TermsModal";
import LandingPage from "@/components/LandingPage";
import SettingsModal, { KitchenSettings } from "@/components/SettingsModal";
import SteamingFoodPlate from "@/components/SteamingFoodPlate";
import AnalyticsBarChart from "@/components/AnalyticsBarChart";
import SmokyBackground from "@/components/SmokyBackground";
import ThemeToggle from "@/components/ThemeToggle";

type OrderStatus = "pending" | "preparing" | "ready" | "delivered" | "cancelled";
type Category = "rice" | "swallow" | "protein" | "snack" | "drink" | "soup" | "special";

interface MenuItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  available: boolean;
  emoji: string;
  image?: string;
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

function genId() {
  return Math.random().toString(36).slice(2, 9);
}

function getCurrencySymbol(code: string = "NGN") {
  switch (code) {
    case "USD": return "$";
    case "EUR": return "€";
    case "GBP": return "£";
    default: return "₦";
  }
}

function fmtMoney(n: number, currencyCode: string = "NGN") {
  const sym = getCurrencySymbol(currencyCode);
  return sym + new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

function fmtNaira(n: number, currencyCode: string = "NGN") {
  return fmtMoney(n, currencyCode);
}

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (diff < 1) return "just now";
  if (diff < 60) return `${diff}m ago`;
  return `${Math.floor(diff / 60)}h ago`;
}

const CATEGORY_META: Record<Category, { label: string; color: string; bg: string; border: string }> = {
  rice:    { label: "Rice",     color: "#e11d48", bg: "#ffe4e6", border: "#fecdd3" },
  swallow: { label: "Swallow",  color: "#7c3aed", bg: "#ede9fe", border: "#ddd6fe" },
  protein: { label: "Protein",  color: "#d97706", bg: "#fef3c7", border: "#fde68a" },
  snack:   { label: "Snack",    color: "#0284c7", bg: "#e0f2fe", border: "#bae6fd" },
  drink:   { label: "Drink",    color: "#0891b2", bg: "#cffafe", border: "#a5f3fc" },
  soup:    { label: "Soup",     color: "#ea580c", bg: "#ffedd5", border: "#fed7aa" },
  special: { label: "Special",  color: "#059669", bg: "#dcfce7", border: "#bbf7d0" },
};

const STATUS_CFG: Record<
  OrderStatus,
  { label: string; color: string; bg: string; border: string; icon: React.ReactNode }
> = {
  pending:   { label: "Pending",   color: "#f59e0b", bg: "rgba(245, 158, 11, 0.15)", border: "rgba(245, 158, 11, 0.35)", icon: <Clock size={13} className="animate-spin text-amber-400" /> },
  preparing: { label: "Preparing", color: "#facc15", bg: "rgba(234, 179, 8, 0.18)",  border: "rgba(250, 204, 21, 0.35)", icon: <Flame size={13} className="text-yellow-400 animate-pulse" /> },
  ready:     { label: "Ready",     color: "#34d399", bg: "rgba(16, 185, 129, 0.18)", border: "rgba(52, 211, 153, 0.35)", icon: <CheckCircle2 size={13} className="text-emerald-400" /> },
  delivered: { label: "Delivered", color: "#94a3b8", bg: "rgba(148, 163, 184, 0.15)", border: "rgba(148, 163, 184, 0.3)", icon: <Check size={13} className="text-slate-300" /> },
  cancelled: { label: "Cancelled", color: "#f87171", bg: "rgba(239, 68, 68, 0.18)",  border: "rgba(248, 113, 113, 0.35)", icon: <XCircle size={13} className="text-rose-400" /> },
};

// Seed menu dishes
const SEED_MENU: MenuItem[] = [
  { id: "m1", name: "Jollof Rice",          category: "rice",    price: 800,  available: true,  emoji: "🍚", image: "/images/dishes/jollof-rice.png", bestseller: true },
  { id: "m2", name: "Fried Rice",           category: "rice",    price: 900,  available: true,  emoji: "🍛" },
  { id: "m3", name: "White Rice + Stew",    category: "rice",    price: 700,  available: true,  emoji: "🥘" },
  { id: "m4", name: "Egusi Soup",           category: "soup",    price: 600,  available: true,  emoji: "🍲", image: "/images/dishes/egusi-soup.png", bestseller: true },
  { id: "m5", name: "Ogbono Soup",          category: "soup",    price: 600,  available: true,  emoji: "🫕" },
  { id: "m6", name: "Amala",               category: "swallow", price: 200,  available: true,  emoji: "⚫" },
  { id: "m7", name: "Eba",                 category: "swallow", price: 150,  available: true,  emoji: "🟡" },
  { id: "m8", name: "Pounded Yam",         category: "swallow", price: 300,  available: true,  emoji: "⚪", image: "/images/dishes/pounded-yam.png", bestseller: true },
  { id: "m9", name: "Chicken (Full)",      category: "protein", price: 1800, available: true,  emoji: "🍗", image: "/images/dishes/full-chicken.png" },
  { id: "m10",name: "Chicken (Half)",      category: "protein", price: 1000, available: true,  emoji: "🍗" },
  { id: "m11",name: "Beef",               category: "protein", price: 500,  available: true,  emoji: "🥩" },
  { id: "m12",name: "Fish (Titus)",       category: "protein", price: 800,  available: true,  emoji: "🐟" },
  { id: "m13",name: "Puff Puff (5pcs)",   category: "snack",   price: 300,  available: true,  emoji: "🟠" },
  { id: "m14",name: "Small Chops Plate",  category: "snack",   price: 2500, available: true,  emoji: "🍢", image: "/images/dishes/small-chops.png", bestseller: true },
  { id: "m15",name: "Zobo",              category: "drink",   price: 300,  available: true,  emoji: "🍹", image: "/images/dishes/chilled-zobo.png" },
  { id: "m16",name: "Chapman",           category: "drink",   price: 500,  available: false, emoji: "🧃" },
  { id: "m17",name: "Caterer Special",   category: "special", price: 5000, available: true,  emoji: "👑" },
];

const minsAgo = (m: number) => new Date(Date.now() - m * 60000).toISOString();

// Seed initial orders
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

export interface ChopEasyAppProps {
  initialView?: "home" | "dashboard";
  initialTab?: Tab;
  initialAuthOpen?: boolean;
}

export default function ChopEasyApp({
  initialView = "home",
  initialTab = "orders",
  initialAuthOpen = false,
}: ChopEasyAppProps = {}) {
  // Navigation view: users first see the landing page
  const [currentView, setCurrentView] = useState<"home" | "dashboard">(initialView);

  // Core kitchen data
  const [menu, setMenu] = useState<MenuItem[]>(SEED_MENU);
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [tab, setTab] = useState<Tab>(initialTab);
  const [isOpen, setIsOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");

  // Modals state
  const [showNewOrder, setShowNewOrder] = useState(false);
  const [showNewItem, setShowNewItem] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(initialAuthOpen);
  const [authInitialMode, setAuthInitialMode] = useState<"login" | "register">("login");

  // Sync route and query params if user navigates or reloads
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const viewParam = params.get("view");
      if (viewParam === "dashboard") setCurrentView("dashboard");
      else if (viewParam === "home") setCurrentView("home");

      const tabParam = params.get("tab") as Tab;
      if (tabParam && ["orders", "menu", "analytics"].includes(tabParam)) setTab(tabParam);

      const path = window.location.pathname;
      if (path.includes("dashboard")) setCurrentView("dashboard");
      if (path.includes("menu")) { setCurrentView("dashboard"); setTab("menu"); }
      if (path.includes("orders")) { setCurrentView("dashboard"); setTab("orders"); }
      if (path.includes("analytics")) { setCurrentView("dashboard"); setTab("analytics"); }
      if (path.includes("login")) { setShowAuthModal(true); setAuthInitialMode("login"); }
    }
  }, []);

  // User and store settings
  const [currentUser, setCurrentUser] = useState<UserSession | null>({
    name: "Chef Amara Nwosu",
    email: "chefamara@chopeasy.ng",
    businessName: "Amara's Kitchen Lekki",
    phone: "0803 123 4567",
    role: "vendor_owner",
  });

  const [kitchenSettings, setKitchenSettings] = useState<KitchenSettings>({
    currency: "NGN",
    soundAlerts: true,
    autoWhatsAppNotify: true,
    dailyRevenueTarget: 150000,
    location: "Admiralty Way, Lekki Phase 1, Lagos",
  });

  // New order form state
  const [orderForm, setOrderForm] = useState({
    customerName: "",
    customerPhone: "",
    channel: "walkin" as Order["channel"],
    note: "",
    cart: [] as { menuItemId: string; name: string; qty: number; unitPrice: number }[],
  });

  // New menu item form state
  const [itemForm, setItemForm] = useState({
    name: "",
    category: "rice" as Category,
    price: "",
    emoji: "🍽️",
  });

  // Calculate analytics
  const analytics = useMemo(() => {
    const delivered = orders.filter((o) => o.status === "delivered");
    const todayRevenue = delivered.reduce((a, o) => a + o.total, 0);
    const activeOrders = orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;
    const topItems: Record<string, number> = {};
    delivered.forEach((o) =>
      o.items.forEach((i) => {
        topItems[i.name] = (topItems[i.name] || 0) + i.qty;
      })
    );
    const topSorted = Object.entries(topItems)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    const byChannel = { walkin: 0, whatsapp: 0, call: 0 };
    orders.forEach((o) => byChannel[o.channel]++);
    const avgOrder = delivered.length > 0 ? Math.round(todayRevenue / delivered.length) : 0;
    return { todayRevenue, activeOrders, deliveredCount: delivered.length, topSorted, byChannel, avgOrder };
  }, [orders]);

  const orderNo = `CHE-${String(orders.length + 42 + 1).padStart(3, "0")}`;
  const cartTotal = orderForm.cart.reduce((a, i) => a + i.qty * i.unitPrice, 0);
  const formatMoney = (n: number) => fmtMoney(n, kitchenSettings.currency);
  const currencySymbol = getCurrencySymbol(kitchenSettings.currency);

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setOrderForm((f) => {
      const existing = f.cart.find((c) => c.menuItemId === item.id);
      if (existing) {
        return {
          ...f,
          cart: f.cart.map((c) => (c.menuItemId === item.id ? { ...c, qty: c.qty + 1 } : c)),
        };
      }
      return {
        ...f,
        cart: [...f.cart, { menuItemId: item.id, name: item.name, qty: 1, unitPrice: item.price }],
      };
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setOrderForm((f) => ({ ...f, cart: f.cart.filter((c) => c.menuItemId !== menuItemId) }));
  };

  const changeQty = (menuItemId: string, delta: number) => {
    setOrderForm((f) => ({
      ...f,
      cart: f.cart.map((c) =>
        c.menuItemId === menuItemId ? { ...c, qty: Math.max(1, c.qty + delta) } : c
      ),
    }));
  };

  // Place order
  const placeOrder = () => {
    const custName = orderForm.customerName.trim();
    if (!custName || orderForm.cart.length === 0) return;
    const newOrder: Order = {
      id: genId(),
      orderNo,
      customerName: custName,
      customerPhone: orderForm.customerPhone.trim(),
      items: orderForm.cart,
      total: cartTotal,
      status: "pending",
      note: orderForm.note.trim() || undefined,
      createdAt: new Date().toISOString(),
      channel: orderForm.channel,
    };
    setOrders((prev) => [newOrder, ...prev]);
    setOrderForm({ customerName: "", customerPhone: "", channel: "walkin", note: "", cart: [] });
    setShowNewOrder(false);
  };

  // Move order through kitchen pipeline
  const advanceOrder = (id: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = ORDER_FLOW.indexOf(o.status);
        if (idx < ORDER_FLOW.length - 1) return { ...o, status: ORDER_FLOW[idx + 1] };
        return o;
      })
    );
  };

  const updateOrderStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  const cancelOrder = (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: "cancelled" } : o)));
  };

  // Menu updates
  const addMenuItem = () => {
    const trimmedName = itemForm.name.trim();
    const parsedPrice = parseFloat(itemForm.price);
    if (!trimmedName || isNaN(parsedPrice) || parsedPrice <= 0) return;
    const item: MenuItem = {
      id: genId(),
      name: trimmedName,
      category: itemForm.category,
      price: Math.round(parsedPrice * 100) / 100,
      available: true,
      emoji: itemForm.emoji || "🍽️",
    };
    setMenu((prev) => [item, ...prev]);
    setItemForm({ name: "", category: "rice", price: "", emoji: "🍽️" });
    setShowNewItem(false);
  };

  const toggleAvailable = (id: string) => {
    setMenu((prev) => prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m)));
  };

  // Filter orders by status, category and search keyword
  const filteredOrders = useMemo(() => {
    let result = filterStatus === "all" ? orders : orders.filter((o) => o.status === filterStatus);
    if (selectedCategory !== "all") {
      result = result.filter((o) =>
        o.items.some((i) => {
          const mItem = menu.find((m) => m.id === i.menuItemId);
          return mItem?.category === selectedCategory;
        })
      );
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o.customerName.toLowerCase().includes(q) ||
          o.orderNo.toLowerCase().includes(q) ||
          o.items.some((i) => i.name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [orders, filterStatus, searchQuery, selectedCategory, menu]);

  // Filter menu items by category and search keyword
  const filteredMenu = useMemo(() => {
    let result = selectedCategory === "all" ? menu : menu.filter((m) => m.category === selectedCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((m) => m.name.toLowerCase().includes(q) || m.category.toLowerCase().includes(q));
    }
    return result;
  }, [menu, selectedCategory, searchQuery]);

  const activeCount = orders.filter((o) => !["delivered", "cancelled"].includes(o.status)).length;

  const menuByCategory = useMemo(() => {
    return menu.reduce<Record<Category, MenuItem[]>>((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {} as Record<Category, MenuItem[]>);
  }, [menu]);

  // If user is viewing the landing page, render it directly
  if (currentView === "home") {
    return (
      <>
        <LandingPage
          onEnterDashboard={() => setCurrentView("dashboard")}
          onOpenAuth={(mode) => {
            setAuthInitialMode(mode);
            setShowAuthModal(true);
          }}
          onOpenTerms={() => setShowTermsModal(true)}
          currentUser={currentUser}
        />

        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode={authInitialMode}
          onSuccess={(user) => {
            setCurrentUser(user);
            setCurrentView("dashboard");
          }}
        />

        <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
      </>
    );
  }

  // Otherwise, render full kitchen management dashboard
  return (
    <div className="min-h-screen app-wallpaper-inapp text-slate-900 dark:text-white flex flex-col relative selection:bg-rose-600 selection:text-white">
      {/* ── TOP HEADER (GLASSMORPHIC RED & BLACK / LIGHT THEME) ── */}
      <header className="sticky top-0 z-40 glass-header px-4 sm:px-6 py-3 transition-all border-b border-black/5 dark:border-white/10 backdrop-blur-2xl">
        <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 flex items-center justify-between gap-3">
          {/* Logo with click-to-home redirect */}
          <div className="flex items-center gap-3">
            <ChopEasyLogo
              size="md"
              showTagline={true}
              onClick={() => setCurrentView("home")}
              className="cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
            />

            {currentUser && (
              <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-black/10 dark:border-white/15">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 truncate max-w-[160px]">
                  {currentUser.businessName}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-300 font-bold border border-rose-500/30">
                  Verified
                </span>
              </div>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Home Switcher */}
            <button
              onClick={() => setCurrentView("home")}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white glass-btn transition-all duration-200 cursor-pointer active:scale-95"
            >
              <ArrowLeft size={13} />
              <span>Back to Home</span>
            </button>

            {/* Top Right Corner Light/Dark Theme Switcher */}
            <ThemeToggle showLabel={true} />

            {/* Active Orders Count Badge */}
            {activeCount > 0 && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 shadow-sm text-rose-600 dark:text-rose-300">
                <Bell size={13} className="text-rose-500 dark:text-rose-400 animate-bounce" />
                <span className="text-xs font-bold font-mono">{activeCount} active</span>
              </div>
            )}

            {/* Store Open/Closed Toggle */}
            <button
              onClick={() => setIsOpen((o) => !o)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 cursor-pointer shadow-sm active:scale-95 ${
                isOpen ? "status-open" : "status-closed"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOpen ? "bg-emerald-400" : "bg-rose-500"} animate-pulse`} />
              <span>{isOpen ? "Store Open" : "Store Closed"}</span>
            </button>

            {/* New Order CTA */}
            <button
              onClick={() => setShowNewOrder(true)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white text-xs sm:text-sm font-bold hover:from-rose-500 hover:to-red-600 active:scale-95 transition-all duration-300 shadow-lg shadow-rose-950/60 border border-rose-400/30 cursor-pointer"
            >
              <Plus size={16} /> <span>New Order</span>
            </button>

            {/* User Profile & Settings Menu */}
            <div className="relative">
              {currentUser ? (
                <div>
                  <button
                    onClick={() => setShowProfileMenu(!showProfileMenu)}
                    className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl glass-btn text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-all text-xs font-semibold shadow-sm cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-rose-600 to-red-700 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                      {currentUser.name.charAt(0)}
                    </div>
                    <span className="hidden sm:inline font-bold truncate max-w-[100px]">
                      {currentUser.name.split(" ")[0]}
                    </span>
                    <ChevronDown size={14} className="text-slate-500 dark:text-slate-400" />
                  </button>

                  {/* Profile Dropdown */}
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-[#0d0e15]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 p-2 z-50 animate-in fade-in duration-150 text-slate-900 dark:text-white">
                      <div className="p-3 border-b border-black/5 dark:border-white/10 bg-black/[0.03] dark:bg-white/[0.04] rounded-xl mb-1">
                        <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{currentUser.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{currentUser.email}</p>
                        <p className="text-[11px] font-semibold text-rose-600 dark:text-rose-400 mt-1 flex items-center gap-1">
                          <Store size={12} /> {currentUser.businessName}
                        </p>
                      </div>

                      {/* Edit Profile & Settings Trigger */}
                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowSettingsModal(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 dark:text-slate-200 font-bold hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <Settings size={14} className="text-slate-500 dark:text-slate-400" /> Profile & Kitchen Settings
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setAuthInitialMode("login");
                          setShowAuthModal(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogIn size={14} className="text-slate-500 dark:text-slate-400" /> Switch Account / Re-login
                      </button>

                      <button
                        onClick={() => {
                          setShowProfileMenu(false);
                          setShowTermsModal(true);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <ShieldCheck size={14} className="text-slate-500 dark:text-slate-400" /> Terms of Service
                      </button>

                      <div className="border-t border-black/5 dark:border-white/10 my-1" />

                      <button
                        onClick={() => {
                          setCurrentUser(null);
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-500/15 flex items-center gap-2 transition-colors cursor-pointer"
                      >
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setAuthInitialMode("login");
                      setShowAuthModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl glass-btn text-slate-700 dark:text-white text-xs font-bold hover:bg-black/5 dark:hover:bg-white/15 transition-all shadow-sm cursor-pointer"
                  >
                    <LogIn size={14} /> <span>Sign In</span>
                  </button>
                  <button
                    onClick={() => {
                      setAuthInitialMode("register");
                      setShowAuthModal(true);
                    }}
                    className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white text-xs font-bold hover:from-rose-500 hover:to-red-600 transition-all shadow-sm border border-rose-400/30 cursor-pointer"
                  >
                    <UserPlus size={14} /> <span>Register</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── SUBNAV TABS & SEARCH (GLASSMORPHIC) ── */}
      <div className="sticky top-[58px] z-30 glass-subnav px-4 sm:px-6 lg:px-8 xl:px-12 border-b border-black/5 dark:border-white/10 backdrop-blur-2xl">
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Main Module Tabs with Smooth Transition */}
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {[
              { id: "orders", label: "Live Orders", count: activeCount, icon: <ShoppingBag size={15} /> },
              { id: "menu", label: "Menu & Inventory", count: menu.length, icon: <Package size={15} /> },
              { id: "analytics", label: "Analytics & Sales", count: null, icon: <BarChart3 size={15} /> },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id as Tab)}
                className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-bold transition-all duration-300 border-b-2 shrink-0 cursor-pointer ${
                  tab === t.id
                    ? "border-rose-500 text-rose-600 dark:text-rose-400 bg-rose-500/10"
                    : "border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-black/10 dark:hover:border-white/20"
                }`}
              >
                {t.icon}
                <span>{t.label}</span>
                {t.count !== null && (
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[11px] font-mono ${
                      tab === t.id ? "bg-rose-600 text-white" : "bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    {t.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search box for orders & dishes with glassmorphism */}
          <div className="relative py-1.5 sm:py-0 w-full sm:w-80">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search dishes, tickets, customers..."
              className="w-full bg-black/[0.04] dark:bg-white/[0.06] border border-black/10 dark:border-white/10 rounded-xl pl-8 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-white/[0.1] transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN DASHBOARD VIEW (FULL-SCREEN FLUID LAYOUT) ── */}
      <main className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-6 flex-1 relative z-10 space-y-6">
        {/* Sizzling Kitchen Live Station Banner with Animated Smoke */}
        <div className="relative rounded-3xl p-6 sm:p-8 overflow-hidden shadow-xl border border-slate-800/80 bg-gradient-to-r from-[#0a0f1d] via-[#111827] to-[#1a1829] text-white">
          {/* Animated Rising Smoke & Embers */}
          <SmokyBackground intensity="deep" showEmbers={true} className="opacity-75" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex-1 space-y-3 text-center md:text-left">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{isOpen ? "Kitchen Station Live" : "Store Closed"} · {activeCount} Active Orders</span>
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-amber-300 font-medium">
                  <span>📍 {kitchenSettings.location || "Lagos, Nigeria"}</span>
                </span>
              </div>

              <h2 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl text-white leading-tight">
                Good Food, Great <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-rose-500 bg-clip-text text-transparent">Kitchen Flow</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
                Real-time ticket progression active. Only in-stock dishes can be ordered. Monitor cooking stages from counter walk-ins to WhatsApp delivery.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2 justify-center md:justify-start">
                <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs font-mono shadow-xs">
                  <span className="text-slate-400 mr-2">Target:</span>
                  <strong className="text-amber-400 font-bold">{formatMoney(kitchenSettings.dailyRevenueTarget)}</strong>
                </div>
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-xs font-mono shadow-xs">
                  <span className="text-emerald-300 mr-2">Today:</span>
                  <strong className="text-emerald-400 font-bold">{formatMoney(analytics.todayRevenue)}</strong>
                </div>
                <div className="px-4 py-2 rounded-xl bg-rose-500/20 backdrop-blur-md border border-rose-500/30 text-xs font-mono shadow-xs">
                  <span className="text-rose-300 mr-2">Avg Ticket:</span>
                  <strong className="text-rose-400 font-bold">{formatMoney(analytics.avgOrder)}</strong>
                </div>
              </div>
            </div>

            {/* Steaming Food Dish with Animated Smoke */}
            <div className="w-full md:w-72 max-w-[320px] shrink-0 relative">
              <SteamingFoodPlate interactive={true} showBadges={false} className="shadow-2xl border-white/20" />
            </div>
          </div>
        </div>

        {/* Circular Category Strip with Dark Glassmorphism */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">Quick Category Filter</span>
            <span className="text-xs text-slate-400 font-mono">
              {menu.filter((m) => selectedCategory === "all" || m.category === selectedCategory).length} items
            </span>
          </div>
          <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all", label: "All", emoji: "🍽️" },
              { id: "rice", label: "Rice", emoji: "🍚" },
              { id: "soup", label: "Soups", emoji: "🍲" },
              { id: "swallow", label: "Swallows", emoji: "⚪" },
              { id: "protein", label: "Proteins", emoji: "🍗" },
              { id: "snack", label: "Small Chops", emoji: "🍢" },
              { id: "drink", label: "Beverages", emoji: "🍹" },
              { id: "special", label: "Specials", emoji: "👑" },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className="flex flex-col items-center gap-1.5 shrink-0 group cursor-pointer transition-transform duration-200 hover:scale-105"
              >
                <div
                  className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                    selectedCategory === cat.id
                      ? "bg-gradient-to-tr from-rose-600 via-red-600 to-amber-500 text-white ring-4 ring-rose-500/35 scale-105 shadow-xl shadow-rose-950/70"
                      : "bg-[#11121d]/80 backdrop-blur-xl border border-white/10 text-slate-200 hover:border-rose-500/50 hover:bg-white/10 shadow-lg"
                  }`}
                >
                  {cat.emoji}
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-bold transition-colors ${
                    selectedCategory === cat.id ? "text-rose-400 font-black" : "text-slate-400 group-hover:text-white"
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex gap-1.5 sm:gap-2 flex-wrap">
                {(["all", "pending", "preparing", "ready", "delivered", "cancelled"] as const).map((s) => {
                  const count = s === "all" ? orders.length : orders.filter((o) => o.status === s).length;
                  const isCurrent = filterStatus === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setFilterStatus(s)}
                      className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all duration-200 cursor-pointer ${
                        isCurrent
                          ? "glass-pill-active"
                          : "glass-pill text-slate-300 hover:text-white"
                      }`}
                    >
                      {s === "all" ? (
                        <span>All Orders</span>
                      ) : (
                        <>
                          {STATUS_CFG[s].icon}
                          <span>{STATUS_CFG[s].label}</span>
                        </>
                      )}
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          isCurrent ? "bg-white/20 text-white" : "bg-white/10 text-slate-300"
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="text-xs text-slate-400 font-medium hidden sm:block">
                Showing <span className="font-bold text-white">{filteredOrders.length}</span> of {orders.length} orders
              </div>
            </div>

            {/* Orders Grid (Glassmorphed Cards with Custom Ready, Preparing, and Cancel Buttons) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
              {filteredOrders.map((order) => {
                const cfg = STATUS_CFG[order.status];
                const isActive = !["delivered", "cancelled"].includes(order.status);

                return (
                  <div
                    key={order.id}
                    className={`glass-card-dark rounded-3xl p-5 flex flex-col justify-between transition-all duration-300 relative border border-black/5 dark:border-white/10 hover:border-rose-500/40 text-slate-900 dark:text-white shadow-xl ${
                      isActive ? "ring-1 ring-rose-500/30" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-rose-600 dark:text-rose-400 text-sm">
                              {order.orderNo}
                            </span>
                            <span
                              className="inline-flex items-center gap-1 text-[11px] px-2.5 py-0.5 rounded-full font-bold border"
                              style={{
                                color: cfg.color,
                                backgroundColor: cfg.bg,
                                borderColor: cfg.border,
                              }}
                            >
                              {cfg.icon}
                              {cfg.label}
                            </span>
                          </div>

                          <h4 className="font-display font-extrabold text-slate-900 dark:text-white text-base mt-1.5 leading-snug">
                            {order.customerName}
                          </h4>

                          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span className="inline-flex items-center gap-1 font-medium">
                              {order.channel === "walkin" && (
                                <>
                                  <Footprints size={12} className="text-amber-500" /> Walk-in
                                </>
                              )}
                              {order.channel === "whatsapp" && (
                                <>
                                  <MessageCircle size={12} className="text-emerald-500" /> WhatsApp
                                </>
                              )}
                              {order.channel === "call" && (
                                <>
                                  <Phone size={12} className="text-blue-500" /> Phone Call
                                </>
                              )}
                            </span>
                            <span>•</span>
                            <span suppressHydrationWarning>{timeAgo(order.createdAt)}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="font-display font-black text-xl text-slate-900 dark:text-white tracking-tight">
                            {formatMoney(order.total)}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                            {order.items.reduce((s, i) => s + i.qty, 0)} items
                          </p>
                        </div>
                      </div>

                      <div className="bg-black/[0.03] dark:bg-white/[0.04] border border-black/5 dark:border-white/10 rounded-2xl p-3.5 space-y-1.5 mb-3.5">
                        {order.items.map((item) => (
                          <div
                            key={item.menuItemId}
                            className="flex justify-between items-center text-xs text-slate-700 dark:text-slate-200"
                          >
                            <span className="font-medium">
                              <span className="text-rose-600 dark:text-rose-400 font-bold mr-1">{item.qty}×</span>
                              {item.name}
                            </span>
                            <span className="font-mono text-amber-600 dark:text-amber-400 font-semibold">
                              {formatMoney(item.qty * item.unitPrice)}
                            </span>
                          </div>
                        ))}
                      </div>

                      {order.note && (
                        <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-700 dark:text-amber-300 font-medium flex items-start gap-1.5 mb-3.5">
                          <span className="shrink-0">📝</span>
                          <span>{order.note}</span>
                        </div>
                      )}
                    </div>

                    {/* Order action workflow: Ready (Green), Preparing (Yellow), Cancel (Red) */}
                    {isActive ? (
                      <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                        {order.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateOrderStatus(order.id, "preparing")}
                              className="btn-preparing flex-1 py-2.5 px-3 rounded-xl text-xs font-black transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
                            >
                              <Flame size={14} className="animate-pulse" />
                              <span>Start Preparing</span>
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.id, "ready")}
                              title="Mark directly as Ready (Green)"
                              className="btn-ready py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1 cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
                            >
                              <CheckCircle2 size={14} />
                              <span className="hidden sm:inline">Ready</span>
                            </button>
                          </>
                        )}

                        {order.status === "preparing" && (
                          <button
                            onClick={() => advanceOrder(order.id)}
                            className="btn-ready flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
                          >
                            <CheckCircle2 size={14} />
                            <span>Mark Ready</span>
                          </button>
                        )}

                        {order.status === "ready" && (
                          <button
                            onClick={() => advanceOrder(order.id)}
                            className="bg-[#1e202e] hover:bg-[#282a3d] text-slate-100 border border-white/20 flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95 shadow-md"
                          >
                            <Check size={14} />
                            <span>Mark Delivered</span>
                          </button>
                        )}

                        <button
                          onClick={() => cancelOrder(order.id)}
                          title="Reject or Cancel Order (Red)"
                          className="btn-cancel p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center shadow-md shrink-0 hover:scale-[1.05] active:scale-95"
                        >
                          <XCircle size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                        <span>Status: <strong className="text-white">{cfg.label}</strong></span>
                        <span className="font-mono text-[10px] text-slate-400">{order.customerPhone}</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {filteredOrders.length === 0 && (
                <div className="col-span-full glass-card-dark rounded-3xl p-12 text-center border border-white/10">
                  <div className="w-16 h-16 rounded-3xl bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <ShoppingBag size={30} />
                  </div>
                  <h3 className="font-display font-bold text-xl text-white mb-1">
                    No matching orders
                  </h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
                    {searchQuery
                      ? `No orders found matching "${searchQuery}". Clear your search query or filters.`
                      : "No orders in this status category. Click '+ New Order' to take an order."}
                  </p>
                  <button
                    onClick={() => setShowNewOrder(true)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white font-bold text-xs shadow-lg shadow-rose-950/60 hover:from-rose-500 hover:to-red-600 border border-rose-400/30 transition-all cursor-pointer"
                  >
                    + Place New Customer Order
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MENU TAB (CONCEPT INSPIRED BY MODERN FOOD PORTAL) */}
        {tab === "menu" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
                  Featured Dishes & Kitchen Catalog
                </h2>
                <p className="text-xs text-slate-400">
                  <span className="font-bold text-emerald-400">
                    {filteredMenu.filter((m) => m.available).length} of {filteredMenu.length}
                  </span>{" "}
                  dishes currently available for customers · Click toggle to mark sold-out
                </p>
              </div>

              <button
                onClick={() => setShowNewItem(true)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white text-xs sm:text-sm font-bold hover:from-rose-500 hover:to-red-600 transition-all shadow-lg shadow-rose-950/60 border border-rose-400/30 cursor-pointer"
              >
                <Plus size={16} /> Add Menu Item
              </button>
            </div>

            {/* Featured Dishes Card Grid (Glassmorphic Theme) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-5">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className={`group rounded-3xl glass-card-dark border border-black/5 dark:border-white/10 shadow-xl hover:border-rose-500/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col justify-between text-slate-900 dark:text-white ${
                    !item.available ? "opacity-50" : ""
                  }`}
                >
                  <div>
                    {/* Dish Photo Container */}
                    <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-900">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-black/5 dark:bg-white/[0.03] text-5xl">
                          {item.emoji}
                        </div>
                      )}

                      {/* Category Badge & Bestseller on Photo */}
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md text-[10px] font-bold text-white uppercase tracking-wider border border-white/10 shadow-xs">
                          {item.category}
                        </span>
                        {item.bestseller && (
                          <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold shadow-xs">
                            <Star size={10} fill="currentColor" /> Best
                          </span>
                        )}
                      </div>

                      {/* Stock Status Badge */}
                      <div className="absolute bottom-3 right-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                            item.available
                              ? "bg-emerald-500 text-white"
                              : "bg-rose-600 text-white"
                          }`}
                        >
                          {item.available ? "In Stock" : "Sold Out"}
                        </span>
                      </div>
                    </div>

                    {/* Dish Details */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white truncate">
                          {item.name}
                        </h3>
                        <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-500 dark:text-amber-400">
                          <Star size={12} fill="#f59e0b" /> 4.9
                        </span>
                      </div>

                      <div className="flex items-baseline justify-between pt-1">
                        <span className="font-mono font-black text-base text-rose-600 dark:text-rose-400">
                          {formatMoney(item.price)}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Standard plate</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="px-4 pb-4 pt-2.5 border-t border-black/5 dark:border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleAvailable(item.id)}
                      title={item.available ? "Click to mark sold out" : "Click to mark available"}
                      className={`text-[11px] font-bold px-2.5 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                        item.available
                          ? "bg-black/5 dark:bg-white/10 text-slate-700 dark:text-slate-300 border-black/10 dark:border-white/15 hover:bg-rose-500/15 hover:text-rose-600 dark:hover:text-rose-300 hover:border-rose-500/40"
                          : "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30"
                      }`}
                    >
                      {item.available ? "Mark Sold Out" : "Mark Available"}
                    </button>

                    <button
                      onClick={() => {
                        addToCart(item);
                        setShowNewOrder(true);
                      }}
                      disabled={!item.available}
                      className="flex-1 py-1.5 px-3 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-bold text-xs shadow-md shadow-rose-950/50 hover:from-rose-500 hover:to-red-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-1 cursor-pointer border border-rose-400/30"
                    >
                      <Plus size={13} />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Special Offer Promotional Banner (Inspired by Screenshot Concept) */}
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950 text-white relative overflow-hidden shadow-xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="relative z-10 space-y-2 text-center md:text-left">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 px-2.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/30">
                  Kitchen Dispatch Guarantee
                </span>
                <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
                  Flat 20% OFF Catering & Large Orders
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                  Automate bulk event tickets, small chops platters, and custom party packs directly via WhatsApp dispatch.
                </p>
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                  <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 font-mono text-xs font-bold text-amber-300">
                    Use Code: CHOPEASY20
                  </div>
                  <button
                    onClick={() => setShowNewOrder(true)}
                    className="px-5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs shadow-md hover:from-rose-700 hover:to-amber-600 transition-all cursor-pointer"
                  >
                    Take Customer Order →
                  </button>
                </div>
              </div>

              {/* Dish Visual */}
              <div className="w-48 sm:w-60 h-32 sm:h-36 rounded-2xl overflow-hidden shrink-0 border-2 border-white/20 shadow-2xl relative">
                <img
                  src="/images/dishes/small-chops.png"
                  alt="Platter"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS TAB */}
        {tab === "analytics" && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-white tracking-tight">
                Sales & Performance Analytics
              </h2>
              <p className="text-xs text-slate-400">Real-time revenue, order volume, and kitchen efficiency trends</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: "Today's Revenue",
                  value: formatMoney(analytics.todayRevenue),
                  sub: `${analytics.deliveredCount} delivered orders`,
                  color: "#e11d48",
                  icon: <DollarSign size={20} />,
                },
                {
                  label: "Active In-Kitchen",
                  value: String(analytics.activeOrders),
                  sub: "Orders currently cooking",
                  color: "#f59e0b",
                  icon: <Clock size={20} />,
                },
                {
                  label: "Average Order Value",
                  value: formatMoney(analytics.avgOrder),
                  sub: "Per completed checkout",
                  color: "#10b981",
                  icon: <TrendingUp size={20} />,
                },
                {
                  label: "Available Menu Items",
                  value: String(menu.filter((m) => m.available).length),
                  sub: `Out of ${menu.length} total dishes`,
                  color: "#a855f7",
                  icon: <Package size={20} />,
                },
              ].map((stat) => (
                <div key={stat.label} className="glass-card-dark rounded-3xl p-5 relative overflow-hidden border border-white/10 shadow-2xl text-white">
                  <div
                    className="w-10 h-10 rounded-2xl mb-3 flex items-center justify-center border border-white/10 shadow-xs"
                    style={{ backgroundColor: stat.color + "22", color: stat.color }}
                  >
                    {stat.icon}
                  </div>
                  <p className="font-display font-black text-2xl sm:text-3xl text-white leading-none">
                    {stat.value}
                  </p>
                  <p className="text-xs font-bold text-slate-300 mt-2">{stat.label}</p>
                  <p className="text-[11px] text-slate-400">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Interactive Sales & Performance Growth Bar Chart */}
            <AnalyticsBarChart
              currencyCode={kitchenSettings.currency}
              formatMoney={formatMoney}
              dailyTarget={kitchenSettings.dailyRevenueTarget}
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="glass-card-dark rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-2xl text-slate-900 dark:text-white">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={18} className="text-amber-400 fill-amber-400" />
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    Top Selling Dishes
                  </h3>
                </div>

                {analytics.topSorted.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400 py-4">No completed orders yet.</p>
                ) : (
                  <div className="space-y-4">
                    {analytics.topSorted.map(([name, qty], idx) => {
                      const maxQty = analytics.topSorted[0]?.[1] ?? 1;
                      return (
                        <div key={name}>
                          <div className="flex justify-between text-xs mb-1.5">
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {idx + 1}. {name}
                            </span>
                            <span className="font-mono font-bold text-rose-600 dark:text-rose-400">{qty} sold</span>
                          </div>
                          <div className="h-2.5 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 transition-all duration-500"
                              style={{ width: `${(qty / maxQty) * 100}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="glass-card-dark rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-2xl text-slate-900 dark:text-white flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={18} className="text-rose-500 dark:text-rose-400" />
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                      Orders by Intake Channel
                    </h3>
                  </div>

                  <div className="space-y-3.5">
                    {[
                      { key: "walkin", label: "Walk-in Counter", color: "#e11d48", icon: <Footprints size={14} /> },
                      { key: "whatsapp", label: "WhatsApp Direct", color: "#10b981", icon: <MessageCircle size={14} /> },
                      { key: "call", label: "Phone Call Orders", color: "#f59e0b", icon: <Phone size={14} /> },
                    ].map((ch) => {
                      const count = analytics.byChannel[ch.key as keyof typeof analytics.byChannel];
                      const total = orders.length || 1;
                      const pct = Math.round((count / total) * 100);
                      return (
                        <div key={ch.key}>
                          <div className="flex justify-between items-center text-xs mb-1">
                            <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                              {ch.icon} {ch.label}
                            </span>
                            <span className="text-slate-500 dark:text-slate-400 font-mono">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="h-2 rounded-full bg-black/5 dark:bg-white/10 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${pct}%`, backgroundColor: ch.color }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-5 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  💡 <span className="font-bold">Pro Growth Tip:</span> High-volume food vendors report 65% of repeat orders originate from WhatsApp. Share your live ChopEasy catalog link in your profile bio!
                </div>
              </div>
            </div>

            {/* Pipeline revenue breakdown */}
            <div className="glass-card-dark rounded-3xl p-6 border border-black/5 dark:border-white/10 shadow-2xl text-slate-900 dark:text-white">
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-4">
                Pipeline Value Breakdown
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {(["pending", "preparing", "ready", "delivered"] as OrderStatus[]).map((s) => {
                  const cfg = STATUS_CFG[s];
                  const rev = orders
                    .filter((o) => o.status === s)
                    .reduce((a, o) => a + o.total, 0);

                  return (
                    <div
                      key={s}
                      className="p-4 rounded-2xl border text-center transition-all hover:scale-[1.02]"
                      style={{
                        backgroundColor: cfg.bg,
                        borderColor: cfg.border,
                      }}
                    >
                      <p className="font-display font-black text-xl" style={{ color: cfg.color }}>
                        {formatMoney(rev)}
                      </p>
                      <p className="text-xs font-bold mt-1 capitalize" style={{ color: cfg.color }}>
                        {cfg.label}
                      </p>
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
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-white/95 dark:bg-[#0c0d12]/95 text-slate-900 dark:text-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-h-[92vh] flex flex-col border border-slate-200/80 dark:border-white/10 shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10 flex-shrink-0">
              <div>
                <h3 className="font-display font-bold text-2xl text-slate-900 dark:text-white">New Order</h3>
                <p className="text-xs text-rose-500 dark:text-rose-400 font-mono font-bold">{orderNo}</p>
              </div>
              <button
                onClick={() => setShowNewOrder(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 space-y-4 py-4 pr-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    value={orderForm.customerName}
                    onChange={(e) => setOrderForm((f) => ({ ...f, customerName: e.target.value }))}
                    placeholder="e.g. Tunde Badmus"
                    className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={orderForm.customerPhone}
                    onChange={(e) => setOrderForm((f) => ({ ...f, customerPhone: e.target.value }))}
                    placeholder="080XXXXXXXX"
                    className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
                  Intake Channel
                </label>
                <div className="flex gap-2">
                  {[
                    ["walkin", "🚶 Walk-in"],
                    ["whatsapp", "💬 WhatsApp"],
                    ["call", "📞 Phone Call"],
                  ].map(([ch, lbl]) => (
                    <button
                      key={ch}
                      type="button"
                      onClick={() => setOrderForm((f) => ({ ...f, channel: ch as Order["channel"] }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        orderForm.channel === ch
                          ? "bg-gradient-to-r from-rose-600 to-red-700 text-white border-rose-400/40 shadow-md"
                          : "border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.05]"
                      }`}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2 block">
                  Select Menu Items
                </label>
                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {menu
                    .filter((m) => m.available)
                    .map((item) => {
                      const inCart = orderForm.cart.find((c) => c.menuItemId === item.id);
                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/10"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {item.image ? (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-9 h-9 object-cover rounded-lg shrink-0 border border-slate-200 dark:border-white/10 shadow-2xs"
                              />
                            ) : (
                              <span className="text-xl">{item.emoji}</span>
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{item.name}</p>
                              <p className="font-mono text-xs text-rose-600 dark:text-rose-400 font-bold">
                                {formatMoney(item.price)}
                              </p>
                            </div>
                          </div>

                          {inCart ? (
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  if (inCart.qty === 1) removeFromCart(item.id);
                                  else changeQty(item.id, -1);
                                }}
                                className="w-7 h-7 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20 text-slate-800 dark:text-white font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                              >
                                −
                              </button>
                              <span className="font-mono font-bold text-xs w-4 text-center text-slate-900 dark:text-white">
                                {inCart.qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => changeQty(item.id, 1)}
                                className="w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm flex items-center justify-center transition-colors cursor-pointer"
                              >
                                +
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => addToCart(item)}
                              className="w-7 h-7 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                            >
                              <Plus size={14} />
                            </button>
                          )}
                        </div>
                      );
                    })}
                </div>
              </div>

              {orderForm.cart.length > 0 && (
                <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4">
                  <p className="text-[10px] font-bold text-amber-600 dark:text-amber-300 uppercase tracking-wider mb-2">
                    Order Summary
                  </p>
                  <div className="space-y-1.5 divide-y divide-amber-500/20">
                    {orderForm.cart.map((c) => (
                      <div key={c.menuItemId} className="flex justify-between text-xs pt-1 text-slate-700 dark:text-slate-200">
                        <span>
                          {c.qty}× {c.name}
                        </span>
                        <span className="font-mono font-bold text-rose-600 dark:text-rose-400">
                          {formatMoney(c.qty * c.unitPrice)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center font-extrabold text-sm pt-2.5 mt-2 border-t border-amber-500/20 text-slate-900 dark:text-white">
                    <span>Total Bill:</span>
                    <span className="font-mono text-base text-rose-600 dark:text-rose-400">{formatMoney(cartTotal)}</span>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
                  Kitchen Notes & Instructions
                </label>
                <input
                  type="text"
                  value={orderForm.note}
                  onChange={(e) => setOrderForm((f) => ({ ...f, note: e.target.value }))}
                  placeholder="e.g. Extra pepper, separate soup bag, dispatch call..."
                  className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 flex-shrink-0">
              <button
                onClick={placeOrder}
                disabled={!orderForm.customerName || orderForm.cart.length === 0}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white font-bold text-sm shadow-xl shadow-rose-950/60 hover:from-rose-500 hover:to-red-600 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-95 transition-all duration-300 cursor-pointer border border-rose-400/30"
              >
                {orderForm.cart.length === 0
                  ? "Select items to place order"
                  : `Confirm Order · ${formatMoney(cartTotal)}`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD MENU ITEM MODAL ── */}
      {showNewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
          <div className="bg-white/95 dark:bg-[#0c0d12]/95 text-slate-900 dark:text-white rounded-3xl p-6 w-full max-w-sm border border-slate-200/80 dark:border-white/10 shadow-2xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80 dark:border-white/10">
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">Add Menu Item</h3>
              <button
                onClick={() => setShowNewItem(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-800 dark:hover:text-white cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3.5">
              <div className="grid grid-cols-3 gap-2.5">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
                    Item Name *
                  </label>
                  <input
                    type="text"
                    value={itemForm.name}
                    onChange={(e) => setItemForm((f) => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Asun Goat Meat"
                    className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
                    Emoji
                  </label>
                  <input
                    type="text"
                    value={itemForm.emoji}
                    onChange={(e) => setItemForm((f) => ({ ...f, emoji: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl py-1 text-center text-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
                  Category
                </label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(Object.entries(CATEGORY_META) as [Category, typeof CATEGORY_META[Category]][]).map(
                    ([cat, meta]) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setItemForm((f) => ({ ...f, category: cat }))}
                        className="py-1.5 rounded-xl text-xs font-bold border transition-all capitalize cursor-pointer"
                        style={
                          itemForm.category === cat
                            ? { backgroundColor: meta.bg, color: meta.color, borderColor: meta.color }
                            : { borderColor: "rgba(148, 163, 184, 0.3)", color: "#64748b" }
                        }
                      >
                        {meta.label}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
                  Price ({currencySymbol}) *
                </label>
                <input
                  type="number"
                  value={itemForm.price}
                  onChange={(e) => setItemForm((f) => ({ ...f, price: e.target.value }))}
                  placeholder="e.g. 1500"
                  className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                />
              </div>

              <button
                onClick={addMenuItem}
                disabled={!itemForm.name || !itemForm.price}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white font-bold text-xs shadow-xl shadow-rose-950/60 hover:from-rose-500 hover:to-red-600 disabled:opacity-40 transition-all cursor-pointer border border-rose-400/30"
              >
                Add to Kitchen Menu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SETTINGS & EDIT PROFILE MODAL ── */}
      {currentUser && (
        <SettingsModal
          isOpen={showSettingsModal}
          onClose={() => setShowSettingsModal(false)}
          user={currentUser}
          settings={kitchenSettings}
          onSave={(updatedUser, updatedSettings) => {
            setCurrentUser(updatedUser);
            setKitchenSettings(updatedSettings);
          }}
        />
      )}

      {/* ── AUTH MODAL ── */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authInitialMode}
        onSuccess={(user) => {
          setCurrentUser(user);
          setCurrentView("dashboard");
        }}
      />

      {/* ── TERMS MODAL ── */}
      <TermsModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />

      {/* ── FOOTER ── */}
      <footer className="mt-auto border-t border-slate-200/60 bg-white/60 backdrop-blur-md py-4 px-4 sm:px-6">
        <div className="w-full px-2 sm:px-4 lg:px-6 xl:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-800">ChopEasy OS</span>
            <span>·</span>
            <span>Live Kitchen Gateway</span>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentView("home")} className="hover:text-rose-600 transition-colors">
              Homepage
            </button>
            <span>·</span>
            <button onClick={() => setShowTermsModal(true)} className="hover:text-rose-600 transition-colors">
              Terms of Use
            </button>
            <span>·</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Kitchen Gateway Active
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
