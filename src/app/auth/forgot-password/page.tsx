"use client";

import { motion } from "framer-motion";
import { Mail, ArrowRight, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (error) throw error;
      setSubmitted(true);
      toast.success("Recovery email sent!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full text-center"
      >
        <div className="mx-auto w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(37,99,235,0.2)]">
          <Mail className="w-8 h-8 text-blue-400" />
        </div>
        <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Check your email</h1>
        <p className="text-zinc-400 text-sm mb-8 max-w-[280px] mx-auto">
          We sent a password reset link to <span className="text-zinc-200 font-medium">{email}</span>
        </p>
        <Link 
          href="/auth/login"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#1a2236] hover:bg-[#1e2a42] text-white font-medium text-sm transition-all duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to log in
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      <div className="mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1a2236] to-[#0d1421] border border-[#1e2d40] flex items-center justify-center mb-6">
          <KeyRound className="w-6 h-6 text-blue-400" />
        </div>
        <h1 className="text-3xl font-semibold text-white tracking-tight mb-2">Forgot password?</h1>
        <p className="text-zinc-400 text-sm">No worries, we'll send you reset instructions.</p>
      </div>

      <form onSubmit={handleReset} className="space-y-6">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-zinc-300">Email Address</label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-zinc-500 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#0d1421] border border-[#1e2d40] text-white placeholder:text-zinc-600 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all shadow-inner shadow-black/20"
              placeholder="you@company.com"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium px-4 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] disabled:opacity-50 disabled:shadow-none"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Reset Password"}
        </button>
      </form>

      <div className="mt-8">
        <Link 
          href="/auth/login"
          className="inline-flex items-center justify-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to log in
        </Link>
      </div>
    </motion.div>
  );
}
