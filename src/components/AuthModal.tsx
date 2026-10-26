"use client";

import React, { useState, useMemo, useEffect } from "react";
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

  // Registration OTP verification state
  const [registerStep, setRegisterStep] = useState<1 | 2>(1); // 1 = form, 2 = OTP
  const [registerOtpCode, setRegisterOtpCode] = useState(["", "", "", "", "", ""]);
  const [registerOtpTimer, setRegisterOtpTimer] = useState(60);

  // Form error message
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Countdown timer for registration OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (mode === "register" && registerStep === 2 && registerOtpTimer > 0) {
      timer = setInterval(() => {
        setRegisterOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, registerStep, registerOtpTimer]);

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
    if (!pwd) return { score: 0, label: "Enter password", color: "bg-slate-700" };
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
      businessName: "Amara's Kitchen Lekki",
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

    // Advance to OTP verification step
    setRegisterStep(2);
    setRegisterOtpTimer(60);
    setRegisterOtpCode(["", "", "", "", "", ""]);
  };

  const handleRegisterOtpChange = (index: number, val: string) => {
    if (val.length > 1) val = val.slice(-1);
    const updated = [...registerOtpCode];
    updated[index] = val;
    setRegisterOtpCode(updated);

    // Auto advance focus
    if (val && index < 5) {
      const nextInput = document.getElementById(`register-otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleRegisterOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !registerOtpCode[index] && index > 0) {
      const prevInput = document.getElementById(`register-otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleRegisterOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().slice(0, 6);
    if (!pasted) return;
    const digits = pasted.split("");
    const updated = [...registerOtpCode];
    for (let i = 0; i < 6; i++) {
      updated[i] = digits[i] || "";
    }
    setRegisterOtpCode(updated);
  };

  const handleRegisterOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = registerOtpCode.join("");
    if (code.length < 6) {
      setErrorMessage("Please enter the complete 6-digit OTP code sent to your email.");
      return;
    }
    setErrorMessage(null);

    const newUser: UserSession = {
      name: registerForm.fullName,
      email: registerForm.email,
      businessName: registerForm.businessName,
      phone: registerForm.phone || "0800 000 0000",
      role: "vendor_owner",
    };

    onSuccess(newUser);
    onClose();
    setRegisterStep(1);
    setRegisterOtpCode(["", "", "", "", "", ""]);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 dark:bg-black/80 backdrop-blur-xl animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white/95 dark:bg-[#0c0d12]/95 rounded-3xl shadow-2xl border border-slate-200/80 dark:border-white/10 flex flex-col md:flex-row overflow-hidden max-h-[92vh] text-slate-900 dark:text-white">
        {/* Left Side: Sizzling Food Plate with Red & Black Theme */}
        <div className="hidden md:flex md:w-5/12 bg-gradient-to-br from-[#060608] via-[#10070a] to-[#20050c] p-8 flex-col justify-between relative overflow-hidden text-white border-r border-white/10">
          <div className="absolute inset-0 z-0 pointer-events-auto opacity-75">
            <SteamingFoodPlate interactive={true} showBadges={false} className="w-full h-full" />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#060608]/95 via-[#060608]/50 to-[#060608]/75 pointer-events-none z-10" />

          {/* Top brand header */}
          <div className="relative z-20">
            <ChopEasyLogo size="sm" dark={true} />
            <div className="mt-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-rose-300 font-medium">
              <Sparkles size={13} className="text-rose-400" />
              <span>Sizzling Kitchen Network</span>
            </div>
          </div>

          {/* Bottom content */}
          <div className="relative z-20 space-y-3">
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight text-white leading-snug">
              Smart kitchen management, built for winners.
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Track live walk-in, WhatsApp, and phone orders. Update menu availability on the fly, and view instant revenue analytics.
            </p>
            <div className="pt-2 flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" /> 99.9% Uptime
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck size={13} className="text-rose-400" /> Bank-grade Security
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Forms */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col overflow-y-auto bg-white/95 dark:bg-[#0e0f17]/95 relative text-slate-900 dark:text-white">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors z-20"
          >
            <X size={20} />
          </button>

          {/* Mobile Logo Header */}
          <div className="md:hidden mb-4">
            <ChopEasyLogo size="sm" />
          </div>

          {/* Top Mode Tabs */}
          <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-white/10 pb-4 mb-5">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setMode("login");
                  setErrorMessage(null);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  mode === "login"
                    ? "bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-lg shadow-rose-950/60 border border-rose-400/40"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setMode("register");
                  setRegisterStep(1);
                  setErrorMessage(null);
                }}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200 cursor-pointer ${
                  mode === "register"
                    ? "bg-gradient-to-r from-rose-600 to-red-700 text-white shadow-lg shadow-rose-950/60 border border-rose-400/40"
                    : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                Create Account
              </button>
            </div>

            {mode === "forgot" && (
              <span className="text-xs font-semibold text-rose-600 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 px-2.5 py-1 rounded-lg">
                Reset Password
              </span>
            )}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3.5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-start gap-2.5 text-rose-300 text-xs animate-shake">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Login form */}
          {mode === "login" && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5 block">
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
                    className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode("forgot");
                      setForgotStep(1);
                      setErrorMessage(null);
                    }}
                    className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-500 dark:hover:text-rose-300 transition-colors cursor-pointer"
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
                    className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-2xl pl-10 pr-11 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 dark:hover:text-white p-0.5 cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={loginForm.remember}
                    onChange={(e) => setLoginForm({ ...loginForm, remember: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-white/10"
                  />
                  <span>Stay logged in for 30 days</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white font-bold text-sm shadow-xl shadow-rose-950/60 hover:from-rose-500 hover:to-red-600 hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-rose-400/30"
              >
                Sign In to Kitchen Dashboard <ArrowRight size={16} />
              </button>

              {/* Demo quick switch */}
              <div className="pt-3 border-t border-slate-200/80 dark:border-white/10 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Need a quick test login?</p>
                <button
                  type="button"
                  onClick={() => {
                    setLoginForm({
                      identifier: "chefamara@chopeasy.ng",
                      password: "Password@123",
                      remember: true,
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-xl glass-btn text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white text-xs font-semibold transition-all inline-flex items-center gap-1.5 active:scale-95"
                >
                  <Sparkles size={13} className="text-rose-500 dark:text-rose-400" />
                  Auto-fill Demo Vendor Credentials
                </button>
              </div>
            </form>
          )}

          {/* Register form (Step 1: Credentials) */}
          {mode === "register" && registerStep === 1 && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
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
                      className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
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
                      className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
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
                      className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
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
                      className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Password Input with Live Criteria Validation */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
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
                    className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
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
                            <span className="text-slate-500 dark:text-slate-400">Security Strength:</span>
                            <span className="font-bold text-slate-800 dark:text-white">{strength.label}</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
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
                <div className="mt-2.5 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-1.5">
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Password Security Criteria:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          registerPasswordRules.hasMinLen
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={registerPasswordRules.hasMinLen ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-500 dark:text-slate-400"}>
                        8+ characters
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          registerPasswordRules.hasUpper
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={registerPasswordRules.hasUpper ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-500 dark:text-slate-400"}>
                        Uppercase (A-Z)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          registerPasswordRules.hasLower
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={registerPasswordRules.hasLower ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-500 dark:text-slate-400"}>
                        Lowercase (a-z)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          registerPasswordRules.hasNumber
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={registerPasswordRules.hasNumber ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-500 dark:text-slate-400"}>
                        Number (0-9)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 col-span-2">
                      <span
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          registerPasswordRules.hasSpecial
                            ? "bg-emerald-500 text-white"
                            : "bg-slate-200 dark:bg-white/10 text-slate-400 dark:text-slate-500"
                        }`}
                      >
                        ✓
                      </span>
                      <span className={registerPasswordRules.hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-slate-500 dark:text-slate-400"}>
                        Special character (!@#$%^&*)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
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
                    className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {registerForm.confirmPassword && (
                  <p className="text-[11px] mt-1 font-medium">
                    {registerForm.password === registerForm.confirmPassword ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <Check size={12} /> Passwords match perfectly
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400">Passwords do not match yet</span>
                    )}
                  </p>
                )}
              </div>

              {/* Terms and Conditions Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-700 dark:text-slate-300 select-none">
                  <input
                    type="checkbox"
                    required
                    checked={registerForm.agreedToTerms}
                    onChange={(e) => setRegisterForm({ ...registerForm, agreedToTerms: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded text-rose-600 focus:ring-rose-500 border-slate-300 dark:border-white/20 bg-slate-100 dark:bg-white/10"
                  />
                  <span>
                    I have read and agree to the{" "}
                    <button
                      type="button"
                      onClick={() => setShowTermsModal(true)}
                      className="font-bold text-rose-600 dark:text-rose-400 hover:underline"
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
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white font-bold text-sm shadow-xl shadow-rose-950/60 hover:from-rose-500 hover:to-red-600 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-rose-400/30"
              >
                Continue to OTP Verification <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* Register OTP Verification Step (Step 2 of 2) */}
          {mode === "register" && registerStep === 2 && (
            <form onSubmit={handleRegisterOtpSubmit} className="space-y-5 animate-fade-slide-up">
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setRegisterStep(1);
                    setErrorMessage(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to details
                </button>
                <span className="text-xs font-semibold text-rose-600 dark:text-rose-300 bg-rose-500/10 dark:bg-rose-500/20 border border-rose-500/30 px-2.5 py-1 rounded-lg">
                  Step 2 of 2: Security Verification
                </span>
              </div>

              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-red-700 flex items-center justify-center mx-auto shadow-lg shadow-rose-950/60 border border-rose-400/30">
                  <ShieldCheck size={28} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  Enter 6-Digit OTP Code
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 max-w-sm mx-auto">
                  We sent a 6-digit verification code to{" "}
                  <span className="font-bold text-rose-600 dark:text-rose-300">{registerForm.email || "your registered email"}</span>. Enter the code below to activate your kitchen station.
                </p>
              </div>

              {/* 6-box OTP Input */}
              <div className="flex justify-center gap-2.5 sm:gap-3 py-2">
                {registerOtpCode.map((digit, idx) => (
                  <input
                    key={idx}
                    id={`register-otp-input-${idx}`}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleRegisterOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleRegisterOtpKeyDown(idx, e)}
                    onPaste={handleRegisterOtpPaste}
                    className="w-11 h-14 sm:w-12 sm:h-14 text-center font-mono font-black text-2xl bg-slate-50 dark:bg-white/[0.07] border border-slate-200 dark:border-white/15 rounded-2xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-white/[0.12] focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 transition-all duration-200"
                  />
                ))}
              </div>

              {/* Resend & Demo Helper */}
              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 px-1">
                <div>
                  {registerOtpTimer > 0 ? (
                    <span>Resend code in <strong className="text-rose-600 dark:text-rose-400 font-mono">{registerOtpTimer}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRegisterOtpTimer(60)}
                      className="font-bold text-rose-600 dark:text-rose-400 hover:text-rose-500 dark:hover:text-rose-300 transition-colors cursor-pointer inline-flex items-center gap-1"
                    >
                      <RefreshCw size={12} /> Resend OTP Code
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => setRegisterOtpCode(["7", "3", "5", "1", "9", "4"])}
                  className="font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  Auto-fill Demo Code (735194)
                </button>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white font-bold text-sm shadow-xl shadow-rose-950/60 hover:from-rose-500 hover:to-red-600 hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-rose-400/30"
              >
                Verify OTP & Launch Kitchen <ArrowRight size={16} />
              </button>

              <p className="text-center text-[11px] text-slate-500 dark:text-slate-400">
                🔒 Protected by End-to-End SSL Kitchen Verification
              </p>
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
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} /> Back to Sign In
                </button>
                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-mono">
                  <span>Step {forgotStep} of 3</span>
                </div>
              </div>

              {forgotSuccess ? (
                <div className="p-6 text-center space-y-3 bg-emerald-500/15 rounded-2xl border border-emerald-500/30">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50">
                    <Check size={24} />
                  </div>
                  <h3 className="font-display font-bold text-lg text-emerald-600 dark:text-emerald-300">
                    Password Reset Successfully!
                  </h3>
                  <p className="text-xs text-emerald-700/80 dark:text-emerald-400/80">
                    Your password has been changed. Signing you in automatically...
                  </p>
                </div>
              ) : (
                <>
                  {/* Step 1 */}
                  {forgotStep === 1 && (
                    <form onSubmit={handleForgotStep1} className="space-y-4">
                      <div>
                        <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                          Forgot your password?
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          Enter your registered vendor email and we will send a 6-digit verification code.
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
                          Registered Email Address
                        </label>
                        <div className="relative">
                          <Mail size={16} className="absolute left-3 top-3.5 text-slate-400" />
                          <input
                            type="email"
                            required
                            value={forgotEmail}
                            onChange={(e) => setForgotEmail(e.target.value)}
                            placeholder="chefamara@chopeasy.ng"
                            className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-2xl pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white font-bold text-sm shadow-xl shadow-rose-950/60 hover:from-rose-500 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-rose-400/30"
                      >
                        Send Verification Code <ArrowRight size={16} />
                      </button>
                    </form>
                  )}

                  {/* Step 2 */}
                  {forgotStep === 2 && (
                    <form onSubmit={handleForgotStep2} className="space-y-4">
                      <div>
                        <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                          Enter Verification Code
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          We sent a 6-digit code to{" "}
                          <span className="font-bold text-rose-600 dark:text-rose-300">{forgotEmail}</span>. Enter it below to verify.
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
                            className="w-12 h-14 text-center font-mono font-bold text-xl bg-slate-50 dark:bg-white/[0.07] border border-slate-200 dark:border-white/15 rounded-2xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-white/[0.12] focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/30 transition-all"
                          />
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                        <span>Didn't receive code?</span>
                        <button
                          type="button"
                          onClick={() => setOtpCode(["4", "8", "2", "9", "1", "6"])}
                          className="font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                        >
                          Auto-fill Demo Code (482916)
                        </button>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white font-bold text-sm shadow-xl shadow-rose-950/60 hover:from-rose-500 hover:to-red-600 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer border border-rose-400/30"
                      >
                        Verify & Proceed <ArrowRight size={16} />
                      </button>
                    </form>
                  )}

                  {/* Step 3 */}
                  {forgotStep === 3 && (
                    <form onSubmit={handleForgotStep3} className="space-y-4">
                      <div>
                        <h3 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                          Set New Password
                        </h3>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                          Ensure your new password meets all security rules to protect your kitchen orders.
                        </p>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
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
                            className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        {/* Live Criteria Checklist */}
                        <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 grid grid-cols-2 gap-1 text-[10px]">
                          <span className={newPasswordRules.hasMinLen ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-slate-500"}>
                            ✓ 8+ chars
                          </span>
                          <span className={newPasswordRules.hasUpper ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-slate-500"}>
                            ✓ Uppercase (A-Z)
                          </span>
                          <span className={newPasswordRules.hasLower ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-slate-500"}>
                            ✓ Lowercase (a-z)
                          </span>
                          <span className={newPasswordRules.hasNumber ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-slate-500"}>
                            ✓ Number (0-9)
                          </span>
                          <span className={`col-span-2 ${newPasswordRules.hasSpecial ? "text-emerald-600 dark:text-emerald-400 font-bold" : "text-slate-400 dark:text-slate-500"}`}>
                            ✓ Special char (@, $, !, %, *, #)
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 block">
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
                            className="w-full bg-slate-50 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 rounded-xl pl-9 pr-10 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-white/[0.08] focus:outline-none focus:border-rose-500 transition-all"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                          >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!isNewPasswordValid || newPassword !== confirmNewPassword}
                        className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 text-white font-bold text-sm shadow-xl shadow-rose-950/60 hover:from-rose-500 hover:to-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer border border-rose-400/30"
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
