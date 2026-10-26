"use client";

import React from "react";
import { X, Check, FileText, AlertCircle } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#0c0d12]/95 text-slate-900 dark:text-white rounded-3xl shadow-2xl border border-black/10 dark:border-white/10 flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-black/5 dark:border-white/10 flex items-center justify-between bg-black/[0.02] dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-700 flex items-center justify-center text-white shadow-md shadow-rose-950/60 border border-rose-400/30">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white leading-tight">
                Terms and Conditions of Use
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">ChopEasy Vendor Agreement · Last updated November 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed font-medium">
              Please read these terms carefully before registering your food vendor account. By checking "I agree" and creating an account, you enter into a binding agreement with ChopEasy.
            </p>
          </div>

          <section className="space-y-2">
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-center font-bold border border-rose-500/30">1</span>
              Acceptance & Platform Scope
            </h4>
            <p>
              ChopEasy provides cloud-based vendor management, point-of-sale order intake, real-time kitchen tracking, and business analytics specifically crafted for restaurants, cloud kitchens, caterers, and food merchants across Nigeria and international territories.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-center font-bold border border-rose-500/30">2</span>
              Vendor Account & Credentials
            </h4>
            <p>
              Vendors must provide accurate, verifiable contact information including phone numbers and business identities. You are exclusively responsible for safeguarding your password, PIN codes, and kitchen staff access. All orders placed or modified under your credentials are deemed authorized by your kitchen.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-center font-bold border border-rose-500/30">3</span>
              Food Safety & Culinary Standards
            </h4>
            <p>
              As a merchant on ChopEasy, you warrant that all meals, swallows, soups, and beverages meet strict food health and hygiene regulations. ChopEasy is not liable for meal preparation errors, allergen misdeclarations, or third-party delivery delays outside platform dispatch logs.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-center font-bold border border-rose-500/30">4</span>
              Zero Commission & Direct Payments
            </h4>
            <p>
              Unlike conventional aggregators that deduct hefty percentages per order, ChopEasy charges zero commission on sales. Direct bank payouts, WhatsApp payments, and POS collections are handled straight between you and your customers.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-center font-bold border border-rose-500/30">5</span>
              Customer Communications & Privacy
            </h4>
            <p>
              Customer contact information gathered via walk-in, WhatsApp, or phone orders must be used strictly for order fulfillment, dispatch verification, and customer service. You may not spam or sell customer databases.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-display font-bold text-slate-900 dark:text-white text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-500/20 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-center font-bold border border-rose-500/30">6</span>
              Modifications to Service
            </h4>
            <p>
              ChopEasy reserves the right to enhance features, perform security maintenance, or update platform algorithms to ensure uninterrupted 99.9% uptime for busy kitchen hours.
            </p>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-black/5 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl glass-btn text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            Close
          </button>
          
          {onAccept ? (
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white font-bold text-sm shadow-xl shadow-rose-950/60 hover:from-rose-500 hover:to-red-600 border border-rose-400/30 transition-all cursor-pointer active:scale-95"
            >
              <Check size={16} /> I Agree & Accept
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-700 text-white font-bold text-sm hover:from-rose-500 hover:to-red-600 border border-rose-400/30 transition-colors cursor-pointer"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
