"use client";

import React, { useState, useMemo } from "react";
import {
  X, Mail, Lock, User, Phone, Store, Eye, EyeOff,
  CheckCircle2, AlertCircle, ArrowRight, ShieldCheck,
  RefreshCw, KeyRound, Sparkles, Check, ArrowLeft
} from "lucide-react";
import ChopEasyLogo, { ChopEasyLogoIcon } from "./ChopEasyLogo";
import SteamingFoodPlate from "./SteamingFoodPlate";
import TermsModal from "./TermsModal";

export interface UserSession {
  name: string;
  email: string;
  businessName: string;
  phone: string;
  role: "vendor_owner" | "kitchen_manager" | "staff";
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: "login" | "register" | "forgot";
  onSuccess: (user: UserSession) => void;
}

export default function AuthModal({
  isOpen,
  onClose,
  initialMode = "login",
  onSuccess,
}: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register" | "forgot">(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    identifier: "chefamara@chopeasy.ng",
    password: "Password@123",
    remember: true,
  });

  // Register form state
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    businessName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreedToTerms: false,
  });

  // Forgot password flow state
  const [forgotStep, setForgotStep] = useState<1 | 2 | 3>(1);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [timerCount, setTimerCount] = useState(45);

  // Form error message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Live password validation criteria calculation
  const validatePassword = (pwd: string) => {
    return {
      hasMinLen: pwd.length >= 8,
      hasUpper: /[A-Z]/.test(pwd),
      hasLower: /[a-z]/.test(pwd),
      hasNumber: /[0-9]/.test(pwd),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(pwd),
    };
  };

  const registerPasswordRules = useMemo(
    () => validatePassword(registerForm.password),
    [registerForm.password]
  );

  const newPasswordRules = useMemo(
    () => validatePassword(newPassword),
    [newPassword]
  );

  const calculateStrength = (rules: ReturnType<typeof validatePassword>, pwd: string) => {
    if (!pwd) return { score: 0, label: "Enter password", color: "bg-slate-200" };
    const passed = Object.values(rules).filter(Boolean).length;
    if (passed <= 2) return { score: 25, label: "Weak", color: "bg-rose-500" };
    if (passed === 3) return { score: 50, label: "Fair", color: "bg-amber-500" };
    if (passed === 4) return { score: 75, label: "Good", color: "bg-blue-500" };
    return { score: 100, label: "Strong & Secure", color: "bg-emerald-500" };
  };

  const isRegisterPasswordValid = Object.values(registerPasswordRules).every(Boolean);
  const isNewPasswordValid = Object.values(newPasswordRules).every(Boolean);

  // Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!loginForm.identifier || !loginForm.password) {
      setErrorMessage("Please enter both your email/phone and password.");
      return;
    }

    // Successful mock authentication
    const vendorUser: UserSession = {
      name: loginForm.identifier.includes("amara") ? "Chef Amara Nwosu" : "Vendor Manager",
      email: loginForm.identifier,
      businessName: "Amara's Kitchen & Grills",
      phone: "0803 123 4567",
      role: "vendor_owner",
    };
    onSuccess(vendorUser);
    onClose();
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!registerForm.fullName || !registerForm.businessName || !registerForm.email) {
      setErrorMessage("Please fill in all required vendor credentials.");
      return;
    }

    if (!isRegisterPasswordValid) {
      setErrorMessage("Your password must meet all 5 security criteria below.");
      return;
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setErrorMessage("Passwords do not match. Please verify.");
      return;
    }

    if (!registerForm.agreedToTerms) {
      setErrorMessage("You must accept the ChopEasy Terms of Service to create an account.");
      return;
    }

    const newUser: UserSession = {
      name: registerForm.fullName,
      email: registerForm.email,
      businessName: registerForm.businessName,
      phone: registerForm.phone || "0800 000 0000",
      role: "vendor_owner",
    };

    onSuccess(newUser);
    onClose();
  };

  const handleForgotStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }
    setErrorMessage(null);
    setForgotStep(2);
  };

  const handleOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...otpCode];
    updated[index] = val;
    setOtpCode(updated);

    // Auto advance focus
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleForgotStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join("");
    if (code.length < 6) {
      setErrorMessage("Please enter the complete 6-digit OTP code sent to your email.");
      return;
    }
    setErrorMessage(null);
    setForgotStep(3);
  };

  const handleForgotStep3 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNewPasswordValid) {
      setErrorMessage("The new password must satisfy all security requirements.");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setErrorMessage("The new passwords do not match.");
      return;
    }
    setErrorMessage(null);
    setForgotSuccess(true);
    setTimeout(() => {
      setMode("login");
      setForgotStep(1);
      setForgotSuccess(false);
      setLoginForm((prev) => ({ ...prev, password: newPassword }));
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-rose-100 flex flex-col md:flex-row overflow-hidden max-h-[92vh]">
        {/* Left Side: Sizzling Food Plate with Animated Smoke & Brand Story */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-slate-950 via-slate-900 to-rose-950 p-8 flex-col justify-between relative overflow-hidden text-white">
          <div className="absolute inset-0 z-0 pointer-events-auto opacity-75">
            <SteamingFoodPlate interactive={true} showBadges={false} className="w-full h-full" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/40 to-slate-950/70 pointer-events-none z-10" />

          {/* Top brand header */}
          <div className="relative z-20">
            <ChopEasyLogo size="sm" dark={true} />
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-amber-300 font-medium">
              <Sparkles size={13} className="text-amber-400" />
              <span>Sizzling Kitchen Network</span>
            </div>
          </div>

          {/* Bottom content */}
          <div className="relative z-20 space-y-3">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white leading-snug">
              Smart kitchen management, built for winners.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Track live walk-in, WhatsApp and phone orders. Update menu availability on the fly, and view instant revenue analytics.
            </p>
            <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" /> 99.9% Uptime
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-amber-400" /> Bank-grade Security
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col overflow-y-auto bg-white relative">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20"
          >
            <X size={20} />
          </button>

          {/* Mobile Logo Header */}
          <div className="md:hidden mb-4">
            <ChopEasyLogo size="sm" />
          </div>

          {/* Top Mode Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMode("login");
                  setErrorMessage(null);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  mode === "login"
                    ? "bg-rose-50 text-rose-600 shadow-sm shadow-rose-500/10"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode("register");
                  setErrorMessage(null);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  mode === "register"
                    ? "bg-rose-50 text-rose-600 shadow-sm shadow-rose-500/10"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                Create Account
              </button>
            </div>

            {mode === "forgot" && (
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg">
                Reset Password
              </span>
            )}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-50 border border-rose-200/80 flex items-start gap-2.5 text-rose-700 text-xs">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login form */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={loginForm.identifier}
                    onChange={(e) => setLoginForm({ ...loginForm, identifier: e.target.value })}
                    placeholder="e.g. chef@amarakitchen.ng or 080..."
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setForgotStep(1);
                      setErrorMessage(null);
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-2xl pl-10 pr-11 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 p-0.5"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={loginForm.remember}
                    onChange={(e) => setLoginForm({ ...loginForm, remember: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                  />
                  <span>Stay logged in for 30 days</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:from-rose-700 hover:to-amber-600 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                Sign In to Kitchen Dashboard <ArrowRight size={16} />
              </button>

              {/* Demo quick switch */}
              <div className="pt-3 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 mb-2">Need a quick test login?</p>
                <button
                  type="button"
                  onClick={() => {
                    setLoginForm({
                      identifier: "chefamara@chopeasy.ng",
                      password: "Password@123",
                      remember: true,
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                >
                  <Sparkles size={13} className="text-amber-500" />
                  Auto-fill Demo Vendor Credentials
                </button>
              </div>
            </form>
          )}

          {/* Register form */}
          {mode === "register" && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={registerForm.fullName}
                      onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                      placeholder="Chef Amara Nwosu"
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Restaurant / Brand Name *
                  </label>
                  <div className="relative">
                    <Store size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={registerForm.businessName}
                      onChange={(e) => setRegisterForm({ ...registerForm, businessName: e.target.value })}
                      placeholder="Amara's Kitchen Lekki"
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      placeholder="vendor@kitchen.ng"
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                    Phone Number (WhatsApp) *
                  </label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                      placeholder="0803 000 0000"
                      className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password Input with Live Criteria Validation */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  Password *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    placeholder="Create a strong password"
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {registerForm.password && (
                  <div className="mt-2 space-y-1">
                    {(() => {
                      const strength = calculateStrength(registerPasswordRules, registerForm.password);
                      return (
                        <>
                          <div className="flex justify-between items-center text-[10px]">
                            <span className="text-slate-500">Security Strength:</span>
                            <span className="font-bold text-slate-700">{strength.label}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${strength.color} transition-all duration-300`}
                              style={{ width: `${strength.score}%` }}
                            />
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* Live Character & Requirements Validation Checklist */}
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Password Security Criteria:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          registerPasswordRules.hasMinLen
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={registerPasswordRules.hasMinLen ? "text-emerald-700 font-semibold" : "text-slate-500"}>
                        8+ characters
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          registerPasswordRules.hasUpper
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={registerPasswordRules.hasUpper ? "text-emerald-700 font-semibold" : "text-slate-500"}>
                        Uppercase (A-Z)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          registerPasswordRules.hasLower
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={registerPasswordRules.hasLower ? "text-emerald-700 font-semibold" : "text-slate-500"}>
                        Lowercase (a-z)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          registerPasswordRules.hasNumber
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={registerPasswordRules.hasNumber ? "text-emerald-700 font-semibold" : "text-slate-500"}>
                        Number (0-9)
                      </span>
                    </div>

                    <div className="col-span-2 flex items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          registerPasswordRules.hasSpecial
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 text-slate-400"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={registerPasswordRules.hasSpecial ? "text-emerald-700 font-semibold" : "text-slate-500"}>
                        Special character (@, $, !, %, *, #, etc.)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    placeholder="Re-type password"
                    className="w-full bg-slate-50/70 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {registerForm.confirmPassword && (
                  <p className="text-[11px] mt-1 font-medium">
                    {registerForm.password === registerForm.confirmPassword ? (
                      <span className="text-emerald-600 flex items-center gap-1">
                        <Check size={12} /> Passwords match perfectly
                      </span>
                    ) : (
                      <span className="text-rose-500">Passwords do not match yet</span>
                    )}
                  </p>
                )}
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-600 select-none">
                  <input
                    type="checkbox"
                    required
                    checked={registerForm.agreedToTerms}
                    onChange={(e) => setRegisterForm({ ...registerForm, agreedToTerms: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-rose-600 focus:ring-rose-500 border-slate-300"
                  />
                  <span>
                    I have read and agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="font-bold text-rose-600 hover:underline"
                    >
                      Terms and Conditions of Use
                    </button>{" "}
                    and Privacy Policy.
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isRegisterPasswordValid || !registerForm.agreedToTerms}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:from-rose-700 hover:to-amber-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                Create Vendor Account & Get Started <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Password recovery flow */}
          {mode === "forgot" && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setErrorMessage(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </button>
                <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                  <span>Step {forgotStep} of 3</span>
                </div>
              </div>

              {forgotSuccess ? (
                <div className="p-6 text-center space-y-3 bg-emerald-50 rounded-2xl border border-emerald-200">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/25">
                    <Check size={24} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-emerald-950">
                    Password Reset Successfully!
                  </h3>
                  <p className="text-xs text-emerald-700">
                    Your password has been updated. Redirecting you to sign in...
                  </p>
                </div>
              ) : (
                <>
                  {/* Step 1: Request Reset Code */}
                  {forgotStep === 1 && (
                    <form onSubmit={handleForgotStep1} className="space-y-4">
                      <div>
                        <h3 className="font-display font-bold text-xl text-slate-900">
                          Reset Your Password
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Enter your registered email address. We will send a 6-digit verification code to reset your account credentials.
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 block">
                          Registered Email Address *
                        </label>
                        <div className="relative">
                          <Mail size={17} className="absolute left-3.5 top-3.5 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="chefamara@chopeasy.ng"
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:from-rose-700 hover:to-amber-600 transition-all flex items-center justify-center gap-2"
                      >
                        Send Verification Code <ArrowRight size={16} />
                      </button>
                    </form>
                  )}

                  {/* Step 2: 6-digit OTP Code Input */}
                  {forgotStep === 2 && (
                    <form onSubmit={handleForgotStep2} className="space-y-4">
                      <div>
                        <h3 className="font-display font-bold text-xl text-slate-900">
                          Enter Verification Code
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          We sent a 6-digit code to{" "}
                          <span className="font-bold text-slate-800">{forgotEmail}</span>. Enter it below to verify.
                        </p>
                      </div>

                      <div className="flex justify-between gap-2">
                        {otpCode.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-input-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            className="w-12 h-14 text-center font-mono font-bold text-xl bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>Didn't receive code?</span>
                        <button
                          type="button"
                          onClick={() => setOtpCode(["4", "8", "2", "9", "1", "6"])}
                          className="font-bold text-rose-600 hover:underline"
                        >
                          Auto-fill Demo Code (482916)
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:from-rose-700 hover:to-amber-600 transition-all flex items-center justify-center gap-2"
                      >
                        Verify & Proceed <ArrowRight size={16} />
                      </button>
                    </form>
                  )}

                  {/* Step 3: Enter New Password with full validation */}
                  {forgotStep === 3 && (
                    <form onSubmit={handleForgotStep3} className="space-y-4">
                      <div>
                        <h3 className="font-display font-bold text-xl text-slate-900">
                          Set New Password
                        </h3>
                        <p className="text-xs text-slate-500 mt-1">
                          Ensure your new password meets all security rules to protect your kitchen orders.
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                          New Password *
                        </label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter new password"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        {/* Live Criteria Checklist */}
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 grid grid-cols-2 gap-1 text-[10px]">
                          <span className={newPasswordRules.hasMinLen ? "text-emerald-700 font-bold" : "text-slate-400"}>
                            ✓ 8+ chars
                          </span>
                          <span className={newPasswordRules.hasUpper ? "text-emerald-700 font-bold" : "text-slate-400"}>
                            ✓ Uppercase (A-Z)
                          </span>
                          <span className={newPasswordRules.hasLower ? "text-emerald-700 font-bold" : "text-slate-400"}>
                            ✓ Lowercase (a-z)
                          </span>
                          <span className={newPasswordRules.hasNumber ? "text-emerald-700 font-bold" : "text-slate-400"}>
                            ✓ Number (0-9)
                          </span>
                          <span className={`col-span-2 ${newPasswordRules.hasSpecial ? "text-emerald-700 font-bold" : "text-slate-400"}`}>
                            ✓ Special char (@, $, !, %, *, #)
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">
                          Confirm New Password *
                        </label>
                        <div className="relative">
                          <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            placeholder="Re-enter new password"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 focus:bg-white focus:outline-none focus:border-rose-500 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!isNewPasswordValid || newPassword !== confirmNewPassword}
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-bold text-sm shadow-lg shadow-rose-500/25 hover:from-rose-700 hover:to-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                      >
                        Save New Password & Sign In <Check size={16} />
                      </button>
                    </form>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Terms and Conditions Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => setRegisterForm((prev) => ({ ...prev, agreedToTerms: true }))}
      />
    </div>
  );
}

