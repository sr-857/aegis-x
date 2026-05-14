"use client";
import { usePageTitle } from "@/lib/hooks/use-page-title";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "@/lib/stores/auth-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Shield, Eye, EyeOff, KeyRound, User, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  usePageTitle("Authentication");
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/executive");
    }
  }, [isAuthenticated, router]);

  const [operatorId, setOperatorId] = useState("");
  const [clearanceKey, setClearanceKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({ operatorId: false, clearanceKey: false });
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  useEffect(() => {
    setRememberMe(localStorage.getItem("aegis-remember") === "true");
  }, []);
  const login = useAuthStore((s) => s.login);
  const idRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({ operatorId: false, clearanceKey: false });

    const errors = {
      operatorId: !operatorId.trim(),
      clearanceKey: !clearanceKey.trim(),
    };

    if (errors.operatorId || errors.clearanceKey) {
      setFieldErrors(errors);
      setError("All clearance fields are required.");
      if (errors.operatorId) idRef.current?.focus();
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    if (clearanceKey.length < 4) {
      setError("Invalid clearance credentials. Key must be 4+ characters.");
      setFieldErrors({ operatorId: false, clearanceKey: true });
      setLoading(false);
      return;
    }

    if (rememberMe) {
      localStorage.setItem("aegis-remember", "true");
    } else {
      localStorage.removeItem("aegis-remember");
    }
    login(operatorId.trim(), clearanceKey);
    router.push("/executive");
  };

  return (
    <div className="min-h-screen flex bg-[#0a0a0a]">
      <div className="hidden lg:flex w-1/2 relative overflow-hidden items-center justify-center bg-[#0e0e0e]">
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, rgba(242,202,80,1) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]">
          <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 text-center max-w-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Shield className="w-16 h-16 text-primary mx-auto mb-6" />
          </motion.div>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl font-semibold text-on-surface mb-3 tracking-tight"
          >
            AEGIS
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-on-surface-variant/60 text-sm leading-relaxed"
          >
            Reconnaissance Intelligence Suite
            <br />
            Attack Surface & Vulnerability Intelligence Platform
          </motion.p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, rgba(242,202,80,1) 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm relative z-10"
        >
          <div className="mb-8 lg:hidden text-center">
            <Shield className="w-10 h-10 text-primary mx-auto mb-3" />
            <h1 className="text-xl font-semibold text-on-surface">AEGIS</h1>
            <p className="text-xs text-on-surface-variant/60 mt-1">
              Reconnaissance Intelligence Suite
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-headline-sm text-on-surface mb-1">
              Operator Authentication
            </h2>
            <p className="text-body-sm text-on-surface-variant/60">
              Enter your credentials to access the platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="block text-xs font-medium text-on-surface-variant/80 mb-2 uppercase tracking-wider" htmlFor="operatorId">
                Operator ID
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                <Input
                  ref={idRef}
                  id="operatorId"
                  type="text"
                  value={operatorId}
                  onChange={(e) => { setOperatorId(e.target.value); setFieldErrors((p) => ({ ...p, operatorId: false })); }}
                  placeholder="Enter operator ID"
                  className={`pl-10 transition-all duration-300 ${fieldErrors.operatorId ? "border-destructive ring-1 ring-destructive/30" : ""}`}
                  aria-invalid={fieldErrors.operatorId}
                  disabled={loading}
                />
              </div>
              <AnimatePresence>
                {fieldErrors.operatorId && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 mt-1.5 text-xs text-destructive"
                  >
                    <AlertCircle className="w-3 h-3" />
                    Operator ID is required
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div>
              <label className="block text-xs font-medium text-on-surface-variant/80 mb-2 uppercase tracking-wider" htmlFor="clearanceKey">
                Clearance Key
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant/40" />
                <Input
                  id="clearanceKey"
                  type={showKey ? "text" : "password"}
                  value={clearanceKey}
                  onChange={(e) => { setClearanceKey(e.target.value); setFieldErrors((p) => ({ ...p, clearanceKey: false })); }}
                  placeholder="Enter clearance key"
                  className={`pl-10 pr-10 transition-all duration-300 ${fieldErrors.clearanceKey ? "border-destructive ring-1 ring-destructive/30" : ""}`}
                  aria-invalid={fieldErrors.clearanceKey}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/40 hover:text-primary transition-colors"
                  tabIndex={-1}
                  aria-label={showKey ? "Hide clearance key" : "Show clearance key"}
                >
                  {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <AnimatePresence>
                {fieldErrors.clearanceKey && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-1 mt-1.5 text-xs text-destructive"
                  >
                    <AlertCircle className="w-3 h-3" />
                    Clearance key is required
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-outline-variant bg-[#0e0e0e] text-primary focus:ring-primary/30"
                disabled={loading}
              />
              <span className="text-xs text-on-surface-variant/60">
                Maintain session persistence
              </span>
            </label>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded px-3 py-2 flex items-center gap-2"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <Button type="submit" className="w-full relative" disabled={loading}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Authenticating...
                </span>
              ) : (
                "Authenticate"
              )}
            </Button>

            <p className="text-center text-xs text-on-surface-variant/40">
              Authorized personnel only. All access is monitored and logged.
            </p>

            <div className="pt-4 border-t border-outline-variant/10">
              <p className="text-[10px] text-center text-on-surface-variant/30">
                Demo: enter any Operator ID with a 4+ character Clearance Key
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
