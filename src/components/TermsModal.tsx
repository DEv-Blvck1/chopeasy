"use client";

import React from "react";
import { X, ShieldCheck, Check, FileText, ChevronRight, Lock, ChefHat, AlertCircle } from "lucide-react";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
}

export default function TermsModal({ isOpen, onClose, onAccept }: TermsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-amber-100 flex flex-col max-h-[88vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/60 via-rose-50/40 to-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-display font-bold text-xl text-slate-900 leading-tight">
                Terms and Conditions of Use
              </h3>
              <p className="text-xs text-slate-500">ChopEasy Vendor Agreement · Last updated November 2026</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Terms Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm text-slate-600 leading-relaxed">
          <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/60 flex items-start gap-3">
            <AlertCircle size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed font-medium">
              Please read these terms carefully before registering your food vendor account. By checking "I agree" and creating an account, you enter into a binding agreement with ChopEasy.
            </p>
          </div>

          <section className="space-y-2">
            <h4 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">1</span>
              Acceptance & Platform Scope
            </h4>
            <p>
              ChopEasy provides cloud-based vendor management, point-of-sale order intake, real-time kitchen tracking, and business analytics specifically crafted for restaurants, cloud kitchens, caterers, and food merchants across Nigeria and international territories.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">2</span>
              Vendor Account & Credentials
            </h4>
            <p>
              Vendors must provide accurate, verifiable contact information including phone numbers and business identities. You are exclusively responsible for safeguarding your password, PIN codes, and kitchen staff access. All orders placed or modified under your credentials are deemed authorized by your kitchen.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">3</span>
              Food Safety & Culinary Standards
            </h4>
            <p>
              As a merchant on ChopEasy, you warrant that all meals, swallows, soups, and beverages meet strict food health and hygiene regulations. ChopEasy is not liable for meal preparation errors, allergen misdeclarations, or third-party delivery delays outside platform dispatch logs.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">4</span>
              Pricing, Currency & Transactions
            </h4>
            <p>
              All menu prices are designated in Nigerian Naira (₦) unless explicitly configured otherwise. Vendors retain full discretion over menu pricing, discounts, and item availability toggles. ChopEasy does not deduct hidden charges from your direct cash or transfer orders.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">5</span>
              Customer Communications & Privacy
            </h4>
            <p>
              Customer contact information gathered via walk-in, WhatsApp, or phone orders must be used strictly for order fulfillment, dispatch verification, and customer service. You may not spam or sell customer databases.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-display font-bold text-slate-900 text-base flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-rose-100 text-rose-700 text-xs flex items-center justify-center font-bold">6</span>
              Modifications to Service
            </h4>
            <p>
              ChopEasy reserves the right to enhance features, perform security maintenance, or update platform algorithms to ensure uninterrupted 99.9% uptime for busy kitchen hours.
            </p>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-100 transition-colors"
          >
            Close
          </button>
          
          {onAccept ? (
            <button
              onClick={() => {
                onAccept();
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-sm shadow-md shadow-rose-500/25 hover:from-rose-700 hover:to-amber-600 transition-all"
            >
              <Check size={16} /> I Agree & Accept
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-colors"
            >
              Done
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

