"use client";

import React, { useState } from "react";
import {
  X, User, Store, Mail, Phone, MapPin, Bell,
  DollarSign, Shield, Check, Lock, Sliders, Sparkles
} from "lucide-react";
import { UserSession } from "./AuthModal";

export interface KitchenSettings {
  currency: string;
  soundAlerts: boolean;
  autoWhatsAppNotify: boolean;
  dailyRevenueTarget: number;
  location: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserSession;
  settings: KitchenSettings;
  onSave: (updatedUser: UserSession, updatedSettings: KitchenSettings) => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  user,
  settings,
  onSave,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "kitchen" | "security">("profile");

  // Profile fields
  const [name, setName] = useState(user.name);
  const [businessName, setBusinessName] = useState(user.businessName);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [location, setLocation] = useState(settings.location || "Lekki Phase 1, Lagos");

  // Kitchen preferences
  const [currency, setCurrency] = useState(settings.currency || "NGN");
  const [soundAlerts, setSoundAlerts] = useState(settings.soundAlerts);
  const [autoWhatsApp, setAutoWhatsApp] = useState(settings.autoWhatsAppNotify);
  const [dailyTarget, setDailyTarget] = useState(settings.dailyRevenueTarget || 100000);

  // Security password change fields
  const [currentPwd, setCurrentPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (activeTab === "security" && newPwd) {
      if (newPwd.length < 8) {
        setErrorMsg("New password must be at least 8 characters long.");
        return;
      }
      if (newPwd !== confirmPwd) {
        setErrorMsg("New passwords do not match.");
        return;
      }
    }

    onSave(
      {
        ...user,
        name,
        businessName,
        email,
        phone,
      },
      {
        currency,
        soundAlerts,
        autoWhatsAppNotify: autoWhatsApp,
        dailyRevenueTarget: Number(dailyTarget),
        location,
      }
    );

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-rose-100 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 via-white to-amber-50/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 font-bold">
              {name.charAt(0)}
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 leading-tight">
                Profile & Kitchen Settings
              </h3>
              <p className="text-xs text-slate-500">{businessName} · Management Panel</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 px-6 pt-2 bg-slate-50/60 gap-4">
          {[
            { id: "profile", label: "Vendor Profile", icon: <User size={15} /> },
            { id: "kitchen", label: "Kitchen Operations", icon: <Sliders size={15} /> },
            { id: "security", label: "Security & Access", icon: <Shield size={15} /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                setErrorMsg(null);
              }}
              className={`flex items-center gap-2 py-3 text-xs font-bold border-b-2 transition-all ${
                activeTab === tab.id
                  ? "border-rose-600 text-rose-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
              <Check size={16} className="text-emerald-600" />
              Settings updated successfully!
            </div>
          )}

          {/* TAB 1: Profile */}
          {activeTab === "profile" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Restaurant / Brand Name
                  </label>
                  <div className="relative">
                    <Store size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Phone Number (WhatsApp)
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  Kitchen Location / Pickup Base
                </label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Admiralty Way, Lekki Phase 1, Lagos"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Kitchen Preferences */}
          {activeTab === "kitchen" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Operating Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all font-medium"
                  >
                    <option value="NGN">₦ Nigerian Naira (NGN)</option>
                    <option value="USD">$ US Dollar (USD)</option>
                    <option value="EUR">€ European Euro (EUR)</option>
                    <option value="GBP">£ British Pound (GBP)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Daily Sales Target ({currency === "USD" ? "$" : currency === "EUR" ? "€" : currency === "GBP" ? "£" : "₦"})
                  </label>
                  <input
                    type="number"
                    value={dailyTarget}
                    onChange={(e) => setDailyTarget(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-mono text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <Bell size={18} className="text-amber-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Sound Alert on New Orders</p>
                      <p className="text-[11px] text-slate-500">Chime speaker when a new customer order drops</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundAlerts}
                    onChange={(e) => setSoundAlerts(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                </div>

                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <Phone size={18} className="text-emerald-600" />
                    <div>
                      <p className="text-xs font-bold text-slate-800">Auto-prompt WhatsApp Dispatch</p>
                      <p className="text-[11px] text-slate-500">Provide 1-click customer chat when food is marked ready</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoWhatsApp}
                    onChange={(e) => setAutoWhatsApp(e.target.checked)}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Security */}
          {activeTab === "security" && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  Current Password
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type="password"
                    value={currentPwd}
                    onChange={(e) => setCurrentPwd(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    placeholder="Min 8 characters"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPwd}
                    onChange={(e) => setConfirmPwd(e.target.value)}
                    placeholder="Re-type new password"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                  />
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                🔒 Keep your password unique to protect daily food revenue and customer numbers.
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-xs shadow-md shadow-rose-500/20 hover:from-rose-700 hover:to-amber-600 transition-all"
            >
              <Check size={14} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

